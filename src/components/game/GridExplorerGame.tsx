'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GridExplorerGameProps {
  initialData: string[][];
  onSuccess: () => void;
  onMove: (isCorrect: boolean, feedback: string) => void;
}

export const GridExplorerGame: React.FC<GridExplorerGameProps> = ({
  initialData = [
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1'],
  ],
  onSuccess,
  onMove,
}) => {
  const [grid, setGrid] = useState<string[][]>(() =>
    initialData.map((row) => [...row])
  );
  const [islandsFound, setIslandsFound] = useState<number>(0);

  const handleCellClick = (r: number, c: number) => {
    const cell = grid[r][c];

    if (cell === '0') {
      onMove(false, 'Splooosh! You clicked open ocean water. Click green land tiles ("1") to survey an island!');
      return;
    }

    if (cell === 'V') {
      onMove(false, 'Already surveyed! This island was already mapped and sunk.');
      return;
    }

    // Flood fill DFS
    const newGrid = grid.map((row) => [...row]);
    const queue: [number, number][] = [[r, c]];
    newGrid[r][c] = 'V';

    while (queue.length > 0) {
      const [cr, cc] = queue.shift()!;
      const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      for (const [dr, dc] of dirs) {
        const nr = cr + dr;
        const nc = cc + dc;
        if (
          nr >= 0 &&
          nr < newGrid.length &&
          nc >= 0 &&
          nc < newGrid[0].length &&
          newGrid[nr][nc] === '1'
        ) {
          newGrid[nr][nc] = 'V';
          queue.push([nr, nc]);
        }
      }
    }

    const nextCount = islandsFound + 1;
    setGrid(newGrid);
    setIslandsFound(nextCount);
    onMove(true, `🏝️ Island #${nextCount} charted via DFS flood fill from (${r}, ${c})!`);

    // Check if any '1's remain
    const hasRemainingLand = newGrid.some((row) => row.some((val) => val === '1'));
    if (!hasRemainingLand) {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-xl">
      {/* HUD Header */}
      <div className="flex items-center justify-between w-full bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧭</span>
          <div>
            <div className="text-xs text-emerald-300 uppercase font-mono tracking-wider">Islands Charted</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              {islandsFound} Discovered
            </div>
          </div>
        </div>
        <div className="text-right text-xs font-mono text-gray-400">
          Click green land to flood-fill
        </div>
      </div>

      {/* Interactive Ocean Grid */}
      <div className="flex flex-col gap-2 p-4 bg-gray-950/70 border border-gray-800 rounded-2xl shadow-xl">
        {grid.map((row, r) => (
          <div key={r} className="flex gap-2 justify-center">
            {row.map((cell, c) => {
              const isLand = cell === '1';
              const isVisited = cell === 'V';
              return (
                <motion.button
                  key={`${r}-${c}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-12 h-12 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold text-xs shadow-md transition-all ${
                    isVisited
                      ? 'bg-purple-900/50 border-purple-500 text-purple-200'
                      : isLand
                      ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 hover:bg-emerald-600/50 cursor-pointer animate-pulse'
                      : 'bg-blue-950/40 border-blue-800/60 text-blue-400 cursor-default'
                  }`}
                >
                  <span className="text-sm">
                    {isVisited ? '🏝️' : isLand ? '🟩' : '🌊'}
                  </span>
                  <span className="text-[9px] opacity-70">
                    {isVisited ? 'V' : cell}
                  </span>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
