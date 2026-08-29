'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StackFrame } from '@/types/execution';

interface CallStackVisualizerProps {
  frames?: StackFrame[];
}

export const CallStackVisualizer: React.FC<CallStackVisualizerProps> = ({ frames = [] }) => {
  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-yellow-400">RECURSION CALL STACK</span>
        <span>depth = {frames.length}</span>
      </div>

      <div className="flex flex-col-reverse gap-2 py-2 max-h-[220px] overflow-y-auto">
        {frames.length === 0 ? (
          <div className="text-gray-600 text-xs italic font-mono py-2 text-center">
            [ Single Main Frame ]
          </div>
        ) : (
          <AnimatePresence>
            {frames.map((frame, idx) => {
              const isTop = idx === frames.length - 1;
              return (
                <motion.div
                  key={`${idx}-${frame.fnName}-${frame.line}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-2.5 rounded-lg border text-xs font-mono flex flex-col gap-1 shadow-md ${
                    isTop
                      ? 'bg-amber-950/40 border-amber-500/80 text-amber-200 ring-1 ring-amber-500/50'
                      : 'bg-gray-800/80 border-gray-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>
                      {frame.fnName}() <span className="text-gray-500 font-normal">: line {frame.line}</span>
                    </span>
                    {isTop && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-amber-500 text-black font-extrabold rounded">
                        ACTIVE FRAME
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">
                    args: {JSON.stringify(frame.args || {})}
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
