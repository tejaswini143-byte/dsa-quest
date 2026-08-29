import { ProblemDefinition } from '@/types/problem';

export const dailyTemperaturesProblem: ProblemDefinition = {
  id: 'daily-temperatures',
  title: 'Daily Temperatures',
  slug: 'daily-temperatures',
  difficulty: 'medium',
  category: 'stack',
  patterns: ['Monotonic Stack', 'Next Greater Element', 'Index Tracking'],
  prerequisites: ['Stack Data Structure', 'Array Indexing'],

  story: {
    theme: 'weather-observatory',
    missionTitle: 'The Barometer of Frost Peak',
    missionBrief:
      'You are the chief meteorologist at Frost Peak Observatory. For each daily temperature reading, determine how many days the residents must wait until a strictly warmer day arrives!',
    analogy:
      'Imagine stacking barometer cards in a glass tube from coolest to hottest. Whenever a hot sun wave arrives, it melts all cooler cards sitting on top of the stack and awards them their waiting days before jumping into the tube!',
    character: {
      name: 'Meteorologist Wendy',
      avatar: '🌡️',
      role: 'Chief Weather Forecaster',
    },
    realWorldScenario:
      'Calculating stock price breakout windows, seismic wave peak intervals, or monotonic buffer evaluation in real-time sensor streams.',
  },

  explanation: {
    eli5:
      'Every day has a temperature. If today is colder than previous days, we wait in line (the stack). As soon as a hot day arrives, it frees all the colder days that were waiting behind it and tells them: "You had to wait X days for me!"',
    beginner:
      'We use a stack to keep track of previous days that have not yet found a warmer day. The stack stores indices. When current temperature is higher than `temperatures[stack[-1]]`, we pop the index and record the day difference: `i - prev_day`.',
    intermediate:
      'The stack maintains a monotonic decreasing invariant. Because each index is pushed onto the stack exactly once and popped at most once, the aggregate work across all iterations is strictly O(n) linear time, avoiding the naive O(n²) nested loop.',
    interview:
      'Monotonic Stack archetype. 1) Explain why we store indices instead of raw temperature values (needed for distance math). 2) Highlight the amortized O(1) pops. 3) Contrast with Next Greater Element I/II.',
  },

  game: {
    type: 'push-pop-stack',
    mission: 'Pop colder days from the stack when a warmer day arrives, then push the current day!',
    instructions: [
      'Look at today\'s temperature at the pointer.',
      'If today is warmer than the top of the stack, click POP to resolve that waiting day!',
      'Once the stack top is warmer or empty, click PUSH to store today\'s index.',
    ],
    initialData: [73, 74, 75, 71, 69, 72, 76, 73],
    rules: [
      'Always resolve stack top if current temperature > stack top temperature.',
      'Push the current index when no more colder days remain on stack.',
    ],
    successMessage: '🎉 Perfect forecast! All days have their exact warmer day countdown resolved!',
  },

  visualization: {
    primaryType: 'stack',
    secondaryTypes: ['array'],
    defaultInput: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] },
    inputSchema: {
      fields: [
        { name: 'temperatures', label: 'Daily Temperatures (°F)', default: [73, 74, 75, 71, 69, 72, 76, 73], type: 'array', placeholder: '73, 74, 75, 71, 69, 72, 76, 73' },
      ],
    },
  },

  algorithm: {
    name: 'Monotonic Decreasing Stack',
    pattern: 'Monotonic Stack / Next Greater Element',
    bruteForce: {
      name: 'Nested Loop Scan',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      pythonCode: `def daily_temperatures_brute(temperatures):
    n = len(temperatures)
    ans = [0] * n
    for i in range(n):
        for j in range(i + 1, n):
            if temperatures[j] > temperatures[i]:
                ans[i] = j - i
                break
    return ans`,
      description: 'For each day, scans forward one by one until a warmer day is found.',
      opMultiplier: 1.0,
    },
    optimal: {
      name: 'Monotonic Decreasing Stack',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      pythonCode: `def daily_temperatures(temperatures):
    n = len(temperatures)
    ans = [0] * n
    stack = []  # indices
    for i, current_temp in enumerate(temperatures):
        while stack and current_temp > temperatures[stack[-1]]:
            prev_day = stack.pop()
            ans[prev_day] = i - prev_day
        stack.append(i)
    return ans`,
      description: 'Maintains indices in decreasing order. Each index enters and leaves stack at most once.',
      opMultiplier: 1.0,
    },
  },

  testCases: [
    { id: 'tc-1', name: 'Standard Week', input: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] }, expected: [1, 1, 4, 2, 1, 1, 0, 0], explanation: '73 -> 74 (1d), 74 -> 75 (1d), 75 -> 76 (4d)...' },
    { id: 'tc-2', name: 'Strictly Rising', input: { temperatures: [30, 40, 50, 60] }, expected: [1, 1, 1, 0], explanation: 'Each day is immediately warmer than the previous.' },
    { id: 'tc-3', name: 'Strictly Falling', input: { temperatures: [30, 60, 90] }, expected: [1, 1, 0], explanation: 'Days resolve sequentially.' },
  ],

  hints: [
    { stage: 1, label: 'Observation', title: 'The Next Greater Element', text: 'You are searching for the first element to the right that is strictly greater than the current element.', actionSuggestion: 'Notice the distance = j - i' },
    { stage: 2, label: 'Memory Needs', title: 'What Must We Store?', text: 'If we visit colder days, they cannot be resolved yet. We must store their INDICES so we can compute the day difference later.', actionSuggestion: 'Store index i in a stack' },
    { stage: 3, label: 'Data Structure', title: 'Why a Stack?', text: 'The most recent coldest days are at the top. When a warmer day arrives, it resolves the top elements first in LIFO order!', actionSuggestion: 'Use stack = []' },
    { stage: 4, label: 'Pattern Discovery', title: 'Monotonic Invariant', text: 'The temperatures corresponding to stack indices will always be in descending order: e.g. 75° -> 71° -> 69°.', actionSuggestion: 'While current > stack top: pop & resolve' },
    { stage: 5, label: 'Full Blueprint', title: 'Linear Algorithm', text: 'Init ans=[0]*n, stack=[]. Loop i, temp. While stack & temp > temps[stack[-1]]: prev = stack.pop(); ans[prev] = i - prev. stack.append(i).', actionSuggestion: 'Write the optimal solution' },
  ],

  practice: {
    fillBlanks: {
      template: `def daily_temperatures(temperatures):
    ans = [0] * len(temperatures)
    stack = []
    for i, current_temp in enumerate(temperatures):
        while stack and ___BLANK_1___:
            prev_day = stack.pop()
            ans[prev_day] = ___BLANK_2___
        stack.append(___BLANK_3___)
    return ans`,
      blanks: [
        { id: 'BLANK_1', answer: 'current_temp > temperatures[stack[-1]]', options: ['current_temp > temperatures[stack[-1]]', 'current_temp < temperatures[stack[-1]]', 'len(stack) > 0', 'current_temp == temperatures[i]'], hint: 'Check if today is strictly warmer than the day on top of the stack.' },
        { id: 'BLANK_2', answer: 'i - prev_day', options: ['i - prev_day', 'prev_day - i', 'current_temp', '1'], hint: 'How many days elapsed between day i and prev_day?' },
        { id: 'BLANK_3', answer: 'i', options: ['i', 'current_temp', 'prev_day', 'ans'], hint: 'Push the current index onto the stack.' },
      ],
    },
    fixBug: {
      buggyCode: `def daily_temperatures_buggy(temperatures):
    ans = [0] * len(temperatures)
    stack = []
    for i, current_temp in enumerate(temperatures):
        # BUG: stored temperature value instead of index
        while stack and current_temp > stack[-1]:
            prev_temp = stack.pop()
            ans[i] = i - prev_temp
        stack.append(current_temp)
    return ans`,
      bugLine: 4,
      bugExplanation: 'The stack stored the temperature number rather than the day index, so ans[i] calculation and element matching was corrupted.',
      options: [
        'Store day index i in the stack and compare temperatures[stack[-1]]',
        'Use a queue instead of a stack',
        'Sort temperatures before scanning',
        'Change while loop to if condition',
      ],
      correctOptionIndex: 0,
      correctCode: `def daily_temperatures_fixed(temperatures):
    ans = [0] * len(temperatures)
    stack = []
    for i, current_temp in enumerate(temperatures):
        while stack and current_temp > temperatures[stack[-1]]:
            prev_day = stack.pop()
            ans[prev_day] = i - prev_day
        stack.append(i)
    return ans`,
    },
    predictOutput: {
      snippet: `temps = [70, 75, 71]
# Stack has [1] (day 1 = 75°). Current day is i=2 (71°).
# Is 71 > 75? No.`,
      question: 'What will the stack contain after processing day 2?',
      options: ['[1, 2]', '[2]', '[0, 1, 2]', '[]'],
      correctIndex: 0,
      explanation: 'Since 71° is not warmer than 75°, index 1 remains and index 2 is appended: stack = [1, 2].',
    },
    reorderLines: {
      scrambledLines: [
        '        while stack and current_temp > temperatures[stack[-1]]:',
        'def daily_temperatures(temperatures):',
        '        stack.append(i)',
        '    ans = [0] * len(temperatures)',
        '            ans[prev_day] = i - prev_day',
        '    for i, current_temp in enumerate(temperatures):',
        '            prev_day = stack.pop()',
        '    stack = []',
      ],
      correctOrder: [1, 3, 7, 5, 0, 6, 4, 2],
      explanation: 'Define function -> allocate ans -> init stack -> loop enumerate -> while stack & condition -> pop prev -> update wait distance -> push current index.',
    },
    scratchStarter: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    # Implement the monotonic stack solution
    pass
`,
  },

  complexity: {
    time: 'O(n)',
    space: 'O(n)',
    formula: 'Time: Each index is pushed and popped at most 1 time -> 2n operations total = O(n)',
    scalingPoints: [
      { n: 10, bruteForceOps: 45, optimalOps: 18 },
      { n: 100, bruteForceOps: 4950, optimalOps: 190 },
      { n: 1000, bruteForceOps: 499500, optimalOps: 1980 },
      { n: 10000, bruteForceOps: 49995000, optimalOps: 19980 },
    ],
  },

  relatedChallenges: ['valid-parentheses', 'two-sum', 'climbing-stairs'],
  bossChallenge: false,
};
