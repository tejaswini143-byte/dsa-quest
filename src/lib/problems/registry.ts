import { ProblemDefinition, DSACategory } from '@/types/problem';
import { twoSumProblem } from './definitions/two-sum';
import { dailyTemperaturesProblem } from './definitions/daily-temperatures';
import { numberOfIslandsProblem } from './definitions/number-of-islands';
import { climbingStairsProblem } from './definitions/climbing-stairs';
import { validParenthesesProblem } from './definitions/valid-parentheses';
import { binarySearchProblem } from './definitions/binary-search';
import { threeSumProblem } from './definitions/three-sum';
import { coinChangeProblem } from './definitions/coin-change';
import { courseScheduleProblem } from './definitions/course-schedule';

// Seed problem map
const staticProblemMap: Record<string, ProblemDefinition> = {
  'two-sum': twoSumProblem,
  'daily-temperatures': dailyTemperaturesProblem,
  'number-of-islands': numberOfIslandsProblem,
  'climbing-stairs': climbingStairsProblem,
  'valid-parentheses': validParenthesesProblem,
  'binary-search': binarySearchProblem,
  '3sum': threeSumProblem,
  'three-sum': threeSumProblem,
  'coin-change': coinChangeProblem,
  'course-schedule': courseScheduleProblem,
};

// In-memory / custom problem registry for dynamic expansion
const dynamicProblemMap: Record<string, ProblemDefinition> = {};

export function getAllProblems(): ProblemDefinition[] {
  // Merge custom user-imported problems from localStorage if in client environment
  let customMap: Record<string, ProblemDefinition> = {};
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('dsa_quest_custom_problems');
      if (saved) {
        customMap = JSON.parse(saved);
      }
    } catch {
      // ignore
    }
  }

  const merged = { ...staticProblemMap, ...dynamicProblemMap, ...customMap };
  return Object.values(merged);
}

export function getProblemById(id: string): ProblemDefinition | null {
  if (staticProblemMap[id]) return staticProblemMap[id];
  if (dynamicProblemMap[id]) return dynamicProblemMap[id];

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('dsa_quest_custom_problems');
      if (saved) {
        const customMap = JSON.parse(saved);
        if (customMap[id]) return customMap[id];
      }
    } catch {
      // ignore
    }
  }

  return null;
}

export function getProblemsByCategory(category: DSACategory): ProblemDefinition[] {
  return getAllProblems().filter((p) => p.category === category);
}

export function getRelatedProblems(problemId: string): ProblemDefinition[] {
  const current = getProblemById(problemId);
  if (!current) return [];

  const related = current.relatedChallenges
    .map((id) => getProblemById(id))
    .filter((p): p is ProblemDefinition => p !== null);

  if (related.length === 0) {
    return getAllProblems()
      .filter((p) => p.id !== problemId)
      .slice(0, 3);
  }

  return related;
}

export function registerCustomProblem(problem: ProblemDefinition): void {
  dynamicProblemMap[problem.id] = problem;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('dsa_quest_custom_problems');
      const customMap = saved ? JSON.parse(saved) : {};
      customMap[problem.id] = problem;
      localStorage.setItem('dsa_quest_custom_problems', JSON.stringify(customMap));
    } catch {
      // ignore
    }
  }
}
