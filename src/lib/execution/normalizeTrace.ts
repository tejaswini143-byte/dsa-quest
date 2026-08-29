import { ExecutionTrace, ExecutionStep } from '@/types/execution';

/**
 * Normalizes a raw execution step so all properties are guaranteed non-null.
 */
export function normalizeExecutionStep(step: any): ExecutionStep {
  return {
    stepNumber: typeof step?.stepNumber === 'number' ? step.stepNumber : 1,
    line: typeof step?.line === 'number' ? step.line : 1,
    codeLine: typeof step?.codeLine === 'string' ? step.codeLine : '',
    variables: step?.variables && typeof step.variables === 'object' ? step.variables : {},
    previousVariables: step?.previousVariables && typeof step.previousVariables === 'object' ? step.previousVariables : {},
    changedVariables: Array.isArray(step?.changedVariables) ? step.changedVariables : [],
    memory: {
      arrays: step?.memory?.arrays ?? {},
      hashMaps: step?.memory?.hashMaps ?? {},
      hashSets: step?.memory?.hashSets ?? {},
      stacks: step?.memory?.stacks ?? {},
      queues: step?.memory?.queues ?? {},
      grids: step?.memory?.grids ?? null,
      pointers: step?.memory?.pointers ?? {},
      dpTable: step?.memory?.dpTable ?? null,
      linkedLists: step?.memory?.linkedLists ?? {},
      trees: step?.memory?.trees ?? {},
      graphs: step?.memory?.graphs ?? {},
      heaps: step?.memory?.heaps ?? {},
      callStack: Array.isArray(step?.memory?.callStack) ? step.memory.callStack : [],
    },
    events: Array.isArray(step?.events) ? step.events : [],
    stdout: typeof step?.stdout === 'string' ? step.stdout : '',
    explanation: {
      whatHappened: step?.explanation?.whatHappened ?? '',
      whyItHappened: step?.explanation?.whyItHappened ?? '',
      whatChanged: step?.explanation?.whatChanged ?? '',
    },
  };
}

/**
 * Normalizes an entire ExecutionTrace and all child steps.
 */
export function normalizeExecutionTrace(trace: any): ExecutionTrace {
  if (!trace || typeof trace !== 'object') {
    return {
      success: false,
      totalSteps: 0,
      steps: [],
      output: null,
      stdout: '',
      error: 'Invalid trace payload',
      detectedStructures: ['generic'],
      metrics: { operationsCount: 0, memoryPeak: 0 },
    };
  }

  const rawSteps = Array.isArray(trace.steps) ? trace.steps : [];
  const normalizedSteps = rawSteps.map(normalizeExecutionStep);

  return {
    success: !!trace.success,
    totalSteps: normalizedSteps.length,
    steps: normalizedSteps,
    output: trace.output !== undefined ? trace.output : null,
    stdout: typeof trace.stdout === 'string' ? trace.stdout : '',
    error: trace.error ? String(trace.error) : undefined,
    detectedStructures: Array.isArray(trace.detectedStructures) && trace.detectedStructures.length > 0
      ? trace.detectedStructures
      : ['generic'],
    metrics: {
      operationsCount: trace?.metrics?.operationsCount ?? normalizedSteps.length,
      memoryPeak: trace?.metrics?.memoryPeak ?? 0,
    },
  };
}
