export class InputManager {
  private keys: Set<string> = new Set();
  private mousePos: { x: number; y: number } = { x: 0, y: 0 };
  private mouseButtons: Set<number> = new Set();
  private mouseJustPressed: Set<number> = new Set();
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      e.preventDefault();
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      this.mousePos.x = (e.clientX - rect.left) * scaleX;
      this.mousePos.y = (e.clientY - rect.top) * scaleY;
    });
    canvas.addEventListener('mousedown', (e) => {
      this.mouseButtons.add(e.button);
      this.mouseJustPressed.add(e.button);
      e.preventDefault();
    });
    canvas.addEventListener('mouseup', (e) => {
      this.mouseButtons.delete(e.button);
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isKeyDown(code: string): boolean {
    return this.keys.has(code);
  }

  isMouseDown(button: number = 0): boolean {
    return this.mouseButtons.has(button);
  }

  wasMouseJustPressed(button: number = 0): boolean {
    return this.mouseJustPressed.has(button);
  }

  getMouseWorld(cameraX: number, cameraY: number): { x: number; y: number } {
    return {
      x: this.mousePos.x + cameraX,
      y: this.mousePos.y + cameraY,
    };
  }

  getMouseScreen(): { x: number; y: number } {
    return { ...this.mousePos };
  }

  clearFrame(): void {
    this.mouseJustPressed.clear();
  }

  getMovementVector(): { x: number; y: number } {
    let x = 0;
    let y = 0;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) y -= 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) y += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;
    const len = Math.sqrt(x * x + y * y);
    if (len > 0) { x /= len; y /= len; }
    return { x, y };
  }
}
