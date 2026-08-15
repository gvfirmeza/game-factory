# AI Game Factory — Workspace Agent Rules & Guidelines

## Studio Operational Model
The AI Game Factory is a multi-agent autonomous game creation studio. Rather than a single prompt attempting to design, draw, code, test, polish, and package everything in one giant unverified step, development is partitioned across specialized subagents with explicit artifact handoffs.

## Specialized Roles
- **producer**: Pipeline coordinator & state machine manager (`metadata.json`, `execution-trace.json`).
- **game-designer**: Designs gameplay mechanics, content budgets (`content-requirements.json`), and progression beats (`game-design.md`).
- **art-director**: Designs visual identity, color palettes, and procedural vector asset recipes (`art-direction.md`, `asset-manifest.json`).
- **technical-director**: Designs entity systems, kinematic physics, and audio architectures (`technical-plan.md`).
- **builder**: Implements clean HTML5/Canvas source code (`source/*`).
- **playtester**: Adversarially tests mechanics, input triggers, physics edge cases, and verifies all coverage checks (`reports/playtest-*.md`).
- **debugger**: Fixes reported runtime bugs, collision glitches, enemy physics models, and text wrapping issues.
- **content-reviewer**: Evaluates world scale and content density against the content budget; issues `PASS` or `EXPAND` (`reports/content-review-*.md`).
- **polisher**: Injects juice, squash & stretch, screen shake, particles, and procedural audio chord synthesis.
- **final-reviewer**: Independent gatekeeper; issues binding PASS / FAIL review with Content Completeness Score (`reports/review-*.md`).
- **playgama-specialist**: Platform publishing authority; validates official SDK integration, Game Ready timing, save/load persistence, audio/visibility lifecycle, UX compliance, clean ZIP extraction, and generates `publication-manifest.json` and `reports/playgama-qa.md`.
- **build-publisher**: Packages verified games into standalone distributions (`build/*.zip`).

## Rules & Constraints
1. **Artifact-First**: Never proceed to implementation without design, art, and technical artifacts.
2. **Real Subagent Delegation**: The Producer MUST always delegate tasks using native `invoke_subagent` calls. Monolithic fallback is strictly forbidden.
3. **Zero-Friction Interactive Title Screens**: Title screens must NEVER be a fragile static canvas draw that blocks input. Use interactive DOM overlay buttons (`#btn-play-game`) alongside universal key listeners (`Space`, `Enter`, `E`, `W`, `Arrows`, `Click`, `PointerDown`).
4. **Enemy Physics & Grounded Clamp**: Ground enemies MUST always simulate real platform gravity (`vy += 800 * dt`) and platform AABB collision resolution. Ground charges/dashes MUST strictly clamp to platform bounds `[minX, maxX]` and enter a dazed stun state upon hitting boundaries or walls. Ground enemies must never launch or fly into the sky.
5. **Dialogue & UI Spatial Separation**: Dialogue boxes MUST use 100% solid, opaque backplates (`#0A1610`) to eliminate canvas pixel bleed-through. UI notifications / toast banners must NEVER share coordinate space with the dialogue box. Dialogue dismissal MUST enforce a minimum 250ms input debounce cooldown to prevent instant re-open typewriter stutter.
6. **Playgama Readiness & Blocking Gate**: A game is NOT ready for distribution until it achieves `PLAYGAMA_READY` status via `node scripts/validate-playgama.js <id>`. Mandatory platform requirements include:
   - `window.bridge.platform.sendMessage('game_ready')` emitted ONLY after assets are loaded and the player can interact.
   - On-screen Audio Mute control (`🔊 / 🔇`) and automatic audio pause on tab visibility change.
   - Zero prohibited third-party tracking scripts or broken external CDN assets.
   - Production ZIP contains `index.html` at the archive root (no nested folders).
   - Publication metadata manifest generated at `games/<id>/playgama/publication-manifest.json`.
7. **Explicit Lifecycle States**: The studio recognizes 7 distinct lifecycle states: `DEVELOPMENT` -> `QA` -> `HTML5_READY` -> `PLAYGAMA_QA` -> `PLAYGAMA_BLOCKED` -> `PLAYGAMA_READY` -> `PUBLISHED`.
8. **Deterministic Test Harnesses**: All test and QA scripts MUST include watchdog hard-timeouts, explicit `GameLoop.stop()` calls, active timer tracking and cleanup in `finally`, and deterministic `process.exit(0/1)`.
9. **Cache-Busting & Direct Window Play**: Studio players and iframes must always load games with cache-busting timestamps (`?t=Date.now()`) and provide a direct full-window link (`/games/<id>/source/index.html`).
10. **Standalone Independence**: Games must run 100% offline with zero broken asset dependencies or external CDN scripts.
11. **Iframe & Fullscreen Permissions**: Game players and iframes MUST always include `allow="fullscreen; autoplay; gamepad"` and `allowfullscreen="true"`, with auto-focusing on iframe load.
12. **Orientation Responsiveness**: Games and studio containers must dynamically support both Landscape (720x450 / 16:9) and Portrait (480x800) without distortion.
13. **Juice by Default**: Every interaction must have visual/audio feedback.
14. **No Fake Progress**: Builds and playtests must reflect real execution.
15. **Air-Dash Constraints (1x per Airborne Period)**: Players are strictly limited to ONE mid-air dash per jump/fall. `hasAirDash` is consumed on air dash and resets ONLY upon landing on a solid platform (`isGrounded === true`).
16. **Level Design Ergonomics & Anti-Trapping**: Jump pads/spore mushrooms MUST always be placed in open vertical chutes leading directly to upper platforms (never placed under low ceilings that cause infinite bounce loops). All pits and secret rooms MUST provide two-way vertical traversal (step heights $\le 80\text{px}$ or return springboards). Headroom above all walkways must be $\ge 70\text{px}$.
17. **Diegetic Signposting & Powerup Modals**: Never spam floating neon text banners across room boundaries. Central spawn hubs use subtle, minimalist wooden trail posts. Major powerups/abilities pause gameplay and render a clean, centered modal card with clear instructions and an explicit `[✖]` close button.
18. **Save Reset & Ephemeral Test Mode**: Every game must support `?reset=1` (wipes saved data on start) and `?nosave=1` (ephemeral in-memory test session without writing to disk). The studio UI player toolbar provides dedicated `🗑️ Reset Save` and `💾 Save: ON/OFF` toggle buttons. Game Title and Pause screens must provide accessible Save Reset options so testers and players can start fresh at any time with zero friction.


