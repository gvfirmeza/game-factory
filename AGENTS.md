# AI Game Factory — Studio Operational Rules & Quality Guidelines

## Studio Operational Model
The AI Game Factory is an autonomous multi-agent game creation studio. Development is partitioned across specialized subagents with explicit artifact handoffs, mathematical reachability verification, deterministic runtime simulation, and enforceable Quality Gates.

## The Design-First Philosophy
The Factory optimizes for **INTENTIONAL GAMEPLAY**, not content volume.
- Every mechanic, room, enemy, collectible, and NPC must have a concrete reason to exist.
- A smaller game with 5 handcrafted, reachable, well-paced rooms is vastly superior to a game with 20 repetitive, unvalidated rooms.
- A game without NPCs is vastly superior to a game with broken or forced NPCs.
- A game with one excellent, well-integrated mechanic is vastly superior to a game with 5 meaningless mechanics.

---

## The 15-Stage Studio Quality Pipeline
```
CONCEPT (game-brief.md)
  ↓
DESIGN INTENT (game-design-intent.md: Core loop, Verb, Mechanic Purpose Contract)
  ↓
LEVEL GRAPH (level-graph.json + ascii-layout.txt with explicit room purposes)
  ↓
REACHABILITY ANALYSIS (node scripts/validate-reachability.js <id>)
  ↓
DESIGN REVIEW (node scripts/validate-design.js <id> -> design-validation.md: Gate FAIL = DO NOT BUILD)
  ↓
ART & TECH (art-direction.md + technical-plan.md)
  ↓
IMPLEMENTATION (source/* leveraging engine/* and RenderLayers)
  ↓
STATIC VALIDATION (node scripts/validate-static.js <id>)
  ↓
LEVEL VALIDATION (node scripts/validate-level.js <id>)
  ↓
RUNTIME TEST (node scripts/test-game.js <id>)
  ↓
BUG TRIAGE & DEBUG (node scripts/triage-bugs.js <id>)
  ↓
POLISH (Squash/stretch, particles, Web Audio synthesis, screen shakes)
  ↓
PLAYGAMA QA (node scripts/validate-playgama.js <id> -> publication-manifest.json)
  ↓
FINAL REVIEW (node scripts/validate-static.js + 7 Master Quality Gates score >= 9.0/10)
  ↓
BUILD & PACKAGE (node scripts/build-game.js <id> -> build/<id>.zip)
```

---

## Studio Architectural & Quality Rules

1. **Design-First & Pre-Build Gate**:
   - The Game Designer must write `game-design-intent.md` defining the Core Loop, Primary Verb, and Mechanic Purpose Contract (`PURPOSE`, `TEACHING`, `APPLICATION`, `ESCALATION`, `MASTERY`).
   - The Level Designer must produce a structured `level-graph.json` and ASCII paper prototype.
   - The Design Reviewer must certify all 9 Pre-Build Gates in `design-validation.md` before the Builder can write code.

2. **Kinematic Reach & Safety Margin ($\le 82\%$)**:
   - Level geometry must be designed only AFTER player kinematics ($v_{run}, v_{jump}, v_{cut}, g, v_{dash}$) are mathematically established.
   - Required platform jumps must NEVER exceed **$82\%$** of physical ballistic reach ($X_{max} = v_x \cdot \frac{2 v_{jump}}{g}$).
   - Required step heights must NEVER exceed **$70\%$** of max jump height ($H_{max} = \frac{v_{jump}^2}{2g}$).
   - Vertical ceiling clearance above platforms and stompable enemies must be $\ge 70\text{px}$.

3. **No Mandatory NPCs or Cookie-Cutter Systems**:
   - NPCs, dialogue, shops, quests, collectibles, and secondary abilities are strictly OPTIONAL.
   - Do NOT add systems merely because they are common in games. Only include systems that serve the core loop.

4. **Centralized Enemy Architecture (`EnemyController`)**:
   - Ground enemies (`patrol_walker`, `rhythmic_hopper`, `proximity_charger`) MUST always simulate platform gravity (`vy += gravity * dt`) and platform swept AABB collision resolution.
   - Ground chargers MUST clamp to platform bounds `[minX, maxX]` and enter a dazed stun state upon hitting walls or edges.
   - Ground enemies must NEVER fly, float away, or be placed inside spikes/hazards.

5. **Isolated Dialogue & Render Layers (`RenderLayers` & `DialogueSystem`)**:
   - All rendering must adhere to explicit `RenderLayers` (`BACKGROUND` < `WORLD` < `CHARACTERS` < `EFFECTS` < `DIALOGUE` < `HUD` < `OVERLAY`).
   - Dialogue boxes MUST use 100% solid, opaque backplates (`#0A1610`) to eliminate canvas pixel bleed-through.
   - Dialogue boxes MUST use dynamic word wrapping with safe line margins and single authoritative state locking.
   - Dialogue dismissal MUST enforce a minimum 250ms input debounce cooldown.

6. **Air-Dash Constraints (1x per Airborne Period)**:
   - Players are strictly limited to ONE mid-air dash per jump/fall.
   - `hasAirDash` resets ONLY upon landing on a solid platform, springboard bounce, thermal updraft, or enemy stomp bounce.

7. **Factory Benchmark Suite Verification**:
   - All shared engine systems must continuously pass the 8-scenario benchmark suite (`node scripts/test-benchmarks.js`).

8. **Playgama Compliance & Standalone Independence**:
   - Must achieve `PLAYGAMA_READY` via `node scripts/validate-playgama.js <id>`.
   - `window.bridge.platform.sendMessage('game_ready')` emitted ONLY after assets are loaded and player can interact.
   - On-screen Audio Mute control (`🔊 / 🔇`) and automatic audio pause on tab visibility change.
   - Standalone offline execution with zero broken CDN scripts.
   - Production ZIP contains `index.html` at archive root.
