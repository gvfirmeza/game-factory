---
description: "Build a game into production ZIP (usage: /build <game-id>)"
agent: general
---

Build game `$ARGUMENTS` into a production ZIP.

## Steps
1. Run static validation:
```bash
node scripts/validate-static.js $ARGUMENTS
```

2. Run level validation:
```bash
node scripts/validate-level.js $ARGUMENTS
```

3. Run runtime tests:
```bash
node scripts/test-game.js $ARGUMENTS
```

4. If all pass, build:
```bash
node scripts/build-game.js $ARGUMENTS
```

5. Report result: build location, ZIP size, any errors.
