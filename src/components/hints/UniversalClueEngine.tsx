'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressiveHint } from '@/types/problem';

interface UniversalClueEngineProps {
  hints: ProgressiveHint[];
}

export const UniversalClueEngine: React.FC<UniversalClueEngineProps> = ({ hints = [] }) => {
  const [unlockedStage, setUnlockedStage] = useState<number>(1);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);

  const handleUnlockNext = () => {
    if (unlockedStage < hints.length) {
      const nextStage = unlockedStage + 1;
      setUnlockedStage(nextStage);
      setActiveHintIndex(nextStage - 1);
    }
  };

  const currentHint = hints[activeHintIndex] || hints[0];

  return (
    <div className="flex flex-col gap-4 p-5 bg-gray-900/70 border border-gray-800 rounded-2xl backdrop-blur-sm shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <div>
            <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              PROGRESSIVE CLUE ENGINE
            </div>
            <div className="text-xs text-gray-400">
              Unlocking thinking clues without giving away the complete solution.
            </div>
          </div>
        </div>

        {unlockedStage < hints.length && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUnlockNext}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold shadow-md shadow-amber-500/20"
          >
            Unlock Clue #{unlockedStage + 1} 🔓
          </motion.button>
        )}
      </div>

      {/* Stage Stepper Tabs */}
      <div className="flex flex-wrap gap-2">
        {hints.map((hint, idx) => {
          const isUnlocked = idx < unlockedStage;
          const isSelected = idx === activeHintIndex;

          return (
            <button
              key={hint.stage}
              disabled={!isUnlocked}
              onClick={() => setActiveHintIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 ring-1 ring-amber-400/40'
                  : isUnlocked
                  ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-750 border border-gray-700'
                  : 'bg-gray-950/40 text-gray-600 border border-gray-900 cursor-not-allowed'
              }`}
            >
              <span>{isUnlocked ? '💡' : '🔒'}</span>
              <span>Stage {hint.stage}: {hint.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Hint Content Card */}
      {currentHint && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHint.stage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-xl bg-gray-950/80 border border-amber-500/30 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-amber-400">
                CLUE #{currentHint.stage}: {currentHint.title}
              </span>
              <span className="text-gray-500">{currentHint.label}</span>
            </div>

            <p className="text-xs md:text-sm text-gray-200 leading-relaxed font-sans">
              {currentHint.text}
            </p>

            {currentHint.actionSuggestion && (
              <div className="mt-2 p-2.5 bg-amber-950/30 border border-amber-500/20 rounded-lg text-xs font-mono text-amber-200 flex items-center gap-2">
                <span className="text-sm">🎯</span>
                <span>
                  <strong>Try thinking:</strong> {currentHint.actionSuggestion}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
