---
name: game-design
description: Guidelines, formulas, content budgets, and rubrics for designing complete, high-retention casual, arcade, and adventure HTML5 games.
---

# Game Design Skill & Standards

## 1. Definition of "Done"
A game is NOT a prototype; it must be a **complete small finished game** satisfying:
- Complete (full content budget fulfilled).
- Playable (smooth responsive controls).
- Functional (every displayed interactive element works).
- Tested (verified across edge cases).
- Polished (juice, particles, Web Audio synthesis).

## 2. Content Budgeting & `content-requirements.json`
Every design document must accompany a machine-readable `content-requirements.json` specifying:
- `rooms`: Total distinct interconnected map areas (e.g. 5–8 for mini-metroidvanias).
- `enemyTypes`: Distinct enemy/hazard AI archetypes (e.g. 2–4).
- `abilities`: Distinct progression movement upgrades (e.g. 2–3).
- `npcs`: Interactive story/guide NPCs (e.g. 2–4).
- `collectibles`: Items/stars/seeds scattered with reward loops (e.g. 6–12).
- `checkpoints`: Safe respawn anchors.
- `secrets`: Hidden paths/false walls.

## 3. Gameplay Beats Structure
Progression must follow a structured beat arc:
`INTRO` -> `TEACHING` -> `FIRST CHALLENGE` -> `NEW MECHANIC` -> `EXPLORATION` -> `NEW ABILITY` -> `ABILITY-GATED AREA` -> `HARDER ENCOUNTER` -> `SECRET / REWARD` -> `FINAL CHALLENGE` -> `COMPLETION / CLIMAX`.

## 4. Non-Overflowing Interaction Rule
Any interactable prompt (e.g. "E to Talk") MUST link to a functional `DialogueBox` with auto text-wrapping and clean page advancement. Visual placeholders are strictly forbidden.
