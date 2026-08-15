/**
 * Easing library and tween scheduler for micro-interactions and transitions.
 */
export const Easings = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutBack: (t, s = 1.70158) => --t * t * ((s + 1) * t + s) + 1,
  easeOutBounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

export class TweenManager {
  constructor() {
    this.tweens = [];
  }

  to(target, properties, duration, options = {}) {
    const startValues = {};
    for (const key of Object.keys(properties)) {
      startValues[key] = target[key] !== undefined ? target[key] : 0;
    }

    const tween = {
      target,
      startValues,
      endValues: properties,
      duration: Math.max(0.001, duration),
      elapsed: 0,
      easing: options.easing || Easings.easeOutQuad,
      onUpdate: options.onUpdate || null,
      onComplete: options.onComplete || null,
      isFinished: false
    };

    this.tweens.push(tween);
    return tween;
  }

  update(dt) {
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const tw = this.tweens[i];
      tw.elapsed += dt;
      const progress = Math.min(1, tw.elapsed / tw.duration);
      const eased = tw.easing(progress);

      for (const [key, endVal] of Object.entries(tw.endValues)) {
        const startVal = tw.startValues[key];
        tw.target[key] = startVal + (endVal - startVal) * eased;
      }

      if (tw.onUpdate) tw.onUpdate(progress);

      if (progress >= 1) {
        tw.isFinished = true;
        if (tw.onComplete) tw.onComplete();
        this.tweens.splice(i, 1);
      }
    }
  }

  killTweensOf(target) {
    this.tweens = this.tweens.filter((t) => t.target !== target);
  }

  clear() {
    this.tweens = [];
  }
}
