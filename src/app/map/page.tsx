'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUserProgress } from '@/lib/state/useUserProgress';
import { getAllProblems } from '@/lib/problems/registry';

interface WorldRealm {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  problemIds: string[];
}

const REALMS: WorldRealm[] = [
  {
    id: 'hashing-city',
    name: 'Hashing Metropolis',
    category: 'hashing',
    icon: '🔮',
    color: 'from-purple-600 to-indigo-600',
    description: 'Master instantaneous O(1) memory lookups and complement matching.',
    problemIds: ['two-sum'],
  },
  {
    id: 'stack-tower',
    name: 'Tower of Monotonic Stacks',
    category: 'stack',
    icon: '🗼',
    color: 'from-rose-600 to-amber-600',
    description: 'Scale the vertical LIFO chambers, weather forecasts, and bracket seals.',
    problemIds: ['daily-temperatures', 'valid-parentheses'],
  },
  {
    id: 'graph-galaxy',
    name: 'Archipelago of Graphs',
    category: 'graphs',
    icon: '🏝️',
    color: 'from-emerald-600 to-teal-600',
    description: 'Chart uncharted islands, matrix grids, and DFS/BFS connected clusters.',
    problemIds: ['number-of-islands'],
  },
  {
    id: 'dp-temple',
    name: 'Temple of Dynamic Programming',
    category: 'dp',
    icon: '🏛️',
    color: 'from-cyan-600 to-blue-600',
    description: 'Conquer enchanted staircases, state tabulation, and overlapping subproblems.',
    problemIds: ['climbing-stairs'],
  },
  {
    id: 'binary-mountain',
    name: 'Binary Search Mountain',
    category: 'binary-search',
    icon: '🏔️',
    color: 'from-amber-600 to-orange-600',
    description: 'Halve the search space and pinpoint secret vault codes in O(log n).',
    problemIds: ['binary-search'],
  },
];

export default function WorldMapPage() {
  const { progress } = useUserProgress();
  const allProblems = getAllProblems();

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 py-8">
      {/* Map Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gray-900/80 border border-gray-800 rounded-3xl backdrop-blur-md shadow-2xl">
        <div>
          <div className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
            THE DSA QUEST EXPEDITION
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">World Map of Algorithms</h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Traverse the legendary DSA realms. Complete missions, earn XP, and prepare for FAANG technical interviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-gray-950/80 border border-gray-800 rounded-2xl text-xs font-mono text-amber-400 font-bold">
            ⚡ Level {progress.level} • {progress.xp} XP
          </div>
          <Link
            href="/arena"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xs font-mono font-bold text-white shadow-lg shadow-indigo-600/30"
          >
            Pattern Arena ⚔️
          </Link>
        </div>
      </div>

      {/* World Map Realm Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REALMS.map((realm, idx) => {
          const realmProblems = allProblems.filter((p) => realm.problemIds.includes(p.id));
          const completedCount = realmProblems.filter((p) =>
            progress.completedProblems.includes(p.id)
          ).length;

          return (
            <motion.div
              key={realm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-gray-900/70 border border-gray-800 rounded-3xl backdrop-blur-md flex flex-col justify-between gap-6 shadow-xl hover:border-gray-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-3 bg-gray-800/80 rounded-2xl border border-gray-700 shadow">
                    {realm.icon}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-500 bg-gray-950 px-2.5 py-1 rounded-lg border border-gray-800">
                    {completedCount} / {realm.problemIds.length} Solved
                  </span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                  {realm.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  {realm.description}
                </p>
              </div>

              {/* Problem Quest Links */}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-800">
                {realmProblems.map((prob) => {
                  const isDone = progress.completedProblems.includes(prob.id);
                  return (
                    <Link
                      key={prob.id}
                      href={`/problem/${prob.id}`}
                      className="flex items-center justify-between p-3 bg-gray-950/80 hover:bg-gray-800 rounded-xl border border-gray-800 transition-all font-mono text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span>{isDone ? '✅' : '⚔️'}</span>
                        <span className="font-bold text-gray-200">{prob.title}</span>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          prob.difficulty === 'easy'
                            ? 'text-emerald-400 bg-emerald-950/50'
                            : 'text-amber-400 bg-amber-950/50'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
