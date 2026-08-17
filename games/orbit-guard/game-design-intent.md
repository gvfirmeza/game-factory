# Game Design Intent: Orbit Guard

## 1. Core Experience & Emotional Target
**Orbit Guard** delivers a high-tempo, intensely satisfying mobile-first hybrid of drag-and-drop merge synthesis, radial tower defense, and auto-battling tactics. 

The player experiences:
- **Tactile Gratification**: The visceral crunch and visual burst of snapping two identical sentinels together to create a higher-tier unit with glowing particle auras and amplified firepower.
- **Dynamic Spatial Awareness**: Constant visual tension as waves of cosmic void invaders spiral along 360-degree orbital tracks toward the glowing central Nexus Core.
- **Strategic Mastery**: Deliberate economic balance between wide board coverage (multiple lower-tier towers covering diverse angles) versus concentrated power (fewer high-tier ascended units with devastating perks).
- **Adrenaline-Fueled Escalation**: Thrilling clutch moments during Boss Waves and Overdrive Surges where timely merges, base repairs, and freeze triggers save the core with slivers of health remaining.

---

## 2. Core Gameplay Loop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ORBIT GUARD CORE LOOP                             │
│                                                                             │
│   [ START WAVE ]                                                            │
│         │                                                                   │
│         ▼                                                                   │
│   [ ENEMIES SPIRAL ORBITAL TRACKS ] ───► [ TOWERS AUTO-ATTACK & CHILL ]    │
│                                                     │                       │
│                                                     ▼                       │
│   [ BUY TROOPS (P(n) = 15 · 1.18ⁿ) ] ◄─── [ COLLECT GOLD BOUNTIES ]        │
│         │                                                                   │
│         ▼                                                                   │
│   [ DRAG & MERGE SAME-TIER SENTINELS ] ──► [ UNLOCK TIER 2-6+ ASCENSION ]   │
│         │                                                                   │
│         ▼                                                                   │
│   [ STRATEGIC ORBITAL REPOSITIONING ] ──► [ BASE REPAIR & WORKSHOP UPGRADE] │
│         │                                                                   │
│         ▼                                                                   │
│   [ CONQUER BOSS WAVE (EVERY 5 WAVES) ] ──► [ INFINITE OVERDRIVE SCALING ]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Wave Incursion**: Incoming void enemies spawn on the outer perimeter and spiral inwards along concentric orbital paths toward the central Nexus Core.
2. **Auto-Targeting & Combat Engagement**: Deployed sentinels auto-target enemies within their range arcs, applying physical shots, cryogenic slows, area-of-effect plasma bursts, chain lightning, or critical strikes.
3. **Resource Collection**: Defeated enemies pop with gold coins that fly directly into the player's treasury with immediate audio-visual reward feedback.
4. **Acquisition & Synthesis**: The player spends gold to summon new random Level 1 sentinels into orbital slots or the standby bench, then drags identical units together to merge into higher-tier sentinels.
5. **Base Management & Upgrades**: In between and during battle waves, players trigger emergency base repairs, trigger surge abilities, or purchase workshop enhancements.
6. **Boss Climax & Escalation**: Every 5 waves, a massive Titan Boss enters with game-changing mechanics, followed by escalating multi-orbit enemy formations and infinite endless scoring.

---

## 3. Primary Player Verb
**MERGE & STRATEGIC ALLOCATION**

The player's primary, most responsive action is dragging an orbital defense sentinel onto another identical same-tier sentinel on the circular orbit ring or standby bench to instantly merge them into a higher-tier unit. This action is reinforced with:
- Magnetic snapping to orbital placement slots.
- Instant squash-and-stretch unit scale animation (`scale 1.35` -> `1.0`).
- A bright radial particle flash and ascending synth chord chime.
- Real-time stat transformation (DPS, range, and tier-specific visual badges).

Complementary sub-verbs include **Summoning** (tapping the Buy Sentinel button), **Relocating** (repositioning units between orbital angles to respond to approaching clusters), and **Activating Surges** (triggering base overcharge abilities).

---

## 4. Mechanic Purpose Contract

### Mechanic 1: BUY_TROOP (Sentinel Summoning)
- **PURPOSE**: Provides the foundational economic sink, allowing players to translate combat gold into orbital board presence.
- **TEACHING**: At Wave 1, the player starts with 30 gold and an illuminated "Summon Sentinel" button. A glowing cursor highlights the button and the first orbital slot.
- **APPLICATION**: As gold accumulates during waves, players summon Level 1 units into empty orbital ring slots or bench pads. Summon costs scale exponentially: $P(n) = \lfloor 15 \times (1.18)^n \rfloor$.
- **ESCALATION**: When the orbital ring fills up (max 10 active orbit slots + 4 bench slots), players cannot summon more without merging, creating intentional space-pressure and strategic decision-making.
- **MASTERY**: Timing summons during active waves to immediately replenish or cycle archetypes, balancing raw board quantity against upcoming high-tier merge requirements.

### Mechanic 2: MERGE_TROOPS (Unit Synthesis)
- **PURPOSE**: Solves board-space saturation while providing massive exponential power spikes (Tier 1 through Tier 6+ Ascended).
- **TEACHING**: When two identical Level 1 sentinels are on the board, pulsing golden synergy links tether them together, inviting the player to drag one onto the other.
- **APPLICATION**: Merging consumes two identical Level $k$ units of the same archetype to create one Level $k+1$ unit with $\approx 2.25\times$ DPS, expanded range, and upgraded visuals.
- **ESCALATION**: Merging frees up an orbital slot for new summons, but momentarily concentrates firepower into fewer spatial angles. Players must ensure remaining units can cover all orbital approach angles.
- **MASTERY**: "Hot-merging" during active boss fights—merging units at the exact quadrant where a boss or swarm cluster is approaching to immediately trigger higher burst DPS and chain triggers.

### Mechanic 3: AUTO_TARGETING (Smart Radial Fire Control)
- **PURPOSE**: Removes tedious manual micro-targeting in a 360-degree arena, allowing the player to focus 100% on spatial merge strategy and resource management.
- **TEACHING**: Sentinels immediately rotate toward the nearest enemy in their range arc upon wave start and fire distinct glowing projectiles automatically.
- **APPLICATION**: Each archetype utilizes a deterministic priority heuristic:
  - *Ballista Archer*: Targets furthest enemy along orbital progress (fastest threat / closest to breach).
  - *Heavy Cannon*: Targets the dense center-of-mass of enemy clusters.
  - *Arcane Mage*: Targets the highest-HP enemy within chain range to maximize bounce distribution.
  - *Frost Warden*: Omnidirectional $360^\circ$ continuous chilling aura affecting all enemies within radius.
  - *Shadow Assassin*: Targets closest enemy within short-range perimeter to eliminate leak-throughs.
- **ESCALATION**: High-speed Swift Darts and shielded Bosses force players to position Frost Wardens upstream of Heavy Cannons to bunch up fast movers.
- **MASTERY**: Strategic quadrant placement—arranging Frost Wardens at entry arcs to bottleneck enemies into overlapping Heavy Cannon splash and Mage chain kill zones.

### Mechanic 4: BASE_REPAIR_UPGRADE (Nexus Core Maintenance & Workshop)
- **PURPOSE**: Mitigates chip damage taken during difficult waves and provides long-term run progression.
- **TEACHING**: If an enemy breaches the orbital perimeter and damages the Nexus Core, the Core flashes red, the health bar drops, and the Repair button pulses.
- **APPLICATION**: Players can spend gold during or between waves to restore Core HP (e.g., +25% HP for scaling gold cost) or purchase permanent Workshop buffs (Max HP, Global Attack Speed, Starting Gold).
- **ESCALATION**: In later waves (Wave 10+), heavy Bruisers and Void Slingers apply constant pressure, requiring players to weigh investing in emergency repairs versus offensive merges.
- **MASTERY**: Operating at low base HP to greedily invest all gold into high-tier merge milestones before purchasing cost-effective repairs just prior to boss milestones.

### Mechanic 5: WAVE_SURGE (Overcharge Ability)
- **PURPOSE**: High-impact panic button that gives players tactical agency during overwhelming swarm emergencies.
- **TEACHING**: Unlocked at Wave 3 with a dedicated recharge meter that fills as enemies are defeated.
- **APPLICATION**: Tapping the Overcharge button releases a massive planetary shockwave from the Nexus Core, pushing all orbital enemies back along their tracks by $90^\circ$ and stunning them for 2.0 seconds while boosting all sentinel attack speeds by 50% for 5 seconds.
- **ESCALATION**: 45-second cooldown ensures it cannot be spammed, demanding thoughtful timing during Boss enrage phases or multi-pod ruptures.
- **MASTERY**: Triggering Surge right as a Swarm Pod ruptures into mini-mites within a Heavy Cannon's line of fire, wiping out dozens of enemies instantly for a massive gold windfall.

---

## 5. Player Learning Progression

### First 30 Seconds: The Hook
- Player starts with Nexus Core at center of screen, 2 orbital placement slots filled with glowing Level 1 Ballista Archers, and 30 starting gold.
- Wave 1 auto-starts: 4 slow Void Crawlers spiral along the outer orbit.
- Sentinels automatically fire radiant lasers, destroying Crawlers and showering the screen in gold coins.
- Gold counter hits 30+; the "Summon Sentinel" button pulses. Player taps it, summoning a third Level 1 Ballista Archer.
- Two identical Ballistas glow with a connecting beam: player drags one onto the other.
- **BAM!** Tier 2 Twin-Ballista emerges with a satisfying audio chime and twin laser barrels!

### First 5 Minutes: Tactical Diversification & First Boss
- Waves 2 to 4 introduce Swift Darts (fast sprinters) and Armored Bruisers.
- Player discovers new archetypes from summons: Frost Warden (slows down Swift Darts) and Heavy Cannon (wipes out clusters).
- Player learns to place Frost Wardens near enemy spawn vectors so that Heavy Cannons and Arcane Mages land maximum splash damage.
- **Wave 5 Boss Encounter: Iron Colossus**:
  - The massive armored titan enters with heavy metallic thuds.
  - Iron Colossus deploys rotating shields; player hot-merges a Level 3 Heavy Cannon to break through its shield threshold and claims a massive gold chest reward.

### End Game (Wave 15+ & Endless Mode): Mastery & High-Tier Synergy
- Player manages a full 10-slot orbital perimeter with Tier 4, Tier 5, and Tier 6 Ascended sentinels.
- Complex mixed waves featuring Swarm Pods, Void Slingers, and Chrono Wraiths teleporting past frontline defenses.
- Player must dynamically relocate Shadow Assassins to the inner ring to assassinate teleporting wraiths, while coordinating Overcharge Surges to survive infinite overdrive scaling.

---

## 6. Troop Archetypes Specification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            5 TROOP ARCHETYPES                               │
├───────────────────┬──────────────┬─────────────┬──────────────┬─────────────┤
│ 1. BALLISTA       │ 2. CANNON    │ 3. MAGE     │ 4. FROST     │ 5. ASSASSIN │
│ Single Long-Range │ AOE Splash   │ Chain Tesla │ 360° Slow    │ Close Burst │
│ Rapid Sniper      │ Slow Cadence │ Multi-Target│ Crowd Control│ 3x Crit     │
└───────────────────┴──────────────┴─────────────┴──────────────┴─────────────┘
```

1. **Ballista Archer (Railgun Sentry)**:
   - *Role*: Long-range sniper & line-piercer.
   - *Base Stats (Lv 1)*: Range 240px, Damage 18, Attack Rate 1.6/s, Splash 0px.
   - *Special*: Shots pierce 1 target at Tier 3+; deals 150% damage to high-speed targets.
2. **Heavy Cannon (Plasma Mortar)**:
   - *Role*: Long-range heavy artillery & cluster destroyer.
   - *Base Stats (Lv 1)*: Range 200px, Damage 45, Attack Rate 0.6/s, Splash 65px radius.
   - *Special*: Leaves a burning plasma pool dealing 20% residual burn damage over 2s at Tier 3+.
3. **Arcane Mage (Tesla Caster)**:
   - *Role*: Mid-range multi-target chain lightning.
   - *Base Stats (Lv 1)*: Range 170px, Damage 22, Attack Rate 1.1/s, Chain Count 3 targets.
   - *Special*: Chain jumps jump up to 5 targets at Tier 4+ with zero damage falloff.
4. **Frost Warden (Cryo Emitter)**:
   - *Role*: Omnidirectional crowd control & velocity debuff.
   - *Base Stats (Lv 1)*: Range 140px, Damage 8/s aura, Slow Effect 35% movement reduction, Radius $360^\circ$.
   - *Special*: Slow increased to 55% at Tier 3+; frozen enemies shattered by Cannon/Assassin take 25% bonus damage.
5. **Shadow Assassin (Void Ripper)**:
   - *Role*: Short-range inner perimeter shredder & boss executioner.
   - *Base Stats (Lv 1)*: Range 100px, Damage 32, Attack Rate 2.2/s, Crit Chance 25%, Crit Multiplier $3.0\times$.
   - *Special*: Crit Chance increases to 50% at Tier 4+; armor-shredding attacks ignore 50% enemy damage reduction.

---

## 7. Enemy Archetypes Specification

1. **Void Crawler (Standard Walker)**:
   - *Behavior*: Moves steadily along the orbital track at $65^\circ/\text{s}$.
   - *Stats (Wave 1)*: HP 40, Damage to Core 10, Gold Reward 3.
   - *Role*: Basic baseline fodder to test core DPS output.
2. **Swift Dart (High-Speed Sprinter)**:
   - *Behavior*: Sprints along the orbital track at $140^\circ/\text{s}$, darting past slow projectiles.
   - *Stats (Wave 1)*: HP 22, Damage to Core 8, Gold Reward 4.
   - *Role*: Forces the player to deploy Frost Wardens or rapid-fire Ballistas.
3. **Armored Bruiser (Heavy Juggernaut)**:
   - *Behavior*: Advances slowly at $35^\circ/\text{s}$; possesses 40% innate physical armor reduction.
   - *Stats (Wave 1)*: HP 160, Damage to Core 25, Gold Reward 10.
   - *Role*: Tests single-target armor-piercing damage and Arcane Mage magic damage.
4. **Swarm Pod (Cluster Carrier)**:
   - *Behavior*: Advances at $55^\circ/\text{s}$. Upon death, ruptures into 5 micro Void Mites (HP 12 each, speed $110^\circ/\text{s}$).
   - *Stats (Wave 1)*: HP 75, Damage to Core 15, Gold Reward 8.
   - *Role*: Punishes pure single-target setups, rewarding Heavy Cannon and Arcane Mage.
5. **Void Slinger (Perimeter Artillery)**:
   - *Behavior*: Enters the outer orbit, halts every 6 seconds to channel a ranged void missile at the Nexus Core or an orbital sentinel (temporarily stunning it for 1.5s).
   - *Stats (Wave 1)*: HP 90, Damage to Core 20, Gold Reward 12.
   - *Role*: Creates active threat from the outer boundary, demanding high-range Ballista focus.

---

## 8. Multi-Phase Boss Encounters (Every 5 Waves)

### Wave 5: Iron Colossus
- **Theme**: Heavy armored mechanical dreadnought.
- **HP Pool**: $1200 \times \text{WaveMultiplier}$.
- **Abilities**:
  - *Directional Energy Barrier*: Rotating kinetic shield that absorbs all frontal projectiles; sentinels must flank from other orbital angles.
  - *Seismic Stomp*: Every 10s, stamps the orbit ring, disabling the 2 nearest sentinels for 2.5 seconds.
- **Reward**: Massive Gold Cache (+150 Gold) + 1 Free Tier 2 Sentinel Drop.

### Wave 10: Hydra Queen
- **Theme**: Biomechanical alien broodmother.
- **HP Pool**: $2800 \times \text{WaveMultiplier}$.
- **Abilities**:
  - *Brood Hatch*: Spawns 3 Swarm Pods every 8 seconds.
  - *Mitosis Split*: Upon reaching 50% HP, divides into two smaller Twin Hydra Spawn (each possessing 40% of original HP and increased speed).
- **Reward**: Master Gold Cache (+300 Gold) + Permanent Global Attack Speed +10%.

### Wave 15: Chrono Wraith
- **Theme**: Dimensional phantom manipulating spacetime.
- **HP Pool**: $6000 \times \text{WaveMultiplier}$.
- **Abilities**:
  - *Phase Blink*: Teleports $75^\circ$ forward along the orbit track every 5s, dodging incoming artillery shells while ethereal.
  - *Time Dilation Field*: Emits a chronal warp field slowing sentinel fire rate in its vicinity by 40%.
- **Reward**: Celestial Gold Cache (+500 Gold) + 1 Tier 3 Sentinel Drop.

### Wave 20+ Infinite Overdrive
- Waves cycle through randomized Boss affixes (Shielded, Berserker, Regenerating, Twin Bosses) with $+25\%$ enemy HP and $+15\%$ gold scaling per wave.

---

## 9. Economy & Scaling Mathematical Formulas

### 1. Sentinel Purchase Price Formula
The gold cost $P(n)$ to purchase the $n$-th sentinel follows a geometric progression:
$$P(n) = \left\lfloor 15 \times (1.18)^n \right\rfloor$$
- $n = 0$: 15 Gold
- $n = 1$: 17 Gold
- $n = 2$: 20 Gold
- $n = 3$: 24 Gold
- $n = 5$: 34 Gold
- $n = 10$: 78 Gold
- $n = 20$: 409 Gold

### 2. Wave Completion Reward Formula
The bonus gold awarded upon clearing wave $w$:
$$R(w) = 25 + 12 \cdot w + \left\lfloor 1.5 \cdot w^{1.2} \right\rfloor$$
- Wave 1: 38 Gold
- Wave 5: 96 Gold (+150 Boss Bonus = 246 Gold)
- Wave 10: 169 Gold (+300 Boss Bonus = 469 Gold)
- Wave 20: 320 Gold

### 3. Enemy Stat Scaling Formula
For wave $w \ge 1$:
$$\text{HP}(w) = \text{BaseHP} \times (1 + 0.16 \cdot (w - 1))^{1.15}$$
$$\text{Speed}(w) = \text{BaseSpeed} \times \min\left(1.8, 1 + 0.025 \cdot (w - 1)\right)$$

### 4. Merge Tier Stat Multipliers
| Merge Tier | Unit Visual Badge | Stat Multiplier (DPS) | Range Bonus | Special Perk |
| :---: | :---: | :---: | :---: | :--- |
| **Tier 1** | Bronze Star (★) | $1.0\times$ | $+0\text{px}$ | Base Archetype attack |
| **Tier 2** | Silver Dual Star (★★) | $2.25\times$ | $+15\text{px}$ | Attack Speed $+15\%$ |
| **Tier 3** | Gold Tri-Star (★★★) | $5.1\times$ | $+30\text{px}$ | Unlocks Primary Archetype Perk |
| **Tier 4** | Platinum Diamond (◆) | $11.5\times$ | $+45\text{px}$ | Unlocks Secondary Perk / Splash $+30\%$ |
| **Tier 5** | Obsidian Crest (❖) | $26.0\times$ | $+60\text{px}$ | Overcharge synergy ($+50\%$ Crit / Pierce) |
| **Tier 6+** | Ascended Celestial (👑) | $60.0\times$ | $+80\text{px}$ | Cosmic Aura: buffs adjacent sentinels $+20\%$ DPS |

---

## 10. Zero Filler Justification
Orbit Guard strictly adheres to the studio's **Zero Filler Content Rule**:
- **No Non-Diegetic NPC Dialogue**: There are no artificial fetch quests or conversational padding. All narrative context is communicated environmental diegesis (stellar backdrop, core state, siren sirens).
- **Pure Focused Strategy**: Every mechanic directly supports the core loop (Summon $\rightarrow$ Merge $\rightarrow$ Defend $\rightarrow$ Upgrade $\rightarrow$ Boss $\rightarrow$ Scale).
- **High Retention Core**: Replayability stems from dynamic RNG summons, strategic board spatial optimization, and high-score endless wave escalation.
