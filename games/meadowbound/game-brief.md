# Game Brief: Meadowbound

## High Concept
**Meadowbound** is a cozy, colorful, and responsive 2D platform adventure inspired by classic 16-bit platformers with a modern, fluid feel. The player controls **Pip**, a nimble woodland sprite equipped with a vibrant cloak, leaping through 5 hand-crafted world sections to gather ancient **Sun Berries** and awaken the slumbering **Great Sunburst Tree**.

## Core Pillars
1. **Movement Purity**: Razor-sharp platforming kinematics featuring variable jump heights, coyote time (100ms), jump buffering (120ms), ground pound / stomp attack, and a crisp single air-dash (*Meadow Dash*).
2. **Cozy yet Adventurous Tone**: Warm, bright cartoon aesthetic, lush layered backgrounds, expressive animations, and cheerful procedural Web Audio chiptune harmonies.
3. **Substantial Content Architecture**:
   - **5 Major Levels**:
     - *Level 1: Sunny Meadowlands* (Tutorial, gentle jumps, Acorn Walkers, first checkpoint)
     - *Level 2: Whispering Woods* (Vertical canopy climbing, moving branch platforms, Spore Hoppers)
     - *Level 3: Bioluminescent Caverns* (Mushroom launch pads, dark crystal hazards, Bat Flyers)
     - *Level 4: Gusty Highland Cliffs* (Thermal updrafts, floating cloud ledges, Bramble Chargers)
     - *Level 5: The Elder Canopy & Boss Arena* (Gauntlet combining all mechanics + The Bramblethorn Golem boss)
   - **4 Distinct Functional Enemies**:
     - *Acorn Walker*: Platform patrol, edge-detection, stompable.
     - *Spore Hopper*: Rhythmic vertical jumping hazard, creates timing challenges.
     - *Glow Bat Flyer*: Predictable sine-wave aerial path, stompable from above.
     - *Bramble Charger*: Line-of-sight charge, stuns upon wall collision.
   - **1 Climax Boss**: *The Bramblethorn Golem* (3 escalating phases: Shockwave Slams, Rolling Bramble Volleys, and Core Vulnerability Stomp).
   - **Collectibles**: 25 Sun Berries (5 per level), Golden Acorns, and 5 Hidden Lore Medallions in secret rooms.
   - **Real Checkpoints & Death Recovery**: Instant respawn at latest attuned waystone without page reloads or broken state.
   - **Playgama Ready**: Full Playgama Bridge integration, on-screen mute button, visibility handling, save/load persistence, responsive scaling (Landscape 720x450), and save reset support (`?reset=1`, `?nosave=1`).
