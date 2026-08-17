---
name: procedural-art
description: Code recipes, stylistic frameworks, and algorithms for procedural vector rendering of characters, vehicles, environments, and icons via HTML5 2D Canvas.
---

# Procedural Art Framework & Visual Identity Differentiation

## 1. Preventing Visual Repetition & Cookie-Cutter Aesthetics
The Art Director must develop a unique visual language for every game. Do NOT simply change background color hex codes. Actively vary:
1. **Silhouette & Shape Language**:
   - *Organic / Soft*: Rounded curves, bulbous leaves, wavy ripples (Cozy / Nature).
   - *Angular / Crystalline*: Sharp 45° bevels, geometric rhombuses, faceted surfaces (Sci-Fi / Caverns).
   - *Ancient / Weathered*: Cracked stone blocks, uneven masonry, crumbling pillars (Ruins / Antiquity).
2. **Proportions & Anatomy**:
   - Chibi/Sprite: Large head (50% height), stubby body, floating appendages.
   - Slender/Agile: Elongated limbs, flowing scarf or cloak, dynamic leaning torso.
   - Heavy/Golem: Broad rectangular shoulders, low center of gravity, tiny legs.
3. **Environment Composition & Parallax**:
   - Vary layering depth: Front silhouettes, mid-ground platforms, atmospheric fog planes, scrolling clouds, celestial celestial bodies.
4. **Distinct UI Language**:
   - Cozy wood-plank frames with parchment panels.
   - Futuristic neon glassmorphism with subtle glow.
   - Aquatic seashell/pearl badges with organic borders.

---

## 2. Procedural Shape Primitives
Always compose graphics using pure mathematical shapes with anti-aliasing:
- **Rounded Rectangles**: `ctx.roundRect(x, y, w, h, [r1, r2, r3, r4])`
- **Dynamic Drop Shadows**: Render an offset translucent ellipse below ground-standing actors before drawing the body.
- **Eye & Catchlight Highlights**: Layer white highlight circles in upper corners of pupil ellipses for expressiveness.
- **Linear & Radial Gradients**: Provide rich lighting gradients to avoid flat cartoon looks.

---

## 3. Squash & Stretch Animation Recipes
Always incorporate responsive kinematics deformation:
- **Run Lean**: `ctx.rotate(facing * 0.08 * Math.sin(animTime * 12))`
- **Jump Impulse**: `scaleX = 0.85, scaleY = 1.20`
- **Dash Surge**: `scaleX = 1.35, scaleY = 0.75`
- **Landing Impact**: `scaleX = 1.25, scaleY = 0.75`
- **Stomp Rebound**: `scaleX = 1.30, scaleY = 0.70`
- **Harmonic Spring Recovery**: `scale += (1.0 - scale) * dt * 14`
