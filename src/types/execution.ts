export type SemanticEventType =
  | 'PROGRAM_START'
  | 'PROGRAM_END'
  | 'ASSIGNMENT'
  | 'VARIABLE_READ'
  | 'VARIABLE_WRITE'
  | 'VARIABLE_CHANGE'
  | 'EXPRESSION_EVALUATED'
  | 'COMPARISON'
  | 'IF_ENTER'
  | 'IF_EXIT'
  | 'LOOP_START'
  | 'LOOP_ITERATION'
  | 'LOOP_END'
  | 'FUNCTION_CALL'
  | 'FUNCTION_RETURN'
  | 'RECURSION_CALL'
  | 'RECURSION_RETURN'
  | 'LIST_CREATE'
  | 'LIST_ACCESS'
  | 'LIST_UPDATE'
  | 'DICT_CREATE'
  | 'DICT_LOOKUP'
  | 'DICT_INSERT'
  | 'DICT_UPDATE'
  | 'SET_CREATE'
  | 'SET_LOOKUP'
  | 'SET_INSERT'
  | 'OBJECT_CREATE'
  | 'ATTRIBUTE_READ'
  | 'ATTRIBUTE_WRITE'
  | 'PRINT_OUTPUT'
  | 'EXCEPTION_RAISED'
  | 'EXCEPTION_HANDLED'
  | 'RETURN_VALUE'
  // DSA Specific Events
  | 'ARRAY_ACCESS'
  | 'ARRAY_UPDATE'
  | 'ARRAY_COMPARE'
  | 'ARRAY_SWAP'
  | 'POINTER_MOVE'
  | 'POINTER_SET'
  | 'WINDOW_CREATE'
  | 'WINDOW_MOVE'
  | 'WINDOW_SHRINK'
  | 'WINDOW_EXPAND'
  | 'HASH_LOOKUP'
  | 'HASH_INSERT'
  | 'HASH_UPDATE'
  | 'HASH_DELETE'
  | 'STACK_PUSH'
  | 'STACK_POP'
  | 'STACK_PEEK'
  | 'QUEUE_ENQUEUE'
  | 'QUEUE_DEQUEUE'
  | 'LINK_CREATE'
  | 'LINK_REMOVE'
  | 'NODE_CREATE'
  | 'NODE_VISIT'
  | 'EDGE_TRAVERSE'
  | 'GRID_VISIT'
  | 'GRID_UPDATE'
  | 'GRID_HIGHLIGHT'
  | 'HEAP_PUSH'
  | 'HEAP_POP'
  | 'DP_READ'
  | 'DP_WRITE'
  | 'DP_UPDATE'
  | 'DP_COMPARE'
  | 'TREE_VISIT'
  | 'LINKED_LIST_NEXT'
  | 'CALL_STACK_PUSH'
  | 'CALL_STACK_POP'
  | 'SEARCH_SPACE_UPDATE'
  | 'PARTITION';

export type DetectedDSAStructure =
  | 'array'
  | 'string'
  | 'hash_map'
  | 'hash_set'
  | 'stack'
  | 'queue'
  | 'deque'
  | 'linked_list'
  | 'tree'
  | 'binary_search_tree'
  | 'graph'
  | 'grid'
  | 'heap'
  | 'pointer'
  | 'sliding_window'
  | 'recursion'
  | 'backtracking'
  | 'sorting'
  | 'binary_search'
  | 'dp_table'
  | 'generic';

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

export interface LinkedListNode {
  val: any;
  nextIndex?: number;
  isHead?: boolean;
  isCurr?: boolean;
}

export interface TreeNodeData {
  id: string;
  val: any;
  leftId?: string;
  rightId?: string;
  isVisited?: boolean;
  isCurrent?: boolean;
}

export interface GraphData {
  nodes: Array<{ id: string; label: string; isVisited?: boolean; isCurrent?: boolean; distance?: number }>;
  edges: Array<{ from: string; to: string; weight?: number; isTraversed?: boolean }>;
  adjacencyList?: Record<string, string[]>;
}

export interface StepMemory {
  arrays?: Record<string, any[]>;
  hashMaps?: Record<string, Record<string, any>>;
  hashSets?: Record<string, any[]>;
  stacks?: Record<string, any[]>;
  queues?: Record<string, any[]>;
  grids?: any[][];
  pointers?: Record<string, any>;
  dpTable?: any[];
  linkedLists?: Record<string, LinkedListNode[]>;
  trees?: Record<string, TreeNodeData[]>;
  graphs?: Record<string, GraphData>;
  heaps?: Record<string, any[]>;
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
  stdout?: string;
  explanation: StepExplanation;
}

export interface ExecutionTrace {
  success: boolean;
  totalSteps: number;
  steps: ExecutionStep[];
  output: any;
  stdout?: string;
  error?: string;
  detectedStructures?: DetectedDSAStructure[];
  metrics: {
    operationsCount: number;
    memoryPeak: number;
  };
}
