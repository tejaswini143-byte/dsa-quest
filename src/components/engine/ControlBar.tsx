'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ControlBarProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number;
  variant: 'optimal' | 'bruteForce';
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onSeek: (stepIndex: number) => void;
  onSpeedChange: (speed: number) => void;
  onVariantChange: (variant: 'optimal' | 'bruteForce') => void;
  onReset: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  playbackSpeed,
  variant,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onSeek,
  onSpeedChange,
  onVariantChange,
  onReset,
}) => {
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-900/80 border border-gray-800 rounded-2xl backdrop-blur-md shadow-2xl font-mono text-xs">
      {/* Progress Timeline Scrubber */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-gray-400 font-bold select-none text-[11px]">
          Step {currentStepIndex + 1} / {Math.max(1, totalSteps)}
        </span>

        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 z-10"
          />
          <div
            className="absolute left-0 top-0 h-2 bg-indigo-500/50 rounded-lg pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-800">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Step Back */}
          <button
            onClick={onStepBack}
            disabled={currentStepIndex <= 0}
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white font-bold transition-all"
            title="Step Back"
          >
            ⏮ Step Back
          </button>

          {/* Play / Pause Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isPlaying ? onPause : onPlay}
            className={`px-5 py-1.5 rounded-xl font-bold text-white shadow-lg transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </motion.button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white font-bold transition-all"
            title="Step Forward"
          >
            Step Forward ⏭
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all ml-1"
            title="Reset to Step 1"
          >
            🔄 Reset
          </button>
        </div>

        {/* Playback Speed Switcher */}
        <div className="flex items-center gap-1.5 bg-gray-950/70 p-1 rounded-xl border border-gray-800">
          <span className="text-[10px] text-gray-500 px-1 font-semibold">SPEED:</span>
          {[0.5, 1, 2, 3].map((spd) => (
            <button
              key={spd}
              onClick={() => onSpeedChange(spd)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                playbackSpeed === spd
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Algorithm Variant Switcher */}
        <div className="flex items-center gap-1.5 bg-gray-950/70 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => onVariantChange('optimal')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              variant === 'optimal'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⚡ Optimal
          </button>
          <button
            onClick={() => onVariantChange('bruteForce')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              variant === 'bruteForce'
                ? 'bg-rose-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🐌 Brute Force
          </button>
        </div>
      </div>
    </div>
  );
};
