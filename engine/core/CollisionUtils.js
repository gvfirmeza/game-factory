/**
 * ============================================================================
 * AI GAME FACTORY — CENTRALIZED COLLISION UTILITIES
 * Swept AABB, Dynamic Lookahead, Corner Rounding & Platform Containment
 * ============================================================================
 */

export class CollisionUtils {
  /**
   * Standard 2D AABB Overlap check with optional padding.
   * @param {Object} a - { x, y, w, h } or { x, y, width, height }
   * @param {Object} b - { x, y, w, h } or { x, y, width, height }
   * @param {number} padding - optional margin reduction (positive shrinks bounding box)
   * @returns {boolean}
   */
  static aabbOverlap(a, b, padding = 0) {
    const aw = (a.w || a.width || 0) - padding * 2;
    const ah = (a.h || a.height || 0) - padding * 2;
    const ax = (a.x !== undefined ? a.x : a.left) + padding;
    const ay = (a.y !== undefined ? a.y : a.top) + padding;

    const bw = (b.w || b.width || 0) - padding * 2;
    const bh = (b.h || b.height || 0) - padding * 2;
    const bx = (b.x !== undefined ? b.x : b.left) + padding;
    const by = (b.y !== undefined ? b.y : b.top) + padding;

    return (
      ax < bx + bw &&
      ax + aw > bx &&
      ay < by + bh &&
      ay + ah > by
    );
  }

  /**
   * Resolve horizontal movement against solid platforms and walls.
   * @param {Object} entity - Entity with x, y, vx, width/w, height/h
   * @param {Array<Object>} platforms - Array of platform objects
   * @param {number} dt - Delta time in seconds
   * @param {number} worldWidth - Level boundary width clamp
   */
  static resolveHorizontal(entity, platforms, dt, worldWidth = Infinity) {
    const halfW = (entity.width || entity.w || 20) / 2;
    const halfH = (entity.height || entity.h || 20) / 2;

    entity.x += entity.vx * dt;
    entity.x = Math.max(halfW, Math.min(worldWidth - halfW, entity.x));

    for (let i = 0; i < platforms.length; i++) {
      const plat = platforms[i];
      if (plat.type === 'one_way') continue; // One-way platforms don't block sides

      const pw = plat.w || plat.width || 0;
      const ph = plat.h || plat.height || 0;

      // Vertical overlap check with 2px tolerance
      if (entity.y + halfH - 2 > plat.y && entity.y - halfH + 2 < plat.y + ph) {
        if (entity.vx > 0 && entity.x + halfW >= plat.x && entity.x - halfW < plat.x) {
          entity.x = plat.x - halfW;
          entity.vx = 0;
        } else if (entity.vx < 0 && entity.x - halfW <= plat.x + pw && entity.x + halfW > plat.x + pw) {
          entity.x = plat.x + pw + halfW;
          entity.vx = 0;
        }
      }
    }
  }

  /**
   * Resolve vertical movement against solid platforms with dynamic lookahead & corner rounding.
   * @param {Object} entity - Entity with x, y, vy, width/w, height/h, isGrounded
   * @param {Array<Object>} platforms - Array of platform objects
   * @param {number} dt - Delta time in seconds
   * @param {number} cornerNudge - Sideways nudge pixel distance (2-4px)
   */
  static resolveVertical(entity, platforms, dt, cornerNudge = 3) {
    const halfW = (entity.width || entity.w || 20) / 2;
    const halfH = (entity.height || entity.h || 20) / 2;

    entity.y += entity.vy * dt;
    entity.isGrounded = false;
    const lookahead = Math.max(entity.vy * dt, 4);

    for (let i = 0; i < platforms.length; i++) {
      const plat = platforms[i];
      const pw = plat.w || plat.width || 0;
      const ph = plat.h || plat.height || 0;

      // Horizontal span overlap
      if (entity.x + halfW - 2 > plat.x && entity.x - halfW + 2 < plat.x + pw) {
        if (entity.vy >= 0) {
          // Landing on platform top
          if (entity.y + halfH <= plat.y + lookahead + 4 && entity.y + halfH >= plat.y - 6) {
            entity.y = plat.y - halfH;
            entity.vy = 0;
            entity.isGrounded = true;
            break;
          }
        } else if (entity.vy < 0 && plat.type !== 'one_way') {
          // Bumping ceiling
          if (entity.y - halfH <= plat.y + ph && entity.y - halfH >= plat.y + ph - 8) {
            // Ceiling corner rounding nudge
            const distLeft = Math.abs((entity.x + halfW) - plat.x);
            const distRight = Math.abs((entity.x - halfW) - (plat.x + pw));

            if (distLeft <= cornerNudge + 2) {
              entity.x -= cornerNudge;
            } else if (distRight <= cornerNudge + 2) {
              entity.x += cornerNudge;
            } else {
              entity.y = plat.y + ph + halfH;
              entity.vy = 0;
            }
          }
        }
      }
    }
  }

  /**
   * Clamp an entity strictly within its designated horizontal patrol bounds.
   * @param {Object} entity - Entity with x, vx, minX, maxX
   * @returns {boolean} True if boundary was reached and direction flipped.
   */
  static clampPatrolBounds(entity) {
    if (entity.minX !== undefined && entity.x <= entity.minX) {
      entity.x = entity.minX;
      entity.vx = Math.abs(entity.vx || 60);
      return true;
    }
    if (entity.maxX !== undefined && entity.x >= entity.maxX) {
      entity.x = entity.maxX;
      entity.vx = -Math.abs(entity.vx || 60);
      return true;
    }
    return false;
  }

  /**
   * Stomp collision detector: checks if player is landing on top of an enemy.
   * @param {Object} player - { x, y, vy, width, height }
   * @param {Object} enemy - { x, y, width, height }
   * @returns {boolean}
   */
  static isStompLanded(player, enemy) {
    const pw = player.width || player.w || 20;
    const ph = player.height || player.h || 20;
    const ew = enemy.width || enemy.w || 24;
    const eh = enemy.height || enemy.h || 24;

    const dx = Math.abs(player.x - enemy.x);
    const dy = player.y - enemy.y;

    // Moving downwards and landing on the top portion
    return (
      player.vy > 0 &&
      dx < (pw + ew) * 0.45 &&
      dy < 0 &&
      Math.abs(dy) < (ph + eh) * 0.55
    );
  }
}
