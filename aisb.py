#!/usr/bin/env python3
"""Repository-local AISB CLI wrapper.

Use this before installing the package:

    python aisb.py bench list

After installation, the equivalent console command is:

    aisb bench list
"""
from __future__ import annotations

import sys
from pathlib import Path

SRC_ROOT = Path(__file__).resolve().parent / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from aisb.cli import main


if __name__ == "__main__":
    raise SystemExit(main())
