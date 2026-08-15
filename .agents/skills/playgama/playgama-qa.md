# Playgama QA & Validation Protocols

## 1. Quality Gate: PLAYGAMA_READY
The `PLAYGAMA_READY` status is an authoritative, blocking quality gate. A game CANNOT achieve `PLAYGAMA_READY` unless:
1. `validate-playgama.js` returns `"status": "PASS"` with 0 blocking issues.
2. The production ZIP is unpacked in an isolated directory (`scratch/extracted-playgama/<game-id>`) and executed from there.
3. The Playgama Bridge SDK lifecycle (`initialize` -> `game_ready`) executes without errors.
4. Save/load persistence is verified with state recovery.
5. Audio mute button exists and tab visibility change pauses/restores audio.
6. The publication manifest (`publication-manifest.json`) is populated.

## 2. QA Report Structure (`games/<game-id>/reports/playgama-qa.md`)
```markdown
# Playgama QA

## SDK
- Initialization: PASS/FAIL
- Game Ready: PASS/FAIL
- Storage: PASS/FAIL/N/A
- Ads: PASS/FAIL/N/A
- Language: PASS/FAIL/N/A
- Visibility: PASS/FAIL

## Technical
- ZIP: PASS/FAIL
- index.html root: PASS/FAIL
- File size: PASS/FAIL
- Asset integrity: PASS/FAIL
- External dependencies: PASS/FAIL
- Runtime stability: PASS/FAIL

## UX
- Responsive: PASS/FAIL
- Orientation: PASS/FAIL
- No browser scroll: PASS/FAIL
- UI overflow: PASS/FAIL
- Text overlap: PASS/FAIL
- Audio/mute: PASS/FAIL
- Controls: PASS/FAIL

## Content
- Copyright/IP: PASS/FAIL/REVIEW
- Prohibited content: PASS/FAIL
- Monetization compliance: PASS/FAIL

## Final
PLAYGAMA_READY: YES/NO

Blocking Issues:
- None

Warnings:
- None

Human Review Required:
- None
```
