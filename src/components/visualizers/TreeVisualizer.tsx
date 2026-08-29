'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TreeNodeData } from '@/types/execution';

interface TreeVisualizerProps {
  nodes?: TreeNodeData[];
  name?: string;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  nodes = [],
  name = 'root',
}) => {
  if (!nodes || nodes.length === 0) {
    // Render standard showcase tree representation if empty
    return (
      <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
          <span className="font-semibold text-emerald-400">BINARY TREE: {name}</span>
        </div>
        <div className="flex flex-col items-center justify-center py-4 font-mono text-xs">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-400 bg-emerald-950/60 text-emerald-200 flex items-center justify-center font-bold text-sm shadow-md">
            10
          </div>
          <div className="flex gap-12 text-gray-500 font-bold text-lg my-1">
            <span>/</span>
            <span>\</span>
          </div>
          <div className="flex gap-16">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500/80 bg-emerald-950/40 text-emerald-300 flex items-center justify-center font-bold shadow">
              5
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500/80 bg-emerald-950/40 text-emerald-300 flex items-center justify-center font-bold shadow">
              15
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-emerald-400">BINARY TREE: {name}</span>
        <span>{nodes.length} nodes</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 py-4">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center p-2 rounded-xl bg-gray-950/60 border border-gray-800 font-mono text-xs"
          >
            <div className="w-10 h-10 rounded-full border-2 border-emerald-400 bg-emerald-950/50 text-emerald-200 flex items-center justify-center font-bold text-sm shadow">
              {String(node.val)}
            </div>
            <span className="text-[10px] text-gray-500 mt-1">{node.id}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
