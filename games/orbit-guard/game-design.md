# Game Design Document: Orbit Guard

## 1. High Concept & Fantasy
**Orbit Guard** is a mobile-first, high-octane circular arena merge tower defense auto-battler. In the dying light of a stellar sector, players defend the ancient planetary **Nexus Core** aboard the *Celestial Aegis* orbital defense platform. 

Swarming hordes of cosmic void entities spiral along concentric orbital tracks toward the core. Players deploy, position, and merge defense sentinels on a rotating inner orbital ring to unleash devastating elemental firepower, freeze clusters, detonate explosive mortar shells, arc chain lightning, and execute bosses with precision critical strikes.

```
                         [ VOID SWARM SPAWN CORRIDORS ]
                                      │
                                      ▼
                        ╔═══════════════════════════╗
                        ║   OUTER ORBIT TRACK (R3)  ║
                        ║  ┌─────────────────────┐  ║
                        ║  │ MID ORBIT TRACK (R2)│  ║
                        ║  │  ┌───────────────┐  │  ║
                        ║  │  │ DEFENSE RING  │  │  ║
                        ║  │  │  ┌─────────┐  │  ║  ║
                        ║  │  │  │  NEXUS  │  │  ║  ║
                        ║  │  │  │  CORE   │  │  ║  ║
                        ║  │  │  └─────────┘  │  ║  ║
                        ║  │  │ (10 SLOTS)    │  │  ║
                        ║  │  └───────────────┘  │  ║
                        ║  └─────────────────────┘  ║
                        ╚═══════════════════════════╝
```

---

## 2. Circular Arena Topology & Coordinate Mathematics

### 2.1 Polar Geometry & Arena Radiuses
The battlefield is centered at $(x_c, y_c) = (W/2, H/2 - 30\text{px})$ to leave comfortable space for the bottom merge bench and HUD.

| Arena Element | Radius ($r$) | Description |
| :--- | :---: | :--- |
| **Nexus Core** | $r_0 = 42\text{px}$ | Central planetary generator. Has HP pool (100 HP base). Emits glow aura. |
| **Defense Orbit Ring** | $r_d = 100\text{px}$ | Placement ring with **10 discrete orbital sentinel slots** spaced evenly at $\Delta \theta = 36^\circ$ ($2\pi/10$). |
| **Inner Hazard Orbit** | $r_1 = 150\text{px}$ | Breach threshold where enemies start direct assaults on the Core. |
| **Mid Orbit Track** | $r_2 = 210\text{px}$ | Primary combat engagement track where most crowd control occurs. |
| **Outer Spawn Orbit** | $r_3 = 270\text{px}$ | Initial incursion orbit where void portals spawn incoming waves. |
| **Standby Bench** | Bottom HUD | **4 linear bench slots** for storing summoned or newly merged units. |

### 2.2 Mathematical Transformation Formulas
Enemy positions are tracked in polar coordinates $(r(t), \theta(t))$ and mapped to Cartesian screen space $(x, y)$:
$$x(t) = x_c + r(t) \cdot \cos(\theta(t))$$
$$y(t) = y_c + r(t) \cdot \sin(\theta(t))$$

Enemies travel along the orbital track with angular velocity $\omega = \frac{d\theta}{dt}$ ($\text{rad/s}$) while inward spiral drift pulls them toward the core:
$$\frac{d\theta}{dt} = \omega(t)$$
$$\frac{dr}{dt} = -v_{spiral} = -\frac{r_3 - r_0}{T_{orbit}}$$
where $T_{orbit}$ is the time required for a full spiral loop (typically 12 to 25 seconds).

### 2.3 Sentinel Angular Firing Arc
Each sentinel on slot $i$ has fixed polar coordinates $(r_d, \theta_i = i \cdot \frac{2\pi}{10})$. Projectiles fire toward target enemy $(x_e, y_e)$ with linear velocity $\vec{v}_{proj} = v_p \cdot \frac{\vec{r}_e - \vec{r}_s}{\|\vec{r}_e - \vec{r}_s\|}$.

---

## 3. Kinematics, Targeting & Projectile Physics

| Parameter | Unit / Value | Description |
|---|:---:|---|
| **Projectile Base Speed** ($v_p$) | $450\text{--}700\text{ px/s}$ | Snappy ballistic laser / shell flight speed |
| **Heavy Mortar Arc Flight Time** | $0.45\text{s}$ fixed | Parabolic ballistic arc with animated shadow scaling |
| **Chain Lightning Jump Delay** | $0.06\text{s}$ | Instantaneous visual arc with sequential damage ticks |
| **Drag-and-Drop Magnetic Snap** | $45\text{px}$ radius | Snaps sentinel to nearest orbit slot or bench slot |
| **Sentinel Rotate Tracking Speed** | $720^\circ/\text{s}$ | Rapid turret alignment to tracking targets |
| **Core Shockwave Speed** | $800\text{ px/s}$ | Radial expansion rate during Overcharge Surge |

---

## 4. Troop Archetypes & Merge Evolution Tree

There are **5 distinct troop archetypes**. Summoning a troop produces a random archetype at **Tier 1**. Combining two identical same-tier troops produces the next higher tier.

```
[ Tier 1: Recruit ] ──(Merge x2)──► [ Tier 2: Elite ] ──(Merge x2)──► [ Tier 3: Master ]
                                                                             │
[ Tier 6: Ascended ] ◄──(Merge x2)── [ Tier 5: Apex ] ◄──(Merge x2)── [ Tier 4: Grandmaster ]
```

### 4.1 Archetype Stat Specifications

#### 1. Ballista Archer (Railgun Sentry)
- **Visual**: Sleek cyan-blue dual kinetic rail with energy coils.
- **Damage Type**: Kinetic / Single Target / High Cadence.
- **Targeting Heuristic**: Furthest along orbit (closest to Nexus Core).
- **Stat Progression**:
  - *Tier 1*: DPS 28.8 (Dmg 18, Rate 1.6/s, Range 240px)
  - *Tier 2*: DPS 64.8 (Dmg 36, Rate 1.8/s, Range 255px)
  - *Tier 3*: DPS 147.0 (Dmg 70, Rate 2.1/s, Range 270px) + *Pierces 1 target*
  - *Tier 4*: DPS 331.2 (Dmg 138, Rate 2.4/s, Range 285px) + *Pierces 2 targets, $+50\%$ vs Sprinters*
  - *Tier 5*: DPS 748.8 (Dmg 288, Rate 2.6/s, Range 300px) + *Pierces 3 targets, Hyper Beam*
  - *Tier 6*: DPS 1728.0 (Dmg 576, Rate 3.0/s, Range 320px) + *Ascended Rail: Fires continuous orbital piercing beam*

#### 2. Heavy Cannon (Plasma Mortar)
- **Visual**: Heavy ruby-red armored mortar with glowing magma barrel.
- **Damage Type**: Explosive / AOE Splash / Slow Cadence.
- **Targeting Heuristic**: Dense center-of-mass of enemy clusters.
- **Stat Progression**:
  - *Tier 1*: DPS 27.0 (Dmg 45, Rate 0.6/s, Range 200px, Splash 65px)
  - *Tier 2*: DPS 60.8 (Dmg 95, Rate 0.64/s, Range 215px, Splash 75px)
  - *Tier 3*: DPS 137.7 (Dmg 200, Rate 0.68/s, Range 230px, Splash 85px) + *Leaves Plasma Burn (20% DPS for 2s)*
  - *Tier 4*: DPS 310.5 (Dmg 414, Rate 0.75/s, Range 245px, Splash 95px) + *Burn deals 40% DPS and slows by 20%*
  - *Tier 5*: DPS 702.0 (Dmg 877, Rate 0.8/s, Range 260px, Splash 110px) + *Cluster Shells: Spawns 3 mini-bomblets*
  - *Tier 6*: DPS 1620.0 (Dmg 1800, Rate 0.9/s, Range 280px, Splash 130px) + *Ascended Nova: Screen-shaking thermonuclear craters*

#### 3. Arcane Mage (Tesla Caster)
- **Visual**: Purple amethyst crystal floating atop a golden magnetic pedestal.
- **Damage Type**: Energy / Multi-Target Chain Lightning.
- **Targeting Heuristic**: Highest HP enemy within range (bounces to nearest adjacent).
- **Stat Progression**:
  - *Tier 1*: DPS 24.2 (Dmg 22, Rate 1.1/s, Range 170px, Chains 3 targets)
  - *Tier 2*: DPS 54.5 (Dmg 45, Rate 1.21/s, Range 185px, Chains 4 targets)
  - *Tier 3*: DPS 123.4 (Dmg 95, Rate 1.3/s, Range 200px, Chains 5 targets) + *Shock Stun: 0.25s micro-stun*
  - *Tier 4*: DPS 278.3 (Dmg 192, Rate 1.45/s, Range 215px, Chains 6 targets) + *Overload: Chains deal 100% damage to all targets*
  - *Tier 5*: DPS 629.2 (Dmg 393, Rate 1.6/s, Range 230px, Chains 8 targets) + *Arcane Static: Shocked enemies explode on death*
  - *Tier 6*: DPS 1452.0 (Dmg 806, Rate 1.8/s, Range 250px, Chains 10 targets) + *Ascended Storm: Continuous tempest arcing to all enemies in range*

#### 4. Frost Warden (Cryo Emitter)
- **Visual**: Cyan-white hexagonal crystalline prism emitting frost vapor.
- **Damage Type**: Cryo / Continuous $360^\circ$ Aura & Slow Debuff.
- **Targeting Heuristic**: Omnidirectional $360^\circ$ pulse.
- **Stat Progression**:
  - *Tier 1*: DPS 8.0 (Dmg 8/s, Rate Continuous, Range 140px, Slow 35%)
  - *Tier 2*: DPS 18.0 (Dmg 18/s, Rate Continuous, Range 155px, Slow 42%)
  - *Tier 3*: DPS 40.8 (Dmg 40/s, Rate Continuous, Range 170px, Slow 50%) + *Deep Chill: Slow lasts 2s after leaving aura*
  - *Tier 4*: DPS 92.0 (Dmg 92/s, Rate Continuous, Range 185px, Slow 58%) + *Brittle: Chilled enemies take +25% damage from all allies*
  - *Tier 5*: DPS 208.0 (Dmg 208/s, Rate Continuous, Range 200px, Slow 65%) + *Flash Freeze: Periodic 1.0s total freeze wave every 8s*
  - *Tier 6*: DPS 480.0 (Dmg 480/s, Rate Continuous, Range 220px, Slow 75%) + *Ascended Blizzard: Entire arena is chilled, frozen enemies shatter for 200 damage*

#### 5. Shadow Assassin (Void Ripper)
- **Visual**: Sleek dark-violet twin bladed chakrams spinning with crimson edge trails.
- **Damage Type**: Void Melee Burst / Critical Multiplier.
- **Targeting Heuristic**: Closest enemy within short perimeter (leaks / tanks).
- **Stat Progression**:
  - *Tier 1*: DPS 70.4 (Dmg 32, Rate 2.2/s, Range 100px, Crit 25%, Crit Mult $3.0\times$)
  - *Tier 2*: DPS 158.4 (Dmg 66, Rate 2.4/s, Range 115px, Crit 30%, Crit Mult $3.2\times$)
  - *Tier 3*: DPS 358.8 (Dmg 138, Rate 2.6/s, Range 130px, Crit 35%, Crit Mult $3.5\times$) + *Armor Shred: Ignores 50% enemy armor*
  - *Tier 4*: DPS 810.0 (Dmg 289, Rate 2.8/s, Range 145px, Crit 45%, Crit Mult $4.0\times$) + *Shadow Dash: Strikes 2 closest enemies simultaneously*
  - *Tier 5*: DPS 1830.0 (Dmg 610, Rate 3.0/s, Range 160px, Crit 55%, Crit Mult $4.5\times$) + *Execute: Instantly kills non-boss enemies below 15% HP*
  - *Tier 6*: DPS 4224.0 (Dmg 1280, Rate 3.3/s, Range 180px, Crit 70%, Crit Mult $5.0\times$) + *Ascended Void Blade: Whirlwind vortex slicing all enemies within perimeter*

---

## 5. Enemy Archetypes & Wave Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           5 ENEMY ARCHETYPES                                │
├─────────────────┬──────────────┬──────────────┬──────────────┬──────────────┤
│ 1. VOID CRAWLER │ 2. SWIFT DART│ 3. BRUISER   │ 4. SWARM POD │ 5. SLINGER   │
│ Standard Walker │ High-Speed   │ Armored Tank │ Carrier Split│ Outer Ranged │
│ 65°/s, Med HP   │ 140°/s, Low  │ 35°/s, Armor │ 55°/s, Mites │ Halts & Shoots│
└─────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

### 5.1 Enemy Balance Table (Base Wave 1 Stats)

| Enemy Archetype | Base HP | Speed ($\omega$) | Armor | Core Dmg | Gold | Special Trait |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **1. Void Crawler** | 40 | $65^\circ/\text{s}$ | 0% | 10 | 3 | Steady swarm unit, baseline pace. |
| **2. Swift Dart** | 22 | $140^\circ/\text{s}$ | 0% | 8 | 4 | Sprinter; dodges slow artillery if unchilled. |
| **3. Armored Bruiser** | 160 | $35^\circ/\text{s}$ | 40% | 25 | 10 | Reduces kinetic damage by 40%. |
| **4. Swarm Pod** | 75 | $55^\circ/\text{s}$ | 0% | 15 | 8 | On death, splits into 5 Micro-Mites (HP 12, $110^\circ/\text{s}$). |
| **5. Void Slinger** | 90 | $45^\circ/\text{s}$ | 10% | 20 | 12 | Halts every 6s to fire disruptor missile at Core / sentinel. |

### 5.2 Wave Generation & Scaling Algorithm
Each wave $w$ is budgeted a total **Spawn Point Pool** $B(w)$:
$$B(w) = 50 + 25 \cdot w + \lfloor 8 \cdot w^{1.35} \rfloor$$

Enemies are purchased by the wave director using point costs:
- Void Crawler: 10 pts
- Swift Dart: 12 pts
- Armored Bruiser: 35 pts
- Swarm Pod: 30 pts
- Void Slinger: 40 pts

Enemies spawn from 4 randomized outer portal angles ($\theta = 0^\circ, 90^\circ, 180^\circ, 270^\circ$) with staggered spawn intervals of $0.4\text{s} - 1.2\text{s}$.

---

## 6. Boss Encounters (Every 5 Waves)

### 6.1 Wave 5: Iron Colossus (The Shielded Titan)
- **Visual**: Massive dark-iron biomechanical walker with glowing cyan armor plating and revolving shield barrier.
- **Base HP**: $1500 \times (1 + 0.16 \cdot (w-1))^{1.15}$.
- **Speed**: $28^\circ/\text{s}$.
- **Phases & Mechanics**:
  - *Phase 1 (100% - 50% HP)*: **Revolving Shield Arc ($120^\circ$)** rotates around its front, deflecting all kinetic and mortar projectiles. Players must hit it from flanking orbital sentinels.
  - *Phase 2 (50% - 0% HP)*: **Seismic Overdrive**: Shield explodes into shrapnel; Colossus increases speed to $42^\circ/\text{s}$ and stamps the ground every 8 seconds, disabling the 2 closest orbital sentinels for 2.5 seconds.
- **Victory Reward**: +150 Gold + Free Tier 2 Sentinel Drop.

### 6.2 Wave 10: Hydra Queen (The Broodmother)
- **Visual**: Multi-headed serpentine bio-horror with pulsating green venom sacs.
- **Base HP**: $3500 \times (1 + 0.16 \cdot (w-1))^{1.15}$.
- **Speed**: $32^\circ/\text{s}$.
- **Phases & Mechanics**:
  - *Phase 1 (100% - 50% HP)*: **Brood Hatch**: Every 7 seconds, expels 3 Swarm Pods onto adjacent orbits.
  - *Phase 2 (50% - 0% HP)*: **Mitosis Bifurcation**: Queen splits into **Two Hydra Spawns** (each possessing 45% of maximum HP, moving in opposite orbital directions at $50^\circ/\text{s}$). Both must be slain to complete the wave!
- **Victory Reward**: +300 Gold + Permanent Workshop Upgrade: Global Attack Speed $+10\%$.

### 6.3 Wave 15: Chrono Wraith (The Spacetime Phantom)
- **Visual**: Ethereal cosmic phantom shifting between temporal dimensions with purple afterimages.
- **Base HP**: $8000 \times (1 + 0.16 \cdot (w-1))^{1.15}$.
- **Speed**: $40^\circ/\text{s}$.
- **Phases & Mechanics**:
  - *Phase 1 (100% - 50% HP)*: **Phase Blink**: Every 5 seconds, dissolves into ethereal smoke and teleports $75^\circ$ forward along the orbital track, evading all in-flight projectiles.
  - *Phase 2 (50% - 0% HP)*: **Temporal Distortion Field**: Emits a global chronal pulse every 10s that inverts orbital movement direction and slows sentinel fire rates by 35% for 4 seconds.
- **Victory Reward**: +500 Gold + Free Tier 3 Sentinel Drop.

### 6.4 Wave 20+ Infinite Overdrive Escalation
From Wave 20 onward, waves are endless:
- Random double-boss pairings with randomized affixes:
  - *Regenerative*: Heals 2% max HP per second if not burned.
  - *Berserker*: Gains $+1\%$ speed for every $1\%$ HP lost.
  - *Disruptor*: Periodically jams Overcharge Surge.
- Global leaderboard high scores tracked by Highest Wave Reached, Total Gold Earned, and Total Merges Performed.

---

## 7. Economy & Upgrade Systems

### 7.1 Purchase Pricing Curve
Sentinel purchase cost follows the formula:
$$P(n) = \left\lfloor 15 \times (1.18)^n \right\rfloor$$
where $n$ is total units purchased in the current run.

### 7.2 Sell / Recycle Refund
Dragging a sentinel to the "Recycle / Scrap" incinerator zone at the bottom-right refunds **$70\%$** of its cumulative tier gold value, allowing players to pivot compositions or declutter bench space.

### 7.3 Permanent Workshop Upgrades
Players can invest accumulated Meta-Cores / Gold into permanent workshop upgrades:

| Workshop Upgrade | Base Cost | Scaling | Max Level | Effect per Level |
| :--- | :---: | :---: | :---: | :--- |
| **Nexus Hull Integrity** | 100 Gold | $+50\%$ / Lv | Lv 10 | $+20$ Nexus Max HP (Base 100 $\rightarrow$ 300) |
| **Rapid Overclock** | 150 Gold | $+60\%$ / Lv | Lv 10 | $+3\%$ Global Sentinel Attack Speed |
| **Starting Treasury** | 80 Gold | $+40\%$ / Lv | Lv 10 | $+15$ Starting Gold (Base 30 $\rightarrow$ 180) |
| **Hyper-Critical Focus** | 200 Gold | $+75\%$ / Lv | Lv 8 | $+2\%$ Global Crit Chance & $+0.2\times$ Multiplier |
| **Salvage Efficiency** | 120 Gold | $+50\%$ / Lv | Lv 5 | $+4\%$ Gold dropped by all defeated enemies |

---

## 8. Controls & UI/UX Layout

### 8.1 Mobile-First Portrait Screen Layout (Canvas $390\text{px} \times 844\text{px}$ Responsive)

```
┌────────────────────────────────────────────────────────┐
│ [🔊/🔇]  ❤️ 100/100     🌊 WAVE 05/∞     💰 345 GOLD   │
│ ────────────────────────────────────────────────────── │
│                                                        │
│                    [ ORBITAL ARENA ]                   │
│                                                        │
│                     . - ~ ~ ~ - .                      │
│                 .-'       R3      '-.                  │
│               .'          R2         '.                │
│              /            R1           \               │
│             ;         [1][2][3]         ;              │
│            │        [10] (CORE) [4]      │             │
│             ;         [9][8][7]         ;              │
│              \            [6]          /               │
│               '.          [5]        .'                │
│                 '-.               .-'                  │
│                     ' - ~ ~ ~ - '                      │
│                                                        │
│ ────────────────────────────────────────────────────── │
│   STANDBY BENCH:   [Slot 1] [Slot 2] [Slot 3] [Slot 4] │
│ ────────────────────────────────────────────────────── │
│  [ ⚡ OVERCHARGE ]  [ ➕ BUY SENTINEL ]  [ 🔧 REPAIR ] │
│      (Surge)             (💰 34 Gold)        (💰 50)   │
└────────────────────────────────────────────────────────┘
```

### 8.2 Input Mappings & Touch Ergonomics
- **Touch / Drag**:
  - Touch sentinel on orbit slot or bench $\rightarrow$ drag with finger/mouse.
  - Dragging over another identical same-tier sentinel highlights both in radiant gold with merge preview.
  - Release $\rightarrow$ synthesizes higher-tier sentinel with burst particle effect.
  - Dragging to an empty orbit slot repositions unit.
  - Dragging to the bottom-right Scrap icon sells the unit for $70\%$ refund.
- **Desktop / Keyboard Shortcuts**:
  - `Space` / `B`: Buy / Summon Sentinel.
  - `S`: Trigger Overcharge Surge.
  - `R`: Emergency Core Repair.
  - `1` - `4`: Select bench sentinel.
  - `P` / `Escape`: Pause game / Open Workshop.

---

## 9. Audio & Visual Juice Specifications

### 9.1 Visual Juice & Animation Details
- **Merge Impact**:
  - Unit scale squash-and-stretch: `scale(1.4, 0.6)` on touchdown $\rightarrow$ spring to `scale(1.0)`.
  - Radiant shockwave expanding $40\text{px}$ in $0.25\text{s}$.
  - Floating tier badge text with color gradient (`#FFD700` Gold, `#00FFFF` Cyan, `#FF00FF` Magenta).
- **Combat Juice**:
  - Railgun lasers leave fading glowing laser tracer beams (120ms persistence).
  - Heavy Cannon mortar shells arc into the air with radial shadow scaling, exploding into 20 glowing orange ember sparks.
  - Tesla Chain lightning creates jagged procedural line segments vibrating with electric noise.
  - Frost Aura pulses a soft translucent cyan radial mist.
  - Assassin critical strikes trigger a momentary 2-frame micro-freeze (`32ms`) and a screen-shake pulse (`amplitude 3px`).
- **Core Breach Damage**:
  - Nexus Core flashes red with radial distortion rings and alarm siren klaxon.

### 9.2 Procedural Web Audio API Sound Effects (Zero External Assets)
1. **Summon Sentinel**: Ascending metallic pop chord ($300\text{ Hz} \rightarrow 600\text{ Hz}$ sine sweep, 0.12s).
2. **Merge Synthesis**: Dual harmonic crystalline power chord ($C_5 \rightarrow E_5 \rightarrow G_5 \rightarrow C_6$, triangle wave, 0.3s) with reverberant decay.
3. **Ballista Railgun Fire**: High-frequency kinetic zap ($1200\text{ Hz} \rightarrow 200\text{ Hz}$ narrow pulse, 0.08s).
4. **Heavy Cannon Impact**: Low-frequency resonant bass boom ($80\text{ Hz} \rightarrow 30\text{ Hz}$ exponential thud with noise burst, 0.4s).
5. **Arcane Mage Chain Zap**: Electric buzzing sawtooth chirp with rapid pitch oscillation ($440\text{ Hz} \pm 80\text{ Hz}$, 0.15s).
6. **Frost Pulse**: Soft crystalline hiss with high-pass filtered white noise ($2000\text{ Hz}$, 0.25s).
7. **Assassin Crit Strike**: Sharp metallic blade slice followed by deep critical impact tone ($900\text{ Hz} \rightarrow 150\text{ Hz}$, 0.18s).
8. **Gold Coin Drop**: Bright twin chiming bells ($1046\text{ Hz} \rightarrow 1318\text{ Hz}$, 0.09s).
9. **Overcharge Surge**: Deep planetary sub-bass sweep ($50\text{ Hz} \rightarrow 150\text{ Hz} \rightarrow 40\text{ Hz}$, 0.8s) + electric burst.
10. **Boss Alarm Klaxon**: Dual-tone emergency siren ($440\text{ Hz} / 554\text{ Hz}$, 0.6s pulsing).

---

## 10. Win, Loss & Endless High Score Rules

1. **Defeat Condition**:
   - The Nexus Core HP reaches $0$.
   - Defeat screen displays: Wave Reached, Total Enemies Vaporized, Total Merges Completed, Peak DPS Achieved, High Score, and a prominent "Play Again" / "Workshop" button.
2. **Victory Milestone**:
   - Clearing Wave 15 (Chrono Wraith) triggers the **"Orbit Champion"** victory medal and unlocks **Endless Overdrive Mode**.
3. **Endless Overdrive Mode**:
   - Waves 16+ escalate indefinitely with progressive stat scaling and randomized boss modifiers.
   - High scores are saved to local persistent storage (`localStorage.getItem('orbit_guard_highscore')`).
