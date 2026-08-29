import { ProblemDefinition } from '@/types/problem';

export const coinChangeProblem: ProblemDefinition = {
  id: 'coin-change',
  title: 'Coin Change',
  slug: 'coin-change',
  difficulty: 'medium',
  category: 'dp',
  patterns: ['Dynamic Programming', 'Unbounded Knapsack'],
  prerequisites: ['Climbing Stairs'],

  story: {
    theme: 'alchemist-forge',
    missionTitle: 'The Alchemist Exact Denominations',
    missionBrief: 'Find the minimum number of coins needed to make up a given amount.',
    analogy: 'Build from 0 up to amount. For each amount, test using each coin and take min(dp[amount - coin] + 1).',
    character: { name: 'Alchemist Hermes', avatar: '🪙', role: 'Treasury Master' },
    realWorldScenario: 'Automated cash register change dispensing.'
  },

  explanation: {
    eli5: 'If you want 11 cents and have coins 1, 2, 5: ask how many coins to make 10, 9, and 6 cents. Pick the lowest and add 1 coin!',
    beginner: 'Create dp array of size amount + 1 filled with infinity. dp[0] = 0. For each i from 1 to amount, for each coin in coins: if i - coin >= 0, dp[i] = min(dp[i], dp[i - coin] + 1).',
    intermediate: 'Bottom-up DP tabulation with O(amount * len(coins)) time and O(amount) space.',
    interview: 'Mention edge case where amount cannot be formed (return -1) and base case dp[0] = 0.'
  },

  game: {
    type: 'dp-stair-fill',
    mission: 'Fill DP table with fewest coins!',
    instructions: ['Select minimum of previous valid states + 1'],
    initialData: { coins: [1, 2, 5], amount: 11 },
    rules: ['Pick optimal subproblem.'],
    successMessage: '🪙 Exact change rendered in minimum coins!'
  },

  visualization: {
    primaryType: 'dp-table',
    defaultInput: { coins: [1, 2, 5], amount: 11 }
  },

  algorithm: {
    name: 'Bottom-up DP',
    pattern: 'Dynamic Programming',
    bruteForce: {
      name: 'Recursive DFS',
      timeComplexity: 'O(S^n)',
      spaceComplexity: 'O(S)',
      pythonCode: `def coin_change_brute(coins, amount):
    if amount == 0: return 0
    if amount < 0: return -1
    min_coins = float('inf')
    for c in coins:
        res = coin_change_brute(coins, amount - c)
        if res >= 0: min_coins = min(min_coins, res + 1)
    return min_coins if min_coins != float('inf') else -1`,
      description: 'Exponential tree search.',
      opMultiplier: 3.0
    },
    optimal: {
      name: 'DP Tabulation',
      timeComplexity: 'O(amount * coins)',
      spaceComplexity: 'O(amount)',
      pythonCode: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      description: 'Linear state space with coin transitions.',
      opMultiplier: 1.0
    }
  },

  testCases: [
    { id: 'tc-1', name: 'Amount 11', input: { coins: [1, 2, 5], amount: 11 }, expected: 3, explanation: '5 + 5 + 1 = 11 (3 coins)' }
  ],

  hints: [
    { stage: 1, label: 'Subproblem', title: 'Optimal Substructure', text: 'To get amount X, you used one coin C plus the optimal way to make X - C.', actionSuggestion: 'dp[x] = min(dp[x-c] + 1)' }
  ],

  practice: {
    fillBlanks: {
      template: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], ___BLANK_1___)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      blanks: [
        { id: 'BLANK_1', answer: 'dp[i - c] + 1', options: ['dp[i - c] + 1', 'dp[i] + 1', 'c + 1', 'dp[i - 1]'], hint: 'Previous state value plus 1 coin.' }
      ]
    },
    fixBug: {
      buggyCode: `def coin_change_buggy(coins, amount):
    dp = [0] * (amount + 1) # BUG: should be inf
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0: dp[i] = min(dp[i], dp[i-c] + 1)`,
      bugLine: 2,
      bugExplanation: 'Initializing array with 0 causes min() to always choose 0.',
      options: ['Initialize with float("inf")', 'Sort coins descending', 'Multiply by -1', 'Add dp[0] = 1'],
      correctOptionIndex: 0,
      correctCode: `def coin_change_fixed(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0: dp[i] = min(dp[i], dp[i-c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`
    },
    predictOutput: {
      snippet: `coins = [2], amount = 3`,
      question: 'What is returned for coins = [2], amount = 3?',
      options: ['-1', '0', '1', '2'],
      correctIndex: 0,
      explanation: '3 cannot be formed using only coins of value 2. Returns -1.'
    },
    reorderLines: {
      scrambledLines: [
        'def coin_change(coins, amount):',
        '    dp = [float("inf")] * (amount + 1)',
        '    dp[0] = 0',
        '    for i in range(1, amount + 1):',
        '        for c in coins: if i >= c: dp[i] = min(dp[i], dp[i-c] + 1)',
        '    return dp[amount] if dp[amount] != float("inf") else -1'
      ],
      correctOrder: [0, 1, 2, 3, 4, 5],
      explanation: 'Define -> allocate DP -> base case -> nested loops -> return.'
    },
    scratchStarter: `def coin_change(coins: list[int], amount: int) -> int:
    pass`
  },

  complexity: {
    time: 'O(amount * n)',
    space: 'O(amount)',
    formula: 'amount states * len(coins) transitions',
    scalingPoints: [
      { n: 10, bruteForceOps: 100, optimalOps: 30 },
      { n: 100, bruteForceOps: 50000, optimalOps: 300 }
    ]
  },

  relatedChallenges: ['climbing-stairs']
};
