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
 * 0. SPRITE & ASSET MANAGER (ASYNCHRONOUS LOADER WITH PROCEDURAL FALLBACK)
 * ============================================================================ */

export const ASSET_PATHS = {
  // Sentinels
  sentinel_ballista: 'assets/sentinel_ballista.png',
  sentinel_cannon: 'assets/sentinel_cannon.png',
  sentinel_mage: 'assets/sentinel_mage.png',
  sentinel_frost: 'assets/sentinel_frost.png',
  sentinel_assassin: 'assets/sentinel_assassin.png',

  // Enemies
  enemy_crawler: 'assets/enemy_crawler.png',
  enemy_dart: 'assets/enemy_dart.png',
  enemy_bruiser: 'assets/enemy_bruiser.png',
  enemy_swarm: 'assets/enemy_swarm.png',
  enemy_slinger: 'assets/enemy_slinger.png',

  // Bosses
  boss_colossus: 'assets/boss_colossus.png',
  boss_hydra: 'assets/boss_hydra.png',
  boss_chrono: 'assets/boss_chrono.png',

  // Lasers & Background
  bg_cosmic: 'assets/bg_cosmic.png',
  laser_blue: 'assets/laser_blue.png',
  laser_red: 'assets/laser_red.png',
  laser_green: 'assets/laser_green.png',

  // Powerups
  powerup_bolt: 'assets/powerup_bolt.png',
  powerup_shield: 'assets/powerup_shield.png',
  powerup_star: 'assets/powerup_star.png'
};

export class AssetManager {
  constructor() {
    this.images = new Map();
    this.loading = new Map();
    this.loaded = new Map();
    this.errors = new Map();
  }

  load(key, src) {
    if (this.images.has(key) && this.loaded.get(key)) {
      return Promise.resolve(this.images.get(key));
    }
    if (this.loading.has(key)) {
      return this.loading.get(key);
    }

    const promise = new Promise((resolve) => {
      let timer = null;
      if (typeof setTimeout !== 'undefined') {
        timer = setTimeout(() => {
          onError(new Error(`Timeout loading asset: ${key}`));
        }, 1500);
        if (timer && timer.unref) timer.unref();
      }

      const onLoad = () => {
        if (timer) clearTimeout(timer);
        this.loaded.set(key, true);
        this.images.set(key, img);
        this.loading.delete(key);
        resolve(img);
      };

      const onError = (err) => {
        if (timer) clearTimeout(timer);
        this.errors.set(key, true);
        this.loading.delete(key);
        resolve(null);
      };

      if (typeof Image === 'undefined') {
        // Node / headless test environment fallback
        if (timer) clearTimeout(timer);
        resolve(null);
        return;
      }

      let img;
      try {
        img = new Image();
      } catch (e) {
        onError(e);
        return;
      }

      if (img && img.addEventListener) {
        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onError, { once: true });
      } else if (img && typeof img === 'object') {
        img.onload = onLoad;
        img.onerror = onError;
      }

      try {
        if (img) img.src = src;
      } catch (e) {
        onError(e);
        return;
      }

      if (img && img.complete && (img.naturalWidth > 0 || img.width > 0)) {
        onLoad();
      }
    });

    this.loading.set(key, promise);
    return promise;
  }

  async loadAll(assetMap = ASSET_PATHS) {
    const entries = Object.entries(assetMap);
    await Promise.all(entries.map(([k, path]) => this.load(k, path)));
    return this;
  }

  get(key) {
    return this.images.get(key) || null;
  }

  isLoaded(key) {
    const img = this.images.get(key);
    if (!img || !this.loaded.get(key)) return false;
    return !!(img.naturalWidth > 0 || (img.complete && img.width > 0));
  }

  drawSprite(ctx, key, x, y, width, height, rotation = 0, alpha = 1.0) {
    if (!this.isLoaded(key) || typeof ctx.drawImage !== 'function') return false;
    const img = this.get(key);
    if (!img) return false;

    ctx.save();
    ctx.translate(x, y);
    if (rotation !== 0) ctx.rotate(rotation);
    if (alpha < 1.0) ctx.globalAlpha = Math.max(0, Math.min(1, ctx.globalAlpha * alpha));
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
    return true;
  }
}

export const assets = new AssetManager();
// Preload immediately in background
if (typeof window !== 'undefined' || typeof document !== 'undefined') {
  assets.loadAll(ASSET_PATHS).catch(() => {});
}

/* ============================================================================
 * 1. GAME DATA & CONFIGURATION SCHEMAS
 * ============================================================================ */

export const ARENA = {
  width: 450,
  height: 720,
  center: { x: 225, y: 280 },
  coreRadius: 36,
  orbitRadius: 72,
  innerHazardRadius: 108,
  midOrbitRadius: 140,
  spawnRadius: 175,
  slots: [
    { id: 'slot_0', index: 0, angleDeg: 0,   angleRad: 0.0000, x: 297.00, y: 280.00, compass: 'E' },
    { id: 'slot_1', index: 1, angleDeg: 45,  angleRad: 0.7854, x: 275.91, y: 330.91, compass: 'SE' },
    { id: 'slot_2', index: 2, angleDeg: 90,  angleRad: 1.5708, x: 225.00, y: 352.00, compass: 'S' },
    { id: 'slot_3', index: 3, angleDeg: 135, angleRad: 2.3562, x: 174.09, y: 330.91, compass: 'SW' },
    { id: 'slot_4', index: 4, angleDeg: 180, angleRad: 3.1416, x: 153.00, y: 280.00, compass: 'W' },
    { id: 'slot_5', index: 5, angleDeg: 225, angleRad: 3.9270, x: 174.09, y: 229.09, compass: 'NW' },
    { id: 'slot_6', index: 6, angleDeg: 270, angleRad: 4.7124, x: 225.00, y: 208.00, compass: 'N' },
    { id: 'slot_7', index: 7, angleDeg: 315, angleRad: 5.4978, x: 275.91, y: 229.09, compass: 'NE' }
  ],
  bench: [
    { id: 'bench_0', index: 0, x: 65, y: 520 },
    { id: 'bench_1', index: 1, x: 135, y: 520 },
    { id: 'bench_2', index: 2, x: 205, y: 520 },
    { id: 'bench_3', index: 3, x: 275, y: 520 }
  ],
  recycleSlot: { id: 'recycle', x: 378, y: 520, radius: 24, refundPercent: 0.70 },
  portals: [
    { id: 'portal_north', angleDeg: 270, angleRad: -Math.PI / 2, x: 225.0, y: 105.0, name: 'Main Warp Gate' }
  ]
};

export const TIERS = [
  { tier: 1, badge: 'T1', border: '#D97706', glow: 'rgba(217, 119, 6, 0.20)',   dpsMult: 1.00, rangeBonus: 0,  label: 'T1 Bronze' },
  { tier: 2, badge: 'T2', border: '#94A3B8', glow: 'rgba(148, 163, 184, 0.22)', dpsMult: 2.25, rangeBonus: 15, label: 'T2 Steel' },
  { tier: 3, badge: 'T3', border: '#F59E0B', glow: 'rgba(245, 158, 11, 0.25)',  dpsMult: 5.10, rangeBonus: 30, label: 'T3 Gold' },
  { tier: 4, badge: 'T4', border: '#38BDF8', glow: 'rgba(56, 189, 248, 0.30)',  dpsMult: 11.5, rangeBonus: 45, label: 'T4 Cobalt' },
  { tier: 5, badge: 'T5', border: '#818CF8', glow: 'rgba(129, 140, 248, 0.35)', dpsMult: 26.0, rangeBonus: 60, label: 'T5 Void' },
  { tier: 6, badge: 'T6', border: '#F43F5E', glow: 'rgba(244, 63, 94, 0.40)',   dpsMult: 60.0, rangeBonus: 80, label: 'T6 Overdrive' }
];

export const ARCHETYPES = {
  ballista_archer: {
    id: 'ballista_archer',
    name: 'Ballista Railgun',
    role: 'Tungsten Sniper',
    color: '#D97706',
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
    name: 'Siege Mortar',
    role: 'Artillery Plasma',
    color: '#EA580C',
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
    name: 'Tesla Pylon',
    role: 'Superconductor Arcs',
    color: '#6366F1',
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
    name: 'Cryo Emitter',
    role: 'Permafrost Field',
    color: '#38BDF8',
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
    name: 'Vibro Interceptor',
    role: 'Carbon Armor Shredder',
    color: '#E11D48',
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
  void_crawler:   { id: 'void_crawler',   name: 'Void Crawler',   baseHp: 110,  speedDeg: 42, armor: 0.00, coreDmg: 15, gold: 4,   radius: 12, color: '#78716C' },
  swift_dart:     { id: 'swift_dart',     name: 'Swift Dart',     baseHp: 65,   speedDeg: 85, armor: 0.00, coreDmg: 12, gold: 5,   radius: 10, color: '#BE123C' },
  armored_bruiser:{ id: 'armored_bruiser',name: 'Armored Bruiser',baseHp: 420,  speedDeg: 26, armor: 0.40, coreDmg: 35, gold: 14,  radius: 18, color: '#B45309' },
  swarm_pod:      { id: 'swarm_pod',      name: 'Swarm Pod',      baseHp: 240,  speedDeg: 36, armor: 0.00, coreDmg: 20, gold: 12,  radius: 16, color: '#4D7C0F', splitCount: 5 },
  void_mite:      { id: 'void_mite',      name: 'Void Mite',      baseHp: 35,   speedDeg: 72, armor: 0.00, coreDmg: 6,  gold: 2,   radius: 6,  color: '#65A30D' },
  void_slinger:   { id: 'void_slinger',   name: 'Void Slinger',   baseHp: 300,  speedDeg: 28, armor: 0.10, coreDmg: 25, gold: 16,  radius: 14, color: '#4338CA', shootCooldown: 4.5 },
  iron_colossus:  { id: 'iron_colossus',  name: 'Iron Colossus',  baseHp: 5500, speedDeg: 20, armor: 0.25, coreDmg: 60, gold: 80,  radius: 30, color: '#334155' },
  hydra_queen:    { id: 'hydra_queen',    name: 'Hydra Queen',    baseHp: 14000,speedDeg: 24, armor: 0.00, coreDmg: 70, gold: 140, radius: 32, color: '#065F46' },
  chrono_wraith:  { id: 'chrono_wraith',  name: 'Chrono Wraith',  baseHp: 32000,speedDeg: 28, armor: 0.00, coreDmg: 80, gold: 200, radius: 34, color: '#312E81' }
};

export const WORKSHOP_DEFS = [
  { id: 'nexus_hull',         name: 'Nexus Hull Integrity', baseCost: 80,  costScale: 1.45, maxLevel: 10, effect: 20,   stat: 'maxHp',       unit: ' HP' },
  { id: 'rapid_overclock',    name: 'Rapid Overclock',      baseCost: 120, costScale: 1.55, maxLevel: 10, effect: 0.04, stat: 'attackSpeed', unit: '% SPD' },
  { id: 'starting_treasury',  name: 'Starting Treasury',    baseCost: 60,  costScale: 1.35, maxLevel: 10, effect: 15,   stat: 'startGold',   unit: ' Gold' },
  { id: 'hyper_crit',         name: 'Hyper-Critical Focus', baseCost: 150, costScale: 1.65, maxLevel: 8,  effect: 0.03, stat: 'critChance',  unit: '% Crit' },
  { id: 'salvage_efficiency', name: 'Salvage Efficiency',   baseCost: 100, costScale: 1.50, maxLevel: 5,  effect: 0.05, stat: 'goldBonus',   unit: '% Gold' }
];

export const DIRECTIVES = [
  {
    id: 'cryo_shatter',
    name: 'Cryo Shatter',
    desc: 'Frozen enemies shatter on defeat, dealing 60 AoE Cryo DMG to nearby hostiles and slowing them.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/></svg>`,
    tag: 'OFFENSIVE'
  },
  {
    id: 'tesla_cascade',
    name: 'Tesla Overload',
    desc: 'Tesla Pylons chain to +2 additional targets and trigger an electric micro-shockwave.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z"/></svg>`,
    tag: 'SYNERGY'
  },
  {
    id: 'rail_piercer',
    name: 'Depleted Core',
    desc: 'Ballista Railguns gain +1 permanent pierce and ignore 50% of enemy armor.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>`,
    tag: 'OFFENSIVE'
  },
  {
    id: 'napalm_cluster',
    name: 'Napalm Shells',
    desc: 'Siege Mortar leaves burning napalm pools on impact for 4.0s with +50% burn DPS.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
    tag: 'OFFENSIVE'
  },
  {
    id: 'shadow_vortex',
    name: 'Vibro Phase Drive',
    desc: 'Vibro Interceptors gain +35% attack speed and +15% critical strike chance.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    tag: 'CRITICAL'
  },
  {
    id: 'interest_treasury',
    name: 'Compound Treasury',
    desc: 'Earn +10% interest on unspent Credits at the end of each wave (up to +25G).',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    tag: 'ECONOMY'
  },
  {
    id: 'overclock_protocol',
    name: 'Kinetic Overclock',
    desc: 'All Sentinels attack 20% faster, and Ion Strike cooldown is reduced by 4.0s.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    tag: 'TACTICAL'
  },
  {
    id: 'aegis_emergency',
    name: 'Aegis Deflector',
    desc: 'When Core HP drops below 35%, automatically deploys a barrier absorbing 100 DMG.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    tag: 'DEFENSE'
  }
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

export function distanceToLineSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return MathUtils.distance(px, py, x1, y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return MathUtils.distance(px, py, x1 + t * (x2 - x1), y1 + t * (y2 - y1));
}

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

export function drawCosmicBackground(ctx, width, height, animTime, stars, assetMgr = assets) {
  // Distant Deep Space Tactical Starfield
  ctx.save();
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#06090F');
  bgGrad.addColorStop(0.5, '#0A0E17');
  bgGrad.addColorStop(1, '#080C14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Curated Kenney Cosmic Sprite Background Texture Overlay
  if (assetMgr && assetMgr.isLoaded('bg_cosmic') && typeof ctx.drawImage === 'function') {
    const bgImg = assetMgr.get('bg_cosmic');
    ctx.save();
    ctx.globalAlpha = 0.35;
    try {
      const bgPattern = ctx.createPattern ? ctx.createPattern(bgImg, 'repeat') : null;
      if (bgPattern) {
        ctx.fillStyle = bgPattern;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.drawImage(bgImg, 0, 0, width, height);
      }
    } catch (e) {
      ctx.drawImage(bgImg, 0, 0, width, height);
    }
    ctx.restore();
  }

  // Subtle tactical coordinate grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
  const gridSize = 45;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Tactical star dust
  if (Array.isArray(stars)) {
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = 0.3 + Math.sin(animTime * (s.speed || 1) + (s.phase || 0)) * 0.3;
      ctx.fillStyle = s.color || '#94A3B8';
      ctx.globalAlpha = twinkle * 0.7;
      ctx.fillRect(s.x, s.y, s.size || 1, s.size || 1);
    }
  }
  ctx.restore();
}

export function drawArenaGrid(ctx, xc, yc, animTime) {
  ctx.save();

  // 1. Orbital Defense Incursion Track (Subtle industrial spiral)
  ctx.save();
  const startAngle = -Math.PI / 2; // North Warp Gate (225, 105)
  const totalRotations = 1.35 * Math.PI * 2; // ~485 degrees loop
  const steps = 80;

  // A. Matte Highway Track
  ctx.lineWidth = 14;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = ARENA.spawnRadius - (ARENA.spawnRadius - ARENA.innerHazardRadius) * t;
    const a = startAngle + totalRotations * t;
    const px = xc + Math.cos(a) * r;
    const py = yc + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // B. Tactical Guide Rail with subtle tick marks
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.setLineDash([6, 10]);
  ctx.lineDashOffset = -animTime * 18;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = ARENA.spawnRadius - (ARENA.spawnRadius - ARENA.innerHazardRadius) * t;
    const a = startAngle + totalRotations * t;
    const px = xc + Math.cos(a) * r;
    const py = yc + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 2. Defense Bastion Perimeter Ring (Connecting the 8 Defense Slots)
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.20)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(xc, yc, ARENA.orbitRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Inner Core Breach Danger Ring
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(xc, yc, ARENA.innerHazardRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. North Spawn Warp Gate - Heavy Industrial Ring
  const portal = ARENA.portals[0];
  if (portal) {
    ctx.save();
    ctx.translate(portal.x, portal.y);
    
    // Heavy gunmetal collar
    ctx.fillStyle = '#141B2B';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rotating containment ring
    ctx.rotate(animTime * 1.5);
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 10, Math.PI, Math.PI * 1.7);
    ctx.stroke();

    // Core singularity
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 5. Standby Bench Rail (Bottom)
  ctx.fillStyle = '#0E1420';
  ctx.strokeStyle = '#243047';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, 24, 478, 402, 74, 10);
  ctx.fill();
  ctx.stroke();

  // Bench Header Strip
  ctx.font = 'bold 8.5px Orbitron, sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.textAlign = 'left';
  ctx.fillText('STANDBY BENCH', 36, 492);

  ctx.fillStyle = '#F59E0B';
  ctx.textAlign = 'right';
  ctx.fillText('RECYCLE 70%', 414, 492);

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

  // 1. Heavy Tokamak Generator Base
  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = isDamaged ? '#EF4444' : '#334155';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 2. Rotating Segmented Armor Brackets
  ctx.save();
  ctx.rotate(-animTime * 0.3);
  const outerSegments = 6;
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = isDamaged ? '#DC2626' : '#1E293B';
  for (let i = 0; i < outerSegments; i++) {
    const startAngle = (i * Math.PI * 2) / outerSegments + 0.12;
    const endAngle = ((i + 1) * Math.PI * 2) / outerSegments - 0.12;
    ctx.beginPath();
    ctx.arc(0, 0, 38, startAngle, endAngle);
    ctx.stroke();

    const midAngle = (startAngle + endAngle) / 2;
    ctx.fillStyle = isSurging ? '#F59E0B' : '#64748B';
    ctx.beginPath();
    ctx.arc(Math.cos(midAngle) * 38, Math.sin(midAngle) * 38, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Inner Magnetic Containment Torus
  ctx.save();
  ctx.rotate(animTime * 0.5);
  const innerSegments = 4;
  ctx.lineWidth = 2;
  ctx.strokeStyle = isSurging ? '#F59E0B' : '#94A3B8';
  for (let i = 0; i < innerSegments; i++) {
    const startAngle = (i * Math.PI * 2) / innerSegments + 0.18;
    const endAngle = ((i + 1) * Math.PI * 2) / innerSegments - 0.18;
    ctx.beginPath();
    ctx.arc(0, 0, 26, startAngle, endAngle);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Central Solar Fusion Core
  const coreGrad = ctx.createRadialGradient(-3, -3, 1, 0, 0, 18);
  if (hpPercent > 0.3) {
    coreGrad.addColorStop(0, '#FFFBEB');
    coreGrad.addColorStop(0.4, '#FDE68A');
    coreGrad.addColorStop(0.7, '#F59E0B');
    coreGrad.addColorStop(1, '#B45309');
  } else {
    coreGrad.addColorStop(0, '#FEE2E2');
    coreGrad.addColorStop(0.4, '#F87171');
    coreGrad.addColorStop(0.8, '#DC2626');
    coreGrad.addColorStop(1, '#7F1D1D');
  }

  ctx.fillStyle = coreGrad;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 16 + Math.sin(animTime * 4) * 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 5. HP Arc Indicator Ring
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.9)';
  ctx.beginPath();
  ctx.arc(0, 0, 45, 0, Math.PI * 2);
  ctx.stroke();

  const hpArcLength = Math.PI * 2 * Math.max(0, Math.min(1, hpPercent));
  ctx.strokeStyle = hpPercent > 0.5 ? '#10B981' : hpPercent > 0.25 ? '#F59E0B' : '#EF4444';
  ctx.beginPath();
  ctx.arc(0, 0, 45, -Math.PI / 2, -Math.PI / 2 + hpArcLength);
  ctx.stroke();

  ctx.restore();
}

export function drawSlotPad(ctx, slot, isOccupied = false, isHighlighted = false, isHovered = false) {
  ctx.save();
  ctx.translate(slot.x, slot.y);

  if (slot.id === 'recycle') {
    // Recycle Bin Pad
    ctx.fillStyle = isHovered ? 'rgba(239, 68, 68, 0.25)' : '#0E1420';
    ctx.strokeStyle = isHovered ? '#EF4444' : '#7F1D1D';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, slot.radius || 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 9px Orbitron, sans-serif';
    ctx.fillStyle = isHovered ? '#EF4444' : '#DC2626';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRAP', 0, 0);
    ctx.restore();
    return;
  }

  // Regular Slot Pad (Machined Tungsten Launch Pad)
  ctx.fillStyle = isOccupied ? '#141B2B' : '#0E1420';
  ctx.strokeStyle = isHovered ? '#F59E0B' : isHighlighted ? '#D97706' : '#243047';
  ctx.lineWidth = isHovered ? 2.2 : 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Corner Rivets on Pad
  ctx.fillStyle = '#64748B';
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + Math.PI / 4;
    ctx.fillRect(Math.cos(a) * 16 - 1, Math.sin(a) * 16 - 1, 2, 2);
  }

  if (!isOccupied) {
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}

export function drawTargetReticle(ctx, enemy, animTime) {
  if (!enemy || enemy.hp <= 0) return;
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  ctx.rotate(animTime * 2.8);

  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2.0;
  const r = (enemy.radius || 12) + 8;
  
  // 4 corner reticle brackets
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.save();
    ctx.rotate(a);
    ctx.beginPath();
    ctx.arc(0, 0, r, -0.3, 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(r - 4, 0);
    ctx.lineTo(r + 5, 0);
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawResonanceLinks(ctx, sentinels, animTime) {
  // Check adjacent ring slots
  for (let i = 0; i < 8; i++) {
    const slotA = `slot_${i}`;
    const slotB = `slot_${(i + 1) % 8}`;
    const s1 = sentinels.get(slotA);
    const s2 = sentinels.get(slotB);
    if (!s1 || !s2) continue;

    const combo = [s1.archetype, s2.archetype].sort().join('+');
    let linkColor = null;

    if (combo === 'arcane_mage+ballista_archer') {
      linkColor = 'rgba(56, 189, 248, ';
    } else if (combo === 'frost_warden+heavy_cannon') {
      linkColor = 'rgba(96, 165, 250, ';
    } else if (combo === 'ballista_archer+shadow_assassin') {
      linkColor = 'rgba(244, 63, 94, ';
    } else if (combo === 'arcane_mage+frost_warden') {
      linkColor = 'rgba(129, 140, 248, ';
    }

    if (linkColor) {
      const pulse = 0.5 + Math.sin(animTime * 8 + i) * 0.35;
      ctx.save();
      ctx.strokeStyle = linkColor + pulse + ')';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(s1.x, s1.y);
      ctx.lineTo(s2.x, s2.y);
      ctx.stroke();

      // Energy particles along the link
      const midT = (animTime * 2.2 + i * 0.25) % 1;
      const px = s1.x + (s2.x - s1.x) * midT;
      const py = s1.y + (s2.y - s1.y) * midT;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
}

export function drawSentinelPlatform(ctx, x, y, tier = 1, isSelected = false, isMergeTarget = false) {
  const tierInfo = TIERS[Math.min(tier - 1, 5)];
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#141B2B';
  ctx.strokeStyle = tierInfo.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner mechanical ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.stroke();

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

  // Curated Sprite with Tier Glow Tint
  const spriteLoaded = assets.isLoaded('sentinel_ballista') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    // Soft tier aura
    ctx.save();
    ctx.fillStyle = tierInfo.glow || 'rgba(217, 119, 6, 0.25)';
    ctx.beginPath();
    ctx.arc(-kick, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Sprite centered and rotated (+90 deg to face right along angle)
    ctx.save();
    ctx.translate(-kick, 0);
    ctx.rotate(Math.PI / 2);
    const img = assets.get('sentinel_ballista');
    ctx.drawImage(img, -17, -17, 34, 34);
    ctx.restore();
  } else {
    // Procedural Angular Sentry Chassis Fallback
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
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.2;
    drawRoundRect(ctx, 0 - kick, -6, barrelLength, 3.5, 1);
    ctx.fill();
    ctx.stroke();
    drawRoundRect(ctx, 0 - kick, 2.5, barrelLength, 3.5, 1);
    ctx.fill();
    ctx.stroke();
  }

  // Procedural Weapon Energy Effects (Preserved on both Sprite & Procedural)
  const barrelLength = 16 + Math.min(tier, 5) * 2;

  // Amber Magnetic Acceleration Coils
  const coilCount = 2 + Math.min(tier, 4);
  ctx.fillStyle = '#D97706';
  for (let i = 0; i < coilCount; i++) {
    const cx = 4 + i * 4 - kick;
    ctx.fillRect(cx, -6.5, 1.8, 13);
  }

  // Power Core
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(0 - kick, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Laser Sight Beam
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(barrelLength - kick, 0);
  ctx.lineTo(barrelLength + 70, 0);
  ctx.stroke();
  ctx.setLineDash([]);

  // Recoil Flash
  if (recoil > 0.1) {
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(barrelLength - kick + 2, 0, 3 + recoil * 2.5, 0, Math.PI * 2);
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
  const kick = recoil * 6;
  const barrelLen = 14 + Math.min(tier, 5) * 2;
  const barrelRadius = 6 + Math.min(tier, 4) * 0.8;

  // Curated Sprite with Tier Glow Tint
  const spriteLoaded = assets.isLoaded('sentinel_cannon') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    // Soft tier aura
    ctx.save();
    ctx.fillStyle = tierInfo.glow || 'rgba(234, 88, 12, 0.25)';
    ctx.beginPath();
    ctx.arc(-kick, 0, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Sprite centered and rotated (+90 deg to face right along angle)
    ctx.save();
    ctx.translate(-kick, 0);
    ctx.rotate(Math.PI / 2);
    const img = assets.get('sentinel_cannon');
    ctx.drawImage(img, -18, -18, 36, 36);
    ctx.restore();
  } else {
    // Procedural Armored Chassis Fallback
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = tierInfo.border;
    ctx.lineWidth = 2.2;
    drawRoundRect(ctx, -12 - kick, -14, 22, 28, 4);
    ctx.fill();
    ctx.stroke();

    // Cylindrical Mortar Barrel
    const barrelGrad = ctx.createLinearGradient(0, -barrelRadius, 0, barrelRadius);
    barrelGrad.addColorStop(0, '#64748B');
    barrelGrad.addColorStop(0.5, '#1E293B');
    barrelGrad.addColorStop(1, '#0F172A');
    ctx.fillStyle = barrelGrad;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.8;
    drawRoundRect(ctx, -2 - kick, -barrelRadius, barrelLen, barrelRadius * 2, 3);
    ctx.fill();
    ctx.stroke();
  }

  // Procedural Magma Core & Heat Effects (Preserved on both Sprite & Procedural)
  const heatPulse = 0.7 + Math.sin(animTime * 6) * 0.3;
  const magmaGrad = ctx.createRadialGradient(-3 - kick, 0, 1, -3 - kick, 0, 7);
  magmaGrad.addColorStop(0, '#FFFBEB');
  magmaGrad.addColorStop(0.3, '#F59E0B');
  magmaGrad.addColorStop(0.7, `rgba(234, 88, 12, ${heatPulse})`);
  magmaGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
  ctx.fillStyle = magmaGrad;
  ctx.beginPath();
  ctx.arc(-3 - kick, 0, 6, 0, Math.PI * 2);
  ctx.fill();

  if (recoil > 0.1) {
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.arc(barrelLen + 3 - kick, 0, 4 + recoil * 5, 0, Math.PI * 2);
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
  ctx.strokeStyle = '#6366F1';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(0, 6, 14, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Preserved Revolving Glyphs / Shards
  const shardCount = 2 + Math.min(tier, 4);
  for (let i = 0; i < shardCount; i++) {
    const shardAngle = animTime * 2.5 + (i * Math.PI * 2) / shardCount;
    const sx = Math.cos(shardAngle) * 15;
    const sy = Math.sin(shardAngle) * 7 - 4 + hoverBob;
    ctx.fillStyle = '#C7D2FE';
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx, sy - 3.5);
    ctx.lineTo(sx + 2.5, sy);
    ctx.lineTo(sx, sy + 3.5);
    ctx.lineTo(sx - 2.5, sy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Floating Obelisk / Curated Sprite
  ctx.save();
  ctx.translate(0, -6 + hoverBob);
  ctx.rotate(angle * 0.2);

  const spriteLoaded = assets.isLoaded('sentinel_mage') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    // Arcane aura
    ctx.fillStyle = tierInfo.glow || 'rgba(99, 102, 241, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    const img = assets.get('sentinel_mage');
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -16, -16, 32, 32);
    ctx.restore();
  } else {
    // Procedural Floating Obelisk Fallback
    const obeliskGrad = ctx.createLinearGradient(-7, -16, 7, 16);
    obeliskGrad.addColorStop(0, '#EEF2FF');
    obeliskGrad.addColorStop(0.4, '#818CF8');
    obeliskGrad.addColorStop(0.8, '#4338CA');
    obeliskGrad.addColorStop(1, '#312E81');
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
  }

  if (isFiring) {
    ctx.strokeStyle = '#E0E7FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo((Math.random() - 0.5) * 10, -20);
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

  // Rotating Cryo Torus
  ctx.save();
  ctx.rotate(animTime * 0.8);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const px = Math.cos(angle) * 15;
    const py = Math.sin(angle) * 15;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  // Snowflake Core
  ctx.save();
  ctx.rotate(-animTime * 1.2);
  ctx.strokeStyle = '#F0F9FF';
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * -11, Math.sin(a) * -11);
    ctx.lineTo(Math.cos(a) * 11, Math.sin(a) * 11);
    ctx.stroke();
  }
  ctx.restore();

  // Curated Sprite or Crystal Diamond
  const spriteLoaded = assets.isLoaded('sentinel_frost') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    ctx.fillStyle = tierInfo.glow || 'rgba(56, 189, 248, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    const img = assets.get('sentinel_frost');
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -17, -17, 34, 34);
    ctx.restore();
  } else {
    // Center Crystal Diamond Fallback
    const iceGrad = ctx.createRadialGradient(-2, -2, 1, 0, 0, 8);
    iceGrad.addColorStop(0, '#FFFFFF');
    iceGrad.addColorStop(0.4, '#7DD3FC');
    iceGrad.addColorStop(0.8, '#0284C7');
    iceGrad.addColorStop(1, '#0C4A6E');
    ctx.fillStyle = iceGrad;
    ctx.strokeStyle = tierInfo.border;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(6, 0);
    ctx.lineTo(0, 8);
    ctx.lineTo(-6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

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

  const spriteLoaded = assets.isLoaded('sentinel_assassin') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    // Shadow tier glow
    ctx.fillStyle = tierInfo.glow || 'rgba(225, 29, 72, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    const img = assets.get('sentinel_assassin');
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -17, -17, 34, 34);
    ctx.restore();
  } else {
    // Stealth Delta Wing (Carbon Fiber) Fallback
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
  }

  // Spinning Vibro Chakrams (Preserved on both)
  for (let side of [-1, 1]) {
    ctx.save();
    ctx.translate(2, side * 11);
    ctx.rotate(spinAngle * side);
    const bladeGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 6);
    bladeGrad.addColorStop(0, '#FFE4E6');
    bladeGrad.addColorStop(0.5, '#E11D48');
    bladeGrad.addColorStop(1, '#881337');
    ctx.fillStyle = bladeGrad;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let p = 0; p < 3; p++) {
      const pa = (p * Math.PI * 2) / 3;
      const ox = Math.cos(pa) * 6;
      const oy = Math.sin(pa) * 6;
      const ix = Math.cos(pa + Math.PI / 3) * 2;
      const iy = Math.sin(pa + Math.PI / 3) * 2;
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
  ctx.ellipse(4, 0, 3.5, 1.8, 0, 0, Math.PI * 2);
  ctx.fill();

  if (isSlashing) {
    ctx.strokeStyle = 'rgba(225, 29, 72, 0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 18, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
  }
  ctx.restore();

  drawTierBadge(ctx, 0, 0, tier);
  ctx.restore();
}

export function drawSentinelTurret(ctx, x, y, archetype, state = {}) {
  // Support flexible signature (ctx, sentinel, animTime, isSelected, isMergeTarget)
  if (typeof x === 'object' && x !== null) {
    const sentinel = x;
    const animTime = y || 0;
    const isSelected = !!archetype;
    const isMergeTarget = !!state;
    return drawSentinel(ctx, sentinel, animTime, isSelected, isMergeTarget);
  }

  const sState = {
    angle: state.angle || 0,
    tier: state.tier || 1,
    recoil: state.recoil || 0,
    charging: state.charging || 0,
    animTime: state.animTime || 0,
    isFiring: state.isFiring || false,
    isSlashing: state.isSlashing || false,
    isSelected: state.isSelected || false,
    isMergeTarget: state.isMergeTarget || false,
    scaleAnim: state.scaleAnim || 1.0
  };

  switch (archetype) {
    case 'ballista_archer': drawBallistaArcher(ctx, x, y, sState); break;
    case 'heavy_cannon':    drawHeavyCannon(ctx, x, y, sState); break;
    case 'arcane_mage':     drawArcaneMage(ctx, x, y, sState); break;
    case 'frost_warden':    drawFrostWarden(ctx, x, y, sState); break;
    case 'shadow_assassin': drawShadowAssassin(ctx, x, y, sState); break;
    default:
      drawSentinelPlatform(ctx, x, y, sState.tier, sState.isSelected, sState.isMergeTarget);
      drawTierBadge(ctx, x, y, sState.tier);
      break;
  }
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

  drawSentinelTurret(ctx, sentinel.x, sentinel.y, sentinel.archetype, state);
}

/* Void Invaders Renderers */
export function drawVoidCrawler(ctx, x, y, state = {}) {
  const { angle = 0, animTime = 0, isChilled = false } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Scuttling Legs (Preserved on both)
  ctx.strokeStyle = isChilled ? '#38BDF8' : '#57534E';
  ctx.lineWidth = 1.6;
  const legSpeed = isChilled ? 6 : 14;
  for (let i = 0; i < 3; i++) {
    const sideOffset = (i - 1) * 6;
    const legPhase = Math.sin(animTime * legSpeed + i * 1.8);
    ctx.beginPath();
    ctx.moveTo(-4 + sideOffset, -6);
    ctx.lineTo(-10 + sideOffset, -11 + legPhase * 2.5);
    ctx.lineTo(-15 + sideOffset, -7 + legPhase * 3.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-4 + sideOffset, 6);
    ctx.lineTo(-10 + sideOffset, 11 - legPhase * 2.5);
    ctx.lineTo(-15 + sideOffset, 7 - legPhase * 3.5);
    ctx.stroke();
  }

  const spriteLoaded = assets.isLoaded('enemy_crawler') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    const img = assets.get('enemy_crawler');
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -13, -13, 26, 26);
    ctx.restore();

    if (isChilled) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Dark Chitin Carapace Fallback
    ctx.fillStyle = '#292524';
    ctx.strokeStyle = isChilled ? '#38BDF8' : '#78716C';
    ctx.lineWidth = 1.6;
    drawRoundRect(ctx, -10, -8, 20, 16, 5);
    ctx.fill();
    ctx.stroke();
  }

  // Amber Optic Sensor
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(6, 0, 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawSwiftDart(ctx, x, y, state = {}) {
  const { angle = 0, animTime = 0, isChilled = false } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Twin Thruster Plasma Trails (Preserved on both)
  const jetFlicker = 6 + Math.sin(animTime * 25) * 3;
  ctx.fillStyle = isChilled ? 'rgba(56, 189, 248, 0.5)' : 'rgba(234, 88, 12, 0.65)';
  ctx.beginPath();
  ctx.moveTo(-9, -4);
  ctx.lineTo(-9 - jetFlicker, -4);
  ctx.lineTo(-7, -2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-9, 4);
  ctx.lineTo(-9 - jetFlicker, 4);
  ctx.lineTo(-7, 2);
  ctx.closePath();
  ctx.fill();

  const spriteLoaded = assets.isLoaded('enemy_dart') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    const img = assets.get('enemy_dart');
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -14, -14, 28, 28);
    ctx.restore();

    if (isChilled) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Aerodynamic Chitin Body Fallback
    ctx.fillStyle = '#4C0519';
    ctx.strokeStyle = isChilled ? '#38BDF8' : '#BE123C';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-8, -12);
    ctx.lineTo(-4, -4);
    ctx.lineTo(-12, 0);
    ctx.lineTo(-4, 4);
    ctx.lineTo(-8, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

export function drawArmoredBruiser(ctx, x, y, state = {}) {
  const { angle = 0, animTime = 0, isChilled = false } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const spriteLoaded = assets.isLoaded('enemy_bruiser') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    const img = assets.get('enemy_bruiser');
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -17, -17, 34, 34);
    ctx.restore();

    if (isChilled) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 17, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Heavy Chitin Armored Shell Fallback
    ctx.fillStyle = '#1C1917';
    ctx.strokeStyle = isChilled ? '#38BDF8' : '#78716C';
    ctx.lineWidth = 2.2;
    drawRoundRect(ctx, -16, -14, 30, 28, 8);
    ctx.fill();
    ctx.stroke();

    // Segmented Carapace Ridge
    ctx.strokeStyle = '#44403C';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-8, -12);
    ctx.lineTo(-8, 12);
    ctx.moveTo(2, -12);
    ctx.lineTo(2, 12);
    ctx.stroke();
  }

  // Amber Weakpoint Core (Preserved)
  const corePulse = 0.6 + Math.sin(animTime * 4) * 0.4;
  ctx.fillStyle = `rgba(217, 119, 6, ${corePulse})`;
  ctx.beginPath();
  ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Heavy Mandible Horns
  ctx.fillStyle = '#57534E';
  ctx.beginPath();
  ctx.moveTo(12, -9);
  ctx.lineTo(19, -13);
  ctx.lineTo(13, -5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(12, 9);
  ctx.lineTo(19, 13);
  ctx.lineTo(13, 5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawSwarmPod(ctx, x, y, state = {}) {
  const { angle = 0, animTime = 0, isChilled = false } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const pulse = Math.sin(animTime * 6) * 1.2;
  const spriteLoaded = assets.isLoaded('enemy_swarm') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    const img = assets.get('enemy_swarm');
    ctx.save();
    ctx.rotate(Math.PI / 2);
    const sz = 28 + pulse;
    ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz);
    ctx.restore();

    if (isChilled) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Green Carapace Fallback
    ctx.fillStyle = '#14532D';
    ctx.strokeStyle = isChilled ? '#38BDF8' : '#15803D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 14 + pulse, 11 - pulse * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Preserved Embryo pods
  ctx.fillStyle = '#F59E0B';
  for (let [ex, ey] of [[-5, -3], [0, -4], [4, -2], [-2, 2], [3, 3]]) {
    ctx.beginPath();
    ctx.arc(ex, ey, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawVoidMite(ctx, x, y, state = {}) {
  const { angle = 0 } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const spriteLoaded = assets.isLoaded('enemy_crawler') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    const img = assets.get('enemy_crawler');
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -7, -7, 14, 14);
    ctx.restore();
  } else {
    ctx.fillStyle = '#15803D';
    ctx.strokeStyle = '#052E16';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = '#D97706';
  ctx.beginPath();
  ctx.arc(1.5, 0, 1.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawVoidSlinger(ctx, x, y, state = {}) {
  const { angle = 0, chargeProgress = 0, isChilled = false } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Waving Tentacles (Preserved on both)
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.8;
  for (let a of [-0.6, 0.6, Math.PI]) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 15, Math.sin(a) * 15);
    ctx.stroke();
  }

  const spriteLoaded = assets.isLoaded('enemy_slinger') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    const img = assets.get('enemy_slinger');
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -14, -14, 28, 28);
    ctx.restore();

    if (isChilled) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = '#1E1B4B';
    ctx.strokeStyle = isChilled ? '#38BDF8' : '#6366F1';
    ctx.lineWidth = 2;
    drawRoundRect(ctx, -9, -9, 18, 18, 4);
    ctx.fill();
    ctx.stroke();
  }

  // Preserved Charging Plasma Orb
  const ballSize = 2.5 + chargeProgress * 4.5;
  ctx.fillStyle = '#818CF8';
  ctx.beginPath();
  ctx.arc(3.5, 0, ballSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawIronColossus(ctx, x, y, state = {}) {
  const { angle = 0, animTime = 0, shieldAngle = 0, shieldActive = true, hpPercent = 1.0 } = state;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const spriteLoaded = assets.isLoaded('boss_colossus') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    const img = assets.get('boss_colossus');
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -27, -27, 54, 54);
    ctx.restore();

    if (hpPercent < 0.5) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Heavy Fortress Hull Fallback
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = hpPercent > 0.5 ? '#64748B' : '#EF4444';
    ctx.lineWidth = 3;
    drawRoundRect(ctx, -24, -22, 48, 44, 8);
    ctx.fill();
    ctx.stroke();
  }

  // Preserved Blast Vents Fiery Exhaust
  const heatFlicker = 0.6 + Math.sin(animTime * 8) * 0.4;
  ctx.fillStyle = `rgba(234, 88, 12, ${heatFlicker})`;
  for (let dy of [-12, -4, 4, 12]) {
    ctx.fillRect(-18, dy, 8, 3);
  }

  // Preserved Heavy Power Core
  ctx.fillStyle = '#D97706';
  ctx.beginPath();
  ctx.arc(4, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  // Preserved Rotating Kinetic Barrier Shield
  if (shieldActive) {
    ctx.save();
    ctx.rotate(shieldAngle - angle);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 4;
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

  const spriteLoaded = assets.isLoaded('boss_hydra') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    const img = assets.get('boss_hydra');
    ctx.save();
    ctx.translate(-10, 0);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -26, -26, 52, 52);
    ctx.restore();
  } else {
    // Ovipositor Sac Fallback
    ctx.fillStyle = '#064E3B';
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(-18, 0, 24, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Preserved Twin Serpentine Animated Heads
  const s1 = Math.sin(animTime * 3) * 5;
  const s2 = Math.cos(animTime * 3) * 5;
  for (let head of [-1, 1]) {
    const hy = head * 16 + (head === -1 ? s1 : s2);
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-6, head * 8);
    ctx.quadraticCurveTo(8, hy * 0.6, 22, hy);
    ctx.stroke();

    ctx.fillStyle = '#064E3B';
    ctx.beginPath();
    ctx.arc(22, hy, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(24, hy - 2, 1.8, 0, Math.PI * 2);
    ctx.arc(24, hy + 2, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawChronoWraith(ctx, x, y, state = {}) {
  const { animTime = 0, isBlinking = false } = state;
  ctx.save();
  ctx.translate(x, y);

  // Preserved Rotating Chrono Distortion Ring
  if (!isBlinking) {
    ctx.save();
    ctx.rotate(animTime * 1.5);
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.6)';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const spriteLoaded = assets.isLoaded('boss_chrono') && typeof ctx.drawImage === 'function';
  if (spriteLoaded) {
    const img = assets.get('boss_chrono');
    ctx.save();
    if (isBlinking) ctx.globalAlpha = 0.4;
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -24, -24, 48, 48);
    ctx.restore();
  } else {
    // Shroud Fallback
    ctx.fillStyle = '#312E81';
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Preserved Hourglass Core
  ctx.fillStyle = '#E0E7FF';
  ctx.beginPath();
  ctx.moveTo(-6, -9);
  ctx.lineTo(6, -9);
  ctx.lineTo(-6, 9);
  ctx.lineTo(6, 9);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawEnemyOnPath(ctx, enemy, animTime) {
  const state = {
    angle: enemy.angle || 0,
    animTime,
    hpPercent: Math.max(0, enemy.hp / (enemy.maxHp || 1)),
    isChilled: (enemy.chilledTimer || 0) > 0,
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
    default:
      drawVoidCrawler(ctx, enemy.x, enemy.y, state);
      break;
  }
}

export function drawBossOnArena(ctx, boss, animTime) {
  const state = {
    angle: boss.angle || 0,
    animTime,
    hpPercent: Math.max(0, boss.hp / (boss.maxHp || 1)),
    isChilled: (boss.chilledTimer || 0) > 0,
    shieldAngle: boss.shieldAngle || 0,
    shieldActive: boss.shieldActive !== false,
    chargeProgress: boss.chargeProgress || 0,
    isBlinking: boss.isBlinking || false
  };

  switch (boss.type) {
    case 'iron_colossus': drawIronColossus(ctx, boss.x, boss.y, state); break;
    case 'hydra_queen':   drawHydraQueen(ctx, boss.x, boss.y, state); break;
    case 'chrono_wraith': drawChronoWraith(ctx, boss.x, boss.y, state); break;
    default:
      drawIronColossus(ctx, boss.x, boss.y, state);
      break;
  }
}

export function drawEnemy(ctx, enemy, animTime) {
  if (enemy.isBoss || enemy.type === 'iron_colossus' || enemy.type === 'hydra_queen' || enemy.type === 'chrono_wraith') {
    drawBossOnArena(ctx, enemy, animTime);
  } else {
    drawEnemyOnPath(ctx, enemy, animTime);
  }

  // Enemy Mini Health Bar
  if (enemy.hp < enemy.maxHp) {
    const barW = Math.max(20, (enemy.radius || 12) * 2);
    const hpW = barW * Math.max(0, enemy.hp / enemy.maxHp);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(enemy.x - barW / 2, enemy.y - (enemy.radius || 12) - 8, barW, 3.5);
    ctx.fillStyle = enemy.isBoss ? '#D97706' : '#EF4444';
    ctx.fillRect(enemy.x - barW / 2, enemy.y - (enemy.radius || 12) - 8, hpW, 3.5);
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
      // 1. Try Direct Playgama Bridge Storage
      if (typeof window !== 'undefined' && window.bridge?.storage?.get) {
        const raw = await window.bridge.storage.get(this.STORAGE_KEY);
        if (raw) {
          const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
          if (data && typeof data === 'object') {
            return { ...this.getDefaultSave(), ...data, workshop: { ...this.getDefaultSave().workshop, ...(data.workshop || {}) } };
          }
        }
      }

      // 2. Try Bridge Wrapper
      if (bridge && typeof bridge.getData === 'function') {
        const data = await bridge.getData(this.STORAGE_KEY);
        if (data && typeof data === 'object') {
          return { ...this.getDefaultSave(), ...data, workshop: { ...this.getDefaultSave().workshop, ...(data.workshop || {}) } };
        }
      }

      // 3. Fallback to localStorage
      if (typeof localStorage !== 'undefined') {
        const item = localStorage.getItem(this.STORAGE_KEY);
        if (item) {
          const data = JSON.parse(item);
          if (data && typeof data === 'object') {
            return { ...this.getDefaultSave(), ...data, workshop: { ...this.getDefaultSave().workshop, ...(data.workshop || {}) } };
          }
        }
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
      // 1. Direct Playgama Bridge Storage
      if (typeof window !== 'undefined' && window.bridge?.storage?.set) {
        await window.bridge.storage.set(this.STORAGE_KEY, JSON.stringify(data));
      }

      // 2. Bridge Wrapper
      if (bridge && typeof bridge.setData === 'function') {
        await bridge.setData(this.STORAGE_KEY, data);
      }

      // 3. LocalStorage persistence
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      }
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
    this.assets = assets;

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
    this.activeDirectives = new Set(); // Roguelike build directives
    this.lockedTargetId = null; // Manual focus-fire target lock
    this.hasTriggeredEmergencyAegis = false; // 1x per run shield

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
    this.resonanceLaserTimer = 0;

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
        color: Math.random() < 0.3 ? '#94A3B8' : Math.random() < 0.6 ? '#F59E0B' : '#FFFFFF',
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

    this.initTitleShips();
  }

  initTitleShips() {
    const sprites = [
      'sentinel_ballista', 'sentinel_cannon', 'sentinel_mage', 'sentinel_frost', 'sentinel_assassin',
      'enemy_crawler', 'enemy_dart', 'enemy_bruiser', 'enemy_swarm', 'enemy_slinger',
      'boss_colossus', 'boss_hydra', 'boss_chrono'
    ];
    this.titleShips = [];
    for (let i = 0; i < 12; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 10 + Math.random() * 16;
      this.titleShips.push({
        spriteKey: sprites[i % sprites.length],
        x: Math.random() * ARENA.width,
        y: Math.random() * ARENA.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle: angle + Math.PI / 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        scale: 0.35 + Math.random() * 0.22,
        alpha: 0.60 + Math.random() * 0.35,
        bobPhase: Math.random() * Math.PI * 2,
        bobSpeed: 0.8 + Math.random() * 1.2,
        trailTimer: 0
      });
    }
  }

  updateTitleShips(dt) {
    if (!this.titleShips || this.titleShips.length === 0) {
      this.initTitleShips();
    }
    for (const ship of this.titleShips) {
      ship.x += ship.vx * dt;
      ship.y += ship.vy * dt + Math.sin(this.animTime * ship.bobSpeed + ship.bobPhase) * 0.25;
      ship.angle += ship.rotSpeed * dt;

      // Screen wrapping with generous padding
      const pad = 50;
      if (ship.x < -pad) ship.x = ARENA.width + pad;
      if (ship.x > ARENA.width + pad) ship.x = -pad;
      if (ship.y < -pad) ship.y = ARENA.height + pad;
      if (ship.y > ARENA.height + pad) ship.y = -pad;

      // Subtle engine thrust dust particles
      ship.trailTimer = (ship.trailTimer || 0) + dt;
      if (ship.trailTimer > 0.12 && Math.random() < 0.4) {
        ship.trailTimer = 0;
        const trailDist = 16 * ship.scale;
        const tx = ship.x - Math.cos(ship.angle - Math.PI / 2) * trailDist;
        const ty = ship.y - Math.sin(ship.angle - Math.PI / 2) * trailDist;
        this.particles.dust(tx, ty, 1, 'rgba(56, 189, 248, 0.4)');
      }
    }
  }

  drawTitleFloatingFleet(ctx) {
    if (!this.titleShips) return;
    for (const ship of this.titleShips) {
      ctx.save();
      ctx.globalAlpha = ship.alpha;
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);

      // Atmospheric engine thrust glow
      const glowGrad = ctx.createRadialGradient(0, 10 * ship.scale, 2, 0, 10 * ship.scale, 18 * ship.scale);
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      glowGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 10 * ship.scale, 18 * ship.scale, 0, Math.PI * 2);
      ctx.fill();

      // Render ship sprite with fallback
      if (this.assets && this.assets.isLoaded(ship.spriteKey)) {
        this.assets.drawSprite(ctx, ship.spriteKey, 0, 0, ship.scale, ship.scale, 0);
      } else {
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(0, 0, 14 * ship.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
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

  async showInterstitialAd() {
    const prevState = this.state;
    this.state = 'PAUSED';
    const wasMuted = this.audio.isMuted;
    this.audio.setMuted(true);

    try {
      await this.playgama.showInterstitial();
    } catch (e) {
      console.warn('Interstitial ad error:', e);
    } finally {
      this.audio.setMuted(wasMuted);
      if (prevState === 'PLAYING') {
        this.state = 'PLAYING';
      }
    }
  }

  async showRewardedAd(onRewardedCallback) {
    const prevState = this.state;
    this.state = 'PAUSED';
    const wasMuted = this.audio.isMuted;
    this.audio.setMuted(true);

    try {
      await this.playgama.showRewarded(onRewardedCallback);
    } catch (e) {
      console.warn('Rewarded ad error:', e);
    } finally {
      this.audio.setMuted(wasMuted);
      if (prevState === 'PLAYING') {
        this.state = 'PLAYING';
      }
    }
  }

  updateMuteButtonUI() {
    const btnMute = document.getElementById('btn-mute');
    if (btnMute) {
      if (this.audio.isMuted) {
        btnMute.innerHTML = `
          <svg class="ui-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
        `;
        btnMute.setAttribute('title', 'Unmute Audio');
      } else {
        btnMute.innerHTML = `
          <svg class="ui-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        `;
        btnMute.setAttribute('title', 'Mute Audio');
      }
    }
  }

  async init() {
    try {
      await this.assets.loadAll(ASSET_PATHS);
    } catch (e) {
      console.warn('Asset preloading note:', e);
    }

    await this.playgama.init();
    this.saveData = await SaveManager.load(this.playgama);

    // Initial Host Platform Audio Permission Check (Playgama Official SDK)
    const platformAudioEnabled = this.playgama.isAudioEnabled();
    const userMuted = this.saveData.settings?.isMuted || false;
    this.audio.setMuted(!platformAudioEnabled || userMuted);

    this.applyWorkshopStats();
    this.setupDOM();
    this.setupEvents();

    // Listen for host platform audio state changes (e.g. host tab mute)
    this.playgama.onAudioStateChange((isEnabled) => {
      console.log('[Playgama] Host audio state changed:', isEnabled);
      if (!isEnabled) {
        this.audio.setMuted(true);
      } else {
        const userSavedMute = this.saveData.settings?.isMuted || false;
        this.audio.setMuted(userSavedMute);
      }
      this.updateMuteButtonUI();
    });

    // Listen for host platform pause/resume requests (Playgama Official SDK)
    this.playgama.onPauseStateChange((isPaused) => {
      console.log('[Playgama] Host pause state changed:', isPaused);
      if (isPaused) {
        if (this.state === 'PLAYING') {
          this.state = 'PAUSED';
          this.audio.setMuted(true);
          this.playgama.showBanner();
          document.getElementById('pause-modal')?.classList.remove('hidden');
        }
      } else {
        const isWorkshopOpen = !document.getElementById('workshop-modal')?.classList.contains('hidden');
        const isGameOverOpen = !document.getElementById('game-over-modal')?.classList.contains('hidden');
        if (this.state === 'PAUSED' && !isWorkshopOpen && !isGameOverOpen) {
          this.state = 'PLAYING';
          const userSavedMute = this.saveData.settings?.isMuted || false;
          const platformAudio = this.playgama.isAudioEnabled();
          this.audio.setMuted(!platformAudio || userSavedMute);
          this.playgama.hideBanner();
          document.getElementById('pause-modal')?.classList.add('hidden');
        }
      }
    });

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
      this.updateMuteButtonUI();
      btnMute.addEventListener('click', () => {
        this.audio.init();
        const nextMuted = !this.audio.isMuted;
        this.audio.setMuted(nextMuted);
        this.playgama.setMuted(nextMuted);
        this.saveData.settings = { ...this.saveData.settings, isMuted: nextMuted };
        this.updateMuteButtonUI();
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
      btnRestart.addEventListener('click', async () => {
        await this.showInterstitialAd();
        this.closeAllModals();
        this.startNewRun();
      });
    }

    const btnQuitTitle = document.getElementById('btn-quit-to-title');
    if (btnQuitTitle) {
      btnQuitTitle.addEventListener('click', async () => {
        await this.showInterstitialAd();
        this.closeAllModals();
        this.returnToTitle();
      });
    }

    // Playgama Rewarded Ad buttons
    const btnAirdrop = document.getElementById('btn-airdrop');
    if (btnAirdrop) {
      btnAirdrop.addEventListener('click', () => {
        this.audio.init();
        this.showRewardedAd(() => {
          this.addGold(120);
          this.audio.playCoinDrop();
          this.particles.burst(ARENA.center.x, ARENA.center.y, 30, '#FFD166');
          this.juice.spawnFloatingText('+120 CREDITS!', ARENA.center.x, ARENA.center.y - 40, { color: '#FFD166', size: 20 });
          this.updateHUD();
        });
      });
    }

    const btnFreeGold = document.getElementById('btn-workshop-free-gold');
    if (btnFreeGold) {
      btnFreeGold.addEventListener('click', () => {
        this.audio.init();
        this.showRewardedAd(() => {
          this.addGold(100);
          this.audio.playCoinDrop();
          this.renderWorkshopUI();
          this.updateHUD();
          this.juice.spawnFloatingText('+100 CREDITS!', ARENA.center.x, ARENA.center.y - 40, { color: '#FFD166', size: 18 });
        });
      });
    }

    const btnRevive = document.getElementById('btn-go-revive');
    if (btnRevive) {
      btnRevive.addEventListener('click', () => {
        this.audio.init();
        this.showRewardedAd(() => {
          this.reviveCore();
        });
      });
    }

    const btnDoubleGold = document.getElementById('btn-go-double-gold');
    if (btnDoubleGold) {
      btnDoubleGold.addEventListener('click', () => {
        this.audio.init();
        this.showRewardedAd(() => {
          const bonus = Math.max(50, Math.floor(this.gold * 0.8) + 50);
          this.addGold(bonus);
          this.audio.playCoinDrop();
          btnDoubleGold.disabled = true;
          btnDoubleGold.textContent = 'CREDITS DOUBLED';
          this.juice.spawnFloatingText(`+${bonus} CREDITS!`, ARENA.center.x, ARENA.center.y - 40, { color: '#FFD166', size: 18 });
        });
      });
    }

    const btnRetry = document.getElementById('btn-retry-game');
    if (btnRetry) {
      btnRetry.addEventListener('click', async () => {
        await this.showInterstitialAd();
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
      btnGoTitle.addEventListener('click', async () => {
        await this.showInterstitialAd();
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
        this.playgama.showBanner();
        document.getElementById('pause-modal')?.classList.remove('hidden');
      }
    });

    this.updateTitleRecords();
    this.playgama.showBanner(); // Show banner in title screen
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
      this.juice.spawnFloatingText(`+${goldReward} G`, x, y - 10, { color: '#FFD166', size: 14 });
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
    document.getElementById('btn-airdrop')?.classList.remove('hidden');
    document.getElementById('game-hud')?.classList.remove('hidden');
    this.closeAllModals();
    this.playgama.hideBanner();

    this.startWave(this.wave);
    this.updateHUD();
  }

  reviveCore() {
    this.coreHp = Math.floor(this.coreMaxHp * 0.5);
    this.enemies = []; // Clear breaching invaders
    this.state = 'PLAYING';
    this.closeAllModals();
    this.playgama.hideBanner();
    this.audio.playVictoryFanfare();
    this.particles.burst(ARENA.center.x, ARENA.center.y, 40, '#F59E0B');
    this.juice.spawnFloatingText('CORE REVIVED (+50% HP)!', ARENA.center.x, ARENA.center.y - 40, { color: '#F59E0B', size: 20 });
    this.showWaveBanner(`WAVE ${this.wave}`, 'DEFENSE RESUMED', 2.0);
    this.updateHUD();
  }

  returnToTitle() {
    this.state = 'TITLE';
    document.getElementById('game-hud')?.classList.add('hidden');
    document.getElementById('header-hud-center')?.classList.add('hidden');
    document.getElementById('btn-airdrop')?.classList.add('hidden');
    document.getElementById('title-overlay')?.classList.remove('hidden');
    this.closeAllModals();
    this.updateTitleRecords();
    this.playgama.showBanner();
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.playgama.showBanner();
      document.getElementById('pause-modal')?.classList.remove('hidden');
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.playgama.hideBanner();
      document.getElementById('pause-modal')?.classList.add('hidden');
    }
  }

  openWorkshopModal() {
    this.renderWorkshopUI();
    this.playgama.showBanner();
    document.getElementById('workshop-modal')?.classList.remove('hidden');
  }

  closeWorkshopModal() {
    document.getElementById('workshop-modal')?.classList.add('hidden');
    if (this.state === 'PLAYING') {
      this.playgama.hideBanner();
    }
  }

  openTutorialModal() {
    this.playgama.showBanner();
    document.getElementById('tutorial-modal')?.classList.remove('hidden');
  }

  closeTutorialModal() {
    document.getElementById('tutorial-modal')?.classList.add('hidden');
    if (this.state === 'PLAYING') {
      this.playgama.hideBanner();
    }
  }

  openDirectiveModal() {
    this.state = 'PAUSED';
    const list = document.getElementById('directive-options-list');
    if (!list) return;

    list.innerHTML = '';
    const available = DIRECTIVES.filter((d) => !this.activeDirectives.has(d.id));
    const pool = available.length >= 3 ? available : DIRECTIVES;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const choices = shuffled.slice(0, 3);

    choices.forEach((d) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'directive-item';
      item.innerHTML = `
        <div class="directive-icon-box">${d.iconSvg}</div>
        <div class="directive-text-stack">
          <div class="directive-name-row">
            <span class="directive-name">${d.name}</span>
            <span class="directive-tag">${d.tag}</span>
          </div>
          <p class="directive-desc">${d.desc}</p>
        </div>
      `;

      item.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        try {
          this.activeDirectives.add(d.id);
          this.audio.playVictoryFanfare();
          this.particles.burst(ARENA.center.x, ARENA.center.y, 35, '#38BDF8');
          this.juice.spawnFloatingText(`UPGRADE: ${d.name.toUpperCase()}!`, ARENA.center.x, ARENA.center.y - 35, { color: '#38BDF8', size: 18 });
        } catch (err) {
          console.warn('Directive select effect error:', err);
        }
        this.closeAllModals();
        this.state = 'PLAYING';
        this.playgama.hideBanner();

        // Advance to next wave immediately
        this.waveTimer = 0;
        this.startWave(this.wave + 1);
      };

      list.appendChild(item);
    });

    this.playgama.showBanner();
    document.getElementById('directive-modal')?.classList.remove('hidden');
  }

  closeAllModals() {
    document.getElementById('directive-modal')?.classList.add('hidden');
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
          ${isMax ? 'MAX' : `${cost} G`}
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
    this.particles.burst(targetSlot.x, targetSlot.y, 14, '#D97706');
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
    const currentPrice = this.getSummonCost();
    const refund = Math.max(10, Math.floor(baseSummons * currentPrice * 0.70 * this.getWorkshopStat('goldBonus')));

    this.sentinels.delete(sourceSlotId);
    this.addGold(refund);

    this.audio.playCoinDrop();
    this.particles.burst(ARENA.recycleSlot.x, ARENA.recycleSlot.y, 14, '#FFD166');
    this.juice.spawnFloatingText(`+${refund} G`, ARENA.recycleSlot.x, ARENA.recycleSlot.y - 20, { color: '#FFD166', size: 16 });
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
    if (!slot) {
      // Check if clicking directly on a hostile enemy to lock target!
      const tappedEnemy = this.enemies.find((en) => {
        if (en.hp <= 0) return false;
        return MathUtils.distance(clientX, clientY, en.x, en.y) <= (en.radius || 12) + 16;
      });

      if (tappedEnemy) {
        this.lockedTargetId = tappedEnemy.id;
        this.audio.playCritSlash();
        this.juice.spawnFloatingText('TARGET LOCKED', tappedEnemy.x, tappedEnemy.y - 25, { color: '#38BDF8', size: 14 });
      } else {
        this.lockedTargetId = null;
      }
      return;
    }

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
    this.juice.spawnFloatingText('OVERCHARGE!', ARENA.center.x, ARENA.center.y - 40, { color: '#F59E0B', size: 24 });
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
      this.showWaveBanner(`BOSS WAVE ${waveNum}`, `${bossName} DETECTED`, 2.8);
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

    // Escalating exponential difficulty scaling curve
    const hpMult = Math.pow(1.22, waveNum - 1) * (1.0 + 0.10 * (waveNum - 1));
    const speedMult = Math.min(1.8, 1.0 + 0.03 * (waveNum - 1));

    if (isBossWave) {
      let bossId = 'iron_colossus';
      let bossBaseHp = 5500;
      let bossSpeed = 20;

      if (waveNum === 10) {
        bossId = 'hydra_queen';
        bossBaseHp = 14000;
        bossSpeed = 24;
      } else if (waveNum >= 15) {
        bossId = 'chrono_wraith';
        bossBaseHp = 32000;
        bossSpeed = 28;
      }

      this.spawnQueue.push({
        type: bossId,
        hp: Math.floor(bossBaseHp * hpMult),
        speed: bossSpeed * speedMult,
        portal: ARENA.portals[0],
        isBoss: true,
        bossId
      });

      // Supporting escorts during boss fight
      const escortCount = 8 + waveNum * 3;
      for (let i = 0; i < escortCount; i++) {
        const type = MathUtils.randomChoice(['void_crawler', 'swift_dart', 'armored_bruiser', 'swarm_pod']);
        const def = ENEMY_TYPES[type];
        this.spawnQueue.push({
          type,
          hp: Math.floor(def.baseHp * hpMult),
          speed: def.speedDeg * speedMult,
          portal: ARENA.portals[0],
          isBoss: false
        });
      }
      return;
    }

    // Regular Incursion Swarm Generation
    const totalCount = 12 + waveNum * 5;
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
        portal: ARENA.portals[0],
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
    this.animTime += dt;
    this.particles.update(dt);
    this.juice.update(dt);

    if (this.state === 'TITLE') {
      this.updateTitleShips(dt);
      return;
    }

    if (this.state !== 'PLAYING') return;

    const scaledDt = dt * (this.timeScale || 1.0);

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
        const burstCount = this.wave >= 4 ? Math.min(2, this.spawnQueue.length) : 1;
        for (let b = 0; b < burstCount; b++) {
          const spec = this.spawnQueue.shift();
          if (spec) this.spawnEnemy(spec);
        }
        this.spawnIntervalTimer = 0.38;
      }
      if (this.spawnQueue.length === 0) {
        this.waveState = 'WAVE_ACTIVE';
      }
    }

    // Check Wave Cleared
    if (this.waveState === 'WAVE_ACTIVE' && this.enemies.length === 0) {
      this.waveState = 'WAVE_CLEARED';
      this.waveTimer = 2.8;

      const isBossWave = this.wave % 5 === 0;
      if (isBossWave) {
        this.showInterstitialAd();
      }

      const bounty = 25 + 12 * this.wave + Math.floor(1.5 * Math.pow(this.wave, 1.2));
      const finalBounty = Math.floor(bounty * this.getWorkshopStat('goldBonus'));
      this.addGold(finalBounty);
      this.audio.playVictoryFanfare();
      this.showWaveBanner(`WAVE ${this.wave} CLEARED!`, `+${finalBounty} CREDITS`, 2.5);

      // Compound interest perk
      if (this.activeDirectives.has('interest_treasury')) {
        const interest = Math.min(25, Math.floor(this.gold * 0.10));
        if (interest > 0) {
          this.addGold(interest);
          this.juice.spawnFloatingText(`+${interest} G INTEREST`, ARENA.center.x, ARENA.center.y - 20, { color: '#F59E0B', size: 14 });
        }
      }

      // Trigger Roguelike Tactical Directive Choice on waves 3, 6, 9, 12, 15...
      if (this.wave % 3 === 0) {
        this.waveTimer = 9999; // Wait for player selection in modal
        this.openDirectiveModal();
      }
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
    let globalSpeedBuff = this.getWorkshopStat('attackSpeed') * (this.surgeBuffTimer > 0 ? 1.5 : 1.0);
    if (this.activeDirectives.has('overclock_protocol')) globalSpeedBuff *= 1.20;

    // Check Orbital Resonance Links between adjacent ring slots
    for (let i = 0; i < 8; i++) {
      const slotA = `slot_${i}`;
      const slotB = `slot_${(i + 1) % 8}`;
      const s1 = this.sentinels.get(slotA);
      const s2 = this.sentinels.get(slotB);
      if (!s1 || !s2) continue;

      const combo = [s1.archetype, s2.archetype].sort().join('+');
      if (combo === 'arcane_mage+ballista_archer') {
        // Overcharge Conductor Beam (25 DPS + 30% slow to enemies crossing line)
        for (const enemy of this.enemies) {
          if (enemy.hp <= 0) continue;
          const distToBeam = distanceToLineSegment(enemy.x, enemy.y, s1.x, s1.y, s2.x, s2.y);
          if (distToBeam <= (enemy.radius || 12) + 6) {
            enemy.hp -= 28 * dt;
            enemy.slowPercent = Math.max(enemy.slowPercent || 0, 0.30);
            enemy.chilledTimer = 0.2;
            if (Math.random() < 0.15) {
              this.particles.burst(enemy.x, enemy.y, 2, '#38BDF8');
            }
          }
        }
      }
    }

    for (const [slotId, s] of this.sentinels) {
      // Standby / Bench units do NOT attack
      if (slotId.startsWith('bench')) continue;

      if (s.scaleAnim > 1.0) {
        s.scaleAnim = Math.max(1.0, s.scaleAnim - dt * 2.5);
      }
      if (s.recoil > 0) s.recoil = Math.max(0, s.recoil - dt * 5);
      s.isFiring = false;
      s.isSlashing = false;

      let sentinelSpeed = globalSpeedBuff;
      if (s.archetype === 'shadow_assassin' && this.activeDirectives.has('shadow_vortex')) {
        sentinelSpeed *= 1.35;
      }
      s.cooldown -= dt * sentinelSpeed;

      // Select Target (checks manual target lock first!)
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
    if (this.lockedTargetId) {
      const lockedEnemy = this.enemies.find((e) => e.id === this.lockedTargetId && e.hp > 0);
      if (lockedEnemy && MathUtils.distance(s.x, s.y, lockedEnemy.x, lockedEnemy.y) <= s.currentRange) {
        return lockedEnemy;
      }
    }

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
          color: '#F59E0B',
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
        const now = (typeof performance !== 'undefined') ? performance.now() : Date.now();
        if (!enemy.lastBlockedTextTime || (now - enemy.lastBlockedTextTime > 2000)) {
          enemy.lastBlockedTextTime = now;
          this.juice.spawnFloatingText('BLOCKED!', enemy.x, enemy.y - 20, { color: '#38BDF8', size: 14 });
        }
        this.particles.burst(enemy.x, enemy.y, 4, '#38BDF8');
        return;
      }
    }

    let finalDmg = rawDamage;

    // --- ELEMENTAL COMBO REACTIONS ---
    // 1. SUPERCONDUCTOR (Cryo + Tesla Chain)
    if (damageType === 'tesla_chain' && enemy.chilledTimer > 0) {
      finalDmg *= 2.0; // +100% damage bonus
      this.particles.burst(enemy.x, enemy.y, 16, '#818CF8');
      this.juice.spawnFloatingText('SUPERCONDUCTOR (+100%)!', enemy.x, enemy.y - 18, { color: '#818CF8', size: 15 });
      this.audio.playTeslaCrackle();
      enemy.stunTimer = Math.max(enemy.stunTimer || 0, 0.4);
    }

    // 2. THERMAL DETONATION (Burn + Kinetic Railgun)
    if (damageType === 'kinetic' && enemy.burnTimer > 0) {
      const burnBurst = (enemy.burnDPS || 25) * (enemy.burnTimer || 1.5) * 2.0;
      finalDmg += burnBurst;
      enemy.burnTimer = 0;
      this.particles.burst(enemy.x, enemy.y, 20, '#EA580C');
      this.juice.spawnFloatingText('THERMAL DETONATION!', enemy.x, enemy.y - 22, { color: '#EA580C', size: 15 });
      this.juice.screenShake(4);
    }

    // Armor damage reduction
    const effectiveArmor = Math.max(0, (enemy.armor || 0) - armorShred);
    const damage = finalDmg * (1.0 - effectiveArmor);

    enemy.hp -= damage;
    enemy.hitFlashTimer = 0.08;

    // Only show critical hit popups to avoid continuous floating text spam
    if (isCrit) {
      this.juice.spawnFloatingText('CRIT!', enemy.x, enemy.y - 12, {
        color: '#FFD166',
        size: 15
      });
    }

    if (enemy.hp <= 0) {
      this.killEnemy(enemy);
    }
  }

  killEnemy(enemy) {
    enemy.hp = 0;
    if (enemy.id === this.lockedTargetId) {
      this.lockedTargetId = null;
    }

    // Cryo Shatter Directive AoE explosion
    if (this.activeDirectives.has('cryo_shatter') && enemy.chilledTimer > 0) {
      this.particles.burst(enemy.x, enemy.y, 18, '#38BDF8');
      this.audio.playFrostHum();
      for (const other of this.enemies) {
        if (other.id !== enemy.id && other.hp > 0 && MathUtils.distance(enemy.x, enemy.y, other.x, other.y) <= 65) {
          other.hp -= 60;
          other.chilledTimer = 1.5;
          other.slowPercent = 0.40;
        }
      }
      this.juice.spawnFloatingText('CRYO SHATTER!', enemy.x, enemy.y - 20, { color: '#38BDF8', size: 14 });
    }

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
    const radialDriftRate = (ARENA.spawnRadius - ARENA.innerHazardRadius) / 16.0; // Dynamic 16s inward drift for engaging arcade pacing

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
      e.polarRadius = Math.max(ARENA.innerHazardRadius, e.polarRadius - radialDriftRate * speedScale * dt);

      // Convert polar coordinates to Cartesian
      e.x = ARENA.center.x + Math.cos(e.polarAngle) * e.polarRadius;
      e.y = ARENA.center.y + Math.sin(e.polarAngle) * e.polarRadius;
      e.angle = e.polarAngle + Math.PI / 2;

      // Boss Specific Behaviors
      if (e.type === 'iron_colossus') {
        e.shieldAngle += 0.8 * dt;
      } else if (e.type === 'chrono_wraith') {
        e.phaseBlinkTimer -= dt;
        if (e.phaseBlinkTimer <= 0) {
          e.phaseBlinkTimer = 4.5;
          e.polarAngle += (Math.PI / 3);
          this.particles.burst(e.x, e.y, 16, '#C084FC');
          this.audio.playTeslaCrackle();
        }
      }

      // Check Core Breach Collision
      if (e.polarRadius <= ARENA.innerHazardRadius) {
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

    // Emergency Aegis Deflector Directive
    if (this.coreHp > 0 && this.coreHp <= this.coreMaxHp * 0.35 && !this.hasTriggeredEmergencyAegis && this.activeDirectives.has('aegis_emergency')) {
      this.hasTriggeredEmergencyAegis = true;
      this.coreHp = Math.min(this.coreMaxHp, this.coreHp + 100);
      this.juice.screenShake(8);
      this.particles.burst(ARENA.center.x, ARENA.center.y, 35, '#38BDF8');
      this.juice.spawnFloatingText('AEGIS BARRIER (+100 HP)!', ARENA.center.x, ARENA.center.y - 35, { color: '#38BDF8', size: 18 });
      this.audio.playSurgeShockwave();
    }
    
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

    const btnDoubleGold = document.getElementById('btn-go-double-gold');
    if (btnDoubleGold) {
      btnDoubleGold.disabled = false;
      btnDoubleGold.textContent = 'DOUBLE CREDITS (AIRDROP)';
    }

    document.getElementById('game-over-modal')?.classList.remove('hidden');
    this.playgama.showBanner();
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
              if (p.burnDPS > 0) {
                e.burnTimer = 2.5;
                e.burnDPS = p.damage * p.burnDPS;
              }
              this.applyDamageToEnemy(e, p.damage * falloff, false, 'mortar_fire');
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
      this.applyDamageToEnemy(currentTarget, p.damage, false, 'tesla_chain');

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

    if (buyCost) buyCost.textContent = `${this.getSummonCost()} G`;
    if (repairCost) repairCost.textContent = `${this.getRepairCost()} G`;

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

    if (this.state === 'TITLE') {
      // Draw dynamic floating space fleet around the title screen
      this.layeredRenderer.draw(RenderLayers.CHARACTERS, (c) => {
        this.drawTitleFloatingFleet(c);
      });

      this.layeredRenderer.draw(RenderLayers.OVERLAY, (c) => {
        this.particles.render(c);
        this.juice.renderWorld(c);
      });

      this.layeredRenderer.flush(ctx);
      this.juice.renderScreen(ctx, ARENA.width, ARENA.height);
      this.renderer.endFrame();
      return;
    }

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

    // Layer 30: Burning Plasma Pools, Resonance Links & Shockwaves
    this.layeredRenderer.draw(RenderLayers.EFFECTS, (c) => {
      // Orbital Resonance Synergy Beams between adjacent sentinels
      drawResonanceLinks(c, this.sentinels, this.animTime);

      for (const pool of this.burningPools) {
        c.strokeStyle = 'rgba(239, 68, 68, 0.45)';
        c.lineWidth = 1.5;
        c.setLineDash([3, 4]);
        c.beginPath();
        c.arc(pool.x, pool.y, pool.radius, 0, Math.PI * 2);
        c.stroke();
        c.setLineDash([]);
      }

      if (this.activeShockwave) {
        c.strokeStyle = '#38BDF8';
        c.lineWidth = 3.5;
        c.beginPath();
        c.arc(this.activeShockwave.x, this.activeShockwave.y, this.activeShockwave.radius, 0, Math.PI * 2);
        c.stroke();
      }
    });

    // Layer 40: Void Invaders Horde & Target Lock Reticle
    this.layeredRenderer.draw(RenderLayers.CHARACTERS, (c) => {
      for (const enemy of this.enemies) {
        drawEnemy(c, enemy, this.animTime);
      }

      // Tactical Focus-Fire Target Crosshair
      if (this.lockedTargetId) {
        const lockedEnemy = this.enemies.find((e) => e.id === this.lockedTargetId && e.hp > 0);
        if (lockedEnemy) {
          drawTargetReticle(c, lockedEnemy, this.animTime);
        }
      }
    });

    // Layer 50: Projectiles & Tesla Lightning Arcs
    this.layeredRenderer.draw(RenderLayers.WORLD_UI, (c) => {
      // Lasers
      for (const p of this.projectiles) {
        if (p.type === 'laser') {
          c.save();
          const dx = p.x2 - p.x1;
          const dy = p.y2 - p.y1;
          const dist = Math.hypot(dx, dy);
          const angle = Math.atan2(dy, dx);

          // Curated Laser Sprite Texture Overlay
          const laserKey = p.color === '#EF4444' ? 'laser_red' : (p.color === '#10B981' ? 'laser_green' : 'laser_blue');
          if (this.assets && this.assets.isLoaded(laserKey) && typeof c.drawImage === 'function') {
            const img = this.assets.get(laserKey);
            c.save();
            c.translate(p.x1, p.y1);
            c.rotate(angle - Math.PI / 2);
            c.drawImage(img, -4, 0, 8, dist);
            c.restore();
          }

          // Procedural glowing beam core (Preserved)
          c.strokeStyle = p.color ? `${p.color}66` : 'rgba(245, 158, 11, 0.4)';
          c.lineWidth = 4;
          c.beginPath();
          c.moveTo(p.x1, p.y1);
          c.lineTo(p.x2, p.y2);
          c.stroke();
          c.strokeStyle = '#FFFBEB';
          c.lineWidth = 1.6;
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

          c.fillStyle = '#EA580C';
          c.beginPath();
          c.arc(p.x, p.y - height, 4.5, 0, Math.PI * 2);
          c.fill();
        }
      }

      // Tesla Arcs
      for (const arcGroup of this.teslaArcs) {
        c.save();
        c.strokeStyle = '#EEF2FF';
        c.lineWidth = 1.8;
        for (const arc of arcGroup.arcs) {
          c.beginPath();
          c.moveTo(arc.x1, arc.y1);
          const midX = (arc.x1 + arc.x2) / 2 + (Math.random() - 0.5) * 12;
          const midY = (arc.y1 + arc.y2) / 2 + (Math.random() - 0.5) * 12;
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

function bootOrbitGuard() {
  const game = new OrbitGuardGame();
  game.init().catch((err) => console.error('Error starting Orbit Guard:', err));
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootOrbitGuard);
  } else {
    bootOrbitGuard();
  }
}
