import { Game } from './src/game/game';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './src/game/constants';

const canvas = document.getElementById('game') as HTMLCanvasElement;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Scale canvas to fit window while preserving aspect ratio
function resize() {
  const scale = Math.min(
    window.innerWidth / CANVAS_WIDTH,
    window.innerHeight / CANVAS_HEIGHT
  );
  canvas.style.width = `${CANVAS_WIDTH * scale}px`;
  canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
}
resize();
window.addEventListener('resize', resize);

const game = new Game(canvas);
game.start();
