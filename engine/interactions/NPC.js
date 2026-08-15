import { Interactable } from './Interactable.js';
import { ProceduralPrimitives } from '../rendering/ProceduralPrimitives.js';

/**
 * Stateful NPC with dialogue sequence progression, quest triggers, and idle animations.
 */
export class NPC extends Interactable {
  constructor(x, y, config = {}) {
    super(x, y, config.radius || 48, config.promptText || 'Talk (E)');
    this.id = config.id || 'npc';
    this.name = config.name || 'Friend';
    this.avatar = config.avatar || 'snail';
    this.dialogTree = config.dialogTree || ['Hello little spirit!'];
    this.dialogIndex = 0;
    this.repeatLast = config.repeatLast !== undefined ? config.repeatLast : true;
    this.scale = config.scale || 1.0;
  }

  getNextDialogue() {
    const text = this.dialogTree[this.dialogIndex];
    if (this.dialogIndex < this.dialogTree.length - 1) {
      this.dialogIndex++;
    } else if (!this.repeatLast) {
      this.dialogIndex = 0;
    }
    return text;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);

    // Ground Shadow
    ProceduralPrimitives.groundShadow(ctx, 0, 8, 14, 5, 0.25);

    // Render cute avatar based on type
    if (this.avatar === 'snail') {
      ProceduralPrimitives.ellipse(ctx, -3, 3, 16, 6, 0, '#BDC581');
      ProceduralPrimitives.circle(ctx, 7, -6, 12, '#D980FA', '#8854D0', 2);
      ProceduralPrimitives.circle(ctx, -13, -3, 5, '#BDC581');
      ProceduralPrimitives.circle(ctx, -15, -4, 1.5, '#2C3E50');
      // Knitted green hat
      ProceduralPrimitives.roundedRect(ctx, 4, -18, 10, 8, 3, '#2ED573', '#1B5E20', 1);
    } else if (this.avatar === 'hedgehog') {
      ProceduralPrimitives.roundedRect(ctx, -14, -14, 28, 24, 12, '#8854D0', '#5758BB', 2);
      ProceduralPrimitives.circle(ctx, 8, -6, 4, '#F8EFBA');
      ProceduralPrimitives.circle(ctx, 10, -7, 1.5, '#2C3E50');
      // Lantern
      ProceduralPrimitives.roundedRect(ctx, 16, -10, 8, 12, 2, '#FFD93D', '#2C3E50', 1.5);
    } else if (this.avatar === 'owl') {
      ProceduralPrimitives.roundedRect(ctx, -14, -20, 28, 30, 14, '#778BEB', '#546DE5', 2);
      ProceduralPrimitives.circle(ctx, -6, -10, 6, '#FFFFFF');
      ProceduralPrimitives.circle(ctx, 6, -10, 6, '#FFFFFF');
      ProceduralPrimitives.circle(ctx, -6, -10, 2.5, '#2C3E50');
      ProceduralPrimitives.circle(ctx, 6, -10, 2.5, '#2C3E50');
      ProceduralPrimitives.polygon(ctx, [{ x: -3, y: -4 }, { x: 3, y: -4 }, { x: 0, y: 1 }], '#F8EFBA');
    } else {
      ProceduralPrimitives.circle(ctx, 0, -8, 12, '#FFD93D', '#D4A017', 2);
    }

    ctx.restore();

    // Render interactive prompt above head
    this.renderPrompt(ctx, -38);
  }
}
