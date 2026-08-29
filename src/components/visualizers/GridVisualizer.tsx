'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GridVisualizerProps {
  grid: any[][];
  name?: string;
  activeRow?: number;
  activeCol?: number;
  visitedCoordinates?: Array<{ row: number; col: number }>;
}

export const GridVisualizer: React.FC<GridVisualizerProps> = ({
  grid = [],
  name = 'grid',
  activeRow,
  activeCol,
}) => {
  if (!grid || grid.length === 0) {
    return <div className="text-gray-500 text-sm italic py-4 text-center">No grid data</div>;
  }

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-emerald-400">2D MATRIX: {name}</span>
        <span>{rows} × {cols} Cells</span>
      </div>

      <div className="flex flex-col items-center justify-center py-3 overflow-x-auto">
        <div className="flex flex-col gap-2">
          {grid.map((row, r) => (
            <div key={r} className="flex gap-2 items-center">
              <span className="text-[10px] font-mono text-gray-500 w-4 text-right">r{r}</span>
              {row.map((cell, c) => {
                const isActive = activeRow === r && activeCol === c;
                const isLand = cell === '1' || cell === 1;
                const isVisited = cell === 'V' || cell === 'v' || cell === 'visited';
                const isWater = cell === '0' || cell === 0;

                return (
                  <motion.div
                    key={`${r}-${c}`}
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      borderColor: isActive
                        ? '#f59e0b'
                        : isVisited
                        ? '#a855f7'
                        : isLand
                        ? '#10b981'
                        : '#1e3a8a',
                    }}
                    className={`w-11 h-11 rounded-lg border-2 flex flex-col items-center justify-center font-mono font-bold text-xs shadow-md transition-colors relative ${
                      isActive
                        ? 'ring-2 ring-amber-400 bg-amber-500/20 text-amber-200'
                        : isVisited
                        ? 'bg-purple-900/40 text-purple-200'
                        : isLand
                        ? 'bg-emerald-950/60 text-emerald-300'
                        : 'bg-blue-950/40 text-blue-300'
                    }`}
                  >
                    <span className="text-sm">
                      {isVisited ? '🏝️' : isLand ? '🟩' : '🌊'}
                    </span>
                    <span className="text-[9px] text-gray-400">
                      {String(cell)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ))}

          {/* Column indices */}
          <div className="flex gap-2 items-center pl-6">
            {Array.from({ length: cols }).map((_, c) => (
              <span key={c} className="w-11 text-center text-[10px] font-mono text-gray-500">
                c{c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
