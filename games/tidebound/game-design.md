# Game Design Document: Tidebound
**Version**: 1.0.0  
**Genre**: 2D Platform Adventure / Cozy Island Exploration  
**Target Viewport**: 720 × 450 (16:9 Aspect Ratio, Responsive Letterbox / Pillarbox)  
**Platform Target**: Playgama HTML5 (Desktop & Mobile Touch)  
**Author**: Game Designer Subagent — AI Game Factory  

---

## 1. High Concept & Creative Pillars

### 1.1 High Concept
**Tidebound** is a vibrant, cozy, and responsive 2D platform adventure set across a sun-drenched coastal archipelago. Players guide **Cori the Reef Sprite**, an agile aquatic sprite adorned with a seafoam cape and nautilus beret, across 5 hand-crafted island biomes. Cori must recover 25 **Sun Pearls**, collect 50 **Golden Nautilus Shells**, discover 5 ancient **Lore Medallions**, awaken 3 ancient lighthouses, unlock the sacred **Tide Dash** ability, and calm the mighty **Ancient Tide Golem** to reignite the **Great Horizon Beacon**.

### 1.2 Core Pillars
1. **Kinematic Purity & Juiciness**: Pixel-precise, responsive platforming with variable jump heights, 100ms coyote time, 120ms jump buffering, 1x mid-air *Tide Dash*, and satisfying enemy stomp bouncing with juicy squish audio and particles.
2. **Cozy Coastal World & Atmosphere**: Breezy tropical aesthetics featuring multi-layered parallax seascapes, drifting seafoam motes, dynamic camera lerp, and uplifting procedural Web Audio maritime melodies.
3. **Flawless Level Flow & Forgiving Recovery**: Hand-crafted progression with no blind dead-ends, two-way pit traversal, generous platform clearances ($\ge 70\text{px}$), and instant Waystone checkpoint respawns without page reloads.
4. **Complete Content Architecture**: 5 distinct island biomes, 4 functional enemy archetypes, 1 multi-phase climax boss, 3 interactive story NPCs with multi-page dialogues, 4 Lighthouses, 25 Sun Pearls, 50 Golden Nautilus Shells, and 5 Secret Medallions.
5. **Playgama & Web Standards Ready**: Integrated save/load persistence (`localStorage` & Playgama Cloud), touch controls for mobile, on-screen mute & pause toggles, and URL debugging flags (`?reset=1`, `?nosave=1`, `?level=N`, `?god=1`).

---

## 2. Player Kinematics & Mechanics

```
                         [ Cori the Reef Sprite ]
                                /          \
                     [Ground Move]     [Airborne]
                      - Run: 200px/s    - Variable Jump: -390px/s
                      - Accel: 1200px/s²- Gravity: 980px/s²
                      - Decel: 1400px/s²- Fall Clamp: 480px/s
                                           |
                                 +---------+---------+
                                 |                   |
                         [Tide Dash]           [Stomp / Bounce]
                         - 450px/s (0.18s)     - Land on enemy top
                         - 1x per airborne     - +Bounce: -320px/s
                         - Unlocked in Area 3  - Resets Tide Dash
                         - Resets on ground
```

### 2.1 Character Attributes: Cori
- **Sprite Dimensions**: $24 \times 32\text{px}$ sprite bounding box.
- **Hitbox / Collision Box**: Width = $18\text{px}$, Height = $26\text{px}$ (centered with foot contact alignment).
- **Health**: 3 Hearts (Maximum 3 HP).
- **Invulnerability (i-Frames)**: 1.5 seconds post-damage with 10Hz sprite opacity oscillation ($0.3 \leftrightarrow 1.0$).
- **Damage Knockback**: $160\text{px/s}$ horizontal impulse away from hazard, $-180\text{px/s}$ vertical hop, disabling player input for $0.20\text{s}$.

### 2.2 Movement Kinematics & Tuning Formulas

| Parameter | Value | Mathematical / Gameplay Role |
| :--- | :--- | :--- |
| **Max Horizontal Speed ($v_{max}$)** | $200\text{ px/s}$ | Agile, responsive running speed across sand and stone. |
| **Ground Acceleration ($a_{ground}$)** | $1200\text{ px/s}^2$ | Reaches top speed in $\approx 0.166\text{s}$ for snappy start response. |
| **Ground Friction / Deceleration ($d_{ground}$)** | $1400\text{ px/s}^2$ | Halts horizontal movement in $\approx 0.142\text{s}$ with zero slippery drift. |
| **Air Acceleration ($a_{air}$)** | $900\text{ px/s}^2$ | Generous aerial steering allowing precision mid-air course corrections. |
| **Air Drag / Deceleration ($d_{air}$)** | $600\text{ px/s}^2$ | Natural momentum conservation when releasing directional keys. |
| **Jump Impulse ($v_{jump}$)** | $-390\text{ px/s}$ | Produces a ballistic jump apex of $\approx 77.6\text{px}$ (up to $135\text{px}$ with jump hold). |
| **Variable Jump Cut ($v_{jump\_cut}$)** | $-140\text{ px/s}$ | Releasing Jump early immediately caps upward velocity for micro-hops. |
| **Gravity ($g$)** | $980\text{ px/s}^2$ | Snappy downward acceleration ensuring satisfying arc weight. |
| **Fall Clamp (Terminal Velocity)** | $480\text{ px/s}$ | Prevents tunneling through collision geometry during long falls. |
| **Coyote Time Window** | $0.10\text{ s (100ms)}$ | Allows jump inputs up to 100ms after stepping off a platform ledge. |
| **Jump Buffer Window** | $0.12\text{ s (120ms)}$ | Queues jump input pressed 120ms before landing, executing instantly upon touch. |
| **Stomp Rebound Velocity ($v_{bounce}$)** | $-320\text{ px/s}$ | Upward impulse upon stomping enemies, restoring Tide Dash mid-air. |

### 2.3 Kinematic Reach & Geometric Safety Budget

All level geometry is strictly validated against Cori's kinematic boundaries prior to layout placement:

1. **Jump Apex Formula**:
   $$t_{apex} = \frac{|v_{jump}|}{g} = \frac{390}{980} \approx 0.398\text{ s}$$
   $$h_{ballistic} = \frac{v_{jump}^2}{2g} = \frac{390^2}{1960} \approx 77.6\text{ px}$$
   *(With upward jump-hold impulse extension, maximum achievable jump height is $135\text{px}$).*

2. **Horizontal Reach (Standard Jump)**:
   $$T_{hang} = 2 \times t_{apex} \approx 0.796\text{ s}$$
   $$D_{standard} = v_{max} \times T_{hang} = 200 \times 0.796 \approx 159.2\text{ px}$$

3. **Horizontal Reach (With Tide Dash)**:
   $$D_{dash} = v_{dash} \times t_{dash} = 450 \times 0.18 = 81.0\text{ px}$$
   $$D_{max} = D_{standard} + D_{dash} + \text{carry} \approx 280\text{ px}$$

4. **Safety Margins for Required Progression**:
   - **Required Platform Gap**: $\le 220\text{ px}$ (ensures comfortable clearance without frame-perfect inputs).
   - **Required Step Height**: $\le 95\text{ px}$ (always reachable without ability gating).
   - **Minimum Walkway Clearance**: $\ge 70\text{ px}$ (prevents head clipping during running).
   - **Vertical Spring/Updraft Clearance**: $\ge 160\text{ px}$ of open unobstructed vertical chute.

### 2.4 Tide Dash (Single Air-Dash Rule)
- **Unlock**: Obtained at the **Shrine of the Tide Dash** in Area 3 (Flooded Caves).
- **Activation**: Press `Dash` (`Shift` / `J` / `X` / Mobile `B`).
- **Velocity & Duration**: $450\text{ px/s}$ horizontally for $0.18\text{ s}$ ($\approx 81\text{px}$ distance).
- **Gravity Nullification**: Vertical velocity is locked to $0\text{ px/s}$ during the 0.18s dash window.
- **Airborne Limit (Strict Rule)**: Exactly **1 Air-Dash per airborne period**.
  - Initiating an air dash sets `hasAirDash = false`.
  - While airborne, further dash presses emit a soft water splash fizzle without dashing.
  - Reset Conditions: Landing on any solid surface (`isGrounded === true`), bouncing off an enemy top ($v_{bounce}$), stepping into a coastal updraft, or hitting a geyser.
- **Visual Juice**: Spawns a shimmering cyan water-trail and bubbling seafoam particles.

### 2.5 Stomp Attack / Enemy Bounce
- **Trigger**: Cori's lower bounding box collides with the upper 25% boundary of an active enemy while moving downward ($v_y > 0$).
- **Effect on Enemy**: Deals 1 stomp damage (defeats minions instantly; damages dazed armored crabs and bosses).
- **Effect on Cori**:
  - Sets vertical velocity to $v_{bounce} = -320\text{ px/s}$ (springing Cori into the air).
  - Instantly resets `hasAirDash = true`.
  - Emits radial bubble burst particles + high-pitched squish/pop chime.
  - Triggers a 40ms camera micro-shake (magnitude 2px).

---

## 3. Controls & Interaction Architecture

### 3.1 Input Mapping Table

| Action | Keyboard Primary | Keyboard Secondary | Gamepad (Standard) | Mobile Touch UI |
| :--- | :--- | :--- | :--- | :--- |
| **Move Left** | `KeyA` | `ArrowLeft` | D-Pad Left / Stick Left | Virtual D-Pad Left |
| **Move Right** | `KeyD` | `ArrowRight` | D-Pad Right / Stick Right | Virtual D-Pad Right |
| **Look Up / Interact**| `KeyW` | `ArrowUp` | D-Pad Up / Stick Up | Virtual D-Pad Up |
| **Crouch / Drop Thru** | `KeyS` | `ArrowDown` | D-Pad Down / Stick Down | Virtual D-Pad Down |
| **Jump** | `Space` | `KeyW` / `KeyZ` | Button A (South) | Button [Jump] (Cyan) |
| **Tide Dash** | `KeyJ` | `ShiftLeft` / `KeyX` | Button X (West) / RT | Button [Dash] (Amber) |
| **Interact / Talk** | `KeyE` | `Enter` | Button Y (North) / Button B | Action Button [Talk] |
| **Pause / Menu** | `Escape` | `KeyP` | Start / Options | Top-Left Pause Icon |
| **Mute Toggle** | `KeyM` | — | — | Top-Right Audio Icon |

### 3.2 Non-Overflowing Dialogue System
When Cori approaches within $45\text{px}$ of an NPC, Waystone, or Lighthouse Beacon, a diegetic floating prompt `[E] Talk` / `[E] Inspect` appears with a gentle sine bobbing animation.
- **Dialogue Box Geometry**: Centered bottom HUD overlay ($560 \times 110\text{px}$).
- **Backplate Integrity**: 100% solid opaque dark oceanic backplate (`#0A1610`) with a glowing seafoam cyan border (`#00F5D4`, 2px).
- **Typography & Wrapping**: Automatic word wrapping capped at 48 characters per line, maximum 3 lines per page.
- **Page Advancement**: Pressing `E`, `Space`, or clicking advances to the next page.
- **Input Debounce**: Enforces a mandatory $250\text{ms}$ input debounce on dismissal to prevent accidental jump execution or immediate dialogue re-triggering.

---

## 4. World Architecture & 5 Handcrafted Level Designs

```
[ Area 1: Palm Beach ] ---> Waystone 1 + Lighthouse 1 + Coralia NPC
          |
          v
[ Area 2: Overgrown Ruins ] ---> Waystone 2 + Lighthouse 2 + Barnaby NPC
          |
          v
[ Area 3: Flooded Caves ] ------> Waystone 3 + Shrine of Tide Dash (Unlock!)
          |
          v
[ Area 4: Wind Cliffs ] --------> Waystone 4 + Lighthouse 3 + Coastal Updrafts
          |
          v
[ Area 5: Lighthouse Island ] --> Waystone 5 + Boss Arena + Final Beacon + Altar
```

---

### 4.1 Area 1: Palm Beach
- **Theme**: Sun-kissed golden sandbanks, turquoise tidal pools, swaying palm fronds, gentle sea breeze.
- **Palette**: Warm Sand (`#F4E2B6`), Shallow Lagoon (`#2EC4B6`), Palm Green (`#2A9D8F`), Sky Azure (`#48CAE4`).
- **Dimensions**: $2160\text{px} \times 450\text{px}$ (Horizontal tutorial trek).
- **Core Progression Beats**:
  1. **Tidal Shore Awakening**: Cori awakens on the beach. Signpost teaches basic movement: *"Use A/D to run, Space to Jump."*
  2. **First Scuttler Encounter**: Encounter with a slow **Hermit Scuttler**. Player learns the enemy stomp bounce.
  3. **Coralia the Pearl Diver**: Meet **Coralia**, who explains that the storm has darkened the ancient lighthouses and tasks Cori with gathering Sun Pearls.
  4. **Waystone 1**: Mid-point checkpoint attunement at $x=1240, y=380$.
  5. **First Ancient Lighthouse**: At $x=1980, y=280$, Cori activates the First Lighthouse, illuminating the sandy coast.
  6. **Collectibles**:
     - **Sun Pearl 1.1**: Floating over the initial sand dune.
     - **Sun Pearl 1.2**: Guarded by a Hermit Scuttler on a palm platform.
     - **Sun Pearl 1.3**: Suspended over a shallow water chasm ($110\text{px}$ jump).
     - **Sun Pearl 1.4**: Atop a high palm canopy reached via enemy bounce.
     - **Sun Pearl 1.5**: Before the exit archway.
     - **Nautilus Shells (10x)**: Spread across sand paths.
     - **Secret 1 (Seaweed Grotto)**: Walk through a false seaweed curtain at $x=850$ into a hidden cove containing **Medallion of the Tides** + 10 Nautilus Shells.

---

### 4.2 Area 2: Overgrown Ruins
- **Theme**: Sunken ancient stonework, moss-covered archways, tidal aqueducts, collapsing staircases.
- **Palette**: Weathered Stone (`#577590`), Marine Moss (`#43AA8B`), Sunken Gold (`#F9C74F`), Dark Depths (`#1D3557`).
- **Dimensions**: $1440\text{px} \times 900\text{px}$ (Vertical two-tier ruin ascent).
- **Core Progression Beats**:
  1. **Vertical Ascent**: Climbing ancient stone steps with oscillating mossy platforms ($60\text{px}$ horizontal motion).
  2. **Spiny Urchin Hazard**: Introduces **Spiny Urchins** hopping rhythmically across stone arches. Timing stomps at their apex.
  3. **Barnaby the Navigator**: Meet **Barnaby** perched on an ancient navigational astrolabe at $x=720, y=480$. He shares lore about the Flooded Caves and Tide Dash.
  4. **Waystone 2**: Anchored beside Barnaby's astrolabe ($x=720, y=480$).
  5. **Second Ancient Lighthouse**: Located at the highest ruin parapet ($x=1280, y=320$). Activating it lights up the sunken towers.
  6. **Collectibles**:
     - **Sun Pearl 2.1**: Above the first moving stone platform.
     - **Sun Pearl 2.2**: High jump between two hopping Spiny Urchins.
     - **Sun Pearl 2.3**: Over a deep spike-filled aqueduct.
     - **Sun Pearl 2.4**: Tucked on an outer ruin ledge.
     - **Sun Pearl 2.5**: At the upper grotto entrance.
     - **Nautilus Shells (10x)**: Along vertical climbing paths.
     - **Secret 2 (Submerged Chamber)**: Drop through a cracked stone floor beneath the astrolabe into a dry vault containing **Medallion of the Deep Ruins** + 10 Nautilus Shells.

---

### 4.3 Area 3: Flooded Caves
- **Theme**: Subterranean crystal grottos, glowing cyan coral reefs, pulsing geysers, dark indigo water pools.
- **Palette**: Bioluminescent Cyan (`#00F5D4`), Deep Grotto Navy (`#0B092B`), Coral Violet (`#9B5DE5`), Pearl White (`#F8F9FA`).
- **Dimensions**: $2160\text{px} \times 675\text{px}$.
- **Core Progression Beats**:
  1. **Disappearing Coral Ledges**: Glowing coral platforms that dissolve 1.0s after landing and reform after 2.0s.
  2. **Bubble Ray Flyers**: Schools of **Bubble Ray Flyers** cruising in sine waves over deep abysses. Cori uses them as aerial bounce stepping stones.
  3. **Shrine of the Tide Dash**: At $x=1400, y=400$, Cori touches the ancient shrine, unlocking the **Tide Dash** ability!
  4. **Dash Gauntlet**: Wide $180\text{px}$ caverns requiring horizontal Tide Dash over hazardous sea anemones.
  5. **Waystone 3**: Glowing deep grotto crystal altar at $x=1080, y=520$.
  6. **Collectibles**:
     - **Sun Pearl 3.1**: Floating over the first dissolving coral ledge.
     - **Sun Pearl 3.2**: High in the ceiling, reached via Bubble Ray bounce.
     - **Sun Pearl 3.3**: Positioned in the middle of a wide Tide Dash chasm.
     - **Sun Pearl 3.4**: Guarded by dual Spiny Urchins on a crystal shelf.
     - **Sun Pearl 3.5**: Near the cavern exit tunnel.
     - **Nautilus Shells (10x)**: Along cavern waterways.
     - **Secret 3 (Grotto Alcove)**: Dash through a waterfall into a secluded grotto containing **Medallion of the Flooded Grotto** + 10 Nautilus Shells.

---

### 4.4 Area 4: Wind Cliffs
- **Theme**: Sheer coastal cliffs, howling sea gales, floating cloud ledges, dramatic open ocean vistas.
- **Palette**: Tempest Azure (`#0077B6`), Foam White (`#CAF0F8`), Cliff Slate (`#3D5A80`), Sunset Gold (`#E76F51`).
- **Dimensions**: $2880\text{px} \times 450\text{px}$ (Long horizontal trek with floating cloud bridges).
- **Core Progression Beats**:
  1. **Coastal Updrafts**: Vertical columns of sea wind that carry Cori upward ($v_y = -220\text{px/s}$) and restore Tide Dash continuously.
  2. **Coral Crusher Crab Hazards**: Heavy armored crabs patrol narrow cliff ledges. Cori must bait them to charge into cliff faces, stunning them for 2.2s before stomping.
  3. **High Altitude Platforming**: Combining updraft momentum, disappearing cloud ledges, and aerial Tide Dashes across $200\text{px}$ ocean ravines.
  4. **Waystone 4**: Mountain pass shrine beneath a stone sea arch at $x=1500, y=360$.
  5. **Third Ancient Lighthouse**: Perched at the cliff summit at $x=2680, y=260$. Activating it cuts through the coastal fog.
  6. **Collectibles**:
     - **Sun Pearl 4.1**: Caught inside the first high updraft stream.
     - **Sun Pearl 4.2**: Across a chain of 3 dissolving cloud ledges.
     - **Sun Pearl 4.3**: Behind a Coral Crusher Crab's patrol route.
     - **Sun Pearl 4.4**: Floating high over the ocean abyss (Updraft + Tide Dash).
     - **Sun Pearl 4.5**: At the bridge leading to Lighthouse Island.
     - **Nautilus Shells (10x)**: Scattered across cloud bridges.
     - **Secret 4 (Zephyr Alcove)**: Leap off a cliff edge with a leftward Tide Dash into a hidden shelf holding **Medallion of the Sea Gale** + 10 Nautilus Shells.

---

### 4.5 Area 5: Lighthouse Island & Boss Arena
- **Theme**: The sacred central island, marble coliseum, towering Beacon of the Horizon, storm clouds parting into golden dawn.
- **Palette**: Radiant Amber (`#FFB703`), Imperial Violet (`#240046`), Seafoam Green (`#52B788`), Celestial White (`#FDFFFC`).
- **Dimensions**: $2160\text{px} \times 450\text{px}$ (Master Gauntlet + Boss Coliseum + Ending Altar).
- **Core Progression Beats**:
  1. **Master Gauntlet**: High-precision obstacle course combining moving ruin blocks, Spiny Urchins, Bubble Ray chains, and updrafts.
  2. **Ancient Beacon Keeper Sanctuary**: Pre-boss chamber with the **Ancient Beacon Keeper** offering tactical combat wisdom at $x=980, y=380$.
  3. **Waystone 5**: Boss Arena Checkpoint ($x=980, y=380$) ensuring instant respawn outside the coliseum gate.
  4. **Climax Boss Battle**: **The Ancient Tide Golem** (Detailed in Section 6).
  5. **Final Horizon Beacon**: At $x=1920, y=240$, Cori ignites the Great Horizon Beacon, uniting all 4 beacons.
  6. **Ending Altar & Victory**: Step onto the Grand Ending Altar to view completion statistics and celebrate the restoration of the archipelago!
  7. **Collectibles**:
     - **Sun Pearl 5.1**: High above the gauntlet moving blocks.
     - **Sun Pearl 5.2**: Precision bounce over dual Spiny Urchins.
     - **Sun Pearl 5.3**: Above a collapsing cloud ledge in the upper sanctuary.
     - **Sun Pearl 5.4**: Over the coliseum entry arch.
     - **Sun Pearl 5.5**: Rewarded upon the Golem's pacification.
     - **Nautilus Shells (10x)**: Scattered through the grand hall.
     - **Secret 5 (Beacon Treasury)**: Hidden coral path behind the Beacon Keeper's throne containing **Medallion of the Horizon Beacon** + 10 Nautilus Shells.

---

## 5. Enemy Bestiary & Centralized AI Behaviors

```
+-------------------+-------------------+-------------------+--------------------+
|  Hermit Scuttler  |   Spiny Urchin    |  Bubble Ray Flyer | Coral Crusher Crab |
|  (Ground Patrol)  |  (Timed Bounce)   |  (Sine Wave Air)  |  (Charge & Stun)   |
|   1 HP | 60px/s   |   1 HP | Rhythmic |   1 HP | Sine Fly |   2 HP | 280px/s   |
+-------------------+-------------------+-------------------+--------------------+
```

### 5.1 Hermit Scuttler
- **Archetype**: `patrol_walker` (Areas 1, 2).
- **Visuals**: Turquoise hermit crab carrying a spiral conch shell with lively wiggling eye-stalks.
- **Kinematic Rule**: Always simulates gravity ($980\text{px/s}^2$) and platform swept AABB collision. Clamps to platform bounds $[x_{min}, x_{max}]$ with automatic edge and wall turning.
- **Speed**: $60\text{ px/s}$.
- **Hitboxes**: Width = $20\text{px}$, Height = $22\text{px}$. Top 6px is vulnerable stomp zone; lower 16px deals 1 damage to player.
- **Score Value**: $+100\text{ pts}$.
- **Juice**: Popping sound (300Hz $\to$ 800Hz), conch shell spins upward in an arc, 6 sand/shell fragment particles burst.

### 5.2 Spiny Urchin
- **Archetype**: `rhythmic_hopper` (Areas 2, 3, 5).
- **Visuals**: Violet sea urchin with glowing neon spines that retract and extend.
- **Behavior Cycle**:
  1. *Idle on Ground*: 1.0s wait time with subtle breathing pulse.
  2. *Squash Telegraph*: 0.25s squash animation (down to 70% height) with warning bubbles.
  3. *Hop Apex*: Springs vertically with impulse $v_y = -350\text{ px/s}$ reaching $\approx 62\text{px}$ height.
  4. *Fall*: Descends under gravity ($980\text{px/s}^2$).
- **Vulnerability**: Stompable at apex, descent, or idle.
- **Score Value**: $+150\text{ pts}$.
- **Juice**: Resonant pop chord, cloud of 8 violet water bubbles, Cori gains high stomp bounce ($v_y = -320\text{px/s}$).

### 5.3 Bubble Ray Flyer
- **Archetype**: `sine_flyer` (Areas 3, 4, 5).
- **Visuals**: Translucent bioluminescent manta ray emitting a soft cyan halo and trailing bubble motes.
- **Behavior**:
  - Horizontal speed: $v_x = 70\text{ px/s}$.
  - Vertical oscillation: $y(t) = y_0 + A \cdot \sin(2\pi f t)$, where $A = 28\text{px}$, $f = 0.6\text{Hz}$.
  - Casts a dynamic $60\text{px}$ ambient light circle in dark cave regions.
- **Vulnerability**: Stompable from above. Stomping resets Cori's Tide Dash and allows aerial chaining across long oceanic pits.
- **Score Value**: $+150\text{ pts}$.
- **Juice**: Crystal water chime, cyan bubble explosion, soft screen flash.

### 5.4 Coral Crusher Crab
- **Archetype**: `proximity_charger` (Areas 4, 5).
- **Visuals**: Heavy red-and-coral armored crab with massive overgrown stone claws and glowing yellow eyes.
- **Health**: 2 HP (Requires 2 dazed stomps to defeat).
- **Behavior State Machine**:
  1. *Patrol State*: Walks along platform at $40\text{ px/s}$.
  2. *Aggro Check*: If Cori is within $180\text{px}$ line-of-sight on the same vertical elevation, enters *Alert State*.
  3. *Alert Telegraph*: Pauses for 0.40s, snaps claws with red flash and ground dust particles.
  4. *Charge Rush*: Sprints at $280\text{ px/s}$. Completely invulnerable to frontal attacks or stomps while charging (spikes face up).
  5. *Wall Crash & Stun*: When hitting a solid wall or edge stop:
     - Screen shakes for 0.15s (magnitude 3px).
     - Heavy `thud` sound + coral fragment explosion.
     - Enters **Dazed / Stunned State** for $2.2\text{ s}$ (eyes spin, shell opens, vulnerable to stomps).
- **Vulnerability**: Stompable **ONLY** while dazed. Stomping while charging deals 1 damage to Cori.
- **Score Value**: $+250\text{ pts}$.
- **Juice**: Dizzy cartoon sea-stars, heavy stone shatter sound, 12 coral shard particles.

---

## 6. Climax Boss: The Ancient Tide Golem

```
+-------------------------------------------------------------------------+
| Area 5 Boss Coliseum (720px Wide x 450px High)                          |
|                                                                         |
|  [Left Coral Ledge (Y=260)]                       [Right Coral (Y=260)] |
|   |===== 140px =====|                                 |===== 140px =====||
|                                                                         |
|                     [ The Ancient Tide Golem ]                          |
|                            (Coral Core)                                 |
|                                                                         |
|  ============================== Floor ================================= |
+-------------------------------------------------------------------------+
```

### 6.1 Boss Overview & Arena Layout
- **Name**: The Ancient Tide Golem (Guardian of the Horizon Beacon).
- **Visuals**: Giant monolithic golem constructed of weathered sea-stone, living coral branches, and a pulsing luminescent Pearl Core on its crown.
- **Dimensions**: Width = $64\text{px}$, Height = $74\text{px}$.
- **Total HP**: 3 Boss Health Units (3 distinct phases).
- **Coliseum Arena**:
  - Enclosed arena width: $720\text{px}$.
  - Floor ground level at $y = 390\text{px}$.
  - Two elevated safe coral shelves: Left ($x=80\text{–}220, y=260$) and Right ($x=500\text{–}640, y=260$).

---

### 6.2 Phase Breakdown

```
[ Phase 1: 3 HP ]
  - Heavy Stride
  - Ground Slam Tidal Wave (Cori leaps over wave)
  - Core Exposed (3.5s) --> Stomp Core 1!

[ Phase 2: 2 HP ]
  - Speed +25%
  - Rolling Coral Boulders (Cori hops to elevated coral shelves)
  - Fast Ground Slam Tidal Wave
  - Core Exposed (2.6s) --> Stomp Core 2!

[ Phase 3: 1 HP (Enraged Tempest) ]
  - Speed +40%
  - Ceiling Water Jet Barrage (Telegraphed floor shadows)
  - Double Ground Slam Tidal Waves
  - Enraged Wall Charge -> Wall Crash Stun (2.2s)
  - Core Exposed --> Stomp Core 3 (Final Victory!)
```

#### Phase 1: 3 HP — Heavy Tidal Awaken
- **Attack 1 (Ground Slam Tidal Wave)**: Golem rises $50\text{px}$ with a 0.8s shadow telegraph, then slams into the ground. A rushing tidal wave ($200\text{px/s}$) travels along the floor toward both walls. Cori must jump over the wave.
- **Attack 2 (Heavy Stride)**: Steps deliberately toward the arena center.
- **Vulnerability Window**: After the slam, the Golem kneels exhausted for **3.5 seconds**. Its stone crown opens, exposing the glowing **Pearl Core** at $y=340$. Cori jumps onto the core to deal 1 Boss Damage.
- **Phase Transition**: Golem roars with an azure bubble burst, becomes invulnerable for 1.8s, and leaps back to the center.

#### Phase 2: 2 HP — Rolling Boulder Torrent
- **Speed Modifier**: Attack cycle executes 25% faster.
- **Attack 1 (Rolling Coral Boulders)**: Golem hurls 2 spherical coral boulders that roll along the arena floor and ricochet off walls. Cori must jump to the elevated coral shelves for safety.
- **Attack 2 (Fast Tidal Wave)**: Faster ground slam shockwave ($260\text{px/s}$).
- **Vulnerability Window**: Golem kneels for **2.6 seconds**. Cori leaps from a coral shelf with a precision dive stomp on the exposed core to deal the 2nd Boss Damage.

#### Phase 3: 1 HP — Enraged Tempest
- **Visuals**: Golem stone cracks glow bright amber/crimson; water geysers erupt around its shoulders.
- **Speed Modifier**: Attack cycle executes 40% faster.
- **Attack 1 (Ceiling Water Jet Barrage)**: 3 circular danger reticles appear on the floor (0.6s telegraph), followed by powerful pressurized water geysers blasting from above.
- **Attack 2 (Double Slam Waves)**: Two consecutive slams producing staggered low and high tidal surges.
- **Attack 3 (Enraged Wall Charge)**: Golem bellows and charges across the arena floor at $320\text{px/s}$ directly toward a wall.
- **Wall Crash Stun**: The Golem crashes into the coliseum wall, shaking the screen (magnitude 5px, 0.3s duration) and collapsing into a stunned daze with swirling stars for **2.2 seconds**.
- **Final Stomp**: Cori stomps the exposed Pearl Core, triggering the grand victory sequence!

---

### 6.3 Boss Defeat & Beacon Awakening Sequence
1. **Dramatic Freeze-Frame**: 0.5s freeze-frame on final hit.
2. **Purification Explosion**: Corrupted dark waters dissolve into thousands of glowing golden sea motes and rainbow bubbles.
3. **Pacification**: The Ancient Tide Golem shrinks into a gentle, mossy stone reef guardian, bowing respectfully to Cori.
4. **Sun Pearl 5.5 Drops**: The 25th Sun Pearl appears in a radiant pillar of light (+50 pts).
5. **Gateway Opens**: Archway unlocks leading to the Great Horizon Beacon and the Ending Altar!

---

## 7. Collectibles, Economy, Lighthouses, & Lore Medallions

```
+--------------------------------------------------------------------+
|                       COLLECTIBLES BUDGET                          |
+------------------------------------+-------------------------------+
|  25 Sun Pearls (5 per level)       |  +50 Pts each (100% Rank)     |
|  50 Golden Nautilus Shells (10/lvl)|  +20 Pts each (Bonus Score)   |
|  5 Hidden Lore Medallions          |  +500 Pts each + Lore Codex   |
|  4 Lighthouses (3 Ancient + Final) |  Archipelago Restoration      |
|  5 Waystone Checkpoints            |  Respawn Attunement & Restore |
+------------------------------------+-------------------------------+
```

### 7.1 Sun Pearls (Primary Quest)
- **Total**: 25 Pearls (5 per area).
- **Visuals**: Luminescent iridescent white-and-gold pearls with a gentle floating bob and 3 orbiting sparkles.
- **Effect**: Increments counter (`sunPearls / 25`), awards $+50\text{ pts}$, plays an ascending major arpeggio chime.

### 7.2 Golden Nautilus Shells (Score Boosters)
- **Total**: 50 Pickups (10 per area).
- **Visuals**: Shimmering golden spiral nautilus shells.
- **Effect**: Awards $+20\text{ pts}$, encouraging thorough exploration.

### 7.3 The 5 Hidden Lore Medallions
Hidden inside secret false alcoves (marked by subtle sea-carvings or parting seaweed curtains):
1. **Medallion of the Tides (Area 1 — Palm Beach)**:
   > *"When the first ocean cooled, the Tidal Core gave life to the coral reefs and whispered rhythm to the sea."*
2. **Medallion of the Deep Ruins (Area 2 — Overgrown Ruins)**:
   > *"The ancient seafolk built towers to mirror the constellations, harnessing starlight to guide distant voyagers."*
3. **Medallion of the Flooded Grotto (Area 3 — Flooded Caves)**:
   > *"Deep within the flooded grottos, bioluminescent currents pulse with the heartbeat of the sleeping sentinel."*
4. **Medallion of the Sea Gale (Area 4 — Wind Cliffs)**:
   > *"The cliff winds sing an unbroken sea shanty, lifting those who dare to leap with faith into the updraft."*
5. **Medallion of the Horizon Beacon (Area 5 — Lighthouse Island)**:
   > *"When all four beacons shine upon the horizon, the tempest calms and the ocean cradle enters eternal harmony."*

### 7.4 The 4 Lighthouses
1. **Lighthouse 1 (Palm Beach)**: Restores light to the Sandy Shoals.
2. **Lighthouse 2 (Overgrown Ruins)**: Illuminates the Sunken Arch.
3. **Lighthouse 3 (Wind Cliffs)**: Pierces the mist of the Windy Crags.
4. **The Final Beacon (Lighthouse Island)**: Unites all three beams, clearing the storm across the entire archipelago.

---

## 8. Interactive NPCs & Multi-Page Dialogue Scripts

### 8.1 Coralia the Pearl Diver (Area 1 — Palm Beach)
- **Visuals**: Cheerful sea-otter diver wearing a brass diving helmet, snorkel, and shell necklace.
- **Dialogue Script**:
  - *Page 1*: "Ahoy there, little Cori! The coastal tempests have extinguished the Three Ancient Lighthouses, and dark tides churn across the archipelago."
  - *Page 2*: "Collect the 5 Sun Pearls scattered across each reef to restore their radiance. Press [Space] to leap, and stomp atop Hermit Scuttlers to bounce safely!"
  - *Page 3*: "Seek out my old sailing partner Barnaby in the Overgrown Ruins ahead. Keep your antennae glowing bright, little sprite!"

### 8.2 Barnaby the Navigator (Area 2 — Overgrown Ruins)
- **Visuals**: Wise old sea-turtle captain with a brass sextant, nautical captain's hat, and shell map.
- **Dialogue Script**:
  - *Page 1*: "Shiver me barnacles! You made it past the outer reefs, young Cori. The ancient masonry here holds strong, but the waters are rising fast."
  - *Page 2*: "Deep within the Flooded Caves lies the sacred Shrine of the Tide Dash. Once attuned, you can press [Shift] or [J] mid-air to surge through the sea breeze!"
  - *Page 3*: "Beware the Coral Crusher Crabs on the high cliffs. Their thick armor can only be cracked when they daze themselves against hard stone walls!"

### 8.3 Ancient Beacon Keeper (Area 5 — Ending Altar)
- **Visuals**: Ethereal manta spirit wearing a glowing pearl diadem, hovering above the Horizon Altar amidst swirling sunbeams.
- **Dialogue Script & Dynamic Stats**:
  - *Page 1*: "Cori, child of the tides! You have awakened the ancient beacons and calmed the fury of the Tide Golem."
  - *Page 2*: [Dynamic Victory Summary]
    - *"Sun Pearls Restored: [X] / 25"*
    - *"Golden Nautilus Shells: [Y] / 50"*
    - *"Lore Medallions Discovered: [Z] / 5"*
    - *"Clear Time: [MM:SS] | Total Score: [ZZZZZ]"*
  - *Page 3*: "All 4 Lighthouses ignite across the horizon! May the great ocean cradle guide your travels forever, Master Navigator of the Reefs!"

---

## 9. Health, Damage, Checkpoint Waystone Loop, & Death Mechanics

```
[ Cori takes Damage ]
        |
        +---> [ HP > 0 ] ---> 1.5s Invulnerability (10Hz Flashing)
        |                      Knockback: -180px/s Hop, 160px/s Back
        |
        +---> [ HP === 0 or Abyss Pit Fall ]
                    |
                    v
      [ Instant Respawn at Last Waystone ]
        - Full 3 Hearts restored
        - Retain all collected Sun Pearls, Shells, & Medallions
        - Zero page reloads or UI softlocks
        - Death counter incremented
```

### 9.1 Checkpoint Waystone System
- Each level contains an ancient runic Waystone.
- **Attunement**: Passing within $35\text{px}$ attunes the Waystone. The dormant blue rune flares into radiant amber, emits a harmonic chime, and persists progress.
- **Instant Respawn**: Upon death or falling into a bottomless hazard abyss, Cori respawns directly on top of the active Waystone with full 3 Hearts and a 1.0s invulnerability period, without screen reloads.

---

## 10. HUD, Modals, & Procedural Web Audio Synthesizer Design

```
+-------------------------------------------------------------------------+
| [♥ ♥ ♥]                   SUN PEARLS: 18/25                [ ⏸ ] [ 🔊 ]|
|                           SCORE: 04,280                                 |
+-------------------------------------------------------------------------+
```

### 10.1 Heads-Up Display (HUD)
- **Hearts (Top-Left)**: 3 pixel-art hearts ($24 \times 24\text{px}$). Empty hearts render as hollow translucent outlines.
- **Sun Pearl Counter (Top-Center)**: Iridescent pearl icon with counter `X / 25`.
- **Score & Shells (Top-Center Subtitle)**: Formatted score with shell count.
- **System Controls (Top-Right)**: Pause button (`[ ⏸ ]`) and Audio mute toggle (`[ 🔊 / 🔇 ]`).

### 10.2 Boss Health Bar
- Displayed exclusively during the Area 5 Boss battle at bottom center ($320 \times 18\text{px}$).
- Rich coral-stone border with 3 distinct glowing blue/amber segments.

### 10.3 Procedural Web Audio Synthesis Engine
Zero external sound files required! 100% offline procedural synthesis via the Web Audio API:
- **Jump**: Sine sweep ($200\text{Hz} \to 450\text{Hz}$, $0.12\text{s}$).
- **Tide Dash**: Filtered noise burst with resonant bandpass sweep ($0.18\text{s}$).
- **Stomp / Enemy Pop**: Low-frequency square thump ($130\text{Hz} \to 60\text{Hz}$, $0.08\text{s}$) + bubble sparkle ($700\text{Hz} \to 1100\text{Hz}$).
- **Sun Pearl Pickup**: Ascending major arpeggio ($E_5 \to G\#_5 \to B_5 \to E_6$, sine wave, $0.25\text{s}$).
- **Nautilus Shell Pickup**: Crisp dual chime ($A_5 \to C\#_6$, $0.10\text{s}$).
- **Player Hurt**: Distorted sawtooth drop ($260\text{Hz} \to 90\text{Hz}$, $0.20\text{s}$).
- **Boss Tidal Slam**: Heavy sub-bass boom ($65\text{Hz} \to 25\text{Hz}$, $0.50\text{s}$) + wave noise splash.
- **Background Music (BGM)**: Multi-track procedural synthesizer featuring warm acoustic bass, marimba arpeggios, pan flute melody, and soft wave percussion, tailored per biome.

---

## 11. Persistence, Playgama Bridge, & QA Flags

### 11.1 Save Data Schema (`tidebound_save_v1`)
```json
{
  "version": 1,
  "currentLevel": 1,
  "lastCheckpointId": "waystone_1",
  "playerHealth": 3,
  "score": 0,
  "deaths": 0,
  "playtimeSeconds": 0,
  "tideDashUnlocked": false,
  "sunPearlsCollected": [],
  "nautilusShellsCollected": [],
  "medallionsCollected": [],
  "lighthousesLit": [],
  "bossDefeated": false,
  "audioMuted": false,
  "timestamp": 1771156800000
}
```

### 11.2 Playgama SDK Bridge Integration
- **SDK Lifecycle**: Emits `window.bridge.platform.sendMessage('game_ready')` upon asset load completion.
- **Gameplay Start / Stop**: Calls `PlaygamaBridge.gameplayStart()` on level load and `PlaygamaBridge.gameplayStop()` on pause / game over / ending victory.
- **Cloud Persistence**: Automatically mirrors `localStorage` save states to Playgama Cloud Storage.
- **Visibility & Tab Switching**: Listens to `document.visibilitychange` and window blur, pausing gameplay and suspending the audio context immediately.

### 11.3 QA & Testing URL Parameters
- `?reset=1`: Wipes all `localStorage` progress and starts fresh at Area 1.
- `?nosave=1`: Ephemeral developer session; does not read or write storage.
- `?level=N`: (e.g. `?level=5`) Directly launches Area N for rapid level/boss verification.
- `?god=1`: Invulnerability mode for kinematic reach and collision testing.

---

## 12. Complete Gameplay Progression Flow

```
[ Title Screen ]
       |
       v
[ Area 1: Palm Beach ] --------> Learn Run, Jump, Stomp -> Coralia NPC -> Lighthouse 1
       |
       v
[ Area 2: Overgrown Ruins ] ---> Moving Ruins, Spiny Urchins -> Barnaby NPC -> Lighthouse 2
       |
       v
[ Area 3: Flooded Caves ] -----> Disappearing Coral, Bubble Rays -> Unlock Tide Dash!
       |
       v
[ Area 4: Wind Cliffs ] -------> Updrafts, Cloud Ledges, Crusher Crabs -> Lighthouse 3
       |
       v
[ Area 5: Lighthouse Island ] -> Master Gauntlet -> Beacon Keeper NPC -> Waystone 5
       |
       v
[ Boss: Ancient Tide Golem ] --> Phase 1, 2, 3 -> Stomp Pearl Core -> Pacified!
       |
       v
[ Grand Ending Altar ] --------> Ignite Final Beacon -> All 4 Beacons Lit -> Master Navigator!
```

---
*End of Game Design Document — Tidebound*
