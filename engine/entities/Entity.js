import { MathUtils } from '../core/MathUtils.js';

/**
 * Base Entity with spatial properties, collision bounding, and life management.
 */
export class Entity {
  constructor(x = 0, y = 0, width = 32, height = 32) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = 0;
    this.vy = 0;
    this.active = true;
    this.hitboxPadding = 4; // Generous hitbox inset for responsive feel
    this.tags = new Set();
  }

  getBounds() {
    return {
      x: this.x - this.width / 2 + this.hitboxPadding,
      y: this.y - this.height / 2 + this.hitboxPadding,
      w: this.width - this.hitboxPadding * 2,
      h: this.height - this.hitboxPadding * 2
    };
  }

  intersects(other) {
    if (!this.active || !other.active) return false;
    return MathUtils.checkAABB(this.getBounds(), other.getBounds());
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  render(ctx) {
    // Override in derived classes
  }
}
