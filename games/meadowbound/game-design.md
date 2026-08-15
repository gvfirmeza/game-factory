# Game Design Document: Meadowbound
**Version**: 1.0.0  
**Genre**: 2D Platform Adventure / Cozy Action Platformer  
**Target Viewport**: 720 × 450 (16:9 Aspect Ratio, Responsive Letterbox / Pillarbox)  
**Platform Target**: Playgama HTML5 (Desktop & Mobile Touch)  
**Author**: Game Designer Subagent — AI Game Factory  

---

## 1. High Concept & Creative Pillars

### 1.1 High Concept
**Meadowbound** is a vibrant, cozy, and responsive 2D platform adventure inspired by 16-bit golden-era platformers with modern kinematic responsiveness. Players guide **Pip**, an agile woodland sprite, across 5 hand-crafted biomes to recover 25 ancient **Sun Berries**, uncover 5 secret lore medallions, awaken sleepy guardian spirits, and soothe the rampaging **Bramblethorn Golem** to rekindle the **Great Sunburst Tree**.

### 1.2 Core Pillars
1. **Movement Purity & Juiciness**: Responsive platforming with variable jump heights, 100ms coyote time, 120ms jump buffering, snappy horizontal air-dash (*Meadow Dash*), and satisfying enemy stomp bouncing.
2. **Cozy Yet Challenging World**: Warm, vibrant aesthetics with layered parallax backgrounds, ambient flora motes, dynamic camera lerp, and uplifting procedural Web Audio tunes.
3. **Flawless Level Flow & Forgiving Recovery**: Hand-crafted level beats with no dead ends, two-way pit traversal, generous platform clearances (≥70px), and instant Waystone checkpoint respawns without loading screens.
4. **Complete Content Architecture**: 5 distinct level biomes, 4 functional enemy archetypes, 1 multi-phase climax boss, 3 interactive story NPCs with auto-wrapping dialogue, 25 Sun Berries, 5 Hidden Medallions, and 50 Golden Acorns.
5. **Playgama & Web Standards Ready**: Integrated save/load persistence (`localStorage` & Playgama Cloud), touch controls for mobile, on-screen mute & pause toggles, and URL debugging flags (`?reset=1`, `?nosave=1`).

---

## 2. Player Kinematics & Mechanics

```
                         [ Pip the Meadow Sprite ]
                               /          \
                     [Ground Move]     [Airborne]
                      - Run: 200px/s    - Variable Jump: -390px/s
                      - Accel: 1200px/s²- Gravity: 980px/s²
                      - Decel: 1400px/s²- Fall Clamp: 480px/s
                                           |
                                 +---------+---------+
                                 |                   |
                        [Meadow Dash]         [Stomp / Bounce]
                        - 450px/s (0.18s)     - Land on enemy top
                        - 1x per airborne     - +Bounce: -320px/s
                        - Resets on ground    - Resets Meadow Dash
```

### 2.1 Character Attributes: Pip
- **Size / Collision Box**: Width = 18px, Height = 26px (Offset from 24×32 sprite origin).
- **Health**: 3 Hearts (Maximum 3 HP).
- **Invulnerability (i-Frames)**: 1.5 seconds post-damage with 10Hz sprite opacity flickering (0.3 $\leftrightarrow$ 1.0).
- **Damage Knockback**: 160px/s horizontal impulse away from hazard, -180px/s vertical hop, disabling player movement input for 0.20s.

### 2.2 Movement Kinematics & Tuning Formulas
| Parameter | Value | Description |
| :--- | :--- | :--- |
| **Max Horizontal Speed ($v_{max}$)** | $200\text{ px/s}$ | Smooth, agile standard running speed. |
| **Ground Acceleration ($a_{ground}$)** | $1200\text{ px/s}^2$ | Reaches top speed in ~0.16s for instant responsiveness. |
| **Ground Friction / Deceleration ($d_{ground}$)** | $1400\text{ px/s}^2$ | Snappy stopping without slippery sliding (~0.14s to stop). |
| **Air Acceleration ($a_{air}$)** | $900\text{ px/s}^2$ | High air-control allowing precision trajectory adjustments. |
| **Air Drag / Deceleration ($d_{air}$)** | $600\text{ px/s}^2$ | Natural momentum carry when releasing directional keys mid-air. |
| **Jump Impulse ($v_{jump}$)** | $-390\text{ px/s}$ | Provides a maximum apex height of $\approx 78\text{px}$ (single jump). |
| **Jump Cut Velocity ($v_{jump\_cut}$)** | $-140\text{ px/s}$ | Releasing Jump early caps upward velocity for variable jump height. |
| **Gravity ($g$)** | $980\text{ px/s}^2$ | Snappy downward pull preventing floatiness. |
| **Fall Clamp (Terminal Velocity)** | $480\text{ px/s}$ | Prevents tunneling through collision geometry during long drops. |
| **Coyote Time Window** | $0.10\text{ s (100ms)}$ | Jump executes successfully up to 100ms after stepping off a ledge. |
| **Jump Buffer Window** | $0.12\text{ s (120ms)}$ | Jump inputs pressed 120ms before landing execute instantly upon touch. |

### 2.3 Meadow Dash (Single Air-Dash Rule)
- **Activation**: Press `Dash` button (`X` / `Shift` / Mobile `B`).
- **Velocity**: $450\text{ px/s}$ in current facing direction (Left or Right).
- **Duration**: $0.18\text{ s}$ (covers $\approx 81\text{px}$ horizontally).
- **Gravity Nullification**: Vertical velocity is locked to $0\text{ px/s}$ during the 0.18s dash window.
- **Airborne Limit (Constraint)**: Exactly **1 Air-Dash per airborne period**.
  - Initiating an air dash sets `hasAirDash = false`.
  - While airborne, subsequent dash presses produce a subtle "fizzle" puff without dashing.
  - Landing on any solid ground (`isGrounded === true`) OR bouncing off an enemy/springboard instantly resets `hasAirDash = true`.
- **Dash Particles**: Spawns an emerald leaf & golden pollen trail (5 particles spaced along trajectory).

### 2.4 Stomp Attack / Enemy Bounce
- **Condition**: Pip's bottom collision box hits the top 25% boundary of an active enemy while moving downward ($v_y > 0$).
- **Effect on Enemy**: Deals 1 damage (defeating standard minions instantly or staggering bosses).
- **Effect on Pip**:
  - Sets Pip's vertical velocity to $v_{bounce} = -320\text{ px/s}$ (springs Pip into the air).
  - Immediately restores `hasAirDash = true` (allowing chaining aerial maneuvers).
  - Emits juicy radial starburst particles + pleasant squish/pop chime sound.
  - Triggers a 40ms camera micro-shake (magnitude 2px).

---

## 3. Controls & Interaction Architecture

### 3.1 Input Mapping Table
| Action | Keyboard Primary | Keyboard Secondary | Gamepad (Standard) | Mobile Touch UI |
| :--- | :--- | :--- | :--- | :--- |
| **Move Left** | `A` | `ArrowLeft` | D-Pad Left / Left Stick Left | Virtual D-Pad Left |
| **Move Right** | `D` | `ArrowRight` | D-Pad Right / Left Stick Right | Virtual D-Pad Right |
| **Look Up / Door** | `W` | `ArrowUp` | D-Pad Up / Left Stick Up | Virtual D-Pad Up |
| **Crouch / Drop Thru** | `S` | `ArrowDown` | D-Pad Down / Left Stick Down | Virtual D-Pad Down |
| **Jump** | `Space` | `Z` / `K` | Button A (South) | Button (A) [Green] |
| **Meadow Dash** | `J` | `Shift` / `X` | Button X (West) / Right Trigger | Button (B) [Amber] |
| **Interact / Talk** | `E` | `Enter` | Button Y (North) / Button B | Action Button [Talk] |
| **Pause / Menu** | `Escape` | `P` | Start / Options | Top-Left Pause Icon |
| **Mute Toggle** | `M` | — | — | Top-Right Audio Icon |

### 3.2 Non-Overflowing Dialogue System
When Pip is within $40\text{px}$ of an NPC or Waystone, a floating diegetic prompt `[E] Talk` / `[E] Read` appears with a gentle bobbing motion.
- Pressing `E` / `Interact` opens a centered bottom `DialogueBox` ($560\times100\text{px}$).
- Text auto-wraps cleanly within 48 characters per line (max 3 lines per page).
- A flashing bouncing acorn indicator indicates more pages.
- Pressing `E`, `Space`, or clicking advances pages or cleanly dismisses the modal without input leakage (0.20s cooldown before jumping is allowed).

---

## 4. World Architecture & 5 Handcrafted Levels

```
[ Level 1: Sunny Meadowlands ]
          |
          v
[ Level 2: Whispering Woods ]
          |
          v
[ Level 3: Bioluminescent Caverns ]
          |
          v
[ Level 4: Gusty Highland Cliffs ]
          |
          v
[ Level 5: The Elder Canopy & Boss Arena ] ---> [ Great Sunburst Ending Altar ]
```

### Level Metrics & Clearance Standards:
- **Minimum Walkway Ceiling Clearance**: $\ge 70\text{px}$ (prevents head clipping during running).
- **Single Jump Horizontal Reach**: $120\text{px}$ (comfortably clears $80\text{–}140\text{px}$ gaps).
- **Dash-Jump Horizontal Reach**: Up to $220\text{px}$ over wide ravines.
- **Maximum Step Height**: $\le 75\text{px}$ without springboards.
- **Springboard Mushroom Open Clearance**: $\ge 160\text{px}$ unobstructed vertical chute above every springboard.

---

### 4.1 Level 1: Sunny Meadowlands
- **Theme**: Sun-drenched rolling grassy hills, blooming wildflowers, buttercup petals drifting in the breeze.
- **Atmosphere**: Warm daylight yellow (`#FFF9D2`), pastel green hills (`#76C043`), bright blue sky (`#68C5DB`).
- **Dimensions**: $2160\text{px} \times 450\text{px}$ (3 screen lengths horizontally).
- **Key Gameplay Beats**:
  1. **Spawn & Welcome**: Pip awakens beside a flowering clover patch. A wooden sign reads *"Welcome to the Meadow! Use A/D or Arrow Keys to run, Space to Jump."*
  2. **First Acorn Patrol**: Encounter with a slow **Acorn Walker**. Player learns the Stomp mechanic.
  3. **Barnaby Snail's Post**: Meet **Barnaby Snail**, who explains that the Great Sunburst Tree has dimmed and gives hints on Sun Berries.
  4. **Dash Introduction**: A $160\text{px}$ chasm that teaches mid-air **Meadow Dash**.
  5. **Waystone 1**: Checkpoint activation near a waterfall bridge.
  6. **Collectibles**:
     - **Sun Berry 1.1**: Floating above the first wooden platform.
     - **Sun Berry 1.2**: Guarded by an Acorn Walker.
     - **Sun Berry 1.3**: Requiring an air-dash over a flower hedge.
     - **Sun Berry 1.4**: High above the waterfall ledge.
     - **Sun Berry 1.5**: At the level exit gate.
     - **Secret 1 (Hidden Grove)**: Walk through a false ivy curtain to the left of the waterfall to discover **Medallion of Dawn** + 10 Golden Acorns.

---

### 4.2 Level 2: Whispering Woods
- **Theme**: Ancient mossy oak canopy, hanging vines, dappled emerald sunbeams, swaying boughs.
- **Atmosphere**: Deep forest emeralds (`#2D5A27`), sunbeam shafts (`rgba(255,245,180,0.15)`), rustling leaves.
- **Dimensions**: $1440\text{px} \times 900\text{px}$ (Vertical 2-tier tree climbing layout).
- **Key Gameplay Beats**:
  1. **Vertical Ascent**: Navigating up swaying mossy branch platforms that move horizontally ($60\text{px}$ oscillation).
  2. **Spore Hopper Hazards**: Encounter **Spore Hoppers** leaping rhythmically between branches. Timing jumps to stomp them at the peak of their arc.
  3. **One-Way Platforms**: Dropping through thin leaf canopies (`Down + Jump`) to explore lower boughs.
  4. **Waystone 2**: Anchored on the Great Hollow branch midpoint.
  5. **Collectibles**:
     - **Sun Berry 2.1**: Above the first moving moss branch.
     - **Sun Berry 2.2**: High jump between two Spore Hoppers.
     - **Sun Berry 2.3**: Hanging over a bramble gap.
     - **Sun Berry 2.4**: Tucked on an outer eastern canopy branch.
     - **Sun Berry 2.5**: At the upper canopy gateway.
     - **Secret 2 (Ancient Hollow)**: A hollow trunk entered via a hidden branch ceiling nook containing **Medallion of Whispers** + 10 Golden Acorns.

---

### 4.3 Level 3: Bioluminescent Caverns
- **Theme**: Subterranean crystal caves, glowing cyan mushrooms, dark purple rock strata, dripping stalactites.
- **Atmosphere**: Deep indigo darkness (`#161338`), neon cyan flora (`#00F5D4`), pulsing crystal lights (`#C77DFF`).
- **Dimensions**: $2160\text{px} \times 675\text{px}$.
- **Key Gameplay Beats**:
  1. **Mushroom Springboards**: Pink bouncy fungi that propel Pip $220\text{px}$ vertically up dedicated high-clearance open chutes.
  2. **Crystal Spikes & Hazard Bounce**: Sharp amethyst crystals on pit floors. Touching them deals 1 HP damage and bounces Pip upward and backward to safety.
  3. **Glow Bat Flyer Patrols**: Flocks of **Glow Bat Flyers** moving in sine-wave paths. Pip can stomp from one bat to another across a wide chasm.
  4. **Waystone 3**: Glowing deep-cave crystal shrine.
  5. **Collectibles**:
     - **Sun Berry 3.1**: At the apex of the first spring mushroom bounce.
     - **Sun Berry 3.2**: Floating over a crystal hazard spike bed.
     - **Sun Berry 3.3**: Positioned along a Glow Bat sine patrol route.
     - **Sun Berry 3.4**: On a secluded crystal plateau reached via dash-jump.
     - **Sun Berry 3.5**: Near the cavern exit tunnel.
     - **Secret 3 (Luminescent Alcove)**: Drop down a shaft behind a crystal cluster to find **Medallion of Luminescence** + 10 Golden Acorns.

---

### 4.4 Level 4: Gusty Highland Cliffs
- **Theme**: High mountain crags, floating puffy cloud ledges, roaring thermal winds, sweeping vistas.
- **Atmosphere**: Crisp azure sky (`#3A86FF`), golden sunset clouds (`#FFB703`), swirling wind lines.
- **Dimensions**: $2880\text{px} \times 450\text{px}$ (Long horizontal trek with floating cloud bridges).
- **Key Gameplay Beats**:
  1. **Thermal Updrafts**: Vertical wind streams that grant continuous upward lift ($v_y = -220\text{px/s}$) while Pip is inside the wind column.
  2. **Dissolving Cloud Ledges**: Soft cloud platforms that wobble and vanish 1.0s after Pip steps on them, reappearing after 2.0s.
  3. **Bramble Charger Encounters**: Ground-based armored **Bramble Chargers** that charge Pip. Players must bait them into charging solid stone walls to stun them before stomping.
  4. **Waystone 4**: Mountain peak shrine beneath a wind chime arch.
  5. **Collectibles**:
     - **Sun Berry 4.1**: Caught in the first thermal wind updraft.
     - **Sun Berry 4.2**: Across a chain of 3 dissolving cloud ledges.
     - **Sun Berry 4.3**: Behind a Bramble Charger patrol zone.
     - **Sun Berry 4.4**: Floating high above a canyon, reached by combining updraft + Meadow Dash.
     - **Sun Berry 4.5**: At the entry gate to the Elder Canopy.
     - **Secret 4 (Zephyr Grotto)**: A floating cloud ledge tucked under the cliff face leading to **Medallion of Zephyr** + 10 Golden Acorns.

---

### 4.5 Level 5: The Elder Canopy & Boss Arena
- **Theme**: Crown of the Great Sunburst Tree, golden leaves, celestial sunbeams, grand wooden coliseum.
- **Atmosphere**: Radiant golden amber (`#FFAA00`), royal violet sky (`#3C096C`), sacred floating embers.
- **Dimensions**: $2160\text{px} \times 450\text{px}$ (Obstacle Gauntlet + Boss Coliseum + Victory Altar).
- **Key Gameplay Beats**:
  1. **Master Gauntlet**: A sequence combining moving boughs, springboards, and thermal drafts testing all learned mechanics.
  2. **Willow Owl's Rest**: Pre-boss sanctuary. **Willow Owl** offers tactical advice: *"The Golem's bramble armor is impenetrable while it runs! Dodge its shockwave, wait for it to crash or slam, then strike its glowing core!"*
  3. **Waystone 5**: Boss Arena Checkpoint (instant respawn outside boss arena door if defeated).
  4. **Boss Battle**: **The Bramblethorn Golem** (Detailed in Section 6).
  5. **Ending Altar**: Awaken the **Elder Root Spirit**, celebrate the blossoming of the Great Sunburst Tree, and view completion stats.
  6. **Collectibles**:
     - **Sun Berry 5.1**: High above the gauntlet springboard.
     - **Sun Berry 5.2**: Precision jump past dual Spore Hoppers.
     - **Sun Berry 5.3**: Above a collapsing cloud ledge in the upper branches.
     - **Sun Berry 5.4**: Over the entrance arch of the Boss Coliseum.
     - **Sun Berry 5.5**: Rewarded upon the Golem's soothing defeat.
     - **Secret 5 (Ancients' Treasury)**: Secret branch path behind Willow Owl's perch holding **Medallion of the Ancients** + 10 Golden Acorns.

---

## 5. Enemy Bestiary & AI Behaviors

```
+------------------+------------------+-------------------+--------------------+
|  Acorn Walker    |   Spore Hopper   |  Glow Bat Flyer   |  Bramble Charger   |
|  (Ground Patrol) |  (Timed Bounce)  |  (Sine Wave Air)  |  (Charge & Stun)   |
|   1 HP | 60px/s  |   1 HP | Rhythmic|   1 HP | Sine Fly |   1 HP | 280px/s   |
+------------------+------------------+-------------------+--------------------+
```

### 5.1 Acorn Walker
- **Role**: Foundational introductory enemy (Levels 1, 2, 4).
- **Visuals**: Cute brown walking acorn with leaf legs and a little woody cap.
- **Behavior**:
  - Patrols back and forth on its designated platform at $60\text{ px/s}$.
  - Edge detection: Turns around upon reaching a platform edge or colliding with a wall.
- **Hitboxes**:
  - Height = 22px, Width = 20px.
  - Top 6px: Vulnerable stomp zone.
  - Lower 16px: Deals 1 heart damage to Pip.
- **Juice**: Popping sound (`pop` frequency sweep 300Hz $\to$ 800Hz), acorn cap flies upward in an arc, 6 brown wood splinters burst outward.

### 5.2 Spore Hopper
- **Role**: Vertical timing & platform hazard (Levels 2, 3, 5).
- **Visuals**: Striped spotted mushroom critter with bouncy spring legs.
- **Behavior Loop**:
  - **Idle on Ground**: 1.0s wait time.
  - **Squash Telegraph**: 0.25s squashing animation down to 70% height with yellow warning spores.
  - **Hop Apex**: Jumps straight up with $v_y = -350\text{ px/s}$ reaching $\approx 62\text{px}$ height.
  - **Fall**: Descends with standard gravity.
- **Vulnerability**: Stompable at any point during its flight or idle state.
- **Juice**: Cheerful squish audio, cloud of 8 glowing green spore particles, Pip gains extra high bounce (+350px/s).

### 5.3 Glow Bat Flyer
- **Role**: Aerial obstacle and stepping stone (Levels 3, 4, 5).
- **Visuals**: Glowing neon purple bat with bioluminescent cyan wings.
- **Behavior**:
  - Flies horizontally along a sine-wave path: $y(t) = y_0 + A \cdot \sin(2\pi f t)$, where $A = 28\text{px}$, $f = 0.6\text{Hz}$, horizontal speed $v_x = 70\text{px/s}$.
  - Casts a soft $60\text{px}$ radial light aura in dark cavern areas.
- **Vulnerability**: Stompable from above. Stomping a Glow Bat resets Pip's air dash and allows chain-bouncing across long abysses.
- **Juice**: Crystal chime sound, cyan sparkle explosion, gentle light flash.

### 5.4 Bramble Charger
- **Role**: Heavy aggressive threat requiring tactical evasion (Levels 4, 5).
- **Visuals**: Armored spiky wooden boar with glowing red eyes.
- **Behavior State Machine**:
  1. **Patrol State**: Walks slowly at $40\text{ px/s}$.
  2. **Aggro Check**: If Pip is within $180\text{px}$ horizontally on the same Y level, triggers **Alert State**.
  3. **Alert Windup**: Stops, paws ground for 0.40s, snorts with red eye flash and ground dust particles.
  4. **Charge Rush**: Charges forward at $280\text{ px/s}$. Invulnerable to frontal stomps while charging (spikes point up).
  5. **Wall Crash & Stun**: When hitting a solid wall during a charge:
     - Screen shakes for 0.15s (magnitude 3px).
     - Heavy `thud` sound + stone dust burst.
     - Enters **Dazed / Stunned State** for $2.2\text{ s}$ (spins dizzy stars overhead, shell retracts, exposed belly).
- **Vulnerability**: Only vulnerable to stomp while in the **Dazed / Stunned State**. Stomping while charging deals 1 damage to Pip instead!
- **Juice**: Rock debris particles, cartoon dizzy bird stars, satisfying wooden splinter explosion upon defeat (+150 pts).

---

## 6. Climax Boss: The Bramblethorn Golem

```
+-------------------------------------------------------------------------+
| Level 5 Boss Coliseum (720px Wide x 450px High)                         |
|                                                                         |
|  [Left Bough (Y=260)]                               [Right Bough (Y=260)]|
|   |===== 140px =====|                                 |===== 140px =====||
|                                                                         |
|                     [ Bramblethorn Golem ]                              |
|                          (Heart Core)                                   |
|                                                                         |
|  ============================== Floor ================================= |
+-------------------------------------------------------------------------+
```

### 6.1 Boss Overview & Arena Layout
- **Name**: The Bramblethorn Golem (Corrupted Forest Sentinel).
- **Size**: Width = 64px, Height = 74px.
- **Total HP**: 3 Boss Health Units (3 distinct escalating phases).
- **Boss Arena Features**:
  - Floor width: $720\text{px}$ enclosed by ancient wooden trunk walls.
  - Two elevated safe boughs: Left ledge ($x=80\text{–}220, y=260$) and Right ledge ($x=500\text{–}640, y=260$).
  - Floor ground level at $y=390$.

---

### 6.2 Phase Breakdown

```
[ Phase 1: 3 HP ]
  - Heavy Stride
  - Ground Slam Shockwave (Pip jumps over)
  - Core Exposed (3.5s) --> Stomp Core 1!

[ Phase 2: 2 HP ]
  - Speed +25%
  - Rolling Briar Spores (Pip hops to elevated boughs)
  - Ground Slam Shockwave
  - Core Exposed (2.6s) --> Stomp Core 2!

[ Phase 3: 1 HP (Enrage) ]
  - Double Slam Shockwave
  - Falling Thorn Barrage (Warning ground shadows)
  - Golem Wall Charge -> Wall Crash Stun (2.0s)
  - Core Exposed --> Stomp Core 3 (Final Victory!)
```

#### Phase 1: 3 HP — Heavy Awaken
- **Attack 1 (Ground Slam Shockwave)**: Golem leaps $50\text{px}$ up with a 0.8s telegraph shadow, slams down. Emits a continuous ground-level shockwave wave ($200\text{px/s}$) traveling toward both walls. Pip must jump over the wave.
- **Attack 2 (Stride)**: Moves toward arena center.
- **Vulnerability Window**: Following the Ground Slam, the Golem kneels exhausted for **3.5 seconds**. Its crown opens, exposing the glowing **Solar Heart Core** at $y=340$. Pip jumps onto the head/core to deal 1 Boss Damage.
- **Phase Transition**: Golem roars, becomes invulnerable with golden energy shield for 1.8s, leaps to center.

#### Phase 2: 2 HP — Briar Frenzy
- **Speed Modifier**: Attack cycle executes 25% faster.
- **Attack 1 (Rolling Briar Spores)**: Golem launches 2 spiky rolling bramble seed balls that roll along the floor and bounce off arena walls. Pip must leap to the side boughs for safety.
- **Attack 2 (Ground Slam Shockwave)**: Fast shockwave ($260\text{px/s}$).
- **Vulnerability Window**: Golem kneels for **2.6 seconds**. Pip drops from side bough with a precision stomp on the exposed core to deal 2nd Boss Damage.

#### Phase 3: 1 HP — Ancient Enrage
- **Visuals**: Golem cracks glow bright crimson, bramble vines lash frantically.
- **Attack 1 (Double Slam Shockwave)**: Two consecutive slams producing staggered low/high shockwaves.
- **Attack 2 (Falling Thorn Barrage)**: 3 circular red warning reticles appear on the floor (0.6s warning), followed by falling briar stalactites from the canopy.
- **Attack 3 (Enraged Charge)**: Golem roars and charges across the floor ($320\text{px/s}$) directly toward a wall.
- **Wall Crash Stun**: The Golem crashes into the wall trunk, shaking the entire screen (magnitude 5px, 0.3s duration), collapsing into a stunned daze with swirling stars for **2.2 seconds**.
- **Final Stomp**: Pip stomps the exposed heart core, triggering the grand victory sequence!

---

### 6.3 Boss Defeat & Tree Awakening Sequence
1. **Dramatic Slowdown**: 0.5s freeze-frame on final hit.
2. **Purification Explosion**: Corrupted thorns shatter into thousands of golden flower petals and radiant sun motes.
3. **Restoration**: The Bramblethorn Golem shrinks into a gentle, mossy guardian with floral antlers, bowing respectfully to Pip.
4. **Sun Berry 5.5 Drops**: The 25th Sun Berry is awarded in a glowing pillar of light.
5. **Gateway Opens**: Portal opens to the Great Sunburst Ending Altar.

---

## 7. Collectibles, Economy, & Lore Medallions

```
+--------------------------------------------------------------------+
|                       COLLECTIBLES BUDGET                          |
+------------------------------------+-------------------------------+
|  25 Sun Berries (5 per level)      |  +100 Pts each (100% Rank)    |
|  50 Golden Acorns (10 per level)   |  +20 Pts each (Bonus Score)   |
|  5 Hidden Lore Medallions          |  Lore entries + Golden Crown  |
|  5 Waystone Checkpoints            |  Respawn Attunement & Restore |
+------------------------------------+-------------------------------+
```

### 7.1 Sun Berries (Primary Quest)
- Total: **25 Berries** (5 per level).
- Visuals: Glowing golden-amber berry surrounded by 3 orbiting mini-sparkles.
- Effect: Adds to berry counter (`sunBerries / 25`), awards 100 points, produces ascending major arpeggio chime.

### 7.2 Golden Acorns (Score Booster)
- Total: **50 Acorns** scattered across levels.
- Visuals: Shimmering gold acorn that rotates.
- Effect: Awards 20 points, builds high score for competitive replayability.

### 7.3 The 5 Hidden Lore Medallions
Hidden behind subtle false walls (lush foliage curtains or cracked bark patterns) that become translucent when Pip walks into them:
1. **Medallion of Dawn (Level 1)**: *"In the morning light of the first age, the Sunburst Tree sprouted from a single fallen star."*
2. **Medallion of Whispers (Level 2)**: *"The canopy winds remember every song sung by the sprites of old."*
3. **Medallion of Luminescence (Level 3)**: *"Deep beneath the roots, glowing crystals drink the earth's quiet warmth."*
4. **Medallion of Zephyr (Level 4)**: *"High atop the cliffs, the mountain gale carries the seeds of new beginnings."*
5. **Medallion of the Ancients (Level 5)**: *"When all five blessings unite, the slumbering forest awakens in eternal bloom."*

---

## 8. Interactive NPCs & Dialogue Trees

### 8.1 Barnaby Snail (Level 1 — Sunny Meadowlands)
- **Visuals**: Large cozy snail with a tiny teapot on his shell and round spectacles.
- **Dialogue Script**:
  - *Page 1*: "Well met, young Pip! The Great Sunburst Tree has grown dim, and brambles choke the upper boughs."
  - *Page 2*: "Gather the 5 Sun Berries in each region to restore its light. Press [Space] to Jump, and tap [Shift] or [J] mid-air for a Meadow Dash!"
  - *Page 3*: "Keep a keen eye out for secret alcoves behind thick ivy curtains. Safe travels, little sprite!"

### 8.2 Willow Owl (Level 5 — Canopy Sanctuary)
- **Visuals**: Stately scholar owl perched on an ornate wooden lectern with an open parchment map.
- **Dialogue Script**:
  - *Page 1*: "Hoo-hoo! You have climbed far, little Pip. Ahead lies the Bramblethorn Golem."
  - *Page 2*: "Its thorny armor deflects all attacks while it charges! You must leap over its ground shockwaves and let it exhaust itself."
  - *Page 3*: "When it crashes or kneels, strike its glowing Heart Core from above. Restore the canopy!"

### 8.3 Elder Root Spirit (Level 5 — Ending Altar)
- **Visuals**: Majestic glowing tree dryad spirit with floral antlers, surrounded by swirling sun rays.
- **Dialogue Script & Stats Summary**:
  - *Page 1*: "Pip, bravest of sprites! The bramble corruption has dissolved, and the Great Sunburst Tree blazes with life once more."
  - *Page 2*: [Dynamic Stats Display]
    - *"Sun Berries Restored: [X] / 25"*
    - *"Lore Medallions Discovered: [Y] / 5"*
    - *"Clear Time: [MM:SS] | Total Score: [ZZZZZ]"*
  - *Page 3*: *"You have earned the title of [Meadow Champion / Master Botanist]! The forest will forever sing your name."*

---

## 9. Health, Damage, Checkpoints, & Death Loop

```
[ Pip takes Damage ]
        |
        +---> [ HP > 0 ] ---> 1.5s Invulnerability (10Hz Flashing)
        |                      Knockback: -180px/s Hop, 160px/s Back
        |
        +---> [ HP === 0 or Pit Fall ]
                    |
                    v
      [ Instant Respawn at Last Waystone ]
        - Full 3 Hearts restored
        - Retain all collected Sun Berries & Medallions
        - Zero page reloads or UI softlocks
        - Death counter incremented
```

### 9.1 Checkpoint Waystone System
- Each level features an ancient runic Waystone.
- **Attunement**: Passing within $30\text{px}$ attunes the Waystone. The rune illuminates from dormant cyan to bright amber, plays a harmonic resonance chime, and saves game state.
- **Respawn**: Upon death or falling into a hazard abyss, Pip immediately respawns directly on top of the active Waystone with full 3 Hearts and a brief 1.0s invulnerability period.

---

## 10. HUD, Modals, & Audio Synthesizer Design

```
+-------------------------------------------------------------------------+
| [♥ ♥ ♥]                   SUN BERRIES: 18/25               [ ⏸ ] [ 🔊 ]|
|                           SCORE: 04,280                                 |
+-------------------------------------------------------------------------+
```

### 10.1 Heads-Up Display (HUD)
- **Heart Container (Top-Left)**: 3 pixel-art hearts ($24\times24\text{px}$ each). Empty hearts render as hollow translucent outlines.
- **Sun Berry Counter (Top-Center)**: Golden berry icon with text `X / 25`.
- **Score & Medallions (Top-Center Subtitle)**: Formatted score with gold medallion icons (1 to 5).
- **Controls & Mute (Top-Right)**: Pause button (`[ ⏸ ]`) and Audio toggle (`[ 🔊 / 🔇 ]`).

### 10.2 Boss Health Bar
- Displayed exclusively during Level 5 Boss encounter at bottom center ($320\times18\text{px}$).
- Rich wooden border with 3 distinct green/amber segments representing the Golem's 3 HP.

### 10.3 Procedural Web Audio Synthesis Engine
Zero external audio files required! Pure Web Audio API synthesis ensures 100% offline reliability:
- **Jump**: Quick frequency sweep ($180\text{Hz} \to 420\text{Hz}$, sine wave, $0.12\text{s}$).
- **Meadow Dash**: Filtered white noise burst with high-pass sweep ($0.18\text{s}$).
- **Stomp / Bounce**: Square wave thump ($120\text{Hz} \to 60\text{Hz}$, $0.08\text{s}$) + pop sparkle ($600\text{Hz} \to 900\text{Hz}$).
- **Berry Collect**: Arpeggiated chime ($C_5 \to E_5 \to G_5 \to C_6$, sine wave, $0.25\text{s}$).
- **Hurt / Damage**: Distorted sawtooth drop ($240\text{Hz} \to 80\text{Hz}$, $0.20\text{s}$).
- **Boss Slam**: Low-frequency resonant noise + triangle boom ($80\text{Hz} \to 30\text{Hz}$, $0.45\text{s}$).
- **Background Music (BGM)**: Multi-channel synthesizer loop with bassline, arpeggiated marimba/flute leads, and gentle percussive noise clicks, transitioning smoothly between biomes.

---

## 11. Persistence, Playgama Bridge, & QA Flags

### 11.1 Save Data Schema (`meadowbound_save_v1`)
```json
{
  "version": 1,
  "currentLevel": 1,
  "lastCheckpointId": "waystone_1",
  "playerHealth": 3,
  "score": 0,
  "deaths": 0,
  "playtimeSeconds": 0,
  "sunBerriesCollected": [],
  "goldenAcornsCollected": [],
  "medallionsCollected": [],
  "bossDefeated": false,
  "audioMuted": false,
  "timestamp": 1771156800000
}
```

### 11.2 Playgama SDK Bridge Integration
- **SDK Initialization**: Synchronous / asynchronous initialization check on boot.
- **Gameplay Start / Stop**: `PlaygamaBridge.gameplayStart()` called on level start; `PlaygamaBridge.gameplayStop()` called on pause / game over / ending altar.
- **Cloud Storage Sync**: Mirrors `localStorage` save data to Playgama player cloud storage.
- **Orientation & Visibility**: Handles `document.visibilitychange` and window blur by automatically pausing gameplay and muting audio context.

### 11.3 QA & Testing URL Parameters
- `?reset=1`: Wipes all saved progress from `localStorage` and starts a brand new game session.
- `?nosave=1`: Ephemeral mode; ignores existing save data and prevents writing changes to storage.
- `?level=N`: (e.g. `?level=5`) Directly loads specific level for rapid developer testing.
- `?god=1`: Invulnerability mode for level design & collision verification.

---

## 12. Complete Gameplay Progression Flow

```
[ Title Screen ]
       |
       v
[ Level 1: Sunny Meadowlands ] ---> Learn Run, Jump, Stomp, Dash -> Waystone 1
       |
       v
[ Level 2: Whispering Woods ] ----> Moving Boughs, Spore Hoppers -> Waystone 2
       |
       v
[ Level 3: Bioluminescent Caverns ] > Spring Mushrooms, Spikes, Glow Bats -> Waystone 3
       |
       v
[ Level 4: Gusty Highland Cliffs ] -> Thermals, Cloud Ledges, Bramble Chargers -> Waystone 4
       |
       v
[ Level 5: The Elder Canopy ] ----> Master Gauntlet, Willow Owl -> Waystone 5
       |
       v
[ Climax Boss: Bramblethorn Golem ] -> Phase 1, 2, 3 -> Stomp Core -> Victory!
       |
       v
[ Great Sunburst Ending Altar ] ---> Elder Root Spirit -> Stats & Botanist Rank!
```

---
*End of Game Design Document — Meadowbound*
