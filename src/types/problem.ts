export type Difficulty = 'easy' | 'medium' | 'hard';

export type DSACategory =
  | 'arrays'
  | 'hashing'
  | 'two-pointers'
  | 'sliding-window'
  | 'stack'
  | 'queue'
  | 'linked-list'
  | 'binary-search'
  | 'trees'
  | 'graphs'
  | 'backtracking'
  | 'greedy'
  | 'dp';

export type VisualizationType =
  | 'array'
  | 'array-hashmap'
  | 'stack'
  | 'grid'
  | 'dp-table'
  | 'linked-list'
  | 'tree'
  | 'call-stack';

export type GameType =
  | 'pair-selection'
  | 'push-pop-stack'
  | 'grid-explorer'
  | 'dp-stair-fill'
  | 'window-slider'
  | 'pointer-walk';

export interface StoryDefinition {
  theme: string;
  missionTitle: string;
  missionBrief: string;
  analogy: string;
  character: {
    name: string;
    avatar: string;
    role: string;
  };
  realWorldScenario: string;
  comicStrip?: Array<{
    panel: number;
    imageCaption: string;
    characterDialogue: string;
    learningInsight: string;
  }>;
}

export interface ExplanationLevels {
  eli5: string;
  beginner: string;
  intermediate: string;
  interview: string;
}

export interface GameConfig {
  type: GameType;
  mission: string;
  instructions: string[];
  initialData: any;
  target?: any;
  rules: string[];
  successMessage: string;
}

export interface VisualizationConfig {
  primaryType: VisualizationType;
  secondaryTypes?: VisualizationType[];
  defaultInput: any;
  inputSchema: {
    fields: Array<{
      name: string;
      label: string;
      default: any;
      type: 'array' | 'number' | 'string' | 'grid' | 'tree';
      placeholder?: string;
    }>;
  };
}

export interface AlgorithmVariant {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  pythonCode: string;
  description: string;
  opMultiplier: number;
}

export interface AlgorithmDefinition {
  name: string;
  pattern: string;
  bruteForce: AlgorithmVariant;
  optimal: AlgorithmVariant;
}

export interface TestCase {
  id: string;
  name: string;
  input: any;
  expected: any;
  explanation: string;
}

export interface ProgressiveHint {
  stage: number;
  label: string;
  title: string;
  text: string;
  actionSuggestion?: string;
}

export interface PracticeDefinition {
  fillBlanks: {
    template: string;
    blanks: Array<{
      id: string;
      answer: string;
      options: string[];
      hint: string;
    }>;
  };
  fixBug: {
    buggyCode: string;
    bugLine: number;
    bugExplanation: string;
    options: string[];
    correctOptionIndex: number;
    correctCode: string;
  };
  predictOutput: {
    snippet: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  reorderLines: {
    scrambledLines: string[];
    correctOrder: number[];
    explanation: string;
  };
  scratchStarter: string;
}

export interface ComplexityScaling {
  time: string;
  space: string;
  formula: string;
  scalingPoints: Array<{
    n: number;
    bruteForceOps: number;
    optimalOps: number;
  }>;
}

export interface ProblemDefinition {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: DSACategory;
  patterns: string[];
  prerequisites: string[];
  story: StoryDefinition;
  explanation: ExplanationLevels;
  game: GameConfig;
  visualization: VisualizationConfig;
  algorithm: AlgorithmDefinition;
  testCases: TestCase[];
  hints: ProgressiveHint[];
  practice: PracticeDefinition;
  complexity: ComplexityScaling;
  relatedChallenges: string[];
  bossChallenge?: boolean;
}
