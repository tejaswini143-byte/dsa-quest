@echo off
echo =========================================================
echo   DSA QUEST -- Starting Backend and Frontend Dev Servers
echo =========================================================

REM Navigate to project root
cd /d "%~dp0\.."

REM Start Python FastAPI Backend in a new window
echo [*] Starting Python Backend API on http://localhost:8000 ...
start "DSA Quest Backend" cmd /k "cd backend && python main.py"

REM Start Next.js Frontend
echo [*] Starting Next.js Frontend on http://localhost:3000 ...
npm run dev

echo =========================================================
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo =========================================================
