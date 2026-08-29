'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraphData } from '@/types/execution';

interface GraphVisualizerProps {
  graph?: GraphData;
  name?: string;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  graph,
  name = 'graph',
}) => {
  const nodes = graph?.nodes || [
    { id: 'A', label: 'A', isVisited: true, distance: 0 },
    { id: 'B', label: 'B', isVisited: true, distance: 4 },
    { id: 'C', label: 'C', isVisited: true, distance: 2 },
    { id: 'D', label: 'D', isVisited: false, distance: 7 },
  ];

  const edges = graph?.edges || [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'D', weight: 5 },
  ];

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="font-semibold text-purple-400">GRAPH NETWORK: {name}</span>
        <span>{nodes.length} Vertices • {edges.length} Edges</span>
      </div>

      {/* Nodes list */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-3">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            animate={{
              scale: node.isVisited ? 1.05 : 1,
              borderColor: node.isVisited ? '#a855f7' : '#4b5563',
            }}
            className={`px-3 py-2 rounded-xl border-2 font-mono flex flex-col items-center shadow-md ${
              node.isVisited
                ? 'bg-purple-950/50 text-purple-200 ring-1 ring-purple-400/40'
                : 'bg-gray-800/80 text-gray-300'
            }`}
          >
            <div className="flex items-center gap-1.5 font-extrabold text-sm">
              <span>Vertex {node.label}</span>
              {node.isVisited && <span className="text-[10px] text-emerald-400">✓</span>}
            </div>
            {node.distance !== undefined && (
              <span className="text-[10px] text-amber-300 font-semibold">
                dist = {node.distance}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Edges List */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800/80 text-xs font-mono text-gray-400">
        <span className="text-gray-500 text-[10px] self-center">EDGES:</span>
        {edges.map((e, idx) => (
          <span key={idx} className="px-2 py-0.5 bg-gray-950 rounded border border-gray-850 text-gray-300">
            {e.from} —({e.weight !== undefined ? e.weight : ''})→ {e.to}
          </span>
        ))}
      </div>
    </div>
  );
};
