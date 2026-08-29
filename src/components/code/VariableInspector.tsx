'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VariableInspectorProps {
  variables?: Record<string, any>;
  previousVariables?: Record<string, any>;
  changedVariables?: string[];
}

export const VariableInspector: React.FC<VariableInspectorProps> = ({
  variables = {},
  previousVariables = {},
  changedVariables = [],
}) => {
  const entries = Object.entries(variables);

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-2xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-amber-400">VARIABLE SNAPSHOT</span>
        <span>{entries.length} variables</span>
      </div>

      <div className="flex flex-wrap gap-2.5 py-2">
        {entries.length === 0 ? (
          <span className="text-gray-600 text-xs italic font-mono">
            [ No local variables declared yet ]
          </span>
        ) : (
          <AnimatePresence>
            {entries.map(([varName, varVal]) => {
              const isChanged = changedVariables.includes(varName);
              const prevVal = previousVariables[varName];

              return (
                <motion.div
                  key={varName}
                  layout
                  animate={{
                    scale: isChanged ? 1.05 : 1,
                    borderColor: isChanged ? '#f59e0b' : '#374151',
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono shadow-md ${
                    isChanged
                      ? 'bg-amber-950/40 border-amber-500/80 ring-1 ring-amber-400/50'
                      : 'bg-gray-800/80 border-gray-700'
                  }`}
                >
                  <span className="text-indigo-300 font-bold">{varName}</span>
                  <span className="text-gray-500">=</span>

                  {isChanged && prevVal !== undefined && JSON.stringify(prevVal) !== JSON.stringify(varVal) ? (
                    <div className="flex items-center gap-1.5">
                      <span className="line-through text-gray-500 text-[10px]">
                        {formatVarVal(prevVal)}
                      </span>
                      <span className="text-amber-400 text-xs font-black">→</span>
                      <span className="text-emerald-300 font-extrabold">
                        {formatVarVal(varVal)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-200 font-semibold">
                      {formatVarVal(varVal)}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

function formatVarVal(val: any): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'None';
  if (typeof val === 'object') {
    const s = JSON.stringify(val);
    return s.length > 25 ? s.slice(0, 25) + '...' : s;
  }
  return String(val);
}
