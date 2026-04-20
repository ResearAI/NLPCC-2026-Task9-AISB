#!/bin/bash
# AISB 2026 — Git Repository Sanitization
# Strips git history to prevent answer leakage via git log/branch/reflog.
# Based on SECURITY_SPECIFICATION.md Section 5.
#
# Usage: bash sanitize_git.sh /path/to/repo
set -euo pipefail

REPO_DIR="${1:-.}"

if [ ! -d "$REPO_DIR/.git" ]; then
    echo "[SANITIZE] No .git directory found in $REPO_DIR — skipping"
    exit 0
fi

cd "$REPO_DIR"
echo "[SANITIZE] Cleaning git history in $(pwd)"

# 1. Remove all remotes (prevents fetching solution branches)
for remote in $(git remote 2>/dev/null); do
    git remote remove "$remote" 2>/dev/null || true
done

# 2. Delete all branches except current
CURRENT=$(git branch --show-current 2>/dev/null || echo "main")
git branch | grep -v "^\* " | xargs -r git branch -D 2>/dev/null || true

# 3. Delete all tags
git tag -l | xargs -r git tag -d 2>/dev/null || true

# 4. Delete all stashes
git stash clear 2>/dev/null || true

# 5. Expire reflog (removes historical references)
git reflog expire --expire=now --all 2>/dev/null || true

# 6. Aggressive garbage collection (prune loose objects)
git gc --prune=now --aggressive 2>/dev/null || true

# 7. Verify
BRANCH_COUNT=$(git branch | wc -l | tr -d ' ')
REMOTE_COUNT=$(git remote | wc -l | tr -d ' ')
TAG_COUNT=$(git tag -l | wc -l | tr -d ' ')

echo "[SANITIZE] Result: branches=$BRANCH_COUNT remotes=$REMOTE_COUNT tags=$TAG_COUNT"

if [ "$REMOTE_COUNT" -ne 0 ]; then
    echo "[SANITIZE] ERROR: Remotes still present after sanitization"
    exit 1
fi

if [ "$TAG_COUNT" -ne 0 ]; then
    echo "[SANITIZE] WARNING: Tags still present"
fi

echo "[SANITIZE] Git sanitization complete"
