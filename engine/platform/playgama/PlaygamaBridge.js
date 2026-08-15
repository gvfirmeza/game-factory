/**
 * Official Playgama Platform SDK Bridge (Plain JS Core) with robust local fallbacks.
 * Designed according to https://wiki.playgama.com/playgama/sdk/engines/core-plain-js/setup
 */
export class PlaygamaBridge {
  constructor() {
    this.isBridgeAvailable = typeof window !== 'undefined' && (!!window.bridge || !!window.PlaygamaBridge);
    this.bridge = typeof window !== 'undefined' ? (window.bridge || window.PlaygamaBridge || null) : null;
    this.storagePrefix = 'ai_game_factory_';
    this.isInitialized = false;
    this.gameReadySent = false;
    this.muted = false;
    this.visibilityListeners = [];

    this.setupVisibilityListeners();
  }

  /**
   * Initializes the Playgama Bridge SDK.
   */
  async init() {
    if (this.isInitialized) return;

    if (this.bridge && typeof this.bridge.initialize === 'function') {
      try {
        await this.bridge.initialize();
        this.isInitialized = true;
        console.log('[PlaygamaBridge] SDK initialized successfully');
      } catch (err) {
        console.warn('[PlaygamaBridge] Initialization warning, continuing with fallback:', err);
        this.isInitialized = true;
      }
    } else {
      this.isInitialized = true;
      console.log('[PlaygamaBridge] Running in standalone/local mode with mock bridge');
    }
  }

  /**
   * Sends the mandatory 'game_ready' message to Playgama platform.
   * Call ONLY after assets are loaded, the title screen or gameplay is visible, and the player can interact.
   */
  sendGameReady() {
    if (this.gameReadySent) return;
    this.gameReadySent = true;

    if (this.bridge?.platform?.sendMessage) {
      try {
        this.bridge.platform.sendMessage('game_ready');
        console.log('[PlaygamaBridge] Sent game_ready message to platform');
      } catch (err) {
        console.warn('[PlaygamaBridge] Failed to send game_ready:', err);
      }
    } else {
      console.log('[PlaygamaBridge] Mock game_ready event registered');
    }
  }

  /**
   * Returns the player's language (e.g. 'en', 'ru', 'es', 'pt').
   */
  getLanguage() {
    if (this.bridge?.platform?.language) {
      return this.bridge.platform.language;
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language.slice(0, 2).toLowerCase();
    }
    return 'en';
  }

  /**
   * Returns the current device type ('desktop' | 'mobile' | 'tablet').
   */
  getDeviceType() {
    if (this.bridge?.device?.type) {
      return this.bridge.device.type;
    }
    if (typeof window !== 'undefined') {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmall = window.innerWidth < 768;
      if (isTouch && isSmall) return 'mobile';
      if (isTouch) return 'tablet';
    }
    return 'desktop';
  }

  /**
   * Registers a callback for tab/window visibility state changes.
   * @param {function(boolean): void} callback - true if visible, false if hidden.
   */
  onVisibilityChange(callback) {
    if (typeof callback === 'function') {
      this.visibilityListeners.push(callback);
    }
  }

  setupVisibilityListeners() {
    // 1. Playgama Bridge event
    if (this.bridge?.game?.on) {
      try {
        this.bridge.game.on('visibility_state_changed', (state) => {
          const isVisible = state === 'visible';
          this.notifyVisibility(isVisible);
        });
      } catch (e) {}
    }

    // 2. Standard DOM visibilitychange fallback
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        const isVisible = !document.hidden;
        this.notifyVisibility(isVisible);
      });
    }

    // 3. Window blur/focus fallback
    if (typeof window !== 'undefined') {
      window.addEventListener('blur', () => this.notifyVisibility(false));
      window.addEventListener('focus', () => this.notifyVisibility(true));
    }
  }

  notifyVisibility(isVisible) {
    for (const listener of this.visibilityListeners) {
      try {
        listener(isVisible);
      } catch (e) {
        console.error('[PlaygamaBridge] Error in visibility listener:', e);
      }
    }
  }

  // =========================================================================
  // STORAGE API (Cloud Save & Local Fallback)
  // =========================================================================

  async getData(key, defaultValue = null) {
    const fullKey = `${this.storagePrefix}${key}`;

    // Try Playgama Bridge Storage
    if (this.bridge?.storage?.get) {
      try {
        const res = await this.bridge.storage.get(fullKey);
        if (res !== undefined && res !== null) {
          return typeof res === 'string' ? JSON.parse(res) : res;
        }
      } catch (e) {
        console.warn('[PlaygamaBridge] Cloud storage get failed, trying localStorage:', e);
      }
    }

    // Fallback to localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const item = localStorage.getItem(fullKey);
        if (item !== null) {
          return JSON.parse(item);
        }
      }
    } catch (e) {}

    return defaultValue;
  }

  async setData(key, data) {
    const fullKey = `${this.storagePrefix}${key}`;
    const serialized = JSON.stringify(data);

    // Save to Playgama Bridge Storage
    if (this.bridge?.storage?.set) {
      try {
        await this.bridge.storage.set(fullKey, serialized);
      } catch (e) {
        console.warn('[PlaygamaBridge] Cloud storage set failed:', e);
      }
    }

    // Also persist in localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(fullKey, serialized);
      }
    } catch (e) {}
  }

  async deleteData(key) {
    const fullKey = `${this.storagePrefix}${key}`;

    if (this.bridge?.storage?.delete) {
      try {
        await this.bridge.storage.delete(fullKey);
      } catch (e) {}
    }

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(fullKey);
      }
    } catch (e) {}
  }

  // =========================================================================
  // LEADERBOARDS API
  // =========================================================================

  async getHighScore(leaderboardName = 'main') {
    const score = await this.getData(`hs_${leaderboardName}`, 0);
    return typeof score === 'number' ? score : 0;
  }

  async setHighScore(leaderboardName = 'main', score = 0) {
    const current = await this.getHighScore(leaderboardName);
    if (score > current) {
      await this.setData(`hs_${leaderboardName}`, score);
    }

    if (this.bridge?.leaderboard?.setScore) {
      try {
        await this.bridge.leaderboard.setScore({ leaderboardName, score });
      } catch (e) {}
    }
  }

  // =========================================================================
  // ADVERTISEMENT API
  // =========================================================================

  async showInterstitial() {
    if (this.bridge?.advertisement?.showInterstitial) {
      try {
        return await this.bridge.advertisement.showInterstitial();
      } catch (e) {
        console.warn('[PlaygamaBridge] Interstitial ad failed:', e);
      }
    }
  }

  async showRewarded(onRewardedCallback) {
    if (this.bridge?.advertisement?.showRewarded) {
      try {
        if (typeof onRewardedCallback === 'function' && this.bridge.advertisement.on) {
          const handler = (state) => {
            if (state === 'rewarded') {
              onRewardedCallback();
            }
          };
          this.bridge.advertisement.on('rewarded_state_changed', handler);
        }
        return await this.bridge.advertisement.showRewarded();
      } catch (e) {
        console.warn('[PlaygamaBridge] Rewarded ad failed:', e);
      }
    }
  }

  // =========================================================================
  // AUDIO & MUTE CONTROLS
  // =========================================================================

  isMuted() {
    return this.muted;
  }

  setMuted(muted) {
    this.muted = !!muted;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`${this.storagePrefix}muted`, this.muted ? '1' : '0');
      }
    } catch (e) {}

    // Synchronize with platform audio if available
    if (this.bridge?.sound) {
      try {
        if (this.muted && this.bridge.sound.mute) this.bridge.sound.mute();
        else if (!this.muted && this.bridge.sound.unmute) this.bridge.sound.unmute();
      } catch (e) {}
    }
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }
}
