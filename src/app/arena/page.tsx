'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface PatternQuestion {
  id: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  targetProblemId?: string;
}

const PATTERN_QUESTIONS: PatternQuestion[] = [
  {
    id: 'pq-1',
    scenario: 'You are given a stream of daily stock prices. For each day, you must immediately output how many days passed before a higher price occurred.',
    options: ['Monotonic Stack', 'Binary Search', 'Dynamic Programming', 'Breadth-First Search'],
    correctIndex: 0,
    explanation: 'This is the classic "Next Greater Element" problem archetype. A Monotonic Decreasing Stack allows resolving previous waiting items in O(n) total linear time.',
    targetProblemId: 'daily-temperatures',
  },
  {
    id: 'pq-2',
    scenario: 'Given an array of integers and a target sum, find if any two numbers add up exactly to the target with O(n) time complexity.',
    options: ['Hash Map Complement Lookup', 'Nested Loop Brute Force', 'Depth First Search', 'Matrix Exponentiation'],
    correctIndex: 0,
    explanation: 'By storing visited numbers in a Hash Map, each complement lookup (target - num) takes average O(1) time.',
    targetProblemId: 'two-sum',
  },
  {
    id: 'pq-3',
    scenario: 'Given a 2D matrix of "1"s (land) and "0"s (water), determine the count of separate connected land masses.',
    options: ['Grid DFS / BFS Flood Fill (Connected Components)', 'Monotonic Stack', 'Binary Search on Answer', 'Greedy Interval Scheduling'],
    correctIndex: 0,
    explanation: 'Grid cells represent graph vertices and 4-directional adjacencies are edges. DFS or BFS flood-fills sink visited land to prevent double counting in O(M × N) time.',
    targetProblemId: 'number-of-islands',
  },
  {
    id: 'pq-4',
    scenario: 'You are climbing a staircase of N steps. You can leap 1 or 2 steps. The total ways to step N is ways(N-1) + ways(N-2).',
    options: ['1D Dynamic Programming / Tabulation', 'Monotonic Queue', 'Dijkstra Shortest Path', 'Topological Sort'],
    correctIndex: 0,
    explanation: 'This problem exhibits overlapping subproblems and optimal substructure. Bottom-up DP tabulation computes the result in O(n) time and O(1) space.',
    targetProblemId: 'climbing-stairs',
  },
  {
    id: 'pq-5',
    scenario: 'Given a sorted array of 1,000,000 numbers, find the index of a target key in under 25 operations.',
    options: ['Binary Search (O(log n))', 'Linear Scan (O(n))', 'Bubble Sort', 'Hash Set Re-indexing'],
    correctIndex: 0,
    explanation: 'Since the array is sorted, Binary Search eliminates half the remaining search space on every iteration: log₂(1,000,000) ≈ 20 operations.',
    targetProblemId: 'binary-search',
  },
];

export default function PatternArenaPage() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  const question = PATTERN_QUESTIONS[currentIdx];
  const isCorrect = selectedOpt === question.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    if (idx === question.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < PATTERN_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setIsQuizComplete(true);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gray-900/80 border border-gray-800 rounded-3xl backdrop-blur-md shadow-2xl">
        <div>
          <div className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
            INTERVIEW PATTERN RECOGNITION ARENA
          </div>
          <h1 className="text-2xl font-black text-white">Pattern Intuition Trainer</h1>
          <p className="text-xs text-gray-400 mt-1">
            FAANG interviews test your ability to instantly categorize unseen problem statements into the optimal pattern.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-purple-950/50 border border-purple-500/40 rounded-xl text-xs font-mono text-purple-300 font-bold">
            Score: {score} / {PATTERN_QUESTIONS.length}
          </div>
          <Link
            href="/map"
            className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-mono text-gray-300"
          >
            ← Map
          </Link>
        </div>
      </div>

      {!isQuizComplete ? (
        <div className="flex flex-col gap-6 p-6 bg-gray-900/70 border border-gray-800 rounded-3xl backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-b border-gray-800 pb-3">
            <span>Scenario #{currentIdx + 1} of {PATTERN_QUESTIONS.length}</span>
            <span>Pattern Classification</span>
          </div>

          {/* Scenario prompt */}
          <div className="p-5 bg-gray-950 rounded-2xl border border-gray-800 text-sm md:text-base font-semibold text-gray-200 leading-relaxed">
            "{question.scenario}"
          </div>

          {/* Pattern Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrectOpt = idx === question.correctIndex;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border text-left font-mono text-xs font-bold transition-all ${
                    isAnswered
                      ? isCorrectOpt
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                        : isSelected
                        ? 'bg-rose-950/60 border-rose-400 text-rose-200'
                        : 'bg-gray-950/40 border-gray-850 text-gray-500'
                      : isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-950/80 border-gray-800 text-gray-300 hover:border-purple-500/60'
                  }`}
                >
                  <span className="text-purple-400 mr-2">[{String.fromCharCode(65 + idx)}]</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border text-xs font-mono flex flex-col gap-2 ${
                  isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{isCorrect ? '🎯 Bullseye! Correct Pattern.' : '❌ Mismatched Pattern.'}</span>
                  {question.targetProblemId && (
                    <Link
                      href={`/problem/${question.targetProblemId}`}
                      className="text-amber-400 underline hover:text-amber-300"
                    >
                      Practice in Engine →
                    </Link>
                  )}
                </div>
                <div className="font-sans text-gray-300 leading-relaxed">
                  {question.explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs shadow-lg shadow-purple-600/30"
              >
                {currentIdx < PATTERN_QUESTIONS.length - 1 ? 'Next Scenario →' : 'Complete Arena Assessment 🏆'}
              </motion.button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete Card */
        <div className="p-8 bg-gray-900/80 border border-gray-800 rounded-3xl backdrop-blur-md text-center flex flex-col items-center gap-4">
          <span className="text-5xl">🏆</span>
          <h2 className="text-2xl font-black text-white">Assessment Complete!</h2>
          <p className="text-sm text-gray-300 max-w-md">
            You scored <strong className="text-amber-400">{score} out of {PATTERN_QUESTIONS.length}</strong> on pattern classification!
          </p>
          <div className="flex gap-4 pt-4">
            <Link
              href="/map"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs"
            >
              Explore World Map
            </Link>
            <button
              onClick={() => {
                setCurrentIdx(0);
                setSelectedOpt(null);
                setIsAnswered(false);
                setScore(0);
                setIsQuizComplete(false);
              }}
              className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono font-bold text-xs"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
