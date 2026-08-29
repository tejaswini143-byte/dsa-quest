'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeapVisualizerProps {
  heap?: any[];
  name?: string;
}

export const HeapVisualizer: React.FC<HeapVisualizerProps> = ({
  heap = [],
  name = 'min_heap',
}) => {
  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-amber-400">PRIORITY QUEUE / HEAP: {name}</span>
        <span>size = {heap.length}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 py-3">
        {heap.length === 0 ? (
          <span className="text-gray-600 text-xs italic font-mono">[ Empty Priority Queue ]</span>
        ) : (
          heap.map((val, idx) => {
            const isMin = idx === 0;
            return (
              <motion.div
                key={idx}
                animate={{ scale: isMin ? 1.08 : 1 }}
                className={`px-3.5 py-2 rounded-xl border-2 font-mono flex flex-col items-center shadow-md ${
                  isMin
                    ? 'bg-amber-950/50 border-amber-400 text-amber-200 ring-1 ring-amber-400/60'
                    : 'bg-gray-800/80 border-gray-700 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-sm">
                  {isMin && <span className="text-xs text-amber-400">👑 TOP:</span>}
                  <span>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
                </div>
                <span className="text-[10px] text-gray-500">idx: {idx}</span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
