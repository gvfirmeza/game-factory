---
name: game-design
description: Guidelines, formulas, content budgets, and rubrics for designing complete, high-retention casual, arcade, and adventure HTML5 games.
---

# Game Design Skill & Standards

## 1. Upgraded Definition of "DONE"
A game is NOT a technical demo. A game is ONLY DONE when:
- Mechanically complete (all controls, kinematics, and abilities implemented).
- Empirically runtime tested (verified across real simulated inputs).
- Zero-tolerance Quality Budget satisfied (`CRITICAL = 0`, `BLOCKING = 0`, `MAJOR = 0`).
- Playgama verified (`PLAYGAMA_READY` status with publication manifest).

## 2. Machine-Readable Gameplay Contract (`game-contract.json`)
Every design phase must generate `game-contract.json` alongside `game-design.md` and `content-requirements.json`:
- `controls`: Declarative key/action mapping (`move`, `jump`, `dash`, `interact`, `pause`).
- `kinematics`: Numerical bounds (`maxRunSpeed`, `jumpImpulse`, `variableJumpCut`, `coyoteTime`, `jumpBuffer`, `maxAirDashes`).
- `enemies`: Array of enemy archetypes (`patrol_walker`, `rhythmic_hopper`, `sine_flyer`, `proximity_charger`, `multi_phase_boss`) with HP, stompability, damage values, and bounding rules.
- `npcs`: Array of NPCs with multi-line dialogues.
- `rules`: Max health, checkpoint respawn rules, win/loss criteria.

## 3. Content Budgeting & Progression Beats
Progression must follow a structured beat arc:
`INTRO` -> `TEACHING` -> `FIRST CHALLENGE` -> `NEW MECHANIC` -> `EXPLORATION` -> `ABILITY GATING` -> `BOSS / CLIMAX` -> `VICTORY`.

## 4. Interaction & Dialogue Standards
Every interactable prompt (e.g. `[E] Talk`) MUST link to a functional `DialogueSystem` with automatic word wrapping, solid `#0A1610` backplates, typewriter audio chirps, and 250ms input debouncing. Visual fake placeholders are strictly forbidden.
