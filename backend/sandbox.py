"""
DSA Quest Security Sandbox
Ensures Python code executed by learners is secure, isolated, and safe.
Provides standard LeetCode data structure definitions (ListNode, TreeNode).
"""

import ast
import builtins
import collections
import heapq
import bisect
import math
from typing import Set, Any, Optional

FORBIDDEN_MODULES: Set[str] = {
    "os", "sys", "subprocess", "shutil", "socket", "http", "urllib",
    "requests", "posix", "nt", "_thread", "threading", "multiprocessing",
    "importlib", "builtins", "signal", "ctypes", "pty", "commands",
    "fcntl", "termios"
}

FORBIDDEN_CALLS: Set[str] = {
    "exec", "eval", "compile", "open", "input", "globals", "locals",
    "getattr", "setattr", "delattr", "__import__", "memoryview"
}

class SecurityError(Exception):
    pass

class CodeValidator(ast.NodeVisitor):
    def __init__(self):
        self.errors = []

    def visit_Import(self, node: ast.Import):
        for alias in node.names:
            base_module = alias.name.split('.')[0]
            if base_module in FORBIDDEN_MODULES:
                self.errors.append(f"Importing '{base_module}' is restricted in the DSA Quest sandbox.")
        self.generic_visit(node)

    def visit_ImportFrom(self, node: ast.ImportFrom):
        if node.module:
            base_module = node.module.split('.')[0]
            if base_module in FORBIDDEN_MODULES:
                self.errors.append(f"Importing from '{base_module}' is restricted in the DSA Quest sandbox.")
        self.generic_visit(node)

    def visit_Call(self, node: ast.Call):
        if isinstance(node.func, ast.Name) and node.func.id in FORBIDDEN_CALLS:
            self.errors.append(f"Calling '{node.func.id}()' is not permitted in DSA sandbox.")
        self.generic_visit(node)

def validate_code_safety(code: str) -> None:
    """Parses AST to verify code safety before execution."""
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        raise SecurityError(f"Syntax Error: {e.msg} at line {e.lineno}")
    
    validator = CodeValidator()
    validator.visit(tree)
    if validator.errors:
        raise SecurityError("; ".join(validator.errors))

# Standard DSA Helper Classes
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __repr__(self):
        return f"ListNode({self.val})"

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

    def __repr__(self):
        return f"TreeNode({self.val})"

def get_safe_globals() -> dict:
    """Returns restricted global namespace with standard data structure utilities."""
    safe_builtins = {
        k: v for k, v in builtins.__dict__.items()
        if k not in FORBIDDEN_CALLS and not k.startswith("__")
    }
    return {
        "__builtins__": safe_builtins,
        "math": math,
        "collections": collections,
        "heapq": heapq,
        "bisect": bisect,
        "deque": collections.deque,
        "defaultdict": collections.defaultdict,
        "Counter": collections.Counter,
        "ListNode": ListNode,
        "TreeNode": TreeNode,
        "List": list,
        "Dict": dict,
        "Set": set,
        "Tuple": tuple,
        "Optional": Optional,
        "Any": Any,
    }
