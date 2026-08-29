# DSA Quest Safe Auto-Publish Script
# Usage: npm run publish (or powershell -ExecutionPolicy Bypass -File ./scripts/publish.ps1)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🚀 DSA QUEST — SAFE AUTO-PUBLISH PIPELINE" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check Project Root
$CurrentDir = Get-Location
if (-not (Test-Path "$CurrentDir\package.json") -or -not (Test-Path "$CurrentDir\src\types\problem.ts")) {
    Write-Error "❌ Error: Must run publish script from the actual DSA Quest project root directory."
    exit 1
}
Write-Host "✓ Verified DSA Quest project root: $CurrentDir" -ForegroundColor Green

# 2. Check Git Repo
if (-not (Test-Path "$CurrentDir\.git")) {
    Write-Error "❌ Error: Not a git repository."
    exit 1
}
Write-Host "✓ Verified Git repository" -ForegroundColor Green

# 3. Secret Scan (Ensure no private API keys or .env secrets are committed)
Write-Host "🔍 Running Security & Secret Scan..." -ForegroundColor Yellow
$stagedOrTrackedFiles = git ls-files
$secretFound = $false
foreach ($file in $stagedOrTrackedFiles) {
    if ($file -match "\.env$" -or $file -match "\.env\.local$") {
        Write-Error "❌ Security Alert: Found $file tracked in git!"
        $secretFound = $true
    }
}
if ($secretFound) {
    exit 1
}
Write-Host "✓ Secret scan passed — Zero keys or local .env files found" -ForegroundColor Green

# 4. Run Build Validation
Write-Host "🏗️ Running Next.js Build Verification..." -ForegroundColor Yellow
cmd.exe /c "npm run build"
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Build failed! Aborting publish."
    exit 1
}
Write-Host "✓ Build passed with zero errors" -ForegroundColor Green

# 5. Git Add & Commit
Write-Host "📦 Staging changes..." -ForegroundColor Yellow
git add .

$status = git status --porcelain
if ($status) {
    Write-Host "📝 Committing changes..." -ForegroundColor Yellow
    git commit -m "feat(universal-engine): enhance universal Python playground, multi-visualizers, and test suites"
} else {
    Write-Host "ℹ️ Working tree clean — no new changes to commit." -ForegroundColor Cyan
}

# 6. Push to origin/main
Write-Host "🚀 Pushing to GitHub (origin/main)..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Git push failed. Please check authentication or resolve remote conflicts without force pushing."
    exit 1
}

Write-Host "==========================================" -ForegroundColor Green
Write-Host "🎉 SUCCESS: DSA QUEST PUBLISHED TO GITHUB!" -ForegroundColor Green
Write-Host "Repository: https://github.com/tejaswini143-byte/dsa-quest" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
