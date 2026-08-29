'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { registerCustomProblem } from '@/lib/problems/registry';
import { ProblemDefinition } from '@/types/problem';

const SAMPLE_CUSTOM_JSON = {
  id: 'custom-stock-picker',
  title: 'Best Time to Buy and Sell Stock',
  slug: 'best-time-to-buy-and-sell-stock',
  difficulty: 'easy',
  category: 'arrays',
  patterns: ['Greedy', 'One Pass', 'Min Price Tracking'],
  prerequisites: ['Array Traversal'],
  story: {
    theme: 'wall-street-trading',
    missionTitle: 'The Market Breakout Trader',
    missionBrief: 'You are given daily stock prices. Find the maximum profit you can achieve by buying on one day and selling on a future day.',
    analogy: 'Imagine remembering the lowest price seen so far. Every day you ask: "If I sell today, how much profit do I make?"',
    character: { name: 'Trader Alex', avatar: '📈', role: 'Quantitative Analyst' },
    realWorldScenario: 'High-frequency arbitrage and real-time asset peak tracking.'
  },
  explanation: {
    eli5: 'Track the cheapest day to buy! On every new day, subtract that cheapest price from today to see your profit. Keep the highest profit you ever find!',
    beginner: 'We maintain min_price and max_profit. Iterate through prices: update min_price = min(min_price, price) and max_profit = max(max_profit, price - min_price).',
    intermediate: 'Single pass O(n) greedy approach with O(1) auxiliary space, avoiding O(n²) all-pairs scan.',
    interview: 'Kadane algorithm variant. Space: O(1), Time: O(n). Edge case: strictly declining prices return 0 profit.'
  },
  game: {
    type: 'pair-selection',
    mission: 'Select the optimal buy and sell pair from the market prices!',
    instructions: ['Select the lowest buy price day.', 'Select the highest subsequent sell price day.'],
    initialData: [7, 1, 5, 3, 6, 4],
    target: 5,
    rules: ['Buy day must precede sell day.'],
    successMessage: '📈 Perfect trade executed! Maximum profit locked in!'
  },
  visualization: {
    primaryType: 'array',
    secondaryTypes: [],
    defaultInput: { nums: [7, 1, 5, 3, 6, 4] },
    inputSchema: {
      fields: [{ name: 'nums', label: 'Stock Prices', default: [7, 1, 5, 3, 6, 4], type: 'array' }]
    }
  },
  algorithm: {
    name: 'Single Pass Greedy Min-Tracking',
    pattern: 'Greedy / Running Minimum',
    bruteForce: {
      name: 'Nested Loop Pairs',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      pythonCode: `def max_profit_brute(prices):
    max_p = 0
    for i in range(len(prices)):
        for j in range(i + 1, len(prices)):
            max_p = max(max_p, prices[j] - prices[i])
    return max_p`,
      description: 'Checks all buy/sell combinations.',
      opMultiplier: 1.0
    },
    optimal: {
      name: 'One-Pass Greedy',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      pythonCode: `def max_profit(prices):
    min_price = float('inf')
    max_profit_val = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit_val:
            max_profit_val = price - min_price
    return max_profit_val`,
      description: 'Maintains running minimum price in linear time.',
      opMultiplier: 1.0
    }
  },
  testCases: [
    { id: 'tc-1', name: 'Standard Peak', input: { nums: [7, 1, 5, 3, 6, 4] }, expected: 5, explanation: 'Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 5.' }
  ],
  hints: [
    { stage: 1, label: 'Observation', title: 'Buy Before Sell', text: 'You cannot sell before you buy.', actionSuggestion: 'Scan from left to right' },
    { stage: 2, label: 'Memory', title: 'What to Remember', text: 'Keep track of the lowest price seen so far.', actionSuggestion: 'min_price variable' },
    { stage: 3, label: 'Data Structure', title: 'Variables', text: 'Two variables: min_price and max_profit.', actionSuggestion: 'O(1) space' },
    { stage: 4, label: 'Pattern', title: 'Greedy Choice', text: 'Update max_profit whenever (price - min_price) exceeds current max.', actionSuggestion: 'Single loop' },
    { stage: 5, label: 'Blueprint', title: 'Complete Logic', text: 'Initialize min_price = inf, max_profit = 0. Loop price: update min and max.', actionSuggestion: 'Assemble code' }
  ],
  practice: {
    fillBlanks: {
      template: `def max_profit(prices):
    min_p = float('inf')
    max_p = 0
    for p in prices:
        if p < min_p:
            min_p = ___BLANK_1___
        elif p - min_p > max_p:
            max_p = ___BLANK_2___
    return max_p`,
      blanks: [
        { id: 'BLANK_1', answer: 'p', options: ['p', 'min_p', '0', 'max_p'], hint: 'Store new lowest price.' },
        { id: 'BLANK_2', answer: 'p - min_p', options: ['p - min_p', 'p + min_p', 'min_p', 'p'], hint: 'Compute new max profit.' }
      ]
    },
    fixBug: {
      buggyCode: `def max_profit_buggy(prices):
    min_p = 0 # BUG: initialized to 0 instead of float('inf')
    max_p = 0
    for p in prices:
        if p < min_p: min_p = p
        elif p - min_p > max_p: max_p = p - min_p
    return max_p`,
      bugLine: 2,
      bugExplanation: 'Initializing min_price to 0 prevents it from capturing positive prices properly.',
      options: ['Initialize min_price = float("inf")', 'Change loop to while', 'Return min_p', 'Sort prices'],
      correctOptionIndex: 0,
      correctCode: `def max_profit_fixed(prices):
    min_p = float('inf')
    max_p = 0
    for p in prices:
        if p < min_p: min_p = p
        elif p - min_p > max_p: max_p = p - min_p
    return max_p`
    },
    predictOutput: {
      snippet: `prices = [7, 6, 4, 3, 1]`,
      question: 'What is the maximum profit for strictly decreasing prices?',
      options: ['0', '6', '-6', '1'],
      correctIndex: 0,
      explanation: 'No transaction can make profit, so 0 is returned.'
    },
    reorderLines: {
      scrambledLines: [
        'def max_profit(prices):',
        '    for p in prices:',
        '        elif p - min_p > max_p: max_p = p - min_p',
        '    min_p, max_p = float("inf"), 0',
        '        if p < min_p: min_p = p',
        '    return max_p'
      ],
      correctOrder: [0, 3, 1, 4, 2, 5],
      explanation: 'Function declaration -> init min/max -> loop -> update min -> update max -> return.'
    },
    scratchStarter: `def max_profit(prices: list[int]) -> int:
    pass`
  },
  complexity: {
    time: 'O(n)',
    space: 'O(1)',
    formula: 'Time: n iterations = O(n). Space: 2 float variables = O(1).',
    scalingPoints: [
      { n: 10, bruteForceOps: 45, optimalOps: 10 },
      { n: 100, bruteForceOps: 4950, optimalOps: 100 },
      { n: 1000, bruteForceOps: 499500, optimalOps: 1000 }
    ]
  },
  relatedChallenges: ['two-sum', 'daily-temperatures']
};

export default function CreateProblemPage() {
  const router = useRouter();
  const [jsonText, setJsonText] = useState<string>(
    JSON.stringify(SAMPLE_CUSTOM_JSON, null, 2)
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = () => {
    try {
      setErrorMsg(null);
      const parsed = JSON.parse(jsonText) as ProblemDefinition;

      if (!parsed.id || !parsed.title || !parsed.story || !parsed.visualization || !parsed.algorithm) {
        throw new Error('Problem definition missing required fields: id, title, story, visualization, algorithm.');
      }

      registerCustomProblem(parsed);
      router.push(`/problem/${parsed.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON format.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gray-900/80 border border-gray-800 rounded-3xl backdrop-blur-md shadow-2xl">
        <div>
          <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            UNIVERSAL EXTENSION ARCHITECTURE
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Universal Problem Creator</h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Add ANY DSA problem by providing structured data. The universal engine renders all 14 sub-engines without modifying a single line of frontend code.
          </p>
        </div>

        <Link
          href="/map"
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-2xl text-xs font-mono text-gray-300"
        >
          ← World Map
        </Link>
      </div>

      {/* JSON Definition Editor */}
      <div className="flex flex-col gap-4 p-6 bg-gray-900/70 border border-gray-800 rounded-3xl backdrop-blur-md shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-300">Problem Definition JSON Schema:</span>
          <button
            onClick={() => setJsonText(JSON.stringify(SAMPLE_CUSTOM_JSON, null, 2))}
            className="text-[11px] text-cyan-400 hover:underline"
          >
            Load Sample "Best Time to Buy Stock" JSON
          </button>
        </div>

        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={20}
          spellCheck={false}
          className="w-full p-4 bg-gray-950 border border-gray-800 rounded-2xl text-gray-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
        />

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRegister}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-extrabold font-mono text-xs shadow-lg shadow-cyan-500/20"
          >
            Register & Launch in Universal Engine 🚀
          </motion.button>
        </div>
      </div>
    </div>
  );
}
