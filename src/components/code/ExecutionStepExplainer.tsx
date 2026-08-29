'use client';

import React from 'react';
import { StepExplanation } from '@/types/execution';

interface ExecutionStepExplainerProps {
  explanation?: StepExplanation;
  stepNumber: number;
  totalSteps: number;
}

export const ExecutionStepExplainer: React.FC<ExecutionStepExplainerProps> = ({
  explanation,
  stepNumber,
  totalSteps,
}) => {
  if (!explanation) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-900/60 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-lg">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-b border-gray-800 pb-2">
        <span className="font-semibold text-indigo-400">STEP INTEL</span>
        <span>
          Step <strong className="text-white">{stepNumber}</strong> of {totalSteps}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* What Happened */}
        <div className="p-3 bg-gray-950/70 border border-gray-800 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-cyan-400">
            What Happened:
          </span>
          <p className="text-gray-300 leading-relaxed font-sans">
            {explanation.whatHappened}
          </p>
        </div>

        {/* Why It Happened */}
        <div className="p-3 bg-gray-950/70 border border-gray-800 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-purple-400">
            Why It Happened:
          </span>
          <p className="text-gray-300 leading-relaxed font-sans">
            {explanation.whyItHappened}
          </p>
        </div>

        {/* What Changed */}
        <div className="p-3 bg-gray-950/70 border border-gray-800 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-400">
            What Changed:
          </span>
          <p className="text-gray-300 leading-relaxed font-mono text-[11px]">
            {explanation.whatChanged}
          </p>
        </div>
      </div>
    </div>
  );
};
