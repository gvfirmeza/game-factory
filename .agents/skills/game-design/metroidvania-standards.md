# Metroidvania & 2D Platformer Design Standards

## 1. Movement & Air-Dash Physics Constraints
- **1-Air-Dash-Per-Airborne Period**: In any platformer featuring mid-air dashing (*Leaf Dash*, *Air Dash*, etc.), the player MUST only be allowed to dash **once** per jump/fall. Dashing while airborne consumes `hasAirDash = false`. Dashing again is strictly forbidden until the player lands on a solid platform (`isGrounded === true`), which resets `hasAirDash = true`.
- **Snappy Directional Attacks**: Primary combat attacks MUST be immediate, snappy, and directional (facing direction Left/Right or Upward when holding Up). Avoid clunky 360° mouse aim or camera rotation that interferes with natural platforming flow.

## 2. Level Design & Platform Spacing
- **No Head-Banging Clearance**: All jump surfaces and walkways MUST maintain a minimum vertical clearance of at least **70px** above the player's collision box.
- **Launchpad & Spore Mushroom Placement**: Spore mushrooms and jump pads MUST ALWAYS be placed in open vertical chutes leading directly to upper landing platforms. Placing a springboard underneath a low ceiling platform (less than 120px) creates an infinite head-banging bounce loop and is strictly prohibited.
- **No Trap Pits or Dead-Ends**: Every drop, pit, and secret area MUST have a two-way traversal solution (e.g. stepping stones with step heights $\le 80\text{px}$, wall-jump corridors, or a return springboard at the bottom). A player must never be permanently trapped in a pit.
- **Human Jump Metric Tolerances**:
  - Horizontal jump reach: $80\text{px} - 160\text{px}$ (single jump), up to $220\text{px}$ with dash.
  - Vertical step height: $\le 80\text{px}$ (single jump max height is typically $120\text{px}$).
  - Fall hazard recovery: hazard spikes must bounce the player up and backwards onto safe ground.

## 3. Minimalist & Diegetic Environmental Signposting
- **Subtle Trail Markers over Screen Clutter**: Never spam full-screen neon floating banners with room names on every portal.
- **Hub-Only Directional Signs**: In the central starting hub, use cozy, charming, minimalist wooden trail posts with subtle carved arrows (`◀ Caverns`, `Grotto ▶`, `▲ Canopy`, `▼ Roots`).
- **Organic World Cues**: Guide the player naturally using biome visual transitions (lighting shifts, ambient mote colors, foliage changes, ruin archways) rather than artificial UI arrows.

## 4. Ability Unlock Modal Design
- **Dedicated Pause State (`ABILITY_UNLOCKED`)**: When unlocking a major progression ability at a shrine, the game MUST pause gameplay and display a clean, centered modal card.
- **Components of an Ability Modal**:
  - Themed glowing crest emblem icon.
  - Clear Title (e.g. `FEATHER JUMP UNLOCKED!`).
  - Concise gameplay control instructions (e.g. *"Press Space mid-air to Double Jump."*).
  - Explicit Close Button `[✖ Continue]` (dismissible by clicking `✖` or pressing `E` / `Space` / `Enter` / `Esc`).
- Resuming gameplay from the modal must enforce a 0.25s input cooldown to prevent accidental immediate jumping or interacting.
