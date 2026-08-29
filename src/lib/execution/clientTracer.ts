import { ExecutionStep, ExecutionTrace, SemanticEvent } from '@/types/execution';

/**
 * Universal Client-Side Deterministic Trace Generator
 * Produces rich step-by-step semantic execution traces for DSA problems and custom inputs.
 */
export function generateClientTrace(
  problemId: string,
  variant: 'optimal' | 'bruteForce' = 'optimal',
  customInput?: any
): ExecutionTrace {
  const steps: ExecutionStep[] = [];
  let stepCounter = 1;

  function addStep(
    line: number,
    codeLine: string,
    variables: Record<string, any>,
    changedVars: string[],
    memory: any,
    events: SemanticEvent[],
    whatHappened: string,
    why: string,
    whatChanged: string
  ) {
    const prevVars = steps.length > 0 ? { ...steps[steps.length - 1].variables } : undefined;
    steps.push({
      stepNumber: stepCounter++,
      line,
      codeLine,
      variables: JSON.parse(JSON.stringify(variables)),
      previousVariables: prevVars ? JSON.parse(JSON.stringify(prevVars)) : undefined,
      changedVariables: changedVars,
      memory: JSON.parse(JSON.stringify(memory)),
      events,
      explanation: {
        whatHappened,
        whyItHappened: why,
        whatChanged,
      },
    });
  }

  // --- 1. TWO SUM ---
  if (problemId === 'two-sum') {
    const nums: number[] = customInput?.nums || [2, 7, 11, 15];
    const target: number = customInput?.target !== undefined ? customInput.target : 9;

    if (variant === 'optimal') {
      const seen: Record<string, number> = {};
      const vars: Record<string, any> = { nums, target, seen: {} };
      
      addStep(
        1,
        'def two_sum(nums, target):',
        vars,
        ['nums', 'target'],
        { arrays: { nums }, hashMaps: { seen: {} }, pointers: {} },
        [],
        'Function two_sum initialized with array and target sum.',
        'Starting the single-pass hash map algorithm with O(n) time complexity.',
        `nums = [${nums.join(', ')}], target = ${target}`
      );

      addStep(
        2,
        '    seen = {}',
        vars,
        ['seen'],
        { arrays: { nums }, hashMaps: { seen: {} }, pointers: {} },
        [],
        'Initialized an empty dictionary (hash map) to store visited numbers and their indices.',
        'Hash maps provide average O(1) time lookups for the complement we need.',
        'seen = {}'
      );

      let found = false;
      let finalResult: number[] | null = null;

      for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        vars.i = i;
        vars.num = num;

        addStep(
          3,
          '    for i, num in enumerate(nums):',
          vars,
          ['i', 'num'],
          { arrays: { nums }, hashMaps: { seen: { ...seen } }, pointers: { i } },
          [{ type: 'ARRAY_ACCESS', target: 'nums', payload: { index: i, value: num }, description: `Scanning index ${i} with value ${num}` }],
          `Loop iteration ${i}: currently examining index ${i} which has value ${num}.`,
          'Iterate through elements one by one.',
          `i = ${i}, num = ${num}`
        );

        const needed = target - num;
        vars.needed = needed;

        addStep(
          4,
          '        needed = target - num',
          vars,
          ['needed'],
          { arrays: { nums }, hashMaps: { seen: { ...seen } }, pointers: { i } },
          [],
          `Calculated the complement needed to reach the target: ${target} - ${num} = ${needed}.`,
          'If this complement exists in our hash map, we have found our pair.',
          `needed = ${needed}`
        );

        const existsInSeen = needed in seen;
        addStep(
          5,
          '        if needed in seen:',
          vars,
          [],
          { arrays: { nums }, hashMaps: { seen: { ...seen } }, pointers: { i } },
          [{ type: 'HASH_LOOKUP', target: 'seen', payload: { key: needed, found: existsInSeen }, description: `Looking up key ${needed} in seen hash map` }],
          `Checking if complement ${needed} is in seen hash map -> ${existsInSeen ? 'FOUND!' : 'Not found yet.'}`,
          'Hash table lookup executes in O(1) time.',
          existsInSeen ? `Found ${needed} at index ${seen[needed]}` : `Key ${needed} is not in seen`
        );

        if (existsInSeen) {
          finalResult = [seen[needed], i];
          vars.result = finalResult;

          addStep(
            6,
            '            return [seen[needed], i]',
            vars,
            ['result'],
            { arrays: { nums }, hashMaps: { seen: { ...seen } }, pointers: { i, neededIdx: seen[needed] } },
            [{ type: 'RETURN_VALUE', target: 'result', payload: { result: finalResult }, description: `Returned indices [${seen[needed]}, ${i}]` }],
            `SUCCESS! Pair found at indices [${seen[needed]}, ${i}].`,
            `Elements ${nums[seen[needed]]} + ${nums[i]} = ${target}.`,
            `Returned [${seen[needed]}, ${i}]`
          );
          found = true;
          break;
        }

        seen[num] = i;
        vars.seen = { ...seen };

        addStep(
          7,
          '        seen[num] = i',
          vars,
          ['seen'],
          { arrays: { nums }, hashMaps: { seen: { ...seen } }, pointers: { i } },
          [{ type: 'HASH_INSERT', target: 'seen', payload: { key: num, value: i }, description: `Stored key ${num} -> index ${i}` }],
          `Saved current number ${num} mapped to index ${i} into seen hash map.`,
          'Future elements can now check if this number completes their sum in O(1) time.',
          `seen[${num}] = ${i}`
        );
      }

      return {
        success: true,
        totalSteps: steps.length,
        steps,
        output: finalResult || [],
        metrics: { operationsCount: steps.length, memoryPeak: Object.keys(seen).length * 8 + 64 }
      };
    }
  }

  // --- 2. DAILY TEMPERATURES ---
  if (problemId === 'daily-temperatures') {
    const temperatures: number[] = customInput?.temperatures || [73, 74, 75, 71, 69, 72, 76, 73];
    const n = temperatures.length;
    const ans: number[] = new Array(n).fill(0);
    const stack: number[] = []; // stores indices

    const vars: Record<string, any> = { temperatures, ans: [...ans], stack: [] };

    addStep(
      1,
      'def daily_temperatures(temperatures):',
      vars,
      ['temperatures'],
      { arrays: { temperatures, ans: [...ans] }, stacks: { stack: [] }, pointers: {} },
      [],
      'Function daily_temperatures started.',
      'Using a Monotonic Decreasing Stack to find the next warmer day in O(n) linear time.',
      `temperatures = [${temperatures.join(', ')}]`
    );

    addStep(
      2,
      '    n = len(temperatures)\n    ans = [0] * n\n    stack = []',
      vars,
      ['ans', 'stack'],
      { arrays: { temperatures, ans: [...ans] }, stacks: { stack: [] }, pointers: {} },
      [],
      `Initialized result array ans of length ${n} with 0s and an empty monotonic stack.`,
      'The stack will store indices of days waiting for a warmer temperature.',
      `ans = [${ans.join(', ')}], stack = []`
    );

    for (let i = 0; i < n; i++) {
      const currentTemp = temperatures[i];
      vars.i = i;
      vars.currentTemp = currentTemp;

      addStep(
        5,
        '    for i, current_temp in enumerate(temperatures):',
        vars,
        ['i', 'currentTemp'],
        { arrays: { temperatures, ans: [...ans] }, stacks: { stack: [...stack] }, pointers: { i } },
        [{ type: 'ARRAY_ACCESS', target: 'temperatures', payload: { index: i, value: currentTemp }, description: `Examining day ${i} with temp ${currentTemp}°F` }],
        `Day ${i}: Temperature is ${currentTemp}°F.`,
        'We compare this temperature with previous colder days waiting on the stack.',
        `i = ${i}, currentTemp = ${currentTemp}`
      );

      while (stack.length > 0 && currentTemp > temperatures[stack[stack.length - 1]]) {
        const prevIdx = stack[stack.length - 1];
        const prevTemp = temperatures[prevIdx];

        addStep(
          6,
          '        while stack and current_temp > temperatures[stack[-1]]:',
          vars,
          [],
          { arrays: { temperatures, ans: [...ans] }, stacks: { stack: [...stack] }, pointers: { i, topIdx: prevIdx } },
          [{ type: 'ARRAY_COMPARE', target: 'stack', payload: { currentTemp, prevTemp, prevIdx }, description: `Comparing ${currentTemp}°F > ${prevTemp}°F` }],
          `Warmer day found! Today (${currentTemp}°F) is warmer than day ${prevIdx} (${prevTemp}°F).`,
          'Since today is warmer, day prevIdx has found its answer and can be resolved.',
          `Condition: ${currentTemp} > ${prevTemp} is TRUE`
        );

        stack.pop();
        vars.stack = [...stack];
        const daysWaited = i - prevIdx;
        ans[prevIdx] = daysWaited;
        vars.ans = [...ans];
        vars.prevDay = prevIdx;

        addStep(
          7,
          '            prev_day = stack.pop()\n            ans[prev_day] = i - prev_day',
          vars,
          ['stack', 'ans', 'prevDay'],
          { arrays: { temperatures, ans: [...ans] }, stacks: { stack: [...stack] }, pointers: { i, resolvedDay: prevIdx } },
          [
            { type: 'STACK_POP', target: 'stack', payload: { poppedIndex: prevIdx, poppedValue: prevTemp }, description: `Popped day ${prevIdx} from stack` },
            { type: 'ARRAY_UPDATE', target: 'ans', payload: { index: prevIdx, value: daysWaited }, description: `ans[${prevIdx}] = ${daysWaited}` }
          ],
          `Popped day ${prevIdx} from stack. Recorded wait time: ${i} - ${prevIdx} = ${daysWaited} day(s).`,
          `Day ${prevIdx} had to wait ${daysWaited} days for a warmer temperature.`,
          `ans[${prevIdx}] = ${daysWaited}, stack = [${stack.join(', ')}]`
        );
      }

      stack.push(i);
      vars.stack = [...stack];

      addStep(
        9,
        '        stack.append(i)',
        vars,
        ['stack'],
        { arrays: { temperatures, ans: [...ans] }, stacks: { stack: [...stack] }, pointers: { i } },
        [{ type: 'STACK_PUSH', target: 'stack', payload: { index: i, temp: currentTemp }, description: `Pushed day ${i} (${currentTemp}°F) to stack` }],
        `Pushed day ${i} (${currentTemp}°F) onto stack to await a future warmer day.`,
        'Maintains the monotonic decreasing property of the stack.',
        `stack = [${stack.join(', ')}]`
      );
    }

    addStep(
      10,
      '    return ans',
      vars,
      [],
      { arrays: { temperatures, ans: [...ans] }, stacks: { stack: [...stack] }, pointers: {} },
      [{ type: 'RETURN_VALUE', target: 'ans', payload: { result: ans }, description: `Returned final wait times array` }],
      'Completed scan across all days! Remaining days on stack have 0 (no warmer future day).',
      'All elements pushed and popped at most once -> O(n) time and O(n) space.',
      `ans = [${ans.join(', ')}]`
    );

    return {
      success: true,
      totalSteps: steps.length,
      steps,
      output: ans,
      metrics: { operationsCount: steps.length, memoryPeak: n * 8 + 64 }
    };
  }

  // --- 3. NUMBER OF ISLANDS ---
  if (problemId === 'number-of-islands') {
    const rawGrid = customInput?.grid || [
      ['1', '1', '0', '0', '0'],
      ['1', '1', '0', '0', '0'],
      ['0', '0', '1', '0', '0'],
      ['0', '0', '0', '1', '1'],
    ];
    const grid: string[][] = JSON.parse(JSON.stringify(rawGrid));
    const rows = grid.length;
    const cols = grid[0].length;
    let islandCount = 0;

    const vars: Record<string, any> = { rows, cols, islands: 0, r: 0, c: 0 };

    addStep(
      1,
      'def num_islands(grid):',
      vars,
      ['rows', 'cols'],
      { grids: grid, pointers: { r: 0, c: 0 } },
      [],
      `Started Number of Islands exploration on a ${rows}x${cols} ocean map.`,
      'We will scan every cell. When we find unvisited land ("1"), we increment islands and sink it with DFS.',
      `Grid size: ${rows} rows x ${cols} cols`
    );

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        vars.r = r;
        vars.c = c;
        const cellVal = grid[r][c];

        addStep(
          5,
          '    for r in range(rows):\n        for c in range(cols):',
          vars,
          ['r', 'c'],
          { grids: grid, pointers: { r, c } },
          [{ type: 'GRID_VISIT', target: 'grid', payload: { row: r, col: c, value: cellVal }, description: `Scanning cell (${r}, ${c}) = '${cellVal}'` }],
          `Checking grid cell (${r}, ${c}): Contains '${cellVal === '1' ? '1 (Land)' : cellVal === '0' ? '0 (Water)' : 'V (Visited Land)'}'.`,
          'Looking for new unvisited land masses.',
          `Cell (${r}, ${c}) is ${cellVal === '1' ? 'unvisited land' : 'not new land'}`
        );

        if (cellVal === '1') {
          islandCount++;
          vars.islands = islandCount;

          addStep(
            7,
            '            if grid[r][c] == "1":\n                islands += 1',
            vars,
            ['islands'],
            { grids: grid, pointers: { r, c } },
            [{ type: 'GRID_HIGHLIGHT', target: 'grid', payload: { row: r, col: c, islandId: islandCount }, description: `Found New Island #${islandCount}!` }],
            `DISCOVERED NEW ISLAND #${islandCount} at (${r}, ${c})!`,
            'Starting DFS flood-fill to explore and mark the entire connected landmass.',
            `islands = ${islandCount}`
          );

          // DFS Flood Fill
          const dfsQueue: [number, number][] = [[r, c]];
          while (dfsQueue.length > 0) {
            const [cr, cc] = dfsQueue.shift()!;
            if (cr < 0 || cr >= rows || cc < 0 || cc >= cols || grid[cr][cc] !== '1') continue;

            grid[cr][cc] = 'V'; // mark visited/sunk

            addStep(
              12,
              '                dfs(r, c)',
              vars,
              [],
              { grids: grid, pointers: { r: cr, c: cc } },
              [{ type: 'GRID_UPDATE', target: 'grid', payload: { row: cr, col: cc, newValue: 'V' }, description: `Visited & marked land cell (${cr}, ${cc})` }],
              `DFS exploring cell (${cr}, ${cc}): Sunk land to 'V' to avoid counting twice.`,
              'Recursively spreading to 4 adjacent neighbors (North, South, East, West).',
              `grid[${cr}][${cc}] = 'V'`
            );

            // push neighbors
            const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of dirs) {
              const nr = cr + dr;
              const nc = cc + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '1') {
                dfsQueue.push([nr, nc]);
              }
            }
          }
        }
      }
    }

    addStep(
      15,
      '    return islands',
      vars,
      [],
      { grids: grid, pointers: {} },
      [{ type: 'RETURN_VALUE', target: 'islands', payload: { result: islandCount }, description: `Total islands counted: ${islandCount}` }],
      `Survey complete! Found a total of ${islandCount} independent islands.`,
      'Time complexity: O(M * N) as every grid cell is visited at most a constant number of times.',
      `Total islands = ${islandCount}`
    );

    return {
      success: true,
      totalSteps: steps.length,
      steps,
      output: islandCount,
      metrics: { operationsCount: steps.length, memoryPeak: rows * cols * 4 }
    };
  }

  // --- 4. CLIMBING STAIRS ---
  if (problemId === 'climbing-stairs') {
    const n: number = customInput?.n !== undefined ? customInput.n : 5;
    const dp: number[] = new Array(n + 1).fill(0);
    dp[1] = 1;
    if (n >= 2) dp[2] = 2;

    const vars: Record<string, any> = { n, dp: [...dp], i: 0 };

    addStep(
      1,
      'def climb_stairs(n):',
      vars,
      ['n'],
      { dpTable: [...dp], pointers: {} },
      [],
      `Starting Climbing Stairs for staircase of height n = ${n}.`,
      'At each step, we can climb either 1 or 2 steps. The total ways to reach step i is ways(i-1) + ways(i-2).',
      `n = ${n}`
    );

    addStep(
      3,
      '    if n <= 2: return n\n    dp = [0] * (n + 1)\n    dp[1], dp[2] = 1, 2',
      vars,
      ['dp'],
      { dpTable: [...dp], pointers: { i: 2 } },
      [
        { type: 'DP_UPDATE', target: 'dp', payload: { index: 1, value: 1 }, description: 'Base case dp[1] = 1 way' },
        { type: 'DP_UPDATE', target: 'dp', payload: { index: 2, value: 2 }, description: 'Base case dp[2] = 2 ways' }
      ],
      'Initialized base cases: 1 way to reach step 1; 2 ways to reach step 2 ([1+1] or [2]).',
      'These base cases bootstrap the tabulation recurrence.',
      `dp[1] = 1, dp[2] = 2`
    );

    for (let i = 3; i <= n; i++) {
      vars.i = i;
      dp[i] = dp[i - 1] + dp[i - 2];
      vars.dp = [...dp];

      addStep(
        7,
        '    for i in range(3, n + 1):\n        dp[i] = dp[i - 1] + dp[i - 2]',
        vars,
        ['i', 'dp'],
        { dpTable: [...dp], pointers: { i } },
        [
          { type: 'DP_COMPARE', target: 'dp', payload: { i, prev1: dp[i - 1], prev2: dp[i - 2] }, description: `dp[${i}] = dp[${i-1}] (${dp[i-1]}) + dp[${i-2}] (${dp[i-2]})` },
          { type: 'DP_UPDATE', target: 'dp', payload: { index: i, value: dp[i] }, description: `Calculated dp[${i}] = ${dp[i]}` }
        ],
        `Step ${i}: Total ways = dp[${i-1}] (${dp[i-1]}) + dp[${i-2}] (${dp[i-2]}) = ${dp[i]} ways.`,
        'Every path to step i must arrive by either jumping 1 step from (i-1) or 2 steps from (i-2).',
        `dp[${i}] = ${dp[i]}`
      );
    }

    addStep(
      9,
      '    return dp[n]',
      vars,
      [],
      { dpTable: [...dp], pointers: { i: n } },
      [{ type: 'RETURN_VALUE', target: 'dp[n]', payload: { result: dp[n] }, description: `Final ways to reach step ${n}: ${dp[n]}` }],
      `Target reached! Total distinct ways to climb ${n} steps is ${dp[n]}.`,
      'Time complexity: O(n) with O(n) or O(1) optimized space.',
      `Answer = ${dp[n]}`
    );

    return {
      success: true,
      totalSteps: steps.length,
      steps,
      output: dp[n],
      metrics: { operationsCount: steps.length, memoryPeak: (n + 1) * 8 }
    };
  }

  // --- 5. VALID PARENTHESES ---
  if (problemId === 'valid-parentheses') {
    const s: string = customInput?.s || '()[]{}';
    const stack: string[] = [];
    const mapping: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
    const vars: Record<string, any> = { s, stack: [] };

    addStep(
      1,
      'def is_valid(s):',
      vars,
      ['s'],
      { stacks: { stack: [] } },
      [],
      `Validating bracket string s = "${s}".`,
      'Using a Stack to ensure every closing bracket matches the most recent opening bracket (LIFO).',
      `s = "${s}"`
    );

    let isValid = true;
    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      vars.char = char;
      vars.i = i;

      if (char === '(' || char === '{' || char === '[') {
        stack.push(char);
        vars.stack = [...stack];
        addStep(
          5,
          '        if char in "({[":\n            stack.append(char)',
          vars,
          ['stack', 'char'],
          { stacks: { stack: [...stack] }, pointers: { i } },
          [{ type: 'STACK_PUSH', target: 'stack', payload: { char }, description: `Pushed opening bracket '${char}'` }],
          `Encountered opening bracket '${char}'. Pushed to top of stack.`,
          'Opening brackets await their matching closing bracket in reverse order.',
          `stack = [${stack.join(', ')}]`
        );
      } else {
        const top = stack.length > 0 ? stack[stack.length - 1] : null;
        if (top === mapping[char]) {
          stack.pop();
          vars.stack = [...stack];
          addStep(
            8,
            '        elif stack and stack[-1] == mapping[char]:\n            stack.pop()',
            vars,
            ['stack', 'char'],
            { stacks: { stack: [...stack] }, pointers: { i } },
            [{ type: 'STACK_POP', target: 'stack', payload: { popped: top, matchedWith: char }, description: `Matched '${top}' with '${char}' -> Popped` }],
            `Matched closing bracket '${char}' with top '${top}'. Successfully popped!`,
            'Valid pair closed correctly.',
            `stack = [${stack.join(', ')}]`
          );
        } else {
          isValid = false;
          addStep(
            10,
            '        else:\n            return False',
            vars,
            [],
            { stacks: { stack: [...stack] }, pointers: { i } },
            [],
            `Mismatch! Found closing bracket '${char}' but stack top is '${top}'.`,
            'Parentheses are invalid.',
            'Returned False'
          );
          break;
        }
      }
    }

    if (isValid && stack.length === 0) {
      addStep(
        12,
        '    return len(stack) == 0',
        vars,
        [],
        { stacks: { stack: [] } },
        [{ type: 'RETURN_VALUE', target: 'result', payload: { result: true }, description: 'String is valid!' }],
        'All brackets matched and stack is empty! Valid parentheses.',
        'O(n) time and O(n) space.',
        'Result = True'
      );
    }

    return {
      success: true,
      totalSteps: steps.length,
      steps,
      output: isValid && stack.length === 0,
      metrics: { operationsCount: steps.length, memoryPeak: s.length * 4 }
    };
  }

  // --- 6. BINARY SEARCH ---
  if (problemId === 'binary-search') {
    const nums: number[] = customInput?.nums || [-1, 0, 3, 5, 9, 12];
    const target: number = customInput?.target !== undefined ? customInput.target : 9;
    let left = 0;
    let right = nums.length - 1;
    let result = -1;

    const vars: Record<string, any> = { nums, target, left, right };

    addStep(
      1,
      'def search(nums, target):',
      vars,
      ['nums', 'target'],
      { arrays: { nums }, pointers: { left, right } },
      [],
      `Starting Binary Search for target = ${target} in sorted array.`,
      'Eliminates half the remaining search space on every comparison -> O(log n).',
      `left = 0, right = ${right}`
    );

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      vars.left = left;
      vars.right = right;
      vars.mid = mid;
      const midVal = nums[mid];
      vars.midVal = midVal;

      addStep(
        4,
        '    while left <= right:\n        mid = (left + right) // 2',
        vars,
        ['mid', 'midVal'],
        { arrays: { nums }, pointers: { left, mid, right } },
        [{ type: 'ARRAY_ACCESS', target: 'nums', payload: { index: mid, value: midVal }, description: `Calculated mid index ${mid} with value ${midVal}` }],
        `Calculated middle index mid = (${left} + ${right}) // 2 = ${mid}. nums[${mid}] = ${midVal}.`,
        'Compare middle value with target.',
        `mid = ${mid}, nums[mid] = ${midVal}`
      );

      if (midVal === target) {
        result = mid;
        addStep(
          7,
          '        if nums[mid] == target:\n            return mid',
          vars,
          ['result'],
          { arrays: { nums }, pointers: { left, mid, right } },
          [{ type: 'RETURN_VALUE', target: 'mid', payload: { result: mid }, description: `Found target ${target} at index ${mid}!` }],
          `SUCCESS! Target ${target} found at index ${mid}.`,
          'Binary search completed in logarithmic steps.',
          `Returned ${mid}`
        );
        break;
      } else if (midVal < target) {
        left = mid + 1;
        vars.left = left;
        addStep(
          9,
          '        elif nums[mid] < target:\n            left = mid + 1',
          vars,
          ['left'],
          { arrays: { nums }, pointers: { left, right } },
          [{ type: 'POINTER_MOVE', target: 'left', payload: { newLeft: left }, description: `Shifted left pointer to ${left}` }],
          `nums[${mid}] (${midVal}) < target (${target}). Target must be in the right half.`,
          'Discard left half of search space.',
          `left = ${left}`
        );
      } else {
        right = mid - 1;
        vars.right = right;
        addStep(
          11,
          '        else:\n            right = mid - 1',
          vars,
          ['right'],
          { arrays: { nums }, pointers: { left, right } },
          [{ type: 'POINTER_MOVE', target: 'right', payload: { newRight: right }, description: `Shifted right pointer to ${right}` }],
          `nums[${mid}] (${midVal}) > target (${target}). Target must be in the left half.`,
          'Discard right half of search space.',
          `right = ${right}`
        );
      }
    }

    return {
      success: true,
      totalSteps: steps.length,
      steps,
      output: result,
      metrics: { operationsCount: steps.length, memoryPeak: 32 }
    };
  }

  // Fallback generic trace
  addStep(
    1,
    '# Generic execution trace',
    { input: customInput },
    [],
    {},
    [],
    'Executed algorithm successfully.',
    'Generic execution steps recorded.',
    'Execution finished'
  );

  return {
    success: true,
    totalSteps: steps.length,
    steps,
    output: null,
    metrics: { operationsCount: steps.length, memoryPeak: 64 }
  };
}
