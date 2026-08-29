'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PairSelectionGameProps {
  initialData: number[];
  target: number;
  onSuccess: () => void;
  onMove: (isCorrect: boolean, feedback: string) => void;
}

export const PairSelectionGame: React.FC<PairSelectionGameProps> = ({
  initialData = [2, 7, 11, 15],
  target = 9,
  onSuccess,
  onMove,
}) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [notebook, setNotebook] = useState<Record<number, number>>({});

  const handleSelect = (idx: number) => {
    if (selectedIndices.includes(idx)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== idx));
      return;
    }

    if (selectedIndices.length === 0) {
      const num = initialData[idx];
      const needed = target - num;
      setSelectedIndices([idx]);
      setNotebook((prev) => ({ ...prev, [num]: idx }));
      onMove(
        true,
        `Selected value ${num} at index ${idx}. Needed complement: ${target} - ${num} = ${needed}.`
      );
    } else if (selectedIndices.length === 1) {
      const firstIdx = selectedIndices[0];
      const sum = initialData[firstIdx] + initialData[idx];

      if (sum === target) {
        setSelectedIndices([firstIdx, idx]);
        onMove(true, `Match! ${initialData[firstIdx]} + ${initialData[idx]} = ${target}!`);
        onSuccess();
      } else {
        setSelectedIndices([]);
        onMove(
          false,
          `Mismatch: ${initialData[firstIdx]} + ${initialData[idx]} = ${sum} (Target is ${target}). Try again!`
        );
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* Target & Status HUD */}
      <div className="flex items-center justify-between w-full max-w-xl bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍦</span>
          <div>
            <div className="text-xs text-indigo-300 uppercase font-mono tracking-wider">Target Budget</div>
            <div className="text-2xl font-black text-amber-400 font-mono">${target}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 font-mono">Selected: {selectedIndices.length} / 2</div>
          <div className="text-sm font-semibold text-emerald-400">
            {selectedIndices.length === 1
              ? `Needed: $${target - initialData[selectedIndices[0]]}`
              : 'Pick first scoop'}
          </div>
        </div>
      </div>

      {/* Interactive Ice Cream Tubs */}
      <div className="flex flex-wrap gap-4 justify-center py-4">
        {initialData.map((val, idx) => {
          const isSelected = selectedIndices.includes(idx);
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(idx)}
              className={`w-24 h-28 rounded-2xl border-2 flex flex-col items-center justify-between p-3 transition-all font-mono relative shadow-lg ${
                isSelected
                  ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400'
                  : 'bg-gray-800/80 border-gray-700 text-white hover:border-indigo-400'
              }`}
            >
              <span className="text-2xl">🍨</span>
              <span className="text-xl font-extrabold text-white">${val}</span>
              <span className="text-[11px] text-gray-400">idx: {idx}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Memory Notebook Assistant */}
      <div className="w-full max-w-xl bg-gray-900/70 border border-gray-800 rounded-xl p-3 text-xs font-mono">
        <div className="text-gray-400 font-semibold mb-1 flex items-center gap-1.5">
          <span>📖 Quick-Lookup Notebook:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-gray-300">
          {Object.keys(notebook).length === 0 ? (
            <span className="text-gray-600 italic">Notebook empty. Click a scoop to store its price!</span>
          ) : (
            Object.entries(notebook).map(([val, idx]) => (
              <span key={val} className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-cyan-300">
                Seen ${val} at index [{idx}]
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
