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
  { name: 'Red Camp Hatchet', power: 1, speed: 0.35, cost: 0, headColor: '#E53935', bevel: '#B71C1C', edge: '#ECEFF1' },
  { name: 'Forged Bronze Axe', power: 2, speed: 0.30, cost: 180, headColor: '#CD7F32', bevel: '#8D5524', edge: '#FFE082' },
  { name: 'Tempered Steel Axe', power: 4, speed: 0.25, cost: 650, headColor: '#607D8B', bevel: '#37474F', edge: '#FFFFFF' },
  { name: 'Gold-Plated Broadaxe', power: 8, speed: 0.22, cost: 2200, headColor: '#FFB300', bevel: '#FF8F00', edge: '#FFF9C4' },
  { name: 'Diamond Core Axe', power: 16, speed: 0.18, cost: 7500, headColor: '#00E5FF', bevel: '#0097A7', edge: '#E0F7FA' },
  { name: 'Plasma Laser Cutter', power: 35, speed: 0.15, cost: 24000, headColor: '#00E676', bevel: '#00A152', edge: '#B9F6CA' },
  { name: 'Mythic Celestial Greataxe', power: 85, speed: 0.10, cost: 75000, headColor: '#E040FB', bevel: '#AA00FF', edge: '#FFFFFF' }
];

export const CAPACITY_TIERS = [
  { capacity: 3, cost: 0 },
  { capacity: 5, cost: 60 },
  { capacity: 8, cost: 180 },
  { capacity: 12, cost: 450 },
  { capacity: 18, cost: 1200 },
  { capacity: 26, cost: 3000 },
  { capacity: 38, cost: 7500 },
  { capacity: 55, cost: 18000 },
  { capacity: 80, cost: 45000 }
];

export const WOOD_PROPERTIES = {
  oak: { name: 'Oak', logColor: '#8D6E63', outline: '#4E342E', plankColor: '#D7CCC8', plankBorder: '#8D6E63' },
  birch: { name: 'Birch', logColor: '#ECEFF1', outline: '#37474F', plankColor: '#FFF9C4', plankBorder: '#C0CA33' },
  pine: { name: 'Pine', logColor: '#4E342E', outline: '#271B17', plankColor: '#BCAAA4', plankBorder: '#5D4037' },
  sakura: { name: 'Sakura', logColor: '#E91E63', outline: '#880E4F', plankColor: '#F8BBD0', plankBorder: '#C2185B' },
  redwood: { name: 'Redwood', logColor: '#B71C1C', outline: '#5C0000', plankColor: '#FFCDD2', plankBorder: '#B71C1C' },
  golden: { name: 'Golden', logColor: '#FFB300', outline: '#FF8F00', plankColor: '#FFF59D', plankBorder: '#FFB300' }
};

export const ZONES = [
  { id: 'oak', name: 'Oak Meadow', cost: 0, treeType: 'oak', logValue: 20, maxHp: 3, logsPerTree: 3, unlocked: true, bounds: { x: 60, y: 1080, w: 900, h: 760 } },
  { id: 'birch', name: 'Birch Grove', cost: 350, treeType: 'birch', logValue: 55, maxHp: 5, logsPerTree: 4, unlocked: false, bounds: { x: 1050, y: 1080, w: 1280, h: 760 } },
  { id: 'pine', name: 'Pine Taiga', cost: 1400, treeType: 'pine', logValue: 130, maxHp: 8, logsPerTree: 4, unlocked: false, bounds: { x: 1520, y: 100, w: 820, h: 900 } },
  { id: 'sakura', name: 'Sakura Haven', cost: 5000, treeType: 'sakura', logValue: 350, maxHp: 12, logsPerTree: 5, unlocked: false, bounds: { x: 60, y: 100, w: 520, h: 900 } },
  { id: 'redwood', name: 'Redwood Sanctuary', cost: 18000, treeType: 'redwood', logValue: 900, maxHp: 20, logsPerTree: 6, unlocked: false, bounds: { x: 60, y: 1080, w: 2280, h: 760 } },
  { id: 'golden', name: 'Golden Mythic Forest', cost: 60000, treeType: 'golden', logValue: 2500, maxHp: 35, logsPerTree: 8, unlocked: false, bounds: { x: 1520, y: 100, w: 820, h: 1740 } }
];

export const BUILDINGS = {
  sawmill: { x: 860, y: 720, w: 140, h: 100, name: 'Sawmill', icon: '⚙️', desc: 'Processes raw logs into refined planks (+50% profit)' },
  sellZone: { x: 1080, y: 720, w: 130, h: 100, name: 'Wood Market', icon: '💰', desc: 'Sell refined planks (+50% bonus) or raw logs' },
  blacksmith: { x: 680, y: 720, w: 120, h: 95, name: 'Blacksmith', icon: '🪓', desc: 'Forge Mighty Axes' },
  storageBarn: { x: 1270, y: 720, w: 120, h: 95, name: 'Backpack Depot', icon: '🎒', desc: 'Expand Backpack Capacity' },
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
    osc.frequency.setValueAtTime(160 + Math.random() * 80, t);
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

  playSawBuzz() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.linearRampToValueAtTime(420, t + 0.12);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
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
      tutorialStep: 0,
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
  ctx.fillStyle = '#2c4722';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.022)';
  const tileSize = 64;
  for (let x = 0; x < width; x += tileSize) {
    for (let y = 0; y < height; y += tileSize) {
      if ((Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0) {
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
  }

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

  ctx.fillStyle = '#8d7b68';
  for (let px = b.x + 80; px < b.x + b.w - 80; px += 45) {
    ctx.beginPath();
    ctx.roundRect(px, b.y + 190, 36, 26, 6);
    ctx.fill();
  }
  ctx.restore();
}

function drawBuilding(ctx, bKey, building, animTime, sawmillState) {
  const { x, y, w, h, name, icon } = building;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2 + 15, w / 2 + 10, h / 2 + 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#3e2723';
  ctx.beginPath();
  ctx.roundRect(x, y + 10, w, h - 10, 14);
  ctx.fill();

  ctx.fillStyle = '#5d4037';
  ctx.beginPath();
  ctx.roundRect(x + 4, y, w - 8, h - 16, 12);
  ctx.fill();

  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 3;
  ctx.stroke();

  if (bKey === 'sawmill') {
    // Heavy Steel Industrial Conveyor Table
    ctx.fillStyle = '#263238';
    ctx.fillRect(x + 10, y + h / 2 - 12, w - 20, 24);
    ctx.fillStyle = '#37474F';
    ctx.fillRect(x + 12, y + h / 2 - 10, w - 24, 20);

    // Hazard Stripes on Conveyor edge
    ctx.fillStyle = '#FFD600';
    for (let hx = x + 16; hx < x + w - 20; hx += 18) {
      ctx.fillRect(hx, y + h / 2 + 8, 8, 4);
    }

    // Authentic High-Speed Carbide Circular Saw Blade
    const isCutting = sawmillState && sawmillState.queue.length > 0;
    const sawX = x + w / 2 - 15;
    const sawY = y + h / 2;
    const sawRadius = 22;

    ctx.save();
    ctx.translate(sawX, sawY);
    ctx.rotate(animTime * (isCutting ? 28 : 8));

    // Outer Silver Blade Disk
    ctx.fillStyle = '#ECEFF1';
    ctx.beginPath();
    ctx.arc(0, 0, sawRadius, 0, Math.PI * 2);
    ctx.fill();

    // 16 Sharp Angled Carbide Saw Teeth (Tooth Rake)
    const teeth = 16;
    ctx.fillStyle = '#CFD8DC';
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const nextA = ((i + 1) / teeth) * Math.PI * 2;
      const rInner = sawRadius - 3;
      const rTip = sawRadius + 5;
      const rBack = sawRadius - 1;

      const p1x = Math.cos(a) * rInner;
      const p1y = Math.sin(a) * rInner;
      const p2x = Math.cos(a + 0.12) * rTip;
      const p2y = Math.sin(a + 0.12) * rTip;
      const p3x = Math.cos(nextA) * rBack;
      const p3y = Math.sin(nextA) * rBack;

      if (i === 0) ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.lineTo(p3x, p3y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#90A4AE';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Center Arbor Flange & Nut
    ctx.fillStyle = '#455A64';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Protective Orange/Yellow Saw Safety Hood Guard
    ctx.fillStyle = '#F57F17';
    ctx.beginPath();
    ctx.arc(sawX, sawY, sawRadius + 6, -Math.PI * 0.95, -Math.PI * 0.05);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#F57F17';
    ctx.stroke();

    // Slicing Progress Radial Indicator
    if (sawmillState && sawmillState.queue.length > 0) {
      const prog = sawmillState.timer / 0.35;
      ctx.strokeStyle = '#00E676';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.arc(sawX, sawY, sawRadius + 8, -Math.PI / 2, -Math.PI / 2 + prog * Math.PI * 2);
      ctx.stroke();
    }

    // Cut Planks Stack on Output Side
    if (sawmillState && sawmillState.ready.length > 0) {
      const stackX = x + w - 36;
      const readyCount = Math.min(5, sawmillState.ready.length);
      for (let i = 0; i < readyCount; i++) {
        const item = sawmillState.ready[i];
        const prop = WOOD_PROPERTIES[item.type] || WOOD_PROPERTIES.oak;
        ctx.fillStyle = prop.plankColor;
        ctx.beginPath();
        ctx.roundRect(stackX - 12, y + h / 2 - 5 - i * 4, 24, 5.5, 2);
        ctx.fill();
        ctx.strokeStyle = prop.plankBorder;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // High-Contrast Floating Alert Tag
      const bounce = Math.sin(animTime * 5) * 6;
      ctx.save();
      ctx.translate(x + w / 2, y - 28 + bounce);

      ctx.fillStyle = 'rgba(10, 30, 15, 0.95)';
      ctx.beginPath();
      ctx.roundRect(-80, -14, 160, 28, 8);
      ctx.fill();
      ctx.strokeStyle = '#00E676';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = 'rgba(0, 230, 118, 0.25)';
      ctx.beginPath();
      ctx.roundRect(-83, -17, 166, 34, 10);
      ctx.fill();

      ctx.fillStyle = '#69F0AE';
      ctx.font = 'bold 12px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`🪚 ${sawmillState.ready.length} PLANKS READY!`, 0, 0);

      // Downward Arrow
      ctx.fillStyle = '#00E676';
      ctx.beginPath();
      ctx.moveTo(-6, 14);
      ctx.lineTo(6, 14);
      ctx.lineTo(0, 20);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Bottom label banner for sawmill
    ctx.fillStyle = 'rgba(15, 10, 5, 0.90)';
    ctx.beginPath();
    ctx.roundRect(x + 8, y + h - 22, w - 16, 20, 6);
    ctx.fill();

    ctx.fillStyle = '#ffe082';
    ctx.font = 'bold 12px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${icon} ${name}`, x + w / 2, y + h - 12);
  } else if (bKey === 'sellZone') {
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

    // Bottom label banner for sell zone
    ctx.fillStyle = 'rgba(15, 10, 5, 0.90)';
    ctx.beginPath();
    ctx.roundRect(x + 8, y + h - 22, w - 16, 20, 6);
    ctx.fill();

    ctx.fillStyle = '#ffe082';
    ctx.font = 'bold 12px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${icon} ${name}`, x + w / 2, y + h - 12);
  } else {
    // Blacksmith, Backpack Depot, Worker Barracks: Label & Icon centered in wooden square
    const centerX = x + w / 2;
    const centerY = y + h / 2;

    ctx.font = '26px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, centerX, centerY - 10);

    ctx.fillStyle = 'rgba(15, 10, 5, 0.88)';
    ctx.beginPath();
    ctx.roundRect(centerX - (w - 20) / 2, centerY + 8, w - 20, 20, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 179, 0, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ffe082';
    ctx.font = 'bold 11px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, centerX, centerY + 18);
  }

  ctx.restore();
}

function drawUpgradePad(ctx, pad, animTime) {
  const { x, y, radius, label, deposited, targetCost } = pad;
  const isComplete = targetCost <= 0 || deposited >= targetCost;

  ctx.save();
  const pulse = Math.sin(animTime * 4) * 4;
  ctx.fillStyle = isComplete ? 'rgba(76, 175, 80, 0.25)' : 'rgba(255, 179, 0, 0.25)';
  ctx.beginPath();
  ctx.arc(x, y, radius + pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isComplete ? '#00e676' : '#ffb300';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.lineDashOffset = -animTime * 20;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  if (!isComplete && targetCost > 0) {
    const progress = Math.min(1, deposited / targetCost);
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(x, y, radius - 4, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
    ctx.stroke();
  }

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
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(tree.x, tree.y + 4, tree.trunkR + 4, tree.trunkR * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#5d4037';
    ctx.fillRect(tree.x - tree.trunkR, tree.y - 12, tree.trunkR * 2, 12);

    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.ellipse(tree.x, tree.y - 12, tree.trunkR, tree.trunkR * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.strokeStyle = '#a1887f';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(tree.x, tree.y - 12, tree.trunkR * 0.5, tree.trunkR * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();

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

  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 4, tree.canopyR * 0.95, tree.canopyR * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();

  const trunkH = tree.trunkHeight || 42;
  const isBirch = tree.type === 'birch';
  const isRedwood = tree.type === 'redwood';

  // Textured Trunk
  ctx.fillStyle = isBirch ? '#ECEFF1' : isRedwood ? '#8D3B2B' : '#5D4037';
  ctx.fillRect(-tree.trunkR, -trunkH, tree.trunkR * 2, trunkH);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, -trunkH, tree.trunkR, trunkH);

  if (isBirch) {
    ctx.fillStyle = '#263238';
    ctx.fillRect(-tree.trunkR + 2, -trunkH + 8, 5, 2.5);
    ctx.fillRect(tree.trunkR - 6, -trunkH + 18, 5, 2.5);
    ctx.fillRect(-tree.trunkR + 3, -trunkH + 28, 6, 2.5);
  }

  ctx.translate(0, -trunkH);

  if (tree.type === 'pine') {
    // 4-Tiered Pyramidal Jagged Pine Fir Canopy
    const tiers = [
      { y: 0, w: tree.canopyR * 1.15, h: 26, c1: '#1B5E20', c2: '#0D3813' },
      { y: -18, w: tree.canopyR * 0.95, h: 24, c1: '#2E7D32', c2: '#1B5E20' },
      { y: -34, w: tree.canopyR * 0.75, h: 22, c1: '#388E3C', c2: '#2E7D32' },
      { y: -48, w: tree.canopyR * 0.50, h: 20, c1: '#43A047', c2: '#388E3C' }
    ];
    for (const t of tiers) {
      ctx.fillStyle = t.c2;
      ctx.beginPath();
      ctx.moveTo(-t.w, t.y);
      ctx.lineTo(0, t.y - t.h);
      ctx.lineTo(t.w, t.y);
      ctx.closePath();
      ctx.fill();

      // Needle detail
      ctx.fillStyle = t.c1;
      ctx.beginPath();
      ctx.moveTo(-t.w + 4, t.y - 4);
      ctx.lineTo(0, t.y - t.h + 3);
      ctx.lineTo(t.w - 4, t.y - 4);
      ctx.closePath();
      ctx.fill();
    }
  } else {
    // Volumetric Leafy Canopy with Organic Cloud Lobes
    let cBase = '#1B5E20';
    let cMid = '#2E7D32';
    let cTop = '#43A047';
    let cHighlight = '#81C784';

    if (tree.type === 'birch') {
      cBase = '#558B2F';
      cMid = '#7CB342';
      cTop = '#9CCC65';
      cHighlight = '#DCE775';
    } else if (tree.type === 'sakura') {
      cBase = '#880E4F';
      cMid = '#C2185B';
      cTop = '#E91E63';
      cHighlight = '#F48FB1';
    } else if (tree.type === 'redwood') {
      cBase = '#3E2723';
      cMid = '#5D4037';
      cTop = '#8D6E63';
      cHighlight = '#B71C1C';
    } else if (tree.type === 'golden') {
      cBase = '#FF8F00';
      cMid = '#FFB300';
      cTop = '#FFD54F';
      cHighlight = '#FFF9C4';
    }

    // 1. Base Shadow Canopy
    ctx.fillStyle = cBase;
    ctx.beginPath();
    ctx.ellipse(0, -6, tree.canopyR * 1.05, tree.canopyR * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Mid Foliage Lobes (Organic Cloud Tufts)
    ctx.fillStyle = cMid;
    const lobes = 6;
    for (let i = 0; i < lobes; i++) {
      const ang = (i / lobes) * Math.PI * 2;
      const lx = Math.cos(ang) * (tree.canopyR * 0.55);
      const ly = -14 + Math.sin(ang) * (tree.canopyR * 0.45);
      const lr = tree.canopyR * 0.52;
      ctx.beginPath();
      ctx.arc(lx, ly, lr, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Top Volume Canopy
    ctx.fillStyle = cTop;
    ctx.beginPath();
    ctx.ellipse(-tree.canopyR * 0.15, -20, tree.canopyR * 0.65, tree.canopyR * 0.55, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // 4. Stylized Sunlight Highlight Leaf Puffs
    ctx.fillStyle = cHighlight;
    ctx.beginPath();
    ctx.arc(-tree.canopyR * 0.35, -28, tree.canopyR * 0.28, 0, Math.PI * 2);
    ctx.arc(tree.canopyR * 0.15, -26, tree.canopyR * 0.24, 0, Math.PI * 2);
    ctx.fill();

    // Golden Sparkles / Sakura Petals
    if (tree.type === 'golden') {
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.55 + Math.sin(animTime * 6) * 0.35;
      ctx.beginPath();
      ctx.arc(-tree.canopyR * 0.2, -30, 3.5, 0, Math.PI * 2);
      ctx.arc(tree.canopyR * 0.3, -18, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    } else if (tree.type === 'sakura') {
      ctx.fillStyle = '#F8BBD0';
      const petalY = (animTime * 15) % 30;
      ctx.beginPath();
      ctx.arc(-tree.canopyR * 0.4, -10 + petalY, 2, 0, Math.PI * 2);
      ctx.arc(tree.canopyR * 0.35, -20 + petalY * 0.7, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

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
  const prop = WOOD_PROPERTIES[log.type] || WOOD_PROPERTIES.oak;
  ctx.save();
  ctx.translate(log.x, log.y);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 4, 14, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = prop.logColor;
  ctx.beginPath();
  ctx.roundRect(-12, -7, 24, 14, 4);
  ctx.fill();
  ctx.strokeStyle = prop.outline;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Log End Ring
  ctx.fillStyle = prop.plankColor;
  ctx.beginPath();
  ctx.ellipse(10, 0, 3.5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Authentic Hand-Held 2.5D Lumberjack Axe Vector Model
 */
function drawHandHeldAxe(ctx, axe, isChopping, animTime) {
  ctx.save();
  // Pivot placed cleanly to the right side of the character!
  ctx.translate(16, -1);

  if (isChopping) {
    const chopAngle = Math.sin(animTime * 15) * 0.85 + 0.15;
    ctx.rotate(chopAngle);
  } else {
    // Tilted slightly outward, pointing away from the face!
    ctx.rotate(0.18);
  }

  // Handle
  ctx.save();
  ctx.fillStyle = '#E0A96D';
  ctx.beginPath();
  ctx.arc(0, 14, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-2, 14);
  ctx.quadraticCurveTo(0, 0, -1.5, -16);
  ctx.lineTo(2, -16);
  ctx.quadraticCurveTo(3.5, 0, 2, 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3E2723';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.strokeStyle = '#B87333';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(0, 12);
  ctx.quadraticCurveTo(1.5, 0, 0.5, -14);
  ctx.stroke();

  // Wedge top
  ctx.fillStyle = '#A16828';
  ctx.beginPath();
  ctx.roundRect(-1.5, -20, 3.5, 5, 1.5);
  ctx.fill();
  ctx.strokeStyle = '#3E2723';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // Axe Head
  ctx.save();
  ctx.translate(0, -13);

  ctx.fillStyle = '#263238';
  ctx.beginPath();
  ctx.roundRect(-3.5, -4.5, 7, 9, 2);
  ctx.fill();

  ctx.fillStyle = axe.headColor;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.bezierCurveTo(4, -5, 8, -7, 13, -10);
  ctx.quadraticCurveTo(16, 0, 13, 10);
  ctx.bezierCurveTo(8, 7, 4, 5, 0, 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1A1A1A';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.fillStyle = axe.bevel;
  ctx.beginPath();
  ctx.moveTo(1, -2.5);
  ctx.lineTo(6, -3.5);
  ctx.lineTo(6, 3.5);
  ctx.lineTo(1, 2.5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = axe.edge;
  ctx.beginPath();
  ctx.moveTo(9, -7.5);
  ctx.quadraticCurveTo(14, 0, 9, 7.5);
  ctx.lineTo(13, 10);
  ctx.quadraticCurveTo(16, 0, 13, -10);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1A1A1A';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(10.5, -5);
  ctx.quadraticCurveTo(13, 0, 10.5, 4);
  ctx.stroke();

  ctx.restore();

  // Hand Glove holding Handle
  ctx.fillStyle = '#FFCC80';
  ctx.beginPath();
  ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3E2723';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.restore();
}

function drawLumberjackHero(ctx, actor, isPlayer, animTime) {
  const { x, y, isWalking, isChopping, inventory, axeTier } = actor;

  ctx.save();
  ctx.translate(x, y);

  // Soft Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 7, 16, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  const walkBob = isWalking ? Math.sin(animTime * 14) * 2.5 : 0;
  const walkSway = isWalking ? Math.sin(animTime * 14) * 0.08 : 0;
  ctx.translate(0, walkBob);
  ctx.rotate(walkSway);

  // Stacked Items on Back with True Wood Colors
  if (inventory && inventory.length > 0) {
    const stackCount = Math.min(8, inventory.length);
    for (let i = 0; i < stackCount; i++) {
      const item = inventory[i];
      const prop = WOOD_PROPERTIES[item.type] || WOOD_PROPERTIES.oak;
      const itemY = -14 - i * 7;
      ctx.save();

      if (item.isPlank) {
        ctx.fillStyle = prop.plankColor;
        ctx.beginPath();
        ctx.roundRect(-14, itemY, 28, 6, 2);
        ctx.fill();
        ctx.strokeStyle = prop.plankBorder;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      } else {
        ctx.fillStyle = prop.logColor;
        ctx.beginPath();
        ctx.roundRect(-13, itemY, 26, 7, 3);
        ctx.fill();
        ctx.strokeStyle = prop.outline;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // Torso (Red Flannel Plaid Shirt)
  ctx.fillStyle = isPlayer ? '#D32F2F' : '#F57C00';
  ctx.beginPath();
  ctx.roundRect(-13, -14, 26, 22, 8);
  ctx.fill();

  // Denim Dungarees / Overalls
  ctx.fillStyle = '#1976D2';
  ctx.beginPath();
  ctx.roundRect(-11, -4, 22, 14, 4);
  ctx.fill();

  // Denim Straps & Golden Buckles
  ctx.fillStyle = '#1565C0';
  ctx.fillRect(-9, -14, 4, 14);
  ctx.fillRect(5, -14, 4, 14);

  ctx.fillStyle = '#FFD54F';
  ctx.beginPath();
  ctx.arc(-7, -4, 1.8, 0, Math.PI * 2);
  ctx.arc(7, -4, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#FFE0B2';
  ctx.beginPath();
  ctx.arc(0, -22, 11.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Fluffy Hair Tufts Peeking Out
  ctx.fillStyle = '#5D4037';
  ctx.beginPath();
  ctx.arc(-10, -23, 3.2, 0, Math.PI * 2);
  ctx.arc(10, -23, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // Rosy Cheeks
  ctx.fillStyle = '#FF8A80';
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.arc(-6, -18.5, 2.5, 0, Math.PI * 2);
  ctx.arc(6, -18.5, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Big Clear Eyes with Dual Specular Sparkle Highlights
  ctx.fillStyle = '#212121';
  ctx.beginPath();
  ctx.arc(-4.5, -21, 2.6, 0, Math.PI * 2);
  ctx.arc(4.5, -21, 2.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-5.1, -21.8, 0.9, 0, Math.PI * 2);
  ctx.arc(-3.7, -20.2, 0.5, 0, Math.PI * 2);
  ctx.arc(3.9, -21.8, 0.9, 0, Math.PI * 2);
  ctx.arc(5.3, -20.2, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Cute Little Smile
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, -16.5, 2.5, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Safety Helmet Raised Above Forehead
  const helmetColor = isPlayer ? '#FBC02D' : '#FFE082';
  const helmetRidge = isPlayer ? '#F57F17' : '#FFD54F';

  // Cap Dome
  ctx.fillStyle = helmetColor;
  ctx.beginPath();
  ctx.arc(0, -30, 12, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#E65100';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Safety Center Ridge
  ctx.fillStyle = helmetRidge;
  ctx.beginPath();
  ctx.roundRect(-2.5, -41, 5, 11, 2);
  ctx.fill();

  // 3D Curved Brim
  ctx.fillStyle = helmetColor;
  ctx.beginPath();
  ctx.roundRect(-14, -31, 28, 4.5, 2);
  ctx.fill();
  ctx.strokeStyle = '#E65100';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Axe on the side
  const axe = AXE_TIERS[axeTier || 0] || AXE_TIERS[0];
  drawHandHeldAxe(ctx, axe, isChopping, animTime);

  ctx.restore();
}

function drawTutorialArrow(ctx, targetX, targetY, title, animTime) {
  const bounceY = Math.sin(animTime * 5) * 8;
  const arrowY = targetY - 70 + bounceY;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.beginPath();
  ctx.arc(targetX, targetY, 32 + Math.sin(animTime * 4) * 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(targetX, arrowY);

  ctx.fillStyle = '#FFD54F';
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.lineTo(-14, -6);
  ctx.lineTo(-6, -6);
  ctx.lineTo(-6, -20);
  ctx.lineTo(6, -20);
  ctx.lineTo(6, -6);
  ctx.lineTo(14, -6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#212121';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.font = 'bold 12px Fredoka, sans-serif';
  const textWidth = ctx.measureText(title).width;
  const boxW = Math.max(140, textWidth + 24);

  ctx.fillStyle = 'rgba(15, 10, 5, 0.92)';
  ctx.beginPath();
  ctx.roundRect(-boxW / 2, -54, boxW, 28, 8);
  ctx.fill();
  ctx.strokeStyle = '#FFD54F';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FFE082';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 0, -40);

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

    // Player State with Rich Typed Inventory
    this.player = {
      x: 1040,
      y: 840,
      vx: 0,
      vy: 0,
      speed: 210,
      radius: 14,
      isWalking: false,
      isChopping: false,
      inventory: [],        // [{ type: 'oak'|'birch'|'pine'|'sakura'|'redwood'|'golden', value: number, isPlank: boolean }]
      axeTier: 0,
      capacityIndex: 0,
      chopTimer: 0
    };

    // Sawmill Machine Queue State
    this.sawmillState = {
      queue: [],            // Array of log objects waiting in line [{ type, value }]
      timer: 0,             // Cutting timer per log (0.35s)
      ready: []             // Array of finished plank objects [{ type, value, isPlank: true }]
    };

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
    this.tutorialStep = 0;

    // Playgama Interstitial Ad Cooldown (60s minimum interval)
    this.lastInterstitialTime = Date.now();
    this.interstitialCooldown = 60000;

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);

    if (typeof window !== 'undefined') {
      window.__gameInstance = this;
      window.__lumberTycoonInstance = this;
    }
  }

  async triggerInterstitial(placement = 'general') {
    const now = Date.now();
    if (now - this.lastInterstitialTime < this.interstitialCooldown) {
      return false;
    }
    this.lastInterstitialTime = now;
    console.log(`[Playgama] Triggering Interstitial Ad: placement=${placement}`);
    try {
      await this.playgama.showInterstitial();
      return true;
    } catch (err) {
      console.warn('[Playgama] Interstitial ad error:', err);
      return false;
    }
  }

  get carriedLogs() {
    return this.player.inventory.filter((i) => !i.isPlank).length;
  }

  get carriedPlanks() {
    return this.player.inventory.filter((i) => i.isPlank).length;
  }

  async init() {
    await this.playgama.init();
    this.saveData = await SaveManager.load(this.playgama);

    this.player.axeTier = this.saveData.axeTier || 0;
    this.player.capacityIndex = this.saveData.capacityIndex || 0;
    this.tutorialStep = this.saveData.tutorialStep || 0;
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
        inventory: [],
        maxCarry: 6,
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
      this.triggerInterstitial('shop_exit');
    });
    document.getElementById('btn-close-workers')?.addEventListener('click', () => {
      document.getElementById('workers-modal')?.classList.add('hidden');
      this.triggerInterstitial('workers_exit');
    });

    document.getElementById('btn-airdrop')?.addEventListener('click', () => this.showRewardedCashGrant());

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

    if (this.state !== 'PLAYING') return;

    this.updatePlayer(dt);
    this.updateWorkers(dt);
    this.updateTrees(dt);
    this.updateDroppedLogs(dt);
    this.updateSawmillProcess(dt);
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
      p.vx = (mx / (len > 1 ? len : 1)) * p.speed;
      p.vy = (my / (len > 1 ? len : 1)) * p.speed;
    } else {
      p.isWalking = false;
      p.vx = 0;
      p.vy = 0;
    }

    const nextX = Math.max(30, Math.min(WORLD.width - 30, p.x + p.vx * dt));
    const nextY = Math.max(30, Math.min(WORLD.height - 30, p.y + p.vy * dt));

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

    this.handlePlayerChopping(dt);
  }

  handlePlayerChopping(dt) {
    const p = this.player;
    const axe = AXE_TIERS[p.axeTier] || AXE_TIERS[0];
    let nearestTree = null;
    let minDist = 64;

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

      if (p.chopTimer >= axe.speed) {
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

    const prop = WOOD_PROPERTIES[tree.type] || WOOD_PROPERTIES.oak;
    this.particles.burst(tree.x, tree.y - (tree.trunkHeight || 42), 8, prop.logColor);

    if (tree.hp <= 0) {
      tree.isCut = true;
      tree.respawnTimer = tree.respawnMax;
      this.audio.playTreeFall();
      this.juice.screenShake(6);

      this.saveData.totalTreesCut = (this.saveData.totalTreesCut || 0) + 1;

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

      if (this.tutorialStep === 0) {
        this.tutorialStep = 1;
        this.saveData.tutorialStep = 1;
        SaveManager.save(this.playgama, this.saveData);
      }
    }
  }

  updateWorkers(dt) {
    for (const w of this.workers) {
      const carriedPlanks = w.inventory.filter((i) => i.isPlank);
      const carriedLogs = w.inventory.filter((i) => !i.isPlank);

      if (carriedPlanks.length > 0) {
        const target = BUILDINGS.sellZone;
        const dx = target.x + target.w / 2 - w.x;
        const dy = target.y + target.h / 2 - w.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 45) {
          let cashEarned = 0;
          for (const item of carriedPlanks) cashEarned += item.value;
          this.saveData.cash += cashEarned;
          this.audio.playCash();
          this.spawnCoinBursts(w.x, w.y, cashEarned, 'Planks');
          w.inventory = w.inventory.filter((i) => !i.isPlank);
          w.targetTree = null;
        } else {
          w.isWalking = true;
          w.x += (dx / dist) * w.speed * dt;
          w.y += (dy / dist) * w.speed * dt;
        }
      } else if (carriedLogs.length >= w.maxCarry) {
        const target = BUILDINGS.sawmill;
        const dx = target.x + target.w / 2 - w.x;
        const dy = target.y + target.h / 2 - w.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 45) {
          for (const log of carriedLogs) {
            this.sawmillState.queue.push(log);
          }
          w.inventory = [];
          this.audio.playSawBuzz();
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
          const prop = WOOD_PROPERTIES[tree.type] || WOOD_PROPERTIES.oak;
          this.particles.burst(tree.x, tree.y, 10, prop.logColor);
        }
      }
    }
  }

  updateDroppedLogs(dt) {
    const p = this.player;
    const maxCap = CAPACITY_TIERS[p.capacityIndex]?.capacity || 3;

    for (let i = this.droppedLogs.length - 1; i >= 0; i--) {
      const log = this.droppedLogs[i];
      log.life -= dt;

      // Vacuum pickup by player
      const d = Math.hypot(p.x - log.x, p.y - log.y);
      if (d < 90 && p.inventory.length < maxCap) {
        log.x += (p.x - log.x) * dt * 9;
        log.y += (p.y - log.y) * dt * 9;

        if (d < 24) {
          p.inventory.push({
            type: log.type,
            value: log.value,
            isPlank: false
          });
          this.audio.playCollect();
          this.droppedLogs.splice(i, 1);
          this.updateHUD();
          continue;
        }
      }

      // Vacuum pickup by workers
      for (const w of this.workers) {
        if (w.inventory.length < w.maxCarry) {
          const wd = Math.hypot(w.x - log.x, w.y - log.y);
          if (wd < 50) {
            w.inventory.push({
              type: log.type,
              value: log.value,
              isPlank: false
            });
            this.droppedLogs.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  /**
   * Sawmill Gradual Log-by-Log Cutting Machine with Individual Log Values
   */
  updateSawmillProcess(dt) {
    const s = this.sawmillState;
    if (s.queue.length > 0) {
      s.timer += dt;
      const sliceInterval = 0.35;

      if (s.timer >= sliceInterval) {
        s.timer = 0;
        const nextLog = s.queue.shift();
        if (nextLog) {
          // Plank value is 1.5x of the log's specific tier value!
          const plankValue = Math.round(nextLog.value * 1.5);
          s.ready.push({
            type: nextLog.type,
            value: plankValue,
            isPlank: true
          });
          this.audio.playSawBuzz();
          const mill = BUILDINGS.sawmill;
          const prop = WOOD_PROPERTIES[nextLog.type] || WOOD_PROPERTIES.oak;
          this.particles.burst(mill.x + mill.w / 2 + 10, mill.y + mill.h / 2, 8, prop.plankColor);
        }
      }
    } else {
      s.timer = 0;
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
   * 7. STREAMING UPGRADE PADS (CONTROLLED & CONTINUOUS)
   * ========================================================================== */

  updateUpgradePads(dt) {
    const p = this.player;

    for (const pad of this.upgradePads) {
      if (pad.cooldown && pad.cooldown > 0) {
        pad.cooldown -= dt;
        continue;
      }

      if (pad.targetCost <= 0) continue;

      const d = Math.hypot(p.x - pad.x, p.y - pad.y);
      if (d < pad.radius) {
        const needed = pad.targetCost - pad.deposited;
        if (needed > 0 && this.saveData.cash > 0) {
          pad.tickTimer = (pad.tickTimer || 0) + dt;

          const tickInterval = 0.07;
          if (pad.tickTimer >= tickInterval) {
            pad.tickTimer = 0;

            const chunk = Math.min(
              this.saveData.cash,
              needed,
              Math.max(2, Math.min(40, Math.ceil(pad.targetCost * 0.05)))
            );

            this.saveData.cash -= chunk;
            pad.deposited += chunk;
            this.audio.playCoinTick();

            this.flyingCoins.push({
              startX: p.x,
              startY: p.y - 15,
              endX: pad.x + (Math.random() - 0.5) * 16,
              endY: pad.y + (Math.random() - 0.5) * 12,
              t: 0
            });

            this.updateHUD();

            if (pad.deposited >= pad.targetCost) {
              this.completeUpgrade(pad);
            }
          }
        }
      } else {
        pad.tickTimer = 0;
      }
    }
  }

  completeUpgrade(pad) {
    this.audio.playUpgrade();
    this.juice.screenShake(8);
    this.particles.burst(pad.x, pad.y, 30, '#FFD54F');
    this.juice.spawnFloatingText('LEVEL UP! ✨', pad.x, pad.y - 40, { color: '#00E676', size: 22 });

    pad.cooldown = 0.35;
    pad.deposited = 0;

    if (pad.type === 'AXE') {
      this.player.axeTier++;
      this.saveData.axeTier = this.player.axeTier;
      pad.targetCost = AXE_TIERS[this.player.axeTier + 1]?.cost || 0;

      if (this.tutorialStep === 3) {
        this.tutorialStep = 4;
        this.saveData.tutorialStep = 4;
      }
      if (this.player.axeTier >= 3) {
        this.triggerInterstitial('major_upgrade');
      }
    } else if (pad.type === 'CAPACITY') {
      this.player.capacityIndex++;
      this.saveData.capacityIndex = this.player.capacityIndex;
      pad.targetCost = CAPACITY_TIERS[this.player.capacityIndex + 1]?.cost || 0;
      if (this.player.capacityIndex >= 3) {
        this.triggerInterstitial('major_upgrade');
      }
    } else if (pad.type === 'WORKER') {
      this.saveData.workerCount = this.workers.length + 1;
      this.spawnWorkers(this.saveData.workerCount);
      pad.targetCost = Math.floor(250 * Math.pow(1.8, this.workers.length));
      if (this.workers.length >= 2) {
        this.triggerInterstitial('worker_hired');
      }
    } else if (pad.type.startsWith('ZONE_')) {
      const zoneId = pad.type.replace('ZONE_', '').toLowerCase();
      this.unlockedZones.add(zoneId);
      this.saveData.unlockedZones = Array.from(this.unlockedZones);
      pad.targetCost = 0;
      this.triggerInterstitial('zone_unlock');
    }

    SaveManager.save(this.playgama, this.saveData);
    this.updateHUD();
  }

  /* ==========================================================================
   * 8. SAWMILL CUTTING & WOOD MARKET SELLING WITH TIER VALUATION
   * ========================================================================== */

  checkBuildingInteractions() {
    const p = this.player;
    const maxCap = CAPACITY_TIERS[p.capacityIndex]?.capacity || 3;

    // 1. SAWMILL: Unloads raw logs into queue & collects finished planks
    const mill = BUILDINGS.sawmill;
    if (p.x > mill.x && p.x < mill.x + mill.w && p.y > mill.y && p.y < mill.y + mill.h) {
      const rawLogs = p.inventory.filter((i) => !i.isPlank);
      if (rawLogs.length > 0) {
        for (const item of rawLogs) {
          this.sawmillState.queue.push(item);
        }
        p.inventory = p.inventory.filter((i) => i.isPlank);
        this.audio.playSawBuzz();
        this.juice.spawnFloatingText(`+${rawLogs.length} Logs Queued ⚙️`, p.x, p.y - 30, { color: '#FFE082', size: 16 });
        this.updateHUD();
      }

      const space = maxCap - p.inventory.length;
      if (this.sawmillState.ready.length > 0 && space > 0) {
        const takeCount = Math.min(this.sawmillState.ready.length, space);
        const taken = this.sawmillState.ready.splice(0, takeCount);
        p.inventory.push(...taken);
        this.audio.playCollect();
        this.juice.spawnFloatingText(`+${takeCount} Planks Collected! 🪚`, p.x, p.y - 25, { color: '#00E676', size: 16 });
        this.updateHUD();

        if (this.tutorialStep === 1) {
          this.tutorialStep = 2;
          this.saveData.tutorialStep = 2;
          SaveManager.save(this.playgama, this.saveData);
        }
      }
    }

    // 2. WOOD MARKET: Sells items based on their individual wood values!
    const sell = BUILDINGS.sellZone;
    if (p.x > sell.x && p.x < sell.x + sell.w && p.y > sell.y && p.y < sell.y + sell.h) {
      if (p.inventory.length > 0) {
        let totalEarned = 0;
        let highestType = 'Oak';
        let hadPlanks = false;

        for (const item of p.inventory) {
          totalEarned += item.value;
          const prop = WOOD_PROPERTIES[item.type];
          if (prop) highestType = prop.name;
          if (item.isPlank) hadPlanks = true;
        }

        p.inventory = [];
        this.saveData.cash += totalEarned;
        this.saveData.totalCashEarned += totalEarned;
        this.spawnCoinBursts(p.x, p.y, totalEarned, hadPlanks ? `${highestType} (+50%)` : highestType);
        this.audio.playCash();
        this.updateHUD();
        SaveManager.save(this.playgama, this.saveData);

        if (this.tutorialStep === 2) {
          this.tutorialStep = 3;
          this.saveData.tutorialStep = 3;
          SaveManager.save(this.playgama, this.saveData);
        }
      }
    }
  }

  spawnCoinBursts(x, y, amount, label = '') {
    this.particles.burst(x, y, 12, '#FFD54F');
    const txt = label ? `+$${Math.ceil(amount)} (${label}) 💰` : `+$${Math.ceil(amount)} 💰`;
    this.juice.spawnFloatingText(txt, x, y - 25, { color: '#FFE082', size: 18 });
  }

  /* ==========================================================================
   * 9. MODALS & UPGRADES
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
        <span class="shop-item-desc">Max Carry: ${CAPACITY_TIERS[this.player.capacityIndex]?.capacity} Items</span>
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
        <span class="shop-item-desc">Auto-chops trees, cuts planks & delivers</span>
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
        this.saveData.cash += 500;
        this.audio.playCash();
        this.juice.screenShake(6);
        this.particles.burst(this.player.x, this.player.y, 30, '#FFD54F');
        SaveManager.save(this.playgama, this.saveData);
        this.updateHUD();
      }
    });
  }

  updateHUD() {
    const cash = document.getElementById('hud-cash-val');
    const logs = document.getElementById('hud-logs-val');
    const planks = document.getElementById('hud-planks-val');
    const maxCap = CAPACITY_TIERS[this.player.capacityIndex]?.capacity || 3;

    if (cash) cash.textContent = `$${Math.floor(this.saveData.cash).toLocaleString()}`;
    if (logs) logs.textContent = `${this.carriedLogs} / ${maxCap}`;
    if (planks) planks.textContent = `${this.carriedPlanks} / ${maxCap}`;
  }

  /* ==========================================================================
   * 10. 2.5D DEPTH-SORTED RENDERING LOOP & TUTORIAL OVERLAY
   * ========================================================================== */

  render() {
    const ctx = this.renderer.ctx;
    this.renderer.beginFrame(this.camera);

    // 1. Ground Terrain & Roads
    drawTopDownTerrain(ctx, WORLD.width, WORLD.height, this.animTime);

    // 2. Upgrade Pads
    for (const pad of this.upgradePads) {
      drawUpgradePad(ctx, pad, this.animTime);
    }

    // 3. Collect 2.5D Entities for Depth Y-Sorting
    const renderQueue = [];

    // Base Buildings
    for (const [key, b] of Object.entries(BUILDINGS)) {
      renderQueue.push({
        y: b.y + b.h - 10,
        draw: () => drawBuilding(ctx, key, b, this.animTime, this.sawmillState)
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

    // 4. SORT BY Y AND DRAW
    renderQueue.sort((a, b) => a.y - b.y);
    for (const item of renderQueue) {
      item.draw();
    }

    // 5. Streaming Flying Coins
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

    // 6. Guided Playgama-Style Tutorial Arrow
    if (this.tutorialStep === 0) {
      let nearestOak = null;
      let minD = Infinity;
      for (const t of this.trees) {
        if (!t.isCut && t.zoneId === 'oak') {
          const d = Math.hypot(this.player.x - t.x, this.player.y - t.y);
          if (d < minD) { minD = d; nearestOak = t; }
        }
      }
      if (nearestOak) {
        drawTutorialArrow(ctx, nearestOak.x, nearestOak.y, '1. Chop tree for raw logs! 🪓', this.animTime);
      }
    } else if (this.tutorialStep === 1) {
      const mill = BUILDINGS.sawmill;
      drawTutorialArrow(ctx, mill.x + mill.w / 2, mill.y + mill.h / 2, '2. Feed logs into Sawmill! ⚙️', this.animTime);
    } else if (this.tutorialStep === 2) {
      const market = BUILDINGS.sellZone;
      drawTutorialArrow(ctx, market.x + market.w / 2, market.y + market.h / 2, '3. Sell planks for +50% Bonus! 💰', this.animTime);
    } else if (this.tutorialStep === 3) {
      const forgePad = this.upgradePads.find((p) => p.type === 'AXE');
      if (forgePad) {
        drawTutorialArrow(ctx, forgePad.x, forgePad.y, '4. Stand on Forge Pad to upgrade Axe! 🪓', this.animTime);
      }
    }

    // 7. Particles & World Juice
    this.particles.render(ctx);
    this.juice.renderWorld(ctx);

    this.renderer.endWorldFrame(this.camera);

    // 8. Screen HUD Juice
    this.juice.renderScreen(ctx, this.renderer.virtualWidth, this.renderer.virtualHeight);
    this.renderer.endFrame();
  }
}

/* ============================================================================
 * 11. BOOTSTRAP ENTRY POINT
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