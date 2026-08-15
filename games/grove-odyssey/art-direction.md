# Art Direction: Grove Odyssey

## 1. Aesthetic Identity & Visual Philosophy

- **Visual Tone**: Whimsical, cozy, vibrant, and soft-shaded 2D vector storybook style. High readability, expressive character silhouettes, and lush bioluminescent atmospherics tailored for an exploratory Metroidvania.
- **Silhouette & Geometry**: Soft, rounded shapes with gentle organic curves. Characters and interactive objects utilize bold, friendly volumes with dark tinted indigo/slate outlines (`#1E293B` or `#1E1B4B`, never harsh pitch black) for crisp contrast against rich layered backgrounds.
- **Atmospheric Lighting & Depth**:
  - **Dynamic Zone Lighting**: Bioluminescent glows and dynamic spotlight gradients surround Lumi in deep subterranean zones (Mossy Caverns, Sunken Roots), shifting to warm golden sunbeams in the Sunlit Canopy and shimmering prismatic caustics in the Crystal Grotto.
  - **3-Layer Ambient Parallax**:
    1. *Far Layer (0.1x speed)*: Majestic silhouette mountains, giant elder tree branches, and atmospheric gradient skyboxes.
    2. *Mid Layer (0.3x speed)*: Overgrown ancient ruins, mossy stalactites, floating highland islands, and glowing fungal clusters.
    3. *Near Layer (1.0x speed)*: Sharp gameplay platforms, climbable roots, interactive shrines, and animated hazard foliage.
  - **Drop Shadows & Halos**: Soft ground contact drop shadows (`rgba(0, 0, 0, 0.18)`) under grounded actors; radiant soft halos (`rgba(254, 240, 138, 0.45)`) around Ancient Sun Seeds, Shrines, and active Waystones.

---

## 2. Aesthetic Palettes for the 7 Interconnected Zones

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

### 2.1 Zone Palettes Overview

| Zone | Primary Mood | Sky / Backdrop Gradient | Primary Terrain Fill | Platform Accent / Foliage | Ambient Lighting / Particle |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Heart Grove** | Sunlit Sanctuary | `#70A1FF` &rarr; `#DDF3D8` | `#4A3525` (Warm Bark) | `#55B368` (Clover Moss) | `#FFB8C6` (Elder Petals) |
| **2. Mossy Caverns** | Damp Subterranean | `#1A252C` &rarr; `#163832` | `#1F2937` (Dark Slate) | `#2C4A3E` & `#00F5D4` | `#05B89A` (Biolum Spores) |
| **3. Crystal Grotto** | Shimmering Amethyst | `#231942` &rarr; `#38184C` | `#2B2D42` (Deep Basalt) | `#BE95C4` & `#70D6FF` | `#00F0FF` (Prism Glints) |
| **4. Sunlit Canopy** | Golden High Boughs | `#FFB703` &rarr; `#8ECAE6` | `#854D0E` (Cedar Bough) | `#FB8500` & `#38B000` | `#FFD166` (Sun Motes) |
| **5. Forgotten Roots** | Primordial Depths | `#0F0E17` &rarr; `#2E1C14` | `#3F2B1D` (Gnarled Root) | `#FF9F1C` (Sap) & `#9D0208` | `#FFB703` (Sap Droplets) |
| **6. Windy Chasm** | Highland Precipice | `#BAC8D3` &rarr; `#4A4E69` | `#4B5563` (Alpine Stone)| `#A3B18A` (Highland Lichen) | `#FFFFFF` (Wind Streaks) |
| **7. Secret Shrine** | Mythic Sanctum | `#140826` &rarr; `#3A0CA3` | `#E9ECEF` (Gilded Marble) | `#FFD700` (Divine Ivy) | `#4CC9F0` (Rune Stardust) |

---

### 2.2 Detailed Zone Color Tokens

```javascript
export const ZONE_PALETTES = {
  heartGrove: {
    skyTop: '#70A1FF',
    skyBottom: '#DDF3D8',
    terrainMain: '#4A3525',
    terrainTop: '#55B368',
    terrainAccent: '#88D49E',
    foliageMain: '#38A169',
    foliagePetal: '#FFB8C6',
    ambientGlow: 'rgba(254, 240, 138, 0.25)',
    particleColor: '#FFB8C6'
  },
  mossyCaverns: {
    skyTop: '#1A252C',
    skyBottom: '#163832',
    terrainMain: '#1F2937',
    terrainTop: '#2C4A3E',
    terrainAccent: '#00F5D4',
    mushroomCap: '#05B89A',
    mushroomStem: '#D8F3DC',
    ambientGlow: 'rgba(0, 245, 212, 0.3)',
    particleColor: '#00F5D4'
  },
  crystalGrotto: {
    skyTop: '#231942',
    skyBottom: '#38184C',
    terrainMain: '#2B2D42',
    terrainTop: '#4A4E69',
    terrainAccent: '#70D6FF',
    crystalShard: '#BE95C4',
    crystalGlow: '#00F0FF',
    ambientGlow: 'rgba(112, 214, 255, 0.35)',
    particleColor: '#70D6FF'
  },
  sunlitCanopy: {
    skyTop: '#8ECAE6',
    skyBottom: '#FFB703',
    terrainMain: '#854D0E',
    terrainTop: '#38B000',
    terrainAccent: '#FB8500',
    leafAmber: '#FFD166',
    sunbeamColor: 'rgba(255, 209, 102, 0.28)',
    ambientGlow: 'rgba(251, 133, 0, 0.25)',
    particleColor: '#FFD166'
  },
  sunkenRoots: {
    skyTop: '#0F0E17',
    skyBottom: '#2E1C14',
    terrainMain: '#3F2B1D',
    terrainTop: '#28170D',
    terrainAccent: '#FF9F1C',
    thornVine: '#540D6E',
    thornSpike: '#9D0208',
    ambientGlow: 'rgba(255, 159, 28, 0.28)',
    particleColor: '#FF9F1C'
  },
  windyChasm: {
    skyTop: '#BAC8D3',
    skyBottom: '#4A4E69',
    terrainMain: '#4B5563',
    terrainTop: '#A3B18A',
    terrainAccent: '#E0E1DD',
    updraftCyan: 'rgba(56, 189, 248, 0.35)',
    cloudMist: 'rgba(248, 250, 252, 0.5)',
    ambientGlow: 'rgba(163, 177, 138, 0.2)',
    particleColor: '#FFFFFF'
  },
  secretElderShrine: {
    skyTop: '#140826',
    skyBottom: '#3A0CA3',
    terrainMain: '#2B2D42',
    terrainTop: '#E9ECEF',
    terrainAccent: '#FFD700',
    divineIvy: '#FFD700',
    runeCyan: '#4CC9F0',
    ambientGlow: 'rgba(255, 215, 0, 0.45)',
    particleColor: '#FFD700'
  }
};
```

---

## 3. Character & NPC Color Palettes

### 3.1 Hero: Lumi (The Forest Spirit)
| Token | Value | Usage |
| :--- | :--- | :--- |
| `lumiBodyTop` | `#E0FAFF` | Luminous upper head & torso |
| `lumiBodyBottom` | `#A7F3D0` | Mint gradient lower body |
| `lumiOutline` | `#1E293B` | Crisp 2px slate outline |
| `lumiEyes` | `#1E293B` | Glossy expressive pupils |
| `lumiCatchlight` | `#FFFFFF` | Dual glistening eye highlights |
| `lumiBlush` | `rgba(255, 120, 150, 0.45)` | Rosy cheek blush ellipses |
| `lumiAntenna` | `#FDE047` | Flexible bioluminescent stalks |
| `lumiAntennaGlow`| `#FACC15` | Glowing orb tips on antennae |
| `lumiCape` | `#4ADE80` | Fluttering emerald leaf mantle |
| `lumiCapeShadow` | `#16A34A` | Leaf cape underfold shadow |
| `lumiAura` | `rgba(167, 243, 208, 0.35)` | Ambient radial glow halo |

### 3.2 NPCs
- **Barnaby the Snail (The Guide)**:
  - Shell: Warm Ochre `#D97706` with Spiral Shadow `#B45309`.
  - Moss Cushion: Lush Emerald `#22C55E` with Cyan Spore Dots `#00F5D4`.
  - Snail Body: Soft Chubby Cream `#FFE8D6`, Rosy Cheeks `rgba(255, 107, 129, 0.5)`.
  - Scarf: Sky Blue `#38BDF8` with Leaf Clasp `#4ADE80`.
- **Bramble the Hedgehog (The Underground Miner)**:
  - Spiky Quills: Deep Chestnut `#5C3D2E` tipped with Warm Amber `#8B5E3C`.
  - Face & Belly: Soft Tan `#FBBF24` / `#FDE68A`.
  - Miner Goggles: Brass Bronze `#D97706` with Glinting Cyan Lenses `#38BDF8`.
  - Miner Lantern: Iron Frame `#374151` with Glowing Blue Crystal `#06B6D4`.
- **Pip the Owl (The High Sage)**:
  - Feather Mantle: Celestial Midnight `#1E1B4B` to `#312E81` with Golden Star Specks `#FDE047`.
  - Breast Down: Fluffy Pearl Cream `#F1F5F9` with Chevron Down `#CBD5E1`.
  - Feather Eyebrows: Wise Tufted Ochre `#D97706`.
  - Spectacles: Radiant Wire Gold `#FACC15` around Dark Amber Eyes `#78350F`.

---

## 4. Complete Procedural Vector Art Recipes (Canvas 2D)

### 4.1 Hero Renderer: `drawLumi`
```javascript
export function drawLumi(ctx, x, y, state = {}) {
  const {
    scaleX = 1.0,
    scaleY = 1.0,
    facingRight = true,
    action = 'idle', // 'idle' | 'run' | 'jump' | 'double_jump' | 'dash' | 'glide' | 'hurt'
    animTimer = 0,
    iFrames = 0,
    hasFeatherJump = false,
    hasLeafDash = false,
    hasWindGlide = false
  } = state;

  // Hurt flicker (invulnerability frames)
  if (iFrames > 0 && Math.floor(animTimer * 20) % 2 === 0) {
    return;
  }

  ctx.save();
  ctx.translate(x, y);

  // 1. Ambient Bioluminescent Glow Halo
  const haloGrad = ctx.createRadialGradient(0, -10, 4, 0, -10, 32);
  haloGrad.addColorStop(0, 'rgba(167, 243, 208, 0.45)');
  haloGrad.addColorStop(0.6, 'rgba(110, 231, 183, 0.18)');
  haloGrad.addColorStop(1, 'rgba(110, 231, 183, 0)');
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(0, -10, 32, 0, Math.PI * 2);
  ctx.fill();

  // 2. Ground Contact Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 14, 12 * Math.abs(scaleX), 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Direction & Squash/Stretch
  ctx.scale(facingRight ? scaleX : -scaleX, scaleY);

  // Action dynamics
  let bodyTilt = 0;
  let capeSway = Math.sin(animTimer * 10) * 4;
  let antennaWiggle = Math.sin(animTimer * 8) * 0.15;

  if (action === 'run') {
    bodyTilt = 0.12;
    capeSway = Math.sin(animTimer * 16) * 7;
  } else if (action === 'jump') {
    bodyTilt = -0.08;
    capeSway = 8;
    antennaWiggle = -0.25;
  } else if (action === 'dash') {
    bodyTilt = 0.35;
    capeSway = 14;
  } else if (action === 'glide') {
    capeSway = Math.sin(animTimer * 6) * 3;
    antennaWiggle = Math.sin(animTimer * 6) * 0.1;
  }

  ctx.rotate(bodyTilt);

  // 4. Leaf Cape (Trailing behind)
  ctx.save();
  ctx.fillStyle = '#4ADE80';
  ctx.strokeStyle = '#16A34A';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-6, -6);
  ctx.quadraticCurveTo(-14 - capeSway, -2, -18 - capeSway, 8);
  ctx.quadraticCurveTo(-10, 12, -2, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Leaf vein detail
  ctx.strokeStyle = 'rgba(22, 163, 74, 0.6)';
  ctx.beginPath();
  ctx.moveTo(-6, -4);
  ctx.quadraticCurveTo(-12 - capeSway * 0.6, 2, -16 - capeSway, 6);
  ctx.stroke();
  ctx.restore();

  // 5. Bioluminescent Antennae
  ctx.save();
  // Left Antenna
  ctx.strokeStyle = '#FDE047';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-4, -18);
  ctx.quadraticCurveTo(-10 + antennaWiggle * 10, -28, -8 + antennaWiggle * 15, -34);
  ctx.stroke();
  // Left Glowing Bulb
  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  ctx.arc(-8 + antennaWiggle * 15, -34, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // Right Antenna
  ctx.beginPath();
  ctx.moveTo(4, -18);
  ctx.quadraticCurveTo(8 - antennaWiggle * 10, -28, 11 - antennaWiggle * 15, -33);
  ctx.stroke();
  // Right Glowing Bulb
  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  ctx.arc(11 - antennaWiggle * 15, -33, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Main Spirit Body (Teardrop Glow Capsule)
  const bodyGrad = ctx.createLinearGradient(0, -22, 0, 12);
  bodyGrad.addColorStop(0, '#E0FAFF');
  bodyGrad.addColorStop(1, '#A7F3D0');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-12, -20, 24, 30, [12, 12, 10, 10]);
  ctx.fill();
  ctx.stroke();

  // 7. Cheeks (Soft Pink Blush)
  ctx.fillStyle = 'rgba(255, 120, 150, 0.45)';
  ctx.beginPath();
  ctx.ellipse(-7, -4, 3.5, 2.2, 0, 0, Math.PI * 2);
  ctx.ellipse(7, -4, 3.5, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // 8. Eyes & Dual Catchlights
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.ellipse(-5, -8, 2.8, 4.2, 0, 0, Math.PI * 2);
  ctx.ellipse(5, -8, 2.8, 4.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Primary Catchlight
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-6, -10, 1.4, 0, Math.PI * 2);
  ctx.arc(4, -10, 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Secondary Micro Catchlight
  ctx.beginPath();
  ctx.arc(-4, -6.5, 0.7, 0, Math.PI * 2);
  ctx.arc(6, -6.5, 0.7, 0, Math.PI * 2);
  ctx.fill();

  // Cute Woodland Smile
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, -2.5, 2.5, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // 9. Special Ability Overlays
  // Wind Glide Parachute
  if (action === 'glide') {
    ctx.save();
    // Parachute cords
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-6, -18);
    ctx.lineTo(-18, -46);
    ctx.moveTo(6, -18);
    ctx.lineTo(18, -46);
    ctx.moveTo(0, -18);
    ctx.lineTo(0, -48);
    ctx.stroke();

    // Glowing Dandelion Blossom Canopy
    ctx.fillStyle = '#FEF08A';
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, -48, 22, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dandelion fluff ribs
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    for (let angle = Math.PI * 0.15; angle < Math.PI * 0.85; angle += 0.25) {
      ctx.beginPath();
      ctx.moveTo(0, -48);
      ctx.lineTo(Math.cos(Math.PI + angle) * 22, -48 - Math.sin(angle) * 22);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Leaf Dash Afterimage Streamers
  if (action === 'dash') {
    ctx.save();
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
    ctx.lineWidth = 2.5;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-16 * i, -10 + (i % 2) * 6);
      ctx.lineTo(-28 * i, -10 + (i % 2) * 6);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Feather Jump Wing Aura
  if (action === 'double_jump') {
    ctx.save();
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -8, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}
```

---

### 4.2 NPC 1: Barnaby the Snail (The Forest Guide)
```javascript
export function drawBarnaby(ctx, x, y, state = {}) {
  const { animTimer = 0, facingRight = true } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facingRight ? 1.0 : -1.0, 1.0);

  const breath = Math.sin(animTimer * 3) * 1.5;

  // Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 26, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 1. Snail Shell (Golden Spiral with Moss Tufts)
  const shellGrad = ctx.createRadialGradient(-6, -4 + breath, 4, -6, -4 + breath, 22);
  shellGrad.addColorStop(0, '#FDE68A');
  shellGrad.addColorStop(0.7, '#D97706');
  shellGrad.addColorStop(1, '#92400E');
  ctx.fillStyle = shellGrad;
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(-6, -4 + breath, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Shell Spiral Groove
  ctx.strokeStyle = 'rgba(146, 64, 14, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-6, -4 + breath, 11, 0, Math.PI * 1.5);
  ctx.stroke();

  // Moss Tufts on Shell
  ctx.fillStyle = '#22C55E';
  ctx.beginPath();
  ctx.arc(-14, -16 + breath, 5, 0, Math.PI * 2);
  ctx.arc(-8, -20 + breath, 6.5, 0, Math.PI * 2);
  ctx.arc(-2, -18 + breath, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Glowing Turquoise Spore Dots
  ctx.fillStyle = '#00F5D4';
  ctx.beginPath();
  ctx.arc(-8, -21 + breath, 1.8, 0, Math.PI * 2);
  ctx.arc(-14, -17 + breath, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // 2. Soft Snail Body & Foot
  ctx.fillStyle = '#FFE8D6';
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-22, 14);
  ctx.quadraticCurveTo(0, 16, 20, 14);
  ctx.quadraticCurveTo(24, 10, 20, 4);
  ctx.quadraticCurveTo(14, -8 + breath, 10, -12 + breath);
  ctx.quadraticCurveTo(0, -6 + breath, -4, 4);
  ctx.quadraticCurveTo(-14, 6, -22, 14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 3. Eye Stalks
  const eyeWobble = Math.sin(animTimer * 4) * 0.08;
  // Left Stalk
  ctx.fillStyle = '#FFE8D6';
  ctx.beginPath();
  ctx.roundRect(8, -24 + breath + eyeWobble * 8, 4, 14, [2, 2, 0, 0]);
  ctx.fill();
  ctx.stroke();
  // Left Eyeball
  ctx.beginPath();
  ctx.arc(10, -26 + breath + eyeWobble * 8, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(11, -26 + breath + eyeWobble * 8, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(10.2, -27 + breath + eyeWobble * 8, 1, 0, Math.PI * 2);
  ctx.fill();

  // Right Stalk
  ctx.fillStyle = '#FFE8D6';
  ctx.beginPath();
  ctx.roundRect(16, -22 + breath - eyeWobble * 8, 4, 12, [2, 2, 0, 0]);
  ctx.fill();
  ctx.stroke();
  // Right Eyeball
  ctx.beginPath();
  ctx.arc(18, -24 + breath - eyeWobble * 8, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(19, -24 + breath - eyeWobble * 8, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(18.2, -25 + breath - eyeWobble * 8, 1, 0, Math.PI * 2);
  ctx.fill();

  // 4. Rosy Cheeks & Smile
  ctx.fillStyle = 'rgba(255, 107, 129, 0.45)';
  ctx.beginPath();
  ctx.ellipse(14, -2 + breath, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(16, 2 + breath, 3, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // 5. Sky Blue Scarf with Leaf Clasp
  ctx.fillStyle = '#38BDF8';
  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(6, 4 + breath, 12, 5, 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#4ADE80';
  ctx.beginPath();
  ctx.arc(6, 6 + breath, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 4.3 NPC 2: Bramble the Hedgehog (The Underground Miner)
```javascript
export function drawBramble(ctx, x, y, state = {}) {
  const { animTimer = 0, facingRight = true } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facingRight ? 1.0 : -1.0, 1.0);

  const bob = Math.sin(animTimer * 4) * 1.2;

  // Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 22, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 1. Spiky Quills Mantle
  ctx.fillStyle = '#5C3D2E';
  ctx.strokeStyle = '#2E1911';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const numSpikes = 9;
  for (let i = 0; i < numSpikes; i++) {
    const angle = Math.PI * 0.75 + (i / (numSpikes - 1)) * Math.PI * 1.25;
    const rOuter = 24 + (i % 2) * 4;
    const rInner = 16;
    const xOuter = Math.cos(angle) * rOuter;
    const yOuter = Math.sin(angle) * rOuter - 2;
    const xInner = Math.cos(angle + 0.1) * rInner;
    const yInner = Math.sin(angle + 0.1) * rInner - 2;
    if (i === 0) ctx.moveTo(xOuter, yOuter);
    else ctx.lineTo(xOuter, yOuter);
    ctx.lineTo(xInner, yInner);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 2. Round Chubby Body & Snout
  ctx.fillStyle = '#FDE68A';
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-10, -12 + bob, 22, 24, [10, 14, 8, 8]);
  ctx.fill();
  ctx.stroke();

  // Pointed Snout
  ctx.beginPath();
  ctx.moveTo(8, -6 + bob);
  ctx.lineTo(19, -2 + bob);
  ctx.lineTo(8, 4 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Nose button
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(19, -2 + bob, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 3. Brass Magnifying Goggles (On Forehead)
  ctx.fillStyle = '#D97706';
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(2, -15 + bob, 6, 0, Math.PI * 2);
  ctx.arc(11, -15 + bob, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Goggle Lenses
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.arc(2, -15 + bob, 4, 0, Math.PI * 2);
  ctx.arc(11, -15 + bob, 4, 0, Math.PI * 2);
  ctx.fill();

  // Lens Glint
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0.8, -16.5 + bob, 1.2, 0, Math.PI * 2);
  ctx.arc(9.8, -16.5 + bob, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // 4. Eyes & Blush
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(6, -6 + bob, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(5.2, -7 + bob, 0.9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.beginPath();
  ctx.ellipse(3, -2 + bob, 3, 1.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. Miner Lantern in Hand
  const lanternSwing = Math.sin(animTimer * 4) * 0.15;
  ctx.save();
  ctx.translate(14, 4 + bob);
  ctx.rotate(lanternSwing);
  // Chain
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 6);
  ctx.stroke();
  // Lantern Cage
  ctx.fillStyle = '#374151';
  ctx.beginPath();
  ctx.roundRect(-5, 6, 10, 12, 2);
  ctx.fill();
  // Glowing Cyan Crystal Inside
  ctx.fillStyle = '#06B6D4';
  ctx.beginPath();
  ctx.roundRect(-3, 8, 6, 8, 1);
  ctx.fill();
  // Crystal Glow Halo
  const lGlow = ctx.createRadialGradient(0, 12, 2, 0, 12, 16);
  lGlow.addColorStop(0, 'rgba(6, 182, 212, 0.6)');
  lGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
  ctx.fillStyle = lGlow;
  ctx.beginPath();
  ctx.arc(0, 12, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}
```

---

### 4.4 NPC 3: Pip the Owl (The High Sage)
```javascript
export function drawPip(ctx, x, y, state = {}) {
  const { animTimer = 0, facingRight = true } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facingRight ? 1.0 : -1.0, 1.0);

  const breath = Math.sin(animTimer * 2.5) * 1.5;

  // Branch Perch
  ctx.fillStyle = '#854D0E';
  ctx.strokeStyle = '#451A03';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-24, 14, 48, 8, [4, 4, 4, 4]);
  ctx.fill();
  ctx.stroke();

  // 1. Owl Body Mantle (Midnight Violet)
  ctx.fillStyle = '#1E1B4B';
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.roundRect(-16, -26 + breath, 32, 40, [16, 16, 12, 12]);
  ctx.fill();
  ctx.stroke();

  // Gold Star Speckles on Wings
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  ctx.arc(-11, -8 + breath, 1.2, 0, Math.PI * 2);
  ctx.arc(-8, 2 + breath, 1.0, 0, Math.PI * 2);
  ctx.arc(11, -8 + breath, 1.2, 0, Math.PI * 2);
  ctx.arc(8, 2 + breath, 1.0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Fluffy Breast Down (Pearl Cream)
  ctx.fillStyle = '#F1F5F9';
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, -2 + breath, 10, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Chevron Down Feathers
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.2;
  for (let dy of [-4, 1, 6]) {
    ctx.beginPath();
    ctx.moveTo(-5, dy + breath);
    ctx.lineTo(0, dy + 3 + breath);
    ctx.lineTo(5, dy + breath);
    ctx.stroke();
  }

  // 3. Tufted Feather Eyebrows
  ctx.fillStyle = '#D97706';
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 1.5;
  // Left Ear Tuft
  ctx.beginPath();
  ctx.moveTo(-10, -22 + breath);
  ctx.lineTo(-18, -36 + breath);
  ctx.lineTo(-6, -25 + breath);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Right Ear Tuft
  ctx.beginPath();
  ctx.moveTo(10, -22 + breath);
  ctx.lineTo(18, -36 + breath);
  ctx.lineTo(6, -25 + breath);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 4. Golden Spectacles & Wise Eyes
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(-6, -14 + breath, 6.5, 0, Math.PI * 2);
  ctx.arc(6, -14 + breath, 6.5, 0, Math.PI * 2);
  ctx.stroke();
  // Spectacle bridge
  ctx.beginPath();
  ctx.moveTo(-0.5, -14 + breath);
  ctx.lineTo(0.5, -14 + breath);
  ctx.stroke();

  // Amber Pupils
  ctx.fillStyle = '#78350F';
  ctx.beginPath();
  ctx.arc(-6, -14 + breath, 4.5, 0, Math.PI * 2);
  ctx.arc(6, -14 + breath, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(-6, -14 + breath, 2.5, 0, Math.PI * 2);
  ctx.arc(6, -14 + breath, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Catchlights
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-7, -15.5 + breath, 1.2, 0, Math.PI * 2);
  ctx.arc(5, -15.5 + breath, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Tiny Golden Beak
  ctx.fillStyle = '#F59E0B';
  ctx.strokeStyle = '#B45309';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-2.5, -9 + breath);
  ctx.lineTo(2.5, -9 + breath);
  ctx.lineTo(0, -4 + breath);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 5. Perched Claws
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(-6, 14, 2.5, 0, Math.PI * 2);
  ctx.arc(-3, 14, 2.5, 0, Math.PI * 2);
  ctx.arc(3, 14, 2.5, 0, Math.PI * 2);
  ctx.arc(6, 14, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 4.5 Enemy 1: Bramble Slime (Patrol Ground Hazard)
```javascript
export function drawBrambleSlime(ctx, x, y, state = {}) {
  const { animTimer = 0, facingRight = true, squish = 1.0 } = state;
  ctx.save();
  ctx.translate(x, y);

  const hop = Math.abs(Math.sin(animTimer * 5));
  const sX = (1.0 + (1 - hop) * 0.2) * (facingRight ? 1 : -1);
  const sY = (0.8 + hop * 0.4) * squish;

  // Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 12, 16 * Math.abs(sX), 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(sX, sY);

  // 1. Translucent Jelly Slime Body
  const slimeGrad = ctx.createRadialGradient(0, -6, 2, 0, -6, 18);
  slimeGrad.addColorStop(0, '#4ADE80');
  slimeGrad.addColorStop(0.7, '#22C55E');
  slimeGrad.addColorStop(1, '#15803D');
  ctx.fillStyle = slimeGrad;
  ctx.strokeStyle = '#14532D';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-14, -18, 28, 28, [14, 14, 8, 8]);
  ctx.fill();
  ctx.stroke();

  // 2. Internal Glowing Thorn Seed Core
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // 3. Spiky Bramble Horns on Top
  ctx.fillStyle = '#166534';
  ctx.beginPath();
  ctx.moveTo(-8, -16);
  ctx.lineTo(-12, -24);
  ctx.lineTo(-4, -18);
  ctx.moveTo(8, -16);
  ctx.lineTo(12, -24);
  ctx.lineTo(4, -18);
  ctx.fill();

  // 4. Angry-Cute Bead Eyes
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(-5, -8, 2.5, 0, Math.PI * 2);
  ctx.arc(5, -8, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlights
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-6, -9, 0.8, 0, Math.PI * 2);
  ctx.arc(4, -9, 0.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 4.6 Enemy 2: Shadow Wisp (Sinusoidal Aerial Hazard)
```javascript
export function drawShadowWisp(ctx, x, y, state = {}) {
  const { animTimer = 0 } = state;
  ctx.save();
  ctx.translate(x, y);

  const pulse = Math.sin(animTimer * 6) * 2;
  const wingFlap = Math.sin(animTimer * 12) * 0.4;

  // 1. Purple Mist Aura Glow
  const wispGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, 24 + pulse);
  wispGlow.addColorStop(0, 'rgba(192, 132, 252, 0.6)');
  wispGlow.addColorStop(0.5, 'rgba(126, 34, 206, 0.3)');
  wispGlow.addColorStop(1, 'rgba(126, 34, 206, 0)');
  ctx.fillStyle = wispGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 24 + pulse, 0, Math.PI * 2);
  ctx.fill();

  // 2. Translucent Spirit Wings
  ctx.fillStyle = 'rgba(216, 180, 254, 0.55)';
  ctx.strokeStyle = '#A855F7';
  ctx.lineWidth = 1.2;

  // Left Wing
  ctx.save();
  ctx.rotate(-0.3 + wingFlap);
  ctx.beginPath();
  ctx.ellipse(-14, -6, 12, 6, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Right Wing
  ctx.save();
  ctx.rotate(0.3 - wingFlap);
  ctx.beginPath();
  ctx.ellipse(14, -6, 12, 6, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 3. Central Twilight Spirit Orb
  const orbGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 10);
  orbGrad.addColorStop(0, '#F3E8FF');
  orbGrad.addColorStop(0.6, '#9333EA');
  orbGrad.addColorStop(1, '#581C87');
  ctx.fillStyle = orbGrad;
  ctx.strokeStyle = '#3B0764';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 4. Glowing Cyclops Eye
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  ctx.ellipse(0, -1, 3.5, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1E1B4B';
  ctx.beginPath();
  ctx.ellipse(0, -1, 1.8, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 4.7 Enemy 3: Thorn Beetle (Armored Charger)
```javascript
export function drawThornBeetle(ctx, x, y, state = {}) {
  const { animTimer = 0, facingRight = true, isCharging = false } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facingRight ? 1.0 : -1.0, 1.0);

  const legStep = Math.sin(animTimer * (isCharging ? 24 : 12)) * 3;

  // Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(0, 14, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 1. Skittering Bug Legs
  ctx.strokeStyle = '#271003';
  ctx.lineWidth = 2;
  for (let i = -1; i <= 1; i++) {
    const lx = i * 8;
    const lOffset = (i % 2 === 0 ? legStep : -legStep);
    ctx.beginPath();
    ctx.moveTo(lx, 6);
    ctx.lineTo(lx - 4, 10);
    ctx.lineTo(lx - 2 + lOffset, 14);
    ctx.stroke();
  }

  // 2. Armored Shell Carapace
  const shellGrad = ctx.createLinearGradient(-14, -14, 14, 10);
  shellGrad.addColorStop(0, '#92400E');
  shellGrad.addColorStop(0.7, '#78350F');
  shellGrad.addColorStop(1, '#451A03');
  ctx.fillStyle = shellGrad;
  ctx.strokeStyle = '#1C0A00';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.roundRect(-14, -10, 24, 18, [12, 8, 4, 6]);
  ctx.fill();
  ctx.stroke();

  // 3. Dorsal Thorn Spikes
  ctx.fillStyle = '#B91C1C';
  ctx.strokeStyle = '#7F1D1D';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-10, -10);
  ctx.lineTo(-8, -17);
  ctx.lineTo(-4, -10);
  ctx.moveTo(-2, -10);
  ctx.lineTo(0, -18);
  ctx.lineTo(4, -10);
  ctx.fill();
  ctx.stroke();

  // 4. Head & Rhino Horn
  ctx.fillStyle = '#451A03';
  ctx.beginPath();
  ctx.roundRect(8, -6, 8, 12, [2, 6, 6, 2]);
  ctx.fill();
  ctx.stroke();

  // Sharp Horn
  ctx.fillStyle = '#78350F';
  ctx.beginPath();
  ctx.moveTo(14, -2);
  ctx.lineTo(24, -8);
  ctx.lineTo(16, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 5. Glowing Red Charging Eye
  ctx.fillStyle = isCharging ? '#EF4444' : '#F97316';
  ctx.beginPath();
  ctx.arc(12, -2, isCharging ? 2.8 : 2.0, 0, Math.PI * 2);
  ctx.fill();

  if (isCharging) {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(11.5, -2.5, 1.0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
```

---

### 4.8 Ability Shrines, Runes & Gating Obstacles

#### 1. Ability Shrines & Runes
```javascript
export function drawAbilityShrine(ctx, x, y, abilityType, state = {}) {
  const { animTimer = 0, isCollected = false } = state;
  ctx.save();
  ctx.translate(x, y);

  const runeFloat = Math.sin(animTimer * 3) * 4;

  // 1. Ancient Stone Pedestal
  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-20, 10, 40, 14, [4, 4, 2, 2]);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(-14, -2, 28, 14, [2, 2, 2, 2]);
  ctx.fill();
  ctx.stroke();

  // 2. Light Pillar Beam
  if (!isCollected) {
    const beamGrad = ctx.createLinearGradient(0, 8, 0, -48);
    let beamColor = 'rgba(52, 211, 153, 0.4)'; // Feather Green
    if (abilityType === 'leaf_dash') beamColor = 'rgba(251, 191, 36, 0.4)'; // Amber Leaf
    if (abilityType === 'wind_glide') beamColor = 'rgba(56, 189, 248, 0.4)'; // Cyan Wind

    beamGrad.addColorStop(0, beamColor);
    beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(-16, 8);
    ctx.lineTo(-24, -48);
    ctx.lineTo(24, -48);
    ctx.lineTo(16, 8);
    ctx.closePath();
    ctx.fill();

    // 3. Floating Animated Rune Glyph
    ctx.save();
    ctx.translate(0, -26 + runeFloat);

    if (abilityType === 'feather_jump') {
      // Emerald Feather Wing Rune
      ctx.fillStyle = '#10B981';
      ctx.strokeStyle = '#ECFDF5';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 14, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (abilityType === 'leaf_dash') {
      // Spinning Amber Leaf Blade Rune
      ctx.rotate(animTimer * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.strokeStyle = '#FFFBEB';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.quadraticCurveTo(10, 0, 0, 12);
      ctx.quadraticCurveTo(-10, 0, 0, -12);
      ctx.fill();
      ctx.stroke();
    } else if (abilityType === 'wind_glide') {
      // Radiant Dandelion Blossom Rune
      ctx.fillStyle = '#38BDF8';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * 12, Math.sin(a) * 12);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  ctx.restore();
}
```

#### 2. Spore Bouncer (Jump Pad)
```javascript
export function drawSporeBouncer(ctx, x, y, state = {}) {
  const { bounceTimer = 0 } = state;
  ctx.save();
  ctx.translate(x, y);

  const squash = bounceTimer > 0 ? Math.sin(bounceTimer * Math.PI) * 0.35 : 0;

  // Mushroom Stem
  ctx.fillStyle = '#D8F3DC';
  ctx.strokeStyle = '#1F2937';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-8, -4 + squash * 6, 16, 18 - squash * 6, [2, 2, 4, 4]);
  ctx.fill();
  ctx.stroke();

  // Bouncy Turquoise Cap
  ctx.save();
  ctx.scale(1.0 + squash * 0.3, 1.0 - squash * 0.4);
  const capGrad = ctx.createLinearGradient(0, -22, 0, 0);
  capGrad.addColorStop(0, '#00F5D4');
  capGrad.addColorStop(1, '#05B89A');
  ctx.fillStyle = capGrad;
  ctx.strokeStyle = '#0F766E';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(0, -4, 20, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cap Dots
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-8, -12, 3, 0, Math.PI * 2);
  ctx.arc(8, -12, 3, 0, Math.PI * 2);
  ctx.arc(0, -17, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}
```

#### 3. Brittle Crystal Barrier (Dash Breakable Gate)
```javascript
export function drawCrystalBarrier(ctx, x, y, width, height, state = {}) {
  const { isBroken = false, shatterProgress = 0 } = state;
  if (isBroken) return;

  ctx.save();
  ctx.translate(x, y);

  // Shimmering Amethyst Crystal Pillar
  const cGrad = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
  cGrad.addColorStop(0, '#70D6FF');
  cGrad.addColorStop(0.5, '#BE95C4');
  cGrad.addColorStop(1, '#9333EA');
  ctx.fillStyle = cGrad;
  ctx.strokeStyle = '#38184C';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-width / 2, -height / 2, width, height, 4);
  ctx.fill();
  ctx.stroke();

  // Glowing Fissure Crack Lines
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -height / 2);
  ctx.lineTo(-4, -height / 4);
  ctx.lineTo(4, 0);
  ctx.lineTo(-3, height / 4);
  ctx.lineTo(0, height / 2);
  ctx.stroke();

  // Prismatic Glint Star
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 4.9 Checkpoints & Collectibles

#### 1. Ancient Waystone Checkpoint
```javascript
export function drawWaystone(ctx, x, y, state = {}) {
  const { isActive = false, animTimer = 0 } = state;
  ctx.save();
  ctx.translate(x, y);

  const runePulse = isActive ? Math.sin(animTimer * 4) * 0.2 + 0.8 : 0.2;

  // 1. Base Stele Stone
  ctx.fillStyle = '#1E293B';
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-16, 24);
  ctx.lineTo(-12, -28);
  ctx.lineTo(0, -36);
  ctx.lineTo(12, -28);
  ctx.lineTo(16, 24);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 2. Carved Rune Glyphs
  ctx.strokeStyle = isActive ? `rgba(34, 211, 238, ${runePulse})` : '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  // Spiral Rune
  ctx.arc(0, -14, 6, 0, Math.PI * 1.5);
  ctx.moveTo(0, -6);
  ctx.lineTo(0, 14);
  ctx.moveTo(-6, 4);
  ctx.lineTo(6, 4);
  ctx.stroke();

  // 3. Activated Radiant Cyan Fire & Healing Aura
  if (isActive) {
    const aura = ctx.createRadialGradient(0, -14, 4, 0, -14, 32);
    aura.addColorStop(0, 'rgba(34, 211, 238, 0.45)');
    aura.addColorStop(1, 'rgba(34, 211, 238, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, -14, 32, 0, Math.PI * 2);
    ctx.fill();

    // Beacon Top Flame
    ctx.fillStyle = '#67E8F9';
    ctx.beginPath();
    ctx.arc(0, -36, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
```

#### 2. Ancient Sun Seed Collectible (8 Total)
```javascript
export function drawSunSeed(ctx, x, y, state = {}) {
  const { animTimer = 0 } = state;
  ctx.save();
  ctx.translate(x, y);

  const bob = Math.sin(animTimer * 4) * 3;
  const rot = animTimer * 1.5;

  // 1. Radiant Golden Corona Halo
  const corona = ctx.createRadialGradient(0, bob, 4, 0, bob, 22);
  corona.addColorStop(0, 'rgba(253, 224, 71, 0.6)');
  corona.addColorStop(0.6, 'rgba(245, 158, 11, 0.25)');
  corona.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = corona;
  ctx.beginPath();
  ctx.arc(0, bob, 22, 0, Math.PI * 2);
  ctx.fill();

  // 2. Rotating 4-Ray Petal Star
  ctx.save();
  ctx.translate(0, bob);
  ctx.rotate(rot);
  ctx.fillStyle = '#FEF08A';
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(4, -6, 0, -14);
    ctx.quadraticCurveTo(-4, -6, 0, 0);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // 3. Central Luminous Seed Core
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, bob, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glint sparkle
  ctx.fillStyle = '#FEF08A';
  ctx.beginPath();
  ctx.arc(-1.5, bob - 1.5, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

## 5. DialogueBox System & Avatar Layout

### 5.1 Responsive Zero-Overflow Dialogue Box

```
┌────────────────────────────────────────────────────────────────────────┐
│ ┌────────┐  [ BARNABY THE SNAIL ]                         [ 1 / 3 ]   │
│ │  AVATAR│  "Ah, wake up, little Lumi... The Great Elder Tree has     │
│ │  FRAME │   grown terribly cold and dark. Take heart and journey     │
│ │ (64x64)│   west to the Mossy Caverns!"                     [E ➔]    │
│ └────────┘                                                             │
└────────────────────────────────────────────────────────────────────────┘
```

- **Container Specs**:
  - `position`: Fixed bottom-center (`bottom: 16px; left: 50%; transform: translateX(-50%)`).
  - `width`: 92% (max `720px`), height `112px`.
  - `background`: `rgba(15, 23, 42, 0.92)` with `backdrop-filter: blur(12px)`.
  - `border`: `2px solid #38BDF8`, `border-radius: 16px`.
  - `box-shadow`: `0 12px 32px rgba(0, 0, 0, 0.45)`.
- **Character Name Tag**:
  - Pill shape (`padding: 3px 12px`, `background: #0284C7`, `color: #FFFFFF`, `font-size: 13px`, `font-weight: 800`).
- **Typewriter Text Area**:
  - `font-family`: `'Fredoka', 'Nunito', system-ui, sans-serif`.
  - `font-size`: `16px`, `line-height: 1.45`, `color: #F8FAFC`.
  - Max text length tuned to **3 lines strictly** (under 140 chars per dialogue page) ensuring zero overflowing on any screen aspect ratio.
- **Advance Prompt**:
  - Bouncing animated pill in bottom-right (`[E ➔]` on Desktop, `[TAP ➔]` on Mobile).

### 5.2 NPC Avatar Bust Renderer
```javascript
export function drawAvatar(ctx, x, y, size, speakerId) {
  ctx.save();
  ctx.translate(x, y);

  // Avatar rounded background card
  ctx.fillStyle = '#1E293B';
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, 12);
  ctx.fill();
  ctx.stroke();

  // Clip inside avatar box
  ctx.beginPath();
  ctx.roundRect(2, 2, size - 4, size - 4, 10);
  ctx.clip();

  // Render centered speaker bust
  ctx.translate(size / 2, size / 2 + 6);
  if (speakerId === 'barnaby_snail') {
    drawBarnaby(ctx, 0, 0, { animTimer: 0, facingRight: true });
  } else if (speakerId === 'bramble_hedgehog') {
    drawBramble(ctx, 0, 0, { animTimer: 0, facingRight: true });
  } else if (speakerId === 'pip_owl') {
    drawPip(ctx, 0, 0, { animTimer: 0, facingRight: true });
  } else if (speakerId === 'lumi') {
    drawLumi(ctx, 0, 0, { animTimer: 0, facingRight: true });
  }

  ctx.restore();
}
```

---

## 6. HUD, UI Theme & Map Architecture

### 6.1 HUD Layout (Metroidvania Top Bar)
```
┌────────────────────────────────────────────────────────────────────────┐
│ [♥][♥][♥]               ☀️ SEEDS: 4 / 8               [🕊️][🍃][🪂]     │
│ (3 Forest Hearts)       (Sun Seed Tracker)           (Abilities)       │
│                                                                        │
│                                                                        │
│                      [ AREA: MOSSY CAVERNS ]                           │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Forest Hearts (Top-Left)**:
   - 3 Luminous Heart Bulbs (`#F43F5E` filled with glowing aura, `#334155` empty silhouette).
2. **Seed Tracker (Top-Center)**:
   - High-contrast frosted glass pill with golden sun icon and crisp text `☀️ 4 / 8` (`#FDE047`, 16px bold).
3. **Abilities Badges (Top-Right)**:
   - Mini rounded icon sockets for Feather Jump (Wing `#34D399`), Leaf Dash (Leaf `#FBBF24`), Wind Glide (Dandelion `#38BDF8`). Unlocked badges illuminate; locked badges display faint gray silhouettes.
4. **Zone Name Banner**:
   - Slides smoothly into top-center on room transition, stays for 2.2s, then fades out with subtle letter spacing animation.

### 6.2 In-Game Pause & Mini-Map Display
- Interactive grid matrix representing all 7 interconnected zones.
- Visited rooms rendered with their respective theme tint.
- Glowing cyan beacon marks Lumi's exact coordinate.
- Sun seed icons mark locations where seeds remain or have been acquired.

---

## 7. Particle Systems & Juice Manifest

| Particle System | Color Palette | Trigger Condition | Motion & Physics |
| :--- | :--- | :--- | :--- |
| **Spore Burst** | `#00F5D4`, `#A7F3D0` | Bouncing on Spore Mushroom | 12 radial particles (`v: 60-120 px/s`, `life: 0.4s`, gravity: `40 px/s²`) |
| **Crystal Shards** | `#70D6FF`, `#BE95C4`, `#FFFFFF` | Dashing through Brittle Wall | 16 angular polygon fragments bursting outward with spin |
| **Emerald Leaf Trail** | `#4ADE80`, `#22C55E`, `#86EFAC` | During Leaf Dash burst | 6 swirling leaf particles spawning along dash path |
| **Feather Jump Flurry** | `#34D399`, `#ECFDF5` | Activating Double Jump | 8 fluttering emerald feather motes drifting downward |
| **Sun Seed Glory** | `#FEF08A`, `#F59E0B`, `#FFFFFF` | Collecting an Ancient Sun Seed | 24 golden star sparkles bursting radially with floating `+1 SEED` |
| **Thermal Wind Streaks**| `rgba(56, 189, 248, 0.45)` | Inside Windy Chasm Updraft | Vertical rising stream ribbons lifting player |
| **Waystone Healing Ring**| `#22D3EE`, `#67E8F9` | Activating Waystone Checkpoint | Expanding concentric cyan rings healing Hearts |
| **Great Bloom Climax** | `#FFB8C6`, `#FEF08A`, `#34D399` | Restoring 8 Seeds to Elder Tree | Screen-filling celebration confetti and radiant blooming petals |

---

## 8. Web Audio API Procedural Synthesizer Profiles

Zero external audio asset dependencies. All 11 sound effects are synthesized via Web Audio nodes:

1. **Jump Chirp**: Sine sweep `420 Hz &rarr; 680 Hz` (0.12s, soft attack/decay).
2. **Feather Double Jump**: Dual triangle harmonic chirp `580 Hz &rarr; 920 Hz` (0.15s) with light white-noise flutter.
3. **Leaf Dash Burst**: Crisp wind whoosh with resonant bandpass filter `900 Hz &rarr; 2600 Hz` (0.22s).
4. **Wind Glide Hum**: Warm low-pass filtered triangle wave (`320 Hz`) with gentle tremolo, sustained while gliding.
5. **Sun Seed Pickup**: Ascending 4-note major arpeggio chime ($C_5 \rightarrow E_5 \rightarrow G_5 \rightarrow C_6$, `523 Hz &rarr; 1046 Hz`).
6. **Waystone Activation**: Resonant cathedral chord ($D_4, F^\sharp_4, A_4, D_5$) with lush 1.8s reverb decay.
7. **Spore Mushroom Boing**: Frequency-modulated sine boing `220 Hz &rarr; 540 Hz &rarr; 380 Hz` (0.24s).
8. **Crystal Wall Shatter**: High-frequency noise burst + fast descending glass pitch `1800 Hz &rarr; 240 Hz` (0.28s).
9. **Damage Thud**: Wooden low thud (`140 Hz &rarr; 60 Hz`) with subtle noise crunch and 100ms screen shake.
10. **Dialogue Synth Blips**:
    - *Barnaby*: Warm low-pitch marimba blip (`180 Hz - 220 Hz`).
    - *Bramble*: Raspy percussive woodblock click (`280 Hz - 320 Hz`).
    - *Pip*: Melodic high-register pan-flute whistle (`540 Hz - 720 Hz`).
11. **Great Bloom Climax Fanfare**: Glorious multi-voice victory arpeggio chord progression with soaring bell chimes.
