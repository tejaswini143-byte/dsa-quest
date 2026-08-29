'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LinkedListNode } from '@/types/execution';

interface LinkedListVisualizerProps {
  nodes?: LinkedListNode[];
  name?: string;
  pointers?: Record<string, any>;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({
  nodes = [],
  name = 'head',
  pointers = {},
}) => {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="text-gray-500 text-xs italic py-4 text-center font-mono">
        [ Empty Linked List: NULL ]
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-cyan-400">LINKED LIST: {name}</span>
        <span>{nodes.length} nodes</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 py-4 overflow-x-auto">
        {nodes.map((node, idx) => {
          const isHead = idx === 0;
          const isCurr = pointers.curr === idx || pointers.curr === node.val;
          const isPrev = pointers.prev === idx || pointers.prev === node.val;

          return (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-1">
                {/* Pointer tags */}
                <div className="h-5 flex items-center gap-1">
                  {isHead && (
                    <span className="text-[9px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded">
                      HEAD
                    </span>
                  )}
                  {isCurr && (
                    <span className="text-[9px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded">
                      CURR
                    </span>
                  )}
                  {isPrev && (
                    <span className="text-[9px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded">
                      PREV
                    </span>
                  )}
                </div>

                {/* Node Box */}
                <motion.div
                  animate={{
                    scale: isCurr ? 1.1 : 1,
                    borderColor: isCurr ? '#f59e0b' : '#3b82f6',
                  }}
                  className={`w-16 h-12 rounded-xl border-2 flex items-center justify-center font-mono text-sm font-extrabold shadow-md ${
                    isCurr
                      ? 'bg-amber-950/40 text-amber-200 ring-2 ring-amber-400/50'
                      : 'bg-blue-950/40 text-blue-200'
                  }`}
                >
                  <span>{String(node.val)}</span>
                </motion.div>

                <span className="text-[10px] font-mono text-gray-500">[{idx}]</span>
              </div>

              {/* Arrow Connector */}
              <div className="flex items-center text-gray-400 font-bold text-base px-1">
                →
              </div>
            </React.Fragment>
          );
        })}

        {/* Null Terminator */}
        <div className="flex flex-col items-center gap-1">
          <div className="h-5" />
          <div className="w-14 h-12 rounded-xl border border-gray-700 bg-gray-950/60 flex items-center justify-center text-xs font-mono text-gray-500 font-bold">
            NULL
          </div>
          <span className="text-[10px] font-mono text-gray-600">tail</span>
        </div>
      </div>
    </div>
  );
};
