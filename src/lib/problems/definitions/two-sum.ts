import { ProblemDefinition } from '@/types/problem';

export const twoSumProblem: ProblemDefinition = {
  id: 'two-sum',
  title: 'Two Sum',
  slug: 'two-sum',
  difficulty: 'easy',
  category: 'hashing',
  patterns: ['Hash Map', 'Complement Lookup', 'Single Pass'],
  prerequisites: ['Array Traversal', 'Hash Table / Dictionary Basics'],

  story: {
    theme: 'ice-cream-parlor',
    missionTitle: 'The Dual Scoop Conundrum',
    missionBrief:
      'You are at Scoop Kingdom with an exact pocket budget of $9. You want to buy exactly 2 scoops whose total price adds up to your exact budget without wasting a single penny!',
    analogy:
      'Instead of asking the cashier about every possible combination of ice cream tubs (which takes forever), you write down the prices you have already seen in a quick-lookup notebook. When you see a new tub, you check your notebook: "Did I see the matching price earlier?"',
    character: {
      name: 'Scoop Master Leo',
      avatar: '🍦',
      role: 'Ice Cream Shop Manager',
    },
    realWorldScenario:
      'Searching for complementary pairs in transactions, coupon discounts, or load balancing requests.',
  },

  explanation: {
    eli5:
      'Imagine you need $9. You look at an ice cream scoop that costs $2. You say: "I need another scoop that costs $7 ($9 - $2 = $7)!" You check your magic notepad. If $7 is already written there, YOU WIN! If not, you write down $2 and check the next scoop.',
    beginner:
      'We loop through the array once. For each number, we compute `needed = target - num`. We check if `needed` exists in our dictionary `seen`. If yes, we return the stored index and the current index. If not, we store `seen[num] = i`.',
    intermediate:
      'Brute force tests every pair (i, j) in O(n²) time. By trading O(n) space for a hash table, each complement lookup runs in average O(1) time, bringing total execution to optimal O(n) time.',
    interview:
      'Key points: 1) One-pass hash map vs two-pass. 2) Handling duplicate numbers (the complement lookup checks before insertion). 3) Hash collision considerations and O(n) worst-case time in adversarial hashing, O(1) amortized. 4) Memory overhead of dict pointers.',
  },

  game: {
    type: 'pair-selection',
    mission: 'Pick 2 ice cream tubs whose values add up to the Target Sum ($9)!',
    instructions: [
      'Click on a number to inspect its needed complement.',
      'Use the hash map notebook on the right to see if the complement is already recorded.',
      'Click a second matching number to complete the order!',
    ],
    initialData: [2, 7, 11, 15],
    target: 9,
    rules: [
      'You must select exactly 2 distinct indices.',
      'The sum of the two selected values must equal 9.',
    ],
    successMessage: '🎉 Fantastic! 2 + 7 = 9. You purchased the exact ice cream combo with zero waste!',
  },

  visualization: {
    primaryType: 'array-hashmap',
    secondaryTypes: ['array'],
    defaultInput: { nums: [2, 7, 11, 15], target: 9 },
    inputSchema: {
      fields: [
        { name: 'nums', label: 'Numbers Array', default: [2, 7, 11, 15], type: 'array', placeholder: '2, 7, 11, 15' },
        { name: 'target', label: 'Target Sum', default: 9, type: 'number' },
      ],
    },
  },

  algorithm: {
    name: 'Hash Map Complement Lookup',
    pattern: 'Hashing / Frequency & Index Mapping',
    bruteForce: {
      name: 'Nested Loop Brute Force',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      pythonCode: `def two_sum_brute_force(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
      description: 'Checks all pairs (i, j). For n=1000 items, this performs ~500,000 checks!',
      opMultiplier: 1.0,
    },
    optimal: {
      name: 'One-Pass Hash Map',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      pythonCode: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        needed = target - num
        if needed in seen:
            return [seen[needed], i]
        seen[num] = i
    return []`,
      description: 'Single scan with O(1) hash map lookups. For n=1000 items, takes only 1,000 steps!',
      opMultiplier: 1.0,
    },
  },

  testCases: [
    { id: 'tc-1', name: 'Standard Case', input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1], explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
    { id: 'tc-2', name: 'Non-Adjacent Pair', input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2], explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
    { id: 'tc-3', name: 'Duplicate Numbers', input: { nums: [3, 3], target: 6 }, expected: [0, 1], explanation: 'nums[0] + nums[1] = 3 + 3 = 6' },
  ],

  hints: [
    { stage: 1, label: 'Observation', title: 'What are you looking for?', text: 'For each number x, what exact value would you need to find to reach the target?', actionSuggestion: 'Calculate needed = target - current_number' },
    { stage: 2, label: 'Memory Needs', title: 'Remembering the Past', text: 'If you could remember every number you have previously walked past in O(1) time, how would you store it?', actionSuggestion: 'Think about a dictionary mapping value -> index' },
    { stage: 3, label: 'Data Structure', title: 'Instant Lookup', text: 'A Hash Map (Python dictionary) allows checking `if needed in seen` in instantaneous O(1) average time.', actionSuggestion: 'Use seen = {}' },
    { stage: 4, label: 'Pattern Discovery', title: 'Single Pass', text: 'You can check for the complement AND store the current number in the SAME loop!', actionSuggestion: 'Check needed in seen before seen[num] = i' },
    { stage: 5, label: 'Full Blueprint', title: 'Final Code Architecture', text: 'Initialize seen = {}. In the loop: needed = target - num. If needed in seen, return [seen[needed], i]. Else seen[num] = i.', actionSuggestion: 'Write the 7 lines of Python' },
  ],

  practice: {
    fillBlanks: {
      template: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        needed = ___BLANK_1___
        if ___BLANK_2___:
            return [seen[needed], i]
        seen[___BLANK_3___] = i
    return []`,
      blanks: [
        { id: 'BLANK_1', answer: 'target - num', options: ['target - num', 'target + num', 'nums[i]', 'target // 2'], hint: 'What is the remainder needed to reach target?' },
        { id: 'BLANK_2', answer: 'needed in seen', options: ['needed in seen', 'num == target', 'seen[needed] == target', 'needed > 0'], hint: 'Check if the complement was already encountered.' },
        { id: 'BLANK_3', answer: 'num', options: ['num', 'needed', 'i', 'target'], hint: 'Store the current number as the key.' },
      ],
    },
    fixBug: {
      buggyCode: `def two_sum_buggy(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        seen[num] = i  # BUG: inserted before checking complement!
        needed = target - num
        if needed in seen:
            return [seen[needed], i]
    return []`,
      bugLine: 4,
      bugExplanation: 'If target is 6 and num is 3, inserting seen[3] = i first will cause needed (3) to immediately match itself at the exact same index i!',
      options: [
        'Insert seen[num] = i AFTER checking if needed in seen',
        'Change needed = target + num',
        'Sort the array first',
        'Use a while loop instead',
      ],
      correctOptionIndex: 0,
      correctCode: `def two_sum_fixed(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        needed = target - num
        if needed in seen:
            return [seen[needed], i]
        seen[num] = i
    return []`,
    },
    predictOutput: {
      snippet: `nums = [3, 2, 4]
target = 6
seen = {3: 0, 2: 1}
# Next iterating at index 2 (num = 4)
needed = target - num`,
      question: 'What will be returned on this step?',
      options: ['[0, 2]', '[1, 2]', '[0, 1]', 'None'],
      correctIndex: 1,
      explanation: 'needed = 6 - 4 = 2. 2 is in seen at index 1. So [seen[2], 2] => [1, 2] is returned!',
    },
    reorderLines: {
      scrambledLines: [
        '    for i, num in enumerate(nums):',
        '        if needed in seen:',
        'def two_sum(nums, target):',
        '            return [seen[needed], i]',
        '        needed = target - num',
        '        seen[num] = i',
        '    seen = {}',
      ],
      correctOrder: [2, 6, 0, 4, 1, 3, 5],
      explanation: 'Function declaration -> init seen dict -> enumerate loop -> compute needed -> check if in seen -> return match -> store in seen.',
    },
    scratchStarter: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Write your O(n) hash map solution here
    pass
`,
  },

  complexity: {
    time: 'O(n)',
    space: 'O(n)',
    formula: 'Time: n iterations * O(1) hash lookup = O(n)',
    scalingPoints: [
      { n: 10, bruteForceOps: 45, optimalOps: 10 },
      { n: 100, bruteForceOps: 4950, optimalOps: 100 },
      { n: 1000, bruteForceOps: 499500, optimalOps: 1000 },
      { n: 10000, bruteForceOps: 49995000, optimalOps: 10000 },
    ],
  },

  relatedChallenges: ['daily-temperatures', 'binary-search', 'valid-parentheses'],
  bossChallenge: false,
};
