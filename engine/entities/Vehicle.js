import { Entity } from './Entity.js';
import { ProceduralPrimitives } from '../rendering/ProceduralPrimitives.js';

/**
 * Procedural Traffic Vehicle (Cars, Trucks, Vans).
 */
export class Vehicle extends Entity {
  constructor(x, y, speed, direction = 1, type = 'car') {
    const isTruck = type === 'truck';
    const width = isTruck ? 96 : 64;
    const height = 36;
    super(x, y, width, height);

    this.speed = speed;
    this.direction = direction; // 1 = moving right, -1 = moving left
    this.vx = speed * direction;
    this.type = type;
    this.tags.add('hazard');

    const carColors = ['#FF4757', '#3742FA', '#2ED573', '#FFA502', '#9B59B6', '#1E90FF'];
    this.color = carColors[Math.floor(Math.random() * carColors.length)];
  }

  update(dt) {
    this.x += this.vx * dt;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.direction < 0) {
      ctx.scale(-1, 1);
    }

    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // Ground shadow
    ProceduralPrimitives.groundShadow(ctx, 0, halfH + 2, halfW + 4, 6, 0.22);

    // Wheels
    ctx.fillStyle = '#1E272E';
    ProceduralPrimitives.roundedRect(ctx, -halfW + 8, halfH - 4, 14, 6, 2, '#1E272E');
    ProceduralPrimitives.roundedRect(ctx, halfW - 22, halfH - 4, 14, 6, 2, '#1E272E');
    ProceduralPrimitives.roundedRect(ctx, -halfW + 8, -halfH - 2, 14, 6, 2, '#1E272E');
    ProceduralPrimitives.roundedRect(ctx, halfW - 22, -halfH - 2, 14, 6, 2, '#1E272E');

    // Main Chassis Body
    ProceduralPrimitives.roundedRect(
      ctx,
      -halfW,
      -halfH,
      this.width,
      this.height,
      [8, 12, 12, 8],
      this.color,
      'rgba(0,0,0,0.2)',
      2
    );

    // Roof Cabin / Windshield
    const cabinW = this.width * 0.52;
    const cabinH = this.height * 0.72;
    ProceduralPrimitives.roundedRect(
      ctx,
      -halfW + 12,
      -cabinH / 2,
      cabinW,
      cabinH,
      6,
      '#70A1FF',
      '#1E272E',
      1.5
    );

    // Cabin highlight
    ProceduralPrimitives.roundedRect(
      ctx,
      -halfW + 16,
      -cabinH / 2 + 2,
      cabinW - 14,
      cabinH * 0.35,
      3,
      'rgba(255, 255, 255, 0.6)'
    );

    // Headlights (Front is at +halfW)
    ProceduralPrimitives.circle(ctx, halfW - 2, -halfH + 7, 3.5, '#FED330');
    ProceduralPrimitives.circle(ctx, halfW - 2, halfH - 7, 3.5, '#FED330');

    // Taillights (Rear is at -halfW)
    ProceduralPrimitives.roundedRect(ctx, -halfW, -halfH + 5, 3, 6, 1, '#EB3B5A');
    ProceduralPrimitives.roundedRect(ctx, -halfW, halfH - 11, 3, 6, 1, '#EB3B5A');

    ctx.restore();
  }
}
