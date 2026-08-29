import { ExecutionTrace } from '@/types/execution';
import { generateClientTrace } from './clientTracer';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function executeAlgorithmTrace(
  problemId: string,
  variant: 'optimal' | 'bruteForce' = 'optimal',
  customInput?: any,
  customPythonCode?: string
): Promise<ExecutionTrace> {
  // If custom python code was passed and backend is running, try sending to FastAPI backend
  if (customPythonCode) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/trace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: customPythonCode,
          testInput: customInput,
          problemType: problemId,
        }),
      });
      if (res.ok) {
        const trace = await res.json();
        if (trace.steps && trace.steps.length > 0) {
          return trace;
        }
      }
    } catch {
      // Backend not running, gracefully fallback to client trace generator
    }
  }

  // Fallback to ultra-fast zero-latency deterministic client tracer
  return generateClientTrace(problemId, variant, customInput);
}
