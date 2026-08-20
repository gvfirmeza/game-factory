# Game Design Intent: Lumber Tycoon

## 1. Core Experience & Emotional Target
The player should feel the satisfaction of building something from nothing—starting as a lone lumberjack with a rusty axe, progressively growing into a powerful lumber empire with workers, upgraded tools, and vast forest territories. The core emotion is **progression satisfaction** and **empowerment**.

**Key feelings:**
- Initial hook: "One more tree" compulsion from immediate cash rewards
- Mid-game: Strategic satisfaction of hiring workers and watching them produce
- Late-game: Pride in a fully automated, efficient lumber operation

## 2. Core Gameplay Loop
```
CHOP → COLLECT → CARRY → SELL → UPGRADE → UNLOCK → AUTOMATE → REPEAT
```

**Feedback cadence:**
- Chop: Visual/audio feedback (tree cracks, wood particles, progress bar)
- Collect: Satisfying pickup sound, inventory count updates
- Carry: Visual weight indicator (player slows slightly, logs visible)
- Sell: Cash popup, satisfying coin sound, balance updates
- Upgrade: Immediate stat improvement, visual change on player/worker
- Unlock: New area reveal, new tree types, new possibilities

## 3. Primary Player Verb
**CHOP** — Tapping/clicking on trees to break them down. This is the most frequent, responsive, and satisfying action. Every chop should feel impactful with screen shake, particle bursts, and sound.

## 4. Mechanic Purpose Contract

### Tree Chopping
- **PURPOSE**: Core engagement mechanic; generates all resources
- **TEACHING**: First 10 seconds—chop tutorial tree with clear visual guidance
- **APPLICATION**: Every tree requires repeated interaction; progress visible via cracks/health
- **ESCALATION**: Larger trees require more hits; better axes reduce hit count
- **MASTERY**: Speed chopping (rapid tap timing) for bonus yield

### Log Carrying
- **PURPOSE**: Creates tension between profit (carry more) and risk (slower movement)
- **TEACHING**: Capacity shown on UI; over-capacity visually slows player
- **APPLICATION**: Player decides when to return to base based on carry load
- **ESCALATION**: Upgrades increase capacity, enabling longer forest runs
- **MASTERY**: Optimal routing—knowing when to sell vs when to keep chopping

### Cash Economy
- **PURPOSE**: Progression gate; all upgrades require earned currency
- **TEACHING**: First sale shows cash popup + balance update
- **APPLICATION**: Every action earns/spends cash; shop shows clear costs
- **ESCALATION**: Costs increase exponentially; better trees = higher value wood
- **MASTERY**: ROI analysis—knowing which upgrade gives best value first

### NPC Workers
- **PURPOSE**: Automation layer; transforms active gameplay to management
- **TEACHING**: Hire first worker cheap; observe them work independently
- **APPLICATION**: Workers auto-chop, carry, sell; player can assign areas
- **ESCALATION**: More workers, higher levels, unlock premium worker types
- **MASTERY**: Worker placement optimization for maximum throughput

### Forest Zones
- **PURPOSE**: Content gating; provides long-term goals and variety
- **TEACHING**: Visible locked areas with preview of what's inside
- **APPLICATION**: Each zone has unique tree types, higher value wood
- **ESCALATION**: Zone costs increase; require specific axe levels to access
- **MASTERY**: Mastering each zone's optimal farming routes

### Upgrade Shop
- **PURPOSE**: Progression system; converts currency to permanent power
- **TEACHING**: Clear upgrade tree with visible stat improvements
- **APPLICATION**: Purchase upgrades that immediately improve gameplay
- **ESCALATION**: Costs scale; later upgrades require rare/expensive wood
- **MASTERY**: Build order optimization for fastest progression

## 5. Player Learning Progression

### First 10 Seconds
- Player sees character in forest clearing
- Single highlighted tree with clear "TAP TO CHOP" prompt
- Chop the tree → logs appear → pickup animation → walk to sell zone
- First sale: massive cash popup, coins flying, balance updates

### First 2 Minutes
- Player has basic understanding of Chop → Carry → Sell loop
- Has earned first cash
- Sees upgrade shop with affordable first upgrade (better axe)
- Purchases upgrade → feels immediate improvement

### First 10 Minutes
- Player has hired first worker
- Unlocked second forest zone
- Understanding of zone-specific tree values
- Workers are producing passively

### End Game
- Full automation with multiple workers across zones
- All upgrades purchased
- Optimized routes and worker placement
- Satisfying visual of busy lumber operation

## 6. Zero Filler Content Rule

### Included Systems (Justified)
| System | Justification |
|--------|--------------|
| Tree Chopping | Core verb, primary engagement |
| Log Carrying | Resource transport, capacity management |
| Cash Selling | Reward delivery, progression currency |
| Upgrade Shop | Progression system, power growth |
| NPC Workers | Automation, management layer |
| Forest Zones | Content variety, progression gates |
| Save/Load | Essential for mobile sessions |

### Excluded Systems (Not Justified)
| System | Reason |
|--------|--------|
| Boss fights | Doesn't fit tycoon progression |
| PvP/Competitive | Single-player experience |
| Crafting system | Unnecessary complexity |
| Story/Narrative | Progression IS the story |
| Complex dialogue | Would slow core loop |

Every included system directly serves the Chop → Collect → Carry → Sell → Upgrade → Unlock → Automate → Repeat loop.