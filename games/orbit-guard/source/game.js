/**
 * ============================================================================
 * ORBIT GUARD — CIRCULAR ARENA MERGE TOWER DEFENSE + AUTO-BATTLER
 * Celestial Aegis Orbital Defense Station
 * ============================================================================
 */

import {
  GameLoop,
  CanvasRenderer,
  RenderLayers,
  LayeredRenderer,
  InputManager,
  StateMachine,
  EventBus,
  ParticleSystem,
  JuiceEffects,
  ProceduralAudio,
  PlaygamaBridge,
  MathUtils,
  CollisionUtils
} from '../../../engine/index.js';

/* ============================================================================
 * 1. GAME DATA & CONFIGURATION SCHEMAS
 * ============================================================================ */

export const ARENA = {
  width: 450,
  height: 720,
  center: { x: 225, y: 285 },
  coreRadius: 40,
  orbitRadius: 85,
  innerHazardRadius: 115,
  midOrbitRadius: 145,
  spawnRadius: 172,
  slots: [
    { id: 'slot_0', index: 0, angleDeg: 0,   angleRad: 0.0000, x: 310.00, y: 285.00, compass: 'E' },
    { id: 'slot_1', index: 1, angleDeg: 45,  angleRad: 0.7854, x: 285.10, y: 345.10, compass: 'SE' },
    { id: 'slot_2', index: 2, angleDeg: 90,  angleRad: 1.5708, x: 225.00, y: 370.00, compass: 'S' },
    { id: 'slot_3', index: 3, angleDeg: 135, angleRad: 2.3562, x: 164.90, y: 345.10, compass: 'SW' },
    { id: 'slot_4', index: 4, angleDeg: 180, angleRad: 3.1416, x: 140.00, y: 285.00, compass: 'W' },
    { id: 'slot_5', index: 5, angleDeg: 225, angleRad: 3.9270, x: 164.90, y: 224.90, compass: 'NW' },
    { id: 'slot_6', index: 6, angleDeg: 270, angleRad: 4.7124, x: 225.00, y: 200.00, compass: 'N' },
    { id: 'slot_7', index: 7, angleDeg: 315, angleRad: 5.4978, x: 285.10, y: 224.90, compass: 'NE' }
  ],
  bench: [
    { id: 'bench_0', index: 0, x: 65, y: 520 },
    { id: 'bench_1', index: 1, x: 135, y: 520 },
    { id: 'bench_2', index: 2, x: 205, y: 520 },
    { id: 'bench_3', index: 3, x: 275, y: 520 }
  ],
  recycleSlot: { id: 'recycle', x: 378, y: 520, radius: 24, refundPercent: 0.70 },
  portals: [
    { id: 'portal_north', angleDeg: 270, angleRad: 4.7124, x: 225.0, y: 113.0, name: 'North Portal' },
    { id: 'portal_east',  angleDeg: 0,   angleRad: 0.0000, x: 397.0, y: 285.0, name: 'East Portal' },
    { id: 'portal_south', angleDeg: 90,  angleRad: 1.5708, x: 225.0, y: 457.0, name: 'South Portal' },
    { id: 'portal_west',  angleDeg: 180, angleRad: 3.1416, x: 53.0,  y: 285.0, name: 'West Portal' }
  ]
};

export const TIERS = [
  { tier: 1, badge: '★',   border: '#D97706', glow: 'rgba(217, 119, 6, 0.40)',   dpsMult: 1.00, rangeBonus: 0,  label: 'T1 Bronze' },
  { tier: 2, badge: '★★',  border: '#E2E8F0', glow: 'rgba(226, 232, 240, 0.45)', dpsMult: 2.25, rangeBonus: 15, label: 'T2 Silver' },
  { tier: 3, badge: '★★★', border: '#F59E0B', glow: 'rgba(245, 158, 11, 0.60)',  dpsMult: 5.10, rangeBonus: 30, label: 'T3 Gold' },
  { tier: 4, badge: '◆',   border: '#10B981', glow: 'rgba(16, 185, 129, 0.70)',  dpsMult: 11.5, rangeBonus: 45, label: 'T4 Emerald' },
  { tier: 5, badge: '❖',   border: '#A855F7', glow: 'rgba(168, 85, 247, 0.80)',  dpsMult: 26.0, rangeBonus: 60, label: 'T5 Void' },
  { tier: 6, badge: '👑',  border: '#00F5D4', glow: 'rgba(0, 245, 212, 0.95)',   dpsMult: 60.0, rangeBonus: 80, label: 'T6 Celestial' }
];

export const ARCHETYPES = {
  ballista_archer: {
    id: 'ballista_archer',
    name: 'Ballista Archer',
    role: 'Solar Sniper',
    color: '#F59E0B',
    baseRange: 240,
    baseDamage: 18,
    baseRate: 1.6,
    splashRadius: 0,
    heuristic: 'furthest_along_orbit',
    tiers: [
      { tier: 1, damage: 18, rate: 1.6, range: 240, pierce: 0 },
      { tier: 2, damage: 36, rate: 1.8, range: 255, pierce: 0 },
      { tier: 3, damage: 70, rate: 2.1, range: 270, pierce: 1 },
      { tier: 4, damage: 138, rate: 2.4, range: 285, pierce: 2 },
      { tier: 5, damage: 288, rate: 2.6, range: 300, pierce: 3 },
      { tier: 6, damage: 576, rate: 3.0, range: 320, pierce: 99 }
    ]
  },
  heavy_cannon: {
    id: 'heavy_cannon',
    name: 'Heavy Cannon',
    role: 'Crimson Plasma Mortar',
    color: '#EF4444',
    baseRange: 200,
    baseDamage: 45,
    baseRate: 0.6,
    splashRadius: 65,
    heuristic: 'densest_enemy_cluster',
    tiers: [
      { tier: 1, damage: 45, rate: 0.60, range: 200, splash: 65 },
      { tier: 2, damage: 95, rate: 0.64, range: 215, splash: 75 },
      { tier: 3, damage: 200, rate: 0.68, range: 230, splash: 85, burnDPS: 0.20 },
      { tier: 4, damage: 414, rate: 0.75, range: 245, splash: 95, burnDPS: 0.40, burnSlow: 0.20 },
      { tier: 5, damage: 877, rate: 0.80, range: 260, splash: 110, clusterBombs: 3 },
      { tier: 6, damage: 1800, rate: 0.90, range: 280, splash: 130, clusterBombs: 6 }
    ]
  },
  arcane_mage: {
    id: 'arcane_mage',
    name: 'Arcane Mage',
    role: 'Arcane Tesla Caster',
    color: '#A855F7',
    baseRange: 170,
    baseDamage: 22,
    baseRate: 1.1,
    splashRadius: 0,
    heuristic: 'highest_hp_in_range',
    tiers: [
      { tier: 1, damage: 22, rate: 1.10, range: 170, chains: 3 },
      { tier: 2, damage: 45, rate: 1.21, range: 185, chains: 4 },
      { tier: 3, damage: 95, rate: 1.30, range: 200, chains: 5, microStun: 0.25 },
      { tier: 4, damage: 192, rate: 1.45, range: 215, chains: 6 },
      { tier: 5, damage: 393, rate: 1.60, range: 230, chains: 8, staticBurst: true },
      { tier: 6, damage: 806, rate: 1.80, range: 250, chains: 12, staticBurst: true }
    ]
  },
  frost_warden: {
    id: 'frost_warden',
    name: 'Frost Warden',
    role: 'Glacial Cryo Emitter',
    color: '#06B6D4',
    baseRange: 140,
    baseDamage: 8,
    baseRate: 1.0,
    splashRadius: 140,
    heuristic: 'omnidirectional_aura',
    tiers: [
      { tier: 1, damage: 8, rate: 1.0, range: 140, slow: 0.35 },
      { tier: 2, damage: 18, rate: 1.0, range: 155, slow: 0.42 },
      { tier: 3, damage: 40, rate: 1.0, range: 170, slow: 0.50, lingerSlow: 2.0 },
      { tier: 4, damage: 92, rate: 1.0, range: 185, slow: 0.58, brittle: 0.25 },
      { tier: 5, damage: 208, rate: 1.0, range: 200, slow: 0.65, freezeWaveInterval: 8.0 },
      { tier: 6, damage: 480, rate: 1.0, range: 220, slow: 0.75, freezeWaveInterval: 5.0 }
    ]
  },
  shadow_assassin: {
    id: 'shadow_assassin',
    name: 'Shadow Assassin',
    role: 'Jade Critical Shredder',
    color: '#10B981',
    baseRange: 100,
    baseDamage: 32,
    baseRate: 2.2,
    splashRadius: 0,
    heuristic: 'closest_inner_perimeter',
    tiers: [
      { tier: 1, damage: 32, rate: 2.2, range: 100, critChance: 0.25, critMult: 3.0 },
      { tier: 2, damage: 66, rate: 2.4, range: 115, critChance: 0.30, critMult: 3.2 },
      { tier: 3, damage: 138, rate: 2.6, range: 130, critChance: 0.35, critMult: 3.5, armorShred: 0.50 },
      { tier: 4, damage: 289, rate: 2.8, range: 145, critChance: 0.45, critMult: 4.0, twinStrike: true },
      { tier: 5, damage: 610, rate: 3.0, range: 160, critChance: 0.55, critMult: 4.5, executeThreshold: 0.15 },
      { tier: 6, damage: 1280, rate: 3.3, range: 180, critChance: 0.70, critMult: 5.0, voidVortex: true }
    ]
  }
};

export const ENEMY_TYPES = {
  void_crawler:   { id: 'void_crawler',   name: 'Void Crawler',   baseHp: 40,   speedDeg: 22, armor: 0.00, coreDmg: 10, gold: 3,   radius: 12, color: '#76FF03' },
  swift_dart:     { id: 'swift_dart',     name: 'Swift Dart',     baseHp: 22,   speedDeg: 48, armor: 0.00, coreDmg: 8,  gold: 4,   radius: 10, color: '#FFD600' },
  armored_bruiser:{ id: 'armored_bruiser',name: 'Armored Bruiser',baseHp: 160,  speedDeg: 12, armor: 0.40, coreDmg: 25, gold: 10,  radius: 18, color: '#D50000' },
  swarm_pod:      { id: 'swarm_pod',      name: 'Swarm Pod',      baseHp: 75,   speedDeg: 18, armor: 0.00, coreDmg: 15, gold: 8,   radius: 16, color: '#AA00FF', splitCount: 5 },
  void_mite:      { id: 'void_mite',      name: 'Void Mite',      baseHp: 12,   speedDeg: 36, armor: 0.00, coreDmg: 3,  gold: 1,   radius: 6,  color: '#00E676' },
  void_slinger:   { id: 'void_slinger',   name: 'Void Slinger',   baseHp: 90,   speedDeg: 15, armor: 0.10, coreDmg: 20, gold: 12,  radius: 14, color: '#00B0FF', shootCooldown: 6.0 },
  iron_colossus:  { id: 'iron_colossus',  name: 'Iron Colossus',  baseHp: 1500, speedDeg: 10, armor: 0.20, coreDmg: 35, gold: 50,  radius: 30, color: '#EF4444' },
  hydra_queen:    { id: 'hydra_queen',    name: 'Hydra Queen',    baseHp: 3500, speedDeg: 12, armor: 0.00, coreDmg: 40, gold: 80,  radius: 32, color: '#10B981' },
  chrono_wraith:  { id: 'chrono_wraith',  name: 'Chrono Wraith',  baseHp: 8000, speedDeg: 14, armor: 0.00, coreDmg: 50, gold: 120, radius: 34, color: '#A855F7' }
};

export const WORKSHOP_DEFS = [
  { id: 'nexus_hull',         name: 'Nexus Hull Integrity', baseCost: 80,  costScale: 1.45, maxLevel: 10, effect: 20,   stat: 'maxHp',       unit: ' HP' },
  { id: 'rapid_overclock',    name: 'Rapid Overclock',      baseCost: 120, costScale: 1.55, maxLevel: 10, effect: 0.04, stat: 'attackSpeed', unit: '% SPD' },
  { id: 'starting_treasury',  name: 'Starting Treasury',    baseCost: 60,  costScale: 1.35, maxLevel: 10, effect: 15,   stat: 'startGold',   unit: ' Gold' },
  { id: 'hyper_crit',         name: 'Hyper-Critical Focus', baseCost: 150, costScale: 1.65, maxLevel: 8,  effect: 0.03, stat: 'critChance',  unit: '% Crit' },
  { id: 'salvage_efficiency', name: 'Salvage Efficiency',   baseCost: 100, costScale: 1.50, maxLevel: 5,  effect: 0.05, stat: 'goldBonus',   unit: '% Gold' }
];

/* ============================================================================
 * 2. PROCEDURAL WEB AUDIO SYNTHESIZER
 * ============================================================================ */

export class OrbitAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('AudioContext init blocked or unsupported:', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
  }

  playSummonPop() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.12);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  playMergeChime(tier = 2) {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const baseT = this.ctx.currentTime;
    freqs.forEach((f, idx) => {
      const t = baseT + idx * 0.045;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f * (1 + (tier - 1) * 0.08), t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  playLaserPew() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1300, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.08);
    gain.gain.setValueAtTime(0.16, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  playCannonBlast() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.35);
    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  playTeslaCrackle() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.setValueAtTime(360, t + 0.03);
    osc.frequency.setValueAtTime(560, t + 0.07);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  playFrostHum() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.linearRampToValueAtTime(1100, t + 0.12);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  playCritSlash() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.16);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  playPop() {
    if (!this.ctx || this.isMuted) return;
    try {
      this.resume();
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.08);
    } catch (e) {
      console.warn('playPop error:', e);
    }
  }

  playCoreAlarm() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(587.33, t); // D5
    osc.frequency.setValueAtTime(440.00, t + 0.15); // A4
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  playBossRoar() {
    if (!this.ctx || this.isMuted) return;
    try {
      this.resume();
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, t);
      osc.frequency.linearRampToValueAtTime(140, t + 0.35);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.85);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.85);
    } catch (e) {
      console.warn('playBossRoar error:', e);
    }
  }

  playCoinDrop() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    [1046.5, 1318.5].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + i * 0.04);
      gain.gain.setValueAtTime(0.2, t + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.1);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.1);
    });
  }

  playSurgeShockwave() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.25);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.7);
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.7);
  }

  playVictoryFanfare() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const baseT = this.ctx.currentTime;
    notes.forEach((f, i) => {
      const t = baseT + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  }
}

/* ============================================================================
 * 3. PROCEDURAL VECTOR RENDERERS (Canvas 2D)
 * ============================================================================ */

export function drawRoundRect(ctx, x, y, width, height, radius = 4) {
  let r = typeof radius === 'number' ? radius : (Array.isArray(radius) ? radius[0] : 4);
  if (width < 2 * r) r = width / 2;
  if (height < 2 * r) r = height / 2;
  if (typeof ctx.arc === 'function') {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.arc(x + width - r, y + r, r, -Math.PI / 2, 0);
    ctx.lineTo(x + width, y + height - r);
    ctx.arc(x + width - r, y + height - r, r, 0, Math.PI / 2);
    ctx.lineTo(x + r, y + height);
    ctx.arc(x + r, y + height - r, r, Math.PI / 2, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.arc(x + r, y + r, r, Math.PI, -Math.PI / 2);
    ctx.closePath();
  } else {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();
  }
}

export function drawCosmicBackground(ctx, width, height, animTime, stars) {
  // Deep Cosmic Indigo/Charcoal Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#090C16');
  bgGrad.addColorStop(0.5, '#0E1324');
  bgGrad.addColorStop(1, '#131A32');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Distant Nebula Gas Clouds
  ctx.save();
  const neb1 = ctx.createRadialGradient(width * 0.3, height * 0.35, 10, width * 0.3, height * 0.35, 180);
  neb1.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
  neb1.addColorStop(0.6, 'rgba(59, 130, 246, 0.08)');
  neb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = neb1;
  ctx.fillRect(0, 0, width, height);

  const neb2 = ctx.createRadialGradient(width * 0.7, height * 0.55, 10, width * 0.7, height * 0.55, 190);
  neb2.addColorStop(0, 'rgba(0, 229, 255, 0.15)');
  neb2.addColorStop(0.5, 'rgba(16, 185, 129, 0.07)');
  neb2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = neb2;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Twinkling Starfield
  ctx.save();
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const twinkle = 0.4 + Math.sin(animTime * s.speed + s.phase) * 0.4;
    ctx.fillStyle = s.color;
    ctx.globalAlpha = twinkle;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  }
  ctx.restore();
}

export function drawArenaGrid(ctx, xc, yc, animTime) {
  ctx.save();

  // 1. Inward Spiral Guide Track (Visualizes enemy trajectory toward center)
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  for (let t = 0; t <= 1.0; t += 0.01) {
    const r = ARENA.spawnRadius - (ARENA.spawnRadius - ARENA.coreRadius) * t;
    const a = t * Math.PI * 3.0; // 540 degrees
    const px = xc + Math.cos(a) * r;
    const py = yc + Math.sin(a) * r;
    if (t === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();

  // 2. Outer Spawn Orbit Ring
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.24)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(xc, yc, ARENA.spawnRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Mid Combat Orbit Ring
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(xc, yc, ARENA.midOrbitRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 4. Inner Core Danger Perimeter (Breach Warning Zone)
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(xc, yc, ARENA.coreRadius + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Soft Danger Warning Glow around Core
  const dangerGrad = ctx.createRadialGradient(xc, yc, ARENA.coreRadius - 5, xc, yc, ARENA.coreRadius + 16);
  dangerGrad.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
  dangerGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = dangerGrad;
  ctx.beginPath();
  ctx.arc(xc, yc, ARENA.coreRadius + 16, 0, Math.PI * 2);
  ctx.fill();

  // 5. Inner Defense Ring (8 Turrets Placement Orbit)
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.38)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(xc, yc, ARENA.orbitRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 6. Spawn Portals (N, E, S, W) - Sleek Cosmic Singularity Gates
  for (const portal of ARENA.portals) {
    const pulse = 0.5 + Math.sin(animTime * 3 + portal.angleRad) * 0.5;
    
    // Soft outer nebula beacon
    const pGrad = ctx.createRadialGradient(portal.x, portal.y, 2, portal.x, portal.y, 18);
    pGrad.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
    pGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.25)');
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.arc(portal.x, portal.y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Rotating Hologram Ring
    ctx.save();
    ctx.translate(portal.x, portal.y);
    ctx.rotate(animTime * 2.0 + portal.angleRad);
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 0.65);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 9, Math.PI, Math.PI * 1.65);
    ctx.stroke();

    // Core pulsing singularity
    ctx.fillStyle = '#00F5D4';
    ctx.beginPath();
    ctx.arc(0, 0, 3 + pulse * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 7. Standby Bench Rail (Bottom)
  ctx.fillStyle = 'rgba(16, 22, 40, 0.85)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.32)';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, 24, 478, 402, 74, 14);
  ctx.fill();
  ctx.stroke();

  // Bench Header Strip
  ctx.font = 'bold 8.5px Orbitron, sans-serif';
  ctx.fillStyle = 'rgba(0, 229, 255, 0.85)';
  ctx.textAlign = 'left';
  ctx.fillText('STANDBY BENCH', 36, 492);

  ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
  ctx.textAlign = 'right';
  ctx.fillText('RECYCLE 70% ♻️', 414, 492);

  // Subtle separator line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, 496);
  ctx.lineTo(414, 496);
  ctx.stroke();

  ctx.restore();
}

export function drawNexusCore(ctx, x, y, state = {}) {
  const { hpPercent = 1.0, animTime = 0, isDamaged = false, isSurging = false } = state;
  ctx.save();
  ctx.translate(x, y);

  // 1. Ambient Cosmic Glow Halo
  const pulseRadius = 52 + Math.sin(animTime * 3) * 6;
  const coreGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, pulseRadius + 15);
  const glowColor = isDamaged ? 'rgba(239, 68, 68, ' : isSurging ? 'rgba(0, 245, 212, ' : 'rgba(0, 229, 255, ';
  coreGlow.addColorStop(0, glowColor + '0.65)');
  coreGlow.addColorStop(0.5, glowColor + '0.25)');
  coreGlow.addColorStop(1, glowColor + '0)');
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(0, 0, pulseRadius + 15, 0, Math.PI * 2);
  ctx.fill();

  // 2. Outer Rotating Segmented Armor Ring (Counter-Clockwise)
  ctx.save();
  ctx.rotate(-animTime * 0.4);
  const outerSegments = 6;
  ctx.lineWidth = 3.2;
  ctx.strokeStyle = isDamaged ? '#EF4444' : '#1E293B';
  for (let i = 0; i < outerSegments; i++) {
    const startAngle = (i * Math.PI * 2) / outerSegments + 0.12;
    const endAngle = ((i + 1) * Math.PI * 2) / outerSegments - 0.12;
    ctx.beginPath();
    ctx.arc(0, 0, 42, startAngle, endAngle);
    ctx.stroke();

    const midAngle = (startAngle + endAngle) / 2;
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.arc(Math.cos(midAngle) * 42, Math.sin(midAngle) * 42, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Inner Rotating Glyphic Ring (Clockwise)
  ctx.save();
  ctx.rotate(animTime * 0.7);
  const innerSegments = 4;
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = '#00E5FF';
  for (let i = 0; i < innerSegments; i++) {
    const startAngle = (i * Math.PI * 2) / innerSegments + 0.18;
    const endAngle = ((i + 1) * Math.PI * 2) / innerSegments - 0.18;
    ctx.beginPath();
    ctx.arc(0, 0, 30, startAngle, endAngle);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Central Celestial Crystal Generator (Faceted Diamond/Octagon)
  const crystalGrad = ctx.createRadialGradient(-5, -5, 2, 0, 0, 22);
  if (hpPercent > 0.3) {
    crystalGrad.addColorStop(0, '#FFFFFF');
    crystalGrad.addColorStop(0.3, '#00F5D4');
    crystalGrad.addColorStop(0.7, '#00E5FF');
    crystalGrad.addColorStop(1, '#0891B2');
  } else {
    crystalGrad.addColorStop(0, '#FEE2E2');
    crystalGrad.addColorStop(0.4, '#F87171');
    crystalGrad.addColorStop(0.8, '#EF4444');
    crystalGrad.addColorStop(1, '#7F1D1D');
  }

  ctx.fillStyle = crystalGrad;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const points = 8;
  const outerR = 20 + Math.sin(animTime * 5) * 1.5;
  const innerR = outerR * 0.78;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Facet Gleam Highlights
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -outerR);
  ctx.lineTo(0, outerR);
  ctx.moveTo(-outerR, 0);
  ctx.lineTo(outerR, 0);
  ctx.stroke();

  // 5. HP Arc Indicator Ring
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.beginPath();
  ctx.arc(0, 0, 46, 0, Math.PI * 2);
  ctx.stroke();

  const hpArcLength = Math.PI * 2 * Math.max(0, Math.min(1, hpPercent));
  ctx.strokeStyle = hpPercent > 0.5 ? '#10B981' : hpPercent > 0.25 ? '#F59E0B' : '#EF4444';
  ctx.beginPath();
  ctx.arc(0, 0, 46, -Math.PI / 2, -Math.PI / 2 + hpArcLength);
  ctx.stroke();

  ctx.restore();
}

export function drawSlotPad(ctx, slot, isOccupied = false, isHighlighted = false, isHovered = false) {
  ctx.save();
  ctx.translate(slot.x, slot.y);

  if (slot.id === 'recycle') {
    // Recycle Bin Pad
    ctx.fillStyle = isHovered ? 'rgba(239, 68, 68, 0.45)' : 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = isHovered ? '#FF5252' : 'rgba(239, 68, 68, 0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, slot.radius || 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = '15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♻️', 0, 0);
    ctx.restore();
    return;
  }

  // Regular Slot Pad
  if (isHighlighted || isHovered) {
    const glowR = 26 + Math.sin(Date.now() * 0.008) * 3;
    const glow = ctx.createRadialGradient(0, 0, 8, 0, 0, glowR);
    glow.addColorStop(0, isHovered ? 'rgba(0, 245, 212, 0.7)' : 'rgba(255, 209, 102, 0.5)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, glowR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = isOccupied ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.5)';
  ctx.strokeStyle = isHovered ? '#00F5D4' : isHighlighted ? '#FFD166' : 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = isHovered ? 2.5 : 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (!isOccupied) {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}

export function drawSentinelPlatform(ctx, x, y, tier = 1, isSelected = false, isMergeTarget = false) {
  const tierInfo = TIERS[Math.min(tier - 1, 5)];
  ctx.save();
  ctx.translate(x, y);

  if (isSelected || isMergeTarget) {
    const glowR = 28 + Math.sin(Date.now() * 0.008) * 3;
    const selectGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, glowR);
    selectGlow.addColorStop(0, isMergeTarget ? 'rgba(255, 209, 102, 0.65)' : 'rgba(0, 229, 255, 0.65)');
    selectGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = selectGlow;
    ctx.beginPath();
    ctx.arc(0, 0, glowR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = tierInfo.glow;
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawTierBadge(ctx, x, y, tier = 1) {
  const tierInfo = TIERS[Math.min(tier - 1, 5)];
  ctx.save();
  ctx.translate(x, y + 16);

  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 1.2;
  drawRoundRect(ctx, -14, -6, 28, 12, 6);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = tierInfo.border;
  ctx.fillText(tierInfo.badge, 0, 0);

  ctx.restore();
}

export function drawBallistaArcher(ctx, x, y, state = {}) {
  const { angle = 0, tier = 1, recoil = 0, charging = 0, isSelected = false, isMergeTarget = false, scaleAnim = 1.0 } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scaleAnim, scaleAnim);

  drawSentinelPlatform(ctx, 0, 0, tier, isSelected, isMergeTarget);

  ctx.save();
  ctx.rotate(angle);
  const tierInfo = TIERS[Math.min(tier - 1, 5)];
  const kick = recoil * 5;

  // Angular Sentry Chassis
  ctx.fillStyle = '#1E293B';
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10 - kick, -12);
  ctx.lineTo(6 - kick, -8);
  ctx.lineTo(10 - kick, 0);
  ctx.lineTo(6 - kick, 8);
  ctx.lineTo(-10 - kick, 12);
  ctx.lineTo(-14 - kick, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Dual Rails
  const barrelLength = 16 + Math.min(tier, 5) * 2;
  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.2;
  drawRoundRect(ctx, 0 - kick, -6, barrelLength, 3.5, 1);
  ctx.fill();
  ctx.stroke();
  drawRoundRect(ctx, 0 - kick, 2.5, barrelLength, 3.5, 1);
  ctx.fill();
  ctx.stroke();

  // Cyan Magnetic Acceleration Coils
  const coilCount = 2 + Math.min(tier, 4);
  ctx.fillStyle = tier >= 4 ? '#00E5FF' : '#38BDF8';
  for (let i = 0; i < coilCount; i++) {
    const cx = 4 + i * 4 - kick;
    ctx.fillRect(cx, -7, 2, 14);
  }

  // Power Core Crystal
  const coreGrad = ctx.createRadialGradient(0 - kick, 0, 1, 0 - kick, 0, 5);
  coreGrad.addColorStop(0, '#FFFFFF');
  coreGrad.addColorStop(0.5, tier >= 4 ? '#00F5D4' : '#00E5FF');
  coreGrad.addColorStop(1, '#0284C7');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(0 - kick, 0, 4, 0, Math.PI * 2);
  ctx.fill();

  // Laser Sight Beam
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(barrelLength - kick, 0);
  ctx.lineTo(barrelLength + 80, 0);
  ctx.stroke();
  ctx.setLineDash([]);

  // Recoil Flash
  if (recoil > 0.1) {
    ctx.fillStyle = '#00F5D4';
    ctx.beginPath();
    ctx.arc(barrelLength - kick + 2, 0, 3 + recoil * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  drawTierBadge(ctx, 0, 0, tier);
  ctx.restore();
}

export function drawHeavyCannon(ctx, x, y, state = {}) {
  const { angle = 0, tier = 1, recoil = 0, animTime = 0, isSelected = false, isMergeTarget = false, scaleAnim = 1.0 } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scaleAnim, scaleAnim);

  drawSentinelPlatform(ctx, 0, 0, tier, isSelected, isMergeTarget);

  ctx.save();
  ctx.rotate(angle);
  const tierInfo = TIERS[Math.min(tier - 1, 5)];
  const kick = recoil * 7;

  // Armored Chassis
  ctx.fillStyle = '#1E293B';
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 2.2;
  drawRoundRect(ctx, -12 - kick, -14, 22, 28, 4);
  ctx.fill();
  ctx.stroke();

  // Cylindrical Mortar Barrel
  const barrelLen = 14 + Math.min(tier, 5) * 2;
  const barrelRadius = 6 + Math.min(tier, 4) * 0.8;
  const barrelGrad = ctx.createLinearGradient(0, -barrelRadius, 0, barrelRadius);
  barrelGrad.addColorStop(0, '#64748B');
  barrelGrad.addColorStop(0.5, '#1E293B');
  barrelGrad.addColorStop(1, '#0F172A');
  ctx.fillStyle = barrelGrad;
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.8;
  drawRoundRect(ctx, -2 - kick, -barrelRadius, barrelLen, barrelRadius * 2, 4);
  ctx.fill();
  ctx.stroke();

  // Magma Core
  const heatPulse = 0.7 + Math.sin(animTime * 6) * 0.3;
  const magmaGrad = ctx.createRadialGradient(-3 - kick, 0, 1, -3 - kick, 0, 7);
  magmaGrad.addColorStop(0, '#FFFBEB');
  magmaGrad.addColorStop(0.3, '#FFD166');
  magmaGrad.addColorStop(0.7, `rgba(234, 88, 12, ${heatPulse})`);
  magmaGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
  ctx.fillStyle = magmaGrad;
  ctx.beginPath();
  ctx.arc(-3 - kick, 0, 6.5, 0, Math.PI * 2);
  ctx.fill();

  if (recoil > 0.1) {
    ctx.fillStyle = '#FF9E00';
    ctx.beginPath();
    ctx.arc(barrelLen + 4 - kick, 0, 5 + recoil * 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  drawTierBadge(ctx, 0, 0, tier);
  ctx.restore();
}

export function drawArcaneMage(ctx, x, y, state = {}) {
  const { angle = 0, tier = 1, animTime = 0, isFiring = false, isSelected = false, isMergeTarget = false, scaleAnim = 1.0 } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scaleAnim, scaleAnim);

  drawSentinelPlatform(ctx, 0, 0, tier, isSelected, isMergeTarget);

  const tierInfo = TIERS[Math.min(tier - 1, 5)];
  const hoverBob = Math.sin(animTime * 4) * 2;

  // Levitation Emitter Base
  ctx.fillStyle = '#1E1B4B';
  ctx.strokeStyle = '#C084FC';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(0, 6, 14, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Revolving Glyphs
  const shardCount = 2 + Math.min(tier, 4);
  for (let i = 0; i < shardCount; i++) {
    const shardAngle = animTime * 2.5 + (i * Math.PI * 2) / shardCount;
    const sx = Math.cos(shardAngle) * 16;
    const sy = Math.sin(shardAngle) * 8 - 4 + hoverBob;
    ctx.fillStyle = '#E9D5FF';
    ctx.strokeStyle = '#9333EA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx, sy - 4);
    ctx.lineTo(sx + 3, sy);
    ctx.lineTo(sx, sy + 4);
    ctx.lineTo(sx - 3, sy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Floating Obelisk
  ctx.save();
  ctx.translate(0, -6 + hoverBob);
  ctx.rotate(angle * 0.2);
  const obeliskGrad = ctx.createLinearGradient(-7, -16, 7, 16);
  obeliskGrad.addColorStop(0, '#FAF5FF');
  obeliskGrad.addColorStop(0.3, '#C084FC');
  obeliskGrad.addColorStop(0.7, '#7E22CE');
  obeliskGrad.addColorStop(1, '#3B0764');
  ctx.fillStyle = obeliskGrad;
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(8, -2);
  ctx.lineTo(5, 12);
  ctx.lineTo(0, 15);
  ctx.lineTo(-5, 12);
  ctx.lineTo(-8, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  if (isFiring) {
    ctx.strokeStyle = '#F3E8FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo((Math.random() - 0.5) * 12, -22);
    ctx.stroke();
  }
  ctx.restore();

  drawTierBadge(ctx, 0, 0, tier);
  ctx.restore();
}

export function drawFrostWarden(ctx, x, y, state = {}) {
  const { tier = 1, animTime = 0, isSelected = false, isMergeTarget = false, scaleAnim = 1.0 } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scaleAnim, scaleAnim);

  drawSentinelPlatform(ctx, 0, 0, tier, isSelected, isMergeTarget);

  const tierInfo = TIERS[Math.min(tier - 1, 5)];

  // Mist Preview
  const auraPulse = 16 + Math.sin(animTime * 3) * 3;
  const mistGrad = ctx.createRadialGradient(0, 0, 6, 0, 0, auraPulse + 8);
  mistGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
  mistGrad.addColorStop(0.6, 'rgba(125, 211, 252, 0.18)');
  mistGrad.addColorStop(1, 'rgba(224, 242, 254, 0)');
  ctx.fillStyle = mistGrad;
  ctx.beginPath();
  ctx.arc(0, 0, auraPulse + 8, 0, Math.PI * 2);
  ctx.fill();

  // Rotating Gyro Ring
  ctx.save();
  ctx.rotate(animTime * 0.8);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const px = Math.cos(angle) * 16;
    const py = Math.sin(angle) * 16;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  // Snowflake Core
  ctx.save();
  ctx.rotate(-animTime * 1.2);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * -12, Math.sin(a) * -12);
    ctx.lineTo(Math.cos(a) * 12, Math.sin(a) * 12);
    ctx.stroke();
  }
  ctx.restore();

  // Center Diamond
  const iceGrad = ctx.createRadialGradient(-3, -3, 1, 0, 0, 9);
  iceGrad.addColorStop(0, '#FFFFFF');
  iceGrad.addColorStop(0.4, '#7DD3FC');
  iceGrad.addColorStop(0.8, '#0284C7');
  iceGrad.addColorStop(1, '#0C4A6E');
  ctx.fillStyle = iceGrad;
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(7, 0);
  ctx.lineTo(0, 9);
  ctx.lineTo(-7, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  drawTierBadge(ctx, 0, 0, tier);
  ctx.restore();
}

export function drawShadowAssassin(ctx, x, y, state = {}) {
  const { angle = 0, tier = 1, animTime = 0, isSlashing = false, isSelected = false, isMergeTarget = false, scaleAnim = 1.0 } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scaleAnim, scaleAnim);

  drawSentinelPlatform(ctx, 0, 0, tier, isSelected, isMergeTarget);

  ctx.save();
  ctx.rotate(angle);
  const tierInfo = TIERS[Math.min(tier - 1, 5)];
  const spinAngle = animTime * 14;

  // Stealth Delta Wing
  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(-6, -11);
  ctx.lineTo(-4, -4);
  ctx.lineTo(-12, -5);
  ctx.lineTo(-10, 0);
  ctx.lineTo(-12, 5);
  ctx.lineTo(-4, 4);
  ctx.lineTo(-6, 11);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Spinning Ruby Chakrams
  for (let side of [-1, 1]) {
    ctx.save();
    ctx.translate(2, side * 11);
    ctx.rotate(spinAngle * side);
    const bladeGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 7);
    bladeGrad.addColorStop(0, '#FFE4E6');
    bladeGrad.addColorStop(0.5, '#F43F5E');
    bladeGrad.addColorStop(1, '#9F1239');
    ctx.fillStyle = bladeGrad;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let p = 0; p < 3; p++) {
      const pa = (p * Math.PI * 2) / 3;
      const ox = Math.cos(pa) * 6.5;
      const oy = Math.sin(pa) * 6.5;
      const ix = Math.cos(pa + Math.PI / 3) * 2.5;
      const iy = Math.sin(pa + Math.PI / 3) * 2.5;
      if (p === 0) ctx.moveTo(ox, oy);
      else ctx.lineTo(ox, oy);
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Red Eye
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.ellipse(4, 0, 4, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  if (isSlashing) {
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 18, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
  }
  ctx.restore();

  drawTierBadge(ctx, 0, 0, tier);
  ctx.restore();
}

export function drawSentinel(ctx, sentinel, animTime, isSelected = false, isMergeTarget = false) {
  const state = {
    angle: sentinel.angle || 0,
    tier: sentinel.tier || 1,
    recoil: sentinel.recoil || 0,
    charging: sentinel.charging || 0,
    animTime: animTime || 0,
    isFiring: sentinel.isFiring || false,
    isSlashing: sentinel.isSlashing || false,
    isSelected,
    isMergeTarget,
    scaleAnim: sentinel.scaleAnim || 1.0
  };

  switch (sentinel.archetype) {
    case 'ballista_archer': drawBallistaArcher(ctx, sentinel.x, sentinel.y, state); break;
    case 'heavy_cannon':    drawHeavyCannon(ctx, sentinel.x, sentinel.y, state); break;
    case 'arcane_mage':     drawArcaneMage(ctx, sentinel.x, sentinel.y, state); break;
    case 'frost_warden':    drawFrostWarden(ctx, sentinel.x, sentinel.y, state); break;
    case 'shadow_assassin': drawShadowAssassin(ctx, sentinel.x, sentinel.y, state); break;
  }
}

/* Void Invaders Renderers */
export function drawVoidCrawler(ctx, x, y, state = {}) {
  const { angle = 0, animTime = 0, isChilled = false } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Scuttling Legs
  ctx.strokeStyle = isChilled ? '#38BDF8' : '#64748B';
  ctx.lineWidth = 1.8;
  const legSpeed = isChilled ? 6 : 14;
  for (let i = 0; i < 3; i++) {
    const sideOffset = (i - 1) * 6;
    const legPhase = Math.sin(animTime * legSpeed + i * 1.8);
    ctx.beginPath();
    ctx.moveTo(-4 + sideOffset, -6);
    ctx.lineTo(-10 + sideOffset, -12 + legPhase * 3);
    ctx.lineTo(-16 + sideOffset, -8 + legPhase * 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-4 + sideOffset, 6);
    ctx.lineTo(-10 + sideOffset, 12 - legPhase * 3);
    ctx.lineTo(-16 + sideOffset, 8 - legPhase * 4);
    ctx.stroke();
  }

  // Carapace
  ctx.fillStyle = '#1E293B';
  ctx.strokeStyle = isChilled ? '#38BDF8' : '#EF4444';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, -10, -8, 20, 16, 6);
  ctx.fill();
  ctx.stroke();

  // Red Eye
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(6, 0, 3.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawSwiftDart(ctx, x, y, state = {}) {
  const { angle = 0, animTime = 0, isChilled = false } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Twin Plasma Trails
  const jetFlicker = 8 + Math.sin(animTime * 25) * 4;
  ctx.fillStyle = isChilled ? 'rgba(56, 189, 248, 0.6)' : 'rgba(0, 245, 212, 0.7)';
  ctx.beginPath();
  ctx.moveTo(-10, -5);
  ctx.lineTo(-10 - jetFlicker, -5);
  ctx.lineTo(-8, -3);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-10, 5);
  ctx.lineTo(-10 - jetFlicker, 5);
  ctx.lineTo(-8, 3);
  ctx.closePath();
  ctx.fill();

  // Body
  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = isChilled ? '#7DD3FC' : '#00E5FF';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(14, 0);
  ctx.lineTo(-8, -13);
  ctx.lineTo(-4, -4);
  ctx.lineTo(-12, 0);
  ctx.lineTo(-4, 4);
  ctx.lineTo(-8, 13);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function drawArmoredBruiser(ctx, x, y, state = {}) {
  const { angle = 0, animTime = 0, isChilled = false } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Armored Shell
  ctx.fillStyle = '#1E293B';
  ctx.strokeStyle = isChilled ? '#38BDF8' : '#F59E0B';
  ctx.lineWidth = 2.4;
  drawRoundRect(ctx, -16, -14, 30, 28, 10);
  ctx.fill();
  ctx.stroke();

  // Weakpoint Core
  const corePulse = 0.6 + Math.sin(animTime * 4) * 0.4;
  ctx.fillStyle = `rgba(220, 38, 38, ${corePulse})`;
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();

  // Ram Horns
  ctx.fillStyle = '#94A3B8';
  ctx.beginPath();
  ctx.moveTo(12, -10);
  ctx.lineTo(20, -14);
  ctx.lineTo(14, -6);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(12, 10);
  ctx.lineTo(20, 14);
  ctx.lineTo(14, 6);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawSwarmPod(ctx, x, y, state = {}) {
  const { angle = 0, animTime = 0, isChilled = false } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const pulse = Math.sin(animTime * 6) * 1.5;
  ctx.fillStyle = '#065F46';
  ctx.strokeStyle = isChilled ? '#7DD3FC' : '#34D399';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 15 + pulse, 12 - pulse * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Embryos
  ctx.fillStyle = '#FDE047';
  for (let [ex, ey] of [[-6, -4], [0, -5], [5, -3], [-3, 3], [4, 4]]) {
    ctx.beginPath();
    ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawVoidMite(ctx, x, y, state = {}) {
  const { angle = 0 } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = '#10B981';
  ctx.strokeStyle = '#022C22';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(2, 0, 1.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawVoidSlinger(ctx, x, y, state = {}) {
  const { angle = 0, chargeProgress = 0, isChilled = false } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Tentacles
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  for (let a of [-0.6, 0.6, Math.PI]) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 16, Math.sin(a) * 16);
    ctx.stroke();
  }

  ctx.fillStyle = '#1E1B4B';
  ctx.strokeStyle = isChilled ? '#38BDF8' : '#A855F7';
  ctx.lineWidth = 2;
  drawRoundRect(ctx, -10, -10, 20, 20, 5);
  ctx.fill();
  ctx.stroke();

  // Charging Ball
  const ballSize = 3 + chargeProgress * 5;
  ctx.fillStyle = '#C084FC';
  ctx.beginPath();
  ctx.arc(4, 0, ballSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawIronColossus(ctx, x, y, state = {}) {
  const { angle = 0, animTime = 0, shieldAngle = 0, shieldActive = true, hpPercent = 1.0 } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Hull
  ctx.fillStyle = '#1E293B';
  ctx.strokeStyle = hpPercent > 0.5 ? '#00E5FF' : '#EF4444';
  ctx.lineWidth = 3;
  drawRoundRect(ctx, -24, -22, 48, 44, 10);
  ctx.fill();
  ctx.stroke();

  // Molten Vents
  const heatFlicker = 0.6 + Math.sin(animTime * 8) * 0.4;
  ctx.fillStyle = `rgba(234, 88, 12, ${heatFlicker})`;
  for (let dy of [-12, -4, 4, 12]) {
    ctx.fillRect(-18, dy, 8, 3);
  }

  // Core
  ctx.fillStyle = '#00E5FF';
  ctx.beginPath();
  ctx.arc(4, 0, 9, 0, Math.PI * 2);
  ctx.fill();

  // Rotating Shield Barrier
  if (shieldActive) {
    ctx.save();
    ctx.rotate(shieldAngle - angle);
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#00F5D4';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 36, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

export function drawHydraQueen(ctx, x, y, state = {}) {
  const { angle = 0, animTime = 0 } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Ovipositor Sac
  ctx.fillStyle = '#064E3B';
  ctx.strokeStyle = '#34D399';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(-18, 0, 24, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Twin Heads
  const s1 = Math.sin(animTime * 3) * 6;
  const s2 = Math.cos(animTime * 3) * 6;
  for (let head of [-1, 1]) {
    const hy = head * 16 + (head === -1 ? s1 : s2);
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-6, head * 8);
    ctx.quadraticCurveTo(8, hy * 0.6, 22, hy);
    ctx.stroke();

    ctx.fillStyle = '#064E3B';
    ctx.beginPath();
    ctx.arc(22, hy, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(24, hy - 2, 2, 0, Math.PI * 2);
    ctx.arc(24, hy + 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawChronoWraith(ctx, x, y, state = {}) {
  const { animTime = 0, isBlinking = false } = state;
  ctx.save();
  ctx.translate(x, y);

  if (!isBlinking) {
    ctx.save();
    ctx.rotate(animTime * 1.8);
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.75)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Shroud
  ctx.fillStyle = '#581C87';
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();

  // Hourglass Core
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(-7, -10);
  ctx.lineTo(7, -10);
  ctx.lineTo(-7, 10);
  ctx.lineTo(7, 10);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawEnemy(ctx, enemy, animTime) {
  const state = {
    angle: enemy.angle || 0,
    animTime,
    hpPercent: Math.max(0, enemy.hp / enemy.maxHp),
    isChilled: enemy.chilledTimer > 0,
    shieldAngle: enemy.shieldAngle || 0,
    shieldActive: enemy.shieldActive !== false,
    chargeProgress: enemy.chargeProgress || 0,
    isBlinking: enemy.isBlinking || false
  };

  switch (enemy.type) {
    case 'void_crawler':    drawVoidCrawler(ctx, enemy.x, enemy.y, state); break;
    case 'swift_dart':      drawSwiftDart(ctx, enemy.x, enemy.y, state); break;
    case 'armored_bruiser': drawArmoredBruiser(ctx, enemy.x, enemy.y, state); break;
    case 'swarm_pod':       drawSwarmPod(ctx, enemy.x, enemy.y, state); break;
    case 'void_mite':       drawVoidMite(ctx, enemy.x, enemy.y, state); break;
    case 'void_slinger':    drawVoidSlinger(ctx, enemy.x, enemy.y, state); break;
    case 'iron_colossus':   drawIronColossus(ctx, enemy.x, enemy.y, state); break;
    case 'hydra_queen':     drawHydraQueen(ctx, enemy.x, enemy.y, state); break;
    case 'chrono_wraith':   drawChronoWraith(ctx, enemy.x, enemy.y, state); break;
    default:
      ctx.fillStyle = enemy.color || '#EF4444';
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.radius || 12, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  // Hit Flash Feedback
  if (enemy.hitFlashTimer > 0) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, (enemy.radius || 12) + 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Enemy Mini Health Bar
  if (enemy.hp < enemy.maxHp) {
    const barW = Math.max(20, (enemy.radius || 12) * 2);
    const hpW = barW * Math.max(0, enemy.hp / enemy.maxHp);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(enemy.x - barW / 2, enemy.y - (enemy.radius || 12) - 8, barW, 4);
    ctx.fillStyle = enemy.isBoss ? '#A855F7' : '#EF4444';
    ctx.fillRect(enemy.x - barW / 2, enemy.y - (enemy.radius || 12) - 8, hpW, 4);
  }
}

/* ============================================================================
 * 4. SAVE & PERSISTENCE MANAGER
 * ============================================================================ */

export class SaveManager {
  static STORAGE_KEY = 'orbit_guard_save_v1';

  static async load(bridge) {
    const searchStr = (typeof window !== 'undefined' && window.location && window.location.search) ? window.location.search : '';
    if (searchStr.includes('reset=1')) {
      return this.getDefaultSave();
    }

    try {
      const data = await bridge.getData(this.STORAGE_KEY);
      if (data && typeof data === 'object') {
        return { ...this.getDefaultSave(), ...data, workshop: { ...this.getDefaultSave().workshop, ...(data.workshop || {}) } };
      }
    } catch (e) {
      console.warn('Save load failed, using default:', e);
    }
    return this.getDefaultSave();
  }

  static async save(bridge, data) {
    const searchStr = (typeof window !== 'undefined' && window.location && window.location.search) ? window.location.search : '';
    if (searchStr.includes('nosave=1')) return;
    try {
      await bridge.setData(this.STORAGE_KEY, data);
    } catch (e) {
      console.warn('Save write failed:', e);
    }
  }

  static getDefaultSave() {
    return {
      version: 1,
      highScore: 0,
      highestWave: 1,
      totalMerges: 0,
      totalKills: 0,
      gold: 30,
      workshop: {
        nexus_hull: 0,
        rapid_overclock: 0,
        starting_treasury: 0,
        hyper_crit: 0,
        salvage_efficiency: 0
      },
      settings: {
        isMuted: false
      }
    };
  }
}

/* ============================================================================
 * 5. MAIN GAME APPLICATION CLASS
 * ============================================================================ */

export class OrbitGuardGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new CanvasRenderer(this.canvas, ARENA.width, ARENA.height);
    this.layeredRenderer = new LayeredRenderer();
    this.input = new InputManager();
    this.audio = new OrbitAudioSynthesizer();
    this.playgama = new PlaygamaBridge();
    this.particles = new ParticleSystem(400);
    this.juice = new JuiceEffects();
    this.events = new EventBus();

    // Query parameters
    const searchStr = (typeof window !== 'undefined' && window.location && window.location.search) ? window.location.search : '';
    const params = new URLSearchParams(searchStr);
    this.isGodMode = params.get('god') === '1';
    this.startWaveParam = parseInt(params.get('wave') || '1', 10);
    this.startGoldParam = params.get('gold') ? parseInt(params.get('gold'), 10) : null;

    // Game State
    this.state = 'TITLE'; // TITLE, PLAYING, PAUSED, WORKSHOP, GAME_OVER
    this.saveData = SaveManager.getDefaultSave();

    this.animTime = 0;
    this.wave = this.startWaveParam;
    this.score = 0;
    this.gold = 30;
    this.summonsCount = 0;
    this.repairsCount = 0;

    // Nexus Core
    this.coreMaxHp = 100;
    this.coreHp = 100;
    this.coreDamagedTimer = 0;

    // Overcharge Surge
    this.surgeCooldownMax = 45.0;
    this.surgeCooldown = 0;
    this.surgeBuffTimer = 0;
    this.activeShockwave = null;

    // Sentinels Board (8 orbit slots + 4 bench slots)
    this.sentinels = new Map(); // key: slotId -> sentinel object

    // Drag-and-drop / Tap interaction
    this.dragState = 'IDLE'; // IDLE, DRAGGING, SNAPPING
    this.draggedSentinel = null;
    this.dragSourceSlot = null;
    this.dragPos = { x: 0, y: 0 };
    this.hoveredSlot = null;
    this.selectedSlot = null; // for tap-to-select fallback

    // Combat Entities & Wave Director
    this.enemies = [];
    this.projectiles = []; // lasers, mortar shells, shockwaves
    this.burningPools = [];
    this.teslaArcs = [];

    this.waveState = 'PRE_WAVE'; // PRE_WAVE, SPAWNING, WAVE_ACTIVE, WAVE_CLEARED
    this.waveTimer = 2.0;
    this.spawnQueue = [];
    this.spawnIntervalTimer = 0;
    this.bossEntity = null;

    // Stars background
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * ARENA.width,
        y: Math.random() * ARENA.height,
        size: Math.random() < 0.2 ? 2 : 1,
        color: Math.random() < 0.3 ? '#00E5FF' : Math.random() < 0.6 ? '#FFD166' : '#FFFFFF',
        speed: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Bindings
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    // State & FSM compatibility
    this.fsm = {
      state: this.state,
      transitionTo: (st) => {
        this.state = st;
        this.fsm.state = st;
      }
    };

    // Speed Multiplier Controller (1x, 2x, 3x)
    this.timeScale = 1.0;
    this.speeds = [1.0, 2.0, 3.0];
    this.speedIndex = 0;
    this._waveBannerTimeout = null;

    // Attach to window for evaluation & testing
    if (typeof window !== 'undefined') {
      window.__orbitGuardInstance = this;
      window.__gameInstance = this;
    }
  }

  cycleSpeed() {
    this.speedIndex = (this.speedIndex + 1) % this.speeds.length;
    this.timeScale = this.speeds[this.speedIndex];
    const btnSpeed = document.getElementById('btn-speed');
    if (btnSpeed) {
      btnSpeed.textContent = `${this.timeScale}x`;
      btnSpeed.classList.remove('speed-2x', 'speed-3x');
      if (this.timeScale === 2.0) btnSpeed.classList.add('speed-2x');
      else if (this.timeScale === 3.0) btnSpeed.classList.add('speed-3x');
    }
    this.audio.playPop();
    this.juice.spawnFloatingText(`${this.timeScale}x SPEED`, ARENA.center.x, ARENA.center.y - 60, { color: '#FFD166' });
  }

  showWaveBanner(title, subtitle = '', durationSec = 2.2) {
    const banner = document.getElementById('wave-banner');
    const bTitle = document.getElementById('wave-banner-title');
    const bSub = document.getElementById('wave-banner-subtitle');
    if (bTitle) bTitle.textContent = title;
    if (bSub) bSub.textContent = subtitle;
    if (banner) {
      banner.classList.remove('hidden');
      clearTimeout(this._waveBannerTimeout);
      this._waveBannerTimeout = setTimeout(() => {
        banner.classList.add('hidden');
      }, durationSec * 1000);
    }
  }

  saveGame() {
    if (!this.saveData) return;
    this.saveData.gold = this.gold || 0;
    this.saveData.highScore = Math.max(this.saveData.highScore || 0, this.score || 0);
    this.saveData.maxWaveReached = Math.max(this.saveData.maxWaveReached || 1, this.wave || 1);
    SaveManager.save(this.playgama, this.saveData);
  }

  saveGameState() {
    this.saveGame();
  }

  async init() {
    await this.playgama.init();
    this.saveData = await SaveManager.load(this.playgama);
    this.audio.setMuted(this.saveData.settings?.isMuted || false);

    this.applyWorkshopStats();
    this.setupDOM();
    this.setupEvents();

    // Notify Playgama platform that game is ready & interactive
    this.playgama.sendGameReady();

    // GameLoop
    this.loop = new GameLoop(this.update, this.render, 1 / 60, 0.1);
    this.loop.start();
  }

  applyWorkshopStats() {
    const ws = this.saveData.workshop || {};
    const hullLvl = ws.nexus_hull || 0;
    this.coreMaxHp = 100 + hullLvl * 20;
    this.coreHp = this.coreMaxHp;

    const treasuryLvl = ws.starting_treasury || 0;
    const baseGold = 30 + treasuryLvl * 15;
    this.gold = this.startGoldParam !== null ? this.startGoldParam : baseGold;
  }

  getWorkshopStat(statName) {
    const ws = this.saveData.workshop || {};
    switch (statName) {
      case 'attackSpeed': return 1.0 + (ws.rapid_overclock || 0) * 0.04;
      case 'critChance':  return (ws.hyper_crit || 0) * 0.03;
      case 'goldBonus':   return 1.0 + (ws.salvage_efficiency || 0) * 0.05;
      default: return 1.0;
    }
  }

  setupDOM() {
    // Mute button
    const btnMute = document.getElementById('btn-mute');
    if (btnMute) {
      btnMute.textContent = this.saveData.settings?.isMuted ? '🔇' : '🔊';
      btnMute.addEventListener('click', () => {
        this.audio.init();
        const nextMuted = !this.audio.isMuted;
        this.audio.setMuted(nextMuted);
        this.playgama.setMuted(nextMuted);
        this.saveData.settings = { ...this.saveData.settings, isMuted: nextMuted };
        btnMute.textContent = nextMuted ? '🔇' : '🔊';
        SaveManager.save(this.playgama, this.saveData);
      });
    }

    // Speed button
    const btnSpeed = document.getElementById('btn-speed');
    if (btnSpeed) {
      btnSpeed.addEventListener('click', () => {
        this.audio.init();
        this.cycleSpeed();
      });
    }

    // Title buttons
    const btnStart = document.getElementById('btn-start-game');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        this.audio.init();
        this.playgama.sendGameReady();
        this.startNewRun();
      });
    }

    const btnOpenWorkshopTitle = document.getElementById('btn-open-workshop-title');
    if (btnOpenWorkshopTitle) {
      btnOpenWorkshopTitle.addEventListener('click', () => this.openWorkshopModal());
    }

    const btnOpenTutorialTitle = document.getElementById('btn-open-tutorial-title');
    if (btnOpenTutorialTitle) {
      btnOpenTutorialTitle.addEventListener('click', () => this.openTutorialModal());
    }

    // In-game HUD buttons
    const btnBuy = document.getElementById('btn-buy');
    if (btnBuy) {
      btnBuy.addEventListener('click', () => this.buySentinel());
    }

    const btnRepair = document.getElementById('btn-repair');
    if (btnRepair) {
      btnRepair.addEventListener('click', () => this.repairCore());
    }

    const btnSurge = document.getElementById('btn-surge');
    if (btnSurge) {
      btnSurge.addEventListener('click', () => this.triggerOverchargeSurge());
    }

    const btnPause = document.getElementById('btn-pause');
    if (btnPause) {
      btnPause.addEventListener('click', () => this.togglePause());
    }

    const btnOpenWorkshopHud = document.getElementById('btn-open-workshop-hud');
    if (btnOpenWorkshopHud) {
      btnOpenWorkshopHud.addEventListener('click', () => this.openWorkshopModal());
    }

    // Modal close buttons
    const btnCloseWorkshop = document.getElementById('btn-close-workshop');
    if (btnCloseWorkshop) {
      btnCloseWorkshop.addEventListener('click', () => this.closeWorkshopModal());
    }

    const btnCloseTutorial = document.getElementById('btn-close-tutorial');
    if (btnCloseTutorial) {
      btnCloseTutorial.addEventListener('click', () => this.closeTutorialModal());
    }

    const btnResume = document.getElementById('btn-resume-game');
    if (btnResume) {
      btnResume.addEventListener('click', () => this.togglePause());
    }

    const btnRestart = document.getElementById('btn-restart-run');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        this.closeAllModals();
        this.startNewRun();
      });
    }

    const btnQuitTitle = document.getElementById('btn-quit-to-title');
    if (btnQuitTitle) {
      btnQuitTitle.addEventListener('click', () => {
        this.closeAllModals();
        this.returnToTitle();
      });
    }

    const btnRetry = document.getElementById('btn-retry-game');
    if (btnRetry) {
      btnRetry.addEventListener('click', () => {
        this.closeAllModals();
        this.startNewRun();
      });
    }

    const btnGoWorkshop = document.getElementById('btn-go-workshop');
    if (btnGoWorkshop) {
      btnGoWorkshop.addEventListener('click', () => {
        document.getElementById('game-over-modal')?.classList.add('hidden');
        this.openWorkshopModal();
      });
    }

    const btnGoTitle = document.getElementById('btn-go-title');
    if (btnGoTitle) {
      btnGoTitle.addEventListener('click', () => {
        this.closeAllModals();
        this.returnToTitle();
      });
    }

    // Pointer & Keyboard events
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
    window.addEventListener('keydown', this.handleKeyDown);

    this.playgama.onVisibilityChange((isVisible) => {
      if (!isVisible && this.state === 'PLAYING') {
        this.state = 'PAUSED';
        document.getElementById('pause-modal')?.classList.remove('hidden');
      }
    });

    this.updateTitleRecords();
  }

  setupEvents() {
    this.events.on('SENTINEL_MERGED', ({ newTier }) => {
      this.saveData.totalMerges = (this.saveData.totalMerges || 0) + 1;
      this.score += 100 * newTier;
      SaveManager.save(this.playgama, this.saveData);
    });

    this.events.on('ENEMY_KILLED', ({ goldReward, scoreReward, x, y }) => {
      this.saveData.totalKills = (this.saveData.totalKills || 0) + 1;
      this.score += scoreReward || 50;
      this.addGold(goldReward || 3);
      this.surgeCooldown = Math.max(0, this.surgeCooldown - 0.5); // Kills accelerate Overcharge meter
      this.audio.playCoinDrop();
      this.particles.burst(x, y, 10, '#FFD166');
      this.juice.spawnFloatingText(`+${goldReward}💰`, x, y - 10, { color: '#FFD166', size: 14 });
      SaveManager.save(this.playgama, this.saveData);
    });
  }

  updateTitleRecords() {
    const bestWave = document.getElementById('title-best-wave');
    const bestScore = document.getElementById('title-best-score');
    if (bestWave) bestWave.textContent = this.saveData.highestWave || 1;
    if (bestScore) bestScore.textContent = this.saveData.highScore || 0;
  }

  startNewRun() {
    this.state = 'PLAYING';
    this.animTime = 0;
    this.wave = this.startWaveParam || 1;
    this.score = 0;
    this.summonsCount = 0;
    this.repairsCount = 0;
    this.surgeCooldown = 0;
    this.surgeBuffTimer = 0;

    this.applyWorkshopStats();
    this.sentinels.clear();
    this.enemies = [];
    this.projectiles = [];
    this.burningPools = [];
    this.teslaArcs = [];
    this.bossEntity = null;

    // Guaranteed starter sentinels on wave 1 for instant merge teaching
    this.placeSentinel('slot_0', 'ballista_archer', 1);
    this.placeSentinel('slot_4', 'ballista_archer', 1);

    document.getElementById('title-overlay')?.classList.add('hidden');
    document.getElementById('header-hud-center')?.classList.remove('hidden');
    document.getElementById('game-hud')?.classList.remove('hidden');
    this.closeAllModals();

    this.startWave(this.wave);
    this.updateHUD();
  }

  returnToTitle() {
    this.state = 'TITLE';
    document.getElementById('game-hud')?.classList.add('hidden');
    document.getElementById('header-hud-center')?.classList.add('hidden');
    document.getElementById('title-overlay')?.classList.remove('hidden');
    this.closeAllModals();
    this.updateTitleRecords();
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      document.getElementById('pause-modal')?.classList.remove('hidden');
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      document.getElementById('pause-modal')?.classList.add('hidden');
    }
  }

  openWorkshopModal() {
    this.renderWorkshopUI();
    document.getElementById('workshop-modal')?.classList.remove('hidden');
  }

  closeWorkshopModal() {
    document.getElementById('workshop-modal')?.classList.add('hidden');
  }

  openTutorialModal() {
    document.getElementById('tutorial-modal')?.classList.remove('hidden');
  }

  closeTutorialModal() {
    document.getElementById('tutorial-modal')?.classList.add('hidden');
  }

  closeAllModals() {
    document.getElementById('workshop-modal')?.classList.add('hidden');
    document.getElementById('tutorial-modal')?.classList.add('hidden');
    document.getElementById('pause-modal')?.classList.add('hidden');
    document.getElementById('game-over-modal')?.classList.add('hidden');
    document.getElementById('wave-banner')?.classList.add('hidden');
  }

  renderWorkshopUI() {
    const list = document.getElementById('workshop-upgrade-list');
    const goldVal = document.getElementById('workshop-gold-val');
    if (goldVal) goldVal.textContent = this.gold;
    if (!list) return;

    list.innerHTML = '';
    const ws = this.saveData.workshop || {};

    WORKSHOP_DEFS.forEach((upg) => {
      const currentLvl = ws[upg.id] || 0;
      const isMax = currentLvl >= upg.maxLevel;
      const cost = Math.floor(upg.baseCost * Math.pow(upg.costScale, currentLvl));
      const canAfford = this.gold >= cost && !isMax;

      const card = document.createElement('div');
      card.className = 'ws-item';
      card.innerHTML = `
        <div class="ws-info">
          <div class="ws-name">${upg.name} (Lv ${currentLvl}/${upg.maxLevel})</div>
          <div class="ws-desc">${upg.effect > 0 ? '+' : ''}${upg.effect * (upg.unit.includes('%') ? 100 : 1)}${upg.unit} per level</div>
        </div>
        <button class="ws-buy-btn" ${!canAfford ? 'disabled' : ''}>
          ${isMax ? 'MAX' : `${cost} 💰`}
        </button>
      `;

      const btn = card.querySelector('button');
      btn.addEventListener('click', () => {
        if (this.gold >= cost && !isMax) {
          this.gold -= cost;
          ws[upg.id] = currentLvl + 1;
          this.saveData.workshop = ws;
          this.audio.playMergeChime(3);
          SaveManager.save(this.playgama, this.saveData);
          this.renderWorkshopUI();
          this.updateHUD();
        }
      });

      list.appendChild(card);
    });
  }

  /* ==========================================================================
   * 6. SENTINEL PLACEMENT & MERGE MECHANICS
   * ========================================================================== */

  getSummonCost() {
    return Math.floor(15 * Math.pow(1.18, this.summonsCount));
  }

  buySentinel() {
    this.audio.init();
    const cost = this.getSummonCost();
    if (this.gold < cost && !this.isGodMode) {
      this.juice.screenShake(2);
      return;
    }

    // Find empty slot (orbit ring first, then bench)
    const emptyOrbit = ARENA.slots.find((s) => !this.sentinels.has(s.id));
    const emptyBench = ARENA.bench.find((b) => !this.sentinels.has(b.id));
    const targetSlot = emptyOrbit || emptyBench;

    if (!targetSlot) {
      this.juice.spawnFloatingText('BOARD FULL!', ARENA.center.x, ARENA.center.y, { color: '#EF4444' });
      this.juice.screenShake(3);
      return;
    }

    if (!this.isGodMode) this.gold -= cost;
    this.summonsCount++;

    // Random archetype selection
    const archetypesList = Object.keys(ARCHETYPES);
    let chosenArchetype = MathUtils.randomChoice(archetypesList);

    // Guaranteed teaching on Wave 1: guarantee 2nd summon is Ballista Archer
    if (this.wave === 1 && this.summonsCount === 1) {
      chosenArchetype = 'ballista_archer';
    }

    this.placeSentinel(targetSlot.id, chosenArchetype, 1);
    this.audio.playSummonPop();
    this.particles.burst(targetSlot.x, targetSlot.y, 14, '#00E5FF');
    this.updateHUD();
  }

  placeSentinel(slotId, archetype, tier = 1) {
    const slotDef = ARENA.slots.find((s) => s.id === slotId) || ARENA.bench.find((b) => b.id === slotId);
    if (!slotDef) return;

    const data = ARCHETYPES[archetype];
    const tierData = data.tiers[Math.min(tier - 1, 5)];

    this.sentinels.set(slotId, {
      slotId,
      x: slotDef.x,
      y: slotDef.y,
      archetype,
      tier,
      angle: slotDef.angleRad || 0,
      cooldown: 0,
      recoil: 0,
      charging: 0,
      scaleAnim: 1.35,
      isFiring: false,
      isSlashing: false,
      currentRange: tierData.range,
      damage: tierData.damage,
      attackRate: tierData.rate,
      tierData
    });
  }

  canMerge(unitA, unitB) {
    if (!unitA || !unitB) return false;
    return unitA.archetype === unitB.archetype && unitA.tier === unitB.tier && unitA.tier < 6;
  }

  executeMerge(sourceSlotId, targetSlotId) {
    const sourceUnit = this.sentinels.get(sourceSlotId);
    const targetUnit = this.sentinels.get(targetSlotId);
    if (!sourceUnit || !targetUnit || !this.canMerge(sourceUnit, targetUnit)) return;

    const newTier = sourceUnit.tier + 1;
    const targetSlot = ARENA.slots.find((s) => s.id === targetSlotId) || ARENA.bench.find((b) => b.id === targetSlotId);

    this.sentinels.delete(sourceSlotId);
    this.placeSentinel(targetSlotId, targetUnit.archetype, newTier);

    const mergedUnit = this.sentinels.get(targetSlotId);
    if (mergedUnit) mergedUnit.scaleAnim = 1.45;

    this.events.emit('SENTINEL_MERGED', { targetSlotId, archetype: targetUnit.archetype, newTier });
    this.audio.playMergeChime(newTier);
    this.juice.screenShake(3 + newTier);
    this.particles.burst(targetSlot.x, targetSlot.y, 20 + newTier * 4, TIERS[newTier - 1].border);
    this.juice.spawnFloatingText(`TIER ${newTier}!`, targetSlot.x, targetSlot.y - 25, { color: TIERS[newTier - 1].border, size: 18 });
  }

  executeRecycle(sourceSlotId) {
    const unit = this.sentinels.get(sourceSlotId);
    if (!unit) return;

    const baseSummons = Math.pow(2, unit.tier - 1);
    const refund = Math.floor(baseSummons * 15 * ARENA.recycleSlot.refundPercent * this.getWorkshopStat('goldBonus'));

    this.sentinels.delete(sourceSlotId);
    this.addGold(refund);

    this.audio.playCoinDrop();
    this.particles.burst(ARENA.recycleSlot.x, ARENA.recycleSlot.y, 14, '#FFD166');
    this.juice.spawnFloatingText(`+${refund} 💰`, ARENA.recycleSlot.x, ARENA.recycleSlot.y - 20, { color: '#FFD166', size: 16 });
  }

  /* ==========================================================================
   * 7. POINTER & INPUT INTERACTION (DRAG & DROP + TAP FALLBACK)
   * ========================================================================== */

  getSlotAt(x, y) {
    for (const slot of ARENA.slots) {
      if (MathUtils.distance(x, y, slot.x, slot.y) <= 32) return slot;
    }
    for (const bench of ARENA.bench) {
      if (MathUtils.distance(x, y, bench.x, bench.y) <= 32) return bench;
    }
    if (MathUtils.distance(x, y, ARENA.recycleSlot.x, ARENA.recycleSlot.y) <= ARENA.recycleSlot.radius) {
      return ARENA.recycleSlot;
    }
    return null;
  }

  handlePointerDown(e) {
    if (this.state !== 'PLAYING') return;
    this.audio.init();

    const rect = this.canvas.getBoundingClientRect();
    const clientX = (e.clientX - rect.left) / this.renderer.scale;
    const clientY = (e.clientY - rect.top) / this.renderer.scale;

    const slot = this.getSlotAt(clientX, clientY);
    if (!slot) return;

    const unit = this.sentinels.get(slot.id);
    if (unit) {
      this.isPointerDown = true;
      this.dragStartPos = { x: clientX, y: clientY };
      this.dragSourceSlot = slot.id;
      this.draggedSentinel = unit;
      this.dragPos = { x: clientX, y: clientY };
      this.dragState = 'IDLE';
    }
  }

  handlePointerMove(e) {
    if (!this.isPointerDown || !this.draggedSentinel) return;

    const rect = this.canvas.getBoundingClientRect();
    const clientX = (e.clientX - rect.left) / this.renderer.scale;
    const clientY = (e.clientY - rect.top) / this.renderer.scale;

    const dist = MathUtils.distance(clientX, clientY, this.dragStartPos.x, this.dragStartPos.y);
    if (dist > 5) {
      this.dragState = 'DRAGGING';
    }

    if (this.dragState === 'DRAGGING' || this.dragState === 'SNAPPING') {
      this.dragPos = { x: clientX, y: clientY };
      const nearestSlot = this.getSlotAt(clientX, clientY);

      if (nearestSlot && nearestSlot.id !== this.dragSourceSlot) {
        this.dragState = 'SNAPPING';
        this.hoveredSlot = nearestSlot;
      } else {
        this.dragState = 'DRAGGING';
        this.hoveredSlot = null;
      }
    }
  }

  handlePointerUp(e) {
    if (this.dragState === 'DRAGGING' || this.dragState === 'SNAPPING') {
      if (this.hoveredSlot && this.draggedSentinel) {
        if (this.hoveredSlot.id === 'recycle') {
          this.executeRecycle(this.dragSourceSlot);
        } else {
          const destUnit = this.sentinels.get(this.hoveredSlot.id);
          if (destUnit) {
            if (this.canMerge(this.draggedSentinel, destUnit)) {
              this.executeMerge(this.dragSourceSlot, this.hoveredSlot.id);
            } else {
              // Swap positions
              this.sentinels.delete(this.dragSourceSlot);
              this.sentinels.delete(this.hoveredSlot.id);
              this.placeSentinel(this.hoveredSlot.id, this.draggedSentinel.archetype, this.draggedSentinel.tier);
              this.placeSentinel(this.dragSourceSlot, destUnit.archetype, destUnit.tier);
              this.audio.playSummonPop();
            }
          } else {
            // Move to empty slot
            this.sentinels.delete(this.dragSourceSlot);
            this.placeSentinel(this.hoveredSlot.id, this.draggedSentinel.archetype, this.draggedSentinel.tier);
            this.audio.playSummonPop();
          }
        }
      }
    }

    this.isPointerDown = false;
    this.dragState = 'IDLE';
    this.draggedSentinel = null;
    this.dragSourceSlot = null;
    this.hoveredSlot = null;
    this.selectedSlot = null;
  }

  handleKeyDown(e) {
    if (e.code === 'Space' || e.code === 'KeyB') {
      e.preventDefault();
      this.buySentinel();
    } else if (e.code === 'KeyS') {
      e.preventDefault();
      this.triggerOverchargeSurge();
    } else if (e.code === 'KeyR') {
      e.preventDefault();
      this.repairCore();
    } else if (e.code === 'Escape') {
      e.preventDefault();
      this.togglePause();
    }
  }

  /* ==========================================================================
   * 8. TACTICAL ABILITIES (REPAIR & OVERCHARGE SURGE)
   * ========================================================================== */

  getRepairCost() {
    return Math.floor(50 * Math.pow(1.25, this.repairsCount));
  }

  repairCore() {
    this.audio.init();
    if (this.coreHp >= this.coreMaxHp) return;
    const cost = this.getRepairCost();
    if (this.gold < cost && !this.isGodMode) {
      this.juice.screenShake(2);
      return;
    }

    if (!this.isGodMode) this.gold -= cost;
    this.repairsCount++;

    const healAmount = Math.floor(this.coreMaxHp * 0.25);
    this.coreHp = Math.min(this.coreMaxHp, this.coreHp + healAmount);

    this.audio.playMergeChime(2);
    this.particles.burst(ARENA.center.x, ARENA.center.y, 25, '#10B981');
    this.juice.spawnFloatingText(`+${healAmount} HP`, ARENA.center.x, ARENA.center.y - 30, { color: '#10B981', size: 18 });
    this.updateHUD();
  }

  triggerOverchargeSurge() {
    this.audio.init();
    if (this.surgeCooldown > 0 && !this.isGodMode) return;

    this.surgeCooldown = this.surgeCooldownMax;
    this.surgeBuffTimer = 5.0; // 5 seconds of 50% attack speed buff

    // Active Expanding Shockwave Ring
    this.activeShockwave = {
      x: ARENA.center.x,
      y: ARENA.center.y,
      radius: ARENA.coreRadius,
      maxRadius: ARENA.spawnRadius + 30,
      speed: 800
    };

    // Push back all active orbital enemies by 90 degrees & stun 2s
    for (const enemy of this.enemies) {
      enemy.angle -= Math.PI / 2;
      enemy.radius = Math.min(ARENA.spawnRadius, enemy.radius + 25);
      enemy.stunTimer = 2.0;
    }

    this.audio.playSurgeShockwave();
    this.juice.screenShake(10);
    this.particles.confetti(ARENA.center.x, ARENA.center.y, 40);
    this.juice.spawnFloatingText('OVERCHARGE!', ARENA.center.x, ARENA.center.y - 40, { color: '#00F5D4', size: 24 });
    this.updateHUD();
  }

  addGold(amount) {
    this.gold += amount;
    this.updateHUD();
  }

  /* ==========================================================================
   * 9. WAVE DIRECTOR & SPAWN CONTROLLER
   * ========================================================================== */

  startWave(waveNum) {
    this.wave = waveNum;
    this.waveState = 'SPAWNING';
    this.spawnQueue = [];
    this.bossEntity = null;
    this.spawnIntervalTimer = 0.6;

    if (waveNum > (this.saveData.highestWave || 1)) {
      this.saveData.highestWave = waveNum;
      SaveManager.save(this.playgama, this.saveData);
    }

    const isBossWave = waveNum % 5 === 0;
    if (isBossWave) {
      let bossName = 'IRON COLOSSUS';
      if (waveNum === 10) bossName = 'HYDRA QUEEN';
      else if (waveNum === 15) bossName = 'CHRONO WRAITH';
      else if (waveNum > 15) bossName = 'OVERDRIVE TITAN';
      this.showWaveBanner(`⚠️ BOSS WAVE ${waveNum}`, `${bossName} INCOMING`, 2.8);
      this.audio.playBossRoar();
      this.juice.screenShake(6);
    } else {
      this.showWaveBanner(`WAVE ${waveNum}`, 'DEFEND THE NEXUS CORE', 1.8);
    }

    // Generate Spawn Queue
    this.buildWaveSpawnQueue(waveNum);
    this.updateHUD();
  }

  buildWaveSpawnQueue(waveNum) {
    const isBossWave = waveNum % 5 === 0;

    // Scaling formulas
    const hpMult = Math.pow(1 + 0.16 * (waveNum - 1), 1.15);
    const speedMult = Math.min(1.6, 1.0 + 0.02 * (waveNum - 1));

    if (isBossWave) {
      let bossId = 'iron_colossus';
      let bossBaseHp = 1500;
      let bossSpeed = 18;

      if (waveNum === 10) {
        bossId = 'hydra_queen';
        bossBaseHp = 3500;
        bossSpeed = 22;
      } else if (waveNum >= 15) {
        bossId = 'chrono_wraith';
        bossBaseHp = 8000;
        bossSpeed = 26;
      }

      this.spawnQueue.push({
        type: bossId,
        hp: Math.floor(bossBaseHp * hpMult),
        speed: bossSpeed * speedMult,
        portal: ARENA.portals[0],
        isBoss: true,
        bossId
      });

      // Supporting escorts
      for (let i = 0; i < 4 + waveNum; i++) {
        this.spawnQueue.push({
          type: MathUtils.randomChoice(['void_crawler', 'swift_dart', 'swarm_pod']),
          hp: Math.floor(40 * hpMult),
          speed: 45 * speedMult,
          portal: MathUtils.randomChoice(ARENA.portals),
          isBoss: false
        });
      }
      return;
    }

    // Regular Swarm Generation
    const totalCount = 8 + waveNum * 3;
    const allowedTypes = ['void_crawler'];
    if (waveNum >= 2) allowedTypes.push('swift_dart');
    if (waveNum >= 3) allowedTypes.push('armored_bruiser');
    if (waveNum >= 4) allowedTypes.push('swarm_pod');
    if (waveNum >= 6) allowedTypes.push('void_slinger');

    for (let i = 0; i < totalCount; i++) {
      const type = MathUtils.randomChoice(allowedTypes);
      const def = ENEMY_TYPES[type];
      this.spawnQueue.push({
        type,
        hp: Math.floor(def.baseHp * hpMult),
        speed: def.speedDeg * speedMult,
        portal: MathUtils.randomChoice(ARENA.portals),
        isBoss: false
      });
    }
  }

  spawnEnemy(spec) {
    const def = ENEMY_TYPES[spec.type] || { radius: 14, color: '#EF4444', coreDmg: 15, gold: 5, armor: 0 };
    const portal = spec.portal || ARENA.portals[0];

    const enemy = {
      id: `enemy_${Math.random().toString(36).substring(2, 9)}`,
      type: spec.type,
      isBoss: spec.isBoss || false,
      bossId: spec.bossId || null,
      radius: spec.isBoss ? 30 : def.radius,
      color: def.color,
      maxHp: spec.hp,
      hp: spec.hp,
      baseSpeedDeg: spec.speed,
      armor: def.armor || 0,
      coreDmg: def.coreDmg || 10,
      gold: def.gold || 3,
      // Polar coordinates centered at Core
      polarRadius: ARENA.spawnRadius,
      polarAngle: portal.angleRad,
      x: portal.x,
      y: portal.y,
      angle: portal.angleRad + Math.PI / 2,
      // Debuffs & Visuals
      chilledTimer: 0,
      slowPercent: 0,
      stunTimer: 0,
      burnTimer: 0,
      burnDPS: 0,
      hitFlashTimer: 0,
      // Boss mechanics
      shieldAngle: 0,
      shieldActive: true,
      phaseBlinkTimer: 5.0,
      shootTimer: 6.0,
      hasSplit: false
    };

    if (spec.isBoss) this.bossEntity = enemy;
    this.enemies.push(enemy);
    this.particles.burst(portal.x, portal.y, 10, '#C084FC');
  }

  /* ==========================================================================
   * 10. SIMULATION UPDATE TICK (60Hz Fixed Timestep with TimeScale)
   * ========================================================================== */

  update(dt) {
    if (this.state !== 'PLAYING') return;

    const scaledDt = dt * (this.timeScale || 1.0);

    this.animTime += scaledDt;
    this.particles.update(scaledDt);
    this.juice.update(scaledDt);

    // Timers & Buffs
    if (this.coreDamagedTimer > 0) this.coreDamagedTimer -= scaledDt;
    if (this.surgeCooldown > 0) this.surgeCooldown -= scaledDt;
    if (this.surgeBuffTimer > 0) this.surgeBuffTimer -= scaledDt;

    // Expanding Shockwave Animation
    if (this.activeShockwave) {
      this.activeShockwave.radius += this.activeShockwave.speed * scaledDt;
      if (this.activeShockwave.radius >= this.activeShockwave.maxRadius) {
        this.activeShockwave = null;
      }
    }

    // Wave Spawning Controller
    if (this.waveState === 'SPAWNING') {
      this.spawnIntervalTimer -= scaledDt;
      if (this.spawnIntervalTimer <= 0 && this.spawnQueue.length > 0) {
        const spec = this.spawnQueue.shift();
        this.spawnEnemy(spec);
        this.spawnIntervalTimer = 0.65;
      }
      if (this.spawnQueue.length === 0) {
        this.waveState = 'WAVE_ACTIVE';
      }
    }

    // Check Wave Cleared
    if (this.waveState === 'WAVE_ACTIVE' && this.enemies.length === 0) {
      this.waveState = 'WAVE_CLEARED';
      this.waveTimer = 2.8;

      const bounty = 25 + 12 * this.wave + Math.floor(1.5 * Math.pow(this.wave, 1.2));
      const finalBounty = Math.floor(bounty * this.getWorkshopStat('goldBonus'));
      this.addGold(finalBounty);
      this.audio.playVictoryFanfare();
      this.showWaveBanner(`WAVE ${this.wave} CLEARED!`, `+${finalBounty} 💰 BOUNTY`, 2.5);
    }

    if (this.waveState === 'WAVE_CLEARED') {
      this.waveTimer -= scaledDt;
      if (this.waveTimer <= 0) {
        this.startWave(this.wave + 1);
      }
    }

    // Update Sentinels
    this.updateSentinels(scaledDt);

    // Update Enemies (Archimedean Inward Spiral Progression)
    this.updateEnemies(scaledDt);

    // Update Projectiles & Combat Raycasts
    this.updateProjectiles(scaledDt);

    // Burning Plasma Pools
    this.updateBurningPools(scaledDt);

    // Check High Score Update
    if (this.score > (this.saveData.highScore || 0)) {
      this.saveData.highScore = this.score;
      SaveManager.save(this.playgama, this.saveData);
    }
  }

  updateSentinels(dt) {
    const globalSpeedBuff = this.getWorkshopStat('attackSpeed') * (this.surgeBuffTimer > 0 ? 1.5 : 1.0);

    for (const [slotId, s] of this.sentinels) {
      if (s.scaleAnim > 1.0) {
        s.scaleAnim = Math.max(1.0, s.scaleAnim - dt * 2.5);
      }
      if (s.recoil > 0) s.recoil = Math.max(0, s.recoil - dt * 5);
      s.isFiring = false;
      s.isSlashing = false;
      s.cooldown -= dt * globalSpeedBuff;

      // Select Target
      const target = this.selectTargetForSentinel(s);
      if (target) {
        // Track target with turret angle
        const targetAngle = Math.atan2(target.y - s.y, target.x - s.x);
        s.angle = targetAngle;

        if (s.cooldown <= 0) {
          this.fireSentinel(s, target);
          s.cooldown = 1.0 / (s.attackRate || 1.0);
          s.recoil = 1.0;
        }
      }
    }
  }

  selectTargetForSentinel(s) {
    const inRange = this.enemies.filter((e) => {
      if (e.hp <= 0) return false;
      const d = MathUtils.distance(s.x, s.y, e.x, e.y);
      return d <= s.currentRange;
    });

    if (inRange.length === 0) return null;

    switch (s.archetype) {
      case 'ballista_archer':
        // Furthest along spiral orbit (closest to core)
        return inRange.reduce((prev, curr) => (curr.polarRadius < prev.polarRadius ? curr : prev));

      case 'heavy_cannon':
        // Densest enemy cluster
        return this.findDensestClusterTarget(inRange, s.tierData.splash || 65);

      case 'arcane_mage':
        // Highest HP target
        return inRange.reduce((prev, curr) => (curr.hp > prev.hp ? curr : prev));

      case 'frost_warden':
        // Omnidirectional aura; return first valid
        return inRange[0];

      case 'shadow_assassin':
        // Closest to inner defense perimeter
        return inRange.reduce((prev, curr) => {
          const dCurr = MathUtils.distance(s.x, s.y, curr.x, curr.y);
          const dPrev = MathUtils.distance(s.x, s.y, prev.x, prev.y);
          return dCurr < dPrev ? curr : prev;
        });

      default:
        return inRange[0];
    }
  }

  findDensestClusterTarget(candidates, splashRadius) {
    let best = candidates[0];
    let maxNeighbors = -1;
    for (let i = 0; i < candidates.length; i++) {
      const a = candidates[i];
      let count = 0;
      for (let j = 0; j < candidates.length; j++) {
        if (i === j) continue;
        if (MathUtils.distance(a.x, a.y, candidates[j].x, candidates[j].y) <= splashRadius) count++;
      }
      if (count > maxNeighbors) {
        maxNeighbors = count;
        best = a;
      }
    }
    return best;
  }

  fireSentinel(s, target) {
    const wsCritBonus = this.getWorkshopStat('critChance');

    switch (s.archetype) {
      case 'ballista_archer': {
        s.isFiring = true;
        this.audio.playLaserPew();

        // Check extra damage vs sprinters
        let dmg = s.damage;
        if (s.tier >= 4 && target.type === 'swift_dart') dmg *= 1.5;

        // Instant laser beam tracer
        this.projectiles.push({
          type: 'laser',
          x1: s.x,
          y1: s.y,
          x2: target.x,
          y2: target.y,
          life: 0.1,
          color: '#00E5FF',
          damage: dmg,
          targetId: target.id,
          pierce: s.tierData.pierce || 0
        });

        this.applyDamageToEnemy(target, dmg, false, 'kinetic');
        break;
      }

      case 'heavy_cannon': {
        s.isFiring = true;
        this.audio.playCannonBlast();
        this.projectiles.push({
          type: 'mortar',
          startX: s.x,
          startY: s.y,
          targetX: target.x,
          targetY: target.y,
          x: s.x,
          y: s.y,
          progress: 0,
          duration: 0.45,
          splash: s.tierData.splash || 65,
          damage: s.damage,
          burnDPS: s.tierData.burnDPS || 0,
          burnSlow: s.tierData.burnSlow || 0,
          clusterBombs: s.tierData.clusterBombs || 0
        });
        break;
      }

      case 'arcane_mage': {
        s.isFiring = true;
        this.audio.playTeslaCrackle();
        this.projectiles.push({
          type: 'chain_lightning',
          source: { x: s.x, y: s.y },
          initialTarget: target,
          maxChains: s.tierData.chains || 3,
          damage: s.damage,
          microStun: s.tierData.microStun || 0,
          life: 0.12
        });
        break;
      }

      case 'frost_warden': {
        this.audio.playFrostHum();
        // Omnidirectional tick on all enemies in range
        for (const e of this.enemies) {
          if (MathUtils.distance(s.x, s.y, e.x, e.y) <= s.currentRange) {
            e.chilledTimer = 0.35 + (s.tierData.lingerSlow || 0);
            e.slowPercent = s.tierData.slow || 0.35;
            this.applyDamageToEnemy(e, s.damage * 0.1, false, 'cryo');
          }
        }
        break;
      }

      case 'shadow_assassin': {
        s.isSlashing = true;
        this.audio.playCritSlash();

        const baseCrit = (s.tierData.critChance || 0.25) + wsCritBonus;
        const isCrit = Math.random() < baseCrit;
        const mult = isCrit ? (s.tierData.critMult || 3.0) : 1.0;
        let finalDmg = s.damage * mult;

        if (s.tierData.executeThreshold && !target.isBoss && target.hp / target.maxHp < s.tierData.executeThreshold) {
          finalDmg = target.hp + 10; // Instantly execute
          this.juice.spawnFloatingText('EXECUTED!', target.x, target.y - 15, { color: '#EF4444', size: 16 });
        }

        this.applyDamageToEnemy(target, finalDmg, isCrit, 'void_crit', s.tierData.armorShred || 0);
        this.particles.burst(target.x, target.y, isCrit ? 16 : 8, '#F43F5E');

        // Twin strike perk at T4+
        if (s.tierData.twinStrike) {
          const otherTarget = this.enemies.find((e) => e.id !== target.id && MathUtils.distance(s.x, s.y, e.x, e.y) <= s.currentRange);
          if (otherTarget) {
            this.applyDamageToEnemy(otherTarget, finalDmg * 0.75, false, 'void_crit');
          }
        }
        break;
      }
    }
  }

  applyDamageToEnemy(enemy, rawDamage, isCrit = false, damageType = 'physical', armorShred = 0) {
    if (!enemy || enemy.hp <= 0) return;

    // Check Iron Colossus Shield Barrier Deflection
    if (enemy.type === 'iron_colossus' && enemy.shieldActive) {
      // Vector from boss to core / attacker
      const hitAngle = Math.atan2(enemy.y - ARENA.center.y, enemy.x - ARENA.center.x);
      const angleDiff = Math.abs(MathUtils.normalizeAngle(hitAngle - enemy.shieldAngle));
      if (angleDiff <= Math.PI / 3) {
        // Frontal shield deflection!
        this.audio.playCritSlash();
        this.juice.spawnFloatingText('BLOCKED!', enemy.x, enemy.y - 20, { color: '#00E5FF', size: 14 });
        this.particles.burst(enemy.x, enemy.y, 6, '#00E5FF');
        return;
      }
    }

    // Armor damage reduction
    const effectiveArmor = Math.max(0, (enemy.armor || 0) - armorShred);
    const damage = rawDamage * (1.0 - effectiveArmor);

    enemy.hp -= damage;
    enemy.hitFlashTimer = 0.08;

    this.juice.spawnFloatingText(`${Math.round(damage)}`, enemy.x, enemy.y - 10, {
      color: isCrit ? '#FFD166' : damageType === 'cryo' ? '#38BDF8' : '#F8FAFC',
      size: isCrit ? 18 : 13
    });

    if (enemy.hp <= 0) {
      this.killEnemy(enemy);
    }
  }

  killEnemy(enemy) {
    enemy.hp = 0;

    // Swarm Pod Splitting Mechanic
    if (enemy.type === 'swarm_pod') {
      for (let i = 0; i < 5; i++) {
        const offsetAngle = (i * Math.PI * 2) / 5;
        this.enemies.push({
          id: `mite_${Math.random().toString(36).substring(2, 9)}`,
          type: 'void_mite',
          isBoss: false,
          radius: 6,
          color: '#00E676',
          maxHp: 12,
          hp: 12,
          baseSpeedDeg: 62,
          armor: 0,
          coreDmg: 3,
          gold: 1,
          polarRadius: enemy.polarRadius,
          polarAngle: enemy.polarAngle + offsetAngle * 0.1,
          x: enemy.x + Math.cos(offsetAngle) * 10,
          y: enemy.y + Math.sin(offsetAngle) * 10,
          angle: enemy.angle,
          chilledTimer: 0,
          slowPercent: 0,
          stunTimer: 0,
          hitFlashTimer: 0
        });
      }
    }

    // Hydra Queen Mitosis Split Mechanic
    if (enemy.type === 'hydra_queen' && !enemy.hasSplit) {
      enemy.hasSplit = true;
      for (let s of [-1, 1]) {
        this.enemies.push({
          id: `hydra_spawn_${Math.random().toString(36).substring(2, 9)}`,
          type: 'hydra_queen',
          isBoss: true,
          hasSplit: true,
          radius: 22,
          color: '#00E676',
          maxHp: enemy.maxHp * 0.45,
          hp: enemy.maxHp * 0.45,
          baseSpeedDeg: 30 * s,
          armor: 0,
          coreDmg: 20,
          gold: 50,
          polarRadius: enemy.polarRadius,
          polarAngle: enemy.polarAngle + s * 0.2,
          x: enemy.x,
          y: enemy.y,
          angle: enemy.angle,
          chilledTimer: 0,
          slowPercent: 0,
          stunTimer: 0,
          hitFlashTimer: 0
        });
      }
    }

    this.events.emit('ENEMY_KILLED', {
      enemyId: enemy.id,
      goldReward: enemy.gold || 3,
      scoreReward: enemy.isBoss ? 5000 : 50,
      x: enemy.x,
      y: enemy.y
    });
  }

  updateEnemies(dt) {
    const radialDriftRate = (ARENA.spawnRadius - ARENA.coreRadius) / 36.0; // Smooth 36s inward drift for comfortable tracking

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.hp <= 0) {
        this.enemies.splice(i, 1);
        continue;
      }

      // Timers & Debuffs
      if (e.hitFlashTimer > 0) e.hitFlashTimer -= dt;
      if (e.stunTimer > 0) {
        e.stunTimer -= dt;
        continue; // Stunned: freezes movement
      }

      if (e.chilledTimer > 0) {
        e.chilledTimer -= dt;
      } else {
        e.slowPercent = 0;
      }

      // Angular progression along orbital spiral
      const speedScale = (1.0 - e.slowPercent);
      const effectiveAngularSpeed = (e.baseSpeedDeg * Math.PI / 180) * speedScale;
      e.polarAngle += effectiveAngularSpeed * dt;

      // Inward radial drift
      e.polarRadius -= radialDriftRate * speedScale * dt;

      // Convert polar coordinates to Cartesian
      e.x = ARENA.center.x + Math.cos(e.polarAngle) * e.polarRadius;
      e.y = ARENA.center.y + Math.sin(e.polarAngle) * e.polarRadius;
      e.angle = e.polarAngle + Math.PI / 2;

      // Boss Specific Mechanics
      if (e.type === 'iron_colossus') {
        e.shieldAngle += dt * 1.5; // Revolving kinetic shield
      } else if (e.type === 'chrono_wraith') {
        e.phaseBlinkTimer -= dt;
        if (e.phaseBlinkTimer <= 0) {
          e.phaseBlinkTimer = 5.0;
          e.polarAngle += (75 * Math.PI / 180); // Teleport 75 degrees forward
          this.particles.burst(e.x, e.y, 20, '#D500F9');
          this.audio.playTeslaCrackle();
        }
      }

      // Check Core Breach Collision
      if (e.polarRadius <= ARENA.coreRadius) {
        this.handleCoreBreach(e);
        this.enemies.splice(i, 1);
      }
    }
  }

  handleCoreBreach(enemy) {
    if (!this.isGodMode) {
      this.coreHp = Math.max(0, this.coreHp - enemy.coreDmg);
    }
    this.coreDamagedTimer = 0.5;

    this.audio.playCoreAlarm();
    this.juice.screenShake(12);
    this.juice.screenFlash('#EF4444', 0.4);
    this.particles.burst(ARENA.center.x, ARENA.center.y, 25, '#EF4444');
    this.juice.spawnFloatingText(`-${enemy.coreDmg} HP`, ARENA.center.x, ARENA.center.y - 20, { color: '#EF4444', size: 22 });

    if (this.coreHp <= 0) {
      this.handleGameOver();
    }
    this.updateHUD();
  }

  handleGameOver() {
    this.state = 'GAME_OVER';
    document.getElementById('go-wave-val').textContent = this.wave;
    document.getElementById('go-score-val').textContent = this.score;
    document.getElementById('go-merges-val').textContent = this.saveData.totalMerges || 0;
    document.getElementById('go-kills-val').textContent = this.saveData.totalKills || 0;

    document.getElementById('game-over-modal')?.classList.remove('hidden');
    this.audio.playBossRoar();
    this.juice.screenShake(16);
  }

  updateProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];

      if (p.type === 'laser') {
        p.life -= dt;
        if (p.life <= 0) this.projectiles.splice(i, 1);
      } else if (p.type === 'mortar') {
        p.progress += dt / p.duration;
        p.x = MathUtils.lerp(p.startX, p.targetX, p.progress);
        p.y = MathUtils.lerp(p.startY, p.targetY, p.progress);

        if (p.progress >= 1.0) {
          // Mortar Detonation Impact
          this.audio.playCannonBlast();
          this.juice.screenShake(4);
          this.particles.burst(p.targetX, p.targetY, 22, '#FF9E00');

          for (const e of this.enemies) {
            const d = MathUtils.distance(p.targetX, p.targetY, e.x, e.y);
            if (d <= p.splash) {
              const falloff = 1.0 - (d / p.splash) * 0.4;
              this.applyDamageToEnemy(e, p.damage * falloff, false, 'explosive');
            }
          }

          if (p.burnDPS > 0) {
            this.burningPools.push({
              x: p.targetX,
              y: p.targetY,
              radius: p.splash * 0.8,
              duration: 2.0,
              dps: p.damage * p.burnDPS
            });
          }

          this.projectiles.splice(i, 1);
        }
      } else if (p.type === 'chain_lightning') {
        p.life -= dt;
        if (!p.executed) {
          p.executed = true;
          this.executeChainLightning(p);
        }
        if (p.life <= 0) this.projectiles.splice(i, 1);
      }
    }
  }

  executeChainLightning(p) {
    let currentTarget = p.initialTarget;
    let currentSource = p.source;
    const hitList = new Set();
    const arcs = [];

    for (let c = 0; c < p.maxChains && currentTarget; c++) {
      hitList.add(currentTarget.id);
      arcs.push({ x1: currentSource.x, y1: currentSource.y, x2: currentTarget.x, y2: currentTarget.y });
      this.applyDamageToEnemy(currentTarget, p.damage, false, 'energy');

      if (p.microStun > 0) currentTarget.stunTimer = p.microStun;

      // Find next closest unhit target
      currentSource = { x: currentTarget.x, y: currentTarget.y };
      const nextTarget = this.enemies.find((e) => !hitList.has(e.id) && MathUtils.distance(currentSource.x, currentSource.y, e.x, e.y) <= 120);
      currentTarget = nextTarget;
    }

    this.teslaArcs.push({ arcs, life: 0.15 });
  }

  updateBurningPools(dt) {
    for (let i = this.burningPools.length - 1; i >= 0; i--) {
      const pool = this.burningPools[i];
      pool.duration -= dt;

      for (const e of this.enemies) {
        if (MathUtils.distance(pool.x, pool.y, e.x, e.y) <= pool.radius) {
          this.applyDamageToEnemy(e, pool.dps * dt, false, 'fire');
        }
      }

      if (pool.duration <= 0) {
        this.burningPools.splice(i, 1);
      }
    }

    for (let i = this.teslaArcs.length - 1; i >= 0; i--) {
      this.teslaArcs[i].life -= dt;
      if (this.teslaArcs[i].life <= 0) this.teslaArcs.splice(i, 1);
    }
  }

  updateHUD() {
    const waveVal = document.getElementById('hud-wave-val');
    const goldVal = document.getElementById('hud-gold-val');
    const hpText = document.getElementById('hud-hp-text');
    const hpFill = document.getElementById('hud-hp-fill');
    const buyCost = document.getElementById('hud-buy-cost');
    const repairCost = document.getElementById('hud-repair-cost');
    const surgeMeter = document.getElementById('hud-surge-meter');
    const btnSurge = document.getElementById('btn-surge');

    if (waveVal) waveVal.textContent = this.wave;
    if (goldVal) goldVal.textContent = this.gold;
    if (hpText) hpText.textContent = `${Math.ceil(this.coreHp)} / ${this.coreMaxHp}`;

    if (hpFill) {
      const pct = Math.max(0, Math.min(100, (this.coreHp / this.coreMaxHp) * 100));
      hpFill.style.width = `${pct}%`;
      hpFill.classList.remove('warning', 'critical');
      if (pct < 30) hpFill.classList.add('critical');
      else if (pct < 60) hpFill.classList.add('warning');
    }

    if (buyCost) buyCost.textContent = `${this.getSummonCost()} 💰`;
    if (repairCost) repairCost.textContent = `${this.getRepairCost()} 💰`;

    if (surgeMeter && btnSurge) {
      if (this.surgeCooldown <= 0) {
        surgeMeter.textContent = 'READY';
        btnSurge.classList.add('ready');
        btnSurge.classList.remove('charging');
      } else {
        surgeMeter.textContent = `${Math.ceil(this.surgeCooldown)}s`;
        btnSurge.classList.remove('ready');
        btnSurge.classList.add('charging');
      }
    }
  }

  /* ==========================================================================
   * 11. LAYERED CANVAS RENDERING (9 Explicit Layers)
   * ========================================================================== */

  render(alpha) {
    const ctx = this.renderer.ctx;
    this.renderer.beginFrame();

    // Layer 0: Deep Space Nebula & Stars Background
    this.layeredRenderer.draw(RenderLayers.BACKGROUND, (c) => {
      drawCosmicBackground(c, ARENA.width, ARENA.height, this.animTime, this.stars);
    });

    // Layer 10: Arena Grid & Slot Bases
    this.layeredRenderer.draw(RenderLayers.WORLD_BACK, (c) => {
      drawArenaGrid(c, ARENA.center.x, ARENA.center.y, this.animTime);

      // Draw Orbit Slots
      for (const slot of ARENA.slots) {
        const isOccupied = this.sentinels.has(slot.id);
        const isSelected = this.selectedSlot === slot.id;
        const isHovered = this.hoveredSlot?.id === slot.id;
        drawSlotPad(c, slot, isOccupied, isSelected, isHovered);
      }

      // Draw Standby Bench Slots
      for (const bench of ARENA.bench) {
        const isOccupied = this.sentinels.has(bench.id);
        const isSelected = this.selectedSlot === bench.id;
        const isHovered = this.hoveredSlot?.id === bench.id;
        drawSlotPad(c, bench, isOccupied, isSelected, isHovered);
      }

      // Draw Recycle Bin Slot
      drawSlotPad(c, ARENA.recycleSlot, false, false, this.hoveredSlot?.id === 'recycle');
    });

    // Layer 20: Nexus Core Generator
    this.layeredRenderer.draw(RenderLayers.WORLD, (c) => {
      drawNexusCore(c, ARENA.center.x, ARENA.center.y, {
        hpPercent: this.coreHp / this.coreMaxHp,
        animTime: this.animTime,
        isDamaged: this.coreDamagedTimer > 0,
        isSurging: this.surgeBuffTimer > 0
      });
    });

    // Layer 30: Burning Plasma Pools & Shockwaves
    this.layeredRenderer.draw(RenderLayers.EFFECTS, (c) => {
      for (const pool of this.burningPools) {
        const pGrad = c.createRadialGradient(pool.x, pool.y, 2, pool.x, pool.y, pool.radius);
        pGrad.addColorStop(0, 'rgba(255, 158, 0, 0.6)');
        pGrad.addColorStop(0.7, 'rgba(234, 88, 12, 0.3)');
        pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        c.fillStyle = pGrad;
        c.beginPath();
        c.arc(pool.x, pool.y, pool.radius, 0, Math.PI * 2);
        c.fill();
      }

      if (this.activeShockwave) {
        c.strokeStyle = '#00F5D4';
        c.lineWidth = 4;
        c.shadowColor = '#00E5FF';
        c.shadowBlur = 12;
        c.beginPath();
        c.arc(this.activeShockwave.x, this.activeShockwave.y, this.activeShockwave.radius, 0, Math.PI * 2);
        c.stroke();
        c.shadowBlur = 0;
      }
    });

    // Layer 40: Void Invaders Horde
    this.layeredRenderer.draw(RenderLayers.CHARACTERS, (c) => {
      for (const enemy of this.enemies) {
        drawEnemy(c, enemy, this.animTime);
      }
    });

    // Layer 50: Projectiles & Tesla Lightning Arcs
    this.layeredRenderer.draw(RenderLayers.WORLD_UI, (c) => {
      // Lasers
      for (const p of this.projectiles) {
        if (p.type === 'laser') {
          c.save();
          c.globalCompositeOperation = 'lighter';
          c.strokeStyle = 'rgba(0, 229, 255, 0.5)';
          c.lineWidth = 6;
          c.beginPath();
          c.moveTo(p.x1, p.y1);
          c.lineTo(p.x2, p.y2);
          c.stroke();
          c.strokeStyle = '#FFFFFF';
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(p.x1, p.y1);
          c.lineTo(p.x2, p.y2);
          c.stroke();
          c.restore();
        } else if (p.type === 'mortar') {
          const height = Math.sin(p.progress * Math.PI) * 40;
          c.fillStyle = 'rgba(0, 0, 0, 0.3)';
          c.beginPath();
          c.ellipse(p.x, p.y, 6, 3, 0, 0, Math.PI * 2);
          c.fill();

          c.fillStyle = '#FF9E00';
          c.beginPath();
          c.arc(p.x, p.y - height, 5, 0, Math.PI * 2);
          c.fill();
        }
      }

      // Tesla Arcs
      for (const arcGroup of this.teslaArcs) {
        c.save();
        c.strokeStyle = '#F3E8FF';
        c.lineWidth = 2;
        c.shadowColor = '#C084FC';
        c.shadowBlur = 8;
        for (const arc of arcGroup.arcs) {
          c.beginPath();
          c.moveTo(arc.x1, arc.y1);
          const midX = (arc.x1 + arc.x2) / 2 + (Math.random() - 0.5) * 16;
          const midY = (arc.y1 + arc.y2) / 2 + (Math.random() - 0.5) * 16;
          c.lineTo(midX, midY);
          c.lineTo(arc.x2, arc.y2);
          c.stroke();
        }
        c.restore();
      }
    });

    // Layer 60: Defense Sentinels
    this.layeredRenderer.draw(RenderLayers.DIALOGUE, (c) => {
      const draggedUnit = this.draggedSentinel;

      for (const [slotId, sentinel] of this.sentinels) {
        // If dragging, don't draw in slot; preview will be drawn on top layer
        if (this.dragState !== 'IDLE' && this.dragSourceSlot === slotId) continue;

        const isSelected = this.selectedSlot === slotId;
        const isMergeTarget = draggedUnit && this.canMerge(draggedUnit, sentinel);

        // Render synergy beam connecting to valid merge targets
        if (isMergeTarget && draggedUnit) {
          c.save();
          c.strokeStyle = '#FFD166';
          c.lineWidth = 2;
          c.setLineDash([4, 4]);
          c.beginPath();
          c.moveTo(this.dragPos.x, this.dragPos.y);
          c.lineTo(sentinel.x, sentinel.y);
          c.stroke();
          c.restore();
        }

        drawSentinel(c, sentinel, this.animTime, isSelected, isMergeTarget);
      }
    });

    // Layer 70: Drag Preview & Cursor Unit
    this.layeredRenderer.draw(RenderLayers.HUD, (c) => {
      if (this.dragState !== 'IDLE' && this.draggedSentinel) {
        c.save();
        c.globalAlpha = 0.85;
        drawSentinel(c, { ...this.draggedSentinel, x: this.dragPos.x, y: this.dragPos.y, scaleAnim: 1.15 }, this.animTime, true, false);
        c.restore();
      }
    });

    // Layer 80: Particles & Floating Damage Text
    this.layeredRenderer.draw(RenderLayers.OVERLAY, (c) => {
      this.particles.render(c);
      this.juice.renderWorld(c);
    });

    // Flush all queued render layers in strict ascending order
    this.layeredRenderer.flush(ctx);

    // Screen Shake / Trauma Flash
    this.juice.renderScreen(ctx, ARENA.width, ARENA.height);

    this.renderer.endFrame();
  }
}

/* ============================================================================
 * 12. BOOTSTRAP ENTRY POINT
 * ============================================================================ */

window.addEventListener('DOMContentLoaded', () => {
  const game = new OrbitGuardGame();
  game.init().catch((err) => console.error('Error starting Orbit Guard:', err));
});
