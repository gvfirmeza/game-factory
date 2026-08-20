/**
 * ============================================================================
 * LUMBER TYCOON — 2.5D ISOMETRIC TOP-DOWN COZY ARCADE TYCOON
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
  width: 2400,
  height: 1900,
  baseZone: { x: 650, y: 550, w: 800, h: 480 }
};

export const AXE_TIERS = [
  { name: 'Rusty Hatchet', power: 1, speed: 0.35, cost: 0, handle: '#8D6E63', blade: '#90A4AE', edge: '#ECEFF1' },
  { name: 'Forged Bronze Axe', power: 2, speed: 0.30, cost: 200, handle: '#795548', blade: '#CD7F32', edge: '#FFE082' },
  { name: 'Tempered Steel Axe', power: 4, speed: 0.25, cost: 750, handle: '#4E342E', blade: '#78909C', edge: '#FFFFFF' },
  { name: 'Gold-Plated Broadaxe', power: 8, speed: 0.22, cost: 2500, handle: '#3E2723', blade: '#FFB300', edge: '#FFF59D' },
  { name: 'Diamond Core Axe', power: 16, speed: 0.18, cost: 9000, handle: '#263238', blade: '#00E5FF', edge: '#E0F7FA' },
  { name: 'Plasma Laser Cutter', power: 35, speed: 0.15, cost: 28000, handle: '#212121', blade: '#00E676', edge: '#B9F6CA' },
  { name: 'Mythic Celestial Greataxe', power: 85, speed: 0.10, cost: 85000, handle: '#1A237E', blade: '#E040FB', edge: '#FFFFFF' }
];

export const CAPACITY_TIERS = [
  { capacity: 5, cost: 0 },
  { capacity: 10, cost: 120 },
  { capacity: 25, cost: 450 },
  { capacity: 50, cost: 1500 },
  { capacity: 90, cost: 5000 },
  { capacity: 150, cost: 16000 },
  { capacity: 250, cost: 50000 }
];

export const ZONES = [
  { id: 'oak', name: 'Oak Meadow', cost: 0, treeType: 'oak', logValue: 20, maxHp: 3, logsPerTree: 3, unlocked: true, bounds: { x: 60, y: 1080, w: 900, h: 760 } },
  { id: 'birch', name: 'Birch Grove', cost: 350, treeType: 'birch', logValue: 55, maxHp: 5, logsPerTree: 4, unlocked: false, bounds: { x: 1050, y: 1080, w: 1280, h: 760 } },
  { id: 'pine', name: 'Pine Taiga', cost: 1400, treeType: 'pine', logValue: 130, maxHp: 8, logsPerTree: 4, unlocked: false, bounds: { x: 1520, y: 100, w: 820, h: 900 } },
  { id: 'sakura', name: 'Sakura Haven', cost: 5000, treeType: 'sakura', logValue: 350, maxHp: 12, logsPerTree: 5, unlocked: false, bounds: { x: 60, y: 100, w: 520, h: 900 } },
  { id: 'redwood', name: 'Redwood Sanctuary', cost: 18000, treeType: 'redwood', logValue: 900, maxHp: 20, logsPerTree: 6, unlocked: false, bounds: { x: 60, y: 1080, w: 2280, h: 760 } },
  { id: 'golden', name: 'Golden Mythic Forest', cost: 60000, treeType: 'golden', logValue: 2500, maxHp: 35, logsPerTree: 8, unlocked: false, bounds: { x: 1520, y: 100, w: 820, h: 1740 } }
];

export const BUILDINGS = {
  sawmill: { x: 860, y: 720, w: 140, h: 100, name: 'Sawmill', icon: '⚙️', desc: 'Processes logs into planks (+50% bonus)' },
  sellZone: { x: 1080, y: 720, w: 130, h: 100, name: 'Wood Market', icon: '💰', desc: 'Instant Cash Register' },
  blacksmith: { x: 680, y: 720, w: 120, h: 95, name: 'Blacksmith', icon: '🪓', desc: 'Forge Mighty Axes' },
  storageBarn: { x: 1270, y: 720, w: 120, h: 95, name: 'Backpack Depot', icon: '🎒', desc: 'Expand Log Capacity' },
  workerHut: { x: 970, y: 570, w: 140, h: 95, name: 'Worker Barracks', icon: '👷', desc: 'Hire Automated Bots' }
};

/* ============================================================================
 * 2. PROCEDURAL AUDIO SYNTHESIZER
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
    osc.frequency.setValueAtTime(150 + Math.random() * 80, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.08);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
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
    osc.frequency.setValueAtTime(540 + Math.random() * 80, t);
    osc.frequency.exponentialRampToValueAtTime(920, t + 0.09);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  playCoinTick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100 + Math.random() * 200, t);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  playCash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [987.77, 1318.51];
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

    const chords = [523.25, 659.25, 783.99, 1046.5];
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
      axeTier: 0,
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
 * 4. 2.5D ISOMETRIC / TILTED TOP-DOWN VECTOR GRAPHICS ENGINE
 * ============================================================================ */

function drawTopDownTerrain(ctx, width, height, animTime) {
  // Rich lush grass ground
  ctx.fillStyle = '#2c4722';
  ctx.fillRect(0, 0, width, height);

  // Soft grid grass checker pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.022)';
  const tileSize = 64;
  for (let x = 0; x < width; x += tileSize) {
    for (let y = 0; y < height; y += tileSize) {
      if ((Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0) {
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
  }

  // Base Village Zone (Sandy Dirt Clearing)
  const b = WORLD.baseZone;
  ctx.save();
  ctx.fillStyle = '#4e3b2b';
  ctx.beginPath();
  ctx.roundRect(b.x - 30, b.y - 30, b.w + 60, b.h + 60, 36);
  ctx.fill();

  ctx.fillStyle = '#6d533d';
  ctx.beginPath();
  ctx.roundRect(b.x - 18, b.y - 18, b.w + 36, b.h + 36, 26);
  ctx.fill();

  // Stone paths between sawmill and market
  ctx.fillStyle = '#8d7b68';
  for (let px = b.x + 80; px < b.x + b.w - 80; px += 45) {
    ctx.beginPath();
    ctx.roundRect(px, b.y + 190, 36, 26, 6);
    ctx.fill();
  }
  ctx.restore();
}

function drawBuilding(ctx, bKey, building, animTime) {
  const { x, y, w, h, name, icon } = building;

  ctx.save();
  // Ground drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2 + 15, w / 2 + 10, h / 2 + 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2.5D Wooden Base Wall (front face)
  ctx.fillStyle = '#3e2723';
  ctx.beginPath();
  ctx.roundRect(x, y + 10, w, h - 10, 14);
  ctx.fill();

  // 2.5D Roof Top (angled face)
  ctx.fillStyle = '#5d4037';
  ctx.beginPath();
  ctx.roundRect(x + 4, y, w - 8, h - 16, 12);
  ctx.fill();

  // Roof plank highlights
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 3;
  ctx.stroke();

  if (bKey === 'sawmill') {
    // Animated circular buzzsaw on conveyor
    const sawX = x + w / 2;
    const sawY = y + h / 2 - 2;
    ctx.save();
    ctx.translate(sawX, sawY);
    ctx.rotate(animTime * 14);
    ctx.fillStyle = '#eceff1';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b0bec5';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Saw teeth
    ctx.fillStyle = '#78909c';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      ctx.fillRect(Math.cos(a) * 18 - 2, Math.sin(a) * 18 - 2, 5, 5);
    }
    ctx.restore();
  } else if (bKey === 'sellZone') {
    // Glowing golden drop pad
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.roundRect(x + 14, y + 10, w - 28, h - 28, 8);
    ctx.fill();
    ctx.strokeStyle = '#ffb300';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#ffe082';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2 - 4, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  // Label banner
  ctx.fillStyle = 'rgba(15, 10, 5, 0.90)';
  ctx.beginPath();
  ctx.roundRect(x + 8, y + h - 22, w - 16, 20, 6);
  ctx.fill();

  ctx.fillStyle = '#ffe082';
  ctx.font = 'bold 12px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${icon} ${name}`, x + w / 2, y + h - 12);

  ctx.restore();
}

function drawUpgradePad(ctx, pad, animTime) {
  const { x, y, radius, label, deposited, targetCost, icon } = pad;
  const isComplete = targetCost <= 0 || deposited >= targetCost;

  ctx.save();
  // Glowing outer ground ring
  const pulse = Math.sin(animTime * 4) * 4;
  ctx.fillStyle = isComplete ? 'rgba(76, 175, 80, 0.25)' : 'rgba(255, 179, 0, 0.25)';
  ctx.beginPath();
  ctx.arc(x, y, radius + pulse, 0, Math.PI * 2);
  ctx.fill();

  // Dashed border pad
  ctx.strokeStyle = isComplete ? '#00e676' : '#ffb300';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.lineDashOffset = -animTime * 20;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Progress fill ring
  if (!isComplete && targetCost > 0) {
    const progress = Math.min(1, deposited / targetCost);
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(x, y, radius - 4, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
    ctx.stroke();
  }

  // Center pad badge
  ctx.fillStyle = 'rgba(25, 15, 10, 0.88)';
  ctx.beginPath();
  ctx.roundRect(x - 65, y - 26, 130, 52, 10);
  ctx.fill();
  ctx.strokeStyle = isComplete ? '#00e676' : '#ffb300';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Fredoka, sans-serif';
  ctx.fillText(label, x, y - 10);

  // Price progress text
  ctx.font = 'bold 13px Fredoka, sans-serif';
  if (isComplete) {
    ctx.fillStyle = '#00e676';
    ctx.fillText('✓ MAX / UNLOCKED', x, y + 10);
  } else {
    ctx.fillStyle = '#ffd54f';
    ctx.fillText(`$${Math.floor(deposited)} / $${targetCost}`, x, y + 10);
  }

  ctx.restore();
}

function drawTiltedTree(ctx, tree, animTime) {
  if (tree.isCut) {
    // 2.5D Tree Stump with wood rings
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(tree.x, tree.y + 4, tree.trunkR + 4, tree.trunkR * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk base cylinder
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(tree.x - tree.trunkR, tree.y - 12, tree.trunkR * 2, 12);

    // Top face of stump
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.ellipse(tree.x, tree.y - 12, tree.trunkR, tree.trunkR * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Age rings
    ctx.strokeStyle = '#a1887f';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(tree.x, tree.y - 12, tree.trunkR * 0.5, tree.trunkR * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Regrowth progress ring
    if (tree.respawnTimer > 0) {
      const progress = 1 - (tree.respawnTimer / tree.respawnMax);
      ctx.strokeStyle = '#00e676';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(tree.x, tree.y, tree.trunkR + 8, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  ctx.save();
  const shakeX = tree.shakeTimer > 0 ? Math.sin(tree.shakeTimer * 35) * 5 : 0;
  ctx.translate(tree.x + shakeX, tree.y);

  // 1. Ground Drop Shadow (under trunk)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 4, tree.canopyR * 0.9, tree.canopyR * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. 2.5D Visible Tree Trunk Cylinder
  const trunkH = tree.trunkHeight || 42;
  const isBirch = tree.type === 'birch';
  const isRedwood = tree.type === 'redwood';

  ctx.fillStyle = isBirch ? '#eceff1' : isRedwood ? '#b71c1c' : '#5d4037';
  ctx.fillRect(-tree.trunkR, -trunkH, tree.trunkR * 2, trunkH);

  // Trunk shading
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, -trunkH, tree.trunkR, trunkH);

  // Birch dark bark notches
  if (isBirch) {
    ctx.fillStyle = '#263238';
    ctx.fillRect(-tree.trunkR + 2, -trunkH + 8, 5, 3);
    ctx.fillRect(tree.trunkR - 6, -trunkH + 18, 5, 3);
    ctx.fillRect(-tree.trunkR + 3, -trunkH + 28, 6, 3);
  }

  // 3. Tilted Canopy (Drawn atop the trunk)
  ctx.translate(0, -trunkH);

  if (tree.type === 'pine') {
    // 3-Tier Layered Evergreen Pine Needles
    const tiers = [
      { y: 0, w: tree.canopyR * 1.05, h: 28, c: '#1b5e20' },
      { y: -18, w: tree.canopyR * 0.85, h: 26, c: '#2e7d32' },
      { y: -34, w: tree.canopyR * 0.60, h: 24, c: '#388e3c' }
    ];
    for (const t of tiers) {
      ctx.fillStyle = t.c;
      ctx.beginPath();
      ctx.moveTo(-t.w, t.y);
      ctx.lineTo(0, t.y - t.h);
      ctx.lineTo(t.w, t.y);
      ctx.closePath();
      ctx.fill();
    }
  } else {
    // Fluffy Organic Cloud-like Canopies (Oak, Birch, Sakura, Redwood, Golden)
    let outerColor = '#2e7d32';
    let midColor = '#43a047';
    let innerColor = '#66bb6a';

    if (tree.type === 'birch') {
      outerColor = '#689f38';
      midColor = '#8bc34a';
      innerColor = '#dce775';
    } else if (tree.type === 'sakura') {
      outerColor = '#c2185b';
      midColor = '#e91e63';
      innerColor = '#f48fb1';
    } else if (tree.type === 'redwood') {
      outerColor = '#3e2723';
      midColor = '#880e4f';
      innerColor = '#b71c1c';
    } else if (tree.type === 'golden') {
      outerColor = '#ff8f00';
      midColor = '#ffb300';
      innerColor = '#fff176';
    }

    // Outer cluster
    ctx.fillStyle = outerColor;
    ctx.beginPath();
    ctx.arc(0, -10, tree.canopyR, 0, Math.PI * 2);
    ctx.fill();

    // Mid leafy bumps
    ctx.fillStyle = midColor;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const off = tree.canopyR * 0.45;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * off, -10 + Math.sin(angle) * off, tree.canopyR * 0.52, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top Highlight Dome
    ctx.fillStyle = innerColor;
    ctx.beginPath();
    ctx.arc(-tree.canopyR * 0.2, -18, tree.canopyR * 0.46, 0, Math.PI * 2);
    ctx.fill();

    // Golden shimmer
    if (tree.type === 'golden') {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.5 + Math.sin(animTime * 6) * 0.3;
      ctx.beginPath();
      ctx.arc(0, -15, tree.canopyR * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // 4. HP Bar above tree
  if (tree.hp < tree.maxHp) {
    const barW = 44;
    const barH = 7;
    const pct = tree.hp / tree.maxHp;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.roundRect(-barW / 2, -tree.canopyR - 26, barW, barH, 3);
    ctx.fill();

    ctx.fillStyle = pct > 0.5 ? '#00e676' : pct > 0.25 ? '#ffb300' : '#ff5252';
    ctx.beginPath();
    ctx.roundRect(-barW / 2 + 1, -tree.canopyR - 25, (barW - 2) * pct, barH - 2, 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawDroppedLog(ctx, log) {
  ctx.save();
  ctx.translate(log.x, log.y);

  // Ground drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 4, 14, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3D Rounded Log
  ctx.fillStyle = log.type === 'golden' ? '#ffb300' : '#8d6e63';
  ctx.beginPath();
  ctx.roundRect(-12, -7, 24, 14, 4);
  ctx.fill();
  ctx.strokeStyle = log.type === 'golden' ? '#ffe082' : '#4e342e';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Log End Ring
  ctx.fillStyle = log.type === 'golden' ? '#ffe082' : '#d7ccc8';
  ctx.beginPath();
  ctx.ellipse(10, 0, 3.5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawLumberjackHero(ctx, actor, isPlayer, animTime) {
  const { x, y, isWalking, isChopping, carriedLogs, axeTier } = actor;

  ctx.save();
  ctx.translate(x, y);

  // Ground Drop Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 6, 16, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walk bobbing
  const walkBob = isWalking ? Math.sin(animTime * 14) * 2.5 : 0;
  const walkSway = isWalking ? Math.sin(animTime * 14) * 0.08 : 0;
  ctx.translate(0, walkBob);
  ctx.rotate(walkSway);

  // 1. Stacked 3D Logs on Back
  if (carriedLogs > 0) {
    const stackCount = Math.min(8, carriedLogs);
    for (let i = 0; i < stackCount; i++) {
      ctx.save();
      const logY = -12 - i * 7;
      ctx.fillStyle = '#8d6e63';
      ctx.beginPath();
      ctx.roundRect(-13, logY, 26, 7, 3);
      ctx.fill();
      ctx.strokeStyle = '#4e342e';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  // 2. Body / Flannel Shirt & Overalls
  ctx.fillStyle = isPlayer ? '#c62828' : '#e65100'; // Player Red Plaid, Worker Hi-Vis Orange
  ctx.beginPath();
  ctx.roundRect(-12, -14, 24, 20, 7);
  ctx.fill();

  // Denim Overalls Straps
  ctx.fillStyle = '#1565c0';
  ctx.fillRect(-8, -14, 4, 18);
  ctx.fillRect(4, -14, 4, 18);

  // 3. Head & Hardhat
  ctx.fillStyle = '#ffcc80';
  ctx.beginPath();
  ctx.arc(0, -22, 11, 0, Math.PI * 2);
  ctx.fill();

  // Yellow Safety Hardhat
  ctx.fillStyle = isPlayer ? '#ffb300' : '#ffe082';
  ctx.beginPath();
  ctx.arc(0, -26, 12, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-14, -26, 28, 4);

  // Eyes & Catchlight
  ctx.fillStyle = '#212121';
  ctx.beginPath();
  ctx.arc(-3, -22, 2, 0, Math.PI * 2);
  ctx.arc(3, -22, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-3.5, -22.5, 0.8, 0, Math.PI * 2);
  ctx.arc(2.5, -22.5, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // 4. REAL 2.5D CHUNKY LUMBERJACK AXE
  ctx.save();
  const axe = AXE_TIERS[axeTier || 0] || AXE_TIERS[0];
  ctx.translate(8, -12);

  if (isChopping) {
    const chopAngle = Math.sin(animTime * 15) * 1.3 - 0.3;
    ctx.rotate(chopAngle);

    // Dynamic Axe Swing Blur Trail
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 32, -Math.PI / 2, Math.PI / 3);
    ctx.stroke();
  }

  // Curved Hardwood Handle
  ctx.fillStyle = axe.handle;
  ctx.beginPath();
  ctx.roundRect(0, -3, 24, 6, 2);
  ctx.fill();
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Metal Blade Collar
  ctx.fillStyle = '#455a64';
  ctx.fillRect(16, -5, 4, 10);

  // Crescent Axe Head
  ctx.fillStyle = axe.blade;
  ctx.beginPath();
  ctx.moveTo(20, -18);
  ctx.quadraticCurveTo(28, -8, 28, 0);
  ctx.quadraticCurveTo(28, 8, 20, 18);
  ctx.lineTo(16, 12);
  ctx.lineTo(16, -12);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#37474f';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Razor Sharp Cutting Edge Highlight
  ctx.strokeStyle = axe.edge;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, -18);
  ctx.quadraticCurveTo(28, -8, 28, 0);
  ctx.quadraticCurveTo(28, 8, 20, 18);
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
    this.state = 'TITLE';
    this.animTime = 0;

    // Player State
    this.player = {
      x: 1040,
      y: 840,
      vx: 0,
      vy: 0,
      speed: 210,
      radius: 14,
      isWalking: false,
      isChopping: false,
      carriedLogs: 0,
      axeTier: 0,
      capacityIndex: 0,
      chopTimer: 0
    };

    // Touch Joystick
    this.joystick = {
      active: false,
      startX: 0,
      startY: 0,
      dx: 0,
      dy: 0
    };

    this.keys = {};
    this.trees = [];
    this.droppedLogs = [];
    this.workers = [];
    this.flyingCoins = [];
    this.upgradePads = [];
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

    this.player.axeTier = this.saveData.axeTier || 0;
    this.player.capacityIndex = this.saveData.capacityIndex || 0;
    if (Array.isArray(this.saveData.unlockedZones)) {
      this.saveData.unlockedZones.forEach((z) => this.unlockedZones.add(z));
    }

    const audioEnabled = this.playgama.isAudioEnabled();
    this.audio.setMuted(!audioEnabled || (this.saveData.settings?.isMuted));

    this.generateForest();
    this.initUpgradePads();
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
      const count = zone.id === 'oak' ? 28 : zone.id === 'birch' ? 24 : zone.id === 'pine' ? 22 : 18;
      for (let i = 0; i < count; i++) {
        const x = zone.bounds.x + 60 + Math.random() * (zone.bounds.w - 120);
        const y = zone.bounds.y + 60 + Math.random() * (zone.bounds.h - 120);

        // Keep clear of base clearing
        if (x > WORLD.baseZone.x - 50 && x < WORLD.baseZone.x + WORLD.baseZone.w + 50 &&
            y > WORLD.baseZone.y - 50 && y < WORLD.baseZone.y + WORLD.baseZone.h + 50) {
          continue;
        }

        const isRedwood = zone.id === 'redwood';
        const isGolden = zone.id === 'golden';

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
          trunkR: isRedwood ? 18 : 12,
          trunkHeight: isRedwood ? 65 : isGolden ? 55 : 42,
          canopyR: isRedwood ? 45 : isGolden ? 38 : 30,
          isCut: false,
          shakeTimer: 0,
          respawnTimer: 0,
          respawnMax: isGolden ? 25 : 12
        });
      }
    });
  }

  initUpgradePads() {
    this.upgradePads = [
      {
        id: 'pad_blacksmith',
        type: 'AXE',
        x: 740,
        y: 840,
        radius: 46,
        label: '🪓 FORGE AXE',
        deposited: 0,
        targetCost: AXE_TIERS[this.player.axeTier + 1]?.cost || 0
      },
      {
        id: 'pad_backpack',
        type: 'CAPACITY',
        x: 1330,
        y: 840,
        radius: 46,
        label: '🎒 BACKPACK',
        deposited: 0,
        targetCost: CAPACITY_TIERS[this.player.capacityIndex + 1]?.cost || 0
      },
      {
        id: 'pad_workers',
        type: 'WORKER',
        x: 1040,
        y: 520,
        radius: 46,
        label: '👷 HIRE WORKER',
        deposited: 0,
        targetCost: Math.floor(250 * Math.pow(1.8, this.workers.length))
      },
      {
        id: 'pad_birch',
        type: 'ZONE_BIRCH',
        x: 1050,
        y: 1040,
        radius: 52,
        label: '🌿 BIRCH GROVE',
        deposited: 0,
        targetCost: this.unlockedZones.has('birch') ? 0 : 350
      },
      {
        id: 'pad_pine',
        type: 'ZONE_PINE',
        x: 1520,
        y: 560,
        radius: 52,
        label: '🌲 PINE TAIGA',
        deposited: 0,
        targetCost: this.unlockedZones.has('pine') ? 0 : 1400
      },
      {
        id: 'pad_sakura',
        type: 'ZONE_SAKURA',
        x: 520,
        y: 420,
        radius: 52,
        label: '🌸 SAKURA HAVEN',
        deposited: 0,
        targetCost: this.unlockedZones.has('sakura') ? 0 : 5000
      },
      {
        id: 'pad_redwood',
        type: 'ZONE_REDWOOD',
        x: 600,
        y: 1400,
        radius: 52,
        label: '🪵 REDWOOD GIANTS',
        deposited: 0,
        targetCost: this.unlockedZones.has('redwood') ? 0 : 18000
      },
      {
        id: 'pad_golden',
        type: 'ZONE_GOLDEN',
        x: 1800,
        y: 1000,
        radius: 52,
        label: '✨ GOLDEN FOREST',
        deposited: 0,
        targetCost: this.unlockedZones.has('golden') ? 0 : 60000
      }
    ];
  }

  spawnWorkers(count) {
    this.workers = [];
    for (let i = 0; i < count; i++) {
      this.workers.push({
        id: `worker_${i}`,
        x: BUILDINGS.workerHut.x + 40 + (i % 3) * 25,
        y: BUILDINGS.workerHut.y + 40 + Math.floor(i / 3) * 25,
        radius: 12,
        vx: 0,
        vy: 0,
        speed: 135,
        isWalking: false,
        isChopping: false,
        carriedLogs: 0,
        maxCarry: 8,
        axeTier: 1,
        targetTree: null,
        chopTimer: 0
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
    this.updateUpgradePads(dt);
    this.checkBuildingInteractions();

    this.camera.follow(this.player.x, this.player.y, dt * 6);
  }

  updatePlayer(dt) {
    const p = this.player;
    let mx = 0;
    let my = 0;

    if (this.keys['w'] || this.keys['arrowup']) my -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) my += 1;
    if (this.keys['a'] || this.keys['arrowleft']) mx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) mx += 1;

    if (this.joystick.active) {
      mx = this.joystick.dx;
      my = this.joystick.dy;
    }

    const len = Math.hypot(mx, my);
    if (len > 0.1) {
      p.isWalking = true;
      const speedMult = this.isTurboActive ? 1.6 : 1.0;
      p.vx = (mx / (len > 1 ? len : 1)) * p.speed * speedMult;
      p.vy = (my / (len > 1 ? len : 1)) * p.speed * speedMult;
    } else {
      p.isWalking = false;
      p.vx = 0;
      p.vy = 0;
    }

    // Proposed new position
    const nextX = Math.max(30, Math.min(WORLD.width - 30, p.x + p.vx * dt));
    const nextY = Math.max(30, Math.min(WORLD.height - 30, p.y + p.vy * dt));

    // SOLID TREE TRUNK COLLISION (Player cannot walk through trunks)
    let canMoveX = true;
    let canMoveY = true;

    for (const tree of this.trees) {
      if (tree.isCut) continue;
      const trunkDistX = Math.hypot(nextX - tree.x, p.y - tree.y);
      if (trunkDistX < (p.radius + tree.trunkR)) canMoveX = false;

      const trunkDistY = Math.hypot(p.x - tree.x, nextY - tree.y);
      if (trunkDistY < (p.radius + tree.trunkR)) canMoveY = false;
    }

    if (canMoveX) p.x = nextX;
    if (canMoveY) p.y = nextY;

    // Proximity Auto-Chop
    this.handlePlayerChopping(dt);
  }

  handlePlayerChopping(dt) {
    const p = this.player;
    const axe = AXE_TIERS[p.axeTier] || AXE_TIERS[0];
    let nearestTree = null;
    let minDist = 62; // Adjacent distance to tree trunk

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
    this.particles.burst(tree.x, tree.y - (tree.trunkHeight || 42), 8, '#8D6E63');

    if (tree.hp <= 0) {
      tree.isCut = true;
      tree.respawnTimer = tree.respawnMax;
      this.audio.playTreeFall();
      this.juice.screenShake(6);

      this.saveData.totalTreesCut = (this.saveData.totalTreesCut || 0) + 1;

      // Spawn dropped logs in circular cluster
      for (let i = 0; i < tree.logsPerTree; i++) {
        const offsetAng = Math.random() * Math.PI * 2;
        const offsetDist = 18 + Math.random() * 24;
        this.droppedLogs.push({
          x: tree.x + Math.cos(offsetAng) * offsetDist,
          y: tree.y + Math.sin(offsetAng) * offsetDist,
          value: tree.logValue,
          type: tree.type,
          life: 45
        });
      }
    }
  }

  updateWorkers(dt) {
    for (const w of this.workers) {
      if (w.carriedLogs >= w.maxCarry) {
        const target = BUILDINGS.sawmill;
        const dx = target.x + target.w / 2 - w.x;
        const dy = target.y + target.h / 2 - w.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 45) {
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
        }
      } else {
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

          if (dist < 48) {
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
          this.particles.burst(tree.x, tree.y, 10, '#00E676');
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
      if (d < 90 && p.carriedLogs < maxCapacity) {
        log.x += (p.x - log.x) * dt * 9;
        log.y += (p.y - log.y) * dt * 9;

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
      coin.t += dt * 4;
      coin.x = coin.startX + (coin.endX - coin.startX) * coin.t;
      coin.y = coin.startY + (coin.endY - coin.startY) * coin.t - Math.sin(coin.t * Math.PI) * 40;

      if (coin.t >= 1) {
        this.flyingCoins.splice(i, 1);
      }
    }
  }

  /* ==========================================================================
   * 7. STREAMING UPGRADE PADS (ARCADE IDLE MECHANIC)
   * ========================================================================== */

  updateUpgradePads(dt) {
    const p = this.player;

    for (const pad of this.upgradePads) {
      if (pad.targetCost <= 0) continue;

      const d = Math.hypot(p.x - pad.x, p.y - pad.y);
      if (d < pad.radius) {
        // Player standing inside upgrade pad!
        const needed = pad.targetCost - pad.deposited;
        if (needed > 0 && this.saveData.cash > 0) {
          // Stream money smoothly
          const transferSpeed = Math.max(1, Math.ceil(pad.targetCost * dt * 2));
          const transfer = Math.min(this.saveData.cash, needed, transferSpeed);

          this.saveData.cash -= transfer;
          pad.deposited += transfer;
          this.audio.playCoinTick();

          // Spawn stream of coins rising into pad
          this.flyingCoins.push({
            startX: p.x,
            startY: p.y - 15,
            endX: pad.x,
            endY: pad.y,
            t: 0
          });

          this.updateHUD();

          // Check if upgrade completed!
          if (pad.deposited >= pad.targetCost) {
            this.completeUpgrade(pad);
          }
        }
      }
    }
  }

  completeUpgrade(pad) {
    this.audio.playUpgrade();
    this.juice.screenShake(8);
    this.particles.burst(pad.x, pad.y, 30, '#FFD54F');
    this.juice.floatingText('LEVEL UP! ✨', pad.x, pad.y - 40, '#00E676', 22);

    if (pad.type === 'AXE') {
      this.player.axeTier++;
      this.saveData.axeTier = this.player.axeTier;
      pad.deposited = 0;
      pad.targetCost = AXE_TIERS[this.player.axeTier + 1]?.cost || 0;
    } else if (pad.type === 'CAPACITY') {
      this.player.capacityIndex++;
      this.saveData.capacityIndex = this.player.capacityIndex;
      pad.deposited = 0;
      pad.targetCost = CAPACITY_TIERS[this.player.capacityIndex + 1]?.cost || 0;
    } else if (pad.type === 'WORKER') {
      this.saveData.workerCount = this.workers.length + 1;
      this.spawnWorkers(this.saveData.workerCount);
      pad.deposited = 0;
      pad.targetCost = Math.floor(250 * Math.pow(1.8, this.workers.length));
    } else if (pad.type.startsWith('ZONE_')) {
      const zoneId = pad.type.replace('ZONE_', '').toLowerCase();
      this.unlockedZones.add(zoneId);
      this.saveData.unlockedZones = Array.from(this.unlockedZones);
      pad.targetCost = 0; // Completed
    }

    SaveManager.save(this.playgama, this.saveData);
    this.updateHUD();
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

    const bubble = document.getElementById('prompt-bubble');
    if (bubble) {
      if (p.carriedLogs >= (CAPACITY_TIERS[p.capacityIndex]?.capacity || 5)) {
        bubble.textContent = '🎒 Backpack Full! Deliver to Sawmill (+50% cash)';
        bubble.classList.remove('hidden');
      } else {
        bubble.classList.add('hidden');
      }
    }
  }

  spawnCoinBursts(x, y, amount) {
    this.particles.burst(x, y, 12, '#FFD54F');
    this.juice.floatingText(`+$${Math.ceil(amount)}`, x, y - 25, '#FFE082', 18);
  }

  /* ==========================================================================
   * 8. MODALS & UPGRADES
   * ========================================================================== */

  openShopModal() {
    const list = document.getElementById('shop-list');
    if (!list) return;
    list.innerHTML = '';

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
        <span class="shop-item-desc">Auto-chops trees & delivers timber</span>
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
   * 9. 2.5D DEPTH-SORTED RENDERING LOOP
   * ========================================================================== */

  render() {
    const ctx = this.renderer.ctx;
    this.renderer.beginFrame(this.camera);

    // 1. Ground Terrain & Roads (Always bottom)
    drawTopDownTerrain(ctx, WORLD.width, WORLD.height, this.animTime);

    // 2. Upgrade Pads (Ground Level)
    for (const pad of this.upgradePads) {
      drawUpgradePad(ctx, pad, this.animTime);
    }

    // 3. Collect all 2.5D Entities for Depth Y-Sorting
    const renderQueue = [];

    // Base Buildings
    for (const [key, b] of Object.entries(BUILDINGS)) {
      renderQueue.push({
        y: b.y + b.h - 10,
        draw: () => drawBuilding(ctx, key, b, this.animTime)
      });
    }

    // Dropped Logs
    for (const log of this.droppedLogs) {
      renderQueue.push({
        y: log.y,
        draw: () => drawDroppedLog(ctx, log)
      });
    }

    // Trees
    for (const tree of this.trees) {
      renderQueue.push({
        y: tree.y,
        draw: () => drawTiltedTree(ctx, tree, this.animTime)
      });
    }

    // Workers
    for (const worker of this.workers) {
      renderQueue.push({
        y: worker.y,
        draw: () => drawLumberjackHero(ctx, worker, false, this.animTime)
      });
    }

    // Player Hero
    renderQueue.push({
      y: this.player.y,
      draw: () => drawLumberjackHero(ctx, this.player, true, this.animTime)
    });

    // 4. SORT BY Y AND DRAW IN ORDER (Guarantees proper occlusion!)
    renderQueue.sort((a, b) => a.y - b.y);
    for (const item of renderQueue) {
      item.draw();
    }

    // 5. Streaming Flying Coins (Above actors)
    for (const coin of this.flyingCoins) {
      ctx.save();
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffb300';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    // 6. Particles & Floating Texts
    this.particles.render(ctx);
    this.juice.renderWorld(ctx);

    this.renderer.endWorldFrame(this.camera);

    // 7. Screen HUD Juice
    this.juice.renderScreen(ctx, this.renderer.virtualWidth, this.renderer.virtualHeight);
    this.renderer.endFrame();
  }
}

/* ============================================================================
 * 10. BOOTSTRAP ENTRY POINT
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