'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QueueVisualizerProps {
  queue?: any[];
  name?: string;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({
  queue = [],
  name = 'queue',
}) => {
  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-teal-400">QUEUE (FIFO): {name}</span>
        <span>size = {queue.length}</span>
      </div>

      <div className="flex items-center justify-center gap-2 py-4 overflow-x-auto">
        <span className="text-[10px] font-mono font-bold text-teal-400 uppercase bg-teal-950/60 px-2 py-1 rounded border border-teal-800">
          FRONT ←
        </span>

        {queue.length === 0 ? (
          <span className="text-gray-600 text-xs italic font-mono px-4">[ Empty Queue ]</span>
        ) : (
          <AnimatePresence>
            {queue.map((item, idx) => (
              <motion.div
                key={`${idx}-${JSON.stringify(item)}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-14 h-12 rounded-xl bg-teal-950/40 border-2 border-teal-500/60 flex items-center justify-center font-mono text-sm font-extrabold text-teal-200 shadow-md"
              >
                {typeof item === 'object' ? JSON.stringify(item) : String(item)}
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase bg-gray-800 px-2 py-1 rounded border border-gray-700">
          ← BACK
        </span>
      </div>
    </div>
  );
};
