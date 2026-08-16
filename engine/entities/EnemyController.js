/**
 * ============================================================================
 * AI GAME FACTORY — CENTRALIZED ENEMY CONTROLLER & BEHAVIOR SUITE
 * Standardized Enemy Archetypes, Kinematics, Ground Physics & State Machines
 * ============================================================================
 */

import { CollisionUtils } from '../core/CollisionUtils.js';

export const EnemyArchetypes = {
  PATROL_WALKER: 'patrol_walker',
  RHYTHMIC_HOPPER: 'rhythmic_hopper',
  SINE_FLYER: 'sine_flyer',
  PROXIMITY_CHARGER: 'proximity_charger',
  MULTI_PHASE_BOSS: 'multi_phase_boss'
};

export const EnemyStates = {
  IDLE: 'IDLE',
  PATROL: 'PATROL',
  ALERT: 'ALERT',
  CHARGE: 'CHARGE',
  HOPPING: 'HOPPING',
  FLYING: 'FLYING',
  DAZED: 'DAZED',
  HURT: 'HURT',
  DEFEATED: 'DEFEATED'
};

export class EnemyController {
  constructor(config = {}) {
    this.id = config.id || `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    this.type = config.type || EnemyArchetypes.PATROL_WALKER;
    this.name = config.name || 'Woodland Pest';

    // Spatial & Kinematics
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.baseY = config.y || 0;
    this.vx = config.vx !== undefined ? config.vx : 60;
    this.vy = config.vy || 0;
    this.width = config.width || config.w || 24;
    this.height = config.height || config.h || 24;
    this.minX = config.minX !== undefined ? config.minX : 0;
    this.maxX = config.maxX !== undefined ? config.maxX : 2000;
    this.gravity = config.gravity !== undefined ? config.gravity : 800;
    this.isGrounded = false;
    this.isFlying = config.isFlying || this.type === EnemyArchetypes.SINE_FLYER;

    // Health & Combat
    this.maxHealth = config.maxHealth || config.hp || 2;
    this.health = this.maxHealth;
    this.scoreValue = config.scoreValue || 100;
    this.canBeStomped = config.canBeStomped !== undefined ? config.canBeStomped : true;
    this.invulnerableWhileCharging = config.invulnerableWhileCharging !== undefined ? config.invulnerableWhileCharging : true;
    this.flashTimer = 0;
    this.knockbackTimer = 0;

    // Behavior Timers & Parameters
    this.state = config.initialState || (this.isFlying ? EnemyStates.FLYING : EnemyStates.PATROL);
    this.stateTimer = 0;
    this.direction = config.direction || (this.vx >= 0 ? 1 : -1);
    this.aggroRange = config.aggroRange || 180;
    this.chargeSpeed = config.chargeSpeed || 280;
    this.dazeDuration = config.dazeDuration || 2.2;
    this.hopInterval = config.hopInterval || 1.2;
    this.hopImpulse = config.hopImpulse || -350;
    this.sineAmplitude = config.sineAmplitude || 28;
    this.sineFrequency = config.sineFrequency || 3.77;

    // Loot & Callback hooks
    this.dropItem = config.dropItem || null;
    this.onDefeat = config.onDefeat || null;
    this.onDazed = config.onDazed || null;
    this.onHurt = config.onHurt || null;
  }

  /**
   * Universal tick update for enemy state machine & physics.
   * @param {number} dt - Delta time in seconds
   * @param {Object} player - Player reference { x, y, vy, ... }
   * @param {Array<Object>} platforms - Array of solid platforms for ground physics
   * @param {number} animTime - Total elapsed game time
   */
  update(dt, player, platforms = [], animTime = 0) {
    if (this.health <= 0) return;

    if (this.flashTimer > 0) this.flashTimer -= dt;
    if (this.knockbackTimer > 0) this.knockbackTimer -= dt;

    // 1. Execute Archetype Specific Behavior State Machine
    switch (this.type) {
      case EnemyArchetypes.PATROL_WALKER:
        this._updatePatrolWalker(dt, platforms);
        break;

      case EnemyArchetypes.RHYTHMIC_HOPPER:
        this._updateRhythmicHopper(dt, platforms);
        break;

      case EnemyArchetypes.SINE_FLYER:
        this._updateSineFlyer(dt, animTime);
        break;

      case EnemyArchetypes.PROXIMITY_CHARGER:
        this._updateProximityCharger(dt, player, platforms);
        break;

      default:
        this._updatePatrolWalker(dt, platforms);
        break;
    }

    // 2. Enforce Ground Gravity & Platform Collision for all Non-Flying Entities
    if (!this.isFlying) {
      // Ground Gravity
      this.vy += this.gravity * dt;
      this.vy = Math.min(this.vy, 600); // Terminal fall velocity clamp

      // Collision Resolution via centralized CollisionUtils
      CollisionUtils.resolveVertical(this, platforms, dt);

      // Boundary clamp & direction turnaround
      if (this.state === EnemyStates.PATROL || this.state === EnemyStates.IDLE) {
        CollisionUtils.clampPatrolBounds(this);
      }
    }
  }

  _updatePatrolWalker(dt, platforms) {
    this.x += this.vx * dt;
    this.direction = this.vx > 0 ? 1 : -1;

    // Check platform bounds or explicit minX/maxX
    CollisionUtils.clampPatrolBounds(this);
  }

  _updateRhythmicHopper(dt, platforms) {
    this.stateTimer -= dt;
    if (this.stateTimer <= 0) {
      if (this.state === EnemyStates.IDLE) {
        this.state = EnemyStates.HOPPING;
        this.vy = this.hopImpulse;
        this.isGrounded = false;
        this.stateTimer = this.hopInterval;
      } else {
        this.state = EnemyStates.IDLE;
        this.stateTimer = 0.8;
      }
    }
  }

  _updateSineFlyer(dt, animTime) {
    this.x += this.vx * dt;
    this.direction = this.vx > 0 ? 1 : -1;

    // Clamp horizontal flight path
    CollisionUtils.clampPatrolBounds(this);

    // Smooth deterministic vertical sine oscillation
    this.y = this.baseY + Math.sin(animTime * this.sineFrequency) * this.sineAmplitude;
  }

  _updateProximityCharger(dt, player, platforms) {
    switch (this.state) {
      case EnemyStates.PATROL:
        this.x += this.vx * dt;
        this.direction = this.vx > 0 ? 1 : -1;
        CollisionUtils.clampPatrolBounds(this);

        // Aggro line-of-sight check
        if (player && Math.abs(player.x - this.x) < this.aggroRange && Math.abs(player.y - this.y) < 45) {
          this.state = EnemyStates.ALERT;
          this.stateTimer = 0.4; // 400ms telegraph before rush
        }
        break;

      case EnemyStates.ALERT:
        this.stateTimer -= dt;
        if (this.stateTimer <= 0) {
          this.state = EnemyStates.CHARGE;
          this.direction = player.x < this.x ? -1 : 1;
        }
        break;

      case EnemyStates.CHARGE:
        this.x += this.direction * this.chargeSpeed * dt;

        // Crash into boundaries or platform edges -> Daze Stun
        if (this.x <= this.minX || this.x >= this.maxX) {
          this.x = Math.max(this.minX, Math.min(this.maxX, this.x));
          this.state = EnemyStates.DAZED;
          this.stateTimer = this.dazeDuration;
          if (this.onDazed) this.onDazed(this);
        }
        break;

      case EnemyStates.DAZED:
        this.stateTimer -= dt;
        if (this.stateTimer <= 0) {
          this.state = EnemyStates.PATROL;
          this.vx = this.direction * -60; // Turn around after recovery
        }
        break;
    }
  }

  /**
   * Process incoming damage from player attack or stomp.
   * @param {number} amount - Damage amount
   * @param {number} sourceX - X coordinate of attack source (for knockback direction)
   * @returns {boolean} True if damage was applied, false if invulnerable
   */
  takeDamage(amount = 1, sourceX = 0) {
    // Check charging invulnerability
    if (this.type === EnemyArchetypes.PROXIMITY_CHARGER && this.state === EnemyStates.CHARGE && this.invulnerableWhileCharging) {
      return false;
    }

    this.health = Math.max(0, this.health - amount);
    this.flashTimer = 0.25;

    // Apply knockback
    const kbDir = this.x < sourceX ? -1 : 1;
    this.vx = kbDir * 120;
    this.vy = -160;
    this.knockbackTimer = 0.20;

    if (this.onHurt) this.onHurt(this);

    if (this.health <= 0) {
      this.state = EnemyStates.DEFEATED;
      if (this.onDefeat) this.onDefeat(this);
    }
    return true;
  }
}
