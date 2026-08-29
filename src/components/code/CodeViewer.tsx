'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CodeViewerProps {
  code: string;
  activeLine?: number;
  explanation?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  activeLine = 1,
  explanation,
}) => {
  const lines = code.split('\n');

  return (
    <div className="flex flex-col rounded-2xl bg-[#0d1117] border border-gray-800 overflow-hidden shadow-2xl font-mono text-xs">
      {/* Editor Titlebar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-800 text-gray-400 text-[11px]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-semibold text-gray-300 ml-2">solution.py</span>
        </div>
        <span className="text-gray-500">Python 3.12</span>
      </div>

      {/* Code Lines with Active Line Highlight */}
      <div className="py-2 overflow-x-auto select-none">
        {lines.map((lineText, idx) => {
          const lineNum = idx + 1;
          const isActive = activeLine === lineNum;

          return (
            <div
              key={lineNum}
              className={`flex items-center transition-colors relative py-0.5 px-4 ${
                isActive
                  ? 'bg-indigo-950/70 border-l-4 border-indigo-400 text-white'
                  : 'text-gray-300 hover:bg-gray-850/40 border-l-4 border-transparent'
              }`}
            >
              {/* Line number */}
              <span
                className={`w-8 text-right pr-4 select-none font-semibold ${
                  isActive ? 'text-indigo-400 font-bold' : 'text-gray-600'
                }`}
              >
                {lineNum}
              </span>

              {/* Code content */}
              <span className="font-mono whitespace-pre flex-1">
                {formatSyntax(lineText)}
              </span>

              {/* Active cursor badge */}
              {isActive && (
                <motion.span
                  layoutId="active-line-badge"
                  className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/50"
                >
                  EXEC
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Light syntax helper
function formatSyntax(text: string) {
  if (text.trim().startsWith('#')) {
    return <span className="text-gray-500 italic">{text}</span>;
  }
  if (text.includes('def ')) {
    return (
      <span>
        <span className="text-rose-400 font-bold">def </span>
        <span className="text-blue-300 font-semibold">{text.replace('def ', '')}</span>
      </span>
    );
  }
  if (text.includes('return ')) {
    return (
      <span>
        {text.split('return ')[0]}
        <span className="text-rose-400 font-bold">return </span>
        <span className="text-amber-200">{text.split('return ')[1]}</span>
      </span>
    );
  }
  if (text.includes('for ') || text.includes('while ') || text.includes('if ') || text.includes('elif ') || text.includes('else:')) {
    return <span className="text-purple-300">{text}</span>;
  }
  return text;
}
