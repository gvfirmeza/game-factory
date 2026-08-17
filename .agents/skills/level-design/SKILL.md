---
name: level-design
description: Standards, formulas, reachability matrices, room purpose contracts, and graph validation rules for 2D platforming level design.
---

# Level Design Standards & Reachability Framework

## 1. Core Principles of Intentional Level Design

1. **Every Room Must Have a Purpose**:
   - `TEACH_MECHANIC`: Introduce a player verb or hazard in an isolated, failure-safe environment.
   - `APPLY_MECHANIC`: Test the verb under normal platforming traversal.
   - `COMBINE_MECHANICS`: Challenge the player by layering two known mechanics (e.g. Dash + Moving Platform).
   - `ENCOUNTER_CHALLENGE`: Host a dedicated enemy encounter with validated approach, counterplay, and retreat space.
   - `EXPLORATION_REWARD`: Branching secret containing optional lore, medallion, or high-tier collectible.
   - `RECOVERY_CHECKPOINT`: Safe respawn waystone restoring health before a high-intensity section.
   - `CLIMAX_BOSS`: Structured multi-phase boss coliseum with safe perimeter perches and vulnerability windows.

2. **Metrics-Driven Level Design Contract**:
   Before laying down single platform coordinates, level geometry must strictly adhere to the kinematic capabilities established by the Technical Director:
   - **Maximum Ballistic Jump Height**: $H_{max} = \frac{v_{jump}^2}{2g}$
   - **Maximum Horizontal Reach**: $X_{max} = v_x \cdot \frac{2 v_{jump}}{g}$
   - **Safety Margin Rule**: Required progression jumps must never exceed **$82\%$** of physical limits (e.g. if max jump is $280\text{px}$, required jump $\le 220\text{px}$; if max height is $135\text{px}$, required step $\le 95\text{px}$).
   - **Ceiling Clearance**: Minimum vertical clearance above platforms $\ge 70\text{px}$ to prevent player head-bumping.

---

## 2. Structured Machine-Readable Level Schema (`level-graph.json`)

Every level must be represented as a machine-readable graph:

```json
{
  "levelId": "area_1",
  "name": "Emerald Coastline",
  "width": 2160,
  "height": 450,
  "rooms": [
    {
      "roomId": "room_1_1",
      "purpose": "TEACH_MECHANIC",
      "action": "jump_over_low_gap",
      "bounds": { "x": 0, "y": 0, "w": 720, "h": 450 },
      "entry": { "x": 60, "y": 350 },
      "exit": { "x": 680, "y": 350 },
      "platforms": [
        { "x": 0, "y": 390, "w": 320, "h": 60 },
        { "x": 420, "y": 390, "w": 300, "h": 60 }
      ],
      "hazards": [],
      "enemies": [],
      "collectibles": [
        { "id": "shell_1", "type": "nautilus_shell", "x": 370, "y": 320 }
      ]
    }
  ]
}
```

---

## 3. Enemy Encounter Design Rules

1. **No Ambient Decorations**: Enemies must never be placed randomly. Every encounter requires:
   - **Player Entry Point**: Safe line of sight ($\ge 120\text{px}$) allowing player to assess the threat.
   - **Platform Floor Support**: Solid platform with width $\ge 80\text{px}$ providing room to jump, evade, or counter.
   - **Valid Counterplay**: Stompable enemies must have open vertical space above their heads ($\ge 60\text{px}$). Charging enemies must have solid wall bounds to crash into and daze.
2. **Hazard Separation**: Spikes or bottomless pits must never be placed directly under an active ground enemy where player knockback results in unfair unavoidable death loops.

---

## 4. Collectible & Secret Placement Rules

1. **Zero Collision Embeddings**: Collectibles must NEVER intersect solid platform boxes, ceiling blocks, or hazard spikes.
2. **Intentional Placement**:
   - *Trail Collectibles* (Coins/Berries/Shells): Placed along natural jump parabolic arcs to guide the player's eye.
   - *Mastery Collectibles* (Lore Medallions/Gems): Placed at the end of optional challenge branches requiring precise timing or ability mastery.
