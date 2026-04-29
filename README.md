# Void Striker

A top-down 2D twin-stick shooter built with HTML5 Canvas and vanilla JavaScript.

![Void Striker](https://img.shields.io/badge/HTML5-Canvas-orange) ![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **5 Enemy Types**: Chaser, Shooter, Tank, Dasher, Splitter — each with unique behaviors
- **7 Power-ups**: Health, Rapid Fire, Spread Shot, Shield, Piercing, Speed Boost, Nuke
- **3 Boss Fights**: The Sentinel, The Hive, The Annihilator — multi-phase attack patterns
- **3 Levels**: Void Arena, Neon Grid, The Core — distinct themes and obstacle layouts
- **Obstacle Collision**: Walls and barriers that block movement with sliding behavior
- **Currency System**: Collect coins from enemies and bosses
- **Shop & Upgrades**: Upgrade your ship between waves (speed, fire rate, damage, HP, pickup range)
- **Persistent Progress**: Upgrades saved between game sessions
- **Complete Game Flow**: Title screen → Waves → Shop → Boss → Next level → Victory/Game Over
- **Polish**: Camera shake, screen flash, slow-mo, procedural audio, particle effects, minimap

## How to Play

### Controls

| Action | Key |
|--------|-----|
| Move | WASD or Arrow Keys |
| Aim | Mouse |
| Shoot | Left Click (hold) |
| Pause | ESC |

### Gameplay

1. Click to start from the title screen
2. Survive waves of enemies across 3 levels
3. Collect coins and power-ups dropped by enemies
4. Visit the shop after each wave to upgrade your ship
5. Defeat the boss at the end of each level
6. Beat all 3 levels to win!

### Power-ups

| Icon | Effect | Duration |
|------|--------|----------|
| `+` | Restore 1 HP | Instant |
| `R` | 2x Fire Rate | 10s |
| `S` | Spread Shot (3 bullets) | 8s |
| `O` | Shield (absorbs 3 hits) | Until broken |
| `P` | Piercing Bullets | 8s |
| `V` | 1.5x Move Speed | 10s |
| `N` | Nuke (kill all enemies) | Instant |

### Currency & Upgrades

Enemies drop coins that you can spend in the shop between waves:

| Upgrade | Max Level | Effect |
|---------|-----------|--------|
| Speed | 5 | Move faster (+15% per level) |
| Fire Rate | 5 | Shoot faster (+20% per level) |
| Damage | 5 | Deal more damage (+25% per level) |
| Max HP | 5 | More health (+1 HP per level) |
| Pickup Range | 3 | Collect power-ups from farther (+50% per level) |

Upgrades persist between game sessions using localStorage.

## Running the Game

Simply open `index.html` in a modern web browser. No build process or dependencies required.

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a local server (recommended for development)
python -m http.server 8000
# Then visit http://localhost:8000
```

## Project Structure

```
shooter/
├── index.html          # Entry point
├── css/
│   └── style.css       # Page styling
└── js/
    ├── main.js         # Bootstrap
    ├── game.js         # Game loop & orchestration
    ├── player.js       # Player entity
    ├── enemy.js        # Enemy types & AI
    ├── boss.js         # Boss entities
    ├── bullet.js       # Bullet system
    ├── powerup.js      # Power-up system
    ├── spawner.js      # Wave/level spawning
    ├── level.js        # Level definitions
    ├── camera.js       # Camera & screen effects
    ├── input.js        # Input handling
    ├── particles.js    # Particle system
    ├── collision.js    # Collision detection
    ├── audio.js        # Procedural sound
    ├── hud.js          # HUD rendering
    ├── ui.js           # Menu screens
    ├── shop.js         # Shop UI & interaction
    ├── upgrades.js     # Upgrade definitions & persistence
    └── utils.js        # Math helpers
```

## Development

The game uses pure vanilla JavaScript with no frameworks. All rendering is done via HTML5 Canvas 2D API, and audio is generated procedurally using the Web Audio API.

### Adding New Features

- **New Enemy Type**: Add to `enemy.js` with behavior in `updateBehavior()`
- **New Power-up**: Add to `powerup.js` and handle in `player.js`
- **New Level**: Add to `level.js` with waves and boss definition
- **New Boss**: Add to `boss.js` with phases and attack patterns
- **New Upgrade**: Add to `upgrades.js` and apply in `player.js`

## License

MIT License — feel free to use and modify as you like.

## Credits

Built with HTML5 Canvas and vanilla JavaScript.
