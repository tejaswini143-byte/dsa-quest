# 🚀 DSA QUEST

### *Learn DSA by playing it, seeing it, and solving it.*

**DSA QUEST** is a production-grade educational platform built around a **Universal DSA Learning Engine**. Rather than creating isolated, hard-coded pages for individual algorithms, DSA Quest operates on a data-driven architecture where any Data Structures & Algorithms problem is defined as structured data and rendered dynamically across 14 independent sub-engines.

---

## 🎯 The Core Learning Loop

Every supported DSA problem guides the learner through an immersive progression:

```
REAL-LIFE STORY
      ↓
MISSION CHALLENGE
      ↓
INTERACTIVE GAME
      ↓
MULTI-TIER EXPLANATIONS (ELI5 → Beginner → Intermediate → Interview)
      ↓
STEP-BY-STEP VISUALIZATION (Array, Hash Map, Monotonic Stack, 2D Grid, DP Table, Trees, Call Stack)
      ↓
LINE-BY-LINE PYTHON CODE EXECUTION
      ↓
VARIABLE TRANSITION & MEMORY DIFF ANIMATIONS
      ↓
STEP INTEL ("What Happened" • "Why It Happened" • "What Changed")
      ↓
PROGRESSIVE CLUE ENGINE (5-Tier Hint Unlocks)
      ↓
AI TUTOR COACHING (Gemini / Offline Knowledge Base)
      ↓
PRACTICE LAB (Fill Blanks, Fix Bug, Predict Output, Reorder Code, Write from Scratch)
      ↓
BIG-O COMPLEXITY LAB & OPERATION SCALING
      ↓
PATTERN RECOGNITION & NEXT BOSS CHALLENGES
```

---

## 🧠 Universal Engine Architecture

DSA Quest strictly separates **Problem Content** from the **Rendering & Execution Engines**:

```
                              USER REQUEST
                                   │
                                   ▼
                         [ Problem Registry ]
                     (Pure Structured Data Schema)
                                   │
                                   ▼
                       /problem/[id] Dynamic Route
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │   UNIVERSAL PROBLEM ENGINE   │
                    └──────────────┬───────────────┘
                                   │
      ┌──────────────┬─────────────┼──────────────┬──────────────┐
      │              │             │              │              │
      ▼              ▼             ▼              ▼              ▼
[Story Engine]  [Game Engine] [Visualizer]   [Trace Engine] [Practice Lab]
  - Analogies    - Pair Match   - Array        - Event Stream - Fill Blanks
  - Missions     - Push/Pop     - Hash Map     - Line Sync    - Fix Bug
  - ELI5/FAANG   - Grid Flood   - Stack/Queue  - Var Diffs    - Output Guess
                 - DP Tabulate  - 2D Matrix    - Call Stack   - Reorder
                 - Pointer Walk - DP Table                    - Monaco IDE
                                - Call Stack
```

### The 14 Modular Sub-Engines:
1. **Problem Engine (`/src/lib/problems/`)**: Schema-driven problem catalog and loader.
2. **Story Engine (`/src/components/story/`)**: Real-life narratives, mission briefings, and industry applications.
3. **Concept Engine (`ConceptExplainer.tsx`)**: 4-tier conceptual breakdowns (*ELI5*, *Beginner*, *Intermediate*, *Interview*).
4. **Game Engine (`/src/components/game/`)**: Reusable mechanics (*PairSelection*, *PushPopStack*, *GridExplorer*, *DPStairFill*, *PointerWalk*).
5. **Visualization Engine (`/src/components/visualizers/`)**: Unified visual registry for Arrays, Hash Maps, Stacks, 2D Grids, DP Tables, Trees, and Call Stacks.
6. **Execution Trace Engine (`/src/lib/execution/`)**: Generates step-by-step semantic event streams, line states, and call frames.
7. **Variable Transition Engine (`VariableInspector.tsx`)**: Animates in-place variable diffs with state history ($seen: \{\} \to seen: \{2: 0\}$).
8. **Step Intel Engine (`ExecutionStepExplainer.tsx`)**: Explains *What Happened*, *Why*, and *What Changed* at each execution step.
9. **Clue Engine (`/src/components/hints/`)**: 5-stage progressive hints (*Observation $\to$ Memory $\to$ Data Structure $\to$ Pattern $\to$ Blueprint*).
10. **AI Tutor Layer (`/src/lib/ai/`)**: Multi-provider AI abstraction supporting Google Gemini API and structured offline knowledge base.
11. **Practice Engine (`/src/components/practice/`)**: 5 practice modes (*Fill in Blanks*, *Fix Bug*, *Predict Output*, *Reorder Lines*, *Write from Scratch*).
12. **Complexity Lab (`/src/components/complexity/`)**: Interactive Big-O scaling simulator with dynamic operation counters.
13. **World Map & Gamification (`/src/app/map/`)**: Interactive map across DSA realms (*Array Forest, Hashing City, Stack Tower, Graph Galaxy, DP Temple*), XP, Streaks, and Trophies.
14. **Pattern Recognition Arena (`/src/app/arena/`)**: Interview assessment training learners to classify unseen problems into optimal patterns.

---

## 📦 Demonstrations Powered by the SAME Unified Route (`/problem/[id]`)

All problems run through the **identical** dynamic route and engine:

| Problem | Category | Primary Visualizer | Game Mechanic | Real-Life Story Theme |
| :--- | :--- | :--- | :--- | :--- |
| **Two Sum** | Hashing | Array + Hash Map | Pair Selection | *Ice Cream Parlor Budget* |
| **Daily Temperatures** | Stack | Monotonic Stack + Array | Push / Pop Stack | *Mountain Barometer Observatory* |
| **Number of Islands** | Graphs / 2D Grid | 2D Matrix Grid | Grid Island Explorer | *Archipelago Cartography* |
| **Climbing Stairs** | Dynamic Programming | DP Table + Call Stack | DP Staircase Ascent | *Enchanted 1000-Step Tower* |
| **Valid Parentheses** | Stack | LIFO Stack Chamber | Rune Match Push/Pop | *Ancient Portal Locks* |
| **Binary Search** | Binary Search | Array (L, Mid, R) | Search Space Walk | *King Arthur's Vault Code* |

---

## 🧩 Adding New Problems (Zero Frontend Code Required)

To add a new problem, simply define a JSON / TypeScript schema file or use the built-in **Problem Creator** at `/create`:

```typescript
export const myCustomProblem: ProblemDefinition = {
  id: "my-problem-id",
  title: "My Problem Title",
  difficulty: "medium",
  category: "two-pointers",
  story: { ... },
  explanation: { ... },
  game: { type: "pointer-walk", ... },
  visualization: { primaryType: "array", ... },
  algorithm: { ... },
  hints: [ ... ],
  practice: { ... },
  complexity: { ... }
};
```

Register it with `registerCustomProblem(myCustomProblem)` or paste JSON at `/create`. The Universal Engine immediately generates the full lesson, visualizer, game, and practice environment!

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Monaco Editor, Lucide Icons, Canvas Confetti.
- **Backend / Tracing**: FastAPI Python 3.12+ backend with AST validation and execution sandbox, plus ultra-fast client-side deterministic trace fallback.
- **AI Tutoring**: Google Gemini API integration with intelligent offline fallback.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ and npm
- Python 3.10+ (optional for FastAPI backend)

### 2. Installation
```bash
# Clone repository
git clone https://github.com/your-username/dsa-quest.git
cd dsa-quest

# Install frontend dependencies
npm install
```

### 3. Environment Variables Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your optional Google Gemini API key:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```
*(DSA Quest works 100% offline even without an API key!)*

### 4. Running the Frontend
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running the Python Backend (Optional)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Unix/macOS:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
FastAPI server runs on [http://localhost:8000](http://localhost:8000) with interactive API docs at `/docs`.

---

## 🔐 Security & Sandbox Guarantees

User code execution is protected by multi-layer security:
1. **AST Node Filtering**: Disallows dangerous builtins (`os`, `sys`, `subprocess`, `open`, `eval`, `exec`, network calls).
2. **Execution Timeouts**: Strict 3.0 second CPU timeout per execution.
3. **Step Limits**: Tracing capped at 500 execution steps to prevent runaway loops.
4. **Local Storage Privacy**: API keys stored in local browser state and never transmitted to external logging servers.

---

## 🗺️ Curriculum Roadmap

- [x] Arrays & Single Pass
- [x] Hash Maps & Frequency Tables
- [x] Monotonic Stacks & Next Greater Element
- [x] 2D Matrix Traversals (DFS & BFS)
- [x] 1D Dynamic Programming & Tabulation
- [x] Binary Search & Search Space Halving
- [ ] Trees & Lowest Common Ancestor (LCA)
- [ ] Topological Sort & Shortest Path (Dijkstra)
- [ ] 2D Grid DP & Knapsack
- [ ] Backtracking & N-Queens

---

## 📄 License
MIT License. Built with passion for mastering Data Structures & Algorithms.
