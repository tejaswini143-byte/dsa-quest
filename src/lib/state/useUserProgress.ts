'use client';

import { useState, useEffect } from 'react';
import { UserProgress, Badge } from '@/types/gamification';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 150,
  level: 1,
  streakDays: 3,
  lastActiveDate: new Date().toISOString(),
  completedProblems: [],
  unlockedBadges: ['novice-adventurer'],
  currentWorld: 'Array Forest',
};

export const AVAILABLE_BADGES: Badge[] = [
  { id: 'novice-adventurer', title: 'Novice Adventurer', description: 'Embarked on the DSA Quest journey', icon: '⚔️', category: 'general' },
  { id: 'hash-magician', title: 'Hash Magician', description: 'Mastered O(1) instantaneous lookup memory', icon: '🔮', category: 'hashing' },
  { id: 'stack-sentinel', title: 'Stack Sentinel', description: 'Tamed the LIFO and Monotonic Stack tower', icon: '🗼', category: 'stack' },
  { id: 'island-surveyor', title: 'Island Surveyor', description: 'Mapped uncharted archipelagos with DFS & BFS', icon: '🏝️', category: 'graphs' },
  { id: 'dp-time-traveler', title: 'DP Time Traveler', description: 'Climbed enchanted staircases with state tabulation', icon: '⏳', category: 'dp' },
  { id: 'binary-sniper', title: 'Binary Sniper', description: 'Pinpointed targets in logarithmic time', icon: '🎯', category: 'binary-search' },
];

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dsa_quest_user_progress');
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem('dsa_quest_user_progress', JSON.stringify(newProgress));
    } catch {
      // ignore
    }
  };

  const addXP = (amount: number, reason?: string) => {
    const newXP = progress.xp + amount;
    const newLevel = Math.floor(newXP / 200) + 1;
    saveProgress({ ...progress, xp: newXP, level: newLevel });
  };

  const completeProblem = (problemId: string, category: string) => {
    if (progress.completedProblems.includes(problemId)) {
      addXP(50);
      return;
    }

    const updatedCompleted = [...progress.completedProblems, problemId];
    const newXP = progress.xp + 150;
    const newLevel = Math.floor(newXP / 200) + 1;
    const newBadges = [...progress.unlockedBadges];

    // Unlock category badges
    if (category === 'hashing' && !newBadges.includes('hash-magician')) newBadges.push('hash-magician');
    if (category === 'stack' && !newBadges.includes('stack-sentinel')) newBadges.push('stack-sentinel');
    if (category === 'graphs' && !newBadges.includes('island-surveyor')) newBadges.push('island-surveyor');
    if (category === 'dp' && !newBadges.includes('dp-time-traveler')) newBadges.push('dp-time-traveler');
    if (category === 'binary-search' && !newBadges.includes('binary-sniper')) newBadges.push('binary-sniper');

    saveProgress({
      ...progress,
      xp: newXP,
      level: newLevel,
      completedProblems: updatedCompleted,
      unlockedBadges: newBadges,
    });
  };

  return {
    progress,
    isLoaded,
    addXP,
    completeProblem,
    allBadges: AVAILABLE_BADGES,
  };
}
