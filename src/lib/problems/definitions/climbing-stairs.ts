import { ProblemDefinition } from '@/types/problem';

export const climbingStairsProblem: ProblemDefinition = {
  id: 'climbing-stairs',
  title: 'Climbing Stairs',
  slug: 'climbing-stairs',
  difficulty: 'easy',
  category: 'dp',
  patterns: ['Dynamic Programming', 'Tabulation', 'Memoization', 'Fibonacci Sequence'],
  prerequisites: ['Recursion Basics', 'Subproblem Overlap'],

  story: {
    theme: 'magical-staircase',
    missionTitle: 'The Staircase of the Ancient Mage',
    missionBrief:
      'You are climbing a grand enchanted staircase to reach the sky castle at step N. At each stride, your magical boots can leap either exactly 1 step or 2 steps. How many distinct ways can you climb to the top?',
    analogy:
      'To reach step 5, you could have only jumped from step 4 (a 1-step leap) OR from step 3 (a 2-step leap). So, total ways to step 5 is simply (ways to step 4) + (ways to step 3)! Each step stands on the shoulders of the two steps before it.',
    character: {
      name: 'Mage Merlin',
      avatar: '🧙‍♂️',
      role: 'Guardian of the Staircase',
    },
    realWorldScenario:
      'Tiling problems, robot grid pathing, coin change variations, or counting combinatorial state pathways in finite automata.',
  },

  explanation: {
    eli5:
      'If you are at step 3, you can get there from step 2 (1 jump) or from step 1 (2 jumps). So add the ways for step 1 and step 2 together! It is like the magic Fibonacci numbers: 1, 2, 3, 5, 8, 13...',
    beginner:
      'We recognize optimal substructure and overlapping subproblems: `dp[i] = dp[i-1] + dp[i-2]`. Base cases are `dp[1] = 1` and `dp[2] = 2`. We fill an array `dp` from 3 up to `n`.',
    intermediate:
      'Naive recursion computes overlapping branches in O(2ⁿ) exponential time. By applying Tabulation (bottom-up DP) or Memoization (top-down), we eliminate redundant calculations, reducing time complexity to O(n) and space to O(1) with two rolling variables.',
    interview:
      'Canonical 1D DP archetype. 1) Derive recurrence from first principles. 2) Show state transition from O(2ⁿ) naive recursion -> O(n) memoized -> O(n) tabulated -> O(1) space optimization -> O(log n) matrix exponentiation or Binet\'s formula.',
  },

  game: {
    type: 'dp-stair-fill',
    mission: 'Calculate each step\'s total paths by combining the previous 2 steps until you reach the top of the tower!',
    instructions: [
      'Observe the base cases: Step 1 = 1 way, Step 2 = 2 ways.',
      'For the current step i, calculate: dp[i - 1] + dp[i - 2].',
      'Click the matching value to ascend the staircase!',
    ],
    initialData: { n: 5, baseCases: { 1: 1, 2: 2 } },
    target: 5,
    rules: [
      'Every step i must equal the exact sum of step (i-1) and step (i-2).',
      'Climb all the way to step N.',
    ],
    successMessage: '🏰 Glorious! You conquered all steps with optimal dynamic programming!',
  },

  visualization: {
    primaryType: 'dp-table',
    secondaryTypes: ['call-stack'],
    defaultInput: { n: 5 },
    inputSchema: {
      fields: [
        { name: 'n', label: 'Number of Steps (N)', default: 5, type: 'number', placeholder: '5' },
      ],
    },
  },

  algorithm: {
    name: '1D Dynamic Programming Tabulation',
    pattern: 'Dynamic Programming / Fibonacci',
    bruteForce: {
      name: 'Naive Recursion (No Memo)',
      timeComplexity: 'O(2ⁿ)',
      spaceComplexity: 'O(n)',
      pythonCode: `def climb_stairs_recursive(n):
    if n <= 2:
        return n
    # Redundantly recomputes subproblems exponentially!
    return climb_stairs_recursive(n - 1) + climb_stairs_recursive(n - 2)`,
      description: 'Exponential tree with redundant branches. For n=40, this makes over 1,000,000,000 recursive calls!',
      opMultiplier: 2.0,
    },
    optimal: {
      name: 'Bottom-Up Tabulation (O(n))',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      pythonCode: `def climb_stairs(n):
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2, prev1 = prev1, curr
    return prev1`,
      description: 'Calculates each step sequentially using previously computed results in linear time.',
      opMultiplier: 1.0,
    },
  },

  testCases: [
    { id: 'tc-1', name: '2 Steps', input: { n: 2 }, expected: 2, explanation: '1+1 or 2 = 2 ways.' },
    { id: 'tc-2', name: '3 Steps', input: { n: 3 }, expected: 3, explanation: '1+1+1, 1+2, 2+1 = 3 ways.' },
    { id: 'tc-3', name: '5 Steps', input: { n: 5 }, expected: 8, explanation: 'Fibonacci progression: 1, 2, 3, 5, 8.' },
  ],

  hints: [
    { stage: 1, label: 'Observation', title: 'The Last Step', text: 'To arrive at step n, what were the only two possible previous steps you could have come from?', actionSuggestion: 'Step (n-1) or Step (n-2)' },
    { stage: 2, label: 'Subproblem Formula', title: 'Combining Paths', text: 'Ways(n) = Ways(n-1) [take a 1-step leap] + Ways(n-2) [take a 2-step leap].', actionSuggestion: 'Formulate dp[n] = dp[n-1] + dp[n-2]' },
    { stage: 3, label: 'Base Cases', title: 'Where do we start?', text: 'For n = 1: 1 way. For n = 2: 2 ways (1+1 or 2).', actionSuggestion: 'Set dp[1] = 1, dp[2] = 2' },
    { stage: 4, label: 'Space Optimization', title: 'Two Rolling Variables', text: 'To compute dp[i], you only need the immediate past two values: prev1 and prev2. No need for a full array!', actionSuggestion: 'Use prev1, prev2 = 2, 1' },
    { stage: 5, label: 'Full Blueprint', title: 'Linear DP Loop', text: 'Handle n <= 2. Loop from 3 to n: curr = prev1 + prev2; prev2 = prev1; prev1 = curr. Return prev1.', actionSuggestion: 'Write the 6-line solution' },
  ],

  practice: {
    fillBlanks: {
      template: `def climb_stairs(n):
    if n <= 2:
        return ___BLANK_1___
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = ___BLANK_2___ + ___BLANK_3___
    return dp[n]`,
      blanks: [
        { id: 'BLANK_1', answer: 'n', options: ['n', '0', '1', '2'], hint: 'For n=1 returns 1, for n=2 returns 2.' },
        { id: 'BLANK_2', answer: 'dp[i - 1]', options: ['dp[i - 1]', 'dp[i]', 'dp[1]', 'i - 1'], hint: 'Ways from one step below.' },
        { id: 'BLANK_3', answer: 'dp[i - 2]', options: ['dp[i - 2]', 'dp[0]', 'dp[i - 3]', '2'], hint: 'Ways from two steps below.' },
      ],
    },
    fixBug: {
      buggyCode: `def climb_stairs_buggy(n):
    if n <= 2: return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(2, n): # BUG: wrong loop boundaries! misses step n and duplicates step 2
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
      bugLine: 5,
      bugExplanation: 'Loop range(2, n) starts from 2 (overwriting base case dp[2]) and stops before n, returning unpopulated dp[n] = 0.',
      options: [
        'Change loop range to range(3, n + 1)',
        'Change dp array size to n',
        'Add dp[i] = dp[i-1] * 2',
        'Return dp[n-1]',
      ],
      correctOptionIndex: 0,
      correctCode: `def climb_stairs_fixed(n):
    if n <= 2: return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
    },
    predictOutput: {
      snippet: `dp[1] = 1
dp[2] = 2
dp[3] = 3
dp[4] = 5
# What is dp[5]?`,
      question: 'What is the value of dp[5]?',
      options: ['8', '7', '10', '6'],
      correctIndex: 0,
      explanation: 'dp[5] = dp[4] (5) + dp[3] (3) = 8 ways.',
    },
    reorderLines: {
      scrambledLines: [
        '    for i in range(3, n + 1):',
        'def climb_stairs(n):',
        '    dp = [0] * (n + 1)',
        '    return dp[n]',
        '        dp[i] = dp[i-1] + dp[i-2]',
        '    if n <= 2: return n',
        '    dp[1], dp[2] = 1, 2',
      ],
      correctOrder: [1, 5, 2, 6, 0, 4, 3],
      explanation: 'Function declaration -> base case check -> allocate array -> set base cases -> loop from 3 to n -> state recurrence -> return dp[n].',
    },
    scratchStarter: `def climb_stairs(n: int) -> int:
    # Write your O(n) DP solution
    pass
`,
  },

  complexity: {
    time: 'O(n)',
    space: 'O(1)',
    formula: 'Time: (n - 2) arithmetic additions = O(n). Space: Two integer variables = O(1).',
    scalingPoints: [
      { n: 5, bruteForceOps: 15, optimalOps: 5 },
      { n: 10, bruteForceOps: 177, optimalOps: 10 },
      { n: 20, bruteForceOps: 21891, optimalOps: 20 },
      { n: 35, bruteForceOps: 29860703, optimalOps: 35 },
    ],
  },

  relatedChallenges: ['number-of-islands', 'two-sum', 'daily-temperatures'],
  bossChallenge: false,
};
