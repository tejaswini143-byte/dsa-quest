'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StackVisualizerProps {
  stack?: any[];
  name?: string;
  maxCapacity?: number;
  highlightTop?: boolean;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({
  stack = [],
  name = 'stack',
  highlightTop = true,
}) => {
  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-rose-400">STACK (LIFO): {name}</span>
        <span>size = {stack.length}</span>
      </div>

      <div className="flex flex-col items-center justify-end py-3">
        {/* Glass Stack Chamber */}
        <div className="w-48 min-h-[180px] max-h-[260px] border-b-4 border-l-4 border-r-4 border-rose-500/60 rounded-b-xl bg-gray-950/70 p-2 flex flex-col-reverse gap-1.5 overflow-y-auto shadow-inner relative">
          {stack.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-600 text-xs italic font-mono">
              [ Empty Stack ]
            </div>
          ) : (
            <AnimatePresence>
              {stack.map((item, idx) => {
                const isTop = idx === stack.length - 1;
                return (
                  <motion.div
                    key={`${idx}-${JSON.stringify(item)}`}
                    initial={{ y: -40, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -30, opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`w-full py-2 px-3 rounded-lg border flex items-center justify-between text-xs font-mono font-bold shadow-md ${
                      isTop && highlightTop
                        ? 'bg-rose-600/30 border-rose-400 text-white ring-1 ring-rose-400'
                        : 'bg-gray-800/80 border-gray-700 text-gray-300'
                    }`}
                  >
                    <span className="text-gray-500 text-[10px]">idx: {idx}</span>
                    <span className="text-sm font-extrabold text-amber-300">
                      {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                    </span>
                    {isTop && (
                      <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950/80 px-1 py-0.5 rounded border border-rose-800">
                        TOP ↑
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};
