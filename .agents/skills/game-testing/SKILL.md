---
name: game-testing
description: Aggressive QA testing, edge case stress testing, input simulation, coverage reports, and regression protocols for HTML5 games.
---

# Game Testing & QA Skill

## 1. Playtester Mandate: "Try to Break the Game"
The Playtester must actively test edge cases:
- **Movement**: Rapid direction switches, boundary collision, coyote time, jump buffering, wall sliding.
- **Combat & Hazards**: Enemy collision, invulnerability blink, knockback, damage recovery, respawn.
- **Interactions**: Rapid 'E'/tap presses, multi-page dialogue word wrap, prompt appearance/disappearance, NPC state changes.
- **Progression**: Ability gates blocking when unobtained, unlocking when collected, backtracking across rooms.
- **UI & Layout**: No text clipping or container overflow on long dialogues, responsive mobile touch layout.

## 2. Coverage Matrix Report Format
Every playtest report (`reports/playtest-*.md`) must include a category-by-category verification matrix:
```markdown
### 1. Verification Matrix
| Subsystem | Test Case | Status | Notes |
|---|---|---|---|
| Movement | Walk / Run Acceleration | [PASS] | Responsive damping |
| Movement | Double Jump / Glide | [PASS] | Particles emit on jump 2 |
| Interaction | NPC Proximity & Prompt | [PASS] | "Talk (E)" appears within 48px |
| Interaction | Dialogue Text Wrapping | [PASS] | Auto-wraps, no text overflow |
| Progression | Ability Gates | [PASS] | Locked until ability obtained |
| Combat | Enemy Collision & Hurt | [PASS] | Knockback & invuln frames active |
```

## 3. Regression Testing Protocol
Whenever a bug is fixed by the Debugger, the Playtester must re-test the failing subsystem AND run a full integration smoke test before issuing a PASS.
