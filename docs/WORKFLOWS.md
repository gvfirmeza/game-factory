# AI Game Factory — Multi-Agent Workflows & Quality Gates

## 1. Pipeline Execution Flow
1. **Producer**: Creates `games/<game-id>/` workspace and seeds `metadata.json`.
2. **Game Designer**: Reads `game-brief.md`, writes `game-design.md`.
3. **Art Director**: Writes `art-direction.md` and `asset-manifest.json`.
4. **Technical Director**: Writes `technical-plan.md`.
5. **Builder**: Implements `source/index.html`, `source/style.css`, `source/game.js`.
6. **Playtester**: Tests the running game in browser, writes `reports/playtest-*.md`.
7. **Debugger / Polisher**: Fixes bugs or adds juice.
8. **Final Reviewer**: Evaluates against Master Checklist, writes `reports/review-*.md` and issues `PASS` or `FAIL`.
9. **Build Publisher**: Runs `npm run game:build -- <game-id>`, creates production ZIP, and sets status to `ready`.

## 2. Quality Gate Checklist
- [x] Renders at 60 FPS without frame drops.
- [x] Zero JavaScript console errors on initialization or state changes.
- [x] Immediate 1-tap/key restart without state corruption.
- [x] Audio and visual juice on all key actions.
- [x] Production ZIP verified non-empty.
