# ⚓ Pirate Roguelike

A canvas-based pirate roguelike game built with TypeScript and Vite.

## Features

- **3 Weapon Types**: Cannon (burst damage), Musket (long-range precision), Bomb (AoE)
- **4 Enemy Types**: Sloop, Frigate, Kraken, Ghost Ship + Epic Boss battles
- **12-Node Skill Tree**: Weapon upgrades, hull defense, utility perks
- **3 World Zones**: Caribbean Shallows → Sargasso Sea → Devil's Triangle
- **Permadeath**: One life, no continues
- **Pixel-Art sprites**: All drawn procedurally with Canvas API

## Controls

| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move ship |
| 1 | Equip Cannon |
| 2 | Equip Musket |
| 3 | Equip Bomb |
| Left Click | Fire weapon |
| R (on game over) | Restart |

## Development

```bash
npm install
npm run dev       # dev server at localhost:3000
npm run build     # production build
npm run preview   # preview build
```

## Tech Stack

- TypeScript
- HTML5 Canvas (no external game engine)
- Vite (bundler)
- All sprites drawn procedurally (no image files)
