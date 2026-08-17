# Art Direction & Visual Design Specification: Tidebound
**Version**: 1.0.0  
**Target Resolution**: 720 × 450 (16:9 Aspect Ratio, Native 2D Canvas Procedural Vector Rendering)  
**Author**: Art Director Subagent — AI Game Factory  

---

## 1. Visual Identity & Aesthetic Philosophy

### 1.1 Core Aesthetic: Cozy Oceanic Adventure
**Tidebound** embraces a vibrant, joyful, and tactile 2D vector cartoon art style celebrating the wonders of tropical archipelagoes, forgotten sunken ruins, and bioluminescent sea caverns.

- **Primary Tone**: Whimsical, sunny, adventurous, refreshing, and responsive.
- **Silhouette Philosophy**: Chunky, rounded geometric forms (`roundRect`, `arc`, `ellipse`, `bezierCurveTo`) with friendly organic curves. Sharp hostile corners are reserved strictly for dangerous hazards (sea anemones, urchin spikes, crusher claws).
- **Outlines & Line Weight**:
  - Main characters and key interactables feature solid, anti-aliased dark slate-indigo contours (`#1D3557` or `#1E293B`, $2.0\text{px}$ to $2.5\text{px}$ stroke width) — avoiding harsh pitch black to keep the palette airy and soft.
  - Background elements utilize soft lineless fills or subtle tinted borders (`1.0\text{px}`) to maintain clear foreground-background separation.
- **Drop Shadows & Spatial Anchoring**:
  - Grounded actors and standing props cast subtle translucent elliptical contact shadows (`rgba(10, 22, 16, 0.22)`) directly below their feet.
  - Floating collectibles (Sun Pearls, Golden Nautilus Shells) cast dynamic pulsing shadows on platforms beneath them.
- **Atmospheric Lighting & Parallax Layers**:
  - **Layer 0 (Far Backdrop - 0.08x scroll)**: Distant island silhouettes, dramatic horizon clouds, and gradient skybox.
  - **Layer 1 (Mid Backdrop - 0.25x scroll)**: Ancient ruin aqueducts, palm canopies, coral spires, and ambient mist.
  - **Layer 2 (Foreground Gameplay - 1.00x scroll)**: Crisp collision terrain, enemies, collectibles, NPCs, and interactive shrines.
  - **Layer 3 (Foreground Overlay - 1.15x scroll)**: Drifting seafoam motes, sunbeams, foreground palm leaves, and atmospheric weather particles.

---

## 2. Global Color Tokens & Palette Architecture

```
+-----------------------------------------------------------------------------------------+
|                               GLOBAL COLOR TOKEN SYSTEM                                |
+------------------+------------------+------------------+------------------+-------------+
|    TURQUOISE     |     SEAFOAM      |   NAUTILUS GOLD  |   CORAL CRUSH    | DEEP INDIGO |
|     #2EC4B6      |     #80ED99      |     #FFD166      |     #E76F51      |   #1D3557   |
+------------------+------------------+------------------+------------------+-------------+
|   BIOLUM CYAN    |   PEARL WHITE    |   SUNSET AMBER   |   CRIMSON REEF   | ABYSS NAVY  |
|     #00F5D4      |     #E0FBFC      |     #F77F00      |     #9B2226      |   #03045E   |
+------------------+------------------+------------------+------------------+-------------+
```

```javascript
export const COLOR_TOKENS = {
  // Brand / Hero Archetype
  heroBody: '#2EC4B6',
  heroBodyShade: '#20A396',
  heroCape: '#80ED99',
  heroCapeShadow: '#57CC99',
  heroBeret: '#FFD166',
  heroBeretRidge: '#F4A261',
  heroAntennaPearl: '#E0FBFC',
  heroAntennaGlow: '#00F5D4',
  heroBlush: 'rgba(255, 138, 174, 0.45)',
  heroEyePupil: '#1D3557',
  heroEyeCatchlight: '#FFFFFF',

  // Outlines & Shadows
  outlineDark: '#1D3557',
  outlineMedium: '#264653',
  outlineSoft: '#3D5A80',
  dropShadow: 'rgba(10, 22, 16, 0.22)',
  glowShadow: 'rgba(0, 245, 212, 0.35)',

  // Biome Themes
  palmBeach: {
    skyTop: '#56B4D3',
    skyBottom: '#E4F5FC',
    sandLight: '#FCEADE',
    sandMain: '#F4A261',
    sandDark: '#E76F51',
    palmTrunk: '#A47148',
    palmFrond: '#2A9D8F',
    palmFrondLight: '#48CAE4',
    waterShallow: 'rgba(46, 196, 182, 0.65)',
    waterFoam: '#FFFFFF',
    ambientGlow: 'rgba(255, 209, 102, 0.25)'
  },
  overgrownRuins: {
    skyTop: '#1E3A34',
    skyBottom: '#112421',
    stoneLight: '#577590',
    stoneMain: '#264653',
    stoneDark: '#1B3039',
    mossGreen: '#43AA8B',
    aquaTrim: '#2EC4B6',
    sunkenGold: '#F9C74F',
    waterAqueduct: 'rgba(72, 202, 228, 0.55)',
    ambientGlow: 'rgba(46, 196, 182, 0.20)'
  },
  floodedCaves: {
    skyTop: '#0B092B',
    skyBottom: '#0D1B2A',
    rockLight: '#2B2D42',
    rockMain: '#1B263B',
    rockDark: '#0D1B2A',
    coralCyan: '#00F5D4',
    coralViolet: '#9B5DE5',
    crystalPink: '#F72585',
    waterLagoon: 'rgba(3, 4, 94, 0.75)',
    ambientGlow: 'rgba(0, 245, 212, 0.40)'
  },
  windCliffs: {
    skyTop: '#1D3557',
    skyBottom: '#0077B6',
    cliffSlate: '#3D5A80',
    cliffBase: '#293241',
    cloudLedge: '#FFFFFF',
    cloudShade: '#CAF0F8',
    sunsetGold: '#F77F00',
    sunsetCoral: '#E76F51',
    windStream: 'rgba(202, 240, 248, 0.35)',
    ambientGlow: 'rgba(247, 127, 0, 0.25)'
  },
  lighthouseIsland: {
    skyTop: '#03045E',
    skyBottom: '#240046',
    coliseumMarble: '#FDFFFC',
    coliseumStone: '#264653',
    coliseumGold: '#FFD166',
    beaconCyan: '#4CC9F0',
    beaconAmber: '#FFB703',
    waterAbyss: 'rgba(2, 62, 138, 0.85)',
    ambientGlow: 'rgba(255, 209, 102, 0.45)'
  },

  // Collectibles & UI
  sunPearl: '#FDFFFC',
  sunPearlRim: '#FFD166',
  sunPearlCore: '#E0FBFC',
  nautilusShell: '#FFD166',
  nautilusShellRidge: '#F4A261',
  loreMedallion: '#FFB703',
  loreMedallionCore: '#00F5D4',
  hudHeartFull: '#FF4D6D',
  hudHeartEmpty: '#3A0CA3',
  dialogueBackplate: '#0A1610',
  dialogueBorder: '#00F5D4'
};
```

---

## 3. Protagonist Design & Drawing Recipe: Cori the Reef Sprite

```
                                ( * )  ( * )  <-- Glowing Pearl Antennae (#E0FBFC)
                                  \     /
                                [===---===]   <-- Nautilus Shell Beret (#FFD166, #F4A261)
                              (  o       o  ) <-- Expressive Eyes with Dual Catchlights
                            (  :   (#)   :  ) <-- Cheeks (#FF8AAE) & Smile
                           /=================\ <-- Seafoam Fluttering Cape (#80ED99)
                          |  [#2EC4B6 Body]  |
                           \____/       \____/ <-- Little Flippers / Feet
                               (========)     <-- Soft Contact Drop Shadow
```

### 3.1 Anatomical & Cosmetic Specs
- **Sprite Dimensions**: $24 \times 32\text{px}$ canvas bounding box ($18 \times 26\text{px}$ physics collision box).
- **Body**: Vibrant turquoise (`#2EC4B6`) rounded capsule torso with a soft mint gradient towards the bottom (`#80ED99`).
- **Nautilus Beret**: Golden conch beret (`#FFD166`) cocked playfully to the right ($14\text{px}$ wide, $10\text{px}$ high) with embossed spiral ridges (`#F4A261`).
- **Pearl Antennae**: Two slender turquoise stalks culminating in luminescent iridescent spheres (`#E0FBFC`) with an animated radial pulse (`#00F5D4`).
- **Seafoam Cape**: Trailing leaf-fin cape (`#80ED99`) that ripples dynamically based on horizontal velocity and airborne status.
- **Facial Features**: Large, glossy dark-indigo pupils (`#1D3557`) with dual white catchlights, subtle rosy cheek ovals, and responsive smile/gasp expressions.

### 3.2 Procedural Vector Drawing Recipe

```javascript
/**
 * Procedural Vector Renderer for Cori the Reef Sprite
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x Screen center X coordinate
 * @param {number} y Screen center Y coordinate (foot contact level)
 * @param {Object} state Character animation state
 */
export function drawCori(ctx, x, y, state = {}) {
  const {
    vx = 0,
    vy = 0,
    facing = 1, // 1 = right, -1 = left
    isGrounded = true,
    isDashing = false,
    isHurt = false,
    dashTimer = 0,
    animTime = 0
  } = state;

  ctx.save();
  ctx.translate(x, y);

  // 1. Ground Drop Shadow (Scales with air distance)
  if (isGrounded) {
    ctx.fillStyle = 'rgba(10, 22, 16, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Directional & Kinematic Squash & Stretch
  ctx.scale(facing, 1);
  let scaleX = 1;
  let scaleY = 1;

  if (isDashing) {
    scaleX = 1.35;
    scaleY = 0.75;
  } else if (!isGrounded) {
    if (vy < -50) {
      // Jump ascension stretch
      scaleX = 0.85;
      scaleY = 1.20;
    } else if (vy > 100) {
      // Falling stretch
      scaleX = 0.90;
      scaleY = 1.15;
    }
  } else if (Math.abs(vx) > 10) {
    // Run cycle bounce
    const runBounce = Math.sin(animTime * 14) * 0.08;
    scaleX = 1.0 + runBounce;
    scaleY = 1.0 - runBounce;
  }

  ctx.scale(scaleX, scaleY);

  // 3. Invulnerability / Damage Flash
  if (isHurt && Math.floor(animTime * 20) % 2 === 0) {
    ctx.globalAlpha = 0.45;
  }

  // 4. Trailing Cape (Rendered behind body)
  ctx.save();
  ctx.fillStyle = '#80ED99';
  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 1.5;
  const capeFlutter = isDashing 
    ? Math.sin(animTime * 30) * 8 - 14
    : (isGrounded ? Math.sin(animTime * 10) * 3 - (vx * 0.02) : -vy * 0.03);

  ctx.beginPath();
  ctx.moveTo(-4, -18);
  ctx.quadraticCurveTo(-14 + capeFlutter, -14, -12 + capeFlutter, -4);
  ctx.quadraticCurveTo(-6, -6, 2, -16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 5. Main Body Capsule (Turquoise gradient)
  const bodyGrad = ctx.createLinearGradient(0, -28, 0, -2);
  bodyGrad.addColorStop(0, '#2EC4B6');
  bodyGrad.addColorStop(1, '#20A396');

  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.roundRect(-8, -26, 16, 24, [8, 8, 6, 6]);
  ctx.fill();
  ctx.stroke();

  // 6. Belly Accent (Soft Seafoam)
  ctx.fillStyle = 'rgba(128, 237, 153, 0.45)';
  ctx.beginPath();
  ctx.ellipse(1, -12, 5, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 7. Rosy Cheeks
  ctx.fillStyle = 'rgba(255, 138, 174, 0.50)';
  ctx.beginPath();
  ctx.ellipse(-4, -15, 2.2, 1.4, 0, 0, Math.PI * 2);
  ctx.ellipse(5, -15, 2.2, 1.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // 8. Expressive Eyes & Catchlights
  ctx.fillStyle = '#1D3557';
  const eyeBlink = Math.sin(animTime * 2) > 0.96 ? 0.2 : 1.0;

  ctx.beginPath();
  ctx.ellipse(-3, -19, 2.0, 3.0 * eyeBlink, 0, 0, Math.PI * 2);
  ctx.ellipse(4, -19, 2.0, 3.0 * eyeBlink, 0, 0, Math.PI * 2);
  ctx.fill();

  if (eyeBlink > 0.5) {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    // Primary catchlight
    ctx.arc(-2.5, -20.2, 0.9, 0, Math.PI * 2);
    ctx.arc(4.5, -20.2, 0.9, 0, Math.PI * 2);
    // Sub catchlight
    ctx.arc(-3.5, -18.0, 0.5, 0, Math.PI * 2);
    ctx.arc(3.5, -18.0, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 9. Nautilus Shell Beret (#FFD166)
  ctx.save();
  ctx.translate(2, -26);
  ctx.rotate(0.12);
  ctx.fillStyle = '#FFD166';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.8;

  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 5.5, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Shell Spiral Ridges
  ctx.strokeStyle = '#F4A261';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(-2, 0, 3.5, 0.4, Math.PI * 1.4);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-1, -1, 1.8, 0.6, Math.PI * 1.6);
  ctx.stroke();
  ctx.restore();

  // 10. Glowing Pearl Antennae (#E0FBFC & #00F5D4)
  const pulse = Math.sin(animTime * 6) * 0.3 + 0.7;
  // Left stalk
  ctx.strokeStyle = '#2EC4B6';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-3, -27);
  ctx.quadraticCurveTo(-7, -33, -5, -36);
  ctx.stroke();
  // Left Pearl
  ctx.fillStyle = `rgba(0, 245, 212, ${0.4 * pulse})`;
  ctx.beginPath();
  ctx.arc(-5, -36, 4 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#E0FBFC';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.arc(-5, -36, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Right stalk
  ctx.strokeStyle = '#2EC4B6';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(3, -27);
  ctx.quadraticCurveTo(7, -34, 6, -37);
  ctx.stroke();
  // Right Pearl
  ctx.fillStyle = `rgba(0, 245, 212, ${0.4 * pulse})`;
  ctx.beginPath();
  ctx.arc(6, -37, 4 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#E0FBFC';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.arc(6, -37, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 11. Little Flippers / Feet
  ctx.fillStyle = '#20A396';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.5;
  const legOffset = isGrounded ? Math.sin(animTime * 14) * 3 : 0;
  ctx.beginPath();
  ctx.ellipse(-4, -2 + legOffset, 3.2, 2.0, -0.2, 0, Math.PI * 2);
  ctx.ellipse(4, -2 - legOffset, 3.2, 2.0, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
```

---

## 4. Enemy Bestiary Procedural Drawing Recipes

### 4.1 Hermit Scuttler (`patrol_walker`)
- **Dimensions**: $20 \times 22\text{px}$.
- **Palette**: Conch Shell (`#E76F51`), Ridges (`#F4A261`), Claws (`#F4A261`), Body (`#2A9D8F`), Eyes (`#1D3557`).
- **Visuals**: Wobbly eye-stalks, chunky spiral shell with shaded bands, tiny scuttling legs.

```javascript
export function drawHermitScuttler(ctx, x, y, state = {}) {
  const { facing = 1, animTime = 0, isDead = false } = state;
  ctx.save();
  ctx.translate(x, y);

  if (!isDead) {
    ctx.fillStyle = 'rgba(10, 22, 16, 0.20)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.scale(facing, 1);

  // Scuttling Leg Animation
  ctx.strokeStyle = '#F4A261';
  ctx.lineWidth = 2.0;
  const legWiggle = Math.sin(animTime * 18) * 3;
  ctx.beginPath();
  ctx.moveTo(-6, -3); ctx.lineTo(-9, 0 - legWiggle);
  ctx.moveTo(-2, -3); ctx.lineTo(-3, 0 + legWiggle);
  ctx.moveTo(3, -3);  ctx.lineTo(4, 0 - legWiggle);
  ctx.moveTo(7, -3);  ctx.lineTo(9, 0 + legWiggle);
  ctx.stroke();

  // Spiral Conch Shell (#E76F51)
  ctx.fillStyle = '#E76F51';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-8, -4);
  ctx.quadraticCurveTo(-14, -14, -2, -18);
  ctx.quadraticCurveTo(8, -18, 9, -8);
  ctx.quadraticCurveTo(9, -2, -8, -4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Shell Ridge Details
  ctx.strokeStyle = '#F4A261';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(-2, -10, 6, 0.8, Math.PI * 1.5);
  ctx.stroke();

  // Turquoise Crab Head & Eyes
  ctx.fillStyle = '#2A9D8F';
  ctx.beginPath();
  ctx.roundRect(2, -12, 8, 8, 4);
  ctx.fill();
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Eye Stalks & Glossy Eyes
  const eyeWiggle = Math.cos(animTime * 8) * 0.8;
  ctx.strokeStyle = '#2A9D8F';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(5, -12); ctx.lineTo(4 + eyeWiggle, -18);
  ctx.moveTo(8, -12); ctx.lineTo(9 + eyeWiggle, -18);
  ctx.stroke();

  ctx.fillStyle = '#1D3557';
  ctx.beginPath();
  ctx.arc(4 + eyeWiggle, -18, 1.8, 0, Math.PI * 2);
  ctx.arc(9 + eyeWiggle, -18, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(4.5 + eyeWiggle, -18.5, 0.6, 0, Math.PI * 2);
  ctx.arc(9.5 + eyeWiggle, -18.5, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Front Pinchers
  ctx.fillStyle = '#F4A261';
  ctx.beginPath();
  ctx.ellipse(9, -6, 3, 2, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
```

---

### 4.2 Spiny Urchin (`rhythmic_hopper`)
- **Dimensions**: $22 \times 24\text{px}$.
- **Palette**: Deep Indigo Body (`#1D3557`), Violet Hue (`#240046`), Cyan Spikes (`#48CAE4`), Glowing Core (`#00F5D4`).
- **Visuals**: Pulsing body with 8 radial retractable spines, telegraph squash before hop.

```javascript
export function drawSpinyUrchin(ctx, x, y, state = {}) {
  const { phase = 'idle', timer = 0, animTime = 0 } = state;
  ctx.save();
  ctx.translate(x, y);

  // Drop Shadow
  ctx.fillStyle = 'rgba(10, 22, 16, 0.22)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Squash Telegraph Modulation
  let scaleX = 1;
  let scaleY = 1;
  if (phase === 'squash') {
    scaleX = 1.30;
    scaleY = 0.70;
  } else if (phase === 'hopping') {
    scaleX = 0.85;
    scaleY = 1.25;
  }
  ctx.scale(scaleX, scaleY);

  const spikePulse = Math.sin(animTime * 12) * 2.5 + 8;

  // 8 Radiating Cyan Spikes (#48CAE4)
  ctx.strokeStyle = '#48CAE4';
  ctx.lineWidth = 2.0;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 + animTime * 1.2;
    const sx = Math.cos(angle) * (6 + spikePulse);
    const sy = -12 + Math.sin(angle) * (6 + spikePulse);
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 4, -12 + Math.sin(angle) * 4);
    ctx.lineTo(sx, sy);
    ctx.stroke();
  }

  // Deep Indigo Main Orb (#1D3557 / #240046)
  const orbGrad = ctx.createRadialGradient(0, -12, 1, 0, -12, 8);
  orbGrad.addColorStop(0, '#3D5A80');
  orbGrad.addColorStop(0.7, '#1D3557');
  orbGrad.addColorStop(1, '#0B092B');

  ctx.fillStyle = orbGrad;
  ctx.strokeStyle = '#00F5D4';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, -12, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glowing Grumpy Urchin Eyes
  ctx.fillStyle = '#00F5D4';
  ctx.beginPath();
  ctx.arc(-3, -13, 1.8, 0, Math.PI * 2);
  ctx.arc(3, -13, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1D3557';
  ctx.beginPath();
  ctx.arc(-2.5, -13, 0.9, 0, Math.PI * 2);
  ctx.arc(3.5, -13, 0.9, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 4.3 Bubble Ray Flyer (`sine_flyer`)
- **Dimensions**: $24 \times 18\text{px}$.
- **Palette**: Sea-Glass Cyan (`#48CAE4`), Wing Trim (`#00F5D4`), Pearl Belly (`#CAF0F8`), Bubble Halo (`rgba(0, 245, 212, 0.3)`).
- **Visuals**: Undulating manta wing flaps with smooth Bezier curves, trailing cyan bubble trail.

```javascript
export function drawBubbleRay(ctx, x, y, state = {}) {
  const { facing = 1, animTime = 0 } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);

  const wingWave = Math.sin(animTime * 7) * 5;

  // Luminous Ambient Halo
  ctx.fillStyle = 'rgba(0, 245, 212, 0.22)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Manta Wings & Body (Sea-Glass Cyan Gradient)
  const rayGrad = ctx.createLinearGradient(-12, -8, 12, 8);
  rayGrad.addColorStop(0, '#00F5D4');
  rayGrad.addColorStop(0.5, '#48CAE4');
  rayGrad.addColorStop(1, '#0077B6');

  ctx.fillStyle = rayGrad;
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.8;

  ctx.beginPath();
  ctx.moveTo(10, 0); // Snout
  ctx.quadraticCurveTo(2, -8 + wingWave, -8, -10 + wingWave); // Top wing tip
  ctx.quadraticCurveTo(-6, -2, -12, 0); // Tail base
  ctx.quadraticCurveTo(-6, 2, -8, 10 - wingWave); // Bottom wing tip
  ctx.quadraticCurveTo(2, 8 - wingWave, 10, 0); // Back to snout
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Pearl Belly Pattern
  ctx.fillStyle = 'rgba(202, 240, 248, 0.6)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Whip Tail with Bubble Cluster
  ctx.strokeStyle = '#00F5D4';
  ctx.lineWidth = 1.5;
  const tailWave = Math.sin(animTime * 10) * 3;
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.quadraticCurveTo(-18, tailWave, -24, -tailWave);
  ctx.stroke();

  // Trailing Bubbles
  ctx.fillStyle = 'rgba(0, 245, 212, 0.7)';
  ctx.beginPath();
  ctx.arc(-26 + Math.sin(animTime * 4) * 2, tailWave, 1.8, 0, Math.PI * 2);
  ctx.arc(-30 + Math.cos(animTime * 4) * 2, -tailWave, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Friendly Dark Eyes with Catchlight
  ctx.fillStyle = '#1D3557';
  ctx.beginPath();
  ctx.arc(6, -2, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(6.5, -2.5, 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 4.4 Coral Crusher Crab (`proximity_charger`)
- **Dimensions**: $32 \times 24\text{px}$.
- **Palette**: Heavy Crimson Reef Armor (`#9B2226` / `#D62828`), Claws (`#E76F51`), Alert Eyes (`#FFD166`), Dazed Stars (`#FFD166`).
- **Visuals**: Giant oversized crusher pincer, armor plating, charging dust trail, spinning dazed stars upon wall crash.

```javascript
export function drawCoralCrusher(ctx, x, y, state = {}) {
  const { facing = 1, isCharging = false, isDazed = false, animTime = 0 } = state;
  ctx.save();
  ctx.translate(x, y);

  // Drop Shadow
  ctx.fillStyle = 'rgba(10, 22, 16, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(facing, 1);

  // Dazed Cartoon Stars
  if (isDazed) {
    for (let i = 0; i < 3; i++) {
      const starAngle = animTime * 6 + (i * Math.PI * 2) / 3;
      const sx = Math.cos(starAngle) * 12;
      const sy = -28 + Math.sin(starAngle) * 4;
      ctx.fillStyle = '#FFD166';
      ctx.strokeStyle = '#1D3557';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // Armored Walking Legs (Heavy Stride)
  ctx.strokeStyle = '#780000';
  ctx.lineWidth = 2.5;
  const legWiggle = isCharging ? Math.sin(animTime * 35) * 4 : Math.sin(animTime * 12) * 2;
  ctx.beginPath();
  ctx.moveTo(-10, -4); ctx.lineTo(-14, 0 - legWiggle);
  ctx.moveTo(-5, -4);  ctx.lineTo(-7, 0 + legWiggle);
  ctx.moveTo(5, -4);   ctx.lineTo(7, 0 - legWiggle);
  ctx.moveTo(10, -4);  ctx.lineTo(13, 0 + legWiggle);
  ctx.stroke();

  // Heavy Crimson Carapace (#9B2226 / #D62828)
  const shellGrad = ctx.createLinearGradient(0, -22, 0, -4);
  shellGrad.addColorStop(0, '#D62828');
  shellGrad.addColorStop(1, '#9B2226');

  ctx.fillStyle = shellGrad;
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.roundRect(-12, -18, 24, 15, [8, 8, 4, 4]);
  ctx.fill();
  ctx.stroke();

  // Coral Armor Spikes on Back
  ctx.fillStyle = '#E76F51';
  ctx.beginPath();
  ctx.moveTo(-8, -18); ctx.lineTo(-6, -23); ctx.lineTo(-3, -18);
  ctx.moveTo(3, -18);  ctx.lineTo(6, -23);  ctx.lineTo(8, -18);
  ctx.fill();
  ctx.stroke();

  // Giant Crusher Pincer (Front)
  ctx.save();
  ctx.translate(10, -10);
  const snapAngle = isCharging ? Math.sin(animTime * 25) * 0.3 : 0;
  ctx.rotate(snapAngle);
  ctx.fillStyle = '#D62828';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 2.0;
  // Upper claw jaw
  ctx.beginPath();
  ctx.ellipse(5, -4, 7, 4, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Lower claw jaw
  ctx.beginPath();
  ctx.ellipse(4, 2, 6, 3, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Glowing Alert Eyes
  ctx.fillStyle = isCharging ? '#FFD166' : '#FDFFFC';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(2, -14, 2.5, 0, Math.PI * 2);
  ctx.arc(7, -14, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isCharging ? '#9B2226' : '#1D3557';
  ctx.beginPath();
  ctx.arc(2.5, -14, 1.2, 0, Math.PI * 2);
  ctx.arc(7.5, -14, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

## 5. Climax Boss Design: The Ancient Tide Golem

```
                                 [  (===)  ]      <-- Exposed Pearl Core (#00F5D4)
                             /===============\
                            |  [STONE CROWN]  |   <-- Weathered Stone Plates (#264653)
                           /===================\
                          | ( o )        ( o ) |  <-- Glowing Rune Eyes (#4CC9F0)
                         /=======================\
                        |     [CORAL CHEST]       | <-- Living Staghorn Coral (#E76F51)
                       /                           \
               [GIANT TIDAL CLAW]         [GIANT TIDAL CLAW]
               (#264653 / #00F5D4)        (#264653 / #00F5D4)
```

### 5.1 Boss Multi-Phase Visual Specs
- **Dimensions**: $64 \times 74\text{px}$ monolithic colossus.
- **Phase 1 (3 HP - Awake)**: Deep ocean slate (`#264653`) with emerald moss highlights (`#43AA8B`) and gentle cyan runes.
- **Phase 2 (2 HP - Agitated)**: Stone fissures crack open glowing bright cyan (`#00F5D4`), staghorn coral branches flare, hurling rolling coral boulders.
- **Phase 3 (1 HP - Enraged Tempest)**: Cracks erupt with amber-crimson thermal magma currents (`#F77F00` / `#D62828`), water jet geysers blast from shoulders, eyes blaze radiant yellow.
- **Vulnerability Window**: When kneeling, the top crown splits open, revealing the **Sacred Pearl Core** (`#00F5D4` / `#E0FBFC`) with an unmistakable vertical beacon light shaft.

### 5.2 Procedural Vector Drawing Recipe

```javascript
export function drawAncientTideGolem(ctx, x, y, state = {}) {
  const {
    hp = 3,
    facing = 1,
    stateName = 'idle', // 'idle', 'slam', 'vulnerable', 'charge', 'dazed'
    animTime = 0
  } = state;

  ctx.save();
  ctx.translate(x, y);

  // Heavy Footprint Ground Shadow
  ctx.fillStyle = 'rgba(10, 22, 16, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 32, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(facing, 1);

  const isVulnerable = stateName === 'vulnerable' || stateName === 'dazed';
  const isEnraged = hp === 1;

  // 1. Stone Legs & Heavy Torso
  const stoneGrad = ctx.createLinearGradient(0, -70, 0, 0);
  stoneGrad.addColorStop(0, '#577590');
  stoneGrad.addColorStop(0.5, '#264653');
  stoneGrad.addColorStop(1, '#1B3039');

  ctx.fillStyle = stoneGrad;
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 2.8;

  // Left & Right Stone Pillars (Legs)
  ctx.beginPath();
  ctx.roundRect(-24, -28, 18, 28, [4, 4, 2, 2]);
  ctx.roundRect(6, -28, 18, 28, [4, 4, 2, 2]);
  ctx.fill();
  ctx.stroke();

  // Torso / Chest Monolith
  ctx.beginPath();
  ctx.roundRect(-28, -60, 56, 36, [10, 10, 6, 6]);
  ctx.fill();
  ctx.stroke();

  // Living Staghorn Coral Shoulder Growths (#E76F51)
  ctx.fillStyle = isEnraged ? '#D62828' : '#E76F51';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 2.0;
  // Left coral bough
  ctx.beginPath();
  ctx.moveTo(-26, -56);
  ctx.lineTo(-38, -68);
  ctx.lineTo(-34, -58);
  ctx.lineTo(-44, -62);
  ctx.lineTo(-30, -50);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Right coral bough
  ctx.beginPath();
  ctx.moveTo(26, -56);
  ctx.lineTo(38, -68);
  ctx.lineTo(34, -58);
  ctx.lineTo(44, -62);
  ctx.lineTo(30, -50);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 2. Head & Crown
  ctx.fillStyle = '#577590';
  ctx.beginPath();
  ctx.roundRect(-18, -74, 36, 18, [8, 8, 4, 4]);
  ctx.fill();
  ctx.stroke();

  // 3. Exposed Pearl Core (When Vulnerable or Kneeling)
  if (isVulnerable) {
    const corePulse = Math.sin(animTime * 12) * 0.3 + 0.7;
    // Radiant Vertical Light Pillar
    const beamGrad = ctx.createLinearGradient(0, -74, 0, -120);
    beamGrad.addColorStop(0, 'rgba(0, 245, 212, 0.6)');
    beamGrad.addColorStop(1, 'rgba(0, 245, 212, 0.0)');
    ctx.fillStyle = beamGrad;
    ctx.fillRect(-10, -120, 20, 46);

    // Glowing Core Orb
    ctx.fillStyle = `rgba(0, 245, 212, ${0.5 * corePulse})`;
    ctx.beginPath();
    ctx.arc(0, -74, 12 * corePulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#E0FBFC';
    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(0, -74, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // 4. Glowing Runic Eyes & Chest Glyphs
  const eyeColor = isEnraged ? '#FFD166' : '#00F5D4';
  ctx.fillStyle = eyeColor;
  ctx.beginPath();
  ctx.arc(-8, -66, 3.2, 0, Math.PI * 2);
  ctx.arc(8, -66, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // Chest Runic Fissures
  ctx.strokeStyle = isEnraged ? '#F77F00' : '#00F5D4';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(0, -52);
  ctx.lineTo(-12, -42);
  ctx.lineTo(0, -32);
  ctx.lineTo(12, -42);
  ctx.closePath();
  ctx.stroke();

  // 5. Giant Tidal Arms
  const armSlam = stateName === 'slam' ? Math.sin(animTime * 20) * 16 : 0;
  ctx.fillStyle = '#264653';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.roundRect(-36, -50 + armSlam, 14, 38, [6, 6, 4, 4]);
  ctx.roundRect(22, -50 + armSlam, 14, 38, [6, 6, 4, 4]);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
```

---

## 6. Interactive NPCs Drawing Recipes

### 6.1 Coralia the Pearl Diver (Area 1 — Palm Beach)
- **Role**: Cheerful Sea-Otter diver guide.
- **Visuals**: Sleek brown otter fur (`#78593F`), brass diving snorkel (`#E9C46A`), aquamarine goggles (`#38BDF8`), sea-shell necklace (`#FFD166`).

```javascript
export function drawCoralia(ctx, x, y, state = {}) {
  const { animTime = 0 } = state;
  ctx.save();
  ctx.translate(x, y);

  // Ground Shadow
  ctx.fillStyle = 'rgba(10, 22, 16, 0.20)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 11, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  const breathe = Math.sin(animTime * 3) * 0.8;

  // Otter Body Capsule (#78593F)
  ctx.fillStyle = '#78593F';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.roundRect(-9, -26 + breathe, 18, 26, [9, 9, 6, 6]);
  ctx.fill();
  ctx.stroke();

  // Cream Belly & Snout (#FCEADE)
  ctx.fillStyle = '#FCEADE';
  ctx.beginPath();
  ctx.ellipse(0, -12 + breathe, 6, 8, 0, 0, Math.PI * 2);
  ctx.ellipse(0, -19 + breathe, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cute Otter Nose & Whiskers
  ctx.fillStyle = '#1D3557';
  ctx.beginPath();
  ctx.arc(0, -21 + breathe, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Brass Snorkel & Diving Mask (#E9C46A & #38BDF8)
  ctx.fillStyle = '#38BDF8';
  ctx.strokeStyle = '#E9C46A';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.roundRect(-8, -26 + breathe, 16, 6, 3);
  ctx.fill();
  ctx.stroke();

  // Snorkel Tube
  ctx.strokeStyle = '#E9C46A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(6, -23 + breathe);
  ctx.quadraticCurveTo(12, -23 + breathe, 11, -34 + breathe);
  ctx.lineTo(8, -34 + breathe);
  ctx.stroke();

  // Shell Necklace (#FFD166)
  ctx.fillStyle = '#FFD166';
  ctx.beginPath();
  ctx.arc(-3, -15 + breathe, 2, 0, Math.PI * 2);
  ctx.arc(0, -14 + breathe, 2.5, 0, Math.PI * 2);
  ctx.arc(3, -15 + breathe, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 6.2 Barnaby the Navigator (Area 2 — Overgrown Ruins)
- **Role**: Wise old sea-turtle captain.
- **Visuals**: Weathered mossy shell (`#2A9D8F`), bicorn captain's hat (`#264653` with `#FFD166` trim), spectacles, brass sextant.

```javascript
export function drawBarnaby(ctx, x, y, state = {}) {
  const { animTime = 0 } = state;
  ctx.save();
  ctx.translate(x, y);

  // Ground Shadow
  ctx.fillStyle = 'rgba(10, 22, 16, 0.22)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Large Weathered Tortoise Shell (#2A9D8F & #264653)
  ctx.fillStyle = '#2A9D8F';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(0, -16, 14, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Shell Hexagon Scutes
  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-6, -21, 12, 10);

  // Wrinkly Green Head
  ctx.fillStyle = '#52B788';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(8, -26, 10, 12, [5, 5, 4, 4]);
  ctx.fill();
  ctx.stroke();

  // Golden Spectacles (#FFD166)
  ctx.strokeStyle = '#FFD166';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(12, -24, 4, 4);

  // Captain's Bicorn Hat (#264653 + #FFD166)
  ctx.fillStyle = '#264653';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(4, -26);
  ctx.lineTo(13, -34);
  ctx.lineTo(22, -26);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#FFD166';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(6, -26);
  ctx.lineTo(20, -26);
  ctx.stroke();

  ctx.restore();
}
```

---

### 6.3 Ancient Beacon Keeper (Area 5 — Ending Altar)
- **Role**: Celestial sea spirit / ethereal guardian.
- **Visuals**: Hovering radiant manta spirit, pearl diadem (`#FFD166`), celestial aura (`rgba(76, 201, 240, 0.4)`), glowing stardust motes.

```javascript
export function drawBeaconKeeper(ctx, x, y, state = {}) {
  const { animTime = 0 } = state;
  ctx.save();
  ctx.translate(x, y);

  const hoverY = Math.sin(animTime * 2.5) * 6 - 8;

  // Radiant Celestial Halo
  const haloGrad = ctx.createRadialGradient(0, hoverY, 4, 0, hoverY, 28);
  haloGrad.addColorStop(0, 'rgba(0, 245, 212, 0.5)');
  haloGrad.addColorStop(0.6, 'rgba(76, 201, 240, 0.25)');
  haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(0, hoverY, 28, 0, Math.PI * 2);
  ctx.fill();

  // Ethereal Spirit Mantle (#E0FBFC & #4CC9F0)
  ctx.fillStyle = '#E0FBFC';
  ctx.strokeStyle = '#00F5D4';
  ctx.lineWidth = 2.0;

  const wingWave = Math.sin(animTime * 4) * 4;
  ctx.beginPath();
  ctx.moveTo(0, hoverY - 16);
  ctx.quadraticCurveTo(-18, hoverY - 6 + wingWave, -22, hoverY + 6);
  ctx.quadraticCurveTo(-10, hoverY + 18, 0, hoverY + 22);
  ctx.quadraticCurveTo(10, hoverY + 18, 22, hoverY + 6);
  ctx.quadraticCurveTo(18, hoverY - 6 + wingWave, 0, hoverY - 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Pearl Diadem (#FFD166)
  ctx.fillStyle = '#FFD166';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-7, hoverY - 16);
  ctx.lineTo(0, hoverY - 22);
  ctx.lineTo(7, hoverY - 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Glowing Celestial Eyes
  ctx.fillStyle = '#03045E';
  ctx.beginPath();
  ctx.arc(-4, hoverY - 8, 2.0, 0, Math.PI * 2);
  ctx.arc(4, hoverY - 8, 2.0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

## 7. Interactive Objects, Collectibles, & Mechanics Drawing Recipes

### 7.1 Sun Pearls & Golden Nautilus Shells

```javascript
// Iridescent Sun Pearl (Floating + Sparkles)
export function drawSunPearl(ctx, x, y, animTime = 0) {
  ctx.save();
  const floatY = y + Math.sin(animTime * 3.5) * 4;
  ctx.translate(x, floatY);

  // Outer Shimmer Halo
  ctx.fillStyle = 'rgba(255, 209, 102, 0.35)';
  ctx.beginPath();
  ctx.arc(0, 0, 10 + Math.sin(animTime * 6) * 2, 0, Math.PI * 2);
  ctx.fill();

  // Iridescent Pearl Body (#FDFFFC / #E0FBFC)
  const pearlGrad = ctx.createRadialGradient(-2, -2, 1, 0, 0, 7);
  pearlGrad.addColorStop(0, '#FFFFFF');
  pearlGrad.addColorStop(0.5, '#E0FBFC');
  pearlGrad.addColorStop(0.9, '#FFD166');
  pearlGrad.addColorStop(1, '#F4A261');

  ctx.fillStyle = pearlGrad;
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 3 Orbiting Sparkle Stars
  for (let i = 0; i < 3; i++) {
    const angle = animTime * 4 + (i * Math.PI * 2) / 3;
    const sx = Math.cos(angle) * 11;
    const sy = Math.sin(angle) * 6;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Golden Nautilus Shell Pickup
export function drawNautilusShell(ctx, x, y, animTime = 0) {
  ctx.save();
  const floatY = y + Math.sin(animTime * 2.8) * 3;
  ctx.translate(x, floatY);

  ctx.fillStyle = '#FFD166';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 6, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner Golden Spiral Ridges
  ctx.strokeStyle = '#E76F51';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(-1, 0, 3.5, 0.4, Math.PI * 1.5);
  ctx.stroke();

  ctx.restore();
}
```

---

### 7.2 Ancient Lighthouses (Dormant vs. Activated)
- **Dimensions**: $48 \times 96\text{px}$.
- **States**:
  - *Dormant*: Weathered stone tower with dark glass lamp room.
  - *Activated*: Blazing radiant amber lamp (`#FFD166`), rotating conical light beam piercing the sky with atmospheric volumetric gradient (`rgba(255, 209, 102, 0.3)`), orbiting cyan light sparkles.

```javascript
export function drawLighthouse(ctx, x, y, isLit = false, animTime = 0) {
  ctx.save();
  ctx.translate(x, y);

  // 1. Rotating Conical Light Beam (When Lit)
  if (isLit) {
    ctx.save();
    ctx.translate(0, -82);
    const beamAngle = Math.sin(animTime * 1.5) * 0.6;
    ctx.rotate(beamAngle);

    const beamGrad = ctx.createLinearGradient(0, 0, 180, 0);
    beamGrad.addColorStop(0, 'rgba(255, 209, 102, 0.65)');
    beamGrad.addColorStop(0.5, 'rgba(0, 245, 212, 0.30)');
    beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(180, -36);
    ctx.lineTo(180, 36);
    ctx.lineTo(0, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 2. Stone Tower Base & Shaft (#577590 & #264653)
  const towerGrad = ctx.createLinearGradient(-18, 0, 18, 0);
  towerGrad.addColorStop(0, '#577590');
  towerGrad.addColorStop(0.5, '#43AA8B');
  towerGrad.addColorStop(1, '#264653');

  ctx.fillStyle = towerGrad;
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.moveTo(-18, 0);
  ctx.lineTo(-12, -72);
  ctx.lineTo(12, -72);
  ctx.lineTo(18, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Red & White Coastal Bands
  ctx.fillStyle = '#E76F51';
  ctx.fillRect(-15, -48, 30, 12);
  ctx.strokeRect(-15, -48, 30, 12);

  // 3. Lantern Room & Dome
  ctx.fillStyle = isLit ? '#FFD166' : '#1D3557';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.roundRect(-10, -88, 20, 16, [4, 4, 0, 0]);
  ctx.fill();
  ctx.stroke();

  // Glass Frame Lines
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-4, -88); ctx.lineTo(-4, -72);
  ctx.moveTo(4, -88);  ctx.lineTo(4, -72);
  ctx.stroke();

  // Top Dome Finial
  ctx.fillStyle = '#264653';
  ctx.beginPath();
  ctx.arc(0, -88, 8, Math.PI, 0);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
```

---

### 7.3 Runic Waystone Checkpoint & Shrines

```javascript
export function drawWaystone(ctx, x, y, isAttuned = false, animTime = 0) {
  ctx.save();
  ctx.translate(x, y);

  // Ground Shadow
  ctx.fillStyle = 'rgba(10, 22, 16, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ancient Stone Obelisk (#264653)
  ctx.fillStyle = '#264653';
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-7, -34);
  ctx.lineTo(0, -42);
  ctx.lineTo(7, -34);
  ctx.lineTo(10, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Carved Rune Core (Dormant Cyan vs. Radiant Amber)
  const runePulse = isAttuned ? Math.sin(animTime * 8) * 0.3 + 0.7 : 0.4;
  const runeColor = isAttuned ? '#FFD166' : '#00F5D4';

  ctx.strokeStyle = runeColor;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(0, -22, 4 * runePulse, 0, Math.PI * 2);
  ctx.moveTo(0, -28); ctx.lineTo(0, -16);
  ctx.moveTo(-4, -22); ctx.lineTo(4, -22);
  ctx.stroke();

  // Radiant Harmonic Rings if Attuned
  if (isAttuned) {
    ctx.strokeStyle = `rgba(255, 209, 102, ${0.4 * (1 - (animTime % 1))})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -22, 8 + (animTime % 1) * 16, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}
```

---

### 7.4 Cloud Ledges & Coastal Updrafts

```javascript
// Disappearing / Oscillating Cloud Ledge
export function drawCloudLedge(ctx, x, y, width = 64, opacity = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = Math.max(0.1, Math.min(1.0, opacity));

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#CAF0F8';
  ctx.lineWidth = 2.0;

  const bubbles = Math.floor(width / 16);
  ctx.beginPath();
  ctx.moveTo(-width / 2, 0);
  for (let i = 0; i <= bubbles; i++) {
    const cx = -width / 2 + i * 16;
    ctx.arc(cx, -6, 9, Math.PI, 0);
  }
  ctx.lineTo(width / 2, 4);
  ctx.lineTo(-width / 2, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Coastal Updraft Wind Stream
export function drawUpdraft(ctx, x, y, height = 160, animTime = 0) {
  ctx.save();
  ctx.translate(x, y);

  const streamGrad = ctx.createLinearGradient(0, 0, 0, -height);
  streamGrad.addColorStop(0, 'rgba(202, 240, 248, 0.05)');
  streamGrad.addColorStop(0.5, 'rgba(202, 240, 248, 0.28)');
  streamGrad.addColorStop(1, 'rgba(0, 245, 212, 0.0)');

  ctx.fillStyle = streamGrad;
  ctx.fillRect(-16, -height, 32, height);

  // Rising Wind Vortex Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    const offset = ((animTime * 120 + i * 40) % height);
    const wave = Math.sin(animTime * 6 + i) * 6;
    ctx.beginPath();
    ctx.moveTo(-8 + wave, -offset);
    ctx.lineTo(8 + wave, -offset - 16);
    ctx.stroke();
  }

  ctx.restore();
}
```

---

## 8. Biome Environment Vector Drawing Recipes

```
+----------------------------------------------------------------------------------------------------+
| 5 DISTINCT ISLAND BIOME VECTOR THEMES                                                             |
+----------------------------------------------------------------------------------------------------+
| 1. Palm Beach: Warm sandy banks (#F4A261), swaying palm fronds (#2A9D8F), turquoise tide pools.   |
| 2. Overgrown Ruins: Sunken masonry (#264653), cascading aqueducts, moss carpets (#43AA8B).        |
| 3. Flooded Caves: Dark basalt grottos (#0D1B2A), bioluminescent cyan corals (#00F5D4), geysers.   |
| 4. Wind Cliffs: Sheer sea crags (#3D5A80), sunset horizon (#F77F00), drifting cloud ledges.        |
| 5. Lighthouse Island: Sacred marble colonnade (#FDFFFC), glowing beacon (#FFD166), abyssal sea.   |
+----------------------------------------------------------------------------------------------------+
```

### 8.1 Biome 1: Palm Beach (Platform & Foliage)

```javascript
export function drawPalmBeachTile(ctx, x, y, w, h) {
  // Top Sand Layer
  ctx.fillStyle = '#FCEADE';
  ctx.fillRect(x, y, w, 6);

  // Main Golden Sand Body (#F4A261)
  const sandGrad = ctx.createLinearGradient(x, y, x, y + h);
  sandGrad.addColorStop(0, '#F4A261');
  sandGrad.addColorStop(1, '#E76F51');
  ctx.fillStyle = sandGrad;
  ctx.fillRect(x, y + 6, w, h - 6);

  // Subtle Sand Shell Speckles
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(x + 4, y + 10, 3, 2);
  ctx.fillRect(x + 18, y + 14, 2, 2);

  // Dark Sand Outline
  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);
}
```

---

### 8.2 Biome 2: Overgrown Ruins (Stone Arch & Aqueduct)

```javascript
export function drawRuinsTile(ctx, x, y, w, h) {
  // Ancient Slate Fill (#264653)
  ctx.fillStyle = '#264653';
  ctx.fillRect(x, y, w, h);

  // Coastal Moss Trim (#43AA8B)
  ctx.fillStyle = '#43AA8B';
  ctx.fillRect(x, y, w, 5);
  // Hanging moss tendrils
  ctx.beginPath();
  ctx.arc(x + 8, y + 5, 4, 0, Math.PI);
  ctx.arc(x + 22, y + 5, 5, 0, Math.PI);
  ctx.fill();

  // Stone Brick Mortar Lines
  ctx.strokeStyle = '#1D3557';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);
  ctx.beginPath();
  ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2);
  ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h / 2);
  ctx.stroke();
}
```

---

### 8.3 Biome 3: Flooded Caves (Bioluminescent Coral Rock)

```javascript
export function drawGrottoTile(ctx, x, y, w, h) {
  // Dark Basalt (#1B263B)
  ctx.fillStyle = '#1B263B';
  ctx.fillRect(x, y, w, h);

  // Glowing Cyan Coral Top (#00F5D4)
  ctx.fillStyle = '#00F5D4';
  ctx.fillRect(x, y, w, 4);

  // Bioluminescent Crystal Shards
  ctx.fillStyle = '#9B5DE5';
  ctx.beginPath();
  ctx.moveTo(x + 6, y); ctx.lineTo(x + 10, y - 6); ctx.lineTo(x + 14, y);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#0D1B2A';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);
}
```

---

### 8.4 Biome 4: Wind Cliffs (Sea Slate & Gusts)

```javascript
export function drawCliffTile(ctx, x, y, w, h) {
  // Cliff Slate (#3D5A80)
  ctx.fillStyle = '#3D5A80';
  ctx.fillRect(x, y, w, h);

  // Alpine Grass Trim (#52B788)
  ctx.fillStyle = '#52B788';
  ctx.fillRect(x, y, w, 4);

  ctx.strokeStyle = '#293241';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);
}
```

---

### 8.5 Biome 5: Lighthouse Island (Sacred Gilded Colonnade)

```javascript
export function drawColiseumTile(ctx, x, y, w, h) {
  // Marble Base (#FDFFFC)
  ctx.fillStyle = '#FDFFFC';
  ctx.fillRect(x, y, w, h);

  // Golden Inlaid Rim (#FFD166)
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(x, y, w, 4);

  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);
}
```

---

## 9. UI / HUD Theme & Mobile Controls

### 9.1 HUD Elements
1. **Health Hearts**:
   - *Full Heart*: Glossy crimson heart (`#FF4D6D`) with white catchlight dot.
   - *Empty Heart*: Translucent slate outline (`#3D5A80`, $2.0\text{px}$ stroke).
2. **Sun Pearl Counter**:
   - Iridescent pearl icon + high-contrast text (`Fredoka`, 16px, `#FDFFFC` with `#1D3557` outline).
3. **Dialogue Box**:
   - Opaque oceanic midnight backplate (`#0A1610`, 95% opacity).
   - Glowing seafoam border (`#00F5D4`, $2.5\text{px}$).
   - Character portrait framed in gilded shell roundel.

```javascript
export function drawHUDHeart(ctx, x, y, isFull = true) {
  ctx.save();
  ctx.translate(x, y);

  if (isFull) {
    ctx.fillStyle = '#FF4D6D';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.0;

    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(-6, -4, -10, 0, -10, 5);
    ctx.bezierCurveTo(-10, 11, 0, 16, 0, 19);
    ctx.bezierCurveTo(0, 16, 10, 11, 10, 5);
    ctx.bezierCurveTo(10, 0, 6, -4, 0, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Catchlight dot
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-4, 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#3D5A80';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(-6, -4, -10, 0, -10, 5);
    ctx.bezierCurveTo(-10, 11, 0, 16, 0, 19);
    ctx.bezierCurveTo(0, 16, 10, 11, 10, 5);
    ctx.bezierCurveTo(10, 0, 6, -4, 0, 4);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.restore();
}
```

---

## 10. Particle Systems & Visual Juice Matrix

| Particle Type | Color Palette | Physics / Lifespan | Gameplay Trigger |
| :--- | :--- | :--- | :--- |
| **Water Splash Ring** | `#00F5D4`, `#E0FBFC` | Radial velocity $80\text{px/s}$, $0.35\text{s}$ fade | Water jump, platform landing |
| **Tide Dash Trail** | `#2EC4B6`, `#80ED99` | Static decaying ghosts, $0.18\text{s}$ lifetime | Mid-air Tide Dash |
| **Stomp Bubble Pop** | `#00F5D4`, `#FFD166` | 8 radial bubbles, $v = 120\text{px/s}$, $0.40\text{s}$ | Stomping any enemy |
| **Pearl Shimmer Sparkles** | `#FDFFFC`, `#FFD166` | Orbiting sine motes, continuous | Sun Pearls, Waystones |
| **Crab Dazed Stars** | `#FFD166`, `#F77F00` | Orbital rotation, $2.2\text{s}$ stun | Coral Crusher wall crash |
| **Golem Tidal Shockwave** | `#00F5D4`, `#FFFFFF` | Horizontal ground wave $200\text{px/s}$ | Boss ground slam |

---
*End of Art Direction Document — Tidebound*
