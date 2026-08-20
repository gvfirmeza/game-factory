/**
 * ============================================================================
 * LUMBER TYCOON — TOP-DOWN COZY ARCADE VECTOR GAME
 * Autonomous AI Game Factory
 * ============================================================================
 */

import {
  GameLoop,
  CanvasRenderer,
  Camera2D,
  ParticleSystem,
  JuiceEffects,
  MathUtils,
  CollisionUtils,
  PlaygamaBridge
} from '../../../engine/index.js';

/* ============================================================================
 * 1. CONFIGURATION & CONSTANTS
 * ============================================================================ */

export const WORLD = {
  width: 2200,
  height: 1800,
  baseZone: { x: 550, y: 480, w: 750, h: 420 }
};

export const AXE_TIERS = [
  { name: 'Rusty Hatchet', power: 1, speed: 0.38, cost: 0, color: '#8D6E63', blade: '#78909C' },
  { name: 'Forged Bronze Axe', power: 2, speed: 0.32, cost: 150, color: '#A1887F', blade: '#D7CCC8' },
  { name: 'Tempered Steel Axe', power: 4, speed: 0.28, cost: 600, color: '#5D4037', blade: '#ECEFF1' },
  { name: 'Gold-Plated Broadaxe', power: 8, speed: 0.24, cost: 2200, color: '#3E2723', blade: '#FFD54F' },
  { name: 'Diamond Core Axe', power: 16, speed: 0.20, cost: 8000, color: '#263238', blade: '#00E5FF' },
  { name: 'Plasma Laser Cutter', power: 35, speed: 0.16, cost: 25000, color: '#212121', blade: '#00E676' },
  { name: 'Mythic Celestial Greataxe', power: 80, speed: 0.12, cost: 75000, color: '#1A237E', blade: '#E040FB' }
];

export const CAPACITY_TIERS = [
  { capacity: 5, cost: 0 },
  { capacity: 10, cost: 100 },
  { capacity: 20, cost: 350 },
  { capacity: 40, cost: 1200 },
  { capacity: 75, cost: 4000 },
  { capacity: 120, cost: 14000 },
  { capacity: 200, cost: 45000 }
];

export const ZONES = [
  { id: 'oak', name: 'Oak Meadow', cost: 0, treeType: 'oak', logValue: 15, maxHp: 3, logsPerTree: 3, unlocked: true, bounds: { x: 50, y: 920, w: 850, h: 800 } },
  { id: 'birch', name: 'Birch Grove', cost: 300, treeType: 'birch', logValue: 40, maxHp: 5, logsPerTree: 4, unlocked: false, bounds: { x: 950, y: 920, w: 1200, h: 800 } },
  { id: 'pine', name: 'Pine Taiga', cost: 1200, treeType: 'pine', logValue: 100, maxHp: 8, logsPerTree: 4, unlocked: false, bounds: { x: 1350, y: 100, w: 800, h: 780 } },
  { id: 'sakura', name: 'Sakura Haven', cost: 4500, treeType: 'sakura', logValue: 280, maxHp: 12, logsPerTree: 5, unlocked: false, bounds: { x: 50, y: 100, w: 480, h: 780 } },
  { id: 'redwood', name: 'Redwood Sanctuary', cost: 15000, treeType: 'redwood', logValue: 750, maxHp: 20, logsPerTree: 6, unlocked: false, bounds: { x: 50, y: 920, w: 2100, h: 800 } },
  { id: 'golden', name: 'Golden Mythic Forest', cost: 50000, treeType: 'golden', logValue: 2200, maxHp: 35, logsPerTree: 8, unlocked: false, bounds: { x: 1350, y: 100, w: 800, h: 1600 } }
];

export const BUILDINGS = {
  sawmill: { x: 740, y: 640, w: 130, h: 90, name: 'Sawmill', icon: '⚙️', desc: 'Processes logs into planks (+50% value)' },
  sellZone: { x: 940, y: 640, w: 120, h: 90, name: 'Wood Market', icon: '💰', desc: 'Instant Cash Register' },
  blacksmith: { x: 580, y: 640, w: 110, h: 85, name: 'Blacksmith', icon: '🪓', desc: 'Upgrade Axe Power & Speed' },
  storageBarn: { x: 1110, y: 640, w: 110, h: 85, name: 'Backpack Depot', icon: '🎒', desc: 'Upgrade Log Capacity' },
  workerHut: { x: 840, y: 500, w: 130, h: 85, name: 'Worker Barracks', icon: '👷', desc: 'Hire Automated Lumberjacks' }
};

/* ============================================================================
 * 2. PROCEDURAL WEB AUDIO SYNTHESIZER
 * ============================================================================ */

class TycoonAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = !!muted;
  }

  playChop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140 + Math.random() * 80, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.09);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  playTreeFall() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.45);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  playCollect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540 + Math.random() * 60, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.1);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  playCash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [987.77, 1318.51]; // B5 -> E6
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.14);
    });
  }

  playUpgrade() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    chords.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }
}

/* ============================================================================
 * 3. SAVE / PERSISTENCE MANAGER
 * ============================================================================ */

class SaveManager {
  static KEY = 'lumber_tycoon_save_v1';

  static async load(playgama) {
    let raw = null;
    try {
      raw = localStorage.getItem(SaveManager.KEY);
    } catch (e) {}

    let data = SaveManager.getDefault();
    if (raw) {
      try {
        data = Object.assign(data, JSON.parse(raw));
      } catch (e) {}
    }
    return data;
  }

  static async save(playgama, data) {
    try {
      localStorage.setItem(SaveManager.KEY, JSON.stringify(data));
    } catch (e) {}
  }

  static getDefault() {
    return {
      version: 1,
      cash: 0,
      axeIndex: 0,
      capacityIndex: 0,
      workerCount: 0,
      unlockedZones: ['oak'],
      totalTreesCut: 0,
      totalCashEarned: 0,
      settings: { isMuted: false }
    };
  }
}

/* ============================================================================
 * 4. TOP-DOWN VECTOR GRAPHICS ENGINE
 * ============================================================================ */

function drawTopDownTerrain(ctx, cam, width, height, animTime) {
  // Base lush grass background
  ctx.fillStyle = '#2d4a22';
  ctx.fillRect(0, 0, width, height);

  // Subtle grid grass tile pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  const tileSize = 60;
  for (let x = 0; x < width; x += tileSize) {
    for (let y = 0; y < height; y += tileSize) {
      if ((Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0) {
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
  }

  // Base Village Zone (Sandy Dirt clearing)
  const b = WORLD.baseZone;
  ctx.save();
  ctx.fillStyle = '#4e3b2b';
  ctx.beginPath();
  ctx.roundRect(b.x - 30, b.y - 30, b.w + 60, b.h + 60, 32);
  ctx.fill();

  ctx.fillStyle = '#6d533d';
  ctx.beginPath();
  ctx.roundRect(b.x - 20, b.y - 20, b.w + 40, b.h + 40, 24);
  ctx.fill();

  // Stone paving around Sawmill and Market
  ctx.fillStyle = '#8d7b68';
  for (let px = b.x + 80; px < b.x + b.w - 80; px += 40) {
    ctx.beginPath();
    ctx.roundRect(px, b.y + 130, 32, 24, 6);
    ctx.fill();
  }
  ctx.restore();
}

function drawBuilding(ctx, bKey, building, animTime) {
  const { x, y, w, h, name, icon } = building;

  ctx.save();
  // Drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2 + 10, w / 2 + 8, h / 2 + 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wooden foundation
  ctx.fillStyle = '#4e342e';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 14);
  ctx.fill();

  // Wall planks
  ctx.fillStyle = '#6d4c41';
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 4, w - 8, h - 8, 10);
  ctx.fill();

  // Highlight roof border
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Building specific visual details
  if (bKey === 'sawmill') {
    // Animated circular buzzsaw
    const sawX = x + w / 2;
    const sawY = y + h / 2 - 4;
    ctx.save();
    ctx.translate(sawX, sawY);
    ctx.rotate(animTime * 12);
    ctx.fillStyle = '#eceff1';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b0bec5';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Saw teeth
    ctx.fillStyle = '#78909c';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      ctx.fillRect(Math.cos(a) * 16 - 2, Math.sin(a) * 16 - 2, 5, 5);
    }
    ctx.restore();
  } else if (bKey === 'sellZone') {
    // Gold coin pile / Drop pad
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.roundRect(x + 12, y + 12, w - 24, h - 24, 8);
    ctx.fill();
    ctx.strokeStyle = '#ffb300';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffe082';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  // Label banner
  ctx.fillStyle = 'rgba(15, 10, 5, 0.85)';
  ctx.beginPath();
  ctx.roundRect(x + 10, y + h - 22, w - 20, 18, 6);
  ctx.fill();

  ctx.fillStyle = '#ffe082';
  ctx.font = 'bold 11px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${icon} ${name}`, x + w / 2, y + h - 13);

  ctx.restore();
}

function drawTopDownTree(ctx, tree, animTime) {
  if (tree.isCut) {
    // Draw stump
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(tree.x, tree.y + 6, tree.trunkR + 4, tree.trunkR, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wood rings stump
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.arc(tree.x, tree.y, tree.trunkR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner tree age ring
    ctx.strokeStyle = '#a1887f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(tree.x, tree.y, tree.trunkR * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    // Regrowth timer radial ring
    if (tree.respawnTimer > 0) {
      const progress = 1 - (tree.respawnTimer / tree.respawnMax);
      ctx.strokeStyle = '#00e676';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(tree.x, tree.y, tree.trunkR + 6, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  ctx.save();
  const shakeX = tree.shakeTimer > 0 ? Math.sin(tree.shakeTimer * 30) * 4 : 0;
  const shakeY = tree.shakeTimer > 0 ? Math.cos(tree.shakeTimer * 30) * 2 : 0;

  ctx.translate(tree.x + shakeX, tree.y + shakeY);

  // Soft drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, tree.canopyR * 0.7, tree.canopyR * 1.1, tree.canopyR * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();

  // Color profiles per biome tree
  let outerColor = '#2e7d32';
  let midColor = '#43a047';
  let innerColor = '#66bb6a';

  if (tree.type === 'birch') {
    outerColor = '#689f38';
    midColor = '#8bc34a';
    innerColor = '#dce775';
  } else if (tree.type === 'pine') {
    outerColor = '#1b5e20';
    midColor = '#2e7d32';
    innerColor = '#388e3c';
  } else if (tree.type === 'sakura') {
    outerColor = '#c2185b';
    midColor = '#e91e63';
    innerColor = '#f48fb1';
  } else if (tree.type === 'redwood') {
    outerColor = '#3e2723';
    midColor = '#b71c1c';
    innerColor = '#d32f2f';
  } else if (tree.type === 'golden') {
    outerColor = '#ff8f00';
    midColor = '#ffb300';
    innerColor = '#fff176';
  }

  // 3-Tier Layered Canopy (Gives high-end cartoon volume)
  // Layer 1: Outer Dark Base
  ctx.fillStyle = outerColor;
  ctx.beginPath();
  ctx.arc(0, 0, tree.canopyR, 0, Math.PI * 2);
  ctx.fill();

  // Layer 2: Mid-tier floret clusters
  ctx.fillStyle = midColor;
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + animTime * 0.2;
    const offset = tree.canopyR * 0.45;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * offset, Math.sin(angle) * offset, tree.canopyR * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  // Layer 3: Top Highlight Dome
  ctx.fillStyle = innerColor;
  ctx.beginPath();
  ctx.arc(-tree.canopyR * 0.15, -tree.canopyR * 0.15, tree.canopyR * 0.48, 0, Math.PI * 2);
  ctx.fill();

  // Golden shimmer for mythic trees
  if (tree.type === 'golden') {
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.6 + Math.sin(animTime * 6) * 0.3;
    ctx.beginPath();
    ctx.arc(0, 0, tree.canopyR * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // HP Gauge (When taking damage)
  if (tree.hp < tree.maxHp) {
    const barW = 40;
    const barH = 6;
    const pct = tree.hp / tree.maxHp;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.roundRect(-barW / 2, -tree.canopyR - 14, barW, barH, 3);
    ctx.fill();

    ctx.fillStyle = pct > 0.5 ? '#00e676' : pct > 0.25 ? '#ffb300' : '#ff5252';
    ctx.beginPath();
    ctx.roundRect(-barW / 2 + 1, -tree.canopyR - 13, (barW - 2) * pct, barH - 2, 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawDroppedLog(ctx, log) {
  ctx.save();
  ctx.translate(log.x, log.y);

  // Drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 4, 12, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Log Cylinder
  ctx.fillStyle = log.type === 'golden' ? '#ffb300' : '#8d6e63';
  ctx.beginPath();
  ctx.roundRect(-10, -6, 20, 12, 4);
  ctx.fill();
  ctx.strokeStyle = log.type === 'golden' ? '#ffe082' : '#5d4037';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // End Cross-section ring
  ctx.fillStyle = log.type === 'golden' ? '#ffe082' : '#d7ccc8';
  ctx.beginPath();
  ctx.ellipse(8, 0, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawLumberjack(ctx, actor, isPlayer, animTime) {
  const { x, y, angle, isWalking, isChopping, carriedLogs, axeTier } = actor;

  ctx.save();
  ctx.translate(x, y);

  // Character drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 12, 16, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walking bobbing / sway
  const walkBob = isWalking ? Math.sin(animTime * 14) * 2 : 0;
  const walkSway = isWalking ? Math.sin(animTime * 14) * 0.08 : 0;
  ctx.translate(0, walkBob);
  ctx.rotate(walkSway);

  // 3D Log Stack on back
  if (carriedLogs > 0) {
    const stackCount = Math.min(10, carriedLogs);
    for (let i = 0; i < stackCount; i++) {
      ctx.save();
      const logY = -10 - i * 6;
      ctx.fillStyle = '#8d6e63';
      ctx.beginPath();
      ctx.roundRect(-12, logY, 24, 7, 3);
      ctx.fill();
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  // Torso / Flannel Shirt
  ctx.fillStyle = isPlayer ? '#c62828' : '#e65100'; // Player Red Plaid, Worker Orange Hi-Vis
  ctx.beginPath();
  ctx.roundRect(-12, -10, 24, 20, 7);
  ctx.fill();

  // Denim Overalls Strap
  ctx.fillStyle = '#1565c0';
  ctx.fillRect(-8, -10, 4, 18);
  ctx.fillRect(4, -10, 4, 18);

  // Head
  ctx.fillStyle = '#ffcc80';
  ctx.beginPath();
  ctx.arc(0, -18, 11, 0, Math.PI * 2);
  ctx.fill();

  // Hardhat / Lumberjack Beret
  ctx.fillStyle = isPlayer ? '#ffb300' : '#ffe082';
  ctx.beginPath();
  ctx.arc(0, -22, 12, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-14, -22, 28, 4);

  // Big Eyes
  const lookOffset = isWalking ? 2 : 0;
  ctx.fillStyle = '#212121';
  ctx.beginPath();
  ctx.arc(-3 + lookOffset, -18, 2, 0, Math.PI * 2);
  ctx.arc(3 + lookOffset, -18, 2, 0, Math.PI * 2);
  ctx.fill();

  // Catchlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-3.5 + lookOffset, -18.5, 0.8, 0, Math.PI * 2);
  ctx.arc(2.5 + lookOffset, -18.5, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Axe & Chopping swing animation
  ctx.save();
  const axe = AXE_TIERS[axeTier || 0] || AXE_TIERS[0];
  if (isChopping) {
    const chopCycle = (animTime * 10) % (Math.PI * 2);
    ctx.rotate(Math.sin(chopCycle) * 0.9);
    // Axe swing arc streak
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 32, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();
  }

  // Axe Handle
  ctx.fillStyle = axe.color;
  ctx.fillRect(10, -8, 16, 4);

  // Axe Blade Head
  ctx.fillStyle = axe.blade;
  ctx.beginPath();
  ctx.moveTo(22, -14);
  ctx.lineTo(30, -6);
  ctx.lineTo(22, 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

/* ============================================================================
 * 5. MAIN GAME APPLICATION CLASS
 * ============================================================================ */

export class LumberTycoonGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new CanvasRenderer(this.canvas, 800, 600);
    this.camera = new Camera2D(800, 600, WORLD.width, WORLD.height);
    this.audio = new TycoonAudioSynthesizer();
    this.playgama = new PlaygamaBridge();
    this.particles = new ParticleSystem(400);
    this.juice = new JuiceEffects();

    this.saveData = SaveManager.getDefault();
    this.state = 'TITLE'; // TITLE, PLAYING, SHOP, WORKERS, PAUSED
    this.animTime = 0;

    // Player State
    this.player = {
      x: 880,
      y: 750,
      vx: 0,
      vy: 0,
      speed: 210,
      angle: 0,
      isWalking: false,
      isChopping: false,
      carriedLogs: 0,
      axeTier: 0,
      capacityIndex: 0,
      chopTimer: 0
    };

    // Virtual Joystick / Touch Input
    this.joystick = {
      active: false,
      startX: 0,
      startY: 0,
      currX: 0,
      currY: 0,
      dx: 0,
      dy: 0
    };

    this.keys = {};
    this.trees = [];
    this.droppedLogs = [];
    this.workers = [];
    this.flyingCoins = [];
    this.unlockedZones = new Set(['oak']);
    this.promptText = '';
    this.isTurboActive = false;
    this.turboTimer = 0;

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);

    if (typeof window !== 'undefined') {
      window.__gameInstance = this;
      window.__lumberTycoonInstance = this;
    }
  }

  async init() {
    await this.playgama.init();
    this.saveData = await SaveManager.load(this.playgama);

    // Apply saved progress
    this.player.axeTier = this.saveData.axeTier || 0;
    this.player.capacityIndex = this.saveData.capacityIndex || 0;
    if (Array.isArray(this.saveData.unlockedZones)) {
      this.saveData.unlockedZones.forEach((z) => this.unlockedZones.add(z));
    }

    // Audio permissions
    const audioEnabled = this.playgama.isAudioEnabled();
    this.audio.setMuted(!audioEnabled || (this.saveData.settings?.isMuted));

    this.generateForest();
    this.spawnWorkers(this.saveData.workerCount || 0);

    this.setupDOM();
    this.setupEvents();

    this.playgama.sendGameReady();

    this.loop = new GameLoop(this.update, this.render, 1 / 60, 0.1);
    this.loop.start();
  }

  generateForest() {
    this.trees = [];
    ZONES.forEach((zone) => {
      const count = zone.id === 'oak' ? 26 : zone.id === 'birch' ? 22 : zone.id === 'pine' ? 20 : 16;
      for (let i = 0; i < count; i++) {
        const x = zone.bounds.x + 40 + Math.random() * (zone.bounds.w - 80);
        const y = zone.bounds.y + 40 + Math.random() * (zone.bounds.h - 80);

        // Keep out of base clearing
        if (x > WORLD.baseZone.x - 40 && x < WORLD.baseZone.x + WORLD.baseZone.w + 40 &&
            y > WORLD.baseZone.y - 40 && y < WORLD.baseZone.y + WORLD.baseZone.h + 40) {
          continue;
        }

        const isGiant = zone.id === 'redwood' || zone.id === 'golden';
        this.trees.push({
          id: `tree_${zone.id}_${i}`,
          x,
          y,
          type: zone.treeType,
          zoneId: zone.id,
          maxHp: zone.maxHp,
          hp: zone.maxHp,
          logValue: zone.logValue,
          logsPerTree: zone.logsPerTree,
          trunkR: isGiant ? 16 : 10,
          canopyR: isGiant ? 42 : 28,
          isCut: false,
          shakeTimer: 0,
          respawnTimer: 0,
          respawnMax: zone.id === 'golden' ? 25 : 12
        });
      }
    });
  }

  spawnWorkers(count) {
    this.workers = [];
    for (let i = 0; i < count; i++) {
      this.workers.push({
        id: `worker_${i}`,
        x: BUILDINGS.workerHut.x + 40 + (i % 3) * 20,
        y: BUILDINGS.workerHut.y + 40 + Math.floor(i / 3) * 20,
        vx: 0,
        vy: 0,
        speed: 130,
        angle: 0,
        isWalking: false,
        isChopping: false,
        carriedLogs: 0,
        maxCarry: 8,
        axeTier: 1,
        targetTree: null,
        chopTimer: 0,
        state: 'SEEKING_TREE'
      });
    }
  }

  setupDOM() {
    document.getElementById('btn-title-play')?.addEventListener('click', () => {
      this.state = 'PLAYING';
      document.getElementById('title-overlay')?.classList.add('hidden');
      this.audio.init();
    });

    document.getElementById('btn-mute')?.addEventListener('click', () => {
      this.audio.setMuted(!this.audio.isMuted);
      const btn = document.getElementById('btn-mute');
      if (btn) btn.textContent = this.audio.isMuted ? '🔇' : '🔊';
    });

    document.getElementById('btn-open-shop')?.addEventListener('click', () => this.openShopModal());
    document.getElementById('btn-open-workers')?.addEventListener('click', () => this.openWorkerModal());
    document.getElementById('btn-close-shop')?.addEventListener('click', () => {
      document.getElementById('shop-modal')?.classList.add('hidden');
    });
    document.getElementById('btn-close-workers')?.addEventListener('click', () => {
      document.getElementById('workers-modal')?.classList.add('hidden');
    });

    // Rewarded Video Ad buttons
    document.getElementById('btn-airdrop')?.addEventListener('click', () => this.showRewardedCashGrant());
    document.getElementById('btn-turbo-boost')?.addEventListener('click', () => this.showRewardedTurboRush());

    this.updateHUD();
  }

  setupEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Joystick Touch
    const jContainer = document.getElementById('joystick-container');
    const jStick = document.getElementById('joystick-stick');

    if (jContainer && jStick) {
      const handleStart = (clientX, clientY) => {
        const rect = jContainer.getBoundingClientRect();
        this.joystick.active = true;
        this.joystick.startX = rect.left + rect.width / 2;
        this.joystick.startY = rect.top + rect.height / 2;
        this.handleJoystickMove(clientX, clientY, jStick);
      };

      jContainer.addEventListener('pointerdown', (e) => {
        handleStart(e.clientX, e.clientY);
        jContainer.setPointerCapture(e.pointerId);
      });

      jContainer.addEventListener('pointermove', (e) => {
        if (this.joystick.active) {
          this.handleJoystickMove(e.clientX, e.clientY, jStick);
        }
      });

      const handleEnd = () => {
        this.joystick.active = false;
        this.joystick.dx = 0;
        this.joystick.dy = 0;
        jStick.style.transform = `translate(-50%, -50%)`;
      };

      jContainer.addEventListener('pointerup', handleEnd);
      jContainer.addEventListener('pointercancel', handleEnd);
    }
  }

  handleJoystickMove(clientX, clientY, jStick) {
    const maxDist = 45;
    let dx = clientX - this.joystick.startX;
    let dy = clientY - this.joystick.startY;
    const dist = Math.hypot(dx, dy);

    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }

    this.joystick.dx = dx / maxDist;
    this.joystick.dy = dy / maxDist;
    jStick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  }

  /* ==========================================================================
   * 6. UPDATE SIMULATION
   * ========================================================================== */

  update(dt) {
    this.animTime += dt;
    this.particles.update(dt);
    this.juice.update(dt);

    if (this.turboTimer > 0) {
      this.turboTimer -= dt;
      if (this.turboTimer <= 0) {
        this.isTurboActive = false;
        document.getElementById('btn-turbo-boost')?.classList.remove('active');
      }
    }

    if (this.state !== 'PLAYING') return;

    this.updatePlayer(dt);
    this.updateWorkers(dt);
    this.updateTrees(dt);
    this.updateDroppedLogs(dt);
    this.updateFlyingCoins(dt);
    this.checkBuildingInteractions();

    // Camera follow smoothly
    this.camera.follow(this.player.x, this.player.y, dt * 6);
  }

  updatePlayer(dt) {
    const p = this.player;
    let mx = 0;
    let my = 0;

    // Keyboard controls
    if (this.keys['w'] || this.keys['arrowup']) my -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) my += 1;
    if (this.keys['a'] || this.keys['arrowleft']) mx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) mx += 1;

    // Joystick override
    if (this.joystick.active) {
      mx = this.joystick.dx;
      my = this.joystick.dy;
    }

    const len = Math.hypot(mx, my);
    if (len > 0.1) {
      p.isWalking = true;
      p.angle = Math.atan2(my, mx);
      const speedMult = this.isTurboActive ? 1.6 : 1.0;
      p.vx = (mx / (len > 1 ? len : 1)) * p.speed * speedMult;
      p.vy = (my / (len > 1 ? len : 1)) * p.speed * speedMult;
    } else {
      p.isWalking = false;
      p.vx = 0;
      p.vy = 0;
    }

    p.x = Math.max(30, Math.min(WORLD.width - 30, p.x + p.vx * dt));
    p.y = Math.max(30, Math.min(WORLD.height - 30, p.y + p.vy * dt));

    // Proximity Auto-Chop
    this.handlePlayerChopping(dt);
  }

  handlePlayerChopping(dt) {
    const p = this.player;
    const maxCapacity = CAPACITY_TIERS[p.capacityIndex]?.capacity || 5;
    if (p.carriedLogs >= maxCapacity) {
      p.isChopping = false;
      return;
    }

    const axe = AXE_TIERS[p.axeTier] || AXE_TIERS[0];
    let nearestTree = null;
    let minDist = 58;

    for (const tree of this.trees) {
      if (tree.isCut || !this.unlockedZones.has(tree.zoneId)) continue;
      const d = Math.hypot(p.x - tree.x, p.y - tree.y);
      if (d < minDist) {
        minDist = d;
        nearestTree = tree;
      }
    }

    if (nearestTree) {
      p.isChopping = true;
      p.chopTimer += dt;
      const chopInterval = axe.speed / (this.isTurboActive ? 1.5 : 1.0);

      if (p.chopTimer >= chopInterval) {
        p.chopTimer = 0;
        this.chopTree(nearestTree, axe.power, p);
      }
    } else {
      p.isChopping = false;
      p.chopTimer = 0;
    }
  }

  chopTree(tree, power, actor) {
    tree.hp -= power;
    tree.shakeTimer = 0.22;
    this.audio.playChop();
    this.juice.screenShake(2);

    // Wood chips particle burst
    this.particles.burst(tree.x, tree.y, 6, '#8D6E63');

    if (tree.hp <= 0) {
      tree.isCut = true;
      tree.respawnTimer = tree.respawnMax;
      this.audio.playTreeFall();
      this.juice.screenShake(5);

      this.saveData.totalTreesCut = (this.saveData.totalTreesCut || 0) + 1;

      // Spawn dropped logs
      for (let i = 0; i < tree.logsPerTree; i++) {
        const offsetAng = Math.random() * Math.PI * 2;
        const offsetDist = 15 + Math.random() * 20;
        this.droppedLogs.push({
          x: tree.x + Math.cos(offsetAng) * offsetDist,
          y: tree.y + Math.sin(offsetAng) * offsetDist,
          value: tree.logValue,
          type: tree.type,
          life: 30
        });
      }
    }
  }

  updateWorkers(dt) {
    for (const w of this.workers) {
      if (w.carriedLogs >= w.maxCarry) {
        // Go to Sawmill or Sell Market to deposit
        const target = BUILDINGS.sawmill;
        const dx = target.x + target.w / 2 - w.x;
        const dy = target.y + target.h / 2 - w.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 40) {
          // Deposit logs
          const cashEarned = w.carriedLogs * 25 * 1.5;
          this.saveData.cash += cashEarned;
          this.audio.playCash();
          this.spawnCoinBursts(w.x, w.y, cashEarned);
          w.carriedLogs = 0;
          w.targetTree = null;
        } else {
          w.isWalking = true;
          w.x += (dx / dist) * w.speed * dt;
          w.y += (dy / dist) * w.speed * dt;
          w.angle = Math.atan2(dy, dx);
        }
      } else {
        // Find nearest available tree
        if (!w.targetTree || w.targetTree.isCut) {
          let best = null;
          let bestD = Infinity;
          for (const t of this.trees) {
            if (t.isCut || !this.unlockedZones.has(t.zoneId)) continue;
            const d = Math.hypot(w.x - t.x, w.y - t.y);
            if (d < bestD) {
              bestD = d;
              best = t;
            }
          }
          w.targetTree = best;
        }

        if (w.targetTree) {
          const t = w.targetTree;
          const dx = t.x - w.x;
          const dy = t.y - w.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 45) {
            w.isWalking = false;
            w.isChopping = true;
            w.chopTimer += dt;
            if (w.chopTimer >= 0.35) {
              w.chopTimer = 0;
              this.chopTree(t, 2, w);
            }
          } else {
            w.isWalking = true;
            w.isChopping = false;
            w.x += (dx / dist) * w.speed * dt;
            w.y += (dy / dist) * w.speed * dt;
            w.angle = Math.atan2(dy, dx);
          }
        }
      }
    }
  }

  updateTrees(dt) {
    for (const tree of this.trees) {
      if (tree.shakeTimer > 0) tree.shakeTimer -= dt;
      if (tree.isCut) {
        tree.respawnTimer -= dt;
        if (tree.respawnTimer <= 0) {
          tree.isCut = false;
          tree.hp = tree.maxHp;
          this.particles.burst(tree.x, tree.y, 8, '#00E676');
        }
      }
    }
  }

  updateDroppedLogs(dt) {
    const p = this.player;
    const maxCapacity = CAPACITY_TIERS[p.capacityIndex]?.capacity || 5;

    for (let i = this.droppedLogs.length - 1; i >= 0; i--) {
      const log = this.droppedLogs[i];
      log.life -= dt;

      // Vacuum pickup by player
      const d = Math.hypot(p.x - log.x, p.y - log.y);
      if (d < 85 && p.carriedLogs < maxCapacity) {
        log.x += (p.x - log.x) * dt * 8;
        log.y += (p.y - log.y) * dt * 8;

        if (d < 24) {
          p.carriedLogs++;
          this.audio.playCollect();
          this.droppedLogs.splice(i, 1);
          this.updateHUD();
          continue;
        }
      }

      // Vacuum pickup by nearby workers
      for (const w of this.workers) {
        if (w.carriedLogs < w.maxCarry) {
          const wd = Math.hypot(w.x - log.x, w.y - log.y);
          if (wd < 50) {
            w.carriedLogs++;
            this.droppedLogs.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  updateFlyingCoins(dt) {
    for (let i = this.flyingCoins.length - 1; i >= 0; i--) {
      const coin = this.flyingCoins[i];
      coin.t += dt * 3.5;
      coin.x = coin.startX + (coin.endX - coin.startX) * coin.t;
      coin.y = coin.startY + (coin.endY - coin.startY) * coin.t - Math.sin(coin.t * Math.PI) * 30;

      if (coin.t >= 1) {
        this.flyingCoins.splice(i, 1);
      }
    }
  }

  checkBuildingInteractions() {
    const p = this.player;
    this.promptText = '';

    // Sawmill deposit
    const mill = BUILDINGS.sawmill;
    if (p.x > mill.x && p.x < mill.x + mill.w && p.y > mill.y && p.y < mill.y + mill.h) {
      if (p.carriedLogs > 0) {
        const cashValue = p.carriedLogs * 25 * 1.5;
        this.saveData.cash += cashValue;
        this.saveData.totalCashEarned += cashValue;
        this.spawnCoinBursts(p.x, p.y, cashValue);
        this.audio.playCash();
        p.carriedLogs = 0;
        this.updateHUD();
        SaveManager.save(this.playgama, this.saveData);
      }
    }

    // Sell Market deposit
    const sell = BUILDINGS.sellZone;
    if (p.x > sell.x && p.x < sell.x + sell.w && p.y > sell.y && p.y < sell.y + sell.h) {
      if (p.carriedLogs > 0) {
        const cashValue = p.carriedLogs * 25;
        this.saveData.cash += cashValue;
        this.saveData.totalCashEarned += cashValue;
        this.spawnCoinBursts(p.x, p.y, cashValue);
        this.audio.playCash();
        p.carriedLogs = 0;
        this.updateHUD();
        SaveManager.save(this.playgama, this.saveData);
      }
    }

    // Blacksmith proximity
    const b = BUILDINGS.blacksmith;
    if (Math.hypot(p.x - (b.x + b.w / 2), p.y - (b.y + b.h / 2)) < 70) {
      this.promptText = 'Tap 🛒 Shop or Stand here to Upgrade Axes';
    }

    // Storage Barn proximity
    const s = BUILDINGS.storageBarn;
    if (Math.hypot(p.x - (s.x + s.w / 2), p.y - (s.y + s.h / 2)) < 70) {
      this.promptText = 'Upgrade Backpack Capacity at Depot';
    }

    // Check Zone Bridges
    for (const z of ZONES) {
      if (!this.unlockedZones.has(z.id)) {
        if (Math.hypot(p.x - z.bounds.x, p.y - z.bounds.y) < 140) {
          this.promptText = `Unlock ${z.name}: $${z.cost.toLocaleString()}`;
          if (this.saveData.cash >= z.cost) {
            this.saveData.cash -= z.cost;
            this.unlockedZones.add(z.id);
            this.saveData.unlockedZones = Array.from(this.unlockedZones);
            this.audio.playUpgrade();
            this.juice.screenShake(8);
            this.particles.burst(p.x, p.y, 25, '#FFB300');
            SaveManager.save(this.playgama, this.saveData);
            this.updateHUD();
          }
        }
      }
    }

    const bubble = document.getElementById('prompt-bubble');
    if (bubble) {
      if (this.promptText) {
        bubble.textContent = this.promptText;
        bubble.classList.remove('hidden');
      } else {
        bubble.classList.add('hidden');
      }
    }
  }

  spawnCoinBursts(x, y, amount) {
    this.particles.burst(x, y, 12, '#FFD54F');
    // Floating damage/score numbers
    this.juice.floatingText(`+$${Math.ceil(amount)}`, x, y - 20, '#FFE082', 18);
  }

  /* ==========================================================================
   * 7. MODALS & UPGRADES
   * ========================================================================== */

  openShopModal() {
    const list = document.getElementById('shop-list');
    if (!list) return;
    list.innerHTML = '';

    // Axe Upgrade Entry
    const nextAxeIdx = this.player.axeTier + 1;
    const nextAxe = AXE_TIERS[nextAxeIdx];

    const axeCard = document.createElement('div');
    axeCard.className = 'shop-item';
    axeCard.innerHTML = `
      <div class="shop-item-info">
        <span class="shop-item-title">🪓 ${AXE_TIERS[this.player.axeTier]?.name || 'Axe'}</span>
        <span class="shop-item-desc">Power: ${AXE_TIERS[this.player.axeTier]?.power}x | Speed: ${AXE_TIERS[this.player.axeTier]?.speed}s</span>
        <span class="shop-item-level">Tier ${this.player.axeTier + 1} / ${AXE_TIERS.length}</span>
      </div>
      <button class="btn-upgrade" id="btn-buy-axe" ${!nextAxe || this.saveData.cash < nextAxe.cost ? 'disabled' : ''}>
        ${nextAxe ? `Upgrade ($${nextAxe.cost})` : 'MAX'}
      </button>
    `;
    list.appendChild(axeCard);

    // Capacity Upgrade Entry
    const nextCapIdx = this.player.capacityIndex + 1;
    const nextCap = CAPACITY_TIERS[nextCapIdx];

    const capCard = document.createElement('div');
    capCard.className = 'shop-item';
    capCard.innerHTML = `
      <div class="shop-item-info">
        <span class="shop-item-title">🎒 Log Backpack</span>
        <span class="shop-item-desc">Max Carry: ${CAPACITY_TIERS[this.player.capacityIndex]?.capacity} Logs</span>
        <span class="shop-item-level">Tier ${this.player.capacityIndex + 1} / ${CAPACITY_TIERS.length}</span>
      </div>
      <button class="btn-upgrade" id="btn-buy-cap" ${!nextCap || this.saveData.cash < nextCap.cost ? 'disabled' : ''}>
        ${nextCap ? `Upgrade ($${nextCap.cost})` : 'MAX'}
      </button>
    `;
    list.appendChild(capCard);

    document.getElementById('btn-buy-axe')?.addEventListener('click', () => {
      if (nextAxe && this.saveData.cash >= nextAxe.cost) {
        this.saveData.cash -= nextAxe.cost;
        this.player.axeTier++;
        this.saveData.axeTier = this.player.axeTier;
        this.audio.playUpgrade();
        SaveManager.save(this.playgama, this.saveData);
        this.openShopModal();
        this.updateHUD();
      }
    });

    document.getElementById('btn-buy-cap')?.addEventListener('click', () => {
      if (nextCap && this.saveData.cash >= nextCap.cost) {
        this.saveData.cash -= nextCap.cost;
        this.player.capacityIndex++;
        this.saveData.capacityIndex = this.player.capacityIndex;
        this.audio.playUpgrade();
        SaveManager.save(this.playgama, this.saveData);
        this.openShopModal();
        this.updateHUD();
      }
    });

    document.getElementById('shop-modal')?.classList.remove('hidden');
  }

  openWorkerModal() {
    const list = document.getElementById('workers-list');
    if (!list) return;
    list.innerHTML = '';

    const workerCost = Math.floor(250 * Math.pow(1.8, this.workers.length));
    const card = document.createElement('div');
    card.className = 'shop-item';
    card.innerHTML = `
      <div class="shop-item-info">
        <span class="shop-item-title">👷 Hire Lumberjack Bot</span>
        <span class="shop-item-desc">Auto-chops trees & delivers wood</span>
        <span class="shop-item-level">Hired: ${this.workers.length} / 8</span>
      </div>
      <button class="btn-upgrade" id="btn-hire-worker" ${this.workers.length >= 8 || this.saveData.cash < workerCost ? 'disabled' : ''}>
        ${this.workers.length < 8 ? `Hire ($${workerCost})` : 'MAX'}
      </button>
    `;
    list.appendChild(card);

    document.getElementById('btn-hire-worker')?.addEventListener('click', () => {
      if (this.workers.length < 8 && this.saveData.cash >= workerCost) {
        this.saveData.cash -= workerCost;
        this.saveData.workerCount = this.workers.length + 1;
        this.spawnWorkers(this.saveData.workerCount);
        this.audio.playUpgrade();
        SaveManager.save(this.playgama, this.saveData);
        this.openWorkerModal();
        this.updateHUD();
      }
    });

    document.getElementById('workers-modal')?.classList.remove('hidden');
  }

  showRewardedCashGrant() {
    // Rewarded Video: +$1,000 Cash
    this.playgama.showRewarded((rewarded) => {
      if (rewarded) {
        this.saveData.cash += 1000;
        this.audio.playCash();
        this.juice.screenShake(6);
        this.particles.burst(this.player.x, this.player.y, 30, '#FFD54F');
        SaveManager.save(this.playgama, this.saveData);
        this.updateHUD();
      }
    });
  }

  showRewardedTurboRush() {
    // Rewarded Video: 60s 2X Speed Turbo Rush
    this.playgama.showRewarded((rewarded) => {
      if (rewarded) {
        this.isTurboActive = true;
        this.turboTimer = 60;
        document.getElementById('btn-turbo-boost')?.classList.add('active');
        this.audio.playUpgrade();
        this.particles.burst(this.player.x, this.player.y, 25, '#00E676');
      }
    });
  }

  updateHUD() {
    const cash = document.getElementById('hud-cash-val');
    const cap = document.getElementById('hud-cap-val');
    const maxCap = CAPACITY_TIERS[this.player.capacityIndex]?.capacity || 5;

    if (cash) cash.textContent = Math.floor(this.saveData.cash).toLocaleString();
    if (cap) cap.textContent = `${this.player.carriedLogs} / ${maxCap}`;
  }

  /* ==========================================================================
   * 8. RENDERING LOOP
   * ========================================================================== */

  render() {
    const ctx = this.renderer.ctx;
    this.renderer.beginFrame(this.camera);

    // 1. Top-Down Terrain & Base Roads
    drawTopDownTerrain(ctx, this.camera, WORLD.width, WORLD.height, this.animTime);

    // 2. Base Buildings
    for (const [key, building] of Object.entries(BUILDINGS)) {
      drawBuilding(ctx, key, building, this.animTime);
    }

    // 3. Dropped Collectible Wood Logs
    for (const log of this.droppedLogs) {
      drawDroppedLog(ctx, log);
    }

    // 4. Forest Trees
    for (const tree of this.trees) {
      drawTopDownTree(ctx, tree, this.animTime);
    }

    // 5. Automated NPC Lumberjack Workers
    for (const worker of this.workers) {
      drawLumberjack(ctx, worker, false, this.animTime);
    }

    // 6. Player Hero Character
    drawLumberjack(ctx, this.player, true, this.animTime);

    // 7. Ambient & Visual Particles
    this.particles.render(ctx);
    this.juice.renderWorld(ctx);

    this.renderer.endWorldFrame(this.camera);

    // 8. Screen Shake & Screen HUD Juice
    this.juice.renderScreen(ctx, this.renderer.virtualWidth, this.renderer.virtualHeight);
    this.renderer.endFrame();
  }
}

/* ============================================================================
 * 9. BOOTSTRAP ENTRY POINT
 * ============================================================================ */

function bootLumberTycoon() {
  const game = new LumberTycoonGame();
  game.init().catch((err) => console.error('Error starting Lumber Tycoon:', err));
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootLumberTycoon);
  } else {
    bootLumberTycoon();
  }
}