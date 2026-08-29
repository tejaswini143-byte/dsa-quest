"""
DSA Quest Backend API
FastAPI service delivering execution traces, AI tutoring, and health checks.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Optional, Dict
from dotenv import load_dotenv

from tracer import execute_and_trace

load_dotenv()

app = FastAPI(
    title="DSA Quest Engine API",
    description="Execution, Tracing, and AI Tutor service for DSA Quest",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TraceRequest(BaseModel):
    code: str
    testInput: Optional[Any] = None
    entryFunction: Optional[str] = None
    problemType: Optional[str] = None

class AIExplainRequest(BaseModel):
    problemTitle: str
    conceptLevel: str  # 'eli5' | 'beginner' | 'intermediate' | 'interview'
    currentLine: Optional[int] = None
    codeSnippet: Optional[str] = None
    variables: Optional[Dict[str, Any]] = None
    question: Optional[str] = None
    apiKey: Optional[str] = None

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "DSA Quest Engine Backend", "version": "1.0.0"}

@app.post("/api/trace")
def get_code_trace(req: TraceRequest):
    try:
        result = execute_and_trace(req.code, req.testInput, req.entryFunction)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/ai/explain")
def explain_with_ai(req: AIExplainRequest):
    # Retrieve API key from request, or environment
    api_key = req.apiKey or os.environ.get("GEMINI_API_KEY") or os.environ.get("NEXT_PUBLIC_GEMINI_API_KEY")
    
    if not api_key:
        # High quality offline structured tutor response
        return {
            "source": "offline-tutor",
            "explanation": f"**{req.problemTitle}** ({req.conceptLevel.upper()} perspective):\n\n"
                           f"At line {req.currentLine or 'current'}, the algorithm is advancing its state invariant. "
                           f"Current variables: `{req.variables or {}}`.\n"
                           f"Key Takeaway: The data structure stores intermediate state so lookups and operations execute with optimal time complexity."
        }
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = f"""
You are the interactive DSA Quest AI Tutor, friendly, encouraging, pedagogical, and precise.
Problem: {req.problemTitle}
Level: {req.conceptLevel} (Options: ELI5, Beginner, Intermediate, Interview)
Current Code Line: {req.currentLine}
Code Snippet:
```python
{req.codeSnippet}
```
Current Variables: {req.variables}
User Question: {req.question or 'Explain what is happening right now and why.'}

Instructions:
1. Explain clearly according to the requested level.
2. If ELI5, use vivid playful analogies (ice cream, toys, backpacks).
3. If Interview, analyze time & space complexity, cache locality, and interview talking points.
4. Keep it concise (2-4 paragraphs max) with clear markdown bullet points.
"""
        response = model.generate_content(prompt)
        return {
            "source": "gemini",
            "explanation": response.text
        }
    except Exception as e:
        return {
            "source": "fallback",
            "explanation": f"AI Tutor Note: Could not reach Gemini API ({str(e)}). "
                           f"Current step evaluation: Line {req.currentLine} evaluates variables `{req.variables}` successfully."
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
