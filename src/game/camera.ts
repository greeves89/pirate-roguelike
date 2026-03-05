import { CAMERA_LERP, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { lerp } from '../utils/math';

export class Camera {
  x: number = 0;
  y: number = 0;
  targetX: number = 0;
  targetY: number = 0;

  follow(targetX: number, targetY: number): void {
    this.targetX = targetX - CANVAS_WIDTH / 2;
    this.targetY = targetY - CANVAS_HEIGHT / 2;
  }

  update(dt: number): void {
    const t = 1 - Math.pow(1 - CAMERA_LERP, dt * 60);
    this.x = lerp(this.x, this.targetX, t);
    this.y = lerp(this.y, this.targetY, t);
  }

  applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-Math.round(this.x), -Math.round(this.y));
  }

  worldToScreen(wx: number, wy: number): { x: number; y: number } {
    return { x: wx - this.x, y: wy - this.y };
  }

  isVisible(wx: number, wy: number, margin: number = 100): boolean {
    const sx = wx - this.x;
    const sy = wy - this.y;
    return sx > -margin && sx < CANVAS_WIDTH + margin &&
           sy > -margin && sy < CANVAS_HEIGHT + margin;
  }
}
