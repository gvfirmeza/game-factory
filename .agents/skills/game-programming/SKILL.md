---
name: game-programming
description: Architecture standards, fixed timestep game loops, collision detection, object pooling, and state management for robust HTML5 2D games.
---

# Game Programming Skill

## 1. Fixed Timestep & RAF Loop
Use accumulator-based fixed timestep loops to ensure physics and gameplay are identical regardless of display refresh rate (60Hz, 120Hz, 144Hz):
```javascript
let lastTime = performance.now();
let accumulator = 0;
const STEP = 1 / 60;

function gameLoop(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.1); // clamp dt
  lastTime = time;
  accumulator += dt;

  while (accumulator >= STEP) {
    update(STEP);
    accumulator -= STEP;
  }

  render(accumulator / STEP); // alpha interpolation
  requestAnimationFrame(gameLoop);
}
```

## 2. AABB & Circle Collision
- **AABB Box Collision**:
  `!(r1.x + r1.w < r2.x || r1.x > r2.x + r2.w || r1.y + r1.h < r2.y || r1.y > r2.y + r2.h)`
- **Circle Collision**:
  `((c1.x - c2.x) ** 2 + (c1.y - c2.y) ** 2) <= (c1.radius + c2.radius) ** 2`
- **Padded Hitboxes**: Use hitboxes 10-15% smaller than the visible sprite for generous, player-friendly forgiveness.

## 3. Object Pooling
Pre-allocate particle and projectile arrays to prevent garbage collection hiccups during high-action moments.
