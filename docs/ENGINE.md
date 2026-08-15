# AI Game Factory — Engine Documentation

## 1. Engine Modules
The engine is built with clean modern JavaScript (ES Modules) designed for 100% offline standalone execution without external CDNs or missing file dependencies.

### Core (`engine/core/`)
- `GameLoop`: Fixed-timestep accumulator loop (60 FPS default) with alpha interpolation for buttery-smooth rendering across 60Hz, 120Hz, and 144Hz displays.
- `Vector2`: 2D vector operations (add, sub, multiplyScalar, length, normalize, distanceTo).
- `EventBus`: Decoupled publisher-subscriber messaging.
- `StateMachine`: Hierarchical state transitions (`enter`, `update`, `exit`).
- `MathUtils`: Damping, lerp, clamping, collision checks (AABB and Circle).

### Rendering & Procedural Art (`engine/rendering/` & `engine/characters/`)
- `CanvasRenderer`: High-DPI retina canvas scaling with aspect ratio preserving viewport fit.
- `ProceduralPrimitives`: RoundedRect, Circle, Ellipse, Polygon, DropShadows, Highlights, Gradients.
- `CharacterComposer`: Procedural vector character generation for cute cartoon avatars (Chickens, Foxes, Raccoons, Frogs) with dynamic squash & stretch deformation.

### Juice & Effects (`engine/particles/` & `engine/effects/` & `engine/animation/`)
- `ParticleSystem`: High-speed pre-allocated particle pooling with presets for star bursts, dust puffs, and sparkles.
- `JuiceEffects`: Camera shake, screen flashes, floating score popups, and hit shockwaves.
- `TweenManager` & `Easings`: Smooth easing curves (`easeOutBounce`, `easeOutElastic`, `easeOutBack`, `easeInOutQuad`).

### Procedural Audio (`engine/audio/`)
- `ProceduralAudio`: Zero-dependency Web Audio API synthesizer for instant sound effects (hops, item pickups, hit crashes, game over chimes, and button clicks).

### Universal Input (`engine/input/`)
- `InputManager`: Unified handling for Keyboard (Arrows/WASD), Touch swipes, taps, and on-screen D-Pad buttons.

### Platform Integration (`engine/platform/playgama/`)
- `PlaygamaBridge`: Seamless integration with Playgama SDK leaderboards and advertisements with transparent localStorage fallback.
