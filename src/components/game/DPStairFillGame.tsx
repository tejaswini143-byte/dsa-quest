'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DPStairFillGameProps {
  initialData: { n: number; baseCases: Record<number, number> };
  target: number;
  onSuccess: () => void;
  onMove: (isCorrect: boolean, feedback: string) => void;
}

export const DPStairFillGame: React.FC<DPStairFillGameProps> = ({
  initialData = { n: 5, baseCases: { 1: 1, 2: 2 } },
  onSuccess,
  onMove,
}) => {
  const targetN = initialData.n || 5;
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [dp, setDp] = useState<Record<number, number>>({ 1: 1, 2: 2 });

  // Compute 3 options for the learner to pick (1 correct + 2 plausible distractors)
  const expectedVal = (dp[currentStep - 1] || 0) + (dp[currentStep - 2] || 0);
  const options = [
    expectedVal,
    expectedVal + 1,
    Math.max(1, expectedVal - 1),
    (dp[currentStep - 1] || 1) * 2,
  ].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 3);

  const handlePickOption = (choice: number) => {
    if (choice === expectedVal) {
      const nextDp = { ...dp, [currentStep]: expectedVal };
      setDp(nextDp);
      onMove(
        true,
        `Correct! dp[${currentStep}] = dp[${currentStep - 1}] (${dp[currentStep - 1]}) + dp[${currentStep - 2}] (${dp[currentStep - 2]}) = ${expectedVal} ways.`
      );

      if (currentStep >= targetN) {
        onSuccess();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      onMove(
        false,
        `Incorrect: To reach step ${currentStep}, add step ${currentStep - 1} (${dp[currentStep - 1]}) and step ${currentStep - 2} (${dp[currentStep - 2]}).`
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-xl">
      {/* HUD Header */}
      <div className="flex items-center justify-between w-full bg-cyan-950/30 border border-cyan-500/30 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧙‍♂️</span>
          <div>
            <div className="text-xs text-cyan-300 uppercase font-mono tracking-wider">Ascending Staircase</div>
            <div className="text-xl font-bold text-cyan-400 font-mono">
              {currentStep > targetN ? 'Top Reached!' : `Step ${currentStep} of ${targetN}`}
            </div>
          </div>
        </div>
        <div className="text-right text-xs font-mono text-gray-400">
          Target Step: N = {targetN}
        </div>
      </div>

      {/* Staircase Steps */}
      <div className="flex flex-wrap gap-3 items-end justify-center py-4">
        {Array.from({ length: targetN }).map((_, idx) => {
          const stepNum = idx + 1;
          const isFilled = dp[stepNum] !== undefined;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={stepNum} className="flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  scale: isCurrent ? 1.12 : 1,
                  height: 40 + stepNum * 12,
                }}
                className={`w-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold shadow-md ${
                  isFilled
                    ? 'bg-cyan-900/40 border-cyan-400 text-cyan-200'
                    : isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400'
                    : 'bg-gray-800/50 border-gray-700 text-gray-500'
                }`}
              >
                <span className="text-sm font-black">
                  {isFilled ? dp[stepNum] : isCurrent ? '?' : '-'}
                </span>
                <span className="text-[9px] opacity-75">ways</span>
              </motion.div>
              <span className="text-[11px] font-mono text-gray-400">Step {stepNum}</span>
            </div>
          );
        })}
      </div>

      {/* Choice Buttons */}
      {currentStep <= targetN && (
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="text-xs font-mono text-gray-300">
            Compute ways for Step {currentStep}: ({dp[currentStep - 1]} + {dp[currentStep - 2]}) = ?
          </div>
          <div className="flex gap-3 justify-center">
            {options.map((opt) => (
              <motion.button
                key={opt}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePickOption(opt)}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-base shadow-lg shadow-cyan-600/30"
              >
                {opt} Ways
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
