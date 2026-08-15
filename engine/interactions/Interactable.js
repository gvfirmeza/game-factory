import { ProceduralPrimitives } from '../rendering/ProceduralPrimitives.js';
import { MathUtils } from '../core/MathUtils.js';

/**
 * Base Interactable Entity with spatial proximity detection, floating button prompts,
 * state persistence, and event triggers.
 */
export class Interactable {
  constructor(x, y, radius = 45, promptText = 'Interact (E)') {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.promptText = promptText;
    this.isNearPlayer = false;
    this.active = true;
    this.cooldown = 0;
    this.pulseTime = 0;
  }

  update(dt, playerX, playerY) {
    if (!this.active) {
      this.isNearPlayer = false;
      return;
    }

    this.pulseTime += dt;
    if (this.cooldown > 0) {
      this.cooldown -= dt;
    }

    const dist = MathUtils.distance(this.x, this.y, playerX, playerY);
    this.isNearPlayer = dist <= this.radius;
  }

  tryInteract(player) {
    if (!this.active || !this.isNearPlayer || this.cooldown > 0) return false;
    this.cooldown = 0.4;
    return this.onInteract(player);
  }

  onInteract(player) {
    // Override in subclasses
    return true;
  }

  renderPrompt(ctx, offsetY = -36) {
    if (!this.active || !this.isNearPlayer) return;

    ctx.save();
    ctx.translate(this.x, this.y + offsetY);

    const bobY = Math.sin(this.pulseTime * 6) * 3;
    const promptW = 90;
    const promptH = 22;

    ProceduralPrimitives.roundedRect(ctx, -promptW / 2, -promptH / 2 + bobY, promptW, promptH, 6, '#FFD93D', '#182C22', 1.5);
    ctx.fillStyle = '#182C22';
    ctx.font = "bold 11px 'Fredoka', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.promptText, 0, bobY);

    ctx.restore();
  }
}
