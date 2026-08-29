'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ComplexityScaling } from '@/types/problem';

interface ComplexityComparatorProps {
  complexity: ComplexityScaling;
  bruteForceName?: string;
  optimalName?: string;
}

export const ComplexityComparator: React.FC<ComplexityComparatorProps> = ({
  complexity,
  bruteForceName = 'Brute Force Nested Loop',
  optimalName = 'Optimal Single Pass',
}) => {
  const [sliderN, setSliderN] = useState<number>(100);

  // Scaled calculations
  const bruteOps = Math.floor((sliderN * (sliderN - 1)) / 2);
  const optimalOps = sliderN;
  const speedupRatio = (bruteOps / Math.max(1, optimalOps)).toFixed(1);

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-900/70 border border-gray-800 rounded-3xl backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            BIG-O COMPLEXITY LAB
          </span>
          <h2 className="text-xl font-black text-white">
            Brute Force vs Optimal Scalability
          </h2>
        </div>
        <div className="text-right font-mono text-xs text-gray-400">
          Optimal: <span className="text-emerald-400 font-bold">{complexity.time}</span> • Space: <span className="text-purple-400 font-bold">{complexity.space}</span>
        </div>
      </div>

      {/* Interactive Scaling Slider */}
      <div className="flex flex-col gap-2 p-4 bg-gray-950/70 border border-gray-800 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-gray-300 font-bold">Adjust Input Size (N):</span>
          <span className="text-xl font-black text-amber-400">N = {sliderN.toLocaleString()} elements</span>
        </div>
        <input
          type="range"
          min="10"
          max="5000"
          step="10"
          value={sliderN}
          onChange={(e) => setSliderN(Number(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[10px] font-mono text-gray-500">
          <span>N = 10 (Tiny)</span>
          <span>N = 1,000 (Medium)</span>
          <span>N = 5,000 (Production Scale)</span>
        </div>
      </div>

      {/* Side-by-Side Operations Meter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brute Force Card */}
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between font-mono text-xs mb-1">
              <span className="text-rose-400 font-bold uppercase">🐌 {bruteForceName}</span>
              <span className="px-2 py-0.5 bg-rose-950 border border-rose-800 text-rose-300 font-bold rounded">
                O(n²)
              </span>
            </div>
            <div className="text-3xl font-black text-rose-300 font-mono mt-2">
              {bruteOps.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">Total comparisons / operations</div>
          </div>

          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: '100%' }}
              className="h-full bg-rose-500"
            />
          </div>
        </div>

        {/* Optimal Solution Card */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between font-mono text-xs mb-1">
              <span className="text-emerald-400 font-bold uppercase">⚡ {optimalName}</span>
              <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold rounded">
                {complexity.time}
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-300 font-mono mt-2">
              {optimalOps.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">Total comparisons / operations</div>
          </div>

          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${Math.max(2, Math.min(100, (optimalOps / bruteOps) * 100))}%` }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Speedup Badge */}
      <div className="p-4 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 border border-indigo-500/30 rounded-2xl text-center text-xs font-mono text-indigo-200">
        🚀 At <strong className="text-white">N = {sliderN.toLocaleString()}</strong>, the Optimal algorithm is approximately{' '}
        <span className="text-amber-400 font-extrabold text-sm">{speedupRatio}x FASTER</span> than the brute-force approach!
      </div>
    </div>
  );
};
