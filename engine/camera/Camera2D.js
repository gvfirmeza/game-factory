import { MathUtils } from '../core/MathUtils.js';

/**
 * 2D Camera with smooth target following, deadzones, and bounding constraints.
 */
export class Camera2D {
  constructor(viewportWidth = 480, viewportHeight = 800) {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.followSpeed = 6;
    this.shakeX = 0;
    this.shakeY = 0;
    this.bounds = null; // { minX, maxX, minY, maxY }
  }

  setBounds(minX, maxX, minY, maxY) {
    this.bounds = { minX, maxX, minY, maxY };
  }

  lookAt(x, y) {
    this.targetX = x - this.viewportWidth / 2;
    this.targetY = y - this.viewportHeight / 2;
    this.x = this.targetX;
    this.y = this.targetY;
    this.clampToBounds();
  }

  follow(targetX, targetY, dt) {
    this.targetX = targetX - this.viewportWidth / 2;
    this.targetY = targetY - this.viewportHeight * 0.65; // keep player around lower 65% of screen

    this.x = MathUtils.damp(this.x, this.targetX, this.followSpeed, dt);
    this.y = MathUtils.damp(this.y, this.targetY, this.followSpeed, dt);

    this.clampToBounds();
  }

  clampToBounds() {
    if (this.bounds) {
      if (this.bounds.minX !== undefined) this.x = Math.max(this.x, this.bounds.minX);
      if (this.bounds.maxX !== undefined) this.x = Math.min(this.x, this.bounds.maxX - this.viewportWidth);
      if (this.bounds.minY !== undefined) this.y = Math.max(this.y, this.bounds.minY);
      if (this.bounds.maxY !== undefined) this.y = Math.min(this.y, this.bounds.maxY - this.viewportHeight);
    }
  }

  setShakeOffset(x, y) {
    this.shakeX = x;
    this.shakeY = y;
  }
}
