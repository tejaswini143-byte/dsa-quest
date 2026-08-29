'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PracticeDefinition } from '@/types/problem';

interface FixBugChallengeProps {
  data: PracticeDefinition['fixBug'];
  onSuccess: () => void;
}

export const FixBugChallenge: React.FC<FixBugChallengeProps> = ({
  data,
  onSuccess,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isResolved, setIsResolved] = useState<boolean>(false);

  const handleVerify = () => {
    if (selectedOption === data.correctOptionIndex) {
      setIsResolved(true);
      setFeedback(`🎯 Bug successfully patched! ${data.bugExplanation}`);
      onSuccess();
    } else {
      setIsResolved(false);
      setFeedback('❌ Incorrect diagnosis. Analyze what edge cases or mutation orders cause unexpected state.');
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-gray-900/60 rounded-2xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-mono text-rose-400 uppercase tracking-wider">
          BUG DETECTIVE & DEBUGGING LAB
        </h3>
        <span className="text-xs text-amber-400 font-mono">Bug around line {data.bugLine}</span>
      </div>

      {/* Buggy Code Preview */}
      <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 font-mono text-xs text-gray-300 whitespace-pre overflow-x-auto">
        {data.buggyCode}
      </div>

      {/* Fix Options */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono text-gray-400 font-semibold">
          Select the correct patch to fix the bug:
        </span>
        {data.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedOption(idx)}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition-all ${
              selectedOption === idx
                ? 'bg-rose-950/40 border-rose-400 text-white ring-1 ring-rose-400'
                : 'bg-gray-950/70 border-gray-800 text-gray-300 hover:border-gray-700'
            }`}
          >
            <span className="font-bold mr-2">[{idx + 1}]</span>
            {opt}
          </button>
        ))}
      </div>

      {/* Action Button & Explanation */}
      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVerify}
          className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs shadow-lg shadow-rose-600/20"
        >
          Apply Bug Patch & Validate 🩹
        </motion.button>

        {feedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-mono border ${
              isResolved
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
