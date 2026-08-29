import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, executionStep, question, targetPersona = 'beginner' } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Detailed context from REAL execution
    const line = executionStep?.line || 1;
    const codeLine = executionStep?.codeLine || '';
    const vars = JSON.stringify(executionStep?.variables || {});
    const changed = (executionStep?.changedVariables || []).join(', ');
    const whatHappened = executionStep?.explanation?.whatHappened || '';

    // If Gemini key is available, call official Google GenAI endpoint
    if (apiKey && apiKey.length > 5) {
      try {
        const prompt = `You are DSA QUEST AI Tutor, an interactive coding mentor.
The learner is examining a Python DSA execution step.

PERSONA MODE: ${targetPersona.toUpperCase()} (e.g. ELI5 / Beginner / Intermediate / Interview)
USER QUESTION: ${question || 'Explain what is happening in this execution step.'}

REAL RUNTIME EXECUTION CONTEXT:
- Full Code:
\`\`\`python
${code || ''}
\`\`\`
- Current Line ${line}: "${codeLine}"
- Variables in Scope: ${vars}
- Changed Variables: ${changed || 'None'}
- Step What Happened: ${whatHappened}

Instructions:
1. Explain based ONLY on the REAL variables and line provided above. Do NOT invent variables.
2. Structure your answer clearly with:
   - What Happened
   - Why it Matters
   - Memory & State Change
   - Next Action
3. If Persona is ELI5, use a fun physical analogy (like toy boxes or playground games).`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 600,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const answerText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (answerText) {
            return NextResponse.json({
              success: true,
              provider: 'gemini',
              answer: answerText,
              whatHappened: whatHappened || `Executed line ${line}`,
              why: `Evaluated step at line ${line}`,
              whatChanged: changed ? `Updated: ${changed}` : 'No state mutation',
            });
          }
        } else {
          const errStatus = res.status;
          console.warn(`Gemini API returned status ${errStatus}`);
        }
      } catch (geminiErr: any) {
        console.warn('Gemini request failed, falling back to offline tutor:', geminiErr.message);
      }
    }

    // Intelligent Offline Explanation Fallback (Works 100% offline!)
    let personaExplanation = '';
    if (targetPersona === 'eli5') {
      personaExplanation = `🧸 Imagine you have a workbench! Right now on line ${line}, we are looking at '${codeLine.trim()}'. The computer takes what is on the workbench (${vars}) and checks what to do next!`;
    } else if (targetPersona === 'interview') {
      personaExplanation = `💼 Interview Perspective: Step executed line ${line} with local state: ${vars}. Notice how state mutations (${changed || 'none'}) maintain the required algorithmic invariant in O(1) time.`;
    } else {
      personaExplanation = `💡 At line ${line}: \`${codeLine.trim()}\`. Local variables in memory: ${vars}. ${
        changed ? `Variables updated: ${changed}.` : 'No variables modified on this step.'
      }`;
    }

    return NextResponse.json({
      success: true,
      provider: 'offline-expert',
      answer: personaExplanation,
      whatHappened: whatHappened || `Executed line ${line}: ${codeLine.trim()}`,
      why: 'Advancing program control flow according to algorithmic logic.',
      whatChanged: changed ? `Updated: ${changed}` : 'No state mutation on this step.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message, answer: 'Could not generate explanation.' },
      { status: 500 }
    );
  }
}
