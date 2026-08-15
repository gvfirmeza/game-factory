import { Entity } from './Entity.js';
import { ProceduralPrimitives } from '../rendering/ProceduralPrimitives.js';
import { MathUtils } from '../core/MathUtils.js';

/**
 * Base Enemy Entity with patrol AI, damage hitboxes, knockback, and death animations.
 */
export class Enemy extends Entity {
  constructor(x, y, config = {}) {
    super(x, y, config.width || 28, config.height || 24);
    this.type = config.type || 'slime'; // 'slime', 'wisp', 'beetle'
    this.name = config.name || 'Forest Critter';
    this.health = config.health || 2;
    this.maxHealth = this.health;
    this.damage = config.damage || 1;

    this.patrolMinX = config.patrolMinX || x - 60;
    this.patrolMaxX = config.patrolMaxX || x + 60;
    this.speed = config.speed || 45;
    this.direction = 1;

    this.invulnTimer = 0;
    this.age = 0;
    this.isDead = false;
  }

  takeDamage(amount, knockbackX = 0, knockbackY = -120) {
    if (this.invulnTimer > 0 || this.isDead) return false;

    this.health -= amount;
    this.invulnTimer = 0.3;
    this.vx = knockbackX;
    this.vy = knockbackY;

    if (this.health <= 0) {
      this.isDead = true;
      this.active = false;
    }
    return true;
  }

  update(dt) {
    if (this.isDead) return;

    this.age += dt;
    if (this.invulnTimer > 0) {
      this.invulnTimer -= dt;
    }

    if (this.type === 'wisp') {
      // Floating / Bobbing wisp AI
      this.x += this.direction * this.speed * dt;
      this.y += Math.sin(this.age * 4) * 20 * dt;

      if (this.x >= this.patrolMaxX) {
        this.x = this.patrolMaxX;
        this.direction = -1;
      } else if (this.x <= this.patrolMinX) {
        this.x = this.patrolMinX;
        this.direction = 1;
      }
    } else {
      // Ground Patrol AI
      this.x += this.direction * this.speed * dt;
      if (this.x >= this.patrolMaxX) {
        this.x = this.patrolMaxX;
        this.direction = -1;
      } else if (this.x <= this.patrolMinX) {
        this.x = this.patrolMinX;
        this.direction = 1;
      }
    }
  }

  render(ctx) {
    if (!this.active) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.invulnTimer > 0 && Math.floor(this.age * 20) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    if (this.type === 'wisp') {
      // Shadow Wisp (Purple ethereal floating orb with eyes)
      const pulse = (Math.sin(this.age * 6) + 1) * 0.5;
      ctx.fillStyle = `rgba(142, 68, 173, ${0.3 + pulse * 0.3})`;
      ProceduralPrimitives.circle(ctx, 0, 0, 16 + pulse * 4);

      ProceduralPrimitives.circle(ctx, 0, 0, 11, '#8E44AD', '#2C3E50', 2);
      // Glowing evil eye
      ProceduralPrimitives.circle(ctx, this.direction * 3, -2, 4, '#FF4757');
      ProceduralPrimitives.circle(ctx, this.direction * 3, -2, 1.5, '#FFFFFF');
    } else if (this.type === 'beetle') {
      // Spiky Thorn Beetle
      ProceduralPrimitives.groundShadow(ctx, 0, 10, 12, 4, 0.25);
      ProceduralPrimitives.roundedRect(ctx, -14, -12, 28, 20, [10, 10, 4, 4], '#C0392B', '#2C3E50', 2);
      // Shell spikes
      ProceduralPrimitives.polygon(ctx, [{ x: -6, y: -12 }, { x: 0, y: -20 }, { x: 6, y: -12 }], '#E74C3C');
      // Angry eyes
      ProceduralPrimitives.circle(ctx, this.direction * 6, -4, 2.5, '#F1C40F');
    } else {
      // Bramble Slime (Bouncy green/thorn blob)
      const squash = 1 + Math.sin(this.age * 8) * 0.15;
      ctx.scale(squash, 2 - squash);
      ProceduralPrimitives.groundShadow(ctx, 0, 10, 12, 4, 0.25);
      ProceduralPrimitives.circle(ctx, 0, -2, 12, '#27AE60', '#1E272E', 2);
      ProceduralPrimitives.circle(ctx, this.direction * 4, -4, 2.5, '#F1C40F');
    }

    ctx.restore();
  }
}
