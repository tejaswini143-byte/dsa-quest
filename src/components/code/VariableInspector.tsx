'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type Variables = Record<string, unknown>;

export interface VariableInspectorProps {
  variables?: Variables | null;
  previousVariables?: Variables | null;
  changedVariables?: string[] | null;
}

export const VariableInspector: React.FC<VariableInspectorProps> = ({
  variables,
  previousVariables,
  changedVariables,
}) => {
  // Normalize immediately to guaranteed non-null objects
  const safeVariables: Variables = variables ?? {};
  const safePreviousVariables: Variables = previousVariables ?? {};
  const safeChangedVariables: string[] = changedVariables ?? [];

  const entries = Object.entries(safeVariables);

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-amber-400">VARIABLE TIME MACHINE & SNAPSHOT</span>
        <span>{entries.length} local variable{entries.length === 1 ? '' : 's'}</span>
      </div>

      <div className="flex flex-wrap gap-2.5 py-2">
        {entries.length === 0 ? (
          <span className="text-gray-600 text-xs italic font-mono">
            [ No local variables in scope ]
          </span>
        ) : (
          <AnimatePresence>
            {entries.map(([varName, varVal]) => {
              const isChanged = safeChangedVariables.includes(varName);
              const hasPrev = Object.prototype.hasOwnProperty.call(safePreviousVariables, varName);
              const prevVal = hasPrev ? safePreviousVariables[varName] : undefined;

              const valFormatted = formatVarVal(varVal);
              const prevFormatted = formatVarVal(prevVal);
              const isDifferent = isChanged && (!hasPrev || valFormatted !== prevFormatted);

              return (
                <motion.div
                  key={varName}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
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

                  {isDifferent ? (
                    <div className="flex items-center gap-1.5">
                      <span className="line-through text-gray-500 text-[10px]">
                        {prevFormatted}
                      </span>
                      <span className="text-amber-400 text-xs font-black">→</span>
                      <span className="text-emerald-300 font-extrabold">
                        {valFormatted}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-200 font-semibold">
                      {valFormatted}
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

export function formatVarVal(val: unknown): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'None';
  if (typeof val === 'string') {
    return val.length > 30 ? `"${val.slice(0, 27)}..."` : `"${val}"`;
  }
  if (typeof val === 'number' || typeof val === 'boolean') {
    return String(val);
  }
  if (typeof val === 'object') {
    try {
      const seen = new WeakSet();
      const s = JSON.stringify(val, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }
        return value;
      });
      return s.length > 35 ? s.slice(0, 32) + '...' : s;
    } catch {
      return '<Object>';
    }
  }
  return String(val);
}
