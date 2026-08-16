/**
 * Universal Input Manager handling keyboard, mouse clicks, pointer events, touch swipes, and virtual touch buttons.
 */
export class InputManager {
  constructor(canvasElement = null) {
    this.canvas = canvasElement || window;
    this.keys = {};
    this.justPressedKeys = {};
    this.touchStart = null;
    this.pointerStart = null;
    this.swipeThreshold = 25;
    this.actions = {
      up: false,
      down: false,
      left: false,
      right: false,
      action: false,
      dash: false,
      attack: false
    };
    this.justActions = {
      up: false,
      down: false,
      left: false,
      right: false,
      action: false,
      dash: false,
      attack: false
    };

    this.pointerCanvasX = 0;
    this.pointerCanvasY = 0;
    this.hasPointerMoved = false;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    if (canvasElement) {
      canvasElement.addEventListener('touchstart', this.onTouchStart, { passive: false });
      canvasElement.addEventListener('touchend', this.onTouchEnd, { passive: false });
      canvasElement.addEventListener('pointerdown', this.onPointerDown, { passive: false });
      canvasElement.addEventListener('mousedown', this.onPointerDown, { passive: false });
      canvasElement.addEventListener('pointermove', this.onPointerMove, { passive: true });
      canvasElement.addEventListener('mousemove', this.onPointerMove, { passive: true });
    }
  }

  onPointerMove(e) {
    if (this.canvas && this.canvas.getBoundingClientRect) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = (this.canvas.width || 720) / rect.width;
      const scaleY = (this.canvas.height || 450) / rect.height;
      this.pointerCanvasX = (e.clientX - rect.left) * scaleX;
      this.pointerCanvasY = (e.clientY - rect.top) * scaleY;
      this.hasPointerMoved = true;
    }
  }

  onKeyDown(e) {
    const managedCodes = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Space',
      'KeyW',
      'KeyS',
      'KeyA',
      'KeyD',
      'KeyE',
      'Enter',
      'KeyJ',
      'KeyK',
      'KeyX',
      'KeyC',
      'KeyZ',
      'ShiftLeft',
      'ShiftRight'
    ];
    if (managedCodes.includes(e.code)) {
      e.preventDefault();
    }

    if (!this.keys[e.code]) {
      this.justPressedKeys[e.code] = true;
      this.mapAction(e.code, true);
    }
    this.keys[e.code] = true;
  }

  onKeyUp(e) {
    this.keys[e.code] = false;
    this.mapAction(e.code, false);
  }

  mapAction(code, isPressed) {
    switch (code) {
      // UP / JUMP / GLIDE
      case 'Space':
      case 'KeyW':
      case 'ArrowUp':
        this.actions.up = isPressed;
        if (isPressed) this.justActions.up = true;
        break;

      // DOWN / CROUCH
      case 'ArrowDown':
      case 'KeyS':
        this.actions.down = isPressed;
        if (isPressed) this.justActions.down = true;
        break;

      // LEFT
      case 'ArrowLeft':
      case 'KeyA':
        this.actions.left = isPressed;
        if (isPressed) this.justActions.left = true;
        break;

      // RIGHT
      case 'ArrowRight':
      case 'KeyD':
        this.actions.right = isPressed;
        if (isPressed) this.justActions.right = true;
        break;

      // ATTACK / SPIRIT SPARK / LEAF SLASH
      case 'KeyK':
      case 'KeyX':
      case 'KeyC':
      case 'KeyZ':
        this.actions.attack = isPressed;
        if (isPressed) this.justActions.attack = true;
        break;

      // DASH / LEAF DASH
      case 'ShiftLeft':
      case 'ShiftRight':
      case 'KeyJ':
        this.actions.dash = isPressed;
        if (isPressed) this.justActions.dash = true;
        break;

      // PAUSE / MENU
      case 'Escape':
      case 'KeyP':
        this.actions.pause = isPressed;
        if (isPressed) this.justActions.pause = true;
        break;
    }
  }

  /**
   * Return formatted human-readable UI control hints derived directly from configured bindings.
   * @returns {string} e.g. "[A/D] Move | [Space] Jump | [Shift/J] Dash | [E] Talk"
   */
  getControlHints() {
    const hints = [];
    hints.push('[A/D] Move');
    hints.push('[Space/W] Jump');
    if (this.actions.hasOwnProperty('attack')) hints.push('[K/Click] Attack');
    if (this.actions.hasOwnProperty('dash')) hints.push('[Shift/J] Dash');
    hints.push('[E] Talk');
    hints.push('[Esc] Pause');
    return hints.join(' | ');
  }

  onPointerDown(e) {
    // In gameplay mode, Left Click / tap triggers attack; in dialogue mode, callers consume 'action'
    this.triggerAction('attack');
    this.triggerAction('action');
  }

  onTouchStart(e) {
    e.preventDefault();
    if (e.touches && e.touches.length > 0) {
      this.touchStart = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: performance.now()
      };
    }
  }

  onTouchEnd(e) {
    e.preventDefault();
    if (!this.touchStart || !e.changedTouches || e.changedTouches.length === 0) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - this.touchStart.x;
    const dy = endY - this.touchStart.y;
    const duration = performance.now() - this.touchStart.time;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < this.swipeThreshold && absDy < this.swipeThreshold && duration < 300) {
      // Tap counts as attack / action contextually
      this.triggerAction('attack');
      this.triggerAction('action');
    } else if (absDx > absDy && absDx > this.swipeThreshold) {
      if (dx > 0) this.triggerAction('right');
      else this.triggerAction('left');
    } else if (absDy > this.swipeThreshold) {
      if (dy > 0) this.triggerAction('down');
      else this.triggerAction('up');
    }

    this.touchStart = null;
  }

  triggerAction(actionName) {
    if (this.actions.hasOwnProperty(actionName)) {
      this.actions[actionName] = true;
      this.justActions[actionName] = true;
    }
  }

  isDown(actionName) {
    return !!this.actions[actionName];
  }

  isJustPressed(actionName) {
    return !!this.justActions[actionName];
  }

  endFrame() {
    // Clear just-pressed triggers for next frame
    for (const key of Object.keys(this.justPressedKeys)) {
      delete this.justPressedKeys[key];
    }
    this.justActions.up = false;
    this.justActions.down = false;
    this.justActions.left = false;
    this.justActions.right = false;
    this.justActions.action = false;
    this.justActions.dash = false;
    this.justActions.attack = false;
    this.justActions.pause = false;
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    if (this.canvas && this.canvas !== window) {
      this.canvas.removeEventListener('touchstart', this.onTouchStart);
      this.canvas.removeEventListener('touchend', this.onTouchEnd);
      this.canvas.removeEventListener('pointerdown', this.onPointerDown);
      this.canvas.removeEventListener('mousedown', this.onPointerDown);
    }
  }
}
