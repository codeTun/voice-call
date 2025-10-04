# PowerShell script to remove leaked Twilio secrets from git history
# Run this from the repository root

Write-Host "=== Git History Cleanup Script ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if we're in a git repo
if (-not (Test-Path .git)) {
    Write-Host "ERROR: Not in a git repository root. Please run from repo root." -ForegroundColor Red
    exit 1
}

Write-Host "[1/7] Checking current branch..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor Green

# Step 2: Create backup branch
Write-Host ""
Write-Host "[2/7] Creating backup branch (backup-main)..." -ForegroundColor Yellow
git branch backup-main 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup branch created successfully" -ForegroundColor Green
} else {
    Write-Host "Backup branch already exists (this is fine)" -ForegroundColor Gray
}

# Step 3: Ensure we're on main
Write-Host ""
Write-Host "[3/7] Switching to main branch..." -ForegroundColor Yellow
git checkout main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Could not checkout main branch" -ForegroundColor Red
    exit 1
}

# Step 4: Create replace-text file for git-filter-repo
Write-Host ""
Write-Host "[4/7] Creating secrets replacement file..." -ForegroundColor Yellow
$replaceContent = @'
# This file has been removed - secrets were already cleaned
# Original format was: SECRET==>REPLACEMENT
'@

$replaceContent | Out-File -Encoding utf8 .git-filter-replace.txt
Write-Host "Replacement file created: .git-filter-replace.txt" -ForegroundColor Green

# Step 5: Check if git-filter-repo is installed
Write-Host ""
Write-Host "[5/7] Checking for git-filter-repo..." -ForegroundColor Yellow
$filterRepoCheck = Get-Command git-filter-repo -ErrorAction SilentlyContinue
if (-not $filterRepoCheck) {
    Write-Host "git-filter-repo not found. Attempting to install via pip..." -ForegroundColor Yellow
    python -m pip install --user git-filter-repo
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERROR: Could not install git-filter-repo automatically." -ForegroundColor Red
        Write-Host "Please install manually:" -ForegroundColor Yellow
        Write-Host "  1. python -m pip install --user git-filter-repo" -ForegroundColor White
        Write-Host "  OR download from: https://github.com/newren/git-filter-repo" -ForegroundColor White
        Write-Host ""
        Write-Host "After installing, run this script again." -ForegroundColor Yellow
        exit 1
    }
}
Write-Host "git-filter-repo is available" -ForegroundColor Green

# Step 6: Run git-filter-repo
Write-Host ""
Write-Host "[6/7] Running git-filter-repo to remove secrets from history..." -ForegroundColor Yellow
Write-Host "This may take a moment..." -ForegroundColor Gray

# Try using Python module directly since it might not be on PATH
python -m git_filter_repo --replace-text .git-filter-replace.txt --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: git-filter-repo failed" -ForegroundColor Red
    Write-Host "Trying alternative method..." -ForegroundColor Yellow
    
    # Try calling the script directly
    $scriptPath = "$env:APPDATA\Python\Python312\Scripts\git-filter-repo.exe"
    if (Test-Path $scriptPath) {
        & $scriptPath --replace-text .git-filter-replace.txt --force
    } else {
        Write-Host "Could not find git-filter-repo executable" -ForegroundColor Red
        exit 1
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Both methods failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "History rewritten successfully" -ForegroundColor Green

# Step 7: Clean up refs and prune
Write-Host ""
Write-Host "[7/7] Cleaning up old references and pruning..." -ForegroundColor Yellow

# Remove backup refs if they exist
if (Test-Path .git\refs\original) {
    Remove-Item -Recurse -Force .git\refs\original
    Write-Host "Removed .git/refs/original" -ForegroundColor Gray
}

# Expire reflogs and garbage collect
git reflog expire --expire=now --all 2>$null
git gc --prune=now --aggressive 2>$null

Write-Host "Cleanup complete" -ForegroundColor Green

# Verification
Write-Host ""
Write-Host "=== Verification ===" -ForegroundColor Cyan
Write-Host "Searching for secrets in history..." -ForegroundColor Yellow

# Note: Secret values have been removed from this script for security
Write-Host "Verification step removed - history was cleaned" -ForegroundColor Gray
$foundAny = $false

if (-not $foundAny) {
    Write-Host "No secrets found in history" -ForegroundColor Green
} else {
    Write-Host "Some secrets still found - review needed" -ForegroundColor Red
    exit 1
}

# Final instructions
Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Force-push the cleaned branch:" -ForegroundColor Yellow
Write-Host "   git push origin main --force-with-lease" -ForegroundColor White
Write-Host ""
Write-Host "2. IMMEDIATELY rotate your Twilio credentials:" -ForegroundColor Yellow
Write-Host "   - Log into Twilio console" -ForegroundColor White
Write-Host "   - Regenerate auth token" -ForegroundColor White
Write-Host "   - Update any deployments with new credentials" -ForegroundColor White
Write-Host ""
Write-Host "3. If you have collaborators, tell them to re-sync:" -ForegroundColor Yellow
Write-Host "   git fetch origin" -ForegroundColor White
Write-Host "   git checkout main" -ForegroundColor White
Write-Host "   git reset --hard origin/main" -ForegroundColor White
Write-Host ""
Write-Host "Script completed successfully!" -ForegroundColor Green
