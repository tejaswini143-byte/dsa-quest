export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt?: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedProblems: string[];
  unlockedBadges: string[];
  currentWorld: string;
}

export interface WorldMapNode {
  id: string;
  title: string;
  realmName: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  coords: { x: number; y: number };
  problemIds: string[];
  bossProblemId?: string;
  isUnlocked: boolean;
}
