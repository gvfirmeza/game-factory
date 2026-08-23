# Art Direction: Orbit Guard

## 1. Aesthetic Identity & Visual Philosophy

- **Visual Theme**: **Deep Space Cybernetic / Cosmic Aegis** — A high-octane neon sci-fi aesthetic contrasting crisp, hyper-precise celestial defense technology against eldritch, bioluminescent void horrors.
- **Visual Tone & Feeling**: High-contrast, tactile, radiant, and instantly readable. Every sentinel weapon emission, orbital track, and incoming invader pops with luminous emissive energy against the pitch-black and deep nebula void.
- **The Hybrid Visual Pipeline Architecture**:
  Orbit Guard utilizes a **Hybrid Sprite + Procedural Shader Pipeline** combining high-resolution curated Kenney spaceship assets (`games/orbit-guard/source/assets/*.png`) with dynamic HTML5 Canvas 2D procedural rendering formulas:
  1. **Base Sprite Layer**: High-resolution rasterized Kenney space fleet and alien craft sprites rendered with precise anchor pivots (`{x: 0.5, y: 0.5}`), native scaling, and continuous rotational heading tracking.
  2. **Procedural Ascension Shaders**: Dynamic glowing hover sockets, rotating runic rings, metallic tier borders (Bronze, Silver, Gold, Plasma Teal, Void Violet, Celestial Radiant), and pulsating radial gradient aura halos (`ctx.createRadialGradient`).
  3. **Kinematic Shaders & Particle Trails**: Additive laser tracers (`ctx.globalCompositeOperation = 'lighter'`), parabolic ballistic mortar arcs with expanding ember halos, lightning bolt fractal displacement paths, and high-velocity starburst particle bursts.
  4. **Dual Rendering Capability**: Complete support for both Hybrid Sprite rendering (primary) and Pure Procedural Vector fallback rendering with identical visual hierarchies, collision envelopes, and tier progression.
- **Silhouette & Shape Language**:
  - **Sentinels & Planetary Core (Order & Precision)**: Clean geometric volumes, faceted hexagonal armor plates, concentric gold-trimmed rings, sharp 45° aerodynamic bevels, and glowing neon energy coils.
  - **Void Invaders & Bosses (Chaos & Distortion)**: Jagged chitinous silhouettes, multi-jointed insectoid appendages, bulbous pulsating spore sacs, and ethereal spacetime phase distortions.
  - **Merge Ascension Spectrum**: Distinct visual ascension progression from Bronze Recruit (Tier 1) &rarr; Silver Veteran (Tier 2) &rarr; Gold Master (Tier 3) &rarr; Plasma Cyan Overclock (Tier 4) &rarr; Dark Matter Void Champion (Tier 5) &rarr; Ascended Celestial Radiant (Tier 6+).
- **Mobile Readability Optimization**:
  - Engineered for a $450 \times 720$ virtual resolution ($9:16$ portrait mobile screen).
  - Bold, easily distinguishable archetype headpieces and weapon muzzles visible even when scaled down to 32px diameter.
  - Color-coded tier badges and glowing synergy beams indicating valid merge targets across the orbital ring and standby bench.

---

## 2. Master Color Palette System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ORBIT GUARD MASTER PALETTE                        │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│ DEEP NEBULA VOID  │ CYAN ENERGY       │ SOLAR GOLD        │ ARCANE VIOLET   │
│ #060814 / #0D1127 │ #00E5FF / #00F5D4 │ #FFD166 / #FF9E00 │ #C084FC / #A78BFA│
├───────────────────┼───────────────────┼───────────────────┼─────────────────┤
│ CRYO FROST        │ VOID CRIMSON      │ OBSIDIAN ARMOR    │ TITANIUM WHITE  │
│ #38BDF8 / #7DD3FC │ #EF4444 / #F43F5E │ #0F172A / #1E293B │ #E2E8F0 / #FFFFFF│
└───────────────────┴───────────────────┴───────────────────┴─────────────────┘
```

### 2.1 Core Palette Tokens Table

| Token Group | Swatch Hex Codes | Description & Diegetic Application |
| :--- | :--- | :--- |
| **Deep Nebula Void** | `#060814`, `#0D1127`, `#131B38` | Screen background, deep space parallax skybox, abyssal portals |
| **Cyan Shield Energy** | `#00E5FF`, `#00F5D4`, `#06B6D4`, `#0891B2` | Nexus Core shield, Ballista Archer rails, laser sights, UI primary |
| **Solar Gold & Magma** | `#FFD166`, `#FF9E00`, `#F59E0B`, `#EA580C` | Heavy Cannon magma core, gold coins, Tier 3 master trim, merge starbursts |
| **Arcane Violet** | `#C084FC`, `#A855F7`, `#7E22CE`, `#3B0764` | Arcane Mage obelisk, Tesla chain lightning, dark matter vortexes |
| **Cryo Frost** | `#E0F2FE`, `#7DD3FC`, `#38BDF8`, `#0284C7` | Frost Warden snowflake crystal, freezing mist aura, brittle debuff |
| **Void Crimson** | `#EF4444`, `#F43F5E`, `#BE123C`, `#881337` | Shadow Assassin daggers, Invader optic eyes, Core breach damage flash |
| **Obsidian Armor** | `#0F172A`, `#1E293B`, `#334155`, `#475569` | Sentinel chassis, turret platforms, dark iron plating, UI card glass |
| **Titanium Alloy** | `#94A3B8`, `#CBD5E1`, `#F8FAFC`, `#FFFFFF` | Mechanical joints, weapon barrels, catchlight highlights, starfields |

---

### 2.2 Merge Tier Visual Ascension Palette

Every sentinel dynamically upgrades its material shaders, orbital chassis trim, and glowing gem cores as it ascends:

| Merge Tier | Tier Name | Platform Border | Core Gem / Accents | Emission Glow | Aura Radius | Visual Badge | Multiplier |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| **Tier 1** | Bronze Recruit | `#CD7F32` (Bronze) | `#B45309` (Amber) | `rgba(205, 127, 50, 0.35)` | 22px | ★ | 1.0× |
| **Tier 2** | Silver Veteran | `#E2E8F0` (Silver) | `#0284C7` (Cobalt) | `rgba(226, 232, 240, 0.45)` | 24px | ★★ | 2.25× |
| **Tier 3** | Gold Master | `#FFD166` (Solar Gold) | `#F59E0B` (Topaz) | `rgba(255, 209, 102, 0.60)` | 26px | ★★★ | 5.1× |
| **Tier 4** | Plasma Overclock | `#00E5FF` (Neon Cyan) | `#00F5D4` (Teal) | `rgba(0, 229, 255, 0.70)` | 28px | ◆ | 11.5× |
| **Tier 5** | Void Champion | `#C084FC` (Arcane Violet)| `#EC4899` (Magenta) | `rgba(192, 132, 252, 0.80)` | 30px | ❖ | 26.0× |
| **Tier 6+**| Celestial Radiant| `#FFFFFF` (Prismatic) | Prismatic Rainbow | `rgba(255, 255, 255, 0.95)` | 33px | 👑 | 60.0× |

---

### 2.3 JavaScript Palette Constant Definitions

```javascript
export const PALETTE = {
  void: {
    bgDark: '#060814',
    bgMid: '#0D1127',
    bgLight: '#131B38',
    nebulaPurple: 'rgba(126, 34, 206, 0.15)',
    nebulaCyan: 'rgba(0, 229, 255, 0.12)',
    starfield: '#FFFFFF',
    gridLine: 'rgba(56, 189, 248, 0.10)'
  },
  metal: {
    obsidianDark: '#0F172A',
    obsidianMid: '#1E293B',
    obsidianLight: '#334155',
    slate: '#475569',
    titaniumLight: '#CBD5E1',
    titaniumWhite: '#F8FAFC'
  },
  energy: {
    cyan: '#00E5FF',
    cyanBright: '#00F5D4',
    gold: '#FFD166',
    goldOrange: '#FF9E00',
    violet: '#C084FC',
    violetDark: '#7E22CE',
    frost: '#38BDF8',
    frostBright: '#7DD3FC',
    crimson: '#EF4444',
    crimsonBright: '#F43F5E'
  },
  tierAscension: [
    { tier: 1, name: 'Bronze Recruit', border: '#CD7F32', fill: '#78350F', glow: 'rgba(205, 127, 50, 0.35)', badge: '★', multiplier: 1.0, auraRadius: 22 },
    { tier: 2, name: 'Silver Veteran', border: '#E2E8F0', fill: '#475569', glow: 'rgba(226, 232, 240, 0.45)', badge: '★★', multiplier: 2.25, auraRadius: 24 },
    { tier: 3, name: 'Gold Master', border: '#FFD166', fill: '#B45309', glow: 'rgba(255, 209, 102, 0.60)', badge: '★★★', multiplier: 5.1, auraRadius: 26 },
    { tier: 4, name: 'Plasma Overclock', border: '#00E5FF', fill: '#0369A1', glow: 'rgba(0, 229, 255, 0.70)', badge: '◆', multiplier: 11.5, auraRadius: 28 },
    { tier: 5, name: 'Void Champion', border: '#C084FC', fill: '#581C87', glow: 'rgba(192, 132, 252, 0.80)', badge: '❖', multiplier: 26.0, auraRadius: 30 },
    { tier: 6, name: 'Celestial Radiant', border: '#FFFFFF', fill: '#BE185D', glow: 'rgba(255, 255, 255, 0.95)', badge: '👑', multiplier: 60.0, auraRadius: 33 }
  ],
  ui: {
    cardBg: 'rgba(13, 17, 39, 0.85)',
    cardBorder: 'rgba(56, 189, 248, 0.35)',
    cardBorderActive: '#00E5FF',
    textWhite: '#F8FAFC',
    textDim: '#94A3B8',
    goldCoin: '#FFD166',
    hpGreen: '#10B981',
    hpRed: '#EF4444',
    surgeReady: '#00E5FF',
    modalBackdrop: 'rgba(6, 8, 20, 0.85)',
    buttonPrimaryBg: 'linear-gradient(135deg, #00E5FF, #0284C7)',
    buttonSurgeBg: 'linear-gradient(135deg, #FFD166, #EA580C)',
    buttonRepairBg: 'linear-gradient(135deg, #10B981, #059669)',
    benchSlotEmpty: 'rgba(30, 41, 59, 0.50)',
    benchSlotActive: 'rgba(0, 229, 255, 0.20)',
    recycleBin: 'rgba(239, 68, 68, 0.25)',
    synergyLinkBeam: '#FFD166'
  }
};
```

---

## 3. Curated Kenney Asset Catalog & Hybrid Architecture

The visual assets located in `games/orbit-guard/source/assets/` provide high-resolution raster foundation art, curated specifically from the Kenney Space Fleet and Alien packs.

### 3.1 Asset Inventory & Scaling Table

| Asset ID | File Name | Category | Native Dimensions | Render Scale | Render Size | In-Game Archetype & Role |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `sentinel_ballista` | `sentinel_ballista.png` | Sentinel | $99 \times 75$ | 0.42 | $42 \times 32$ | Ballista Archer: Twin-rail kinetic sniper craft |
| `sentinel_cannon` | `sentinel_cannon.png` | Sentinel | $112 \times 75$ | 0.42 | $47 \times 32$ | Heavy Cannon: Reinforced plasma mortar cruiser |
| `sentinel_mage` | `sentinel_mage.png` | Sentinel | $91 \times 91$ | 0.42 | $38 \times 38$ | Arcane Mage: Tesla caster spire frigate |
| `sentinel_frost` | `sentinel_frost.png` | Sentinel | $98 \times 75$ | 0.42 | $41 \times 32$ | Frost Warden: Cryo emitter winged interceptor |
| `sentinel_assassin` | `sentinel_assassin.png` | Sentinel | $93 \times 84$ | 0.42 | $39 \times 35$ | Shadow Assassin: Stealth void ripper fighter |
| `enemy_crawler` | `enemy_crawler.png` | Enemy | $82 \times 84$ | 0.38 | $31 \times 32$ | Void Crawler: Standard melee insectoid scout |
| `enemy_dart` | `enemy_dart.png` | Enemy | $104 \times 84$ | 0.36 | $37 \times 30$ | Swift Dart: High-speed manta sprinter |
| `enemy_bruiser` | `enemy_bruiser.png` | Enemy | $103 \times 84$ | 0.48 | $49 \times 40$ | Armored Bruiser: Heavy chitin tank vanguard |
| `enemy_swarm` | `enemy_swarm.png` | Enemy | $91 \times 91$ | 0.42 | $38 \times 38$ | Swarm Pod: Emerald brood sac carrier |
| `enemy_slinger` | `enemy_slinger.png` | Enemy | $97 \times 84$ | 0.42 | $41 \times 35$ | Void Slinger: Perimeter artillery bio-tripod |
| `boss_colossus` | `boss_colossus.png` | Boss | $103 \times 84$ | 0.85 | $88 \times 71$ | Iron Colossus: Wave 5 Shielded Titan Dreadnought |
| `boss_hydra` | `boss_hydra.png` | Boss | $103 \times 84$ | 0.88 | $91 \times 74$ | Hydra Queen: Wave 10 Broodmother Leviathan |
| `boss_chrono` | `boss_chrono.png` | Boss | $103 \times 84$ | 0.85 | $88 \times 71$ | Chrono Wraith: Wave 15 Spacetime Phantom |
| `laser_blue` | `laser_blue.png` | Projectile | $9 \times 54$ | 0.60 | $5 \times 32$ | Cyan Railgun Kinetic Piercing Beam |
| `laser_red` | `laser_red.png` | Projectile | $9 \times 54$ | 0.60 | $5 \times 32$ | Crimson Assassin Glaive / Enemy Dart Bolt |
| `laser_green` | `laser_green.png` | Projectile | $37 \times 38$ | 0.65 | $24 \times 25$ | Emerald Spore Bomb / Plasma Mortar Burst Core |
| `powerup_star` | `powerup_star.png` | Powerup | $34 \times 33$ | 0.75 | $26 \times 25$ | Ascension Star / Score Multiplier Core Pickup |
| `powerup_shield` | `powerup_shield.png` | Powerup | $34 \times 33$ | 0.75 | $26 \times 25$ | Aegis Matrix / Planetary Shield Recharger |
| `powerup_bolt` | `powerup_bolt.png` | Powerup | $34 \times 33$ | 0.75 | $26 \times 25$ | Overclock Turbo / Rapid Fire Lightning Core |
| `bg_cosmic` | `bg_cosmic.png` | Environment | $256 \times 256$ | 1.00 | $256 \times 256$ | Deep Space Cosmic Nebula Repeating Starfield |

---

### 3.2 Hybrid Rendering Pipeline Specification

```
┌────────────────────────────────────────────────────────────────────────┐
│                     HYBRID RENDERING PIPELINE                          │
├────────────────────────────────────────────────────────────────────────┤
│ 1. PROCEDURAL BACKGROUND & ORBITAL GRIDS                               │
│    - Canvas clear & bg_cosmic.png parallax scrolling tile             │
│    - Procedural starfield twinkling dots (80+ particles)               │
│    - 3 Concentric Orbit Rings (R1=150px, R2=210px, R3=270px)           │
│                                                                        │
│ 2. PROCEDURAL HOVER PLATFORMS & TIER AURA RINGS                        │
│    - Magnetic mounting disc (dark slate #0F172A)                       │
│    - Multi-stop radial tier ascension glow (Bronze to Celestial)       │
│    - Drag / Merge target synergy link beams (ctx.setLineDash)          │
│                                                                        │
│ 3. SPRITE DRAW & KINEMATIC ROTATION                                    │
│    - ctx.translate(x, y) + ctx.rotate(headingAngle)                    │
│    - Recoil kickback offset (-5px along barrel axis)                   │
│    - ctx.drawImage(sprite, -renderW/2, -renderH/2, renderW, renderH)   │
│                                                                        │
│ 4. PROCEDURAL EMISSIVE SHADERS & WEAPON GLOWS                          │
│    - Railgun cyan capacitor coils & laser sight guide                  │
│    - Heavy Cannon magma chamber pulse & muzzle smoke                   │
│    - Arcane Mage rotating runes & electrostatic ion sparks             │
│    - Frost Warden cryo mist particles & gyro snowflake ring            │
│    - Shadow Assassin spinning crimson vibro-chakrams                   │
│                                                                        │
│ 5. HUD OVERLAYS & STATUS INDICATORS                                    │
│    - Floating HP status arcs (Green > Amber > Red)                     │
│    - Tier badge pill (★, ★★, ★★★, ◆, ❖, 👑)                            │
│    - Frozen / Stun / Chilled ice crystal debuff overlays               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Planetary Arena & Celestial Nexus Architecture

```
                                  [ OUTER SPAWN ORBIT R3 = 270px ]
                                                  │
                                                  ▼
                                ╔═══════════════════════════════╗
                                ║    MID COMBAT TRACK R2=210px  ║
                                ║   ┌─────────────────────────┐ ║
                                ║   │  INNER HAZARD R1=150px  │ ║
                                ║   │   ┌─────────────────┐   │ ║
                                ║   │   │ DEFENSE RING    │   │ ║
                                ║   │   │   ┌─────────┐   │   │ ║
                                ║   │   │   │  NEXUS  │   │   │ ║
                                ║   │   │   │  CORE   │   │   │ ║
                                ║   │   │   │ (r=45px)│   │   │ ║
                                ║   │   │   └─────────┘   │   │ ║
                                ║   │   │  (10 SLOTS)     │   │ ║
                                ║   │   └─────────────────┘   │ ║
                                ║   └─────────────────────────┘ ║
                                ╚═══════════════════════════════╝
```

### 4.1 Procedural Nexus Core Renderer (`drawNexusCore`)

The Nexus Core is a pulsating cosmic crystal generator encased within two counter-rotating segmented orbital armor rings. It reflects current HP state and flashes with emergency sirens on breach damage.

```javascript
export function drawNexusCore(ctx, x, y, state = {}) {
  const {
    hpPercent = 1.0,
    animTime = 0,
    isDamaged = false,
    isSurging = false
  } = state;

  ctx.save();
  ctx.translate(x, y);

  // 1. Ambient Cosmic Glow Halo
  const pulseRadius = 55 + Math.sin(animTime * 3) * 6;
  const coreGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, pulseRadius + 20);
  const glowColor = isDamaged 
    ? 'rgba(239, 68, 68, '
    : isSurging 
    ? 'rgba(0, 245, 212, '
    : 'rgba(0, 229, 255, ';
  coreGlow.addColorStop(0, glowColor + '0.65)');
  coreGlow.addColorStop(0.5, glowColor + '0.25)');
  coreGlow.addColorStop(1, glowColor + '0)');
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(0, 0, pulseRadius + 20, 0, Math.PI * 2);
  ctx.fill();

  // 2. Outer Rotating Segmented Armor Ring (Counter-Clockwise)
  ctx.save();
  ctx.rotate(-animTime * 0.4);
  const outerSegments = 6;
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = isDamaged ? '#EF4444' : '#1E293B';
  for (let i = 0; i < outerSegments; i++) {
    const startAngle = (i * Math.PI * 2) / outerSegments + 0.12;
    const endAngle = ((i + 1) * Math.PI * 2) / outerSegments - 0.12;
    ctx.beginPath();
    ctx.arc(0, 0, 44, startAngle, endAngle);
    ctx.stroke();

    // Gold Corner Rivets on Segments
    const midAngle = (startAngle + endAngle) / 2;
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.arc(Math.cos(midAngle) * 44, Math.sin(midAngle) * 44, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Inner Rotating Glyphic Ring (Clockwise)
  ctx.save();
  ctx.rotate(animTime * 0.7);
  const innerSegments = 4;
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#00E5FF';
  for (let i = 0; i < innerSegments; i++) {
    const startAngle = (i * Math.PI * 2) / innerSegments + 0.18;
    const endAngle = ((i + 1) * Math.PI * 2) / innerSegments - 0.18;
    ctx.beginPath();
    ctx.arc(0, 0, 32, startAngle, endAngle);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Central Celestial Crystal Generator (Faceted Diamond/Octagon)
  const crystalGrad = ctx.createRadialGradient(-6, -6, 2, 0, 0, 24);
  if (hpPercent > 0.3) {
    crystalGrad.addColorStop(0, '#FFFFFF');
    crystalGrad.addColorStop(0.3, '#00F5D4');
    crystalGrad.addColorStop(0.7, '#00E5FF');
    crystalGrad.addColorStop(1, '#0891B2');
  } else {
    // Critical HP Alarm Gradient
    crystalGrad.addColorStop(0, '#FEE2E2');
    crystalGrad.addColorStop(0.4, '#F87171');
    crystalGrad.addColorStop(0.8, '#EF4444');
    crystalGrad.addColorStop(1, '#7F1D1D');
  }

  ctx.fillStyle = crystalGrad;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const points = 8;
  const outerR = 22 + Math.sin(animTime * 5) * 1.5;
  const innerR = outerR * 0.78;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Facet Gleam Highlights
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -outerR);
  ctx.lineTo(0, outerR);
  ctx.moveTo(-outerR, 0);
  ctx.lineTo(outerR, 0);
  ctx.stroke();

  // 5. HP Arc Indicator Ring
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.beginPath();
  ctx.arc(0, 0, 49, 0, Math.PI * 2);
  ctx.stroke();

  const hpArcLength = Math.PI * 2 * Math.max(0, Math.min(1, hpPercent));
  ctx.strokeStyle = hpPercent > 0.5 ? '#10B981' : hpPercent > 0.25 ? '#F59E0B' : '#EF4444';
  ctx.beginPath();
  ctx.arc(0, 0, 49, -Math.PI / 2, -Math.PI / 2 + hpArcLength);
  ctx.stroke();

  ctx.restore();
}
```

---

## 5. Sentinel Fleet: Hybrid Sprite + Procedural Shaders Recipes

### 5.1 Sentinel Platform & Tier Ascension Aura Renderer

Every sentinel sits atop a magnetized hover platform that rotates in sync with its firing angle, displaying its ascension rank and glowing range boundary when selected.

```javascript
export function drawSentinelPlatform(ctx, x, y, tier = 1, isSelected = false, isMergeTarget = false) {
  const tierInfo = PALETTE.tierAscension[Math.min(tier - 1, 5)];
  
  ctx.save();
  ctx.translate(x, y);

  // Merge Synergy / Selection Pulsing Halo
  if (isSelected || isMergeTarget) {
    const glowR = (tierInfo.auraRadius || 24) + 6 + Math.sin(Date.now() * 0.008) * 3;
    const selectGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, glowR);
    selectGlow.addColorStop(0, isMergeTarget ? 'rgba(255, 209, 102, 0.6)' : 'rgba(0, 229, 255, 0.6)');
    selectGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = selectGlow;
    ctx.beginPath();
    ctx.arc(0, 0, glowR, 0, Math.PI * 2);
    ctx.fill();
  }

  // Base Magnetic Mounting Disc
  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Tier Glow Inner Circle
  ctx.fillStyle = tierInfo.glow;
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawTierBadge(ctx, x, y, tier = 1) {
  const tierInfo = PALETTE.tierAscension[Math.min(tier - 1, 5)];
  ctx.save();
  ctx.translate(x, y + 16);

  // Badge Pill Backing
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(-14, -6, 28, 12, 6);
  ctx.fill();
  ctx.stroke();

  // Badge Text / Star Icons
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = tierInfo.border;
  ctx.fillText(tierInfo.badge, 0, 0);

  ctx.restore();
}
```

---

### 5.2 Sentinel 1: Ballista Archer (Railgun Sentry)

- **Asset File**: `games/orbit-guard/source/assets/sentinel_ballista.png` ($99 \times 75$, rendered at $42 \times 32$).
- **Hybrid Rendering Formula**: Base sprite rendered with recoil kickback, overlaying procedural cyan magnetic acceleration coils and a dynamic laser targeting sight beam.

```javascript
export function drawBallistaArcherHybrid(ctx, x, y, spriteImg, state = {}) {
  const {
    angle = 0,
    tier = 1,
    recoil = 0,
    charging = 0,
    isSelected = false,
    isMergeTarget = false
  } = state;

  drawSentinelPlatform(ctx, x, y, tier, isSelected, isMergeTarget);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const kick = recoil * 5;

  // 1. Draw Curated Kenney Sprite with Recoil Offset
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -21 - kick, -16, 42, 32);
  } else {
    // Fallback Vector Rendering
    drawBallistaArcherVector(ctx, 0, 0, { angle: 0, tier, recoil, charging });
  }

  // 2. Procedural Cyan Accelerator Coil Glow (Scaled by Tier)
  const coilGlow = ctx.createRadialGradient(8 - kick, 0, 2, 8 - kick, 0, 14);
  coilGlow.addColorStop(0, tier >= 4 ? '#00F5D4' : '#00E5FF');
  coilGlow.addColorStop(1, 'rgba(0, 229, 255, 0)');
  ctx.fillStyle = coilGlow;
  ctx.beginPath();
  ctx.arc(8 - kick, 0, 12, 0, Math.PI * 2);
  ctx.fill();

  // 3. Laser Sight Beam (Dotted Line)
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(18 - kick, 0);
  ctx.lineTo(18 + 90, 0);
  ctx.stroke();
  ctx.setLineDash([]);

  // Recoil / Charging Muzzle Spark
  if (charging > 0.5 || recoil > 0.2) {
    ctx.fillStyle = '#00F5D4';
    ctx.beginPath();
    ctx.arc(18 - kick + 2, 0, 3 + recoil * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  drawTierBadge(ctx, x, y, tier);
}
```

---

### 5.3 Sentinel 2: Heavy Cannon (Plasma Mortar)

- **Asset File**: `games/orbit-guard/source/assets/sentinel_cannon.png` ($112 \times 75$, rendered at $47 \times 32$).
- **Hybrid Rendering Formula**: Heavy armored chassis with an internal orange-hot pulsating magma reactor core, dynamic recoil kick, and smoke puff particles.

```javascript
export function drawHeavyCannonHybrid(ctx, x, y, spriteImg, state = {}) {
  const {
    angle = 0,
    tier = 1,
    recoil = 0,
    animTime = 0,
    isSelected = false,
    isMergeTarget = false
  } = state;

  drawSentinelPlatform(ctx, x, y, tier, isSelected, isMergeTarget);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const kick = recoil * 6;

  // 1. Draw Curated Kenney Sprite
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -23.5 - kick, -16, 47, 32);
  } else {
    drawHeavyCannonVector(ctx, 0, 0, { angle: 0, tier, recoil, animTime });
  }

  // 2. Procedural Magma Core Reaction Glow
  const magmaGlow = ctx.createRadialGradient(-2 - kick, 0, 2, -2 - kick, 0, 10);
  const pulse = Math.sin(animTime * 6) * 0.15;
  magmaGlow.addColorStop(0, '#FFFBEB');
  magmaGlow.addColorStop(0.5, '#FF9E00');
  magmaGlow.addColorStop(1, 'rgba(234, 88, 12, 0)');
  ctx.fillStyle = magmaGlow;
  ctx.beginPath();
  ctx.arc(-2 - kick, 0, 9 + pulse, 0, Math.PI * 2);
  ctx.fill();

  // 3. Heavy Muzzle Flash on Recoil
  if (recoil > 0.15) {
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.arc(20 - kick, 0, 6 * recoil, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  drawTierBadge(ctx, x, y, tier);
}
```

---

### 5.4 Sentinel 3: Arcane Mage (Tesla Caster)

- **Asset File**: `games/orbit-guard/source/assets/sentinel_mage.png` ($91 \times 91$, rendered at $38 \times 38$).
- **Hybrid Rendering Formula**: Crystalline spire frigate hovering with sinusoidal vertical levitation, counter-rotating runic rings, and branching ion sparks.

```javascript
export function drawArcaneMageHybrid(ctx, x, y, spriteImg, state = {}) {
  const {
    angle = 0,
    tier = 1,
    animTime = 0,
    isFiring = false,
    isSelected = false,
    isMergeTarget = false
  } = state;

  drawSentinelPlatform(ctx, x, y, tier, isSelected, isMergeTarget);

  ctx.save();
  ctx.translate(x, y);

  // Floating Levitation Bobbing
  const bobY = Math.sin(animTime * 3) * 2.5;
  ctx.translate(0, bobY);

  // 1. Counter-Rotating Violet Arcane Runic Rings
  ctx.save();
  ctx.rotate(animTime * 0.9);
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 3]);
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 2. Draw Curated Kenney Sprite
  ctx.save();
  ctx.rotate(angle);
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -19, -19, 38, 38);
  } else {
    drawArcaneMageVector(ctx, 0, 0, { angle: 0, tier, animTime, isFiring });
  }
  ctx.restore();

  // 3. Electrostatic Ion Sparks
  if (isFiring || tier >= 3) {
    const sparkCount = 2 + Math.min(tier, 4);
    ctx.strokeStyle = '#F3E8FF';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < sparkCount; i++) {
      const sparkAngle = animTime * 4 + (i * Math.PI * 2) / sparkCount;
      const sr = 12 + Math.random() * 8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(sparkAngle) * sr, Math.sin(sparkAngle) * sr);
      ctx.stroke();
    }
  }

  ctx.restore();
  drawTierBadge(ctx, x, y, tier);
}
```

---

### 5.5 Sentinel 4: Frost Warden (Cryo Emitter)

- **Asset File**: `games/orbit-guard/source/assets/sentinel_frost.png` ($98 \times 75$, rendered at $41 \times 32$).
- **Hybrid Rendering Formula**: Winged cryogenic inhibitor frigate surrounded by a rotating glacial gyro ring and procedural sub-zero freezing mist.

```javascript
export function drawFrostWardenHybrid(ctx, x, y, spriteImg, state = {}) {
  const {
    tier = 1,
    animTime = 0,
    isSelected = false,
    isMergeTarget = false
  } = state;

  drawSentinelPlatform(ctx, x, y, tier, isSelected, isMergeTarget);

  ctx.save();
  ctx.translate(x, y);

  // 1. Sub-Zero Freezing Mist Radial Gradient
  const mistRadius = 24 + Math.sin(animTime * 2) * 3;
  const mistGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, mistRadius);
  mistGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
  mistGrad.addColorStop(0.6, 'rgba(125, 211, 252, 0.20)');
  mistGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = mistGrad;
  ctx.beginPath();
  ctx.arc(0, 0, mistRadius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Spinning Glacial Gyroscopic Snowflake Ring
  ctx.save();
  ctx.rotate(animTime * 0.6);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * 18, Math.sin(angle) * 18);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Draw Curated Kenney Sprite
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -20.5, -16, 41, 32);
  } else {
    drawFrostWardenVector(ctx, 0, 0, { tier, animTime });
  }

  ctx.restore();
  drawTierBadge(ctx, x, y, tier);
}
```

---

### 5.6 Sentinel 5: Shadow Assassin (Void Ripper)

- **Asset File**: `games/orbit-guard/source/assets/sentinel_assassin.png` ($93 \times 84$, rendered at $39 \times 35$).
- **Hybrid Rendering Formula**: Stealth interceptor featuring twin orbitally spinning crimson vibro-chakrams and high-velocity slash trails.

```javascript
export function drawShadowAssassinHybrid(ctx, x, y, spriteImg, state = {}) {
  const {
    angle = 0,
    tier = 1,
    animTime = 0,
    isSlashing = false,
    isSelected = false,
    isMergeTarget = false
  } = state;

  drawSentinelPlatform(ctx, x, y, tier, isSelected, isMergeTarget);

  ctx.save();
  ctx.translate(x, y);

  // 1. Draw Curated Kenney Sprite
  ctx.save();
  ctx.rotate(angle);
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -19.5, -17.5, 39, 35);
  } else {
    drawShadowAssassinVector(ctx, 0, 0, { angle: 0, tier, animTime, isSlashing });
  }
  ctx.restore();

  // 2. Twin Orbitally Spinning Crimson Vibro-Chakrams
  const bladeDist = 20;
  const bladeRot = animTime * 12;
  for (let i = 0; i < 2; i++) {
    const bAngle = angle + (i * Math.PI) + animTime * 5;
    const bx = Math.cos(bAngle) * bladeDist;
    const by = Math.sin(bAngle) * bladeDist;

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(bladeRot);

    // Glowing Blade Disc
    ctx.fillStyle = '#F43F5E';
    ctx.shadowColor = '#EF4444';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // White Edge Catchlight
    ctx.fillStyle = '#FFE4E6';
    ctx.beginPath();
    ctx.arc(1.5, -1.5, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 3. Slash Trail Burst
  if (isSlashing) {
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 26, angle - 0.8, angle + 0.8);
    ctx.stroke();
  }

  ctx.restore();
  drawTierBadge(ctx, x, y, tier);
}
```

---

## 6. Void Invaders: Hybrid Alien Craft Recipes

### 6.1 Enemy 1: Void Crawler (`enemy_crawler.png`)

- **Asset File**: `games/orbit-guard/source/assets/enemy_crawler.png` ($82 \times 84$, rendered at $31 \times 32$).
- **Features**: Scurrying melee bio-scout with a pulsating crimson optic sensor eye, chilled status blue-ice tint overlay, and floating HP arc.

```javascript
export function drawVoidCrawlerHybrid(ctx, x, y, spriteImg, state = {}) {
  const { angle = 0, animTime = 0, hpPercent = 1.0, isChilled = false } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 1. Chilled / Ice Debuff Tint
  if (isChilled) {
    ctx.shadowColor = '#38BDF8';
    ctx.shadowBlur = 10;
  }

  // 2. Draw Kenney Alien Sprite
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -15.5, -16, 31, 32);
  } else {
    drawVoidCrawlerVector(ctx, 0, 0, { angle: 0, animTime, hpPercent, isChilled });
  }

  // 3. Pulsing Crimson Optic Sensor Eye
  const eyePulse = Math.sin(animTime * 8) * 1.5;
  ctx.fillStyle = '#EF4444';
  ctx.shadowColor = '#F43F5E';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(6, 0, 3 + eyePulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 4. Overhead Floating HP Arc
  drawUnitHpArc(ctx, x, y, hpPercent, 18);
}
```

---

### 6.2 Enemy 2: Swift Dart (`enemy_dart.png`)

- **Asset File**: `games/orbit-guard/source/assets/enemy_dart.png` ($104 \times 84$, rendered at $37 \times 30$).
- **Features**: Aerodynamic manta-wing sprinter with twin energetic cyan ion thruster plumes and speed blur lines.

```javascript
export function drawSwiftDartHybrid(ctx, x, y, spriteImg, state = {}) {
  const { angle = 0, animTime = 0, hpPercent = 1.0, isChilled = false } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 1. Twin Ion Thruster Plumes
  const plumeLength = 12 + Math.sin(animTime * 15) * 4;
  ctx.fillStyle = '#00F5D4';
  ctx.shadowColor = '#00E5FF';
  ctx.shadowBlur = 8;
  // Left Jet
  ctx.beginPath();
  ctx.moveTo(-16, -6);
  ctx.lineTo(-16 - plumeLength, -6);
  ctx.lineTo(-16, -4);
  ctx.fill();
  // Right Jet
  ctx.beginPath();
  ctx.moveTo(-16, 6);
  ctx.lineTo(-16 - plumeLength, 6);
  ctx.lineTo(-16, 4);
  ctx.fill();

  // 2. Draw Kenney Sprite
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -18.5, -15, 37, 30);
  } else {
    drawSwiftDartVector(ctx, 0, 0, { angle: 0, animTime, isChilled });
  }

  ctx.restore();
  drawUnitHpArc(ctx, x, y, hpPercent, 17);
}
```

---

### 6.3 Enemy 3: Armored Bruiser (`enemy_bruiser.png`)

- **Asset File**: `games/orbit-guard/source/assets/enemy_bruiser.png` ($103 \times 84$, rendered at $49 \times 40$).
- **Features**: Heavy obsidian-carapace vanguard with an exposed glowing orange magma core weakpoint.

```javascript
export function drawArmoredBruiserHybrid(ctx, x, y, spriteImg, state = {}) {
  const { angle = 0, animTime = 0, hpPercent = 1.0, isChilled = false } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 1. Draw Kenney Sprite
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -24.5, -20, 49, 40);
  } else {
    drawArmoredBruiserVector(ctx, 0, 0, { angle: 0, animTime, hpPercent, isChilled });
  }

  // 2. Internal Molten Magma Core Weakpoint
  const corePulse = Math.sin(animTime * 4) * 1.5;
  const magmaGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 8);
  magmaGrad.addColorStop(0, '#FFFBEB');
  magmaGrad.addColorStop(0.5, '#F59E0B');
  magmaGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
  ctx.fillStyle = magmaGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 7 + corePulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  drawUnitHpArc(ctx, x, y, hpPercent, 25);
}
```

---

### 6.4 Enemy 4: Swarm Pod (`enemy_swarm.png`) & Void Mites

- **Asset File**: `games/orbit-guard/source/assets/enemy_swarm.png` ($91 \times 91$, rendered at $38 \times 38$).
- **Features**: Emerald bio-luminescent brood sac that ruptures into 3-5 procedural Void Mites upon destruction.

```javascript
export function drawSwarmPodHybrid(ctx, x, y, spriteImg, state = {}) {
  const { angle = 0, animTime = 0, hpPercent = 1.0, isChilled = false } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Biological Breathing Scale Oscillation
  const breath = 1.0 + Math.sin(animTime * 5) * 0.06;
  ctx.scale(breath, breath);

  // 1. Draw Kenney Sprite
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -19, -19, 38, 38);
  } else {
    drawSwarmPodVector(ctx, 0, 0, { angle: 0, animTime, isChilled });
  }

  // 2. Bio-Luminescent Embryo Glow
  ctx.fillStyle = '#FDE047';
  ctx.shadowColor = '#10B981';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(-2, -3, 3, 0, Math.PI * 2);
  ctx.arc(3, 2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  drawUnitHpArc(ctx, x, y, hpPercent, 20);
}

export function drawVoidMite(ctx, x, y, angle = 0, animTime = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Tiny Scuttling Bio-Mite
  ctx.fillStyle = '#10B981';
  ctx.strokeStyle = '#022C22';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Crimson Optic Spec
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(3, -1, 2, 2);

  ctx.restore();
}
```

---

### 6.5 Enemy 5: Void Slinger (`enemy_slinger.png`)

- **Asset File**: `games/orbit-guard/source/assets/enemy_slinger.png` ($97 \times 84$, rendered at $41 \times 35$).
- **Features**: Long-range siege bio-tripod that charges a concentrated purple plasma orb and targets the Nexus Core.

```javascript
export function drawVoidSlingerHybrid(ctx, x, y, spriteImg, state = {}) {
  const {
    angle = 0,
    animTime = 0,
    chargeProgress = 0,
    hpPercent = 1.0,
    isChilled = false
  } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 1. Draw Kenney Sprite
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -20.5, -17.5, 41, 35);
  } else {
    drawVoidSlingerVector(ctx, 0, 0, { angle: 0, animTime, chargeProgress, isChilled });
  }

  // 2. Charging Violet Plasma Mortar Sphere
  if (chargeProgress > 0) {
    const chargeR = 4 + chargeProgress * 6;
    const plasmaGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, chargeR);
    plasmaGrad.addColorStop(0, '#FFFFFF');
    plasmaGrad.addColorStop(0.4, '#C084FC');
    plasmaGrad.addColorStop(1, 'rgba(126, 34, 206, 0)');
    ctx.fillStyle = plasmaGrad;
    ctx.beginPath();
    ctx.arc(8, 0, chargeR, 0, Math.PI * 2);
    ctx.fill();

    // Dotted Trajectory Targeting Line
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(8 + 80, 0);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
  drawUnitHpArc(ctx, x, y, hpPercent, 21);
}
```

---

## 7. Titan Bosses: Multi-Phase Dreadnought Recipes

### 7.1 Boss 1: Iron Colossus (`boss_colossus.png`)

- **Wave 5 Titan**: Heavily fortified dreadnought featuring a dynamic 120-degree rotating cyan energy deflector shield arc.
- **Asset File**: `games/orbit-guard/source/assets/boss_colossus.png` ($103 \times 84$, rendered at $88 \times 71$).

```javascript
export function drawIronColossusHybrid(ctx, x, y, spriteImg, state = {}) {
  const {
    angle = 0,
    animTime = 0,
    shieldAngle = 0,
    shieldActive = true,
    hpPercent = 1.0
  } = state;

  ctx.save();
  ctx.translate(x, y);

  // 1. Twin Blazing Heavy Thruster Exhaust Cones
  ctx.save();
  ctx.rotate(angle);
  const flameLength = 22 + Math.sin(animTime * 12) * 6;
  ctx.fillStyle = '#EA580C';
  ctx.shadowColor = '#FF9E00';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(-38, -14);
  ctx.lineTo(-38 - flameLength, -14);
  ctx.lineTo(-38, -10);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-38, 14);
  ctx.lineTo(-38 - flameLength, 14);
  ctx.lineTo(-38, 10);
  ctx.fill();
  ctx.restore();

  // 2. Draw Curated Titan Sprite
  ctx.save();
  ctx.rotate(angle);
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -44, -35.5, 88, 71);
  } else {
    drawIronColossusVector(ctx, 0, 0, { angle: 0, animTime, shieldAngle, shieldActive, hpPercent });
  }
  ctx.restore();

  // 3. Dynamic 120-Degree Rotating Cyan Deflector Shield Arc
  if (shieldActive) {
    ctx.save();
    ctx.rotate(shieldAngle);
    ctx.strokeStyle = '#00E5FF';
    ctx.shadowColor = '#00F5D4';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(0, 0, 52, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();

    // Shield Hexagonal Energy Lattice
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 48, -Math.PI / 3 + 0.1, Math.PI / 3 - 0.1);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
  drawBossHpBar(ctx, x, y - 48, hpPercent, 'IRON COLOSSUS');
}
```

---

### 7.2 Boss 2: Hydra Queen (`boss_hydra.png`)

- **Wave 10 Titan**: Massive bio-leviathan with sinusoidal serpentine neck movement and continuous toxic brood spawning.
- **Asset File**: `games/orbit-guard/source/assets/boss_hydra.png` ($103 \times 84$, rendered at $91 \times 74$).

```javascript
export function drawHydraQueenHybrid(ctx, x, y, spriteImg, state = {}) {
  const { angle = 0, animTime = 0, hpPercent = 1.0, isSplit = false } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 1. Sinusoidal Bio-Spore Sac Oscillation
  const pulseSac = Math.sin(animTime * 3) * 3;

  // 2. Draw Kenney Sprite
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -45.5, -37, 91, 74);
  } else {
    drawHydraQueenVector(ctx, 0, 0, { angle: 0, animTime, hpPercent, isSplit });
  }

  // 3. Toxic Brood Sac Emissive Core
  const sacGrad = ctx.createRadialGradient(-10, 0, 2, -10, 0, 22);
  sacGrad.addColorStop(0, '#FDE047');
  sacGrad.addColorStop(0.5, '#10B981');
  sacGrad.addColorStop(1, 'rgba(6, 78, 59, 0)');
  ctx.fillStyle = sacGrad;
  ctx.beginPath();
  ctx.arc(-10, 0, 20 + pulseSac, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  drawBossHpBar(ctx, x, y - 50, hpPercent, 'HYDRA QUEEN');
}
```

---

### 7.3 Boss 3: Chrono Wraith (`boss_chrono.png`)

- **Wave 15 Titan**: Spacetime singularity dreadnought with reality-distorting violet afterimages and phase blink teleportation.
- **Asset File**: `games/orbit-guard/source/assets/boss_chrono.png` ($103 \times 84$, rendered at $88 \times 71$).

```javascript
export function drawChronoWraithHybrid(ctx, x, y, spriteImg, state = {}) {
  const { angle = 0, animTime = 0, hpPercent = 1.0, isBlinking = false } = state;

  ctx.save();
  ctx.translate(x, y);

  // 1. Spacetime Distortion Afterimages (Ghosting)
  for (let g = 1; g <= 3; g++) {
    const ghostOffset = Math.sin(animTime * 5 + g) * 8;
    ctx.save();
    ctx.translate(ghostOffset, 0);
    ctx.rotate(angle);
    ctx.globalAlpha = 0.18 / g;
    if (spriteImg && spriteImg.complete) {
      ctx.drawImage(spriteImg, -44, -35.5, 88, 71);
    }
    ctx.restore();
  }

  // 2. Counter-Rotating Temporal Chronometer Rings
  ctx.save();
  ctx.rotate(animTime * 1.2);
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.65)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 3. Draw Core Kenney Sprite
  ctx.save();
  ctx.rotate(angle);
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -44, -35.5, 88, 71);
  } else {
    drawChronoWraithVector(ctx, 0, 0, { angle: 0, animTime, hpPercent, isBlinking });
  }
  ctx.restore();

  // 4. Central Singularity Core
  const singGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 14);
  singGrad.addColorStop(0, '#FFFFFF');
  singGrad.addColorStop(0.3, '#C084FC');
  singGrad.addColorStop(1, 'rgba(88, 28, 135, 0)');
  ctx.fillStyle = singGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  drawBossHpBar(ctx, x, y - 48, hpPercent, 'CHRONO WRAITH');
}
```

---

## 8. Projectiles, Pickups & Visual FX Kinematics Recipes

### 8.1 Railgun Piercing Kinetic Tracer Beam (`laser_blue.png`)

```javascript
export function drawRailgunBeam(ctx, x1, y1, x2, y2, alpha = 1.0) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = alpha;

  // Outer Cyan Glow
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Inner Intense White-Hot Core
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.restore();
}
```

---

### 8.2 Heavy Mortar Parabolic Shell & Explosions (`laser_green.png`)

```javascript
export function drawMortarShell(ctx, x, y, height = 0) {
  ctx.save();
  // Ground Shadow (scales with altitude)
  const shadowScale = Math.max(0.4, 1.0 - height / 80);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(x, y, 6 * shadowScale, 3 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Glowing Plasma Shell (offset by height)
  ctx.translate(x, y - height);
  const shellGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 6);
  shellGrad.addColorStop(0, '#FFFFFF');
  shellGrad.addColorStop(0.4, '#FFD166');
  shellGrad.addColorStop(1, '#EA580C');
  ctx.fillStyle = shellGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawMortarExplosion(ctx, x, y, progress = 0) {
  // progress: 0.0 to 1.0
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const radius = 65 * progress;
  const alpha = 1.0 - progress;

  // Expanding Fireball Shockwave
  const expGrad = ctx.createRadialGradient(x, y, 2, x, y, radius);
  expGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
  expGrad.addColorStop(0.3, `rgba(255, 209, 102, ${alpha * 0.8})`);
  expGrad.addColorStop(0.7, `rgba(234, 88, 12, ${alpha * 0.5})`);
  expGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = expGrad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
```

---

### 8.3 Tesla Chain Lightning Procedural Arcs

```javascript
export function drawTeslaChainLightning(ctx, targets = []) {
  if (targets.length < 2) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < targets.length - 1; i++) {
    const start = targets[i];
    const end = targets[i + 1];
    const dist = Math.hypot(end.x - start.x, end.y - start.y);
    const steps = Math.max(3, Math.floor(dist / 14));

    ctx.strokeStyle = '#E9D5FF';
    ctx.shadowColor = '#C084FC';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const nx = start.x + (end.x - start.x) * t + (Math.random() - 0.5) * 12;
      const ny = start.y + (end.y - start.y) * t + (Math.random() - 0.5) * 12;
      ctx.lineTo(nx, ny);
    }
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
  ctx.restore();
}
```

---

### 8.4 Merge Ascending Golden Starburst (`powerup_star.png`)

```javascript
export function drawMergeStarburst(ctx, x, y, progress = 0) {
  // progress: 0.0 to 1.0
  ctx.save();
  ctx.translate(x, y);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = 1.0 - progress;
  const outerR = 60 * Math.sin(progress * Math.PI * 0.5);

  // Expanding Golden Nova Ring
  ctx.strokeStyle = `rgba(255, 209, 102, ${alpha})`;
  ctx.lineWidth = 4 * (1 - progress);
  ctx.beginPath();
  ctx.arc(0, 0, outerR, 0, Math.PI * 2);
  ctx.stroke();

  // 8 Radiant Light Rays
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 + progress * 0.8;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-2, 0);
    ctx.lineTo(0, -outerR * 1.3);
    ctx.lineTo(2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}
```

---

### 8.5 Powerups & Pickups (`powerup_star.png`, `powerup_shield.png`, `powerup_bolt.png`)

```javascript
export function drawPowerup(ctx, x, y, spriteImg, type = 'star', animTime = 0) {
  ctx.save();
  ctx.translate(x, y);

  // Floating Levitation Bobbing
  const bobY = Math.sin(animTime * 4) * 3;
  ctx.translate(0, bobY);

  // Radial Glow Halo
  const glowColors = {
    star: '#FFD166',
    shield: '#00E5FF',
    bolt: '#C084FC'
  };
  const color = glowColors[type] || '#FFD166';
  const glowGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 18);
  glowGrad.addColorStop(0, color);
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();

  // Draw Curated Pickup Sprite
  if (spriteImg && spriteImg.complete) {
    ctx.drawImage(spriteImg, -13, -12.5, 26, 25);
  }

  ctx.restore();
}
```

---

### 8.6 Deep Space Cosmic Parallax Backdrop (`bg_cosmic.png`)

```javascript
export function drawCosmicBackground(ctx, width, height, bgPattern, scrollY = 0) {
  // 1. Repeating Base Cosmic Tile
  if (bgPattern) {
    ctx.save();
    ctx.fillStyle = bgPattern;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  } else {
    // Solid Dark Fallback
    ctx.fillStyle = '#060814';
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Deep Space Radial Vignette
  const vignette = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, width);
  vignette.addColorStop(0, 'rgba(13, 17, 39, 0)');
  vignette.addColorStop(1, 'rgba(6, 8, 20, 0.75)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}
```

---

## 9. Particle Systems & Dynamic Shaders Engine

| Particle System ID | Count | Color Spectrum | Size (px) | Lifetime (s) | Velocity (px/s) | Gravity | Description & Trigger |
| :--- | :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| `particle_merge_starburst` | 28 | `#FFD166`, `#FFFBEB`, `#00E5FF`, `#FFFFFF` | $3 - 8$ | 0.45 | $60 - 180$ | 0 | Ascension starburst nova on merge |
| `particle_railgun_sparks` | 12 | `#00E5FF`, `#00F5D4`, `#FFFFFF` | $2 - 5$ | 0.25 | $80 - 160$ | 0 | Kinetic capacitor discharge sparks |
| `particle_mortar_embers` | 22 | `#FF9E00`, `#EA580C`, `#FFD166`, `#FFFFFF` | $3 - 7$ | 0.50 | $40 - 140$ | +40 | Heavy mortar fireball embers |
| `particle_tesla_sparks` | 14 | `#C084FC`, `#E9D5FF`, `#FFFFFF`, `#7E22CE` | $2 - 4.5$ | 0.30 | $50 - 120$ | 0 | Ionized chain lightning discharge |
| `particle_frost_mist` | 16 | `#38BDF8`, `#7DD3FC`, `#E0F2FE`, `#FFFFFF` | $2.5 - 6$ | 0.60 | $15 - 50$ | -10 | Ambient cryogenic frost fog |
| `particle_mite_rupture` | 20 | `#10B981`, `#34D399`, `#86EFAC` | $3 - 6$ | 0.40 | $70 - 150$ | +20 | Swarm Pod biological rupture burst |
| `particle_gold_coin_chime` | 8 | `#FFD166`, `#F59E0B`, `#FFFBEB` | $4 - 7$ | 0.35 | $30 - 90$ | -20 | Gold bounty chime floating up |
| `particle_core_shield_pulse` | 24 | `#00E5FF`, `#00F5D4`, `#FFFFFF` | $3 - 7$ | 0.70 | $90 - 200$ | 0 | Planetary shield wave pulse on damage |
| `particle_boss_explosion` | 64 | `#FFD166`, `#EA580C`, `#00E5FF`, `#C084FC`, `#FFFFFF` | $4 - 12$ | 1.20 | $80 - 260$ | +10 | Seismic multi-cluster boss detonation |
| `particle_ambient_stardust` | 30 | `rgba(255,255,255,0.8)`, `rgba(56,189,248,0.6)` | $1 - 2.5$ | 4.00 | $4 - 12$ | 0 | Ambient deep space floating stardust |

---

## 10. Titanium Glassmorphism UI & Tactile Feedback Theme

```
┌────────────────────────────────────────────────────────┐
│ [🔊/🔇]  ❤️ 100/100     🌊 WAVE 05/∞     💰 345 GOLD   │
│ ────────────────────────────────────────────────────── │
│                                                        │
│                    [ ORBITAL ARENA ]                   │
│                                                        │
│ ────────────────────────────────────────────────────── │
│   STANDBY BENCH:   [Slot 1] [Slot 2] [Slot 3] [Slot 4] │
│ ────────────────────────────────────────────────────── │
│  [ ⚡ OVERCHARGE ]  [ ➕ BUY SENTINEL ]  [ 🔧 REPAIR ] │
│      (Surge)             (💰 34 Gold)        (💰 50)   │
└────────────────────────────────────────────────────────┘
```

### 10.1 UI Tokens & Style Rules

- **Container Backgrounds**: Holographic glassmorphism (`rgba(13, 17, 39, 0.85)` with `backdrop-filter: blur(12px)`).
- **Borders & Dividers**: Subtly glowing cyan borders (`1.5px solid rgba(0, 229, 255, 0.35)`).
- **Typography**: Crisp sans-serif (`font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`).
  - Headings: Bold, uppercase, letter-spaced 1px (`#F8FAFC`).
  - Numbers & Counters: Monospaced gold numerals for treasury (`#FFD166`).
- **Tactile Touch Feedback**:
  - Primary button press: `transform: scale(0.96) translateY(1px)`.
  - Magnetic drag snap: Unit scales `scale(1.25)` during drag, dropping with `scale(1.35) -> scale(1.0)` squash-and-stretch.
  - Merge Target Link Beam: Dotted radiant solar gold beam connecting dragged sentinel to valid merge targets on orbit or bench.

---

## 11. Audio Synthesizer Mapping (Web Audio API)

| Sound ID | Type / Frequency Profile | Duration | Gameplay Trigger |
| :--- | :--- | :---: | :--- |
| `sfx_summon` | Sine sweep ($300\text{ Hz} \rightarrow 600\text{ Hz}$) | 0.12s | Summon Sentinel button tapped |
| `sfx_merge` | Ascending major chord ($C_5 \rightarrow E_5 \rightarrow G_5 \rightarrow C_6$) | 0.35s | Two identical units merged into higher tier |
| `sfx_railgun` | Narrow pulse zap ($1200\text{ Hz} \rightarrow 200\text{ Hz}$) | 0.08s | Ballista Archer projectile fired |
| `sfx_mortar` | Exponential bass thud + noise burst ($80\text{ Hz} \rightarrow 30\text{ Hz}$) | 0.40s | Heavy Cannon shell detonates |
| `sfx_tesla` | Sawtooth electric buzz ($440\text{ Hz} \pm 80\text{ Hz}$) | 0.15s | Arcane Mage chain lightning jump |
| `sfx_frost` | High-pass filtered crystalline hiss ($2000\text{ Hz}$) | 0.25s | Frost Warden aura pulse / enemy frozen |
| `sfx_assassin` | Blade slice + critical impact thud ($900\text{ Hz} \rightarrow 150\text{ Hz}$) | 0.18s | Shadow Assassin critical strike |
| `sfx_coin` | Dual bright bell chime ($1046\text{ Hz} \rightarrow 1318\text{ Hz}$) | 0.09s | Enemy defeated, gold flying to treasury |
| `sfx_surge` | Planetary sub-bass sweep ($50\text{ Hz} \rightarrow 150\text{ Hz} \rightarrow 40\text{ Hz}$) | 0.80s | Overcharge Surge panic shockwave activated |
| `sfx_boss_alarm`| Dual-tone pulsing siren ($440\text{ Hz} / 554\text{ Hz}$) | 0.60s | Titan Boss incursion entrance |
