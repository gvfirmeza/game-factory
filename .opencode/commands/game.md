---
description: "Create a new game through the full AI Game Factory pipeline (usage: /game <game-concept>)"
agent: general
---

You are the **Producer** orchestrating the AI Game Factory pipeline via opencode.

## Game Concept
$ARGUMENTS

## Step 1: Create Workspace
1. Generate a game-id from the concept (lowercase, hyphenated, max 3 words)
2. Create directory `games/<game-id>/`
3. Create `games/<game-id>/metadata.json` with status "IDEA"
4. Write `games/<game-id>/game-brief.md` with the concept

## Step 2: Design Phase (PARALLEL)
Launch these agents in the SAME message using multiple Task tool calls:

```
Task(subagent: "game-designer", prompt: "Read games/<game-id>/game-brief.md. Write game-design-intent.md, game-design.md, game-contract.json, and content-requirements.json in games/<game-id>/.")
```

Wait for completion, then update metadata to "DESIGNED".

## Step 3: Level Design
```
Task(subagent: "level-designer", prompt: "Read games/<game-id>/game-design-intent.md and game-contract.json. Write level-graph.json and ascii-layout.txt in games/<game-id>/.")
```

## Step 4: Design Review
```
Task(subagent: "general", prompt: "Run: node scripts/validate-design.js <game-id>. Then run: node scripts/validate-reachability.js <game-id>. If PASS, write design-validation.md with PASS verdict. If FAIL, write issues and STOP.")
```

## Step 5: Art & Tech (PARALLEL)
Launch in SAME message:
```
Task(subagent: "general", prompt: "Read game-brief and game-design. Write art-direction.md and asset-manifest.json in games/<game-id>/.")
Task(subagent: "general", prompt: "Read game-design and art-direction. Write technical-plan.md in games/<game-id>/.")
```

## Step 6: Build
```
Task(subagent: "builder", prompt: "Read ALL docs in games/<game-id>/. Implement source/index.html, source/style.css, source/game.js, and manifest.json.")
```

## Step 7: Validate
```bash
node scripts/validate-static.js <game-id>
node scripts/validate-level.js <game-id>
node scripts/test-game.js <game-id>
```

## Step 8: Iterate (if needed)
If tests fail:
```
Task(subagent: "debugger", prompt: "Read reports and fix bugs in games/<game-id>/source/.")
```
Then re-run Step 7. Max 5 iterations.

## Step 9: Polish
```
Task(subagent: "polisher", prompt: "Add juice to games/<game-id>/source/game.js. Particles, shake, audio, squash/stretch.")
```

## Step 10: Final Review
```
Task(subagent: "reviewer", prompt: "Evaluate games/<game-id>/ against master quality checklist. Write reports/review-01.md with PASS or FAIL.")
```

If FAIL, loop back to the appropriate agent based on reviewer's routing.

## Step 11: Build Production
```bash
node scripts/build-game.js <game-id>
```

## Step 12: Report
Tell the user:
- Game title and concept
- Pipeline status
- Build location: `games/<game-id>/build/<game-id>.zip`
- Any issues found and resolved
