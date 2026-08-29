import { ProblemDefinition } from '@/types/problem';

export const threeSumProblem: ProblemDefinition = {
  id: '3sum',
  title: '3Sum',
  slug: '3sum',
  difficulty: 'medium',
  category: 'two-pointers',
  patterns: ['Two Pointers', 'Sorting', 'Triplets'],
  prerequisites: ['Two Sum', 'Two Pointers'],

  story: {
    theme: 'ancient-triangle-vault',
    missionTitle: 'The Tri-Rune Equilibrium',
    missionBrief: 'Find all unique triplets [a, b, c] in an array such that a + b + c = 0.',
    analogy: 'Fix the first element, then use two pointers from both remaining ends to converge on the zero balance point.',
    character: { name: 'Sage Pythagoras', avatar: '🔺', role: 'Grand Geometrician' },
    realWorldScenario: 'Triangular arbitrage detection and 3-way balance matching.'
  },

  explanation: {
    eli5: 'Sort the numbers first! Pick one number, then use two pointers on the rest of the numbers to see if you can find two that cancel it out to zero.',
    beginner: 'Sort array. Loop i from 0 to n-3. If i > 0 and nums[i] == nums[i-1], skip duplicate. Set left = i+1, right = n-1. If sum == 0, record triplet and shift pointers while skipping duplicates.',
    intermediate: 'Sorting takes O(n log n). Fixing one element reduces 3Sum to Two Sum II with two pointers in O(n) per element -> overall O(n²) time and O(1) extra space.',
    interview: 'Standard FAANG interview question. Emphasize duplicate avoidance at both the outer loop and inside the two-pointer loop.'
  },

  game: {
    type: 'pointer-walk',
    mission: 'Adjust left and right pointers to find triplets summing to 0!',
    instructions: ['Fix the first item', 'Move left or right pointer inward'],
    initialData: [-1, 0, 1, 2, -1, -4],
    target: 0,
    rules: ['Triplets must be unique.'],
    successMessage: '🔺 Perfect balance! Found all zero-sum triplets!'
  },

  visualization: {
    primaryType: 'array',
    secondaryTypes: [],
    defaultInput: { nums: [-1, 0, 1, 2, -1, -4] },
    inputSchema: {
      fields: [{ name: 'nums', label: 'Array', default: [-1, 0, 1, 2, -1, -4], type: 'array' }]
    }
  },

  algorithm: {
    name: 'Sort + Two Pointers',
    pattern: 'Two Pointers / Sorting',
    bruteForce: {
      name: 'Triple Nested Loops',
      timeComplexity: 'O(n³)',
      spaceComplexity: 'O(1)',
      pythonCode: `def three_sum_brute(nums):
    res = set()
    nums.sort()
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            for k in range(j + 1, len(nums)):
                if nums[i] + nums[j] + nums[k] == 0:
                    res.add((nums[i], nums[j], nums[k]))
    return list(res)`,
      description: 'Checks all triplets (i, j, k).',
      opMultiplier: 2.0
    },
    optimal: {
      name: 'Sort + Two Pointers',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      pythonCode: `def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]: l += 1
                while l < r and nums[r] == nums[r - 1]: r -= 1
                l += 1; r -= 1
    return res`,
      description: 'Sorts array and uses two pointers for O(n²) time.',
      opMultiplier: 1.0
    }
  },

  testCases: [
    { id: 'tc-1', name: 'Standard Array', input: { nums: [-1, 0, 1, 2, -1, -4] }, expected: [[-1, -1, 2], [-1, 0, 1]], explanation: '[-1, -1, 2] and [-1, 0, 1] sum to 0.' }
  ],

  hints: [
    { stage: 1, label: 'Observation', title: 'Can sorting help?', text: 'If the array is sorted, how can two pointers help find pairs for a fixed number?', actionSuggestion: 'Sort first' },
    { stage: 2, label: 'Duplicate Handling', title: 'Unique Triplets', text: 'Skip duplicates for both outer index i and inner pointers l and r.', actionSuggestion: 'if nums[i] == nums[i-1]: continue' }
  ],

  practice: {
    fillBlanks: {
      template: `def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and ___BLANK_1___: continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0: l += 1
            elif s > 0: r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                ___BLANK_2___
    return res`,
      blanks: [
        { id: 'BLANK_1', answer: 'nums[i] == nums[i - 1]', options: ['nums[i] == nums[i - 1]', 'nums[i] == 0', 'i == l', 'nums[i] > 0'], hint: 'Skip duplicate values for fixed first element.' },
        { id: 'BLANK_2', answer: 'l += 1; r -= 1', options: ['l += 1; r -= 1', 'break', 'return res', 'l = 0'], hint: 'Advance both pointers after finding valid triplet.' }
      ]
    },
    fixBug: {
      buggyCode: `def three_sum_buggy(nums):
    nums.sort()
    res = []
    for i in range(len(nums)): # BUG: bounds and no duplicate check
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0: res.append([nums[i], nums[l], nums[r]])
            l += 1`,
      bugLine: 4,
      bugExplanation: 'Does not skip duplicate numbers causing identical triplets in the output.',
      options: ['Add duplicate skipping for i, l, r', 'Remove sort', 'Use hash map', 'Change s == 0 to s > 0'],
      correctOptionIndex: 0,
      correctCode: `def three_sum_fixed(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]: continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0: l += 1
            elif s > 0: r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]: l += 1
                while l < r and nums[r] == nums[r - 1]: r -= 1
                l += 1; r -= 1
    return res`
    },
    predictOutput: {
      snippet: `nums = [0, 1, 1]`,
      question: 'What is returned for nums = [0, 1, 1]?',
      options: ['[]', '[[0, 1, 1]]', '[[0, 0, 0]]', 'None'],
      correctIndex: 0,
      explanation: 'Sum is 2, not 0. No triplet sums to 0, so [] is returned.'
    },
    reorderLines: {
      scrambledLines: [
        'def three_sum(nums):',
        '    for i in range(len(nums) - 2):',
        '        l, r = i + 1, len(nums) - 1',
        '    nums.sort()',
        '    return res',
        '    res = []'
      ],
      correctOrder: [0, 3, 5, 1, 2, 4],
      explanation: 'Function declaration -> sort -> init res -> loop i -> set pointers -> return.'
    },
    scratchStarter: `def three_sum(nums: list[int]) -> list[list[int]]:
    pass`
  },

  complexity: {
    time: 'O(n²)',
    space: 'O(1)',
    formula: 'Time: O(n log n) sort + O(n²) two pointers = O(n²)',
    scalingPoints: [
      { n: 10, bruteForceOps: 120, optimalOps: 45 },
      { n: 100, bruteForceOps: 161700, optimalOps: 4950 }
    ]
  },

  relatedChallenges: ['two-sum', 'binary-search']
};
