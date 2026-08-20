# Technical Plan: Lumber Tycoon

## Architecture Overview

### Engine Integration
- Import from `engine/index.js` for core systems
- Use `GameLoop` for fixed timestep 60Hz loop
- Use `CollisionUtils` for AABB collision detection
- Use `InputManager` for touch/click input handling

### Core Systems

#### Game State Manager
```
GameState {
  cash: number
  axeTier: number
  capacityLevel: number
  speedLevel: number
  workerCount: number
  workerLevels: number[]
  unlockedZones: boolean[]
  stats: PlayerStats
  settings: GameSettings
}
```

#### Entity Component System
- **Player**: Position, Velocity, Input, Animation, Inventory
- **Tree**: Position, Type, HP, State (Standing/Falling/Fallen), Logs
- **Worker**: Position, Velocity, State, Target, Inventory
- **Log**: Position, Velocity, State (Dropped/Carried/Sold)
- **Structure**: Position, Type, InteractionRange

### System Architecture

#### 1. Input System
- Touch/click detection for mobile
- Virtual joystick for movement
- Tap targets for interactions
- UI button handlers

#### 2. Movement System
- Player movement with acceleration/friction
- Worker pathfinding and movement
- Carry weight speed penalty
- Collision detection with obstacles

#### 3. Tree System
- Tree spawning and respawning
- HP management and damage
- Falling animation state machine
- Log generation on death

#### 4. Inventory System
- Carry capacity management
- Log collection and dropping
- Auto-sell on platform
- Capacity upgrades

#### 5. Economy System
- Cash management
- Price calculations with multipliers
- Upgrade cost scaling
- Worker cost progression

#### 6. Worker AI System
- State machine: Idle → Find Tree → Chop → Collect → Carry → Sell → Idle
- Pathfinding grid (10x10 per zone)
- Tree assignment (avoid duplicates)
- Capacity management

#### 7. UI System
- HUD display (cash, capacity, workers)
- Shop panels (upgrades, workers, zones)
- Tutorial overlays
- Settings menu

#### 8. Save System
- Auto-save every 60 seconds
- Save on significant events
- LocalStorage persistence
- Load on game start

## Performance Optimization

### Object Pooling
- **Logs**: Pool of 50 log objects
- **Particles**: Pool of 100 particle objects
- **Workers**: Pool of 15 worker objects
- **Effects**: Pool of 30 effect objects

### Rendering Optimization
- **Sprite Batching**: Group similar textures
- **Culling**: Only render visible objects
- **LOD**: Simplify distant objects
- **Texture Atlas**: Combine textures into atlases

### Memory Management
- **Texture Size**: Maximum 1024x1024 per atlas
- **Audio Compression**: MP3-128 for music, MP3-96 for SFX
- **Geometry**: Simple quads for all objects
- **Total Budget**: 14MB maximum

## Mobile Optimization

### Touch Controls
- Virtual joystick for movement
- Tap targets for interactions
- Swipe for menu navigation
- Haptic feedback on actions

### Performance
- Target 60fps on mid-range devices
- Reduce quality on low-end devices
- Pause on background
- Efficient garbage collection

### Battery
- Reduce frame rate when idle
- Pause animations when not visible
- Optimize audio playback

## Save System Implementation

### Save Data Structure
```json
{
  "version": "1.0",
  "timestamp": "2026-08-20T12:00:00Z",
  "gameState": {
    "cash": 1234,
    "axeTier": 2,
    "capacityLevel": 1,
    "speedLevel": 0,
    "workerCount": 3,
    "workerLevels": [1, 1, 0],
    "unlockedZones": [true, true, false],
    "stats": {
      "totalTreesChopped": 156,
      "totalCashEarned": 12340,
      "totalLogsSold": 312
    }
  },
  "settings": {
    "soundEnabled": true,
    "musicEnabled": true,
    "notificationsEnabled": true
  }
}
```

### Save Triggers
- Auto-save every 60 seconds
- Save on upgrade purchase
- Save on worker hire
- Save on zone unlock
- Save on app background/exit

## Tutorial System

### Implementation
- Overlay system for tutorial steps
- Highlight system for interactive objects
- Step-by-step progression
- Skip option available

### Tutorial Steps
1. Welcome message
2. Highlight first tree
3. Teach chopping
4. Teach collection
5. Teach selling
6. Teach upgrades
7. Teach workers
8. Completion message

## Error Handling

### Game Errors
- Graceful handling of missing assets
- Fallback to default values
- Error logging for debugging
- User-friendly error messages

### Performance Errors
- Frame rate monitoring
- Automatic quality reduction
- Memory leak detection
- Object pool exhaustion handling

## Testing Strategy

### Unit Tests
- Game state management
- Economy calculations
- Worker AI logic
- Save/load functionality

### Integration Tests
- Input handling
- Collision detection
- UI interactions
- Audio playback

### Performance Tests
- Frame rate benchmarks
- Memory usage monitoring
- Object pool efficiency
- Mobile device testing

## Build Process

### Development
- Hot reload for rapid iteration
- Debug overlay for development
- Performance profiling tools
- Error logging

### Production
- Code minification
- Asset optimization
- Bundle splitting
- Cache management

## Deployment

### Platform Targets
- Web browsers (Chrome, Safari, Firefox)
- Mobile browsers (iOS Safari, Chrome Android)
- Playgama platform integration

### Performance Requirements
- 60fps on mid-range devices
- 30fps on low-end devices
- < 3 second load time
- < 14MB total size