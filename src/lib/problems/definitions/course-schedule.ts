import { ProblemDefinition } from '@/types/problem';

export const courseScheduleProblem: ProblemDefinition = {
  id: 'course-schedule',
  title: 'Course Schedule',
  slug: 'course-schedule',
  difficulty: 'medium',
  category: 'graphs',
  patterns: ['Graph', 'Topological Sort', 'Cycle Detection', 'BFS / Kahn Algorithm'],
  prerequisites: ['Number of Islands'],

  story: {
    theme: 'grand-academy-curriculum',
    missionTitle: 'The Academic Prerequisite Paradox',
    missionBrief: 'Determine if it is possible to finish all courses given prerequisite pairs without entering an infinite cycle.',
    analogy: 'Track in-degrees of all courses. Courses with 0 prerequisites can be taken immediately, unlocking subsequent courses.',
    character: { name: 'Dean Hypatia', avatar: '📜', role: 'Academy Registrar' },
    realWorldScenario: 'Package dependency resolution (e.g. npm / pip dependency graph).'
  },

  explanation: {
    eli5: 'If Math requires Physics, and Physics requires Math, you are stuck in an impossible loop! Kahn algorithm finds if you can graduate.',
    beginner: 'Build adjacency list and in-degree array. Put all 0 in-degree nodes in a queue. Pop nodes, decrement neighbor in-degrees, and push newly freed 0 in-degree nodes. If count equals numCourses, return True.',
    intermediate: 'Topological sort using Kahn algorithm (BFS) in O(V + E) time and O(V + E) space.',
    interview: 'Mention DFS 3-color cycle detection (White/Gray/Black) as an alternative approach.'
  },

  game: {
    type: 'grid-explorer',
    mission: 'Unlock courses with 0 remaining prerequisites!',
    instructions: ['Pick courses with in-degree 0', 'Free dependent nodes'],
    initialData: { numCourses: 2, prerequisites: [[1, 0]] },
    rules: ['Avoid cyclic dependencies.'],
    successMessage: '🎓 Graduation achieved! All courses successfully scheduled!'
  },

  visualization: {
    primaryType: 'array',
    defaultInput: { numCourses: 2, prerequisites: [[1, 0]] }
  },

  algorithm: {
    name: "Kahn's Topological Sort (BFS)",
    pattern: 'Graph / BFS / Topological Sort',
    bruteForce: {
      name: 'Exhaustive Path Cycle Check',
      timeComplexity: 'O(V!)',
      spaceComplexity: 'O(V)',
      pythonCode: `def can_finish_brute(numCourses, prerequisites):
    # Checks every path for cycles
    pass`,
      description: 'Exponential recursion.',
      opMultiplier: 3.0
    },
    optimal: {
      name: "Kahn's Algorithm",
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
      pythonCode: `def can_finish(numCourses, prerequisites):
    from collections import deque
    adj = {i: [] for i in range(numCourses)}
    in_degree = [0] * numCourses
    for crs, pre in prerequisites:
        adj[pre].append(crs)
        in_degree[crs] += 1
    
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    taken = 0
    while queue:
        node = queue.popleft()
        taken += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return taken == numCourses`,
      description: 'BFS topological sort with in-degree array.',
      opMultiplier: 1.0
    }
  },

  testCases: [
    { id: 'tc-1', name: 'Valid Sequence', input: { numCourses: 2, prerequisites: [[1, 0]] }, expected: true, explanation: 'Take course 0 then course 1.' }
  ],

  hints: [
    { stage: 1, label: 'Graph Model', title: 'Directed Graph', text: 'Model courses as vertices and prerequisites as directed edges.', actionSuggestion: 'Build in-degree list' }
  ],

  practice: {
    fillBlanks: {
      template: `def can_finish(numCourses, prerequisites):
    adj = {i: [] for i in range(numCourses)}
    in_degree = [0] * numCourses
    for crs, pre in prerequisites:
        adj[pre].append(crs)
        in_degree[crs] += 1
    
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    taken = 0
    while queue:
        node = queue.popleft()
        taken += 1
        for neighbor in adj[node]:
            ___BLANK_1___
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return taken == numCourses`,
      blanks: [
        { id: 'BLANK_1', answer: 'in_degree[neighbor] -= 1', options: ['in_degree[neighbor] -= 1', 'in_degree[neighbor] += 1', 'taken += 1', 'queue.pop()'], hint: 'Decrement prerequisite requirement for unlocked neighbor.' }
      ]
    },
    fixBug: {
      buggyCode: `def can_finish_buggy(numCourses, prerequisites):
    queue = [] # BUG: did not build in-degree correctly
    return len(queue) == numCourses`,
      bugLine: 1,
      bugExplanation: 'Missing in-degree counting logic.',
      options: ['Use Kahn in-degree counting algorithm', 'Use binary search', 'Return True always', 'Sort array'],
      correctOptionIndex: 0,
      correctCode: `def can_finish_fixed(numCourses, prerequisites):
    pass`
    },
    predictOutput: {
      snippet: `numCourses = 2, prerequisites = [[1, 0], [0, 1]]`,
      question: 'Can 2 courses with reciprocal prerequisites be finished?',
      options: ['False', 'True', 'None', 'Error'],
      correctIndex: 0,
      explanation: 'Mutual dependency forms a directed cycle. Impossible to finish, returns False.'
    },
    reorderLines: {
      scrambledLines: [
        'def can_finish(numCourses, prerequisites):',
        '    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])',
        '    adj = {i: [] for i in range(numCourses)}',
        '    return taken == numCourses'
      ],
      correctOrder: [0, 2, 1, 3],
      explanation: 'Define -> init graph -> queue -> return.'
    },
    scratchStarter: `def can_finish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    pass`
  },

  complexity: {
    time: 'O(V + E)',
    space: 'O(V + E)',
    formula: 'Vertices V = courses, Edges E = prerequisites',
    scalingPoints: [
      { n: 10, bruteForceOps: 100, optimalOps: 20 },
      { n: 100, bruteForceOps: 10000, optimalOps: 200 }
    ]
  },

  relatedChallenges: ['number-of-islands']
};
