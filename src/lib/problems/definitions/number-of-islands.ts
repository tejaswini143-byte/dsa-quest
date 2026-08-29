import { ProblemDefinition } from '@/types/problem';

export const numberOfIslandsProblem: ProblemDefinition = {
  id: 'number-of-islands',
  title: 'Number of Islands',
  slug: 'number-of-islands',
  difficulty: 'medium',
  category: 'graphs',
  patterns: ['2D Matrix Traversal', 'Depth First Search (DFS)', 'Breadth First Search (BFS)', 'Connected Components'],
  prerequisites: ['2D Arrays / Matrices', 'Recursion / Stack or Queue'],

  story: {
    theme: 'archipelago-cartographer',
    missionTitle: 'Charting the Uncharted Archipelago',
    missionBrief:
      'You are a high-seas navigator exploring a vast archipelago. Satellite scans show 1s (land) and 0s (water). How many completely separate islands exist across the sea?',
    analogy:
      'Imagine dropping dye on dry land. The dye immediately spreads across all touching land cells (North, South, East, West) until it hits ocean water. That entire dyed zone is ONE island! Count how many times you had to drop new dye.',
    character: {
      name: 'Captain Coral',
      avatar: '🧭',
      role: 'Explorer & Cartographer',
    },
    realWorldScenario:
      'Counting clusters in satellite imagery, segmenting objects in computer vision, or finding isolated subgraphs in social networks.',
  },

  explanation: {
    eli5:
      'When you see land ("1"), you jump on it and yell: "New Island!" Then you walk to all connected land neighbors and mark them as visited (sink them) so you don\'t count the same island twice.',
    beginner:
      'We loop through every cell (r, c) in the grid. When we find "1", we increment our island count, then launch a DFS/BFS to visit and mark all connected "1"s as "0" (or "V") in 4 directions.',
    intermediate:
      'This is a Connected Components problem on an implicit graph where grid cells are vertices and 4-directional adjacencies are edges. Total time is O(M × N) where each cell is visited at most 5 times (1 outer scan + 4 neighbor checks).',
    interview:
      'Key topics: 1) In-place grid mutation vs visited set (space trade-off). 2) Recursion call-stack depth in DFS (O(M×N) worst case) vs BFS queue memory. 3) Union-Find alternative for streaming dynamic grids.',
  },

  game: {
    type: 'grid-explorer',
    mission: 'Click on uncharted land ("1") to flood-fill and discover all islands in the archipelago!',
    instructions: [
      'Click on any green land cell ("1").',
      'Watch the flood-fill expand and survey the entire connected island.',
      'Find all hidden islands without missing any single land tile!',
    ],
    initialData: [
      ['1', '1', '0', '0', '0'],
      ['1', '1', '0', '0', '0'],
      ['0', '0', '1', '0', '0'],
      ['0', '0', '0', '1', '1'],
    ],
    rules: [
      'Connected horizontally or vertically forms the same island.',
      'Diagonal land tiles are NOT connected.',
    ],
    successMessage: '🏝️ Magnificent! You charted all 3 unique islands in the archipelago!',
  },

  visualization: {
    primaryType: 'grid',
    secondaryTypes: ['call-stack'],
    defaultInput: {
      grid: [
        ['1', '1', '0', '0', '0'],
        ['1', '1', '0', '0', '0'],
        ['0', '0', '1', '0', '0'],
        ['0', '0', '0', '1', '1'],
      ],
    },
    inputSchema: {
      fields: [
        {
          name: 'grid',
          label: 'Ocean Grid Matrix',
          default: [
            ['1', '1', '0', '0', '0'],
            ['1', '1', '0', '0', '0'],
            ['0', '0', '1', '0', '0'],
            ['0', '0', '0', '1', '1'],
          ],
          type: 'grid',
        },
      ],
    },
  },

  algorithm: {
    name: 'DFS Flood Fill',
    pattern: 'Graph DFS / Connected Components',
    bruteForce: {
      name: 'Unmarked Re-traversal',
      timeComplexity: 'O((M×N)²)',
      spaceComplexity: 'O(M×N)',
      pythonCode: `# Naive approach without visited marking suffers exponential re-exploration
def num_islands_naive(grid):
    pass`,
      description: 'Without marking visited cells, algorithms revisit the same paths infinitely.',
      opMultiplier: 3.0,
    },
    optimal: {
      name: 'DFS / BFS In-Place Sinking',
      timeComplexity: 'O(M × N)',
      spaceComplexity: 'O(M × N)',
      pythonCode: `def num_islands(grid):
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    islands = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'  # Mark visited / sink land
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
    return islands`,
      description: 'Linear scan of grid + linear flood fill. Every cell processed in O(1) constant amortized steps.',
      opMultiplier: 1.0,
    },
  },

  testCases: [
    {
      id: 'tc-1',
      name: '3 Separate Islands',
      input: {
        grid: [
          ['1', '1', '0', '0', '0'],
          ['1', '1', '0', '0', '0'],
          ['0', '0', '1', '0', '0'],
          ['0', '0', '0', '1', '1'],
        ],
      },
      expected: 3,
      explanation: 'Top-left 2x2 island + center single-cell island + bottom-right 1x2 island = 3 total islands.',
    },
    {
      id: 'tc-2',
      name: '1 Giant Connected Island',
      input: {
        grid: [
          ['1', '1', '1'],
          ['0', '1', '0'],
          ['1', '1', '1'],
        ],
      },
      expected: 1,
      explanation: 'All 1s are connected via the central vertical bridge.',
    },
  ],

  hints: [
    { stage: 1, label: 'Observation', title: 'What defines an Island?', text: 'An island is surrounded by water (0s) and formed by connecting adjacent lands horizontally or vertically.', actionSuggestion: 'Scan rows and columns' },
    { stage: 2, label: 'Preventing Double Counting', title: 'The Sinking Trick', text: 'Once you discover an island, how do you make sure you don\'t count its other tiles as separate islands later?', actionSuggestion: 'Mutate visited "1"s into "0"s or mark visited' },
    { stage: 3, label: 'Traversal Mechanism', title: 'Flood Fill Directions', text: 'When you are at (r, c), explore the 4 neighbors: (r+1, c), (r-1, c), (r, c+1), (r, c-1).', actionSuggestion: 'Write a helper dfs(r, c)' },
    { stage: 4, label: 'Boundary Guarding', title: 'Base Cases', text: 'Ensure you return immediately if r < 0, r >= rows, c < 0, c >= cols, or cell is not "1".', actionSuggestion: 'Guard against index out of bounds' },
    { stage: 5, label: 'Full Blueprint', title: 'Complete DFS Algorithm', text: 'Iterate r in range(rows), c in range(cols). If grid[r][c] == "1": islands += 1; dfs(r, c). Return islands.', actionSuggestion: 'Combine loop + DFS helper' },
  ],

  practice: {
    fillBlanks: {
      template: `def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    islands = 0

    def dfs(r, c):
        if ___BLANK_1___:
            return
        grid[r][c] = '0'
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if ___BLANK_2___:
                islands += 1
                ___BLANK_3___
    return islands`,
      blanks: [
        { id: 'BLANK_1', answer: 'r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1"', options: ['r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1"', 'r == rows and c == cols', 'grid[r][c] == "0"', 'islands > 0'], hint: 'Check grid bounds and unvisited land status.' },
        { id: 'BLANK_2', answer: 'grid[r][c] == "1"', options: ['grid[r][c] == "1"', 'grid[r][c] == "0"', 'r == c', 'islands == 0'], hint: 'When do we trigger a new island count?' },
        { id: 'BLANK_3', answer: 'dfs(r, c)', options: ['dfs(r, c)', 'islands += 1', 'grid[r][c] = "1"', 'return islands'], hint: 'Launch the flood-fill from the current root cell.' },
      ],
    },
    fixBug: {
      buggyCode: `def num_islands_buggy(grid):
    rows, cols = len(grid), len(grid[0])
    islands = 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        # BUG: forgot to sink/mark cell as '0' -> causes infinite recursion!
        dfs(r + 1, c)
        dfs(r - 1, c)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
    return islands`,
      bugLine: 7,
      bugExplanation: 'Without marking grid[r][c] = "0", the recursive DFS will ping-pong between neighbor cells endlessly, causing Maximum Recursion Depth Exceeded.',
      options: [
        'Add grid[r][c] = "0" before making recursive calls',
        'Remove the inner dfs helper',
        'Change rows to cols',
        'Count 0s instead of 1s',
      ],
      correctOptionIndex: 0,
      correctCode: `def num_islands_fixed(grid):
    rows, cols = len(grid), len(grid[0])
    islands = 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
    return islands`,
    },
    predictOutput: {
      snippet: `grid = [
  ['1', '0'],
  ['0', '1']
]`,
      question: 'How many islands are in this 2x2 diagonal grid?',
      options: ['2', '1', '4', '0'],
      correctIndex: 0,
      explanation: 'Diagonals do NOT count as connected in 4-directional adjacency. Therefore, there are 2 separate 1-cell islands.',
    },
    reorderLines: {
      scrambledLines: [
        '        grid[r][c] = "0"',
        'def num_islands(grid):',
        '        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1": return',
        '    for r in range(rows):',
        '            if grid[r][c] == "1": islands += 1; dfs(r, c)',
        '    def dfs(r, c):',
        '        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)',
        '    rows, cols, islands = len(grid), len(grid[0]), 0',
      ],
      correctOrder: [1, 7, 5, 2, 0, 6, 3, 4],
      explanation: 'Function header -> dimensions setup -> dfs definition -> boundary guard -> mark visited -> recursive directions -> nested loops -> return islands.',
    },
    scratchStarter: `def num_islands(grid: list[list[str]]) -> int:
    # Implement 2D Grid DFS or BFS
    pass
`,
  },

  complexity: {
    time: 'O(M × N)',
    space: 'O(M × N)',
    formula: 'Time: Every cell is visited at most 4 times = O(M × N). Space: Recursion call stack max depth O(M × N).',
    scalingPoints: [
      { n: 10, bruteForceOps: 100, optimalOps: 30 },
      { n: 50, bruteForceOps: 2500, optimalOps: 150 },
      { n: 100, bruteForceOps: 10000, optimalOps: 300 },
      { n: 500, bruteForceOps: 250000, optimalOps: 1500 },
    ],
  },

  relatedChallenges: ['climbing-stairs', 'two-sum', 'daily-temperatures'],
  bossChallenge: false,
};
