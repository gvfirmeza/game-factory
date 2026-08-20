# Game Design: Lumber Tycoon

## 1. Game Overview
**Title:** Lumber Tycoon
**Genre:** 3D Tycoon / Idle Management
**Platform:** Mobile-first HTML5
**Perspective:** Third-person isometric 3D
**Session Length:** 5-30 minute sessions with passive progress

## 2. Player Kinematics

### Movement Parameters
| Parameter | Value | Description |
|-----------|-------|-------------|
| $v_{walk}$ | 120 px/s | Base walking speed |
| $v_{run}$ | 180 px/s | Running speed (with speed upgrade) |
| $a_{accel}$ | 800 px/s² | Acceleration rate |
| $d_{friction}$ | 1000 px/s² | Deceleration/friction |
| $carry_{slow}$ | 0.7x | Speed multiplier when carrying wood |
| $carry_{max}$ | 0.5x | Minimum speed at max capacity |

### Interaction Parameters
| Parameter | Value | Description |
|-----------|-------|-------------|
| $chop_{base}$ | 2.0s | Time to chop basic tree |
| $chop_{rate}$ | 1.0s | Chop interval (time between hits) |
| $pickup_{range}$ | 40px | Distance to auto-pickup logs |
| $sell_{range}$ | 60px | Distance to sell platform |
| $sell_{auto}$ | true | Auto-sell when standing on platform |

## 3. Tree System

### Tree Types
| Tree | HP | Chop Time | Logs | Value | Zone | Unlock Cost |
|------|-----|-----------|------|-------|------|-------------|
| Birch | 3 | 2.0s | 1-2 | $5-10 | Forest | Start |
| Pine | 5 | 3.5s | 2-3 | $15-25 | Forest | Start |
| Oak | 8 | 5.0s | 3-4 | $40-60 | Deep Forest | $500 |
| Maple | 10 | 6.5s | 4-5 | $80-120 | Deep Forest | $500 |
| Cedar | 15 | 8.0s | 5-6 | $150-200 | Ancient Forest | $2000 |
| Redwood | 20 | 10.0s | 6-8 | $300-400 | Ancient Forest | $2000 |

### Tree Behavior
- Trees show progressive damage (cracks, leaning)
- Falling animation: 0.5s lean → 0.3s fall → 1.0s settle
- Fallen trees split into collectible log bundles
- Logs auto-collect after 3 seconds if not picked up
- New trees respawn after 30 seconds in same location

## 4. Axe System

### Axe Tiers
| Axe | Chop Multiplier | Yield Bonus | Cost | Unlock |
|-----|-----------------|-------------|------|--------|
| Rusty | 1.0x | +0 logs | Start | Start |
| Stone | 0.8x | +1 log | $100 | Forest |
| Iron | 0.6x | +2 logs | $500 | Forest |
| Steel | 0.4x | +3 logs | $2000 | Deep Forest |
| Diamond | 0.25x | +4 logs | $10000 | Ancient Forest |
| Golden | 0.15x | +5 logs | $50000 | Ancient Forest |

### Chop Progress
- Each hit deals 1 damage
- Critical hits (random 10%): Deal 2 damage
- Perfect timing bonus: +0.5 damage for tap within 0.1s of hit

## 5. Carrying System

### Capacity
| Upgrade | Max Logs | Cost |
|---------|----------|------|
| Basic | 5 | Start |
| Backpack | 10 | $200 |
| Cart | 20 | $1000 |
| Wagon | 40 | $5000 |
| Truck | 80 | $25000 |

### Carry Mechanics
- Player visually shows log count (stack grows)
- Movement speed scales with load (0.7x to 0.5x)
- Drop wood button to place carried logs (for strategic placement)
- Logs can be carried to sell platform or storage

## 6. Economy System

### Selling Prices
| Zone | Base Price | With Upgrade |
|------|------------|--------------|
| Forest | $5/log | $7/log |
| Deep Forest | $15/log | $20/log |
| Ancient Forest | $50/log | $65/log |

### Price Upgrades
| Upgrade | Price | Effect |
|---------|-------|--------|
| Better Buyer | $300 | +40% sell price |
| Premium Market | $2000 | +60% sell price |
| Luxury Contracts | $15000 | +80% sell price |

### Income Multipliers
- Combo bonus: Selling 10+ logs at once = 1.5x multiplier
- Daily bonus: First sale of session = 2x
- Worker bonus: Having 3+ workers = 1.2x global multiplier

## 7. NPC Worker System

### Worker Tiers
| Worker | Speed | Yield | Cost | Capacity |
|--------|-------|-------|------|----------|
| Novice | 0.5x | 1x | $200 | 3 logs |
| Apprentice | 0.7x | 1x | $800 | 5 logs |
| Journeyman | 1.0x | 1.5x | $3000 | 8 logs |
| Expert | 1.3x | 2x | $12000 | 12 logs |
| Master | 1.5x | 3x | $50000 | 20 logs |

### Worker AI States
1. **Idle** → Find nearest available tree
2. **Walking** → Move to tree location
3. **Chopping** → Perform chop actions
4. **Collecting** → Pick up logs
5. **Carrying** → Walk to sell platform
6. **Selling** → Deposit logs for cash

### Worker Behaviors
- Workers prioritize closest available tree
- Workers avoid trees being chopped by other workers
- Workers pathfind around obstacles
- Workers return to idle after selling
- Workers can be assigned to specific zones (after unlock)

## 8. Forest Zones

### Zone Layout
```
Zone 1: Forest (Start)
├── 15 trees (Birch, Pine)
├── Sell platform
├── Upgrade shop
└── Worker hire area

Zone 2: Deep Forest ($500 unlock)
├── 20 trees (Oak, Maple)
├── Higher value wood
├── Wider paths
└── Scenic elements

Zone 3: Ancient Forest ($2000 unlock)
├── 25 trees (Cedar, Redwood)
├── Premium wood values
├── Dense atmosphere
└── Rare tree variants
```

### Zone Progression
- Each zone requires previous zone access
- Zone unlock is one-time cost
- All zones accessible simultaneously after unlock
- Workers can be assigned to any unlocked zone

## 9. Upgrade System

### Upgrade Categories
1. **Axe Upgrades** → Faster chopping, more yield
2. **Capacity Upgrades** → Carry more logs
3. **Speed Upgrades** → Move faster
4. **Worker Upgrades** → Better hired workers
5. **Zone Access** → Unlock new areas
6. **Price Upgrades** → Better sell prices

### Upgrade Scaling
- Each upgrade tier costs 2.5-3x more than previous
- Later tiers unlock only after specific zone access
- Some upgrades require minimum cash threshold

## 10. Visual & Audio Design

### Visual Style
- Low-poly 3D aesthetic
- Bright, saturated colors
- Clean mobile-friendly UI
- Smooth animations

### Key Visual Effects
- Tree chopping: Wood chips flying, tree shaking
- Tree falling: Lean animation, dust cloud, screen shake
- Log pickup: Log flies to player, counter increments
- Cash sell: Coins explode, balance counter animates
- Upgrade purchase: Player glow, stat popup
- Worker hiring: Worker appears with sparkle effect

### Audio Design
- Chop: Rhythmic wood impact sounds
- Collect: Satisfying pickup chime
- Sell: Coin cascade sound
- Upgrade: Power-up fanfare
- Worker: Axe sound + footsteps

## 11. UI Layout

### HUD Elements
```
┌─────────────────────────────────────┐
│ [Settings]    LUMBER TYCOON    [Save]│
├─────────────────────────────────────┤
│ 💰 $1,234                          │
│ 🪓 Steel Axe (Lv.3)                │
│ 📦 12/20 logs carried              │
│ 👷 3 workers active                │
├─────────────────────────────────────┤
│                                     │
│         [GAME VIEW]                │
│                                     │
├─────────────────────────────────────┤
│ [Shop] [Workers] [Zones] [Sell]    │
└─────────────────────────────────────┘
```

### Interaction Prompts
- Trees: "TAP TO CHOP" with progress bar
- Sell platform: "STAND HERE TO SELL"
- Shop: "OPEN SHOP" button
- Workers: "HIRE WORKER" with cost display

## 12. Save/Load System

### Save Data
- Player cash
- Current axe tier
- Capacity upgrades
- Speed upgrades
- Worker count and levels
- Unlocked zones
- Statistics (total trees chopped, total cash earned)
- Settings (sound, music, notifications)

### Save Triggers
- Auto-save every 60 seconds
- Save on purchase
- Save on zone unlock
- Save on worker hire
- Save on app background/exit

## 13. Tutorial System

### Tutorial Steps
1. **Welcome** → "Welcome to Lumber Tycoon!"
2. **Chop** → "Tap the highlighted tree to chop it"
3. **Collect** → "Walk over logs to collect them"
4. **Sell** → "Stand on the sell platform to sell your wood"
5. **Upgrade** → "Open the shop and buy a better axe"
6. **Hire** → "Hire your first worker"
7. **Complete** → "You're ready to build your empire!"

### Tutorial Design
- Highlighted elements with arrows
- One action at a time
- Skip option available
- No blocking popups

## 14. Performance Targets

### Mobile Optimization
- Target 60fps on mid-range devices
- Object pooling for particles and logs
- LOD system for distant trees
- Texture atlasing for draw call reduction
- Audio compression and pooling

### Memory Management
- Maximum 50 active trees
- Maximum 10 active workers
- Maximum 100 active particles
- Pool size: 50 logs, 30 effects