import { MathUtils } from '../core/MathUtils.js';

/**
 * Juice effects manager: Camera shake, screen flashes, floating pop-up text, and hit shockwaves.
 */
export class JuiceEffects {
  constructor() {
    this.shakeIntensity = 0;
    this.shakeDecay = 0.9;
    this.shakeX = 0;
    this.shakeY = 0;

    this.flashAlpha = 0;
    this.flashColor = '#FFFFFF';
    this.flashDecay = 0.85;

    this.floatingTexts = [];
    this.shockwaves = [];
  }

  screenShake(intensity = 8) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  screenFlash(color = '#FFFFFF', initialAlpha = 0.4) {
    this.flashColor = color;
    this.flashAlpha = initialAlpha;
  }

  spawnFloatingText(text, x, y, options = {}) {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: options.vy || -60,
      color: options.color || '#FFD93D',
      stroke: options.stroke || '#2C3E50',
      size: options.size || 20,
      alpha: 1,
      life: options.life || 0.8,
      maxLife: options.life || 0.8,
      scale: 1.4
    });
  }

  floatingText(text, x, y, color = '#FFD93D', size = 20) {
    this.spawnFloatingText(text, x, y, { color, size });
  }

  spawnShockwave(x, y, maxRadius = 50, color = '#FFFFFF') {
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius,
      color,
      alpha: 0.8,
      speed: 120
    });
  }

  update(dt) {
    // Shake decay
    if (this.shakeIntensity > 0.1) {
      this.shakeX = (Math.random() - 0.5) * 2 * this.shakeIntensity;
      this.shakeY = (Math.random() - 0.5) * 2 * this.shakeIntensity;
      this.shakeIntensity *= Math.pow(this.shakeDecay, dt * 60);
    } else {
      this.shakeIntensity = 0;
      this.shakeX = 0;
      this.shakeY = 0;
    }

    // Flash decay
    if (this.flashAlpha > 0.01) {
      this.flashAlpha *= Math.pow(this.flashDecay, dt * 60);
    } else {
      this.flashAlpha = 0;
    }

    // Floating text update
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.y += ft.vy * dt;
      ft.scale = MathUtils.lerp(ft.scale, 1.0, 0.15);
      ft.alpha = Math.max(0, ft.life / ft.maxLife);
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Shockwaves update
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed * dt;
      sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);
      if (sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }
  }

  renderWorld(ctx) {
    // Render shockwaves in world coordinates
    for (const sw of this.shockwaves) {
      ctx.save();
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.alpha;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Render floating texts in world coordinates
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.translate(ft.x, ft.y);
      ctx.scale(ft.scale, ft.scale);
      ctx.globalAlpha = ft.alpha;
      ctx.font = `bold ${ft.size}px 'Fredoka', 'Nunito', sans-serif, system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (ft.stroke) {
        ctx.strokeStyle = ft.stroke;
        ctx.lineWidth = 3.5;
        ctx.strokeText(ft.text, 0, 0);
      }

      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, 0, 0);
      ctx.restore();
    }
  }

  renderScreen(ctx, width, height) {
    // Render flash overlay
    if (this.flashAlpha > 0.01) {
      ctx.save();
      ctx.fillStyle = this.flashColor;
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }
}
