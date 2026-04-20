#!/bin/bash
# AISB 2026 — Container entrypoint
# Security: clears cache, validates environment, captures logs, then runs user command
set -e

# --- Security: clear any cached data from previous phases ---
rm -rf /home/agent/.cache/pip/* /home/agent/.cache/huggingface 2>/dev/null || true

# --- Create log directory ---
AISB_LOG_DIR="${AISB_LOG_DIR:-/home/agent/submission/logs}"
mkdir -p "$AISB_LOG_DIR"
export AISB_LOG_DIR

# --- Validate required environment ---
if [ -z "$AISB_MODE" ]; then
    export AISB_MODE="submit"
fi

echo "[AISB] Mode: $AISB_MODE | Track: ${AISB_TRACK:-unset} | Budget: \$${BUDGET_USD:-10} | Max iterations: ${MAX_ITERATIONS:-20}"
echo "[AISB] Log dir: $AISB_LOG_DIR"
echo "[AISB] Started at: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# --- Capture stdout/stderr to run.log while still showing on console ---
exec > >(tee -a "$AISB_LOG_DIR/run.log") 2>&1

# --- Execute the user command or default CMD ---
exec "$@"
