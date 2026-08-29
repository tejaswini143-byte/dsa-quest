'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askAITutor } from '@/lib/ai/aiProvider';
import { ProblemDefinition } from '@/types/problem';
import { ExecutionStep } from '@/types/execution';

interface AITutorPanelProps {
  problem: ProblemDefinition;
  currentStep?: ExecutionStep;
}

export const AITutorPanel: React.FC<AITutorPanelProps> = ({ problem, currentStep }) => {
  const [conceptLevel, setConceptLevel] = useState<'eli5' | 'beginner' | 'intermediate' | 'interview'>('beginner');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [source, setSource] = useState<string | null>(null);

  const handleAsk = async (questionText?: string) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await askAITutor({
        problemTitle: problem.title,
        conceptLevel,
        currentLine: currentStep?.line,
        codeSnippet: problem.algorithm.optimal.pythonCode,
        variables: currentStep?.variables,
        question: questionText || customQuestion,
      });
      setResponse(res.content);
      setSource(res.source);
    } catch {
      setResponse('AI Tutor currently in offline mode. Review the algorithmic invariants above.');
      setSource('offline-tutor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 bg-gray-900/70 border border-gray-800 rounded-2xl backdrop-blur-md shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <div className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
              AI TUTOR ASSISTANT
            </div>
            <div className="text-xs text-gray-400">
              Personalized insights, edge-case breakdown, and interview coaching.
            </div>
          </div>
        </div>

        {/* Concept level selector */}
        <select
          value={conceptLevel}
          onChange={(e) => setConceptLevel(e.target.value as any)}
          className="p-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs font-mono text-gray-200 focus:outline-none"
        >
          <option value="eli5">ELI5 🧸</option>
          <option value="beginner">Beginner 💡</option>
          <option value="intermediate">Intermediate 🚀</option>
          <option value="interview">Interview 💼</option>
        </select>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleAsk('Why did the active variable change in this step?')}
          className="px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-750 border border-gray-700 text-gray-300 font-mono text-xs"
        >
          🔍 Why did this variable change?
        </button>
        <button
          onClick={() => handleAsk('What is the core time & space complexity trade-off here?')}
          className="px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-750 border border-gray-700 text-gray-300 font-mono text-xs"
        >
          ⚡ Explain Complexity Trade-off
        </button>
        <button
          onClick={() => handleAsk('What common edge case or bug do candidates make here?')}
          className="px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-750 border border-gray-700 text-gray-300 font-mono text-xs"
        >
          ⚠️ Common Pitfalls
        </button>
      </div>

      {/* Custom Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="Ask the AI Tutor anything about this algorithm..."
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          className="flex-1 px-4 py-2 bg-gray-950/80 border border-gray-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isLoading}
          onClick={() => handleAsk()}
          className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-mono text-xs font-bold shadow-md shadow-purple-600/30"
        >
          {isLoading ? 'Thinking...' : 'Ask AI'}
        </motion.button>
      </div>

      {/* Response Display */}
      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-gray-950/80 border border-purple-500/30 text-xs md:text-sm text-gray-200 leading-relaxed font-sans flex flex-col gap-2"
          >
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-gray-800 pb-1.5">
              <span className="text-purple-400 font-bold">AI TUTOR INSIGHT</span>
              <span className="text-gray-500">source: {source || 'tutor'}</span>
            </div>
            <div className="whitespace-pre-wrap">{response}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
