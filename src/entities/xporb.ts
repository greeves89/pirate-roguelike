import { drawXPOrb } from '../assets/sprites';
import { distance } from '../utils/math';

export class XPOrb {
  x: number;
  y: number;
  value: number;
  big: boolean;
  alive: boolean = true;
  private vx: number = 0;
  private vy: number = 0;
  private attractRadius: number = 150;
  private collectRadius: number = 20;
  private speed: number = 200;

  constructor(x: number, y: number, value: number, big: boolean = false) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.big = big;
    // Scatter on spawn
    const angle = Math.random() * Math.PI * 2;
    const dist = 20 + Math.random() * 30;
    this.vx = Math.cos(angle) * dist;
    this.vy = Math.sin(angle) * dist;
  }

  update(dt: number, playerX: number, playerY: number): boolean {
    if (!this.alive) return false;

    const d = distance(this.x, this.y, playerX, playerY);

    if (d < this.collectRadius) {
      this.alive = false;
      return true; // collected
    }

    if (d < this.attractRadius) {
      // Move towards player
      const dx = playerX - this.x;
      const dy = playerY - this.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      this.vx = (dx / len) * this.speed;
      this.vy = (dy / len) * this.speed;
    } else {
      // Friction on scatter velocity
      this.vx *= Math.pow(0.8, dt * 10);
      this.vy *= Math.pow(0.8, dt * 10);
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    return false;
  }

  draw(ctx: CanvasRenderingContext2D, time: number): void {
    if (!this.alive) return;
    drawXPOrb(ctx, this.x, this.y, time, this.big);
  }
}
