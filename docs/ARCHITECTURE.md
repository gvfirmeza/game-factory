# AI Game Factory — Architecture Documentation

## 1. System Overview
AI Game Factory V2 is a multi-agent autonomous game creation studio for Google Antigravity. Rather than running a monolithic prompt where a single model simulates all roles in one pass without validation, the studio is architected around specialized subagents with persistent artifact-based handoffs.

```
HUMAN PROMPT
    ↓
PRODUCER
    ├── GAME DESIGNER (game-design.md)
    ├── ART DIRECTOR (art-direction.md + asset-manifest.json)
    └── TECHNICAL DIRECTOR (technical-plan.md)
             ↓
          BUILDER (source/index.html, source/game.js)
             ↓
        PLAYTESTER (reports/playtest-01.md)
             ↓
     ┌───────┴────────┐
     ↓                ↓
  DEBUGGER      GAME-DESIGN FIX
     ↓                ↓
     └───────┬────────┘
             ↓
          POLISHER (Juice & micro-interactions)
             ↓
      FINAL REVIEWER (reports/review-01.md)
             ↓
        PASS / FAIL
             ↓
      BUILD PUBLISHER (scripts/build-game.js)
             ↓
       GAME STUDIO (Play, Build, Download ZIP)
```

## 2. Directory Layout
- `.agents/`:
  - `agents/`: Workspace agent definitions (`producer`, `game-designer`, `art-director`, `technical-director`, `builder`, `playtester`, `debugger`, `polisher`, `final-reviewer`, `build-publisher`).
  - `skills/`: Workspace skills (`game-design`, `visual-design`, `procedural-art`, `game-programming`, `game-testing`, `game-polish`, `html5-build`, `playgama`).
- `engine/`: Zero-dependency modular HTML5 game engine (Core Loop, Vector2, EventBus, StateMachine, Procedural Rendering Primitives, Procedural Character Generator, Entity/Lane System, Particle System, Juice Effects, Procedural Audio Synth, Universal Input, Camera2D, Playgama Bridge).
- `templates/`: Base game templates (Arcade, Runner, Puzzle, Platformer, Physics, Casual).
- `games/`: Discovered standalone games with source, assets, reports, and production ZIP builds.
- `studio/`: Local frontend and REST server for playing, testing, building, and downloading games.
- `scripts/`: Production build and validation toolchain.
