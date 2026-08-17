import {
  GameLoop,
  CanvasRenderer,
  InputManager,
  ProceduralAudio,
  ParticleSystem,
  JuiceEffects,
  TweenManager,
  Easings,
  StateMachine,
  Camera2D,
  PlaygamaBridge,
  ProceduralPrimitives,
  MathUtils,
  CollisionUtils,
  EnemyController,
  DialogueBox,
  DialogueSystem,
  Collectible,
  NPC,
  Checkpoint,
  AbilityGate
} from '../../../engine/index.js';

/**
 * ============================================================================
 * MEADOWBOUND — Complete 2D Action Platform Adventure
 * Pure Procedural Vector Graphics, Web Audio Synthesizer & Responsive Physics
 * ============================================================================
 */

// Global Game States
export const GameStates = {
  TITLE: 'TITLE',
  HOW_TO_PLAY: 'HOW_TO_PLAY',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  LEVEL_TRANSITION: 'LEVEL_TRANSITION',
  BOSS_ENCOUNTER: 'BOSS_ENCOUNTER',
  VICTORY: 'VICTORY',
  GAME_OVER: 'GAME_OVER'
};

// Kinematic Constants
const KINEMATICS = {
  SPEED_MAX: 200,
  ACCEL_GROUND: 1200,
  DECEL_GROUND: 1400,
  ACCEL_AIR: 900,
  DRAG_AIR: 600,
  JUMP_VEL: -390,
  JUMP_CUT_VEL: -140,
  GRAVITY: 980,
  FALL_CLAMP: 480,
  COYOTE_TIME: 0.10,
  JUMP_BUFFER: 0.12,
  DASH_SPEED: 450,
  DASH_DURATION: 0.18,
  STOMP_BOUNCE: -320,
  INVULN_DURATION: 1.5
};

// Lore Medallion Metadata
const LORE_MEDALLIONS = {
  medallion_dawn: {
    id: 'medallion_dawn',
    level: 1,
    name: 'Medallion of Dawn',
    lore: 'In the morning light of the first age, the Sunburst Tree sprouted from a single fallen star.'
  },
  medallion_whispers: {
    id: 'medallion_whispers',
    level: 2,
    name: 'Medallion of Whispers',
    lore: 'The canopy winds remember every song sung by the sprites of old.'
  },
  medallion_luminescence: {
    id: 'medallion_luminescence',
    level: 3,
    name: 'Medallion of Luminescence',
    lore: 'Deep beneath the roots, glowing crystals drink the earth’s quiet warmth.'
  },
  medallion_zephyr: {
    id: 'medallion_zephyr',
    level: 4,
    name: 'Medallion of Zephyr',
    lore: 'High atop the cliffs, the mountain gale carries the seeds of new beginnings.'
  },
  medallion_ancients: {
    id: 'medallion_ancients',
    level: 5,
    name: 'Medallion of the Ancients',
    lore: 'When all five blessings unite, the slumbering forest awakens in eternal bloom.'
  }
};

/**
 * Procedural Audio Synthesizer for Meadowbound
 * Zero-dependency Web Audio API procedural sound engine with multi-voice synthesis,
 * chord fanfares, melodic NPC chirps, and dynamic biome chiptune arpeggios.
 */
class MeadowboundAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.isInitialized = false;
    this.bgmGain = null;
    this.bgmTimer = null;
    this.currentTrack = null;
    this.lastChirpTime = 0;
  }

  init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);

        this.isInitialized = true;
      }
    } catch (e) {
      console.warn('[MeadowboundAudio] Web Audio initialization warning:', e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
  }

  playJump() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    // Airy Sine Fundamental
    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, t);
    osc1.frequency.exponentialRampToValueAtTime(560, t + 0.12);
    g1.gain.setValueAtTime(0.28, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc1.connect(g1);
    g1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.12);

    // Warm Triangle Harmonic Accent
    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, t);
    osc2.frequency.exponentialRampToValueAtTime(880, t + 0.09);
    g2.gain.setValueAtTime(0.12, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(t);
    osc2.stop(t + 0.09);
  }

  playLand() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    // Earthy Sub-thud
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.09);
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  playDash() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    // Soaring Emerald Wind Whoosh
    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(320, t);
    osc1.frequency.exponentialRampToValueAtTime(940, t + 0.16);
    g1.gain.setValueAtTime(0.30, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc1.connect(g1);
    g1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.16);

    // Whistling Air Shimmer
    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(640, t);
    osc2.frequency.exponentialRampToValueAtTime(1480, t + 0.14);
    g2.gain.setValueAtTime(0.15, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(t);
    osc2.stop(t + 0.14);
  }

  playStomp() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    // Punchy Bass Thump
    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(160, t);
    osc1.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g1.gain.setValueAtTime(0.32, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc1.connect(g1);
    g1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.12);

    // Sparkling Pop Bloom
    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(650, t);
    osc2.frequency.exponentialRampToValueAtTime(1150, t + 0.11);
    g2.gain.setValueAtTime(0.24, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(t);
    osc2.stop(t + 0.11);
  }

  playBerryCollect() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    // 4-Note Celestial Chime: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.045;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.22);

      // Sweet bell overtone
      const oscHarm = this.ctx.createOscillator();
      const gHarm = this.ctx.createGain();
      oscHarm.type = 'triangle';
      oscHarm.frequency.setValueAtTime(freq * 2, t);
      gHarm.gain.setValueAtTime(0.08, t);
      gHarm.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      oscHarm.connect(gHarm);
      gHarm.connect(this.masterGain);
      oscHarm.start(t);
      oscHarm.stop(t + 0.16);
    });
  }

  playAcorn() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1440, t + 0.08);
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  playMedallion() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    // Rich 5-Voice A Major 9th Chord Fanfare: A4 (440), C#5 (554.37), E5 (659.25), G#5 (830.61), A5 (880)
    const chordNotes = [440.00, 554.37, 659.25, 830.61, 880.00];
    chordNotes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.26, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.65);

      // Shimmering sine lead
      const oscSine = this.ctx.createOscillator();
      const gSine = this.ctx.createGain();
      oscSine.type = 'sine';
      oscSine.frequency.setValueAtTime(freq * 1.5, t);
      gSine.gain.setValueAtTime(0.10, t);
      gSine.gain.exponentialRampToValueAtTime(0.001, t + 0.50);
      oscSine.connect(gSine);
      gSine.connect(this.masterGain);
      oscSine.start(t);
      oscSine.stop(t + 0.50);
    });
  }

  playWaystone() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    // E Minor Sacred Bell Chime [E4 (329.63), B4 (493.88), E5 (659.25), B5 (987.77)]
    const notes = [329.63, 493.88, 659.25, 987.77];
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.03;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.24, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.9);
    });
  }

  playSporeBounce() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(840, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.22);
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  playHurt() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    // Crunch Sawtooth Impact
    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(240, t);
    osc1.frequency.exponentialRampToValueAtTime(60, t + 0.22);
    g1.gain.setValueAtTime(0.35, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc1.connect(g1);
    g1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.22);

    // Visceral Low Sub-Thud
    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(140, t);
    osc2.frequency.exponentialRampToValueAtTime(30, t + 0.18);
    g2.gain.setValueAtTime(0.30, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(t);
    osc2.stop(t + 0.18);
  }

  playBossSlam() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    // Earthquake Sub-Bass Rumble
    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(90, t);
    osc1.frequency.exponentialRampToValueAtTime(25, t + 0.50);
    g1.gain.setValueAtTime(0.55, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.50);
    osc1.connect(g1);
    g1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.50);

    // Heavy Bark Distortion Crack
    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(140, t);
    osc2.frequency.exponentialRampToValueAtTime(30, t + 0.30);
    g2.gain.setValueAtTime(0.30, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(t);
    osc2.stop(t + 0.30);
  }

  playBossRoar() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(180, t);
    osc1.frequency.exponentialRampToValueAtTime(65, t + 0.60);
    g1.gain.setValueAtTime(0.38, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.60);
    osc1.connect(g1);
    g1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.60);

    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(90, t);
    osc2.frequency.exponentialRampToValueAtTime(35, t + 0.50);
    g2.gain.setValueAtTime(0.22, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.50);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(t);
    osc2.stop(t + 0.50);
  }

  playBossCrash() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(190, t);
    osc1.frequency.exponentialRampToValueAtTime(35, t + 0.38);
    g1.gain.setValueAtTime(0.42, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    osc1.connect(g1);
    g1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.38);

    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(120, t);
    osc2.frequency.exponentialRampToValueAtTime(25, t + 0.28);
    g2.gain.setValueAtTime(0.30, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(t);
    osc2.stop(t + 0.28);
  }

  playVictory() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    // Triumphant 3-Phrase Fanfare (F Maj -> G Maj -> C Maj Flourish)
    const phrase = [
      { notes: [349.23, 440.00, 523.25], time: 0.0, dur: 0.35 },  // F Major
      { notes: [392.00, 493.88, 587.33], time: 0.35, dur: 0.35 }, // G Major
      { notes: [523.25, 659.25, 783.99, 1046.50], time: 0.70, dur: 1.4 } // C Major Flourish
    ];

    phrase.forEach(chord => {
      chord.notes.forEach((freq) => {
        const t = this.ctx.currentTime + chord.time;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.28, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + chord.dur);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + chord.dur);

        // Sine overtone
        const oscSine = this.ctx.createOscillator();
        const gSine = this.ctx.createGain();
        oscSine.type = 'sine';
        oscSine.frequency.setValueAtTime(freq * 2, t);
        gSine.gain.setValueAtTime(0.10, t);
        gSine.gain.exponentialRampToValueAtTime(0.001, t + chord.dur * 0.8);
        oscSine.connect(gSine);
        gSine.connect(this.masterGain);
        oscSine.start(t);
        oscSine.stop(t + chord.dur * 0.8);
      });
    });
  }

  /**
   * Procedural NPC Speech Chirps (Cute typewriter vocalizations)
   * @param {string} avatar - 'snail'|'owl'|'spirit'|'default'
   */
  playNpcChirp(avatar = 'default') {
    if (this.isMuted || !this.ctx) return;
    const now = performance.now();
    if (now - this.lastChirpTime < 65) return; // Prevent high-frequency overlap
    this.lastChirpTime = now;
    this.init();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    if (avatar === 'snail') {
      // Mellow, bubbly pitch-drop
      osc.type = 'triangle';
      const base = 280 + Math.random() * 60;
      osc.frequency.setValueAtTime(base, t);
      osc.frequency.exponentialRampToValueAtTime(base * 1.3, t + 0.04);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    } else if (avatar === 'owl') {
      // Wise, hollow double-pipe chirp
      osc.type = 'sine';
      const base = 420 + Math.random() * 80;
      osc.frequency.setValueAtTime(base, t);
      osc.frequency.setValueAtTime(base * 1.5, t + 0.03);
      g.gain.setValueAtTime(0.20, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    } else if (avatar === 'spirit') {
      // Ethereal crystalline high harmonic shimmer
      osc.type = 'sine';
      const base = 880 + Math.random() * 220;
      osc.frequency.setValueAtTime(base, t);
      osc.frequency.exponentialRampToValueAtTime(base * 1.25, t + 0.05);
      g.gain.setValueAtTime(0.16, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    } else {
      // Cheerful friendly blip
      osc.type = 'sine';
      const base = 520 + Math.random() * 100;
      osc.frequency.setValueAtTime(base, t);
      osc.frequency.exponentialRampToValueAtTime(base * 1.4, t + 0.04);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    }

    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  playBgm(track) {
    if (this.currentTrack === track) return;
    this.currentTrack = track;
    this.stopBgm();

    if (this.isMuted || !this.ctx) return;
    this.init();

    // 2-Voice Polyphonic Procedural Biome Arpeggiator (Lead + Bassline)
    let leadNotes = [261.63, 329.63, 392.00, 493.88, 523.25]; // C Maj (Meadow)
    let bassNotes = [130.81, 196.00]; // C3, G3
    let interval = 280;

    if (track === 'woods') {
      leadNotes = [220.00, 261.63, 329.63, 392.00, 369.99]; // A Min / Dorian
      bassNotes = [110.00, 164.81]; // A2, E3
      interval = 300;
    } else if (track === 'caverns') {
      leadNotes = [196.00, 233.08, 293.66, 349.23, 392.00]; // G Min
      bassNotes = [98.00, 146.83]; // G2, D3
      interval = 320;
    } else if (track === 'highlands') {
      leadNotes = [293.66, 369.99, 440.00, 554.37, 587.33]; // D Maj
      bassNotes = [146.83, 220.00]; // D3, A3
      interval = 260;
    } else if (track === 'boss') {
      leadNotes = [146.83, 174.61, 220.00, 293.66, 311.13, 293.66]; // D Min Driving
      bassNotes = [73.42, 110.00]; // D2, A2
      interval = 175;
    }

    let step = 0;
    this.bgmTimer = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;

      // 1. Lead Voice
      const leadFreq = leadNotes[step % leadNotes.length];
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = track === 'boss' ? 'sawtooth' : (track === 'caverns' ? 'triangle' : 'sine');
      leadOsc.frequency.setValueAtTime(leadFreq, t);
      leadGain.gain.setValueAtTime(track === 'boss' ? 0.11 : 0.08, t);
      leadGain.gain.exponentialRampToValueAtTime(0.001, t + (interval / 1000) * 0.85);
      leadOsc.connect(leadGain);
      leadGain.connect(this.bgmGain);
      leadOsc.start(t);
      leadOsc.stop(t + (interval / 1000) * 0.85);

      // 2. Bass Voice (Every 2 steps)
      if (step % 2 === 0) {
        const bassFreq = bassNotes[(step / 2) % bassNotes.length];
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, t);
        bassGain.gain.setValueAtTime(track === 'boss' ? 0.14 : 0.09, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + (interval / 1000) * 1.6);
        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGain);
        bassOsc.start(t);
        bassOsc.stop(t + (interval / 1000) * 1.6);
      }

      step++;
    }, interval);
  }

  stopBgm() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  pause() {
    if (this.ctx && this.ctx.state === 'running') {
      try { this.ctx.suspend(); } catch (e) {}
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended' && !this.isMuted) {
      try { this.ctx.resume(); } catch (e) {}
    }
  }
}

/**
 * Player Class (Pip the Meadow Sprite)
 */
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = 18;
    this.height = 26;
    this.facing = 1;

    this.health = 3;
    this.maxHealth = 3;
    this.isGrounded = false;
    this.wasGrounded = false;

    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.dashTimer = 0;
    this.hasAirDash = true;
    this.invulnTimer = 0;
    this.knockbackTimer = 0;
    this.dialogueCooldownTimer = 0;
    this.isDashing = false;

    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.state = 'IDLE'; // IDLE, RUN, JUMP, FALL, DASH, HURT
  }

  update(dt, input, audio, particles, juice) {
    // 1. Timers
    if (this.invulnTimer > 0) this.invulnTimer -= dt;
    if (this.knockbackTimer > 0) this.knockbackTimer -= dt;
    if (this.dialogueCooldownTimer > 0) this.dialogueCooldownTimer -= dt;

    if (this.isGrounded) {
      this.coyoteTimer = KINEMATICS.COYOTE_TIME;
      this.hasAirDash = true;
      if (!this.wasGrounded) {
        // Landing compression squash (1.25x, 0.75x) & dust puffs
        this.scaleX = 1.25;
        this.scaleY = 0.75;
        particles.dust(this.x - 6, this.y + this.height / 2, 4);
        particles.dust(this.x + 6, this.y + this.height / 2, 4);
        particles.leafBurst(this.x, this.y + this.height / 2, 6);
        audio.playLand();
      }
    } else {
      this.coyoteTimer -= dt;
    }
    this.wasGrounded = this.isGrounded;

    // Jump buffer
    if (input.isJustPressed('up') && this.dialogueCooldownTimer <= 0) {
      this.jumpBufferTimer = KINEMATICS.JUMP_BUFFER;
    } else if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= dt;
    }

    // Squash/stretch recovery spring physics
    this.scaleX += (1.0 - this.scaleX) * 12 * dt;
    this.scaleY += (1.0 - this.scaleY) * 12 * dt;

    // Knockback
    if (this.knockbackTimer > 0) {
      this.vy = Math.min(this.vy + KINEMATICS.GRAVITY * dt, KINEMATICS.FALL_CLAMP);
      return;
    }

    // Dash state
    if (this.isDashing) {
      this.dashTimer -= dt;
      this.vx = this.facing * KINEMATICS.DASH_SPEED;
      this.vy = 0; // Lock gravity during dash
      this.scaleX = 1.35;
      this.scaleY = 0.75;

      // Emerald wind trail particles streaming behind Pip
      particles.emit({
        x: this.x - this.facing * 10,
        y: this.y + (Math.random() - 0.5) * 8,
        count: 2,
        colors: ['#2EC4B6', '#80ED99', '#FFE66D', '#FFFFFF'],
        speedMin: 40,
        speedMax: 120,
        angleMin: this.facing > 0 ? Math.PI * 0.8 : -Math.PI * 0.2,
        angleMax: this.facing > 0 ? Math.PI * 1.2 : Math.PI * 0.2,
        radiusMin: 2,
        radiusMax: 4.5,
        lifeMin: 0.2,
        lifeMax: 0.45,
        gravity: 0,
        drag: 0.92,
        shape: 'spark'
      });

      if (this.dashTimer <= 0) {
        this.isDashing = false;
        this.vx *= 0.5;
        this.state = this.isGrounded ? 'IDLE' : 'FALL';
      }
      return;
    }

    // Dash initiation (1x mid-air dash rule)
    if (input.isJustPressed('dash') && this.knockbackTimer <= 0) {
      if (this.isGrounded || this.hasAirDash) {
        if (!this.isGrounded) this.hasAirDash = false;
        this.isDashing = true;
        this.dashTimer = KINEMATICS.DASH_DURATION;
        this.invulnTimer = Math.max(this.invulnTimer, KINEMATICS.DASH_DURATION);
        this.scaleX = 1.35;
        this.scaleY = 0.75;
        audio.playDash();
        juice.screenShake(2);
        particles.burst(this.x, this.y, '#FFD166', 10);
        particles.sparkles(this.x, this.y, 8);
        return;
      } else {
        // Subtle fizzle puff
        particles.dust(this.x, this.y, 3, 'rgba(255,255,255,0.4)');
      }
    }

    // Horizontal movement
    const moveDir = (input.isDown('right') ? 1 : 0) - (input.isDown('left') ? 1 : 0);
    if (moveDir !== 0) {
      this.facing = moveDir;
      const accel = this.isGrounded ? KINEMATICS.ACCEL_GROUND : KINEMATICS.ACCEL_AIR;
      this.vx = MathUtils.approach(this.vx, moveDir * KINEMATICS.SPEED_MAX, accel * dt);
    } else {
      const decel = this.isGrounded ? KINEMATICS.DECEL_GROUND : KINEMATICS.DRAG_AIR;
      this.vx = MathUtils.approach(this.vx, 0, decel * dt);
    }

    // Jump execution (grounded or coyote) - vertical stretch (0.85x, 1.20x)
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.vy = KINEMATICS.JUMP_VEL;
      this.jumpBufferTimer = 0;
      this.coyoteTimer = 0;
      this.isGrounded = false;
      this.state = 'JUMP';
      this.scaleX = 0.85;
      this.scaleY = 1.20;
      audio.playJump();
      particles.emit({
        x: this.x,
        y: this.y + this.height / 2,
        count: 8,
        colors: ['#FFD166', '#FFE66D', '#FFF4E0', '#FFB703'],
        speedMin: 35,
        speedMax: 110,
        radiusMin: 2,
        radiusMax: 4.5,
        lifeMin: 0.25,
        lifeMax: 0.55,
        gravity: 60,
        shape: 'spark'
      });
      particles.dust(this.x, this.y + this.height / 2, 5, 'rgba(255, 209, 102, 0.85)');
      particles.leafBurst(this.x, this.y + this.height / 2, 4);
    }

    // Variable jump cut
    if (!input.isDown('up') && this.vy < KINEMATICS.JUMP_CUT_VEL) {
      this.vy = KINEMATICS.JUMP_CUT_VEL;
    }

    // Gravity
    this.vy = Math.min(this.vy + KINEMATICS.GRAVITY * dt, KINEMATICS.FALL_CLAMP);

    // Dynamic Kinematic In-Air Squash & Stretch
    if (!this.isGrounded) {
      if (this.vy < -100) {
        this.scaleX = 0.85;
        this.scaleY = 1.20;
      } else if (this.vy > 100) {
        this.scaleX = 0.90;
        this.scaleY = 1.15;
      }
      this.state = this.vy < 0 ? 'JUMP' : 'FALL';
    } else {
      this.state = Math.abs(this.vx) > 15 ? 'RUN' : 'IDLE';
    }
  }

  triggerDamage(amount, sourceX) {
    if (this.invulnTimer > 0 || this.isDashing) return;
    this.health = Math.max(0, this.health - amount);
    this.invulnTimer = KINEMATICS.INVULN_DURATION;
    this.knockbackTimer = 0.20;
    const kbDir = this.x < sourceX ? -1 : 1;
    this.vx = kbDir * 160;
    this.vy = -180;
    this.scaleX = 0.85;
    this.scaleY = 1.25;
    this.isGrounded = false;
    this.state = 'HURT';
  }

  triggerStompBounce() {
    this.vy = KINEMATICS.STOMP_BOUNCE;
    this.hasAirDash = true; // Stomp resets air dash!
    this.isGrounded = false;
    this.scaleX = 1.30;
    this.scaleY = 0.70;
  }
}

/**
 * Climax Boss: The Bramblethorn Golem
 */
class BramblethornGolem {
  constructor(arenaX, arenaY) {
    this.x = arenaX;
    this.y = arenaY;
    this.width = 64;
    this.height = 74;
    this.health = 3;
    this.maxHealth = 3;
    this.phase = 1;

    this.state = 'IDLE'; // IDLE, STRIDE, SLAM_WINDUP, SLAM, VULNERABLE, CHARGE, DAZED, HURT, DEFEATED
    this.stateTimer = 2.0;
    this.isCoreExposed = false;
    this.shockwaves = [];
    this.briarBalls = [];
    this.fallingThorns = [];
    this.chargeDir = 1;
    this.facing = 1;
  }

  update(dt, player, audio, particles, juice) {
    if (this.state === 'DEFEATED') return;

    this.stateTimer -= dt;

    // Update shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.x += sw.vx * dt;
      sw.life -= dt;
      if (sw.life <= 0 || sw.x < 1120 || sw.x > 1800) {
        this.shockwaves.splice(i, 1);
      }
    }

    // Update briar balls
    for (let i = this.briarBalls.length - 1; i >= 0; i--) {
      const bb = this.briarBalls[i];
      bb.x += bb.vx * dt;
      bb.y += bb.vy * dt;
      bb.vy += 600 * dt;
      if (bb.y >= 380) {
        bb.y = 380;
        bb.vy = -200; // bounce
      }
      if (bb.x <= 1130 || bb.x >= 1790) {
        bb.vx *= -1;
      }
      bb.life -= dt;
      if (bb.life <= 0) {
        this.briarBalls.splice(i, 1);
      }
    }

    // Update falling thorns
    for (let i = this.fallingThorns.length - 1; i >= 0; i--) {
      const ft = this.fallingThorns[i];
      ft.timer -= dt;
      if (ft.timer <= 0 && !ft.dropped) {
        ft.dropped = true;
        ft.vy = 400;
      }
      if (ft.dropped) {
        ft.y += ft.vy * dt;
        if (ft.y >= 390) {
          particles.burst(ft.x, 390, '#C86428', 8);
          this.fallingThorns.splice(i, 1);
        }
      }
    }

    // State machine
    switch (this.state) {
      case 'IDLE':
        this.facing = player.x < this.x ? -1 : 1;
        if (this.stateTimer <= 0) {
          if (this.phase === 3) {
            this.state = 'BARRAGE';
            this.stateTimer = 1.0;
            // Spawn 3 falling thorn reticles
            this.fallingThorns = [
              { x: player.x - 60, y: 120, targetY: 390, timer: 0.6, dropped: false },
              { x: player.x, y: 120, targetY: 390, timer: 0.8, dropped: false },
              { x: player.x + 60, y: 120, targetY: 390, timer: 1.0, dropped: false }
            ];
          } else if (this.phase === 2 && Math.random() < 0.5) {
            this.state = 'SPORES';
            this.stateTimer = 1.5;
            audio.playBossRoar();
            // Launch 2 rolling briar spores
            this.briarBalls.push({ x: this.x - 20, y: this.y - 20, vx: -180, vy: -150, life: 4.0, radius: 10 });
            this.briarBalls.push({ x: this.x + 20, y: this.y - 20, vx: 180, vy: -150, life: 4.0, radius: 10 });
          } else {
            this.state = 'SLAM_WINDUP';
            this.stateTimer = 0.8;
            audio.playBossRoar();
          }
        }
        break;

      case 'BARRAGE':
        if (this.stateTimer <= 0) {
          this.state = 'CHARGE';
          this.chargeDir = player.x < this.x ? -1 : 1;
          this.facing = this.chargeDir;
          this.stateTimer = 3.0;
          audio.playBossRoar();
        }
        break;

      case 'SPORES':
        if (this.stateTimer <= 0) {
          this.state = 'SLAM_WINDUP';
          this.stateTimer = 0.7;
        }
        break;

      case 'SLAM_WINDUP':
        if (this.stateTimer <= 0) {
          this.state = 'SLAM';
          audio.playBossSlam();
          juice.screenShake(20); // Elevated to 20px on Boss Slam!
          juice.spawnShockwave(this.x, 390, 95, '#FFAA00');
          particles.dust(this.x - 30, 390, 10);
          particles.dust(this.x + 30, 390, 10);
          particles.burst(this.x, this.y, '#8D5B28', 24);
          const speed = this.phase === 1 ? 200 : 260;
          this.shockwaves.push({ x: this.x - 20, y: 385, vx: -speed, width: 20, height: 16, life: 3.0 });
          this.shockwaves.push({ x: this.x + 20, y: 385, vx: speed, width: 20, height: 16, life: 3.0 });

          this.state = 'VULNERABLE';
          this.isCoreExposed = true;
          this.stateTimer = this.phase === 1 ? 3.5 : 2.6;
        }
        break;

      case 'CHARGE':
        this.x += this.chargeDir * 320 * dt;
        if (this.x <= 1160 || this.x >= 1760) {
          this.x = Math.max(1160, Math.min(1760, this.x));
          this.state = 'DAZED';
          this.isCoreExposed = true;
          this.stateTimer = 2.2;
          audio.playBossCrash();
          juice.screenShake(18); // Elevated to 18px on Boss Wall Crash!
          juice.spawnShockwave(this.x, this.y, 75, '#FFD166');
          particles.burst(this.x, this.y, '#FFD166', 30);
          particles.dust(this.x, this.y + 20, 14);
        }
        break;

      case 'VULNERABLE':
      case 'DAZED':
        if (this.stateTimer <= 0) {
          this.isCoreExposed = false;
          this.state = 'IDLE';
          this.stateTimer = 1.2;
        }
        break;

      case 'HURT':
        if (this.stateTimer <= 0) {
          if (this.health <= 0) {
            this.state = 'DEFEATED';
            audio.playVictory();
            juice.screenShake(16);
            juice.spawnShockwave(this.x, this.y, 90, '#FF758F');
            juice.spawnFloatingText('COLOSSUS PURIFIED!', this.x, this.y - 50, { color: '#FFE66D', size: 24 });
            particles.confetti(this.x, this.y, 60);
            particles.burst(this.x, this.y, '#FF758F', 50);
          } else {
            this.isCoreExposed = false;
            this.state = 'IDLE';
            this.stateTimer = 1.0;
          }
        }
        break;
    }
  }

  takeDamage(amount) {
    if (!this.isCoreExposed || this.state === 'HURT' || this.state === 'DEFEATED') return false;
    this.health = Math.max(0, this.health - amount);
    this.phase = 4 - this.health; // 1, 2, 3
    this.state = 'HURT';
    this.stateTimer = 0.8;
    this.isCoreExposed = false;
    return true;
  }
}

/**
 * Procedural Vector Graphics Drawing Module
 */
const Renderer = {
  drawPip(ctx, x, y, state) {
    const { facing = 1, vx = 0, vy = 0, isGrounded = true, isDashing = false, invulnTimer = 0, animTime = 0 } = state;
    if (invulnTimer > 0 && Math.floor(invulnTimer * 20) % 2 === 0) return;

    ctx.save();
    ctx.translate(x, y + 13); // feet level

    // Ground Drop Shadow (Scales with ground proximity)
    const groundDist = isGrounded ? 0 : Math.min(60, Math.max(0, -vy * 0.05));
    const shadowScale = isGrounded ? 1.0 : Math.max(0.4, 1.0 - groundDist / 80);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 11 * shadowScale, 3.5 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    let sx = state.scaleX || 1.0;
    let sy = state.scaleY || 1.0;

    // Apply facing direction, squash/stretch and run lean
    const runLean = isGrounded && Math.abs(vx) > 20 ? (vx / KINEMATICS.SPEED_MAX) * 0.12 : 0;
    ctx.scale(facing * sx, sy);
    ctx.rotate(runLean * facing);

    // Multi-layered Dash Ghost Streaks
    if (isDashing) {
      ctx.fillStyle = 'rgba(46, 196, 182, 0.45)';
      ctx.beginPath();
      ctx.ellipse(-14, -14, 12, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(128, 237, 153, 0.25)';
      ctx.beginPath();
      ctx.ellipse(-24, -14, 8, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const cloakFlutter = !isGrounded ? Math.sin(animTime * 18) * 4 - vy * 0.02 : (Math.abs(vx) > 10 ? Math.sin(animTime * 16) * 5 : Math.sin(animTime * 4) * 2);

    // Leaf Cloak (Dark shadow fold)
    ctx.fillStyle = '#1B9AAA';
    ctx.beginPath();
    ctx.moveTo(-6, -18);
    ctx.quadraticCurveTo(-14 - Math.abs(vx) * 0.03, -8 + cloakFlutter, -12, -2);
    ctx.lineTo(8, -2);
    ctx.closePath();
    ctx.fill();

    // Vibrant Emerald Mint Cloak
    ctx.fillStyle = '#2EC4B6';
    ctx.beginPath();
    ctx.moveTo(-7, -20);
    ctx.quadraticCurveTo(-12 - Math.abs(vx) * 0.04, -10 + cloakFlutter, -10, -2);
    ctx.quadraticCurveTo(0, -1, 7, -2);
    ctx.quadraticCurveTo(6, -12, 5, -20);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#14281D';
    ctx.stroke();

    // Cloak Golden Leaf Clasp
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.arc(0, -18, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Little Boots
    const legOffset = isGrounded && Math.abs(vx) > 20 ? Math.sin(animTime * 14) * 4 : 0;
    ctx.fillStyle = '#7F4F24';
    ctx.beginPath();
    ctx.ellipse(-4, -1 - Math.max(0, legOffset), 3, 2.2, 0, 0, Math.PI * 2);
    ctx.ellipse(4, -1 - Math.max(0, -legOffset), 3, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2D2013';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Sprite Head & Body Base
    ctx.fillStyle = '#FFF4E0';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-8, -26, 16, 15, [8, 8, 6, 6]);
    else ctx.rect(-8, -26, 16, 15);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#2D2013';
    ctx.stroke();

    // Rosy Blush Cheeks
    ctx.fillStyle = 'rgba(255, 107, 129, 0.55)';
    ctx.beginPath();
    ctx.ellipse(-5.5, -17, 2.2, 1.3, 0, 0, Math.PI * 2);
    ctx.ellipse(5.5, -17, 2.2, 1.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes & Specular Highlights
    ctx.fillStyle = '#221914';
    ctx.beginPath();
    ctx.ellipse(-3.5, -20, 2.2, 3.2, 0, 0, Math.PI * 2);
    ctx.ellipse(4.5, -20, 2.2, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-4.2, -21.5, 1.0, 0, Math.PI * 2);
    ctx.arc(3.8, -21.5, 1.0, 0, Math.PI * 2);
    ctx.arc(-2.6, -19.0, 0.5, 0, Math.PI * 2);
    ctx.arc(5.4, -19.0, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Cute Smile
    ctx.strokeStyle = '#684535';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0.5, -17, 2.0, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Acorn Cap Beret
    ctx.fillStyle = '#9C6644';
    ctx.beginPath();
    ctx.ellipse(0, -26, 9.5, 5, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#2D2013';
    ctx.stroke();

    // Beret Brim
    ctx.fillStyle = '#7F4F24';
    ctx.beginPath();
    ctx.ellipse(0, -24, 8.5, 2.2, -0.05, 0, Math.PI * 2);
    ctx.fill();

    // Beret Stem
    ctx.strokeStyle = '#583110';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.quadraticCurveTo(2, -34, 4, -35);
    ctx.stroke();

    // Antennae & Glowing Bulbs with Radial Soft Aura
    const antBob = Math.sin(animTime * 8) * 1.5;
    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-4, -28);
    ctx.quadraticCurveTo(-8, -33 + antBob, -9, -36 + antBob);
    ctx.moveTo(3, -28);
    ctx.quadraticCurveTo(7, -33 - antBob, 9, -36 - antBob);
    ctx.stroke();

    // Bulb 1 Aura
    const bulbGlow1 = ctx.createRadialGradient(-9, -36 + antBob, 0.5, -9, -36 + antBob, 5);
    bulbGlow1.addColorStop(0, '#FFFFFF');
    bulbGlow1.addColorStop(0.4, '#FFE66D');
    bulbGlow1.addColorStop(1, 'rgba(255, 230, 109, 0)');
    ctx.fillStyle = bulbGlow1;
    ctx.beginPath();
    ctx.arc(-9, -36 + antBob, 5, 0, Math.PI * 2);
    ctx.fill();

    // Bulb 2 Aura
    const bulbGlow2 = ctx.createRadialGradient(9, -36 - antBob, 0.5, 9, -36 - antBob, 5);
    bulbGlow2.addColorStop(0, '#FFFFFF');
    bulbGlow2.addColorStop(0.4, '#FFE66D');
    bulbGlow2.addColorStop(1, 'rgba(255, 230, 109, 0)');
    ctx.fillStyle = bulbGlow2;
    ctx.beginPath();
    ctx.arc(9, -36 - antBob, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  drawAcornWalker(ctx, x, y, facing, animTime) {
    ctx.save();
    ctx.translate(x, y + 11);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.20)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.scale(facing, 1);
    const tilt = Math.sin(animTime * 10) * 0.12;
    ctx.rotate(tilt);

    // Feet
    ctx.fillStyle = '#5A3825';
    ctx.beginPath();
    ctx.ellipse(-5, -2 + Math.sin(animTime * 10) * 2, 2.5, 2, 0, 0, Math.PI * 2);
    ctx.ellipse(5, -2 - Math.sin(animTime * 10) * 2, 2.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Acorn Body
    ctx.fillStyle = '#C68B59';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-9, -20, 18, 18, [8, 8, 9, 9]);
    else ctx.rect(-9, -20, 18, 18);
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#432818';
    ctx.stroke();

    // Helmet Cap
    ctx.fillStyle = '#6F4E37';
    ctx.beginPath();
    ctx.ellipse(0, -18, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38220F';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Leaf Sprout
    ctx.fillStyle = '#6BCB77';
    ctx.beginPath();
    ctx.ellipse(3, -25, 3.5, 1.8, 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Angry Brows & Eyes
    ctx.fillStyle = '#2B1D0C';
    ctx.beginPath();
    ctx.arc(-4, -13, 2.2, 0, Math.PI * 2);
    ctx.arc(4, -13, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-4.5, -14, 0.7, 0, Math.PI * 2);
    ctx.arc(3.5, -14, 0.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  drawSporeHopper(ctx, x, y, state, animTime) {
    ctx.save();
    ctx.translate(x, y + 12);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Accordion Stem
    ctx.fillStyle = '#FFACC7';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-5, -8, 10, 8, [2, 2, 4, 4]);
    else ctx.rect(-5, -8, 10, 8);
    ctx.fill();
    ctx.strokeStyle = '#5E1736';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Magenta Cap
    ctx.fillStyle = '#7209B7';
    ctx.beginPath();
    ctx.arc(0, -12, 11, Math.PI, 0, false);
    ctx.quadraticCurveTo(0, -6, -11, -12);
    ctx.fill();
    ctx.strokeStyle = '#3C096C';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Yellow Spores
    ctx.fillStyle = '#FFEA00';
    ctx.beginPath();
    ctx.arc(-5, -17, 2.5, 0, Math.PI * 2);
    ctx.arc(4, -18, 2.0, 0, Math.PI * 2);
    ctx.arc(0, -21, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(-4, -11, 2.2, 2.5, 0, 0, Math.PI * 2);
    ctx.ellipse(4, -11, 2.2, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#240046';
    ctx.beginPath();
    ctx.arc(-4, -11, 1.4, 0, Math.PI * 2);
    ctx.arc(4, -11, 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  drawGlowBat(ctx, x, y, facing, animTime) {
    ctx.save();
    ctx.translate(x, y);

    // Cyan Light Aura
    ctx.fillStyle = 'rgba(0, 245, 212, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.scale(facing, 1);
    const wingFlap = Math.sin(animTime * 12);

    // Wings
    ctx.fillStyle = '#00F5D4';
    ctx.strokeStyle = '#05668D';
    ctx.lineWidth = 1.4;

    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.quadraticCurveTo(-14, -10 * wingFlap, -18, 2 * wingFlap);
    ctx.quadraticCurveTo(-12, 8 * wingFlap, -4, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.quadraticCurveTo(14, -10 * wingFlap, 18, 2 * wingFlap);
    ctx.quadraticCurveTo(12, 8 * wingFlap, 4, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Body
    ctx.fillStyle = '#3A0CA3';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-6, -7, 12, 14, [6, 6, 5, 5]);
    else ctx.rect(-6, -7, 12, 14);
    ctx.fill();
    ctx.strokeStyle = '#1D0047';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.arc(-2.5, -2, 2.0, 0, Math.PI * 2);
    ctx.arc(2.5, -2, 2.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#03071E';
    ctx.beginPath();
    ctx.arc(-2.5, -2, 0.9, 0, Math.PI * 2);
    ctx.arc(2.5, -2, 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  drawBrambleCharger(ctx, x, y, state, facing, animTime) {
    const isStunned = state === 'DAZED';
    const isCharging = state === 'CHARGE';

    ctx.save();
    ctx.translate(x, y + 12);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.scale(facing, 1);

    // Legs
    ctx.fillStyle = '#4A2E18';
    const step = Math.sin(animTime * (isCharging ? 24 : 8)) * 3;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-12, -4 + step, 5, 5, 2);
      ctx.roundRect(10, -4 - step, 5, 5, 2);
    } else {
      ctx.rect(-12, -4 + step, 5, 5);
      ctx.rect(10, -4 - step, 5, 5);
    }
    ctx.fill();

    // Carapace
    ctx.fillStyle = '#6B4226';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-15, -20, 30, 18, [10, 10, 4, 4]);
    else ctx.rect(-15, -20, 30, 18);
    ctx.fill();
    ctx.strokeStyle = '#2B1709';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // Back Horns
    ctx.fillStyle = '#C86428';
    ctx.beginPath();
    ctx.moveTo(-10, -20); ctx.lineTo(-7, -26); ctx.lineTo(-4, -20);
    ctx.moveTo(-2, -20); ctx.lineTo(1, -27); ctx.lineTo(4, -20);
    ctx.moveTo(6, -20); ctx.lineTo(9, -25); ctx.lineTo(12, -20);
    ctx.fill();
    ctx.stroke();

    // Snout
    ctx.fillStyle = '#8B5A2B';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(8, -14, 8, 10, [3, 6, 6, 3]);
    else ctx.rect(8, -14, 8, 10);
    ctx.fill();
    ctx.stroke();

    // Eyes / Dizzy Stars
    if (isStunned) {
      // Dizzy eyes
      ctx.strokeStyle = '#FFB703';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(6, -13, 3, 0, Math.PI * 1.5);
      ctx.stroke();
      // Orbiting stars
      const starAngle = animTime * 6;
      for (let i = 0; i < 3; i++) {
        const a = starAngle + (i * Math.PI * 2) / 3;
        ctx.fillStyle = '#FFE600';
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 14, -26 + Math.sin(a) * 5, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = isCharging ? '#FF0054' : '#ED4C67';
      ctx.beginPath();
      ctx.arc(6, -13, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },

  drawBramblethornGolem(ctx, golem, animTime) {
    const { x, y, health, state, isCoreExposed } = golem;
    const isEnraged = health === 1;

    ctx.save();
    ctx.translate(x, y + 37);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 32, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    const yOffset = isCoreExposed ? 12 : Math.sin(animTime * 3) * 2;
    ctx.translate(0, yOffset);

    // Bark Legs
    ctx.fillStyle = '#3E271E';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-24, -20, 16, 20, [4, 4, 6, 6]);
      ctx.roundRect(8, -20, 16, 20, [4, 4, 6, 6]);
    } else {
      ctx.rect(-24, -20, 16, 20);
      ctx.rect(8, -20, 16, 20);
    }
    ctx.fill();
    ctx.strokeStyle = '#1D110C';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Wood Torso
    ctx.fillStyle = '#5A3825';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-28, -62, 56, 46, [14, 14, 8, 8]);
    else ctx.rect(-28, -62, 56, 46);
    ctx.fill();
    ctx.stroke();

    // Moss Shoulders
    ctx.fillStyle = '#4F772D';
    ctx.beginPath();
    ctx.ellipse(-20, -58, 8, 4, -0.2, 0, Math.PI * 2);
    ctx.ellipse(20, -58, 8, 4, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#43281C';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-16, -76, 32, 18, [8, 8, 4, 4]);
    else ctx.rect(-16, -76, 32, 18);
    ctx.fill();
    ctx.stroke();

    // Horns
    ctx.strokeStyle = '#6F4E37';
    ctx.lineWidth = 4.0;
    ctx.beginPath();
    ctx.moveTo(-12, -74); ctx.lineTo(-24, -90); ctx.lineTo(-28, -88);
    ctx.moveTo(12, -74); ctx.lineTo(24, -90); ctx.lineTo(28, -88);
    ctx.stroke();

    // Eye Slits
    const eyeColor = isEnraged ? '#FF0054' : (health === 2 ? '#FF9E00' : '#00F5D4');
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.ellipse(-7, -68, 3.5, 2.0, isEnraged ? 0.3 : 0, 0, Math.PI * 2);
    ctx.ellipse(7, -68, 3.5, 2.0, isEnraged ? -0.3 : 0, 0, Math.PI * 2);
    ctx.fill();

    // Core / Heart
    if (isCoreExposed) {
      // Open Core Flare
      const corePulse = Math.sin(animTime * 10) * 3;
      ctx.fillStyle = 'rgba(255, 170, 0, 0.6)';
      ctx.beginPath();
      ctx.arc(0, -38, 16 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFE66D';
      ctx.beginPath();
      ctx.arc(0, -38, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // Stomp Down Arrow
      const arrowBob = Math.sin(animTime * 8) * 4;
      ctx.fillStyle = '#FFE600';
      ctx.beginPath();
      ctx.moveTo(0, -66 + arrowBob);
      ctx.lineTo(-6, -76 + arrowBob);
      ctx.lineTo(6, -76 + arrowBob);
      ctx.closePath();
      ctx.fill();
    } else {
      // Briar Plate
      ctx.fillStyle = '#2B1709';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-12, -46, 24, 18, 4);
      else ctx.rect(-12, -46, 24, 18);
      ctx.fill();
      ctx.strokeStyle = '#780000';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    // Fists
    const fistBob = Math.sin(animTime * 4) * 4;
    ctx.fillStyle = '#4A2E18';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-36, -42 + fistBob, 14, 18, [6, 4, 6, 6]);
      ctx.roundRect(22, -42 - fistBob, 14, 18, [4, 6, 6, 6]);
    } else {
      ctx.rect(-36, -42 + fistBob, 14, 18);
      ctx.rect(22, -42 - fistBob, 14, 18);
    }
    ctx.fill();
    ctx.strokeStyle = '#1D110C';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    ctx.restore();

    // Render Shockwaves
    for (const sw of golem.shockwaves) {
      ctx.fillStyle = '#FFAA00';
      ctx.beginPath();
      ctx.ellipse(sw.x, sw.y, sw.width / 2, sw.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FF5400';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Render Briar Balls
    for (const bb of golem.briarBalls) {
      ctx.fillStyle = '#C86428';
      ctx.beginPath();
      ctx.arc(bb.x, bb.y, bb.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#780000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Render Falling Thorns
    for (const ft of golem.fallingThorns) {
      if (!ft.dropped) {
        // Red warning reticle on floor
        ctx.strokeStyle = 'rgba(255, 0, 84, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(ft.x, ft.targetY, 18, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Falling briar stalactite
        ctx.fillStyle = '#780000';
        ctx.beginPath();
        ctx.moveTo(ft.x, ft.y);
        ctx.lineTo(ft.x - 6, ft.y - 20);
        ctx.lineTo(ft.x + 6, ft.y - 20);
        ctx.closePath();
        ctx.fill();
      }
    }
  },

  drawSunBerry(ctx, x, y, animTime) {
    const floatBob = Math.sin(animTime * 4) * 3;
    ctx.save();
    ctx.translate(x, y + floatBob);

    // Glow Bloom
    ctx.fillStyle = 'rgba(255, 209, 102, 0.45)';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    // Berry Cluster
    ctx.fillStyle = '#FFB703';
    ctx.beginPath();
    ctx.arc(-3.5, 1, 5, 0, Math.PI * 2);
    ctx.arc(3.5, 1, 5, 0, Math.PI * 2);
    ctx.arc(0, -4, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D48B00';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Leaf Stalk
    ctx.fillStyle = '#52B788';
    ctx.beginPath();
    ctx.ellipse(3, -9, 3.5, 1.8, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles
    for (let i = 0; i < 3; i++) {
      const a = animTime * 3 + (i * Math.PI * 2) / 3;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 12, Math.sin(a) * 8, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },

  drawGoldenAcorn(ctx, x, y, animTime) {
    ctx.save();
    ctx.translate(x, y + Math.sin(animTime * 3) * 2.5);
    const spin = Math.sin(animTime * 5);
    ctx.scale(spin, 1);

    ctx.fillStyle = '#FFD000';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-5, -3, 10, 10, [2, 2, 6, 6]);
    else ctx.rect(-5, -3, 10, 10);
    ctx.fill();
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.fillStyle = '#8B5A2B';
    ctx.beginPath();
    ctx.ellipse(0, -4, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  drawLoreMedallion(ctx, x, y, id, animTime) {
    ctx.save();
    ctx.translate(x, y + Math.sin(animTime * 3) * 3);

    // Rim
    ctx.fillStyle = '#DDA15E';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7F4F24';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // Core
    let coreColor = '#FFB703';
    if (id === 'medallion_dawn') coreColor = '#FB8500';
    if (id === 'medallion_whispers') coreColor = '#52B788';
    if (id === 'medallion_luminescence') coreColor = '#00F5D4';
    if (id === 'medallion_zephyr') coreColor = '#3A86FF';
    if (id === 'medallion_ancients') coreColor = '#7209B7';

    ctx.fillStyle = coreColor;
    ctx.beginPath();
    ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
    ctx.fill();

    // Glyph
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  },

  drawBarnabySnail(ctx, x, y, animTime) {
    ctx.save();
    ctx.translate(x, y + 15);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Foot
    ctx.fillStyle = '#E9D8A6';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-16, -8, 34, 8, [6, 6, 2, 2]);
    else ctx.rect(-16, -8, 34, 8);
    ctx.fill();
    ctx.strokeStyle = '#94D2BD';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Shell
    ctx.fillStyle = '#EE9B00';
    ctx.beginPath();
    ctx.arc(-2, -18, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#CA6702';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // Teapot
    ctx.fillStyle = '#E0FBFC';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-5, -36, 10, 6, 2);
    else ctx.rect(-5, -36, 10, 6);
    ctx.fill();

    // Head & Spectacles
    ctx.fillStyle = '#E9D8A6';
    ctx.beginPath();
    ctx.ellipse(14, -14, 6, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#DDA15E';
    ctx.lineWidth = 1.4;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(12, -24, 3, 0, Math.PI * 2);
    ctx.arc(19, -24, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  },

  drawWillowOwl(ctx, x, y, animTime) {
    ctx.save();
    ctx.translate(x, y + 20);

    // Lectern
    ctx.fillStyle = '#5A3825';
    ctx.fillRect(-10, -14, 20, 14);

    // Body
    const breathe = Math.sin(animTime * 3) * 1.5;
    ctx.fillStyle = '#4A3E3D';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-10, -42 + breathe, 20, 24, [10, 10, 6, 6]);
    else ctx.rect(-10, -42 + breathe, 20, 24);
    ctx.fill();
    ctx.strokeStyle = '#28231D';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#FEFAE0';
    ctx.beginPath();
    ctx.arc(-4.5, -34 + breathe, 4.5, 0, Math.PI * 2);
    ctx.arc(4.5, -34 + breathe, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#BC6C25';
    ctx.beginPath();
    ctx.arc(-4.5, -34 + breathe, 2.0, 0, Math.PI * 2);
    ctx.arc(4.5, -34 + breathe, 2.0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  drawElderRootSpirit(ctx, x, y, animTime) {
    ctx.save();
    ctx.translate(x, y + 20 + Math.sin(animTime * 2.5) * 5);

    // Glow Aura
    ctx.fillStyle = 'rgba(128, 237, 153, 0.35)';
    ctx.beginPath();
    ctx.arc(0, -20, 36, 0, Math.PI * 2);
    ctx.fill();

    // Root Gown
    ctx.fillStyle = '#80ED99';
    ctx.beginPath();
    ctx.moveTo(-10, -20);
    ctx.quadraticCurveTo(-18, 0, -12, 16);
    ctx.quadraticCurveTo(0, 8, 12, 16);
    ctx.quadraticCurveTo(18, 0, 10, -20);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = '#FAEDCD';
    ctx.beginPath();
    ctx.ellipse(0, -28, 9, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Antlers with Cherry Blossoms
    ctx.strokeStyle = '#606C38';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-6, -38); ctx.lineTo(-14, -54);
    ctx.moveTo(6, -38); ctx.lineTo(14, -54);
    ctx.stroke();

    ctx.fillStyle = '#FF758F';
    ctx.beginPath();
    ctx.arc(-14, -54, 3, 0, Math.PI * 2);
    ctx.arc(14, -54, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  drawWaystone(ctx, x, y, isAttuned, animTime) {
    ctx.save();
    ctx.translate(x, y + 20);

    // Stone Pillar
    ctx.fillStyle = '#6C757D';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-10, -36, 20, 36, [4, 4, 1, 1]);
    else ctx.rect(-10, -36, 20, 36);
    ctx.fill();
    ctx.strokeStyle = '#343A40';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // Runic Glow
    if (isAttuned) {
      ctx.fillStyle = 'rgba(255, 209, 102, 0.4)';
      ctx.beginPath();
      ctx.arc(0, -20, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = isAttuned ? '#FFD166' : '#495057';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(0, -20, 5, 0, Math.PI * 2);
    ctx.moveTo(0, -28); ctx.lineTo(0, -12);
    ctx.stroke();

    ctx.restore();
  },

  drawSpringboardMushroom(ctx, x, y, isCompressed) {
    ctx.save();
    ctx.translate(x, y + 10);
    const sy = isCompressed ? 0.45 : 1.0;
    ctx.scale(1, sy);

    // Stem
    ctx.fillStyle = '#E2ECE9';
    ctx.fillRect(-6, -10, 12, 10);

    // Cap
    ctx.fillStyle = '#F72585';
    ctx.beginPath();
    ctx.arc(0, -12, 15, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#7209B7';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, -20, 3, 0, Math.PI * 2);
    ctx.arc(-8, -14, 2, 0, Math.PI * 2);
    ctx.arc(8, -14, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  drawHUDHeart(ctx, x, y, isFilled) {
    ctx.save();
    ctx.translate(x, y);
    if (isFilled) {
      ctx.fillStyle = '#FF3366';
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.bezierCurveTo(-9, -6, -10, -12, 0, -14);
      ctx.bezierCurveTo(10, -12, 9, -6, 0, 4);
      ctx.fill();
      ctx.strokeStyle = '#990033';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(20, 20, 30, 0.45)';
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.bezierCurveTo(-9, -6, -10, -12, 0, -14);
      ctx.bezierCurveTo(10, -12, 9, -6, 0, 4);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();
  }
};

/**
 * Main Meadowbound Game Engine Class
 */
export class MeadowboundGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.container = document.getElementById('game-container');
    this.virtualWidth = 720;
    this.virtualHeight = 450;

    this.renderer = new CanvasRenderer(this.canvas, this.virtualWidth, this.virtualHeight);
    this.camera = new Camera2D(this.virtualWidth, this.virtualHeight);
    this.input = new InputManager(this.canvas);
    this.audio = new MeadowboundAudio();
    this.particles = new ParticleSystem(300);
    this.juice = new JuiceEffects();
    this.dialogueSystem = new DialogueSystem(this.virtualWidth, this.virtualHeight);
    this.dialogueBox = this.dialogueSystem;
    this.playgama = new PlaygamaBridge();
    this.playgama.init();

    // Register Bridge visibility listener for audio pause/resume
    this.playgama.onVisibilityChange((isVisible) => {
      if (!isVisible) {
        this.audio.pause();
      } else if (this.fsm.currentState === GameStates.PLAYING) {
        this.audio.resume();
      }
    });

    // Global State Machine
    this.fsm = new StateMachine();
    this.fsm.setState = (name, payload) => this.fsm.transitionTo(name, payload);
    this.setupStateMachine();

    // Progression & Stats
    this.currentLevelIndex = 1;
    this.score = 0;
    this.deaths = 0;
    this.playtime = 0;
    this.sunBerriesCollected = new Set();
    this.goldenAcornsCollected = new Set();
    this.medallionsCollected = new Set();
    this.lastCheckpoint = { level: 1, x: 80, y: 360 };

    this.player = new Player(80, 360);
    this.boss = null;
    this.levelData = null;
    this.animTime = 0;

    this.activeNPC = null;
    this.activePrompt = null;
    this.transitionAlpha = 0;
    this.transitioning = false;

    // QA Flags
    this.isGodMode = false;
    this.noSave = false;

    this.parseUrlFlags();
    this.loadSaveData();
    this.setupDOM();
    this.loadLevel(this.currentLevelIndex);

    // Fixed timestep loop
    this.loop = new GameLoop({
      onUpdate: (dt) => this.update(dt),
      onRender: (alpha) => this.render(alpha)
    });
  }

  parseUrlFlags() {
    if (typeof window === 'undefined' || !window.location) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === '1') {
      localStorage.removeItem('meadowbound_save_v1');
      this.playgama.deleteData('meadowbound_save_v1');
    }
    if (params.get('nosave') === '1') {
      this.noSave = true;
    }
    if (params.get('god') === '1') {
      this.isGodMode = true;
    }
    if (params.get('level')) {
      const lvl = parseInt(params.get('level'), 10);
      if (lvl >= 1 && lvl <= 5) this.currentLevelIndex = lvl;
    }
  }

  loadSaveData() {
    if (this.noSave) return;
    try {
      const raw = localStorage.getItem('meadowbound_save_v1');
      if (raw) {
        const data = JSON.parse(raw);
        this.applySaveData(data);
      }
    } catch (e) {
      console.warn('[Meadowbound] Error loading local save data:', e);
    }

    // Playgama Cloud Storage fallback / sync
    if (this.playgama) {
      this.playgama.getData('meadowbound_save_v1').then((cloudData) => {
        if (cloudData && typeof cloudData === 'object') {
          this.applySaveData(cloudData);
        }
      }).catch((err) => {
        console.warn('[Meadowbound] Cloud save fetch warning:', err);
      });
    }
  }

  applySaveData(data) {
    if (!data) return;
    if (data.currentLevel) this.currentLevelIndex = data.currentLevel;
    if (data.score) this.score = data.score;
    if (data.deaths) this.deaths = data.deaths;
    if (data.playtimeSeconds) this.playtime = data.playtimeSeconds;
    if (Array.isArray(data.sunBerriesCollected)) {
      this.sunBerriesCollected = new Set(data.sunBerriesCollected);
    }
    if (Array.isArray(data.goldenAcornsCollected)) {
      this.goldenAcornsCollected = new Set(data.goldenAcornsCollected);
    }
    if (Array.isArray(data.medallionsCollected)) {
      this.medallionsCollected = new Set(data.medallionsCollected);
    }
    if (data.audioMuted !== undefined) {
      this.audio.setMuted(data.audioMuted);
      this.playgama.setMuted(data.audioMuted);
      const btnMute = document.getElementById('btn-mute');
      if (btnMute) btnMute.textContent = data.audioMuted ? '🔇' : '🔊';
    }
  }

  saveGame() {
    if (this.noSave) return;
    try {
      const saveState = {
        version: 1,
        currentLevel: this.currentLevelIndex,
        lastCheckpointId: `waystone_${this.currentLevelIndex}`,
        playerHealth: this.player.health,
        score: this.score,
        deaths: this.deaths,
        playtimeSeconds: Math.floor(this.playtime),
        sunBerriesCollected: Array.from(this.sunBerriesCollected),
        goldenAcornsCollected: Array.from(this.goldenAcornsCollected),
        medallionsCollected: Array.from(this.medallionsCollected),
        audioMuted: this.audio.isMuted,
        timestamp: Date.now()
      };
      // Local storage persistence
      localStorage.setItem('meadowbound_save_v1', JSON.stringify(saveState));
      // Cloud storage sync via Playgama Bridge
      if (this.playgama) {
        this.playgama.setData('meadowbound_save_v1', saveState);
      }
    } catch (e) {
      console.warn('[Meadowbound] Error saving progress:', e);
    }
  }

  saveGameState() {
    this.saveGame();
  }

  setupStateMachine() {
    this.fsm.addState(GameStates.TITLE, {
      enter: () => {
        const overlay = document.getElementById('title-overlay');
        if (overlay) overlay.classList.remove('hidden');
        this.audio.playBgm('meadow');
        // Emit mandatory Playgama Game Ready event once title screen is ready and interactive
        this.playgama.sendGameReady();
      },
      exit: () => {
        const overlay = document.getElementById('title-overlay');
        if (overlay) overlay.classList.add('hidden');
      }
    });

    this.fsm.addState(GameStates.HOW_TO_PLAY, {
      enter: () => {
        const overlay = document.getElementById('how-to-play-overlay');
        if (overlay) overlay.classList.remove('hidden');
      },
      exit: () => {
        const overlay = document.getElementById('how-to-play-overlay');
        if (overlay) overlay.classList.add('hidden');
      }
    });

    this.fsm.addState(GameStates.PLAYING, {
      enter: () => {
        this.playgama.sendGameReady();
        const biomeMusic = this.getBiomeMusic(this.currentLevelIndex);
        this.audio.playBgm(biomeMusic);
      }
    });

    this.fsm.addState(GameStates.PAUSED, {
      enter: () => this.audio.pause(),
      exit: () => this.audio.resume()
    });

    this.fsm.addState(GameStates.BOSS_ENCOUNTER, {
      enter: () => this.audio.playBgm('boss')
    });

    this.fsm.addState(GameStates.VICTORY, {
      enter: () => {
        this.audio.playVictory();
        this.saveGame();
      }
    });

    this.fsm.addState(GameStates.GAME_OVER, {
      enter: () => {
        this.deaths++;
        this.respawnAtCheckpoint();
      }
    });

    this.fsm.transitionTo(GameStates.TITLE);
  }

  setupDOM() {
    // Title Overlay Play
    const btnPlay = document.getElementById('btn-play-game');
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        this.audio.init();
        this.fsm.setState(GameStates.PLAYING);
      });
    }

    // How to Play
    const btnHow = document.getElementById('btn-how-to-play');
    const btnCloseHow = document.getElementById('btn-close-how-to-play');
    const btnBackToMenu = document.getElementById('btn-back-to-menu');
    if (btnHow) btnHow.addEventListener('click', () => this.fsm.setState(GameStates.HOW_TO_PLAY));
    if (btnCloseHow) btnCloseHow.addEventListener('click', () => this.fsm.setState(GameStates.TITLE));
    if (btnBackToMenu) btnBackToMenu.addEventListener('click', () => this.fsm.setState(GameStates.PLAYING));

    // Reset Save
    const btnReset = document.getElementById('btn-reset-save');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        localStorage.removeItem('meadowbound_save_v1');
        if (this.playgama) this.playgama.deleteData('meadowbound_save_v1');
        this.sunBerriesCollected.clear();
        this.goldenAcornsCollected.clear();
        this.medallionsCollected.clear();
        this.score = 0;
        this.deaths = 0;
        this.currentLevelIndex = 1;
        this.loadLevel(1);
        alert('Save progress reset successfully!');
      });
    }

    // Audio Mute Toggle
    const btnMute = document.getElementById('btn-mute');
    if (btnMute) {
      btnMute.addEventListener('click', () => {
        const isMuted = this.audio.toggleMute();
        this.playgama.setMuted(isMuted);
        btnMute.textContent = isMuted ? '🔇' : '🔊';
        this.saveGame();
      });
    }

    // Mobile Virtual Touch Buttons
    const bindTouch = (id, action) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.input.triggerAction(action);
        this.input.actions[action] = true;
      });
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.input.actions[action] = false;
      });
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.input.triggerAction(action);
        this.input.actions[action] = true;
      });
      el.addEventListener('mouseup', (e) => {
        e.preventDefault();
        this.input.actions[action] = false;
      });
    };

    bindTouch('btn-left', 'left');
    bindTouch('btn-right', 'right');
    bindTouch('btn-down', 'down');
    bindTouch('btn-jump', 'up');
    bindTouch('btn-dash', 'dash');
    bindTouch('btn-interact', 'action');

    // Document Visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.audio.pause();
      } else if (this.fsm.currentState === GameStates.PLAYING) {
        this.audio.resume();
      }
    });
  }

  getBiomeMusic(levelIndex) {
    switch (levelIndex) {
      case 1: return 'meadow';
      case 2: return 'woods';
      case 3: return 'caverns';
      case 4: return 'highlands';
      case 5: return 'boss';
      default: return 'meadow';
    }
  }

  loadLevel(levelIndex) {
    this.currentLevelIndex = levelIndex;
    const lvlW = [2160, 1440, 2160, 2880, 2160][levelIndex - 1];
    const lvlH = [450, 900, 675, 450, 450][levelIndex - 1];
    this.camera.setBounds(0, lvlW, 0, lvlH);

    // Build Level Entities
    this.levelData = this.createLevelGeometry(levelIndex, lvlW, lvlH);
    this.player.x = this.levelData.spawnX;
    this.player.y = this.levelData.spawnY;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.health = 3;
    this.player.isGrounded = false;
    this.lastCheckpoint = { level: levelIndex, x: this.levelData.spawnX, y: this.levelData.spawnY };

    if (levelIndex === 5) {
      this.boss = new BramblethornGolem(1460, 390);
    } else {
      this.boss = null;
    }
  }

  createLevelGeometry(lvl, w, h) {
    const platforms = [];
    const hazards = [];
    const springboards = [];
    const updrafts = [];
    const cloudLedges = [];
    const enemies = [];
    const collectibles = [];
    const npcs = [];
    const checkpoints = [];
    let spawnX = 80;
    let spawnY = h - 90;
    let exitX = w - 60;
    let exitY = h - 60;

    // Biome Specific Data
    if (lvl === 1) { // Sunny Meadowlands
      spawnX = 80; spawnY = 360;
      // Ground segments
      platforms.push({ x: 0, y: 390, w: 600, h: 60 });
      platforms.push({ x: 760, y: 390, w: 600, h: 60 });
      platforms.push({ x: 1440, y: 390, w: 720, h: 60 });
      // Ledges
      platforms.push({ x: 260, y: 310, w: 120, h: 20 });
      platforms.push({ x: 440, y: 240, w: 140, h: 20 });
      platforms.push({ x: 1080, y: 330, w: 160, h: 20 }); // waterfall bridge
      platforms.push({ x: 1550, y: 300, w: 140, h: 20 });
      platforms.push({ x: 1750, y: 230, w: 140, h: 20 });

      // Checkpoint Waystone
      checkpoints.push({ id: 'waystone_1', x: 1240, y: 370, isAttuned: false });

      // NPC Barnaby
      npcs.push({
        id: 'barnaby_snail',
        name: 'Barnaby Snail',
        avatar: 'snail',
        x: 460, y: 375,
        dialogue: [
          "Well met, young Pip! The Great Sunburst Tree has grown dim, and brambles choke the upper boughs.",
          "Gather the 5 Sun Berries in each region to restore its light. Press [Space] to Jump, and tap [Shift] or [J] mid-air for a Meadow Dash!",
          "Keep a keen eye out for secret alcoves behind thick ivy curtains. Safe travels, little sprite!"
        ]
      });

      // Sun Berries (5)
      collectibles.push({ id: 'berry_1_1', type: 'berry', x: 320, y: 260 });
      collectibles.push({ id: 'berry_1_2', type: 'berry', x: 510, y: 190 });
      collectibles.push({ id: 'berry_1_3', type: 'berry', x: 680, y: 340 }); // requires dash over gap
      collectibles.push({ id: 'berry_1_4', type: 'berry', x: 1620, y: 250 });
      collectibles.push({ id: 'berry_1_5', type: 'berry', x: 2050, y: 340 });

      // Lore Medallion 1
      collectibles.push({ id: 'medallion_dawn', type: 'medallion', x: 1180, y: 360 });

      // Acorns (10)
      for (let i = 0; i < 10; i++) {
        collectibles.push({ id: `acorn_1_${i}`, type: 'acorn', x: 160 + i * 190, y: 360 - (i % 3) * 40 });
      }

      // Enemies (Acorn Walkers)
      enemies.push({ id: 'aw_1', type: 'acorn_walker', x: 500, y: 378, vx: 60, minX: 420, maxX: 580, hp: 1 });
      enemies.push({ id: 'aw_2', type: 'acorn_walker', x: 920, y: 378, vx: 60, minX: 800, maxX: 1040, hp: 1 });
      enemies.push({ id: 'aw_3', type: 'acorn_walker', x: 1800, y: 218, vx: 60, minX: 1760, maxX: 1880, hp: 1 });

    } else if (lvl === 2) { // Whispering Woods (1440x900)
      spawnX = 80; spawnY = 800;
      exitX = 1360; exitY = 150;
      platforms.push({ x: 0, y: 840, w: 600, h: 60 });
      platforms.push({ x: 750, y: 840, w: 690, h: 60 });
      // Boughs & moving branches
      platforms.push({ x: 200, y: 720, w: 220, h: 20 });
      platforms.push({ x: 580, y: 640, w: 180, h: 20, isMoving: true, baseX: 580, range: 80, speed: 1.5 });
      platforms.push({ x: 120, y: 530, w: 240, h: 20 });
      platforms.push({ x: 540, y: 460, w: 320, h: 20 }); // Midpoint
      platforms.push({ x: 920, y: 380, w: 180, h: 20, isMoving: true, baseX: 920, range: 100, speed: 2.0 });
      platforms.push({ x: 320, y: 280, w: 260, h: 20, type: 'one_way' });
      platforms.push({ x: 1050, y: 180, w: 390, h: 40 });

      checkpoints.push({ id: 'waystone_2', x: 720, y: 440, isAttuned: false });

      // Sun Berries (5)
      collectibles.push({ id: 'berry_2_1', type: 'berry', x: 670, y: 580 });
      collectibles.push({ id: 'berry_2_2', type: 'berry', x: 240, y: 470 });
      collectibles.push({ id: 'berry_2_3', type: 'berry', x: 1010, y: 320 });
      collectibles.push({ id: 'berry_2_4', type: 'berry', x: 1300, y: 420 });
      collectibles.push({ id: 'berry_2_5', type: 'berry', x: 1200, y: 120 });

      collectibles.push({ id: 'medallion_whispers', type: 'medallion', x: 180, y: 240 });

      for (let i = 0; i < 10; i++) {
        collectibles.push({ id: `acorn_2_${i}`, type: 'acorn', x: 140 + (i % 5) * 240, y: 800 - Math.floor(i / 2) * 120 });
      }

      enemies.push({ id: 'sh_1', type: 'spore_hopper', x: 300, y: 708, timer: 1.0, jumpState: 'idle', hp: 1 });
      enemies.push({ id: 'sh_2', type: 'spore_hopper', x: 200, y: 518, timer: 1.2, jumpState: 'idle', hp: 1 });
      enemies.push({ id: 'aw_4', type: 'acorn_walker', x: 640, y: 448, vx: 50, minX: 560, maxX: 820, hp: 1 });

    } else if (lvl === 3) { // Bioluminescent Caverns (2160x675)
      spawnX = 80; spawnY = 580;
      exitX = 2100; exitY = 380;
      platforms.push({ x: 0, y: 615, w: 300, h: 60 });
      platforms.push({ x: 500, y: 615, w: 380, h: 60 });
      platforms.push({ x: 1180, y: 615, w: 300, h: 60 });
      // Upper platforms
      platforms.push({ x: 340, y: 340, w: 320, h: 20 });
      platforms.push({ x: 860, y: 380, w: 340, h: 20 });
      platforms.push({ x: 1720, y: 240, w: 220, h: 20 });
      platforms.push({ x: 1800, y: 420, w: 360, h: 60 });

      // Springboard Mushrooms
      springboards.push({ x: 230, y: 605, w: 30, h: 20, isCompressed: false });
      springboards.push({ x: 740, y: 605, w: 30, h: 20, isCompressed: false });

      // Crystal Hazards
      hazards.push({ x: 300, y: 615, w: 200, h: 20 });
      hazards.push({ x: 880, y: 615, w: 300, h: 20 });
      hazards.push({ x: 1480, y: 615, w: 320, h: 20 });

      checkpoints.push({ id: 'waystone_3', x: 1040, y: 360, isAttuned: false });

      collectibles.push({ id: 'berry_3_1', type: 'berry', x: 245, y: 280 });
      collectibles.push({ id: 'berry_3_2', type: 'berry', x: 500, y: 480 });
      collectibles.push({ id: 'berry_3_3', type: 'berry', x: 1420, y: 280 });
      collectibles.push({ id: 'berry_3_4', type: 'berry', x: 1820, y: 180 });
      collectibles.push({ id: 'berry_3_5', type: 'berry', x: 2040, y: 360 });

      collectibles.push({ id: 'medallion_luminescence', type: 'medallion', x: 1900, y: 550 });

      for (let i = 0; i < 10; i++) {
        collectibles.push({ id: `acorn_3_${i}`, type: 'acorn', x: 150 + i * 190, y: 340 + (i % 3) * 60 });
      }

      // Glow Bats
      enemies.push({ id: 'gb_1', type: 'glow_bat', x: 600, baseY: 280, vx: 70, minX: 450, maxX: 750, hp: 1 });
      enemies.push({ id: 'gb_2', type: 'glow_bat', x: 1320, baseY: 300, vx: 70, minX: 1220, maxX: 1420, hp: 1 });
      enemies.push({ id: 'gb_3', type: 'glow_bat', x: 1520, baseY: 280, vx: 70, minX: 1420, maxX: 1620, hp: 1 });

    } else if (lvl === 4) { // Gusty Highland Cliffs (2880x450)
      spawnX = 80; spawnY = 360;
      exitX = 2800; exitY = 320;
      platforms.push({ x: 0, y: 390, w: 480, h: 60 });
      platforms.push({ x: 1200, y: 390, w: 500, h: 60 });
      platforms.push({ x: 2000, y: 390, w: 550, h: 60 });
      platforms.push({ x: 2650, y: 360, w: 230, h: 90 });

      // Updrafts
      updrafts.push({ x: 500, y: 0, w: 120, h: 420 });
      updrafts.push({ x: 1780, y: 0, w: 120, h: 420 });

      // Dissolving Cloud Ledges
      cloudLedges.push({ x: 740, y: 260, w: 90, h: 18, timer: 1.0, isDissolved: false, resetTimer: 0 });
      cloudLedges.push({ x: 910, y: 260, w: 90, h: 18, timer: 1.0, isDissolved: false, resetTimer: 0 });
      cloudLedges.push({ x: 1080, y: 260, w: 90, h: 18, timer: 1.0, isDissolved: false, resetTimer: 0 });

      checkpoints.push({ id: 'waystone_4', x: 1460, y: 370, isAttuned: false });

      collectibles.push({ id: 'berry_4_1', type: 'berry', x: 560, y: 150 });
      collectibles.push({ id: 'berry_4_2', type: 'berry', x: 955, y: 200 });
      collectibles.push({ id: 'berry_4_3', type: 'berry', x: 1620, y: 330 });
      collectibles.push({ id: 'berry_4_4', type: 'berry', x: 1840, y: 130 });
      collectibles.push({ id: 'berry_4_5', type: 'berry', x: 2750, y: 300 });

      collectibles.push({ id: 'medallion_zephyr', type: 'medallion', x: 1140, y: 360 });

      for (let i = 0; i < 10; i++) {
        collectibles.push({ id: `acorn_4_${i}`, type: 'acorn', x: 200 + i * 260, y: 280 - (i % 3) * 40 });
      }

      // Bramble Chargers
      enemies.push({ id: 'bc_1', type: 'bramble_charger', x: 1380, y: 378, state: 'PATROL', vx: 40, minX: 1240, maxX: 1650, hp: 1, timer: 0 });
      enemies.push({ id: 'bc_2', type: 'bramble_charger', x: 2200, y: 378, state: 'PATROL', vx: 40, minX: 2040, maxX: 2500, hp: 1, timer: 0 });

    } else if (lvl === 5) { // The Elder Canopy & Boss Arena (2160x450)
      spawnX = 60; spawnY = 360;
      exitX = 2050; exitY = 360;

      // Section A: Gauntlet
      platforms.push({ x: 0, y: 390, w: 300, h: 60 });
      platforms.push({ x: 420, y: 310, w: 180, h: 20 });
      platforms.push({ x: 680, y: 230, w: 160, h: 20 });

      // Section B: Sanctuary
      platforms.push({ x: 860, y: 390, w: 240, h: 60 });

      // Section C: Boss Coliseum (1100 to 1820)
      platforms.push({ x: 1100, y: 390, w: 720, h: 60 });
      platforms.push({ x: 1180, y: 260, w: 140, h: 20 }); // Left Bough
      platforms.push({ x: 1600, y: 260, w: 140, h: 20 }); // Right Bough

      // Section D: Ending Altar
      platforms.push({ x: 1820, y: 390, w: 340, h: 60 });

      checkpoints.push({ id: 'waystone_5', x: 980, y: 370, isAttuned: false });

      npcs.push({
        id: 'willow_owl',
        name: 'Willow Owl',
        avatar: 'owl',
        x: 920, y: 370,
        dialogue: [
          "Hoo-hoo! You have climbed far, little Pip. Ahead lies the Bramblethorn Golem.",
          "Its thorny armor deflects all attacks while it charges! You must leap over its ground shockwaves and let it exhaust itself.",
          "When it crashes or kneels, strike its glowing Heart Core from above. Restore the canopy!"
        ]
      });

      npcs.push({
        id: 'elder_root_spirit',
        name: 'Elder Root Spirit',
        avatar: 'spirit',
        x: 1980, y: 370,
        dialogue: [
          "Pip, bravest of sprites! The bramble corruption has dissolved, and the Great Sunburst Tree blazes with life once more.",
          "Your heroic journey is inscribed in the canopy forever!",
          "May the warm light of the meadow guide you always, Meadow Champion!"
        ]
      });

      collectibles.push({ id: 'berry_5_1', type: 'berry', x: 260, y: 160 });
      collectibles.push({ id: 'berry_5_2', type: 'berry', x: 520, y: 220 });
      collectibles.push({ id: 'berry_5_3', type: 'berry', x: 720, y: 150 });
      collectibles.push({ id: 'berry_5_4', type: 'berry', x: 1040, y: 260 });
      // berry_5_5 awarded on boss defeat

      collectibles.push({ id: 'medallion_ancients', type: 'medallion', x: 880, y: 230 });

      for (let i = 0; i < 10; i++) {
        collectibles.push({ id: `acorn_5_${i}`, type: 'acorn', x: 120 + i * 180, y: 330 - (i % 3) * 40 });
      }

      enemies.push({ id: 'sh_5', type: 'spore_hopper', x: 480, y: 298, timer: 1.0, jumpState: 'idle', hp: 1 });
    }

    return {
      platforms,
      hazards,
      springboards,
      updrafts,
      cloudLedges,
      enemies,
      collectibles,
      npcs,
      checkpoints,
      spawnX,
      spawnY,
      exitX,
      exitY,
      width: w,
      height: h
    };
  }

  update(dt) {
    this.animTime += dt;
    this.playtime += dt;
    this.juice.update(dt);
    this.particles.update(dt);

    // Continuous Great Tree Victory Celebratory Confetti
    if (this.fsm.currentState === GameStates.VICTORY && Math.random() < 0.3) {
      this.particles.confetti(this.camera.x + Math.random() * this.virtualWidth, this.camera.y - 10, 2);
    }

    if (this.fsm.currentState === GameStates.TITLE || this.fsm.currentState === GameStates.HOW_TO_PLAY) {
      this.camera.lookAt(360 + Math.sin(this.animTime * 0.5) * 80, 225);
      if (this.fsm.currentState === GameStates.TITLE) {
        if (this.input.isJustPressed('action') || this.input.isJustPressed('up') || this.input.keys['Space'] || this.input.keys['Enter']) {
          this.audio.init();
          this.fsm.setState(GameStates.PLAYING);
        }
      }
      return;
    }

    if (this.fsm.currentState === GameStates.PAUSED) {
      if (this.input.isJustPressed('action') || this.input.keys['Escape']) {
        this.fsm.setState(GameStates.PLAYING);
      }
      return;
    }

    // Toggle Pause
    if (this.input.keys['Escape'] || this.input.isJustPressed('pause')) {
      this.fsm.setState(this.fsm.currentState === GameStates.PAUSED ? GameStates.PLAYING : GameStates.PAUSED);
      return;
    }

    // Dialogue Update
    if (this.dialogueBox.active) {
      const advanceAction = this.input.isJustPressed('action') || this.input.isJustPressed('up');
      this.dialogueBox.update(dt, advanceAction);
      return;
    }

    // Update Player
    this.player.update(dt, this.input, this.audio, this.particles, this.juice);

    // Updrafts Physics
    for (const ud of this.levelData.updrafts) {
      if (this.player.x >= ud.x && this.player.x <= ud.x + ud.w &&
          this.player.y >= ud.y && this.player.y <= ud.y + ud.h) {
        this.player.vy = Math.min(this.player.vy, -220);
        this.player.hasAirDash = true;
        if (Math.random() < 0.3) {
          this.particles.burst(this.player.x + (Math.random() - 0.5) * 20, this.player.y + 10, 1, 'rgba(180,230,255,0.6)');
        }
      }
    }

    // Cloud Ledges Update
    for (const cl of this.levelData.cloudLedges) {
      if (cl.isDissolved) {
        cl.resetTimer -= dt;
        if (cl.resetTimer <= 0) {
          cl.isDissolved = false;
          cl.timer = 1.0;
        }
      }
    }

    // Moving Platforms Update
    for (const plat of this.levelData.platforms) {
      if (plat.isMoving) {
        const offset = Math.sin(this.animTime * plat.speed) * plat.range;
        plat.x = plat.baseX + offset;
      }
    }

    // Resolve Collisions
    this.resolveWorldCollisions(dt);

    // Update Enemies
    this.updateEnemies(dt);

    // Update Boss
    if (this.boss) {
      this.boss.update(dt, this.player, this.audio, this.particles, this.juice);
      this.resolveBossCollisions(dt);
    }

    // Update Collectibles & Interactions
    this.updateCollectibles();
    this.updateInteractions();

    // Camera follow
    this.camera.follow(this.player.x, this.player.y, dt);
    this.camera.setShakeOffset(this.juice.shakeX, this.juice.shakeY);

    // Death / Abyss check
    if (this.player.health <= 0 || this.player.y > this.levelData.height + 60) {
      this.fsm.setState(GameStates.GAME_OVER);
    }

    // Level Exit Gate Check
    if (Math.abs(this.player.x - this.levelData.exitX) < 40 && Math.abs(this.player.y - this.levelData.exitY) < 60) {
      if (this.currentLevelIndex < 5) {
        this.transitionToNextLevel();
      } else if (this.boss && this.boss.health <= 0 && this.player.x > 1850) {
        this.fsm.setState(GameStates.VICTORY);
      }
    }

    this.input.endFrame();
  }

  resolveWorldCollisions(dt) {
    const halfW = 9;
    const halfH = 13;

    // Horizontal Integration & Wall Collisions
    this.player.x += this.player.vx * dt;
    this.player.x = Math.max(halfW, Math.min(this.levelData.width - halfW, this.player.x));

    for (const plat of this.levelData.platforms) {
      if (plat.type === 'one_way') continue;
      if (this.player.y + halfH - 2 > plat.y && this.player.y - halfH + 2 < plat.y + plat.h) {
        if (this.player.vx > 0 && this.player.x + halfW >= plat.x && this.player.x - halfW < plat.x) {
          this.player.x = plat.x - halfW;
          this.player.vx = 0;
        } else if (this.player.vx < 0 && this.player.x - halfW <= plat.x + plat.w && this.player.x + halfW > plat.x + plat.w) {
          this.player.x = plat.x + plat.w + halfW;
          this.player.vx = 0;
        }
      }
    }

    // Vertical Integration
    this.player.y += this.player.vy * dt;
    this.player.isGrounded = false;
    const lookahead = Math.max(this.player.vy * dt, 4);

    // Hazard Collisions
    for (const haz of this.levelData.hazards) {
      if (this.player.x + halfW > haz.x && this.player.x - halfW < haz.x + haz.w) {
        if (this.player.y + halfH >= haz.y - 2 && this.player.y - halfH <= haz.y + haz.h) {
          if (!this.isGodMode) this.player.triggerDamage(1, haz.x + haz.w / 2);
          this.audio.playHurt();
          this.juice.screenShake(8);
          this.juice.screenFlash('#FF0054', 0.35);
          this.particles.burst(this.player.x, this.player.y, '#FF0054', 12);
        }
      }
    }

    // Springboard Mushrooms
    for (const spring of this.levelData.springboards) {
      if (this.player.x + halfW > spring.x && this.player.x - halfW < spring.x + spring.w) {
        if (this.player.vy > 0 && this.player.y + halfH >= spring.y - 6 && this.player.y + halfH <= spring.y + 14) {
          this.player.y = spring.y - halfH;
          this.player.vy = -620;
          this.player.isGrounded = false;
          this.player.hasAirDash = true;
          this.player.scaleX = 0.85;
          this.player.scaleY = 1.25;
          spring.isCompressed = true;
          setTimeout(() => { spring.isCompressed = false; }, 200);
          this.audio.playSporeBounce();
          this.juice.screenShake(4);
          this.juice.spawnFloatingText('BOING!', this.player.x, spring.y - 20, { color: '#F72585', size: 16 });
          this.juice.spawnShockwave(spring.x + spring.w / 2, spring.y, 35, '#F72585');
          this.particles.burst(this.player.x, spring.y, '#F72585', 14);
          this.particles.sparkles(this.player.x, spring.y, 8);
          return;
        }
      }
    }

    // Cloud Ledges
    for (const cl of this.levelData.cloudLedges) {
      if (cl.isDissolved) continue;
      if (this.player.x + halfW > cl.x && this.player.x - halfW < cl.x + cl.w) {
        if (this.player.vy >= 0 && this.player.y + halfH >= cl.y - 4 && this.player.y + halfH <= cl.y + 12) {
          this.player.y = cl.y - halfH;
          this.player.vy = 0;
          this.player.isGrounded = true;
          cl.timer -= dt;
          if (cl.timer <= 0) {
            cl.isDissolved = true;
            cl.resetTimer = 2.0;
            this.particles.dust(cl.x + cl.w / 2, cl.y, 10, 'rgba(255,255,255,0.85)');
          }
          break;
        }
      }
    }

    // Solid Platforms & One-way Ledges
    for (const plat of this.levelData.platforms) {
      if (this.player.x + halfW - 2 > plat.x && this.player.x - halfW + 2 < plat.x + plat.w) {
        if (this.player.vy >= 0) {
          if (this.player.y + halfH <= plat.y + lookahead + 4 && this.player.y + halfH >= plat.y - 6) {
            this.player.y = plat.y - halfH;
            this.player.vy = 0;
            this.player.isGrounded = true;
            break;
          }
        } else if (this.player.vy < 0 && plat.type !== 'one_way') {
          if (this.player.y - halfH <= plat.y + plat.h && this.player.y - halfH >= plat.y + plat.h - 8) {
            // Ceiling corner rounding nudge
            const distLeft = Math.abs((this.player.x + halfW) - plat.x);
            const distRight = Math.abs((this.player.x - halfW) - (plat.x + plat.w));
            if (distLeft <= 4) {
              this.player.x -= 4;
            } else if (distRight <= 4) {
              this.player.x += 4;
            } else {
              this.player.y = plat.y + plat.h + halfH;
              this.player.vy = 0;
            }
          }
        }
      }
    }
  }

  updateEnemies(dt) {
    for (let i = this.levelData.enemies.length - 1; i >= 0; i--) {
      const e = this.levelData.enemies[i];
      if (e.hp <= 0) continue;

      if (e.type === 'acorn_walker') {
        e.x += e.vx * dt;
        if (e.x <= e.minX || e.x >= e.maxX) {
          e.vx *= -1;
        }
      } else if (e.type === 'spore_hopper') {
        e.timer -= dt;
        if (e.timer <= 0) {
          if (e.jumpState === 'idle') {
            e.jumpState = 'jumping';
            e.vy = -350;
            e.timer = 1.2;
          } else {
            e.jumpState = 'idle';
            e.timer = 1.0;
          }
        }
        if (e.jumpState === 'jumping') {
          e.y += e.vy * dt;
          e.vy += KINEMATICS.GRAVITY * dt;
        }
      } else if (e.type === 'glow_bat') {
        e.x += e.vx * dt;
        if (e.x <= e.minX || e.x >= e.maxX) e.vx *= -1;
        e.y = e.baseY + Math.sin(this.animTime * 3.77) * 28;
      } else if (e.type === 'bramble_charger') {
        if (e.state === 'PATROL') {
          e.x += e.vx * dt;
          if (e.x <= e.minX || e.x >= e.maxX) e.vx *= -1;
          // Aggro check
          if (Math.abs(this.player.x - e.x) < 180 && Math.abs(this.player.y - e.y) < 40) {
            e.state = 'ALERT';
            e.timer = 0.4;
          }
        } else if (e.state === 'ALERT') {
          e.timer -= dt;
          if (e.timer <= 0) {
            e.state = 'CHARGE';
            e.chargeDir = this.player.x < e.x ? -1 : 1;
            this.audio.playBossRoar();
          }
        } else if (e.state === 'CHARGE') {
          e.x += e.chargeDir * 280 * dt;
          if (e.x <= e.minX || e.x >= e.maxX) {
            e.state = 'DAZED';
            e.timer = 2.2;
            this.audio.playBossCrash();
            this.juice.screenShake(18); // Elevated to 18px on Wall Crash!
            this.juice.spawnShockwave(e.x, e.y, 50, '#C86428');
            this.particles.burst(e.x, e.y, '#C86428', 16);
            this.particles.dust(e.x, e.y + 10, 8);
          }
        } else if (e.state === 'DAZED') {
          e.timer -= dt;
          if (e.timer <= 0) {
            e.state = 'PATROL';
          }
        }
      }

      // Check Collision with Player
      const dx = Math.abs(this.player.x - e.x);
      const dy = this.player.y - e.y;

      if (dx < 20 && Math.abs(dy) < 26) {
        // Stomp Check: moving downward and landing on top
        if (this.player.vy > 0 && dy < 0) {
          if (e.type === 'bramble_charger' && e.state !== 'DAZED') {
            // Charging charger hurts player from top!
            if (!this.isGodMode) this.player.triggerDamage(1, e.x);
            this.audio.playHurt();
            this.juice.screenShake(8);
            this.juice.screenFlash('#FF0054', 0.35);
          } else {
            // Successful Stomp: 10px screen shake, floral/acorn burst, floating score popup!
            e.hp = 0;
            this.player.triggerStompBounce();
            this.audio.playStomp();
            this.juice.screenShake(10); // Micro screen-shake: 10px on enemy stomps!
            this.juice.spawnFloatingText('+100 STOMP!', e.x, e.y - 14, { color: '#FFE66D', size: 18 });
            this.juice.spawnShockwave(e.x, e.y, 35, '#FFE66D');
            this.particles.leafBurst(e.x, e.y, 16);
            this.particles.burst(e.x, e.y, '#FFD166', 16);
            this.score += 100;
          }
        } else if (!this.isGodMode) {
          this.player.triggerDamage(1, e.x);
          this.audio.playHurt();
          this.juice.screenShake(8);
          this.juice.screenFlash('#FF0054', 0.35);
          this.particles.burst(this.player.x, this.player.y, '#FF0054', 10);
        }
      }
    }
  }

  resolveBossCollisions(dt) {
    if (!this.boss || this.boss.health <= 0) return;

    // Shockwave collision with player
    for (const sw of this.boss.shockwaves) {
      if (Math.abs(this.player.x - sw.x) < 18 && Math.abs(this.player.y - sw.y) < 16) {
        if (!this.isGodMode) this.player.triggerDamage(1, sw.x);
        this.audio.playHurt();
        this.juice.screenShake(8);
        this.juice.screenFlash('#FF0054', 0.35);
      }
    }

    // Briar ball collision
    for (const bb of this.boss.briarBalls) {
      if (Math.hypot(this.player.x - bb.x, this.player.y - bb.y) < bb.radius + 12) {
        if (!this.isGodMode) this.player.triggerDamage(1, bb.x);
        this.audio.playHurt();
        this.juice.screenShake(8);
        this.juice.screenFlash('#FF0054', 0.35);
      }
    }

    // Boss Core Stomp Collision
    const dx = Math.abs(this.player.x - this.boss.x);
    const dy = this.player.y - (this.boss.y - 30);

    if (dx < 26 && dy < 10 && dy > -30 && this.player.vy > 0) {
      if (this.boss.isCoreExposed) {
        const damaged = this.boss.takeDamage(1);
        if (damaged) {
          this.player.triggerStompBounce();
          this.audio.playStomp();
          this.juice.screenShake(12);
          this.juice.screenFlash('#FF9E00', 0.35);
          this.juice.spawnFloatingText('+500 BOSS HIT!', this.boss.x, this.boss.y - 45, { color: '#FF5400', size: 22 });
          this.juice.spawnShockwave(this.boss.x, this.boss.y - 30, 60, '#FF5400');
          this.particles.burst(this.boss.x, this.boss.y - 30, '#FF5400', 30);
          this.particles.sparkles(this.boss.x, this.boss.y - 30, 16);
          this.score += 500;
          if (this.boss.health <= 0) {
            // Drop Sun Berry 5.5
            this.levelData.collectibles.push({ id: 'berry_5_5', type: 'berry', x: this.boss.x, y: 280 });
          }
        }
      }
    } else if (Math.abs(this.player.x - this.boss.x) < 32 && Math.abs(this.player.y - this.boss.y) < 36) {
      if (!this.isGodMode) this.player.triggerDamage(1, this.boss.x);
      this.audio.playHurt();
      this.juice.screenShake(8);
      this.juice.screenFlash('#FF0054', 0.35);
    }
  }

  updateCollectibles() {
    for (let i = this.levelData.collectibles.length - 1; i >= 0; i--) {
      const c = this.levelData.collectibles[i];
      if (Math.hypot(this.player.x - c.x, this.player.y - c.y) < 22) {
        if (c.type === 'berry' && !this.sunBerriesCollected.has(c.id)) {
          this.sunBerriesCollected.add(c.id);
          this.score += 50;
          this.audio.playBerryCollect();
          this.juice.screenShake(2);
          this.juice.spawnFloatingText('+50 BERRY!', c.x, c.y - 14, { color: '#FFD166', size: 18 });
          this.particles.burst(c.x, c.y, '#FFD166', 16);
          this.particles.sparkles(c.x, c.y, 12);
          this.saveGame();
        } else if (c.type === 'acorn' && !this.goldenAcornsCollected.has(c.id)) {
          this.goldenAcornsCollected.add(c.id);
          this.score += 20;
          this.audio.playAcorn();
          this.juice.spawnFloatingText('+20 ACORN!', c.x, c.y - 10, { color: '#FFD000', size: 14 });
          this.particles.burst(c.x, c.y, '#FFD000', 8);
          this.particles.sparkles(c.x, c.y, 6);
          this.saveGame();
        } else if (c.type === 'medallion' && !this.medallionsCollected.has(c.id)) {
          this.medallionsCollected.add(c.id);
          this.score += 500;
          this.audio.playMedallion();
          this.juice.screenShake(4);
          this.juice.spawnFloatingText('+500 LORE!', c.x, c.y - 18, { color: '#52B788', size: 20 });
          this.juice.spawnShockwave(c.x, c.y, 45, '#52B788');
          this.particles.confetti(c.x, c.y, 40);
          this.particles.burst(c.x, c.y, '#52B788', 24);
          this.particles.sparkles(c.x, c.y, 16);
          this.saveGame();
          const meta = LORE_MEDALLIONS[c.id];
          if (meta) {
            this.dialogueBox.start(meta.name, 'spirit', meta.lore, {
              onChirp: () => this.audio.playNpcChirp('spirit'),
              onComplete: () => { this.player.dialogueCooldownTimer = 0.2; }
            });
          }
        }
      }
    }
  }

  updateInteractions() {
    this.activePrompt = null;

    // Waystone Checkpoint Attunement
    for (const cp of this.levelData.checkpoints) {
      if (Math.hypot(this.player.x - cp.x, this.player.y - cp.y) < 32) {
        if (!cp.isAttuned) {
          cp.isAttuned = true;
          this.lastCheckpoint = { level: this.currentLevelIndex, x: cp.x, y: cp.y - 10 };
          this.player.health = 3;
          this.audio.playWaystone();
          this.juice.screenShake(4);
          this.juice.spawnFloatingText('CHECKPOINT!', cp.x, cp.y - 35, { color: '#4CC9F0', size: 16 });
          this.juice.spawnShockwave(cp.x, cp.y - 10, 40, '#4CC9F0');
          this.particles.burst(cp.x, cp.y - 20, '#FFD166', 18);
          this.particles.sparkles(cp.x, cp.y - 20, 14);
          this.saveGame();
        }
      }
    }

    // NPC Interaction Prompt with Melodic Speech Chirps
    for (const npc of this.levelData.npcs) {
      if (Math.hypot(this.player.x - npc.x, this.player.y - npc.y) < 45) {
        this.activePrompt = { x: npc.x, y: npc.y - 35, text: '[E] Talk' };
        if (this.input.isJustPressed('action')) {
          this.dialogueBox.start(npc.name, npc.avatar, npc.dialogue.join('\n\n'), {
            onChirp: () => this.audio.playNpcChirp(npc.avatar),
            onComplete: () => { this.player.dialogueCooldownTimer = 0.2; }
          });
        }
      }
    }
  }

  respawnAtCheckpoint() {
    this.player.health = 3;
    this.player.x = this.lastCheckpoint.x;
    this.player.y = this.lastCheckpoint.y;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.invulnTimer = 1.0;
    this.player.isGrounded = false;
    this.fsm.setState(GameStates.PLAYING);
  }

  transitionToNextLevel() {
    this.particles.confetti(this.player.x, this.player.y, 45);
    this.juice.spawnFloatingText('LEVEL CLEAR!', this.player.x, this.player.y - 25, { color: '#FFD166', size: 20 });
    this.juice.screenFlash('#2EC4B6', 0.25);
    this.audio.playMedallion();
    this.currentLevelIndex++;
    this.loadLevel(this.currentLevelIndex);
    this.saveGame();
    this.fsm.setState(GameStates.PLAYING);
  }

  render(alpha) {
    const ctx = this.renderer.ctx;
    this.renderer.beginFrame(this.camera);

    // Layer 0 & 1: Biome Parallax Background
    this.renderParallaxBackground(ctx);

    // Layer 2: Level Structures, Platforms, Hazards
    this.renderLevelGeometry(ctx);

    // Layer 3: Waystones & Springboards
    for (const cp of this.levelData.checkpoints) {
      Renderer.drawWaystone(ctx, cp.x, cp.y, cp.isAttuned, this.animTime);
    }
    for (const sp of this.levelData.springboards) {
      Renderer.drawSpringboardMushroom(ctx, sp.x, sp.y, sp.isCompressed);
    }

    // Layer 4: NPCs & Collectibles
    for (const npc of this.levelData.npcs) {
      if (npc.id === 'barnaby_snail') Renderer.drawBarnabySnail(ctx, npc.x, npc.y, this.animTime);
      else if (npc.id === 'willow_owl') Renderer.drawWillowOwl(ctx, npc.x, npc.y, this.animTime);
      else if (npc.id === 'elder_root_spirit') Renderer.drawElderRootSpirit(ctx, npc.x, npc.y, this.animTime);
    }

    for (const c of this.levelData.collectibles) {
      if (c.type === 'berry' && !this.sunBerriesCollected.has(c.id)) {
        Renderer.drawSunBerry(ctx, c.x, c.y, this.animTime);
      } else if (c.type === 'acorn' && !this.goldenAcornsCollected.has(c.id)) {
        Renderer.drawGoldenAcorn(ctx, c.x, c.y, this.animTime);
      } else if (c.type === 'medallion' && !this.medallionsCollected.has(c.id)) {
        Renderer.drawLoreMedallion(ctx, c.x, c.y, c.id, this.animTime);
      }
    }

    // Layer 5: Enemies & Boss
    for (const e of this.levelData.enemies) {
      if (e.hp <= 0) continue;
      if (e.type === 'acorn_walker') Renderer.drawAcornWalker(ctx, e.x, e.y, e.vx > 0 ? 1 : -1, this.animTime);
      else if (e.type === 'spore_hopper') Renderer.drawSporeHopper(ctx, e.x, e.y, e.jumpState, this.animTime);
      else if (e.type === 'glow_bat') Renderer.drawGlowBat(ctx, e.x, e.y, e.vx > 0 ? 1 : -1, this.animTime);
      else if (e.type === 'bramble_charger') Renderer.drawBrambleCharger(ctx, e.x, e.y, e.state, e.chargeDir || (e.vx > 0 ? 1 : -1), this.animTime);
    }

    if (this.boss) {
      Renderer.drawBramblethornGolem(ctx, this.boss, this.animTime);
    }

    // Layer 6: Player Character
    Renderer.drawPip(ctx, this.player.x, this.player.y, {
      facing: this.player.facing,
      vx: this.player.vx,
      vy: this.player.vy,
      isGrounded: this.player.isGrounded,
      isDashing: this.player.isDashing,
      invulnTimer: this.player.invulnTimer,
      animTime: this.animTime,
      scaleX: this.player.scaleX,
      scaleY: this.player.scaleY
    });

    // Layer 7: Particle System
    this.particles.render(ctx);

    // Layer 8: Interactive Prompts in World
    if (this.activePrompt) {
      ctx.fillStyle = 'rgba(18, 38, 28, 0.85)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(this.activePrompt.x - 32, this.activePrompt.y - 12, 64, 20, 6);
      else ctx.rect(this.activePrompt.x - 32, this.activePrompt.y - 12, 64, 20);
      ctx.fill();
      ctx.strokeStyle = '#2EC4B6';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = '#FFD166';
      ctx.font = "bold 11px 'Fredoka', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(this.activePrompt.text, this.activePrompt.x, this.activePrompt.y + 2);
      ctx.textAlign = 'left';
    }

    // Layer 8.5: Juice Effects in World (Floating Score Texts, World Shockwaves)
    this.juice.renderWorld(ctx);

    this.renderer.endWorldFrame(this.camera);

    // Layer 9: Screen HUD & Modals
    this.renderHUD(ctx);

    if (this.dialogueSystem && this.dialogueSystem.active) {
      this.dialogueSystem.render(ctx, (c, avatar, x, y, size) => {
        this.renderNPCAvatar(c, avatar, x, y, size);
      });
    }

    if (this.fsm.currentState === GameStates.VICTORY) {
      this.renderVictoryOverlay(ctx);
    }

    // Layer 10: Full-screen Flash & Juice Overlay
    this.juice.renderScreen(ctx, this.virtualWidth, this.virtualHeight);

    this.renderer.endFrame();
  }

  renderNPCAvatar(ctx, avatar, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    const scale = size / 48;
    ctx.scale(scale, scale);
    if (avatar === 'snail' || avatar === 'barnaby_snail') {
      Renderer.drawBarnabySnail(ctx, 0, 0, this.animTime);
    } else if (avatar === 'owl' || avatar === 'willow_owl') {
      Renderer.drawWillowOwl(ctx, 0, 0, this.animTime);
    } else if (avatar === 'spirit' || avatar === 'elder_spirit' || avatar === 'elder_root_spirit') {
      Renderer.drawElderRootSpirit(ctx, 0, 0, this.animTime);
    } else {
      Renderer.drawPip(ctx, 0, 0, { facing: 1, vx: 0, vy: 0, isGrounded: true, animTime: this.animTime, scaleX: 1, scaleY: 1 });
    }
    ctx.restore();
  }

  renderParallaxBackground(ctx) {
    const lvl = this.currentLevelIndex;
    const camX = this.camera.x;
    const camY = this.camera.y;

    if (lvl === 1) { // Meadowlands
      const grad = ctx.createLinearGradient(0, 0, 0, this.virtualHeight);
      grad.addColorStop(0, '#56B4D3');
      grad.addColorStop(1, '#E4F5FC');
      ctx.fillStyle = grad;
      ctx.fillRect(camX, camY, this.virtualWidth, this.virtualHeight);

      // Distant Hills
      ctx.fillStyle = '#76C043';
      ctx.beginPath();
      ctx.arc(camX + 200 - camX * 0.15, camY + 420, 320, Math.PI, 0);
      ctx.arc(camX + 600 - camX * 0.15, camY + 440, 300, Math.PI, 0);
      ctx.fill();

    } else if (lvl === 2) { // Woods
      ctx.fillStyle = '#112217';
      ctx.fillRect(camX, camY, this.virtualWidth, this.virtualHeight);
      ctx.fillStyle = '#1E3F1A';
      ctx.beginPath();
      ctx.arc(camX + 300 - camX * 0.2, camY + 600, 400, Math.PI, 0);
      ctx.fill();

    } else if (lvl === 3) { // Caverns
      ctx.fillStyle = '#14112E';
      ctx.fillRect(camX, camY, this.virtualWidth, this.virtualHeight);
      // Stalactites
      ctx.fillStyle = '#241E47';
      for (let i = 0; i < 8; i++) {
        const sx = camX + i * 140 - camX * 0.1;
        ctx.beginPath();
        ctx.moveTo(sx, camY);
        ctx.lineTo(sx + 30, camY + 80);
        ctx.lineTo(sx + 60, camY);
        ctx.closePath();
        ctx.fill();
      }

    } else if (lvl === 4) { // Highlands
      const grad = ctx.createLinearGradient(0, 0, 0, this.virtualHeight);
      grad.addColorStop(0, '#3A86FF');
      grad.addColorStop(1, '#FFB703');
      ctx.fillStyle = grad;
      ctx.fillRect(camX, camY, this.virtualWidth, this.virtualHeight);

    } else if (lvl === 5) { // Elder Canopy
      const grad = ctx.createLinearGradient(0, 0, 0, this.virtualHeight);
      grad.addColorStop(0, '#2B0938');
      grad.addColorStop(1, '#FFAA00');
      ctx.fillStyle = grad;
      ctx.fillRect(camX, camY, this.virtualWidth, this.virtualHeight);
    }
  }

  renderLevelGeometry(ctx) {
    for (const plat of this.levelData.platforms) {
      if (plat.type === 'one_way') {
        ctx.fillStyle = '#70A341';
        ctx.fillRect(plat.x, plat.y, plat.w, 6);
      } else {
        ctx.fillStyle = '#5A3825';
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        ctx.fillStyle = '#80D842';
        ctx.fillRect(plat.x, plat.y, plat.w, 6);
      }
    }

    for (const haz of this.levelData.hazards) {
      ctx.fillStyle = '#C77DFF';
      for (let x = haz.x; x < haz.x + haz.w; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, haz.y + haz.h);
        ctx.lineTo(x + 7, haz.y);
        ctx.lineTo(x + 14, haz.y + haz.h);
        ctx.closePath();
        ctx.fill();
      }
    }

    for (const cl of this.levelData.cloudLedges) {
      if (!cl.isDissolved) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(cl.x, cl.y, cl.w, cl.h, 8);
        else ctx.rect(cl.x, cl.y, cl.w, cl.h);
        ctx.fill();
      }
    }
  }

  renderHUD(ctx) {
    // Top-Left: Hearts
    for (let i = 0; i < this.player.maxHealth; i++) {
      Renderer.drawHUDHeart(ctx, 30 + i * 28, 28, i < this.player.health);
    }

    // Top-Center: Sun Berries Counter
    ctx.fillStyle = 'rgba(18, 38, 28, 0.85)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(this.virtualWidth / 2 - 80, 14, 160, 32, 16);
    else ctx.rect(this.virtualWidth / 2 - 80, 14, 160, 32);
    ctx.fill();
    ctx.strokeStyle = '#2EC4B6';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    Renderer.drawSunBerry(ctx, this.virtualWidth / 2 - 50, 30, this.animTime);
    ctx.fillStyle = '#FFD166';
    ctx.font = "bold 14px 'Fredoka', sans-serif";
    ctx.fillText(`${this.sunBerriesCollected.size} / 25`, this.virtualWidth / 2 - 25, 35);

    // Score & Medallions
    ctx.fillStyle = '#E2ECE9';
    ctx.font = "12px 'Nunito', sans-serif";
    ctx.fillText(`Score: ${this.score.toLocaleString()}`, this.virtualWidth / 2 - 40, 62);

    // Top-Right: Control Hints from InputManager
    ctx.fillStyle = 'rgba(18, 38, 28, 0.80)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(this.virtualWidth - 215, 14, 200, 26, 13);
    else ctx.rect(this.virtualWidth - 215, 14, 200, 26);
    ctx.fill();
    ctx.strokeStyle = 'rgba(46, 196, 182, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#A7F3D0';
    ctx.font = "bold 9.5px 'Fredoka', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(this.input.getControlHints(), this.virtualWidth - 115, 30);
    ctx.textAlign = 'left';

    // Boss Health Bar (Level 5 Boss Coliseum)
    if (this.boss && this.boss.health > 0 && this.player.x > 1100 && this.player.x < 1850) {
      const barW = 280;
      const barH = 16;
      const bx = this.virtualWidth / 2 - barW / 2;
      const by = this.virtualHeight - 34;

      ctx.fillStyle = 'rgba(18, 38, 28, 0.9)';
      ctx.fillRect(bx - 4, by - 4, barW + 8, barH + 8);
      ctx.strokeStyle = '#2EC4B6';
      ctx.strokeRect(bx - 4, by - 4, barW + 8, barH + 8);

      const segmentW = barW / 3;
      const colors = ['#FF0054', '#FF9E00', '#00F5D4'];
      for (let i = 0; i < this.boss.health; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(bx + i * segmentW + 2, by, segmentW - 4, barH);
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.font = "bold 11px 'Fredoka', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText('BRAMBLETHORN GOLEM', this.virtualWidth / 2, by - 8);
      ctx.textAlign = 'left';
    }
  }

  renderVictoryOverlay(ctx) {
    ctx.fillStyle = 'rgba(6, 17, 10, 0.85)';
    ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);

    ctx.fillStyle = '#FFD166';
    ctx.font = "bold 2.4rem 'Fredoka', cursive, sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('GREAT SUNBURST RESTORED!', this.virtualWidth / 2, 140);

    ctx.fillStyle = '#A7F3D0';
    ctx.font = "1.1rem 'Nunito', sans-serif";
    ctx.fillText(`Sun Berries: ${this.sunBerriesCollected.size} / 25  |  Medallions: ${this.medallionsCollected.size} / 5`, this.virtualWidth / 2, 190);
    ctx.fillText(`Total Score: ${this.score.toLocaleString()}  |  Clear Time: ${Math.floor(this.playtime)}s`, this.virtualWidth / 2, 220);

    ctx.fillStyle = '#FFE66D';
    ctx.font = "bold 1.3rem 'Fredoka', sans-serif";
    const rank = this.sunBerriesCollected.size === 25 && this.medallionsCollected.size === 5 ? '🏆 MASTER BOTANIST' : '🌸 MEADOW CHAMPION';
    ctx.fillText(`Title Awarded: ${rank}`, this.virtualWidth / 2, 270);

    ctx.fillStyle = '#E2ECE9';
    ctx.font = "0.95rem 'Fredoka', sans-serif";
    ctx.fillText('Press [Space] or [E] to return to Title', this.virtualWidth / 2, 340);
    ctx.textAlign = 'left';

    if (this.input.isJustPressed('action') || this.input.isJustPressed('up')) {
      this.fsm.setState(GameStates.TITLE);
    }
  }
}

// Global bootstrap
let gameInstance = null;
if (typeof window !== 'undefined') {
  const initGame = () => {
    if (!gameInstance) {
      gameInstance = new MeadowboundGame();
      gameInstance.loop.start();
      window.__meadowboundInstance = gameInstance;
      window.__groveOdysseyInstance = gameInstance; // QA Test compatibility
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }
}

export default MeadowboundGame;
