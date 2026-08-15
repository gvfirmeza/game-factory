# Playgama Submission & Publication Manifest

## 1. Submission Manifest Spec (`publication-manifest.json`)
Every game prepared for Playgama must generate a `publication-manifest.json` located under `games/<game-id>/playgama/`.

### Schema Format
```json
{
  "schemaVersion": "1.0.0",
  "gameId": "grove-odyssey",
  "title": "Grove Odyssey",
  "tagline": "A cozy mini metroidvania about an enchanted forest spirit",
  "description": "Embark on a charming journey through 7 interconnected woodland zones...",
  "howToPlay": "Desktop: [A/D] Move | [Space/W] Jump/Glide | [K/X/Click] Attack | [Shift/J] Dash | [E] Interact\nMobile: Use on-screen touch buttons for D-Pad, Jump, Attack, and Dash.",
  "engine": "HTML5 / Plain JavaScript (Canvas 2D)",
  "orientation": "landscape",
  "supportedDevices": ["desktop", "mobile", "tablet"],
  "languages": ["en"],
  "features": [
    "7 Interconnected Zones",
    "3 Movement Abilities (Double Jump, Wind Glide, Leaf Dash)",
    "Full Combat System with 3 Enemy Archetypes",
    "Persistent Save System with Cloud Storage Sync",
    "Procedural Web Audio Synthesizer with Mute Control",
    "Zero Offline Dependencies"
  ],
  "monetization": {
    "interstitials": false,
    "rewarded": false
  },
  "distribution": {
    "archivePath": "games/grove-odyssey/build/grove-odyssey.zip",
    "archiveSizeKB": 60,
    "entryPoint": "index.html"
  },
  "assets": {
    "icon": "assets/icon_512.png",
    "cover": "assets/cover_800x450.png",
    "screenshots": [
      "assets/screenshot_1.png",
      "assets/screenshot_2.png"
    ]
  },
  "submissionStatus": "PLAYGAMA_READY",
  "validatedAt": "2026-08-15T00:00:00.000Z"
}
```
