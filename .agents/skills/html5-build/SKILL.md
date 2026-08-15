---
name: html5-build
description: Production packaging, asset inlining, standalone bundling, validation gates, and ZIP generation for HTML5 games.
---

# HTML5 Build Skill

## 1. Build Requirements
A production HTML5 game build must satisfy:
1. **Self-Contained**: Can run when loaded directly from file or static web server.
2. **Zero Missing Assets**: All scripts, styles, procedural rendering logic, and synthesized audio must resolve cleanly.
3. **Optimized Size**: Lightweight footprint (< 2 MB uncompressed, < 500 KB compressed).
4. **Valid ZIP Archive**: Packaged directly under `games/<game-id>/build/<game-id>.zip`.

## 2. Validation Gate Check
- [x] Typecheck/syntax check on all source files.
- [x] Verify `index.html` has proper viewport meta tags: `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`.
- [x] Verify ZIP exists and is > 1000 bytes.
- [x] Verify `metadata.json` updated with build status and timestamp.
