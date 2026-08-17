# Art Direction: Orbit Guard

## 1. Aesthetic Identity & Visual Philosophy

- **Visual Theme**: **Deep Space Cybernetic / Cosmic Aegis** — A high-octane neon sci-fi aesthetic contrasting crisp, hyper-precise celestial defense technology against eldritch, bioluminescent void horrors.
- **Visual Tone & Feeling**: High-contrast, tactile, and instantly readable. Every sentinel weapon emission, orbital track, and incoming invader pops with radiant emissive energy against the pitch-black and deep nebula void.
- **Silhouette & Shape Language**:
  - **Sentinels & Planetary Core (Order & Precision)**: Clean geometric volumes, faceted hexagonal armor plates, concentric gold-trimmed rings, sharp 45° aerodynamic bevels, and glowing neon energy coils.
  - **Void Invaders & Bosses (Chaos & Distortion)**: Jagged chitinous silhouettes, multi-jointed insectoid appendages, bulbous pulsating spore sacs, and ethereal spacetime phase distortions.
  - **Merge Ascension Spectrum**: Visible visual ascension from Bronze Recruit (Tier 1) &rarr; Silver Veteran (Tier 2) &rarr; Gold Master (Tier 3) &rarr; Plasma Cyan Overclock (Tier 4) &rarr; Dark Matter Void Champion (Tier 5) &rarr; Ascended Celestial Radiant (Tier 6+).
- **Lighting, Emission & Shading**:
  - Emissive core glows rendered via multi-stop radial gradients (`rgba(0, 229, 255, 0.4)` to `rgba(0, 0, 0, 0)`).
  - High-precision 2px to 2.5px dark slate/obsidian outlines (`#0F172A`, `#1E293B`) to preserve crisp unit definition across mobile screen densities.
  - Additive blending effects (`ctx.globalCompositeOperation = 'lighter'`) for laser tracers, mortar explosions, tesla arcs, and merge starbursts.
- **Mobile Readability Optimization**:
  - Designed for a $450 \times 720$ virtual resolution ($9:16$ portrait mobile screen).
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

| Merge Tier | Tier Name | Platform Border | Core Gem / Accents | Emission Glow | Visual Badge |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **Tier 1** | Bronze Cadet | `#CD7F32` (Bronze) | `#B45309` (Amber) | `rgba(205, 127, 50, 0.35)` | ★ |
| **Tier 2** | Silver Veteran | `#E2E8F0` (Silver) | `#0284C7` (Cobalt) | `rgba(226, 232, 240, 0.45)` | ★★ |
| **Tier 3** | Gold Master | `#FFD166` (Solar Gold) | `#F59E0B` (Topaz) | `rgba(255, 209, 102, 0.60)` | ★★★ |
| **Tier 4** | Plasma Overclock | `#00E5FF` (Neon Cyan) | `#00F5D4` (Teal) | `rgba(0, 229, 255, 0.70)` | ◆ |
| **Tier 5** | Void Champion | `#C084FC` (Arcane Violet)| `#EC4899` (Magenta) | `rgba(192, 132, 252, 0.80)` | ❖ |
| **Tier 6+**| Celestial Radiant| `#FFFFFF` (Prismatic) | Prismatic Rainbow | `rgba(255, 255, 255, 0.95)` | 👑 |

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
    { border: '#CD7F32', fill: '#78350F', glow: 'rgba(205, 127, 50, 0.35)', badge: '★', label: 'T1' },
    { border: '#E2E8F0', fill: '#475569', glow: 'rgba(226, 232, 240, 0.45)', badge: '★★', label: 'T2' },
    { border: '#FFD166', fill: '#B45309', glow: 'rgba(255, 209, 102, 0.60)', badge: '★★★', label: 'T3' },
    { border: '#00E5FF', fill: '#0369A1', glow: 'rgba(0, 229, 255, 0.70)', badge: '◆', label: 'T4' },
    { border: '#C084FC', fill: '#581C87', glow: 'rgba(192, 132, 252, 0.80)', badge: '❖', label: 'T5' },
    { border: '#FFFFFF', fill: '#BE185D', glow: 'rgba(255, 255, 255, 0.95)', badge: '👑', label: 'T6' }
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
    surgeReady: '#00E5FF'
  }
};
```

---

## 3. Planetary Arena & Celestial Nexus Architecture

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

### 3.1 Procedural Nexus Core Renderer (`drawNexusCore`)

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

## 4. Complete Procedural Vector Art Recipes (Canvas 2D)

### 4.1 Sentinel Platform & Tier Badge Renderer

Every sentinel sits atop a magnetized hover platform that rotates in sync with its firing angle, displaying its ascension rank and glowing range boundary when selected.

```javascript
export function drawSentinelPlatform(ctx, x, y, tier = 1, isSelected = false, isMergeTarget = false) {
  const tierInfo = PALETTE.tierAscension[Math.min(tier - 1, 5)];
  
  ctx.save();
  ctx.translate(x, y);

  // Merge Synergy / Selection Pulsing Halo
  if (isSelected || isMergeTarget) {
    const glowR = 28 + Math.sin(Date.now() * 0.008) * 3;
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

### 4.2 Sentinel 1: Ballista Archer (Railgun Sentry)

- **Silhouette**: Sleek, sharp, angular chassis with dual parallel electromagnetic kinetic rails, cyan charging coils, and a high-precision laser sight.
- **Ascension**: Tier 1 single barrel &rarr; Tier 2 dual rails &rarr; Tier 3 kinetic capacitor fins &rarr; Tier 4 plasma booster &rarr; Tier 5 dark matter hyper-core &rarr; Tier 6 continuous orbital beam emitter.

```javascript
export function drawBallistaArcher(ctx, x, y, state = {}) {
  const {
    angle = 0,
    tier = 1,
    recoil = 0, // 0 to 1 recoil kickback
    charging = 0,
    isSelected = false,
    isMergeTarget = false
  } = state;

  drawSentinelPlatform(ctx, x, y, tier, isSelected, isMergeTarget);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const tierInfo = PALETTE.tierAscension[Math.min(tier - 1, 5)];
  const kick = recoil * 5;

  // 1. Angular Sentry Chassis
  ctx.fillStyle = '#1E293B';
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10 - kick, -12);
  ctx.lineTo(6 - kick, -8);
  ctx.lineTo(10 - kick, 0);
  ctx.lineTo(6 - kick, 8);
  ctx.lineTo(-10 - kick, 12);
  ctx.lineTo(-14 - kick, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 2. Dual Electromagnetic Railgun Barrels
  const barrelLength = 16 + Math.min(tier, 5) * 2;
  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.2;
  // Upper Rail
  ctx.beginPath();
  ctx.roundRect(0 - kick, -6, barrelLength, 3.5, 1);
  ctx.fill();
  ctx.stroke();
  // Lower Rail
  ctx.beginPath();
  ctx.roundRect(0 - kick, 2.5, barrelLength, 3.5, 1);
  ctx.fill();
  ctx.stroke();

  // 3. Cyan Magnetic Acceleration Coils (Rings along barrel)
  const coilCount = 2 + Math.min(tier, 4);
  ctx.fillStyle = tier >= 4 ? '#00E5FF' : '#38BDF8';
  for (let i = 0; i < coilCount; i++) {
    const cx = 4 + i * 4 - kick;
    ctx.fillRect(cx, -7, 2, 14);
  }

  // 4. Power Core Crystal
  const coreGrad = ctx.createRadialGradient(0 - kick, 0, 1, 0 - kick, 0, 5);
  coreGrad.addColorStop(0, '#FFFFFF');
  coreGrad.addColorStop(0.5, tier >= 4 ? '#00F5D4' : '#00E5FF');
  coreGrad.addColorStop(1, '#0284C7');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(0 - kick, 0, 4, 0, Math.PI * 2);
  ctx.fill();

  // 5. High-Precision Laser Sight (Dotted Line)
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(barrelLength - kick, 0);
  ctx.lineTo(barrelLength + 80, 0);
  ctx.stroke();
  ctx.setLineDash([]);

  // Recoil / Charging Muzzle Spark
  if (charging > 0.5 || recoil > 0.2) {
    ctx.fillStyle = '#00F5D4';
    ctx.beginPath();
    ctx.arc(barrelLength - kick + 2, 0, 3 + recoil * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  drawTierBadge(ctx, x, y, tier);
}
```

---

### 4.3 Sentinel 2: Heavy Cannon (Plasma Mortar)

- **Silhouette**: Chunky, heavy cylindrical turret with reinforced armored blast plates, an orange-hot glowing magma reaction chamber, and a wide-bore recoil muzzle.
- **Ascension**: Tier 1 single mortar &rarr; Tier 2 reinforced cooling jacket &rarr; Tier 3 magma vents &rarr; Tier 4 cluster bomblet ejector &rarr; Tier 5 supercharged heavy battery &rarr; Tier 6 thermonuclear nova mortar.

```javascript
export function drawHeavyCannon(ctx, x, y, state = {}) {
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

  const tierInfo = PALETTE.tierAscension[Math.min(tier - 1, 5)];
  const kick = recoil * 7;

  // 1. Reinforced Heavy Armor Base Frame
  ctx.fillStyle = '#1E293B';
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.roundRect(-12 - kick, -14, 22, 28, 4);
  ctx.fill();
  ctx.stroke();

  // Side Armor Flanges
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.roundRect(-14 - kick, -16, 8, 32, 2);
  ctx.fill();
  ctx.stroke();

  // 2. Wide Cylindrical Mortar Barrel
  const barrelLen = 14 + Math.min(tier, 5) * 2;
  const barrelRadius = 6 + Math.min(tier, 4) * 0.8;
  const barrelGrad = ctx.createLinearGradient(0, -barrelRadius, 0, barrelRadius);
  barrelGrad.addColorStop(0, '#64748B');
  barrelGrad.addColorStop(0.5, '#1E293B');
  barrelGrad.addColorStop(1, '#0F172A');
  ctx.fillStyle = barrelGrad;
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(-2 - kick, -barrelRadius, barrelLen, barrelRadius * 2, [2, 4, 4, 2]);
  ctx.fill();
  ctx.stroke();

  // Mortar Reinforced Muzzle Band
  ctx.fillStyle = '#D97706';
  ctx.strokeStyle = '#FFD166';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(barrelLen - 5 - kick, -barrelRadius - 1.5, 4.5, (barrelRadius + 1.5) * 2, 1);
  ctx.fill();
  ctx.stroke();

  // 3. Glowing Magma Reaction Chamber (Center Hatch)
  const heatPulse = 0.7 + Math.sin(animTime * 6) * 0.3;
  const magmaGrad = ctx.createRadialGradient(-3 - kick, 0, 1, -3 - kick, 0, 7);
  magmaGrad.addColorStop(0, '#FFFBEB');
  magmaGrad.addColorStop(0.3, '#FFD166');
  magmaGrad.addColorStop(0.7, `rgba(234, 88, 12, ${heatPulse})`);
  magmaGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
  ctx.fillStyle = magmaGrad;
  ctx.beginPath();
  ctx.arc(-3 - kick, 0, 6.5, 0, Math.PI * 2);
  ctx.fill();

  // Cooling Vent Slots on Hull
  ctx.fillStyle = '#EA580C';
  ctx.fillRect(-10 - kick, -10, 3, 4);
  ctx.fillRect(-10 - kick, 6, 3, 4);

  // Muzzle Blast Smoke / Ember Spark on Fire
  if (recoil > 0.1) {
    ctx.fillStyle = '#FF9E00';
    ctx.beginPath();
    ctx.arc(barrelLen + 4 - kick, 0, 5 + recoil * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  drawTierBadge(ctx, x, y, tier);
}
```

---

### 4.4 Sentinel 3: Arcane Mage (Tesla Caster)

- **Silhouette**: Floating crystalline obelisk hovering over a gold-trimmed magnetic levitation pedestal, surrounded by 3 revolving runic energy glyphs and violent purple electric sparks.
- **Ascension**: Tier 1 small crystal &rarr; Tier 2 twin orbiting runic shards &rarr; Tier 3 tri-glyph resonance &rarr; Tier 4 hyper-charged plasma halo &rarr; Tier 5 dark matter prism &rarr; Tier 6 infinite tempest storm monolith.

```javascript
export function drawArcaneMage(ctx, x, y, state = {}) {
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

  const tierInfo = PALETTE.tierAscension[Math.min(tier - 1, 5)];
  const hoverBob = Math.sin(animTime * 4) * 2;

  // 1. Magnetic Levitation Emitter Base (Pedestal)
  ctx.fillStyle = '#1E1B4B';
  ctx.strokeStyle = '#C084FC';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(0, 6, 14, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Base Arcane Runes
  ctx.fillStyle = '#A855F7';
  ctx.beginPath();
  ctx.arc(-8, 6, 1.5, 0, Math.PI * 2);
  ctx.arc(0, 8, 1.8, 0, Math.PI * 2);
  ctx.arc(8, 6, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // 2. Revolving Orbiting Energy Glyphs (Tri-Shards)
  const shardCount = 2 + Math.min(tier, 4);
  for (let i = 0; i < shardCount; i++) {
    const shardAngle = animTime * 2.5 + (i * Math.PI * 2) / shardCount;
    const sx = Math.cos(shardAngle) * 16;
    const sy = Math.sin(shardAngle) * 8 - 4 + hoverBob;

    ctx.fillStyle = '#E9D5FF';
    ctx.strokeStyle = '#9333EA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx, sy - 4);
    ctx.lineTo(sx + 3, sy);
    ctx.lineTo(sx, sy + 4);
    ctx.lineTo(sx - 3, sy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // 3. Floating Crystalline Monolith Obelisk (Center)
  ctx.save();
  ctx.translate(0, -6 + hoverBob);
  ctx.rotate(angle * 0.2); // Subtle tracking rotation

  const obeliskGrad = ctx.createLinearGradient(-7, -16, 7, 16);
  obeliskGrad.addColorStop(0, '#FAF5FF');
  obeliskGrad.addColorStop(0.3, '#C084FC');
  obeliskGrad.addColorStop(0.7, '#7E22CE');
  obeliskGrad.addColorStop(1, '#3B0764');

  ctx.fillStyle = obeliskGrad;
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(0, -16); // Top spearhead
  ctx.lineTo(8, -2);
  ctx.lineTo(5, 12);
  ctx.lineTo(0, 15);
  ctx.lineTo(-5, 12);
  ctx.lineTo(-8, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Internal Glowing Lightning Core
  const coreGlow = ctx.createRadialGradient(0, 0, 1, 0, 0, 8);
  coreGlow.addColorStop(0, '#FFFFFF');
  coreGlow.addColorStop(0.5, 'rgba(192, 132, 252, 0.8)');
  coreGlow.addColorStop(1, 'rgba(126, 34, 206, 0)');
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  // Tesla Arc Discharges (Flickering Sparks)
  if (isFiring || Math.sin(animTime * 15) > 0.4) {
    ctx.strokeStyle = '#F3E8FF';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo((Math.random() - 0.5) * 12, -20);
    ctx.lineTo((Math.random() - 0.5) * 16, -26);
    ctx.stroke();
  }

  ctx.restore();

  ctx.restore();
  drawTierBadge(ctx, x, y, tier);
}
```

---

### 4.5 Sentinel 4: Frost Warden (Cryo Emitter)

- **Silhouette**: Multi-faceted snowflake prism encased in counter-rotating azure gyroscopic rings, constantly emanating sub-zero frosty vapor and sparkling ice particles.
- **Ascension**: Tier 1 cryo prism &rarr; Tier 2 rotating azure gyros &rarr; Tier 3 frostbite core &rarr; Tier 4 brittle freeze emitter &rarr; Tier 5 zero-kelvin condenser &rarr; Tier 6 blizzard tempest warden.

```javascript
export function drawFrostWarden(ctx, x, y, state = {}) {
  const {
    tier = 1,
    animTime = 0,
    isSelected = false,
    isMergeTarget = false
  } = state;

  drawSentinelPlatform(ctx, x, y, tier, isSelected, isMergeTarget);

  ctx.save();
  ctx.translate(x, y);

  const tierInfo = PALETTE.tierAscension[Math.min(tier - 1, 5)];

  // 1. Ambient Cryogenic Mist Aura (Subtle 360° field preview)
  const auraPulse = 18 + Math.sin(animTime * 3) * 3;
  const mistGrad = ctx.createRadialGradient(0, 0, 6, 0, 0, auraPulse + 8);
  mistGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
  mistGrad.addColorStop(0.6, 'rgba(125, 211, 252, 0.20)');
  mistGrad.addColorStop(1, 'rgba(224, 242, 254, 0)');
  ctx.fillStyle = mistGrad;
  ctx.beginPath();
  ctx.arc(0, 0, auraPulse + 8, 0, Math.PI * 2);
  ctx.fill();

  // 2. Outer Rotating Hexagonal Gyroscopic Ring (Clockwise)
  ctx.save();
  ctx.rotate(animTime * 0.8);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  const hexPoints = 6;
  for (let i = 0; i < hexPoints; i++) {
    const angle = (i * Math.PI * 2) / hexPoints;
    const px = Math.cos(angle) * 16;
    const py = Math.sin(angle) * 16;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  // Ice Prisms on Ring Corners
  ctx.fillStyle = '#E0F2FE';
  for (let i = 0; i < hexPoints; i++) {
    const angle = (i * Math.PI * 2) / hexPoints;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * 16, Math.sin(angle) * 16, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Inner Counter-Rotating Snowflake Core (Counter-Clockwise)
  ctx.save();
  ctx.rotate(-animTime * 1.2);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * -12, Math.sin(a) * -12);
    ctx.lineTo(Math.cos(a) * 12, Math.sin(a) * 12);
    ctx.stroke();

    // Snowflake Side Barb details
    const barbDist = 7;
    const bx = Math.cos(a) * barbDist;
    const by = Math.sin(a) * barbDist;
    const perp = a + Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(bx - Math.cos(perp) * 3, by - Math.sin(perp) * 3);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + Math.cos(perp) * 3, by + Math.sin(perp) * 3);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Central Faceted Blue Ice Diamond
  const iceGrad = ctx.createRadialGradient(-3, -3, 1, 0, 0, 9);
  iceGrad.addColorStop(0, '#FFFFFF');
  iceGrad.addColorStop(0.4, '#7DD3FC');
  iceGrad.addColorStop(0.8, '#0284C7');
  iceGrad.addColorStop(1, '#0C4A6E');
  ctx.fillStyle = iceGrad;
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(7, 0);
  ctx.lineTo(0, 9);
  ctx.lineTo(-7, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
  drawTierBadge(ctx, x, y, tier);
}
```

---

### 4.6 Sentinel 5: Shadow Assassin (Void Ripper)

- **Silhouette**: Aerodynamic stealth drone chassis with swept delta wings, dual high-speed spinning ruby chakrams/daggers, and an ominous crimson sensor array.
- **Ascension**: Tier 1 dual daggers &rarr; Tier 2 spinning chakrams &rarr; Tier 3 armor-piercing serration &rarr; Tier 4 twin shadow clone drones &rarr; Tier 5 executioner scythes &rarr; Tier 6 abyssal void reaper.

```javascript
export function drawShadowAssassin(ctx, x, y, state = {}) {
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
  ctx.rotate(angle);

  const tierInfo = PALETTE.tierAscension[Math.min(tier - 1, 5)];
  const spinAngle = animTime * 14;

  // 1. Stealth Delta-Wing Body Frame
  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(12, 0);       // Nose cone
  ctx.lineTo(-6, -11);    // Left swept wingtip
  ctx.lineTo(-4, -4);
  ctx.lineTo(-12, -5);    // Left exhaust
  ctx.lineTo(-10, 0);     // Center tail
  ctx.lineTo(-12, 5);     // Right exhaust
  ctx.lineTo(-4, 4);
  ctx.lineTo(-6, 11);     // Right swept wingtip
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 2. High-Frequency Spinning Ruby Chakrams (Flanking Wings)
  const bladeDist = 11;
  for (let side of [-1, 1]) {
    ctx.save();
    ctx.translate(2, side * bladeDist);
    ctx.rotate(spinAngle * side);

    // Glowing Blade Disc
    const bladeGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 7);
    bladeGrad.addColorStop(0, '#FFE4E6');
    bladeGrad.addColorStop(0.5, '#F43F5E');
    bladeGrad.addColorStop(1, '#9F1239');
    ctx.fillStyle = bladeGrad;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // 3-Pointed Shuriken Star
    for (let p = 0; p < 3; p++) {
      const pa = (p * Math.PI * 2) / 3;
      const ox = Math.cos(pa) * 6.5;
      const oy = Math.sin(pa) * 6.5;
      const ix = Math.cos(pa + Math.PI / 3) * 2.5;
      const iy = Math.sin(pa + Math.PI / 3) * 2.5;
      if (p === 0) ctx.moveTo(ox, oy);
      else ctx.lineTo(ox, oy);
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // 3. Central Red Optical Sensor & Stealth Shimmer
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.ellipse(4, 0, 4, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(5, -0.5, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Slash Motion Blur Ribbon on Strike
  if (isSlashing) {
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 18, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
  }

  ctx.restore();
  drawTierBadge(ctx, x, y, tier);
}
```

---

## 5. Void Invaders Procedural Recipes (Canvas 2D)

### 5.1 Enemy 1: Void Crawler (Standard Walker)

- **Silhouette**: Hexagonal segmented bio-mechanical spider/crab with 6 scuttling articulated legs, glowing ruby optics, and snapping mandibles.

```javascript
export function drawVoidCrawler(ctx, x, y, state = {}) {
  const {
    angle = 0,
    animTime = 0,
    hpPercent = 1.0,
    isChilled = false
  } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Ground Drop Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 2, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 1. Articulated Scuttling Legs (3 on each side)
  ctx.strokeStyle = isChilled ? '#38BDF8' : '#64748B';
  ctx.lineWidth = 1.8;
  const legSpeed = isChilled ? 6 : 14;
  for (let i = 0; i < 3; i++) {
    const sideOffset = (i - 1) * 6;
    const legPhase = Math.sin(animTime * legSpeed + i * 1.8);

    // Left Leg
    ctx.beginPath();
    ctx.moveTo(-4 + sideOffset, -6);
    ctx.lineTo(-10 + sideOffset, -12 + legPhase * 3);
    ctx.lineTo(-16 + sideOffset, -8 + legPhase * 4);
    ctx.stroke();

    // Right Leg
    ctx.beginPath();
    ctx.moveTo(-4 + sideOffset, 6);
    ctx.lineTo(-10 + sideOffset, 12 - legPhase * 3);
    ctx.lineTo(-16 + sideOffset, 8 - legPhase * 4);
    ctx.stroke();
  }

  // 2. Segmented Chitin Carapace
  const bodyGrad = ctx.createLinearGradient(-10, 0, 10, 0);
  bodyGrad.addColorStop(0, '#0F172A');
  bodyGrad.addColorStop(0.5, '#1E293B');
  bodyGrad.addColorStop(1, '#334155');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = isChilled ? '#38BDF8' : '#EF4444';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-10, -8, 20, 16, [6, 10, 10, 6]);
  ctx.fill();
  ctx.stroke();

  // Carapace Segment Ridges
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-3, -7);
  ctx.lineTo(-3, 7);
  ctx.moveTo(3, -6);
  ctx.lineTo(3, 6);
  ctx.stroke();

  // 3. Glowing Central Red Optic Eye
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(6, 0, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(7, -1, 1, 0, Math.PI * 2);
  ctx.fill();

  // 4. Snapping Mandibles
  ctx.fillStyle = '#94A3B8';
  ctx.beginPath();
  ctx.moveTo(9, -4);
  ctx.lineTo(14, -2);
  ctx.lineTo(10, 0);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(9, 4);
  ctx.lineTo(14, 2);
  ctx.lineTo(10, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
```

---

### 5.2 Enemy 2: Swift Dart (High-Speed Sprinter)

- **Silhouette**: Sleek, knife-sharp aerodynamic spearhead manta ray with glowing plasma speed trails and glowing dual wingtip sensors.

```javascript
export function drawSwiftDart(ctx, x, y, state = {}) {
  const {
    angle = 0,
    animTime = 0,
    isChilled = false
  } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Twin Plasma Speed Jet Trails (Trailing behind)
  const jetFlicker = 8 + Math.sin(animTime * 25) * 4;
  ctx.fillStyle = isChilled ? 'rgba(56, 189, 248, 0.6)' : 'rgba(0, 245, 212, 0.7)';
  ctx.beginPath();
  ctx.moveTo(-10, -5);
  ctx.lineTo(-10 - jetFlicker, -5);
  ctx.lineTo(-8, -3);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-10, 5);
  ctx.lineTo(-10 - jetFlicker, 5);
  ctx.lineTo(-8, 3);
  ctx.closePath();
  ctx.fill();

  // Aerodynamic Spearhead Manta Body
  const dartGrad = ctx.createLinearGradient(12, 0, -12, 0);
  dartGrad.addColorStop(0, '#00F5D4');
  dartGrad.addColorStop(0.4, '#0F172A');
  dartGrad.addColorStop(1, '#1E293B');
  ctx.fillStyle = dartGrad;
  ctx.strokeStyle = isChilled ? '#7DD3FC' : '#00E5FF';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(14, 0);        // Sharp needle nose
  ctx.lineTo(-8, -13);     // Swept wingtip left
  ctx.lineTo(-4, -4);
  ctx.lineTo(-12, 0);      // Tail notch
  ctx.lineTo(-4, 4);
  ctx.lineTo(-8, 13);      // Swept wingtip right
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Glowing Wingtip Light Orbs
  ctx.fillStyle = '#00F5D4';
  ctx.beginPath();
  ctx.arc(-7, -11, 1.8, 0, Math.PI * 2);
  ctx.arc(-7, 11, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 5.3 Enemy 3: Armored Bruiser (Heavy Tank)

- **Silhouette**: Massive, wide-bodied chitinous turtle/behemoth with heavy interlocking slate shell plates, glowing amber weakpoint core, and dual defensive ram horns.

```javascript
export function drawArmoredBruiser(ctx, x, y, state = {}) {
  const {
    angle = 0,
    animTime = 0,
    hpPercent = 1.0,
    isChilled = false
  } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Heavy Drop Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 3, 20, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // 1. Massive Armored Shell Carapace
  const shellGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 18);
  shellGrad.addColorStop(0, '#334155');
  shellGrad.addColorStop(0.7, '#1E293B');
  shellGrad.addColorStop(1, '#0F172A');
  ctx.fillStyle = shellGrad;
  ctx.strokeStyle = isChilled ? '#38BDF8' : '#F59E0B';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(-16, -14, 30, 28, [10, 14, 14, 10]);
  ctx.fill();
  ctx.stroke();

  // 2. Interlocking Hexagonal Armor Plates
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 1.5;
  for (let dy of [-6, 6]) {
    ctx.beginPath();
    ctx.moveTo(-10, dy);
    ctx.lineTo(8, dy);
    ctx.stroke();
  }

  // 3. Central Glowing Magma Weakpoint Core
  const corePulse = 0.6 + Math.sin(animTime * 4) * 0.4;
  const weakpointGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 7);
  weakpointGrad.addColorStop(0, '#FFFBEB');
  weakpointGrad.addColorStop(0.5, '#F59E0B');
  weakpointGrad.addColorStop(1, `rgba(220, 38, 38, ${corePulse})`);
  ctx.fillStyle = weakpointGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();

  // 4. Heavy Reinforced Ramming Horns (Front)
  ctx.fillStyle = '#94A3B8';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.2;
  // Left Horn
  ctx.beginPath();
  ctx.moveTo(12, -10);
  ctx.lineTo(20, -14);
  ctx.lineTo(14, -6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Right Horn
  ctx.beginPath();
  ctx.moveTo(12, 10);
  ctx.lineTo(20, 14);
  ctx.lineTo(14, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
```

---

### 5.4 Enemy 4: Swarm Pod (Carrier Spore Sack) & Void Mites

- **Silhouette**: Bulbous, gelatinous organic spore sack with a translucent glowing membrane revealing 5 pulsating micro-mite embryos inside.
- **Void Mite**: Tiny, frantic 6px skittering orb with glowing red eye and micro-legs.

```javascript
export function drawSwarmPod(ctx, x, y, state = {}) {
  const {
    angle = 0,
    animTime = 0,
    isChilled = false
  } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const pulse = Math.sin(animTime * 6) * 1.5;

  // Translucent Organic Bulb Membrane
  const podGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 16);
  podGrad.addColorStop(0, '#86EFAC');
  podGrad.addColorStop(0.4, '#10B981');
  podGrad.addColorStop(0.8, '#065F46');
  podGrad.addColorStop(1, '#022C22');
  ctx.fillStyle = podGrad;
  ctx.strokeStyle = isChilled ? '#7DD3FC' : '#34D399';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 15 + pulse, 12 - pulse * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Internal Micro-Mite Embryos (5 glowing yellow dots)
  ctx.fillStyle = '#FDE047';
  const embryoPositions = [
    [-6, -4], [0, -5], [5, -3], [-3, 3], [4, 4]
  ];
  for (let [ex, ey] of embryoPositions) {
    ctx.beginPath();
    ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Trailing Spore Tendrils
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 1.4;
  for (let i = -1; i <= 1; i++) {
    const sway = Math.sin(animTime * 8 + i) * 3;
    ctx.beginPath();
    ctx.moveTo(-14, i * 4);
    ctx.quadraticCurveTo(-20, i * 6 + sway, -26, i * 4 + sway * 1.5);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawVoidMite(ctx, x, y, state = {}) {
  const { angle = 0, animTime = 0 } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Tiny Skittering Body
  ctx.fillStyle = '#10B981';
  ctx.strokeStyle = '#022C22';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Red Eye
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(2, 0, 1.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 5.5 Enemy 5: Void Slinger (Perimeter Bio-Artillery)

- **Silhouette**: Hovering tripod bio-artillery platform with a massive arched catapult launch sac and glowing plasma mortar round charging in its cradle.

```javascript
export function drawVoidSlinger(ctx, x, y, state = {}) {
  const {
    angle = 0,
    animTime = 0,
    chargeProgress = 0, // 0 to 1
    isChilled = false
  } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 1. Tripod Stabilizer Hover Tentacles
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  for (let a of [-0.6, 0.6, Math.PI]) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 16, Math.sin(a) * 16);
    ctx.stroke();
  }

  // 2. Artillery Chassis
  ctx.fillStyle = '#1E1B4B';
  ctx.strokeStyle = isChilled ? '#38BDF8' : '#A855F7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-10, -10, 20, 20, 5);
  ctx.fill();
  ctx.stroke();

  // 3. Arched Mortar Cradle & Charging Plasma Ball
  const ballSize = 3 + chargeProgress * 5;
  const chargeGrad = ctx.createRadialGradient(4, 0, 1, 4, 0, ballSize);
  chargeGrad.addColorStop(0, '#FFFFFF');
  chargeGrad.addColorStop(0.4, '#C084FC');
  chargeGrad.addColorStop(1, '#6B21A8');
  ctx.fillStyle = chargeGrad;
  ctx.beginPath();
  ctx.arc(4, 0, ballSize, 0, Math.PI * 2);
  ctx.fill();

  // Trajectory Laser Sight Beam (When Charging)
  if (chargeProgress > 0.3) {
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(100, 0);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}
```

---

## 6. Multi-Phase Boss Procedural Recipes

### 6.1 Boss 1: Iron Colossus (The Shielded Titan - Wave 5)

- **Silhouette**: Colossal dark-iron dreadnought walker with segmented hydraulic fist treads, glowing heat exhausts, and a massive rotating $120^\circ$ directional kinetic energy shield.

```javascript
export function drawIronColossus(ctx, x, y, state = {}) {
  const {
    angle = 0,
    animTime = 0,
    shieldAngle = 0,
    shieldActive = true,
    hpPercent = 1.0
  } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Massive Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(0, 4, 38, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // 1. Heavy Segmented Titan Hull (Obsidian / Dark Iron)
  const hullGrad = ctx.createLinearGradient(-26, 0, 26, 0);
  hullGrad.addColorStop(0, '#0F172A');
  hullGrad.addColorStop(0.5, '#1E293B');
  hullGrad.addColorStop(1, '#334155');
  ctx.fillStyle = hullGrad;
  ctx.strokeStyle = hpPercent > 0.5 ? '#00E5FF' : '#EF4444';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-24, -22, 48, 44, [8, 14, 14, 8]);
  ctx.fill();
  ctx.stroke();

  // Heavy Titan Fist / Treads (Flanking)
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.roundRect(-28, -26, 14, 52, 4);
  ctx.fill();
  ctx.stroke();

  // 2. Molten Thermal Exhaust Grates
  const heatFlicker = 0.6 + Math.sin(animTime * 8) * 0.4;
  ctx.fillStyle = `rgba(234, 88, 12, ${heatFlicker})`;
  for (let dy of [-12, -4, 4, 12]) {
    ctx.fillRect(-18, dy, 8, 3);
  }

  // 3. Central Titan Core Generator
  ctx.fillStyle = '#00E5FF';
  ctx.beginPath();
  ctx.arc(4, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(6, -2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 4. Revolving Directional Energy Barrier Arc (120°)
  if (shieldActive) {
    ctx.save();
    ctx.rotate(shieldAngle - angle); // Absolute shield rotation
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#00F5D4';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, 36, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();

    // Shield Energy Hexagonal Matrix Pattern
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 32, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}
```

---

### 6.2 Boss 2: Hydra Queen (The Broodmother - Wave 10)

- **Silhouette**: Massive multi-segmented biomechanical serpent broodmother with twin swaying serpentine heads, glowing toxic venom fangs, and pulsating egg ovipositor sacs.

```javascript
export function drawHydraQueen(ctx, x, y, state = {}) {
  const {
    angle = 0,
    animTime = 0,
    hpPercent = 1.0,
    isSplit = false
  } = state;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const headSway1 = Math.sin(animTime * 3) * 6;
  const headSway2 = Math.cos(animTime * 3) * 6;

  // 1. Giant Ovipositor Brood Sac (Rear)
  const sacGrad = ctx.createRadialGradient(-18, 0, 4, -18, 0, 26);
  sacGrad.addColorStop(0, '#86EFAC');
  sacGrad.addColorStop(0.5, '#10B981');
  sacGrad.addColorStop(1, '#064E3B');
  ctx.fillStyle = sacGrad;
  ctx.strokeStyle = '#34D399';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(-18, 0, 24, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 2. Twin Articulated Serpentine Necks & Heads
  for (let head of [-1, 1]) {
    const sway = head === -1 ? headSway1 : headSway2;
    const hy = head * 16 + sway;

    // Segmented Neck
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-6, head * 8);
    ctx.quadraticCurveTo(8, hy * 0.6, 22, hy);
    ctx.stroke();

    // Serpentine Dragon/Xenomorph Head
    ctx.fillStyle = '#064E3B';
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, hy - 6);
    ctx.lineTo(34, hy);
    ctx.lineTo(20, hy + 6);
    ctx.lineTo(14, hy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glowing Toxic Green Eyes
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(24, hy - 2, 2, 0, Math.PI * 2);
    ctx.arc(24, hy + 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
```

---

### 6.3 Boss 3: Chrono Wraith (The Spacetime Phantom - Wave 15)

- **Silhouette**: Dimensional spacetime horror dissolving into purple temporal glitch afterimages, encased in a rotating chronal distortion ring with a glowing hourglass singularity core.

```javascript
export function drawChronoWraith(ctx, x, y, state = {}) {
  const {
    angle = 0,
    animTime = 0,
    hpPercent = 1.0,
    isBlinking = false
  } = state;

  ctx.save();
  ctx.translate(x, y);

  // Ethereal Temporal Afterimages (Glitch Trails)
  if (!isBlinking) {
    for (let i = 1; i <= 3; i++) {
      ctx.save();
      const trailAngle = angle - i * 0.15;
      const tx = Math.cos(trailAngle) * (i * 8);
      const ty = Math.sin(trailAngle) * (i * 8);
      ctx.translate(tx, ty);
      ctx.globalAlpha = 0.25 / i;
      ctx.fillStyle = '#C084FC';
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // 1. Spacetime Warp Distortion Ring (Rotating Gyroscope)
  ctx.save();
  ctx.rotate(animTime * 1.8);
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.75)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 2. Void Robes / Phantom Shroud
  const shroudGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 26);
  shroudGrad.addColorStop(0, '#FAF5FF');
  shroudGrad.addColorStop(0.3, '#A855F7');
  shroudGrad.addColorStop(0.7, '#581C87');
  shroudGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = shroudGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();

  // 3. Central Hourglass Singularity Core
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#C084FC';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-7, -10);
  ctx.lineTo(7, -10);
  ctx.lineTo(-7, 10);
  ctx.lineTo(7, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Singularity Eye Glint
  ctx.fillStyle = '#FFD166';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

## 7. Visual FX, Projectiles & Kinematics Recipes

### 7.1 Railgun Piercing Tracer Beam

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

### 7.2 Heavy Mortar Parabolic Shell & Explosions

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

### 7.3 Tesla Chain Lightning Procedural Arcs

```javascript
export function drawTeslaChainLightning(ctx, targets = []) {
  // targets: array of [{x, y}]
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

### 7.4 Merge Ascending Golden Starburst

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

## 8. Mobile UI / UX Styling & Glassmorphism Theme

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

### 8.1 UI Tokens & Style Rules

- **Container Backgrounds**: Holographic glassmorphism (`rgba(13, 17, 39, 0.85)` with `backdrop-filter: blur(12px)`).
- **Borders & Dividers**: Subtly glowing cyan borders (`1.5px solid rgba(0, 229, 255, 0.35)`).
- **Typography**: Crisp sans-serif (`font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`).
  - Headings: Bold, uppercase, letter-spaced 1px (`#F8FAFC`).
  - Numbers & Counters: Monospaced gold numerals for treasury (`#FFD166`).
- **Tactile Touch Feedback**:
  - Primary button press: `transform: scale(0.96) translateY(1px)`.
  - Magnetic drag snap: Unit scales `scale(1.25)` during drag, dropping with `scale(1.35) -> scale(1.0)` squash-and-stretch.

---

## 9. Audio Synthesizer Mapping

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
