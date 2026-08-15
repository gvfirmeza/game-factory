# Playgama Official Documentation — Source of Truth

This document lists the official Playgama documentation sources used by the AI Game Factory.
Whenever platform requirements or SDK specifications change, update this document and re-verify the derived skills.

| Topic | Official Documentation URL | Last Verified | Derived Skills & Systems |
| :--- | :--- | :--- | :--- |
| **Quick Start** | https://wiki.playgama.com/playgama/quick-start | 2026-08-15 | `playgama-platform.md`, lifecycle workflow |
| **Submitting a Game** | https://wiki.playgama.com/playgama/submitting-a-game | 2026-08-15 | `playgama-submission.md`, `publication-manifest.json` |
| **Technical Requirements** | https://wiki.playgama.com/playgama/game-requirements/technical-requirements | 2026-08-15 | `playgama-requirements.md`, `validate-playgama.js` |
| **Content Requirements** | https://wiki.playgama.com/playgama/game-requirements/content-requirements | 2026-08-15 | `playgama-requirements.md`, content compliance gates |
| **User Experience Requirements** | https://wiki.playgama.com/playgama/game-requirements/user-experience-requirements | 2026-08-15 | `playgama-requirements.md`, UI/UX validation |
| **SDK Getting Started** | https://wiki.playgama.com/playgama/sdk/getting-started | 2026-08-15 | `playgama-sdk.md`, SDK initialization flow |
| **Plain JS SDK Setup** | https://wiki.playgama.com/playgama/sdk/engines/core-plain-js/setup | 2026-08-15 | `engine/platform/playgama/PlaygamaBridge.js` |
| **Fixing Issues & FAQ** | https://wiki.playgama.com/playgama/how-to-fix-issues | 2026-08-15 | `playgama-qa.md`, troubleshooting & error prevention |

---

## Guiding Principles
1. **Source of Truth Rule**: Never invent undocumented Playgama features or requirements. Rely strictly on the official Wiki.
2. **Plain JS Focus**: Since AI Game Factory generates HTML5 / Canvas / Vanilla JS games, all SDK integrations target the **Playgama Bridge Core (Plain JS)** module.
3. **Graceful Fallback**: Platform integrations must operate smoothly in local development, test harnesses, standalone web pages, and the official Playgama container without runtime crashes.
