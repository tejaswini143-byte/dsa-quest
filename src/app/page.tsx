'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getAllProblems } from '@/lib/problems/registry';
import { useUserProgress } from '@/lib/state/useUserProgress';

export default function HomePage() {
  const { progress, allBadges } = useUserProgress();
  const problems = getAllProblems();

  return (
    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 md:p-14 overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900/90 via-gray-900/60 to-gray-950/80 backdrop-blur-xl shadow-2xl">
        {/* Glow backdrop decorations */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <span>🚀</span> UNIVERSAL DSA LEARNING ENGINE
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            DSA <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">QUEST</span>
          </h1>

          <p className="text-base md:text-xl text-gray-300 leading-relaxed font-light">
            Learn Data Structures & Algorithms by <strong className="text-white font-semibold">playing it</strong>, <strong className="text-white font-semibold">seeing it</strong>, and <strong className="text-white font-semibold">solving it</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/playground"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black font-mono font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
            >
              <span>Launch Python Playground</span>
              <span>🐍 →</span>
            </Link>

            <Link
              href="/problem/two-sum"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-mono font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
            >
              <span>Embark on Quest 1: Two Sum</span>
              <span>⚔️ →</span>
            </Link>

            <Link
              href="/map"
              className="px-8 py-4 rounded-2xl bg-gray-800/90 hover:bg-gray-750 text-gray-200 border border-gray-700 font-mono font-bold text-sm shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Explore World Map 🗺️
            </Link>
          </div>

          {/* Quick HUD Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-gray-400 border-t border-gray-800/60 w-full">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400">⚡</span>
              <span>Level <strong className="text-white">{progress.level}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400">✨</span>
              <span><strong className="text-white">{progress.xp}</strong> XP Earned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-rose-500">🔥</span>
              <span><strong className="text-white">{progress.streakDays}</strong> Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">🏆</span>
              <span><strong className="text-white">{progress.completedProblems.length}</strong> Quests Mastered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Core Quests Grid (Unified Engine Demonstration) */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
              DATA-DRIVEN REPERTOIRE
            </span>
            <h2 className="text-2xl font-black text-white">Demonstration Quests</h2>
          </div>
          <Link
            href="/create"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>+ Add New Problem (JSON)</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((prob) => {
            const isCompleted = progress.completedProblems.includes(prob.id);

            return (
              <motion.div
                key={prob.id}
                whileHover={{ y: -4 }}
                className="p-6 bg-gray-900/60 border border-gray-800 hover:border-indigo-500/60 rounded-3xl backdrop-blur-md flex flex-col justify-between gap-5 transition-all shadow-lg group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl p-2 bg-gray-800/80 rounded-2xl border border-gray-700">
                      {prob.story.character.avatar}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          prob.difficulty === 'easy'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : prob.difficulty === 'medium'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                      {isCompleted && (
                        <span className="text-xs bg-emerald-900/50 text-emerald-300 p-1 rounded-full border border-emerald-600">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-indigo-400 font-bold uppercase">
                    {prob.category} • {prob.algorithm.pattern}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mt-1">
                    {prob.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {prob.story.missionBrief}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800/80 font-mono text-xs">
                  <span className="text-gray-500">
                    Vis: <strong className="text-gray-400">{prob.visualization.primaryType}</strong>
                  </span>
                  <Link
                    href={`/problem/${prob.id}`}
                    className="px-4 py-2 rounded-xl bg-indigo-600/30 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white border border-indigo-500/40 font-bold transition-all"
                  >
                    Launch Quest →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 14-Engine Architecture Highlights */}
      <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-3xl backdrop-blur-md flex flex-col gap-6">
        <div>
          <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
            UNIVERSAL ARCHITECTURE GUARANTEE
          </span>
          <h2 className="text-2xl font-black text-white">The 14 Unified Sub-Engines</h2>
          <p className="text-xs text-gray-400 mt-1">
            Every problem in DSA Quest is dynamically driven through structured metadata communicating with 14 modular engines.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 font-mono text-xs">
          {[
            { name: '1. Problem Registry', icon: '📦' },
            { name: '2. Story Engine', icon: '📜' },
            { name: '3. Game Engine', icon: '🎮' },
            { name: '4. Clue Engine', icon: '💡' },
            { name: '5. Visualizer Registry', icon: '🎬' },
            { name: '6. Python Tracer', icon: '🐍' },
            { name: '7. Variable Diffs', icon: '🔄' },
            { name: '8. Event Dispatcher', icon: '⚡' },
            { name: '9. AI Tutor Layer', icon: '🤖' },
            { name: '10. Practice Lab', icon: '✍️' },
            { name: '11. Big-O Lab', icon: '📊' },
            { name: '12. World Map', icon: '🗺️' },
            { name: '13. Pattern Arena', icon: '⚔️' },
            { name: '14. Creator Importer', icon: '🧩' },
          ].map((eng, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-gray-950/70 border border-gray-800 flex flex-col items-center text-center gap-1.5"
            >
              <span className="text-xl">{eng.icon}</span>
              <span className="text-[11px] font-bold text-gray-300">{eng.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
