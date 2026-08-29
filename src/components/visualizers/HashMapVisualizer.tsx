'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HashMapVisualizerProps {
  hashMap?: Record<string, any>;
  name?: string;
  lookupKey?: any;
  lookupFound?: boolean;
}

export const HashMapVisualizer: React.FC<HashMapVisualizerProps> = ({
  hashMap = {},
  name = 'seen',
  lookupKey,
  lookupFound,
}) => {
  const entries = Object.entries(hashMap || {});

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-purple-400">HASH MAP (O(1)): {name}</span>
        <span>entries = {entries.length}</span>
      </div>

      {/* Lookup status indicator */}
      {lookupKey !== undefined && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 rounded-lg text-xs font-mono border border-gray-700">
          <span className="text-gray-400">Lookup Key:</span>
          <span className="font-bold text-amber-300">"{String(lookupKey)}"</span>
          <span className="ml-auto font-semibold">
            {lookupFound ? (
              <span className="text-emerald-400 flex items-center gap-1">
                ✓ FOUND (value = {String(hashMap[lookupKey])})
              </span>
            ) : (
              <span className="text-rose-400">✗ NOT PRESENT</span>
            )}
          </span>
        </div>
      )}

      {/* Cards list */}
      <div className="flex flex-wrap gap-2.5 py-3 min-h-[75px] items-center">
        {entries.length === 0 ? (
          <div className="text-gray-500 text-xs italic font-mono w-full text-center py-2">
            {'{}'} (Empty Hash Table)
          </div>
        ) : (
          <AnimatePresence>
            {entries.map(([k, v]) => {
              const isTargetLookup = String(lookupKey) === String(k);
              return (
                <motion.div
                  key={k}
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{
                    scale: isTargetLookup ? 1.08 : 1,
                    opacity: 1,
                    y: 0,
                    borderColor: isTargetLookup ? '#10b981' : '#4b5563',
                  }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`flex items-center divide-x divide-gray-700 bg-gray-800/90 rounded-lg border px-2.5 py-1.5 font-mono text-xs shadow-md ${
                    isTargetLookup ? 'ring-2 ring-emerald-400/60 bg-emerald-950/40' : ''
                  }`}
                >
                  <div className="pr-2 text-cyan-300 font-bold">
                    <span className="text-gray-500 text-[10px] mr-1">KEY</span>
                    {k}
                  </div>
                  <div className="pl-2 text-purple-300">
                    <span className="text-gray-500 text-[10px] mr-1">VAL</span>
                    {String(v)}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
