'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ExecutionTrace, ExecutionStep } from '@/types/execution';
import { executeAlgorithmTrace } from '@/lib/execution/apiTracer';
import { UniversalVisualizer } from '@/components/visualizers/UniversalVisualizer';
import { CodeViewer } from '@/components/code/CodeViewer';
import { VariableInspector } from '@/components/code/VariableInspector';
import { ExecutionStepExplainer } from '@/components/code/ExecutionStepExplainer';
import { ControlBar } from '@/components/engine/ControlBar';
import { AITutorPanel } from '@/components/ai/AITutorPanel';

const PLAYGROUND_PRESETS = [
  {
    id: 'test-a',
    name: '1. Basic Variables (Test A)',
    category: 'Foundations',
    code: `x = 10\ny = 20\nz = x + y\nprint(z)`,
    input: '',
  },
  {
    id: 'test-b',
    name: '2. Loop Accumulator (Test B)',
    category: 'Loops',
    code: `total = 0\nfor i in range(5):\n    total += i\nprint(total)`,
    input: '',
  },
  {
    id: 'test-c',
    name: '3. Recursive Factorial (Test C)',
    category: 'Recursion',
    code: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(4))`,
    input: '',
  },
  {
    id: 'test-d',
    name: '4. Stack Operations (Test D)',
    category: 'Stack',
    code: `stack = []\nstack.append(10)\nstack.append(20)\npopped = stack.pop()\nprint(popped)`,
    input: '',
  },
  {
    id: 'test-e',
    name: '5. Two Sum (Test E)',
    category: 'Hashing',
    code: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        needed = target - num\n        if needed in seen:\n            return [seen[needed], i]\n        seen[num] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))`,
    input: '{"nums": [2, 7, 11, 15], "target": 9}',
  },
  {
    id: 'test-f',
    name: '6. Daily Temperatures (Test F)',
    category: 'Monotonic Stack',
    code: `def daily_temperatures(temperatures):\n    ans = [0] * len(temperatures)\n    stack = []\n    for i, current_temp in enumerate(temperatures):\n        while stack and current_temp > temperatures[stack[-1]]:\n            prev_day = stack.pop()\n            ans[prev_day] = i - prev_day\n        stack.append(i)\n    return ans\n\nprint(daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]))`,
    input: '{"temperatures": [73, 74, 75, 71, 69, 72, 76, 73]}',
  },
  {
    id: 'test-g',
    name: '7. Number of Islands (Test G)',
    category: '2D Grid DFS',
    code: `def num_islands(grid):\n    rows, cols = len(grid), len(grid[0])\n    islands = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == "1":\n                islands += 1\n                grid[r][c] = "V"\n    return islands`,
    input: '{"grid": [["1","1","0"],["1","1","0"],["0","0","1"]]}',
  },
  {
    id: 'test-h',
    name: '8. Climbing Stairs DP (Test H)',
    category: 'Dynamic Programming',
    code: `def climb_stairs(n):\n    dp = [0] * (n + 1)\n    dp[1], dp[2] = 1, 2\n    for i in range(3, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n\nprint(climb_stairs(5))`,
    input: '{"n": 5}',
  },
  {
    id: 'test-i',
    name: '9. Binary Search (Test I)',
    category: 'Binary Search',
    code: `def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
    input: '{"nums": [-1, 0, 3, 5, 9, 12], "target": 9}',
  },
  {
    id: 'test-j',
    name: '10. Merge Sort (Test J)',
    category: 'Divide & Conquer',
    code: `def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)`,
    input: '',
  },
  {
    id: 'test-k',
    name: '11. Linked List Reversal (Test K)',
    category: 'Linked List',
    code: `def reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev`,
    input: '',
  },
  {
    id: 'test-l',
    name: '12. Graph BFS (Test L)',
    category: 'Graphs',
    code: `queue = deque([start_node])\nvisited = {start_node}\nwhile queue:\n    curr = queue.popleft()\n    for neighbor in graph[curr]:\n        if neighbor not in visited:\n            visited.add(neighbor)\n            queue.append(neighbor)`,
    input: '',
  },
  {
    id: 'test-m',
    name: '13. Dijkstra Shortest Path (Test M)',
    category: 'Graphs & Heap',
    code: `heap = [(0, start)]\ndistances = {start: 0}\nwhile heap:\n    dist, node = heapq.heappop(heap)\n    for neighbor, weight in graph[node]:\n        if dist + weight < distances[neighbor]:\n            distances[neighbor] = dist + weight\n            heapq.heappush(heap, (dist + weight, neighbor))`,
    input: '',
  },
  {
    id: 'test-n',
    name: '14. Backtracking Subsets (Test N)',
    category: 'Backtracking',
    code: `def backtrack(start, path):\n    res.append(list(path))\n    for i in range(start, len(nums)):\n        path.append(nums[i])\n        backtrack(i + 1, path)\n        path.pop()`,
    input: '',
  },
  {
    id: 'leetcode-template',
    name: '15. LeetCode Solution Class',
    category: 'LeetCode Format',
    code: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            needed = target - num\n            if needed in seen:\n                return [seen[needed], i]\n            seen[num] = i\n        return []`,
    input: '{"nums": [2, 7, 11, 15], "target": 9}',
  },
];

export default function PythonPlaygroundPage() {
  const [code, setCode] = useState<string>(PLAYGROUND_PRESETS[4].code);
  const [customInputText, setCustomInputText] = useState<string>(PLAYGROUND_PRESETS[4].input);
  const [trace, setTrace] = useState<ExecutionTrace | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'stdout' | 'ai'>('visualizer');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleExecute = async () => {
    setIsRunning(true);
    setIsPlaying(false);
    try {
      let parsedInput: any = undefined;
      if (customInputText.trim()) {
        try {
          parsedInput = JSON.parse(customInputText);
        } catch {
          parsedInput = customInputText;
        }
      }

      const res = await executeAlgorithmTrace(
        'custom-playground',
        'optimal',
        parsedInput,
        code
      );

      setTrace(res);
      setCurrentStepIndex(0);
    } catch {
      // handled
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    handleExecute();
  }, []);

  // Playback timer
  useEffect(() => {
    if (isPlaying && trace && trace.steps.length > 0) {
      const intervalMs = Math.max(200, 1000 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= trace.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, trace]);

  const currentStep: ExecutionStep | undefined = trace?.steps?.[currentStepIndex];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 py-8">
      {/* Playground Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gray-900/80 border border-gray-800 rounded-3xl backdrop-blur-md shadow-2xl">
        <div>
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <span>🐍</span> UNIVERSAL PYTHON DSA PLAYGROUND
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Write, Execute, Trace & Visualize Any DSA Code
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Paste any Python code or standard LeetCode class. The universal engine traces control flow, detects data structures, and animates memory in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/map"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-2xl text-xs font-mono text-gray-300"
          >
            ← World Map
          </Link>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={isRunning}
            onClick={handleExecute}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold font-mono text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <span>{isRunning ? '⏳ Tracing...' : '▶ RUN & TRACE'}</span>
          </motion.button>
        </div>
      </div>

      {/* Presets Strip */}
      <div className="flex flex-col gap-2 p-4 bg-gray-900/60 border border-gray-800 rounded-2xl">
        <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
          Quick Algorithm Presets & Verification Tests:
        </span>
        <div className="flex flex-wrap gap-2">
          {PLAYGROUND_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setCode(p.code);
                setCustomInputText(p.input);
              }}
              className="px-3 py-1.5 rounded-xl bg-gray-950/80 hover:bg-gray-800 border border-gray-800 text-[11px] font-mono text-gray-300 hover:text-white transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid: Editor (Left) | Visualizer & Memory (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Code Editor & Input (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-800 bg-[#0d1117] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-800 text-[11px] font-mono text-gray-400">
              <span className="font-semibold text-gray-300">python_playground.py</span>
              <span className="text-gray-500">Python 3.12 Sandboxed</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={14}
              spellCheck={false}
              className="w-full p-4 bg-transparent text-gray-200 font-mono text-xs focus:outline-none resize-y"
            />
          </div>

          {/* Test Input Box */}
          <div className="p-3 bg-gray-950/80 border border-gray-800 rounded-2xl flex flex-col gap-1 font-mono text-xs">
            <span className="text-[10px] text-gray-500 font-bold uppercase">
              Program Input / Test Case (JSON):
            </span>
            <input
              type="text"
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder='e.g. {"nums": [2, 7, 11, 15], "target": 9}'
              className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Active Line Viewer */}
          <CodeViewer
            code={code}
            activeLine={currentStep?.line || 1}
            explanation={currentStep?.explanation.whatHappened}
          />

          {/* Variable State Inspector */}
          <VariableInspector
            variables={currentStep?.variables}
            previousVariables={currentStep?.previousVariables}
            changedVariables={currentStep?.changedVariables}
          />
        </div>

        {/* Right Column: Multi-Visualizer & Step Intel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Sub-Tabs: Visualizer / Stdout / AI Tutor */}
          <div className="flex gap-2 p-1 bg-gray-950/80 border border-gray-800 rounded-2xl text-xs font-mono">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'visualizer'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎬 DSA Multi-Visualizer
            </button>
            <button
              onClick={() => setActiveTab('stdout')}
              className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'stdout'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📄 Stdout Console ({trace?.stdout ? 'Output Ready' : 'Empty'})
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'ai'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🤖 AI Tutor Coach
            </button>
          </div>

          {activeTab === 'visualizer' && (
            <>
              {/* Detected DSA Structures Badges */}
              <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-gray-900/60 border border-gray-800 rounded-xl font-mono text-xs">
                <span className="text-gray-500 text-[10px] uppercase font-bold">Detected Structures:</span>
                {trace?.detectedStructures && trace.detectedStructures.length > 0 ? (
                  trace.detectedStructures.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 rounded text-[10px] uppercase font-bold"
                    >
                      {s.replace('_', ' ')}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic text-[11px]">Generic Control Flow</span>
                )}
              </div>

              {/* Universal Multi-Visualizer */}
              <UniversalVisualizer
                step={currentStep}
                detectedStructures={trace?.detectedStructures}
              />

              {/* Step Intel */}
              <ExecutionStepExplainer
                explanation={currentStep?.explanation}
                stepNumber={currentStepIndex + 1}
                totalSteps={trace?.steps?.length || 1}
              />
            </>
          )}

          {activeTab === 'stdout' && (
            <div className="p-4 bg-gray-950 border border-gray-800 rounded-2xl font-mono text-xs text-emerald-300 whitespace-pre min-h-[300px]">
              {trace?.stdout || '[No output printed to stdout yet]'}
            </div>
          )}

          {activeTab === 'ai' && (
            <AITutorPanel
              problem={{
                id: 'playground',
                title: 'Custom Python DSA Playground',
                slug: 'playground',
                difficulty: 'medium',
                category: 'arrays',
                patterns: ['Custom Execution'],
                prerequisites: [],
                story: { theme: '', missionTitle: '', missionBrief: '', analogy: '', character: { name: '', avatar: '', role: '' }, realWorldScenario: '' },
                explanation: { eli5: '', beginner: '', intermediate: '', interview: '' },
                game: { type: 'pointer-walk', mission: '', instructions: [], initialData: null, rules: [], successMessage: '' },
                visualization: { primaryType: 'array', defaultInput: {} },
                algorithm: { name: 'Custom Code', pattern: 'Custom', bruteForce: { name: '', timeComplexity: '', spaceComplexity: '', pythonCode: '', description: '', opMultiplier: 1 }, optimal: { name: '', timeComplexity: '', spaceComplexity: '', pythonCode: code, description: '', opMultiplier: 1 } },
                testCases: [],
                hints: [],
                practice: { fillBlanks: { template: '', blanks: [] }, fixBug: { buggyCode: '', bugLine: 1, bugExplanation: '', options: [], correctOptionIndex: 0, correctCode: '' }, predictOutput: { snippet: '', question: '', options: [], correctIndex: 0, explanation: '' }, reorderLines: { scrambledLines: [], correctOrder: [], explanation: '' }, scratchStarter: '' },
                complexity: { time: '', space: '', formula: '', scalingPoints: [] },
                relatedChallenges: [],
              }}
              currentStep={currentStep}
            />
          )}
        </div>
      </div>

      {/* Master Execution Control Bar */}
      <ControlBar
        currentStepIndex={currentStepIndex}
        totalSteps={trace?.steps?.length || 1}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        variant="optimal"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepForward={() =>
          setCurrentStepIndex((p) => Math.min((trace?.steps.length || 1) - 1, p + 1))
        }
        onStepBack={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
        onSeek={(idx) => setCurrentStepIndex(idx)}
        onSpeedChange={setPlaybackSpeed}
        onVariantChange={() => {}}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStepIndex(0);
        }}
      />
    </div>
  );
}
