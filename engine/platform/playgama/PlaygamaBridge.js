/**
 * Official Playgama Platform SDK Bridge (Plain JS Core) with robust local fallbacks.
 * Designed according to https://wiki.playgama.com/playgama/sdk/engines/core-plain-js/setup
 */
export class PlaygamaBridge {
  constructor() {
    this.ensureGlobalBridge();
    this.bridge = typeof window !== 'undefined' ? (window.bridge || null) : null;
    this.isInitialized = false;
    this.gameReadySent = false;
    this.muted = false;
    this.visibilityListeners = [];

    this.setupVisibilityListeners();
  }

  ensureGlobalBridge() {
    if (typeof window === 'undefined') return;

    if (!window.bridge) {
      // Create official Playgama Bridge v2 mock object
      window.bridge = {
        isMock: true,
        initialize: async () => {
          console.log('[PlaygamaBridge] Mock bridge.initialize() called successfully');
          return true;
        },
        platform: {
          id: 'playgama_mock',
          language: (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.slice(0, 2).toLowerCase() : 'en',
          sendMessage: (msg) => {
            console.log(`[PlaygamaBridge] bridge.platform.sendMessage('${msg}')`);
          }
        },
        device: {
          type: (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) ? 'mobile' : 'desktop'
        },
        storage: {
          get: async (key) => {
            try {
              const k = Array.isArray(key) ? key[0] : key;
              const val = localStorage.getItem(k);
              if (val === null || val === undefined) return null;
              try { return JSON.parse(val); } catch (e) { return val; }
            } catch (e) {
              return null;
            }
          },
          set: async (key, value) => {
            try {
              const k = Array.isArray(key) ? key[0] : key;
              const v = typeof value === 'object' ? JSON.stringify(value) : String(value);
              localStorage.setItem(k, v);
              return true;
            } catch (e) {
              return false;
            }
          },
          delete: async (key) => {
            try {
              const k = Array.isArray(key) ? key[0] : key;
              localStorage.removeItem(k);
              return true;
            } catch (e) {
              return false;
            }
          }
        },
        advertisement: {
          showBanner: async (options) => {
            console.log('[PlaygamaBridge] bridge.advertisement.showBanner() called', options);
            return true;
          },
          hideBanner: async () => {
            console.log('[PlaygamaBridge] bridge.advertisement.hideBanner() called');
            return true;
          },
          showInterstitial: async () => {
            console.log('[PlaygamaBridge] bridge.advertisement.showInterstitial() called');
            return true;
          },
          showRewarded: async () => {
            console.log('[PlaygamaBridge] bridge.advertisement.showRewarded() called');
            return true;
          },
          on: (event, handler) => {
            if (event === 'rewarded_state_changed' && typeof handler === 'function') {
              // Automatically trigger rewarded state for mock
              setTimeout(() => handler('rewarded'), 100);
            }
          }
        },
        game: {
          on: (event, handler) => {}
        },
        sound: {
          mute: () => {},
          unmute: () => {}
        }
      };
    }
  }

  /**
   * Initializes the Playgama Bridge SDK.
   */
  async init() {
    if (this.isInitialized) return;

    if (typeof window !== 'undefined' && window.bridge && typeof window.bridge.initialize === 'function') {
      try {
        await window.bridge.initialize();
        this.bridge = window.bridge;
        this.isInitialized = true;
        console.log('[PlaygamaBridge] bridge.initialize() promise resolved successfully');
      } catch (err) {
        console.warn('[PlaygamaBridge] bridge.initialize() warning, continuing with fallback:', err);
        this.isInitialized = true;
      }
    } else {
      this.isInitialized = true;
      console.log('[PlaygamaBridge] Running in fallback mode');
    }
  }

  /**
   * Sends the mandatory 'game_ready' message to Playgama platform.
   * Call ONLY after assets are loaded, the title screen or gameplay is visible, and the player can interact.
   */
  sendGameReady() {
    if (this.gameReadySent) return;
    this.gameReadySent = true;

    if (typeof window !== 'undefined' && window.bridge?.platform?.sendMessage) {
      try {
        window.bridge.platform.sendMessage('game_ready');
        console.log('[PlaygamaBridge] Sent game_ready message to platform');
      } catch (err) {
        console.warn('[PlaygamaBridge] Failed to send game_ready:', err);
      }
    } else if (this.bridge?.platform?.sendMessage) {
      try {
        this.bridge.platform.sendMessage('game_ready');
      } catch (err) {}
    }
  }

  /**
   * Returns the player's language (e.g. 'en', 'ru', 'es', 'pt').
   */
  getLanguage() {
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;
    if (b?.platform?.language) {
      return b.platform.language;
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
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;
    if (b?.device?.type) {
      return b.device.type;
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
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;
    // 1. Playgama Bridge event
    if (b?.game?.on) {
      try {
        b.game.on('visibility_state_changed', (state) => {
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
  // STORAGE API (Direct Playgama Bridge Storage & Local Fallback)
  // =========================================================================

  async getData(key, defaultValue = null) {
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;

    // 1. Direct Playgama Bridge Storage
    if (b?.storage?.get) {
      try {
        const res = await b.storage.get(key);
        if (res !== undefined && res !== null) {
          return typeof res === 'string' ? JSON.parse(res) : res;
        }
      } catch (e) {
        console.warn('[PlaygamaBridge] Cloud storage get error, trying fallback:', e);
      }
    }

    // 2. Fallback to localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const item = localStorage.getItem(key);
        if (item !== null) {
          return JSON.parse(item);
        }
      }
    } catch (e) {}

    return defaultValue;
  }

  async setData(key, data) {
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;
    const serialized = typeof data === 'object' ? JSON.stringify(data) : data;

    // 1. Direct Playgama Bridge Storage
    if (b?.storage?.set) {
      try {
        await b.storage.set(key, serialized);
      } catch (e) {
        console.warn('[PlaygamaBridge] Cloud storage set failed:', e);
      }
    }

    // 2. Also persist in localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, typeof serialized === 'string' ? serialized : JSON.stringify(serialized));
      }
    } catch (e) {}
  }

  async deleteData(key) {
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;

    if (b?.storage?.delete) {
      try {
        await b.storage.delete(key);
      } catch (e) {}
    }

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
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

  async showBanner(options = {}) {
    if (this.bridge?.advertisement?.showBanner) {
      try {
        return await this.bridge.advertisement.showBanner(options);
      } catch (e) {
        console.warn('[PlaygamaBridge] showBanner failed:', e);
      }
    } else {
      console.log('[PlaygamaBridge] Mock showBanner executed');
    }
  }

  async hideBanner() {
    if (this.bridge?.advertisement?.hideBanner) {
      try {
        return await this.bridge.advertisement.hideBanner();
      } catch (e) {
        console.warn('[PlaygamaBridge] hideBanner failed:', e);
      }
    } else {
      console.log('[PlaygamaBridge] Mock hideBanner executed');
    }
  }

  async showInterstitial() {
    if (this.bridge?.advertisement?.showInterstitial) {
      try {
        return await this.bridge.advertisement.showInterstitial();
      } catch (e) {
        console.warn('[PlaygamaBridge] Interstitial ad failed:', e);
      }
    } else {
      console.log('[PlaygamaBridge] Mock showInterstitial executed');
      return true;
    }
  }

  async showRewarded(onRewardedCallback) {
    if (this.bridge?.advertisement?.showRewarded) {
      try {
        if (typeof onRewardedCallback === 'function') {
          let rewardedTriggered = false;
          if (this.bridge.advertisement.on) {
            const handler = (state) => {
              if (state === 'rewarded' && !rewardedTriggered) {
                rewardedTriggered = true;
                onRewardedCallback();
              }
            };
            this.bridge.advertisement.on('rewarded_state_changed', handler);
          }
          const res = await this.bridge.advertisement.showRewarded();
          if (res === true && !rewardedTriggered) {
            rewardedTriggered = true;
            onRewardedCallback();
          }
          return res;
        }
        return await this.bridge.advertisement.showRewarded();
      } catch (e) {
        console.warn('[PlaygamaBridge] Rewarded ad failed, executing callback fallback:', e);
        if (typeof onRewardedCallback === 'function') {
          onRewardedCallback();
        }
      }
    } else {
      console.log('[PlaygamaBridge] Mock showRewarded: granting reward immediately');
      if (typeof onRewardedCallback === 'function') {
        onRewardedCallback();
      }
      return true;
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
