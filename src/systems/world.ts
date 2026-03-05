import { drawIsland, drawOceanBackground } from '../assets/sprites';
import { WORLD_SIZE_ZONES } from '../game/constants';
import { randomFloat, randomInt, distance } from '../utils/math';
import { Enemy, EnemyType } from '../entities/enemy';
import { Player } from '../entities/player';

interface Island {
  x: number;
  y: number;
  radius: number;
  seed: number;
}

export class World {
  private islands: Island[] = [];
  zoneIndex: number = 0;
  private worldRadius: number = 2000;

  constructor() {
    this.generateIslands();
  }

  private generateIslands(): void {
    this.islands = [];
    const count = 8 + randomInt(0, 4);
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      while (attempts < 50) {
        attempts++;
        const angle = Math.random() * Math.PI * 2;
        const r = randomFloat(300, this.worldRadius * 0.8);
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        const radius = randomFloat(30, 90);

        let overlap = false;
        for (const isl of this.islands) {
          if (distance(x, y, isl.x, isl.y) < radius + isl.radius + 80) {
            overlap = true;
            break;
          }
        }
        if (!overlap) {
          this.islands.push({ x, y, radius, seed: Math.random() * 100 });
          break;
        }
      }
    }
  }

  spawnEnemies(count: number, playerX: number, playerY: number, difficulty: number, isBossWave: boolean = false): Enemy[] {
    const enemies: Enemy[] = [];
    const zone = WORLD_SIZE_ZONES[Math.min(this.zoneIndex, WORLD_SIZE_ZONES.length - 1)];

    const types: EnemyType[] = ['sloop'];
    if (difficulty >= 2) types.push('frigate');
    if (difficulty >= 3) types.push('kraken', 'ghost');

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 600 + Math.random() * 800;
      const x = playerX + Math.cos(angle) * r;
      const y = playerY + Math.sin(angle) * r;

      let type: EnemyType;
      if (isBossWave && i === 0) {
        type = 'boss';
      } else {
        const rand = Math.random();
        if (rand < 0.5 || types.length === 1) type = 'sloop';
        else if (rand < 0.75) type = types[1] ?? 'sloop';
        else type = types[types.length - 1] ?? 'sloop';
      }

      const enemy = new Enemy(x, y, type, isBossWave && i === 0);
      if (isBossWave && i === 0) {
        enemy.bossName = zone.bossName;
      }
      enemies.push(enemy);
    }

    return enemies;
  }

  checkIslandCollision(x: number, y: number, radius: number): boolean {
    for (const island of this.islands) {
      if (distance(x, y, island.x, island.y) < island.radius + radius) {
        return true;
      }
    }
    return false;
  }

  drawBackground(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, time: number, w: number, h: number): void {
    drawOceanBackground(ctx, cameraX, cameraY, time, w, h);
  }

  drawIslands(ctx: CanvasRenderingContext2D): void {
    for (const island of this.islands) {
      drawIsland(ctx, island.x, island.y, island.radius, island.seed);
    }
  }

  get currentZone() {
    return WORLD_SIZE_ZONES[Math.min(this.zoneIndex, WORLD_SIZE_ZONES.length - 1)];
  }
}
