# AI Game Factory V2 — Autonomous Game Studio

![AI Game Factory Studio](games/tiny-road/screenshots/thumbnail.png)

An autonomous multi-agent game creation studio built for **Google Antigravity**. AI Game Factory replaces monolithic single-prompt generation with a team of specialized subagents, persistent artifact handoffs, procedural graphics & audio, real in-browser playtesting, quality gates, and automated production packaging.

---

## 🎮 Features
- **Real Multi-Agent Studio**: Specialized agents (`producer`, `game-designer`, `art-director`, `technical-director`, `builder`, `playtester`, `debugger`, `polisher`, `final-reviewer`, `build-publisher`).
- **Zero-Dependency Engine**: Pure HTML5 2D Canvas + Web Audio API synthesizer for 100% offline standalone reliability.
- **Juicy Micro-Interactions**: Squash & stretch physics, particle bursts, screen shake, camera follow, and floating score popups.
- **Local Game Studio**: Card-based library to inspect, play, test, build, and download generated games.
- **Playgama Ready**: Built-in Playgama bridge for leaderboards and ads with transparent offline fallbacks.
- **Production Build System**: Independent typechecking, asset verification, and ZIP packaging.

---

## 🚀 Quick Start

### 1. Start the Local Game Studio
```bash
npm start
# Or: npm run studio
```
Open **`http://localhost:3000`** in your browser to view the library, play games in the simulator, trigger builds, and download production ZIPs.

### 2. Build a Game Package
```bash
npm run game:build -- tiny-road
```
Creates a production ZIP archive under `games/tiny-road/build/tiny-road.zip`.

### 3. Validate a Game
```bash
npm run game:validate -- tiny-road
```

---

## 🏗️ Architecture

```text
ai-game-factory/
├── .agents/
│   ├── agents/          # Agent definition specifications
│   └── skills/          # Focused agent skill playbooks
├── engine/              # Zero-dependency modular game engine
│   ├── core/            # Loop, Math, Vector2, EventBus, StateMachine
│   ├── rendering/       # CanvasRenderer & ProceduralPrimitives
│   ├── characters/      # Procedural Character Generator
│   ├── entities/        # Entity, Vehicle, Collectible, Lane
│   ├── animation/       # TweenManager & Easings
│   ├── particles/       # High-performance ParticleSystem
│   ├── effects/         # CameraShake, ScreenFlash, FloatingText
│   ├── audio/           # Web Audio API Synthesizer
│   ├── input/           # Universal Keyboard & Touch Manager
│   ├── camera/          # 2D Camera with bounds & shake
│   └── platform/        # Playgama SDK Bridge & fallbacks
├── templates/           # Reusable genre templates (Arcade, Runner, etc.)
├── games/
│   └── tiny-road/       # Benchmark casual arcade game
│       ├── source/      # Standalone HTML5 source code
│       ├── screenshots/ # Thumbnail and gameplay captures
│       ├── reports/     # QA Playtest & Final Review reports
│       ├── build/       # Production ZIP distribution
│       ├── metadata.json
│       └── manifest.json
├── studio/              # Local studio web app and REST API server
├── scripts/             # Build, validation, and pipeline scripts
└── package.json
```

---

## 🕹️ Benchmark Game: Tiny Road
- **Genre**: Cute Crossy Arcade
- **Hero**: Pippin the Chick
- **Controls**: Arrow Keys / WASD / Touch Swipes / On-Screen D-Pad
- **Features**: Infinite procedural roads, dynamic traffic acceleration, golden corn collectibles with combo multipliers, squash/stretch hopping, dust & star particles, camera shake, and Web Audio synthesizer chords.

---

## 📜 License
MIT License. Built for Google Antigravity.
