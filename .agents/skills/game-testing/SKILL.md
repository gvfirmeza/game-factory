---
name: game-testing
description: Aggressive QA testing, edge case stress testing, input simulation, coverage reports, and regression protocols for HTML5 games.
---

# Game Testing & Quality Assurance Standards

## 1. Empirical Runtime Testing Requirement (No Hypothetical Passes)
The Playtester must execute the automated deterministic test harness:
`node scripts/test-game.js <game-id>`
Every playtest report MUST cite empirical runtime telemetry:
- Canvas draw call counts (verifies canvas is actively rendering and not pitch black).
- Horizontal player displacement pixels.
- Jump impulse vertical velocity ($v_y$) and early release cut velocity.
- 1x Mid-air dash state and consumption.
- Ground enemy platform containment and gravity resolution.
- Stomp combat hit resolution and upward bounce.
- DialogueBox word wrapping bounds and single-authoritative state.
- Checkpoint recovery at 3 HP without state leaks or page reloads.

## 2. Structured Bug Triage & Quality Budget (`BUG-XXX`)
All defects must be formatted via `scripts/triage-bugs.js` with Severity:
- **`CRITICAL`**: Game crash, black screen, infinite freeze, fatal exception.
- **`BLOCKING`**: Soft-lock, inability to complete level, broken controls.
- **`MAJOR`**: Flying/launching ground enemies, dialogue text bleed/overlap, broken attacks.
- **`MINOR`**: Subtle timing glitch, non-blocking visual artifact.
- **`COSMETIC`**: Typo, slight color inconsistency.

### Studio Quality Budget Gate:
**`CRITICAL = 0`**, **`BLOCKING = 0`**, **`MAJOR = 0`**.
Any presence of a Critical, Blocking, or Major defect **STRICTLY BLOCKS** release approval.

## 3. Mandatory Regression Loop
```
Playtest Fail (BUG-XXX generated)
  ↓
Debugger (Surgical root-cause fix)
  ↓
Playtester (Re-runs test-game.js + regression suite)
  ↓
Quality Budget Verification (triage-bugs.js)
```
No game can jump from Debugger directly to Final Reviewer without passing an independent re-test.
