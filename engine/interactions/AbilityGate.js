import { ProceduralPrimitives } from '../rendering/ProceduralPrimitives.js';
import { MathUtils } from '../core/MathUtils.js';

/**
 * Ability Gate: Physical or magical barrier unlocking only when the player possesses the required ability.
 */
export class AbilityGate {
  constructor(x, y, width = 30, height = 120, requiredAbility = 'doubleJump', config = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.requiredAbility = requiredAbility;
    this.name = config.name || 'Thorn Barrier';
    this.color = config.color || '#EB4D4B';
    this.isOpen = false;
    this.dissolveAlpha = 1.0;
    this.pulseTime = 0;
  }

  checkUnlock(playerAbilities) {
    if (this.isOpen) return true;
    if (playerAbilities[this.requiredAbility]) {
      this.isOpen = true;
      return true;
    }
    return false;
  }

  update(dt, playerAbilities, particles = null) {
    this.pulseTime += dt;

    if (!this.isOpen && playerAbilities[this.requiredAbility]) {
      this.isOpen = true;
      if (particles) {
        particles.burst(this.x + this.width / 2, this.y + this.height / 2, this.color, 25);
      }
    }

    if (this.isOpen && this.dissolveAlpha > 0) {
      this.dissolveAlpha = Math.max(0, this.dissolveAlpha - dt * 2.5);
    }
  }

  blocksPlayer(playerX, playerY, playerHalfW, playerHalfH) {
    if (this.isOpen) return false;
    return (
      playerX + playerHalfW > this.x &&
      playerX - playerHalfW < this.x + this.width &&
      playerY + playerHalfH > this.y &&
      playerY - playerHalfH < this.y + this.height
    );
  }

  render(ctx) {
    if (this.dissolveAlpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.dissolveAlpha;

    // Glowing thorn gate vines
    const glow = (Math.sin(this.pulseTime * 5) + 1) * 0.5;
    ctx.fillStyle = this.color;
    ProceduralPrimitives.roundedRect(ctx, this.x, this.y, this.width, this.height, 8, this.color, '#182C22', 2);

    // Rune Icon in Center
    const centerY = this.y + this.height / 2;
    ProceduralPrimitives.circle(ctx, this.x + this.width / 2, centerY, 12, '#182C22', '#FFD93D', 2);
    ctx.fillStyle = '#FFD93D';
    ctx.font = "bold 10px 'Fredoka', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔒', this.x + this.width / 2, centerY);

    ctx.restore();
  }
}
