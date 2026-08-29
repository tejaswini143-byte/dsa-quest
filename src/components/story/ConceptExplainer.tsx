'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExplanationLevels } from '@/types/problem';

interface ConceptExplainerProps {
  explanation: ExplanationLevels;
}

export const ConceptExplainer: React.FC<ConceptExplainerProps> = ({ explanation }) => {
  const [level, setLevel] = useState<'eli5' | 'beginner' | 'intermediate' | 'interview'>('eli5');

  const tabs: Array<{ id: typeof level; label: string; icon: string }> = [
    { id: 'eli5', label: "Explain Like I'm 5", icon: '🧸' },
    { id: 'beginner', label: 'Beginner Friendly', icon: '💡' },
    { id: 'intermediate', label: 'Algorithmic Core', icon: '🚀' },
    { id: 'interview', label: 'FAANG Interview', icon: '💼' },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-900/60 rounded-2xl border border-gray-800 backdrop-blur-sm">
      {/* Level Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setLevel(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              level === t.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-850'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Explanation Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={level}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans py-1"
        >
          {explanation[level]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
