---
name: procedural-art
description: Code recipes and algorithms for procedural vector rendering of characters, vehicles, environments, and icons via HTML5 2D Canvas.
---

# Procedural Art Skill

## 1. Procedural Shape Primitives
Always compose graphics using pure mathematical shapes with anti-aliasing:
- **Rounded Rectangles**: `ctx.roundRect(x, y, w, h, [r1, r2, r3, r4])`
- **Drop Shadows**: Render an offset translucent ellipse below ground-standing actors before drawing the body.
- **Eye & Facial Highlights**: Layer white highlight circles in upper corners of pupil ellipses for expressiveness.

## 2. Character Composition Structure
A cute procedural character consists of:
```javascript
function drawCuteCharacter(ctx, x, y, options) {
  ctx.save();
  ctx.translate(x, y);
  
  // 1. Ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 18, 16 * (options.scaleX || 1), 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Squash & stretch transformation
  ctx.scale(options.scaleX || 1, options.scaleY || 1);

  // 3. Main body / head
  ctx.fillStyle = options.primaryColor || '#FFD93D';
  ctx.beginPath();
  ctx.roundRect(-16, -24, 32, 36, [16, 16, 12, 12]);
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = options.strokeColor || '#B8860B';
  ctx.stroke();

  // 4. Cheeks (blush)
  ctx.fillStyle = 'rgba(255, 107, 129, 0.4)';
  ctx.beginPath();
  ctx.ellipse(-10, -4, 4, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(10, -4, 4, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. Eyes with catchlights
  ctx.fillStyle = '#2C3E50';
  ctx.beginPath();
  ctx.arc(-7, -10, 3, 0, Math.PI * 2);
  ctx.arc(7, -10, 3, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-8, -11, 1.2, 0, Math.PI * 2);
  ctx.arc(6, -11, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // 6. Beak / Snout / Mouth
  if (options.snoutColor) {
    ctx.fillStyle = options.snoutColor;
    ctx.beginPath();
    ctx.roundRect(-5, -6, 10, 6, [3, 3, 2, 2]);
    ctx.fill();
  }

  ctx.restore();
}
```

## 3. Vehicle & Environment Composition
- **Cars**: Rounded rectangle chassis + contrasting roof cabin + glowing headlights + dark rounded wheel wells.
- **Trees**: Fluffy segmented cloud circles layered with light/dark green gradients + wooden trunk.
- **Water / Grass**: Alternating subtle banded tiles or procedural ripple strokes.
