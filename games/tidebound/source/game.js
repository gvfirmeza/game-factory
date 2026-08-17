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
  EnemyArchetypes,
  EnemyStates,
  DialogueSystem,
  DialogueBox
} from '../../../engine/index.js';

/**
 * ============================================================================
 * TIDEBOUND — Complete 2D Action Platform Adventure
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
  JUMP_IMPULSE: -390,
  JUMP_CUT_VEL: -140,
  GRAVITY: 980,
  FALL_CLAMP: 480,
  COYOTE_TIME: 0.10,
  JUMP_BUFFER: 0.12,
  DASH_SPEED: 450,
  DASH_DURATION: 0.18,
  STOMP_BOUNCE: -320,
  INVULN_DURATION: 1.5,
  KNOCKBACK_VX: 160,
  KNOCKBACK_VY: -180,
  CORNER_NUDGE: 3
};

// Lore Medallion Metadata
const LORE_MEDALLIONS = {
  medallion_tides: {
    id: 'medallion_tides',
    level: 1,
    name: 'Medallion of the Tides',
    lore: 'When the first ocean cooled, the Tidal Core gave life to the coral reefs and whispered rhythm to the sea.'
  },
  medallion_ruins: {
    id: 'medallion_ruins',
    level: 2,
    name: 'Medallion of the Deep Ruins',
    lore: 'The ancient seafolk built towers to mirror the constellations, harnessing starlight to guide distant voyagers.'
  },
  medallion_depths: {
    id: 'medallion_depths',
    level: 3,
    name: 'Medallion of the Flooded Grotto',
    lore: 'Deep within the flooded grottos, bioluminescent currents pulse with the heartbeat of the sleeping sentinel.'
  },
  medallion_gale: {
    id: 'medallion_gale',
    level: 4,
    name: 'Medallion of the Sea Gale',
    lore: 'The cliff winds sing an unbroken sea shanty, lifting those who dare to leap with faith into the updraft.'
  },
  medallion_beacon: {
    id: 'medallion_beacon',
    level: 5,
    name: 'Medallion of the Horizon Beacon',
    lore: 'When all four beacons shine upon the horizon, the tempest calms and the ocean cradle enters eternal harmony.'
  }
};

/**
 * Procedural Audio Synthesizer for Tidebound
 * Zero-dependency Web Audio API procedural sound engine with multi-voice synthesis,
 * chord fanfares, melodic NPC chirps, and dynamic maritime biome chiptune arpeggios.
 */
class TideboundAudio {
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
      console.warn('[TideboundAudio] Web Audio initialization warning:', e);
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

  pause() {
    if (this.ctx && this.ctx.state === 'running') {
      try {
        this.ctx.suspend();
      } catch (e) {}
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume();
      } catch (e) {}
    }
  }

  playJump() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    // Dual-oscillator punchy maritime jump sweep
    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(260, t);
    osc1.frequency.exponentialRampToValueAtTime(640, t + 0.12);
    g1.gain.setValueAtTime(0.28, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc1.connect(g1);
    g1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.12);

    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(520, t);
    osc2.frequency.exponentialRampToValueAtTime(1080, t + 0.08);
    g2.gain.setValueAtTime(0.14, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(t);
    osc2.stop(t + 0.08);
  }

  playDash() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    // Filtered noise sweep (hydro-burst surge)
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(4.5, t);
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(1800, t + 0.18);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.18);

    // Rising hydro bubble chime
    const bOsc = this.ctx.createOscillator();
    const bGain = this.ctx.createGain();
    bOsc.type = 'sine';
    bOsc.frequency.setValueAtTime(320, t);
    bOsc.frequency.exponentialRampToValueAtTime(840, t + 0.14);
    bGain.gain.setValueAtTime(0.18, t);
    bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    bOsc.connect(bGain);
    bGain.connect(this.masterGain);
    bOsc.start(t);
    bOsc.stop(t + 0.14);
  }

  playStomp() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    // Sub-thump
    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(130, t);
    osc1.frequency.exponentialRampToValueAtTime(55, t + 0.09);
    g1.gain.setValueAtTime(0.28, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc1.connect(g1);
    g1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.09);

    // Bubble Sparkle Pop
    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(700, t);
    osc2.frequency.exponentialRampToValueAtTime(1200, t + 0.11);
    g2.gain.setValueAtTime(0.22, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(t);
    osc2.stop(t + 0.11);
  }

  playLand() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.09);
    g.gain.setValueAtTime(0.24, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  playSpringBoing() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(560, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(340, t + 0.22);
    g.gain.setValueAtTime(0.28, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  playSunPearl() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6 (Ascending Major Arpeggio)

    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.05;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);
      g.gain.setValueAtTime(0.20, noteTime);
      g.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.22);
    });
  }

  playNautilusShell() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [880.0, 1108.73]; // A5 -> C#6

    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.04;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);
      g.gain.setValueAtTime(0.18, noteTime);
      g.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.12);
    });
  }

  playMedallion() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);
      g.gain.setValueAtTime(0.25, noteTime);
      g.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.45);
    });
  }

  playWaystone() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const chord = [329.63, 493.88, 659.25, 987.77]; // E Major Cathedral Chord

    chord.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.85);
    });
  }

  playLighthouse() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73];

    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);
      g.gain.setValueAtTime(0.24, noteTime);
      g.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.55);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.55);
    });
  }

  playLevelClear() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [392.00, 493.88, 587.33, 783.99, 987.77, 1174.66]; // G4 -> D6 pentatonic ascent

    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);
      g.gain.setValueAtTime(0.22, noteTime);
      g.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.40);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.40);
    });
  }

  playHurt() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.linearRampToValueAtTime(70, t + 0.22);
    g.gain.setValueAtTime(0.32, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  playCrabCrash() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    // Heavy low crunch thud
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.28);
    g.gain.setValueAtTime(0.36, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.28);

    // Stone crack noise burst
    const bufferSize = this.ctx.sampleRate * 0.09;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, t);
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.25, t);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(this.masterGain);
    noise.start(t);
    noise.stop(t + 0.09);
  }

  playChirp(avatar = 'coralia_diver') {
    if (this.isMuted || !this.ctx) return;
    const now = performance.now();
    if (now - this.lastChirpTime < 45) return;
    this.lastChirpTime = now;

    this.init();
    const t = this.ctx.currentTime;
    let baseFreq = 540;
    if (avatar === 'barnaby_navigator' || avatar === 'barnaby') baseFreq = 220;
    else if (avatar === 'ancient_beacon_keeper' || avatar === 'beaconKeeper') baseFreq = 780;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    const pitchOffset = (Math.random() - 0.5) * 60;
    osc.frequency.setValueAtTime(baseFreq + pitchOffset, t);
    osc.frequency.exponentialRampToValueAtTime((baseFreq + pitchOffset) * 1.25, t + 0.04);
    g.gain.setValueAtTime(0.14, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  playBossSlam() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(75, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.55);
    g.gain.setValueAtTime(0.48, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.55);
  }

  playBossHit() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.35);
    g.gain.setValueAtTime(0.38, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  playPurification() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const chords = [
      { notes: [261.63, 329.63, 392.00, 523.25], time: 0, dur: 0.4 },
      { notes: [329.63, 392.00, 523.25, 659.25], time: 0.35, dur: 0.4 },
      { notes: [392.00, 523.25, 659.25, 783.99], time: 0.70, dur: 0.5 },
      { notes: [523.25, 659.25, 783.99, 1046.50, 1318.51], time: 1.05, dur: 1.2 }
    ];

    chords.forEach(c => {
      c.notes.forEach(f => {
        const noteTime = t + c.time;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, noteTime);
        g.gain.setValueAtTime(0.18, noteTime);
        g.gain.exponentialRampToValueAtTime(0.001, noteTime + c.dur);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(noteTime);
        osc.stop(noteTime + c.dur);
      });
    });
  }

  playVictory() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const chords = [
      { notes: [261.63, 329.63, 392.00], time: 0, dur: 0.25 },
      { notes: [293.66, 369.99, 440.00], time: 0.25, dur: 0.25 },
      { notes: [329.63, 415.30, 493.88], time: 0.50, dur: 0.25 },
      { notes: [523.25, 659.25, 783.99, 1046.50], time: 0.75, dur: 0.90 }
    ];

    chords.forEach(c => {
      c.notes.forEach(f => {
        const noteTime = t + c.time;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, noteTime);
        g.gain.setValueAtTime(0.20, noteTime);
        g.gain.exponentialRampToValueAtTime(0.001, noteTime + c.dur);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(noteTime);
        osc.stop(noteTime + c.dur);
      });
    });
  }

  playBGM(biome = 'tropical_beach') {
    if (this.currentTrack === biome) return;
    this.stopBGM();
    this.currentTrack = biome;
    if (this.isMuted) return;

    this.init();
    if (!this.ctx) return;

    let step = 0;
    const scales = {
      tropical_beach: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25], // C Major Pentatonic
      sunken_ruins: [220.00, 246.94, 261.63, 293.66, 329.63, 392.00], // A Minor Hexatonic
      bioluminescent_grotto: [196.00, 246.94, 293.66, 329.63, 392.00, 493.88], // G Major Air
      tempest_cliffs: [174.61, 196.00, 220.00, 261.63, 293.66, 349.23], // F Lydian Breeze
      beacon_sanctuary: [261.63, 329.63, 392.00, 493.88, 523.25, 659.25] // Grand Celestial
    };

    const activeScale = scales[biome] || scales.tropical_beach;
    const stepDuration = 0.22; // 220ms per 16th note

    this.bgmTimer = setInterval(() => {
      if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
      const t = this.ctx.currentTime;

      // 1. Bassline (Every 4 steps)
      if (step % 4 === 0) {
        const bassFreq = activeScale[0] / 2;
        const bOsc = this.ctx.createOscillator();
        const bG = this.ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(bassFreq, t);
        bG.gain.setValueAtTime(0.18, t);
        bG.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        bOsc.connect(bG);
        bG.connect(this.bgmGain);
        bOsc.start(t);
        bOsc.stop(t + 0.6);
      }

      // 2. Marimba Arpeggio
      const noteIdx = (step * 2) % activeScale.length;
      const arpFreq = activeScale[noteIdx];
      const mOsc = this.ctx.createOscillator();
      const mG = this.ctx.createGain();
      mOsc.type = 'sine';
      mOsc.frequency.setValueAtTime(arpFreq, t);
      mG.gain.setValueAtTime(0.12, t);
      mG.gain.exponentialRampToValueAtTime(0.001, t + 0.20);
      mOsc.connect(mG);
      mG.connect(this.bgmGain);
      mOsc.start(t);
      mOsc.stop(t + 0.20);

      // 3. Pan Flute Accent (Every 8 steps)
      if (step % 8 === 0) {
        const fFreq = activeScale[3] * 1.5;
        const fOsc = this.ctx.createOscillator();
        const fG = this.ctx.createGain();
        fOsc.type = 'sine';
        fOsc.frequency.setValueAtTime(fFreq, t);
        fG.gain.setValueAtTime(0.10, t);
        fG.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
        fOsc.connect(fG);
        fG.connect(this.bgmGain);
        fOsc.start(t);
        fOsc.stop(t + 0.8);
      }

      step = (step + 1) % 32;
    }, stepDuration * 1000);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.currentTrack = null;
  }
}

/**
 * Procedural Vector Graphics Renderer
 */
export class Renderer {
  static drawCori(ctx, x, y, state = {}) {
    const {
      vx = 0,
      vy = 0,
      facing = 1,
      isGrounded = true,
      isDashing = false,
      isHurt = false,
      animTime = 0,
      scaleX: pScaleX = 1.0,
      scaleY: pScaleY = 1.0
    } = state;

    ctx.save();
    ctx.translate(x, y);

    // Ground Drop Shadow
    if (isGrounded) {
      ctx.fillStyle = 'rgba(10, 22, 16, 0.22)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 10 * Math.max(0.6, pScaleX), 3.5 * Math.max(0.6, pScaleX), 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.scale(facing, 1);
    let scaleX = pScaleX;
    let scaleY = pScaleY;

    if (isDashing) {
      scaleX = Math.max(scaleX, 1.35);
      scaleY = Math.min(scaleY, 0.75);
    } else if (!isGrounded) {
      if (vy < -50 && scaleY <= 1.0) {
        scaleX = 0.85;
        scaleY = 1.20;
      } else if (vy > 100 && scaleY <= 1.0) {
        scaleX = 0.90;
        scaleY = 1.15;
      }
    } else if (Math.abs(vx) > 10) {
      const runBounce = Math.sin(animTime * 14) * 0.08;
      scaleX *= (1.0 + runBounce);
      scaleY *= (1.0 - runBounce);
    }

    ctx.scale(scaleX, scaleY);

    if (isHurt && Math.floor(animTime * 20) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    // Trailing Cape
    ctx.save();
    ctx.fillStyle = '#80ED99';
    ctx.strokeStyle = '#264653';
    ctx.lineWidth = 1.5;
    const capeFlutter = isDashing
      ? Math.sin(animTime * 30) * 8 - 14
      : (isGrounded ? Math.sin(animTime * 10) * 3 - (vx * 0.02) : -vy * 0.03);

    ctx.beginPath();
    ctx.moveTo(-4, -18);
    ctx.quadraticCurveTo(-14 + capeFlutter, -14, -12 + capeFlutter, -4);
    ctx.quadraticCurveTo(-6, -6, 2, -16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Main Body Capsule (Turquoise gradient)
    const bodyGrad = ctx.createLinearGradient(0, -28, 0, -2);
    bodyGrad.addColorStop(0, '#2EC4B6');
    bodyGrad.addColorStop(1, '#20A396');

    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-8, -26, 16, 24, [8, 8, 6, 6]);
    else ctx.rect(-8, -26, 16, 24);
    ctx.fill();
    ctx.stroke();

    // Belly Accent
    ctx.fillStyle = 'rgba(128, 237, 153, 0.45)';
    ctx.beginPath();
    ctx.ellipse(1, -12, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rosy Cheeks
    ctx.fillStyle = 'rgba(255, 138, 174, 0.50)';
    ctx.beginPath();
    ctx.ellipse(-4, -15, 2.2, 1.4, 0, 0, Math.PI * 2);
    ctx.ellipse(5, -15, 2.2, 1.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Expressive Eyes & Catchlights
    ctx.fillStyle = '#1D3557';
    const eyeBlink = Math.sin(animTime * 2) > 0.96 ? 0.2 : 1.0;

    ctx.beginPath();
    ctx.ellipse(-3, -19, 2.0, 3.0 * eyeBlink, 0, 0, Math.PI * 2);
    ctx.ellipse(4, -19, 2.0, 3.0 * eyeBlink, 0, 0, Math.PI * 2);
    ctx.fill();

    if (eyeBlink > 0.5) {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-2.5, -20.2, 0.9, 0, Math.PI * 2);
      ctx.arc(4.5, -20.2, 0.9, 0, Math.PI * 2);
      ctx.arc(-3.5, -18.0, 0.5, 0, Math.PI * 2);
      ctx.arc(3.5, -18.0, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nautilus Shell Beret (#FFD166)
    ctx.save();
    ctx.translate(2, -26);
    ctx.rotate(0.12);
    ctx.fillStyle = '#FFD166';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.8;

    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 5.5, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#F4A261';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(-2, 0, 3.5, 0.4, Math.PI * 1.4);
    ctx.stroke();
    ctx.restore();

    // Glowing Pearl Antennae
    const pulse = Math.sin(animTime * 6) * 0.3 + 0.7;
    // Left stalk & pearl
    ctx.strokeStyle = '#2EC4B6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-3, -27);
    ctx.quadraticCurveTo(-7, -33, -5, -36);
    ctx.stroke();
    ctx.fillStyle = `rgba(0, 245, 212, ${0.4 * pulse})`;
    ctx.beginPath();
    ctx.arc(-5, -36, 4 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E0FBFC';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(-5, -36, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right stalk & pearl
    ctx.strokeStyle = '#2EC4B6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(3, -27);
    ctx.quadraticCurveTo(7, -34, 6, -37);
    ctx.stroke();
    ctx.fillStyle = `rgba(0, 245, 212, ${0.4 * pulse})`;
    ctx.beginPath();
    ctx.arc(6, -37, 4 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E0FBFC';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(6, -37, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Little Flippers / Feet
    ctx.fillStyle = '#20A396';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.5;
    const legOffset = isGrounded ? Math.sin(animTime * 14) * 3 : 0;
    ctx.beginPath();
    ctx.ellipse(-4, -2 + legOffset, 3.2, 2.0, -0.2, 0, Math.PI * 2);
    ctx.ellipse(4, -2 - legOffset, 3.2, 2.0, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  static drawHermitScuttler(ctx, x, y, state = {}) {
    const { facing = 1, animTime = 0, isDead = false } = state;
    ctx.save();
    ctx.translate(x, y);

    if (!isDead) {
      ctx.fillStyle = 'rgba(10, 22, 16, 0.20)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 9, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.scale(facing, 1);

    // Legs
    ctx.strokeStyle = '#F4A261';
    ctx.lineWidth = 2.0;
    const legWiggle = Math.sin(animTime * 18) * 3;
    ctx.beginPath();
    ctx.moveTo(-6, -3); ctx.lineTo(-9, 0 - legWiggle);
    ctx.moveTo(-2, -3); ctx.lineTo(-3, 0 + legWiggle);
    ctx.moveTo(3, -3);  ctx.lineTo(4, 0 - legWiggle);
    ctx.moveTo(7, -3);  ctx.lineTo(9, 0 + legWiggle);
    ctx.stroke();

    // Spiral Conch Shell (#E76F51)
    ctx.fillStyle = '#E76F51';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.quadraticCurveTo(-14, -14, -2, -18);
    ctx.quadraticCurveTo(8, -18, 9, -8);
    ctx.quadraticCurveTo(9, -2, -8, -4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Shell Ridge Details
    ctx.strokeStyle = '#F4A261';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(-2, -10, 6, 0.8, Math.PI * 1.5);
    ctx.stroke();

    // Turquoise Crab Head & Eyes
    ctx.fillStyle = '#2A9D8F';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(2, -12, 8, 8, 4);
    else ctx.rect(2, -12, 8, 8);
    ctx.fill();
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Eye Stalks
    const eyeWiggle = Math.cos(animTime * 8) * 0.8;
    ctx.strokeStyle = '#2A9D8F';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(5, -12); ctx.lineTo(4 + eyeWiggle, -18);
    ctx.moveTo(8, -12); ctx.lineTo(9 + eyeWiggle, -18);
    ctx.stroke();

    ctx.fillStyle = '#1D3557';
    ctx.beginPath();
    ctx.arc(4 + eyeWiggle, -18, 1.8, 0, Math.PI * 2);
    ctx.arc(9 + eyeWiggle, -18, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(4.5 + eyeWiggle, -18.5, 0.6, 0, Math.PI * 2);
    ctx.arc(9.5 + eyeWiggle, -18.5, 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Front Pinchers
    ctx.fillStyle = '#F4A261';
    ctx.beginPath();
    ctx.ellipse(9, -6, 3, 2, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  static drawSpinyUrchin(ctx, x, y, state = {}) {
    const { phase = 'idle', animTime = 0 } = state;
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = 'rgba(10, 22, 16, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    let scaleX = 1;
    let scaleY = 1;
    if (phase === 'squash') {
      scaleX = 1.30;
      scaleY = 0.70;
    } else if (phase === 'hopping') {
      scaleX = 0.85;
      scaleY = 1.25;
    }
    ctx.scale(scaleX, scaleY);

    const spikePulse = Math.sin(animTime * 12) * 2.5 + 8;

    // 8 Radiating Cyan Spikes
    ctx.strokeStyle = '#48CAE4';
    ctx.lineWidth = 2.0;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + animTime * 1.2;
      const sx = Math.cos(angle) * (6 + spikePulse);
      const sy = -12 + Math.sin(angle) * (6 + spikePulse);
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 4, -12 + Math.sin(angle) * 4);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }

    // Main Orb
    const orbGrad = ctx.createRadialGradient(0, -12, 1, 0, -12, 8);
    orbGrad.addColorStop(0, '#3D5A80');
    orbGrad.addColorStop(0.7, '#1D3557');
    orbGrad.addColorStop(1, '#0B092B');

    ctx.fillStyle = orbGrad;
    ctx.strokeStyle = '#00F5D4';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, -12, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Glowing Grumpy Urchin Eyes
    ctx.fillStyle = '#00F5D4';
    ctx.beginPath();
    ctx.arc(-3, -13, 1.8, 0, Math.PI * 2);
    ctx.arc(3, -13, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1D3557';
    ctx.beginPath();
    ctx.arc(-2.5, -13, 0.9, 0, Math.PI * 2);
    ctx.arc(3.5, -13, 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  static drawBubbleRay(ctx, x, y, state = {}) {
    const { facing = 1, animTime = 0 } = state;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing, 1);

    const wingWave = Math.sin(animTime * 7) * 5;

    // Ambient Halo
    ctx.fillStyle = 'rgba(0, 245, 212, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Manta Body
    const rayGrad = ctx.createLinearGradient(-12, -8, 12, 8);
    rayGrad.addColorStop(0, '#00F5D4');
    rayGrad.addColorStop(0.5, '#48CAE4');
    rayGrad.addColorStop(1, '#0077B6');

    ctx.fillStyle = rayGrad;
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.8;

    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.quadraticCurveTo(2, -8 + wingWave, -8, -10 + wingWave);
    ctx.quadraticCurveTo(-6, -2, -12, 0);
    ctx.quadraticCurveTo(-6, 2, -8, 10 - wingWave);
    ctx.quadraticCurveTo(2, 8 - wingWave, 10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pearl Belly
    ctx.fillStyle = 'rgba(202, 240, 248, 0.6)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Whip Tail
    ctx.strokeStyle = '#00F5D4';
    ctx.lineWidth = 1.5;
    const tailWave = Math.sin(animTime * 10) * 3;
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.quadraticCurveTo(-18, tailWave, -24, -tailWave);
    ctx.stroke();

    // Bubbles
    ctx.fillStyle = 'rgba(0, 245, 212, 0.7)';
    ctx.beginPath();
    ctx.arc(-26 + Math.sin(animTime * 4) * 2, tailWave, 1.8, 0, Math.PI * 2);
    ctx.arc(-30 + Math.cos(animTime * 4) * 2, -tailWave, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1D3557';
    ctx.beginPath();
    ctx.arc(6, -2, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(6.5, -2.5, 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  static drawCoralCrab(ctx, x, y, state = {}) {
    const { facing = 1, isCharging = false, isDazed = false, animTime = 0 } = state;
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = 'rgba(10, 22, 16, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.scale(facing, 1);

    // Dazed Stars
    if (isDazed) {
      for (let i = 0; i < 3; i++) {
        const starAngle = animTime * 6 + (i * Math.PI * 2) / 3;
        const sx = Math.cos(starAngle) * 12;
        const sy = -28 + Math.sin(starAngle) * 4;
        ctx.fillStyle = '#FFD166';
        ctx.strokeStyle = '#1D3557';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // Legs
    ctx.strokeStyle = '#780000';
    ctx.lineWidth = 2.5;
    const legWiggle = isCharging ? Math.sin(animTime * 35) * 4 : Math.sin(animTime * 12) * 2;
    ctx.beginPath();
    ctx.moveTo(-10, -4); ctx.lineTo(-14, 0 - legWiggle);
    ctx.moveTo(-5, -4);  ctx.lineTo(-7, 0 + legWiggle);
    ctx.moveTo(5, -4);   ctx.lineTo(7, 0 - legWiggle);
    ctx.moveTo(10, -4);  ctx.lineTo(13, 0 + legWiggle);
    ctx.stroke();

    // Carapace
    const shellGrad = ctx.createLinearGradient(0, -22, 0, -4);
    shellGrad.addColorStop(0, '#D62828');
    shellGrad.addColorStop(1, '#9B2226');

    ctx.fillStyle = shellGrad;
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-12, -18, 24, 15, [8, 8, 4, 4]);
    else ctx.rect(-12, -18, 24, 15);
    ctx.fill();
    ctx.stroke();

    // Back Spikes
    ctx.fillStyle = '#E76F51';
    ctx.beginPath();
    ctx.moveTo(-8, -18); ctx.lineTo(-6, -23); ctx.lineTo(-3, -18);
    ctx.moveTo(3, -18);  ctx.lineTo(6, -23);  ctx.lineTo(8, -18);
    ctx.fill();
    ctx.stroke();

    // Giant Crusher Pincer
    ctx.save();
    ctx.translate(10, -10);
    const snapAngle = isCharging ? Math.sin(animTime * 25) * 0.3 : 0;
    ctx.rotate(snapAngle);
    ctx.fillStyle = '#D62828';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.ellipse(5, -4, 7, 4, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(4, 2, 6, 3, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Eyes
    ctx.fillStyle = isCharging ? '#FFD166' : '#FDFFFC';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(2, -14, 2.5, 0, Math.PI * 2);
    ctx.arc(7, -14, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isCharging ? '#9B2226' : '#1D3557';
    ctx.beginPath();
    ctx.arc(2.5, -14, 1.2, 0, Math.PI * 2);
    ctx.arc(7.5, -14, 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  static drawTideGolem(ctx, x, y, state = {}) {
    const {
      hp = 3,
      facing = 1,
      stateName = 'idle',
      animTime = 0
    } = state;

    ctx.save();
    ctx.translate(x, y);

    // Footprint Shadow
    ctx.fillStyle = 'rgba(10, 22, 16, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 32, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.scale(facing, 1);

    const isVulnerable = stateName === 'vulnerable' || stateName === 'dazed';
    const isEnraged = hp === 1;

    // Stone Legs & Torso
    const stoneGrad = ctx.createLinearGradient(0, -70, 0, 0);
    stoneGrad.addColorStop(0, '#577590');
    stoneGrad.addColorStop(0.5, '#264653');
    stoneGrad.addColorStop(1, '#1B3039');

    ctx.fillStyle = stoneGrad;
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.8;

    // Legs
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-24, -28, 18, 28, [4, 4, 2, 2]);
      ctx.roundRect(6, -28, 18, 28, [4, 4, 2, 2]);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-28, -60, 56, 36, [10, 10, 6, 6]);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.rect(-24, -28, 18, 28);
      ctx.rect(6, -28, 18, 28);
      ctx.rect(-28, -60, 56, 36);
      ctx.fill();
      ctx.stroke();
    }

    // Living Coral Shoulder Growths
    ctx.fillStyle = isEnraged ? '#D62828' : '#E76F51';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.0;

    // Left Coral
    ctx.beginPath();
    ctx.moveTo(-26, -56);
    ctx.lineTo(-38, -68);
    ctx.lineTo(-34, -58);
    ctx.lineTo(-44, -62);
    ctx.lineTo(-30, -50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Coral
    ctx.beginPath();
    ctx.moveTo(26, -56);
    ctx.lineTo(38, -68);
    ctx.lineTo(34, -58);
    ctx.lineTo(44, -62);
    ctx.lineTo(30, -50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Head / Crown
    ctx.fillStyle = '#577590';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-18, -74, 36, 18, [8, 8, 4, 4]);
    else ctx.rect(-18, -74, 36, 18);
    ctx.fill();
    ctx.stroke();

    // Exposed Pearl Core
    if (isVulnerable) {
      const corePulse = Math.sin(animTime * 12) * 0.3 + 0.7;
      const beamGrad = ctx.createLinearGradient(0, -74, 0, -120);
      beamGrad.addColorStop(0, 'rgba(0, 245, 212, 0.6)');
      beamGrad.addColorStop(1, 'rgba(0, 245, 212, 0.0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(-10, -120, 20, 46);

      ctx.fillStyle = `rgba(0, 245, 212, ${0.5 * corePulse})`;
      ctx.beginPath();
      ctx.arc(0, -74, 12 * corePulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#E0FBFC';
      ctx.strokeStyle = '#FFD166';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(0, -74, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Glowing Runic Eyes & Chest
    const eyeColor = isEnraged ? '#FFD166' : '#00F5D4';
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.arc(-8, -66, 3.2, 0, Math.PI * 2);
    ctx.arc(8, -66, 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isEnraged ? '#F77F00' : '#00F5D4';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.lineTo(-12, -42);
    ctx.lineTo(0, -32);
    ctx.lineTo(12, -42);
    ctx.closePath();
    ctx.stroke();

    // Arms
    const armSlam = stateName === 'slam' ? Math.sin(animTime * 20) * 16 : 0;
    ctx.fillStyle = '#264653';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-36, -50 + armSlam, 14, 38, [6, 6, 4, 4]);
      ctx.roundRect(22, -50 + armSlam, 14, 38, [6, 6, 4, 4]);
    } else {
      ctx.rect(-36, -50 + armSlam, 14, 38);
      ctx.rect(22, -50 + armSlam, 14, 38);
    }
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  static drawCoralia(ctx, x, y, state = {}) {
    const { animTime = 0 } = state;
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = 'rgba(10, 22, 16, 0.20)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    const breathe = Math.sin(animTime * 3) * 0.8;

    // Body
    ctx.fillStyle = '#78593F';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-9, -26 + breathe, 18, 26, [9, 9, 6, 6]);
    else ctx.rect(-9, -26 + breathe, 18, 26);
    ctx.fill();
    ctx.stroke();

    // Cream Belly
    ctx.fillStyle = '#FCEADE';
    ctx.beginPath();
    ctx.ellipse(0, -12 + breathe, 6, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(0, -19 + breathe, 5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#1D3557';
    ctx.beginPath();
    ctx.arc(0, -21 + breathe, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Diving Goggles & Snorkel
    ctx.fillStyle = '#38BDF8';
    ctx.strokeStyle = '#E9C46A';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-8, -26 + breathe, 16, 6, 3);
    else ctx.rect(-8, -26 + breathe, 16, 6);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#E9C46A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(6, -23 + breathe);
    ctx.quadraticCurveTo(12, -23 + breathe, 11, -34 + breathe);
    ctx.lineTo(8, -34 + breathe);
    ctx.stroke();

    // Shell Necklace
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.arc(-3, -15 + breathe, 2, 0, Math.PI * 2);
    ctx.arc(0, -14 + breathe, 2.5, 0, Math.PI * 2);
    ctx.arc(3, -15 + breathe, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  static drawBarnaby(ctx, x, y, state = {}) {
    const { animTime = 0 } = state;
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = 'rgba(10, 22, 16, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tortoise Shell
    ctx.fillStyle = '#2A9D8F';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, -16, 14, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#264653';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-6, -21, 12, 10);

    // Green Head
    ctx.fillStyle = '#52B788';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(8, -26, 10, 12, [5, 5, 4, 4]);
    else ctx.rect(8, -26, 10, 12);
    ctx.fill();
    ctx.stroke();

    // Golden Spectacles
    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, -24, 4, 4);

    // Bicorn Hat
    ctx.fillStyle = '#264653';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(4, -26);
    ctx.lineTo(13, -34);
    ctx.lineTo(22, -26);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(6, -26);
    ctx.lineTo(20, -26);
    ctx.stroke();

    ctx.restore();
  }

  static drawBeaconKeeper(ctx, x, y, state = {}) {
    const { animTime = 0 } = state;
    ctx.save();
    ctx.translate(x, y);

    const hoverY = Math.sin(animTime * 2.5) * 6 - 8;

    // Celestial Halo
    const haloGrad = ctx.createRadialGradient(0, hoverY, 4, 0, hoverY, 28);
    haloGrad.addColorStop(0, 'rgba(0, 245, 212, 0.5)');
    haloGrad.addColorStop(0.6, 'rgba(76, 201, 240, 0.25)');
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, hoverY, 28, 0, Math.PI * 2);
    ctx.fill();

    // Spirit Mantle
    ctx.fillStyle = '#E0FBFC';
    ctx.strokeStyle = '#00F5D4';
    ctx.lineWidth = 2.0;

    const wingWave = Math.sin(animTime * 4) * 4;
    ctx.beginPath();
    ctx.moveTo(0, hoverY - 16);
    ctx.quadraticCurveTo(-18, hoverY - 6 + wingWave, -22, hoverY + 6);
    ctx.quadraticCurveTo(-10, hoverY + 18, 0, hoverY + 22);
    ctx.quadraticCurveTo(10, hoverY + 18, 22, hoverY + 6);
    ctx.quadraticCurveTo(18, hoverY - 6 + wingWave, 0, hoverY - 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Diadem
    ctx.fillStyle = '#FFD166';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-7, hoverY - 16);
    ctx.lineTo(0, hoverY - 22);
    ctx.lineTo(7, hoverY - 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Celestial Eyes
    ctx.fillStyle = '#03045E';
    ctx.beginPath();
    ctx.arc(-4, hoverY - 8, 2.0, 0, Math.PI * 2);
    ctx.arc(4, hoverY - 8, 2.0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  static drawSunPearl(ctx, x, y, animTime = 0) {
    ctx.save();
    const floatY = y + Math.sin(animTime * 3.5) * 4;
    ctx.translate(x, floatY);

    ctx.fillStyle = 'rgba(255, 209, 102, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, 10 + Math.sin(animTime * 6) * 2, 0, Math.PI * 2);
    ctx.fill();

    const pearlGrad = ctx.createRadialGradient(-2, -2, 1, 0, 0, 7);
    pearlGrad.addColorStop(0, '#FFFFFF');
    pearlGrad.addColorStop(0.5, '#E0FBFC');
    pearlGrad.addColorStop(0.9, '#FFD166');
    pearlGrad.addColorStop(1, '#F4A261');

    ctx.fillStyle = pearlGrad;
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < 3; i++) {
      const angle = animTime * 4 + (i * Math.PI * 2) / 3;
      const sx = Math.cos(angle) * 11;
      const sy = Math.sin(angle) * 6;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  static drawNautilusShell(ctx, x, y, animTime = 0) {
    ctx.save();
    const floatY = y + Math.sin(animTime * 2.8) * 3;
    ctx.translate(x, floatY);

    ctx.fillStyle = '#FFD166';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#E76F51';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(-1, 0, 3.5, 0.4, Math.PI * 1.5);
    ctx.stroke();

    ctx.restore();
  }

  static drawLoreMedallion(ctx, x, y, animTime = 0) {
    ctx.save();
    const floatY = y + Math.sin(animTime * 2.0) * 3;
    ctx.translate(x, floatY);

    ctx.fillStyle = 'rgba(0, 245, 212, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, 12 + Math.sin(animTime * 4) * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFB703';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#00F5D4';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  static drawLighthouse(ctx, x, y, isLit = false, animTime = 0) {
    ctx.save();
    ctx.translate(x, y);

    if (isLit) {
      ctx.save();
      ctx.translate(0, -82);
      const beamAngle = Math.sin(animTime * 1.5) * 0.6;
      ctx.rotate(beamAngle);

      const beamGrad = ctx.createLinearGradient(0, 0, 180, 0);
      beamGrad.addColorStop(0, 'rgba(255, 209, 102, 0.65)');
      beamGrad.addColorStop(0.5, 'rgba(0, 245, 212, 0.30)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(180, -36);
      ctx.lineTo(180, 36);
      ctx.lineTo(0, 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    const towerGrad = ctx.createLinearGradient(-18, 0, 18, 0);
    towerGrad.addColorStop(0, '#577590');
    towerGrad.addColorStop(0.5, '#43AA8B');
    towerGrad.addColorStop(1, '#264653');

    ctx.fillStyle = towerGrad;
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-12, -72);
    ctx.lineTo(12, -72);
    ctx.lineTo(18, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Red band
    ctx.fillStyle = '#E76F51';
    ctx.fillRect(-15, -48, 30, 12);
    ctx.strokeRect(-15, -48, 30, 12);

    // Lantern Room
    ctx.fillStyle = isLit ? '#FFD166' : '#1D3557';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-10, -88, 20, 16, [4, 4, 0, 0]);
    else ctx.rect(-10, -88, 20, 16);
    ctx.fill();
    ctx.stroke();

    // Dome
    ctx.fillStyle = '#264653';
    ctx.beginPath();
    ctx.arc(0, -88, 8, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  static drawWaystone(ctx, x, y, isAttuned = false, animTime = 0) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = 'rgba(10, 22, 16, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#264653';
    ctx.strokeStyle = '#1D3557';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(-7, -34);
    ctx.lineTo(0, -42);
    ctx.lineTo(7, -34);
    ctx.lineTo(10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const runePulse = isAttuned ? Math.sin(animTime * 8) * 0.3 + 0.7 : 0.4;
    const runeColor = isAttuned ? '#FFD166' : '#00F5D4';

    ctx.strokeStyle = runeColor;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, -22, 4 * runePulse, 0, Math.PI * 2);
    ctx.moveTo(0, -28); ctx.lineTo(0, -16);
    ctx.moveTo(-4, -22); ctx.lineTo(4, -22);
    ctx.stroke();

    if (isAttuned) {
      ctx.strokeStyle = `rgba(255, 209, 102, ${0.4 * (1 - (animTime % 1))})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -22, 8 + (animTime % 1) * 16, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  static drawShrine(ctx, x, y, isAttuned = false, animTime = 0) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = '#264653';
    ctx.strokeStyle = '#00F5D4';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-16, -20, 32, 20, [4, 4, 0, 0]);
    else ctx.rect(-16, -20, 32, 20);
    ctx.fill();
    ctx.stroke();

    // Floating Crest
    const crestY = -32 + Math.sin(animTime * 4) * 3;
    ctx.fillStyle = '#00F5D4';
    ctx.beginPath();
    ctx.arc(0, crestY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  static drawCloudLedge(ctx, x, y, width = 64, opacity = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(0.1, Math.min(1.0, opacity));

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CAF0F8';
    ctx.lineWidth = 2.0;

    const bubbles = Math.floor(width / 16);
    ctx.beginPath();
    ctx.moveTo(-width / 2, 0);
    for (let i = 0; i <= bubbles; i++) {
      const cx = -width / 2 + i * 16;
      ctx.arc(cx, -6, 9, Math.PI, 0);
    }
    ctx.lineTo(width / 2, 4);
    ctx.lineTo(-width / 2, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  static drawUpdraft(ctx, x, y, height = 160, animTime = 0) {
    ctx.save();
    ctx.translate(x, y);

    const streamGrad = ctx.createLinearGradient(0, 0, 0, -height);
    streamGrad.addColorStop(0, 'rgba(202, 240, 248, 0.05)');
    streamGrad.addColorStop(0.5, 'rgba(202, 240, 248, 0.28)');
    streamGrad.addColorStop(1, 'rgba(0, 245, 212, 0.0)');

    ctx.fillStyle = streamGrad;
    ctx.fillRect(-16, -height, 32, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const offset = ((animTime * 120 + i * 40) % height);
      const wave = Math.sin(animTime * 6 + i) * 6;
      ctx.beginPath();
      ctx.moveTo(-8 + wave, -offset);
      ctx.lineTo(8 + wave, -offset - 16);
      ctx.stroke();
    }

    ctx.restore();
  }

  static drawHUDHeart(ctx, x, y, isFull = true) {
    ctx.save();
    ctx.translate(x, y);

    if (isFull) {
      ctx.fillStyle = '#FF4D6D';
      ctx.strokeStyle = '#1D3557';
      ctx.lineWidth = 2.0;

      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.bezierCurveTo(-6, -4, -10, 0, -10, 5);
      ctx.bezierCurveTo(-10, 11, 0, 16, 0, 19);
      ctx.bezierCurveTo(0, 16, 10, 11, 10, 5);
      ctx.bezierCurveTo(10, 0, 6, -4, 0, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-4, 4, 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#3D5A80';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.bezierCurveTo(-6, -4, -10, 0, -10, 5);
      ctx.bezierCurveTo(-10, 11, 0, 16, 0, 19);
      ctx.bezierCurveTo(0, 16, 10, 11, 10, 5);
      ctx.bezierCurveTo(10, 0, 6, -4, 0, 4);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();
  }
}

/**
 * Player Controller (Cori the Reef Sprite)
 */
export class Player {
  constructor(x = 100, y = 350) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = 18;
    this.height = 26;

    this.health = 3;
    this.maxHealth = 3;
    this.hearts = 3;
    this.maxHearts = 3;

    this.facing = 1;
    this.isGrounded = false;
    this.wasGrounded = false;
    this.prevVy = 0;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;

    // Squash & Stretch physics (Landing: 1.25/0.75, Jump: 0.85/1.20, Dash: 1.35/0.75, Stomp: 1.30/0.70)
    this.scaleX = 1.0;
    this.scaleY = 1.0;

    this.isDashing = false;
    this.isLeafDashing = false; // alias for QA compatibility
    this.dashTimer = 0;
    this.dashDirection = 1;
    this.hasAirDash = true;
    this.hasLeafDash = true; // alias
    this.dashCooldown = 0;

    this.invulnTimer = 0;
    this.knockbackTimer = 0;
  }

  update(dt, input, platforms = [], updrafts = [], enemies = [], onStomp = null, onHurt = null, onDash = null, onJump = null, onLand = null, onUpdraft = null) {
    if (this.invulnTimer > 0) this.invulnTimer -= dt;
    if (this.knockbackTimer > 0) this.knockbackTimer -= dt;
    if (this.dashCooldown > 0) this.dashCooldown -= dt;

    // Updrafts interaction
    let inUpdraft = false;
    for (const up of updrafts) {
      if (
        this.x >= up.x - 20 &&
        this.x <= up.x + 20 &&
        this.y >= up.y - (up.height || 160) &&
        this.y <= up.y + 10
      ) {
        if (!inUpdraft && this.vy > (up.liftVelocity || -220)) {
          this.scaleX = 0.85;
          this.scaleY = 1.20;
          if (onUpdraft) onUpdraft(up);
        }
        inUpdraft = true;
        this.vy = Math.min(this.vy, up.liftVelocity || -220);
        this.hasAirDash = true;
        this.hasLeafDash = true;
        break;
      }
    }

    // Ground check reset
    if (this.isGrounded) {
      this.coyoteTimer = KINEMATICS.COYOTE_TIME;
      this.hasAirDash = true;
      this.hasLeafDash = true;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }

    // Jump buffer check
    if (input.isJustPressed('up')) {
      this.jumpBufferTimer = KINEMATICS.JUMP_BUFFER;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
    }

    // Horizontal Movement
    if (this.knockbackTimer <= 0 && !this.isDashing) {
      let moveDir = 0;
      if (input.isDown('left')) moveDir -= 1;
      if (input.isDown('right')) moveDir += 1;

      if (moveDir !== 0) {
        this.facing = moveDir;
        const accel = this.isGrounded ? KINEMATICS.ACCEL_GROUND : KINEMATICS.ACCEL_AIR;
        this.vx += moveDir * accel * dt;
        this.vx = Math.max(-KINEMATICS.SPEED_MAX, Math.min(KINEMATICS.SPEED_MAX, this.vx));
      } else {
        const decel = this.isGrounded ? KINEMATICS.DECEL_GROUND : KINEMATICS.DRAG_AIR;
        if (this.vx > 0) {
          this.vx = Math.max(0, this.vx - decel * dt);
        } else if (this.vx < 0) {
          this.vx = Math.min(0, this.vx + decel * dt);
        }
      }
    }

    // Jump Execution
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0 && !this.isDashing) {
      this.vy = KINEMATICS.JUMP_IMPULSE;
      this.isGrounded = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;

      // Jump Squash & Stretch: 0.85x / 1.20x
      this.scaleX = 0.85;
      this.scaleY = 1.20;
      if (onJump) onJump(this.x, this.y);
    }

    // Variable Jump Cut
    if (!input.isDown('up') && this.vy < KINEMATICS.JUMP_CUT_VEL && !this.isDashing && !inUpdraft) {
      this.vy = KINEMATICS.JUMP_CUT_VEL;
    }

    // Tide Dash Execution
    if (input.isJustPressed('dash') && !this.isDashing && (this.isGrounded || this.hasAirDash)) {
      this.isDashing = true;
      this.isLeafDashing = true;
      this.dashTimer = KINEMATICS.DASH_DURATION;
      this.dashDirection = this.facing;
      this.vy = 0;
      if (!this.isGrounded) {
        this.hasAirDash = false;
        this.hasLeafDash = false;
      }

      // Tide Dash Squash & Stretch: 1.35x / 0.75x
      this.scaleX = 1.35;
      this.scaleY = 0.75;
      if (onDash) onDash(this.x, this.y, this.dashDirection);
    }

    // Dash timer
    if (this.isDashing) {
      this.dashTimer -= dt;
      this.vx = this.dashDirection * KINEMATICS.DASH_SPEED;
      this.vy = 0;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
        this.isLeafDashing = false;
        this.vx = this.dashDirection * KINEMATICS.SPEED_MAX;
      }
    } else if (!this.isGrounded && !inUpdraft) {
      this.vy += KINEMATICS.GRAVITY * dt;
      this.vy = Math.min(this.vy, KINEMATICS.FALL_CLAMP);
    }

    // Physics Resolution
    CollisionUtils.resolveHorizontal(this, platforms, dt);
    CollisionUtils.resolveVertical(this, platforms, dt, KINEMATICS.CORNER_NUDGE);

    // Landing Impact Squash & Stretch: 1.25x / 0.75x
    if (!this.wasGrounded && this.isGrounded) {
      this.scaleX = 1.25;
      this.scaleY = 0.75;
      if (onLand) onLand(this.x, this.y, this.prevVy);
    }
    this.wasGrounded = this.isGrounded;
    this.prevVy = this.vy;

    // Smooth Damped Recovery towards 1.0x
    this.scaleX += (1.0 - this.scaleX) * Math.min(1.0, dt * 14);
    this.scaleY += (1.0 - this.scaleY) * Math.min(1.0, dt * 14);

    // Enemy Stomp & Damage Checks
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (!enemy || (enemy.health <= 0 && enemy.hp <= 0)) continue;

      const ew = enemy.width || enemy.w || 24;
      const eh = enemy.height || enemy.h || 24;
      const dx = Math.abs(this.x - enemy.x);
      const dy = this.y - enemy.y;

      if (dx < (this.width + ew) * 0.55 && Math.abs(dy) < (this.height + eh) * 0.65) {
        // Downward Stomp
        if ((this.vy > 0 || (this.isGrounded && dy < 0)) && dy < 0) {
          const isDazedCrab = enemy.type === 'proximity_charger' ? (enemy.state === 'DAZED' || enemy.state === 'dazed') : true;
          if (enemy.canBeStomped !== false && isDazedCrab) {
            enemy.hp = Math.max(0, (enemy.hp || enemy.health || 1) - 1);
            enemy.health = enemy.hp;
            if (enemy.takeDamage) enemy.takeDamage(1, this.x);
            this.triggerStompBounce();
            if (onStomp) onStomp(enemy);
            break;
          } else if (!isDazedCrab && this.invulnTimer <= 0) {
            this.takeDamage(1, enemy.x);
            if (onHurt) onHurt(enemy);
            break;
          }
        } else if (this.invulnTimer <= 0) {
          this.takeDamage(1, enemy.x);
          if (onHurt) onHurt(enemy);
        }
      }
    }
  }

  triggerStompBounce() {
    this.vy = KINEMATICS.STOMP_BOUNCE;
    this.isGrounded = false;
    this.hasAirDash = true;
    this.hasLeafDash = true;
    this.isDashing = false;
    this.isLeafDashing = false;

    // Stomp Rebound Squash & Stretch: 1.30x / 0.70x
    this.scaleX = 1.30;
    this.scaleY = 0.70;
  }

  triggerDamage(amount = 1, sourceX = 0) {
    this.takeDamage(amount, sourceX);
  }

  takeDamage(amount = 1, sourceX = 0) {
    if (window.__gameInstance?.isGodMode || this.isGodMode) return;
    if (this.invulnTimer > 0) return;
    this.health = Math.max(0, this.health - amount);
    this.hearts = this.health;
    this.invulnTimer = KINEMATICS.INVULN_DURATION;

    const kbDir = this.x < sourceX ? -1 : 1;
    this.vx = kbDir * KINEMATICS.KNOCKBACK_VX;
    this.vy = KINEMATICS.KNOCKBACK_VY;
    this.knockbackTimer = 0.20;
    this.isDashing = false;
    this.isLeafDashing = false;
  }

  respawnAt(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.health = this.maxHealth;
    this.hearts = this.maxHealth;
    this.invulnTimer = 1.0;
    this.isDashing = false;
    this.isLeafDashing = false;
    this.hasAirDash = true;
    this.hasLeafDash = true;
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.wasGrounded = true;
    this.prevVy = 0;
  }
}

/**
 * Ancient Tide Golem Boss Controller
 */
export class AncientTideGolemBoss {
  constructor(arenaX = 1560, arenaY = 390) {
    this.x = arenaX;
    this.y = arenaY;
    this.hp = 3;
    this.maxHp = 3;
    this.phase = 1;
    this.state = 'idle'; // idle, slam, vulnerable, charge, dazed, defeated
    this.stateTimer = 2.0;
    this.facing = -1;
    this.width = 64;
    this.height = 74;
    this.arenaLeft = 1220;
    this.arenaRight = 1900;
    this.floorY = 390;
    this.boulders = [];
    this.waves = [];
    this.dangerPuddles = [];
  }

  update(dt, player, onPhaseChange, onStun, onDefeat, onEmitWave) {
    if (this.hp <= 0) {
      this.state = 'defeated';
      return;
    }

    this.stateTimer -= dt;

    // Face player
    if (this.state !== 'charge' && this.state !== 'dazed' && this.state !== 'vulnerable') {
      this.facing = player.x < this.x ? -1 : 1;
    }

    switch (this.state) {
      case 'idle':
        if (this.stateTimer <= 0) {
          if (this.phase === 1) {
            this.state = 'slam';
            this.stateTimer = 1.0;
          } else if (this.phase === 2) {
            this.state = Math.random() > 0.5 ? 'slam' : 'boulders';
            this.stateTimer = 1.2;
          } else {
            const rand = Math.random();
            if (rand < 0.35) this.state = 'slam';
            else if (rand < 0.7) this.state = 'charge';
            else this.state = 'water_jets';
            this.stateTimer = 1.0;
          }
        }
        break;

      case 'slam':
        if (this.stateTimer <= 0) {
          // Emit tidal shockwaves
          const speed = this.phase === 2 ? 260 : (this.phase === 3 ? 300 : 200);
          this.waves.push({ x: this.x, y: this.floorY, vx: -speed, w: 24, h: 18, life: 3.5 });
          this.waves.push({ x: this.x, y: this.floorY, vx: speed, w: 24, h: 18, life: 3.5 });
          if (onEmitWave) onEmitWave();

          this.state = 'vulnerable';
          this.stateTimer = this.phase === 1 ? 3.5 : (this.phase === 2 ? 2.6 : 2.2);
          if (onStun) onStun(this.stateTimer);
        }
        break;

      case 'boulders':
        if (this.stateTimer <= 0) {
          this.boulders.push({ x: this.x - 30, y: this.floorY - 40, vx: -160, vy: -120, r: 12, life: 4 });
          this.boulders.push({ x: this.x + 30, y: this.floorY - 40, vx: 160, vy: -120, r: 12, life: 4 });
          this.state = 'idle';
          this.stateTimer = 1.5;
        }
        break;

      case 'water_jets':
        if (this.stateTimer <= 0) {
          // Spawn danger reticles on floor
          this.dangerPuddles.push({ x: player.x, y: this.floorY, timer: 0.6, active: true });
          this.dangerPuddles.push({ x: player.x - 80, y: this.floorY, timer: 0.8, active: true });
          this.dangerPuddles.push({ x: player.x + 80, y: this.floorY, timer: 1.0, active: true });
          this.state = 'idle';
          this.stateTimer = 1.8;
        }
        break;

      case 'charge':
        this.x += this.facing * 320 * dt;
        if (this.x <= this.arenaLeft + 30 || this.x >= this.arenaRight - 30) {
          this.x = Math.max(this.arenaLeft + 30, Math.min(this.arenaRight - 30, this.x));
          this.state = 'dazed';
          this.stateTimer = 2.2;
          if (onStun) onStun(2.2);
        }
        break;

      case 'dazed':
      case 'vulnerable':
        if (this.stateTimer <= 0) {
          this.state = 'idle';
          this.stateTimer = 1.2;
        }
        break;
    }

    // Update projectiles
    for (let i = this.waves.length - 1; i >= 0; i--) {
      const w = this.waves[i];
      w.x += w.vx * dt;
      w.life -= dt;
      if (w.life <= 0 || w.x < this.arenaLeft || w.x > this.arenaRight) {
        this.waves.splice(i, 1);
      }
    }

    for (let i = this.boulders.length - 1; i >= 0; i--) {
      const b = this.boulders[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.vy += 600 * dt;
      if (b.y >= this.floorY - b.r) {
        b.y = this.floorY - b.r;
        b.vy = -180;
      }
      b.life -= dt;
      if (b.life <= 0 || b.x < this.arenaLeft || b.x > this.arenaRight) {
        this.boulders.splice(i, 1);
      }
    }
  }

  takeCoreDamage(onPhaseChange, onDefeat) {
    if (this.state !== 'vulnerable' && this.state !== 'dazed') return false;
    this.hp--;
    if (this.hp <= 0) {
      this.state = 'defeated';
      if (onDefeat) onDefeat();
      return true;
    }

    this.phase = 4 - this.hp;
    this.state = 'idle';
    this.stateTimer = 1.8;
    if (onPhaseChange) onPhaseChange(this.phase, this.hp);
    return true;
  }
}

/**
 * Master Tidebound Game Instance
 */
export class TideboundGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new CanvasRenderer(canvas, 720, 450);
    this.input = new InputManager(canvas);
    this.audio = new TideboundAudio();
    this.particles = new ParticleSystem(300);
    this.juice = new JuiceEffects();
    this.camera = new Camera2D(720, 450);
    this.dialogue = new DialogueSystem(720, 450);
    this.dialogueBox = this.dialogue; // alias for QA compatibility
    this.playgama = new PlaygamaBridge();

    // Abilities & Flags
    this.abilities = {
      dash: false,
      tideDash: false,
      leafDash: false
    };
    this.hasLeafDash = false; // alias for test runner

    // State Machine
    this.fsm = new StateMachine();
    Object.values(GameStates).forEach((state) => this.fsm.addState(state));
    this.fsm.setState = (name, payload) => this.fsm.transitionTo(name, payload);
    this.fsm.transitionTo(GameStates.TITLE);
    this.currentLevelIndex = 1;
    this.score = 0;
    this.deaths = 0;
    this.playtime = 0;
    this.animTime = 0;

    // Collectibles & Progress Trackers
    this.sunPearlsCollected = new Set();
    this.nautilusShellsCollected = new Set();
    this.medallionsCollected = new Set();
    this.lighthousesLit = new Set();
    this.activeWaystone = null;
    this.bossDefeated = false;

    // Entities
    this.player = new Player(100, 350);
    this.levelData = null;
    this.enemies = [];
    this.boss = null;
    this.updrafts = [];
    this.cloudLedges = [];
    this.interactiveProps = [];

    // Parse QA URL flags
    this.parseURLFlags();

    // Setup GameLoop
    this.loop = new GameLoop(
      (dt) => this.update(dt),
      (alpha) => this.render(alpha)
    );

    // Global Window bindings for QA test suite
    window.__tideboundInstance = this;
    window.__gameInstance = this;

    // DOM UI bindings & Playgama initialization
    this.bindDOMUI();
    this.initPlaygama();

    // Load initial save data
    this.loadSaveData();

    // Start Level 1
    this.loadLevel(this.currentLevelIndex);
    this.loop.start();
  }

  async initPlaygama() {
    try {
      await this.playgama.init();
    } catch (e) {
      console.warn('[PlaygamaBridge] Init warning:', e);
    }

    // Hook on-screen Audio Mute Button (Playgama UX Requirement)
    const btnMute = document.getElementById('btn-mute');
    if (btnMute) {
      const initialMuted = this.playgama.isMuted();
      this.audio.setMuted(initialMuted);
      btnMute.textContent = initialMuted ? '🔇' : '🔊';

      btnMute.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        const isMuted = this.playgama.toggleMute();
        this.audio.setMuted(isMuted);
        btnMute.textContent = isMuted ? '🔇' : '🔊';
        btnMute.setAttribute('aria-label', isMuted ? 'Unmute Audio' : 'Mute Audio');
      });
    }

    // Hook Tab Visibility Handling (Playgama Audio/Lifecycle Requirement)
    this.playgama.onVisibilityChange((isVisible) => {
      if (!isVisible) {
        this.audio.pause();
        if (this.fsm && this.fsm.currentState === GameStates.PLAYING) {
          this.fsm.transitionTo(GameStates.PAUSED);
        }
      } else {
        this.audio.resume();
      }
    });

    // Notify Playgama platform that loading is complete and game is ready for interaction
    this.playgama.sendGameReady();
  }

  parseURLFlags() {
    if (typeof window === 'undefined' || !window.location) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === '1') {
      try {
        localStorage.removeItem('tidebound_save_v1');
      } catch (e) {}
    }
    if (params.get('nosave') === '1') {
      this.isNoSave = true;
    }
    if (params.get('god') === '1') {
      this.isGodMode = true;
    }
    if (params.get('level')) {
      const lvl = parseInt(params.get('level'), 10);
      if (lvl >= 1 && lvl <= 5) {
        this.currentLevelIndex = lvl;
      }
    }
  }

  bindDOMUI() {
    const btnPlay = document.getElementById('btn-play-game');
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        const titleOverlay = document.getElementById('title-overlay');
        if (titleOverlay) titleOverlay.classList.add('hidden');
        this.fsm.transitionTo(GameStates.PLAYING);
        this.audio.init();
        this.audio.playBGM(this.levelData ? this.levelData.biome : 'tropical_beach');
      });
    }

    const btnHowToPlay = document.getElementById('btn-how-to-play');
    const howToPlayOverlay = document.getElementById('how-to-play-overlay');
    if (btnHowToPlay && howToPlayOverlay) {
      btnHowToPlay.addEventListener('click', () => {
        howToPlayOverlay.classList.remove('hidden');
      });
    }

    const btnCloseHowToPlay = document.getElementById('btn-close-how-to-play');
    const btnBackToMenu = document.getElementById('btn-back-to-menu');
    if (btnCloseHowToPlay && howToPlayOverlay) {
      btnCloseHowToPlay.addEventListener('click', () => {
        howToPlayOverlay.classList.add('hidden');
      });
    }
    if (btnBackToMenu && howToPlayOverlay) {
      btnBackToMenu.addEventListener('click', () => {
        howToPlayOverlay.classList.add('hidden');
        const titleOverlay = document.getElementById('title-overlay');
        if (titleOverlay) titleOverlay.classList.add('hidden');
        this.fsm.transitionTo(GameStates.PLAYING);
        this.audio.init();
        this.audio.playBGM(this.levelData ? this.levelData.biome : 'tropical_beach');
      });
    }

    const btnResetSave = document.getElementById('btn-reset-save');
    if (btnResetSave) {
      btnResetSave.addEventListener('click', () => {
        if (confirm('Reset all saved island exploration progress?')) {
          try {
            localStorage.removeItem('tidebound_save_v1');
            if (this.playgama) {
              this.playgama.deleteData('tidebound_save_v1');
            }
            window.location.reload();
          } catch (e) {}
        }
      });
    }

    // Touch Virtual Controls
    const btnTouchLeft = document.getElementById('btn-left');
    const btnTouchDown = document.getElementById('btn-down');
    const btnTouchRight = document.getElementById('btn-right');
    const btnTouchJump = document.getElementById('btn-jump');
    const btnTouchDash = document.getElementById('btn-dash');
    const btnTouchInteract = document.getElementById('btn-interact');

    const bindTouch = (elem, action) => {
      if (!elem) return;
      elem.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.input.actions[action] = true;
        this.input.justActions[action] = true;
      });
      elem.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.input.actions[action] = false;
      });
      elem.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.input.actions[action] = true;
        this.input.justActions[action] = true;
      });
      elem.addEventListener('mouseup', (e) => {
        e.preventDefault();
        this.input.actions[action] = false;
      });
    };

    bindTouch(btnTouchLeft, 'left');
    bindTouch(btnTouchDown, 'down');
    bindTouch(btnTouchRight, 'right');
    bindTouch(btnTouchJump, 'up');
    bindTouch(btnTouchDash, 'dash');
    bindTouch(btnTouchInteract, 'action');
  }

  loadLevel(levelIndex) {
    this.currentLevelIndex = levelIndex;
    const levels = this.getLevelsData();
    this.levelData = levels[levelIndex - 1] || levels[0];

    // Setup bounds
    this.camera.setBounds(0, this.levelData.width, 0, this.levelData.height);
    this.player.respawnAt(this.levelData.spawnX || 100, this.levelData.spawnY || 350);

    // Setup Enemies with Crab Wall Crash Juice (18px screen shake)
    this.enemies = (this.levelData.enemies || []).map((e) => {
      const ctrl = new EnemyController(e);
      if (ctrl.type === 'proximity_charger' || e.type === 'proximity_charger') {
        ctrl.onDazed = (enemy) => {
          this.juice.screenShake(18);
          this.juice.spawnShockwave(enemy.x, enemy.y, 50, '#F4A261');
          this.particles.dust(enemy.x, enemy.y, 16, 'rgba(235, 215, 160, 0.9)');
          this.juice.spawnFloatingText('CRASH! DAZED!', enemy.x, enemy.y - 25, { color: '#F4A261', size: 16 });
          this.audio.playCrabCrash();
        };
      }
      return ctrl;
    });
    this.levelData.enemies = this.enemies;

    // Setup Boss if Level 5
    if (this.levelData.boss) {
      this.boss = new AncientTideGolemBoss(1560, 390);
    } else {
      this.boss = null;
    }

    this.updrafts = this.levelData.updrafts || [];
    this.cloudLedges = this.levelData.cloudLedges || [];

    if (this.fsm.currentState === GameStates.PLAYING) {
      this.audio.playBGM(this.levelData.biome);
    }
  }

  getLevelsData() {
    return [
      // Level 1: Palm Beach
      {
        id: 'level_1',
        index: 1,
        name: 'Palm Beach',
        biome: 'tropical_beach',
        width: 2160,
        height: 450,
        spawnX: 100,
        spawnY: 350,
        platforms: [
          { x: 0, y: 390, w: 550, h: 60 },
          { x: 600, y: 300, w: 300, h: 20 },
          { x: 600, y: 390, w: 350, h: 60 },
          { x: 800, y: 360, w: 150, h: 90, isSecret: true },
          { x: 1050, y: 390, w: 400, h: 60 },
          { x: 1450, y: 220, w: 300, h: 20 },
          { x: 1500, y: 390, w: 660, h: 60 }
        ],
        hazards: [
          { x: 950, y: 430, w: 100, h: 20, type: 'water_chasm' }
        ],
        sunPearls: [
          { id: 'pearl_1_1', x: 420, y: 300 },
          { id: 'pearl_1_2', x: 750, y: 240 },
          { id: 'pearl_1_3', x: 1065, y: 310 },
          { id: 'pearl_1_4', x: 1600, y: 160 },
          { id: 'pearl_1_5', x: 1880, y: 290 }
        ],
        nautilusShells: [
          { id: 'shell_1_1', x: 150, y: 350 },
          { id: 'shell_1_2', x: 280, y: 350 },
          { id: 'shell_1_3', x: 500, y: 320 },
          { id: 'shell_1_4', x: 640, y: 260 },
          { id: 'shell_1_5', x: 820, y: 260 },
          { id: 'shell_1_6', x: 860, y: 360 },
          { id: 'shell_1_7', x: 1000, y: 350 },
          { id: 'shell_1_8', x: 1480, y: 350 },
          { id: 'shell_1_9', x: 1720, y: 180 },
          { id: 'shell_1_10', x: 2080, y: 350 }
        ],
        secretMedallion: { id: 'medallion_tides', x: 880, y: 330 },
        waystone: { id: 'waystone_1', x: 1240, y: 390 },
        lighthouse: { id: 'lighthouse_1', x: 1980, y: 390 },
        npcs: [
          {
            id: 'coralia_diver',
            x: 1320,
            y: 390,
            name: 'Coralia the Pearl Diver',
            avatar: 'coralia_diver',
            dialogue: [
              'Ahoy there, little Cori! The coastal tempests have extinguished the Three Ancient Lighthouses, and dark tides churn across the archipelago.',
              'Collect the 5 Sun Pearls scattered across each reef to restore their radiance. Press [Space] to leap, and stomp atop Hermit Scuttlers to bounce safely!',
              'Seek out my old sailing partner Barnaby in the Overgrown Ruins ahead. Keep your antennae glowing bright, little sprite!'
            ]
          }
        ],
        enemies: [
          { type: 'patrol_walker', x: 700, y: 285, minX: 620, maxX: 880, speed: 60 },
          { type: 'patrol_walker', x: 1520, y: 375, minX: 1450, maxX: 1750, speed: 60 }
        ],
        exit: { x: 2140, y: 390, targetLevel: 2 }
      },

      // Level 2: Overgrown Ruins
      {
        id: 'level_2',
        index: 2,
        name: 'Overgrown Ruins',
        biome: 'sunken_ruins',
        width: 1440,
        height: 900,
        spawnX: 120,
        spawnY: 820,
        platforms: [
          { x: 0, y: 860, w: 500, h: 40 },
          { x: 220, y: 720, w: 220, h: 20, isMoving: true, minX: 200, maxX: 440, vx: 50 },
          { x: 550, y: 600, w: 320, h: 20 },
          { x: 650, y: 480, w: 240, h: 20 },
          { x: 680, y: 540, w: 160, h: 20, isSecret: true },
          { x: 150, y: 420, w: 300, h: 20, isMoving: true, minX: 120, maxX: 450, vx: 60 },
          { x: 500, y: 320, w: 420, h: 20 },
          { x: 1000, y: 320, w: 440, h: 20 }
        ],
        hazards: [
          { x: 500, y: 880, w: 940, h: 20, type: 'spike_reef' }
        ],
        sunPearls: [
          { id: 'pearl_2_1', x: 330, y: 650 },
          { id: 'pearl_2_2', x: 700, y: 480 },
          { id: 'pearl_2_3', x: 300, y: 350 },
          { id: 'pearl_2_4', x: 720, y: 250 },
          { id: 'pearl_2_5', x: 1180, y: 240 }
        ],
        nautilusShells: [
          { id: 'shell_2_1', x: 160, y: 800 },
          { id: 'shell_2_2', x: 380, y: 780 },
          { id: 'shell_2_3', x: 280, y: 680 },
          { id: 'shell_2_4', x: 580, y: 560 },
          { id: 'shell_2_5', x: 680, y: 520 },
          { id: 'shell_2_6', x: 200, y: 380 },
          { id: 'shell_2_7', x: 400, y: 380 },
          { id: 'shell_2_8', x: 850, y: 280 },
          { id: 'shell_2_9', x: 1050, y: 280 },
          { id: 'shell_2_10', x: 1340, y: 280 }
        ],
        secretMedallion: { id: 'medallion_ruins', x: 720, y: 500 },
        waystone: { id: 'waystone_2', x: 720, y: 480 },
        lighthouse: { id: 'lighthouse_2', x: 1280, y: 320 },
        npcs: [
          {
            id: 'barnaby_navigator',
            x: 720,
            y: 480,
            name: 'Barnaby the Navigator',
            avatar: 'barnaby_navigator',
            dialogue: [
              'Shiver me barnacles! You made it past the outer reefs, young Cori. The ancient masonry here holds strong, but the waters are rising fast.',
              'Deep within the Flooded Caves lies the sacred Shrine of the Tide Dash. Once attuned, you can press [Shift] or [J] mid-air to surge through the sea breeze!',
              'Beware the Coral Crusher Crabs on the high cliffs. Their thick armor can only be cracked when they daze themselves against hard stone walls!'
            ]
          }
        ],
        enemies: [
          { type: 'patrol_walker', x: 250, y: 840, minX: 100, maxX: 450, speed: 60 },
          { type: 'rhythmic_hopper', x: 700, y: 580, minX: 580, maxX: 820, hopImpulse: -350 },
          { type: 'rhythmic_hopper', x: 750, y: 300, minX: 550, maxX: 880, hopImpulse: -350 }
        ],
        exit: { x: 1400, y: 320, targetLevel: 3 }
      },

      // Level 3: Flooded Caves
      {
        id: 'level_3',
        index: 3,
        name: 'Flooded Caves',
        biome: 'bioluminescent_grotto',
        width: 2160,
        height: 675,
        spawnX: 100,
        spawnY: 550,
        platforms: [
          { x: 0, y: 580, w: 400, h: 95 },
          { x: 450, y: 560, w: 160, h: 20 },
          { x: 700, y: 540, w: 160, h: 20 },
          { x: 900, y: 520, w: 320, h: 40 },
          { x: 1120, y: 480, w: 120, h: 20, isSecret: true },
          { x: 1300, y: 420, w: 260, h: 40 },
          { x: 1620, y: 420, w: 180, h: 20 },
          { x: 1900, y: 360, w: 260, h: 60 }
        ],
        hazards: [
          { x: 400, y: 640, w: 1500, h: 35, type: 'abyss_water' }
        ],
        cloudLedges: [
          { x: 220, y: 520, w: 64, isDissolving: true },
          { x: 340, y: 500, w: 64, isDissolving: true }
        ],
        sunPearls: [
          { id: 'pearl_3_1', x: 280, y: 500 },
          { id: 'pearl_3_2', x: 650, y: 380 },
          { id: 'pearl_3_3', x: 1750, y: 360 },
          { id: 'pearl_3_4', x: 2000, y: 280 },
          { id: 'pearl_3_5', x: 2100, y: 280 }
        ],
        nautilusShells: [
          { id: 'shell_3_1', x: 120, y: 540 },
          { id: 'shell_3_2', x: 220, y: 540 },
          { id: 'shell_3_3', x: 340, y: 540 },
          { id: 'shell_3_4', x: 520, y: 480 },
          { id: 'shell_3_5', x: 780, y: 480 },
          { id: 'shell_3_6', x: 1150, y: 480 },
          { id: 'shell_3_7', x: 1300, y: 380 },
          { id: 'shell_3_8', x: 1500, y: 380 },
          { id: 'shell_3_9', x: 1680, y: 380 },
          { id: 'shell_3_10', x: 1880, y: 380 }
        ],
        secretMedallion: { id: 'medallion_depths', x: 1160, y: 440 },
        waystone: { id: 'waystone_3', x: 1080, y: 520 },
        shrine: { id: 'shrine_tide_dash', x: 1400, y: 420, ability: 'tideDash' },
        enemies: [
          { type: 'sine_flyer', x: 550, y: 460, minX: 450, maxX: 850, sineAmplitude: 28, sineFrequency: 3.77 },
          { type: 'sine_flyer', x: 700, y: 440, minX: 600, maxX: 900, sineAmplitude: 28, sineFrequency: 3.77 },
          { type: 'rhythmic_hopper', x: 2000, y: 340, minX: 1920, maxX: 2120, hopImpulse: -350 }
        ],
        exit: { x: 2140, y: 360, targetLevel: 4 }
      },

      // Level 4: Wind Cliffs
      {
        id: 'level_4',
        index: 4,
        name: 'Wind Cliffs',
        biome: 'tempest_cliffs',
        width: 2880,
        height: 450,
        spawnX: 100,
        spawnY: 340,
        platforms: [
          { x: 0, y: 380, w: 450, h: 70 },
          { x: 500, y: 320, w: 400, h: 20 },
          { x: 950, y: 380, w: 400, h: 70 },
          { x: 1400, y: 360, w: 250, h: 40 },
          { x: 1550, y: 300, w: 120, h: 20, isSecret: true },
          { x: 1700, y: 380, w: 200, h: 70 },
          { x: 2000, y: 340, w: 300, h: 40 },
          { x: 2400, y: 300, w: 480, h: 70 }
        ],
        hazards: [
          { x: 450, y: 440, w: 1950, h: 10, type: 'bottomless_chasm' }
        ],
        updrafts: [
          { x: 350, y: 380, height: 220, liftVelocity: -220 },
          { x: 1750, y: 380, height: 240, liftVelocity: -220 },
          { x: 2100, y: 340, height: 240, liftVelocity: -220 }
        ],
        cloudLedges: [
          { x: 620, y: 260, w: 64 },
          { x: 740, y: 240, w: 64 },
          { x: 860, y: 220, w: 64 }
        ],
        sunPearls: [
          { id: 'pearl_4_1', x: 350, y: 180 },
          { id: 'pearl_4_2', x: 700, y: 220 },
          { id: 'pearl_4_3', x: 1250, y: 320 },
          { id: 'pearl_4_4', x: 2000, y: 160 },
          { id: 'pearl_4_5', x: 2550, y: 240 }
        ],
        nautilusShells: [
          { id: 'shell_4_1', x: 180, y: 340 },
          { id: 'shell_4_2', x: 350, y: 240 },
          { id: 'shell_4_3', x: 580, y: 240 },
          { id: 'shell_4_4', x: 820, y: 240 },
          { id: 'shell_4_5', x: 1100, y: 340 },
          { id: 'shell_4_6', x: 1580, y: 280 },
          { id: 'shell_4_7', x: 1850, y: 340 },
          { id: 'shell_4_8', x: 2150, y: 340 },
          { id: 'shell_4_9', x: 2450, y: 260 },
          { id: 'shell_4_10', x: 2780, y: 260 }
        ],
        secretMedallion: { id: 'medallion_gale', x: 1580, y: 260 },
        waystone: { id: 'waystone_4', x: 1500, y: 360 },
        lighthouse: { id: 'lighthouse_3', x: 2680, y: 300 },
        enemies: [
          { type: 'proximity_charger', x: 1100, y: 365, minX: 950, maxX: 1350, chargeSpeed: 280, dazeDuration: 2.2 },
          { type: 'sine_flyer', x: 1850, y: 280, minX: 1700, maxX: 2000, sineAmplitude: 28, sineFrequency: 3.77 },
          { type: 'proximity_charger', x: 2500, y: 285, minX: 2350, maxX: 2750, chargeSpeed: 280, dazeDuration: 2.2 }
        ],
        exit: { x: 2840, y: 300, targetLevel: 5 }
      },

      // Level 5: Lighthouse Island & Boss Arena
      {
        id: 'level_5',
        index: 5,
        name: 'Lighthouse Island & Boss Arena',
        biome: 'beacon_sanctuary',
        width: 2160,
        height: 450,
        spawnX: 80,
        spawnY: 340,
        boss: true,
        platforms: [
          { x: 0, y: 380, w: 500, h: 70 },
          { x: 550, y: 320, w: 300, h: 20 },
          { x: 900, y: 380, w: 260, h: 70 },
          { x: 950, y: 340, w: 120, h: 20, isSecret: true },
          // Boss Coliseum Arena Floor & Shelves
          { x: 1200, y: 390, w: 720, h: 60 },
          { x: 1280, y: 260, w: 140, h: 20 },
          { x: 1700, y: 260, w: 140, h: 20 },
          // Ending Altar
          { x: 1920, y: 350, w: 240, h: 100 }
        ],
        hazards: [
          { x: 500, y: 440, w: 400, h: 10, type: 'abyss' }
        ],
        sunPearls: [
          { id: 'pearl_5_1', x: 260, y: 220 },
          { id: 'pearl_5_2', x: 700, y: 180 },
          { id: 'pearl_5_3', x: 1080, y: 260 },
          { id: 'pearl_5_4', x: 1220, y: 250 },
          { id: 'pearl_5_5', x: 1560, y: 340 }
        ],
        nautilusShells: [
          { id: 'shell_5_1', x: 140, y: 340 },
          { id: 'shell_5_2', x: 380, y: 340 },
          { id: 'shell_5_3', x: 620, y: 280 },
          { id: 'shell_5_4', x: 820, y: 280 },
          { id: 'shell_5_5', x: 960, y: 340 },
          { id: 'shell_5_6', x: 1020, y: 340 },
          { id: 'shell_5_7', x: 1320, y: 220 },
          { id: 'shell_5_8', x: 1760, y: 220 },
          { id: 'shell_5_9', x: 1950, y: 310 },
          { id: 'shell_5_10', x: 2040, y: 310 }
        ],
        secretMedallion: { id: 'medallion_beacon', x: 960, y: 300 },
        waystone: { id: 'waystone_5', x: 980, y: 380 },
        lighthouse: { id: 'final_beacon', x: 1920, y: 350 },
        npcs: [
          {
            id: 'ancient_beacon_keeper',
            x: 950,
            y: 380,
            name: 'Ancient Beacon Keeper',
            avatar: 'ancient_beacon_keeper',
            dialogue: [
              'Cori, child of the tides! You have awakened the ancient beacons and calmed the fury of the Tide Golem.',
              'All 4 Lighthouses ignite across the horizon! The storm subsides and the coral isles flourish once more.',
              'May the great ocean cradle guide your travels forever, Master Navigator of the Reefs!'
            ]
          }
        ],
        enemies: [
          { type: 'rhythmic_hopper', x: 240, y: 360, minX: 100, maxX: 400, hopImpulse: -350 },
          { type: 'sine_flyer', x: 680, y: 260, minX: 550, maxX: 820, sineAmplitude: 28, sineFrequency: 3.77 },
          { type: 'proximity_charger', x: 1020, y: 365, minX: 900, maxX: 1140, chargeSpeed: 280, dazeDuration: 2.2 }
        ]
      }
    ];
  }

  update(dt) {
    this.animTime += dt;
    this.playtime += dt;

    // Fast return if in title or modal state
    if (this.fsm.currentState !== GameStates.PLAYING) {
      if (this.dialogue.active) {
        const advance = this.input.isJustPressed('action') || this.input.isJustPressed('up');
        this.dialogue.update(dt, advance);
      }
      this.input.endFrame();
      return;
    }

    // Dialogue Update
    if (this.dialogue.active) {
      const advance = this.input.isJustPressed('action') || this.input.isJustPressed('up');
      this.dialogue.update(dt, advance);
      this.input.endFrame();
      return;
    }

    // Check pause
    if (this.input.isJustPressed('pause')) {
      this.fsm.transitionTo(GameStates.PAUSED);
      this.input.endFrame();
      return;
    }

    // Update Player with delight callbacks
    this.player.update(
      dt,
      this.input,
      this.levelData.platforms,
      this.updrafts,
      this.enemies,
      (enemy) => {
        // Stomp callback: 10px screen shake, +100 STOMP! popup, burst & sparkles
        this.audio.playStomp();
        this.particles.burst(this.player.x, this.player.y + 10, '#00F5D4', 16);
        this.particles.sparkles(enemy.x, enemy.y, 8, ['#00F5D4', '#FFD166', '#FFFFFF']);
        this.juice.screenShake(10);
        this.score += enemy.scoreValue || 100;
        this.juice.spawnFloatingText('+100 STOMP!', enemy.x, enemy.y - 20, { color: '#FFD166' });
      },
      (enemy) => {
        // Hurt callback: 8px screen shake, hurt flash, burst particles
        if (!this.isGodMode) {
          this.audio.playHurt();
          this.juice.screenShake(8);
          this.juice.screenFlash('#FF4D6D', 0.4);
          this.particles.burst(this.player.x, this.player.y, '#FF4D6D', 14);
        }
      },
      (x, y, dir) => {
        // Dash callback: 2px screen shake, seafoam burst particles
        this.juice.screenShake(2);
        this.audio.playDash();
        this.particles.burst(x, y, '#2EC4B6', 12);
      },
      (x, y) => {
        // Jump callback: sparkling pearl dust particles
        this.audio.playJump();
        this.particles.sparkles(x, y + 12, 6, ['#FDFFFC', '#FFD166', '#00F5D4']);
      },
      (x, y, prevVy) => {
        // Land callback: sand/bubble puffs, landing sound
        if (prevVy > 80) {
          this.audio.playLand();
          this.particles.dust(x, y + 14, 8, 'rgba(235, 215, 160, 0.85)');
        }
      },
      (up) => {
        // Updraft / Springboard callback: 4px screen shake, BOING! popup
        this.juice.screenShake(4);
        this.audio.playSpringBoing();
        this.juice.spawnFloatingText('BOING!', this.player.x, this.player.y - 20, { color: '#80ED99' });
        this.particles.sparkles(this.player.x, this.player.y + 10, 10, ['#00F5D4', '#80ED99', '#FFFFFF']);
      }
    );

    // Continuous Seafoam Water Trails during Tide Dash
    if (this.player.isDashing) {
      this.particles.emit({
        x: this.player.x - this.player.facing * 10,
        y: this.player.y + (Math.random() - 0.5) * 10,
        count: 2,
        colors: ['#2EC4B6', '#80ED99', '#E4F5FC', '#FFFFFF', '#00F5D4'],
        speedMin: 20,
        speedMax: 80,
        angleMin: this.player.facing > 0 ? Math.PI * 0.8 : -Math.PI * 0.2,
        angleMax: this.player.facing > 0 ? Math.PI * 1.2 : Math.PI * 0.2,
        radiusMin: 2,
        radiusMax: 5,
        lifeMin: 0.2,
        lifeMax: 0.45,
        gravity: 10,
        drag: 0.92,
        shape: 'circle'
      });
    }

    // Fall below level abyss
    if (this.player.y > this.levelData.height + 60) {
      this.respawnAtCheckpoint();
    }

    // Check death
    if (this.player.health <= 0 && !this.isGodMode) {
      this.respawnAtCheckpoint();
    }

    // Update Enemies
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].update(dt, this.player, this.levelData.platforms, this.animTime);
    }

    // Update Moving Platforms
    for (const plat of this.levelData.platforms) {
      if (plat.isMoving) {
        plat.x += (plat.vx || 50) * dt;
        if (plat.x <= plat.minX) {
          plat.x = plat.minX;
          plat.vx = Math.abs(plat.vx || 50);
        } else if (plat.x >= plat.maxX) {
          plat.x = plat.maxX;
          plat.vx = -Math.abs(plat.vx || 50);
        }
      }
    }

    // Update Boss if active
    if (this.boss) {
      this.boss.update(
        dt,
        this.player,
        (phase, hp) => {
          this.juice.screenShake(12);
          this.juice.screenFlash('#00F5D4', 0.5);
          this.juice.spawnFloatingText(`PHASE ${phase}!`, 1560, 260, { color: '#FFD166', size: 24 });
        },
        (duration) => {
          this.juice.screenShake(6);
          this.juice.spawnFloatingText('CORE EXPOSED!', 1560, 260, { color: '#00F5D4' });
        },
        () => {
          // Boss defeated / purified
          this.bossDefeated = true;
          this.audio.playPurification();
          this.audio.playVictory();
          this.juice.screenShake(16);
          this.juice.screenFlash('#FFD166', 0.6);
          this.particles.confetti(1560, 300, 60);
          this.particles.burst(1560, 300, '#00F5D4', 35);
          this.juice.spawnFloatingText('GOLEM PURIFIED!', 1560, 240, { color: '#FFD166', size: 26 });
          this.score += 1000;
          this.sunPearlsCollected.add('pearl_5_5');
          this.saveSaveData();
        },
        () => {
          // Tide Golem ground slam: 20px screen shake!
          this.audio.playBossSlam();
          this.juice.screenShake(20);
          this.juice.spawnShockwave(this.boss.x, this.boss.floorY, 80, '#00F5D4');
          this.particles.dust(this.boss.x, this.boss.floorY, 20, '#00F5D4');
          this.juice.spawnFloatingText('GROUND SLAM!', this.boss.x, this.boss.y - 70, { color: '#00F5D4', size: 18 });
        }
      );

      // Stomp boss core check
      if (
        (this.boss.state === 'vulnerable' || this.boss.state === 'dazed') &&
        Math.abs(this.player.x - this.boss.x) < 28 &&
        this.player.y < this.boss.y - 45 &&
        this.player.y > this.boss.y - 85 &&
        this.player.vy > 0
      ) {
        this.player.vy = KINEMATICS.STOMP_BOUNCE;
        this.audio.playBossHit();
        this.juice.screenShake(12);
        this.juice.screenFlash('#00F5D4', 0.45);
        this.juice.spawnShockwave(this.boss.x, this.boss.y - 45, 60, '#FFD166');
        this.particles.burst(this.boss.x, this.boss.y - 45, '#FFD166', 25);
        this.juice.spawnFloatingText('CORE CRACK!', this.boss.x, this.boss.y - 65, { color: '#FFD166', size: 20 });
        this.boss.takeCoreDamage();
      }
    }

    // Update Camera
    this.camera.follow(this.player.x, this.player.y, dt);
    this.camera.setShakeOffset(this.juice.shakeX, this.juice.shakeY);

    // Update Particles & Juice
    this.particles.update(dt);
    this.juice.update(dt);

    // Collectibles & Interactivity Check
    this.checkInteractables();

    this.input.endFrame();
  }

  checkInteractables() {
    // 1. Sun Pearls
    for (const pearl of this.levelData.sunPearls || []) {
      if (!this.sunPearlsCollected.has(pearl.id)) {
        if (Math.hypot(this.player.x - pearl.x, this.player.y - pearl.y) < 24) {
          this.sunPearlsCollected.add(pearl.id);
          this.score += 50;
          this.audio.playSunPearl();
          this.particles.sparkles(pearl.x, pearl.y, 14, ['#FDFFFC', '#FFD166', '#00F5D4']);
          this.juice.spawnFloatingText('+50 PEARL!', pearl.x, pearl.y - 15, { color: '#FFD166' });
          this.saveSaveData();
        }
      }
    }

    // 2. Nautilus Shells
    for (const shell of this.levelData.nautilusShells || []) {
      if (!this.nautilusShellsCollected.has(shell.id)) {
        if (Math.hypot(this.player.x - shell.x, this.player.y - shell.y) < 22) {
          this.nautilusShellsCollected.add(shell.id);
          this.score += 20;
          this.audio.playNautilusShell();
          this.particles.sparkles(shell.x, shell.y, 8, ['#FFD166', '#F4A261', '#FFFFFF']);
          this.juice.spawnFloatingText('+20 SHELL!', shell.x, shell.y - 12, { color: '#F4A261' });
        }
      }
    }

    // 3. Secret Lore Medallion
    const med = this.levelData.secretMedallion;
    if (med && !this.medallionsCollected.has(med.id)) {
      if (Math.hypot(this.player.x - med.x, this.player.y - med.y) < 26) {
        this.medallionsCollected.add(med.id);
        this.score += 500;
        this.audio.playMedallion();
        this.particles.confetti(med.x, med.y, 40);
        this.particles.burst(med.x, med.y, '#FFB703', 30);
        this.juice.spawnFloatingText('+500 LORE!', med.x, med.y - 20, { color: '#00F5D4', size: 20 });
        const meta = LORE_MEDALLIONS[med.id];
        if (meta) {
          this.dialogue.start('Ancient Medallion', 'medallion', [meta.lore], {
            onChirp: () => this.audio.playChirp('beaconKeeper')
          });
        }
        this.saveSaveData();
      }
    }

    // 4. Checkpoint Waystone
    const waystone = this.levelData.waystone;
    if (waystone) {
      if (Math.hypot(this.player.x - waystone.x, this.player.y - (waystone.y - 20)) < 35) {
        if (this.activeWaystone !== waystone.id) {
          this.activeWaystone = waystone.id;
          this.player.health = this.player.maxHealth;
          this.player.hearts = this.player.maxHearts;
          this.audio.playWaystone();
          this.juice.screenShake(4);
          this.particles.burst(waystone.x, waystone.y - 20, '#00F5D4', 20);
          this.particles.sparkles(waystone.x, waystone.y - 20, 12, ['#00F5D4', '#FFD166', '#FFFFFF']);
          this.juice.spawnFloatingText('WAYSTONE ATTUNED!', waystone.x, waystone.y - 45, { color: '#00F5D4' });
          this.saveSaveData();
        }
      }
    }

    // 5. Lighthouse
    const lighthouse = this.levelData.lighthouse;
    if (lighthouse) {
      if (Math.hypot(this.player.x - lighthouse.x, this.player.y - (lighthouse.y - 40)) < 45) {
        if (!this.lighthousesLit.has(lighthouse.id)) {
          this.lighthousesLit.add(lighthouse.id);
          this.audio.playLighthouse();
          this.particles.confetti(lighthouse.x, lighthouse.y - 80, 40);
          this.particles.burst(lighthouse.x, lighthouse.y - 80, '#FFD166', 25);
          this.juice.spawnFloatingText('LIGHTHOUSE IGNITED!', lighthouse.x, lighthouse.y - 95, { color: '#FFD166', size: 20 });
          this.saveSaveData();
        }
      }
    }

    // 6. Ability Shrine
    const shrine = this.levelData.shrine;
    if (shrine) {
      if (Math.hypot(this.player.x - shrine.x, this.player.y - shrine.y) < 40) {
        if (!this.abilities.tideDash) {
          this.abilities.tideDash = true;
          this.abilities.dash = true;
          this.abilities.leafDash = true;
          this.hasLeafDash = true;
          this.audio.playMedallion();
          this.particles.burst(shrine.x, shrine.y - 20, '#00F5D4', 30);
          this.particles.sparkles(shrine.x, shrine.y - 20, 15, ['#00F5D4', '#FFD166', '#FFFFFF']);
          this.juice.spawnFloatingText('TIDE DASH UNLOCKED!', shrine.x, shrine.y - 50, { color: '#FFD166', size: 20 });
          this.dialogue.start('Shrine of the Tides', 'shrine', [
            'The ancient current courses through your fins!\n\nPress [Shift] or [J] mid-air to perform a Tide Dash!'
          ]);
          this.saveSaveData();
        }
      }
    }

    // 7. NPCs
    for (const npc of this.levelData.npcs || []) {
      if (Math.hypot(this.player.x - npc.x, this.player.y - (npc.y - 15)) < 45) {
        if (this.input.isJustPressed('action')) {
          this.dialogue.start(npc.name, npc.avatar, npc.dialogue, {
            onChirp: (avatar) => this.audio.playChirp(avatar)
          });
        }
      }
    }

    // 8. Exit Gate
    const exit = this.levelData.exit;
    if (exit) {
      if (Math.hypot(this.player.x - exit.x, this.player.y - (exit.y - 20)) < 35) {
        this.particles.confetti(exit.x, exit.y - 20, 30);
        this.juice.spawnFloatingText('LEVEL COMPLETE!', exit.x, exit.y - 45, { color: '#00F5D4', size: 18 });
        this.audio.playLevelClear();
        this.loadLevel(exit.targetLevel);
      }
    }
  }

  respawnAtCheckpoint() {
    this.deaths++;
    let spawnX = this.levelData.spawnX || 100;
    let spawnY = this.levelData.spawnY || 350;
    if (this.activeWaystone && this.levelData.waystone && this.activeWaystone === this.levelData.waystone.id) {
      spawnX = this.levelData.waystone.x;
      spawnY = this.levelData.waystone.y - 10;
    }
    this.player.respawnAt(spawnX, spawnY);
    this.juice.screenFlash('#00F5D4', 0.3);
  }

  // Aliases for test runners
  respawnPlayer() { this.respawnAtCheckpoint(); }
  respawn() { this.respawnAtCheckpoint(); }

  render(alpha) {
    this.renderer.beginFrame(this.camera);
    const ctx = this.renderer.ctx;

    // 1. Render World Parallax Background
    this.renderBiomeBackground(ctx);

    // 2. Render Platforms
    for (const plat of this.levelData.platforms || []) {
      if (plat.isSecret && !this.medallionsCollected.has(this.levelData.secretMedallion && this.levelData.secretMedallion.id)) {
        ctx.fillStyle = 'rgba(46, 196, 182, 0.4)';
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      } else {
        this.renderTile(ctx, plat.x, plat.y, plat.w, plat.h, this.levelData.biome);
      }
    }

    // 3. Render Cloud Ledges & Updrafts
    for (const cl of this.cloudLedges) {
      Renderer.drawCloudLedge(ctx, cl.x, cl.y, cl.w || 64, 1.0);
    }
    for (const up of this.updrafts) {
      Renderer.drawUpdraft(ctx, up.x, up.y, up.height || 160, this.animTime);
    }

    // 4. Render Waystone & Lighthouse & Shrine
    if (this.levelData.waystone) {
      const isAttuned = this.activeWaystone === this.levelData.waystone.id;
      Renderer.drawWaystone(ctx, this.levelData.waystone.x, this.levelData.waystone.y, isAttuned, this.animTime);
    }
    if (this.levelData.lighthouse) {
      const isLit = this.lighthousesLit.has(this.levelData.lighthouse.id);
      Renderer.drawLighthouse(ctx, this.levelData.lighthouse.x, this.levelData.lighthouse.y, isLit, this.animTime);
    }
    if (this.levelData.shrine) {
      Renderer.drawShrine(ctx, this.levelData.shrine.x, this.levelData.shrine.y, this.abilities.tideDash, this.animTime);
    }

    // 5. Render NPCs
    for (const npc of this.levelData.npcs || []) {
      if (npc.avatar === 'coralia_diver') {
        Renderer.drawCoralia(ctx, npc.x, npc.y, { animTime: this.animTime });
      } else if (npc.avatar === 'barnaby_navigator') {
        Renderer.drawBarnaby(ctx, npc.x, npc.y, { animTime: this.animTime });
      } else if (npc.avatar === 'ancient_beacon_keeper') {
        Renderer.drawBeaconKeeper(ctx, npc.x, npc.y, { animTime: this.animTime });
      }

      // Diegetic prompt
      if (Math.hypot(this.player.x - npc.x, this.player.y - (npc.y - 15)) < 45) {
        ctx.fillStyle = '#FFD166';
        ctx.font = "bold 11px 'Fredoka', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText('[E] Talk', npc.x, npc.y - 38 + Math.sin(this.animTime * 4) * 2);
      }
    }

    // 6. Render Collectibles
    for (const pearl of this.levelData.sunPearls || []) {
      if (!this.sunPearlsCollected.has(pearl.id)) {
        Renderer.drawSunPearl(ctx, pearl.x, pearl.y, this.animTime);
      }
    }
    for (const shell of this.levelData.nautilusShells || []) {
      if (!this.nautilusShellsCollected.has(shell.id)) {
        Renderer.drawNautilusShell(ctx, shell.x, shell.y, this.animTime);
      }
    }
    if (this.levelData.secretMedallion && !this.medallionsCollected.has(this.levelData.secretMedallion.id)) {
      Renderer.drawLoreMedallion(ctx, this.levelData.secretMedallion.x, this.levelData.secretMedallion.y, this.animTime);
    }

    // 7. Render Enemies
    for (const enemy of this.enemies) {
      if (enemy.health <= 0) continue;
      if (enemy.type === 'patrol_walker') {
        Renderer.drawHermitScuttler(ctx, enemy.x, enemy.y, { facing: enemy.direction, animTime: this.animTime });
      } else if (enemy.type === 'rhythmic_hopper') {
        Renderer.drawSpinyUrchin(ctx, enemy.x, enemy.y, { phase: enemy.state === 'HOPPING' ? 'hopping' : 'idle', animTime: this.animTime });
      } else if (enemy.type === 'sine_flyer') {
        Renderer.drawBubbleRay(ctx, enemy.x, enemy.y, { facing: enemy.direction, animTime: this.animTime });
      } else if (enemy.type === 'proximity_charger') {
        Renderer.drawCoralCrab(ctx, enemy.x, enemy.y, {
          facing: enemy.direction,
          isCharging: enemy.state === 'CHARGE',
          isDazed: enemy.state === 'DAZED',
          animTime: this.animTime
        });
      }
    }

    // 8. Render Boss if active
    if (this.boss && this.boss.hp > 0) {
      Renderer.drawTideGolem(ctx, this.boss.x, this.boss.y, {
        hp: this.boss.hp,
        facing: this.boss.facing,
        stateName: this.boss.state,
        animTime: this.animTime
      });

      // Boss waves
      for (const w of this.boss.waves) {
        ctx.fillStyle = '#00F5D4';
        ctx.beginPath();
        ctx.arc(w.x, w.y - 6, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Boss boulders
      for (const b of this.boss.boulders) {
        ctx.fillStyle = '#E76F51';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 9. Render Player with Squash & Stretch
    Renderer.drawCori(ctx, this.player.x, this.player.y, {
      vx: this.player.vx,
      vy: this.player.vy,
      facing: this.player.facing,
      isGrounded: this.player.isGrounded,
      isDashing: this.player.isDashing,
      isHurt: this.player.invulnTimer > 0,
      scaleX: this.player.scaleX,
      scaleY: this.player.scaleY,
      animTime: this.animTime
    });

    // 10. Render World Particles & Juice
    this.particles.render(ctx);
    this.juice.renderWorld(ctx);

    this.renderer.endWorldFrame(this.camera);

    // --- Screen Space HUD ---
    this.renderHUD(ctx);

    // Render Dialogue Modal
    if (this.dialogue.active) {
      this.dialogue.render(ctx, (c, avatar, ax, ay, size) => {
        if (avatar === 'coralia_diver') Renderer.drawCoralia(c, ax, ay + 12, { animTime: this.animTime });
        else if (avatar === 'barnaby_navigator') Renderer.drawBarnaby(c, ax, ay + 12, { animTime: this.animTime });
        else if (avatar === 'ancient_beacon_keeper') Renderer.drawBeaconKeeper(c, ax, ay + 12, { animTime: this.animTime });
      });
    }

    // Screen Flashes
    this.juice.renderScreen(ctx, 720, 450);

    this.renderer.endFrame();
  }

  renderBiomeBackground(ctx) {
    const biome = this.levelData ? this.levelData.biome : 'tropical_beach';
    const camX = this.camera.x;

    if (biome === 'tropical_beach') {
      const grad = ctx.createLinearGradient(0, 0, 0, 450);
      grad.addColorStop(0, '#56B4D3');
      grad.addColorStop(1, '#E4F5FC');
      ctx.fillStyle = grad;
      ctx.fillRect(camX - 20, 0, 760, 450);

      // Distant Islands
      ctx.fillStyle = 'rgba(42, 157, 143, 0.35)';
      ctx.beginPath();
      ctx.arc(camX * 0.2 + 200, 360, 160, Math.PI, 0);
      ctx.arc(camX * 0.2 + 500, 370, 200, Math.PI, 0);
      ctx.fill();
    } else if (biome === 'sunken_ruins') {
      const grad = ctx.createLinearGradient(0, 0, 0, 900);
      grad.addColorStop(0, '#1E3A34');
      grad.addColorStop(1, '#112421');
      ctx.fillStyle = grad;
      ctx.fillRect(camX - 20, 0, 760, 900);
    } else if (biome === 'bioluminescent_grotto') {
      const grad = ctx.createLinearGradient(0, 0, 0, 675);
      grad.addColorStop(0, '#0B092B');
      grad.addColorStop(1, '#0D1B2A');
      ctx.fillStyle = grad;
      ctx.fillRect(camX - 20, 0, 760, 675);
    } else if (biome === 'tempest_cliffs') {
      const grad = ctx.createLinearGradient(0, 0, 0, 450);
      grad.addColorStop(0, '#1D3557');
      grad.addColorStop(1, '#0077B6');
      ctx.fillStyle = grad;
      ctx.fillRect(camX - 20, 0, 760, 450);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, 450);
      grad.addColorStop(0, '#03045E');
      grad.addColorStop(1, '#240046');
      ctx.fillStyle = grad;
      ctx.fillRect(camX - 20, 0, 760, 450);
    }
  }

  renderTile(ctx, x, y, w, h, biome) {
    if (biome === 'tropical_beach') {
      ctx.fillStyle = '#FCEADE';
      ctx.fillRect(x, y, w, 6);
      const sandGrad = ctx.createLinearGradient(x, y, x, y + h);
      sandGrad.addColorStop(0, '#F4A261');
      sandGrad.addColorStop(1, '#E76F51');
      ctx.fillStyle = sandGrad;
      ctx.fillRect(x, y + 6, w, h - 6);
      ctx.strokeStyle = '#264653';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);
    } else if (biome === 'sunken_ruins') {
      ctx.fillStyle = '#264653';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#43AA8B';
      ctx.fillRect(x, y, w, 5);
      ctx.strokeStyle = '#1D3557';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);
    } else if (biome === 'bioluminescent_grotto') {
      ctx.fillStyle = '#1B263B';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#00F5D4';
      ctx.fillRect(x, y, w, 4);
      ctx.strokeStyle = '#0D1B2A';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);
    } else if (biome === 'tempest_cliffs') {
      ctx.fillStyle = '#3D5A80';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#52B788';
      ctx.fillRect(x, y, w, 4);
      ctx.strokeStyle = '#293241';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);
    } else {
      ctx.fillStyle = '#FDFFFC';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#FFD166';
      ctx.fillRect(x, y, w, 4);
      ctx.strokeStyle = '#264653';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);
    }
  }

  renderHUD(ctx) {
    // 1. Health Hearts (Top-Left)
    for (let i = 0; i < this.player.maxHealth; i++) {
      const isFull = i < this.player.health;
      Renderer.drawHUDHeart(ctx, 28 + i * 26, 24, isFull);
    }

    // 2. Sun Pearls Counter (Top-Center)
    Renderer.drawSunPearl(ctx, 310, 24, this.animTime);
    ctx.fillStyle = '#FDFFFC';
    ctx.font = "bold 16px 'Fredoka', sans-serif";
    ctx.textAlign = 'left';
    ctx.fillText(`${this.sunPearlsCollected.size} / 25`, 328, 29);

    // 3. Score & Level Name
    ctx.fillStyle = '#FFD166';
    ctx.font = "12px 'Nunito', sans-serif";
    ctx.fillText(`SCORE: ${this.score}`, 328, 44);

    // 4. Boss Health Bar (Area 5)
    if (this.boss && this.boss.hp > 0 && this.currentLevelIndex === 5) {
      const barW = 240;
      const barH = 14;
      const barX = (720 - barW) / 2;
      const barY = 415;

      ctx.fillStyle = 'rgba(10, 22, 16, 0.85)';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = '#264653';
      ctx.lineWidth = 2.0;
      ctx.strokeRect(barX, barY, barW, barH);

      const segmentW = (barW - 6) / 3;
      for (let i = 0; i < 3; i++) {
        if (i < this.boss.hp) {
          ctx.fillStyle = i === 0 ? '#FFD166' : '#00F5D4';
          ctx.fillRect(barX + 3 + i * segmentW, barY + 2, segmentW - 2, barH - 4);
        }
      }
    }

    // 5. Control Hints
    ctx.fillStyle = 'rgba(253, 255, 252, 0.45)';
    ctx.font = "10px 'Nunito', sans-serif";
    ctx.textAlign = 'right';
    ctx.fillText('[A/D] Move | [Space/W] Jump | [Shift/J/X] Dash | [E/Enter] Talk | [Esc/P] Pause', 705, 440);
    ctx.textAlign = 'left';
  }

  saveGameState() {
    if (this.isNoSave) return;
    const saveState = {
      version: 1,
      currentLevel: this.currentLevelIndex,
      lastCheckpointId: this.activeWaystone,
      playerHealth: this.player ? this.player.health : 3,
      score: this.score,
      deaths: this.deaths,
      playtimeSeconds: Math.floor(this.playtime),
      tideDashUnlocked: this.abilities.tideDash,
      sunPearlsCollected: Array.from(this.sunPearlsCollected),
      nautilusShellsCollected: Array.from(this.nautilusShellsCollected),
      medallionsCollected: Array.from(this.medallionsCollected),
      lighthousesLit: Array.from(this.lighthousesLit),
      bossDefeated: this.bossDefeated,
      audioMuted: this.playgama ? this.playgama.isMuted() : this.audio.isMuted,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem('tidebound_save_v1', JSON.stringify(saveState));
    } catch (e) {}

    if (this.playgama) {
      this.playgama.setData('tidebound_save_v1', saveState);
      this.playgama.setHighScore('main', this.score);
    }
  }

  saveSaveData() {
    this.saveGameState();
  }

  async loadSaveData() {
    if (this.isNoSave) return;
    try {
      let data = null;
      if (this.playgama) {
        data = await this.playgama.getData('tidebound_save_v1');
      }
      if (!data) {
        const raw = localStorage.getItem('tidebound_save_v1');
        if (raw) data = JSON.parse(raw);
      }
      if (data) {
        if (data.currentLevel) this.currentLevelIndex = data.currentLevel;
        if (data.score) this.score = data.score;
        if (data.deaths) this.deaths = data.deaths;
        if (data.tideDashUnlocked) {
          this.abilities.tideDash = true;
          this.abilities.dash = true;
          this.abilities.leafDash = true;
          this.hasLeafDash = true;
        }
        if (Array.isArray(data.sunPearlsCollected)) {
          this.sunPearlsCollected = new Set(data.sunPearlsCollected);
        }
        if (Array.isArray(data.nautilusShellsCollected)) {
          this.nautilusShellsCollected = new Set(data.nautilusShellsCollected);
        }
        if (Array.isArray(data.medallionsCollected)) {
          this.medallionsCollected = new Set(data.medallionsCollected);
        }
        if (Array.isArray(data.lighthousesLit)) {
          this.lighthousesLit = new Set(data.lighthousesLit);
        }
        if (data.bossDefeated) this.bossDefeated = true;
      }
    } catch (e) {}
  }

  loadSaveGame() {
    return this.loadSaveData();
  }
}

// Auto-bootstrap on DOMContentLoaded or immediate if complete
function bootstrap() {
  const canvas = document.getElementById('game-canvas');
  if (canvas) {
    new TideboundGame(canvas);
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
