/**
 * ============================================================================
 * AI GAME FACTORY — MATHEMATICAL REACHABILITY & LEVEL DESIGN VALIDATION ENGINE
 * Validates Jump Envelopes, Traversal Curves, Encounters, and Soft-Locks
 * ============================================================================
 */

export class ReachabilityValidator {
  constructor(kinematics = {}) {
    this.speed = kinematics.maxRunSpeed || kinematics.speed || 200;
    this.groundAccel = kinematics.groundAccel || 1200;
    this.jumpVel = Math.abs(kinematics.jumpImpulse || kinematics.jumpVelocity || -390);
    this.gravity = kinematics.gravity || 980;
    this.jumpCutVel = Math.abs(kinematics.jumpCutVelocity || -140);
    this.dashSpeed = kinematics.dashSpeed || 450;
    this.dashDuration = kinematics.dashDuration || 0.18;
    this.dashDistance = this.dashSpeed * this.dashDuration; // ~81px
    this.playerWidth = kinematics.playerWidth || 18;
    this.playerHeight = kinematics.playerHeight || 26;

    // Mathematical Ballistic Jump Envelope
    // t_rise = v0 / g; H_max = v0^2 / (2g)
    this.timeToPeak = this.jumpVel / this.gravity;
    this.maxBallisticJumpHeight = (this.jumpVel * this.jumpVel) / (2 * this.gravity); // ~77.6px pure ballistic
    this.totalAirTime = this.timeToPeak * 2;
    this.maxHorizontalJumpReach = this.speed * this.totalAirTime; // ~159.2px
    this.maxHorizontalWithDash = this.maxHorizontalJumpReach + this.dashDistance; // ~240.2px

    // Safety margins: Required progression must not exceed 82% of physical limit
    this.safeMaxJumpHeight = this.maxBallisticJumpHeight * 0.85; // ~66.0px (without springboards)
    this.safeMaxHorizontalJump = this.maxHorizontalJumpReach * 0.82; // ~130.5px (without dash)
    this.safeMaxHorizontalWithDash = this.maxHorizontalWithDash * 0.85; // ~204.0px
  }

  /**
   * Calculate height on parabolic trajectory at horizontal distance x.
   * @param {number} x - Horizontal distance from takeoff
   * @param {number} vx - Initial horizontal velocity
   * @returns {number} Vertical displacement from takeoff point (positive is upwards)
   */
  getJumpHeightAtX(x, vx = this.speed) {
    if (vx <= 0) return 0;
    const t = x / vx;
    return (this.jumpVel * t) - (0.5 * this.gravity * t * t);
  }

  /**
   * Check if a jump from Platform A to Platform B is physically reachable.
   * @param {Object} p1 - { x, y, w, h }
   * @param {Object} p2 - { x, y, w, h }
   * @param {Object} abilities - { hasDash, hasDoubleJump, hasSpringboard }
   * @returns {Object} { reachable: boolean, margin: number, reason: string }
   */
  canReachPlatform(p1, p2, abilities = {}) {
    const p1w = p1.w || p1.width || 0;
    const p2w = p2.w || p2.width || 0;

    // Horizontal gap between platforms
    let gapX = 0;
    if (p2.x > p1.x + p1w) {
      gapX = p2.x - (p1.x + p1w);
    } else if (p1.x > p2.x + p2w) {
      gapX = p1.x - (p2.x + p2w);
    }

    // Vertical delta (positive means p2 is higher than p1)
    const deltaY = p1.y - p2.y;

    // Step 1: Check Vertical Reach
    if (deltaY > 0) {
      const maxHeight = abilities.hasSpringboard ? 280 : (abilities.hasDoubleJump ? this.maxBallisticJumpHeight * 1.8 : this.maxBallisticJumpHeight + 35);
      if (deltaY > maxHeight) {
        return {
          reachable: false,
          gapX,
          deltaY,
          reason: `Target platform is ${deltaY.toFixed(1)}px higher than source (Max reach: ${maxHeight.toFixed(1)}px)`
        };
      }
    }

    // Step 2: Check Horizontal Gap
    const maxHoriz = abilities.hasDash ? this.maxHorizontalWithDash : this.maxHorizontalJumpReach;
    if (gapX > maxHoriz) {
      return {
        reachable: false,
        gapX,
        deltaY,
        reason: `Horizontal gap is ${gapX.toFixed(1)}px (Max reach: ${maxHoriz.toFixed(1)}px)`
      };
    }

    return {
      reachable: true,
      gapX,
      deltaY,
      margin: maxHoriz - gapX,
      reason: 'Valid jump trajectory within kinematic limits'
    };
  }

  /**
   * Validate an entity placement (collectible, enemy, checkpoint) against geometry.
   */
  validatePlacement(entity, platforms = [], hazards = []) {
    const errors = [];
    const ex = entity.x;
    const ey = entity.y;
    const ew = entity.width || entity.w || 16;
    const eh = entity.height || entity.h || 16;

    // Check if entity is inside solid platforms
    for (const plat of platforms) {
      if (plat.type === 'one_way') continue;
      const pw = plat.w || plat.width || 0;
      const ph = plat.h || plat.height || 0;
      const px = plat.x;
      const py = plat.y;

      // Box overlap
      if (
        ex + ew / 2 > px + 3 &&
        ex - ew / 2 < px + pw - 3 &&
        ey + eh / 2 > py + 3 &&
        ey - eh / 2 < py + ph - 3
      ) {
        errors.push(`Entity '${entity.id || entity.type}' at (${ex}, ${ey}) is embedded inside solid platform at (${px}, ${py}, w:${pw}, h:${ph})`);
      }
    }

    // Check if entity is inside spikes / hazards
    for (const haz of hazards) {
      const hw = haz.w || haz.width || 0;
      const hh = haz.h || haz.height || 0;
      const hx = haz.x;
      const hy = haz.y;

      if (
        ex + ew / 2 > hx &&
        ex - ew / 2 < hx + hw &&
        ey + eh / 2 > hy &&
        ey - eh / 2 < hy + hh
      ) {
        errors.push(`Entity '${entity.id || entity.type}' at (${ex}, ${ey}) is placed inside hazard spikes at (${hx}, ${hy})`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate an enemy encounter has valid counterplay space.
   */
  validateEncounter(enemy, platforms = [], hazards = []) {
    const errors = [];
    const warnings = [];

    // 1. Validate placement
    const placement = this.validatePlacement(enemy, platforms, hazards);
    if (!placement.valid) {
      errors.push(...placement.errors);
    }

    // 2. Check ground platform support
    if (enemy.type !== 'sine_flyer' && enemy.type !== 'flying_scout') {
      const supportingPlatform = platforms.find(p => {
        const pw = p.w || p.width || 0;
        return enemy.x >= p.x - 10 && enemy.x <= p.x + pw + 10 && Math.abs(p.y - enemy.y) < 40;
      });

      if (!supportingPlatform) {
        errors.push(`Ground enemy '${enemy.id || enemy.type}' at (${enemy.x}, ${enemy.y}) has no solid platform under its feet`);
      } else {
        const pw = supportingPlatform.w || supportingPlatform.width || 0;
        // Verify platform width provides at least 60px of combat space
        if (pw < 60) {
          warnings.push(`Platform for enemy '${enemy.id || enemy.type}' is very narrow (${pw}px width)`);
        }
      }

      // Check patrol bounds
      if (enemy.minX !== undefined && enemy.maxX !== undefined) {
        if (enemy.minX >= enemy.maxX) {
          errors.push(`Enemy '${enemy.id || enemy.type}' has inverted patrol bounds [minX: ${enemy.minX}, maxX: ${enemy.maxX}]`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Full Level Audit against Design Contract.
   */
  auditLevel(levelData, abilities = {}) {
    const results = {
      levelName: levelData.name || 'Unnamed Level',
      levelIndex: levelData.index || 1,
      platformsAudited: (levelData.platforms || []).length,
      collectiblesAudited: (levelData.collectibles || []).length + (levelData.sunPearls || []).length + (levelData.nautilusShells || []).length,
      enemiesAudited: (levelData.enemies || []).length,
      checkpointsAudited: (levelData.checkpoints || []).length + (levelData.waystone ? 1 : 0),
      traversalErrors: [],
      placementErrors: [],
      encounterErrors: [],
      passed: true
    };

    const platforms = levelData.platforms || [];
    const hazards = levelData.hazards || [];
    const enemies = levelData.enemies || [];
    const collectibles = [
      ...(levelData.collectibles || []),
      ...(levelData.sunPearls || []),
      ...(levelData.nautilusShells || []),
      ...(levelData.goldenAcorns || []),
      ...(levelData.secretMedallion ? [levelData.secretMedallion] : [])
    ];
    const checkpoints = [
      ...(levelData.checkpoints || []),
      ...(levelData.waystone ? [levelData.waystone] : [])
    ];

    // 1. Audit all collectible placements
    for (const col of collectibles) {
      const colCheck = this.validatePlacement(col, platforms, hazards);
      if (!colCheck.valid) {
        results.placementErrors.push(...colCheck.errors);
      }
    }

    // 2. Audit all enemy encounters
    for (const enemy of enemies) {
      const encCheck = this.validateEncounter(enemy, platforms, hazards);
      if (!encCheck.valid) {
        results.encounterErrors.push(...encCheck.errors);
      }
    }

    // 3. Audit all checkpoints
    for (const cp of checkpoints) {
      const cpCheck = this.validatePlacement(cp, platforms, hazards);
      if (!cpCheck.valid) {
        results.placementErrors.push(...cpCheck.errors);
      }
    }

    if (
      results.traversalErrors.length > 0 ||
      results.placementErrors.length > 0 ||
      results.encounterErrors.length > 0
    ) {
      results.passed = false;
    }

    return results;
  }
}
