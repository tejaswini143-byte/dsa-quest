'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PracticeDefinition } from '@/types/problem';

interface PredictOutputChallengeProps {
  data: PracticeDefinition['predictOutput'];
  onSuccess: () => void;
}

export const PredictOutputChallenge: React.FC<PredictOutputChallengeProps> = ({
  data,
  onSuccess,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const isCorrect = selectedIdx === data.correctIndex;

  const handleSubmit = () => {
    if (selectedIdx === null) return;
    setIsSubmitted(true);
    if (isCorrect) {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-gray-900/60 rounded-2xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-wider">
          MENTAL TRACE & PREDICTION LAB
        </h3>
        <span className="text-xs text-gray-500 font-mono">Simulate state in your head</span>
      </div>

      {/* Code snippet */}
      <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 font-mono text-xs text-gray-300 whitespace-pre overflow-x-auto">
        {data.snippet}
      </div>

      {/* Question */}
      <div className="text-xs md:text-sm font-bold text-gray-200 font-sans">
        {data.question}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedIdx(idx);
              setIsSubmitted(false);
            }}
            className={`p-3 rounded-xl border font-mono text-xs text-left transition-all ${
              selectedIdx === idx
                ? 'bg-purple-950/40 border-purple-400 text-white ring-1 ring-purple-400'
                : 'bg-gray-950/70 border-gray-800 text-gray-300 hover:border-gray-700'
            }`}
          >
            <span className="font-bold mr-2 text-purple-300">{String.fromCharCode(65 + idx)}.</span>
            {opt}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs shadow-lg shadow-purple-600/20"
        >
          Check Prediction 🔮
        </motion.button>

        {isSubmitted && (
          <div
            className={`p-3.5 rounded-xl text-xs font-mono border ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}
          >
            <div className="font-bold mb-1">
              {isCorrect ? '✅ Accurate Prediction!' : '❌ Incorrect Prediction!'}
            </div>
            <div>{data.explanation}</div>
          </div>
        )}
      </div>
    </div>
  );
};
