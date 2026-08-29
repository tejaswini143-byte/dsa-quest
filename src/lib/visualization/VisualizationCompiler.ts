import { ExecutionTrace, ExecutionStep, DetectedDSAStructure } from '@/types/execution';

export interface VisualScene {
  stepNumber: number;
  line: number;
  codeLine: string;
  activePrimitives: Array<
    | 'array'
    | 'hash_map'
    | 'hash_set'
    | 'stack'
    | 'queue'
    | 'linked_list'
    | 'tree'
    | 'graph'
    | 'grid'
    | 'heap'
    | 'dp_table'
    | 'call_stack'
    | 'generic'
  >;
  memorySnapshot: any;
  variables: Record<string, any>;
  changedVariables: string[];
  stdout: string;
  explanation: {
    whatHappened: string;
    whyItHappened: string;
    whatChanged: string;
  };
}

export class VisualizationCompiler {
  /**
   * Compiles a raw ExecutionTrace into a sequence of VisualScenes for the animation player.
   */
  static compile(trace: ExecutionTrace): VisualScene[] {
    if (!trace || !trace.steps || trace.steps.length === 0) {
      return [];
    }

    const detected = trace.detectedStructures || ['generic'];

    return trace.steps.map((step: ExecutionStep) => {
      const activePrimitives: VisualScene['activePrimitives'] = [];
      const mem = step.memory || {};

      if (mem.grids || detected.includes('grid')) {
        activePrimitives.push('grid');
      }
      if ((mem.arrays && Object.keys(mem.arrays).length > 0) || detected.includes('array')) {
        activePrimitives.push('array');
      }
      if ((mem.hashMaps && Object.keys(mem.hashMaps).length > 0) || detected.includes('hash_map')) {
        activePrimitives.push('hash_map');
      }
      if ((mem.stacks && Object.keys(mem.stacks).length > 0) || detected.includes('stack')) {
        activePrimitives.push('stack');
      }
      if ((mem.queues && Object.keys(mem.queues).length > 0) || detected.includes('queue')) {
        activePrimitives.push('queue');
      }
      if ((mem.linkedLists && Object.keys(mem.linkedLists).length > 0) || detected.includes('linked_list')) {
        activePrimitives.push('linked_list');
      }
      if ((mem.trees && Object.keys(mem.trees).length > 0) || detected.includes('tree')) {
        activePrimitives.push('tree');
      }
      if ((mem.graphs && Object.keys(mem.graphs).length > 0) || detected.includes('graph')) {
        activePrimitives.push('graph');
      }
      if ((mem.heaps && Object.keys(mem.heaps).length > 0) || detected.includes('heap')) {
        activePrimitives.push('heap');
      }
      if ((mem.dpTable && mem.dpTable.length > 0) || detected.includes('dp_table')) {
        activePrimitives.push('dp_table');
      }
      if ((mem.callStack && mem.callStack.length > 0) || detected.includes('recursion')) {
        activePrimitives.push('call_stack');
      }

      if (activePrimitives.length === 0) {
        activePrimitives.push('generic');
      }

      return {
        stepNumber: step.stepNumber,
        line: step.line,
        codeLine: step.codeLine,
        activePrimitives,
        memorySnapshot: mem,
        variables: step.variables,
        changedVariables: step.changedVariables,
        stdout: step.stdout || '',
        explanation: step.explanation,
      };
    });
  }
}
