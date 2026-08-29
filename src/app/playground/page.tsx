'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExecutionTrace, ExecutionStep } from '@/types/execution';
import { executeAlgorithmTrace } from '@/lib/execution/apiTracer';
import { VisualizationCompiler, VisualScene } from '@/lib/visualization/VisualizationCompiler';
import { UniversalVisualizer } from '@/components/visualizers/UniversalVisualizer';
import { CodeViewer } from '@/components/code/CodeViewer';
import { VariableInspector } from '@/components/code/VariableInspector';
import { ExecutionStepExplainer } from '@/components/code/ExecutionStepExplainer';
import { ControlBar } from '@/components/engine/ControlBar';
import { AITutorPanel } from '@/components/ai/AITutorPanel';

const PLAYGROUND_PRESETS = [
  {
    id: 'test-1-vars',
    name: '1. Variables (Test 1)',
    category: 'Foundations',
    code: `x = 10\ny = 20\nz = x + y\nprint(z)`,
    input: '',
  },
  {
    id: 'test-2-loop',
    name: '2. Loops & Accumulator (Test 2)',
    category: 'Loops',
    code: `total = 0\nfor i in range(5):\n    total += i\nprint(total)`,
    input: '',
  },
  {
    id: 'test-3-functions',
    name: '3. Functions (Test 3)',
    category: 'Functions',
    code: `def add(a, b):\n    result = a + b\n    return result\n\nx = add(5, 7)\nprint(x)`,
    input: '',
  },
  {
    id: 'test-4-recursion',
    name: '4. Recursion / Factorial (Test 4)',
    category: 'Recursion',
    code: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(4))`,
    input: '',
  },
  {
    id: 'test-5-array',
    name: '5. Array Max (Test 5)',
    category: 'Arrays',
    code: `numbers = [5, 2, 8, 1]\nlargest = numbers[0]\nfor number in numbers:\n    if number > largest:\n        largest = number\nprint(largest)`,
    input: '',
  },
  {
    id: 'test-6-stack',
    name: '6. Stack Operations (Test 6)',
    category: 'Stack',
    code: `stack = []\nstack.append(10)\nstack.append(20)\nx = stack.pop()\nprint(x)`,
    input: '',
  },
  {
    id: 'test-7-two-sum',
    name: '7. Two Sum (Test 7)',
    category: 'Hashing',
    code: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        needed = target - num\n        if needed in seen:\n            return [seen[needed], i]\n        seen[num] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))`,
    input: '{"nums": [2, 7, 11, 15], "target": 9}',
  },
  {
    id: 'test-8-daily-temps',
    name: '8. Daily Temperatures (Test 8)',
    category: 'Monotonic Stack',
    code: `def daily_temperatures(temperatures):\n    ans = [0] * len(temperatures)\n    stack = []\n    for i, current_temp in enumerate(temperatures):\n        while stack and current_temp > temperatures[stack[-1]]:\n            prev_day = stack.pop()\n            ans[prev_day] = i - prev_day\n        stack.append(i)\n    return ans\n\nprint(daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]))`,
    input: '{"temperatures": [73, 74, 75, 71, 69, 72, 76, 73]}',
  },
  {
    id: 'test-9-islands',
    name: '9. Number of Islands (Test 9)',
    category: '2D Grid DFS',
    code: `def num_islands(grid):\n    rows, cols = len(grid), len(grid[0])\n    islands = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == "1":\n                islands += 1\n                grid[r][c] = "V"\n    return islands`,
    input: '{"grid": [["1","1","0"],["1","1","0"],["0","0","1"]]}',
  },
  {
    id: 'test-10-climb-stairs',
    name: '10. Climbing Stairs DP (Test 10)',
    category: 'Dynamic Programming',
    code: `def climb_stairs(n):\n    dp = [0] * (n + 1)\n    dp[1], dp[2] = 1, 2\n    for i in range(3, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n\nprint(climb_stairs(5))`,
    input: '{"n": 5}',
  },
  {
    id: 'test-11-binary-search',
    name: '11. Binary Search (Test 11)',
    category: 'Binary Search',
    code: `def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nprint(search([-1, 0, 3, 5, 9, 12], 9))`,
    input: '{"nums": [-1, 0, 3, 5, 9, 12], "target": 9}',
  },
  {
    id: 'test-12-merge-sort',
    name: '12. Merge Sort (Test 12)',
    category: 'Sorting',
    code: `def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)`,
    input: '',
  },
  {
    id: 'test-13-linked-list',
    name: '13. Linked List (Test 13)',
    category: 'Linked List',
    code: `def reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev`,
    input: '',
  },
  {
    id: 'test-14-bfs',
    name: '14. Graph BFS (Test 14)',
    category: 'Graphs',
    code: `queue = deque([start_node])\nvisited = {start_node}\nwhile queue:\n    curr = queue.popleft()\n    for neighbor in graph[curr]:\n        if neighbor not in visited:\n            visited.add(neighbor)\n            queue.append(neighbor)`,
    input: '',
  },
  {
    id: 'test-15-dijkstra',
    name: '15. Dijkstra (Test 15)',
    category: 'Graph & Heap',
    code: `heap = [(0, start)]\ndistances = {start: 0}\nwhile heap:\n    dist, node = heapq.heappop(heap)\n    for neighbor, weight in graph[node]:\n        if dist + weight < distances[neighbor]:\n            distances[neighbor] = dist + weight\n            heapq.heappush(heap, (dist + weight, neighbor))`,
    input: '',
  },
  {
    id: 'test-16-backtrack',
    name: '16. Backtracking (Test 16)',
    category: 'Backtracking',
    code: `def backtrack(start, path):\n    res.append(list(path))\n    for i in range(start, len(nums)):\n        path.append(nums[i])\n        backtrack(i + 1, path)\n        path.pop()`,
    input: '',
  },
  {
    id: 'test-17-new-arbitrary',
    name: '17. Arbitrary Code (Test 17)',
    category: 'Generic Mode',
    code: `a = 15\nb = 30\nproduct = a * b\nprint(f"Result: {product}")`,
    input: '',
  },
];

export default function UniversalPythonPlayground() {
  const [code, setCode] = useState<string>(PLAYGROUND_PRESETS[0].code);
  const [customInputText, setCustomInputText] = useState<string>(PLAYGROUND_PRESETS[0].input);
  const [trace, setTrace] = useState<ExecutionTrace | null>(null);
  const [scenes, setScenes] = useState<VisualScene[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'stdout' | 'ai'>('visualizer');
  const [aiHealth, setAiHealth] = useState<{ configured: boolean; provider: string; status: string }>({
    configured: false,
    provider: 'offline',
    status: 'checking',
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check AI Health status on mount
  useEffect(() => {
    fetch('/api/ai/health')
      .then((res) => res.json())
      .then((data) => setAiHealth(data))
      .catch(() => setAiHealth({ configured: false, provider: 'offline', status: 'offline' }));
  }, []);

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

      // Execute ACTUAL user Python source code!
      const res = await executeAlgorithmTrace(
        code, // Pass actual Python code
        'optimal',
        parsedInput,
        code // Explicitly pass code
      );

      setTrace(res);
      const compiledScenes = VisualizationCompiler.compile(res);
      setScenes(compiledScenes);
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
      const intervalMs = Math.max(150, 1000 / playbackSpeed);
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
  const currentScene: VisualScene | undefined = scenes?.[currentStepIndex];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 py-8">
      {/* Universal Playground Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gray-900/80 border border-gray-800 rounded-3xl backdrop-blur-md shadow-2xl">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>🐍</span> UNIVERSAL PYTHON VISUALIZATION ENGINE
            </span>
            {/* AI Status Badge */}
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 border ${
                aiHealth.configured
                  ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                  : 'bg-amber-950/80 border-amber-700 text-amber-300'
              }`}
            >
              <span>{aiHealth.configured ? '🟢' : '🟡'}</span>
              <span>{aiHealth.configured ? 'Gemini AI Ready' : 'Offline Tutor Mode'}</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Real Python Execution & Dynamic Visualizer Studio
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Paste ANY Python code. The engine runs authoritative Python execution with sys.settrace, tracking line-by-line mutations, call stacks, and automatic DSA primitives.
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
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-black font-extrabold font-mono text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <span>{isRunning ? '⏳ Executing...' : '▶ RUN & VISUALIZE'}</span>
          </motion.button>
        </div>
      </div>

      {/* Presets Strip */}
      <div className="flex flex-col gap-2 p-4 bg-gray-900/60 border border-gray-800 rounded-2xl">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
            Quick Algorithm Presets & Verification Tests (1 - 17):
          </span>
          <span className="text-[10px] font-mono text-gray-500">
            {trace ? `${trace.steps.length} Real Execution Steps` : 'Ready'}
          </span>
        </div>
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
              <span className="text-emerald-400 font-bold">● Real Python Runtime</span>
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
              Program Input / Test Case (JSON format, optional):
            </span>
            <input
              type="text"
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder='e.g. {"nums": [2, 7, 11, 15], "target": 9}'
              className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Real Line Highlighting */}
          <CodeViewer
            code={code}
            activeLine={currentStep?.line || 1}
            explanation={currentStep?.explanation?.whatHappened}
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
              🎬 Visual Scene ({currentScene?.activePrimitives?.join(', ') || 'generic'})
            </button>
            <button
              onClick={() => setActiveTab('stdout')}
              className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'stdout'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📄 Stdout Console ({trace?.stdout ? 'Output' : '0 bytes'})
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'ai'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🤖 AI Tutor
            </button>
          </div>

          {activeTab === 'visualizer' && (
            <>
              {/* Detected DSA Structures Badges */}
              <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-gray-900/60 border border-gray-800 rounded-xl font-mono text-xs">
                <span className="text-gray-500 text-[10px] uppercase font-bold">Active Primitives:</span>
                {currentScene?.activePrimitives && currentScene.activePrimitives.length > 0 ? (
                  currentScene.activePrimitives.map((s) => (
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
              {trace?.stdout || '[Program executed with no stdout output]'}
            </div>
          )}

          {activeTab === 'ai' && (
            <AITutorPanel
              problem={{
                id: 'playground',
                title: 'Universal Python Execution Studio',
                slug: 'playground',
                difficulty: 'medium',
                category: 'arrays',
                patterns: ['Authoritative Runtime'],
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
