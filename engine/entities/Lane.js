import { Vehicle } from './Vehicle.js';
import { Collectible } from './Collectible.js';
import { MathUtils } from '../core/MathUtils.js';

/**
 * Lane Manager for grid/continuous crossy arcade games.
 */
export class Lane {
  constructor(index, y, height = 48, type = 'grass', config = {}) {
    this.index = index;
    this.y = y;
    this.height = height;
    this.type = type; // 'grass', 'road', 'sidewalk'
    this.config = config;

    this.vehicles = [];
    this.collectibles = [];
    this.decorations = [];

    this.direction = config.direction !== undefined ? config.direction : (Math.random() > 0.5 ? 1 : -1);
    this.speed = config.speed || MathUtils.randomRange(90, 160);
    this.spawnTimer = 0;
    this.spawnInterval = config.spawnInterval || MathUtils.randomRange(1.8, 3.2);

    this.generateDecorations();
  }

  generateDecorations() {
    if (this.type === 'grass') {
      // Grass flowers & tufts
      const count = Math.floor(MathUtils.randomRange(2, 5));
      for (let i = 0; i < count; i++) {
        this.decorations.push({
          x: MathUtils.randomRange(20, 460),
          y: MathUtils.randomRange(-this.height / 2 + 10, this.height / 2 - 10),
          color: MathUtils.randomChoice(['#FF6B81', '#FFFFFF', '#FFD93D', '#70A1FF']),
          type: 'flower'
        });
      }
    }
  }

  update(dt, worldWidth = 480, difficultyFactor = 1.0) {
    if (this.type === 'road') {
      this.spawnTimer += dt;
      const currentInterval = Math.max(1.2, this.spawnInterval / difficultyFactor);

      if (this.spawnTimer >= currentInterval) {
        this.spawnTimer = 0;
        this.spawnVehicle(worldWidth, difficultyFactor);
      }

      // Update vehicles
      for (let i = this.vehicles.length - 1; i >= 0; i--) {
        const v = this.vehicles[i];
        v.update(dt);

        // Cull vehicles that moved off-screen
        const buffer = 150;
        if ((this.direction > 0 && v.x > worldWidth + buffer) || (this.direction < 0 && v.x < -buffer)) {
          this.vehicles.splice(i, 1);
        }
      }
    }

    // Update collectibles
    for (const c of this.collectibles) {
      c.update(dt);
    }
  }

  spawnVehicle(worldWidth, difficultyFactor) {
    const isTruck = Math.random() < 0.25;
    const startX = this.direction > 0 ? -100 : worldWidth + 100;
    const speed = this.speed * difficultyFactor;
    const vehicle = new Vehicle(startX, this.y, speed, this.direction, isTruck ? 'truck' : 'car');
    this.vehicles.push(vehicle);
  }

  render(ctx, worldWidth = 480) {
    const halfH = this.height / 2;

    // Background surface
    if (this.type === 'road') {
      // Asphalt
      ctx.fillStyle = '#34495E';
      ctx.fillRect(0, this.y - halfH, worldWidth, this.height);

      // Road texture borders
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, this.y - halfH, worldWidth, 2);
      ctx.fillRect(0, this.y + halfH - 2, worldWidth, 2);

      // Dashed lane divider
      ctx.strokeStyle = '#F1C40F';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([16, 16]);
      ctx.beginPath();
      ctx.moveTo(0, this.y);
      ctx.lineTo(worldWidth, this.y);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (this.type === 'sidewalk') {
      // Pavement sidewalk
      ctx.fillStyle = '#BDC3C7';
      ctx.fillRect(0, this.y - halfH, worldWidth, this.height);
      ctx.strokeStyle = '#95A5A6';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, this.y - halfH, worldWidth, this.height);
    } else {
      // Lush Grass
      const isAlt = this.index % 2 === 0;
      ctx.fillStyle = isAlt ? '#6BCB77' : '#5CB85C';
      ctx.fillRect(0, this.y - halfH, worldWidth, this.height);

      // Cute procedural flowers
      for (const dec of this.decorations) {
        ctx.fillStyle = dec.color;
        ctx.beginPath();
        ctx.arc(dec.x, this.y + dec.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFD93D';
        ctx.beginPath();
        ctx.arc(dec.x, this.y + dec.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Render collectibles
    for (const c of this.collectibles) {
      if (c.active) c.render(ctx);
    }

    // Render vehicles
    for (const v of this.vehicles) {
      v.render(ctx);
    }
  }
}
