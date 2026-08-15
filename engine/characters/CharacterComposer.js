import { ProceduralPrimitives } from '../rendering/ProceduralPrimitives.js';

/**
 * Procedural character generator for cute 2D cartoon avatars with squash/stretch animations.
 */
export class CharacterComposer {
  static drawCharacter(ctx, x, y, config = {}) {
    const {
      type = 'chicken',
      scaleX = 1,
      scaleY = 1,
      rotation = 0,
      isBlinking = false,
      isHit = false,
      direction = 1 // 1 right, -1 left
    } = config;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Ground shadow
    ProceduralPrimitives.groundShadow(ctx, 0, 18, 16 * Math.abs(scaleX), 6, 0.2);

    // Dynamic squash & stretch
    ctx.scale(scaleX * direction, scaleY);

    if (isHit) {
      ctx.filter = 'brightness(1.5) saturate(0.5)';
    }

    switch (type) {
      case 'fox':
        CharacterComposer.drawFox(ctx, config);
        break;
      case 'raccoon':
        CharacterComposer.drawRaccoon(ctx, config);
        break;
      case 'frog':
        CharacterComposer.drawFrog(ctx, config);
        break;
      case 'chicken':
      default:
        CharacterComposer.drawChicken(ctx, config);
        break;
    }

    ctx.restore();
  }

  static drawChicken(ctx, config = {}) {
    const bodyColor = config.bodyColor || '#FFD93D';
    const strokeColor = config.strokeColor || '#D4A017';
    const combColor = config.combColor || '#FF4757';
    const beakColor = config.beakColor || '#FF9F1A';

    // 1. Comb (top crown)
    ctx.fillStyle = combColor;
    ctx.beginPath();
    ctx.arc(-6, -26, 5, 0, Math.PI * 2);
    ctx.arc(0, -29, 6, 0, Math.PI * 2);
    ctx.arc(6, -26, 5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Main Body (chubby egg shape)
    ProceduralPrimitives.roundedRect(ctx, -16, -24, 32, 36, [16, 16, 14, 14], bodyColor, strokeColor, 2.5);

    // 3. Wing
    ctx.fillStyle = '#FFE066';
    ctx.beginPath();
    ctx.ellipse(config.wingOffset || -10, -8, 8, 11, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();

    // 4. Cheeks (blush)
    ctx.fillStyle = 'rgba(255, 107, 129, 0.45)';
    ProceduralPrimitives.circle(ctx, -10, -4, 3.5, ctx.fillStyle);
    ProceduralPrimitives.circle(ctx, 10, -4, 3.5, ctx.fillStyle);

    // 5. Eyes
    if (config.isBlinking) {
      ctx.strokeStyle = '#2C3E50';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(-7, -10, 3, 0, Math.PI);
      ctx.arc(7, -10, 3, 0, Math.PI);
      ctx.stroke();
    } else {
      // Pupils
      ProceduralPrimitives.circle(ctx, -7, -10, 3.2, '#2C3E50');
      ProceduralPrimitives.circle(ctx, 7, -10, 3.2, '#2C3E50');
      // Catchlights
      ProceduralPrimitives.circle(ctx, -8.5, -11.5, 1.2, '#FFFFFF');
      ProceduralPrimitives.circle(ctx, 5.5, -11.5, 1.2, '#FFFFFF');
    }

    // 6. Beak
    ProceduralPrimitives.polygon(
      ctx,
      [
        { x: -5, y: -7 },
        { x: 5, y: -7 },
        { x: 0, y: -1 }
      ],
      beakColor,
      '#C36B00',
      1.5
    );

    // 7. Wattle
    ProceduralPrimitives.roundedRect(ctx, -2, -1, 4, 6, 2, combColor);

    // 8. Feet
    ctx.fillStyle = beakColor;
    ProceduralPrimitives.roundedRect(ctx, -10, 10, 7, 4, 2, beakColor);
    ProceduralPrimitives.roundedRect(ctx, 3, 10, 7, 4, 2, beakColor);
  }

  static drawFox(ctx, config = {}) {
    const furColor = config.furColor || '#FF793F';
    const chestColor = config.chestColor || '#FFFFFF';
    const noseColor = config.noseColor || '#2C3E50';

    // 1. Ears
    ProceduralPrimitives.polygon(ctx, [{ x: -16, y: -18 }, { x: -10, y: -34 }, { x: -3, y: -20 }], furColor, '#D35400', 2);
    ProceduralPrimitives.polygon(ctx, [{ x: 3, y: -20 }, { x: 10, y: -34 }, { x: 16, y: -18 }], furColor, '#D35400', 2);
    // Inner ear
    ProceduralPrimitives.polygon(ctx, [{ x: -13, y: -20 }, { x: -10, y: -29 }, { x: -6, y: -21 }], '#FFFFFF');
    ProceduralPrimitives.polygon(ctx, [{ x: 6, y: -21 }, { x: 10, y: -29 }, { x: 13, y: -20 }], '#FFFFFF');

    // 2. Body / Head
    ProceduralPrimitives.roundedRect(ctx, -17, -22, 34, 34, [17, 17, 14, 14], furColor, '#D35400', 2.5);

    // 3. White muzzle cheeks
    ctx.fillStyle = chestColor;
    ctx.beginPath();
    ctx.ellipse(-8, -4, 9, 7, 0.2, 0, Math.PI * 2);
    ctx.ellipse(8, -4, 9, 7, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // 4. Eyes
    ProceduralPrimitives.circle(ctx, -7, -10, 3, '#2C3E50');
    ProceduralPrimitives.circle(ctx, 7, -10, 3, '#2C3E50');
    ProceduralPrimitives.circle(ctx, -8, -11, 1.2, '#FFFFFF');
    ProceduralPrimitives.circle(ctx, 6, -11, 1.2, '#FFFFFF');

    // 5. Cute nose
    ProceduralPrimitives.roundedRect(ctx, -3.5, -6, 7, 4.5, 2, noseColor);

    // 6. Tail with white tip (poking from side)
    ctx.save();
    ctx.translate(-14, 2);
    ctx.rotate(-0.4);
    ProceduralPrimitives.roundedRect(ctx, -14, -6, 16, 12, 6, furColor, '#D35400', 2);
    ProceduralPrimitives.roundedRect(ctx, -14, -6, 7, 12, 6, '#FFFFFF');
    ctx.restore();
  }

  static drawRaccoon(ctx, config = {}) {
    const furColor = '#7F8C8D';
    const darkMask = '#2C3E50';

    // Ears
    ProceduralPrimitives.polygon(ctx, [{ x: -15, y: -18 }, { x: -10, y: -30 }, { x: -3, y: -20 }], furColor, '#2C3E50', 2);
    ProceduralPrimitives.polygon(ctx, [{ x: 3, y: -20 }, { x: 10, y: -30 }, { x: 15, y: -18 }], furColor, '#2C3E50', 2);

    // Body
    ProceduralPrimitives.roundedRect(ctx, -16, -22, 32, 34, [16, 16, 12, 12], furColor, '#2C3E50', 2.5);

    // Mask
    ProceduralPrimitives.roundedRect(ctx, -14, -14, 28, 10, 5, darkMask);

    // Eyes
    ProceduralPrimitives.circle(ctx, -7, -9, 3, '#FFFFFF');
    ProceduralPrimitives.circle(ctx, 7, -9, 3, '#FFFFFF');
    ProceduralPrimitives.circle(ctx, -7, -9, 1.8, '#000000');
    ProceduralPrimitives.circle(ctx, 7, -9, 1.8, '#000000');
    ProceduralPrimitives.circle(ctx, -8, -10, 0.8, '#FFFFFF');
    ProceduralPrimitives.circle(ctx, 6, -10, 0.8, '#FFFFFF');

    // Nose
    ProceduralPrimitives.circle(ctx, 0, -3, 3, '#000000');
  }

  static drawFrog(ctx, config = {}) {
    const skinColor = '#2ECC71';
    // Eye stalks
    ProceduralPrimitives.circle(ctx, -9, -20, 7, skinColor, '#27AE60', 2);
    ProceduralPrimitives.circle(ctx, 9, -20, 7, skinColor, '#27AE60', 2);
    ProceduralPrimitives.circle(ctx, -9, -20, 3.5, '#2C3E50');
    ProceduralPrimitives.circle(ctx, 9, -20, 3.5, '#2C3E50');
    ProceduralPrimitives.circle(ctx, -10, -21, 1.2, '#FFFFFF');
    ProceduralPrimitives.circle(ctx, 8, -21, 1.2, '#FFFFFF');

    // Body
    ProceduralPrimitives.roundedRect(ctx, -16, -16, 32, 30, [14, 14, 14, 14], skinColor, '#27AE60', 2.5);
    // Blush
    ctx.fillStyle = 'rgba(255, 107, 129, 0.4)';
    ProceduralPrimitives.circle(ctx, -10, -4, 3, ctx.fillStyle);
    ProceduralPrimitives.circle(ctx, 10, -4, 3, ctx.fillStyle);
    // Smile
    ctx.strokeStyle = '#27AE60';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -6, 6, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
}
