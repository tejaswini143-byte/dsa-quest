'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PointerWalkGameProps {
  initialData: number[];
  target: number;
  onSuccess: () => void;
  onMove: (isCorrect: boolean, feedback: string) => void;
}

export const PointerWalkGame: React.FC<PointerWalkGameProps> = ({
  initialData = [-1, 0, 3, 5, 9, 12],
  target = 9,
  onSuccess,
  onMove,
}) => {
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(initialData.length - 1);

  const mid = Math.floor((left + right) / 2);
  const midVal = initialData[mid];

  const handleAction = (action: 'MATCH' | 'GO_RIGHT' | 'GO_LEFT') => {
    if (action === 'MATCH') {
      if (midVal === target) {
        onMove(true, `🎯 Perfect! nums[${mid}] (${midVal}) matches target ${target}!`);
        onSuccess();
      } else {
        onMove(false, `nums[${mid}] is ${midVal}, not target ${target}.`);
      }
    } else if (action === 'GO_RIGHT') {
      if (midVal < target) {
        const nextLeft = mid + 1;
        setLeft(nextLeft);
        onMove(true, `Discarded left half. Shifted left pointer to ${nextLeft}.`);
      } else {
        onMove(false, `Cannot go right! nums[${mid}] (${midVal}) is already greater than target ${target}.`);
      }
    } else if (action === 'GO_LEFT') {
      if (midVal > target) {
        const nextRight = mid - 1;
        setRight(nextRight);
        onMove(true, `Discarded right half. Shifted right pointer to ${nextRight}.`);
      } else {
        onMove(false, `Cannot go left! nums[${mid}] (${midVal}) is smaller than target ${target}.`);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-xl">
      {/* HUD Bar */}
      <div className="flex items-center justify-between w-full bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👑</span>
          <div>
            <div className="text-xs text-amber-300 uppercase font-mono tracking-wider">Vault Target Code</div>
            <div className="text-2xl font-bold text-amber-400 font-mono">Target = {target}</div>
          </div>
        </div>
        <div className="text-right text-xs font-mono text-gray-400">
          Mid Index: [{mid}] ({midVal})
        </div>
      </div>

      {/* Array with pointers */}
      <div className="flex flex-wrap gap-2.5 justify-center py-4">
        {initialData.map((val, idx) => {
          const isMid = idx === mid;
          const isLeft = idx === left;
          const isRight = idx === right;
          const inRange = idx >= left && idx <= right;

          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div className="h-5 flex items-center gap-1">
                {isLeft && <span className="text-[9px] font-bold bg-blue-500 text-white px-1 rounded">L</span>}
                {isMid && <span className="text-[9px] font-bold bg-amber-500 text-black px-1 rounded">MID</span>}
                {isRight && <span className="text-[9px] font-bold bg-rose-500 text-white px-1 rounded">R</span>}
              </div>

              <motion.div
                animate={{ scale: isMid ? 1.15 : 1 }}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm shadow-md ${
                  isMid
                    ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400'
                    : inRange
                    ? 'bg-gray-800/80 border-gray-600 text-white'
                    : 'bg-gray-950/40 border-gray-800 text-gray-600 opacity-40'
                }`}
              >
                {val}
              </motion.div>

              <span className="text-[10px] font-mono text-gray-500">[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Decision Buttons */}
      <div className="flex gap-3 justify-center w-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction('GO_LEFT')}
          className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-mono text-xs font-bold"
        >
          ← SEARCH LEFT (Target is smaller)
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction('MATCH')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-extrabold shadow-lg shadow-amber-500/30"
        >
          🎯 MATCH TARGET
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction('GO_RIGHT')}
          className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-mono text-xs font-bold"
        >
          SEARCH RIGHT (Target is bigger) →
        </motion.button>
      </div>
    </div>
  );
};
