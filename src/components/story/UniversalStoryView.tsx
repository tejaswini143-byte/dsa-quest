'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProblemDefinition } from '@/types/problem';

interface UniversalStoryViewProps {
  problem: ProblemDefinition;
  onStartGame: () => void;
}

export const UniversalStoryView: React.FC<UniversalStoryViewProps> = ({
  problem,
  onStartGame,
}) => {
  const { story } = problem;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-6 md:p-8 bg-gray-900/70 border border-gray-800 rounded-3xl backdrop-blur-md shadow-2xl">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl p-2 bg-gray-800/80 rounded-2xl border border-gray-700 shadow-inner">
            {story.character.avatar}
          </span>
          <div>
            <div className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
              {story.character.role} • {story.character.name}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">{story.missionTitle}</h1>
          </div>
        </div>

        <span className="px-3 py-1 bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 font-mono text-xs font-bold rounded-lg uppercase">
          {problem.category}
        </span>
      </div>

      {/* Mission Briefing Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-indigo-950/40 border border-indigo-500/20 text-gray-200 shadow-lg">
        <h3 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span>📜</span> Mission Briefing:
        </h3>
        <p className="text-sm md:text-base leading-relaxed text-gray-200">
          {story.missionBrief}
        </p>
      </div>

      {/* Real-Life Analogy Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 flex flex-col gap-2">
          <div className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>💡</span> Real-Life Mental Model:
          </div>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            {story.analogy}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 flex flex-col gap-2">
          <div className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>⚙️</span> Real-World Industry Application:
          </div>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            {story.realWorldScenario}
          </p>
        </div>
      </div>

      {/* Action Button to Play the Game */}
      <div className="flex justify-end pt-2">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStartGame}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold font-mono text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2"
        >
          <span>Play the Mission Game</span>
          <span>🎮 →</span>
        </motion.button>
      </div>
    </div>
  );
};
