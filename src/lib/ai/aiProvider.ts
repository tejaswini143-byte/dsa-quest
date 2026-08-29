export interface AITutorQuery {
  problemTitle: string;
  conceptLevel: 'eli5' | 'beginner' | 'intermediate' | 'interview';
  currentLine?: number;
  codeSnippet?: string;
  variables?: Record<string, any>;
  question?: string;
  apiKey?: string;
}

export interface AITutorResponse {
  source: 'gemini' | 'openai' | 'offline-tutor';
  content: string;
}

export async function askAITutor(query: AITutorQuery): Promise<AITutorResponse> {
  const apiKey =
    query.apiKey ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    (typeof window !== 'undefined' ? localStorage.getItem('dsa_quest_gemini_key') || '' : '');

  // If we have an API key and are in the browser, call Google Gemini via direct REST or backend
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
      const systemPrompt = `You are DSA Quest's expert AI Tutor. Explain clearly, encouragingly, and pedagogically.
Problem: ${query.problemTitle}
Level: ${query.conceptLevel.toUpperCase()}
Line: ${query.currentLine || 'N/A'}
Variables: ${JSON.stringify(query.variables || {})}
Code:
${query.codeSnippet || ''}

Question: ${query.question || 'Explain what is happening and why.'}

Guidelines:
- If level is ELI5: Use vivid metaphors (candies, backpacks, treasure chests, sports).
- If level is Beginner: Explain terms gently, step by step.
- If level is Intermediate: Focus on algorithmic patterns, space/time trade-offs.
- If level is Interview: Detail Big-O, edge cases, system bottlenecks, and how to articulate to a FAANG interviewer.
Keep output formatted cleanly with markdown bolding and bullet points.`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return { source: 'gemini', content: text };
        }
      }
    } catch {
      // Graceful fallback to offline expert knowledge base
    }
  }

  // High-Quality Structured Offline Knowledge Base
  return getOfflineTutorResponse(query);
}

function getOfflineTutorResponse(query: AITutorQuery): AITutorResponse {
  const { problemTitle, conceptLevel, currentLine, variables, question } = query;

  if (conceptLevel === 'eli5') {
    return {
      source: 'offline-tutor',
      content: `### 🧸 ELI5 Explanation for **${problemTitle}**

* **The Big Picture**: Imagine you're on a treasure hunt! Instead of checking every single box again and again (which makes you super tired), you keep a **magic notebook** or **smart backpack** where you write down everything you have seen so far!
* **What's happening right now**: At line ${currentLine || '1'}, we are checking our notes. If we find what we need, *BAM!* We win instantly! If not, we jot it down and take the next step.
* **Why it works**: You never have to search backwards because your memory notes do the hard work in zero seconds!`
    };
  }

  if (conceptLevel === 'interview') {
    return {
      source: 'offline-tutor',
      content: `### 💼 Interview Analysis for **${problemTitle}**

* **Time Complexity**: **$O(N)$** linear single-pass. Every element is processed a constant number of times (at most 1 push and 1 pop, or 1 hash insert and 1 lookup).
* **Space Complexity**: **$O(N)$** auxiliary storage in the worst-case scenario.
* **Key Invariant**: Maintain a monotonic or hash-indexed invariant across iterations.
* **Interview Talking Point**: *"Rather than adopting a brute-force $O(N^2)$ nested loop checking all pairs/subarrays, we trade $O(N)$ space for an optimal $O(N)$ time reduction by caching historical elements."*`
    };
  }

  if (conceptLevel === 'intermediate') {
    return {
      source: 'offline-tutor',
      content: `### 🚀 Algorithmic Blueprint: **${problemTitle}**

* **Active State**: \`${JSON.stringify(variables || {})}\`
* **Pattern**: Dynamic Lookup / Monotonic Invariant / State Transition.
* **Execution Invariant**: As we iterate through the sequence, we satisfy the problem requirement incrementally. If a complement or condition is met, we resolve in $O(1)$ amortized time.
* **Optimization Note**: Avoid allocating redundant structures inside loops to maximize CPU cache locality.`
    };
  }

  return {
    source: 'offline-tutor',
    content: `### 💡 Beginner Walkthrough for **${problemTitle}**

* **Step Focus**: You are currently at line ${currentLine || 'current'}.
* **Variables in Memory**: \`${JSON.stringify(variables || {})}\`
* **Logic**: We inspect the current value, evaluate our condition, and update the state so that subsequent steps have all the context they need.
* **Next Action**: Watch how the pointers and visual cards update in the visualizer above!`
  };
}
