'use client';

import React from 'react';
import { ProblemDefinition } from '@/types/problem';
import { ExecutionStep, DetectedDSAStructure } from '@/types/execution';
import { ArrayVisualizer } from './ArrayVisualizer';
import { HashMapVisualizer } from './HashMapVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { QueueVisualizer } from './QueueVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { GridVisualizer } from './GridVisualizer';
import { DPTableVisualizer } from './DPTableVisualizer';
import { HeapVisualizer } from './HeapVisualizer';
import { CallStackVisualizer } from './CallStackVisualizer';

interface UniversalVisualizerProps {
  problem?: ProblemDefinition;
  step?: ExecutionStep;
  activeInput?: any;
  detectedStructures?: DetectedDSAStructure[];
}

export const UniversalVisualizer: React.FC<UniversalVisualizerProps> = ({
  problem,
  step,
  activeInput,
  detectedStructures = [],
}) => {
  const memory = step?.memory || {};
  const variables = step?.variables || {};
  const events = step?.events || [];

  // Extract array data
  const primaryArrayKey = memory.arrays && Object.keys(memory.arrays).length > 0 ? Object.keys(memory.arrays)[0] : undefined;
  const arrayData = primaryArrayKey && memory.arrays
    ? memory.arrays[primaryArrayKey]
    : activeInput?.nums || activeInput?.temperatures || undefined;

  // Extract hash map data
  const primaryHashMapKey = memory.hashMaps && Object.keys(memory.hashMaps).length > 0 ? Object.keys(memory.hashMaps)[0] : undefined;
  const hashMapData = primaryHashMapKey && memory.hashMaps
    ? memory.hashMaps[primaryHashMapKey]
    : variables.seen || undefined;

  // Extract lookup events
  const lookupEvent = events.find((e) => e.type === 'HASH_LOOKUP');
  const lookupKey = lookupEvent?.payload?.key;
  const lookupFound = lookupEvent?.payload?.found;

  // Extract stack data
  const primaryStackKey = memory.stacks && Object.keys(memory.stacks).length > 0 ? Object.keys(memory.stacks)[0] : undefined;
  const stackData = primaryStackKey && memory.stacks
    ? memory.stacks[primaryStackKey]
    : variables.stack || undefined;

  // Extract queue data
  const primaryQueueKey = memory.queues && Object.keys(memory.queues).length > 0 ? Object.keys(memory.queues)[0] : undefined;
  const queueData = primaryQueueKey && memory.queues
    ? memory.queues[primaryQueueKey]
    : variables.queue || undefined;

  // Extract grid data
  const gridData = memory.grids || activeInput?.grid || undefined;

  // Extract DP table
  const dpData = memory.dpTable || variables.dp || undefined;

  // Extract Linked List
  const primaryLLKey = memory.linkedLists && Object.keys(memory.linkedLists).length > 0 ? Object.keys(memory.linkedLists)[0] : undefined;
  const linkedListData = primaryLLKey && memory.linkedLists ? memory.linkedLists[primaryLLKey] : undefined;

  // Extract Tree
  const primaryTreeKey = memory.trees && Object.keys(memory.trees).length > 0 ? Object.keys(memory.trees)[0] : undefined;
  const treeData = primaryTreeKey && memory.trees ? memory.trees[primaryTreeKey] : undefined;

  // Extract Graph
  const primaryGraphKey = memory.graphs && Object.keys(memory.graphs).length > 0 ? Object.keys(memory.graphs)[0] : undefined;
  const graphData = primaryGraphKey && memory.graphs ? memory.graphs[primaryGraphKey] : undefined;

  // Extract Heap
  const primaryHeapKey = memory.heaps && Object.keys(memory.heaps).length > 0 ? Object.keys(memory.heaps)[0] : undefined;
  const heapData = primaryHeapKey && memory.heaps ? memory.heaps[primaryHeapKey] : undefined;

  // Extract pointers
  const pointers = memory.pointers || {};
  if (variables.i !== undefined) pointers.i = variables.i;
  if (variables.left !== undefined) pointers.left = variables.left;
  if (variables.right !== undefined) pointers.right = variables.right;
  if (variables.mid !== undefined) pointers.mid = variables.mid;

  // Visualizer condition checks (Supports explicit problem config OR automatic runtime detection!)
  const hasGrid = !!gridData || detectedStructures.includes('grid') || problem?.visualization?.primaryType === 'grid';
  const hasArray = (!!arrayData && arrayData.length > 0) || detectedStructures.includes('array') || problem?.visualization?.primaryType === 'array' || problem?.visualization?.primaryType === 'array-hashmap';
  const hasHashMap = (!!hashMapData && Object.keys(hashMapData).length > 0) || detectedStructures.includes('hash_map') || problem?.visualization?.primaryType === 'array-hashmap';
  const hasStack = (!!stackData && stackData.length > 0) || detectedStructures.includes('stack') || problem?.visualization?.primaryType === 'stack';
  const hasQueue = (!!queueData && queueData.length > 0) || detectedStructures.includes('queue');
  const hasDP = (!!dpData && dpData.length > 0) || detectedStructures.includes('dp_table') || problem?.visualization?.primaryType === 'dp-table';
  const hasLinkedList = (!!linkedListData && linkedListData.length > 0) || detectedStructures.includes('linked_list') || problem?.visualization?.primaryType === 'linked-list';
  const hasTree = (!!treeData && treeData.length > 0) || detectedStructures.includes('tree') || problem?.visualization?.primaryType === 'tree';
  const hasGraph = !!graphData || detectedStructures.includes('graph');
  const hasHeap = (!!heapData && heapData.length > 0) || detectedStructures.includes('heap');
  const hasCallStack = (memory.callStack && memory.callStack.length > 0) || detectedStructures.includes('recursion');

  const hasAnySpecialized = hasGrid || hasArray || hasHashMap || hasStack || hasQueue || hasDP || hasLinkedList || hasTree || hasGraph || hasHeap || hasCallStack;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 2D Grid Visualizer */}
      {hasGrid && (
        <GridVisualizer
          grid={gridData || [['1', '0'], ['0', '1']]}
          name="ocean_grid"
          activeRow={pointers.r !== undefined ? pointers.r : variables.r}
          activeCol={pointers.c !== undefined ? pointers.c : variables.c}
        />
      )}

      {/* Array Visualizer */}
      {hasArray && (
        <ArrayVisualizer
          array={arrayData || [2, 7, 11, 15]}
          name={primaryArrayKey || 'nums'}
          pointers={pointers}
          activeIndices={pointers.i !== undefined ? [pointers.i] : []}
        />
      )}

      {/* Hash Map Visualizer */}
      {hasHashMap && (
        <HashMapVisualizer
          hashMap={hashMapData || {}}
          name={primaryHashMapKey || 'seen'}
          lookupKey={lookupKey}
          lookupFound={lookupFound}
        />
      )}

      {/* Stack Visualizer */}
      {hasStack && (
        <StackVisualizer
          stack={stackData || []}
          name={primaryStackKey || 'stack'}
        />
      )}

      {/* Queue Visualizer */}
      {hasQueue && (
        <QueueVisualizer
          queue={queueData || []}
          name={primaryQueueKey || 'queue'}
        />
      )}

      {/* Linked List Visualizer */}
      {hasLinkedList && (
        <LinkedListVisualizer
          nodes={linkedListData}
          name={primaryLLKey || 'head'}
          pointers={pointers}
        />
      )}

      {/* Tree Visualizer */}
      {hasTree && (
        <TreeVisualizer
          nodes={treeData}
          name={primaryTreeKey || 'root'}
        />
      )}

      {/* Graph Visualizer */}
      {hasGraph && (
        <GraphVisualizer
          graph={graphData}
          name={primaryGraphKey || 'network_graph'}
        />
      )}

      {/* Priority Queue / Heap Visualizer */}
      {hasHeap && (
        <HeapVisualizer
          heap={heapData || []}
          name={primaryHeapKey || 'priority_queue'}
        />
      )}

      {/* DP Table Visualizer */}
      {hasDP && (
        <DPTableVisualizer
          dpTable={dpData || []}
          name="dp_table"
          activeStep={pointers.i !== undefined ? pointers.i : variables.i}
        />
      )}

      {/* Call Stack Visualizer */}
      {hasCallStack && (
        <CallStackVisualizer frames={memory.callStack || []} />
      )}

      {/* Generic Fallback Banner if no specialized visualizer */}
      {!hasAnySpecialized && (
        <div className="p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-center justify-between font-mono text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span>Generic Execution Mode: Tracking active line, variables, call stack, and stdout.</span>
          </div>
          <span className="text-indigo-400 font-bold bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
            GENERIC TRACER
          </span>
        </div>
      )}
    </div>
  );
};
