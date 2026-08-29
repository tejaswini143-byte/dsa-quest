'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DPTableVisualizerProps {
  dpTable: any[];
  name?: string;
  activeStep?: number;
  highlightDeps?: number[];
}

export const DPTableVisualizer: React.FC<DPTableVisualizerProps> = ({
  dpTable = [],
  name = 'dp',
  activeStep,
}) => {
  if (!dpTable || dpTable.length === 0) {
    return <div className="text-gray-500 text-sm italic py-4 text-center">No DP table in memory</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-cyan-400">DP TABLE (Tabulation): {name}</span>
        <span>size = {dpTable.length}</span>
      </div>

      <div className="flex flex-wrap gap-2.5 items-center justify-center py-4">
        {dpTable.map((val, idx) => {
          const isActive = activeStep === idx;
          const isBaseCase = idx <= 2;
          const isDep = activeStep !== undefined && (idx === activeStep - 1 || idx === activeStep - 2);

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              {/* Dependency indicator arrow */}
              <div className="h-5 flex items-center justify-center">
                {isActive && (
                  <motion.span
                    initial={{ y: -4 }}
                    animate={{ y: 0 }}
                    className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-cyan-500 text-black rounded uppercase"
                  >
                    CURR ↓
                  </motion.span>
                )}
                {isDep && (
                  <span className="text-[9px] font-mono font-semibold text-amber-400 bg-amber-950/70 px-1 rounded border border-amber-800">
                    DEP
                  </span>
                )}
              </div>

              {/* DP Cell */}
              <motion.div
                animate={{
                  scale: isActive ? 1.12 : isDep ? 1.05 : 1,
                  borderColor: isActive
                    ? '#06b6d4'
                    : isDep
                    ? '#f59e0b'
                    : isBaseCase
                    ? '#10b981'
                    : '#374151',
                }}
                className={`w-14 h-14 rounded-lg border-2 flex flex-col items-center justify-center font-mono shadow-md relative ${
                  isActive
                    ? 'bg-cyan-950/60 ring-2 ring-cyan-400 text-cyan-200'
                    : isDep
                    ? 'bg-amber-950/40 text-amber-200'
                    : isBaseCase
                    ? 'bg-emerald-950/40 text-emerald-300'
                    : 'bg-gray-800/80 text-gray-200'
                }`}
              >
                <span className="text-base font-extrabold">{val !== undefined ? String(val) : '-'}</span>
                {isBaseCase && (
                  <span className="text-[8px] uppercase tracking-wider text-emerald-400">
                    BASE
                  </span>
                )}
              </motion.div>

              {/* Index Tag */}
              <span className="text-[11px] font-mono text-gray-400">dp[{idx}]</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
