# AI Game Factory — opencode Pipeline Rules

## Overview
The AI Game Factory is an autonomous multi-agent game creation studio running on opencode. It uses specialized agents, parallel execution, mathematical validation, and quality gates to produce production-ready HTML5 games.

## Design-First Philosophy
- Every mechanic, room, enemy, and collectible must have a concrete reason to exist.
- A smaller game with 5 handcrafted, reachable rooms > 20 repetitive rooms.
- One excellent mechanic > 5 meaningless mechanics.
- NPCs, dialogue, shops are OPTIONAL — only include if justified by core loop.

---

## Pipeline Execution (Follow This Order)

### Phase 1: Concept → Design
```
1. Create workspace: games/<game-id>/ with metadata.json and game-brief.md
2. LAUNCH IN PARALLEL (single message, multiple Task calls):
   - Task(game-designer): Write game-design-intent.md, game-design.md, game-contract.json, content-requirements.json
3. Wait for completion → update metadata to DESIGNED
```

### Phase 2: Level Design
```
4. Task(level-designer): Write level-graph.json and ascii-layout.txt
```

### Phase 3: Validation Gate (MUST PASS BEFORE BUILD)
```
5. Bash: node scripts/validate-design.js <id>
6. Bash: node scripts/validate-reachability.js <id>
7. If FAIL → fix design, goto 4. If PASS → continue.
8. Write design-validation.md with PASS verdict
```

### Phase 4: Art & Tech (PARALLEL)
```
9. LAUNCH IN PARALLEL (single message, multiple Task calls):
   - Task(general): Write art-direction.md and asset-manifest.json
   - Task(general): Write technical-plan.md
10. Wait for completion
```

### Phase 5: Build
```
11. Task(builder): Implement source/game.js, source/index.html, source/style.css, manifest.json
```

### Phase 6: Validate & Test
```
12. Bash: node scripts/validate-static.js <id>
13. Bash: node scripts/validate-level.js <id>
14. Bash: node scripts/test-game.js <id>
15. If FAIL → Phase 7. If PASS → Phase 8.
```

### Phase 7: Debug Loop (max 5 iterations)
```
16. Task(debugger): Fix bugs from test output
17. Re-run Steps 12-14
18. If still failing after 5 iterations → mark FAILED_REVIEW, stop.
```

### Phase 8: Polish
```
19. Task(polisher): Add juice (particles, shake, audio, squash/stretch)
```

### Phase 9: Final Review
```
20. Task(reviewer): Evaluate against master checklist → PASS or FAIL
21. If FAIL → route to appropriate agent based on reviewer's instructions, goto 12.
```

### Phase 10: Production Build
```
22. Bash: node scripts/build-game.js <id>
23. Verify: games/<game-id>/build/<game-id>.zip exists and is non-empty
24. Update metadata.json status to "ready"
```

---

## Parallelism Rules

### Can run in PARALLEL (same message, multiple Task calls):
- Art Director + Technical Director (Step 9)
- Multiple validation scripts (Steps 12-14 can be batched)
- Debugger + content fixes (if independent)

### Must run SEQUENTIALLY:
- Game Designer → Level Designer → Design Review → Builder
- Builder → Validation → Debug/Polish → Review → Build
- Each phase depends on artifacts from the previous

### How to launch parallel agents:
```
# In a SINGLE message, make multiple Task tool calls:
Task(subagent: "game-designer", prompt: "...read game-brief, write design docs...")
Task(subagent: "general", prompt: "...write art-direction.md...")
Task(subagent: "general", prompt: "...write technical-plan.md...")
```

---

## Agent Mapping (opencode → Factory Role)

| Factory Agent | opencode Method | When to Use |
|---|---|---|
| Producer | You (orchestrate) | Pipeline management |
| Game Designer | `Task(subagent: "game-designer")` | Design phase |
| Level Designer | `Task(subagent: "level-designer")` | Level geometry |
| Design Reviewer | `Bash: validate-design.js` + `validate-reachability.js` | Pre-build gate |
| Art Director | `Task(subagent: "general")` with art context | Art direction |
| Technical Director | `Task(subagent: "general")` with tech context | Tech planning |
| Builder | `Task(subagent: "builder")` | Implementation |
| Playtester | `Bash: test-game.js` + `validate-static.js` | Testing |
| Debugger | `Task(subagent: "debugger")` | Bug fixes |
| Polisher | `Task(subagent: "polisher")` | Juice & polish |
| Final Reviewer | `Task(subagent: "reviewer")` | Quality gate |
| Build Publisher | `Bash: build-game.js` | Production build |

---

## Skills (Loaded via Skill Tool)

Load relevant skills before delegating to agents:

| Skill | When to Load |
|---|---|
| `game-design` | Before Game Designer task |
| `level-design` | Before Level Designer task |
| `game-programming` | Before Builder task |
| `game-polish` | Before Polisher task |
| `game-testing` | Before Playtester/Reviewer tasks |
| `html5-build` | Before Build task |
| `playgama` | Before Playgama compliance |
| `procedural-art` | Before Art Director task |
| `visual-design` | Before Art Director task |

---

## Quality Rules

### Kinematic Safety Margins
- Horizontal jumps: ≤ 82% of ballistic reach (X_max = v_run × 2v_jump / g)
- Step heights: ≤ 70% of max jump height (H_max = v_jump² / 2g)
- Ceiling clearance above platforms: ≥ 70px

### Mandatory Engine Usage
- Import from `engine/index.js` — never duplicate systems
- Use RenderLayers for all z-ordered drawing
- Use EnemyController for all enemy behaviors
- Use DialogueSystem for any text display

### Enemy Architecture
- Ground enemies MUST simulate gravity (vy += gravity × dt)
- Ground enemies MUST use swept AABB platform collision
- Ground enemies NEVER fly or float
- Chargers MUST clamp to platform bounds

### Air Dash
- Strictly 1 mid-air dash per airborne period
- Resets ONLY on: landing, enemy stomp, springboard, updraft

### Dialogue
- 100% solid backplates (#0A1610)
- Dynamic word wrapping via DialogueSystem
- 250ms input debounce on close

### Quality Budget
- CRITICAL bugs: 0
- BLOCKING bugs: 0
- MAJOR bugs: 0
- MINOR bugs: ≤ 3
- COSMETIC issues: ≤ 5

---

## Validation Scripts

```bash
node scripts/validate-design.js <id>        # Pre-build design gate
node scripts/validate-reachability.js <id>   # Jump math validation
node scripts/validate-static.js <id>         # Code quality
node scripts/validate-level.js <id>          # Geometry validation
node scripts/test-game.js <id>               # Runtime test harness
node scripts/test-benchmarks.js              # Engine benchmarks
node scripts/triage-bugs.js <id>             # Bug classification
node scripts/validate-playgama.js <id>       # Platform compliance
node scripts/build-game.js <id>              # Production ZIP
node scripts/run-pipeline.js <id>            # Full pipeline
```

---

## Quick Commands

- `/game <concept>` — Create a new game through the full pipeline
- `/build <game-id>` — Build a game into production ZIP
- `/test <game-id>` — Run validation and test suite
