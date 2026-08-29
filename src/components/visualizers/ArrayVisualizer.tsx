'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ArrayVisualizerProps {
  array: any[];
  name?: string;
  pointers?: Record<string, number>;
  activeIndices?: number[];
  matchedIndices?: number[];
  highlightColor?: string;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  array = [],
  name = 'nums',
  pointers = {},
  activeIndices = [],
  matchedIndices = [],
}) => {
  if (!array || array.length === 0) {
    return (
      <div className="text-gray-500 text-sm italic py-4 text-center">
        No array data in memory
      </div>
    );
  }

  // Pointer labels by index
  const pointerMap: Record<number, string[]> = {};
  Object.entries(pointers).forEach(([ptrName, idx]) => {
    if (typeof idx === 'number' && idx >= 0 && idx < array.length) {
      if (!pointerMap[idx]) pointerMap[idx] = [];
      pointerMap[idx].push(ptrName);
    }
  });

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-indigo-400">ARRAY: {name}</span>
        <span>length = {array.length}</span>
      </div>

      <div className="flex flex-wrap gap-3 items-end justify-center py-4 min-h-[110px]">
        {array.map((val, idx) => {
          const isActive = activeIndices.includes(idx);
          const isMatched = matchedIndices.includes(idx);
          const ptrs = pointerMap[idx] || [];

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              {/* Pointer Badges */}
              <div className="h-6 flex items-center justify-center gap-1">
                {ptrs.map((p) => (
                  <motion.span
                    key={p}
                    initial={{ y: -4, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="px-1.5 py-0.5 text-[10px] font-bold font-mono rounded bg-amber-500 text-black shadow-lg shadow-amber-500/20 uppercase"
                  >
                    {p} ↓
                  </motion.span>
                ))}
              </div>

              {/* Cell Box */}
              <motion.div
                layout
                animate={{
                  scale: isActive || isMatched ? 1.08 : 1,
                  borderColor: isMatched
                    ? '#10b981'
                    : isActive
                    ? '#6366f1'
                    : '#374151',
                  backgroundColor: isMatched
                    ? 'rgba(16, 185, 129, 0.2)'
                    : isActive
                    ? 'rgba(99, 102, 241, 0.2)'
                    : 'rgba(31, 41, 55, 0.6)',
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-lg font-bold font-mono text-white shadow-md relative ${
                  isMatched ? 'ring-2 ring-emerald-400/50' : ''
                }`}
              >
                <span>{val !== undefined && val !== null ? String(val) : '-'}</span>
              </motion.div>

              {/* Index Label */}
              <span className="text-[11px] font-mono text-gray-500">[{idx}]</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
