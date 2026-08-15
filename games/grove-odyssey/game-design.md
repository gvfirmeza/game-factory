# Game Design Document: Grove Odyssey

## 1. High Concept & Fantasy
**Grove Odyssey** is a rich, cozy, non-violent exploratory mini Metroidvania. Players control **Lumi**, a tiny, glowing woodland spirit with bioluminescent antennae and a leafy cape, tasked with restoring the harmony of the enchanted forest. 

The ancient **Great Elder Tree** at the heart of the forest has withered after a twilight storm scattered its **8 Ancient Sun Seeds** across 7 interconnected canopy, cavern, highland, and subterranean realms. To awaken the Great Tree, Lumi must explore the labyrinthine woodland, discover lost movement abilities, converse with memorable animal denizens, overcome shadowy woodland hazards, activate ancient waystones, and recover every lost seed.

---

## 2. World Map & Interconnected Zone Topology

The world is composed of **7 distinct, seamless interconnected zones** arranged logically in vertical and horizontal space:

```
                      [ 4. Sunlit Canopy ] <==========> [ 6. Windy Chasm ]
                               ^                                ^
                               | (Feather Jump)                 | (Wind Glide)
                               v                                v
[ 2. Mossy Caverns ] <===> [ 1. Heart Grove ] <==========> [ 3. Crystal Grotto ]
       |                 (Central Hub / Tree)                   |
       | (Drop Shaft)                  | (Drop Chasm)           | (Leaf Dash Wall)
       v                               v                        v
[ 5. Sunken Roots ] <=================================> [ 7. Secret Elder Shrine ]
                                (Hidden Root Tunnel)
```

### The 7 Interconnected Areas

| Area Name | Relative Position | Visual Theme & Environment | Key Highlights & Progression Role |
| :--- | :--- | :--- | :--- |
| **1. Heart Grove** | Central Hub | Sunlit mossy meadow, giant weeping willow roots, elder blossom petals | Starting sanctuary, Great Elder Tree, **Barnaby the Snail**, **Waystone #1**, Seed #1. Crossroads to West, East, North, and South. |
| **2. Mossy Caverns** | West Deep | Damp cave system with bioluminescent turquoise mushrooms, dripping dew, bouncy sporecaps | Early challenge area, **Bramble the Hedgehog**, **Feather Jump Shrine** (Double Jump unlock), Bramble Slimes, Seed #2. |
| **3. Crystal Grotto** | East Low | Shimmering amethyst and cyan cavern, reflective pools, fragile crystal barriers | **Leaf Dash Shrine** (Dash burst unlock), **Waystone #2**, Thorn Beetles, brittle crystal puzzle walls, Seed #3 & Seed #4. |
| **4. Sunlit Canopy** | North High | Golden sunbeam branches, fluttering amber leaves, vertical bough ascents | Accessed via Double Jump. **Pip the Owl**, **Wind Glide Shrine** (Glide unlock), Shadow Wisps, Seed #5. |
| **5. Forgotten Sunken Roots** | South Deep | Gnarled subterranean root maze, glowing sap drips, dense thorn bramble floors | Dark underground test of agility. Bramble Slimes & Thorn Beetles, Seed #6. Connects west to Mossy Caverns. |
| **6. Windy Chasm** | North East Highlands | Misty precipice, roaring vertical updrafts, crumbling floating ledges | Requires Wind Glide to cross broad air corridors. **Waystone #3**, Shadow Wisps, thermal wind gusts, Seed #7. |
| **7. Secret Elder Shrine** | Hidden Vault | Ancient stone sanctum overgrown with golden ivy, primordial glowing glyphs | Hidden behind false wall in Crystal Grotto / Sunken Roots nexus. Pinnacle multi-ability obstacle course, Seed #8. |

---

## 3. Core Abilities & Movement Mechanics

Lumi possesses fluid, responsive, platforming physics engineered with tight forgiving windows (coyote time, jump buffering, corner rounding).

```
                      ┌────────────────────────┐
                      │    Lumi Base Move      │
                      │ (Run, Jump, Wall Cling)│
                      └───────────┬────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 1. Feather Jump  │    │  2. Leaf Dash    │    │  3. Wind Glide   │
│  (Double Jump)   │    │ (Burst & Pierce) │    │  (Air Hovering)  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

### Movement Tuning Values
- **Run Speed**: `220 px/s` (snappy acceleration `1400 px/s²`, crisp stopping deceleration `1800 px/s²`).
- **Jump Force**: `520 px/s` initial impulse; variable height based on button hold duration (min jump height 48px, max jump height 112px).
- **Gravity**: `1150 px/s²` with max terminal fall speed capped at `620 px/s`.
- **Coyote Time**: `120 ms` (allows jumping briefly after walking off a ledge).
- **Jump Buffering**: `110 ms` (queues jump input if pressed just prior to touching ground).
- **Ledge Rounding**: 4px automatic corner nudge to prevent bumping ceiling corners.

### Progression Abilities

#### 1. Feather Jump (Double Jump)
- **Source**: Feather Shrine in *Mossy Caverns*.
- **Mechanic**: Pressing Jump while airborne grants a second vertical boost of `480 px/s`.
- **Juice**: Releases a burst of glowing emerald feather particles and a gentle winged flutter sound.
- **Gating**: Unlocks high ledges in Heart Grove, access to the Sunlit Canopy, and high ledges in Mossy Caverns.
- **Refresh Rule**: Recharges on touching solid ground or bouncing on a Spore Mushroom.

#### 2. Leaf Dash (Horizontal Burst)
- **Source**: Leaf Dash Shrine in *Crystal Grotto*.
- **Mechanic**: Pressing Dash (`Shift`, `J`, or `X`) launches Lumi horizontally at `700 px/s` for `0.22 seconds`.
- **Special Effects**:
  - Grants invulnerability to enemy contact during the dash window.
  - Smashes through brittle crystal walls and slices thorny vine barricades.
- **Cooldown**: `0.65s` cooldown; leaves a trail of spiraling emerald leaf afterimages.
- **Gating**: Unlocks sealed passages in Crystal Grotto, Sunken Roots shortcut, and Secret Elder Shrine entry.

#### 3. Wind Glide (Dandelion Parachute)
- **Source**: Wind Glide Shrine in *Sunlit Canopy*.
- **Mechanic**: Holding Jump while falling in mid-air deploys a glowing dandelion parachute canopy.
- **Physics**: Reduces fall speed by `75%` (capped at `105 px/s`) while boosting horizontal steering speed to `250 px/s`.
- **Updraft Interaction**: Entering vertical thermal wind streams in Windy Chasm lifts Lumi upward dynamically.
- **Gating**: Allows crossing expansive bottomless gaps in the Windy Chasm and navigating float hazards.

---

## 4. Woodland NPCs & Zero-Overflow Dialogue System

Three fully interactive woodland creatures populate the grove. Interacting with an NPC triggers a clean bottom-anchored dialogue card with portrait avatars, typewriter text synthesis, and paginated dialogue advancing.

```
┌────────────────────────────────────────────────────────┐
│ [PORTRAIT]  BARNABY THE SNAIL                          │
│ ┌────────┐  "The ancient Great Tree has lost its       │
│ │  @_v   │   glow, little Lumi. Eight Sun Seeds are    │
│ └────────┘   hidden across the forest..."      [E ➔]   │
└────────────────────────────────────────────────────────┘
```

### NPC Specifications & Dialogue Trees

#### 1. Barnaby the Snail (The Forest Guide)
- **Location**: Heart Grove (beside the Great Tree) and later near the Canopy vista.
- **Persona**: Slow, warm, deeply compassionate elder gardener who carries glowing moss on his shell.
- **Sound Blip**: Deep, mellow resonant wood-marimba tone (`180 Hz - 220 Hz`).
- **Dialogue Script**:
  - *Initial Greeting (Intro)*:
    1. "Ah, wake up, little Lumi... The Great Elder Tree has grown terribly cold and dark."
    2. "A twilight tempest swept through our grove and scattered the eight Ancient Sun Seeds far and wide."
    3. "Take heart! Journey west into the Mossy Caverns first. Old Bramble might know where the ancient Feather Shrine rests."
  - *Mid-Journey (3+ Seeds collected)*:
    1. "I can feel the soil warming up already! You are doing wonderfully, little spirit."
    2. "Have you looked up toward the high Canopy? Pip the Owl loves watching the highland gales from up there."
  - *All 8 Seeds (Climax Ready)*:
    1. "Look at you! All eight Ancient Sun Seeds are singing in harmony!"
    2. "Offer them to the Great Elder Tree's heart, and let our forest bloom once more!"

#### 2. Bramble the Hedgehog (The Underground Miner)
- **Location**: Mossy Caverns (beside his lantern workshop) and Sunken Roots entrance.
- **Persona**: Grumpy, pragmatic, nocturnal crystal enthusiast with magnifying goggles.
- **Sound Blip**: Raspy, low-click percussive woodblock tone (`280 Hz - 320 Hz`).
- **Dialogue Script**:
  - *Initial Greeting*:
    1. "Hmph! Watch your step, glowing sprout! You're kicking up spore dust all over my shiny crystals."
    2. "Looking for the Feather Shrine? It's deeper in the cavern, past those bouncy mushroom caps."
    3. "If you run into brittle crystal walls, don't bang your head on 'em. You'll need the Dash power from the Grotto for that!"
  - *Post-Feather Jump*:
    1. "Bah! Look at you, fluttering around like a moth! Just don't knock down my stalactites."

#### 3. Pip the Owl (The High Sage)
- **Location**: Sunlit Canopy (perched on an elder branch) and Windy Chasm look-out.
- **Persona**: Poetic, philosophical, stargazer who speaks in rhythmic cadences.
- **Sound Blip**: High, melodic pan-flute chime (`520 Hz - 680 Hz`).
- **Dialogue Script**:
  - *Initial Greeting*:
    1. "Hoo-hoo... Greetings, spirit of the dawn. The wind whispers tales of your courage."
    2. "Beyond our boughs lies the roaring Windy Chasm. Without the Wind Glide ability, the abyss will claim any leap."
    3. "Seek the dandelion shrine at the canopy's highest peak, and let the gentle updrafts be your wings."
  - *Secret Shrine Clue*:
    1. "The oldest roots remember what stone forgets... Seek the wall where crystal water meets silent root, and dash without fear."

---

## 5. Enemies, Hazards & Health System

Grove Odyssey features non-violent, evasion-centric hazard design. Enemies are magical forest spirits or armored bugs that act as dynamic obstacles.

```
       [ Bramble Slime ]              [ Shadow Wisp ]             [ Thorn Beetle ]
       (Ground Patrol Blob)         (Sinusoidal Aerial Moth)    (Armored Wall/Floor Charger)
```

### Enemy Archetypes

| Enemy Type | Primary Zones | Movement & AI Pattern | Interaction & Defense |
| :--- | :--- | :--- | :--- |
| **Bramble Slime** | Mossy Caverns, Sunken Roots | Patrols platforms at `70 px/s`. Pauses and squashes at platform edges before turning. Periodically hops `40px` high. | Evasion / jump over. Can be safely dashed through with Leaf Dash. Contact deals 1 Heart damage. |
| **Shadow Wisp** | Sunlit Canopy, Windy Chasm | Hovers in air, undulating smoothly along a vertical sine wave ($y = y_0 + 35\sin(2.2t)$). Emits purple sparks. | Aerial obstacle requiring timed jumps and glides. Leaf Dash slices through without taking damage. |
| **Thorn Beetle** | Crystal Grotto, Sunken Roots | Crawls on floor or walls. When player is in direct line of sight within 160px, revs up spikes for 0.4s and charges at `280 px/s`. | Jump over during charge, or dash through with Leaf Dash. Armored from direct frontal collision. |

### Health, Damage & Invulnerability (i-Frames)
- **Health Pool**: 3 Glowing Forest Hearts (displayed in the top-left HUD).
- **Damage Taken**: 1 Heart per hazard collision.
- **Knockback**: Instant impulse of `180 px/s` horizontal (away from hazard) and `240 px/s` upward for `0.2s`.
- **Invulnerability Frames (i-Frames)**: `1.4 seconds` of damage immunity; Lumi's sprite rapidly flickers with golden translucency.
- **Pit / Spike Fall**: If Lumi falls into deep thorn briars or bottomless pit hazards, Lumi fades to black and respawns safely at the last solid ground edge with 1 heart deducted.
- **Waystone Restoration**: Touching any activated Waystone instantly refills all 3 Hearts to max.

---

## 6. Ancient Sun Seeds, Checkpoints & Progression Architecture

### The 8 Ancient Sun Seeds

```
[Seed 1: Heart Grove]   ──➔ [Seed 2: Mossy Caverns] ──➔ [Seed 3: Crystal Grotto]
      (Basic Jump)                 (Double Jump)                 (Ledge Timing)
                                                                       │
[Seed 6: Sunken Roots]  ◀── [Seed 5: Sunlit Canopy]  ◀── [Seed 4: Crystal Wall]
 (Thorn Dash Maze)                 (Canopy Climb)               (Leaf Dash Break)
         │
         ▼
[Seed 7: Windy Chasm]   ──➔ [Seed 8: Secret Elder Shrine] ──➔ [GREAT TREE BLOOM]
    (Thermal Glide)              (Multi-Ability Master)              (Victory Climax)
```

| # | Sun Seed Name | Location / Zone | Puzzle / Acquisition Requirement |
| :-: | :--- | :--- | :--- |
| **1** | **Sprout Seed of the Grove** | Heart Grove | Basic platforming on the high root branch above Barnaby. |
| **2** | **Spore Seed of Caverns** | Mossy Caverns | Upper cavern chamber requiring **Feather Jump** across bouncy mushrooms. |
| **3** | **Glimmer Seed of Quartz** | Crystal Grotto | Stalactite hopping section over crystal spike pools. |
| **4** | **Prism Seed of the Vault** | Crystal Grotto | Sealed behind a brittle crystal barrier; requires **Leaf Dash** to shatter. |
| **5** | **Solar Seed of Canopy** | Sunlit Canopy | Apex of the highest cedar branch; requires Double Jump and branch hopping. |
| **6** | **Deep Seed of Ancient Roots**| Sunken Roots | Deep underground thorn corridor; requires combining Leaf Dash and Feather Jump. |
| **7** | **Zephyr Seed of the Chasm** | Windy Chasm | Floating high above the yawning canyon; requires **Wind Glide** on thermal winds. |
| **8** | **Dawn Seed of the Elder** | Secret Elder Shrine | Hidden behind illusory false root-wall; pinnacle challenge requiring all 3 abilities. |

### Ancient Waystone Checkpoints
Three ancient standing monoliths act as fast travel / respawn anchors throughout the grove:
1. **Heart Tree Waystone** (Heart Grove - Central Hub)
2. **Luminescent Waystone** (Crystal Grotto - Deep East)
3. **Zephyr Waystone** (Windy Chasm - North East Highlands)

- **Interaction**: Approaching and pressing `E` / interacting lights up the runes with radiant cyan fire, chimes a soothing chord, heals Lumi to 3 Hearts, and registers the current respawn position.

---

## 7. Gameplay Progression Beats

```mermaid
journey
    title Lumi's Journey in Grove Odyssey
    section Act I - The Awakening
      Awaken at Great Tree: 5: Lumi
      Meet Barnaby the Snail: 5: Lumi, Barnaby
      Collect Seed #1 (Heart Grove): 4: Lumi
      Enter Mossy Caverns: 4: Lumi
      Meet Bramble the Hedgehog: 4: Lumi, Bramble
      Unlock Feather Jump (Double Jump): 5: Lumi
      Collect Seed #2 (Spore Blossom): 5: Lumi
    section Act II - The Grotto & Canopy
      Enter Crystal Grotto: 4: Lumi
      Activate Waystone #2: 5: Lumi
      Collect Seed #3 (Glimmer Shard): 4: Lumi
      Unlock Leaf Dash (Break Walls): 5: Lumi
      Shatter Crystal Wall for Seed #4: 5: Lumi
      Ascend to Sunlit Canopy: 4: Lumi
      Meet Pip the Owl: 5: Lumi, Pip
      Unlock Wind Glide (Parachute): 5: Lumi
      Collect Seed #5 (Canopy Apex): 5: Lumi
    section Act III - Mastery & Secret
      Brave Windy Chasm with Wind Glide: 5: Lumi
      Activate Waystone #3: 5: Lumi
      Collect Seed #7 (Zephyr Star): 5: Lumi
      Delve into Sunken Roots: 4: Lumi
      Dash through Thorns for Seed #6: 5: Lumi
      Discover False Wall to Secret Shrine: 5: Lumi
      Conquer Trial for Seed #8 (Dawn Seed): 5: Lumi
    section Act IV - The Great Bloom Climax
      Return to Heart Grove: 5: Lumi, Barnaby
      Restore 8 Seeds to Great Elder Tree: 5: Lumi
      Grand Bioluminescent Bloom Finale: 5: Lumi, Barnaby, Bramble, Pip
```

### Beat Breakdown:
1. **Beat 1: Awakening & Teaching (Intro)**: Lumi awakens in Heart Grove. Barnaby explains the plight. Player masters horizontal movement, jumping, and collects Seed #1.
2. **Beat 2: First Challenge (Mossy Caverns)**: West passage opens into Mossy Caverns. Dodge Bramble Slimes, meet Bramble the Hedgehog.
3. **Beat 3: First Ability Upgrade**: Reach the Feather Shrine, unlock **Double Jump**. Use new vertical reach to claim Seed #2 and return to the hub.
4. **Beat 4: Eastward Expansion (Crystal Grotto)**: Double Jump allows scaling the East ledge to Crystal Grotto. Activate Waystone #2. Dodge charging Thorn Beetles and claim Seed #3.
5. **Beat 5: Second Ability Upgrade**: Reach the Leaf Dash Shrine, unlock **Leaf Dash**. Dash through crystal barricades to claim Seed #4.
6. **Beat 6: Skyward Ascent (Sunlit Canopy)**: Double jump into the high northern Canopy. Meet Pip the Owl. Ascend to the Wind Glide Shrine and unlock **Wind Glide**. Snatch Seed #5.
7. **Beat 7: The Highland Winds (Windy Chasm)**: Glide across massive air chasms, ride thermal updrafts, activate Waystone #3, and grab Seed #7.
8. **Beat 8: The Subterranean Maze (Sunken Roots)**: Descend into deep root caverns using Leaf Dash to bypass thorn traps. Claim Seed #6.
9. **Beat 9: The Hidden Sanctum (Secret Elder Shrine)**: Notice illusory shimmer in the wall. Dash through false rock into Zone 7. Complete multi-ability puzzle to claim Seed #8.
10. **Beat 10: Climax (The Great Bloom)**: Return with 8/8 Seeds to the Great Elder Tree in Heart Grove. Interact with the tree: radiant golden bloom fills the screen, celebratory animal fanfare plays, all animals gather, and end-game exploration stats (Time, Seeds, Secrets Found) are displayed.

---

## 8. Controls & UI/UX Layout

### Keyboard / Desktop Controls
- `A` / `D` or `ArrowLeft` / `ArrowRight`: Move Left / Right
- `Space` / `W` / `ArrowUp`: Jump / Double Jump (Hold in mid-air to Wind Glide)
- `Shift` / `J` / `X`: Leaf Dash
- `E` / `Enter` / `ArrowDown`: Interact (Talk to NPCs, Activate Waystones, Enter Shrines)
- `Escape` / `P`: Pause Menu & World Map Guide

### Mobile / Touch Layout
- **Left Virtual D-Pad / Joypad**: Smooth horizontal steering.
- **Jump Button (A)**: Tap to Jump/Double Jump; Hold for Wind Glide.
- **Dash Button (B)**: Quick tap for Leaf Dash.
- **Interact Button (E)**: Context-sensitive button that lights up when near NPCs or Waystones.

### HUD Elements
```
┌────────────────────────────────────────────────────────┐
│ [♥][♥][♥]        ☀️ SEEDS: 4 / 8        [🕊️][🍃][🪂]   │
│ (Health)                                (Abilities)   │
│                                                        │
│                                                        │
│                                                        │
│            [ AREA BANNER: SUNLIT CANOPY ]              │
└────────────────────────────────────────────────────────┘
```
1. **Health (Top-Left)**: 3 glowing heart bulbs. Empty hearts turn translucent charcoal.
2. **Seed Tracker (Top-Center)**: Golden Sun icon with clean counter (`X / 8`).
3. **Abilities Badges (Top-Right)**: Mini badges for Feather Jump (Wing), Leaf Dash (Leaf Spark), and Wind Glide (Dandelion).
4. **Zone Name Banner**: Gentle 2-second slide-in banner on room transitions ("Heart Grove", "Mossy Caverns", etc.).

---

## 9. Polish, Juice & Audio Synthesis (Web Audio API)

### Visual Juice
- **Character Squash & Stretch**:
  - Jump launch: `Scale(0.8, 1.25)`
  - Landing impact: `Scale(1.3, 0.7)` with soft return ease.
  - Dash burst: `Scale(1.4, 0.65)` with glowing horizontal streak.
- **Particle Systems**:
  - Ambient glowing fireflies drifting in background layers.
  - Spore bursts on mushroom bounces.
  - Crystalline spark showers on dash wall impacts.
  - Golden leaf confetti on Sun Seed pickups and Great Tree bloom.
- **Dynamic Lighting**:
  - Radial gradient bioluminescent spotlight following Lumi.
  - Waystones and shrines cast pulsating teal/amber glow in caves.

### Web Audio Sound Effects (Zero External Audio Dependencies)
1. **Jump**: Melodic rising chirp (`400 Hz -> 650 Hz` sine sweep, 0.12s).
2. **Double Jump**: Fluttery dual harmonic chirp (`550 Hz -> 880 Hz` triangle sweep, 0.15s).
3. **Leaf Dash**: Crisp wind whoosh with soft white-noise bandpass sweep (`800 Hz -> 2400 Hz`, 0.22s).
4. **Wind Glide**: Gentle ambient wind hum with low-pass flutter (`320 Hz`, sustained while held).
5. **NPC Dialogue Blips**: Distinct procedural synth blips per character (Barnaby: low warm tone; Bramble: crisp click; Pip: high airy whistle).
6. **Seed Pickup**: Glorious 4-note ascending major arpeggio chime ($C_5 \rightarrow E_5 \rightarrow G_5 \rightarrow C_6$).
7. **Waystone Activation**: Resonant cathedral chord with long warm decay.
8. **Damage Hit**: Soft wooden thud + chromatic slide down with subtle screen shake.
9. **Great Tree Bloom Fanfare**: Uplifting procedural victory melody with rich arpeggiated chords.
