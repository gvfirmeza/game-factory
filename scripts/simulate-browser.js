import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Hard safety watchdog
const watchdog = setTimeout(() => {
  console.error('\n[WATCHDOG TIMEOUT] simulate-browser.js timed out. Forcing exit.');
  process.exit(1);
}, 10000);
if (watchdog.unref) watchdog.unref();

const activeTimers = new Set();

// Create mock browser DOM environment
class MockCanvasContext {
  save() {}
  restore() {}
  scale() {}
  translate() {}
  rotate() {}
  clearRect() {}
  fillRect() {}
  strokeRect() {}
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
  roundRect() {}
  measureText(text) { return { width: text ? text.length * 8 : 0 }; }
  fillText() {}
  createLinearGradient() { return { addColorStop() {} }; }
  createRadialGradient() { return { addColorStop() {} }; }
  setLineDash() {}
  clip() {}
}

const eventListeners = {};

class MockElement {
  constructor(id = '') {
    this.id = id;
    this.style = {};
    this.classList = {
      add() {},
      remove() {},
      toggle() {}
    };
    this.clientWidth = 720;
    this.clientHeight = 450;
    this.parentElement = null;
  }
  getContext(type) { return new MockCanvasContext(); }
  addEventListener(event, fn) {
    if (!eventListeners[event]) eventListeners[event] = [];
    eventListeners[event].push(fn);
  }
  removeEventListener(event, fn) {}
  getBoundingClientRect() { return { left: 0, top: 0, width: 720, height: 450 }; }
}

global.window = {
  innerWidth: 720,
  innerHeight: 450,
  devicePixelRatio: 1,
  addEventListener(event, fn) {
    if (!eventListeners[event]) eventListeners[event] = [];
    eventListeners[event].push(fn);
  },
  removeEventListener(event, fn) {},
  localStorage: {
    getItem() { return null; },
    setItem() {}
  },
  performance: { now: () => Date.now() },
  requestAnimationFrame: (cb) => {
    const id = setTimeout(() => {
      activeTimers.delete(id);
      cb();
    }, 16);
    activeTimers.add(id);
    return id;
  },
  cancelAnimationFrame: (id) => {
    clearTimeout(id);
    activeTimers.delete(id);
  }
};

global.document = {
  createElement(tag) { return new MockElement(tag); },
  getElementById(id) { return new MockElement(id); },
  addEventListener(event, fn) {
    if (!eventListeners[event]) eventListeners[event] = [];
    eventListeners[event].push(fn);
  },
  removeEventListener(event, fn) {},
  body: new MockElement('body')
};

global.localStorage = global.window.localStorage;
global.performance = global.window.performance;
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.cancelAnimationFrame = global.window.cancelAnimationFrame;

async function runDeepSimulation() {
  console.log('--- Running Deep Game Simulation ---');
  let success = false;
  try {
    const gameModule = await import('../games/grove-odyssey/source/game.js');

    // Trigger DOMContentLoaded
    if (eventListeners['DOMContentLoaded']) {
      for (const fn of eventListeners['DOMContentLoaded']) {
        fn();
      }
    }

    if (global.window.__groveOdysseyInstance) {
      const game = global.window.__groveOdysseyInstance;
      console.log('Game instance started, state:', game.fsm.currentState);

      console.log('Simulating transition to PLAYING...');
      game.fsm.transitionTo('PLAYING');
      console.log('Current state:', game.fsm.currentState);

      console.log('Simulating 180 active physics frames (3 seconds at 60 FPS)...');
      for (let i = 0; i < 180; i++) {
        game.input.actions.right = true;
        if (i === 15) game.input.triggerAction('up');
        if (i === 45) game.input.triggerAction('dash');
        if (i === 60) game.input.triggerAction('attack');
        game.update(1 / 60);
        game.render(1);
      }

      console.log('Simulating interaction with NPC Barnaby...');
      game.player.x = 240;
      game.player.y = 380;
      game.input.triggerAction('action');
      game.update(1 / 60);
      game.render(1);

      console.log('Dialogue active:', game.dialogueBox.active);

      console.log('Collecting Sun Seed 1...');
      game.player.x = 520;
      game.player.y = 200;
      game.update(1 / 60);
      game.render(1);

      if (game.loop && game.loop.stop) {
        game.loop.stop();
      }

      console.log('SUCCESS: All 180+ simulation frames executed with 0 runtime errors!');
      success = true;
    }
  } catch (err) {
    console.error('SIMULATION ERROR:', err);
    success = false;
  } finally {
    for (const tid of activeTimers) {
      clearTimeout(tid);
    }
    clearTimeout(watchdog);
    process.exit(success ? 0 : 1);
  }
}

runDeepSimulation();
