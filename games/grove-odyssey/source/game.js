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
  DialogueBox
} from '../../../engine/index.js';

/**
 * ============================================================================
 * GROVE ODYSSEY — Complete 2D Exploratory Mini Metroidvania Game
 * Enhanced with Deep Juice, Particle Systems, Squash/Stretch Physics & Audio
 * ============================================================================
 */

// Zone Configuration & Theme Palettes (7 Interconnected Zones)
const ZONES = {
  heart_grove: {
    id: 'heart_grove',
    name: 'Heart Grove',
    type: 'hub',
    bounds: { minX: 0, maxX: 1440, minY: 0, maxY: 450 },
    skyTop: '#70A1FF',
    skyBottom: '#DDF3D8',
    terrainMain: '#4A3525',
    terrainTop: '#55B368',
    terrainAccent: '#88D49E',
    foliageMain: '#38A169',
    foliagePetal: '#FFB8C6',
    particleColor: '#FFB8C6',
    ambientGlow: 'rgba(254, 240, 138, 0.25)',
    darkMaskAlpha: 0.15
  },
  mossy_caverns: {
    id: 'mossy_caverns',
    name: 'Mossy Caverns',
    type: 'subterranean',
    bounds: { minX: -1440, maxX: 0, minY: 0, maxY: 450 },
    skyTop: '#1A252C',
    skyBottom: '#163832',
    terrainMain: '#1F2937',
    terrainTop: '#2C4A3E',
    terrainAccent: '#00F5D4',
    particleColor: '#00F5D4',
    ambientGlow: 'rgba(0, 245, 212, 0.3)',
    darkMaskAlpha: 0.72
  },
  crystal_grotto: {
    id: 'crystal_grotto',
    name: 'Crystal Grotto',
    type: 'subterranean',
    bounds: { minX: 1440, maxX: 2880, minY: 0, maxY: 450 },
    skyTop: '#231942',
    skyBottom: '#38184C',
    terrainMain: '#2B2D42',
    terrainTop: '#4A4E69',
    terrainAccent: '#70D6FF',
    particleColor: '#70D6FF',
    ambientGlow: 'rgba(112, 214, 255, 0.35)',
    darkMaskAlpha: 0.68
  },
  sunlit_canopy: {
    id: 'sunlit_canopy',
    name: 'Sunlit Canopy',
    type: 'canopy',
    bounds: { minX: 0, maxX: 1440, minY: -900, maxY: 0 },
    skyTop: '#8ECAE6',
    skyBottom: '#FFB703',
    terrainMain: '#854D0E',
    terrainTop: '#38B000',
    terrainAccent: '#FB8500',
    particleColor: '#FFD166',
    ambientGlow: 'rgba(251, 133, 0, 0.25)',
    darkMaskAlpha: 0.12
  },
  sunken_roots: {
    id: 'sunken_roots',
    name: 'Forgotten Sunken Roots',
    type: 'subterranean',
    bounds: { minX: -720, maxX: 1440, minY: 450, maxY: 900 },
    skyTop: '#0F0E17',
    skyBottom: '#2E1C14',
    terrainMain: '#3F2B1D',
    terrainTop: '#28170D',
    terrainAccent: '#FF9F1C',
    particleColor: '#FF9F1C',
    ambientGlow: 'rgba(255, 159, 28, 0.28)',
    darkMaskAlpha: 0.82
  },
  windy_chasm: {
    id: 'windy_chasm',
    name: 'Windy Chasm',
    type: 'highlands',
    bounds: { minX: 1440, maxX: 2880, minY: -900, maxY: 0 },
    skyTop: '#BAC8D3',
    skyBottom: '#4A4E69',
    terrainMain: '#4B5563',
    terrainTop: '#A3B18A',
    terrainAccent: '#E0E1DD',
    particleColor: '#FFFFFF',
    ambientGlow: 'rgba(163, 177, 138, 0.2)',
    darkMaskAlpha: 0.2
  },
  secret_elder_shrine: {
    id: 'secret_elder_shrine',
    name: 'Secret Elder Shrine',
    type: 'vault',
    bounds: { minX: 1440, maxX: 2200, minY: 450, maxY: 900 },
    skyTop: '#140826',
    skyBottom: '#3A0CA3',
    terrainMain: '#2B2D42',
    terrainTop: '#E9ECEF',
    terrainAccent: '#FFD700',
    particleColor: '#FFD700',
    ambientGlow: 'rgba(255, 215, 0, 0.45)',
    darkMaskAlpha: 0.55
  }
};

/**
 * Enhanced Procedural Audio Synthesizer for Grove Odyssey
 * Features multi-layered synth harmonics, character speech chirps, and acoustic micro-interactions.
 */
class GroveAudioSynth extends ProceduralAudio {
  playJump() {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(640, t + 0.12);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(520, t);
    oscHarmonic.frequency.exponentialRampToValueAtTime(1280, t + 0.12);

    gain.gain.setValueAtTime(this.volume * 0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    oscHarmonic.start(t);
    osc.stop(t + 0.12);
    oscHarmonic.stop(t + 0.12);
  }

  playDoubleJump() {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [580, 780, 1040];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.03);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, t + idx * 0.03 + 0.14);

      gain.gain.setValueAtTime(this.volume * 0.28, t + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.03 + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.03);
      osc.stop(t + idx * 0.03 + 0.14);
    });
  }

  playLeafDash() {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    // Resonant bandpass filtered noise swoosh
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.22);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 4.0;
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(2800, t + 0.22);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.48, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    // Whistling wind sub-layer
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(740, t + 0.22);
    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(this.volume * 0.2, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.22);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  playWindGlideStart() {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.18);

    gain.gain.setValueAtTime(this.volume * 0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  playLandThud(impact = 0.5) {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.1);

    const targetGain = Math.min(0.4, this.volume * impact * 0.45);
    gain.gain.setValueAtTime(targetGain, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  playSporeBounce() {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(680, t + 0.09);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.25);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(440, t);
    subOsc.frequency.exponentialRampToValueAtTime(1360, t + 0.09);
    subOsc.frequency.exponentialRampToValueAtTime(640, t + 0.25);

    gain.gain.setValueAtTime(this.volume * 0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    subOsc.start(t);
    osc.stop(t + 0.25);
    subOsc.stop(t + 0.25);
  }

  playCrystalShatter() {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [1900, 1450, 980, 520];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.025);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + idx * 0.025 + 0.14);

      gain.gain.setValueAtTime(this.volume * 0.26, t + idx * 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.025 + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.025);
      osc.stop(t + idx * 0.025 + 0.14);
    });
  }

  playSunSeedCollect() {
    if (this.muted || !this.ctx) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.065;
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq * 2, t);

      gain.gain.setValueAtTime(this.volume * 0.32, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

      osc.connect(gain);
      subOsc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      subOsc.start(t);
      osc.stop(t + 0.24);
      subOsc.stop(t + 0.24);
    });
  }

  playWaystoneActivate() {
    if (this.muted || !this.ctx) return;
    this.init();
    const chords = [293.66, 369.99, 440.0, 587.33, 880.0]; // D major chord with octave
    chords.forEach((freq) => {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(this.volume * 0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.8);
    });
  }

  playShrineAwaken() {
    if (this.muted || !this.ctx) return;
    this.init();
    const arpeggio = [440.0, 554.37, 659.25, 880.0, 1108.73, 1318.51];
    arpeggio.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(this.volume * 0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  playGreatBloomFanfare() {
    if (this.muted || !this.ctx) return;
    this.init();
    const notes = [392.0, 523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98]; // G4, C5, E5, G5, C6, E6, G6
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.11;
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq * 0.5, t);

      gain.gain.setValueAtTime(this.volume * 0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

      osc.connect(gain);
      subOsc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      subOsc.start(t);
      osc.stop(t + 1.4);
      subOsc.stop(t + 1.4);
    });
  }

  playNPCChirp(avatar) {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (avatar === 'snail') {
      // Warm marimba tone with subtle pitch variation
      const basePitch = 190 + Math.random() * 40;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(basePitch, t);
      osc.frequency.exponentialRampToValueAtTime(basePitch + 35, t + 0.055);
      gain.gain.setValueAtTime(this.volume * 0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.055);
    } else if (avatar === 'hedgehog') {
      // Raspy percussive woodblock click
      const basePitch = 290 + Math.random() * 50;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(basePitch, t);
      osc.frequency.exponentialRampToValueAtTime(130, t + 0.045);
      gain.gain.setValueAtTime(this.volume * 0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.045);
    } else if (avatar === 'owl') {
      // Melodic pan-flute whistle
      const pitches = [580, 660, 740, 820];
      const p = pitches[Math.floor(Math.random() * pitches.length)];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p, t);
      osc.frequency.exponentialRampToValueAtTime(p + 110, t + 0.065);
      gain.gain.setValueAtTime(this.volume * 0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.065);
    } else {
      // Ethereal shrine chirp
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540 + Math.random() * 80, t);
      gain.gain.setValueAtTime(this.volume * 0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.045);
    }
  }

  playHit() {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.25);

    gain.gain.setValueAtTime(this.volume * 0.48, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  playAttack() {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.18);
    oscGain.gain.setValueAtTime(this.volume * 0.32, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    // Whistling wind sweep harmonic
    const oscHigh = this.ctx.createOscillator();
    const highGain = this.ctx.createGain();
    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(1400, t);
    oscHigh.frequency.exponentialRampToValueAtTime(480, t + 0.14);
    highGain.gain.setValueAtTime(this.volume * 0.18, t);
    highGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    oscHigh.connect(highGain);
    highGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.18);
    oscHigh.start(t);
    oscHigh.stop(t + 0.14);
  }

  playEnemyHit() {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.12);
    gain.gain.setValueAtTime(this.volume * 0.36, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    // Punchy snap transient
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'square';
    snapOsc.frequency.setValueAtTime(800, t);
    snapOsc.frequency.exponentialRampToValueAtTime(160, t + 0.04);
    snapGain.gain.setValueAtTime(this.volume * 0.22, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    snapOsc.connect(snapGain);
    snapGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
    snapOsc.start(t);
    snapOsc.stop(t + 0.04);
  }

  playEnemyDefeat() {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    const notes = [620, 220, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx === 1 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + idx * 0.04 + 0.16);
      gain.gain.setValueAtTime(this.volume * 0.35, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.16);
    });
  }

  playEssenceCollect() {
    if (this.muted || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    const notes = [783.99, 1046.5]; // G5 -> C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);
      gain.gain.setValueAtTime(this.volume * 0.28, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.14);
    });
  }

  playWaystoneHeal() {
    if (this.muted || !this.ctx) return;
    this.init();
    const chords = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
    chords.forEach((freq) => {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(this.volume * 0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 1.2);
    });
  }
}

/**
 * Main Grove Odyssey Game Engine Controller
 */
class GroveOdysseyGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.virtualWidth = 720;
    this.virtualHeight = 450;

    this.renderer = new CanvasRenderer(this.canvas, this.virtualWidth, this.virtualHeight);
    this.input = new InputManager(this.canvas);
    this.audio = new GroveAudioSynth();
    this.particles = new ParticleSystem(600); // 600 particles for high-density particle effects
    this.juice = new JuiceEffects();
    this.tweens = new TweenManager();
    this.camera = new Camera2D(this.virtualWidth, this.virtualHeight);
    this.playgama = new PlaygamaBridge();
    this.dialogueBox = new DialogueBox(this.virtualWidth, this.virtualHeight);
    this.dialogueCooldown = 0;

    // Lumi Player Physics & State with Squash/Stretch Micro-Interactions
    this.player = {
      x: 120,
      y: 360,
      vx: 0,
      vy: 0,
      width: 22,
      height: 28,
      facingDirection: 1,
      isGrounded: false,
      wasGrounded: false,
      previousVy: 0,
      state: 'IDLE', // IDLE, RUN, JUMP, DOUBLE_JUMP, WIND_GLIDE, LEAF_DASH, ATTACK, HURT
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      hasDoubleJump: false,
      hasAirDash: true,
      dashTimer: 0,
      dashCooldown: 0,
      dashDirection: 1,
      attackTimer: 0,
      attackCooldown: 0,
      iFrameTimer: 0,
      hearts: 3,
      maxHearts: 3,
      scaleX: 1.0,
      scaleY: 1.0,
      bodyTilt: 0,
      animTimer: 0,
      glideParticleTimer: 0,
      footstepTimer: 0,
      lastSafeX: 120,
      lastSafeY: 360,
      lastCheckpointId: 'waystone_1'
    };

    // Progression Abilities
    this.abilities = {
      featherJump: false,
      leafDash: false,
      windGlide: false
    };

    // Progression Sets
    this.collectedSeeds = new Set();
    this.totalSeeds = 8;
    this.activatedWaystones = new Set(['waystone_1']);
    this.brokenGates = new Set();
    this.secretsFound = new Set();
    this.hasCompletedGame = false;
    this.hasTriggeredBloomCutscene = false;
    this.gameTime = 0;

    // Dropped Spirit Essence Loot Orbs
    this.droppedEssences = [];

    // Active Zone Tracking & Banner
    this.currentZoneId = 'heart_grove';
    this.zoneBanner = {
      name: 'Heart Grove',
      timer: 3.0,
      alpha: 1.0
    };

    // Toast Notification Banner
    this.toast = {
      active: false,
      title: '',
      subtitle: '',
      color: '#FFD93D',
      timer: 0
    };

    // Active Ability Unlock Modal Card
    this.activeAbilityModal = null;

    // Great Bloom Victory Cutscene Animation State
    this.victoryState = {
      timer: 0,
      phase: 0,
      seedOrbitAngles: [0, 0.78, 1.57, 2.35, 3.14, 3.92, 4.71, 5.49],
      treeGlow: 0,
      statsShown: false
    };

    // Ambient Environmental Elements
    this.ambientMotes = [];
    this.initAmbientMotes();

    // Save Control Settings
    this.disableSave = false;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('reset') === '1' || urlParams.get('reset') === 'true') {
        localStorage.removeItem('grove_odyssey_save');
      }
      if (urlParams.get('nosave') === '1' || urlParams.get('nosave') === 'true') {
        this.disableSave = true;
      }
    } catch (e) {}

    // Setup World, Systems & State Machine
    this.fsm = new StateMachine();
    this.setupWorld();
    this.setupStateMachine();
    this.bindTouchControls();
    this.loadSaveGame();

    this.loop = new GameLoop({
      onUpdate: (dt) => this.update(dt),
      onRender: (alpha) => this.render(alpha)
    });
  }

  resetSaveGame() {
    try {
      localStorage.removeItem('grove_odyssey_save');
    } catch (e) {}
    window.location.reload();
  }

  async start() {
    try {
      await this.playgama.init();
    } catch (e) {}

    // Hook interactive HTML play button
    const playBtn = document.getElementById('btn-play-game');
    if (playBtn) {
      const onPlayClick = (e) => {
        if (e) e.stopPropagation();
        this.audio.init();
        this.audio.playButtonClick();
        this.fsm.transitionTo('PLAYING');
      };
      playBtn.addEventListener('click', onPlayClick);
      playBtn.addEventListener('pointerdown', onPlayClick);
    }

    // Hook interactive HTML reset save button
    const resetSaveBtn = document.getElementById('btn-reset-save');
    if (resetSaveBtn) {
      const onResetSaveClick = (e) => {
        if (e) e.stopPropagation();
        try {
          localStorage.removeItem('grove_odyssey_save');
        } catch (err) {}
        this.audio.init();
        this.audio.playButtonClick();
        resetSaveBtn.textContent = '✓ Save Reset!';
        setTimeout(() => {
          window.location.reload();
        }, 250);
      };
      resetSaveBtn.addEventListener('click', onResetSaveClick);
      resetSaveBtn.addEventListener('pointerdown', onResetSaveClick);
    }

    // Hook on-screen Audio Mute Button (Playgama UX Requirement)
    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) {
      const initialMuted = this.playgama.isMuted();
      this.audio.setMuted(initialMuted);
      muteBtn.textContent = initialMuted ? '🔇' : '🔊';

      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const muted = this.playgama.toggleMute();
        this.audio.setMuted(muted);
        muteBtn.textContent = muted ? '🔇' : '🔊';
        muteBtn.setAttribute('aria-label', muted ? 'Unmute Audio' : 'Mute Audio');
      });
    }

    // Hook Tab Visibility Handling (Playgama Audio/Game Lifecycle Requirement)
    this.playgama.onVisibilityChange((isVisible) => {
      if (!isVisible) {
        this.audio.pause();
        if (this.fsm.currentState === 'PLAYING') {
          this.fsm.transitionTo('PAUSED');
        }
      } else {
        this.audio.resume();
      }
    });

    // Ensure clicking anywhere on canvas/screen starts or dismisses modal
    const handleStartClick = () => {
      this.audio.init();
      if (this.fsm.currentState === 'TITLE') {
        this.audio.playButtonClick();
        this.fsm.transitionTo('PLAYING');
      } else if (this.fsm.currentState === 'PAUSED') {
        this.fsm.transitionTo('PLAYING');
      } else if (this.fsm.currentState === 'ABILITY_UNLOCKED') {
        this.audio.playButtonClick();
        this.activeAbilityModal = null;
        this.dialogueCooldown = 0.3;
        this.fsm.transitionTo('PLAYING');
      }
    };
    this.canvas.addEventListener('click', handleStartClick);
    this.canvas.addEventListener('pointerdown', handleStartClick);

    this.fsm.transitionTo('TITLE');
    this.loop.start();

    // Notify Playgama platform that loading is complete and game is ready for interaction
    this.playgama.sendGameReady();
  }

  bindTouchControls() {
    const bindBtn = (id, actionKey, isDirection = false) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.audio.init();
          if (isDirection) {
            this.input.actions[actionKey] = true;
          } else {
            this.input.triggerAction(actionKey);
            this.input.actions[actionKey] = true;
          }
        }, { passive: false });

        btn.addEventListener('touchend', (e) => {
          e.preventDefault();
          this.input.actions[actionKey] = false;
        }, { passive: false });
      }
    };

    bindBtn('btn-left', 'left', true);
    bindBtn('btn-right', 'right', true);
    bindBtn('btn-jump', 'up', false);
    bindBtn('btn-attack', 'attack', false);
    bindBtn('btn-dash', 'dash', false);
    bindBtn('btn-interact', 'action', false);
  }

  initAmbientMotes() {
    this.ambientMotes = [];
    for (let i = 0; i < 70; i++) {
      this.ambientMotes.push({
        x: MathUtils.randomRange(-1440, 2880),
        y: MathUtils.randomRange(-900, 900),
        radius: MathUtils.randomRange(1.5, 3.5),
        color: MathUtils.randomChoice(['#FFB8C6', '#00F5D4', '#70D6FF', '#FFD166', '#FF9F1C', '#FFFFFF']),
        vx: MathUtils.randomRange(-12, 12),
        vy: MathUtils.randomRange(-16, -4),
        alpha: MathUtils.randomRange(0.25, 0.75),
        pulseSpeed: MathUtils.randomRange(1.5, 4.0),
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  // =========================================================================
  // JUICE PARTICLE SYSTEM PRESETS
  // =========================================================================

  emitAttackSparks(x, y, dir) {
    this.particles.emit({
      x,
      y,
      count: 12,
      colors: ['#4ADE80', '#22C55E', '#FEF08A', '#FFFFFF'],
      speedMin: 60,
      speedMax: 160,
      angleMin: dir > 0 ? -Math.PI * 0.35 : Math.PI * 0.65,
      angleMax: dir > 0 ? Math.PI * 0.35 : Math.PI * 1.35,
      radiusMin: 2,
      radiusMax: 5,
      lifeMin: 0.2,
      lifeMax: 0.45,
      gravity: 20,
      shape: 'spark'
    });
  }

  emitLeafDashTrail(x, y, dir) {
    this.particles.emit({
      x: x - dir * 10,
      y: y + MathUtils.randomRange(-6, 6),
      count: 3,
      color: '#4ADE80',
      colors: ['#4ADE80', '#22C55E', '#86EFAC', '#16A34A', '#FFFFFF'],
      speedMin: 20,
      speedMax: 60,
      angleMin: dir > 0 ? Math.PI * 0.8 : -Math.PI * 0.2,
      angleMax: dir > 0 ? Math.PI * 1.2 : Math.PI * 0.2,
      radiusMin: 2,
      radiusMax: 4.5,
      lifeMin: 0.25,
      lifeMax: 0.45,
      gravity: -10,
      drag: 0.94
    });
  }

  emitLeafDashBurst(x, y, dir) {
    this.particles.emit({
      x,
      y,
      count: 16,
      colors: ['#4ADE80', '#22C55E', '#86EFAC', '#FFFFFF', '#A7F3D0'],
      speedMin: 80,
      speedMax: 190,
      angleMin: dir > 0 ? Math.PI * 0.7 : -Math.PI * 0.3,
      angleMax: dir > 0 ? Math.PI * 1.3 : Math.PI * 0.3,
      radiusMin: 3,
      radiusMax: 6,
      lifeMin: 0.3,
      lifeMax: 0.6,
      gravity: 0,
      drag: 0.92
    });
  }

  emitDoubleJumpFeathers(x, y) {
    this.particles.emit({
      x,
      y,
      count: 16,
      color: '#34D399',
      colors: ['#34D399', '#ECFDF5', '#10B981', '#A7F3D0', '#FFFFFF'],
      speedMin: 50,
      speedMax: 140,
      angleMin: Math.PI * 0.2,
      angleMax: Math.PI * 0.8,
      radiusMin: 2.5,
      radiusMax: 5.5,
      lifeMin: 0.35,
      lifeMax: 0.65,
      gravity: 80,
      shape: 'spark'
    });
  }

  emitDandelionDrift(x, y) {
    this.particles.emit({
      x: x + MathUtils.randomRange(-8, 8),
      y: y - 16,
      count: 2,
      color: '#FEF08A',
      colors: ['#FEF08A', '#FFFFFF', '#FDE047'],
      speedMin: 15,
      speedMax: 40,
      angleMin: -Math.PI * 0.8,
      angleMax: -Math.PI * 0.2,
      radiusMin: 1.8,
      radiusMax: 3.5,
      lifeMin: 0.5,
      lifeMax: 0.9,
      gravity: -20,
      drag: 0.96
    });
  }

  emitWaystoneHealing(x, y) {
    this.particles.emit({
      x,
      y,
      count: 22,
      color: '#22D3EE',
      colors: ['#22D3EE', '#67E8F9', '#A5F3FC', '#E0FAFF', '#FFFFFF'],
      speedMin: 40,
      speedMax: 130,
      radiusMin: 2.5,
      radiusMax: 5.5,
      lifeMin: 0.45,
      lifeMax: 0.85,
      gravity: -35,
      drag: 0.93,
      shape: 'spark'
    });
  }

  emitGreatTreeBloomConfetti(x, y, count = 28) {
    this.particles.emit({
      x,
      y,
      count,
      colors: ['#FFB8C6', '#FEF08A', '#34D399', '#70D6FF', '#F472B6', '#FFFFFF', '#FDE047'],
      speedMin: 80,
      speedMax: 240,
      radiusMin: 3,
      radiusMax: 7,
      lifeMin: 0.6,
      lifeMax: 1.2,
      gravity: 120,
      drag: 0.95,
      shape: 'star'
    });
  }

  emitLandingDust(x, y) {
    this.particles.emit({
      x: x - 6,
      y: y,
      count: 4,
      color: 'rgba(255, 255, 255, 0.65)',
      speedMin: 25,
      speedMax: 65,
      angleMin: Math.PI * 0.85,
      angleMax: Math.PI * 1.15,
      radiusMin: 2.5,
      radiusMax: 5.5,
      lifeMin: 0.2,
      lifeMax: 0.38,
      gravity: -10
    });
    this.particles.emit({
      x: x + 6,
      y: y,
      count: 4,
      color: 'rgba(255, 255, 255, 0.65)',
      speedMin: 25,
      speedMax: 65,
      angleMin: -Math.PI * 0.15,
      angleMax: Math.PI * 0.15,
      radiusMin: 2.5,
      radiusMax: 5.5,
      lifeMin: 0.2,
      lifeMax: 0.38,
      gravity: -10
    });
  }

  emitFootstepDust(x, y, dir) {
    this.particles.emit({
      x,
      y,
      count: 2,
      color: 'rgba(255, 255, 255, 0.55)',
      speedMin: 15,
      speedMax: 40,
      angleMin: dir > 0 ? Math.PI * 0.8 : -Math.PI * 0.2,
      angleMax: dir > 0 ? Math.PI * 1.1 : Math.PI * 0.1,
      radiusMin: 2,
      radiusMax: 4,
      lifeMin: 0.18,
      lifeMax: 0.32,
      gravity: -10
    });
  }

  emitDamageThorns(x, y) {
    this.particles.emit({
      x,
      y,
      count: 18,
      colors: ['#EF4444', '#DC2626', '#F97316', '#FFFFFF'],
      speedMin: 60,
      speedMax: 160,
      radiusMin: 2.5,
      radiusMax: 5,
      lifeMin: 0.3,
      lifeMax: 0.6,
      gravity: 120,
      shape: 'spark'
    });
  }

  emitCrystalShards(x, y, count = 28, baseColor = '#70D6FF') {
    this.particles.emit({
      x,
      y,
      count,
      colors: [baseColor, '#BE95C4', '#FFFFFF', '#00F0FF', '#E9ECEF'],
      speedMin: 90,
      speedMax: 220,
      radiusMin: 3.5,
      radiusMax: 7.5,
      lifeMin: 0.4,
      lifeMax: 0.8,
      gravity: 160,
      drag: 0.94,
      shape: 'star'
    });
  }

  // =========================================================================
  // WORLD SETUP (7 ZONES)
  // =========================================================================

  setupWorld() {
    // 1. Static & Semi-solid Platforms across all 7 Interconnected Zones
    this.platforms = [
      // =========================================================================
      // ZONE 1: HEART GROVE (x: 0..1440, y: 0..450) — Central Hub
      // =========================================================================
      { x: 0, y: 400, w: 1260, h: 50, zone: 'heart_grove' },
      { x: 1380, y: 400, w: 60, h: 50, zone: 'heart_grove' },
      { x: 1270, y: 430, w: 100, h: 18, zone: 'heart_grove' }, // Root descent steps to Sunken Roots
      { x: 180, y: 320, w: 120, h: 22, zone: 'heart_grove' },
      { x: 340, y: 260, w: 130, h: 22, zone: 'heart_grove' },
      { x: 520, y: 200, w: 140, h: 22, zone: 'heart_grove' },
      { x: 660, y: 140, w: 120, h: 22, zone: 'heart_grove' },
      { x: 420, y: 100, w: 120, h: 20, zone: 'heart_grove' },
      { x: 880, y: 110, w: 120, h: 20, zone: 'heart_grove' },
      { x: 1050, y: 230, w: 130, h: 22, zone: 'heart_grove' },
      { x: 1240, y: 320, w: 130, h: 22, zone: 'heart_grove' },

      // =========================================================================
      // ZONE 2: MOSSY CAVERNS (x: -1440..0, y: 0..450) — West Subterranean
      // =========================================================================
      { x: -1440, y: 400, w: 1360, h: 50, zone: 'mossy_caverns' },
      { x: -70, y: 430, w: 80, h: 18, zone: 'mossy_caverns' }, // Descent shaft to Sunken Roots
      { x: -1440, y: 0, w: 30, h: 450, zone: 'mossy_caverns' },
      { x: -1440, y: 0, w: 1440, h: 30, zone: 'mossy_caverns' },
      { x: -240, y: 300, w: 120, h: 20, zone: 'mossy_caverns' },
      { x: -440, y: 240, w: 120, h: 20, zone: 'mossy_caverns' },
      { x: -650, y: 190, w: 130, h: 20, zone: 'mossy_caverns' },
      { x: -880, y: 160, w: 130, h: 20, zone: 'mossy_caverns' },
      { x: -1100, y: 230, w: 120, h: 20, zone: 'mossy_caverns' },
      { x: -1340, y: 250, w: 160, h: 25, zone: 'mossy_caverns' },
      { x: -480, y: 110, w: 160, h: 20, zone: 'mossy_caverns' },
      { x: -580, y: 388, w: 140, h: 14, type: 'hazard', zone: 'mossy_caverns' },
      { x: -1000, y: 388, w: 140, h: 14, type: 'hazard', zone: 'mossy_caverns' },

      // =========================================================================
      // ZONE 3: CRYSTAL GROTTO (x: 1440..2880, y: 0..450) — East Subterranean
      // =========================================================================
      { x: 1440, y: 400, w: 560, h: 50, zone: 'crystal_grotto' }, // Stops at x:2000 for open drop passage
      { x: 2200, y: 400, w: 680, h: 50, zone: 'crystal_grotto' }, // Resumes at x:2200
      { x: 2850, y: 0, w: 30, h: 450, zone: 'crystal_grotto' },
      { x: 1440, y: 0, w: 1440, h: 30, zone: 'crystal_grotto' },
      { x: 1620, y: 310, w: 120, h: 20, zone: 'crystal_grotto' },
      { x: 1800, y: 240, w: 110, h: 20, zone: 'crystal_grotto' },
      { x: 1910, y: 170, w: 90, h: 20, zone: 'crystal_grotto' },
      { x: 2280, y: 310, w: 160, h: 22, zone: 'crystal_grotto' },
      { x: 2620, y: 370, w: 160, h: 30, zone: 'crystal_grotto' },
      { x: 1750, y: 388, w: 160, h: 14, type: 'hazard', zone: 'crystal_grotto' },
      { x: 2460, y: 388, w: 140, h: 14, type: 'hazard', zone: 'crystal_grotto' },

      // =========================================================================
      // ZONE 4: SUNLIT CANOPY (x: 0..1440, y: -900..0) — High North Boughs
      // =========================================================================
      { x: 0, y: -900, w: 30, h: 900, zone: 'sunlit_canopy' },
      { x: 80, y: -120, w: 160, h: 24, zone: 'sunlit_canopy' },
      { x: 300, y: -210, w: 180, h: 24, zone: 'sunlit_canopy' },
      { x: 420, y: -280, w: 160, h: 24, zone: 'sunlit_canopy' },
      { x: 160, y: -390, w: 140, h: 22, zone: 'sunlit_canopy' },
      { x: 360, y: -480, w: 160, h: 22, zone: 'sunlit_canopy' },
      { x: 620, y: -570, w: 160, h: 22, zone: 'sunlit_canopy' },
      { x: 380, y: -680, w: 140, h: 22, zone: 'sunlit_canopy' },
      { x: 580, y: -780, w: 140, h: 22, zone: 'sunlit_canopy' },
      { x: 1180, y: -740, w: 180, h: 24, zone: 'sunlit_canopy' },
      { x: 920, y: -620, w: 150, h: 22, zone: 'sunlit_canopy' },
      { x: 1120, y: -480, w: 150, h: 22, zone: 'sunlit_canopy' },
      { x: 920, y: -320, w: 160, h: 22, zone: 'sunlit_canopy' },
      { x: 1220, y: -160, w: 180, h: 24, zone: 'sunlit_canopy' },

      // =========================================================================
      // ZONE 5: FORGOTTEN SUNKEN ROOTS (x: -720..1440, y: 450..900) — Deep South
      // =========================================================================
      { x: -720, y: 860, w: 2160, h: 50, zone: 'sunken_roots' },
      { x: -720, y: 450, w: 30, h: 450, zone: 'sunken_roots' },
      { x: -560, y: 770, w: 130, h: 22, zone: 'sunken_roots' },
      { x: -380, y: 740, w: 120, h: 22, zone: 'sunken_roots' },
      { x: -180, y: 680, w: 140, h: 22, zone: 'sunken_roots' },
      { x: 60, y: 720, w: 130, h: 22, zone: 'sunken_roots' },
      { x: 280, y: 660, w: 140, h: 22, zone: 'sunken_roots' },
      { x: 500, y: 730, w: 140, h: 22, zone: 'sunken_roots' },
      { x: 740, y: 680, w: 150, h: 22, zone: 'sunken_roots' },
      { x: 1020, y: 740, w: 160, h: 22, zone: 'sunken_roots' },
      { x: 1280, y: 800, w: 140, h: 22, zone: 'sunken_roots' },
      { x: -650, y: 848, w: 240, h: 14, type: 'hazard', zone: 'sunken_roots' },
      { x: -60, y: 848, w: 300, h: 14, type: 'hazard', zone: 'sunken_roots' },
      { x: 640, y: 848, w: 340, h: 14, type: 'hazard', zone: 'sunken_roots' },

      // =========================================================================
      // ZONE 6: WINDY CHASM (x: 1440..2880, y: -900..0) — High North-East
      // =========================================================================
      { x: 2850, y: -900, w: 30, h: 900, zone: 'windy_chasm' },
      { x: 1520, y: -80, w: 160, h: 24, zone: 'windy_chasm' },
      { x: 1800, y: -190, w: 120, h: 22, zone: 'windy_chasm' },
      { x: 2100, y: -300, w: 110, h: 22, zone: 'windy_chasm' },
      { x: 2380, y: -420, w: 120, h: 22, zone: 'windy_chasm' },
      { x: 2060, y: -540, w: 130, h: 22, zone: 'windy_chasm' },
      { x: 1780, y: -640, w: 130, h: 22, zone: 'windy_chasm' },
      { x: 2140, y: -720, w: 120, h: 22, zone: 'windy_chasm' },
      { x: 2560, y: -650, w: 180, h: 24, zone: 'windy_chasm' },

      // =========================================================================
      // ZONE 7: SECRET ELDER SHRINE (x: 1440..2200, y: 450..900) — Mythic Vault
      // =========================================================================
      { x: 1440, y: 860, w: 760, h: 50, zone: 'secret_elder_shrine' },
      { x: 2200, y: 400, w: 30, h: 500, zone: 'secret_elder_shrine' },
      { x: 1440, y: 450, w: 560, h: 30, zone: 'secret_elder_shrine' }, // Ceiling covers x:1440..2000
      { x: 1840, y: 550, w: 160, h: 24, zone: 'secret_elder_shrine' }, // Ruin Step 1 (Adjacent to chute at x:2000)
      { x: 1680, y: 650, w: 160, h: 24, zone: 'secret_elder_shrine' }, // Ruin Step 2 (Middle, near Sun Seed #8)
      { x: 1520, y: 750, w: 160, h: 24, zone: 'secret_elder_shrine' }  // Ruin Step 3 (Left above floor)
    ];

    // 2. Bouncy Spore Mushrooms (Mushroom jump pads)
    this.sporeMushrooms = [
      { x: -100, y: 385, radius: 24, bounceForce: 580, zone: 'mossy_caverns', squish: 1.0 },
      { x: -740, y: 385, radius: 24, bounceForce: 600, zone: 'mossy_caverns', squish: 1.0 },
      { x: 2080, y: 845, radius: 24, bounceForce: 1020, zone: 'secret_elder_shrine', squish: 1.0 }
    ];

    // 3. Thermal Updraft Columns in Windy Chasm
    this.updrafts = [
      { x: 1940, y: -800, width: 90, height: 750, liftSpeed: -380, zone: 'windy_chasm' },
      { x: 2240, y: -800, width: 90, height: 750, liftSpeed: -380, zone: 'windy_chasm' },
      { x: 2480, y: -800, width: 80, height: 750, liftSpeed: -380, zone: 'windy_chasm' }
    ];

    // 4. Ability Gates & Destructible Barriers
    this.gates = [
      {
        id: 'gate_crystal_wall',
        zone: 'crystal_grotto',
        x: 2160,
        y: 220,
        width: 28,
        height: 180,
        requiredAbility: 'leafDash',
        name: 'Brittle Quartz Wall',
        color: '#BE95C4',
        isOpen: false
      },
      {
        id: 'gate_thorn_barricade',
        zone: 'sunken_roots',
        x: -20,
        y: 600,
        width: 32,
        height: 180,
        requiredAbility: 'leafDash',
        name: 'Thorn Briar Barricade',
        color: '#EF4444',
        isOpen: false
      },
      {
        id: 'gate_false_root_wall',
        zone: 'crystal_grotto',
        x: 2000,
        y: 350,
        width: 200,
        height: 80,
        requiredAbility: 'leafDash',
        name: 'Illusory Root Wall',
        color: '#57606F',
        isSecret: true,
        isOpen: false
      }
    ];

    // 5. Ability Shrines
    this.shrines = [
      {
        id: 'feather_jump',
        name: 'Feather Jump Shrine',
        abilityKey: 'featherJump',
        zone: 'mossy_caverns',
        x: -1260,
        y: 220,
        color: '#34D399',
        activated: false,
        dialog: "You touch the ancient glowing Feather Shrine... A rush of celestial wings enters your spirit!\n[Feather Jump Unlocked — Press Jump mid-air to Double Jump!]"
      },
      {
        id: 'leaf_dash',
        name: 'Leaf Dash Shrine',
        abilityKey: 'leafDash',
        zone: 'crystal_grotto',
        x: 2700,
        y: 340,
        color: '#38BDF8',
        activated: false,
        dialog: "You awaken the Leaf Dash Shrine... Piercing emerald gale currents surge through you!\n[Leaf Dash Unlocked — Press Shift / J / X to burst through barriers & evade hazards!]"
      },
      {
        id: 'wind_glide',
        name: 'Wind Glide Shrine',
        abilityKey: 'windGlide',
        zone: 'sunlit_canopy',
        x: 1260,
        y: -780,
        color: '#FACC15',
        activated: false,
        dialog: "You ascend to the sacred Wind Glide Shrine... Dandelion whispers wrap around your soul!\n[Wind Glide Unlocked — Hold Jump while falling to deploy your parachute & ride updrafts!]"
      }
    ];

    // 6. Ancient Waystone Checkpoints (3 Total)
    this.checkpoints = [
      {
        id: 'waystone_1',
        name: 'Heart Tree Waystone',
        zone: 'heart_grove',
        x: 120,
        y: 360,
        activated: true,
        pulseTime: 0
      },
      {
        id: 'waystone_2',
        name: 'Luminescent Waystone',
        zone: 'crystal_grotto',
        x: 1600,
        y: 360,
        activated: false,
        pulseTime: 0
      },
      {
        id: 'waystone_3',
        name: 'Zephyr Waystone',
        zone: 'windy_chasm',
        x: 1600,
        y: -120,
        activated: false,
        pulseTime: 0
      }
    ];

    // 7. Ancient Sun Seeds (8 Total)
    this.seeds = [
      {
        id: 'seed_1',
        number: 1,
        name: 'Sprout Seed of the Grove',
        zone: 'heart_grove',
        x: 720,
        y: 110,
        color: '#FFD93D',
        hint: 'High atop the elder root bough in Heart Grove'
      },
      {
        id: 'seed_2',
        number: 2,
        name: 'Spore Seed of Caverns',
        zone: 'mossy_caverns',
        x: -400,
        y: 90,
        color: '#2ED573',
        hint: 'High ceiling chamber requiring Feather Jump in Mossy Caverns'
      },
      {
        id: 'seed_3',
        number: 3,
        name: 'Glimmer Seed of Quartz',
        zone: 'crystal_grotto',
        x: 1950,
        y: 140,
        color: '#D980FA',
        hint: 'Stalactite ledge hopping over crystal spike pits'
      },
      {
        id: 'seed_4',
        number: 4,
        name: 'Prism Seed of the Vault',
        zone: 'crystal_grotto',
        x: 2350,
        y: 280,
        color: '#70D6FF',
        hint: 'Sealed behind the brittle quartz wall in Crystal Grotto'
      },
      {
        id: 'seed_5',
        number: 5,
        name: 'Solar Seed of Canopy',
        zone: 'sunlit_canopy',
        x: 640,
        y: -820,
        color: '#FFA502',
        hint: 'Apex of the highest cedar bough in Sunlit Canopy'
      },
      {
        id: 'seed_6',
        number: 6,
        name: 'Deep Seed of Ancient Roots',
        zone: 'sunken_roots',
        x: -350,
        y: 720,
        color: '#20BF6B',
        hint: 'Deep underground thorn corridor in Forgotten Sunken Roots'
      },
      {
        id: 'seed_7',
        number: 7,
        name: 'Zephyr Seed of the Chasm',
        zone: 'windy_chasm',
        x: 2640,
        y: -680,
        color: '#2BCBBA',
        hint: 'Suspended high over the yawning abyss in Windy Chasm'
      },
      {
        id: 'seed_8',
        number: 8,
        name: 'Dawn Seed of the Elder',
        zone: 'secret_elder_shrine',
        x: 1650,
        y: 710,
        color: '#FFFFFF',
        hint: 'Hidden mythic vault past the illusory root wall'
      }
    ];

    // 8. Interactive Woodland NPCs (3 Total)
    this.npcs = [
      {
        id: 'barnaby_snail',
        name: 'Barnaby the Snail',
        avatar: 'snail',
        zone: 'heart_grove',
        x: 240,
        y: 382,
        dialogIndex: 0,
        getDialogue: () => {
          if (this.collectedSeeds.size >= 8) {
            return "Look at you! All eight Ancient Sun Seeds are singing in harmony!\nOffer them to the Great Elder Tree's heart, and let our forest bloom once more!";
          }
          if (this.collectedSeeds.size >= 3) {
            return "I can feel the soil warming up already! You are doing wonderfully, little spirit.\nHave you looked up toward the high Canopy? Pip the Owl loves watching the highland gales from up there.";
          }
          return "Ah, wake up, little Lumi... The Great Elder Tree has grown terribly cold and dark.\nA twilight tempest swept through our grove and scattered the eight Ancient Sun Seeds far and wide.\nTake heart! Journey west into the Mossy Caverns first. Old Bramble might know where the ancient Feather Shrine rests.";
        }
      },
      {
        id: 'bramble_hedgehog',
        name: 'Bramble the Hedgehog',
        avatar: 'hedgehog',
        zone: 'mossy_caverns',
        x: -260,
        y: 382,
        dialogIndex: 0,
        getDialogue: () => {
          if (this.abilities.featherJump) {
            return "Bah! Look at you, fluttering around like a moth!\nJust don't knock down my stalactites with that double jump.";
          }
          return "Hmph! Watch your step, glowing sprout! You're kicking up spore dust all over my shiny crystals.\nLooking for the Feather Shrine? It's deeper in the cavern, past those bouncy mushroom caps.\nIf you run into brittle crystal walls, don't bang your head on 'em. You'll need the Dash power from the Grotto for that!";
        }
      },
      {
        id: 'pip_owl',
        name: 'Pip the Owl',
        avatar: 'owl',
        zone: 'sunlit_canopy',
        x: 480,
        y: -302,
        dialogIndex: 0,
        getDialogue: () => {
          if (this.abilities.windGlide) {
            return "The oldest roots remember what stone forgets...\nSeek the wall where crystal water meets silent root, and dash without fear.";
          }
          return "Hoo-hoo... Greetings, spirit of the dawn. The wind whispers tales of your courage.\nBeyond our boughs lies the roaring Windy Chasm. Without the Wind Glide ability, the abyss will claim any leap.\nSeek the dandelion shrine at the canopy's highest peak, and let the gentle updrafts be your wings.";
        }
      }
    ];

    // 9. Dynamic Woodland Enemies (3 Types with Combat Stats & Hurtboxes)
    this.enemies = [
      // Bramble Slimes (Mossy Caverns & Sunken Roots) - 2 HP
      {
        id: 'slime_1',
        type: 'bramble_slime',
        zone: 'mossy_caverns',
        x: -440,
        y: 385,
        width: 24,
        height: 20,
        health: 2,
        maxHealth: 2,
        damage: 1,
        minX: -520,
        maxX: -360,
        speed: 70,
        direction: 1,
        age: 0,
        hopTimer: 2.0,
        squish: 1.0,
        vx: 0,
        vy: 0,
        isGrounded: true,
        invulnTimer: 0,
        isDead: false,
        active: true
      },
      {
        id: 'slime_2',
        type: 'bramble_slime',
        zone: 'mossy_caverns',
        x: -860,
        y: 155,
        width: 24,
        height: 20,
        health: 2,
        maxHealth: 2,
        damage: 1,
        minX: -920,
        maxX: -800,
        speed: 70,
        direction: 1,
        age: 0.5,
        hopTimer: 2.5,
        squish: 1.0,
        vx: 0,
        vy: 0,
        isGrounded: true,
        invulnTimer: 0,
        isDead: false,
        active: true
      },
      {
        id: 'slime_3',
        type: 'bramble_slime',
        zone: 'sunken_roots',
        x: 280,
        y: 645,
        width: 24,
        height: 20,
        health: 2,
        maxHealth: 2,
        damage: 1,
        minX: 220,
        maxX: 340,
        speed: 70,
        direction: -1,
        age: 1.2,
        hopTimer: 2.2,
        squish: 1.0,
        vx: 0,
        vy: 0,
        isGrounded: true,
        invulnTimer: 0,
        isDead: false,
        active: true
      },

      // Shadow Wisps (Sunlit Canopy & Windy Chasm) - 3 HP
      {
        id: 'wisp_1',
        type: 'shadow_wisp',
        zone: 'sunlit_canopy',
        x: 260,
        y: -350,
        baseY: -350,
        width: 22,
        height: 22,
        health: 3,
        maxHealth: 3,
        damage: 1,
        minX: 180,
        maxX: 340,
        speed: 45,
        direction: 1,
        age: 0,
        vx: 0,
        vy: 0,
        invulnTimer: 0,
        isDead: false,
        active: true
      },
      {
        id: 'wisp_2',
        type: 'shadow_wisp',
        zone: 'sunlit_canopy',
        x: 740,
        y: -650,
        baseY: -650,
        width: 22,
        height: 22,
        health: 3,
        maxHealth: 3,
        damage: 1,
        minX: 660,
        maxX: 820,
        speed: 45,
        direction: -1,
        age: 1.0,
        vx: 0,
        vy: 0,
        invulnTimer: 0,
        isDead: false,
        active: true
      },
      {
        id: 'wisp_3',
        type: 'shadow_wisp',
        zone: 'windy_chasm',
        x: 1880,
        y: -360,
        baseY: -360,
        width: 22,
        height: 22,
        health: 3,
        maxHealth: 3,
        damage: 1,
        minX: 1780,
        maxX: 1980,
        speed: 55,
        direction: 1,
        age: 0.7,
        vx: 0,
        vy: 0,
        invulnTimer: 0,
        isDead: false,
        active: true
      },
      {
        id: 'wisp_4',
        type: 'shadow_wisp',
        zone: 'windy_chasm',
        x: 2280,
        y: -580,
        baseY: -580,
        width: 22,
        height: 22,
        health: 3,
        maxHealth: 3,
        damage: 1,
        minX: 2180,
        maxX: 2380,
        speed: 55,
        direction: -1,
        age: 1.8,
        vx: 0,
        vy: 0,
        invulnTimer: 0,
        isDead: false,
        active: true
      },

      // Thorn Beetles (Crystal Grotto & Sunken Roots) - 4 HP
      {
        id: 'beetle_1',
        type: 'thorn_beetle',
        zone: 'crystal_grotto',
        x: 1820,
        y: 225,
        width: 30,
        height: 22,
        health: 4,
        maxHealth: 4,
        damage: 1,
        minX: 1760,
        maxX: 1880,
        speed: 40,
        direction: 1,
        age: 0,
        isCharging: false,
        chargeTimer: 0,
        cooldownTimer: 0,
        stunTimer: 0,
        isGrounded: true,
        vx: 0,
        vy: 0,
        invulnTimer: 0,
        isDead: false,
        active: true
      },
      {
        id: 'beetle_2',
        type: 'thorn_beetle',
        zone: 'crystal_grotto',
        x: 2540,
        y: 385,
        width: 30,
        height: 22,
        health: 4,
        maxHealth: 4,
        damage: 1,
        minX: 2460,
        maxX: 2620,
        speed: 40,
        direction: -1,
        age: 0.5,
        isCharging: false,
        chargeTimer: 0,
        cooldownTimer: 0,
        stunTimer: 0,
        isGrounded: true,
        vx: 0,
        vy: 0,
        invulnTimer: 0,
        isDead: false,
        active: true
      },
      {
        id: 'beetle_3',
        type: 'thorn_beetle',
        zone: 'sunken_roots',
        x: 780,
        y: 665,
        width: 30,
        height: 22,
        health: 4,
        maxHealth: 4,
        damage: 1,
        minX: 720,
        maxX: 860,
        speed: 40,
        direction: 1,
        age: 1.4,
        isCharging: false,
        chargeTimer: 0,
        cooldownTimer: 0,
        stunTimer: 0,
        isGrounded: true,
        vx: 0,
        vy: 0,
        invulnTimer: 0,
        isDead: false,
        active: true
      }
    ];
  }

  setupStateMachine() {
    this.fsm.addState('TITLE', {
      enter: () => {
        const overlay = document.getElementById('title-overlay');
        if (overlay) overlay.classList.remove('hidden');
      },
      update: () => {
        if (
          this.input.isJustPressed('up') ||
          this.input.isJustPressed('action') ||
          this.input.isJustPressed('dash') ||
          this.input.isJustPressed('left') ||
          this.input.isJustPressed('right') ||
          this.input.keys['Space'] ||
          this.input.keys['Enter'] ||
          this.input.keys['KeyE'] ||
          this.input.keys['KeyW']
        ) {
          this.audio.init();
          this.audio.playButtonClick();
          this.fsm.transitionTo('PLAYING');
        }
      },
      exit: () => {
        const overlay = document.getElementById('title-overlay');
        if (overlay) overlay.classList.add('hidden');
      }
    });

    this.fsm.addState('PLAYING', {
      enter: () => {
        const overlay = document.getElementById('title-overlay');
        if (overlay) overlay.classList.add('hidden');
        this.saveGameState();
      },
      update: (dt) => {
        this.gameTime += dt;
        this.updateGameplay(dt);
      }
    });

    this.fsm.addState('PAUSED', {
      enter: () => {},
      update: () => {
        if (this.input.keys['KeyR']) {
          this.input.keys['KeyR'] = false;
          this.resetSaveGame();
          return;
        }
        if (this.input.isJustPressed('action') || this.input.keys['Escape'] || this.input.keys['KeyP']) {
          this.input.keys['Escape'] = false;
          this.input.keys['KeyP'] = false;
          this.fsm.transitionTo('PLAYING');
        }
      }
    });

    this.fsm.addState('ABILITY_UNLOCKED', {
      enter: () => {
        this.saveGameState();
      },
      update: () => {
        if (
          this.input.isJustPressed('action') ||
          this.input.isJustPressed('up') ||
          this.input.isJustPressed('attack') ||
          this.input.keys['Space'] ||
          this.input.keys['Enter'] ||
          this.input.keys['Escape'] ||
          this.input.keys['KeyE']
        ) {
          this.input.keys['Escape'] = false;
          this.input.keys['Space'] = false;
          this.input.keys['Enter'] = false;
          this.input.keys['KeyE'] = false;
          this.activeAbilityModal = null;
          this.dialogueCooldown = 0.3;
          this.fsm.transitionTo('PLAYING');
        }
      }
    });

    this.fsm.addState('VICTORY_CUTSCENE', {
      enter: () => {
        this.victoryState.timer = 0;
        this.victoryState.phase = 0;
        this.victoryState.treeGlow = 0;
        this.victoryState.statsShown = false;
        this.hasCompletedGame = true;
        this.audio.playGreatBloomFanfare();
        this.juice.screenFlash('#FFD93D', 0.7);
        this.juice.screenShake(16);
        this.juice.spawnShockwave(240, 280, 140, '#FEF08A');
        this.saveGameState();
      },
      update: (dt) => {
        this.gameTime += dt;
        this.updateVictoryCutscene(dt);
      }
    });
  }

  // =========================================================================
  // GAMEPLAY LOGIC, PHYSICS & JUICE DYNAMICS
  // =========================================================================

  updateGameplay(dt) {
    if (this.dialogueCooldown > 0) {
      this.dialogueCooldown -= dt;
    }

    // 1. Dialogue Box Priority Update
    if (this.dialogueBox.active) {
      const interactPressed = this.input.isJustPressed('action') || this.input.isJustPressed('up');
      this.dialogueBox.update(dt, interactPressed);
      if (!this.dialogueBox.active) {
        this.dialogueCooldown = 0.25;
      }
      return; // Kinematics frozen while dialog is open
    }

    // 2. Pause Input
    if (this.input.keys['Escape'] || this.input.keys['KeyP']) {
      this.input.keys['Escape'] = false;
      this.input.keys['KeyP'] = false;
      this.fsm.transitionTo('PAUSED');
      return;
    }

    // 3. Zone Banner & Toast Timers
    if (this.zoneBanner.timer > 0) {
      this.zoneBanner.timer -= dt;
      this.zoneBanner.alpha = Math.min(1.0, this.zoneBanner.timer);
    }
    if (this.toast.active) {
      this.toast.timer -= dt;
      if (this.toast.timer <= 0) this.toast.active = false;
    }

    // 4. Player Timers & Cooldowns
    this.player.animTimer += dt;
    if (this.player.iFrameTimer > 0) this.player.iFrameTimer -= dt;
    if (this.player.dashCooldown > 0) this.player.dashCooldown -= dt;
    if (this.player.attackCooldown > 0) this.player.attackCooldown -= dt;

    const wasGrounded = this.player.isGrounded;
    const previousVy = this.player.vy;

    if (this.player.isGrounded) {
      this.player.coyoteTimer = 0.12;
      this.player.hasDoubleJump = this.abilities.featherJump;
      this.player.hasAirDash = true;
      this.player.lastSafeX = this.player.x;
      this.player.lastSafeY = this.player.y;
    } else {
      this.player.coyoteTimer -= dt;
    }

    if (this.input.isJustPressed('up')) {
      this.player.jumpBufferTimer = 0.12;
    } else {
      this.player.jumpBufferTimer -= dt;
    }

    // 5. Dropped Spirit Essence Collection & Bobbing
    for (let i = this.droppedEssences.length - 1; i >= 0; i--) {
      const ess = this.droppedEssences[i];
      ess.age += dt;
      ess.y += Math.sin(ess.age * 5) * 12 * dt;

      const dist = MathUtils.distance(this.player.x, this.player.y, ess.x, ess.y);
      if (dist < 32) {
        this.player.hearts = Math.min(this.player.maxHearts, this.player.hearts + 1);
        this.audio.playEssenceCollect();
        this.juice.spawnFloatingText('+1 HEAL', ess.x, ess.y - 12, {
          color: '#2ED573',
          stroke: '#0F172A',
          size: 16
        });
        this.particles.emit({
          x: ess.x,
          y: ess.y,
          count: 14,
          colors: ['#2ED573', '#A7F3D0', '#FFFFFF', '#10B981'],
          speedMin: 40,
          speedMax: 120,
          radiusMin: 2,
          radiusMax: 4.5,
          lifeMin: 0.25,
          lifeMax: 0.5,
          gravity: -20
        });
        this.droppedEssences.splice(i, 1);
      }
    }

    // 6. Leaf Dash Execution
    if (this.player.state === 'LEAF_DASH') {
      this.player.dashTimer -= dt;
      this.player.vx = this.player.dashDirection * 720;
      this.player.vy = 0; // zero gravity during dash

      // Trailing emerald leaf flurry particles
      this.emitLeafDashTrail(this.player.x, this.player.y, this.player.dashDirection);

      // Check Gate Smashing during dash (seamless, no velocity halt)
      this.checkGateSmash();

      if (this.player.dashTimer <= 0) {
        this.player.state = this.player.isGrounded ? 'IDLE' : 'FALL';
        this.player.vx *= 0.4;
      }
    }
    // 7. Player Attack Execution (Spirit Spark / Leaf Slash)
    else if (this.player.state === 'ATTACK') {
      this.player.attackTimer -= dt;
      this.checkPlayerAttack();

      if (this.player.attackTimer <= 0) {
        this.player.state = this.player.isGrounded ? (Math.abs(this.player.vx) > 10 ? 'RUN' : 'IDLE') : 'FALL';
      }
    } else {
      // 8. Initiate Leaf Dash (Max 1 Dash mid-air until touching solid ground)
      if (
        (this.input.isJustPressed('dash') || this.input.keys['ShiftLeft'] || this.input.keys['ShiftRight'] || this.input.keys['KeyJ']) &&
        this.abilities.leafDash &&
        this.player.dashCooldown <= 0 &&
        (this.player.isGrounded || this.player.hasAirDash)
      ) {
        if (!this.player.isGrounded) {
          this.player.hasAirDash = false;
        }
        this.player.state = 'LEAF_DASH';
        this.player.dashTimer = 0.22;
        this.player.dashCooldown = 0.45;
        this.player.dashDirection = this.player.facingDirection;
        this.player.iFrameTimer = Math.max(this.player.iFrameTimer, 0.25);
        this.player.scaleX = 1.45;
        this.player.scaleY = 0.65;
        this.audio.playLeafDash();
        this.juice.screenShake(6);
        this.emitLeafDashBurst(this.player.x, this.player.y, this.player.dashDirection);
      }
      // 9. Initiate Player Attack (Spirit Spark / Leaf Slash — Snappy & Directional)
      else if (
        (this.input.isJustPressed('attack') || this.input.keys['KeyK'] || this.input.keys['KeyX'] || this.input.keys['KeyC'] || this.input.keys['KeyZ']) &&
        this.player.attackCooldown <= 0 &&
        this.player.state !== 'LEAF_DASH'
      ) {
        this.player.state = 'ATTACK';
        this.player.attackTimer = 0.20;
        this.player.attackCooldown = 0.24;

        // Upward Slash if holding Up, otherwise horizontal Forward Slash
        this.player.isUpwardAttack = this.input.isDown('up');

        if (this.player.isGrounded && !this.player.isUpwardAttack) {
          this.player.vx = this.player.facingDirection * 120;
        }
        this.player.scaleX = 1.25;
        this.player.scaleY = 0.85;
        this.audio.playAttack();
        const sparkX = this.player.isUpwardAttack ? this.player.x : this.player.x + this.player.facingDirection * 20;
        const sparkY = this.player.isUpwardAttack ? this.player.y - 20 : this.player.y - 2;
        this.emitAttackSparks(sparkX, sparkY, this.player.facingDirection);
        this.checkPlayerAttack();
      } else {
        // 10. Horizontal Run & Steering
        const moveAxis = (this.input.isDown('right') ? 1 : 0) - (this.input.isDown('left') ? 1 : 0);
        if (moveAxis !== 0) this.player.facingDirection = moveAxis;

        const targetSpeed = this.player.state === 'WIND_GLIDE' ? 250 : 220;
        const accelRate = moveAxis !== 0 ? 1400 : 1800;

        if (moveAxis !== 0) {
          this.player.vx = MathUtils.approach(this.player.vx, moveAxis * targetSpeed, accelRate * dt);
          if (this.player.isGrounded) {
            this.player.state = 'RUN';
            // Subtle rhythmic running squash & stretch bob
            const runSquish = Math.sin(this.player.animTimer * 16) * 0.06;
            this.player.scaleX = 1.0 + runSquish;
            this.player.scaleY = 1.0 - runSquish;

            // Footstep dust micro-bursts
            this.player.footstepTimer += dt;
            if (this.player.footstepTimer >= 0.16) {
              this.player.footstepTimer = 0;
              this.emitFootstepDust(this.player.x - this.player.facingDirection * 6, this.player.y + 12, this.player.facingDirection);
            }
          }
        } else {
          this.player.vx = MathUtils.approach(this.player.vx, 0, accelRate * dt);
          if (this.player.isGrounded) {
            this.player.state = 'IDLE';
            this.player.footstepTimer = 0;
          }
        }

        // 11. Jump Triggers (Coyote & Buffering & Feather Jump)
        if (this.player.jumpBufferTimer > 0) {
          if (this.player.coyoteTimer > 0) {
            // Standard Ground Jump: Stretch & Dust Burst
            this.player.vy = -520;
            this.player.jumpBufferTimer = 0;
            this.player.coyoteTimer = 0;
            this.player.state = 'JUMP';
            this.player.scaleX = 0.72;
            this.player.scaleY = 1.38;
            this.audio.playJump();
            this.emitLandingDust(this.player.x, this.player.y + 12);
          } else if (this.player.hasDoubleJump && !this.player.isGrounded && this.abilities.featherJump) {
            // Feather Jump (Double Jump): Wing Aura, Stretch & Feathers Flurry
            this.player.vy = -480;
            this.player.hasDoubleJump = false;
            this.player.jumpBufferTimer = 0;
            this.player.state = 'DOUBLE_JUMP';
            this.player.scaleX = 0.68;
            this.player.scaleY = 1.45;
            this.audio.playDoubleJump();
            this.juice.screenShake(4.5);
            this.emitDoubleJumpFeathers(this.player.x, this.player.y + 8);
          }
        }

        // Variable Jump Cutoff
        if (!this.input.isDown('up') && this.player.vy < 0) {
          this.player.vy += 2400 * dt;
        }

        // 12. Wind Glide / Updraft Interaction
        let inUpdraft = false;
        if (this.currentZoneId === 'windy_chasm') {
          for (const updraft of this.updrafts) {
            if (
              this.player.x >= updraft.x &&
              this.player.x <= updraft.x + updraft.width &&
              this.player.y >= updraft.y &&
              this.player.y <= updraft.y + updraft.height
            ) {
              inUpdraft = true;
              break;
            }
          }
        }

        if (this.abilities.windGlide && this.input.isDown('up') && !this.player.isGrounded && (this.player.vy > 0 || inUpdraft)) {
          if (this.player.state !== 'WIND_GLIDE') {
            this.audio.playWindGlideStart();
            this.player.scaleX = 0.88;
            this.player.scaleY = 1.18;
          }
          this.player.state = 'WIND_GLIDE';
          this.player.glideParticleTimer += dt;
          if (this.player.glideParticleTimer > 0.08) {
            this.player.glideParticleTimer = 0;
            this.emitDandelionDrift(this.player.x, this.player.y - 12);
          }

          if (inUpdraft) {
            this.player.vy = MathUtils.approach(this.player.vy, -380, 1600 * dt);
          } else {
            this.player.vy = Math.min(this.player.vy, 105);
          }
        } else if (this.player.state === 'WIND_GLIDE') {
          this.player.state = 'FALL';
        }

        // Gravity
        if (this.player.state !== 'WIND_GLIDE') {
          this.player.vy = Math.min(this.player.vy + 1150 * dt, 620);
        }
      }
    }

    // Scale Return Ease towards natural 1.0 (Damped harmonic spring effect)
    this.player.scaleX = MathUtils.lerp(this.player.scaleX, 1.0, 0.16);
    this.player.scaleY = MathUtils.lerp(this.player.scaleY, 1.0, 0.16);

    // 13. Position Integration & Collisions (Dynamic Swept AABB)
    this.player.x += this.player.vx * dt;
    this.checkHorizontalCollisions();

    this.player.y += this.player.vy * dt;
    this.checkVerticalCollisions(dt);

    // Landing squash & dust impact detection
    if (!wasGrounded && this.player.isGrounded) {
      const impact = Math.min(1.0, Math.max(0.2, previousVy / 550));
      if (previousVy > 90) {
        this.player.scaleX = 1.0 + 0.42 * impact;
        this.player.scaleY = Math.max(0.58, 1.0 - 0.42 * impact);
        this.emitLandingDust(this.player.x, this.player.y + this.player.height / 2);
        if (previousVy > 260) {
          this.audio.playLandThud(impact);
          this.juice.screenShake(3.5 * impact);
        }
      }
    }

    // 14. Bouncy Spore Mushrooms
    this.checkSporeMushrooms();

    // 15. Enemy AI & Hazard Combat Checks
    this.updateEnemies(dt);

    // 16. Shrines, Checkpoints, Sun Seeds, NPCs & Great Tree Altar
    this.checkInteractiveEntities();

    // 17. Zone Boundary Transition Check
    this.updateCurrentZone();

    // 18. Camera Update (Smooth World Following across all 7 Connected Zones)
    this.camera.setBounds(-1440, 2880, -900, 900);
    this.camera.follow(this.player.x, this.player.y, dt);

    // 19. Ambient Motes
    this.updateAmbientMotes(dt);
  }

  checkHorizontalCollisions() {
    const halfW = this.player.width / 2;
    const halfH = this.player.height / 2;

    for (const plat of this.platforms) {
      if (plat.type === 'hazard') continue;
      if (
        this.player.x + halfW > plat.x &&
        this.player.x - halfW < plat.x + plat.w &&
        this.player.y + halfH > plat.y + 4 &&
        this.player.y - halfH < plat.y + plat.h - 4
      ) {
        if (this.player.vx > 0) {
          this.player.x = plat.x - halfW;
        } else if (this.player.vx < 0) {
          this.player.x = plat.x + plat.w + halfW;
        }
        this.player.vx = 0;
      }
    }

    // Gate Collisions (Seamless during leafDash to prevent 1-frame hitch - Fixes BUG-08)
    for (const gate of this.gates) {
      if (!gate.isOpen && !this.brokenGates.has(gate.id)) {
        if (this.player.state === 'LEAF_DASH' && gate.requiredAbility === 'leafDash') {
          continue; // Shatter is resolved seamlessly in checkGateSmash()
        }
        if (
          this.player.x + halfW > gate.x &&
          this.player.x - halfW < gate.x + gate.width &&
          this.player.y + halfH > gate.y + 4 &&
          this.player.y - halfH < gate.y + gate.height - 4
        ) {
          if (this.player.vx > 0) this.player.x = gate.x - halfW;
          else if (this.player.vx < 0) this.player.x = gate.x + gate.width + halfW;
          this.player.vx = 0;
        }
      }
    }
  }

  checkVerticalCollisions(dt = 0.0166) {
    const halfW = this.player.width / 2 - 2;
    const halfH = this.player.height / 2;
    this.player.isGrounded = false;

    // Dynamic delta lookahead preventing high-speed platform tunneling (Fixes BUG-06)
    const lookahead = Math.max(this.player.vy * dt, 4);

    // 1. Separate Hazard Detection Pass (Decoupled to preserve ground checks - Fixes BUG-07)
    for (const plat of this.platforms) {
      if (plat.type === 'hazard') {
        if (
          this.player.x + halfW > plat.x &&
          this.player.x - halfW < plat.x + plat.w &&
          this.player.y + halfH >= plat.y &&
          this.player.y - halfH <= plat.y + plat.h
        ) {
          this.damagePlayer(1, plat.x + plat.w / 2);
          // Do NOT return early; continue loop so safe adjacent platforms can ground player
        }
      }
    }

    // 2. Solid Platform Resolution Pass
    for (const plat of this.platforms) {
      if (plat.type === 'hazard') continue;

      if (
        this.player.x + halfW > plat.x &&
        this.player.x - halfW < plat.x + plat.w &&
        this.player.y + halfH >= plat.y &&
        this.player.y - halfH <= plat.y + plat.h
      ) {
        // Landing on platform (Falling Downward)
        if (this.player.vy >= 0 && this.player.y + halfH - lookahead <= plat.y + 12) {
          this.player.y = plat.y - halfH;
          this.player.vy = 0;
          this.player.isGrounded = true;
        }
        // Hitting ceiling with 4px Corner Rounding Nudge (Fixes BUG-09)
        else if (this.player.vy < 0 && this.player.y - halfH >= plat.y + plat.h - Math.abs(this.player.vy * dt) - 6 && this.player.y - halfH <= plat.y + plat.h + 8) {
          const distToLeftEdge = Math.abs((this.player.x + halfW) - plat.x);
          const distToRightEdge = Math.abs((this.player.x - halfW) - (plat.x + plat.w));

          if (distToLeftEdge <= 4) {
            this.player.x -= 4; // Nudge left around corner
          } else if (distToRightEdge <= 4) {
            this.player.x += 4; // Nudge right around corner
          } else {
            this.player.y = plat.y + plat.h + halfH;
            this.player.vy = 0;
          }
        }
      }
    }
  }

  checkSporeMushrooms() {
    for (const mush of this.sporeMushrooms) {
      const dist = MathUtils.distance(this.player.x, this.player.y + this.player.height / 2, mush.x, mush.y);
      if (dist < mush.radius + 10 && this.player.vy >= 0) {
        this.player.vy = -mush.bounceForce;
        this.player.hasDoubleJump = this.abilities.featherJump;
        this.player.scaleX = 0.58;
        this.player.scaleY = 1.52;
        mush.squish = 0.4;
        this.audio.playSporeBounce();
        this.juice.screenShake(6);
        this.juice.spawnShockwave(mush.x, mush.y - 8, 48, '#00F5D4');
        this.particles.emit({
          x: mush.x,
          y: mush.y - 8,
          count: 18,
          colors: ['#00F5D4', '#A7F3D0', '#FFFFFF', '#05B89A'],
          speedMin: 70,
          speedMax: 160,
          radiusMin: 3,
          radiusMax: 6,
          gravity: 40
        });
      }
      mush.squish = MathUtils.lerp(mush.squish, 1.0, 0.12);
    }
  }

  checkGateSmash() {
    const isDashing = this.player.state === 'LEAF_DASH';
    for (const gate of this.gates) {
      if (!gate.isOpen && !this.brokenGates.has(gate.id)) {
        const halfW = this.player.width / 2 + (isDashing ? 18 : 10);
        const halfH = this.player.height / 2;
        if (
          this.player.x + halfW > gate.x &&
          this.player.x - halfW < gate.x + gate.width &&
          this.player.y + halfH > gate.y &&
          this.player.y - halfH < gate.y + gate.height
        ) {
          if (isDashing && gate.requiredAbility === 'leafDash') {
            gate.isOpen = true;
            this.brokenGates.add(gate.id);
            this.audio.playCrystalShatter();
            this.juice.screenShake(14);
            this.juice.screenFlash(gate.color, 0.48);
            this.juice.spawnShockwave(gate.x + gate.width / 2, gate.y + gate.height / 2, 85, gate.color);

            // Maintain full dash momentum without 1-frame freeze (Fixes BUG-08)
            this.player.vx = this.player.dashDirection * 720;

            if (gate.isSecret) {
              this.secretsFound.add(gate.id);
              this.juice.spawnFloatingText('✦ SECRET PASSAGE OPENED! ✦', gate.x + gate.width / 2, gate.y - 20, {
                color: '#FFD700',
                stroke: '#1E1B4B',
                size: 18
              });
              this.showToast('SECRET DISCOVERED!', 'The ancient passage to the Elder Shrine opens!');
            } else {
              this.juice.spawnFloatingText('✦ BARRIER SHATTERED! ✦', gate.x + gate.width / 2, gate.y - 20, {
                color: gate.color,
                stroke: '#1E1B4B',
                size: 18
              });
              this.showToast('BARRIER SHATTERED!', gate.name);
            }

            this.emitCrystalShards(gate.x + gate.width / 2, gate.y + gate.height / 2, 32, gate.color);
          }
        }
      }
    }
  }

  checkPlayerAttack() {
    const isUp = !!this.player.isUpwardAttack;
    const arcCenterX = isUp ? this.player.x : this.player.x + this.player.facingDirection * 22;
    const arcCenterY = isUp ? this.player.y - 24 : this.player.y - 4;
    const hitRadius = 44;

    for (const enemy of this.enemies) {
      if (enemy.isDead || !enemy.active || enemy.invulnTimer > 0) continue;

      const dist = MathUtils.distance(arcCenterX, arcCenterY, enemy.x, enemy.y);
      const isHit = dist < hitRadius + Math.max(enemy.width, enemy.height) / 2;

      if (isHit) {
        enemy.health -= 1;
        enemy.invulnTimer = 0.25;
        const kbSpeed = enemy.type === 'thorn_beetle' ? 120 : enemy.type === 'shadow_wisp' ? 170 : 230;
        enemy.vx = isUp ? (enemy.x > this.player.x ? 60 : -60) : this.player.facingDirection * kbSpeed;
        enemy.vy = isUp ? -240 : -140;
        if (enemy.type === 'thorn_beetle') {
          enemy.isCharging = false;
          enemy.stunTimer = 0.35;
        }

        this.audio.playEnemyHit();
        this.juice.screenShake(4);
        this.juice.spawnFloatingText('-1', enemy.x, enemy.y - 16, {
          color: '#FEF08A',
          stroke: '#1E1B4B',
          size: 15,
          vy: -65
        });
        this.particles.emit({
          x: enemy.x,
          y: enemy.y,
          count: 12,
          colors: ['#FFD93D', '#FFFFFF', '#4ADE80'],
          speedMin: 60,
          speedMax: 150,
          radiusMin: 2.5,
          radiusMax: 5.5,
          lifeMin: 0.2,
          lifeMax: 0.45
        });

        // Enemy Defeat Handling (Fixes BUG-04)
        if (enemy.health <= 0) {
          enemy.isDead = true;
          enemy.active = false;
          this.audio.playEnemyDefeat();
          this.juice.screenShake(7);
          this.juice.spawnFloatingText('+ESSENCE', enemy.x, enemy.y - 24, {
            color: '#4ADE80',
            stroke: '#064E3B',
            size: 14,
            vy: -80
          });
          this.particles.emit({
            x: enemy.x,
            y: enemy.y,
            count: 24,
            colors: ['#4ADE80', '#22C55E', '#FEF08A', '#FFFFFF'],
            speedMin: 80,
            speedMax: 200,
            radiusMin: 3,
            radiusMax: 7,
            lifeMin: 0.35,
            lifeMax: 0.75,
            gravity: 80,
            shape: 'star'
          });
          this.spawnSpiritEssence(enemy.x, enemy.y);
        }
      }
    }
  }

  spawnSpiritEssence(x, y) {
    this.droppedEssences.push({
      x,
      y: y - 8,
      age: 0,
      healAmount: 1
    });
  }

  damagePlayer(amount = 1, hazardX = 0) {
    if (this.player.iFrameTimer > 0) return;

    this.player.hearts = Math.max(0, this.player.hearts - amount);
    this.player.iFrameTimer = 1.4;
    this.player.scaleX = 1.35;
    this.player.scaleY = 0.65;
    this.audio.playHit();
    this.juice.screenShake(10);
    this.juice.screenFlash('#EF4444', 0.45);
    this.juice.spawnShockwave(this.player.x, this.player.y, 48, '#EF4444');
    this.juice.spawnFloatingText('-1 HEART', this.player.x, this.player.y - 24, {
      color: '#EF4444',
      stroke: '#1E1B4B',
      size: 18
    });
    this.emitDamageThorns(this.player.x, this.player.y);

    // Knockback
    const dir = this.player.x >= hazardX ? 1 : -1;
    this.player.vx = dir * 200;
    this.player.vy = -260;

    // Defeat / Checkpoint Respawn
    if (this.player.hearts <= 0) {
      this.respawnAtCheckpoint();
    }
  }

  respawnAtCheckpoint() {
    this.showToast('SANCTUARY RETURN', 'Restoring spirits at the active Waystone...');
    this.player.hearts = this.player.maxHearts;
    const cp = this.checkpoints.find((c) => c.id === this.player.lastCheckpointId) || this.checkpoints[0];
    this.player.x = cp.x;
    this.player.y = cp.y;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.state = 'IDLE';
    this.player.iFrameTimer = 1.6;
    this.juice.screenFlash('#22D3EE', 0.5);
    this.emitWaystoneHealing(cp.x, cp.y - 18);
  }

  updateEnemies(dt) {
    for (const enemy of this.enemies) {
      if (enemy.isDead || !enemy.active) continue;

      enemy.age += dt;
      if (enemy.invulnTimer > 0) enemy.invulnTimer -= dt;

      if (enemy.type === 'bramble_slime') {
        // Apply horizontal knockback decay
        if (enemy.vx) enemy.vx = MathUtils.approach(enemy.vx, 0, 600 * dt);
        enemy.x += (enemy.vx || 0) * dt;

        // Hop timer & anticipation telegraph
        enemy.hopTimer -= dt;
        if (enemy.hopTimer > 0 && enemy.hopTimer < 0.25 && enemy.isGrounded) {
          // Anticipatory squash before hop
          enemy.squish = MathUtils.approach(enemy.squish, 0.55, 2.5 * dt);
        } else if (enemy.hopTimer <= 0) {
          enemy.hopTimer = MathUtils.randomRange(1.8, 2.8);
          if (enemy.isGrounded) {
            enemy.vy = -210;
            enemy.isGrounded = false;
            enemy.squish = 1.35;
          }
        }

        // Real platform gravity
        enemy.vy = Math.min((enemy.vy || 0) + 800 * dt, 600);
        enemy.y += enemy.vy * dt;

        // Platform collision resolution using zone platform AABBs
        const wasGrounded = enemy.isGrounded;
        enemy.isGrounded = false;
        const halfW = enemy.width / 2;
        const halfH = enemy.height / 2;
        for (const plat of this.platforms) {
          if (plat.type === 'hazard') continue;
          if (
            enemy.x + halfW > plat.x &&
            enemy.x - halfW < plat.x + plat.w &&
            enemy.y + halfH >= plat.y &&
            enemy.y - halfH <= plat.y + plat.h
          ) {
            if (enemy.vy >= 0 && enemy.y + halfH - Math.max(enemy.vy * dt, 6) <= plat.y + 12) {
              enemy.y = plat.y - halfH;
              enemy.vy = 0;
              enemy.isGrounded = true;
              if (!wasGrounded) {
                enemy.squish = 0.65;
              }
            }
          }
        }

        // Horizontal patrol movement clamped strictly within bounds
        enemy.x += enemy.direction * enemy.speed * dt;
        if (enemy.x >= enemy.maxX) {
          enemy.x = enemy.maxX;
          enemy.direction = -1;
        } else if (enemy.x <= enemy.minX) {
          enemy.x = enemy.minX;
          enemy.direction = 1;
        }
        enemy.squish = MathUtils.lerp(enemy.squish, 1.0, 0.12);
      } else if (enemy.type === 'shadow_wisp') {
        // Flying enemy: horizontal and vertical knockback decay
        if (enemy.vx) enemy.vx = MathUtils.approach(enemy.vx, 0, 600 * dt);
        if (enemy.vy) enemy.vy = MathUtils.approach(enemy.vy, 0, 600 * dt);
        enemy.x += (enemy.vx || 0) * dt;

        // Subtle graceful tracking if player is in range
        const distToPlayer = MathUtils.distance(enemy.x, enemy.y, this.player.x, this.player.y);
        let playerTrackY = 0;
        if (distToPlayer < 160) {
          playerTrackY = MathUtils.clamp((this.player.y - enemy.baseY) * 0.4, -30, 30);
        }

        enemy.x += enemy.direction * enemy.speed * dt;
        enemy.y = enemy.baseY + Math.sin(enemy.age * 2.4) * 26 + playerTrackY + (enemy.vy || 0);

        if (enemy.x >= enemy.maxX) {
          enemy.x = enemy.maxX;
          enemy.direction = -1;
        } else if (enemy.x <= enemy.minX) {
          enemy.x = enemy.minX;
          enemy.direction = 1;
        }
      } else if (enemy.type === 'thorn_beetle') {
        // Apply horizontal knockback decay
        if (enemy.vx) enemy.vx = MathUtils.approach(enemy.vx, 0, 600 * dt);
        enemy.x += (enemy.vx || 0) * dt;

        // Real platform gravity for beetle
        enemy.vy = Math.min((enemy.vy || 0) + 800 * dt, 600);
        enemy.y += enemy.vy * dt;

        // Platform collision resolution using zone platform AABBs
        enemy.isGrounded = false;
        const halfW = enemy.width / 2;
        const halfH = enemy.height / 2;
        for (const plat of this.platforms) {
          if (plat.type === 'hazard') continue;
          if (
            enemy.x + halfW > plat.x &&
            enemy.x - halfW < plat.x + plat.w &&
            enemy.y + halfH >= plat.y &&
            enemy.y - halfH <= plat.y + plat.h
          ) {
            if (enemy.vy >= 0 && enemy.y + halfH - Math.max(enemy.vy * dt, 6) <= plat.y + 12) {
              enemy.y = plat.y - halfH;
              enemy.vy = 0;
              enemy.isGrounded = true;
            }
          }
        }

        // Stun daze timer handling
        if (enemy.stunTimer && enemy.stunTimer > 0) {
          enemy.stunTimer -= dt;
          enemy.isCharging = false;
          enemy.isWindup = false;
        } else {
          const distToPlayer = MathUtils.distance(enemy.x, enemy.y, this.player.x, this.player.y);
          const inLOS =
            Math.abs(enemy.y - this.player.y) < 32 &&
            distToPlayer < 180 &&
            ((this.player.x > enemy.x && enemy.direction === 1) ||
              (this.player.x < enemy.x && enemy.direction === -1) ||
              distToPlayer < 80);

          // Charge windup telegraph
          if (inLOS && !enemy.isCharging && !enemy.isWindup && enemy.cooldownTimer <= 0) {
            enemy.isWindup = true;
            enemy.windupTimer = 0.25;
            enemy.direction = this.player.x > enemy.x ? 1 : -1;
          }

          if (enemy.isWindup) {
            enemy.windupTimer -= dt;
            if (enemy.windupTimer <= 0) {
              enemy.isWindup = false;
              enemy.isCharging = true;
              enemy.chargeTimer = 0.85;
            }
          } else if (enemy.isCharging) {
            enemy.chargeTimer -= dt;
            enemy.x += enemy.direction * 280 * dt;

            // Strict clamping within platform bounds with daze stun on wall/edge hit
            if (enemy.x >= enemy.maxX) {
              enemy.x = enemy.maxX;
              enemy.isCharging = false;
              enemy.direction = -1;
              enemy.stunTimer = 0.6;
              enemy.cooldownTimer = 1.2;
            } else if (enemy.x <= enemy.minX) {
              enemy.x = enemy.minX;
              enemy.isCharging = false;
              enemy.direction = 1;
              enemy.stunTimer = 0.6;
              enemy.cooldownTimer = 1.2;
            } else if (enemy.chargeTimer <= 0) {
              enemy.isCharging = false;
              enemy.cooldownTimer = 1.2;
            }
          } else {
            if (enemy.cooldownTimer > 0) enemy.cooldownTimer -= dt;
            enemy.x += enemy.direction * enemy.speed * dt;
            if (enemy.x >= enemy.maxX) {
              enemy.x = enemy.maxX;
              enemy.direction = -1;
            } else if (enemy.x <= enemy.minX) {
              enemy.x = enemy.minX;
              enemy.direction = 1;
            }
          }
        }
      }

      // Directional AABB collision check with Lumi (Fixes BUG-05)
      const eLeft = enemy.x - enemy.width / 2;
      const eRight = enemy.x + enemy.width / 2;
      const eTop = enemy.y - enemy.height / 2;
      const eBottom = enemy.y + enemy.height / 2;

      const pLeft = this.player.x - this.player.width / 2;
      const pRight = this.player.x + this.player.width / 2;
      const pTop = this.player.y - this.player.height / 2;
      const pBottom = this.player.y + this.player.height / 2;

      const isColliding = pRight >= eLeft && pLeft <= eRight && pBottom >= eTop && pTop <= eBottom;
      if (isColliding) {
        if (this.player.state === 'LEAF_DASH') {
          // Dash pierces through enemy harmlessly with spark burst
          this.particles.emit({
            x: enemy.x,
            y: enemy.y,
            count: 8,
            colors: ['#4ADE80', '#FFFFFF', '#34D399'],
            speedMin: 50,
            speedMax: 120,
            radiusMin: 2,
            radiusMax: 4.5
          });
        } else {
          this.damagePlayer(enemy.damage || 1, enemy.x);
        }
      }
    }
  }

  checkInteractiveEntities() {
    const interactPressed = this.input.isJustPressed('action') && this.dialogueCooldown <= 0;

    // 1. Shrines
    for (const shrine of this.shrines) {
      if (!shrine.activated) {
        const dist = MathUtils.distance(this.player.x, this.player.y, shrine.x, shrine.y);
        if (dist < 48 && (interactPressed || dist < 32)) {
          shrine.activated = true;
          this.abilities[shrine.abilityKey] = true;
          this.audio.playShrineAwaken();
          this.juice.screenShake(10);
          this.juice.screenFlash(shrine.color, 0.45);
          this.juice.spawnShockwave(shrine.x, shrine.y - 14, 80, shrine.color);
          this.particles.emit({
            x: shrine.x,
            y: shrine.y - 14,
            count: 36,
            colors: [shrine.color, '#FFFFFF', '#FEF08A'],
            speedMin: 60,
            speedMax: 180,
            radiusMin: 3,
            radiusMax: 7,
            lifeMin: 0.4,
            lifeMax: 0.85,
            gravity: 40,
            shape: 'star'
          });

          this.activeAbilityModal = {
            ability: shrine.abilityKey,
            name: shrine.name,
            icon: shrine.abilityKey === 'featherJump' ? '🕊️' : shrine.abilityKey === 'leafDash' ? '🍃' : '🪂',
            color: shrine.color,
            instruction:
              shrine.abilityKey === 'featherJump'
                ? "Press Space or W while in mid-air to Double Jump.\nAscend to high forest canopies and cross wide ravines!"
                : shrine.abilityKey === 'leafDash'
                ? "Press Shift or J to Leaf Dash (1x per airborne leap).\nShatter brittle crystal walls and dash through hazards!"
                : "Hold Space or W while falling to deploy Wind Glide.\nCatch thermal updrafts to soar across highland chasms!"
          };
          this.fsm.transitionTo('ABILITY_UNLOCKED');
          this.saveGameState();
          return;
        }
      }
    }

    // 2. Waystones Checkpoints (Repeatable Sanctuary Re-Healing - Fixes BUG-10)
    for (const cp of this.checkpoints) {
      const dist = MathUtils.distance(this.player.x, this.player.y, cp.x, cp.y);
      if (dist < 48) {
        const isDamaged = this.player.hearts < this.player.maxHearts;
        if (!cp.activated || isDamaged || (!this.activatedWaystones.has(cp.id) && interactPressed)) {
          if (interactPressed || !cp.activated || (isDamaged && !cp.justHealed)) {
            const wasActivated = cp.activated && this.activatedWaystones.has(cp.id);
            cp.activated = true;
            this.activatedWaystones.add(cp.id);
            this.player.lastCheckpointId = cp.id;
            this.player.hearts = this.player.maxHearts;
            this.audio.playWaystoneHeal ? this.audio.playWaystoneHeal() : this.audio.playWaystoneActivate();
            this.juice.screenFlash('#22D3EE', 0.4);
            this.juice.spawnShockwave(cp.x, cp.y - 18, 70, '#22D3EE');

            if (!wasActivated) {
              this.juice.screenShake(6);
              this.juice.spawnFloatingText('✦ WAYSTONE ATTUNED! ✦', cp.x, cp.y - 48, {
                color: '#22D3EE',
                stroke: '#0F172A',
                size: 17
              });
              this.showToast('WAYSTONE ATTUNED', `${cp.name} (Hearts Restored!)`, '#22D3EE');
            } else {
              this.juice.spawnFloatingText('✦ RESTED & RESTORED ✦', cp.x, cp.y - 28, {
                color: '#34D399',
                stroke: '#0F172A',
                size: 16
              });
              this.showToast('SANCTUARY REST', `${cp.name} (Hearts Restored!)`, '#22D3EE');
            }

            this.emitWaystoneHealing(cp.x, cp.y - 18);
            this.saveGameState();
          }
        }
      }
    }

    // 3. Sun Seeds (8 Total)
    for (const seed of this.seeds) {
      if (!this.collectedSeeds.has(seed.id)) {
        const dist = MathUtils.distance(this.player.x, this.player.y, seed.x, seed.y);
        if (dist < 32) {
          this.collectedSeeds.add(seed.id);
          this.audio.playSunSeedCollect();
          this.juice.screenShake(5);
          this.juice.screenFlash('#FEF08A', 0.38);
          this.juice.spawnShockwave(seed.x, seed.y, 65, '#FDE047');
          this.juice.spawnFloatingText(`+1 SUN SEED (#${seed.number})`, seed.x, seed.y - 28, {
            color: '#FFD93D',
            stroke: '#1E1B4B',
            size: 19
          });
          this.particles.emit({
            x: seed.x,
            y: seed.y,
            count: 28,
            color: '#FEF08A',
            colors: ['#FEF08A', '#F59E0B', '#FFFFFF', '#FFD93D'],
            speedMin: 80,
            speedMax: 200,
            radiusMin: 3,
            radiusMax: 7,
            lifeMin: 0.4,
            lifeMax: 0.8,
            gravity: 60,
            shape: 'star'
          });
          this.showToast(`SUN SEED ${this.collectedSeeds.size} / 8 FOUND!`, seed.name, '#FFD93D');
          this.saveGameState();

          if (this.collectedSeeds.size === 8) {
            this.showToast('ALL 8 SUN SEEDS RECOVERED!', 'Return to the Great Elder Tree in Heart Grove!', '#FFD93D');
          }
        }
      }
    }

    // 4. Woodland NPCs (Sequential Dialog Index Progression - Fixes BUG-12)
    for (const npc of this.npcs) {
      const dist = MathUtils.distance(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < 52 && interactPressed) {
        const rawText = npc.getDialogue();
        this.startDialogue(npc.name, npc.avatar, rawText, npc);
        return;
      }
    }

    // 5. Great Elder Tree Altar Bloom (Idempotent Climax Trigger - Fixes BUG-11)
    if (this.collectedSeeds.size >= 8) {
      const distToTree = MathUtils.distance(this.player.x, this.player.y, 240, 360);
      if (distToTree < 75 && interactPressed) {
        if (!this.hasTriggeredBloomCutscene) {
          this.hasTriggeredBloomCutscene = true;
          this.fsm.transitionTo('VICTORY_CUTSCENE');
        } else {
          this.startDialogue('Great Elder Tree', 'spirit', 'The ancient branches flourish with eternal dawn light. Thank you, little Lumi.');
        }
      }
    }
  }

  startDialogue(speaker, avatar, text, npc = null) {
    if (this.dialogueCooldown > 0) return;
    this.dialogueBox.start(speaker, avatar, text, {
      onChirp: () => this.audio.playNPCChirp(avatar),
      avatarRenderer: (ctx, avatarType) => {
        ctx.save();
        if (avatarType === 'snail') {
          ctx.translate(0, -2);
          ctx.scale(0.85, 0.85);
          this.drawBarnabyAvatar(ctx);
        } else if (avatarType === 'hedgehog') {
          ctx.translate(0, -2);
          ctx.scale(0.85, 0.85);
          this.drawBrambleAvatar(ctx);
        } else if (avatarType === 'owl') {
          ctx.translate(0, -2);
          ctx.scale(0.8, 0.8);
          this.drawPipAvatar(ctx);
        } else if (avatarType === 'spirit' || avatarType === 'shrine') {
          ctx.fillStyle = 'rgba(74, 222, 128, 0.35)';
          ctx.beginPath();
          ctx.arc(0, 0, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#22C55E';
          ctx.strokeStyle = '#FEF08A';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(-3, -3, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      },
      onComplete: () => {
        this.dialogueCooldown = 0.25;
        if (npc) {
          npc.dialogIndex = (npc.dialogIndex || 0) + 1;
          this.saveGameState();
        }
      }
    });
  }

  showToast(title, subtitle, color = '#FFD93D') {
    this.toast.active = true;
    this.toast.title = title;
    this.toast.subtitle = subtitle;
    this.toast.color = color;
    this.toast.timer = 4.0;
  }

  updateCurrentZone() {
    let newZoneId = 'heart_grove';

    // Strict bounding-box containment checks (Fixes BUG-16)
    if (this.player.x >= 1440 && this.player.x <= 2200 && this.player.y >= 450 && this.player.y <= 900) {
      newZoneId = 'secret_elder_shrine';
    } else if (this.player.x >= -720 && this.player.x < 1440 && this.player.y >= 450 && this.player.y <= 900) {
      newZoneId = 'sunken_roots';
    } else if (this.player.y < 0 && this.player.x >= 1440) {
      newZoneId = 'windy_chasm';
    } else if (this.player.y < 0) {
      newZoneId = 'sunlit_canopy';
    } else if (this.player.x < 0) {
      newZoneId = 'mossy_caverns';
    } else if (this.player.x > 1440) {
      newZoneId = 'crystal_grotto';
    } else {
      newZoneId = 'heart_grove';
    }

    if (newZoneId !== this.currentZoneId) {
      this.currentZoneId = newZoneId;
      const zoneData = ZONES[newZoneId];
      if (zoneData) {
        this.zoneBanner.name = zoneData.name;
        this.zoneBanner.timer = 3.0;
        this.zoneBanner.alpha = 1.0;
      }
    }
  }

  updateAmbientMotes(dt) {
    for (const mote of this.ambientMotes) {
      mote.x += mote.vx * dt;
      mote.y += (mote.vy + Math.sin(this.gameTime * mote.pulseSpeed + mote.phase) * 6) * dt;

      if (mote.y < -900) mote.y = 900;
      if (mote.y > 900) mote.y = -900;
      if (mote.x < -1440) mote.x = 2880;
      if (mote.x > 2880) mote.x = -1440;
    }
  }

  updateVictoryCutscene(dt) {
    this.victoryState.timer += dt;

    // Phase 0 (0..2s): Seeds orbit and ascend into Great Elder Tree
    if (this.victoryState.phase === 0) {
      for (let i = 0; i < 8; i++) {
        this.victoryState.seedOrbitAngles[i] += dt * 3.8;
      }
      this.victoryState.treeGlow = Math.min(1.0, this.victoryState.timer / 2.0);
      if (this.victoryState.timer >= 2.0) {
        this.victoryState.phase = 1;
        this.juice.screenFlash('#FEF08A', 0.85);
        this.juice.screenShake(18);
        this.juice.spawnShockwave(240, 240, 180, '#FFD700');
        // Fire glorious celebration confetti volleys
        for (let k = 0; k < 8; k++) {
          const cx = 240 + MathUtils.randomRange(-100, 100);
          const cy = 260 + MathUtils.randomRange(-80, 60);
          this.emitGreatTreeBloomConfetti(cx, cy, 26);
        }
      }
    }
    // Phase 1 (2s+): Stats Screen display
    else {
      this.victoryState.statsShown = true;
      if (this.input.isJustPressed('action') || this.input.isJustPressed('up')) {
        this.fsm.transitionTo('PLAYING');
      }
    }
  }

  // Save / Load Persistence with Playgama Cloud Storage & Local Fallback
  saveGameState() {
    if (this.disableSave) return;
    try {
      const npcIndices = {};
      for (const npc of this.npcs) {
        npcIndices[npc.id] = npc.dialogIndex || 0;
      }

      const data = {
        player: {
          hearts: this.player.hearts,
          lastCheckpointId: this.player.lastCheckpointId,
          x: this.player.x,
          y: this.player.y
        },
        abilities: this.abilities,
        collectedSeeds: Array.from(this.collectedSeeds),
        activatedWaystones: Array.from(this.activatedWaystones),
        brokenGates: Array.from(this.brokenGates),
        secretsFound: Array.from(this.secretsFound),
        hasCompletedGame: this.hasCompletedGame,
        hasTriggeredBloomCutscene: this.hasTriggeredBloomCutscene,
        npcDialogueIndices: npcIndices,
        gameTime: this.gameTime
      };
      localStorage.setItem('grove_odyssey_save', JSON.stringify(data));
      this.playgama.setData('save_state', data);
      this.playgama.setHighScore('main', this.collectedSeeds.size);
    } catch (e) {}
  }

  loadSaveGame() {
    try {
      const raw = localStorage.getItem('grove_odyssey_save');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.abilities) Object.assign(this.abilities, data.abilities);
        if (data.collectedSeeds) this.collectedSeeds = new Set(data.collectedSeeds);
        if (data.activatedWaystones) this.activatedWaystones = new Set(data.activatedWaystones);
        if (data.brokenGates) {
          this.brokenGates = new Set(data.brokenGates);
          for (const gate of this.gates) {
            if (this.brokenGates.has(gate.id)) gate.isOpen = true;
          }
        }
        if (data.secretsFound) this.secretsFound = new Set(data.secretsFound);
        if (data.hasCompletedGame) this.hasCompletedGame = data.hasCompletedGame;
        if (data.hasTriggeredBloomCutscene) this.hasTriggeredBloomCutscene = data.hasTriggeredBloomCutscene;
        if (data.npcDialogueIndices) {
          for (const npc of this.npcs) {
            if (data.npcDialogueIndices[npc.id] !== undefined) {
              npc.dialogIndex = data.npcDialogueIndices[npc.id];
            }
          }
        }
        if (data.gameTime) this.gameTime = data.gameTime;

        if (data.player && data.player.lastCheckpointId) {
          const cp = this.checkpoints.find((c) => c.id === data.player.lastCheckpointId);
          if (cp) {
            this.player.x = cp.x;
            this.player.y = cp.y;
            this.player.lastCheckpointId = cp.id;
          }
        }
      }
    } catch (e) {}
  }

  // =========================================================================
  // RENDERING PIPELINE (9-LAYER CANVAS STACK)
  // =========================================================================

  update(dt) {
    this.fsm.update(dt);
    this.tweens.update(dt);
    this.particles.update(dt);
    this.juice.update(dt);
    this.input.endFrame();
  }

  render(alpha) {
    this.camera.setShakeOffset(this.juice.shakeX, this.juice.shakeY);
    this.renderer.beginFrame(this.camera);

    const ctx = this.renderer.ctx;

    // Layer 1: Multi-tiered Parallax Backdrop
    this.renderParallaxBackground(ctx);

    // Layer 2: Midground Environment (Platforms, Shrines, Waystones, Seeds, NPCs, Tree)
    this.renderEnvironment(ctx);

    // Layer 3: Enemies & Dynamic Hazards
    this.renderEnemies(ctx);

    // Layer 4: Player Entity Lumi
    this.renderLumi(ctx);

    // Layer 5: World Particles & Shockwaves
    this.particles.render(ctx);
    this.juice.renderWorld(ctx);

    // Layer 6: Dynamic Bioluminescent Ambient Lighting Mask
    this.renderBioluminescentMask(ctx);

    this.renderer.endWorldFrame(this.camera);

    // Screen Space Overlays (HUD, Dialogue, Banner, Modals, Fullscreen Flashes)
    this.juice.renderScreen(ctx, this.virtualWidth, this.virtualHeight);
    this.renderHUD(ctx);
    this.dialogueBox.render(ctx);
    this.renderZoneBanner(ctx);
    this.renderToastBanner(ctx);
    this.renderOverlayScreens(ctx);

    this.renderer.endFrame();
  }

  renderParallaxBackground(ctx) {
    const zone = ZONES[this.currentZoneId] || ZONES.heart_grove;

    // Atmospheric Gradient Skybox
    const grad = ctx.createLinearGradient(0, -900, 0, 900);
    grad.addColorStop(0, zone.skyTop);
    grad.addColorStop(1, zone.skyBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(-1500, -950, 4450, 1900);

    // Distant Parallax Mountain Silhouettes (0.1x parallax)
    ctx.save();
    ctx.fillStyle = 'rgba(10, 24, 18, 0.4)';
    for (let x = -1400; x < 2800; x += 320) {
      ctx.beginPath();
      ctx.moveTo(x, 450);
      ctx.lineTo(x + 160, 200);
      ctx.lineTo(x + 320, 450);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  renderEnvironment(ctx) {
    const zone = ZONES[this.currentZoneId] || ZONES.heart_grove;

    // 1. Great Elder Tree in Heart Grove (x: 180..380, y: 100..400)
    this.renderGreatElderTree(ctx);

    // 2. Updraft Thermal Currents in Windy Chasm
    for (const updraft of this.updrafts) {
      ctx.save();
      const uGrad = ctx.createLinearGradient(updraft.x, updraft.y, updraft.x + updraft.width, updraft.y);
      uGrad.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
      uGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.28)');
      uGrad.addColorStop(1, 'rgba(56, 189, 248, 0.05)');
      ctx.fillStyle = uGrad;
      ctx.fillRect(updraft.x, updraft.y, updraft.width, updraft.height);

      // Updraft wind streaks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        const lineX = updraft.x + 15 + i * 14;
        const lineY = updraft.y + ((this.gameTime * 240 + i * 130) % updraft.height);
        ctx.beginPath();
        ctx.moveTo(lineX, lineY);
        ctx.lineTo(lineX, lineY - 35);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. Platforms & Hazard Floors (With Bioluminescent Ledge Edge Signposting)
    for (const plat of this.platforms) {
      if (plat.type === 'hazard') {
        // Red Crystal / Thorn Briars
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        for (let x = plat.x; x < plat.x + plat.w; x += 14) {
          ctx.moveTo(x, plat.y + plat.h);
          ctx.lineTo(x + 7, plat.y);
          ctx.lineTo(x + 14, plat.y + plat.h);
        }
        ctx.fill();
      } else {
        // Ground / Platform Slab
        const pZone = ZONES[plat.zone] || zone;
        ctx.fillStyle = pZone.terrainMain;
        ProceduralPrimitives.roundedRect(ctx, plat.x, plat.y, plat.w, plat.h, 6, pZone.terrainMain, '#1E293B', 1.5);

        // Platform Top Foliage Grass Accent
        ctx.fillStyle = pZone.terrainTop;
        ProceduralPrimitives.roundedRect(ctx, plat.x, plat.y, plat.w, 6, [6, 6, 0, 0], pZone.terrainTop);

        // Bioluminescent Ledge Edge Glow Trim (Crisp visual signposting for reachable jumps)
        ctx.save();
        ctx.strokeStyle = pZone.terrainTop;
        ctx.shadowColor = pZone.terrainTop;
        ctx.shadowBlur = 7;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(plat.x + 4, plat.y + 1);
        ctx.lineTo(plat.x + plat.w - 4, plat.y + 1);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 4. Bouncy Spore Mushrooms (With Expanding Shockwave Ripples)
    for (let i = 0; i < this.sporeMushrooms.length; i++) {
      const mush = this.sporeMushrooms[i];
      ctx.save();
      ctx.translate(mush.x, mush.y);

      const squash = 1.0 - mush.squish;

      // Pulsing Turquoise Shockwave Launch Rings (Signals "High Bouncy Springboard")
      const ringProgress = (this.gameTime * 2 + i * 0.33) % 1;
      const ringAlpha = (1 - ringProgress) * 0.6;
      ctx.save();
      ctx.strokeStyle = `rgba(0, 245, 212, ${ringAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -6, mush.radius + ringProgress * 18, Math.PI, 0);
      ctx.stroke();
      ctx.restore();

      // Mushroom Stem
      ctx.fillStyle = '#D8F3DC';
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-8, -4 + squash * 8, 16, 18 - squash * 8, [2, 2, 4, 4]);
      ctx.fill();
      ctx.stroke();

      // Bouncy Turquoise Cap with Squash/Stretch
      ctx.save();
      ctx.scale(1.0 + squash * 0.4, mush.squish);
      const capGrad = ctx.createLinearGradient(0, -22, 0, 0);
      capGrad.addColorStop(0, '#00F5D4');
      capGrad.addColorStop(1, '#05B89A');
      ctx.fillStyle = capGrad;
      ctx.strokeStyle = '#0F766E';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, -4, mush.radius, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Spore Dots
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-10, -12, 3, 0, Math.PI * 2);
      ctx.arc(10, -12, 3, 0, Math.PI * 2);
      ctx.arc(0, -17, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }

    // 5. Gates & Barriers / Secret Ruin Portal
    for (const gate of this.gates) {
      if (!gate.isOpen && !this.brokenGates.has(gate.id)) {
        ctx.save();
        ctx.translate(gate.x + gate.width / 2, gate.y + gate.height / 2);

        // Shimmering Crystal / Barricade Barrier
        const cGrad = ctx.createLinearGradient(-gate.width / 2, 0, gate.width / 2, 0);
        cGrad.addColorStop(0, gate.color);
        cGrad.addColorStop(0.5, '#BE95C4');
        cGrad.addColorStop(1, '#70D6FF');
        ctx.fillStyle = cGrad;
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-gate.width / 2, -gate.height / 2, gate.width, gate.height, 6);
        ctx.fill();
        ctx.stroke();

        // Glowing Fissure Crack Lines
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -gate.height / 2);
        ctx.lineTo(-4, -gate.height / 4);
        ctx.lineTo(4, 0);
        ctx.lineTo(-3, gate.height / 4);
        ctx.lineTo(0, gate.height / 2);
        ctx.stroke();

        // Rune Lock Icon
        ProceduralPrimitives.circle(ctx, 0, 0, 12, '#1E293B', '#FFD93D', 2);
        ctx.fillStyle = '#FFD93D';
        ctx.font = "bold 11px 'Fredoka', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(gate.isSecret ? '✦' : '🔒', 0, 0);

        ctx.restore();
      }
    }

    // 5b. Minimalist Wooden Trail Markers (Heart Grove Central Hub Only)
    const hubMarkers = [
      { x: 90, y: 390, text: '◀ Caverns' },
      { x: 1360, y: 390, text: 'Grotto ▶' },
      { x: 520, y: 190, text: '▲ Canopy' },
      { x: 1250, y: 395, text: '▼ Deep Roots' }
    ];

    for (const m of hubMarkers) {
      ctx.save();
      ctx.translate(m.x, m.y);
      // Small wooden post
      ctx.fillStyle = '#3E2723';
      ctx.fillRect(-2, -10, 4, 12);
      // Carved wooden board with subtle arrow text
      ProceduralPrimitives.roundedRect(ctx, -36, -24, 72, 16, 4, '#5D4037', '#8D6E63', 1);
      ctx.fillStyle = '#FFF8E1';
      ctx.font = "bold 10px 'Fredoka', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(m.text, 0, -16);
      ctx.restore();
    }

    // 6. Ancient Woodland Shrines (Cozy Mossy Stone Altars)
    for (const shrine of this.shrines) {
      ctx.save();
      ctx.translate(shrine.x, shrine.y);

      // Base stepped stone dais
      ProceduralPrimitives.roundedRect(ctx, -24, 6, 48, 16, 4, '#1E293B', '#334155', 1.5);
      ProceduralPrimitives.roundedRect(ctx, -18, -4, 36, 12, 3, '#0F172A', '#475569', 1.2);

      // Moss tufts on pedestal
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(-16, 6, 3, 0, Math.PI);
      ctx.arc(14, 6, 3.5, 0, Math.PI);
      ctx.fill();

      // Carved rune carvings on the stone
      ctx.strokeStyle = shrine.activated ? shrine.color : '#64748B';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-10, 2);
      ctx.lineTo(0, -2);
      ctx.lineTo(10, 2);
      ctx.stroke();

      if (!shrine.activated) {
        // Soft gradient celestial aura beacon
        const auraPulse = Math.sin(this.gameTime * 3) * 3;
        ctx.save();
        ctx.shadowColor = shrine.color;
        ctx.shadowBlur = 14;

        const beacon = ctx.createRadialGradient(0, -28, 2, 0, -28, 24 + auraPulse);
        beacon.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        beacon.addColorStop(0.4, shrine.color);
        beacon.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = beacon;
        ctx.beginPath();
        ctx.arc(0, -28, 24 + auraPulse, 0, Math.PI * 2);
        ctx.fill();

        // Floating ancient relic artifact bobbing smoothly
        const floatY = -28 + Math.sin(this.gameTime * 2.5) * 4;
        ctx.translate(0, floatY);

        if (shrine.abilityKey === 'featherJump') {
          // Luminous Feather Wing Relic
          ctx.fillStyle = '#34D399';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, 6, 14, -0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(-1, -4, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (shrine.abilityKey === 'leafDash') {
          // Spinning Amber Gale Leaf Relic
          ctx.rotate(this.gameTime * 1.8);
          ctx.fillStyle = '#38BDF8';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, -12);
          ctx.quadraticCurveTo(8, 0, 0, 12);
          ctx.quadraticCurveTo(-8, 0, 0, -12);
          ctx.fill();
          ctx.stroke();
        } else if (shrine.abilityKey === 'windGlide') {
          // Golden Dandelion Parachute Relic
          ctx.fillStyle = '#FACC15';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, -3, 9, Math.PI, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(0, -3);
          ctx.lineTo(0, 9);
          ctx.stroke();
        }
        ctx.restore();

        // Interaction Prompt pill above shrine
        const promptDist = MathUtils.distance(this.player.x, this.player.y, shrine.x, shrine.y);
        if (promptDist < 54) {
          ProceduralPrimitives.roundedRect(ctx, -45, -60, 90, 20, 10, '#0F172A', shrine.color, 1.2);
          ctx.fillStyle = '#FEF08A';
          ctx.font = "bold 11px 'Fredoka', sans-serif";
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✦ Press E ✦', 0, -50);
        }
      } else {
        // Tranquil active altar rune glow
        ctx.save();
        ctx.fillStyle = shrine.color;
        ctx.shadowColor = shrine.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, -8, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }

    // 7. Checkpoint Waystones
    for (const cp of this.checkpoints) {
      ctx.save();
      ctx.translate(cp.x, cp.y);

      const isAttuned = this.activatedWaystones.has(cp.id);
      const runePulse = isAttuned ? Math.sin(this.gameTime * 4) * 0.2 + 0.8 : 0.2;

      // 1. Base Stele Stone
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-16, 24);
      ctx.lineTo(-12, -28);
      ctx.lineTo(0, -36);
      ctx.lineTo(12, -28);
      ctx.lineTo(16, 24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 2. Carved Rune Glyphs
      ctx.strokeStyle = isAttuned ? `rgba(34, 211, 238, ${runePulse})` : '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -14, 6, 0, Math.PI * 1.5);
      ctx.moveTo(0, -6);
      ctx.lineTo(0, 14);
      ctx.moveTo(-6, 4);
      ctx.lineTo(6, 4);
      ctx.stroke();

      // 3. Activated Radiant Cyan Fire & Healing Aura
      if (isAttuned) {
        const aura = ctx.createRadialGradient(0, -14, 4, 0, -14, 32);
        aura.addColorStop(0, 'rgba(34, 211, 238, 0.45)');
        aura.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, -14, 32, 0, Math.PI * 2);
        ctx.fill();

        // Beacon Top Flame
        ctx.fillStyle = '#67E8F9';
        ctx.beginPath();
        ctx.arc(0, -36, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // 8. Sun Seeds (8 Total)
    for (const seed of this.seeds) {
      if (!this.collectedSeeds.has(seed.id)) {
        const bob = Math.sin(this.gameTime * 4 + seed.number) * 4;
        const rot = this.gameTime * 1.6 + seed.number;

        ctx.save();
        ctx.translate(seed.x, seed.y + bob);

        // Radiant Golden Corona Halo
        const corona = ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
        corona.addColorStop(0, 'rgba(253, 224, 71, 0.65)');
        corona.addColorStop(0.6, 'rgba(245, 158, 11, 0.25)');
        corona.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = corona;
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();

        // Rotating 4-Ray Petal Star
        ctx.save();
        ctx.rotate(rot);
        ctx.fillStyle = '#FEF08A';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(4, -6, 0, -14);
          ctx.quadraticCurveTo(-4, -6, 0, 0);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();

        // Central Luminous Seed Core
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Glint sparkle
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(-1.5, -1.5, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // 9. Interactive NPCs
    for (const npc of this.npcs) {
      ctx.save();
      ctx.translate(npc.x, npc.y);
      if (npc.avatar === 'snail') {
        this.drawBarnabyAvatar(ctx);
      } else if (npc.avatar === 'hedgehog') {
        this.drawBrambleAvatar(ctx);
      } else if (npc.avatar === 'owl') {
        this.drawPipAvatar(ctx);
      }

      // Interactive Prompt Indicator
      const dist = MathUtils.distance(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < 52) {
        ProceduralPrimitives.roundedRect(ctx, -24, -48, 48, 18, 5, '#0284C7', '#38BDF8', 1);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = "bold 11px 'Fredoka', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Talk [E]', 0, -39);
      }
      ctx.restore();
    }

    // 10. Dropped Spirit Essence Loot Orbs (Fixes BUG-04)
    for (const ess of this.droppedEssences) {
      ctx.save();
      const pulse = 1 + Math.sin(ess.age * 8) * 0.2;
      // Ambient Green Healing Aura
      ProceduralPrimitives.circle(ctx, ess.x, ess.y, 9 * pulse, 'rgba(46, 213, 115, 0.35)');
      // Radiant Core
      ProceduralPrimitives.circle(ctx, ess.x, ess.y, 4.5, '#2ED573', '#FFFFFF', 1.5);
      ctx.restore();
    }
  }

  renderGreatElderTree(ctx) {
    ctx.save();
    ctx.translate(240, 400);

    const isBloomed = this.hasCompletedGame || this.victoryState.phase > 0;
    const trunkColor = isBloomed ? '#78350F' : '#3F2B1D';
    const crownColor = isBloomed ? '#4ADE80' : '#166534';
    const flowerColor = isBloomed ? '#FEF08A' : '#A7F3D0';

    // Massive Trunk & Roots
    ctx.fillStyle = trunkColor;
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-70, 0);
    ctx.quadraticCurveTo(-45, -120, -35, -240);
    ctx.lineTo(35, -240);
    ctx.quadraticCurveTo(45, -120, 70, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ancient Heart Altar Cavity
    ProceduralPrimitives.circle(ctx, 0, -60, 22, '#1E293B', isBloomed ? '#FDE047' : '#475569', 2);

    // Altar Glyphs
    ctx.fillStyle = isBloomed ? '#FDE047' : '#94A3B8';
    ctx.font = "bold 16px 'Fredoka', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${this.collectedSeeds.size}/8`, 0, -60);

    // Massive Foliage Canopy Cloud
    ctx.fillStyle = crownColor;
    ctx.beginPath();
    ctx.arc(-50, -250, 60, 0, Math.PI * 2);
    ctx.arc(50, -250, 60, 0, Math.PI * 2);
    ctx.arc(0, -290, 75, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Golden Blossom Petals
    ctx.fillStyle = flowerColor;
    for (let angle = 0; angle < Math.PI * 2; angle += 0.6) {
      const fx = Math.cos(angle) * 60;
      const fy = -270 + Math.sin(angle) * 45;
      ProceduralPrimitives.circle(ctx, fx, fy, isBloomed ? 6 : 3, flowerColor);
    }

    // Victory Cutscene Orbiting Seeds
    if (this.fsm.currentState === 'VICTORY_CUTSCENE' && this.victoryState.phase === 0) {
      for (let i = 0; i < 8; i++) {
        const ang = this.victoryState.seedOrbitAngles[i];
        const rad = 45 + Math.sin(ang * 2) * 12;
        const sx = Math.cos(ang) * rad;
        const sy = -60 + Math.sin(ang) * rad;
        ProceduralPrimitives.circle(ctx, sx, sy, 7, '#FEF08A', '#F59E0B', 2);
      }
    }

    ctx.restore();
  }

  // =========================================================================
  // VECTOR ART CHARACTER & NPC RENDERERS (From Art Direction Guide)
  // =========================================================================

  drawBarnabyAvatar(ctx) {
    const breath = Math.sin(this.gameTime * 3) * 1.5;

    // Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.beginPath();
    ctx.ellipse(0, 16, 26, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Snail Shell (Golden Spiral with Moss Tufts)
    const shellGrad = ctx.createRadialGradient(-6, -4 + breath, 4, -6, -4 + breath, 22);
    shellGrad.addColorStop(0, '#FDE68A');
    shellGrad.addColorStop(0.7, '#D97706');
    shellGrad.addColorStop(1, '#92400E');
    ctx.fillStyle = shellGrad;
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(-6, -4 + breath, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Shell Spiral Groove
    ctx.strokeStyle = 'rgba(146, 64, 14, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-6, -4 + breath, 11, 0, Math.PI * 1.5);
    ctx.stroke();

    // Moss Tufts on Shell
    ctx.fillStyle = '#22C55E';
    ctx.beginPath();
    ctx.arc(-14, -16 + breath, 5, 0, Math.PI * 2);
    ctx.arc(-8, -20 + breath, 6.5, 0, Math.PI * 2);
    ctx.arc(-2, -18 + breath, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Turquoise Spore Dots
    ctx.fillStyle = '#00F5D4';
    ctx.beginPath();
    ctx.arc(-8, -21 + breath, 1.8, 0, Math.PI * 2);
    ctx.arc(-14, -17 + breath, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Soft Snail Body & Foot
    ctx.fillStyle = '#FFE8D6';
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-22, 14);
    ctx.quadraticCurveTo(0, 16, 20, 14);
    ctx.quadraticCurveTo(24, 10, 20, 4);
    ctx.quadraticCurveTo(14, -8 + breath, 10, -12 + breath);
    ctx.quadraticCurveTo(0, -6 + breath, -4, 4);
    ctx.quadraticCurveTo(-14, 6, -22, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Eye Stalks
    const eyeWobble = Math.sin(this.gameTime * 4) * 0.08;
    // Left Stalk
    ctx.fillStyle = '#FFE8D6';
    ctx.beginPath();
    ctx.roundRect(8, -24 + breath + eyeWobble * 8, 4, 14, [2, 2, 0, 0]);
    ctx.fill();
    ctx.stroke();
    // Left Eyeball
    ctx.beginPath();
    ctx.arc(10, -26 + breath + eyeWobble * 8, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(11, -26 + breath + eyeWobble * 8, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(10.2, -27 + breath + eyeWobble * 8, 1, 0, Math.PI * 2);
    ctx.fill();

    // Right Stalk
    ctx.fillStyle = '#FFE8D6';
    ctx.beginPath();
    ctx.roundRect(16, -22 + breath - eyeWobble * 8, 4, 12, [2, 2, 0, 0]);
    ctx.fill();
    ctx.stroke();
    // Right Eyeball
    ctx.beginPath();
    ctx.arc(18, -24 + breath - eyeWobble * 8, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(19, -24 + breath - eyeWobble * 8, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(18.2, -25 + breath - eyeWobble * 8, 1, 0, Math.PI * 2);
    ctx.fill();

    // 4. Rosy Cheeks & Smile
    ctx.fillStyle = 'rgba(255, 107, 129, 0.45)';
    ctx.beginPath();
    ctx.ellipse(14, -2 + breath, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(16, 2 + breath, 3, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // 5. Sky Blue Scarf with Leaf Clasp
    ctx.fillStyle = '#38BDF8';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(6, 4 + breath, 12, 5, 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#4ADE80';
    ctx.beginPath();
    ctx.arc(6, 6 + breath, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBrambleAvatar(ctx) {
    const bob = Math.sin(this.gameTime * 4) * 1.2;

    // Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.beginPath();
    ctx.ellipse(0, 16, 22, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Spiky Quills Mantle
    ctx.fillStyle = '#5C3D2E';
    ctx.strokeStyle = '#2E1911';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const numSpikes = 9;
    for (let i = 0; i < numSpikes; i++) {
      const angle = Math.PI * 0.75 + (i / (numSpikes - 1)) * Math.PI * 1.25;
      const rOuter = 24 + (i % 2) * 4;
      const rInner = 16;
      const xOuter = Math.cos(angle) * rOuter;
      const yOuter = Math.sin(angle) * rOuter - 2;
      const xInner = Math.cos(angle + 0.1) * rInner;
      const yInner = Math.sin(angle + 0.1) * rInner - 2;
      if (i === 0) ctx.moveTo(xOuter, yOuter);
      else ctx.lineTo(xOuter, yOuter);
      ctx.lineTo(xInner, yInner);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 2. Round Chubby Body & Snout
    ctx.fillStyle = '#FDE68A';
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-10, -12 + bob, 22, 24, [10, 14, 8, 8]);
    ctx.fill();
    ctx.stroke();

    // Pointed Snout
    ctx.beginPath();
    ctx.moveTo(8, -6 + bob);
    ctx.lineTo(19, -2 + bob);
    ctx.lineTo(8, 4 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Nose button
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(19, -2 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 3. Brass Magnifying Goggles (On Forehead)
    ctx.fillStyle = '#D97706';
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(2, -15 + bob, 6, 0, Math.PI * 2);
    ctx.arc(11, -15 + bob, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Goggle Lenses
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(2, -15 + bob, 4, 0, Math.PI * 2);
    ctx.arc(11, -15 + bob, 4, 0, Math.PI * 2);
    ctx.fill();

    // Lens Glint
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0.8, -16.5 + bob, 1.2, 0, Math.PI * 2);
    ctx.arc(9.8, -16.5 + bob, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // 4. Eyes & Blush
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(6, -6 + bob, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(5.2, -7 + bob, 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.beginPath();
    ctx.ellipse(3, -2 + bob, 3, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Miner Lantern in Hand
    const lanternSwing = Math.sin(this.gameTime * 4) * 0.15;
    ctx.save();
    ctx.translate(14, 4 + bob);
    ctx.rotate(lanternSwing);
    // Chain
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 6);
    ctx.stroke();
    // Lantern Cage
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.roundRect(-5, 6, 10, 12, 2);
    ctx.fill();
    // Glowing Cyan Crystal Inside
    ctx.fillStyle = '#06B6D4';
    ctx.beginPath();
    ctx.roundRect(-3, 8, 6, 8, 1);
    ctx.fill();
    // Crystal Glow Halo
    const lGlow = ctx.createRadialGradient(0, 12, 2, 0, 12, 16);
    lGlow.addColorStop(0, 'rgba(6, 182, 212, 0.6)');
    lGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = lGlow;
    ctx.beginPath();
    ctx.arc(0, 12, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawPipAvatar(ctx) {
    const breath = Math.sin(this.gameTime * 2.5) * 1.5;

    // Branch Perch
    ctx.fillStyle = '#854D0E';
    ctx.strokeStyle = '#451A03';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-24, 14, 48, 8, [4, 4, 4, 4]);
    ctx.fill();
    ctx.stroke();

    // 1. Owl Body Mantle (Midnight Violet)
    ctx.fillStyle = '#1E1B4B';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(-16, -26 + breath, 32, 40, [16, 16, 12, 12]);
    ctx.fill();
    ctx.stroke();

    // Gold Star Speckles on Wings
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(-11, -8 + breath, 1.2, 0, Math.PI * 2);
    ctx.arc(-8, 2 + breath, 1.0, 0, Math.PI * 2);
    ctx.arc(11, -8 + breath, 1.2, 0, Math.PI * 2);
    ctx.arc(8, 2 + breath, 1.0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Fluffy Breast Down (Pearl Cream)
    ctx.fillStyle = '#F1F5F9';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, -2 + breath, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Chevron Down Feathers
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.2;
    for (let dy of [-4, 1, 6]) {
      ctx.beginPath();
      ctx.moveTo(-5, dy + breath);
      ctx.lineTo(0, dy + 3 + breath);
      ctx.lineTo(5, dy + breath);
      ctx.stroke();
    }

    // 3. Tufted Feather Eyebrows
    ctx.fillStyle = '#D97706';
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 1.5;
    // Left Ear Tuft
    ctx.beginPath();
    ctx.moveTo(-10, -22 + breath);
    ctx.lineTo(-18, -36 + breath);
    ctx.lineTo(-6, -25 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Right Ear Tuft
    ctx.beginPath();
    ctx.moveTo(10, -22 + breath);
    ctx.lineTo(18, -36 + breath);
    ctx.lineTo(6, -25 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 4. Golden Spectacles & Wise Eyes
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(-6, -14 + breath, 6.5, 0, Math.PI * 2);
    ctx.arc(6, -14 + breath, 6.5, 0, Math.PI * 2);
    ctx.stroke();
    // Spectacle bridge
    ctx.beginPath();
    ctx.moveTo(-0.5, -14 + breath);
    ctx.lineTo(0.5, -14 + breath);
    ctx.stroke();

    // Amber Pupils
    ctx.fillStyle = '#78350F';
    ctx.beginPath();
    ctx.arc(-6, -14 + breath, 4.5, 0, Math.PI * 2);
    ctx.arc(6, -14 + breath, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(-6, -14 + breath, 2.5, 0, Math.PI * 2);
    ctx.arc(6, -14 + breath, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Catchlights
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-7, -15.5 + breath, 1.2, 0, Math.PI * 2);
    ctx.arc(5, -15.5 + breath, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Tiny Golden Beak
    ctx.fillStyle = '#F59E0B';
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-2.5, -9 + breath);
    ctx.lineTo(2.5, -9 + breath);
    ctx.lineTo(0, -4 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 5. Perched Claws
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(-6, 14, 2.5, 0, Math.PI * 2);
    ctx.arc(-3, 14, 2.5, 0, Math.PI * 2);
    ctx.arc(3, 14, 2.5, 0, Math.PI * 2);
    ctx.arc(6, 14, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  renderEnemies(ctx) {
    for (const enemy of this.enemies) {
      if (enemy.isDead || !enemy.active) continue;

      ctx.save();
      ctx.translate(enemy.x, enemy.y);

      // White hurt flash / i-frame transparency & luminous hit glow (Fixes BUG-04)
      if (enemy.invulnTimer > 0) {
        if (Math.floor(enemy.age * 28) % 2 === 0) {
          ctx.globalAlpha = 0.45;
        }
        if (enemy.invulnTimer > 0.08) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 14;
        }
      }

      if (enemy.type === 'bramble_slime') {
        const hop = Math.abs(Math.sin(enemy.age * 5));
        const sX = (1.0 + (1 - hop) * 0.2) * enemy.direction;
        const sY = (0.8 + hop * 0.4) * enemy.squish;

        // Ground Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
        ctx.beginPath();
        ctx.ellipse(0, 12, 16 * Math.abs(sX), 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.scale(sX, sY);

        // Translucent Jelly Slime Body
        const slimeGrad = ctx.createRadialGradient(0, -6, 2, 0, -6, 18);
        slimeGrad.addColorStop(0, '#4ADE80');
        slimeGrad.addColorStop(0.7, '#22C55E');
        slimeGrad.addColorStop(1, '#15803D');
        ctx.fillStyle = slimeGrad;
        ctx.strokeStyle = '#14532D';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-14, -18, 28, 28, [14, 14, 8, 8]);
        ctx.fill();
        ctx.stroke();

        // Internal Glowing Thorn Seed Core
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Spiky Bramble Horns on Top
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.moveTo(-8, -16);
        ctx.lineTo(-12, -24);
        ctx.lineTo(-4, -18);
        ctx.moveTo(8, -16);
        ctx.lineTo(12, -24);
        ctx.lineTo(4, -18);
        ctx.fill();

        // Angry-Cute Bead Eyes
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.arc(-5, -8, 2.5, 0, Math.PI * 2);
        ctx.arc(5, -8, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlights
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-6, -9, 0.8, 0, Math.PI * 2);
        ctx.arc(4, -9, 0.8, 0, Math.PI * 2);
        ctx.fill();
      } else if (enemy.type === 'shadow_wisp') {
        const pulse = Math.sin(enemy.age * 6) * 2;
        const wingFlap = Math.sin(enemy.age * 12) * 0.4;

        // Purple Mist Aura Glow
        const wispGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, 24 + pulse);
        wispGlow.addColorStop(0, 'rgba(192, 132, 252, 0.6)');
        wispGlow.addColorStop(0.5, 'rgba(126, 34, 206, 0.3)');
        wispGlow.addColorStop(1, 'rgba(126, 34, 206, 0)');
        ctx.fillStyle = wispGlow;
        ctx.beginPath();
        ctx.arc(0, 0, 24 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Translucent Spirit Wings
        ctx.fillStyle = 'rgba(216, 180, 254, 0.55)';
        ctx.strokeStyle = '#A855F7';
        ctx.lineWidth = 1.2;

        // Left Wing
        ctx.save();
        ctx.rotate(-0.3 + wingFlap);
        ctx.beginPath();
        ctx.ellipse(-14, -6, 12, 6, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Right Wing
        ctx.save();
        ctx.rotate(0.3 - wingFlap);
        ctx.beginPath();
        ctx.ellipse(14, -6, 12, 6, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Central Twilight Spirit Orb
        const orbGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 10);
        orbGrad.addColorStop(0, '#F3E8FF');
        orbGrad.addColorStop(0.6, '#9333EA');
        orbGrad.addColorStop(1, '#581C87');
        ctx.fillStyle = orbGrad;
        ctx.strokeStyle = '#3B0764';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Glowing Cyclops Eye
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.ellipse(0, -1, 3.5, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1E1B4B';
        ctx.beginPath();
        ctx.ellipse(0, -1, 1.8, 3.2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (enemy.type === 'thorn_beetle') {
        ctx.scale(enemy.direction, 1.0);

        const legStep = enemy.stunTimer > 0 ? 0 : Math.sin(enemy.age * (enemy.isCharging ? 24 : 12)) * 3;

        // Ground Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.ellipse(0, 14, 18, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Skittering Bug Legs
        ctx.strokeStyle = '#271003';
        ctx.lineWidth = 2;
        for (let i = -1; i <= 1; i++) {
          const lx = i * 8;
          const lOffset = i % 2 === 0 ? legStep : -legStep;
          ctx.beginPath();
          ctx.moveTo(lx, 6);
          ctx.lineTo(lx - 4, 10);
          ctx.lineTo(lx - 2 + lOffset, 14);
          ctx.stroke();
        }

        // Armored Shell Carapace
        const shellGrad = ctx.createLinearGradient(-14, -14, 14, 10);
        shellGrad.addColorStop(0, '#92400E');
        shellGrad.addColorStop(0.7, '#78350F');
        shellGrad.addColorStop(1, '#451A03');
        ctx.fillStyle = shellGrad;
        ctx.strokeStyle = '#1C0A00';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.roundRect(-14, -10, 24, 18, [12, 8, 4, 6]);
        ctx.fill();
        ctx.stroke();

        // Dorsal Thorn Spikes
        ctx.fillStyle = '#B91C1C';
        ctx.strokeStyle = '#7F1D1D';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(-8, -17);
        ctx.lineTo(-4, -10);
        ctx.moveTo(-2, -10);
        ctx.lineTo(0, -18);
        ctx.lineTo(4, -10);
        ctx.fill();
        ctx.stroke();

        // Head & Rhino Horn
        ctx.fillStyle = '#451A03';
        ctx.beginPath();
        ctx.roundRect(8, -6, 8, 12, [2, 6, 6, 2]);
        ctx.fill();
        ctx.stroke();

        // Sharp Horn
        ctx.fillStyle = '#78350F';
        ctx.beginPath();
        ctx.moveTo(14, -2);
        ctx.lineTo(24, -8);
        ctx.lineTo(16, 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Glowing Red Charging Eye / Dazed Eye
        ctx.fillStyle = enemy.isCharging ? '#EF4444' : (enemy.stunTimer > 0 ? '#FDE047' : '#F97316');
        ctx.beginPath();
        ctx.arc(12, -2, enemy.isCharging ? 2.8 : 2.0, 0, Math.PI * 2);
        ctx.fill();

        if (enemy.isCharging) {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(11.5, -2.5, 1.0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Dazed stun stars animation
        if (enemy.stunTimer > 0) {
          const starAngle = enemy.age * 8;
          ProceduralPrimitives.circle(ctx, Math.cos(starAngle) * 9, -20 + Math.sin(starAngle) * 3, 2, '#FEF08A');
          ProceduralPrimitives.circle(ctx, Math.cos(starAngle + Math.PI) * 9, -20 + Math.sin(starAngle + Math.PI) * 3, 2, '#FEF08A');
        }
      }

      // Overhead Enemy Health Bar (Fixes BUG-04)
      if (enemy.health < enemy.maxHealth && enemy.health > 0) {
        const barW = 28;
        const barH = 4;
        const barX = -barW / 2;
        const barY = -enemy.height / 2 - 10;
        const fillW = Math.max(0, (enemy.health / enemy.maxHealth) * barW);

        // Background Pill
        ProceduralPrimitives.roundedRect(ctx, barX - 1, barY - 1, barW + 2, barH + 2, 2, 'rgba(0, 0, 0, 0.7)');
        // Missing Health
        ProceduralPrimitives.roundedRect(ctx, barX, barY, barW, barH, 2, '#4A151B');
        // Current Health Fill
        ProceduralPrimitives.roundedRect(ctx, barX, barY, fillW, barH, 2, '#FF4757');
      }

      ctx.restore();
    }
  }

  renderLumi(ctx) {
    const { x, y, facingDirection, scaleX, scaleY, state, animTimer, iFrameTimer, vx } = this.player;

    // Hurt i-frame flicker
    if (iFrameTimer > 0 && Math.floor(animTimer * 20) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(x, y);

    // 1. Ambient Bioluminescent Glow Halo
    const haloGrad = ctx.createRadialGradient(0, -10, 4, 0, -10, 34);
    haloGrad.addColorStop(0, 'rgba(167, 243, 208, 0.5)');
    haloGrad.addColorStop(0.6, 'rgba(110, 231, 183, 0.2)');
    haloGrad.addColorStop(1, 'rgba(110, 231, 183, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, -10, 34, 0, Math.PI * 2);
    ctx.fill();

    // 2. Ground Contact Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 12 * Math.abs(scaleX), 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Direction & Squash/Stretch
    ctx.scale(facingDirection * scaleX, scaleY);

    let bodyTilt = 0;
    let capeSway = Math.sin(animTimer * 10) * 4;
    let antennaWiggle = Math.sin(animTimer * 8) * 0.15;

    if (state === 'RUN') {
      bodyTilt = (Math.abs(vx) / 220) * 0.14;
      capeSway = Math.sin(animTimer * 16) * 7;
    } else if (state === 'JUMP') {
      bodyTilt = -0.08;
      capeSway = 8;
      antennaWiggle = -0.25;
    } else if (state === 'LEAF_DASH') {
      bodyTilt = 0.35;
      capeSway = 14;
    } else if (state === 'WIND_GLIDE') {
      capeSway = Math.sin(animTimer * 6) * 3;
      antennaWiggle = Math.sin(animTimer * 6) * 0.1;
    } else if (state === 'ATTACK') {
      bodyTilt = 0.18;
      capeSway = 10;
      antennaWiggle = 0.3;
    }

    ctx.rotate(bodyTilt);

    // 4. Leaf Cape (Trailing behind)
    ctx.save();
    ctx.fillStyle = '#4ADE80';
    ctx.strokeStyle = '#16A34A';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-6, -6);
    ctx.quadraticCurveTo(-14 - capeSway, -2, -18 - capeSway, 8);
    ctx.quadraticCurveTo(-10, 12, -2, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Leaf vein detail
    ctx.strokeStyle = 'rgba(22, 163, 74, 0.6)';
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.quadraticCurveTo(-12 - capeSway * 0.6, 2, -16 - capeSway, 6);
    ctx.stroke();
    ctx.restore();

    // 5. Bioluminescent Antennae
    ctx.save();
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, -18);
    ctx.quadraticCurveTo(-10 + antennaWiggle * 10, -28, -8 + antennaWiggle * 15, -34);
    ctx.stroke();
    // Left Glowing Bulb
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.arc(-8 + antennaWiggle * 15, -34, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Right Antenna
    ctx.beginPath();
    ctx.moveTo(4, -18);
    ctx.quadraticCurveTo(8 - antennaWiggle * 10, -28, 11 - antennaWiggle * 15, -33);
    ctx.stroke();
    // Right Glowing Bulb
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.arc(11 - antennaWiggle * 15, -33, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. Main Spirit Body (Teardrop Capsule)
    const bodyGrad = ctx.createLinearGradient(0, -22, 0, 12);
    bodyGrad.addColorStop(0, '#E0FAFF');
    bodyGrad.addColorStop(1, '#A7F3D0');
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-12, -20, 24, 30, [12, 12, 10, 10]);
    ctx.fill();
    ctx.stroke();

    // 7. Cheeks Blush
    ctx.fillStyle = 'rgba(255, 120, 150, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-7, -4, 3.5, 2.2, 0, 0, Math.PI * 2);
    ctx.ellipse(7, -4, 3.5, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 8. Eyes & Dual Catchlights
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.ellipse(-5, -8, 2.8, 4.2, 0, 0, Math.PI * 2);
    ctx.ellipse(5, -8, 2.8, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Primary Catchlight
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-6, -10, 1.4, 0, Math.PI * 2);
    ctx.arc(4, -10, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Secondary Micro Catchlight
    ctx.beginPath();
    ctx.arc(-4, -6.5, 0.7, 0, Math.PI * 2);
    ctx.arc(6, -6.5, 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Cute Woodland Smile
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, -2.5, 2.5, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Spirit Spark / Leaf Slash Arc (During Attack — Forward or Upward Crescent Blade)
    if (state === 'ATTACK') {
      ctx.save();
      const progress = 1 - Math.max(0, this.player.attackTimer / 0.20);
      const isUp = !!this.player.isUpwardAttack;

      if (isUp) {
        ctx.rotate(-Math.PI * 0.5);
      }

      const startAngle = -Math.PI * 0.45 + progress * Math.PI * 0.15;
      const endAngle = Math.PI * 0.35 + progress * Math.PI * 0.25;

      // Outer Emerald Aura Glow
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(14, -2, 30, startAngle, endAngle);
      ctx.stroke();

      // Radiant Mid Blade Arc
      ctx.strokeStyle = 'rgba(46, 213, 115, 0.95)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(14, -2, 30, startAngle, endAngle);
      ctx.stroke();

      // Sharp Radiant Inner Core
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(14, -2, 30, startAngle, endAngle);
      ctx.stroke();

      // Glowing Blade Tip Star/Sparkle
      const tipX = 14 + Math.cos(endAngle) * 30;
      const tipY = -2 + Math.sin(endAngle) * 30;
      ProceduralPrimitives.circle(ctx, tipX, tipY, 4.5, '#FEF08A', '#FFFFFF', 1.5);
      ctx.restore();
    }

    // 9. Dandelion Parachute Canopy (During Glide)
    if (state === 'WIND_GLIDE') {
      ctx.save();
      // Parachute cords
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-6, -18);
      ctx.lineTo(-18, -46);
      ctx.moveTo(6, -18);
      ctx.lineTo(18, -46);
      ctx.moveTo(0, -18);
      ctx.lineTo(0, -48);
      ctx.stroke();

      // Glowing Dandelion Fluff Canopy
      ctx.fillStyle = '#FEF08A';
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, -48, 22, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Dandelion fluff ribs
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      for (let angle = Math.PI * 0.15; angle < Math.PI * 0.85; angle += 0.25) {
        ctx.beginPath();
        ctx.moveTo(0, -48);
        ctx.lineTo(Math.cos(Math.PI + angle) * 22, -48 - Math.sin(angle) * 22);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Leaf Dash Afterimage Streamers
    if (state === 'LEAF_DASH') {
      ctx.save();
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
      ctx.lineWidth = 2.5;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-16 * i, -10 + (i % 2) * 6);
        ctx.lineTo(-28 * i, -10 + (i % 2) * 6);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Feather Jump Wing Aura
    if (state === 'DOUBLE_JUMP') {
      ctx.save();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -8, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  renderBioluminescentMask(ctx) {
    const zone = ZONES[this.currentZoneId] || ZONES.heart_grove;
    const darkAlpha = zone.darkMaskAlpha || 0.15;

    if (darkAlpha > 0.2) {
      ctx.save();
      ctx.fillStyle = `rgba(5, 15, 20, ${darkAlpha * 0.38})`;
      ctx.fillRect(-1500, -950, 4450, 1900);
      ctx.restore();
    }
  }

  // =========================================================================
  // SCREEN SPACE UI / HUD / MODALS
  // =========================================================================

  renderHUD(ctx) {
    ctx.save();

    // 1. Health Hearts Plaque (Top-Left)
    ProceduralPrimitives.roundedRect(ctx, 16, 12, 112, 36, 12, '#0E1D16', '#22C55E', 1.5);
    for (let h = 0; h < this.player.maxHearts; h++) {
      const hx = 34 + h * 30;
      const hy = 30;
      const isFull = h < this.player.hearts;
      const isLow = this.player.hearts <= 1 && isFull;
      const heartPulse = isLow ? Math.sin(this.gameTime * 8) * 2 : 0;

      // Heart Base Gem
      ProceduralPrimitives.circle(ctx, hx, hy, 10 + heartPulse, isFull ? '#EF4444' : '#334155', '#1E293B', 1.5);
      if (isFull) {
        // Ruby Core Highlight
        ctx.fillStyle = '#FF758F';
        ProceduralPrimitives.circle(ctx, hx - 3, hy - 3, 3 + heartPulse * 0.5);
        ctx.fillStyle = '#FFFFFF';
        ProceduralPrimitives.circle(ctx, hx - 4, hy - 4, 1.2);
      }
    }

    // 2. Sun Seed Tracker Pill (Top-Center)
    ProceduralPrimitives.roundedRect(
      ctx,
      this.virtualWidth / 2 - 85,
      12,
      170,
      36,
      18,
      '#0E1D16',
      '#F59E0B',
      1.8
    );
    // Rotating Sun Seed Icon
    ctx.save();
    ctx.translate(this.virtualWidth / 2 - 58, 30);
    ctx.rotate(this.gameTime * 1.5);
    ctx.fillStyle = '#FEF08A';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.ellipse(0, -6, 2.5, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
    ProceduralPrimitives.circle(ctx, this.virtualWidth / 2 - 58, 30, 4.5, '#FFFFFF', '#F59E0B', 1.2);

    ctx.fillStyle = '#FEF08A';
    ctx.font = "bold 15px 'Fredoka', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`SEEDS: ${this.collectedSeeds.size} / ${this.totalSeeds}`, this.virtualWidth / 2 + 16, 31);

    // 3. Ability Badges (Positioned with clearance for top-right Mute button)
    const badges = [
      { key: 'featherJump', icon: '🕊️', name: 'Double Jump', unlocked: this.abilities.featherJump, color: '#34D399' },
      { key: 'leafDash', icon: '🍃', name: 'Leaf Dash', unlocked: this.abilities.leafDash, color: '#38BDF8' },
      { key: 'windGlide', icon: '🪂', name: 'Wind Glide', unlocked: this.abilities.windGlide, color: '#FACC15' }
    ];
    badges.forEach((b, idx) => {
      const bx = this.virtualWidth - 170 + idx * 34;
      const by = 30;
      ProceduralPrimitives.circle(ctx, bx, by, 13, b.unlocked ? '#0E1D16' : '#1E293B', b.unlocked ? b.color : '#475569', b.unlocked ? 2 : 1.2);
      if (b.unlocked) {
        ctx.save();
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = "13px 'Fredoka', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.icon, bx, by);
        ctx.restore();
      } else {
        ctx.fillStyle = '#64748B';
        ctx.font = "11px 'Fredoka', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔒', bx, by);
      }
    });

    ctx.restore();
  }

  renderZoneBanner(ctx) {
    if (this.zoneBanner.timer > 0) {
      ctx.save();
      ctx.globalAlpha = this.zoneBanner.alpha;
      const bw = 240;
      const bh = 34;
      const bx = (this.virtualWidth - bw) / 2;
      const by = 60;
      ProceduralPrimitives.roundedRect(ctx, bx, by, bw, bh, 17, 'rgba(15, 23, 42, 0.9)', '#38BDF8', 1.5);
      ctx.fillStyle = '#F8FAFC';
      ctx.font = "bold 15px 'Fredoka', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.zoneBanner.name, this.virtualWidth / 2, by + bh / 2);
      ctx.restore();
    }
  }

  renderToastBanner(ctx) {
    if (this.toast.active) {
      ctx.save();
      const tw = 380;
      const th = 48;
      const tx = (this.virtualWidth - tw) / 2;
      const ty = 68; // Positioned top-center below seed tracker, avoiding DialogueBox (Y=307..432)
      ProceduralPrimitives.roundedRect(ctx, tx, ty, tw, th, 12, 'rgba(15, 23, 42, 0.95)', this.toast.color, 2);
      ctx.fillStyle = this.toast.color;
      ctx.font = "bold 14px 'Fredoka', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(this.toast.title, this.virtualWidth / 2, ty + 18);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = "12px 'Nunito', sans-serif";
      ctx.fillText(this.toast.subtitle, this.virtualWidth / 2, ty + 36);
      ctx.restore();
    }
  }

  renderOverlayScreens(ctx) {
    // 1. Pause Screen Overlay
    if (this.fsm.currentState === 'PAUSED') {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);

      ctx.fillStyle = '#FEF08A';
      ctx.font = "bold 32px 'Fredoka', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText('GAME PAUSED', this.virtualWidth / 2, 140);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = "16px 'Nunito', sans-serif";
      ctx.fillText(`Seeds Collected: ${this.collectedSeeds.size} / ${this.totalSeeds}`, this.virtualWidth / 2, 190);
      ctx.fillText(`Current Realm: ${ZONES[this.currentZoneId]?.name || 'Heart Grove'}`, this.virtualWidth / 2, 220);

      ProceduralPrimitives.roundedRect(ctx, this.virtualWidth / 2 - 110, 260, 220, 38, 19, '#38BDF8', '#FFFFFF', 1.5);
      ctx.fillStyle = '#0F172A';
      ctx.font = "bold 15px 'Fredoka', sans-serif";
      ctx.fillText('RESUME [E / Esc]', this.virtualWidth / 2, 280);

      ProceduralPrimitives.roundedRect(ctx, this.virtualWidth / 2 - 110, 310, 220, 34, 17, 'rgba(239, 68, 68, 0.25)', '#EF4444', 1.2);
      ctx.fillStyle = '#FCA5A5';
      ctx.font = "bold 13px 'Fredoka', sans-serif";
      ctx.fillText('🗑️ RESET SAVE [R]', this.virtualWidth / 2, 328);
      ctx.restore();
    }

    // 2. Ability Unlocked Modal Card Overlay
    else if (this.fsm.currentState === 'ABILITY_UNLOCKED' && this.activeAbilityModal) {
      const modal = this.activeAbilityModal;
      ctx.save();

      // Frosted Glass Dark Dimmed Backdrop
      ctx.fillStyle = 'rgba(5, 12, 8, 0.78)';
      ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);

      const mw = 440;
      const mh = 260;
      const mx = (this.virtualWidth - mw) / 2;
      const my = (this.virtualHeight - mh) / 2;

      // Card Background with Glowing Themed Border
      ProceduralPrimitives.groundShadow(ctx, mx + mw / 2, my + mh / 2 + 6, mw / 2 + 10, mh / 2 + 10, 0.45);
      ProceduralPrimitives.roundedRect(ctx, mx, my, mw, mh, 16, '#0B1510', modal.color, 2.5);

      // Top-Right [✖] Close Button
      const closeX = mx + mw - 36;
      const closeY = my + 14;
      ProceduralPrimitives.roundedRect(ctx, closeX, closeY, 22, 22, 6, '#1F2937', '#EF4444', 1.2);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = "bold 13px 'Fredoka', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✖', closeX + 11, closeY + 11);

      // Large Glowing Ability Emblem
      ctx.save();
      ctx.shadowColor = modal.color;
      ctx.shadowBlur = 16;
      ProceduralPrimitives.circle(ctx, this.virtualWidth / 2, my + 52, 28, '#162C20', modal.color, 2.2);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = "26px 'Fredoka', sans-serif";
      ctx.fillText(modal.icon, this.virtualWidth / 2, my + 53);
      ctx.restore();

      // Header Title
      ctx.fillStyle = '#FEF08A';
      ctx.font = "bold 18px 'Fredoka', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`✦ ${modal.name.toUpperCase()} UNLOCKED! ✦`, this.virtualWidth / 2, my + 104);

      // Description Instructions
      ctx.fillStyle = '#E2E8F0';
      ctx.font = "14px 'Nunito', sans-serif";
      const lines = modal.instruction.split('\n');
      lines.forEach((line, idx) => {
        ctx.fillText(line, this.virtualWidth / 2, my + 136 + idx * 22);
      });

      // Bottom [✖ Continue] Button CTA
      const btnW = 220;
      const btnH = 34;
      const btnX = (this.virtualWidth - btnW) / 2;
      const btnY = my + mh - 46;
      ProceduralPrimitives.roundedRect(ctx, btnX, btnY, btnW, btnH, 10, modal.color, '#FFFFFF', 1.5);
      ctx.fillStyle = '#0F172A';
      ctx.font = "bold 14px 'Fredoka', sans-serif";
      ctx.fillText('Continue [✖]', this.virtualWidth / 2, btnY + btnH / 2);

      ctx.restore();
    }

    // 3. Victory Finale Screen Overlay
    else if (this.fsm.currentState === 'VICTORY_CUTSCENE' && this.victoryState.statsShown) {
      ctx.save();
      const vw = 500;
      const vh = 320;
      const vx = (this.virtualWidth - vw) / 2;
      const vy = (this.virtualHeight - vh) / 2;

      ProceduralPrimitives.roundedRect(ctx, vx, vy, vw, vh, 20, 'rgba(15, 23, 42, 0.96)', '#FEF08A', 3);

      ctx.fillStyle = '#FDE047';
      ctx.font = "bold 28px 'Fredoka', cursive, sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText('🌟 THE GREAT BLOOM RESTORED! 🌟', this.virtualWidth / 2, vy + 45);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = "15px 'Nunito', sans-serif";
      ctx.fillText('The Great Elder Tree awakens in radiant golden light!', this.virtualWidth / 2, vy + 75);

      // Stats Table
      const minutes = Math.floor(this.gameTime / 60);
      const seconds = Math.floor(this.gameTime % 60).toString().padStart(2, '0');

      ctx.font = "bold 15px 'Fredoka', sans-serif";
      ctx.textAlign = 'left';
      const sx = vx + 60;
      let sy = vy + 120;
      ctx.fillStyle = '#38BDF8';
      ctx.fillText('• Exploration Time:', sx, sy);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`${minutes}:${seconds}`, sx + 220, sy);

      sy += 30;
      ctx.fillStyle = '#38BDF8';
      ctx.fillText('• Ancient Sun Seeds:', sx, sy);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`${this.collectedSeeds.size} / 8 (100%)`, sx + 220, sy);

      sy += 30;
      ctx.fillStyle = '#38BDF8';
      ctx.fillText('• Abilities Mastered:', sx, sy);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('3 / 3 (Feather, Dash, Glide)', sx + 220, sy);

      sy += 30;
      ctx.fillStyle = '#38BDF8';
      ctx.fillText('• Secret Sanctum Found:', sx, sy);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(this.secretsFound.size > 0 ? 'Yes (100%)' : 'None', sx + 220, sy);

      // Continue exploring button
      ProceduralPrimitives.roundedRect(ctx, this.virtualWidth / 2 - 130, vy + 250, 260, 42, 21, '#10B981', '#FFFFFF', 1.5);
      ctx.fillStyle = '#06110A';
      ctx.font = "bold 16px 'Fredoka', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText('CONTINUE EXPLORING [E]', this.virtualWidth / 2, vy + 277);

      ctx.restore();
    }
  }
}

// Bootstrap Game on Window Load
window.addEventListener('DOMContentLoaded', () => {
  const game = new GroveOdysseyGame();
  window.__groveOdysseyInstance = game;
  game.start();

  const handleGlobalStart = () => {
    if (window.__groveOdysseyInstance && window.__groveOdysseyInstance.fsm.currentState === 'TITLE') {
      window.__groveOdysseyInstance.audio.init();
      window.__groveOdysseyInstance.audio.playButtonClick();
      window.__groveOdysseyInstance.fsm.transitionTo('PLAYING');
    }
  };

  window.addEventListener('pointerdown', handleGlobalStart, { passive: true });
  window.addEventListener('click', handleGlobalStart, { passive: true });
  window.addEventListener('keydown', handleGlobalStart, { passive: true });
});
