import { ProblemDefinition } from '@/types/problem';

export const validParenthesesProblem: ProblemDefinition = {
  id: 'valid-parentheses',
  title: 'Valid Parentheses',
  slug: 'valid-parentheses',
  difficulty: 'easy',
  category: 'stack',
  patterns: ['Stack', 'Matching Pairs', 'LIFO Invariant'],
  prerequisites: ['Stack Basics', 'String Traversal'],

  story: {
    theme: 'ancient-temple-portal',
    missionTitle: 'The Rune Seals of Atlantis',
    missionBrief:
      'You are unlocking ancient temple doors guarded by nested rune parentheses `()`, `[]`, `{}`. Every opening seal must be matched and locked by its corresponding closing seal in exact reverse order!',
    analogy:
      'Think of stacking plates in a cafeteria dispenser. You can only put plates on top, and you must take off the most recent plate first before you can reach the ones underneath.',
    character: {
      name: 'Archaeologist Maya',
      avatar: '🗿',
      role: 'Rune Decoder',
    },
    realWorldScenario:
      'Compiler syntax parsing, HTML/XML tag validation, mathematical equation balancing, or JSON structure verification.',
  },

  explanation: {
    eli5:
      'When you see `(`, `[`, or `{`, push it into your stack bucket. When you see a closing symbol `)`, `]`, or `}`, check the top of your bucket: does it match? If yes, pop it off! If everything is empty at the end, it is valid!',
    beginner:
      'We use a stack and a dictionary mapping closing brackets to opening brackets. For each character: if it is an opener, push to stack. If it is a closer, pop top and verify match. If mismatch or empty stack, return False.',
    intermediate:
      'Stack LIFO (Last-In First-Out) property guarantees proper nesting structure. O(n) single pass with O(n) worst-case space.',
    interview:
      'Classic interview question. Discuss: early exit on odd string length, string character sets, and memory footprint.',
  },

  game: {
    type: 'push-pop-stack',
    mission: 'Push opening runes to the stack and pop matching pairs when closing runes appear!',
    instructions: [
      'For opening runes `(`, `[`, `{`: Click PUSH.',
      'For closing runes `)`, `]`, `}`: Click POP to match the top of the stack.',
      'Ensure the stack is completely clear by the end of the spell!',
    ],
    initialData: '()[]{}',
    rules: [
      'Closing bracket must match top of stack exactly.',
      'Stack must be empty after all characters are processed.',
    ],
    successMessage: '✨ Portal unlocked! The rune sequence is mathematically valid!',
  },

  visualization: {
    primaryType: 'stack',
    secondaryTypes: ['array'],
    defaultInput: { s: '()[]{}' },
    inputSchema: {
      fields: [
        { name: 's', label: 'Bracket String', default: '()[]{}', type: 'string', placeholder: '()[]{}' },
      ],
    },
  },

  algorithm: {
    name: 'Stack LIFO Matching',
    pattern: 'Stack / Bracket Matching',
    bruteForce: {
      name: 'String Replacement Substring Search',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(n)',
      pythonCode: `def is_valid_brute(s):
    while "()" in s or "[]" in s or "{}" in s:
        s = s.replace("()", "").replace("[]", "").replace("{}", "")
    return s == ""`,
      description: 'Repeatedly replaces adjacent pairs, copying the string on every cycle.',
      opMultiplier: 1.5,
    },
    optimal: {
      name: 'Stack LIFO Linear Pass',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      pythonCode: `def is_valid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`,
      description: 'Single scan using stack for instant O(1) top comparisons.',
      opMultiplier: 1.0,
    },
  },

  testCases: [
    { id: 'tc-1', name: 'Sequential Pairs', input: { s: '()[]{}' }, expected: true, explanation: 'All pairs open and close cleanly.' },
    { id: 'tc-2', name: 'Nested Pairs', input: { s: '{[()]}' }, expected: true, explanation: 'Properly nested brackets.' },
    { id: 'tc-3', name: 'Mismatched Bracket', input: { s: '(]' }, expected: false, explanation: 'Closing bracket ] does not match opening (.' },
  ],

  hints: [
    { stage: 1, label: 'Observation', title: 'Nesting Order', text: 'Notice that the most recently opened bracket must be the very first one closed.', actionSuggestion: 'Think LIFO (Last In, First Out)' },
    { stage: 2, label: 'Data Structure', title: 'Stack Container', text: 'A stack is the natural data structure for tracking nested environments.', actionSuggestion: 'Use stack = []' },
    { stage: 3, label: 'Lookup Mapping', title: 'Matching Pairs', text: 'Create a dictionary: mapping = {")": "(", "}": "{", "]": "["}.', actionSuggestion: 'Map closer -> opener' },
    { stage: 4, label: 'Early Exits', title: 'Odd Length Check', text: 'If len(s) is odd, it is impossible to have matched pairs. Return False immediately.', actionSuggestion: 'if len(s) % 2 != 0: return False' },
    { stage: 5, label: 'Full Blueprint', title: 'Linear Algorithm', text: 'Loop char in s: if in mapping, pop top & compare. Else push char. Finally return len(stack) == 0.', actionSuggestion: 'Assemble the stack code' },
  ],

  practice: {
    fillBlanks: {
      template: `def is_valid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if ___BLANK_1___ else '#'
            if ___BLANK_2___:
                return False
        else:
            stack.append(___BLANK_3___)
    return len(stack) == 0`,
      blanks: [
        { id: 'BLANK_1', answer: 'stack', options: ['stack', 'mapping', 'len(s) > 0', 'char'], hint: 'Check if stack is non-empty before popping.' },
        { id: 'BLANK_2', answer: 'mapping[char] != top', options: ['mapping[char] != top', 'mapping[char] == top', 'top == "#"', 'len(stack) == 0'], hint: 'Verify if the expected opener does not match popped item.' },
        { id: 'BLANK_3', answer: 'char', options: ['char', 'mapping[char]', 'top', 's'], hint: 'Push current opening bracket to stack.' },
      ],
    },
    fixBug: {
      buggyCode: `def is_valid_buggy(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            # BUG: crashes if stack is empty when encountering closing bracket!
            top = stack.pop()
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return True # BUG: forgets to check if unclosed openers remain!`,
      bugLine: 6,
      bugExplanation: 'Calling stack.pop() on an empty stack raises IndexError, and returning True without checking len(stack) == 0 mistakenly accepts unclosed strings like "(".',
      options: [
        'Safely pop with fallback and return len(stack) == 0',
        'Use a queue instead of a stack',
        'Return False at the beginning',
        'Remove mapping dictionary',
      ],
      correctOptionIndex: 0,
      correctCode: `def is_valid_fixed(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return len(stack) == 0`,
    },
    predictOutput: {
      snippet: `s = "([)]"`,
      question: 'Is string "([)]" considered valid parentheses?',
      options: ['False (Invalid nesting)', 'True (Valid pairs)', 'Runtime Error', 'None'],
      correctIndex: 0,
      explanation: 'The brackets overlap instead of nesting: ) attempts to match [ which is a mismatch.',
    },
    reorderLines: {
      scrambledLines: [
        'def is_valid(s):',
        '        else: stack.append(char)',
        '    stack = []',
        '    return len(stack) == 0',
        '    for char in s:',
        '        if char in mapping:',
        '    mapping = {")": "(", "}": "{", "]": "["}',
        '            if not stack or stack.pop() != mapping[char]: return False',
      ],
      correctOrder: [0, 2, 6, 4, 5, 7, 1, 3],
      explanation: 'Define function -> initialize stack -> map closers -> loop chars -> check closer match -> else push -> return stack emptiness.',
    },
    scratchStarter: `def is_valid(s: str) -> bool:
    # Implement the stack solution
    pass
`,
  },

  complexity: {
    time: 'O(n)',
    space: 'O(n)',
    formula: 'Time: n characters traversed once = O(n). Space: Stack holds at most n characters = O(n).',
    scalingPoints: [
      { n: 10, bruteForceOps: 25, optimalOps: 10 },
      { n: 100, bruteForceOps: 2500, optimalOps: 100 },
      { n: 1000, bruteForceOps: 250000, optimalOps: 1000 },
      { n: 10000, bruteForceOps: 25000000, optimalOps: 10000 },
    ],
  },

  relatedChallenges: ['daily-temperatures', 'two-sum', 'climbing-stairs'],
  bossChallenge: false,
};
