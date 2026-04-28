# Void Striker

A top-down 2D twin-stick shooter built with HTML5 Canvas and vanilla JavaScript.

![Void Striker](https://img.shields.io/badge/HTML5-Canvas-orange) ![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **5 Enemy Types**: Chaser, Shooter, Tank, Dasher, Splitter — each with unique behaviors
- **7 Power-ups**: Health, Rapid Fire, Spread Shot, Shield, Piercing, Speed Boost, Nuke
- **3 Boss Fights**: The Sentinel, The Hive, The Annihilator — multi-phase attack patterns
- **3 Levels**: Void Arena, Neon Grid, The Core — distinct themes and obstacle layouts
- **Complete Game Flow**: Title screen → Waves → Boss → Next level → Victory/Game Over
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
3. Collect power-ups dropped by enemies
4. Defeat the boss at the end of each level
5. Beat all 3 levels to win!

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
    └── utils.js        # Math helpers
```

## Development

The game uses pure vanilla JavaScript with no frameworks. All rendering is done via HTML5 Canvas 2D API, and audio is generated procedurally using the Web Audio API.

### Adding New Features

- **New Enemy Type**: Add to `enemy.js` with behavior in `updateBehavior()`
- **New Power-up**: Add to `powerup.js` and handle in `player.js`
- **New Level**: Add to `level.js` with waves and boss definition
- **New Boss**: Add to `boss.js` with phases and attack patterns

## License

MIT License — feel free to use and modify as you like.

## Credits

Built with HTML5 Canvas and vanilla JavaScript.
