import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { normalizeExecutionTrace } from '@/lib/execution/normalizeTrace';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, input, entry } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        normalizeExecutionTrace({
          success: false,
          error: 'No Python code provided',
          steps: [],
        }),
        { status: 400 }
      );
    }

    const tracerPath = path.join(process.cwd(), 'backend', 'tracer.py');

    // Spawn real Python tracer process with JSON pipe
    const pyProcess = spawn('python', [tracerPath, '--json'], {
      cwd: process.cwd(),
      timeout: 4000,
    });

    let stdoutData = '';
    let stderrData = '';

    const payload = JSON.stringify({ code, input, entry });

    pyProcess.stdin.write(payload);
    pyProcess.stdin.end();

    const exitPromise = new Promise<{ code: number | null }>((resolve, reject) => {
      pyProcess.on('close', (exitCode) => resolve({ code: exitCode }));
      pyProcess.on('error', (err) => reject(err));
    });

    pyProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pyProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    await exitPromise;

    if (!stdoutData.trim()) {
      return NextResponse.json(
        normalizeExecutionTrace({
          success: false,
          error: stderrData || 'Python execution produced no trace output',
          steps: [],
        })
      );
    }

    try {
      const traceResult = JSON.parse(stdoutData);
      return NextResponse.json(normalizeExecutionTrace(traceResult));
    } catch {
      return NextResponse.json(
        normalizeExecutionTrace({
          success: false,
          error: `Failed to parse Python trace output: ${stdoutData.slice(0, 200)}`,
          steps: [],
        })
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      normalizeExecutionTrace({
        success: false,
        error: `Execution engine error: ${err.message}`,
        steps: [],
      }),
      { status: 500 }
    );
  }
}
