# Art Direction & Procedural Visual Specification: Meadowbound
**Version**: 1.0.0  
**Target Viewport**: 720 × 450 (16:9 Aspect Ratio)  
**Author**: Art Director Subagent — AI Game Factory  
**Primary Rendering Pipeline**: HTML5 2D Canvas (`CanvasRenderingContext2D`) — Pure Procedural Vector Math & Zero External Assets  

---

## 1. Visual Identity & Creative Vision

```
   +-------------------------------------------------------------------------+
   |   MEADOWBOUND VISUAL PILLARS                                            |
   |   - Warm, vibrant, 16-bit cozy platformer soul in modern vector math    |
   |   - Organic, bold rounded silhouettes (no harsh black razor edges)      |
   |   - Soft drop shadows (rgba(0,0,0,0.18)) grounding all living actors    |
   |   - Expressive squash & stretch kinematic deformations                  |
   |   - Rich luminous bioluminescence & sunburst particle harmonies         |
   +-------------------------------------------------------------------------+
```

### 1.1 Aesthetic Style & Tone
**Meadowbound** pairs the tactile, charming warmth of classic storybook fantasy (e.g., *Minish Cap*, *Ori*, *Rayman Origins*) with clean, high-framerate procedural 2D vector rendering. The world is rich in lush natural foliage, sun-dappled glades, deep jewel-toned caverns, and golden ancient tree boughs.

### 1.2 Shape Language & Rendering Directives
1. **Curvature Over Sharpness**: Characters and friendly entities use rounded rectangles (`ctx.roundRect`), soft ellipses, and organic bezier curves. Only hazards (thorns, crystal spikes, enraged boss briars) feature acute angular tips.
2. **Soft Dark Contours**: Outlines are deep natural tones (e.g. Bark Brown `#2B1D0C`, Dark Slate `#1A252F`, Deep Forest Indigo `#14281D`), never stark `#000000`. Line widths range between `1.5px` and `3.0px` for crisp legibility.
3. **Layered Depth & Grounding**: Every terrestrial character casts an elliptical shadow with soft opacity (`rgba(0,0,0,0.18)`) whose scale inversely tracks its vertical height above ground ($y_{offset}$).
4. **Expressive Catchlights**: All eyes feature oversized dark pupils accented with twin asymmetrical white specular catchlights ($r=1.2\text{px}$ and $r=0.6\text{px}$) to imbue lifelike soul.
5. **Fluid Squash & Stretch**: Characters morph dynamically along $X$ and $Y$ scale axes based on vertical velocity, ground impact, and jump anticipation.

---

## 2. Master Color Architecture & Biome Palettes

```
+-------------------------------------------------------------------------------------------+
| BIOME COLOR SPECTRUM                                                                      |
| 1. Meadowlands  : Sky #68C5DB | Grass #76C043 | Soil #8D5B28 | Sun Gold #FFD13B           |
| 2. Woods        : Deep Moss #2D5A27 | Bark #4A2E18 | Canopy #1E3F1A | Sunbeam #FFF5B4     |
| 3. Caverns      : Deep Abyss #161338 | Cyan Glow #00F5D4 | Violet Crystal #C77DFF         |
| 4. Highlands    : Azure Sky #3A86FF | Amber Cliff #D97724 | Sun Mist #FFB703              |
| 5. Elder Canopy : Royal Twilight #3C096C | Ancient Cedar #5A3825 | Sunburst Gold #FFAA00   |
+-------------------------------------------------------------------------------------------+
```

### 2.1 Complete Hex & RGBA Master Palette Table

| Category | Token Name | Hex / RGBA Code | Contrast on Light | Contrast on Dark | Application / Semantic Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero (Pip)** | `pip-body` | `#FFF4E0` | High | Moderate | Pip's soft cream sprite body |
| | `pip-cloak-main` | `#2EC4B6` | High | High | Mint/emerald fluttering cloak |
| | `pip-cloak-dark` | `#1B9AAA` | Moderate | High | Cloak underside / fold shadow |
| | `pip-beret` | `#9C6644` | High | High | Acorn cap beret with stem |
| | `pip-beret-dark` | `#7F4F24` | High | High | Acorn cap underside rim |
| | `pip-antenna` | `#FFD166` | High | Low | Golden antennae stalks |
| | `pip-bulb` | `#FFE66D` | High | Low | Glowing radiant antennae bulbs |
| | `pip-blush` | `rgba(255,107,129,0.55)` | Soft | Soft | Cheerful rosy cheek tint |
| | `pip-outline` | `#2D2013` | High | High | Character structural contours |
| **Level 1: Meadow**| `bg-sky-top` | `#56B4D3` | — | — | Sky gradient zenith |
| | `bg-sky-bot` | `#E4F5FC` | — | — | Sky horizon warmth |
| | `grass-top` | `#80D842` | High | High | Sunlit turf surface |
| | `grass-base` | `#58A825` | Moderate | High | Under-turf density |
| | `dirt-core` | `#825027` | High | Moderate | Rich earth subsoil |
| | `cloud-fluff` | `rgba(255,255,255,0.85)`| Soft | High | Parallax drifting clouds |
| **Level 2: Woods** | `woods-bg-dark` | `#112217` | — | — | Deep forest backdrop |
| | `woods-foliage` | `#235E2F` | High | High | Ancient tree leaves |
| | `woods-moss` | `#70A341` | High | High | Bough moss carpets |
| | `woods-bark` | `#4B2E1E` | High | Moderate | Solid trunk branches |
| | `sunbeam-light` | `rgba(255,246,190,0.14)`| Soft | High | Volumetric sun shafts |
| **Level 3: Caverns**| `cavern-abyss` | `#14112E` | — | — | Deep cave bedrock |
| | `crystal-cyan` | `#00F5D4` | High | High | Glowing neon stalactites |
| | `crystal-purple`| `#C77DFF` | High | High | Amethyst hazard spikes |
| | `shroom-cap` | `#FF5D8F` | High | High | Springboard mushroom top |
| | `shroom-stem` | `#FFACC7` | High | High | Accordion spring mushroom stem |
| **Level 4: Highlands**| `highland-sky` | `#3A86FF` | — | — | High-altitude mountain sky |
| | `cliff-rock` | `#C86428` | High | Moderate | Sunbaked sandstone crag |
| | `wind-stream` | `rgba(180,230,255,0.40)`| Soft | High | Thermal updraft wind trails |
| | `cloud-ledge` | `rgba(255,255,255,0.92)`| Soft | High | Dissolving puffy cloud platforms |
| **Level 5: Canopy** | `canopy-twilight`| `#2B0938` | — | — | Sacred tree crown sky |
| | `sunburst-gold` | `#FFB703` | High | Low | Holy solar radiance aura |
| | `elder-bark` | `#5A3825` | High | Moderate | Ancient colossal cedar wood |
| | `ember-particle`| `#FFE27A` | High | Low | Floating celestial embers |
| **Collectibles** | `berry-gold` | `#FFC300` | High | Low | Sun Berry golden skin |
| | `berry-core` | `#FF7B00` | High | High | Sun Berry glowing nucleus |
| | `acorn-gold` | `#FFD000` | High | Low | Golden Acorn shimmer |
| | `medallion-rim` | `#B8860B` | High | High | Lore Medallion metal bezel |
| **HUD & Modals** | `hud-heart-red` | `#FF3366` | High | High | Full health container |
| | `hud-heart-dark`| `rgba(20,20,30,0.45)` | Moderate | Moderate | Depleted heart container |
| | `hud-card-bg` | `rgba(30, 24, 18, 0.88)`| High | High | Dialogue & modal backing card |
| | `hud-card-border`| `#D4A373` | High | High | Carved parchment border |
| | `hud-text-gold` | `#FFE6A7` | High | High | Primary dialogue & title text |
| | `hud-text-body` | `#FFFFFF` | High | High | High-legibility text |

---

## 3. Procedural Vector Drawing Recipes (HTML5 Canvas 2D)

All rendering functions accept a standard 2D canvas context `ctx`, positional coordinates `x, y`, and state/options dictionaries.

```
                    [ 2D CANVAS DRAWING HIERARCHY ]
                                  |
            +---------------------+---------------------+
            |                                           |
    [ Ambient / Backdrops ]                     [ Actors & Entities ]
    - Multi-layer Parallax                      - Drop Shadow (Z-scaled)
    - Gradient Sky / Caves                      - Squash & Stretch Matrix
    - Sunbeams & Cloud Fluffs                   - Outlined Body Vectors
                                                - Facial Highlights & Blush
                                                - Particle Emitters
```

---

### 3.1 Protagonist: Pip the Meadow Sprite

```
       .-''''-.       (Acorn Cap Beret with Stem)
      (  `____' )     
     o==[ o  o ]==o   (Antennae with Glowing Bulbs + Expressive Eyes)
        \  ..  /      (Rosy Peach Blush Cheeks)
       /|`----'|\     
      / | #  # | \    (Emerald Mint Cloak with Flutter Fold)
     (  |______|  )   
       / /    \ \     (Little Sprite Boots)
```

#### Anatomical Breakdown:
- **Dimensions**: Base height 28px, width 20px (Sprite bounding box: 24×32px).
- **Beret**: Deep chestnut brown acorn cap with distinct textured cross-hatches and a jaunty top stem.
- **Antennae**: Twin curved golden stalks topped with soft pulsing amber glow bulbs (`#FFE66D`).
- **Face & Eyes**: Oversized oval dark pupils with twin specular catchlights; smiling curve mouth; soft translucent peach blush.
- **Leaf Cloak**: Mint green draped mantle (`#2EC4B6`) with darker underside shadow (`#1B9AAA`), fluttering realistically based on horizontal run speed and vertical falling velocity.
- **Boots**: Two dark acorn-shell boots with bouncy step animation.

```javascript
/**
 * Renders Pip the Meadow Sprite
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Center X position
 * @param {number} y - Bottom Y position (feet level)
 * @param {Object} state - Animation state parameters
 * @param {number} state.facing - 1 for right, -1 for left
 * @param {number} state.vx - Horizontal velocity (-200 to 200)
 * @param {number} state.vy - Vertical velocity (-400 to 480)
 * @param {boolean} state.isGrounded - Ground contact flag
 * @param {boolean} state.isDashing - Air-dash active flag
 * @param {number} state.invulnTimer - Invulnerability timer in seconds
 * @param {number} state.animTime - Global game time for idle bob & cloak flutter
 */
function drawPip(ctx, x, y, state) {
  const { facing = 1, vx = 0, vy = 0, isGrounded = true, isDashing = false, invulnTimer = 0, animTime = 0 } = state;

  // Invulnerability flicker (10Hz)
  if (invulnTimer > 0 && Math.floor(invulnTimer * 20) % 2 === 0) {
    return;
  }

  ctx.save();
  ctx.translate(x, y);

  // 1. Ground Drop Shadow (Scales with ground proximity)
  const groundDist = isGrounded ? 0 : Math.min(60, Math.max(0, -vy * 0.05));
  const shadowScale = isGrounded ? 1.0 : Math.max(0.4, 1.0 - groundDist / 80);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.20)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 11 * shadowScale, 3.5 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Kinematic Squash & Stretch Computation
  let sx = 1.0;
  let sy = 1.0;
  if (!isGrounded) {
    if (vy < -100) { // Jumping / Ascending stretch
      sx = 0.85;
      sy = 1.20;
    } else if (vy > 100) { // Falling stretch
      sx = 0.90;
      sy = 1.15;
    }
  } else if (Math.abs(vx) > 20) { // Running bounce
    const runCycle = Math.sin(animTime * 14);
    sx = 1.0 + runCycle * 0.08;
    sy = 1.0 - runCycle * 0.08;
  } else { // Idle breathing bob
    const idleBob = Math.sin(animTime * 3);
    sx = 1.0 + idleBob * 0.03;
    sy = 1.0 - idleBob * 0.03;
  }

  if (isDashing) {
    sx = 1.35;
    sy = 0.75;
  }

  // Apply facing direction and squash/stretch transform
  ctx.scale(facing * sx, sy);

  // Dash ghost / speed streak
  if (isDashing) {
    ctx.fillStyle = 'rgba(46, 196, 182, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-14, -14, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cloak Flutter angle based on velocity
  const cloakFlutter = !isGrounded ? Math.sin(animTime * 18) * 4 - vy * 0.02 : (Math.abs(vx) > 10 ? Math.sin(animTime * 16) * 5 : Math.sin(animTime * 4) * 2);

  // 3. Leaf Cloak (Back / Mantle)
  ctx.fillStyle = '#1B9AAA'; // Dark shadow fold
  ctx.beginPath();
  ctx.moveTo(-6, -18);
  ctx.quadraticCurveTo(-14 - Math.abs(vx) * 0.03, -8 + cloakFlutter, -12, -2);
  ctx.lineTo(8, -2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#2EC4B6'; // Vibrant Mint Cloak
  ctx.beginPath();
  ctx.moveTo(-7, -20);
  ctx.quadraticCurveTo(-12 - Math.abs(vx) * 0.04, -10 + cloakFlutter, -10, -2);
  ctx.quadraticCurveTo(0, -1, 7, -2);
  ctx.quadraticCurveTo(6, -12, 5, -20);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = '#14281D';
  ctx.stroke();

  // Cloak Golden Leaf Clasp
  ctx.fillStyle = '#FFD166';
  ctx.beginPath();
  ctx.arc(0, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 4. Little Boots (Legs)
  const legOffset = isGrounded && Math.abs(vx) > 20 ? Math.sin(animTime * 14) * 4 : 0;
  ctx.fillStyle = '#7F4F24';
  ctx.beginPath();
  ctx.ellipse(-4, -1 - Math.max(0, legOffset), 3, 2.2, 0, 0, Math.PI * 2);
  ctx.ellipse(4, -1 - Math.max(0, -legOffset), 3, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2D2013';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 5. Sprite Head & Body Base
  ctx.fillStyle = '#FFF4E0';
  ctx.beginPath();
  ctx.roundRect(-8, -26, 16, 15, [8, 8, 6, 6]);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#2D2013';
  ctx.stroke();

  // 6. Cheerful Peach Blush Cheeks
  ctx.fillStyle = 'rgba(255, 107, 129, 0.55)';
  ctx.beginPath();
  ctx.ellipse(-5.5, -17, 2.2, 1.3, 0, 0, Math.PI * 2);
  ctx.ellipse(5.5, -17, 2.2, 1.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // 7. Expressive Large Eyes & Specular Highlights
  ctx.fillStyle = '#221914';
  ctx.beginPath();
  ctx.ellipse(-3.5, -20, 2.2, 3.2, 0, 0, Math.PI * 2);
  ctx.ellipse(4.5, -20, 2.2, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Catchlights
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-4.2, -21.5, 1.0, 0, Math.PI * 2);
  ctx.arc(3.8, -21.5, 1.0, 0, Math.PI * 2);
  ctx.arc(-2.6, -19.0, 0.5, 0, Math.PI * 2);
  ctx.arc(5.4, -19.0, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Cute Smile
  ctx.strokeStyle = '#684535';
  ctx.lineWidth = 1.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0.5, -17, 2.0, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // 8. Acorn Cap Beret with Woody Texture
  ctx.fillStyle = '#9C6644';
  ctx.beginPath();
  ctx.ellipse(0, -26, 9.5, 5, -0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#2D2013';
  ctx.stroke();

  // Beret Brim Band
  ctx.fillStyle = '#7F4F24';
  ctx.beginPath();
  ctx.ellipse(0, -24, 8.5, 2.2, -0.05, 0, Math.PI * 2);
  ctx.fill();

  // Beret Top Stem
  ctx.strokeStyle = '#583110';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(0, -30);
  ctx.quadraticCurveTo(2, -34, 4, -35);
  ctx.stroke();

  // 9. Glowing Golden Antennae & Radiant Bulbs
  const antBob = Math.sin(animTime * 8) * 1.5;
  ctx.strokeStyle = '#FFD166';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-4, -28);
  ctx.quadraticCurveTo(-8, -33 + antBob, -9, -36 + antBob);
  ctx.moveTo(3, -28);
  ctx.quadraticCurveTo(7, -33 - antBob, 9, -36 - antBob);
  ctx.stroke();

  // Glowing Bulbs with Radial Soft Aura
  const bulbGlow = ctx.createRadialGradient(-9, -36 + antBob, 0.5, -9, -36 + antBob, 5);
  bulbGlow.addColorStop(0, '#FFFFFF');
  bulbGlow.addColorStop(0.4, '#FFE66D');
  bulbGlow.addColorStop(1, 'rgba(255, 230, 109, 0)');
  ctx.fillStyle = bulbGlow;
  ctx.beginPath();
  ctx.arc(-9, -36 + antBob, 5, 0, Math.PI * 2);
  ctx.fill();

  const bulbGlow2 = ctx.createRadialGradient(9, -36 - antBob, 0.5, 9, -36 - antBob, 5);
  bulbGlow2.addColorStop(0, '#FFFFFF');
  bulbGlow2.addColorStop(0.4, '#FFE66D');
  bulbGlow2.addColorStop(1, 'rgba(255, 230, 109, 0)');
  ctx.fillStyle = bulbGlow2;
  ctx.beginPath();
  ctx.arc(9, -36 - antBob, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 3.2 Enemy Archetype 1: Acorn Walker

```
        /|  (Leaf Sprout)
      .----.
     /  ..  \     (Chestnut Shell Helmet)
    |  >  <  |    (Angry Furrowed Brow)
    |  .__.  |    (Round Woody Body)
     \______/
      ||  ||      (Stubby Twig Boots)
```

```javascript
/**
 * Renders the Acorn Walker minion
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Center X
 * @param {number} y - Feet Level Y
 * @param {Object} state - { facing: 1|-1, animTime: number }
 */
function drawAcornWalker(ctx, x, y, state) {
  const { facing = 1, animTime = 0 } = state;
  const walkCycle = Math.sin(animTime * 10);
  const tilt = walkCycle * 0.12;

  ctx.save();
  ctx.translate(x, y);

  // Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.20)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(facing, 1);
  ctx.rotate(tilt);

  // Twig Feet
  ctx.fillStyle = '#5A3825';
  ctx.beginPath();
  ctx.ellipse(-5, -2 + Math.sin(animTime * 10) * 2, 2.5, 2, 0, 0, Math.PI * 2);
  ctx.ellipse(5, -2 - Math.sin(animTime * 10) * 2, 2.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Acorn Nut Body
  ctx.fillStyle = '#A06CD5'; // Underbody contour
  ctx.fillStyle = '#C68B59';
  ctx.beginPath();
  ctx.roundRect(-9, -20, 18, 18, [8, 8, 9, 9]);
  ctx.fill();
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = '#432818';
  ctx.stroke();

  // Woody Helmet Cap
  ctx.fillStyle = '#6F4E37';
  ctx.beginPath();
  ctx.ellipse(0, -18, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38220F';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Helmet Top Stem & Leaf Brow
  ctx.strokeStyle = '#38220F';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(2, -26);
  ctx.stroke();

  // Little Green Leaf on Cap
  ctx.fillStyle = '#6BCB77';
  ctx.beginPath();
  ctx.ellipse(3, -25, 3.5, 1.8, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Angry Furrowed Leaf Brows & Eyes
  ctx.fillStyle = '#2B1D0C';
  ctx.beginPath();
  ctx.arc(-4, -13, 2.2, 0, Math.PI * 2);
  ctx.arc(4, -13, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Tiny catchlights
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-4.5, -14, 0.7, 0, Math.PI * 2);
  ctx.arc(3.5, -14, 0.7, 0, Math.PI * 2);
  ctx.fill();

  // Angry slant brows
  ctx.strokeStyle = '#432818';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-6, -16);
  ctx.lineTo(-2, -14.5);
  ctx.moveTo(6, -16);
  ctx.lineTo(2, -14.5);
  ctx.stroke();

  ctx.restore();
}
```

---

### 3.3 Enemy Archetype 2: Spore Hopper

```
         .--------.
       /  *  *  *   \    (Violet Cap with Neon Yellow Spore Spots)
      |   ( -  - )   |   (Sleepy Blinking Eyes)
       \____________/
           \~~~~/        (Springy Accordion Stem Base)
```

```javascript
/**
 * Renders the Spore Hopper vertical jumping hazard
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {Object} state - { phase: 'idle'|'telegraph'|'jump'|'fall', vy: number, animTime: number }
 */
function drawSporeHopper(ctx, x, y, state) {
  const { phase = 'idle', vy = 0, animTime = 0 } = state;

  ctx.save();
  ctx.translate(x, y);

  // Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 11, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dynamic Squash and Stretch by phase
  let sx = 1.0;
  let sy = 1.0;
  if (phase === 'telegraph') {
    sx = 1.35;
    sy = 0.65; // Deep crouch windup
  } else if (phase === 'jump') {
    sx = 0.80;
    sy = 1.30; // Upward rocket stretch
  } else if (phase === 'fall') {
    sx = 0.95;
    sy = 1.10;
  }
  ctx.scale(sx, sy);

  // Spring Accordion Stem
  ctx.fillStyle = '#FFACC7';
  ctx.beginPath();
  ctx.roundRect(-5, -8, 10, 8, [2, 2, 4, 4]);
  ctx.fill();
  ctx.strokeStyle = '#5E1736';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Accordion Ribs
  ctx.strokeStyle = '#C9184A';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-5, -5); ctx.lineTo(5, -5);
  ctx.moveTo(-5, -2); ctx.lineTo(5, -2);
  ctx.stroke();

  // Mushroom Cap (Vibrant Violet / Magenta)
  ctx.fillStyle = '#7209B7';
  ctx.beginPath();
  ctx.arc(0, -12, 11, Math.PI, 0, false);
  ctx.quadraticCurveTo(0, -6, -11, -12);
  ctx.fill();
  ctx.strokeStyle = '#3C096C';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Neon Yellow Spore Spots
  ctx.fillStyle = '#FFEA00';
  ctx.beginPath();
  ctx.arc(-5, -17, 2.5, 0, Math.PI * 2);
  ctx.arc(4, -18, 2.0, 0, Math.PI * 2);
  ctx.arc(0, -21, 1.8, 0, Math.PI * 2);
  ctx.arc(-8, -13, 1.5, 0, Math.PI * 2);
  ctx.arc(8, -13, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Sleepy / Determined Eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(-4, -11, 2.2, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(4, -11, 2.2, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#240046';
  ctx.beginPath();
  ctx.arc(-4, -11, 1.4, 0, Math.PI * 2);
  ctx.arc(4, -11, 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Warning Particle Puffs during telegraph
  if (phase === 'telegraph') {
    ctx.fillStyle = 'rgba(255, 234, 0, 0.6)';
    ctx.beginPath();
    ctx.arc(-12, -4, 2, 0, Math.PI * 2);
    ctx.arc(12, -4, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
```

---

### 3.4 Enemy Archetype 3: Glow Bat Flyer

```
         /\__/\
       =(  oo  )=    (Fuzzy Indigo Bat Head & Radiant Cyan Eyes)
     /```  __  ```\  (Bioluminescent Cyan Membrane Wings)
    /   \ /  \ /   \
```

```javascript
/**
 * Renders the Glow Bat Flyer
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {Object} state - { facing: 1|-1, animTime: number }
 */
function drawGlowBat(ctx, x, y, state) {
  const { facing = 1, animTime = 0 } = state;
  const wingFlap = Math.sin(animTime * 12); // -1 (up) to 1 (down)

  ctx.save();
  ctx.translate(x, y);

  // Bioluminescent Soft Light Aura
  const aura = ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
  aura.addColorStop(0, 'rgba(0, 245, 212, 0.35)');
  aura.addColorStop(1, 'rgba(0, 245, 212, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(facing, 1);

  // Left & Right Bioluminescent Wings
  ctx.fillStyle = '#00F5D4';
  ctx.strokeStyle = '#05668D';
  ctx.lineWidth = 1.4;

  // Left Wing
  ctx.beginPath();
  ctx.moveTo(-4, 0);
  ctx.quadraticCurveTo(-14, -10 * wingFlap, -18, 2 * wingFlap);
  ctx.quadraticCurveTo(-12, 8 * wingFlap, -4, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right Wing
  ctx.beginPath();
  ctx.moveTo(4, 0);
  ctx.quadraticCurveTo(14, -10 * wingFlap, 18, 2 * wingFlap);
  ctx.quadraticCurveTo(12, 8 * wingFlap, 4, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Fuzzy Indigo Bat Body & Ears
  ctx.fillStyle = '#3A0CA3';
  ctx.beginPath();
  ctx.roundRect(-6, -7, 12, 14, [6, 6, 5, 5]);
  ctx.fill();
  ctx.strokeStyle = '#1D0047';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Pointy Bat Ears
  ctx.fillStyle = '#4CC9F0';
  ctx.beginPath();
  ctx.moveTo(-5, -6); ctx.lineTo(-8, -12); ctx.lineTo(-2, -7);
  ctx.moveTo(5, -6); ctx.lineTo(8, -12); ctx.lineTo(2, -7);
  ctx.fill();
  ctx.stroke();

  // Radiant Glowing Eyes
  ctx.fillStyle = '#FFD166';
  ctx.beginPath();
  ctx.arc(-2.5, -2, 2.0, 0, Math.PI * 2);
  ctx.arc(2.5, -2, 2.0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#03071E';
  ctx.beginPath();
  ctx.arc(-2.5, -2, 0.9, 0, Math.PI * 2);
  ctx.arc(2.5, -2, 0.9, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 3.5 Enemy Archetype 4: Bramble Charger

```
        /===/\
      /  \O/  \     (Thorny Spiked Bark Carapace)
     |  >>  << |    (Glowing Red Eyes / Swirls when Dazed)
     [==\____/==]   (Heavy Armored Tusks & Snout)
```

```javascript
/**
 * Renders the Bramble Charger
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {Object} state - { state: 'patrol'|'charging'|'stunned', facing: 1|-1, animTime: number }
 */
function drawBrambleCharger(ctx, x, y, state) {
  const { state: chargerState = 'patrol', facing = 1, animTime = 0 } = state;
  const isStunned = chargerState === 'stunned';
  const isCharging = chargerState === 'charging';

  ctx.save();
  ctx.translate(x, y);

  // Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(facing, 1);

  if (isCharging) {
    // Heavy charge dust streak behind
    ctx.fillStyle = 'rgba(217, 119, 36, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-18, -4, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Four Sturdy Legs
  ctx.fillStyle = '#4A2E18';
  const step = Math.sin(animTime * (isCharging ? 24 : 8)) * 3;
  ctx.beginPath();
  ctx.roundRect(-12, -4 + step, 5, 5, 2);
  ctx.roundRect(-4, -4 - step, 5, 5, 2);
  ctx.roundRect(4, -4 + step, 5, 5, 2);
  ctx.roundRect(10, -4 - step, 5, 5, 2);
  ctx.fill();

  // Heavy Bark Armor Carapace
  ctx.fillStyle = '#6B4226';
  ctx.beginPath();
  ctx.roundRect(-15, -20, 30, 18, [10, 10, 4, 4]);
  ctx.fill();
  ctx.strokeStyle = '#2B1709';
  ctx.lineWidth = 2.0;
  ctx.stroke();

  // Spiky Bramble Horns on Back
  ctx.fillStyle = '#C86428';
  ctx.beginPath();
  ctx.moveTo(-10, -20); ctx.lineTo(-7, -26); ctx.lineTo(-4, -20);
  ctx.moveTo(-2, -20); ctx.lineTo(1, -27); ctx.lineTo(4, -20);
  ctx.moveTo(6, -20); ctx.lineTo(9, -25); ctx.lineTo(12, -20);
  ctx.fill();
  ctx.stroke();

  // Snout and Tusks
  ctx.fillStyle = '#8B5A2B';
  ctx.beginPath();
  ctx.roundRect(8, -14, 8, 10, [3, 6, 6, 3]);
  ctx.fill();
  ctx.stroke();

  // Glowing Crimson Horn / Eye
  if (isStunned) {
    // Dizzy Swirl Eyes
    ctx.strokeStyle = '#FFB703';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(6, -13, 3, 0, Math.PI * 1.5);
    ctx.stroke();

    // Orbiting Cartoon Dizzy Stars
    const starAngle = animTime * 6;
    for (let i = 0; i < 3; i++) {
      const a = starAngle + (i * Math.PI * 2) / 3;
      const sx = Math.cos(a) * 14;
      const sy = -26 + Math.sin(a) * 5;
      ctx.fillStyle = '#FFE600';
      ctx.beginPath();
      ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Glowing Alert Crimson Eye
    ctx.fillStyle = isCharging ? '#FF0054' : '#ED4C67';
    ctx.beginPath();
    ctx.arc(6, -13, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(7, -14, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
```

---

### 3.6 Climax Boss: The Bramblethorn Golem

```
             /===========\
           /  |  /\ /\  |  \        (Ancient Carved Mossy Crown & Horns)
          |  (  { o o }  )  |       (Glowing Phase Eye Expressions)
         /   /===========\   \
        /   /             \   \     (Colossal Spiked Bark Fists)
       |   |   (( *** ))   |   |    (Exposed Solar Heart Core when Kneeling)
       |   |   (( CORE ))  |   |
        \   \             /   /
         \===\___________/===/
```

```javascript
/**
 * Renders the Bramblethorn Golem Climax Boss
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Center X (64px wide)
 * @param {number} y - Feet Y level (74px high)
 * @param {Object} state
 * @param {number} state.hp - Current Boss HP (1, 2, or 3)
 * @param {string} state.state - 'idle'|'slam'|'charge'|'vulnerable'|'dazed'
 * @param {number} state.vulnTimer - Vulnerability countdown
 * @param {number} state.animTime - Global clock
 */
function drawBramblethornGolem(ctx, x, y, state) {
  const { hp = 3, state: bState = 'idle', vulnTimer = 0, animTime = 0 } = state;
  const isVulnerable = bState === 'vulnerable' || bState === 'dazed';
  const isEnraged = hp === 1;

  ctx.save();
  ctx.translate(x, y);

  // Massive Boss Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 32, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stun / Kneel Offset
  const yOffset = isVulnerable ? 12 : Math.sin(animTime * 3) * 2;
  ctx.translate(0, yOffset);

  // 1. Colossal Bark Legs
  ctx.fillStyle = '#3E271E';
  ctx.beginPath();
  ctx.roundRect(-24, -20, 16, 20, [4, 4, 6, 6]);
  ctx.roundRect(8, -20, 16, 20, [4, 4, 6, 6]);
  ctx.fill();
  ctx.strokeStyle = '#1D110C';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 2. Heavy Carved Ancient Wood Torso
  ctx.fillStyle = '#5A3825';
  ctx.beginPath();
  ctx.roundRect(-28, -62, 56, 46, [14, 14, 8, 8]);
  ctx.fill();
  ctx.stroke();

  // Moss Patches on Shoulders
  ctx.fillStyle = '#4F772D';
  ctx.beginPath();
  ctx.ellipse(-20, -58, 8, 4, -0.2, 0, Math.PI * 2);
  ctx.ellipse(20, -58, 8, 4, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // 3. Ancient Head & Glowing Eye Slits
  ctx.fillStyle = '#43281C';
  ctx.beginPath();
  ctx.roundRect(-16, -76, 32, 18, [8, 8, 4, 4]);
  ctx.fill();
  ctx.stroke();

  // Antler Horns
  ctx.strokeStyle = '#6F4E37';
  ctx.lineWidth = 4.0;
  ctx.beginPath();
  ctx.moveTo(-12, -74); ctx.lineTo(-24, -90); ctx.lineTo(-28, -88);
  ctx.moveTo(12, -74); ctx.lineTo(24, -90); ctx.lineTo(28, -88);
  ctx.stroke();

  // Glowing Eye Expressions based on HP Phase
  const eyeColor = isEnraged ? '#FF0054' : (hp === 2 ? '#FF9E00' : '#00F5D4');
  ctx.fillStyle = eyeColor;
  ctx.beginPath();
  ctx.ellipse(-7, -68, 3.5, 2.0, isEnraged ? 0.3 : 0, 0, Math.PI * 2);
  ctx.ellipse(7, -68, 3.5, 2.0, isEnraged ? -0.3 : 0, 0, Math.PI * 2);
  ctx.fill();

  // 4. Chest Core / Solar Heart
  if (isVulnerable) {
    // Open Heart Core with Radiant Pulsing Flare
    const corePulse = Math.sin(animTime * 10) * 3;
    const coreGlow = ctx.createRadialGradient(0, -38, 2, 0, -38, 18 + corePulse);
    coreGlow.addColorStop(0, '#FFFFFF');
    coreGlow.addColorStop(0.3, '#FFD166');
    coreGlow.addColorStop(0.7, '#FF5400');
    coreGlow.addColorStop(1, 'rgba(255, 84, 0, 0)');

    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(0, -38, 18 + corePulse, 0, Math.PI * 2);
    ctx.fill();

    // Inner Vulnerable Glyph
    ctx.fillStyle = '#FFE66D';
    ctx.beginPath();
    ctx.arc(0, -38, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // Floating Stomp Downward Arrow Cue
    const arrowBob = Math.sin(animTime * 8) * 4;
    ctx.fillStyle = '#FFE600';
    ctx.beginPath();
    ctx.moveTo(0, -68 + arrowBob);
    ctx.lineTo(-6, -78 + arrowBob);
    ctx.lineTo(6, -78 + arrowBob);
    ctx.closePath();
    ctx.fill();
  } else {
    // Shielded Briar Plate Chest
    ctx.fillStyle = '#2B1709';
    ctx.beginPath();
    ctx.roundRect(-12, -46, 24, 18, 4);
    ctx.fill();
    ctx.strokeStyle = '#780000';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Thorns across chest plate
    ctx.strokeStyle = '#D90429';
    ctx.beginPath();
    ctx.moveTo(-10, -42); ctx.lineTo(-6, -48); ctx.lineTo(-2, -42);
    ctx.moveTo(2, -42); ctx.lineTo(6, -48); ctx.lineTo(10, -42);
    ctx.stroke();
  }

  // 5. Spiked Heavy Fists
  const fistBob = Math.sin(animTime * 4) * 4;
  ctx.fillStyle = '#4A2E18';
  ctx.beginPath();
  ctx.roundRect(-36, -42 + fistBob, 14, 18, [6, 4, 6, 6]);
  ctx.roundRect(22, -42 - fistBob, 14, 18, [4, 6, 6, 6]);
  ctx.fill();
  ctx.strokeStyle = '#1D110C';
  ctx.lineWidth = 2.0;
  ctx.stroke();

  ctx.restore();
}
```

---

### 3.7 Collectibles: Sun Berries, Acorns, & 5 Lore Medallions

```javascript
/**
 * Renders the Radiant Golden Sun Berry
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} animTime
 */
function drawSunBerry(ctx, x, y, animTime = 0) {
  const floatBob = Math.sin(animTime * 4) * 3;
  const pulse = Math.sin(animTime * 6) * 1.5;

  ctx.save();
  ctx.translate(x, y + floatBob);

  // Radiant Golden Bloom Glow
  const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 16 + pulse);
  glow.addColorStop(0, '#FFFFFF');
  glow.addColorStop(0.35, '#FFE169');
  glow.addColorStop(0.7, '#FF9E00');
  glow.addColorStop(1, 'rgba(255, 158, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 16 + pulse, 0, Math.PI * 2);
  ctx.fill();

  // Triple Berry Spheres Cluster
  ctx.fillStyle = '#FFB703';
  ctx.beginPath();
  ctx.arc(-3.5, 1, 5, 0, Math.PI * 2);
  ctx.arc(3.5, 1, 5, 0, Math.PI * 2);
  ctx.arc(0, -4, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = '#D48B00';
  ctx.stroke();

  // Emerald Leaf Stalk
  ctx.fillStyle = '#52B788';
  ctx.beginPath();
  ctx.ellipse(3, -9, 3.5, 1.8, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2D6A4F';
  ctx.lineWidth = 1.0;
  ctx.stroke();

  // Tiny orbiting sun sparkles
  for (let i = 0; i < 3; i++) {
    const angle = animTime * 3 + (i * Math.PI * 2) / 3;
    const sx = Math.cos(angle) * 12;
    const sy = Math.sin(angle) * 8;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Renders Golden Acorn
 */
function drawGoldenAcorn(ctx, x, y, animTime = 0) {
  const spin = Math.sin(animTime * 5); // 3D-like turn effect

  ctx.save();
  ctx.translate(x, y + Math.sin(animTime * 3) * 2.5);
  ctx.scale(spin, 1);

  // Golden Body
  ctx.fillStyle = '#FFD000';
  ctx.beginPath();
  ctx.roundRect(-5, -3, 10, 10, [2, 2, 6, 6]);
  ctx.fill();
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Woody Cap
  ctx.fillStyle = '#8B5A2B';
  ctx.beginPath();
  ctx.ellipse(0, -4, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Renders 1 of the 5 Ancient Lore Medallions
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {string} id - 'medallion_dawn'|'medallion_whispers'|'medallion_luminescence'|'medallion_zephyr'|'medallion_ancients'
 * @param {number} animTime
 */
function drawLoreMedallion(ctx, x, y, id, animTime = 0) {
  ctx.save();
  ctx.translate(x, y + Math.sin(animTime * 3) * 3);

  // Beveled Metallic Outer Rim
  ctx.fillStyle = '#DDA15E';
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7F4F24';
  ctx.lineWidth = 2.0;
  ctx.stroke();

  // Inner Jewel Field by Medallion ID
  let coreColor = '#FFB703';
  let glyphColor = '#FFFFFF';
  if (id === 'medallion_dawn') coreColor = '#FB8500';
  if (id === 'medallion_whispers') coreColor = '#52B788';
  if (id === 'medallion_luminescence') coreColor = '#00F5D4';
  if (id === 'medallion_zephyr') coreColor = '#3A86FF';
  if (id === 'medallion_ancients') coreColor = '#7209B7';

  ctx.fillStyle = coreColor;
  ctx.beginPath();
  ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
  ctx.fill();

  // Distinct Core Glyph
  ctx.strokeStyle = glyphColor;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  if (id === 'medallion_dawn') {
    // 8-point sunburst
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  } else if (id === 'medallion_whispers') {
    // Spiral leaf
    ctx.ellipse(0, 0, 4.5, 2.5, 0.8, 0, Math.PI * 2);
  } else if (id === 'medallion_luminescence') {
    // Crystal diamond
    ctx.moveTo(0, -5); ctx.lineTo(4, 0); ctx.lineTo(0, 5); ctx.lineTo(-4, 0); ctx.closePath();
  } else if (id === 'medallion_zephyr') {
    // Wind gusts
    ctx.arc(-1, -2, 3, 0, Math.PI);
    ctx.arc(1, 2, 3, Math.PI, 0);
  } else {
    // Ancient tree star
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.moveTo(0, -6); ctx.lineTo(0, 6);
  }
  ctx.stroke();

  ctx.restore();
}
```

---

### 3.8 Interactive Story NPCs: Barnaby Snail, Willow Owl, & Elder Root Spirit

```javascript
/**
 * Renders Barnaby Snail with his Teapot Shell & Brass Spectacles
 */
function drawBarnabySnail(ctx, x, y, animTime = 0) {
  ctx.save();
  ctx.translate(x, y);

  // Ground Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cozy Soft Snail Foot
  ctx.fillStyle = '#E9D8A6';
  ctx.beginPath();
  ctx.roundRect(-16, -8, 34, 8, [6, 6, 2, 2]);
  ctx.fill();
  ctx.strokeStyle = '#94D2BD';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Large Swirled Cozy Shell
  ctx.fillStyle = '#EE9B00';
  ctx.beginPath();
  ctx.arc(-2, -18, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#CA6702';
  ctx.lineWidth = 2.0;
  ctx.stroke();

  // Shell Spiral Lines
  ctx.beginPath();
  ctx.arc(-2, -18, 8, 0, Math.PI * 1.6);
  ctx.stroke();

  // Tiny Porcelain Teapot on Shell
  ctx.fillStyle = '#E0FBFC';
  ctx.beginPath();
  ctx.roundRect(-5, -36, 10, 6, 2);
  ctx.fill();
  ctx.strokeStyle = '#3D5A80';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  // Spout & Lid
  ctx.beginPath();
  ctx.moveTo(5, -34); ctx.lineTo(8, -36);
  ctx.moveTo(-1, -36); ctx.lineTo(-1, -38);
  ctx.stroke();

  // Friendly Head & Eye Stalks
  ctx.fillStyle = '#E9D8A6';
  ctx.beginPath();
  ctx.ellipse(14, -14, 6, 8, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eye Stalks with Spectacles
  ctx.strokeStyle = '#94D2BD';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(14, -20); ctx.lineTo(12, -26);
  ctx.moveTo(18, -19); ctx.lineTo(19, -26);
  ctx.stroke();

  // Brass Wire Spectacles
  ctx.strokeStyle = '#DDA15E';
  ctx.lineWidth = 1.4;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(12, -26, 3, 0, Math.PI * 2);
  ctx.arc(19, -26, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#001219';
  ctx.beginPath();
  ctx.arc(12, -26, 1.2, 0, Math.PI * 2);
  ctx.arc(19, -26, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Renders Willow Owl with Scholar Map Lectern
 */
function drawWillowOwl(ctx, x, y, animTime = 0) {
  ctx.save();
  ctx.translate(x, y);

  // Lectern
  ctx.fillStyle = '#5A3825';
  ctx.fillRect(-10, -14, 20, 14);
  ctx.beginPath();
  ctx.moveTo(-14, -14); ctx.lineTo(14, -14); ctx.lineTo(10, -18); ctx.lineTo(-10, -18);
  ctx.fill();

  // Open Parchment Map
  ctx.fillStyle = '#FAEDCD';
  ctx.beginPath();
  ctx.roundRect(-8, -20, 16, 6, 1);
  ctx.fill();

  // Stately Owl Body
  const breathe = Math.sin(animTime * 3) * 1.5;
  ctx.fillStyle = '#4A3E3D';
  ctx.beginPath();
  ctx.roundRect(-10, -42 + breathe, 20, 24, [10, 10, 6, 6]);
  ctx.fill();
  ctx.strokeStyle = '#28231D';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Feather Tuft Ears
  ctx.fillStyle = '#D4A373';
  ctx.beginPath();
  ctx.moveTo(-9, -42 + breathe); ctx.lineTo(-14, -50 + breathe); ctx.lineTo(-5, -44 + breathe);
  ctx.moveTo(9, -42 + breathe); ctx.lineTo(14, -50 + breathe); ctx.lineTo(5, -44 + breathe);
  ctx.fill();
  ctx.stroke();

  // Huge Scholar Eyes & Beak
  ctx.fillStyle = '#FEFAE0';
  ctx.beginPath();
  ctx.arc(-4.5, -34 + breathe, 4.5, 0, Math.PI * 2);
  ctx.arc(4.5, -34 + breathe, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#BC6C25';
  ctx.beginPath();
  ctx.arc(-4.5, -34 + breathe, 2.0, 0, Math.PI * 2);
  ctx.arc(4.5, -34 + breathe, 2.0, 0, Math.PI * 2);
  ctx.fill();

  // Golden Beak
  ctx.fillStyle = '#DDA15E';
  ctx.beginPath();
  ctx.moveTo(0, -32 + breathe); ctx.lineTo(2, -27 + breathe); ctx.lineTo(-2, -27 + breathe);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Renders the Ethereal Elder Root Spirit
 */
function drawElderRootSpirit(ctx, x, y, animTime = 0) {
  ctx.save();
  ctx.translate(x, y + Math.sin(animTime * 2.5) * 5);

  // Luminous Aura Ribbons
  const aura = ctx.createRadialGradient(0, -20, 5, 0, -20, 42);
  aura.addColorStop(0, 'rgba(255, 230, 109, 0.6)');
  aura.addColorStop(0.6, 'rgba(128, 237, 153, 0.3)');
  aura.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, -20, 42, 0, Math.PI * 2);
  ctx.fill();

  // Ethereal Flowing Gown / Roots
  ctx.fillStyle = '#80ED99';
  ctx.beginPath();
  ctx.moveTo(-10, -20);
  ctx.quadraticCurveTo(-18, 0, -12, 16);
  ctx.quadraticCurveTo(0, 8, 12, 16);
  ctx.quadraticCurveTo(18, 0, 10, -20);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#38B000';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Torso & Peaceful Face
  ctx.fillStyle = '#FAEDCD';
  ctx.beginPath();
  ctx.ellipse(0, -28, 9, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Flowering Antler Crown
  ctx.strokeStyle = '#606C38';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-6, -38); ctx.lineTo(-14, -54); ctx.lineTo(-22, -50);
  ctx.moveTo(6, -38); ctx.lineTo(14, -54); ctx.lineTo(22, -50);
  ctx.stroke();

  // Blossoming Pink Cherry Spores on Antlers
  ctx.fillStyle = '#FF758F';
  ctx.beginPath();
  ctx.arc(-14, -54, 3, 0, Math.PI * 2);
  ctx.arc(14, -54, 3, 0, Math.PI * 2);
  ctx.arc(-22, -50, 2.5, 0, Math.PI * 2);
  ctx.arc(22, -50, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Serene Eyes
  ctx.strokeStyle = '#283618';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(-4, -28, 2.5, 0.1, Math.PI - 0.1);
  ctx.arc(4, -28, 2.5, 0.1, Math.PI - 0.1);
  ctx.stroke();

  ctx.restore();
}
```

---

### 3.9 Environmental Interactive Mechanisms

```javascript
/**
 * Renders Checkpoint Waystone (Dormant vs Attuned)
 */
function drawWaystone(ctx, x, y, isAttuned = false, animTime = 0) {
  ctx.save();
  ctx.translate(x, y);

  // Stone Pillar
  ctx.fillStyle = '#6C757D';
  ctx.beginPath();
  ctx.roundRect(-10, -36, 20, 36, [4, 4, 1, 1]);
  ctx.fill();
  ctx.strokeStyle = '#343A40';
  ctx.lineWidth = 2.0;
  ctx.stroke();

  // Carved Runic Glyph
  const runeGlow = isAttuned ? '#FFD166' : '#495057';
  if (isAttuned) {
    const pulse = ctx.createRadialGradient(0, -20, 2, 0, -20, 14);
    pulse.addColorStop(0, '#FFE66D');
    pulse.addColorStop(0.5, 'rgba(255, 209, 102, 0.4)');
    pulse.addColorStop(1, 'rgba(255, 209, 102, 0)');
    ctx.fillStyle = pulse;
    ctx.beginPath();
    ctx.arc(0, -20, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = runeGlow;
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.arc(0, -20, 5, 0, Math.PI * 2);
  ctx.moveTo(0, -28); ctx.lineTo(0, -12);
  ctx.stroke();

  ctx.restore();
}

/**
 * Renders Springboard Mushroom
 */
function drawSpringboardMushroom(ctx, x, y, isCompressed = false) {
  ctx.save();
  ctx.translate(x, y);

  const scaleY = isCompressed ? 0.45 : 1.0;
  const scaleX = isCompressed ? 1.40 : 1.0;
  ctx.scale(scaleX, scaleY);

  // Accordion Stem
  ctx.fillStyle = '#E2ECE9';
  ctx.fillRect(-6, -10, 12, 10);
  ctx.strokeStyle = '#6C757D';
  ctx.strokeRect(-6, -10, 12, 10);

  // Bouncy Magenta Cap
  ctx.fillStyle = '#F72585';
  ctx.beginPath();
  ctx.arc(0, -12, 15, Math.PI, 0, false);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#7209B7';
  ctx.lineWidth = 2.0;
  ctx.stroke();

  // White Bouncy Dots
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, -20, 3, 0, Math.PI * 2);
  ctx.arc(-8, -14, 2, 0, Math.PI * 2);
  ctx.arc(8, -14, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

## 4. UI Themes & HUD Component Specification

```
+-------------------------------------------------------------------------+
| [ ♥ ♥ ♥ ]               SUN BERRIES: 18/25                 [ ⏸ ] [ 🔊 ]|
|                         SCORE: 04,280   [ ✦ ✦ ✦ ✧ ✧ ]                   |
+-------------------------------------------------------------------------+
```

### 4.1 HUD Heart Containers

```javascript
/**
 * Renders a single HUD Heart Container
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {boolean} isFilled
 */
function drawHUDHeart(ctx, x, y, isFilled = true) {
  ctx.save();
  ctx.translate(x, y);

  if (isFilled) {
    // Filled Vibrant Red Heart with Top White Specular Sheen
    ctx.fillStyle = '#FF3366';
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(-9, -6, -10, -12, 0, -14);
    ctx.bezierCurveTo(10, -12, 9, -6, 0, 4);
    ctx.fill();
    ctx.strokeStyle = '#990033';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Specular highlight gleam
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(-3.5, -9, 1.8, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Empty Translucent Outline Container
    ctx.fillStyle = 'rgba(20, 20, 30, 0.45)';
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(-9, -6, -10, -12, 0, -14);
    ctx.bezierCurveTo(10, -12, 9, -6, 0, 4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore();
}
```

---

### 4.2 Non-Overflowing Dialogue Box with Vector Avatar

```javascript
/**
 * Renders the story dialogue box with high readability and animated page prompt
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Box Top Left X (560px wide)
 * @param {number} y - Box Top Left Y (100px high)
 * @param {string} speaker - NPC Name
 * @param {string} text - Formatted auto-wrapped text line
 * @param {string} avatarId - 'barnaby_snail'|'willow_owl'|'elder_root_spirit'
 * @param {number} animTime
 */
function drawDialogueBox(ctx, x, y, speaker, textLines, avatarId, animTime = 0) {
  ctx.save();

  // 1. Semi-translucent Wood Card Background
  ctx.fillStyle = 'rgba(25, 18, 12, 0.92)';
  ctx.beginPath();
  ctx.roundRect(x, y, 560, 100, [10, 10, 10, 10]);
  ctx.fill();
  ctx.strokeStyle = '#D4A373';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 2. Corner Leaf Accents
  ctx.fillStyle = '#6BCB77';
  ctx.beginPath();
  ctx.arc(x + 10, y + 10, 4, 0, Math.PI * 2);
  ctx.arc(x + 550, y + 10, 4, 0, Math.PI * 2);
  ctx.fill();

  // 3. Avatar Portrait Frame (64x64)
  ctx.fillStyle = '#3E271E';
  ctx.fillRect(x + 12, y + 18, 64, 64);
  ctx.strokeStyle = '#A67C52';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(x + 12, y + 18, 64, 64);

  // Render NPC Mini Vector inside Frame
  ctx.save();
  ctx.beginPath();
  ctx.rect(x + 12, y + 18, 64, 64);
  ctx.clip();
  if (avatarId === 'barnaby_snail') {
    drawBarnabySnail(ctx, x + 38, y + 74, animTime);
  } else if (avatarId === 'willow_owl') {
    drawWillowOwl(ctx, x + 44, y + 80, animTime);
  } else if (avatarId === 'elder_root_spirit') {
    drawElderRootSpirit(ctx, x + 44, y + 66, animTime);
  }
  ctx.restore();

  // 4. Speaker Title
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#FFD166';
  ctx.fillText(speaker, x + 90, y + 28);

  // 5. Body Text Lines
  ctx.font = '14px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  textLines.forEach((line, index) => {
    ctx.fillText(line, x + 90, y + 50 + index * 20);
  });

  // 6. Flashing Pagination Acorn / Button Cue
  const promptBob = Math.sin(animTime * 6) * 3;
  ctx.fillStyle = '#FFB703';
  ctx.beginPath();
  ctx.arc(x + 538, y + 78 + promptBob, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

---

### 4.3 Mobile Touch Controls: Virtual D-Pad & Action Buttons

```javascript
/**
 * Renders On-Screen Virtual Controls for Mobile Touch
 */
function drawTouchControls(ctx, width, height, activeInputs = {}) {
  ctx.save();

  // Left D-Pad Base
  const dpadX = 70;
  const dpadY = height - 70;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.arc(dpadX, dpadY, 44, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2.0;
  ctx.stroke();

  // Directional Arrows
  ctx.fillStyle = activeInputs.left ? '#FFD166' : 'rgba(255, 255, 255, 0.6)';
  ctx.fillRect(dpadX - 36, dpadY - 8, 16, 16);
  ctx.fillStyle = activeInputs.right ? '#FFD166' : 'rgba(255, 255, 255, 0.6)';
  ctx.fillRect(dpadX + 20, dpadY - 8, 16, 16);

  // Right Jump Button (A - Emerald)
  const jumpX = width - 60;
  const jumpY = height - 60;
  ctx.fillStyle = activeInputs.jump ? '#52B788' : 'rgba(46, 196, 182, 0.6)';
  ctx.beginPath();
  ctx.arc(jumpX, jumpY, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.0;
  ctx.stroke();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('A', jumpX - 6, jumpY + 6);

  // Right Dash Button (B - Amber)
  const dashX = width - 118;
  const dashY = height - 42;
  ctx.fillStyle = activeInputs.dash ? '#FB8500' : 'rgba(255, 183, 3, 0.6)';
  ctx.beginPath();
  ctx.arc(dashX, dashY, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.0;
  ctx.stroke();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('B', dashX - 6, dashY + 5);

  ctx.restore();
}
```

---

## 5. Visual Juice, Particles, & Animation Timings

```
+--------------------------------------------------------------------------------+
| VISUAL JUICE MATRIX                                                            |
| Action               | Particles & FX             | Screen Shake  | Sound Sync |
| -------------------- | -------------------------- | ------------- | ---------- |
| Footstep             | 2 Dust Puffs (#E0D6C3)     | None          | Noise Click|
| Jump Takeoff         | 4 Radial Dirt Motes        | None          | Sine Rise  |
| Meadow Dash          | 6 Mint Leaves + Sparkles   | 1px (20ms)    | Noise Sweep|
| Stomp Minion Bounce  | 8 Gold Stars + Popping Cap | 2px (40ms)    | Pop Chord  |
| Boss Shockwave Slam  | 14 Ground Splinters + Dust | 4px (150ms)   | Sub Boom   |
| Sun Berry Collected  | 12 Orbiting Starbursts     | None          | Arpeggio   |
| Waystone Attunement  | Runic Amber Wave Burst     | 1px (60ms)    | Major Chord|
+--------------------------------------------------------------------------------+
```

### 5.1 Particle System Specification
1. **Emerald Leaf Burst (`leaf_burst`)**: Emitted upon Meadow Dash and jumping off canopies. 6–8 particles with random spin, drifting horizontally with soft air resistance ($d_x = 0.94$).
2. **Golden Sun Sparkle (`sun_sparkle`)**: Emitted upon Berry collect or boss defeat. 12 radiant four-point vector stars scaling from $1.0 \to 0.0$ over $0.6\text{s}$.
3. **Wood Splinter Shards (`wood_shards`)**: Emitted when Acorn Walkers or Bramble Chargers are stomped. 6 angular brown triangles launched with high velocity ($v_y = -180\text{px/s}$).
4. **Thermal Wind Streaks (`thermal_streaks`)**: Vertical cyan and white breeze trails rising in Level 4 updrafts ($v_y = -140\text{px/s}$).

---
*End of Art Direction Specification — Meadowbound*
