# Playgama SDK Integration Guide (Plain JS Core)

## 1. SDK Overview
The Playgama Bridge is the unified interface between the game and the Playgama platform.
In Plain JS games, the bridge is accessible via `window.bridge` (or encapsulated in the studio's `engine/platform/playgama/PlaygamaBridge.js`).

## 2. Core Modules & Methods

### Initialization
```javascript
// Plain JS setup
if (window.bridge) {
  await window.bridge.initialize();
}
```

### Game Ready Event (CRITICAL REQUIREMENT)
The game must notify the platform that loading has finished, the initial screen is rendered, and the player can interact:
```javascript
if (window.bridge && window.bridge.platform) {
  window.bridge.platform.sendMessage('game_ready');
}
```
> [!IMPORTANT]
> Never send `game_ready` while assets are still downloading or during a black loading screen. Only send it once the interactive title screen or gameplay is rendered and waiting for player input.

### Platform Information & Localization
```javascript
const platformId = window.bridge?.platform?.id; // e.g. 'playgama', 'yandex', 'vk'
const language = window.bridge?.platform?.language || navigator.language.slice(0, 2); // e.g. 'en', 'es', 'pt'
```

### Storage API (Save / Load Progress)
Playgama supports persistent cloud and local storage:
```javascript
// Save data (Key-Value or JSON object)
await window.bridge?.storage?.set('player_save', JSON.stringify(saveData));

// Load data
const data = await window.bridge?.storage?.get('player_save');
```
*Fallback*: When `window.bridge.storage` is not available, gracefully use `localStorage`.

### Visibility & Background Pausing
Games must pause audio and physics when the player switches tabs or minimizes the window:
```javascript
if (window.bridge && window.bridge.game) {
  window.bridge.game.on('visibility_state_changed', (state) => {
    // state: 'visible' | 'hidden'
    if (state === 'hidden') {
      audioEngine.pause();
      gameLoop.pause();
    } else {
      audioEngine.resume();
      gameLoop.resume();
    }
  });
}
```

### Advertisement Integration (If Applicable)
```javascript
// Interstitial Ads
if (window.bridge && window.bridge.advertisement) {
  await window.bridge.advertisement.showInterstitial();
}

// Rewarded Ads
if (window.bridge && window.bridge.advertisement) {
  window.bridge.advertisement.on('rewarded_state_changed', (state) => {
    if (state === 'rewarded') {
      givePlayerReward();
    }
  });
  await window.bridge.advertisement.showRewarded();
}
```

### Device Information
```javascript
const deviceType = window.bridge?.device?.type; // 'desktop' | 'mobile' | 'tablet'
```
