/**
 * High-precision fixed-timestep game loop with alpha interpolation.
 */
export class GameLoop {
  constructor(optsOrOnUpdate, onRender, step = 1 / 60, maxDelta = 0.1) {
    if (typeof optsOrOnUpdate === 'function') {
      this.onUpdate = optsOrOnUpdate;
      this.onRender = onRender;
      this.step = step;
      this.maxDelta = maxDelta;
    } else {
      const opts = optsOrOnUpdate || {};
      this.onUpdate = opts.onUpdate;
      this.onRender = opts.onRender;
      this.step = opts.step || step;
      this.maxDelta = opts.maxDelta || maxDelta;
    }
    this.lastTime = 0;
    this.accumulator = 0;
    this.running = false;
    this.rafId = null;
    this.tick = this.tick.bind(this);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  tick(time) {
    if (!this.running) return;

    let dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    // Guard against large frame drops (e.g. background tab)
    if (dt > this.maxDelta) {
      dt = this.maxDelta;
    }

    this.accumulator += dt;

    while (this.accumulator >= this.step) {
      if (this.onUpdate) {
        this.onUpdate(this.step);
      }
      this.accumulator -= this.step;
    }

    const alpha = this.accumulator / this.step;
    if (this.onRender) {
      this.onRender(alpha);
    }

    this.rafId = requestAnimationFrame(this.tick);
  }
}
