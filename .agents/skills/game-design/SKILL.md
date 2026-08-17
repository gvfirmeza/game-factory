---
name: game-design
description: Guidelines, formulas, mechanic contracts, and rubrics for designing complete, high-retention, design-first HTML5 games.
---

# Game Design Standards — Design-First Studio Framework

## 1. The Design-First Philosophy
The AI Game Factory prioritizes **intentional, coherent gameplay** over raw content volume. Every system, room, enemy, collectible, NPC, and mechanic must have a concrete gameplay reason to exist.

---

## 2. Game Design Intent Document (`game-design-intent.md`)

Every new game creation must start by answering these core design questions before any geometry or code is generated:

```markdown
# Game Design Intent: [Game Title]

## 1. Core Experience & Emotional Target
- What should the player feel and enjoy doing in this game?

## 2. Core Gameplay Loop
- [ACTION] -> [FEEDBACK] -> [CHALLENGE] -> [REWARD] -> [PROGRESSION]

## 3. Primary Player Verb
- What is the player's single most important, responsive, and satisfying action?

## 4. Mechanic Purpose Contract
- For each included mechanic:
  - **PURPOSE**: What gameplay problem does it solve?
  - **TEACHING**: How does the player learn it in a safe environment?
  - **APPLICATION**: How is it used in normal progression?
  - **ESCALATION**: How is it combined with hazards or enemies?
  - **MASTERY**: What optional high-skill challenge rewards mastery?

## 5. Player Learning Progression
- **First 30 Seconds**: Immediate understanding of controls and primary verb.
- **First 5 Minutes**: Mastery of basic platforming and initial hazard timing.
- **End Game**: Fluency combining abilities under intense, fair conditions.

## 6. Zero Filler Content Rule
- NPCs, dialogue, shops, collectibles, and bosses are strictly OPTIONAL.
- Only include systems that directly serve the core gameplay experience.
```

---

## 3. Kinematic Specification Contract

Player movement physics must be defined numerically *before* level geometry:

| Parameter | Unit / Value Range | Description |
|---|:---:|---|
| $v_{max}$ (Run Speed) | $180\text{--}240\text{ px/s}$ | Maximum horizontal running speed |
| $a_{ground}$ (Ground Accel) | $1000\text{--}1400\text{ px/s}^2$ | Acceleration rate reaching max speed in $\sim 0.15\text{s}$ |
| $d_{ground}$ (Friction) | $1200\text{--}1600\text{ px/s}^2$ | Snappy braking rate avoiding floaty sliding |
| $v_{jump}$ (Jump Impulse) | $-360\text{--}-420\text{ px/s}$ | Initial upward vertical impulse |
| $v_{cut}$ (Jump Cut Cap) | $-120\text{--}-160\text{ px/s}$ | Clamped vertical velocity when jump button is released early |
| $g$ (Gravity) | $900\text{--}1100\text{ px/s}^2$ | Downward gravitational acceleration |
| $v_{fall\_max}$ (Terminal Fall) | $450\text{--}520\text{ px/s}$ | Maximum falling speed cap |
| $t_{coyote}$ (Coyote Time) | $0.08\text{--}0.12\text{s}$ | Grace period to jump after walking off ledge |
| $t_{buffer}$ (Jump Buffer) | $0.10\text{--}0.14\text{s}$ | Grace window to queue a jump before landing |
| $1\text{x}$ Mid-Air Dash | $400\text{--}500\text{ px/s}$ ($0.15\text{--}0.20\text{s}$) | Strictly 1 mid-air dash per airborne phase |

---

## 4. Encounter & Combat Guidelines

1. **Stompable Enemies**:
   - Must have distinct top-head hitboxes with open vertical approach clearance ($\ge 60\text{px}$).
   - Downward stomp deals damage, triggers score popup, particle burst, and vertical rebound bounce.
2. **Charging Enemies**:
   - Must telegraph with anticipation animations ($0.3\text{--}0.5\text{s}$).
   - Must clamp to platform boundaries and enter a dazed stun state ($1.5\text{--}2.5\text{s}$) upon colliding with walls.
3. **Aerial Flyers**:
   - Must patrol within explicit, bounded flight corridors.
