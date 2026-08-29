"""
DSA Quest Universal Python Execution & Trace Engine
Instruments and records step-by-step memory, variable diffs, semantic events, and call stacks.
Works with ANY arbitrary DSA Python program or LeetCode Solution class.
"""

import sys
import copy
import time
import io
import inspect
from typing import Dict, Any, List, Optional, Set
from sandbox import validate_code_safety, get_safe_globals, SecurityError, ListNode, TreeNode

MAX_STEPS = 500
MAX_EXECUTION_TIME_SECONDS = 3.0

class TraceCollector:
    def __init__(self, source_code: str):
        self.source_lines = source_code.splitlines()
        self.steps: List[Dict[str, Any]] = []
        self.previous_vars: Dict[str, Any] = {}
        self.start_time = time.time()
        self.step_count = 0
        self.call_stack: List[Dict[str, Any]] = []
        self.error: Optional[str] = None
        self.stdout_buffer = io.StringIO()
        self.detected_structures: Set[str] = set()

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

    def detect_semantic_events(self, curr_vars: Dict[str, Any], prev_vars: Dict[str, Any], line_str: str) -> List[Dict[str, Any]]:
        events = []
        # Compare variable mutations
        for name, curr_val in curr_vars.items():
            prev_val = prev_vars.get(name)

            # Stack / Queue / Array updates
            if isinstance(curr_val, list) and isinstance(prev_val, list):
                if len(curr_val) > len(prev_val):
                    event_type = "STACK_PUSH" if "stack" in name.lower() else "QUEUE_ENQUEUE" if "queue" in name.lower() else "ARRAY_UPDATE"
                    events.append({
                        "type": event_type,
                        "target": name,
                        "payload": {"value": curr_val[-1], "index": len(curr_val) - 1},
                        "description": f"Added {curr_val[-1]} to {name}"
                    })
                    if "stack" in name.lower(): self.detected_structures.add("stack")
                    elif "queue" in name.lower(): self.detected_structures.add("queue")
                    else: self.detected_structures.add("array")
                elif len(curr_val) < len(prev_val):
                    event_type = "STACK_POP" if "stack" in name.lower() else "QUEUE_DEQUEUE" if "queue" in name.lower() else "ARRAY_UPDATE"
                    events.append({
                        "type": event_type,
                        "target": name,
                        "payload": {"poppedIndex": len(prev_val) - 1},
                        "description": f"Removed top item from {name}"
                    })

            # Hash Map insertions
            elif isinstance(curr_val, dict) and isinstance(prev_val, dict):
                self.detected_structures.add("hash_map")
                new_keys = set(curr_val.keys()) - set(prev_val.keys())
                for k in new_keys:
                    events.append({
                        "type": "HASH_INSERT",
                        "target": name,
                        "payload": {"key": k, "value": curr_val[k]},
                        "description": f"Stored {k} -> {curr_val[k]} in {name}"
                    })

        # Line text heuristics for condition lookups
        stripped = line_str.strip()
        if " in " in stripped and "if " in stripped:
            events.append({
                "type": "HASH_LOOKUP",
                "target": "lookup",
                "payload": {"condition": stripped},
                "description": f"Checked membership condition: '{stripped}'"
            })
            self.detected_structures.add("hash_map")
        
        if "while " in stripped or "for " in stripped:
            events.append({
                "type": "LOOP_ITERATION",
                "target": "loop",
                "payload": {"line": stripped},
                "description": f"Evaluating loop condition: {stripped}"
            })

        return events

    def trace_callback(self, frame, event, arg):
        if time.time() - self.start_time > MAX_EXECUTION_TIME_SECONDS:
            raise TimeoutError("Execution timed out (maximum 3.0 seconds limit).")
        
        if self.step_count >= MAX_STEPS:
            return None

        # Filter out internal library frames
        filename = frame.f_code.co_filename
        if filename != "<string>" and not filename.endswith("submission.py") and not filename.endswith("code.py"):
            return self.trace_callback

        lineno = frame.f_lineno
        if lineno <= 0 or lineno > len(self.source_lines):
            return self.trace_callback

        line_str = self.source_lines[lineno - 1] if lineno <= len(self.source_lines) else ""
        
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
                self.call_stack.pop()
            return self.trace_callback

        elif event == 'line':
            raw_locals = frame.f_locals
            filtered_vars = {
                k: self.serialize_value(v)
                for k, v in raw_locals.items()
                if not k.startswith('_') and not callable(v) and k != 'self'
            }

            # Find changed variables
            changed = []
            for k, v in filtered_vars.items():
                if k not in self.previous_vars or self.previous_vars[k] != v:
                    changed.append(k)

            # Structure memory models
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

            events = self.detect_semantic_events(filtered_vars, self.previous_vars, line_str)

            what_happened = f"Executed line {lineno}: {line_str.strip()}"
            why = "Algorithm executes step in program control flow."
            if changed:
                what_changed = f"Updated: {', '.join([f'{c} = {filtered_vars[c]}' for c in changed])}"
            else:
                what_changed = "No variables modified on this step."

            self.step_count += 1
            self.steps.append({
                "stepNumber": self.step_count,
                "line": lineno,
                "codeLine": line_str,
                "variables": filtered_vars,
                "changedVariables": changed,
                "memory": memory,
                "events": events,
                "explanation": {
                    "whatHappened": what_happened,
                    "whyItHappened": why,
                    "whatChanged": what_changed
                }
            })

            self.previous_vars = copy.deepcopy(filtered_vars)
            return self.trace_callback

        return self.trace_callback


def execute_and_trace(code: str, test_input: Any = None, entry_func: str = None) -> Dict[str, Any]:
    """
    Executes ANY user Python code securely and returns a step-by-step ExecutionTrace.
    Supports standalone scripts and LeetCode class Solution: methods.
    """
    validate_code_safety(code)
    collector = TraceCollector(code)
    safe_env = get_safe_globals()
    output_result = None

    # Redirect stdout
    old_stdout = sys.stdout
    captured_stdout = io.StringIO()
    sys.stdout = captured_stdout

    try:
        compiled = compile(code, "<string>", "exec")
        old_trace = sys.gettrace()
        sys.settrace(collector.trace_callback)
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

            # Or invocation of specific entry function if specified
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

        # If no structures were explicitly tagged, default to generic
        structures = list(collector.detected_structures)
        if not structures:
            structures = ["generic"]

        full_stdout = captured_stdout.getvalue()

        return {
            "success": True,
            "totalSteps": len(collector.steps),
            "steps": collector.steps,
            "output": collector.serialize_value(output_result),
            "stdout": full_stdout,
            "detectedStructures": structures,
            "metrics": {
                "operationsCount": len(collector.steps),
                "memoryPeak": sys.getsizeof(collector.steps)
            }
        }
    except Exception as e:
        sys.stdout = old_stdout
        return {
            "success": False,
            "totalSteps": len(collector.steps),
            "steps": collector.steps,
            "output": None,
            "stdout": captured_stdout.getvalue(),
            "error": f"{type(e).__name__}: {str(e)}",
            "detectedStructures": ["generic"],
            "metrics": {
                "operationsCount": len(collector.steps),
                "memoryPeak": 0
            }
        }
