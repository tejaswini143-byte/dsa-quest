'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PracticeDefinition } from '@/types/problem';

interface FillBlanksChallengeProps {
  data: PracticeDefinition['fillBlanks'];
  onSuccess: () => void;
}

export const FillBlanksChallenge: React.FC<FillBlanksChallengeProps> = ({
  data,
  onSuccess,
}) => {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSelect = (blankId: string, val: string) => {
    setSelections((prev) => ({ ...prev, [blankId]: val }));
  };

  const handleVerify = () => {
    let allValid = true;
    for (const b of data.blanks) {
      if (selections[b.id] !== b.answer) {
        allValid = false;
        break;
      }
    }

    if (allValid) {
      setIsCorrect(true);
      setFeedback('🎉 All code slots filled correctly! The syntax and logic are complete.');
      onSuccess();
    } else {
      setIsCorrect(false);
      setFeedback('❌ Some blanks have incorrect logic. Check your algorithmic invariant and try again.');
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-gray-900/60 rounded-2xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-wider">
          FILL IN THE CODE BLANKS
        </h3>
        <span className="text-xs text-gray-500 font-mono">
          {Object.keys(selections).length} of {data.blanks.length} selected
        </span>
      </div>

      {/* Code Template Preview */}
      <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 font-mono text-xs text-gray-300 whitespace-pre overflow-x-auto">
        {data.template}
      </div>

      {/* Interactive Selectors for Each Blank */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {data.blanks.map((b) => (
          <div
            key={b.id}
            className="p-3 bg-gray-950/70 border border-gray-800 rounded-xl flex flex-col gap-2"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-amber-400">___{b.id}___</span>
              <span className="text-[10px] text-gray-500">{b.hint}</span>
            </div>

            <select
              value={selections[b.id] || ''}
              onChange={(e) => handleSelect(b.id, e.target.value)}
              className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Choose Code --</option>
              {b.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Verify Button & Feedback */}
      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVerify}
          className="py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs shadow-lg shadow-cyan-600/20"
        >
          Verify Code Completion Check 🧪
        </motion.button>

        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs font-mono border ${
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
