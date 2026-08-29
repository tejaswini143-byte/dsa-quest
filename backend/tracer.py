"""
DSA Quest Real Python Runtime & Execution Tracer
Authoritative Python Tracer utilizing sys.settrace to record 100% real line-by-line execution,
variable mutations, call stacks, stdout, runtime errors, and semantic event extraction.
"""

import sys
import copy
import time
import io
import json
import inspect
import ast
import argparse
from typing import Dict, Any, List, Optional, Set
from sandbox import validate_code_safety, get_safe_globals, SecurityError, ListNode, TreeNode

MAX_STEPS = 500
MAX_EXECUTION_TIME_SECONDS = 3.0

class StdoutInterceptor(io.StringIO):
    def __init__(self):
        super().__init__()
        self.history = []

    def write(self, s: str):
        super().write(s)
        if s:
            self.history.append(s)

class RealPythonTracer:
    def __init__(self, source_code: str, test_input: Any = None, entry_method: Optional[str] = None):
        self.source_code = source_code
        self.source_lines = source_code.splitlines()
        self.test_input = test_input
        self.entry_method = entry_method
        
        self.steps: List[Dict[str, Any]] = []
        self.previous_vars: Dict[str, Any] = {}
        self.call_stack: List[Dict[str, Any]] = []
        self.start_time = time.time()
        self.step_count = 0
        self.detected_structures: Set[str] = set()
        self.runtime_error: Optional[str] = None
        self.stdout_interceptor = StdoutInterceptor()

    def serialize_value(self, val: Any, depth: int = 0) -> Any:
        if depth > 4:
            return str(val)
        if isinstance(val, (int, float, str, bool)) or val is None:
            return val
        if isinstance(val, (list, tuple)):
            return [self.serialize_value(x, depth + 1) for x in val[:50]]
        if isinstance(val, set):
            return [self.serialize_value(x, depth + 1) for x in list(val)[:50]]
        if isinstance(val, dict):
            return {str(k): self.serialize_value(v, depth + 1) for k, v in list(val.items())[:50]}
        if isinstance(val, ListNode):
            return {"__type__": "ListNode", "val": val.val, "has_next": val.next is not None}
        if isinstance(val, TreeNode):
            return {"__type__": "TreeNode", "val": val.val, "has_left": val.left is not None, "has_right": val.right is not None}
        if hasattr(val, '__dict__'):
            return {k: self.serialize_value(v, depth + 1) for k, v in list(val.__dict__.items())[:20] if not k.startswith('_')}
        return str(val)

    def extract_linked_list(self, head_node: Any) -> List[Dict[str, Any]]:
        nodes = []
        curr = head_node
        visited = set()
        idx = 0
        while curr and isinstance(curr, ListNode) and idx < 30:
            node_id = id(curr)
            if node_id in visited:
                break
            visited.add(node_id)
            nodes.append({
                "val": curr.val,
                "nextIndex": idx + 1 if curr.next else None,
                "isHead": idx == 0
            })
            curr = curr.next
            idx += 1
        return nodes

    def extract_tree_nodes(self, root_node: Any) -> List[Dict[str, Any]]:
        if not root_node or not isinstance(root_node, TreeNode):
            return []
        nodes = []
        queue = [(root_node, "root")]
        visited = set()
        while queue and len(nodes) < 30:
            curr, nid = queue.pop(0)
            if id(curr) in visited:
                continue
            visited.add(id(curr))
            left_id = f"{nid}_L" if curr.left else None
            right_id = f"{nid}_R" if curr.right else None
            nodes.append({
                "id": nid,
                "val": curr.val,
                "leftId": left_id,
                "rightId": right_id
            })
            if curr.left:
                queue.append((curr.left, left_id))
            if curr.right:
                queue.append((curr.right, right_id))
        return nodes

    def compute_variable_diffs(self, current: Dict[str, Any], previous: Dict[str, Any]) -> List[Dict[str, Any]]:
        diffs = []
        all_keys = set(current.keys()) | set(previous.keys())
        for k in all_keys:
            if k not in previous:
                diffs.append({"type": "ADDED", "name": k, "before": None, "after": current[k]})
            elif k not in current:
                diffs.append({"type": "REMOVED", "name": k, "before": previous[k], "after": None})
            elif current[k] != previous[k]:
                diffs.append({"type": "CHANGED", "name": k, "before": previous[k], "after": current[k]})
        return diffs

    def trace_callback(self, frame, event, arg):
        if time.time() - self.start_time > MAX_EXECUTION_TIME_SECONDS:
            raise TimeoutError("Execution timed out (maximum 3.0 seconds safety limit).")

        if self.step_count >= MAX_STEPS:
            return None

        # Filter out stdlib frames
        filename = frame.f_code.co_filename
        if filename != "<string>" and not filename.endswith("submission.py") and not filename.endswith("code.py"):
            return self.trace_callback

        lineno = frame.f_lineno
        if lineno <= 0 or lineno > len(self.source_lines):
            return self.trace_callback

        line_str = self.source_lines[lineno - 1] if lineno <= len(self.source_lines) else ""
        current_stdout = self.stdout_interceptor.getvalue()

        if event == 'call':
            fn_name = frame.f_code.co_name
            if fn_name != "<module>":
                args = {k: self.serialize_value(frame.f_locals.get(k)) for k in frame.f_code.co_varnames[:frame.f_code.co_argcount]}
                self.call_stack.append({"fnName": fn_name, "args": args, "line": lineno})
                if len(self.call_stack) > 1:
                    self.detected_structures.add("recursion")
            return self.trace_callback

        elif event == 'return':
            if self.call_stack:
                popped = self.call_stack.pop()
                popped["returnValue"] = self.serialize_value(arg)
            return self.trace_callback

        elif event == 'exception':
            exc_type, exc_value, _ = arg
            self.runtime_error = f"{exc_type.__name__}: {str(exc_value)}"
        elif event == 'line':
            IGNORED_NAMES = {
                'math', 'collections', 'heapq', 'bisect', 'deque', 'defaultdict', 
                'Counter', 'ListNode', 'TreeNode', 'List', 'Dict', 'Set', 'Tuple', 
                'Optional', 'Any', '__builtins__', '__doc__', '__name__', '__package__', 'sys'
            }

            raw_locals = frame.f_locals
            filtered_vars = {
                k: self.serialize_value(v)
                for k, v in raw_locals.items()
                if k not in IGNORED_NAMES and not k.startswith('_') and not callable(v) and k != 'self' and not inspect.ismodule(v) and not inspect.isclass(v)
            }

            diffs = self.compute_variable_diffs(filtered_vars, self.previous_vars)
            changed_names = [d["name"] for d in diffs]

            # Build memory snapshots
            memory = {
                "arrays": {},
                "hashMaps": {},
                "hashSets": {},
                "stacks": {},
                "queues": {},
                "grids": None,
                "pointers": {},
                "dpTable": None,
                "linkedLists": {},
                "trees": {},
                "graphs": {},
                "heaps": {},
                "callStack": copy.deepcopy(self.call_stack)
            }

            for k, raw_v in raw_locals.items():
                if k.startswith('_') or callable(raw_v) or k == 'self':
                    continue

                v = filtered_vars.get(k)

                if isinstance(raw_v, ListNode):
                    self.detected_structures.add("linked_list")
                    memory["linkedLists"][k] = self.extract_linked_list(raw_v)
                elif isinstance(raw_v, TreeNode):
                    self.detected_structures.add("tree")
                    memory["trees"][k] = self.extract_tree_nodes(raw_v)
                elif isinstance(v, list):
                    if len(v) > 0 and isinstance(v[0], list):
                        self.detected_structures.add("grid")
                        memory["grids"] = v
                    elif "stack" in k.lower():
                        self.detected_structures.add("stack")
                        memory["stacks"][k] = v
                    elif "queue" in k.lower() or "deque" in k.lower():
                        self.detected_structures.add("queue")
                        memory["queues"][k] = v
                    elif "dp" in k.lower() or "memo" in k.lower() or "table" in k.lower():
                        self.detected_structures.add("dp_table")
                        memory["dpTable"] = v
                    elif "heap" in k.lower() or "pq" in k.lower():
                        self.detected_structures.add("heap")
                        memory["heaps"][k] = v
                    else:
                        self.detected_structures.add("array")
                        memory["arrays"][k] = v
                elif isinstance(v, dict):
                    if "graph" in k.lower() or "adj" in k.lower():
                        self.detected_structures.add("graph")
                    else:
                        self.detected_structures.add("hash_map")
                    memory["hashMaps"][k] = v
                elif isinstance(raw_v, set):
                    self.detected_structures.add("hash_set")
                    memory["hashSets"][k] = list(v) if isinstance(v, list) else []
                elif isinstance(v, int) and (k in ["i", "j", "left", "right", "mid", "low", "high", "p1", "p2", "l", "r", "idx", "curr", "prev", "slow", "fast"]):
                    self.detected_structures.add("pointer")
                    memory["pointers"][k] = v

            # Generate Semantic Events
            semantic_events = []
            for d in diffs:
                if d["type"] == "ADDED":
                    semantic_events.append({
                        "type": "ASSIGNMENT",
                        "target": d["name"],
                        "payload": {"value": d["after"]},
                        "description": f"Initialized variable {d['name']} = {d['after']}"
                    })
                elif d["type"] == "CHANGED":
                    semantic_events.append({
                        "type": "VARIABLE_CHANGE",
                        "target": d["name"],
                        "payload": {"before": d["before"], "after": d["after"]},
                        "description": f"Updated {d['name']}: {d['before']} → {d['after']}"
                    })

            # Detect loop / condition heuristics
            stripped = line_str.strip()
            if stripped.startswith("for ") or stripped.startswith("while "):
                semantic_events.append({
                    "type": "LOOP_ITERATION",
                    "target": "loop",
                    "payload": {"line": stripped},
                    "description": f"Loop iteration at line {lineno}: {stripped}"
                })
            elif stripped.startswith("if ") or stripped.startswith("elif "):
                semantic_events.append({
                    "type": "COMPARISON",
                    "target": "branch",
                    "payload": {"condition": stripped},
                    "description": f"Evaluating condition: {stripped}"
                })

            what_happened = f"Line {lineno}: {stripped}"
            why = "Program step in control flow."
            if diffs:
                what_changed = ", ".join([f"{d['name']}: {d['before']} → {d['after']}" for d in diffs])
            else:
                what_changed = "No variables modified on this step."

            self.step_count += 1
            self.steps.append({
                "stepNumber": self.step_count,
                "line": lineno,
                "codeLine": line_str,
                "variables": filtered_vars,
                "previousVariables": copy.deepcopy(self.previous_vars),
                "changedVariables": changed_names,
                "memory": memory,
                "events": semantic_events,
                "stdout": current_stdout,
                "explanation": {
                    "whatHappened": what_happened,
                    "whyItHappened": why,
                    "whatChanged": what_changed
                }
            })

            self.previous_vars = copy.deepcopy(filtered_vars)
            return self.trace_callback

        return self.trace_callback


def execute_and_trace(code: str, test_input: Any = None, entry_func: Optional[str] = None) -> Dict[str, Any]:
    """
    Executes ANY user Python code securely and returns a structured ExecutionTrace.
    """
    try:
        validate_code_safety(code)
    except SecurityError as sec_err:
        return {
            "success": False,
            "totalSteps": 0,
            "steps": [],
            "output": None,
            "stdout": "",
            "error": str(sec_err),
            "detectedStructures": ["generic"],
            "metrics": {"operationsCount": 0, "memoryPeak": 0}
        }

    tracer = RealPythonTracer(code, test_input, entry_func)
    safe_env = get_safe_globals()
    output_result = None

    old_stdout = sys.stdout
    sys.stdout = tracer.stdout_interceptor

    try:
        compiled = compile(code, "<string>", "exec")
        old_trace = sys.gettrace()
        sys.settrace(tracer.trace_callback)
        try:
            exec(compiled, safe_env)

            # Auto-handle LeetCode `class Solution:` if present
            if "Solution" in safe_env and inspect.isclass(safe_env["Solution"]):
                sol_instance = safe_env["Solution"]()
                methods = [m for m in dir(sol_instance) if not m.startswith('_') and callable(getattr(sol_instance, m))]
                if methods:
                    target_method = getattr(sol_instance, entry_func) if entry_func and hasattr(sol_instance, entry_func) else getattr(sol_instance, methods[0])
                    if isinstance(test_input, dict):
                        output_result = target_method(**test_input)
                    elif isinstance(test_input, (list, tuple)):
                        output_result = target_method(*test_input)
                    elif test_input is not None:
                        output_result = target_method(test_input)
                    else:
                        # Try executing with default inspection if arg count == 0
                        output_result = target_method()

            elif entry_func and entry_func in safe_env and callable(safe_env[entry_func]):
                fn = safe_env[entry_func]
                if isinstance(test_input, dict):
                    output_result = fn(**test_input)
                elif isinstance(test_input, (list, tuple)):
                    output_result = fn(*test_input)
                elif test_input is not None:
                    output_result = fn(test_input)
                else:
                    output_result = fn()

        finally:
            sys.settrace(old_trace)
            sys.stdout = old_stdout

        structures = list(tracer.detected_structures)
        if not structures:
            structures = ["generic"]

        full_stdout = tracer.stdout_interceptor.getvalue()

        return {
            "success": True,
            "totalSteps": len(tracer.steps),
            "steps": tracer.steps,
            "output": tracer.serialize_value(output_result),
            "stdout": full_stdout,
            "error": tracer.runtime_error,
            "detectedStructures": structures,
            "metrics": {
                "operationsCount": len(tracer.steps),
                "memoryPeak": sys.getsizeof(tracer.steps)
            }
        }
    except Exception as e:
        sys.stdout = old_stdout
        return {
            "success": False,
            "totalSteps": len(tracer.steps),
            "steps": tracer.steps,
            "output": None,
            "stdout": tracer.stdout_interceptor.getvalue(),
            "error": f"{type(e).__name__}: {str(e)}",
            "detectedStructures": ["generic"],
            "metrics": {
                "operationsCount": len(tracer.steps),
                "memoryPeak": 0
            }
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DSA Quest Real Python Runtime & Tracer CLI")
    parser.add_argument("--code", type=str, help="Python source code to execute")
    parser.add_argument("--input", type=str, default=None, help="JSON serialized test input")
    parser.add_argument("--entry", type=str, default=None, help="Entry function or Solution method name")
    parser.add_argument("--json", action="store_true", help="Read JSON request payload from stdin")

    args = parser.parse_args()

    if args.json:
        try:
            payload = json.loads(sys.stdin.read())
            code_input = payload.get("code", "")
            test_inp = payload.get("input", None)
            entry = payload.get("entry", None)
            res = execute_and_trace(code_input, test_inp, entry)
            print(json.dumps(res))
        except Exception as err:
            print(json.dumps({"success": False, "error": str(err), "steps": []}))
    elif args.code:
        test_inp = json.loads(args.input) if args.input else None
        res = execute_and_trace(args.code, test_inp, args.entry)
        print(json.dumps(res))
    else:
        print(json.dumps({"success": False, "error": "No code provided", "steps": []}))
