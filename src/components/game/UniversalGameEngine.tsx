'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { ProblemDefinition } from '@/types/problem';
import { PairSelectionGame } from './PairSelectionGame';
import { PushPopStackGame } from './PushPopStackGame';
import { GridExplorerGame } from './GridExplorerGame';
import { DPStairFillGame } from './DPStairFillGame';
import { PointerWalkGame } from './PointerWalkGame';

interface UniversalGameEngineProps {
  problem: ProblemDefinition;
  onGameComplete: () => void;
  onAdvanceToVisualizer: () => void;
}

export const UniversalGameEngine: React.FC<UniversalGameEngineProps> = ({
  problem,
  onGameComplete,
  onAdvanceToVisualizer,
}) => {
  const { game } = problem;
  const [moves, setMoves] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<string>(game.mission);
  const [feedbackType, setFeedbackType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleMove = (isCorrect: boolean, msg: string) => {
    setMoves((prev) => prev + 1);
    setFeedback(msg);
    if (isCorrect) {
      setFeedbackType('success');
    } else {
      setFeedbackType('error');
      setLives((prev) => Math.max(0, prev - 1));
    }
  };

  const handleSuccess = () => {
    setIsCompleted(true);
    setFeedback(game.successMessage || '🎉 Quest Challenge Complete!');
    setFeedbackType('success');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    onGameComplete();
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-6 bg-gray-900/70 border border-gray-800 rounded-3xl backdrop-blur-md shadow-2xl">
      {/* Game HUD */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
            MISSION CHALLENGE
          </span>
          <h2 className="text-xl font-black text-white">{game.mission}</h2>
        </div>

        <div className="flex items-center gap-4 font-mono text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 rounded-lg border border-gray-700">
            <span className="text-rose-500">❤️</span>
            <span className="text-gray-300 font-bold">{lives}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 rounded-lg border border-gray-700">
            <span className="text-amber-400">⚡</span>
            <span className="text-gray-300 font-bold">{moves} moves</span>
          </div>
        </div>
      </div>

      {/* Instructions list */}
      <div className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-3.5 text-xs text-gray-300 flex flex-col gap-1">
        <span className="font-bold text-gray-400 uppercase tracking-wider font-mono text-[10px]">
          How to Play:
        </span>
        <ul className="list-disc pl-4 space-y-0.5">
          {game.instructions.map((inst, i) => (
            <li key={i}>{inst}</li>
          ))}
        </ul>
      </div>

      {/* Interactive Mechanic Slot */}
      <div className="py-4">
        {game.type === 'pair-selection' && (
          <PairSelectionGame
            initialData={game.initialData}
            target={game.target}
            onSuccess={handleSuccess}
            onMove={handleMove}
          />
        )}

        {game.type === 'push-pop-stack' && (
          <PushPopStackGame
            initialData={game.initialData}
            onSuccess={handleSuccess}
            onMove={handleMove}
          />
        )}

        {game.type === 'grid-explorer' && (
          <GridExplorerGame
            initialData={game.initialData}
            onSuccess={handleSuccess}
            onMove={handleMove}
          />
        )}

        {game.type === 'dp-stair-fill' && (
          <DPStairFillGame
            initialData={game.initialData}
            target={game.target}
            onSuccess={handleSuccess}
            onMove={handleMove}
          />
        )}

        {game.type === 'pointer-walk' && (
          <PointerWalkGame
            initialData={game.initialData}
            target={game.target}
            onSuccess={handleSuccess}
            onMove={handleMove}
          />
        )}
      </div>

      {/* Feedback Message Bar */}
      <div
        className={`p-3.5 rounded-xl border font-mono text-xs transition-all ${
          feedbackType === 'success'
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
            : feedbackType === 'error'
            ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            : 'bg-gray-800/60 border-gray-700 text-gray-300'
        }`}
      >
        <span className="font-bold mr-2">FEEDBACK:</span>
        {feedback}
      </div>

      {/* Completion Modal / Banner */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl"
          >
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>🏆</span> Game Mechanics Mastered!
              </h3>
              <p className="text-xs text-indigo-200 mt-1">
                You experienced the algorithm's core state mechanics hands-on. Now let's see the exact Python code execution!
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAdvanceToVisualizer}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-sm font-mono shadow-xl shadow-amber-500/20 whitespace-nowrap"
            >
              Bridge to Code Visualizer →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
