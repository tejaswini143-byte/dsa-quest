'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type EngineStage = 'story' | 'game' | 'visualizer' | 'practice' | 'complexity' | 'challenge';

interface StageNavigationProps {
  currentStage: EngineStage;
  onStageChange: (stage: EngineStage) => void;
  completedStages?: EngineStage[];
}

export const StageNavigation: React.FC<StageNavigationProps> = ({
  currentStage,
  onStageChange,
  completedStages = [],
}) => {
  const stages: Array<{ id: EngineStage; label: string; icon: string }> = [
    { id: 'story', label: 'Real-Life Story', icon: '📜' },
    { id: 'game', label: 'Interactive Game', icon: '🎮' },
    { id: 'visualizer', label: 'Code & Visualizer', icon: '🎬' },
    { id: 'practice', label: 'Practice Lab', icon: '✍️' },
    { id: 'complexity', label: 'Big-O Lab', icon: '📊' },
    { id: 'challenge', label: 'Challenge Boss', icon: '👑' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-gray-950/80 border border-gray-800 rounded-2xl backdrop-blur-md shadow-lg font-mono text-xs">
      {stages.map((st, idx) => {
        const isActive = currentStage === st.id;
        const isDone = completedStages.includes(st.id);

        return (
          <motion.button
            key={st.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onStageChange(st.id)}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all relative ${
              isActive
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-lg shadow-indigo-600/30'
                : isDone
                ? 'bg-gray-800/90 text-emerald-300 hover:bg-gray-750'
                : 'bg-gray-900/60 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span>{isDone && !isActive ? '✓' : st.icon}</span>
            <span>{st.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};
