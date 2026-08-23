/**
 * ============================================================================
 * FOX STREET CROSSING — 2.5D ISOMETRIC TOP-DOWN ENDLESS ARCADE HOPPER
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

export const CONFIG = {
  TILE_SIZE: 48,
  GRID_COLS: 10,       // Virtual width: 480px (10 columns: x: 0..9)
  VIEW_ROWS: 15,       // Virtual height: 720px
  VIRTUAL_W: 480,
  VIRTUAL_H: 720,
  HOP_DURATION: 0.13,  // Snappy 130ms hop
  EAGLE_PATIENCE: 7.0  // Idle limit before eagle swoops down
};

export const SKINS = [
  {
    id: 'classic',
    name: 'Classic Rusty Fox',
    desc: 'The iconic energetic red fox of the forest',
    cost: 0,
    furColor: '#FF6D00',
    bellyColor: '#FFFFFF',
    earInner: '#FF80AB',
    eyeColor: '#212121',
    accessory: 'none'
  },
  {
    id: 'arctic',
    name: 'Arctic Snow Fox',
    desc: 'Fluffy sub-zero fur with glowing ice-blue eyes',
    cost: 100,
    furColor: '#ECEFF1',
    bellyColor: '#FFFFFF',
    earInner: '#80DEEA',
    eyeColor: '#00E5FF',
    accessory: 'snow_sparkle'
  },
  {
    id: 'ninja',
    name: 'Shadow Shinobi Fox',
    desc: 'Stealthy night-stalker equipped with a crimson headband',
    cost: 250,
    furColor: '#263238',
    bellyColor: '#455A64',
    earInner: '#E53935',
    eyeColor: '#FFD600',
    accessory: 'headband'
  },
  {
    id: 'king',
    name: 'Royal Golden Fox',
    desc: 'Majestic emperor of the woodland kingdom wearing a jewel crown',
    cost: 600,
    furColor: '#FFD54F',
    bellyColor: '#FFF9C4',
    earInner: '#FF8A80',
    eyeColor: '#7C4DFF',
    accessory: 'crown'
  }
];

export const VEHICLE_TYPES = [
  { id: 'sedan', name: 'Sedan', width: 68, height: 34, speedRange: [130, 180], colors: ['#E53935', '#1E88E5', '#43A047', '#8E24AA'] },
  { id: 'taxi', name: 'Taxi', width: 70, height: 34, speedRange: [180, 230], colors: ['#FFD600'] },
  { id: 'sports', name: 'Racer', width: 62, height: 32, speedRange: [250, 330], colors: ['#00E5FF', '#FF1744', '#76FF03'] },
  { id: 'truck', name: 'Cargo Truck', width: 128, height: 36, speedRange: [100, 140], colors: ['#546E7A', '#37474F', '#78909C'] },
  { id: 'ambulance', name: 'Ambulance', width: 84, height: 36, speedRange: [240, 300], colors: ['#FFFFFF'] }
];

/* ============================================================================
 * 2. PROCEDURAL AUDIO SYNTHESIZER
 * ============================================================================ */

class FoxAudioSynthesizer {
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

  playHop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280 + Math.random() * 60, t);
    osc.frequency.exponentialRampToValueAtTime(520, t + 0.08);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  playApple() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [659.25, 880.0, 1174.66];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = t + idx * 0.04;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startT);
      gain.gain.setValueAtTime(0.25, startT);
      gain.gain.exponentialRampToValueAtTime(0.01, startT + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startT);
      osc.stop(startT + 0.09);
    });
  }

  playCoin() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [987.77, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = t + idx * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startT);
      gain.gain.setValueAtTime(0.22, startT);
      gain.gain.exponentialRampToValueAtTime(0.01, startT + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startT);
      osc.stop(startT + 0.12);
    });
  }

  playSplash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.25);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  playCrash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.35);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  playHonk() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, t);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  playEagle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.linearRampToValueAtTime(1400, t + 0.2);
    osc.frequency.linearRampToValueAtTime(600, t + 0.5);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.55);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.55);
  }

  playTrainDing() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, t);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }
}

/* ============================================================================
 * 3. SAVE / PERSISTENCE MANAGER
 * ============================================================================ */

class SaveManager {
  static KEY = 'fox_street_crossing_save_v1';

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
      highScore: 0,
      totalApples: 0,
      coins: 0,
      equippedSkin: 'classic',
      unlockedSkins: ['classic'],
      settings: { isMuted: false }
    };
  }
}

/* ============================================================================
 * 4. PROCEDURAL VECTOR GRAPHICS & CHIBI FOX RENDERER
 * ============================================================================ */

function drawProceduralFox(ctx, x, y, facing, hopProgress, skin, animTime) {
  ctx.save();
  ctx.translate(x, y);

  // Jump arc offset and squash/stretch
  const jumpHeight = Math.sin(hopProgress * Math.PI) * 18;
  const isMidAir = hopProgress > 0 && hopProgress < 1;

  let scaleX = 1.0;
  let scaleY = 1.0;

  if (isMidAir) {
    // Stretched in mid-air
    scaleX = 0.88;
    scaleY = 1.18;
  } else if (hopProgress === 0) {
    // Gentle breathing idle
    scaleY = 1.0 + Math.sin(animTime * 6) * 0.03;
  }

  // 1. Soft Ground Drop Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  const shadowScale = isMidAir ? 0.7 : 1.0;
  ctx.ellipse(0, 8, 14 * shadowScale, 7 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Apply vertical jump lift
  ctx.translate(0, -jumpHeight);
  ctx.scale(scaleX, scaleY);

  // Orientation rotation
  if (facing === 'LEFT') {
    ctx.scale(-1, 1);
  } else if (facing === 'UP') {
    // Tilted facing away
  } else if (facing === 'DOWN') {
    // Tilted facing forward
  }

  // 2. Large Bushy Fox Tail with Harmonic Spring Sway
  ctx.save();
  const tailSway = Math.sin(animTime * 10 + (isMidAir ? 4 : 0)) * 0.25;
  ctx.translate(-8, 2);
  ctx.rotate(-0.35 + tailSway);

  // Main Orange Tail
  ctx.fillStyle = skin.furColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-14, 2, -18, -12);
  ctx.quadraticCurveTo(-12, -22, -2, -14);
  ctx.quadraticCurveTo(2, -6, 0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#D84315';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Fluffy White Bushy Tail Tip
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(-12, -14);
  ctx.quadraticCurveTo(-18, -12, -16, -20);
  ctx.quadraticCurveTo(-10, -22, -8, -16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 3. Cute Chibi Body
  ctx.fillStyle = skin.furColor;
  ctx.beginPath();
  ctx.roundRect(-12, -12, 24, 20, 9);
  ctx.fill();
  ctx.strokeStyle = '#D84315';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Creamy White Belly Bib
  ctx.fillStyle = skin.bellyColor;
  ctx.beginPath();
  ctx.roundRect(-7, -8, 14, 14, 6);
  ctx.fill();

  // 4. Head & Big Cheeks
  ctx.fillStyle = skin.furColor;
  ctx.beginPath();
  ctx.arc(0, -14, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#D84315';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Fluffy Cheek Tufts
  ctx.fillStyle = skin.bellyColor;
  ctx.beginPath();
  ctx.arc(-7, -11, 4.5, 0, Math.PI * 2);
  ctx.arc(7, -11, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // 5. Pointy Fox Ears with Pink Inner Fluff
  const earTwitch = Math.sin(animTime * 14) * 0.06;

  // Left Ear
  ctx.save();
  ctx.translate(-7, -20);
  ctx.rotate(-0.18 + earTwitch);
  ctx.fillStyle = skin.furColor;
  ctx.beginPath();
  ctx.moveTo(-5, 4);
  ctx.lineTo(0, -10);
  ctx.lineTo(5, 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = skin.earInner;
  ctx.beginPath();
  ctx.moveTo(-3, 3);
  ctx.lineTo(0, -7);
  ctx.lineTo(3, 3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Right Ear
  ctx.save();
  ctx.translate(7, -20);
  ctx.rotate(0.18 - earTwitch);
  ctx.fillStyle = skin.furColor;
  ctx.beginPath();
  ctx.moveTo(-5, 4);
  ctx.lineTo(0, -10);
  ctx.lineTo(5, 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = skin.earInner;
  ctx.beginPath();
  ctx.moveTo(-3, 3);
  ctx.lineTo(0, -7);
  ctx.lineTo(3, 3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 6. Eyes & Catchlights
  if (facing !== 'UP') {
    ctx.fillStyle = skin.eyeColor;
    ctx.beginPath();
    ctx.arc(-4, -14, 2.5, 0, Math.PI * 2);
    ctx.arc(4, -14, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Specular eye catchlights
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-4.6, -14.8, 0.9, 0, Math.PI * 2);
    ctx.arc(3.4, -14.8, 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Cute Black Snout Nose
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.ellipse(0, -10, 2.2, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 7. Skin Accessories
  if (skin.accessory === 'crown') {
    ctx.fillStyle = '#FFD600';
    ctx.beginPath();
    ctx.moveTo(-7, -23);
    ctx.lineTo(-4, -28);
    ctx.lineTo(0, -24);
    ctx.lineTo(4, -28);
    ctx.lineTo(7, -23);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FF8F00';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Ruby Jewel in Crown
    ctx.fillStyle = '#E53935';
    ctx.beginPath();
    ctx.arc(0, -25, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (skin.accessory === 'headband') {
    ctx.fillStyle = '#E53935';
    ctx.fillRect(-9, -19, 18, 3.5);
    // Ribbon knot tail
    ctx.beginPath();
    ctx.moveTo(9, -18);
    ctx.lineTo(16, -15);
    ctx.lineTo(14, -22);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawCartoonVehicle(ctx, vehicle, animTime) {
  const { x, y, width, height, color, type, speed } = vehicle;
  const isMovingRight = speed > 0;

  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  if (!isMovingRight) ctx.scale(-1, 1);

  // Ground drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  ctx.beginPath();
  ctx.roundRect(-width / 2 + 2, -height / 2 + 6, width - 4, height, 8);
  ctx.fill();

  // Wheels
  ctx.fillStyle = '#212121';
  ctx.beginPath();
  ctx.roundRect(-width / 2 + 8, -height / 2 - 2, 14, 5, 2);
  ctx.roundRect(width / 2 - 22, -height / 2 - 2, 14, 5, 2);
  ctx.roundRect(-width / 2 + 8, height / 2 - 3, 14, 5, 2);
  ctx.roundRect(width / 2 - 22, height / 2 - 3, 14, 5, 2);
  ctx.fill();

  // Car Main Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(-width / 2, -height / 2, width, height, 7);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Windshield & Windows
  ctx.fillStyle = '#80DEEA';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 26, -height / 2 + 4, 12, height - 8, 3); // Front windshield
  ctx.roundRect(-width / 2 + 10, -height / 2 + 5, 14, height - 10, 2); // Rear window
  ctx.fill();

  // Headlights
  ctx.fillStyle = '#FFF9C4';
  ctx.beginPath();
  ctx.arc(width / 2 - 2, -height / 2 + 6, 3, 0, Math.PI * 2);
  ctx.arc(width / 2 - 2, height / 2 - 6, 3, 0, Math.PI * 2);
  ctx.fill();

  // Tail lights
  ctx.fillStyle = '#E53935';
  ctx.fillRect(-width / 2 + 1, -height / 2 + 4, 3, 5);
  ctx.fillRect(-width / 2 + 1, height / 2 - 9, 3, 5);

  // Taxi Sign / Siren Lightbar
  if (type === 'taxi') {
    ctx.fillStyle = '#212121';
    ctx.fillRect(-4, -height / 2 - 4, 14, 5);
    ctx.fillStyle = '#FFD600';
    ctx.fillRect(-2, -height / 2 - 3, 10, 3);
  } else if (type === 'ambulance') {
    const flash = Math.floor(animTime * 12) % 2 === 0;
    ctx.fillStyle = flash ? '#E53935' : '#1E88E5';
    ctx.beginPath();
    ctx.arc(0, -height / 2 - 2, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawFloatingLog(ctx, log, animTime) {
  const { x, y, width, height } = log;
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);

  // Water ripple shadow
  ctx.fillStyle = 'rgba(1, 87, 155, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 4, width / 2 + 4, height / 2 + 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3D Wooden Log Cylinder
  ctx.fillStyle = '#6D4C41';
  ctx.beginPath();
  ctx.roundRect(-width / 2, -height / 2, width, height, 8);
  ctx.fill();
  ctx.strokeStyle = '#3E2723';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Wood Grain Bark Streaks
  ctx.strokeStyle = '#8D6E63';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-width / 2 + 14, -4);
  ctx.lineTo(width / 2 - 14, -4);
  ctx.moveTo(-width / 2 + 20, 4);
  ctx.lineTo(width / 2 - 20, 4);
  ctx.stroke();

  // Cut log end ring
  ctx.fillStyle = '#D7CCC8';
  ctx.beginPath();
  ctx.ellipse(width / 2 - 5, 0, 3, height / 2 - 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5D4037';
  ctx.stroke();

  ctx.restore();
}

function drawLilyPad(ctx, pad, animTime) {
  const { x, y, radius } = pad;
  ctx.save();
  ctx.translate(x, y);

  // Floating Water Pad
  ctx.fillStyle = '#2E7D32';
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0.3, Math.PI * 2 - 0.3);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1B5E20';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Pink Waterlily Flower
  ctx.fillStyle = '#F48FB1';
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
    ctx.beginPath();
    ctx.arc(Math.cos(a) * 4, Math.sin(a) * 4, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#FFF59D';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCollectibleItem(ctx, item, animTime) {
  const { x, y, type } = item;
  const bob = Math.sin(animTime * 6 + x) * 3;

  ctx.save();
  ctx.translate(x, y + bob);

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, 10 - bob, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  if (type === 'apple') {
    // Crisp Red Apple
    ctx.fillStyle = '#E53935';
    ctx.beginPath();
    ctx.arc(-3, -2, 7, 0, Math.PI * 2);
    ctx.arc(3, -2, 7, 0, Math.PI * 2);
    ctx.fill();

    // Stem & Green Leaf
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(-1, -11, 2, 5);
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.ellipse(3, -10, 4, 2, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Shine
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-3, -5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'berry') {
    // Golden Starberry
    ctx.fillStyle = '#FFD600';
    ctx.beginPath();
    ctx.arc(0, -3, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFAB00';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Sparkle halo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(0, -3, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'coin') {
    // Shiny Gold Coin
    ctx.fillStyle = '#FFD600';
    ctx.beginPath();
    ctx.arc(0, -2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FF8F00';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#FFF59D';
    ctx.font = 'bold 10px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, -2);
  }

  ctx.restore();
}

function drawEaglePredator(ctx, eagleX, eagleY, animTime) {
  ctx.save();
  ctx.translate(eagleX, eagleY);

  // Large Eagle Silhouette Shadow
  const wingSpan = Math.sin(animTime * 14) * 12;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 26, 0, 0, Math.PI * 2);
  // Wings
  ctx.moveTo(0, -6);
  ctx.quadraticCurveTo(-38 + wingSpan, -22, -65, -8);
  ctx.quadraticCurveTo(-30, 14, 0, 8);
  ctx.quadraticCurveTo(30, 14, 65, -8);
  ctx.quadraticCurveTo(38 - wingSpan, -22, 0, -6);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/* ============================================================================
 * 5. MAIN GAME APPLICATION CLASS
 * ============================================================================ */

export class FoxStreetCrossingGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new CanvasRenderer(this.canvas, CONFIG.VIRTUAL_W, CONFIG.VIRTUAL_H);
    this.camera = new Camera2D(CONFIG.VIRTUAL_W, CONFIG.VIRTUAL_H, CONFIG.VIRTUAL_W, 100000);
    this.audio = new FoxAudioSynthesizer();
    this.playgama = new PlaygamaBridge();
    this.particles = new ParticleSystem(350);
    this.juice = new JuiceEffects();

    this.saveData = SaveManager.getDefault();
    this.state = 'TITLE';
    this.animTime = 0;

    // Player Grid State
    this.player = {
      col: 4,               // Current column (0..9)
      row: 0,               // Current row (0 is start, increases upwards)
      x: 4 * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
      y: 0,
      targetX: 4 * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
      targetY: 0,
      facing: 'UP',         // UP, DOWN, LEFT, RIGHT
      isHopping: false,
      hopProgress: 0,
      ridingLog: null,
      idleTimer: 0,
      dead: false
    };

    this.score = 0;
    this.applesCollected = 0;
    this.coinsEarned = 0;
    this.farthestRow = 0;
    this.lanes = new Map();  // row -> Lane Object
    this.highestGeneratedRow = 0;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.eagle = { active: false, x: 0, y: 0, diveProgress: 0 };

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);

    if (typeof window !== 'undefined') {
      window.__gameInstance = this;
      window.__foxGameInstance = this;
    }
  }

  async init() {
    await this.playgama.init();
    this.saveData = await SaveManager.load(this.playgama);

    const audioEnabled = this.playgama.isAudioEnabled();
    this.audio.setMuted(!audioEnabled || (this.saveData.settings?.isMuted));

    this.setupDOM();
    this.setupControls();
    this.resetGame();

    this.playgama.sendGameReady();

    this.loop = new GameLoop(this.update, this.render, 1 / 60, 0.1);
    this.loop.start();
  }

  resetGame() {
    this.score = 0;
    this.applesCollected = 0;
    this.coinsEarned = 0;
    this.farthestRow = 0;
    this.highestGeneratedRow = 0;
    this.lanes.clear();

    this.player.col = 4;
    this.player.row = 0;
    this.player.x = 4 * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    this.player.y = 0;
    this.player.targetX = this.player.x;
    this.player.targetY = 0;
    this.player.facing = 'UP';
    this.player.isHopping = false;
    this.player.hopProgress = 0;
    this.player.ridingLog = null;
    this.player.idleTimer = 0;
    this.player.dead = false;
    this.eagle.active = false;

    // Generate initial 25 safe lanes & roads
    for (let r = -4; r <= 30; r++) {
      this.generateLane(r);
    }

    this.camera.y = this.player.y - CONFIG.VIRTUAL_H * 0.65;
    this.updateHUD();
  }

  generateLane(row) {
    if (this.lanes.has(row)) return this.lanes.get(row);

    let type = 'GRASS';
    let biome = 'meadow';

    if (row > 200) biome = 'cyber';
    else if (row > 120) biome = 'snow';
    else if (row > 50) biome = 'autumn';

    if (row <= 2) {
      // Safe Starting Meadow
      type = 'GRASS';
    } else {
      // Procedural Lane Distribution
      const patternSeed = Math.abs(Math.sin(row * 12.9898)) * 100;
      const mod = Math.floor(patternSeed) % 10;

      if (mod < 3) {
        type = 'GRASS';
      } else if (mod < 7) {
        type = 'ROAD';
      } else if (mod < 9) {
        type = 'RIVER';
      } else {
        type = 'RAILROAD';
      }
    }

    const lane = {
      row,
      type,
      biome,
      y: -row * CONFIG.TILE_SIZE,
      vehicles: [],
      logs: [],
      items: [],
      obstacles: [],
      train: null,
      trainWarning: 0,
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: 120 + Math.min(200, row * 1.5)
    };

    // Populate Lane Contents
    if (type === 'GRASS') {
      // Add Trees, Rocks, Apples, Coins
      for (let col = 0; col < CONFIG.GRID_COLS; col++) {
        if (row > 0 && Math.random() < 0.15) {
          lane.obstacles.push({
            col,
            x: col * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
            type: biome === 'snow' ? 'pine_snow' : biome === 'autumn' ? 'tree_autumn' : 'tree_oak'
          });
        } else if (Math.random() < 0.22) {
          const itemType = Math.random() < 0.6 ? 'apple' : Math.random() < 0.85 ? 'coin' : 'berry';
          lane.items.push({
            col,
            x: col * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
            y: lane.y + CONFIG.TILE_SIZE / 2,
            type: itemType,
            collected: false
          });
        }
      }
    } else if (type === 'ROAD') {
      // Assign Vehicle Archetype
      const vType = VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
      const speed = (vType.speedRange[0] + Math.random() * (vType.speedRange[1] - vType.speedRange[0])) * lane.direction;
      const count = Math.random() < 0.5 ? 2 : 3;
      const spacing = CONFIG.VIRTUAL_W / count;

      for (let i = 0; i < count; i++) {
        lane.vehicles.push({
          x: i * spacing + (Math.random() - 0.5) * 40,
          y: lane.y + (CONFIG.TILE_SIZE - vType.height) / 2,
          width: vType.width,
          height: vType.height,
          speed,
          type: vType.id,
          color: vType.colors[Math.floor(Math.random() * vType.colors.length)]
        });
      }
    } else if (type === 'RIVER') {
      // Assign Floating Logs
      const count = Math.random() < 0.5 ? 2 : 3;
      const logWidth = [96, 144, 192][Math.floor(Math.random() * 3)];
      const flowSpeed = (80 + Math.random() * 70) * lane.direction;
      const spacing = (CONFIG.VIRTUAL_W + logWidth) / count;

      for (let i = 0; i < count; i++) {
        lane.logs.push({
          x: i * spacing,
          y: lane.y + (CONFIG.TILE_SIZE - 28) / 2,
          width: logWidth,
          height: 28,
          speed: flowSpeed
        });
      }
    } else if (type === 'RAILROAD') {
      lane.train = null;
      lane.trainWarning = 0;
      lane.trainTimer = 3.0 + Math.random() * 5.0;
    }

    this.lanes.set(row, lane);
    if (row > this.highestGeneratedRow) this.highestGeneratedRow = row;
    return lane;
  }

  setupDOM() {
    document.getElementById('btn-title-play')?.addEventListener('click', () => {
      this.state = 'PLAYING';
      document.getElementById('title-overlay')?.classList.add('hidden');
      this.audio.init();
      this.resetGame();
    });

    document.getElementById('btn-mute')?.addEventListener('click', () => {
      this.audio.setMuted(!this.audio.isMuted);
      const btn = document.getElementById('btn-mute');
      if (btn) btn.textContent = this.audio.isMuted ? '🔇' : '🔊';
    });

    document.getElementById('btn-wardrobe')?.addEventListener('click', () => this.openWardrobeModal());
    document.getElementById('btn-close-wardrobe')?.addEventListener('click', () => {
      document.getElementById('wardrobe-modal')?.classList.add('hidden');
    });

    document.getElementById('btn-restart')?.addEventListener('click', () => {
      document.getElementById('gameover-modal')?.classList.add('hidden');
      this.resetGame();
      this.state = 'PLAYING';
    });

    document.getElementById('btn-airdrop')?.addEventListener('click', () => this.showRewardedCoinGrant());
  }

  setupControls() {
    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (this.state !== 'PLAYING' || this.player.dead) return;
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup' || k === ' ') this.attemptHop(0, 1, 'UP');
      else if (k === 's' || k === 'arrowdown') this.attemptHop(0, -1, 'DOWN');
      else if (k === 'a' || k === 'arrowleft') this.attemptHop(-1, 0, 'LEFT');
      else if (k === 'd' || k === 'arrowright') this.attemptHop(1, 0, 'RIGHT');
    });

    // Touch D-Pad Buttons
    document.getElementById('dpad-up')?.addEventListener('pointerdown', (e) => { e.preventDefault(); this.attemptHop(0, 1, 'UP'); });
    document.getElementById('dpad-down')?.addEventListener('pointerdown', (e) => { e.preventDefault(); this.attemptHop(0, -1, 'DOWN'); });
    document.getElementById('dpad-left')?.addEventListener('pointerdown', (e) => { e.preventDefault(); this.attemptHop(-1, 0, 'LEFT'); });
    document.getElementById('dpad-right')?.addEventListener('pointerdown', (e) => { e.preventDefault(); this.attemptHop(1, 0, 'RIGHT'); });

    // Touch Gestures on Canvas (Swipe & Tap to Hop Forward)
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (this.state !== 'PLAYING' || this.player.dead) return;
      if (e.changedTouches.length > 0) {
        const dx = e.changedTouches[0].clientX - this.touchStartX;
        const dy = e.changedTouches[0].clientY - this.touchStartY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (absX < 15 && absY < 15) {
          // Quick Tap -> Hop Forward
          this.attemptHop(0, 1, 'UP');
        } else if (absX > absY) {
          // Horizontal Swipe
          if (dx > 30) this.attemptHop(1, 0, 'RIGHT');
          else if (dx < -30) this.attemptHop(-1, 0, 'LEFT');
        } else {
          // Vertical Swipe
          if (dy < -30) this.attemptHop(0, 1, 'UP');
          else if (dy > 30) this.attemptHop(0, -1, 'DOWN');
        }
      }
    }, { passive: true });
  }

  attemptHop(dCol, dRow, facing) {
    const p = this.player;
    if (p.isHopping || p.dead) return;

    const nextCol = p.col + dCol;
    const nextRow = p.row + dRow;

    // Screen bounds clamp
    if (nextCol < 0 || nextCol >= CONFIG.GRID_COLS) return;
    if (nextRow < -2) return;

    // Check tree obstacles on target lane
    const targetLane = this.generateLane(nextRow);
    if (targetLane && targetLane.obstacles) {
      const blocked = targetLane.obstacles.some((o) => o.col === nextCol);
      if (blocked) {
        this.audio.playHop();
        this.juice.screenShake(2);
        return;
      }
    }

    p.facing = facing;
    p.col = nextCol;
    p.row = nextRow;
    p.targetX = nextCol * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    p.targetY = -nextRow * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    p.isHopping = true;
    p.hopProgress = 0;
    p.idleTimer = 0;
    p.ridingLog = null;

    this.audio.playHop();

    // Advance score
    if (nextRow > this.farthestRow) {
      this.farthestRow = nextRow;
      this.score = this.farthestRow;
      if (this.score > (this.saveData.highScore || 0)) {
        this.saveData.highScore = this.score;
        SaveManager.save(this.playgama, this.saveData);
      }
    }

    // Keep generating new lanes ahead
    for (let r = this.highestGeneratedRow + 1; r <= this.player.row + 25; r++) {
      this.generateLane(r);
    }

    this.updateHUD();
  }

  /* ==========================================================================
   * 6. UPDATE SIMULATION
   * ========================================================================== */

  update(dt) {
    this.animTime += dt;
    this.particles.update(dt);
    this.juice.update(dt);

    if (this.state !== 'PLAYING') return;

    const p = this.player;

    if (!p.dead) {
      // 1. Hop Interpolation
      if (p.isHopping) {
        p.hopProgress += dt / CONFIG.HOP_DURATION;
        if (p.hopProgress >= 1) {
          p.hopProgress = 0;
          p.isHopping = false;
          p.x = p.targetX;
          p.y = p.targetY;
          this.particles.burst(p.x, p.y + 10, 6, '#81C784');

          // Check landing on items & hazards
          this.checkLandingHazard();
        } else {
          p.x = MathUtils.lerp(p.x, p.targetX, p.hopProgress);
          p.y = MathUtils.lerp(p.y, p.targetY, p.hopProgress);
        }
      }

      // 2. Log Riding Drift
      if (p.ridingLog && !p.isHopping) {
        p.x += p.ridingLog.speed * dt;
        p.targetX = p.x;

        // Screen boundary drown
        if (p.x < -15 || p.x > CONFIG.VIRTUAL_W + 15) {
          this.killPlayer('Drifted off into the rapids!');
        }
      }

      // 3. Eagle Anti-Camping Timer
      p.idleTimer += dt;
      if (p.idleTimer >= CONFIG.EAGLE_PATIENCE - 1.5 && !this.eagle.active) {
        this.eagle.active = true;
        this.eagle.x = p.x;
        this.eagle.y = p.y - 300;
        this.audio.playEagle();
      }

      if (this.eagle.active) {
        this.eagle.x = MathUtils.lerp(this.eagle.x, p.x, dt * 6);
        this.eagle.y += dt * 450;
        if (this.eagle.y >= p.y - 10) {
          this.killPlayer('Swooped by the hungry eagle!');
        }
      }
    }

    // 4. Update Lanes, Vehicles, Logs, Trains & Collectibles
    this.updateLanes(dt);

    // 5. Camera Smooth Follow (Vertical scroller)
    const targetCamY = p.y - CONFIG.VIRTUAL_H * 0.65;
    this.camera.y = MathUtils.lerp(this.camera.y, targetCamY, dt * 8);
    this.camera.x = 0;
  }

  updateLanes(dt) {
    const minVisibleRow = Math.floor((-this.camera.y - CONFIG.VIRTUAL_H) / CONFIG.TILE_SIZE) - 2;
    const maxVisibleRow = Math.ceil(-this.camera.y / CONFIG.TILE_SIZE) + 4;

    for (let r = minVisibleRow; r <= maxVisibleRow; r++) {
      const lane = this.lanes.get(r);
      if (!lane) continue;

      // Vehicles
      if (lane.vehicles) {
        for (const v of lane.vehicles) {
          v.x += v.speed * dt;
          if (v.speed > 0 && v.x > CONFIG.VIRTUAL_W + 80) v.x = -v.width - 40;
          else if (v.speed < 0 && v.x < -v.width - 80) v.x = CONFIG.VIRTUAL_W + 40;

          // Car collision check with player
          if (!this.player.dead && !this.player.isHopping && this.player.row === lane.row) {
            const px = this.player.x;
            const py = this.player.y;
            if (px > v.x + 8 && px < v.x + v.width - 8 && py > v.y && py < v.y + v.height) {
              this.audio.playHonk();
              this.killPlayer('Hit by oncoming traffic!');
            }
          }
        }
      }

      // River Logs
      if (lane.logs) {
        for (const log of lane.logs) {
          log.x += log.speed * dt;
          if (log.speed > 0 && log.x > CONFIG.VIRTUAL_W + 80) log.x = -log.width - 40;
          else if (log.speed < 0 && log.x < -log.width - 80) log.x = CONFIG.VIRTUAL_W + 40;
        }
      }

      // Collectibles
      if (lane.items) {
        for (const item of lane.items) {
          if (!item.collected && !this.player.dead && this.player.row === lane.row && this.player.col === item.col) {
            item.collected = true;
            if (item.type === 'apple') {
              this.applesCollected++;
              this.saveData.totalApples = (this.saveData.totalApples || 0) + 1;
              this.audio.playApple();
              this.particles.burst(item.x, item.y, 14, '#E53935');
              this.juice.spawnFloatingText('+10 🍎', item.x, item.y - 20, { color: '#FF8A80', size: 18 });
            } else if (item.type === 'berry') {
              this.applesCollected += 5;
              this.audio.playApple();
              this.particles.burst(item.x, item.y, 20, '#FFD600');
              this.juice.spawnFloatingText('+50 ⭐', item.x, item.y - 20, { color: '#FFE082', size: 20 });
            } else if (item.type === 'coin') {
              this.coinsEarned += 5;
              this.saveData.coins = (this.saveData.coins || 0) + 5;
              this.audio.playCoin();
              this.particles.burst(item.x, item.y, 16, '#FFD600');
              this.juice.spawnFloatingText('+5 🪙', item.x, item.y - 20, { color: '#FFF59D', size: 18 });
            }
            this.updateHUD();
            SaveManager.save(this.playgama, this.saveData);
          }
        }
      }

      // Railroad Tracks & Bullet Train
      if (lane.type === 'RAILROAD') {
        lane.trainTimer -= dt;
        if (lane.trainTimer <= 1.2 && lane.trainTimer > 0) {
          lane.trainWarning = Math.floor(this.animTime * 8) % 2;
          if (Math.random() < 0.1) this.audio.playTrainDing();
        } else if (lane.trainTimer <= 0) {
          if (!lane.train) {
            lane.train = {
              x: lane.direction > 0 ? -400 : CONFIG.VIRTUAL_W + 400,
              y: lane.y + 4,
              width: 520,
              height: 40,
              speed: 950 * lane.direction
            };
            this.juice.screenShake(6);
          } else {
            lane.train.x += lane.train.speed * dt;
            // Train collision
            if (!this.player.dead && this.player.row === lane.row) {
              const px = this.player.x;
              if (px > lane.train.x && px < lane.train.x + lane.train.width) {
                this.killPlayer('Hit by the high-speed express train!');
              }
            }

            if ((lane.train.speed > 0 && lane.train.x > CONFIG.VIRTUAL_W + 600) ||
                (lane.train.speed < 0 && lane.train.x < -800)) {
              lane.train = null;
              lane.trainTimer = 4.0 + Math.random() * 6.0;
            }
          }
        }
      }
    }
  }

  checkLandingHazard() {
    const p = this.player;
    const lane = this.lanes.get(p.row);
    if (!lane) return;

    if (lane.type === 'RIVER') {
      // Find if landed on a floating log
      let landedOnLog = null;
      for (const log of lane.logs) {
        if (p.x >= log.x - 4 && p.x <= log.x + log.width + 4) {
          landedOnLog = log;
          break;
        }
      }

      if (landedOnLog) {
        p.ridingLog = landedOnLog;
      } else {
        // Drown in water!
        this.audio.playSplash();
        this.particles.burst(p.x, p.y, 25, '#0288D1');
        this.killPlayer('Fell into the rapid river!');
      }
    }
  }

  killPlayer(reason) {
    if (this.player.dead) return;
    this.player.dead = true;
    this.audio.playCrash();
    this.juice.screenShake(10);
    this.particles.burst(this.player.x, this.player.y, 30, '#FF5252');

    setTimeout(() => {
      this.showGameOverModal(reason);
    }, 450);
  }

  showGameOverModal(reason) {
    document.getElementById('gameover-reason').textContent = reason;
    document.getElementById('go-score').textContent = `${this.score} m`;
    document.getElementById('go-best').textContent = `${this.saveData.highScore || this.score} m`;
    document.getElementById('go-apples').textContent = `${this.applesCollected} 🍎`;
    document.getElementById('go-coins').textContent = `+${this.coinsEarned} 🪙`;

    document.getElementById('gameover-modal')?.classList.remove('hidden');
  }

  openWardrobeModal() {
    const list = document.getElementById('skins-list');
    if (!list) return;
    list.innerHTML = '';

    SKINS.forEach((skin) => {
      const isUnlocked = this.saveData.unlockedSkins?.includes(skin.id);
      const isEquipped = this.saveData.equippedSkin === skin.id;

      const card = document.createElement('div');
      card.className = `skin-card ${isEquipped ? 'equipped' : ''}`;
      card.innerHTML = `
        <div class="skin-info">
          <span class="skin-title">${skin.name}</span>
          <span class="skin-desc">${skin.desc}</span>
        </div>
        <button class="btn-skin ${isEquipped ? 'equipped' : ''}" id="btn-skin-${skin.id}" ${!isUnlocked && (this.saveData.coins || 0) < skin.cost ? 'disabled' : ''}>
          ${isEquipped ? '✓ EQUIPPED' : isUnlocked ? 'EQUIP' : `UNLOCK (${skin.cost} 🪙)`}
        </button>
      `;
      list.appendChild(card);

      card.querySelector(`#btn-skin-${skin.id}`)?.addEventListener('click', () => {
        if (isEquipped) return;
        if (isUnlocked) {
          this.saveData.equippedSkin = skin.id;
          SaveManager.save(this.playgama, this.saveData);
          this.openWardrobeModal();
        } else if ((this.saveData.coins || 0) >= skin.cost) {
          this.saveData.coins -= skin.cost;
          if (!this.saveData.unlockedSkins.includes(skin.id)) {
            this.saveData.unlockedSkins.push(skin.id);
          }
          this.saveData.equippedSkin = skin.id;
          this.audio.playCoin();
          SaveManager.save(this.playgama, this.saveData);
          this.openWardrobeModal();
          this.updateHUD();
        }
      });
    });

    document.getElementById('wardrobe-modal')?.classList.remove('hidden');
  }

  showRewardedCoinGrant() {
    this.playgama.showRewarded((rewarded) => {
      if (rewarded) {
        this.saveData.coins = (this.saveData.coins || 0) + 100;
        this.audio.playCoin();
        this.juice.screenShake(6);
        this.particles.burst(this.player.x, this.player.y, 25, '#FFD600');
        SaveManager.save(this.playgama, this.saveData);
        this.updateHUD();
      }
    });
  }

  updateHUD() {
    const scoreVal = document.getElementById('hud-score-val');
    const appleVal = document.getElementById('hud-apples-val');
    const coinVal = document.getElementById('hud-coins-val');

    if (scoreVal) scoreVal.textContent = `${this.score}m`;
    if (appleVal) appleVal.textContent = `${this.applesCollected}`;
    if (coinVal) coinVal.textContent = `${this.saveData.coins || 0}`;
  }

  /* ==========================================================================
   * 7. 2.5D ISOMETRIC TOP-DOWN RENDERING PIPELINE
   * ========================================================================== */

  render() {
    const ctx = this.renderer.ctx;
    this.renderer.beginFrame(this.camera);

    const minVisibleRow = Math.floor((-this.camera.y - CONFIG.VIRTUAL_H) / CONFIG.TILE_SIZE) - 2;
    const maxVisibleRow = Math.ceil(-this.camera.y / CONFIG.TILE_SIZE) + 4;

    // 1. Draw Lane Backgrounds & Ground Terrain
    for (let r = minVisibleRow; r <= maxVisibleRow; r++) {
      const lane = this.lanes.get(r);
      if (!lane) continue;
      const y = lane.y;

      if (lane.type === 'GRASS') {
        const grassColor = lane.biome === 'snow' ? '#ECEFF1' : lane.biome === 'autumn' ? '#8D6E63' : '#43A047';
        ctx.fillStyle = grassColor;
        ctx.fillRect(0, y, CONFIG.VIRTUAL_W, CONFIG.TILE_SIZE);
        // Soft checkered stripe
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let col = 0; col < CONFIG.GRID_COLS; col += 2) {
          ctx.fillRect(col * CONFIG.TILE_SIZE, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        }
      } else if (lane.type === 'ROAD') {
        // Asphalt
        ctx.fillStyle = '#263238';
        ctx.fillRect(0, y, CONFIG.VIRTUAL_W, CONFIG.TILE_SIZE);
        // White dashed line divider
        ctx.fillStyle = '#ECEFF1';
        for (let x = 10; x < CONFIG.VIRTUAL_W; x += 40) {
          ctx.fillRect(x, y + CONFIG.TILE_SIZE / 2 - 1.5, 20, 3);
        }
      } else if (lane.type === 'RIVER') {
        // Water
        ctx.fillStyle = '#0288D1';
        ctx.fillRect(0, y, CONFIG.VIRTUAL_W, CONFIG.TILE_SIZE);
        // Animated Water Ripples
        ctx.fillStyle = '#4FC3F7';
        const waveShift = (this.animTime * lane.direction * 50) % 60;
        for (let x = -60 + waveShift; x < CONFIG.VIRTUAL_W + 60; x += 45) {
          ctx.fillRect(x, y + 10, 16, 2.5);
          ctx.fillRect(x + 20, y + 28, 14, 2.5);
        }
      } else if (lane.type === 'RAILROAD') {
        // Gravel & Steel Rails
        ctx.fillStyle = '#4E342E';
        ctx.fillRect(0, y, CONFIG.VIRTUAL_W, CONFIG.TILE_SIZE);
        // Wooden Ties
        ctx.fillStyle = '#3E2723';
        for (let x = 4; x < CONFIG.VIRTUAL_W; x += 22) {
          ctx.fillRect(x, y + 6, 10, CONFIG.TILE_SIZE - 12);
        }
        // Steel Rails
        ctx.fillStyle = '#B0BEC5';
        ctx.fillRect(0, y + 12, CONFIG.VIRTUAL_W, 3);
        ctx.fillRect(0, y + CONFIG.TILE_SIZE - 15, CONFIG.VIRTUAL_W, 3);
      }
    }

    // 2. Draw Floating River Logs
    for (let r = minVisibleRow; r <= maxVisibleRow; r++) {
      const lane = this.lanes.get(r);
      if (lane && lane.logs) {
        for (const log of lane.logs) {
          drawFloatingLog(ctx, log, this.animTime);
        }
      }
    }

    // 3. Draw Collectibles & Obstacles
    for (let r = minVisibleRow; r <= maxVisibleRow; r++) {
      const lane = this.lanes.get(r);
      if (!lane) continue;

      if (lane.items) {
        for (const item of lane.items) {
          if (!item.collected) drawCollectibleItem(ctx, item, this.animTime);
        }
      }

      if (lane.obstacles) {
        for (const obs of lane.obstacles) {
          ctx.save();
          ctx.translate(obs.x, lane.y + CONFIG.TILE_SIZE / 2);
          // Tree drop shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.ellipse(0, 8, 16, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Tree Trunk & Volumetric Canopy
          ctx.fillStyle = '#5D4037';
          ctx.fillRect(-5, -24, 10, 24);
          ctx.fillStyle = obs.type === 'pine_snow' ? '#1B5E20' : obs.type === 'tree_autumn' ? '#E65100' : '#2E7D32';
          ctx.beginPath();
          ctx.arc(0, -28, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // 4. Draw Vehicles & Trains
    for (let r = minVisibleRow; r <= maxVisibleRow; r++) {
      const lane = this.lanes.get(r);
      if (!lane) continue;

      if (lane.vehicles) {
        for (const v of lane.vehicles) {
          drawCartoonVehicle(ctx, v, this.animTime);
        }
      }

      if (lane.train) {
        // High-Speed Silver Bullet Train
        const t = lane.train;
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.fillStyle = '#CFD8DC';
        ctx.beginPath();
        ctx.roundRect(0, 0, t.width, t.height, 12);
        ctx.fill();
        ctx.fillStyle = '#E53935';
        ctx.fillRect(0, t.height / 2 - 3, t.width, 6);
        ctx.restore();
      }
    }

    // 5. Draw Player (Chibi Fox)
    if (!this.player.dead) {
      const currentSkin = SKINS.find((s) => s.id === this.saveData.equippedSkin) || SKINS[0];
      drawProceduralFox(
        ctx,
        this.player.x,
        this.player.y,
        this.player.facing,
        this.player.hopProgress,
        currentSkin,
        this.animTime
      );
    }

    // 6. Draw Eagle Predator (if active)
    if (this.eagle.active) {
      drawEaglePredator(ctx, this.eagle.x, this.eagle.y, this.animTime);
    }

    // 7. Render Particles & Screen Juice
    this.particles.render(ctx);
    this.juice.renderWorld(ctx);

    this.renderer.endWorldFrame(this.camera);

    this.juice.renderScreen(ctx, CONFIG.VIRTUAL_W, CONFIG.VIRTUAL_H);
    this.renderer.endFrame();
  }
}

/* ============================================================================
 * 8. BOOTSTRAP ENTRY POINT
 * ============================================================================ */

function bootFoxCrossing() {
  const game = new FoxStreetCrossingGame();
  game.init().catch((err) => console.error('Error starting Fox Street Crossing:', err));
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootFoxCrossing);
  } else {
    bootFoxCrossing();
  }
}
