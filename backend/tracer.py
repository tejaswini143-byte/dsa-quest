"""
DSA Quest Universal Python Execution & Trace Engine
Instruments and records step-by-step memory, variable diffs, semantic events, and call stacks.
"""

import sys
import copy
import json
import time
from typing import Dict, Any, List, Optional
from sandbox import validate_code_safety, get_safe_globals, SecurityError

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
        self.events: List[Dict[str, Any]] = []

    def serialize_value(self, val: Any, depth: int = 0) -> Any:
        if depth > 4:
            return str(val)
        if isinstance(val, (int, float, str, bool)) or val is None:
            return val
        if isinstance(val, list):
            return [self.serialize_value(x, depth + 1) for x in val[:50]]
        if isinstance(val, tuple):
            return [self.serialize_value(x, depth + 1) for x in val[:50]]
        if isinstance(val, set):
            return list(val)[:50]
        if isinstance(val, dict):
            return {str(k): self.serialize_value(v, depth + 1) for k, v in list(val.items())[:50]}
        if hasattr(val, '__dict__'):
            return {k: self.serialize_value(v, depth + 1) for k, v in list(val.__dict__.items())[:20]}
        return str(val)

    def detect_semantic_events(self, curr_vars: Dict[str, Any], prev_vars: Dict[str, Any], line_str: str) -> List[Dict[str, Any]]:
        events = []
        # Check for stack pushes / pops
        for name, curr_val in curr_vars.items():
            prev_val = prev_vars.get(name)
            if isinstance(curr_val, list) and isinstance(prev_val, list):
                if len(curr_val) > len(prev_val):
                    events.append({
                        "type": "STACK_PUSH" if "stack" in name.lower() else "ARRAY_UPDATE",
                        "target": name,
                        "payload": {"value": curr_val[-1], "index": len(curr_val) - 1},
                        "description": f"Added {curr_val[-1]} to {name}"
                    })
                elif len(curr_val) < len(prev_val):
                    events.append({
                        "type": "STACK_POP" if "stack" in name.lower() else "ARRAY_UPDATE",
                        "target": name,
                        "payload": {"poppedIndex": len(prev_val) - 1},
                        "description": f"Popped top element from {name}"
                    })
            elif isinstance(curr_val, dict) and isinstance(prev_val, dict):
                new_keys = set(curr_val.keys()) - set(prev_val.keys())
                for k in new_keys:
                    events.append({
                        "type": "HASH_INSERT",
                        "target": name,
                        "payload": {"key": k, "value": curr_val[k]},
                        "description": f"Stored {k} -> {curr_val[k]} in {name}"
                    })
        
        # Line text heuristics for array access & comparisons
        if " in " in line_str and "if " in line_str:
            events.append({
                "type": "HASH_LOOKUP",
                "target": "hash_map",
                "payload": {"query": line_str.strip()},
                "description": f"Checked membership condition: '{line_str.strip()}'"
            })
        return events

    def trace_callback(self, frame, event, arg):
        if time.time() - self.start_time > MAX_EXECUTION_TIME_SECONDS:
            raise TimeoutError("Execution timed out (maximum 3.0 seconds limit).")
        
        if self.step_count >= MAX_STEPS:
            return None

        # Filter out library / internal frames
        filename = frame.f_code.co_filename
        if filename != "<string>" and not filename.endswith("submission.py"):
            return self.trace_callback

        lineno = frame.f_lineno
        if lineno <= 0 or lineno > len(self.source_lines):
            return self.trace_callback

        line_str = self.source_lines[lineno - 1] if lineno <= len(self.source_lines) else ""
        
        if event == 'call':
            fn_name = frame.f_code.co_name
            args = {k: self.serialize_value(frame.f_locals.get(k)) for k in frame.f_code.co_varnames[:frame.f_code.co_argcount]}
            self.call_stack.append({"fnName": fn_name, "args": args, "line": lineno})
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
                if not k.startswith('_') and not callable(v)
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
                "stacks": {},
                "grids": None,
                "pointers": {},
                "dpTable": None,
                "callStack": copy.deepcopy(self.call_stack)
            }

            for k, v in filtered_vars.items():
                if isinstance(v, list):
                    if len(v) > 0 and isinstance(v[0], list):
                        memory["grids"] = v
                    elif "stack" in k.lower():
                        memory["stacks"][k] = v
                    elif "dp" in k.lower() or "memo" in k.lower() or "table" in k.lower():
                        memory["dpTable"] = v
                    else:
                        memory["arrays"][k] = v
                elif isinstance(v, dict):
                    memory["hashMaps"][k] = v
                elif isinstance(v, int) and (k in ["i", "j", "left", "right", "mid", "low", "high", "p1", "p2", "l", "r", "idx", "curr"]):
                    memory["pointers"][k] = v

            events = self.detect_semantic_events(filtered_vars, self.previous_vars, line_str)

            what_happened = f"Executed line {lineno}: {line_str.strip()}"
            why = "Algorithm progresses to evaluate the current statement."
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
    Executes user Python code securely and returns a step-by-step ExecutionTrace.
    """
    validate_code_safety(code)
    collector = TraceCollector(code)
    safe_env = get_safe_globals()
    output_result = None

    try:
        compiled = compile(code, "<string>", "exec")
        # Set tracer
        old_trace = sys.gettrace()
        sys.settrace(collector.trace_callback)
        try:
            exec(compiled, safe_env)
            # If an entry function is specified, invoke it with the test input
            if entry_func and entry_func in safe_env:
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

        return {
            "success": True,
            "totalSteps": len(collector.steps),
            "steps": collector.steps,
            "output": collector.serialize_value(output_result),
            "metrics": {
                "operationsCount": len(collector.steps),
                "memoryPeak": sys.getsizeof(collector.steps)
            }
        }
    except Exception as e:
        return {
            "success": False,
            "totalSteps": len(collector.steps),
            "steps": collector.steps,
            "output": None,
            "error": f"{type(e).__name__}: {str(e)}",
            "metrics": {
                "operationsCount": len(collector.steps),
                "memoryPeak": 0
            }
        }
