export type SemanticEventType =
  | 'ARRAY_ACCESS'
  | 'ARRAY_UPDATE'
  | 'ARRAY_COMPARE'
  | 'ARRAY_SWAP'
  | 'POINTER_MOVE'
  | 'POINTER_SET'
  | 'HASH_LOOKUP'
  | 'HASH_INSERT'
  | 'HASH_DELETE'
  | 'STACK_PUSH'
  | 'STACK_POP'
  | 'STACK_PEEK'
  | 'GRID_VISIT'
  | 'GRID_UPDATE'
  | 'GRID_HIGHLIGHT'
  | 'DP_UPDATE'
  | 'DP_COMPARE'
  | 'TREE_VISIT'
  | 'LINKED_LIST_NEXT'
  | 'CALL_STACK_PUSH'
  | 'CALL_STACK_POP'
  | 'RETURN_VALUE';

export interface SemanticEvent {
  type: SemanticEventType;
  target: string;
  payload: Record<string, any>;
  description: string;
}

export interface StackFrame {
  fnName: string;
  args: Record<string, any>;
  line: number;
  returnValue?: any;
}

export interface StepMemory {
  arrays?: Record<string, any[]>;
  hashMaps?: Record<string, Record<string, any>>;
  stacks?: Record<string, any[]>;
  grids?: any[][];
  pointers?: Record<string, any>;
  dpTable?: any[];
  callStack?: StackFrame[];
}

export interface StepExplanation {
  whatHappened: string;
  whyItHappened: string;
  whatChanged: string;
}

export interface ExecutionStep {
  stepNumber: number;
  line: number;
  codeLine: string;
  variables: Record<string, any>;
  previousVariables?: Record<string, any>;
  changedVariables: string[];
  memory: StepMemory;
  events: SemanticEvent[];
  explanation: StepExplanation;
}

export interface ExecutionTrace {
  success: boolean;
  totalSteps: number;
  steps: ExecutionStep[];
  output: any;
  error?: string;
  metrics: {
    operationsCount: number;
    memoryPeak: number;
  };
}
