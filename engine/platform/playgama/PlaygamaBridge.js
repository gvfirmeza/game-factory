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
        EVENT_NAME: {
          AUDIO_STATE_CHANGED: 'audio_state_changed',
          PAUSE_STATE_CHANGED: 'pause_state_changed',
          VISIBILITY_STATE_CHANGED: 'visibility_state_changed',
          REWARDED_STATE_CHANGED: 'rewarded_state_changed',
          INTERSTITIAL_STATE_CHANGED: 'interstitial_state_changed'
        },
        initialize: async () => {
          console.log('[PlaygamaBridge] Mock bridge.initialize() called successfully');
          return true;
        },
        platform: {
          id: 'playgama_mock',
          isAudioEnabled: true,
          language: (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.slice(0, 2).toLowerCase() : 'en',
          sendMessage: (msg) => {
            console.log(`[PlaygamaBridge] bridge.platform.sendMessage('${msg}')`);
          },
          on: (event, handler) => {
            console.log(`[PlaygamaBridge] Subscribed to platform event: ${event}`);
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
        leaderboards: {
          type: 'in_game',
          setScore: async (leaderboardId, score) => {
            console.log(`[PlaygamaBridge] bridge.leaderboards.setScore('${leaderboardId}', ${score})`);
            try {
              const key = `lb_${leaderboardId}`;
              let existing = JSON.parse(localStorage.getItem(key) || '[]');
              if (!Array.isArray(existing) || existing.length === 0) {
                existing = [
                  { id: 'bot_1', name: 'Nova Commander', score: 48500, rank: 1 },
                  { id: 'bot_2', name: 'Aegis Sentinel', score: 36200, rank: 2 },
                  { id: 'bot_3', name: 'Solaris VII', score: 27800, rank: 3 },
                  { id: 'bot_4', name: 'Vortex Pilot', score: 19400, rank: 4 },
                  { id: 'bot_5', name: 'Cosmic Guard', score: 12500, rank: 5 },
                  { id: 'bot_6', name: 'Star Defender', score: 8400, rank: 6 }
                ];
              }
              const playerIdx = existing.findIndex(e => e.id === 'player_local');
              if (playerIdx >= 0) {
                if (score > existing[playerIdx].score) {
                  existing[playerIdx].score = score;
                }
              } else {
                existing.push({
                  id: 'player_local',
                  name: 'Commander (You)',
                  score: score,
                  rank: 1
                });
              }
              existing.sort((a, b) => b.score - a.score);
              existing.forEach((e, idx) => e.rank = idx + 1);
              localStorage.setItem(key, JSON.stringify(existing));
            } catch (e) {}
            return true;
          },
          getEntries: async (leaderboardId) => {
            console.log(`[PlaygamaBridge] bridge.leaderboards.getEntries('${leaderboardId}')`);
            try {
              const key = `lb_${leaderboardId}`;
              let stored = JSON.parse(localStorage.getItem(key) || 'null');
              if (!stored || stored.length === 0) {
                stored = [
                  { id: 'bot_1', name: 'Nova Commander', score: 48500, rank: 1 },
                  { id: 'bot_2', name: 'Aegis Sentinel', score: 36200, rank: 2 },
                  { id: 'bot_3', name: 'Solaris VII', score: 27800, rank: 3 },
                  { id: 'bot_4', name: 'Vortex Pilot', score: 19400, rank: 4 },
                  { id: 'bot_5', name: 'Cosmic Guard', score: 12500, rank: 5 },
                  { id: 'bot_6', name: 'Star Defender', score: 8400, rank: 6 }
                ];
              }
              return stored;
            } catch (e) {
              return [];
            }
          },
          showNativePopup: async (leaderboardId) => {
            console.log(`[PlaygamaBridge] bridge.leaderboards.showNativePopup('${leaderboardId}')`);
            return true;
          }
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
   * Returns whether the host platform currently allows game audio.
   */
  isAudioEnabled() {
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;
    if (b?.platform && typeof b.platform.isAudioEnabled === 'boolean') {
      return b.platform.isAudioEnabled;
    }
    return true;
  }

  /**
   * Registers a listener for host platform audio state changes (e.g. host tab mute).
   */
  onAudioStateChange(callback) {
    if (typeof callback !== 'function') return;
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;
    const eventName = b?.EVENT_NAME?.AUDIO_STATE_CHANGED || 'audio_state_changed';
    if (b?.platform?.on) {
      try {
        b.platform.on(eventName, (isEnabled) => {
          callback(isEnabled);
        });
      } catch (e) {
        console.warn('[PlaygamaBridge] Failed to bind platform audio event:', e);
      }
    }
  }

  /**
   * Registers a listener for host platform pause/resume requests.
   */
  onPauseStateChange(callback) {
    if (typeof callback !== 'function') return;
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;
    const eventName = b?.EVENT_NAME?.PAUSE_STATE_CHANGED || 'pause_state_changed';
    if (b?.platform?.on) {
      try {
        b.platform.on(eventName, (isPaused) => {
          callback(isPaused);
        });
      } catch (e) {
        console.warn('[PlaygamaBridge] Failed to bind platform pause event:', e);
      }
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
  // LEADERBOARDS API (Playgama Bridge SDK v2)
  // =========================================================================

  getLeaderboardType() {
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;
    if (b?.leaderboards?.type) {
      return b.leaderboards.type;
    }
    return 'in_game';
  }

  async getHighScore(leaderboardName = 'main') {
    const score = await this.getData(`hs_${leaderboardName}`, 0);
    return typeof score === 'number' ? score : 0;
  }

  async setHighScore(leaderboardName = 'main', score = 0) {
    const current = await this.getHighScore(leaderboardName);
    if (score > current) {
      await this.setData(`hs_${leaderboardName}`, score);
    }
    await this.setLeaderboardScore(leaderboardName, score);
  }

  async setLeaderboardScore(leaderboardId, score) {
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;
    if (b?.leaderboards?.setScore) {
      try {
        return await b.leaderboards.setScore(leaderboardId, score);
      } catch (e) {
        console.warn('[PlaygamaBridge] leaderboards.setScore failed:', e);
      }
    }
    return false;
  }

  async getLeaderboardEntries(leaderboardId) {
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;
    if (b?.leaderboards?.getEntries) {
      try {
        return await b.leaderboards.getEntries(leaderboardId);
      } catch (e) {
        console.warn('[PlaygamaBridge] leaderboards.getEntries failed:', e);
      }
    }
    return [];
  }

  async showLeaderboardNativePopup(leaderboardId) {
    const b = (typeof window !== 'undefined' && window.bridge) ? window.bridge : this.bridge;
    if (b?.leaderboards?.showNativePopup) {
      try {
        return await b.leaderboards.showNativePopup(leaderboardId);
      } catch (e) {
        console.warn('[PlaygamaBridge] leaderboards.showNativePopup failed:', e);
      }
    }
    return false;
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
