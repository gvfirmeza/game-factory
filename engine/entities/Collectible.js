import { Entity } from './Entity.js';
import { ProceduralPrimitives } from '../rendering/ProceduralPrimitives.js';

/**
 * Animated collectible item with bobbing and sparkle glow.
 */
export class Collectible extends Entity {
  constructor(x, y, type = 'corn', value = 10) {
    super(x, y, 26, 26);
    this.type = type;
    this.value = value;
    this.tags.add('collectible');
    this.bobOffset = Math.random() * Math.PI * 2;
    this.age = 0;
  }

  update(dt) {
    this.age += dt;
  }

  render(ctx) {
    const bobY = Math.sin(this.age * 4 + this.bobOffset) * 4;
    const drawY = this.y + bobY;

    ctx.save();
    ctx.translate(this.x, drawY);

    // Ground shadow that scales with bob height
    const shadowScale = 1 - Math.abs(bobY) / 12;
    ProceduralPrimitives.groundShadow(ctx, 0, 16 - bobY, 10 * shadowScale, 4 * shadowScale, 0.25);

    // Glow aura
    const pulse = (Math.sin(this.age * 6) + 1) * 0.5;
    ctx.fillStyle = `rgba(255, 217, 61, ${0.15 + pulse * 0.15})`;
    ProceduralPrimitives.circle(ctx, 0, 0, 14 + pulse * 4);

    if (this.type === 'apple') {
      // Apple body
      ProceduralPrimitives.circle(ctx, -4, 2, 7, '#FF4757', '#C31432', 1.5);
      ProceduralPrimitives.circle(ctx, 4, 2, 7, '#FF4757', '#C31432', 1.5);
      // Stem & Leaf
      ProceduralPrimitives.roundedRect(ctx, -1, -8, 2, 6, 1, '#6F4E37');
      ProceduralPrimitives.ellipse(ctx, 4, -7, 4, 2, 0.4, '#2ED573');
      // Highlight
      ProceduralPrimitives.highlight(ctx, -3, -1, 3, 2, 0.5);
    } else if (this.type === 'coin') {
      // Golden coin
      ProceduralPrimitives.circle(ctx, 0, 0, 10, '#FFD93D', '#F39C12', 2);
      ProceduralPrimitives.circle(ctx, 0, 0, 6, '#F6E58D', '#F39C12', 1.5);
      ProceduralPrimitives.highlight(ctx, -3, -3, 3, 2, 0.6);
    } else {
      // Golden Corn (default)
      ProceduralPrimitives.roundedRect(ctx, -7, -10, 14, 20, 7, '#FFD93D', '#E1B12C', 1.5);
      // Leaf husk
      ProceduralPrimitives.polygon(
        ctx,
        [
          { x: -8, y: 10 },
          { x: 0, y: 12 },
          { x: -10, y: -2 }
        ],
        '#6BCB77'
      );
      ProceduralPrimitives.polygon(
        ctx,
        [
          { x: 8, y: 10 },
          { x: 0, y: 12 },
          { x: 10, y: -2 }
        ],
        '#6BCB77'
      );
      // Highlight
      ProceduralPrimitives.highlight(ctx, -2, -5, 4, 2, 0.6);
    }

    ctx.restore();
  }
}
