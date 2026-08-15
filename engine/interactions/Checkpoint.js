import { ProceduralPrimitives } from '../rendering/ProceduralPrimitives.js';
import { MathUtils } from '../core/MathUtils.js';

/**
 * Ancient Waystone Checkpoint with activation pulse and respawn anchor.
 */
export class Checkpoint {
  constructor(x, y, name = 'Grove Waystone') {
    this.x = x;
    this.y = y;
    this.name = name;
    this.activated = false;
    this.pulseTime = 0;
  }

  update(dt, playerX, playerY, onActivate = null) {
    this.pulseTime += dt;

    if (!this.activated) {
      const dist = MathUtils.distance(this.x, this.y, playerX, playerY);
      if (dist < 45) {
        this.activated = true;
        if (onActivate) {
          onActivate(this);
        }
      }
    }
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Stone Base
    ProceduralPrimitives.roundedRect(ctx, -14, -4, 28, 20, 4, '#2F3542', '#1E272E', 2);

    // Waystone Pillar
    ProceduralPrimitives.roundedRect(ctx, -10, -32, 20, 30, [8, 8, 2, 2], '#57606F', '#2F3542', 2);

    // Glowing Waystone Crystal
    const crystalColor = this.activated ? '#2ED573' : '#747D8C';
    const pulse = this.activated ? (Math.sin(this.pulseTime * 5) + 1) * 0.5 : 0;

    ctx.fillStyle = crystalColor;
    ProceduralPrimitives.circle(ctx, 0, -18, 6 + pulse * 2);
    if (this.activated) {
      ctx.fillStyle = 'rgba(46, 213, 115, 0.3)';
      ProceduralPrimitives.circle(ctx, 0, -18, 14 + pulse * 4);
    }

    ctx.restore();
  }
}
