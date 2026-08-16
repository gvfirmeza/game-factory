# AI Game Factory — Workspace Agent Rules & Quality Guidelines

## Studio Operational Model
The AI Game Factory is an autonomous multi-agent game creation studio. Development is partitioned across specialized subagents with explicit artifact handoffs, deterministic runtime verification, and enforceable Quality Gates.

## Redefined Definition of "DONE"
A game is **NOT DONE** simply because:
- it builds or generates a ZIP archive;
- the page loads without crashing;
- the player can perform basic movement;
- there are no obvious JavaScript syntax errors;
- a hypothetical QA report was written.

A game is **ONLY DONE** when:
1. It is mechanically coherent and fully implemented against a machine-readable `game-contract.json`.
2. It has been empirically tested in a 60 FPS runtime loop with simulated inputs.
3. It passes the Quality Budget: **`CRITICAL = 0`**, **`BLOCKING = 0`**, **`MAJOR = 0`**.
4. It passes all 20 Playgama platform compliance gates with verified `PLAYGAMA_READY` status.
5. It receives an independent adversarial review with an overall score $\ge 9.0/10$.

---

## The 11-Stage Studio Quality Pipeline
```
DESIGN (game-contract.json + game-design.md)
  ↓
ART & TECH (art-direction.md + technical-plan.md)
  ↓
IMPLEMENT (source/* leveraging engine/*)
  ↓
STATIC VALIDATION (node scripts/validate-static.js <id>)
  ↓
RUNTIME TEST (node scripts/test-game.js <id>)
  ↓
BUG TRIAGE (node scripts/triage-bugs.js <id>)
  ↓
DEBUG (Surgical root-cause fixes)
  ↓
RUNTIME TEST AGAIN (Verification pass)
  ↓
REGRESSION TEST (Full suite re-test)
  ↓
POLISH (Squash/stretch, particles, procedural audio chords, screen shakes)
  ↓
PLAYGAMA QA (node scripts/validate-playgama.js <id> -> publication-manifest.json)
  ↓
FINAL REVIEW (Adversarial audit across 7 Master Quality Gates)
  ↓
BUILD & PACKAGE (build/<id>.zip with index.html at root)
```

---

## Mandatory Studio Architectural Rules

1. **Artifact-First & Machine-Readable Contracts**:
   - The Game Designer MUST produce `game-contract.json` specifying controls, enemy archetypes, damage rules, NPCs, and win/loss conditions.
   - The Builder MUST implement directly against this contract using `engine/` modules.
   - The Playtester MUST test against this contract.

2. **Centralized Enemy Architecture (`EnemyController`)**:
   - Ground enemies (`patrol_walker`, `rhythmic_hopper`, `proximity_charger`) MUST always simulate platform gravity (`vy += gravity * dt`) and platform swept AABB collision resolution.
   - Ground chargers MUST clamp to platform bounds `[minX, maxX]` and enter a dazed stun state upon hitting walls or edges.
   - Ground enemies must NEVER fly or launch into the sky.

3. **Centralized Dialogue Architecture (`DialogueSystem`)**:
   - Dialogue boxes MUST use 100% solid, opaque backplates (`#0A1610`) to eliminate canvas pixel bleed-through.
   - Dialogue boxes MUST use dynamic word wrapping with safe line margins and single authoritative state locking.
   - Dialogue dismissal MUST enforce a minimum 250ms input debounce cooldown to prevent instant re-open typewriter stutter.
   - UI notifications / toast banners must NEVER share coordinate space with the dialogue box.

4. **Centralized Input & Single Source of Truth (`InputManager`)**:
   - UI control hints (Title Screen, HUD, How-to-Play) MUST be derived directly from `input.getControlHints()`.
   - Never show conflicting key hints (e.g. UI says Shift but game uses X).

5. **Empirical Runtime Playtesting (No Hypothetical Reports)**:
   - The Playtester MUST actually launch and simulate runtime execution (`node scripts/test-game.js <id>`).
   - Every report must provide empirical telemetry (displacement px, jump velocity, draw call count, damage events).

6. **Adversarial Final Review**:
   - The Final Reviewer acts as an external release auditor searching for reasons to reject rather than justify.
   - Has binding veto power to reject any game with open Critical/Blocking/Major defects.

7. **Air-Dash Constraints (1x per Airborne Period)**:
   - Players are strictly limited to ONE mid-air dash per jump/fall.
   - `hasAirDash` is consumed on air dash and resets ONLY upon landing on a solid platform, springboard bounce, thermal updraft, or enemy stomp bounce.

8. **Playgama Compliance & Standalone Independence**:
   - Must achieve `PLAYGAMA_READY` via `node scripts/validate-playgama.js <id>`.
   - `window.bridge.platform.sendMessage('game_ready')` emitted ONLY after assets are loaded and player can interact.
   - On-screen Audio Mute control (`🔊 / 🔇`) and automatic audio pause on tab visibility change.
   - Standalone offline execution with zero broken CDN scripts.
   - Production ZIP contains `index.html` at archive root.
