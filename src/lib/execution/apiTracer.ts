import { ExecutionTrace } from '@/types/execution';
import { generateClientTrace } from './clientTracer';
import { normalizeExecutionTrace } from './normalizeTrace';

export async function executeAlgorithmTrace(
  problemIdOrCode: string,
  variant: 'optimal' | 'bruteForce' = 'optimal',
  customInput?: any,
  customPythonCode?: string
): Promise<ExecutionTrace> {
  const codeToExecute = customPythonCode || (problemIdOrCode.includes('\n') || problemIdOrCode.includes('=') ? problemIdOrCode : undefined);

  // 1. If we have actual Python source code, execute it via the real Next.js Python trace endpoint
  if (codeToExecute) {
    try {
      const res = await fetch('/api/trace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToExecute,
          input: customInput,
        }),
      });

      if (res.ok) {
        const trace = await res.json();
        if (trace && trace.steps && trace.steps.length > 0) {
          return normalizeExecutionTrace(trace);
        }
      }
    } catch {
      // Internal route fetch failed, proceed to fallback
    }

    // 2. Try external FastAPI backend if running
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    try {
      const res = await fetch(`${BACKEND_URL}/api/trace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToExecute,
          input: customInput,
        }),
      });
      if (res.ok) {
        const trace = await res.json();
        if (trace && trace.steps && trace.steps.length > 0) {
          return normalizeExecutionTrace(trace);
        }
      }
    } catch {
      // Backend not running
    }
  }

  // 3. Deterministic client-side generator for built-in seed problems & offline simulation
  const clientRes = generateClientTrace(codeToExecute || problemIdOrCode, variant, customInput);
  return normalizeExecutionTrace(clientRes);
}
