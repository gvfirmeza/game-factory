/**
 * Math utilities for game physics, rendering, and gameplay balance.
 */
export const MathUtils = {
  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  },

  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  // Moves current towards target by at most maxDelta
  approach(current, target, maxDelta) {
    if (current < target) {
      return Math.min(current + maxDelta, target);
    }
    return Math.max(current - maxDelta, target);
  },

  sign(val) {
    return val > 0 ? 1 : val < 0 ? -1 : 0;
  },

  map(val, inMin, inMax, outMin, outMax) {
    return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
  },

  smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  },

  // Smooth damping towards target (frame-rate independent)
  damp(current, target, smoothing, dt) {
    return MathUtils.lerp(current, target, 1 - Math.exp(-smoothing * dt));
  },

  randomRange(min, max) {
    return min + Math.random() * (max - min);
  },

  randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  degToRad(deg) {
    return (deg * Math.PI) / 180;
  },

  radToDeg(rad) {
    return (rad * 180) / Math.PI;
  },

  distanceSq(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
  },

  distance(x1, y1, x2, y2) {
    return Math.sqrt(MathUtils.distanceSq(x1, y1, x2, y2));
  },

  checkAABB(r1, r2) {
    return !(
      r1.x + r1.w <= r2.x ||
      r1.x >= r2.x + r2.w ||
      r1.y + r1.h <= r2.y ||
      r1.y >= r2.y + r2.h
    );
  },

  checkCircle(c1, c2) {
    return MathUtils.distanceSq(c1.x, c1.y, c2.x, c2.y) <= (c1.radius + c2.radius) ** 2;
  }
};
