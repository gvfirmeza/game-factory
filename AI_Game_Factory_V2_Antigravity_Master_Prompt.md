# AI Game Factory V2 — Autonomous Game Studio for Google Antigravity

## Master Implementation Prompt

Build an **AI Game Factory** inside this repository using Google Antigravity's real agent/subagent capabilities.

The goal is NOT one giant prompt pretending to be multiple agents. The goal is a real autonomous studio where specialized agents perform separate responsibilities, hand off explicit artifacts, test the actual game, iterate on failures, polish it, review it, and produce a production ZIP.

The human gives Antigravity a simple game idea such as:

> Create a cute game about a raccoon stealing food from a picnic while avoiding people.

Then the pipeline should run:

```text
HUMAN PROMPT
    ↓
PRODUCER
    ├── GAME DESIGNER
    ├── ART DIRECTOR
    └── TECHNICAL DIRECTOR
             ↓
          BUILDER
             ↓
        PLAYTESTER
             ↓
     ┌───────┴────────┐
     ↓                ↓
  DEBUGGER      GAME-DESIGN FIX
     ↓                ↓
     └───────┬────────┘
             ↓
          POLISHER
             ↓
      FINAL REVIEWER
             ↓
       PASS / FAIL
             ↓
      PRODUCTION BUILD
             ↓
        GAME LIBRARY
```

The human must not manually invoke every specialist.

---

# 1. CRITICAL ARCHITECTURAL RULE

Use Antigravity's actual supported mechanisms for:

- custom agents/subagents;
- asynchronous delegation;
- workspace skills;
- browser testing;
- artifacts;
- workflows/automation when supported;
- hooks when useful;
- MCP only when genuinely necessary.

Do not simulate agents by having one model read several Markdown prompts and perform all roles itself.

First inspect the current Antigravity installation and repository. Use the exact supported paths/formats available in the installed version. Do not invent unsupported APIs.

---

# 2. AGENT TEAM

Create these focused agents:

```text
producer
game-designer
art-director
technical-director
builder
playtester
debugger
polisher
final-reviewer
build-publisher
```

Each agent must have:

- a narrow role;
- explicit inputs;
- explicit outputs;
- forbidden responsibilities;
- acceptance criteria;
- handoff rules.

Prefer workspace custom agents under the current supported `.agents/agents/` convention.

---

# 3. SKILLS

Create focused skills under the current supported `.agents/skills/` convention:

```text
game-design
visual-design
procedural-art
game-programming
game-testing
game-polish
html5-build
playgama
```

Each skill should have a valid `SKILL.md` with appropriate frontmatter.

Keep skills focused rather than creating one giant skill.

---

# 4. REPOSITORY ARCHITECTURE

Use a structure similar to:

```text
ai-game-factory/
├── .agents/
│   ├── agents/
│   └── skills/
├── engine/
│   ├── core/
│   ├── rendering/
│   ├── characters/
│   ├── entities/
│   ├── animation/
│   ├── particles/
│   ├── effects/
│   ├── audio/
│   ├── ui/
│   ├── input/
│   ├── camera/
│   └── platform/
├── templates/
│   ├── arcade/
│   ├── runner/
│   ├── puzzle/
│   ├── platformer/
│   ├── physics/
│   └── casual/
├── games/
│   └── <game-id>/
│       ├── source/
│       ├── screenshots/
│       ├── reports/
│       ├── build/
│       ├── metadata.json
│       └── manifest.json
├── studio/
├── scripts/
├── docs/
├── AGENTS.md
├── package.json
└── README.md
```

Inspect the existing repository first and preserve useful existing work.

---

# 5. IMPORTANT UI SCOPE

The Studio UI is **NOT an AI orchestration interface**.

It must NOT:

- trigger Antigravity agents;
- implement a remote agent API;
- contain an AI chat;
- contain an agent queue;
- pretend to control Antigravity;
- create cloud infrastructure.

Generation happens from Antigravity.

The Studio exists ONLY to:

1. list generated games;
2. open/play games;
3. inspect basic metadata/status;
4. build games;
5. download ZIP builds.

Keep it small.

---

# 6. GAME STUDIO UI

Create a simple local frontend called **Game Studio**.

It discovers games under:

```text
games/
```

Each game has metadata such as:

```json
{
  "id": "raccoon-picnic",
  "title": "Raccoon Picnic",
  "description": "A cute arcade game...",
  "genre": "arcade",
  "version": "0.1.0",
  "status": "ready",
  "orientation": "portrait",
  "thumbnail": "screenshots/thumbnail.png"
}
```

The home page should show a clean card-based library:

```text
AI GAME FACTORY

YOUR GAMES

┌────────────────────┐
│     THUMBNAIL      │
├────────────────────┤
│ Raccoon Picnic     │
│ Arcade · v0.1.0    │
│ [ PLAY ] [ BUILD ] │
└────────────────────┘
```

Clicking a game opens a detail page with:

- thumbnail;
- title;
- description;
- version;
- status;
- latest test status;
- latest build status;
- Play;
- Build;
- Download ZIP.

---

# 7. GAME PREVIEW

Games must remain independently runnable HTML5 games.

The Studio should load the game without rewriting its source.

Prefer iframe/isolation or another robust local preview mechanism.

Provide:

- play;
- reload;
- fullscreen where practical;
- portrait/mobile-like preview where relevant.

---

# 8. BUILD SYSTEM

Every game must be independently buildable.

Create a reusable build command/script.

For example:

```text
npm run game:build -- <game-id>
```

Use a better command if the project architecture requires it.

The build pipeline:

```text
SOURCE
 ↓
TYPECHECK
 ↓
PRODUCTION BUILD
 ↓
VALIDATION
 ↓
ZIP
```

Expected output:

```text
games/<game-id>/build/<game-id>.zip
```

The Studio Build button must invoke the real local build mechanism.

The Download button must download the actual generated ZIP.

Never fake build success.

---

# 9. BUILD VALIDATION

Before marking a build successful:

- typecheck;
- production build;
- verify entry point;
- verify required assets;
- verify output;
- verify ZIP exists;
- verify ZIP is non-empty;
- run a smoke test when practical.

If anything critical fails, the build must be marked failed.

---

# 10. PLAYGAMA

The long-term target is Playgama.

Isolate Playgama-specific code under:

```text
engine/platform/playgama/
```

Use current official Playgama documentation when implementing APIs.

Do not invent or assume outdated Playgama APIs.

Generic games must remain runnable independently of Playgama.

---

# 11. GAME DESIGNER

The Game Designer only designs gameplay.

It receives:

```text
game-brief.md
```

It produces:

```text
game-design.md
```

The document must define:

- fantasy;
- genre;
- orientation;
- target player;
- core loop;
- controls;
- objective;
- win condition;
- loss condition;
- scoring;
- difficulty;
- progression;
- session length;
- replayability;
- tutorial;
- restart;
- reward feedback;
- failure feedback.

It must reject or improve weak concepts before implementation.

It must NOT implement production code.

---

# 12. GAMEPLAY QUALITY

Every game must have a real core loop.

Reject concepts that are basically:

```text
click
→ animation
→ nothing
```

or:

```text
move
→ random objects
→ no goal
```

A good loop should provide:

1. immediate understanding;
2. meaningful interaction;
3. feedback;
4. challenge;
5. reward;
6. progression/tension;
7. replayability.

Prefer a small excellent loop over a large broken one.

---

# 13. ART DIRECTOR

The Art Director receives:

```text
game-brief.md
game-design.md
visual rules
```

It produces:

```text
art-direction.md
asset-manifest.json
```

Define:

- style;
- palette;
- shapes;
- silhouettes;
- proportions;
- environment;
- UI;
- lighting;
- shadows;
- outlines;
- animation personality;
- effects.

Target aesthetic:

- cute;
- polished;
- playful;
- readable;
- colorful;
- rounded;
- vector-like;
- soft cartoon;
- expressive;
- mobile-first.

Do not copy existing games/assets.

---

# 14. PROCEDURAL VISUAL SYSTEM

Prefer reusable vector/procedural graphics where appropriate.

Implement primitives such as:

```text
Circle
Ellipse
RoundedRect
Polygon
BezierPath
Group
Gradient
Shadow
Highlight
Outline
```

Characters can be composed from:

```text
Head
Body
Eyes
Mouth
Ears
Arms
Legs
Tail
Accessories
```

However, do NOT force procedural graphics when an image asset would clearly produce a better result.

Consistency and quality matter more than ideology.

---

# 15. ANIMATION SYSTEM

Create reusable animation primitives:

```text
bounce
squash
stretch
pop
shake
wobble
float
recoil
pulse
rotate
fade
slide
overshoot
```

Use appropriate easing.

Avoid mechanical linear movement.

---

# 16. JUICE SYSTEM

Implement reusable:

```text
camera shake
screen flash
particle burst
floating text
scale punch
hit effects
collect effects
dust
sparkles
trails
impact
bounce
```

Important interactions should have appropriate audiovisual/visual feedback.

Example:

```text
COLLECT
 ↓
scale punch
 ↓
particles
 ↓
sound
 ↓
floating score
 ↓
character reaction
```

---

# 17. TECHNICAL DIRECTOR

The Technical Director receives the design and art specifications.

It produces:

```text
technical-plan.md
```

Define:

- template;
- scenes;
- entities;
- state machine;
- input;
- physics;
- collision;
- spawning;
- difficulty;
- UI;
- asset integration;
- performance;
- build requirements.

It should not implement the whole game.

---

# 18. BUILDER

The Builder receives:

```text
game-brief.md
game-design.md
art-direction.md
asset-manifest.json
technical-plan.md
```

It implements the game.

Rules:

- core loop first;
- reuse engine components;
- reuse templates;
- avoid duplicated systems;
- keep game runnable;
- test continuously;
- do not perform unrelated refactors;
- never claim success without running the game.

---

# 19. PLAYTESTER

The Playtester is mandatory.

It must test the actual running game, not merely read source code.

Use Antigravity's browser capabilities when available.

It should:

- launch;
- interact;
- play multiple rounds;
- test controls;
- test win/failure;
- test restart;
- inspect console;
- inspect layout;
- test mobile orientation;
- capture screenshots when useful;
- evaluate gameplay;
- evaluate visual consistency.

It produces:

```text
reports/playtest-01.md
```

Use severity:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

And score:

```text
GAMEPLAY: /10
VISUALS: /10
UX: /10
POLISH: /10
```

Scores must be justified.

---

# 20. DEBUGGER

The Debugger receives failed test reports.

It must:

1. reproduce;
2. identify root cause;
3. fix;
4. run tests;
5. verify.

Report:

```text
issue
root cause
fix
verification
```

Do not blindly patch symptoms.

---

# 21. POLISHER

Only polish after gameplay is functional.

Responsibilities:

- animation timing;
- particles;
- microinteractions;
- UI feedback;
- transitions;
- character reactions;
- camera feel;
- sound feedback;
- visual hierarchy;
- responsive layout.

Do not redesign a functioning core loop unless explicitly routed back to Game Design.

---

# 22. FINAL REVIEWER

The Final Reviewer must independently inspect the running game.

Evaluate:

```text
GAMEPLAY
VISUALS
UX
POLISH
PERFORMANCE
TECHNICAL QUALITY
```

Return:

```text
PASS
```

or:

```text
FAIL
```

On FAIL, identify the correct next agent.

Example:

```text
FAIL

Reason:
The game does not provide meaningful decisions.

Route:
Game Designer → Builder → Playtester
```

Do not let the Builder declare its own final success.

---

# 23. BUILD/PUBLISH AGENT

Responsible only for production packaging.

It:

- validates;
- builds;
- packages;
- generates ZIP;
- updates metadata;
- marks game ready.

It does not redesign gameplay.

---

# 24. ARTIFACT-BASED HANDOFFS

Do not depend on enormous shared conversation history.

Use explicit files:

```text
games/<game-id>/
├── game-brief.md
├── game-design.md
├── art-direction.md
├── asset-manifest.json
├── technical-plan.md
├── reports/
│   ├── playtest-01.md
│   ├── review-01.md
│   └── ...
├── source/
├── screenshots/
├── build/
└── metadata.json
```

These artifacts are the persistent source of truth.

---

# 25. PRODUCER

The Producer is the orchestrator.

It must:

- receive the human idea;
- create game workspace;
- delegate;
- monitor;
- enforce dependencies;
- route failures;
- request iteration;
- trigger final review;
- trigger build after approval.

It should delegate specialized work instead of performing it itself.

---

# 26. DEFAULT PIPELINE

Use:

```text
PROMPT
 ↓
PRODUCER
 ↓
GAME DESIGNER
 ↓
ART DIRECTOR + TECHNICAL DIRECTOR
 ↓
BUILDER
 ↓
PLAYTESTER
 ↓
DECISION
 ├── BUG → DEBUGGER → PLAYTESTER
 ├── DESIGN → GAME DESIGNER → BUILDER → PLAYTESTER
 └── PASS → POLISHER → PLAYTESTER
                         ↓
                   FINAL REVIEWER
                         ↓
                    PASS / FAIL
                         ↓
                       BUILD
```

Use parallelism where dependencies allow it.

---

# 27. STATE MACHINE

Store generation state in:

```text
games/<game-id>/metadata.json
```

Possible states:

```text
IDEA
DESIGNING
DESIGNED
ART_DIRECTING
TECH_PLANNING
BUILDING
PLAYTESTING
FIXING
POLISHING
FINAL_REVIEW
APPROVED
BUILDING_RELEASE
READY
FAILED
```

Example:

```json
{
  "id": "raccoon-picnic",
  "status": "playtesting",
  "version": "0.1.0",
  "pipeline": {
    "design": "done",
    "art": "done",
    "technical": "done",
    "implementation": "done",
    "playtest": "running",
    "polish": "pending",
    "review": "pending",
    "build": "pending"
  }
}
```

---

# 28. FAILURE ROUTING

Route failures intelligently.

```text
collision bug
→ Debugger

boring gameplay
→ Game Designer

bad visual language
→ Art Director / Polisher

build failure
→ Technical Director / Builder / Build Agent

UI issue
→ Builder / Polisher
```

Do not restart the entire pipeline unnecessarily.

---

# 29. ITERATION LIMIT

Default maximum:

```text
5 major correction cycles
```

After five failed cycles, mark:

```text
FAILED_REVIEW
```

and produce a useful report rather than looping forever.

---

# 30. QUALITY GATE

A game cannot be READY unless:

```text
[ ] starts
[ ] core loop works
[ ] controls work
[ ] objective is clear
[ ] win/failure works
[ ] restart works
[ ] no critical console errors
[ ] no game-breaking bugs
[ ] visual style is consistent
[ ] UI is readable
[ ] animations work
[ ] feedback exists
[ ] difficulty is reasonable
[ ] replayability exists
[ ] mobile/portrait layout works when applicable
[ ] performance is acceptable
[ ] production build succeeds
[ ] ZIP exists
```

---

# 31. ENGINE

Initial preferred stack:

```text
TypeScript
Phaser
Vite
HTML5
CSS
SVG / Canvas
Node.js tooling
```

Avoid unnecessary frameworks.

---

# 32. TEMPLATES

Create reusable templates:

```text
Arcade
Runner
Puzzle
Platformer
Physics
Casual
```

But validate the Arcade template first.

Do not spend most of the project implementing unused templates.

---

# 33. FIRST BENCHMARK

Create:

# Tiny Road

A cute cartoon character crosses a dangerous road.

Features:

- player;
- traffic;
- collectibles;
- score;
- progressive difficulty;
- game over;
- restart;
- character animation;
- squash/stretch;
- particles;
- camera feedback;
- UI;
- sound feedback where practical.

This is a benchmark for the factory, not merely a demo.

It should feel like a small polished casual game.

---

# 34. GAME STUDIO DISCOVERY

The Studio should automatically discover games from:

```text
games/*/metadata.json
```

If browser security prevents direct filesystem access, use a lightweight local manifest/API.

Do not add cloud infrastructure.

---

# 35. STUDIO BUILD FLOW

When clicking BUILD:

```text
Building...
✓ Typecheck
✓ Production build
✓ Validation
✓ ZIP created
[ DOWNLOAD ZIP ]
```

On failure:

```text
Build failed
[ VIEW LOGS ]
```

Never fake progress or success.

---

# 36. NO FAKE FEATURES

Do not create buttons that merely pretend to work.

If a feature is visible as functional, it must actually function.

No fake:

- agent progress;
- build progress;
- test reports;
- success states;
- ZIP downloads.

---

# 37. PERFORMANCE

Keep games lightweight:

- reusable components;
- optimized assets;
- object pooling where useful;
- limited particles;
- efficient update loops;
- fast startup;
- minimal dependencies;
- no unnecessary network requirements.

---

# 38. DEVELOPMENT PHASES

## Phase 1 — Audit

Inspect the existing repository and preserve useful work.

Audit:

- engine;
- games;
- agents;
- skills;
- workflows;
- current generation problems.

## Phase 2 — Agent infrastructure

Implement the actual custom agents.

## Phase 3 — Skills

Implement focused skills and validate discovery.

## Phase 4 — Orchestration

Implement the supported workflow/automation mechanism.

## Phase 5 — Engine

Implement minimum engine systems for Tiny Road.

## Phase 6 — Benchmark

Run the real agent pipeline to build Tiny Road.

## Phase 7 — Playtest

Actually play it in browser and iterate.

## Phase 8 — Studio

Build the local game library.

Verify:

```text
game appears
→ Play
→ Build
→ ZIP
→ Download
```

## Phase 9 — End-to-end validation

Run a second concept through the complete pipeline.

---

# 39. END-TO-END TEST

After the system is ready, test:

> Create a cute arcade game where a small fox crosses a busy street collecting apples while avoiding cars.

Expected:

```text
Producer
 ↓
Game Designer
 ↓
Art Director + Technical Director
 ↓
Builder
 ↓
Playtester
 ↓
Fix/iterate
 ↓
Polisher
 ↓
Final Reviewer
 ↓
Build
 ↓
Studio Library
```

Then verify:

```text
Studio
 ↓
Fox game appears
 ↓
Play
 ↓
Game runs
 ↓
Build
 ↓
ZIP generated
 ↓
Download
```

---

# 40. DO NOT STOP AT DOCUMENTATION

The task is not complete when the agents exist.

It is not complete when the workflow exists.

It is not complete when the Studio exists.

It is complete only when the entire chain works:

```text
PROMPT
 ↓
REAL AGENTS
 ↓
REAL GAME
 ↓
REAL PLAYTEST
 ↓
REAL ITERATION
 ↓
REAL POLISH
 ↓
REAL REVIEW
 ↓
REAL BUILD
 ↓
REAL ZIP
 ↓
STUDIO LIBRARY
 ↓
PLAY / BUILD / DOWNLOAD
```

---

# 41. FINAL INSTRUCTION

Start NOW.

Do not respond with a plan only.

First inspect the workspace and current Antigravity capabilities.

Then implement the system.

Reuse what is good from the previous AI Game Factory implementation, but fix the fundamental flaw: one model must not perform every role in one giant pass.

Use real specialized agents and explicit handoffs.

Do not ask for confirmation for ordinary technical decisions.

If a described Antigravity feature is unavailable, detect it and use the closest supported mechanism.

Do not invent APIs.

Do not claim something works without testing it.

Finish with:

1. real agents;
2. real orchestration;
3. real Tiny Road game;
4. real browser playtest;
5. real iteration;
6. real polish;
7. real final review;
8. real production build;
9. real ZIP;
10. real Studio library with Play, Build and Download.

The final repository must be a functioning **AI Game Studio**, not a collection of prompts.
