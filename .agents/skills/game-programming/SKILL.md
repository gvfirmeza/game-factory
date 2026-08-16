---
name: game-programming
description: Architecture standards, fixed timestep game loops, collision detection, object pooling, and state management for robust HTML5 2D games.
---

# Game Programming Skill & Standards

## 1. Mandatory Central Engine Architecture (`engine/`)
Always import from `engine/index.js` rather than inventing one-off code:
- **`GameLoop`**: Fixed timestep 60Hz loop (`STEP = 1/60s`) with subframe rendering interpolation.
- **`CollisionUtils`**: Swept AABB with dynamic lookahead ($\max(v_y \cdot dt, 4)$), 2-4px ceiling corner rounding, and platform bounds containment.
- **`EnemyController`**: Standardized enemy state machines (`EnemyArchetypes`), platform gravity (`vy += gravity * dt`), platform bounds clamping, and daze stun recovery.
- **`DialogueSystem`**: Single authoritative manager, solid `#0A1610` backplates, dynamic word wrapping, typewriter voice chirps, and 250ms input debouncing.
- **`InputManager`**: Declarative action mapping and single source of truth for UI hints (`getControlHints()`).
- **`PlaygamaBridge`**: Platform lifecycle, cloud save sync, and deferred `game_ready` event.

## 2. Standard Kinematics Formulas
- **Variable Jump Cut**: Soltar o botão de pulo corta a velocidade vertical:
  `if (!input.isDown('up') && this.vy < KINEMATICS.JUMP_CUT_VEL) this.vy = KINEMATICS.JUMP_CUT_VEL;`
- **Coyote Time ($100\text{ms}$)** & **Jump Buffering ($120\text{ms}$)**.
- **Air-Dash Constraint**: Strictly 1 mid-air dash per airborne period (`hasAirDash = false`), reset on solid ground touch or enemy stomp bounce.

## 3. Ground Enemy Containment & Gravity Rules
- All ground enemies MUST simulate platform gravity and swept AABB platform collision.
- Ground enemies must NEVER fly or launch into space.
- Charges/rushes MUST clamp to platform bounds `[minX, maxX]` and enter daze stun state upon hitting boundaries or walls.
