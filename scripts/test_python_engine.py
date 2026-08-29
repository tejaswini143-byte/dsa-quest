import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
import tracer

tests = [
    ("TEST 1: Variables", "x = 10\ny = 20\nz = x + y\nprint(z)"),
    ("TEST 2: Loop Accumulator", "total = 0\nfor i in range(5):\n    total += i\nprint(total)"),
    ("TEST 3: Functions", "def add(a, b):\n    return a + b\nprint(add(5, 7))"),
    ("TEST 4: Recursion", "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\nprint(factorial(4))"),
    ("TEST 5: Array Max", "numbers = [5, 2, 8, 1]\nlargest = numbers[0]\nfor n in numbers:\n    if n > largest: largest = n\nprint(largest)"),
    ("TEST 6: Stack Operations", "stack = []\nstack.append(10)\nstack.append(20)\nx = stack.pop()\nprint(x)"),
    ("TEST 7: Two Sum (Hash Map)", "seen = {}\nnums = [2, 7, 11, 15]\ntarget = 9\nfor i, num in enumerate(nums):\n    if target - num in seen:\n        print([seen[target - num], i])\n        break\n    seen[num] = i"),
    ("TEST 8: Daily Temperatures", "temperatures = [73, 74, 75, 71, 69, 72, 76, 73]\nans = [0] * len(temperatures)\nstack = []\nfor i, t in enumerate(temperatures):\n    while stack and t > temperatures[stack[-1]]:\n        prev = stack.pop()\n        ans[prev] = i - prev\n    stack.append(i)\nprint(ans)"),
    ("TEST 9: Number of Islands", "grid = [['1','1','0'],['1','1','0'],['0','0','1']]\nislands = 0\nfor r in range(len(grid)):\n    for c in range(len(grid[0])):\n        if grid[r][c] == '1':\n            islands += 1\n            grid[r][c] = 'V'\nprint(islands)"),
    ("TEST 10: Climbing Stairs (DP)", "n = 5\ndp = [0] * (n + 1)\ndp[1], dp[2] = 1, 2\nfor i in range(3, n + 1):\n    dp[i] = dp[i-1] + dp[i-2]\nprint(dp[n])"),
    ("TEST 11: Binary Search", "nums = [-1, 0, 3, 5, 9, 12]\ntarget = 9\nl, r = 0, len(nums) - 1\nwhile l <= r:\n    mid = (l + r) // 2\n    if nums[mid] == target:\n        print(mid)\n        break\n    elif nums[mid] < target: l = mid + 1\n    else: r = mid - 1"),
    ("TEST 12: Merge Sort", "def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    return arr\nprint(merge_sort([4, 2, 7, 1]))"),
    ("TEST 13: Linked List", "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\nhead = ListNode(1, ListNode(2, ListNode(3)))\ncurr = head\nwhile curr:\n    curr = curr.next"),
    ("TEST 14: Graph BFS", "from collections import deque\ngraph = {'A': ['B', 'C'], 'B': ['D'], 'C': [], 'D': []}\nq = deque(['A'])\nvisited = {'A'}\nwhile q:\n    node = q.popleft()\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            visited.add(neighbor)\n            q.append(neighbor)\nprint(visited)"),
    ("TEST 15: Dijkstra (Heap)", "import heapq\nheap = [(0, 'A')]\ndist = {'A': 0}\nwhile heap:\n    d, u = heapq.heappop(heap)\nprint(dist)"),
    ("TEST 16: Backtracking", "res = []\ndef backtrack(start, path):\n    res.append(list(path))\n    for i in range(start, 3):\n        path.append(i)\n        backtrack(i + 1, path)\n        path.pop()\nbacktrack(0, [])\nprint(len(res))"),
    ("TEST 17: Completely New Arbitrary Code", "a = 15\nb = 30\nres = a * b\nprint('Calculated:', res)")
]

all_passed = True
print("=========================================================")
print("[TEST SUITE] REAL PYTHON EXECUTION & TRACER ENGINE (1 - 17)")
print("=========================================================")

for name, code in tests:
    res = tracer.execute_and_trace(code)
    if not res.get("success") or len(res.get("steps", [])) == 0:
        print(f"[FAIL] {name} -> Error: {res.get('error')}")
        all_passed = False
    else:
        steps_count = len(res["steps"])
        structures = res.get("detectedStructures", [])
        stdout_clean = repr(res.get("stdout", "").strip())
        print(f"[PASS] {name} -> {steps_count} real execution steps | structures: {structures} | stdout: {stdout_clean}")

print("=========================================================")
if all_passed:
    print("[SUCCESS] ALL 17 REAL PYTHON EXECUTION TESTS PASSED WITH 100% SUCCESS!")
else:
    print("[FAIL] Some tests failed.")
    sys.exit(1)
print("=========================================================")
