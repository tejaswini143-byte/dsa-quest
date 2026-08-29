'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ProblemDefinition } from '@/types/problem';
import { FillBlanksChallenge } from './FillBlanksChallenge';
import { FixBugChallenge } from './FixBugChallenge';
import { PredictOutputChallenge } from './PredictOutputChallenge';
import { ReorderLinesChallenge } from './ReorderLinesChallenge';
import { MonacoPracticeEditor } from './MonacoPracticeEditor';

interface UniversalPracticeEngineProps {
  problem: ProblemDefinition;
  onPracticeComplete: () => void;
  onRunCustomCode: (code: string) => void;
}

export const UniversalPracticeEngine: React.FC<UniversalPracticeEngineProps> = ({
  problem,
  onPracticeComplete,
  onRunCustomCode,
}) => {
  const { practice, testCases } = problem;
  const [activeMode, setActiveMode] = useState<
    'fill' | 'fix' | 'predict' | 'reorder' | 'scratch'
  >('fill');

  const handleSuccess = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
    onPracticeComplete();
  };

  const tabs: Array<{ id: typeof activeMode; label: string; icon: string }> = [
    { id: 'fill', label: 'Fill Blanks', icon: '✍️' },
    { id: 'fix', label: 'Fix Bug', icon: '🐛' },
    { id: 'predict', label: 'Predict Output', icon: '🔮' },
    { id: 'reorder', label: 'Reorder Code', icon: '🧩' },
    { id: 'scratch', label: 'Write from Scratch', icon: '⌨️' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-900/80 rounded-2xl border border-gray-800 backdrop-blur-md">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveMode(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeMode === t.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Mode Slots */}
      <div>
        {activeMode === 'fill' && (
          <FillBlanksChallenge
            data={practice.fillBlanks}
            onSuccess={handleSuccess}
          />
        )}

        {activeMode === 'fix' && (
          <FixBugChallenge
            data={practice.fixBug}
            onSuccess={handleSuccess}
          />
        )}

        {activeMode === 'predict' && (
          <PredictOutputChallenge
            data={practice.predictOutput}
            onSuccess={handleSuccess}
          />
        )}

        {activeMode === 'reorder' && (
          <ReorderLinesChallenge
            data={practice.reorderLines}
            onSuccess={handleSuccess}
          />
        )}

        {activeMode === 'scratch' && (
          <MonacoPracticeEditor
            initialCode={practice.scratchStarter}
            testCases={testCases}
            onRunCustomCode={onRunCustomCode}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};
