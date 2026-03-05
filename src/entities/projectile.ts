import { drawProjectile, drawExplosion } from '../assets/sprites';
import { BOMB_RADIUS, BOMB_DAMAGE } from '../game/constants';

export type ProjectileType = 'cannon' | 'musket' | 'bomb' | 'enemy';

export interface Explosion {
  x: number;
  y: number;
  radius: number;
  progress: number; // 0..1
  damage: number;
  fromPlayer: boolean;
}

export class Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: ProjectileType;
  damage: number;
  speed: number;
  angle: number;
  fromPlayer: boolean;
  alive: boolean = true;
  range: number;
  distanceTraveled: number = 0;

  constructor(
    x: number, y: number,
    angle: number,
    speed: number,
    damage: number,
    type: ProjectileType,
    fromPlayer: boolean,
    range: number
  ) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.speed = speed;
    this.damage = damage;
    this.type = type;
    this.fromPlayer = fromPlayer;
    this.range = range;
  }

  update(dt: number): void {
    if (!this.alive) return;
    const dx = this.vx * dt;
    const dy = this.vy * dt;
    this.x += dx;
    this.y += dy;
    this.distanceTraveled += Math.sqrt(dx * dx + dy * dy);
    if (this.distanceTraveled >= this.range) {
      this.alive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D, time: number): void {
    if (!this.alive) return;
    drawProjectile(ctx, this.x, this.y, this.type, this.angle, time);
  }

  /** For bombs: create explosion on impact */
  createExplosion(): Explosion | null {
    if (this.type === 'bomb') {
      return {
        x: this.x,
        y: this.y,
        radius: BOMB_RADIUS,
        progress: 0,
        damage: this.damage,
        fromPlayer: this.fromPlayer,
      };
    }
    return null;
  }
}

export class ExplosionManager {
  explosions: Explosion[] = [];

  add(exp: Explosion): void {
    this.explosions.push(exp);
  }

  update(dt: number): void {
    for (const exp of this.explosions) {
      exp.progress += dt * 1.5; // duration ~0.67s
    }
    this.explosions = this.explosions.filter(e => e.progress < 1);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const exp of this.explosions) {
      drawExplosion(ctx, exp.x, exp.y, exp.progress, exp.radius);
    }
  }
}
