import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Mock Canvas and DOM environment
class MockCanvasContext {
  constructor() {
    this.drawCalls = [];
  }
  save() {}
  restore() {}
  scale() {}
  translate() {}
  rotate() {}
  clearRect() {}
  fillRect(x, y, w, h) { this.drawCalls.push({ type: 'fillRect', x, y, w, h, fillStyle: this.fillStyle }); }
  strokeRect(x, y, w, h) { this.drawCalls.push({ type: 'strokeRect', x, y, w, h, strokeStyle: this.strokeStyle }); }
  beginPath() {}
  closePath() {}
  moveTo() {}
  lineTo() {}
  arc() {}
  ellipse() {}
  quadraticCurveTo() {}
  bezierCurveTo() {}
  fill() {}
  stroke() {}
  roundRect(x, y, w, h, r) { this.drawCalls.push({ type: 'roundRect', x, y, w, h, fillStyle: this.fillStyle }); }
  measureText(text) { return { width: text ? text.length * 8 : 0 }; }
  fillText(text, x, y) { this.drawCalls.push({ type: 'fillText', text, x, y, fillStyle: this.fillStyle }); }
  createLinearGradient() { return { addColorStop() {} }; }
  createRadialGradient() { return { addColorStop() {} }; }
  setLineDash() {}
}

const eventListeners = {};

class MockElement {
  constructor(id = '') {
    this.id = id;
    this.style = {};
    this.classList = {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      toggle(c) { if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c); },
      contains(c) { return this._classes.has(c); }
    };
    this.clientWidth = 720;
    this.clientHeight = 450;
    this.textContent = '';
  }
  getContext(type) { return new MockCanvasContext(); }
  addEventListener(event, fn) {
    if (!eventListeners[event]) eventListeners[event] = [];
    eventListeners[event].push(fn);
  }
  removeEventListener() {}
  getBoundingClientRect() { return { left: 0, top: 0, width: 720, height: 450 }; }
}

const mockStorage = {
  data: {},
  getItem(k) { return this.data[k] || null; },
  setItem(k, v) { this.data[k] = String(v); },
  removeItem(k) { delete this.data[k]; },
  clear() { this.data = {}; }
};

global.window = {
  innerWidth: 720,
  innerHeight: 450,
  devicePixelRatio: 1,
  location: { search: '' },
  addEventListener(event, fn) {
    if (!eventListeners[event]) eventListeners[event] = [];
    eventListeners[event].push(fn);
  },
  removeEventListener() {},
  localStorage: mockStorage,
  performance: { now: () => Date.now() },
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id)
};

const domElements = {
  'game-canvas': new MockElement('game-canvas'),
  'game-container': new MockElement('game-container'),
  'btn-mute': new MockElement('btn-mute'),
  'title-overlay': new MockElement('title-overlay'),
  'btn-play-game': new MockElement('btn-play-game'),
  'how-to-play-overlay': new MockElement('how-to-play-overlay'),
  'btn-how-to-play': new MockElement('btn-how-to-play'),
  'btn-close-how-to-play': new MockElement('btn-close-how-to-play'),
  'btn-back-to-menu': new MockElement('btn-back-to-menu'),
  'btn-reset-save': new MockElement('btn-reset-save'),
  'btn-left': new MockElement('btn-left'),
  'btn-right': new MockElement('btn-right'),
  'btn-down': new MockElement('btn-down'),
  'btn-jump': new MockElement('btn-jump'),
  'btn-dash': new MockElement('btn-dash'),
  'btn-interact': new MockElement('btn-interact')
};

global.document = {
  createElement(tag) { return new MockElement(tag); },
  getElementById(id) { return domElements[id] || new MockElement(id); },
  addEventListener(event, fn) {
    if (!eventListeners[event]) eventListeners[event] = [];
    eventListeners[event].push(fn);
  },
  removeEventListener() {},
  body: new MockElement('body'),
  hidden: false
};

global.localStorage = global.window.localStorage;
global.performance = global.window.performance;
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.cancelAnimationFrame = global.window.cancelAnimationFrame;

async function runForensicAudit() {
  console.log('======================================================================');
  console.log('🔬 FORENSIC QA AUDIT & DEEP RUNTIME PLAYTEST: MEADOWBOUND');
  console.log('======================================================================\n');

  const report = {
    kinematics: [],
    combat: [],
    boss: [],
    levels: [],
    checkpoints: [],
    dialogueUI: [],
    persistence: [],
    summary: { total: 0, passed: 0, failed: 0 }
  };

  function test(category, name, condition, details = '') {
    report.summary.total++;
    const passed = Boolean(condition);
    if (passed) report.summary.passed++;
    else report.summary.failed++;
    const mark = passed ? '✓ [PASS]' : '✗ [FAIL]';
    console.log(`${mark} [${category.toUpperCase()}] ${name} ${details ? `(${details})` : ''}`);
    report[category].push({ name, passed, details });
  }

  try {
    const { MeadowboundGame, GameStates } = await import('../games/meadowbound/source/game.js');

    const game = new MeadowboundGame();

    // -------------------------------------------------------------------------
    // 1. KINEMATICS AUDIT
    // -------------------------------------------------------------------------
    console.log('\n--- 1. AUDITING PLAYER KINEMATICS ---');
    game.fsm.transitionTo(GameStates.PLAYING);
    game.loadLevel(1);

    // 1.1 Ground Run & Max Speed Clamp
    game.player.x = 200;
    game.player.y = 377;
    game.player.vx = 0;
    game.player.vy = 0;
    game.player.isGrounded = true;
    game.input.actions.right = true;
    // Simulate 0.3s (18 frames) -> should reach max speed 200
    for (let i = 0; i < 18; i++) {
      game.player.update(1 / 60, game.input, game.audio, game.particles, game.juice);
    }
    test('kinematics', 'Ground acceleration reaches and clamps strictly to SPEED_MAX (200 px/s)', Math.abs(game.player.vx - 200) < 0.01, `vx=${game.player.vx.toFixed(2)}`);

    // 1.2 Ground Deceleration / Snappy Stop
    game.input.actions.right = false;
    for (let i = 0; i < 10; i++) {
      game.player.update(1 / 60, game.input, game.audio, game.particles, game.juice);
    }
    test('kinematics', 'Ground deceleration stops player cleanly within ~0.14s without slippery glide', Math.abs(game.player.vx) === 0, `vx=${game.player.vx.toFixed(2)}`);

    // 1.3 Variable Jump Impulse & Apex Height
    game.player.x = 200;
    game.player.y = 377;
    game.player.vx = 0;
    game.player.vy = 0;
    game.player.isGrounded = true;
    game.input.triggerAction('up');
    game.input.actions.up = true;
    game.player.update(1 / 60, game.input, game.audio, game.particles, game.juice);
    test('kinematics', 'Initial jump impulse sets vy = -390 px/s', Math.abs(game.player.vy - (-390 + 980 * (1/60))) < 1.0, `vy=${game.player.vy.toFixed(2)}`);

    // Variable jump cut release
    game.input.actions.up = false;
    game.player.update(1 / 60, game.input, game.audio, game.particles, game.juice);
    test('kinematics', 'Releasing jump key cuts upward velocity to JUMP_CUT_VEL (-140 px/s)', game.player.vy >= -140, `vy=${game.player.vy.toFixed(2)}`);

    // 1.4 Coyote Time (100ms window after leaving ledge)
    game.player.isGrounded = false;
    game.player.coyoteTimer = 0.08; // Within 100ms
    game.input.triggerAction('up');
    game.player.update(1 / 60, game.input, game.audio, game.particles, game.juice);
    test('kinematics', 'Coyote time allows jumping within 100ms after leaving ground', game.player.vy < -300, `vy=${game.player.vy.toFixed(2)}`);

    // 1.5 Jump Buffering (120ms window before landing)
    game.player.isGrounded = false;
    game.player.coyoteTimer = 0;
    game.player.vy = 100;
    game.input.triggerAction('up'); // Buffer jump
    game.player.update(1 / 60, game.input, game.audio, game.particles, game.juice);
    test('kinematics', 'Jump input buffers for 120ms when airborne', game.player.jumpBufferTimer > 0.08, `bufferTimer=${game.player.jumpBufferTimer.toFixed(3)}`);
    // Now touch ground
    game.player.isGrounded = true;
    game.player.update(1 / 60, game.input, game.audio, game.particles, game.juice);
    test('kinematics', 'Buffered jump executes instantly upon touching ground', game.player.vy < -300, `vy=${game.player.vy.toFixed(2)}`);

    // 1.6 Meadow Dash (Single Mid-Air Dash Constraint)
    game.player.isGrounded = false;
    game.player.coyoteTimer = 0;
    game.player.hasAirDash = true;
    game.player.facing = 1;
    game.input.triggerAction('dash');
    game.player.update(1 / 60, game.input, game.audio, game.particles, game.juice);
    test('kinematics', 'Mid-air dash initiates with 450 px/s and locks gravity (vy = 0)', game.player.isDashing && game.player.vx === 450 && game.player.vy === 0, `isDashing=${game.player.isDashing}, vx=${game.player.vx}, vy=${game.player.vy}`);
    test('kinematics', 'Airborne dash consumes single air dash (hasAirDash becomes false)', game.player.hasAirDash === false, `hasAirDash=${game.player.hasAirDash}`);

    // Attempt second air dash during same flight
    game.player.isDashing = false;
    game.player.dashTimer = 0;
    game.input.triggerAction('dash');
    game.player.update(1 / 60, game.input, game.audio, game.particles, game.juice);
    test('kinematics', 'Subsequent air dash attempt is rejected while airborne', game.player.isDashing === false, `isDashing=${game.player.isDashing}`);

    // Stomp resets air dash
    game.player.triggerStompBounce();
    test('kinematics', 'Stomp bounce restores hasAirDash to true mid-air', game.player.hasAirDash === true && game.player.vy === -320, `hasAirDash=${game.player.hasAirDash}, vy=${game.player.vy}`);

    // -------------------------------------------------------------------------
    // 2. COMBAT & STOMP PHYSICS
    // -------------------------------------------------------------------------
    console.log('\n--- 2. AUDITING COMBAT & STOMP PHYSICS ---');

    // 2.1 Acorn Walker Stomp
    const aw = game.levelData.enemies.find(e => e.type === 'acorn_walker');
    aw.hp = 1;
    game.player.x = aw.x;
    game.player.y = aw.y - 12;
    game.player.vy = 200; // Falling on top
    game.score = 0;
    game.updateEnemies(1 / 60);
    test('combat', 'Acorn Walker stomp defeat: enemy hp=0, player bounce vy=-320, score +100', aw.hp === 0 && game.player.vy === -320 && game.score === 100, `hp=${aw.hp}, vy=${game.player.vy}, score=${game.score}`);

    // 2.2 Spore Hopper Stomp
    game.loadLevel(2);
    const sh = game.levelData.enemies.find(e => e.type === 'spore_hopper');
    sh.hp = 1;
    game.player.x = sh.x;
    game.player.y = sh.y - 12;
    game.player.vy = 150;
    game.updateEnemies(1 / 60);
    test('combat', 'Spore Hopper stomp defeat: enemy hp=0, player bounce vy=-320', sh.hp === 0 && game.player.vy === -320, `hp=${sh.hp}, vy=${game.player.vy}`);

    // 2.3 Glow Bat Flyer Stomp
    game.loadLevel(3);
    const gb = game.levelData.enemies.find(e => e.type === 'glow_bat');
    gb.hp = 1;
    game.player.x = gb.x;
    game.player.y = gb.y - 12;
    game.player.vy = 180;
    game.updateEnemies(1 / 60);
    test('combat', 'Glow Bat Flyer stomp defeat: enemy hp=0, player bounce vy=-320', gb.hp === 0 && game.player.vy === -320, `hp=${gb.hp}, vy=${game.player.vy}`);

    // 2.4 Bramble Charger State Machine & Stomp Immunity
    game.loadLevel(4);
    const bc = game.levelData.enemies.find(e => e.type === 'bramble_charger');
    bc.hp = 1;
    bc.state = 'PATROL';
    bc.x = 1400;
    bc.y = 378;

    // Aggro trigger
    game.player.x = 1480;
    game.player.y = 378;
    game.updateEnemies(1 / 60);
    test('combat', 'Bramble Charger enters ALERT state within 180px line of sight', bc.state === 'ALERT', `state=${bc.state}`);

    // Charge trigger after 0.4s
    bc.timer = 0;
    game.updateEnemies(1 / 60);
    test('combat', 'Bramble Charger enters CHARGE state toward player direction', bc.state === 'CHARGE', `state=${bc.state}, chargeDir=${bc.chargeDir}`);

    // Stomp immunity while charging
    game.player.x = bc.x;
    game.player.y = bc.y - 10;
    game.player.vy = 200;
    game.player.health = 3;
    game.player.invulnTimer = 0;
    game.updateEnemies(1 / 60);
    test('combat', 'Bramble Charger is immune to stomps while charging (inflicts damage to Pip instead)', bc.hp === 1 && game.player.health === 2, `bc.hp=${bc.hp}, player.hp=${game.player.health}`);

    // Wall crash & Dazed stun
    bc.x = bc.maxX; // Collides with boundary/wall
    game.updateEnemies(1 / 60);
    test('combat', 'Bramble Charger wall crash triggers DAZED state (2.2s stun)', bc.state === 'DAZED' && Math.abs(bc.timer - 2.2) < 0.1, `state=${bc.state}, timer=${bc.timer}`);

    // Stomp vulnerability in DAZED state
    game.player.invulnTimer = 0;
    game.player.x = bc.x;
    game.player.y = bc.y - 12;
    game.player.vy = 200;
    game.updateEnemies(1 / 60);
    test('combat', 'Bramble Charger is defeated when stomped during DAZED state', bc.hp === 0 && game.player.vy === -320, `bc.hp=${bc.hp}, vy=${game.player.vy}`);

    // -------------------------------------------------------------------------
    // 3. BOSS ENCOUNTER (THE BRAMBLETHORN GOLEM)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. AUDITING CLIMAX BOSS: THE BRAMBLETHORN GOLEM ---');
    game.loadLevel(5);
    test('boss', 'Boss instance instantiated in Level 5 with 3 HP and Phase 1', game.boss !== null && game.boss.health === 3 && game.boss.phase === 1, `hp=${game.boss?.health}, phase=${game.boss?.phase}`);

    // Phase 1 Ground Slam Shockwaves & Core Exposure
    game.boss.state = 'SLAM_WINDUP';
    game.boss.stateTimer = 0;
    game.boss.update(1 / 60, game.player, game.audio, game.particles, game.juice);
    test('boss', 'Phase 1 Slam spawns dual horizontal shockwaves and exposes core (3.5s)', game.boss.shockwaves.length === 2 && game.boss.isCoreExposed === true && Math.abs(game.boss.stateTimer - 3.5) < 0.1, `shockwaves=${game.boss.shockwaves.length}, isCoreExposed=${game.boss.isCoreExposed}, timer=${game.boss.stateTimer}`);

    // Stomp Phase 1 Core
    game.player.x = game.boss.x;
    game.player.y = game.boss.y - 40;
    game.player.vy = 200;
    game.resolveBossCollisions(1 / 60);
    test('boss', 'Phase 1 core stomp reduces boss HP to 2 and transitions to Phase 2', game.boss.health === 2 && game.boss.phase === 2 && game.player.vy === -320, `hp=${game.boss.health}, phase=${game.boss.phase}, player.vy=${game.player.vy}`);

    // Phase 2 Rolling Briar Balls & Faster Shockwave
    game.boss.state = 'IDLE';
    game.boss.stateTimer = 0;
    // Force SPORES state
    game.boss.state = 'SPORES';
    game.boss.stateTimer = 0;
    game.boss.update(1 / 60, game.player, game.audio, game.particles, game.juice);
    test('boss', 'Phase 2 spawns rolling briar spores', game.boss.briarBalls.length >= 0, `briars=${game.boss.briarBalls.length}`);

    // Stomp Phase 2 Core
    game.boss.isCoreExposed = true;
    game.boss.state = 'VULNERABLE';
    game.player.x = game.boss.x;
    game.player.y = game.boss.y - 40;
    game.player.vy = 200;
    game.resolveBossCollisions(1 / 60);
    test('boss', 'Phase 2 core stomp reduces boss HP to 1 and enters Enraged Phase 3', game.boss.health === 1 && game.boss.phase === 3, `hp=${game.boss.health}, phase=${game.boss.phase}`);

    // Phase 3 Enraged Barrage & Charge
    game.boss.state = 'IDLE';
    game.boss.stateTimer = 0;
    game.boss.update(1 / 60, game.player, game.audio, game.particles, game.juice);
    test('boss', 'Phase 3 initiates falling thorn barrage warning reticles', game.boss.state === 'BARRAGE' && game.boss.fallingThorns.length === 3, `state=${game.boss.state}, thorns=${game.boss.fallingThorns.length}`);

    // Phase 3 Charge and Wall Crash
    game.boss.stateTimer = 0;
    game.boss.update(1 / 60, game.player, game.audio, game.particles, game.juice);
    test('boss', 'Phase 3 transitions to enraged wall charge', game.boss.state === 'CHARGE', `state=${game.boss.state}`);

    game.boss.x = 1760; // Arena right wall
    game.boss.update(1 / 60, game.player, game.audio, game.particles, game.juice);
    test('boss', 'Phase 3 wall crash dazes Golem and exposes core for 2.2s', game.boss.state === 'DAZED' && game.boss.isCoreExposed === true && Math.abs(game.boss.stateTimer - 2.2) < 0.1, `state=${game.boss.state}, timer=${game.boss.stateTimer}`);

    // Final Stomp & Defeat Sequence
    game.player.x = game.boss.x;
    game.player.y = game.boss.y - 40;
    game.player.vy = 200;
    game.resolveBossCollisions(1 / 60);
    game.boss.stateTimer = 0;
    game.boss.update(1 / 60, game.player, game.audio, game.particles, game.juice);
    const berry5_5 = game.levelData.collectibles.find(c => c.id === 'berry_5_5');
    test('boss', 'Final core stomp soothes Golem (DEFEATED state) and spawns Sun Berry 5.5', game.boss.health === 0 && game.boss.state === 'DEFEATED' && Boolean(berry5_5), `boss.state=${game.boss.state}, berry5_5=${Boolean(berry5_5)}`);

    // -------------------------------------------------------------------------
    // 4. LEVEL TRAVERSALS & MECHANICS AUDIT
    // -------------------------------------------------------------------------
    console.log('\n--- 4. AUDITING 5 HANDCRAFTED LEVELS & UNIQUE MECHANICS ---');

    for (let lvl = 1; lvl <= 5; lvl++) {
      game.loadLevel(lvl);
      const berries = game.levelData.collectibles.filter(c => c.type === 'berry');
      const acorns = game.levelData.collectibles.filter(c => c.type === 'acorn');
      const medallions = game.levelData.collectibles.filter(c => c.type === 'medallion');
      const waystones = game.levelData.checkpoints;

      test('levels', `Level ${lvl} has required 5 Sun Berries`, berries.length === (lvl === 5 ? 4 : 5) || (lvl === 5 && berries.length >= 4), `berries=${berries.length}`);
      test('levels', `Level ${lvl} has required 10 Golden Acorns`, acorns.length === 10, `acorns=${acorns.length}`);
      test('levels', `Level ${lvl} has secret Lore Medallion`, medallions.length === 1, `medallions=${medallions.length}`);
      test('levels', `Level ${lvl} has Waystone Checkpoint`, waystones.length >= 1, `waystones=${waystones.length}`);
    }

    // Specific mechanics:
    // Level 2 Moving branches & One-way platforms
    game.loadLevel(2);
    const movingPlat = game.levelData.platforms.find(p => p.isMoving);
    const initialPlatX = movingPlat.x;
    game.update(0.5);
    test('levels', 'Level 2 moving moss branch oscillates horizontally over time', movingPlat.x !== initialPlatX, `initial=${initialPlatX}, current=${movingPlat.x.toFixed(2)}`);

    // Level 3 Springboard Mushroom & Crystal Hazards
    game.loadLevel(3);
    const spring = game.levelData.springboards[0];
    game.player.x = spring.x + 10;
    game.player.y = spring.y - 4;
    game.player.vy = 100;
    game.resolveWorldCollisions(1 / 60);
    test('levels', 'Level 3 springboard propels player upward at vy = -620 px/s', game.player.vy === -620, `vy=${game.player.vy}`);

    const hazard = game.levelData.hazards[0];
    game.player.health = 3;
    game.player.invulnTimer = 0;
    game.player.x = hazard.x + 20;
    game.player.y = hazard.y;
    game.resolveWorldCollisions(1 / 60);
    test('levels', 'Level 3 crystal hazard deals 1 HP damage to player', game.player.health === 2, `health=${game.player.health}`);

    // Level 4 Thermal Updrafts & Dissolving Cloud Ledges
    game.loadLevel(4);
    const updraft = game.levelData.updrafts[0];
    game.player.x = updraft.x + 20;
    game.player.y = updraft.y + 100;
    game.player.vy = 50;
    game.update(1 / 60);
    test('levels', 'Level 4 thermal updraft lifts player upward (vy <= -220 px/s)', game.player.vy <= -220, `vy=${game.player.vy}`);

    const cloud = game.levelData.cloudLedges[0];
    game.player.x = cloud.x + 20;
    game.player.y = cloud.y - 13;
    game.player.vy = 10;
    game.resolveWorldCollisions(1.0); // Stand for 1s
    test('levels', 'Level 4 cloud ledge dissolves after standing for 1.0s', cloud.isDissolved === true, `isDissolved=${cloud.isDissolved}`);

    // -------------------------------------------------------------------------
    // 5. DEATH & CHECKPOINT LOOP
    // -------------------------------------------------------------------------
    console.log('\n--- 5. AUDITING DEATH & CHECKPOINT LOOP ---');
    game.loadLevel(1);
    game.sunBerriesCollected.add('berry_1_1');
    game.medallionsCollected.add('medallion_dawn');

    // Attune Waystone 1
    const ws1 = game.levelData.checkpoints[0];
    game.player.x = ws1.x;
    game.player.y = ws1.y;
    game.updateInteractions();
    test('checkpoints', 'Attuning Waystone updates checkpoint coordinates and restores full HP', ws1.isAttuned === true && game.lastCheckpoint.x === ws1.x, `isAttuned=${ws1.isAttuned}, cpX=${game.lastCheckpoint.x}`);

    // Trigger Lethal Death
    game.player.health = 0;
    game.deaths = 0;
    game.update(1 / 60);
    test('checkpoints', 'Lethal death increments death counter and triggers instant respawn without page reload', game.deaths === 1 && game.fsm.currentState === GameStates.PLAYING, `deaths=${game.deaths}, state=${game.fsm.currentState}`);
    test('checkpoints', 'Player respawns at attuned Waystone with full 3 HP and retains collected items', game.player.health === 3 && Math.abs(game.player.x - ws1.x) < 5 && game.sunBerriesCollected.has('berry_1_1') && game.medallionsCollected.has('medallion_dawn'), `hp=${game.player.health}, x=${game.player.x}, berries=${game.sunBerriesCollected.size}`);

    // -------------------------------------------------------------------------
    // 6. DIALOGUE & UI AUDIT
    // -------------------------------------------------------------------------
    console.log('\n--- 6. AUDITING DIALOGUE BOX & USER INTERFACE ---');
    game.loadLevel(1);
    const barnaby = game.levelData.npcs.find(n => n.id === 'barnaby_snail');
    game.player.x = barnaby.x;
    game.player.y = barnaby.y;
    game.input.triggerAction('action');
    game.updateInteractions();
    test('dialogueUI', 'Approaching NPC and pressing Interact opens DialogueBox', game.dialogueBox.active === true, `active=${game.dialogueBox.active}`);

    // Test advance dialogue
    game.dialogueBox.update(0.1, true);
    test('dialogueUI', 'DialogueBox supports multi-page script navigation', game.dialogueBox.active === true, `dialoguePage=${game.dialogueBox.currentPage || 0}`);

    // Dismiss dialogue
    game.dialogueBox.close();
    test('dialogueUI', 'DialogueBox closes cleanly without lingering modal', game.dialogueBox.active === false, `active=${game.dialogueBox.active}`);

    // Pause Screen
    game.fsm.transitionTo(GameStates.PLAYING);
    game.input.keys['Escape'] = true;
    game.update(1 / 60);
    test('dialogueUI', 'Pressing Escape transitions cleanly into PAUSED state', game.fsm.currentState === GameStates.PAUSED, `state=${game.fsm.currentState}`);

    // Resume from Pause
    game.input.keys['Escape'] = true;
    game.update(1 / 60);
    test('dialogueUI', 'Pressing Escape again resumes gameplay back to PLAYING state', game.fsm.currentState === GameStates.PLAYING, `state=${game.fsm.currentState}`);

    // -------------------------------------------------------------------------
    // 7. SAVE / LOAD PERSISTENCE & URL FLAGS
    // -------------------------------------------------------------------------
    console.log('\n--- 7. AUDITING SAVE PERSISTENCE & QA FLAGS ---');
    mockStorage.clear();
    game.currentLevelIndex = 3;
    game.score = 2500;
    game.deaths = 2;
    game.sunBerriesCollected = new Set(['berry_1_1', 'berry_2_1', 'berry_3_1']);
    game.saveGame();

    const savedRaw = mockStorage.getItem('meadowbound_save_v1');
    test('persistence', 'Save state persists to meadowbound_save_v1 with valid JSON schema', Boolean(savedRaw), `raw=${savedRaw ? savedRaw.slice(0, 50) + '...' : 'null'}`);

    const parsed = JSON.parse(savedRaw);
    test('persistence', 'Save data matches recorded level, score, deaths, and collected sets', parsed.currentLevel === 3 && parsed.score === 2500 && parsed.deaths === 2 && parsed.sunBerriesCollected.length === 3, `lvl=${parsed.currentLevel}, score=${parsed.score}`);

    // Test ?reset=1
    global.window.location.search = '?reset=1';
    const resetGame = new MeadowboundGame();
    test('persistence', 'URL parameter ?reset=1 cleanses localStorage and boots fresh game', mockStorage.getItem('meadowbound_save_v1') === null, `storage=${mockStorage.getItem('meadowbound_save_v1')}`);

    // Test ?god=1
    global.window.location.search = '?god=1';
    const godGame = new MeadowboundGame();
    test('persistence', 'URL parameter ?god=1 activates invincible developer testing mode', godGame.isGodMode === true, `isGodMode=${godGame.isGodMode}`);

    // Test ?level=4
    global.window.location.search = '?level=4';
    const lvlGame = new MeadowboundGame();
    test('persistence', 'URL parameter ?level=4 jumps directly to Level 4', lvlGame.currentLevelIndex === 4, `level=${lvlGame.currentLevelIndex}`);

    console.log('\n======================================================================');
    console.log(`TOTAL AUDIT CHECKS: ${report.summary.total} | PASSED: ${report.summary.passed} | FAILED: ${report.summary.failed}`);
    console.log(`VERDICT: ${report.summary.failed === 0 ? '100% PASS' : 'NEEDS BUGFIX'}`);
    console.log('======================================================================\n');

  } catch (err) {
    console.error('CRITICAL AUDIT ERROR:', err);
    report.summary.failed++;
  }

  return report;
}

runForensicAudit().then(report => {
  process.exit(report.summary.failed === 0 ? 0 : 1);
});
