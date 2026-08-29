'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PracticeDefinition } from '@/types/problem';

interface ReorderLinesChallengeProps {
  data: PracticeDefinition['reorderLines'];
  onSuccess: () => void;
}

export const ReorderLinesChallenge: React.FC<ReorderLinesChallengeProps> = ({
  data,
  onSuccess,
}) => {
  const [currentOrder, setCurrentOrder] = useState<number[]>(() =>
    data.scrambledLines.map((_, i) => i)
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...currentOrder];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    setCurrentOrder(next);
  };

  const moveDown = (index: number) => {
    if (index === currentOrder.length - 1) return;
    const next = [...currentOrder];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    setCurrentOrder(next);
  };

  const handleVerify = () => {
    const isMatch = currentOrder.every((val, idx) => val === data.correctOrder[idx]);
    if (isMatch) {
      setIsCorrect(true);
      setFeedback(`🎉 Perfect sequence! ${data.explanation}`);
      onSuccess();
    } else {
      setIsCorrect(false);
      setFeedback('❌ The logical flow is out of order. Consider the order of declaration, loops, and conditions.');
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-gray-900/60 rounded-2xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-mono text-amber-400 uppercase tracking-wider">
          RECONSTRUCT CODE SEQUENCE
        </h3>
        <span className="text-xs text-gray-500 font-mono">Use arrows to rearrange lines</span>
      </div>

      {/* Ordered Line List */}
      <div className="flex flex-col gap-2">
        {currentOrder.map((lineIdx, pos) => (
          <div
            key={lineIdx}
            className="flex items-center justify-between p-2.5 bg-gray-950/80 border border-gray-800 rounded-xl font-mono text-xs text-gray-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-bold select-none w-5 text-right">{pos + 1}</span>
              <span className="text-indigo-200 whitespace-pre">{data.scrambledLines[lineIdx]}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => moveUp(pos)}
                disabled={pos === 0}
                className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white font-bold"
              >
                ▲
              </button>
              <button
                onClick={() => moveDown(pos)}
                disabled={pos === currentOrder.length - 1}
                className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white font-bold"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Verify Button */}
      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVerify}
          className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs shadow-lg shadow-amber-500/20"
        >
          Check Algorithm Flow 🧩
        </motion.button>

        {feedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-mono border ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}
          >
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};
