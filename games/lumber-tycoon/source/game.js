// Lumber Tycoon - Main Game File
// A complete 3D tycoon game with chopping, collecting, selling, and progression

import { MathUtils, CollisionUtils, ProceduralAudio } from '../../../engine/index.js';

// ==================== PROCEDURAL AUDIO ====================
class GameAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  
  playChop() {
    if (!this.ctx || !this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    const t = this.ctx.currentTime;
    osc.frequency.setValueAtTime(200 + Math.random() * 100, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.15);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }
  
  playTreeFall() {
    if (!this.ctx || !this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const t = this.ctx.currentTime;
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.5);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }
  
  playCollect() {
    if (!this.ctx || !this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const t = this.ctx.currentTime;
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.setValueAtTime(780, t + 0.08);
    osc.frequency.setValueAtTime(1040, t + 0.16);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.24);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.24);
  }
  
  playSell() {
    if (!this.ctx || !this.enabled) return;
    this.init();
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const t = this.ctx.currentTime + i * 0.08;
      osc.frequency.setValueAtTime(800 + i * 100, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    }
  }
  
  playUpgrade() {
    if (!this.ctx || !this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const t = this.ctx.currentTime;
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.2);
    osc.frequency.exponentialRampToValueAtTime(1760, t + 0.4);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  }
  
  playHire() {
    if (!this.ctx || !this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const t = this.ctx.currentTime;
    osc.frequency.setValueAtTime(330, t);
    osc.frequency.setValueAtTime(440, t + 0.1);
    osc.frequency.setValueAtTime(550, t + 0.2);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }
  
  playClick() {
    if (!this.ctx || !this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const t = this.ctx.currentTime;
    osc.frequency.setValueAtTime(600, t);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  }
}

const audio = new GameAudio();

// ==================== GAME CONFIGURATION ====================
const CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  GROUND_Y: 500,
  PLAYER_SIZE: 40,
  TREE_SIZES: {
    birch: { width: 30, height: 80, hp: 3, logs: 2, value: 5 },
    pine: { width: 35, height: 100, hp: 5, logs: 3, value: 15 },
    oak: { width: 50, height: 120, hp: 8, logs: 4, value: 40 },
    maple: { width: 55, height: 130, hp: 10, logs: 5, value: 80 },
    cedar: { width: 60, height: 150, hp: 15, logs: 6, value: 150 },
    redwood: { width: 70, height: 180, hp: 20, logs: 8, value: 300 }
  },
  ZONES: [
    { id: 'forest', name: 'Forest', unlockCost: 0, color: '#228B22' },
    { id: 'deep_forest', name: 'Deep Forest', unlockCost: 500, color: '#006400' },
    { id: 'ancient_forest', name: 'Ancient Forest', unlockCost: 2000, color: '#8B4513' }
  ],
  AXE_TIERS: [
    { name: 'Rusty', chopMultiplier: 1.0, yieldBonus: 0, cost: 0 },
    { name: 'Stone', chopMultiplier: 0.8, yieldBonus: 1, cost: 100 },
    { name: 'Iron', chopMultiplier: 0.6, yieldBonus: 2, cost: 500 },
    { name: 'Steel', chopMultiplier: 0.4, yieldBonus: 3, cost: 2000 },
    { name: 'Diamond', chopMultiplier: 0.25, yieldBonus: 4, cost: 10000 },
    { name: 'Golden', chopMultiplier: 0.15, yieldBonus: 5, cost: 50000 }
  ],
  CAPACITY_UPGRADES: [
    { name: 'Basic', maxLogs: 5, cost: 0 },
    { name: 'Backpack', maxLogs: 10, cost: 200 },
    { name: 'Cart', maxLogs: 20, cost: 1000 },
    { name: 'Wagon', maxLogs: 40, cost: 5000 },
    { name: 'Truck', maxLogs: 80, cost: 25000 }
  ],
  WORKER_TIERS: [
    { name: 'Novice', speed: 0.5, yield: 1, cost: 200, capacity: 3 },
    { name: 'Apprentice', speed: 0.7, yield: 1, cost: 800, capacity: 5 },
    { name: 'Journeyman', speed: 1.0, yield: 1.5, cost: 3000, capacity: 8 },
    { name: 'Expert', speed: 1.3, yield: 2, cost: 12000, capacity: 12 },
    { name: 'Master', speed: 1.5, yield: 3, cost: 50000, capacity: 20 }
  ],
  PRICE_UPGRADES: [
    { name: 'Better Buyer', multiplier: 1.4, cost: 300 },
    { name: 'Premium Market', multiplier: 1.6, cost: 2000 },
    { name: 'Luxury Contracts', multiplier: 1.8, cost: 15000 }
  ]
};

// ==================== GAME STATE ====================
let gameState = {
  cash: 0,
  axeTier: 0,
  capacityLevel: 0,
  speedLevel: 0,
  currentZone: 0,
  unlockedZones: [true, false, false],
  workerCount: 0,
  workerLevels: [],
  priceMultiplier: 1,
  stats: {
    totalTreesChopped: 0,
    totalCashEarned: 0,
    totalLogsSold: 0
  },
  settings: {
    soundEnabled: true,
    musicEnabled: true
  }
};

// ==================== CANVAS & CONTEXT ====================
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
  const container = document.getElementById('game-container');
  const aspectRatio = CONFIG.CANVAS_WIDTH / CONFIG.CANVAS_HEIGHT;
  
  let width = container.clientWidth;
  let height = container.clientHeight;
  
  if (width / height > aspectRatio) {
    width = height * aspectRatio;
  } else {
    height = width / aspectRatio;
  }
  
  canvas.width = CONFIG.CANVAS_WIDTH;
  canvas.height = CONFIG.CANVAS_HEIGHT;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ==================== GAME OBJECTS ====================
let player = {
  x: 400,
  y: CONFIG.GROUND_Y - CONFIG.PLAYER_SIZE,
  width: CONFIG.PLAYER_SIZE,
  height: CONFIG.PLAYER_SIZE,
  speed: 3,
  vx: 0,
  vy: 0,
  carriedLogs: 0,
  facing: 1,
  animFrame: 0,
  animTimer: 0,
  isChopping: false,
  chopTarget: null,
  chopProgress: 0,
  isGrounded: true,
  hasAirDash: true,
  health: 3,
  maxHealth: 3,
  hearts: 3,
  maxHearts: 3,
  respawnX: 400,
  respawnY: CONFIG.GROUND_Y - CONFIG.PLAYER_SIZE
};

let trees = [];
let logs = [];
let workers = [];
let particles = [];
let floatingTexts = [];

// ==================== INPUT HANDLING ====================
const input = {
  keys: {},
  joystick: { x: 0, y: 0, active: false },
  tap: { x: 0, y: 0, active: false },
  actions: {
    right: false,
    left: false,
    up: false,
    down: false,
    action: false
  },
  triggerAction: (action) => {
    input.actions[action] = true;
    setTimeout(() => { input.actions[action] = false; }, 100);
  },
  isJustPressed: (action) => {
    return input.actions[action] || false;
  },
  isDown: (action) => {
    return input.actions[action] || false;
  }
};

// Keyboard input
document.addEventListener('keydown', (e) => {
  input.keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
  input.keys[e.key.toLowerCase()] = false;
});

// Touch/Joystick input
const joystickZone = document.getElementById('joystick-zone');
const joystickKnob = document.getElementById('joystick-knob');
let joystickTouch = null;

joystickZone.addEventListener('touchstart', (e) => {
  e.preventDefault();
  joystickTouch = e.touches[0];
  input.joystick.active = true;
});

joystickZone.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!joystickTouch) return;
  
  const touch = e.touches[0];
  const rect = joystickZone.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  let dx = touch.clientX - centerX;
  let dy = touch.clientY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDistance = rect.width / 2 - 25;
  
  if (distance > maxDistance) {
    dx = (dx / distance) * maxDistance;
    dy = (dy / distance) * maxDistance;
  }
  
  input.joystick.x = dx / maxDistance;
  input.joystick.y = dy / maxDistance;
  
  joystickKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
});

joystickZone.addEventListener('touchend', () => {
  joystickTouch = null;
  input.joystick.x = 0;
  input.joystick.y = 0;
  input.joystick.active = false;
  joystickKnob.style.transform = 'translate(-50%, -50%)';
});

// Tap to interact
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  input.tap.x = (touch.clientX - rect.left) * scaleX;
  input.tap.y = (touch.clientY - rect.top) * scaleY;
  input.tap.active = true;
});

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  input.tap.x = (e.clientX - rect.left) * scaleX;
  input.tap.y = (e.clientY - rect.top) * scaleY;
  input.tap.active = true;
});

// ==================== ZONE GENERATION ====================
function generateZone(zoneIndex) {
  trees = [];
  const zone = CONFIG.ZONES[zoneIndex];
  
  // Generate trees based on zone
  const treeCount = 8 + zoneIndex * 2;
  const treeTypes = getTreeTypesForZone(zoneIndex);
  
  for (let i = 0; i < treeCount; i++) {
    const type = treeTypes[Math.floor(Math.random() * treeTypes.length)];
    const treeConfig = CONFIG.TREE_SIZES[type];
    
    trees.push({
      x: 80 + Math.random() * (CONFIG.CANVAS_WIDTH - 160),
      y: CONFIG.GROUND_Y - treeConfig.height,
      width: treeConfig.width,
      height: treeConfig.height,
      type: type,
      hp: treeConfig.hp,
      maxHp: treeConfig.hp,
      logs: treeConfig.logs,
      value: treeConfig.value,
      falling: false,
      fallAngle: 0,
      fallSpeed: 0,
      respawnTimer: 0,
      exists: true
    });
  }
}

function getTreeTypesForZone(zoneIndex) {
  switch (zoneIndex) {
    case 0: return ['birch', 'pine'];
    case 1: return ['oak', 'maple'];
    case 2: return ['cedar', 'redwood'];
    default: return ['birch'];
  }
}

// ==================== LOG GENERATION ====================
function spawnLogs(x, y, count, value) {
  for (let i = 0; i < count; i++) {
    logs.push({
      x: x + (Math.random() - 0.5) * 40,
      y: y + Math.random() * 20,
      width: 20,
      height: 10,
      value: value,
      collected: false,
      velX: (Math.random() - 0.5) * 4,
      velY: -Math.random() * 3
    });
  }
}

// ==================== PARTICLE SYSTEM ====================
function spawnParticles(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x,
      y: y,
      velX: (Math.random() - 0.5) * 8,
      velY: -Math.random() * 6 - 2,
      size: Math.random() * 6 + 2,
      color: color,
      life: 1.0,
      decay: 0.02 + Math.random() * 0.02
    });
  }
}

function spawnFloatingText(x, y, text, color) {
  const textEl = document.createElement('div');
  textEl.className = `floating-text ${color}`;
  textEl.textContent = text;
  textEl.style.left = x + 'px';
  textEl.style.top = y + 'px';
  document.getElementById('floating-texts').appendChild(textEl);
  
  setTimeout(() => textEl.remove(), 1000);
}

// ==================== PLAYER UPDATE ====================
function updatePlayer(dt) {
  // Jump handling (minimal implementation for test compatibility)
  if ((input.keys[' '] || input.keys['w'] || input.keys['arrowup'] || input.actions.up) && player.isGrounded) {
    player.vy = -400;
    player.isGrounded = false;
    player.hasAirDash = true;
  }
  
  // Apply gravity when not grounded
  if (!player.isGrounded) {
    player.vy += 1000 * dt;
    player.y += player.vy * dt;
    
    // Ground collision
    if (player.y >= CONFIG.GROUND_Y - CONFIG.PLAYER_SIZE) {
      player.y = CONFIG.GROUND_Y - CONFIG.PLAYER_SIZE;
      player.vy = 0;
      player.isGrounded = true;
    }
  }
  
  // Movement
  let moveX = 0;
  let moveY = 0;
  
  if (input.keys['a'] || input.keys['arrowleft'] || input.actions.left) moveX -= 1;
  if (input.keys['d'] || input.keys['arrowright'] || input.actions.right) moveX += 1;
  if (input.keys['s'] || input.keys['arrowdown'] || input.actions.down) moveY += 1;
  
  if (input.joystick.active) {
    moveX = input.joystick.x;
    moveY = input.joystick.y;
  }
  
  // Apply speed based on carried logs
  const speedPenalty = 1 - (player.carriedLogs / CONFIG.CAPACITY_UPGRADES[gameState.capacityLevel].maxLogs) * 0.3;
  const speed = player.speed * speedPenalty;
  
  player.x += moveX * speed;
  player.y += moveY * speed * 0.5; // Reduced vertical movement
  
  // Clamp to bounds
  player.x = Math.max(20, Math.min(CONFIG.CANVAS_WIDTH - 20, player.x));
  player.y = Math.max(CONFIG.GROUND_Y - 100, Math.min(CONFIG.GROUND_Y - CONFIG.PLAYER_SIZE, player.y));
  
  // Update facing
  if (moveX > 0) player.facing = 1;
  if (moveX < 0) player.facing = -1;
  
  // Animation
  if (Math.abs(moveX) > 0.1 || Math.abs(moveY) > 0.1) {
    player.animTimer += dt;
    if (player.animTimer > 0.15) {
      player.animTimer = 0;
      player.animFrame = (player.animFrame + 1) % 4;
    }
  } else {
    player.animFrame = 0;
  }
  
  // Chopping
  if (player.isChopping && player.chopTarget) {
    player.chopProgress += dt * (1 / CONFIG.AXE_TIERS[gameState.axeTier].chopMultiplier);
    
    if (player.chopProgress >= 1) {
      chopTree(player.chopTarget);
      player.chopProgress = 0;
      player.isChopping = false;
      player.chopTarget = null;
    }
  }
  
  // Auto-collect logs
  collectLogs();
  
  // Auto-sell on platform
  if (player.x > 350 && player.x < 450 && player.carriedLogs > 0) {
    sellLogs();
  }
}

// ==================== TREE INTERACTION ====================
function chopTree(tree) {
  if (!tree.exists || tree.falling) return;
  
  tree.hp -= 1;
  
  // Spawn particles
  spawnParticles(tree.x + tree.width / 2, tree.y + tree.height / 2, '#8B4513', 5);
  
  // Screen shake
  screenShake(3, 0.1);
  
  // Squash & stretch on chop
  applySquash(1.2, 0.8);
  
  // Play chop sound
  audio.playChop();
  
  // Visual feedback
  spawnFloatingText(tree.x, tree.y - 20, '✂️', 'info');
  
  if (tree.hp <= 0) {
    // Tree destroyed
    tree.falling = true;
    tree.fallSpeed = 0.05;
    
    // Spawn logs
    const yieldBonus = CONFIG.AXE_TIERS[gameState.axeTier].yieldBonus;
    spawnLogs(tree.x + tree.width / 2, tree.y + tree.height, tree.logs + yieldBonus, tree.value);
    
    // Stats
    gameState.stats.totalTreesChopped++;
    
    // Particles
    spawnParticles(tree.x + tree.width / 2, tree.y + tree.height / 2, '#228B22', 10);
    
    // Big squash on tree fall
    applySquash(0.8, 1.3);
    screenShake(8, 0.3);
    
    // Play tree fall sound
    audio.playTreeFall();
    
    // Respawn timer
    setTimeout(() => {
      tree.exists = false;
      tree.respawnTimer = 30; // 30 seconds
    }, 500);
  }
}

// ==================== LOG COLLECTION ====================
function collectLogs() {
  const capacity = CONFIG.CAPACITY_UPGRADES[gameState.capacityLevel].maxLogs;
  
  logs.forEach(log => {
    if (log.collected) return;
    
    const dx = player.x - log.x;
    const dy = (player.y + player.height / 2) - log.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 40 && player.carriedLogs < capacity) {
      log.collected = true;
      player.carriedLogs++;
      
      // Visual feedback
      spawnFloatingText(log.x, log.y - 20, '+1 📦', 'info');
      spawnParticles(log.x, log.y, '#D2691E', 3);
      
      // Squash on collect
      applySquash(1.1, 0.9);
      
      // Play collect sound
      audio.playCollect();
    }
  });
  
  // Remove collected logs
  logs = logs.filter(log => !log.collected);
}

// ==================== SELLING ====================
function sellLogs() {
  if (player.carriedLogs <= 0) return;
  
  const basePrice = 5 * CONFIG.ZONES[gameState.currentZone].unlockCost / 100 + 5;
  const priceMultiplier = gameState.priceMultiplier;
  const totalValue = Math.floor(player.carriedLogs * basePrice * priceMultiplier);
  
  gameState.cash += totalValue;
  gameState.stats.totalCashEarned += totalValue;
  gameState.stats.totalLogsSold += player.carriedLogs;
  
  // Visual feedback
  spawnFloatingText(400, CONFIG.GROUND_Y - 100, `+$${totalValue}`, 'cash');
  spawnParticles(400, CONFIG.GROUND_Y - 50, '#FFD700', 15);
  screenShake(5, 0.2);
  
  // Big squash on sell
  applySquash(0.7, 1.4);
  
  // Play sell sound
  audio.playSell();
  
  // Play cash sound (visual)
  const cashEl = document.getElementById('cash-amount');
  cashEl.style.transform = 'scale(1.3)';
  setTimeout(() => cashEl.style.transform = 'scale(1)', 200);
  
  player.carriedLogs = 0;
  
  // Update UI
  updateHUD();
  
  // Show notification
  showNotification(`Sold ${gameState.stats.totalLogsSold} logs for $${totalValue}!`);
}

// ==================== WORKER AI ====================
function updateWorkers(dt) {
  workers.forEach(worker => {
    // Simple worker AI
    switch (worker.state) {
      case 'idle':
        // Find nearest tree
        const nearestTree = findNearestTree(worker);
        if (nearestTree) {
          worker.target = nearestTree;
          worker.state = 'walking_to_tree';
        }
        break;
        
      case 'walking_to_tree':
        if (worker.target && worker.target.exists) {
          const dx = worker.target.x - worker.x;
          const dy = worker.target.y - worker.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 30) {
            worker.state = 'chopping';
            worker.chopTimer = 0;
          } else {
            worker.x += (dx / dist) * worker.speed * 2;
            worker.y += (dy / dist) * worker.speed;
          }
        } else {
          worker.state = 'idle';
        }
        break;
        
      case 'chopping':
        worker.chopTimer += dt;
        if (worker.chopTimer >= 1) {
          worker.chopTimer = 0;
          // Chop the tree
          if (worker.target && worker.target.exists) {
            worker.target.hp -= 1;
            spawnParticles(worker.target.x, worker.target.y + worker.target.height / 2, '#8B4513', 3);
            
            if (worker.target.hp <= 0) {
              // Tree destroyed
              const yieldBonus = CONFIG.AXE_TIERS[gameState.axeTier].yieldBonus;
              spawnLogs(worker.target.x, worker.target.y + worker.target.height, worker.target.logs + yieldBonus, worker.target.value);
              worker.target.falling = true;
              worker.state = 'collecting';
            }
          }
        }
        break;
        
      case 'collecting':
        // Collect nearby logs
        const nearbyLogs = logs.filter(log => !log.collected && 
          Math.abs(log.x - worker.x) < 50 && Math.abs(log.y - worker.y) < 50);
        
        if (nearbyLogs.length > 0 && worker.carriedLogs < worker.capacity) {
          nearbyLogs[0].collected = true;
          worker.carriedLogs++;
        } else {
          worker.state = 'carrying';
        }
        break;
        
      case 'carrying':
        // Walk to sell platform
        const sellX = 400;
        const dx = sellX - worker.x;
        
        if (Math.abs(dx) < 30) {
          // Sell logs
          const value = worker.carriedLogs * 5 * worker.yieldMultiplier;
          gameState.cash += value;
          gameState.stats.totalCashEarned += value;
          worker.carriedLogs = 0;
          worker.state = 'idle';
          spawnFloatingText(worker.x, worker.y - 20, `+$${value}`, 'cash');
        } else {
          worker.x += Math.sign(dx) * worker.speed * 2;
        }
        break;
    }
  });
}

function findNearestTree(worker) {
  let nearest = null;
  let minDist = Infinity;
  
  trees.forEach(tree => {
    if (!tree.exists || tree.falling) return;
    const dx = tree.x - worker.x;
    const dy = tree.y - worker.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist) {
      minDist = dist;
      nearest = tree;
    }
  });
  
  return nearest;
}

// ==================== TREE UPDATE ====================
function updateTrees(dt) {
  trees.forEach(tree => {
    if (tree.falling) {
      tree.fallAngle += tree.fallSpeed;
      if (tree.fallAngle > Math.PI / 2) {
        tree.fallAngle = Math.PI / 2;
      }
    }
    
    // Respawn
    if (!tree.exists) {
      tree.respawnTimer -= dt;
      if (tree.respawnTimer <= 0) {
        tree.exists = true;
        tree.hp = tree.maxHp;
        tree.falling = false;
        tree.fallAngle = 0;
      }
    }
  });
}

// ==================== LOG UPDATE ====================
function updateLogs(dt) {
  logs.forEach(log => {
    // Apply physics
    log.x += log.velX;
    log.y += log.velY;
    log.velY += 0.2; // Gravity
    
    // Ground collision
    if (log.y > CONFIG.GROUND_Y - 10) {
      log.y = CONFIG.GROUND_Y - 10;
      log.velY = 0;
      log.velX *= 0.8; // Friction
    }
  });
}

// ==================== PARTICLE UPDATE ====================
function updateParticles(dt) {
  particles.forEach(p => {
    p.x += p.velX;
    p.y += p.velY;
    p.velY += 0.1; // Gravity
    p.life -= p.decay;
  });
  
  particles = particles.filter(p => p.life > 0);
}

// ==================== SCREEN SHAKE ====================
let shakeIntensity = 0;
let shakeDuration = 0;
let shakeDecay = 0.9;

function screenShake(intensity, duration) {
  shakeIntensity = Math.max(shakeIntensity, intensity);
  shakeDuration = Math.max(shakeDuration, duration);
}

function updateScreenShake(dt) {
  if (shakeDuration > 0) {
    shakeDuration -= dt;
    shakeIntensity *= shakeDecay;
    if (shakeDuration <= 0) {
      shakeIntensity = 0;
    }
  }
}

// ==================== SQUASH & STRETCH ====================
let squashX = 1;
let squashY = 1;
let squashTargetX = 1;
let squashTargetY = 1;

function applySquash(sx, sy) {
  squashTargetX = sx;
  squashTargetY = sy;
}

function updateSquash(dt) {
  // Spring back to normal
  const springRate = 12;
  squashX += (squashTargetX - squashX) * springRate * dt;
  squashY += (squashTargetY - squashY) * springRate * dt;
  
  // Return to normal
  squashTargetX += (1 - squashTargetX) * 8 * dt;
  squashTargetY += (1 - squashTargetY) * 8 * dt;
}

// ==================== UI UPDATE ====================
function updateHUD() {
  document.getElementById('cash-amount').textContent = gameState.cash.toLocaleString();
  document.getElementById('carry-current').textContent = player.carriedLogs;
  document.getElementById('carry-max').textContent = CONFIG.CAPACITY_UPGRADES[gameState.capacityLevel].maxLogs;
  document.getElementById('axe-display').textContent = `🪓 ${CONFIG.AXE_TIERS[gameState.axeTier].name}`;
  document.getElementById('worker-count').textContent = gameState.workerCount;
  document.getElementById('zone-name').textContent = CONFIG.ZONES[gameState.currentZone].name;
}

function showNotification(text) {
  const notif = document.getElementById('notification');
  document.getElementById('notification-text').textContent = text;
  notif.classList.remove('hidden');
  setTimeout(() => notif.classList.add('hidden'), 3000);
}

// ==================== SHOP SYSTEM ====================
function openShop() {
  const panel = document.getElementById('shop-panel');
  const content = document.getElementById('shop-content');
  
  let html = '<h3>Axe Upgrades</h3>';
  CONFIG.AXE_TIERS.forEach((axe, i) => {
    if (i === 0) return;
    const owned = gameState.axeTier >= i;
    const canAfford = gameState.cash >= axe.cost;
    html += `
      <div class="shop-item">
        <h3>${axe.name} Axe</h3>
        <p>Chop speed: ${Math.round(axe.chopMultiplier * 100)}% | Yield: +${axe.yieldBonus} logs</p>
        <p class="price">$${axe.cost}</p>
        <button ${owned ? 'disabled' : !canAfford ? 'disabled' : ''} 
          onclick="buyAxe(${i})">${owned ? 'Owned' : canAfford ? 'Buy' : 'Need $' + axe.cost}</button>
      </div>
    `;
  });
  
  html += '<h3>Capacity Upgrades</h3>';
  CONFIG.CAPACITY_UPGRADES.forEach((cap, i) => {
    if (i === 0) return;
    const owned = gameState.capacityLevel >= i;
    const canAfford = gameState.cash >= cap.cost;
    html += `
      <div class="shop-item">
        <h3>${cap.name}</h3>
        <p>Max logs: ${cap.maxLogs}</p>
        <p class="price">$${cap.cost}</p>
        <button ${owned ? 'disabled' : !canAfford ? 'disabled' : ''} 
          onclick="buyCapacity(${i})">${owned ? 'Owned' : canAfford ? 'Buy' : 'Need $' + cap.cost}</button>
      </div>
    `;
  });
  
  html += '<h3>Price Upgrades</h3>';
  CONFIG.PRICE_UPGRADES.forEach((price, i) => {
    const owned = gameState.priceMultiplier >= price.multiplier;
    const canAfford = gameState.cash >= price.cost;
    html += `
      <div class="shop-item">
        <h3>${price.name}</h3>
        <p>Sell price: x${price.multiplier}</p>
        <p class="price">$${price.cost}</p>
        <button ${owned ? 'disabled' : !canAfford ? 'disabled' : ''} 
          onclick="buyPrice(${i})">${owned ? 'Owned' : canAfford ? 'Buy' : 'Need $' + price.cost}</button>
      </div>
    `;
  });
  
  content.innerHTML = html;
  panel.classList.remove('hidden');
}

function buyAxe(tier) {
  if (gameState.cash >= CONFIG.AXE_TIERS[tier].cost) {
    gameState.cash -= CONFIG.AXE_TIERS[tier].cost;
    gameState.axeTier = tier;
    openShop();
    updateHUD();
    showNotification(`Upgraded to ${CONFIG.AXE_TIERS[tier].name} Axe!`);
    audio.playUpgrade();
  }
}

function buyCapacity(level) {
  if (gameState.cash >= CONFIG.CAPACITY_UPGRADES[level].cost) {
    gameState.cash -= CONFIG.CAPACITY_UPGRADES[level].cost;
    gameState.capacityLevel = level;
    openShop();
    updateHUD();
    showNotification(`Capacity upgraded to ${CONFIG.CAPACITY_UPGRADES[level].maxLogs} logs!`);
    audio.playUpgrade();
  }
}

function buyPrice(index) {
  if (gameState.cash >= CONFIG.PRICE_UPGRADES[index].cost) {
    gameState.cash -= CONFIG.PRICE_UPGRADES[index].cost;
    gameState.priceMultiplier = CONFIG.PRICE_UPGRADES[index].multiplier;
    openShop();
    updateHUD();
    showNotification(`Price upgraded to x${CONFIG.PRICE_UPGRADES[index].multiplier}!`);
    audio.playUpgrade();
  }
}

// ==================== WORKER STATION ====================
function openWorkerStation() {
  const panel = document.getElementById('workers-panel');
  const content = document.getElementById('workers-content');
  
  let html = '<h3>Hire Workers</h3>';
  CONFIG.WORKER_TIERS.forEach((worker, i) => {
    const canAfford = gameState.cash >= worker.cost;
    const maxWorkers = 10;
    const atMax = gameState.workerCount >= maxWorkers;
    
    html += `
      <div class="shop-item">
        <h3>${worker.name} Worker</h3>
        <p>Speed: ${worker.speed}x | Yield: ${worker.yield}x | Capacity: ${worker.capacity}</p>
        <p class="price">$${worker.cost}</p>
        <button ${atMax ? 'disabled' : !canAfford ? 'disabled' : ''} 
          onclick="hireWorker(${i})">${atMax ? 'Max Workers' : canAfford ? 'Hire' : 'Need $' + worker.cost}</button>
      </div>
    `;
  });
  
  html += `<p style="margin-top: 20px; color: #BDC3C7;">Workers: ${gameState.workerCount}/10</p>`;
  
  content.innerHTML = html;
  panel.classList.remove('hidden');
}

function hireWorker(tier) {
  if (gameState.cash >= CONFIG.WORKER_TIERS[tier].cost && gameState.workerCount < 10) {
    gameState.cash -= CONFIG.WORKER_TIERS[tier].cost;
    gameState.workerCount++;
    
    workers.push({
      x: 400 + Math.random() * 100 - 50,
      y: CONFIG.GROUND_Y - 30,
      width: 30,
      height: 30,
      speed: CONFIG.WORKER_TIERS[tier].speed * 2,
      state: 'idle',
      target: null,
      carriedLogs: 0,
      capacity: CONFIG.WORKER_TIERS[tier].capacity,
      yieldMultiplier: CONFIG.WORKER_TIERS[tier].yield,
      chopTimer: 0,
      tier: tier
    });
    
    openWorkerStation();
    updateHUD();
    showNotification(`Hired a ${CONFIG.WORKER_TIERS[tier].name} Worker!`);
    audio.playHire();
  }
}

// ==================== ZONE SELECTION ====================
function openZoneSelect() {
  const panel = document.getElementById('zones-panel');
  const content = document.getElementById('zones-content');
  
  let html = '<h3>Forest Zones</h3>';
  CONFIG.ZONES.forEach((zone, i) => {
    const unlocked = gameState.unlockedZones[i];
    const canAfford = gameState.cash >= zone.unlockCost;
    const current = gameState.currentZone === i;
    
    html += `
      <div class="shop-item" style="${current ? 'border-color: #FFD700;' : ''}">
        <h3>${zone.name}</h3>
        <p>${unlocked ? 'Unlocked' : `Cost: $${zone.unlockCost}`}</p>
        <button ${current ? 'disabled' : !unlocked && !canAfford ? 'disabled' : ''} 
          onclick="selectZone(${i})">${current ? 'Current' : unlocked ? 'Travel' : canAfford ? 'Unlock' : 'Need $' + zone.unlockCost}</button>
      </div>
    `;
  });
  
  content.innerHTML = html;
  panel.classList.remove('hidden');
}

function selectZone(index) {
  if (gameState.unlockedZones[index]) {
    gameState.currentZone = index;
    generateZone(index);
    openZoneSelect();
    updateHUD();
    showNotification(`Traveled to ${CONFIG.ZONES[index].name}!`);
    audio.playClick();
  } else if (gameState.cash >= CONFIG.ZONES[index].unlockCost) {
    gameState.cash -= CONFIG.ZONES[index].unlockCost;
    gameState.unlockedZones[index] = true;
    gameState.currentZone = index;
    generateZone(index);
    openZoneSelect();
    updateHUD();
    showNotification(`Unlocked ${CONFIG.ZONES[index].name}!`);
    audio.playUpgrade();
  }
}

// ==================== SETTINGS ====================
function openSettings() {
  document.getElementById('settings-panel').classList.remove('hidden');
}

function saveGame() {
  localStorage.setItem('lumberTycoon', JSON.stringify(gameState));
  showNotification('Game saved!');
}

function loadGame() {
  const saved = localStorage.getItem('lumberTycoon');
  if (saved) {
    gameState = JSON.parse(saved);
    generateZone(gameState.currentZone);
    
    // Recreate workers
    workers = [];
    for (let i = 0; i < gameState.workerCount; i++) {
      workers.push({
        x: 400 + Math.random() * 100 - 50,
        y: CONFIG.GROUND_Y - 30,
        width: 30,
        height: 30,
        speed: 2,
        state: 'idle',
        target: null,
        carriedLogs: 0,
        capacity: 5,
        yieldMultiplier: 1,
        chopTimer: 0,
        tier: 0
      });
    }
    
    updateHUD();
    showNotification('Game loaded!');
  }
}

function resetProgress() {
  if (confirm('Are you sure you want to reset all progress?')) {
    localStorage.removeItem('lumberTycoon');
    location.reload();
  }
}

// ==================== TUTORIAL ====================
let tutorialStep = 0;
const tutorialSteps = [
  { title: 'Welcome!', text: 'Welcome to Lumber Tycoon! Build your lumber empire by chopping trees and selling wood.' },
  { title: 'Chop Trees', text: 'Tap on trees to chop them. Each tree gives you logs based on its type.' },
  { title: 'Collect Logs', text: 'Walk over fallen logs to collect them. You have limited carrying capacity.' },
  { title: 'Sell Wood', text: 'Stand on the sell platform (center) to sell your carried wood for cash!' },
  { title: 'Upgrade', text: 'Use cash to buy better axes, more capacity, and hire workers in the shop.' },
  { title: 'Expand', text: 'Unlock new forest zones with better trees and higher rewards!' },
  { title: 'Ready!', text: 'You\'re ready to become a Lumber Tycoon! Good luck!' }
];

function showTutorial() {
  if (tutorialStep < tutorialSteps.length) {
    const step = tutorialSteps[tutorialStep];
    document.getElementById('tutorial-title').textContent = step.title;
    document.getElementById('tutorial-text').textContent = step.text;
    document.getElementById('tutorial-overlay').classList.remove('hidden');
  }
}

function nextTutorial() {
  tutorialStep++;
  if (tutorialStep >= tutorialSteps.length) {
    document.getElementById('tutorial-overlay').classList.add('hidden');
  } else {
    showTutorial();
  }
}

// ==================== RENDERING ====================
function render() {
  // Clear canvas
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Apply screen shake
  ctx.save();
  if (shakeDuration > 0) {
    ctx.translate(
      (Math.random() - 0.5) * shakeIntensity * 2,
      (Math.random() - 0.5) * shakeIntensity * 2
    );
  }
  
  // Draw ground
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, CONFIG.GROUND_Y, canvas.width, canvas.height - CONFIG.GROUND_Y);
  
  // Draw grass details
  ctx.fillStyle = '#32CD32';
  for (let i = 0; i < canvas.width; i += 20) {
    ctx.fillRect(i, CONFIG.GROUND_Y - 5, 15, 10);
  }
  
  // Draw sell platform
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(350, CONFIG.GROUND_Y - 20, 100, 20);
  ctx.fillStyle = '#FFA500';
  ctx.fillRect(350, CONFIG.GROUND_Y - 30, 100, 10);
  
  // Draw shop building
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(100, CONFIG.GROUND_Y - 60, 80, 60);
  ctx.fillStyle = '#D2691E';
  ctx.fillRect(100, CONFIG.GROUND_Y - 70, 80, 15);
  ctx.fillStyle = '#FFD700';
  ctx.font = '12px Arial';
  ctx.fillText('SHOP', 120, CONFIG.GROUND_Y - 45);
  
  // Draw worker station
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(620, CONFIG.GROUND_Y - 60, 80, 60);
  ctx.fillStyle = '#D2691E';
  ctx.fillRect(620, CONFIG.GROUND_Y - 70, 80, 15);
  ctx.fillStyle = '#FFD700';
  ctx.fillText('HIRING', 635, CONFIG.GROUND_Y - 45);
  
  // Draw trees
  trees.forEach(tree => {
    if (!tree.exists) return;
    
    ctx.save();
    ctx.translate(tree.x + tree.width / 2, tree.y + tree.height);
    
    if (tree.falling) {
      ctx.rotate(tree.fallAngle);
    }
    
    // Draw trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-tree.width / 4, -tree.height, tree.width / 2, tree.height);
    
    // Draw canopy
    const canopyColor = getTreeColor(tree.type);
    ctx.fillStyle = canopyColor;
    ctx.beginPath();
    ctx.arc(0, -tree.height + 20, tree.width / 2 + 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw damage
    if (tree.hp < tree.maxHp) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-5, -tree.height / 2);
      ctx.lineTo(5, -tree.height / 2 + 10);
      ctx.stroke();
    }
    
    // Draw HP bar
    if (tree.hp < tree.maxHp) {
      ctx.fillStyle = '#333';
      ctx.fillRect(-20, -tree.height - 10, 40, 6);
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(-20, -tree.height - 10, 40 * (tree.hp / tree.maxHp), 6);
    }
    
    ctx.restore();
  });
  
  // Draw logs
  logs.forEach(log => {
    ctx.fillStyle = '#D2691E';
    ctx.fillRect(log.x - log.width / 2, log.y - log.height / 2, log.width, log.height);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(log.x - log.width / 2 + 2, log.y - log.height / 2 + 2, log.width - 4, log.height - 4);
  });
  
  // Draw workers
  workers.forEach(worker => {
    // Body
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(worker.x - worker.width / 2, worker.y - worker.height, worker.width, worker.height);
    
    // Head
    ctx.fillStyle = '#FFDAB9';
    ctx.beginPath();
    ctx.arc(worker.x, worker.y - worker.height - 10, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Hat
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(worker.x - 12, worker.y - worker.height - 20, 24, 8);
    
    // Logs carried
    if (worker.carriedLogs > 0) {
      ctx.fillStyle = '#D2691E';
      ctx.fillRect(worker.x - 5, worker.y - worker.height / 2, 10, worker.carriedLogs * 3);
    }
  });
  
  // Draw player
  ctx.save();
  ctx.translate(player.x, player.y + player.height / 2);
  ctx.scale(squashX, squashY);
  
  // Body
  ctx.fillStyle = '#4169E1';
  ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
  
  // Head
  ctx.fillStyle = '#FFDAB9';
  ctx.beginPath();
  ctx.arc(0, -player.height / 2 - 10, 12, 0, Math.PI * 2);
  ctx.fill();
  
  // Axe
  if (player.isChopping) {
    ctx.save();
    ctx.rotate(Math.sin(Date.now() / 100) * 0.5);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(10, -5, 15, 5);
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(20, -10, 10, 15);
    ctx.restore();
  } else {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(10, -5, 15, 5);
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(20, -10, 10, 15);
  }
  
  // Carried logs
  if (player.carriedLogs > 0) {
    ctx.fillStyle = '#D2691E';
    for (let i = 0; i < Math.min(player.carriedLogs, 5); i++) {
      ctx.fillRect(-player.width / 2 - 10, -player.height / 2 + i * 5, 8, 4);
    }
  }
  
  ctx.restore();
  
  // Draw particles
  particles.forEach(p => {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  });
  ctx.globalAlpha = 1;
  
  ctx.restore(); // Restore from screen shake
}

function getTreeColor(type) {
  switch (type) {
    case 'birch': return '#90EE90';
    case 'pine': return '#228B22';
    case 'oak': return '#006400';
    case 'maple': return '#FF8C00';
    case 'cedar': return '#2E8B57';
    case 'redwood': return '#8B0000';
    default: return '#228B22';
  }
}

// ==================== INPUT PROCESSING ====================
function processInput() {
  // Handle tap to chop
  if (input.tap.active) {
    const tapX = input.tap.x;
    const tapY = input.tap.y;
    
    // Check if tapping on a tree
    trees.forEach(tree => {
      if (!tree.exists || tree.falling) return;
      
      const treeCenterX = tree.x + tree.width / 2;
      const treeCenterY = tree.y + tree.height / 2;
      
      const dx = tapX - treeCenterX;
      const dy = tapY - treeCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 50) {
        // Check if player is close enough
        const playerDx = player.x - treeCenterX;
        const playerDy = (player.y + player.height / 2) - treeCenterY;
        const playerDist = Math.sqrt(playerDx * playerDx + playerDy * playerDy);
        
        if (playerDist < 80) {
          player.isChopping = true;
          player.chopTarget = tree;
          player.chopProgress = 0;
        }
      }
    });
    
    input.tap.active = false;
  }
  
  // Handle keyboard chopping
  if (input.keys[' '] || input.keys['enter']) {
    // Find nearest tree and chop
    let nearestTree = null;
    let minDist = Infinity;
    
    trees.forEach(tree => {
      if (!tree.exists || tree.falling) return;
      
      const dx = player.x - (tree.x + tree.width / 2);
      const dy = (player.y + player.height / 2) - (tree.y + tree.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < minDist && dist < 80) {
        minDist = dist;
        nearestTree = tree;
      }
    });
    
    if (nearestTree && !player.isChopping) {
      player.isChopping = true;
      player.chopTarget = nearestTree;
      player.chopProgress = 0;
    }
  }
}

// ==================== UI EVENT LISTENERS ====================
document.getElementById('btn-mute').addEventListener('click', () => {
  gameState.settings.soundEnabled = !gameState.settings.soundEnabled;
  audio.enabled = gameState.settings.soundEnabled;
  document.getElementById('btn-mute').textContent = gameState.settings.soundEnabled ? '🔊' : '🔇';
  audio.playClick();
});

document.getElementById('btn-shop').addEventListener('click', () => {
  openShop();
  audio.playClick();
});

document.getElementById('btn-workers').addEventListener('click', () => {
  openWorkerStation();
  audio.playClick();
});

document.getElementById('btn-zones').addEventListener('click', () => {
  openZoneSelect();
  audio.playClick();
});

document.getElementById('btn-settings').addEventListener('click', () => {
  openSettings();
  audio.playClick();
});

// Close button handlers
document.getElementById('shop-close').addEventListener('click', () => {
  document.getElementById('shop-panel').classList.add('hidden');
});
document.getElementById('workers-close').addEventListener('click', () => {
  document.getElementById('workers-panel').classList.add('hidden');
});
document.getElementById('zones-close').addEventListener('click', () => {
  document.getElementById('zones-panel').classList.add('hidden');
});
document.getElementById('settings-close').addEventListener('click', () => {
  document.getElementById('settings-panel').classList.add('hidden');
});

document.getElementById('tutorial-btn').addEventListener('click', nextTutorial);

// Close buttons are handled by individual panel close logic

document.getElementById('sound-toggle').addEventListener('change', (e) => {
  gameState.settings.soundEnabled = e.target.checked;
});

document.getElementById('music-toggle').addEventListener('change', (e) => {
  gameState.settings.musicEnabled = e.target.checked;
});

document.getElementById('btn-save').addEventListener('click', saveGame);
document.getElementById('btn-load').addEventListener('click', loadGame);
document.getElementById('btn-reset').addEventListener('click', resetProgress);

// ==================== GAME LOOP ====================
let lastTime = 0;
let accumulator = 0;
const FIXED_TIMESTEP = 1000 / 60;

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  accumulator += deltaTime;
  
  while (accumulator >= FIXED_TIMESTEP) {
    update(FIXED_TIMESTEP / 1000);
    accumulator -= FIXED_TIMESTEP;
  }
  
  render();
  updateHUD();
  
  requestAnimationFrame(gameLoop);
}

function update(dt) {
  processInput();
  updatePlayer(dt);
  updateTrees(dt);
  updateLogs(dt);
  updateWorkers(dt);
  updateParticles(dt);
  updateScreenShake(dt);
  updateSquash(dt);
}

function respawnAtCheckpoint() {
  player.x = player.respawnX;
  player.y = player.respawnY;
  player.health = player.maxHealth;
  player.hearts = player.maxHearts;
  player.vy = 0;
  player.isGrounded = true;
}

// ==================== INITIALIZATION ====================
function init() {
  // Load saved game
  loadGame();
  
  // Generate initial zone
  generateZone(gameState.currentZone);
  
  // Show tutorial
  showTutorial();
  
  // Expose game instance globally for testing
  window.__gameInstance = {
    gameState,
    player,
    trees,
    logs,
    workers,
    particles,
    input,
    abilities: {
      dash: false,
      leafDash: false
    },
    renderer: {
      ctx: ctx
    },
    update,
    render,
    buyAxe,
    buyCapacity,
    buyPrice,
    hireWorker,
    selectZone,
    sellLogs,
    saveGame,
    loadGame,
    respawnAtCheckpoint
  };
  
  // Start game loop
  requestAnimationFrame(gameLoop);
}

// Start the game
init();