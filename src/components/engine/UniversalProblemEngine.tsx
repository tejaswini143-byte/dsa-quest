'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ProblemDefinition } from '@/types/problem';
import { ExecutionTrace, ExecutionStep } from '@/types/execution';
import { executeAlgorithmTrace } from '@/lib/execution/apiTracer';
import { useUserProgress } from '@/lib/state/useUserProgress';
import { getRelatedProblems } from '@/lib/problems/registry';

// Sub-engine components
import { StageNavigation, EngineStage } from './StageNavigation';
import { ControlBar } from './ControlBar';
import { UniversalVisualizer } from '../visualizers/UniversalVisualizer';
import { UniversalGameEngine } from '../game/UniversalGameEngine';
import { UniversalStoryView } from '../story/UniversalStoryView';
import { ConceptExplainer } from '../story/ConceptExplainer';
import { CodeViewer } from '../code/CodeViewer';
import { VariableInspector } from '../code/VariableInspector';
import { ExecutionStepExplainer } from '../code/ExecutionStepExplainer';
import { UniversalClueEngine } from '../hints/UniversalClueEngine';
import { ComplexityComparator } from '../complexity/ComplexityComparator';
import { UniversalPracticeEngine } from '../practice/UniversalPracticeEngine';
import { AITutorPanel } from '../ai/AITutorPanel';

interface UniversalProblemEngineProps {
  problem: ProblemDefinition;
}

export const UniversalProblemEngine: React.FC<UniversalProblemEngineProps> = ({ problem }) => {
  const { progress, addXP, completeProblem } = useUserProgress();
  const [currentStage, setCurrentStage] = useState<EngineStage>('story');
  const [completedStages, setCompletedStages] = useState<EngineStage[]>([]);

  // Execution state
  const [variant, setVariant] = useState<'optimal' | 'bruteForce'>('optimal');
  const [customInput, setCustomInput] = useState<any>(problem.visualization.defaultInput);
  const [trace, setTrace] = useState<ExecutionTrace | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isTraceLoading, setIsTraceLoading] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const relatedProblems = getRelatedProblems(problem.id);

  // Load Trace on problem, variant, or input change
  const loadTrace = async (customCode?: string) => {
    setIsTraceLoading(true);
    try {
      const result = await executeAlgorithmTrace(
        problem.id,
        variant,
        customInput,
        customCode
      );
      setTrace(result);
      setCurrentStepIndex(0);
    } catch {
      // fallback handled internally
    } finally {
      setIsTraceLoading(false);
    }
  };

  useEffect(() => {
    loadTrace();
  }, [problem.id, variant, customInput]);

  // Playback loop
  useEffect(() => {
    if (isPlaying && trace && trace.steps.length > 0) {
      const intervalMs = Math.max(250, 1000 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= trace.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, trace]);

  const handleStageComplete = (stage: EngineStage) => {
    if (!completedStages.includes(stage)) {
      setCompletedStages((prev) => [...prev, stage]);
      addXP(50);
    }
  };

  const handleFinishAll = () => {
    completeProblem(problem.id, problem.category);
    addXP(100);
  };

  const currentStep: ExecutionStep | undefined = trace?.steps?.[currentStepIndex];
  const activeCode =
    variant === 'optimal'
      ? problem.algorithm.optimal.pythonCode
      : problem.algorithm.bruteForce.pythonCode;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 py-6">
      {/* Top Breadcrumb & Quest Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-900/60 border border-gray-800 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-xs flex items-center gap-1.5"
          >
            <span>←</span>
            <span>World Map</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                {problem.category}
              </span>
              <span className="text-gray-600">•</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  problem.difficulty === 'easy'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : problem.difficulty === 'medium'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {problem.difficulty}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">{problem.title}</h1>
          </div>
        </div>

        {/* User XP & Level Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-950/80 border border-gray-800 rounded-2xl text-xs font-mono">
            <span className="text-amber-400 font-bold">⚡ Level {progress.level}</span>
            <span className="text-gray-500">|</span>
            <span className="text-indigo-300 font-semibold">{progress.xp} XP</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 bg-rose-950/40 border border-rose-800/60 rounded-2xl text-xs font-mono text-rose-300">
            <span>🔥</span>
            <span>{progress.streakDays}d streak</span>
          </div>
        </div>
      </div>

      {/* Engine Stage Navigation */}
      <StageNavigation
        currentStage={currentStage}
        onStageChange={setCurrentStage}
        completedStages={completedStages}
      />

      {/* --- STAGE 1: REAL-LIFE STORY --- */}
      {currentStage === 'story' && (
        <div className="flex flex-col gap-6">
          <UniversalStoryView
            problem={problem}
            onStartGame={() => {
              handleStageComplete('story');
              setCurrentStage('game');
            }}
          />
          <ConceptExplainer explanation={problem.explanation} />
        </div>
      )}

      {/* --- STAGE 2: INTERACTIVE GAME --- */}
      {currentStage === 'game' && (
        <UniversalGameEngine
          problem={problem}
          onGameComplete={() => handleStageComplete('game')}
          onAdvanceToVisualizer={() => {
            handleStageComplete('game');
            setCurrentStage('visualizer');
          }}
        />
      )}

      {/* --- STAGE 3: CODE & EXECUTION VISUALIZER --- */}
      {currentStage === 'visualizer' && (
        <div className="flex flex-col gap-6">
          {/* Main 3-Column Studio Grid: Code | Visualizer | Variables & Intel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Code Viewer (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <CodeViewer
                code={activeCode}
                activeLine={currentStep?.line || 1}
                explanation={currentStep?.explanation.whatHappened}
              />
              <VariableInspector
                variables={currentStep?.variables}
                previousVariables={currentStep?.previousVariables}
                changedVariables={currentStep?.changedVariables}
              />
            </div>

            {/* Right Column: Visualizer & Step Intel (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <UniversalVisualizer
                problem={problem}
                step={currentStep}
                activeInput={customInput}
              />
              <ExecutionStepExplainer
                explanation={currentStep?.explanation}
                stepNumber={currentStepIndex + 1}
                totalSteps={trace?.steps?.length || 1}
              />
            </div>
          </div>

          {/* Bottom Execution Control Bar */}
          <ControlBar
            currentStepIndex={currentStepIndex}
            totalSteps={trace?.steps?.length || 1}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            variant={variant}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onStepForward={() =>
              setCurrentStepIndex((p) => Math.min((trace?.steps.length || 1) - 1, p + 1))
            }
            onStepBack={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
            onSeek={(idx) => setCurrentStepIndex(idx)}
            onSpeedChange={setPlaybackSpeed}
            onVariantChange={setVariant}
            onReset={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
          />

          {/* Progressive Clue Engine & AI Tutor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UniversalClueEngine hints={problem.hints} />
            <AITutorPanel problem={problem} currentStep={currentStep} />
          </div>
        </div>
      )}

      {/* --- STAGE 4: PRACTICE LAB --- */}
      {currentStage === 'practice' && (
        <UniversalPracticeEngine
          problem={problem}
          onPracticeComplete={() => handleStageComplete('practice')}
          onRunCustomCode={(code) => {
            loadTrace(code);
            setCurrentStage('visualizer');
          }}
        />
      )}

      {/* --- STAGE 5: BIG-O COMPLEXITY LAB --- */}
      {currentStage === 'complexity' && (
        <ComplexityComparator
          complexity={problem.complexity}
          bruteForceName={problem.algorithm.bruteForce.name}
          optimalName={problem.algorithm.optimal.name}
        />
      )}

      {/* --- STAGE 6: CHALLENGE BOSS & NEXT PATTERNS --- */}
      {currentStage === 'challenge' && (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-6 bg-gray-900/70 border border-gray-800 rounded-3xl backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                PATTERN MASTERY RECOGNITION
              </span>
              <h2 className="text-2xl font-black text-white">Next Pattern Challenges</h2>
            </div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-xs font-bold rounded-lg border border-amber-500/40">
              Pattern: {problem.algorithm.pattern}
            </span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">
            Congratulations! You solved <strong className="text-white">{problem.title}</strong> and unraveled its core algorithmic invariants.
            To solidify your pattern recognition instincts for technical interviews, take on these related challenges next:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
            {relatedProblems.map((rel) => (
              <Link
                key={rel.id}
                href={`/problem/${rel.id}`}
                className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 hover:border-indigo-500/80 flex flex-col justify-between gap-3 group transition-all"
              >
                <div>
                  <div className="text-[10px] font-mono text-indigo-400 uppercase font-bold">
                    {rel.category}
                  </div>
                  <div className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {rel.title}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-gray-500 pt-2 border-t border-gray-900">
                  <span>{rel.difficulty}</span>
                  <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Embark →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleFinishAll}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold font-mono text-sm shadow-xl shadow-emerald-500/20"
            >
              Complete Quest & Claim Badge 🏆
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};
