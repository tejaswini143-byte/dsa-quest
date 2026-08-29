'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './globals.css';
import { useUserProgress } from '@/lib/state/useUserProgress';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { progress, allBadges } = useUserProgress();
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dsa_quest_gemini_key', apiKeyInput.trim());
      alert('API Key updated successfully in local storage!');
      setShowSettingsModal(false);
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        <title>DSA Quest — Universal DSA Learning Engine</title>
        <meta
          name="description"
          content="Learn Data Structures & Algorithms by playing it, seeing it, and solving it. A universal, data-driven educational engine."
        />
      </head>
      <body className="bg-[#0a0d14] text-white min-h-screen flex flex-col justify-between antialiased">
        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-lg font-black shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                ⚔️
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base tracking-tight font-mono text-white flex items-center gap-1">
                  DSA <span className="text-indigo-400">QUEST</span>
                </span>
                <span className="text-[9px] font-mono text-gray-400 tracking-widest uppercase">
                  Universal Engine
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-semibold text-gray-300">
              <Link href="/playground" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                <span>🐍</span> Python Playground
              </Link>
              <Link href="/map" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                <span>🗺️</span> World Map
              </Link>
              <Link href="/arena" className="hover:text-purple-400 transition-colors flex items-center gap-1">
                <span>⚔️</span> Pattern Arena
              </Link>
              <Link href="/create" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                <span>🧩</span> Creator Lab
              </Link>
            </nav>

            {/* User Gamification Stats & Controls */}
            <div className="flex items-center gap-3">
              {/* Badges Button */}
              <button
                onClick={() => setShowBadgesModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-850 border border-gray-800 rounded-xl text-xs font-mono text-amber-300 transition-all shadow"
              >
                <span>🏆</span>
                <span className="hidden sm:inline">Badges</span>
                <span className="text-[10px] bg-amber-950 px-1.5 py-0.2 rounded border border-amber-800">
                  {progress.unlockedBadges.length}
                </span>
              </button>

              {/* Settings / API Key */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white transition-all text-xs"
                title="Settings & AI Key"
              >
                ⚙️
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-gray-850/80 bg-gray-950/60 py-8 px-4 font-mono text-xs text-gray-500 text-center">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <strong className="text-gray-300">DSA QUEST</strong> — Universal Data Structures & Algorithms Engine
            </div>
            <div className="flex gap-4">
              <Link href="/map" className="hover:text-gray-300">World Map</Link>
              <Link href="/arena" className="hover:text-gray-300">Pattern Arena</Link>
              <Link href="/create" className="hover:text-gray-300">Problem Creator</Link>
            </div>
          </div>
        </footer>

        {/* Badges Modal */}
        {showBadgesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>🏆</span> Quest Trophy Hall
                </h3>
                <button
                  onClick={() => setShowBadgesModal(false)}
                  className="text-gray-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto py-1">
                {allBadges.map((b) => {
                  const isUnlocked = progress.unlockedBadges.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className={`p-3 rounded-2xl border flex items-center gap-3 ${
                        isUnlocked
                          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200 shadow'
                          : 'bg-gray-950/40 border-gray-850 text-gray-600 opacity-60'
                      }`}
                    >
                      <span className="text-2xl">{b.icon}</span>
                      <div className="flex flex-col text-xs font-mono">
                        <span className="font-bold text-white">{b.title}</span>
                        <span className="text-[10px] text-gray-400">{b.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>⚙️</span> Engine Settings & AI Tutor
                </h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-white text-base font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-300 font-semibold">Google Gemini API Key:</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Optional: Paste custom Gemini API key..."
                  className="p-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  DSA Quest works fully offline with its built-in expert knowledge base. Adding a Gemini key enables live customized tutoring!
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveApiKey}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
