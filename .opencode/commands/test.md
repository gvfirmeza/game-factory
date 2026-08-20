---
description: "Run validation and test suite for a game (usage: /test <game-id>)"
agent: general
---

Run the full validation and test suite for game `$ARGUMENTS`.

## Steps
1. Static validation:
```bash
node scripts/validate-static.js $ARGUMENTS
```

2. Level validation:
```bash
node scripts/validate-level.js $ARGUMENTS
```

3. Reachability check:
```bash
node scripts/validate-reachability.js $ARGUMENTS
```

4. Runtime test:
```bash
node scripts/test-game.js $ARGUMENTS
```

5. Bug triage:
```bash
node scripts/triage-bugs.js $ARGUMENTS
```

6. Report summary: pass/fail per stage, issues found, recommended next steps.
