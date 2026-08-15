import { MathUtils } from '../core/MathUtils.js';

/**
 * High-performance 2D particle emitter system with pre-allocated pooling.
 */
export class ParticleSystem {
  constructor(maxParticles = 300) {
    this.maxParticles = maxParticles;
    this.particles = [];
    for (let i = 0; i < maxParticles; i++) {
      this.particles.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        gravity: 0,
        drag: 0.98,
        radius: 4,
        color: '#FFD93D',
        alpha: 1,
        life: 0,
        maxLife: 1,
        shape: 'circle', // circle, star, square, spark
        rotation: 0,
        vRot: 0
      });
    }
  }

  emit(options = {}) {
    const {
      x = 0,
      y = 0,
      count = 10,
      color = '#FFD93D',
      colors = null,
      speedMin = 50,
      speedMax = 180,
      angleMin = 0,
      angleMax = Math.PI * 2,
      gravity = 150,
      drag = 0.96,
      radiusMin = 2,
      radiusMax = 6,
      lifeMin = 0.3,
      lifeMax = 0.7,
      shape = 'circle'
    } = options;

    let spawned = 0;
    for (let i = 0; i < this.particles.length && spawned < count; i++) {
      const p = this.particles[i];
      if (!p.active) {
        p.active = true;
        p.x = x;
        p.y = y;
        const angle = MathUtils.randomRange(angleMin, angleMax);
        const speed = MathUtils.randomRange(speedMin, speedMax);
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.gravity = gravity;
        p.drag = drag;
        p.radius = MathUtils.randomRange(radiusMin, radiusMax);
        p.color = colors ? MathUtils.randomChoice(colors) : color;
        p.maxLife = MathUtils.randomRange(lifeMin, lifeMax);
        p.life = p.maxLife;
        p.alpha = 1;
        p.shape = shape;
        p.rotation = Math.random() * Math.PI * 2;
        p.vRot = MathUtils.randomRange(-5, 5);
        spawned++;
      }
    }
  }

  // Pre-configured juice presets with polymorphic argument handling
  burst(x, y, arg1 = '#FFD93D', arg2 = 16) {
    let count = 16;
    let color = '#FFD93D';
    let colors = null;
    if (typeof arg1 === 'number') {
      count = arg1;
      if (typeof arg2 === 'string') color = arg2;
      else if (Array.isArray(arg2)) colors = arg2;
    } else {
      if (typeof arg1 === 'string') color = arg1;
      else if (Array.isArray(arg1)) colors = arg1;
      if (typeof arg2 === 'number') count = arg2;
    }
    this.emit({
      x,
      y,
      count,
      color,
      colors: colors || [color, '#FFFFFF', '#FFE66D', '#FFB703', '#80ED99'],
      speedMin: 80,
      speedMax: 220,
      radiusMin: 2.5,
      radiusMax: 5.5,
      lifeMin: 0.35,
      lifeMax: 0.75,
      gravity: 220,
      shape: 'star'
    });
  }

  dust(x, y, count = 6, color = 'rgba(255, 255, 255, 0.75)') {
    this.emit({
      x,
      y,
      count,
      color,
      speedMin: 25,
      speedMax: 70,
      angleMin: -Math.PI * 0.9,
      angleMax: -Math.PI * 0.1,
      radiusMin: 2.5,
      radiusMax: 6,
      lifeMin: 0.25,
      lifeMax: 0.5,
      gravity: -10,
      drag: 0.90,
      shape: 'circle'
    });
  }

  sparkles(x, y, count = 8, colors = ['#FFEAA7', '#FD79A8', '#74B9FF', '#55EFC4', '#FFFFFF']) {
    this.emit({
      x,
      y,
      count,
      colors,
      speedMin: 30,
      speedMax: 100,
      radiusMin: 2,
      radiusMax: 4.5,
      lifeMin: 0.3,
      lifeMax: 0.65,
      gravity: 20,
      drag: 0.94,
      shape: 'spark'
    });
  }

  confetti(x, y, count = 35) {
    this.emit({
      x,
      y,
      count,
      colors: ['#FFD166', '#EF476F', '#06D6A0', '#118AB2', '#9B5DE5', '#FFFFFF', '#F15BB5'],
      speedMin: 90,
      speedMax: 260,
      radiusMin: 3,
      radiusMax: 6,
      lifeMin: 0.6,
      lifeMax: 1.4,
      gravity: 120,
      drag: 0.96,
      shape: 'star'
    });
  }

  leafBurst(x, y, count = 14) {
    this.emit({
      x,
      y,
      count,
      colors: ['#80D842', '#52B788', '#2EC4B6', '#C68B59', '#FFE66D', '#FF758F'],
      speedMin: 50,
      speedMax: 160,
      radiusMin: 2.5,
      radiusMax: 5,
      lifeMin: 0.4,
      lifeMax: 0.8,
      gravity: 140,
      drag: 0.95,
      shape: 'circle'
    });
  }

  update(dt) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.active) {
        p.life -= dt;
        if (p.life <= 0) {
          p.active = false;
          continue;
        }

        p.vx *= p.drag;
        p.vy = (p.vy + p.gravity * dt) * p.drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.vRot * dt;
        p.alpha = Math.max(0, p.life / p.maxLife);
      }
    }
  }

  render(ctx) {
    ctx.save();
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.active) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'star') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            const rot = (Math.PI / 5) * s * 2;
            const x = Math.cos(rot) * p.radius;
            const y = Math.sin(rot) * p.radius;
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            const inRot = rot + Math.PI / 5;
            ctx.lineTo(Math.cos(inRot) * (p.radius * 0.5), Math.sin(inRot) * (p.radius * 0.5));
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else if (p.shape === 'spark') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillRect(-p.radius, -1, p.radius * 2, 2);
          ctx.fillRect(-1, -p.radius, 2, p.radius * 2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.1, p.radius * p.alpha), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }
}
