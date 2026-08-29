import { ProblemDefinition } from '@/types/problem';

export const binarySearchProblem: ProblemDefinition = {
  id: 'binary-search',
  title: 'Binary Search',
  slug: 'binary-search',
  difficulty: 'easy',
  category: 'binary-search',
  patterns: ['Binary Search', 'Divide and Conquer', 'Two Pointers'],
  prerequisites: ['Sorted Array', 'Floor Division'],

  story: {
    theme: 'high-low-guessing-game',
    missionTitle: 'The King’s Secret Vault Code',
    missionBrief:
      'The royal kingdom vault combination is a sorted secret integer array. King Arthur gives you high/low clues after each guess. Find the exact target in the minimum possible turns!',
    analogy:
      'Opening a physical telephone directory dictionary: you open directly to the middle page. If the name comes before, you throw away the entire right half of the book and repeat on the left half.',
    character: {
      name: 'King Arthur',
      avatar: '👑',
      role: 'Guardian of the Royal Vault',
    },
    realWorldScenario:
      'Database B-Tree index lookups, Git bisect to find regression commits, or numerical optimization bounds.',
  },

  explanation: {
    eli5:
      'If someone asks you to guess a number between 1 and 100, you guess 50. If they say "Too high!", you know it must be between 1 and 49. You cut the remaining possibilities in half every single guess!',
    beginner:
      'With left = 0 and right = len(nums) - 1, compute mid = (left + right) // 2. If nums[mid] == target, return mid. If nums[mid] < target, search right (left = mid + 1). Else search left (right = mid - 1).',
    intermediate:
      'Time complexity is O(log n) because the search space of size N is halved on every iteration: N -> N/2 -> N/4 -> ... -> 1. Total steps = log₂(N).',
    interview:
      'Critical interview checks: 1) Integer overflow prevention: mid = left + (right - left) // 2. 2) Loop condition: left <= right vs left < right. 3) Lower bound vs Upper bound bisect variations.',
  },

  game: {
    type: 'pointer-walk',
    mission: 'Adjust the Left and Right pointers to cut the search space and pinpoint the Target value!',
    instructions: [
      'Look at the calculated mid value.',
      'If mid is too small, move LEFT pointer rightward.',
      'If mid is too big, move RIGHT pointer leftward.',
    ],
    initialData: [-1, 0, 3, 5, 9, 12],
    target: 9,
    rules: [
      'Array is strictly sorted in ascending order.',
      'Find the target with at most 3 guesses.',
    ],
    successMessage: '🎯 Bullseye! Target found in logarithmic time!',
  },

  visualization: {
    primaryType: 'array',
    secondaryTypes: [],
    defaultInput: { nums: [-1, 0, 3, 5, 9, 12], target: 9 },
    inputSchema: {
      fields: [
        { name: 'nums', label: 'Sorted Array', default: [-1, 0, 3, 5, 9, 12], type: 'array' },
        { name: 'target', label: 'Target Number', default: 9, type: 'number' },
      ],
    },
  },

  algorithm: {
    name: 'Binary Search (O(log n))',
    pattern: 'Binary Search / Halving Search Space',
    bruteForce: {
      name: 'Linear Scan',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      pythonCode: `def search_linear(nums, target):
    for i, num in enumerate(nums):
        if num == target:
            return i
    return -1`,
      description: 'Checks elements one by one from left to right.',
      opMultiplier: 1.0,
    },
    optimal: {
      name: 'Iterative Binary Search',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      pythonCode: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
      description: 'Halves the search range in each step, taking at most ~20 operations for 1,000,000 items.',
      opMultiplier: 1.0,
    },
  },

  testCases: [
    { id: 'tc-1', name: 'Element Present', input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expected: 4, explanation: 'nums[4] = 9' },
    { id: 'tc-2', name: 'Element Absent', input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expected: -1, explanation: '2 is not in nums.' },
  ],

  hints: [
    { stage: 1, label: 'Observation', title: 'Array is Sorted', text: 'Since the array is sorted, comparing target with the middle element tells you with 100% certainty which half contains the target.', actionSuggestion: 'Compute mid index' },
    { stage: 2, label: 'Pointer Logic', title: 'Adjusting Boundaries', text: 'If nums[mid] < target, the target cannot be anywhere at or to the left of mid. Set left = mid + 1.', actionSuggestion: 'Move left or right pointer' },
    { stage: 3, label: 'Termination Condition', title: 'While Condition', text: 'Keep searching while left <= right. When left exceeds right, the entire search space is exhausted.', actionSuggestion: 'while left <= right' },
    { stage: 4, label: 'Overflow Guard', title: 'Mid Calculation', text: 'In languages like C++ or Java, (left + right) can overflow 32-bit integers. Use left + (right - left) // 2.', actionSuggestion: 'Safe mid arithmetic' },
    { stage: 5, label: 'Full Blueprint', title: 'Logarithmic Code', text: 'left, right = 0, len(nums)-1. While left <= right: mid = (left+right)//2. Return mid if matched, else adjust.', actionSuggestion: 'Write binary search' },
  ],

  practice: {
    fillBlanks: {
      template: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while ___BLANK_1___:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = ___BLANK_2___
        else:
            right = ___BLANK_3___
    return -1`,
      blanks: [
        { id: 'BLANK_1', answer: 'left <= right', options: ['left <= right', 'left < right', 'mid != target', 'right > 0'], hint: 'Include single element search when left == right.' },
        { id: 'BLANK_2', answer: 'mid + 1', options: ['mid + 1', 'mid', 'right - 1', 'mid - 1'], hint: 'Move left boundary beyond mid.' },
        { id: 'BLANK_3', answer: 'mid - 1', options: ['mid - 1', 'mid', 'left + 1', '0'], hint: 'Move right boundary before mid.' },
      ],
    },
    fixBug: {
      buggyCode: `def search_buggy(nums, target):
    left, right = 0, len(nums) - 1
    while left < right: # BUG: misses 1-element arrays or targets at boundary when left == right!
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid
        else:
            right = mid
    return -1`,
      bugLine: 3,
      bugExplanation: 'Using left < right misses search when left == right, and using left = mid causes infinite loops.',
      options: [
        'Change while condition to left <= right and use left = mid + 1, right = mid - 1',
        'Sort the array again inside the loop',
        'Return 0 instead of -1',
        'Use len(nums) for right',
      ],
      correctOptionIndex: 0,
      correctCode: `def search_fixed(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    },
    predictOutput: {
      snippet: `nums = [1, 3, 5, 7, 9]
target = 8
# left=0, right=4 -> mid=2 (5) < 8 -> left=3
# left=3, right=4 -> mid=3 (7) < 8 -> left=4
# left=4, right=4 -> mid=4 (9) > 8 -> right=3
# left (4) > right (3) -> loop terminates`,
      question: 'What is returned for target = 8?',
      options: ['-1', '4', '3', 'None'],
      correctIndex: 0,
      explanation: 'Target 8 is not in the array, so -1 is returned after search space exhaustion.',
    },
    reorderLines: {
      scrambledLines: [
        '        elif nums[mid] < target: left = mid + 1',
        'def search(nums, target):',
        '        if nums[mid] == target: return mid',
        '    while left <= right:',
        '        else: right = mid - 1',
        '    left, right = 0, len(nums) - 1',
        '        mid = (left + right) // 2',
        '    return -1',
      ],
      correctOrder: [1, 5, 3, 6, 2, 0, 4, 7],
      explanation: 'Function declaration -> pointers init -> while loop -> mid calc -> equality match -> left shift -> right shift -> return -1.',
    },
    scratchStarter: `def search(nums: list[int], target: int) -> int:
    # Write binary search
    pass
`,
  },

  complexity: {
    time: 'O(log n)',
    space: 'O(1)',
    formula: 'Time: log₂(n) halving iterations. Space: 3 pointer integers = O(1).',
    scalingPoints: [
      { n: 16, bruteForceOps: 16, optimalOps: 4 },
      { n: 1024, bruteForceOps: 1024, optimalOps: 10 },
      { n: 1048576, bruteForceOps: 1048576, optimalOps: 20 },
      { n: 1000000000, bruteForceOps: 1000000000, optimalOps: 30 },
    ],
  },

  relatedChallenges: ['two-sum', 'climbing-stairs', 'valid-parentheses'],
  bossChallenge: false,
};
