# Art Direction: Lumber Tycoon

## Visual Identity

### Art Style
**Low-Poly Stylized 3D** - Clean, colorful, mobile-friendly aesthetic with warm wood tones and bright saturated colors.

### Shape Language
- **Organic / Natural**: Rounded tree canopies, smooth bark textures, soft ground contours
- **Angular / Structural**: Clean geometric UI elements, sharp platform edges, defined building shapes
- **Proportions**: Characters and workers are slightly chibi (large heads, compact bodies) for charm

### Color Palette

#### Primary Colors
- **Wood Brown**: #8B4513 (base wood tone)
- **Leaf Green**: #228B22 (forest foliage)
- **Sky Blue**: #87CEEB (background atmosphere)
- **Grass Green**: #32CD32 (ground plane)

#### Secondary Colors
- **Birch White**: #F5F5DC (birch bark)
- **Pine Green**: #006400 (pine needles)
- **Oak Brown**: #654321 (oak bark)
- **Maple Orange**: #FF8C00 (maple leaves)

#### Accent Colors
- **Cash Gold**: #FFD700 (currency, coins)
- **Upgrade Glow**: #00FF00 (upgrade effects)
- **UI Blue**: #4169E1 (buttons, highlights)
- **Warning Red**: #FF4444 (low capacity, alerts)

#### UI Colors
- **Panel Background**: #2C3E50 (dark blue-gray)
- **Panel Border**: #34495E (lighter border)
- **Text Primary**: #FFFFFF (white text)
- **Text Secondary**: #BDC3C7 (gray text)
- **Button Hover**: #3498DB (blue hover)

## Character Design

### Player Character
- **Silhouette**: Compact, rounded body with visible arms for chopping
- **Proportions**: Head 40% of height, body 60%
- **Animation States**: Idle, Walking, Chopping, Carrying, Selling
- **Visual Cues**: Axe changes appearance with upgrades, log stack grows when carrying

### NPC Workers
- **Silhouette**: Similar to player but smaller, with worker hat
- **Proportions**: Slightly smaller than player (80% scale)
- **Animation States**: Idle, Walking, Chopping, Carrying, Selling
- **Visual Cues**: Color-coded by tier (Novice=brown, Master=gold)

## Environment Design

### Forest Zone
- **Ground**: Soft green grass with subtle texture variation
- **Trees**: Mix of birch (white bark) and pine (dark green)
- **Background**: Distant tree silhouettes, soft fog
- **Lighting**: Warm sunlight from upper-left

### Deep Forest Zone
- **Ground**: Darker green with fallen leaves
- **Trees**: Larger oak and maple with richer colors
- **Background**: Dense canopy, filtered light
- **Lighting**: Dappled sunlight through leaves

### Ancient Forest Zone
- **Ground**: Mossy ground with ancient roots
- **Trees**: Massive cedar and redwood with detailed bark
- **Background**: Misty atmosphere, ancient stones
- **Lighting**: Mystical glow, particle effects

## UI Design Language

### Panel Style
- **Material**: Dark blue-gray with subtle gradient
- **Borders**: Rounded corners (8px radius)
- **Shadows**: Soft drop shadow (2px offset, 4px blur)
- **Padding**: Consistent 16px internal spacing

### Button Style
- **Default**: Solid blue with white text
- **Hover**: Lighter blue with glow
- **Pressed**: Darker blue with inset shadow
- **Disabled**: Gray with 50% opacity

### Typography
- **Headers**: Bold, 24px, white
- **Body**: Regular, 16px, white
- **Labels**: Regular, 12px, gray
- **Numbers**: Monospace, 20px, gold (for cash)

## Animation Principles

### Squash & Stretch
- **Chopping**: Slight forward lean (0.08 rad)
- **Walking**: Subtle vertical bob (2px)
- **Carrying**: Backward lean proportional to load
- **Selling**: Upward bounce (4px)

### Particle Effects
- **Wood Chips**: Brown rectangles flying outward on chop
- **Dust Cloud**: Gray circles expanding on tree fall
- **Coin Burst**: Gold circles exploding on sale
- **Sparkle**: White stars on upgrade purchase

### Screen Effects
- **Camera Shake**: Subtle shake on tree fall (2px, 0.3s)
- **Flash**: White flash on upgrade purchase (0.1s)
- **Vignette**: Subtle darkening at screen edges

## Audio Direction

### Music Style
- **Main Theme**: Upbeat, tropical, relaxing with acoustic guitar and light percussion
- **Zone Themes**: Variation on main theme with zone-specific instruments
- **Menu Theme**: Calm, inviting with soft piano

### Sound Effects
- **Chop**: Rhythmic wood impact (different pitch per hit)
- **Tree Fall**: Deep thud with wood cracking
- **Log Pickup**: Satisfying chime (ascending pitch)
- **Cash Register**: Classic cha-ching with coin cascade
- **Upgrade**: Power-up fanfare with sparkle
- **Worker Hire**: Positive confirmation sound

## Performance Considerations

### Texture Optimization
- **Atlas Size**: Maximum 1024x1024 per atlas
- **Format**: PNG-8 for flat colors, PNG-32 for gradients
- **Compression**: Use texture compression for mobile

### Draw Call Management
- **Target**: Maximum 50 draw calls per frame
- **Batching**: Group similar materials together
- **LOD**: Simplify distant objects

### Memory Budget
- **Textures**: 8MB total
- **Audio**: 4MB total
- **Geometry**: 2MB total
- **Total**: 14MB maximum