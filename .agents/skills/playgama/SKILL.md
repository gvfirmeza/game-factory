---
name: playgama
description: Playgama Bridge integration, SDK lifecycle, Game Ready events, save/load storage, ad integration, responsive scaling, visibility handling, and publication readiness.
---

# Playgama Publishing Skill

## Overview
This skill provides the end-to-end expertise and official technical specifications required to make HTML5 / Plain JS games publication-ready for the **Playgama** platform.

## Skill Modules
- [`SOURCE-OF-TRUTH.md`](file:///d:/DEV/gmfactory/.agents/skills/playgama/SOURCE-OF-TRUTH.md): Official Wiki documentation URLs, topics, and verification records.
- [`playgama-platform.md`](file:///d:/DEV/gmfactory/.agents/skills/playgama/playgama-platform.md): Platform architecture, lifecycle states, and orientation rules.
- [`playgama-sdk.md`](file:///d:/DEV/gmfactory/.agents/skills/playgama/playgama-sdk.md): Plain JS Playgama Bridge API, `game_ready` events, storage, visibility, ads, and device detection.
- [`playgama-requirements.md`](file:///d:/DEV/gmfactory/.agents/skills/playgama/playgama-requirements.md): Technical ZIP packaging, zero external CDN dependencies, audio mute, and UX constraints.
- [`playgama-submission.md`](file:///d:/DEV/gmfactory/.agents/skills/playgama/playgama-submission.md): Submission metadata manifest specification (`publication-manifest.json`).
- [`playgama-qa.md`](file:///d:/DEV/gmfactory/.agents/skills/playgama/playgama-qa.md): Automated validation gate, clean extraction testing, and structured QA reporting.

## Key Operational Rules
1. **Never send `game_ready` prematurely**: Only send it once assets are loaded, the title screen or gameplay is visible, and the user can interact.
2. **Audio Visibility Pause**: Audio must pause when the tab/window is hidden and resume when returning.
3. **Mute Button Required**: The player must be able to mute/unmute audio via on-screen HUD/settings.
4. **Archive Root Index**: The production ZIP must have `index.html` at the root with 0 broken asset paths.
5. **No Unauthorized Analytics**: Zero unapproved external tracking or ad networks.
