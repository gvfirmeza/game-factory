# Game Design Document: Fox Street Crossing

## Controls
- Left/Right Arrow or A/D: Move fox left/right between lanes
- Spacebar or Up Arrow: Dash/Jump forward one lane gap
- Pause: Game pauses on menu open

## Player Kinematics
- Horizontal run speed: 200 px/s
- Acceleration: 1200 px/s² (reaches max in ~0.17s)
- Ground friction: 1400 px/s² (snappy stops)
- Jump impulse: -380 px/s initial vertical
- Jump cut cap: -140 px/s when release early
- Gravity: 980 px/s²
- Terminal fall: 500 px/s
- Coyote time: 0.1s
- Jump buffer: 0.12s
- Mid-air dash: 1 per airborne phase, resets on landing

## Lane Structure
- 3 lanes total (lanes marked by road lines)
- Lane width: 60px
- Starting position: Bottom center lane
- Safe zone: Top area above traffic

## Vehicle Types
1. **Car** (40px wide, 60px tall): Speed 150-250 px/s, straight movement
2. **Truck** (60px wide, 80px tall): Speed 100-180 px/s, slower but wider
3. **Bus** (80px wide, 100px tall): Speed 120-200 px/s, largest vehicle, rare

## Apple Collectibles
- 20px diameter sprite
- Worth 10 points each
- 5 apples = 1 extra life
- Glow effect for visual clarity

## Level Structure
- Each level: Cross from bottom to top safe zone
- Level 1: 3 lanes, cars only, slow speed (150-200 px/s)
- Level 2: 4 lanes, mix cars and trucks, medium speed (180-250 px/s)
- Level 3: 5 lanes, mixed traffic + first buses, fast speed (220-300 px/s)
- Level 4+: Increasing lane count, vehicle density, and speed

## Scoring
- Apple: 10 points
- Survive 1 second: 1 point
- Extra life at: 50, 100, 200, 400 points (progressive thresholds)

## Hazards
- Vehicle contact: Reset to start, lose life
- No other hazards - pure traffic dodging