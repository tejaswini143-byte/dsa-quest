'use client';

import React from 'react';
import { ProblemDefinition } from '@/types/problem';
import { ExecutionStep } from '@/types/execution';
import { ArrayVisualizer } from './ArrayVisualizer';
import { HashMapVisualizer } from './HashMapVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { GridVisualizer } from './GridVisualizer';
import { DPTableVisualizer } from './DPTableVisualizer';
import { CallStackVisualizer } from './CallStackVisualizer';

interface UniversalVisualizerProps {
  problem: ProblemDefinition;
  step?: ExecutionStep;
  activeInput?: any;
}

export const UniversalVisualizer: React.FC<UniversalVisualizerProps> = ({
  problem,
  step,
  activeInput,
}) => {
  const { visualization } = problem;
  const memory = step?.memory || {};
  const variables = step?.variables || {};
  const events = step?.events || [];

  // Extract array data
  const primaryArrayKey = memory.arrays ? Object.keys(memory.arrays)[0] : undefined;
  const arrayData = primaryArrayKey && memory.arrays
    ? memory.arrays[primaryArrayKey]
    : activeInput?.nums || activeInput?.temperatures || [];

  // Extract hash map data
  const primaryHashMapKey = memory.hashMaps ? Object.keys(memory.hashMaps)[0] : undefined;
  const hashMapData = primaryHashMapKey && memory.hashMaps
    ? memory.hashMaps[primaryHashMapKey]
    : variables.seen || {};

  // Extract lookup events
  const lookupEvent = events.find((e) => e.type === 'HASH_LOOKUP');
  const lookupKey = lookupEvent?.payload?.key;
  const lookupFound = lookupEvent?.payload?.found;

  // Extract stack data
  const primaryStackKey = memory.stacks ? Object.keys(memory.stacks)[0] : undefined;
  const stackData = primaryStackKey && memory.stacks
    ? memory.stacks[primaryStackKey]
    : variables.stack || [];

  // Extract grid data
  const gridData = memory.grids || activeInput?.grid || [];

  // Extract DP table
  const dpData = memory.dpTable || variables.dp || [];

  // Extract pointers
  const pointers = memory.pointers || {};
  if (variables.i !== undefined) pointers.i = variables.i;
  if (variables.left !== undefined) pointers.left = variables.left;
  if (variables.right !== undefined) pointers.right = variables.right;
  if (variables.mid !== undefined) pointers.mid = variables.mid;

  // Determine which components to render based on problem visualization type
  const isArrayType =
    visualization.primaryType === 'array' ||
    visualization.primaryType === 'array-hashmap' ||
    visualization.secondaryTypes?.includes('array');

  const isHashMapType =
    visualization.primaryType === 'array-hashmap';

  const isStackType =
    visualization.primaryType === 'stack' ||
    visualization.secondaryTypes?.includes('stack');

  const isGridType =
    visualization.primaryType === 'grid' ||
    visualization.secondaryTypes?.includes('grid');

  const isDPType =
    visualization.primaryType === 'dp-table' ||
    visualization.secondaryTypes?.includes('dp-table');

  const isCallStackType =
    visualization.secondaryTypes?.includes('call-stack') ||
    (memory.callStack && memory.callStack.length > 0);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 2D Grid Visualizer */}
      {isGridType && (
        <GridVisualizer
          grid={gridData}
          name="ocean_grid"
          activeRow={pointers.r !== undefined ? pointers.r : variables.r}
          activeCol={pointers.c !== undefined ? pointers.c : variables.c}
        />
      )}

      {/* Array Visualizer */}
      {isArrayType && arrayData && arrayData.length > 0 && (
        <ArrayVisualizer
          array={arrayData}
          name={primaryArrayKey || 'nums'}
          pointers={pointers}
          activeIndices={pointers.i !== undefined ? [pointers.i] : []}
        />
      )}

      {/* Hash Map Visualizer */}
      {isHashMapType && (
        <HashMapVisualizer
          hashMap={hashMapData}
          name={primaryHashMapKey || 'seen'}
          lookupKey={lookupKey}
          lookupFound={lookupFound}
        />
      )}

      {/* Stack Visualizer */}
      {isStackType && (
        <StackVisualizer
          stack={stackData}
          name={primaryStackKey || 'stack'}
        />
      )}

      {/* DP Table Visualizer */}
      {isDPType && dpData && dpData.length > 0 && (
        <DPTableVisualizer
          dpTable={dpData}
          name="dp_ways"
          activeStep={pointers.i !== undefined ? pointers.i : variables.i}
        />
      )}

      {/* Call Stack Visualizer */}
      {isCallStackType && (
        <CallStackVisualizer frames={memory.callStack || []} />
      )}
    </div>
  );
};
