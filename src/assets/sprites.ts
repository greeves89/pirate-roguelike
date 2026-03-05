/**
 * Pixel art sprite renderer using canvas primitives.
 * All sprites are drawn procedurally - no external image files required.
 */

export function drawPlayerShip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  scale: number = 1
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);
  ctx.scale(scale, scale);

  // Hull
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(0, 0, 14, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hull highlight
  ctx.fillStyle = '#a0522d';
  ctx.beginPath();
  ctx.ellipse(-3, -5, 6, 12, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Hull outline
  ctx.strokeStyle = '#5c2d0a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 14, 22, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Mast
  ctx.fillStyle = '#6b3a2a';
  ctx.fillRect(-2, -18, 4, 36);

  // Main sail
  ctx.fillStyle = '#e8d5a3';
  ctx.beginPath();
  ctx.moveTo(-10, -14);
  ctx.quadraticCurveTo(-14, -3, -10, 8);
  ctx.lineTo(-1, 8);
  ctx.lineTo(-1, -14);
  ctx.fill();

  ctx.fillStyle = '#d4c090';
  ctx.beginPath();
  ctx.moveTo(10, -14);
  ctx.quadraticCurveTo(14, -3, 10, 8);
  ctx.lineTo(1, 8);
  ctx.lineTo(1, -14);
  ctx.fill();

  // Sail outline
  ctx.strokeStyle = '#b8a070';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-10, -14); ctx.quadraticCurveTo(-14, -3, -10, 8); ctx.lineTo(1, 8); ctx.lineTo(1, -14); ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(10, -14); ctx.quadraticCurveTo(14, -3, 10, 8); ctx.lineTo(-1, 8); ctx.lineTo(-1, -14); ctx.closePath();
  ctx.stroke();

  // Skull and crossbones on sail (mini)
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(-5, -4, 3, 0, Math.PI * 2);
  ctx.fill();
  // X cross bones
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-8, -2); ctx.lineTo(-2, -8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-2, -2); ctx.lineTo(-8, -8); ctx.stroke();

  // Cannon ports
  ctx.fillStyle = '#2a1800';
  ctx.fillRect(-15, -6, 4, 4);
  ctx.fillRect(-15, 2, 4, 4);
  ctx.fillRect(11, -6, 4, 4);
  ctx.fillRect(11, 2, 4, 4);

  // Bow
  ctx.fillStyle = '#7a3b10';
  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(-6, -18);
  ctx.lineTo(6, -18);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawEnemySloop(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  hp: number,
  maxHp: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);

  // Hull
  ctx.fillStyle = '#8b1a1a';
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5a0000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Mast
  ctx.fillStyle = '#4a2010';
  ctx.fillRect(-1.5, -13, 3, 26);

  // Sail
  ctx.fillStyle = '#cc4444';
  ctx.beginPath();
  ctx.moveTo(-8, -10);
  ctx.quadraticCurveTo(-11, 0, -8, 8);
  ctx.lineTo(0, 8); ctx.lineTo(0, -10);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(8, -10);
  ctx.quadraticCurveTo(11, 0, 8, 8);
  ctx.lineTo(0, 8); ctx.lineTo(0, -10);
  ctx.fill();

  ctx.restore();
}

export function drawEnemyFrigate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);

  // Hull - larger
  ctx.fillStyle = '#6b1515';
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3a0000';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Deck stripe
  ctx.fillStyle = '#5a1010';
  ctx.fillRect(-16, -8, 32, 5);

  // Two masts
  ctx.fillStyle = '#4a2010';
  ctx.fillRect(-2, -22, 3.5, 44);
  ctx.fillRect(-1.5, -8, 3, 20);

  // Main sail
  ctx.fillStyle = '#bb3333';
  ctx.beginPath();
  ctx.moveTo(-12, -18);
  ctx.quadraticCurveTo(-16, -5, -12, 8);
  ctx.lineTo(-1, 8); ctx.lineTo(-1, -18);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(12, -18);
  ctx.quadraticCurveTo(16, -5, 12, 8);
  ctx.lineTo(1, 8); ctx.lineTo(1, -18);
  ctx.fill();

  // Cannon ports
  ctx.fillStyle = '#1a0000';
  for (let i = -1; i <= 1; i++) {
    ctx.fillRect(-18, i * 8 - 2, 4, 4);
    ctx.fillRect(14, i * 8 - 2, 4, 4);
  }

  ctx.restore();
}

export function drawEnemyKraken(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number
): void {
  ctx.save();
  ctx.translate(x, y);

  const pulse = Math.sin(time * 2) * 0.1 + 1;

  // Body
  ctx.fillStyle = '#1a1a4a';
  ctx.beginPath();
  ctx.arc(0, 0, 28 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2a2a6a';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Tentacles (8 tentacles)
  ctx.strokeStyle = '#111133';
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i++) {
    const baseAngle = (i / 8) * Math.PI * 2 + time * 0.5;
    const wave = Math.sin(time * 2 + i) * 0.4;
    ctx.beginPath();
    ctx.moveTo(Math.cos(baseAngle) * 20, Math.sin(baseAngle) * 20);
    const midX = Math.cos(baseAngle + wave) * 45;
    const midY = Math.sin(baseAngle + wave) * 45;
    const endX = Math.cos(baseAngle + wave * 1.5) * 65;
    const endY = Math.sin(baseAngle + wave * 1.5) * 65;
    ctx.quadraticCurveTo(midX, midY, endX, endY);
    ctx.stroke();
  }

  // Inner body detail
  ctx.fillStyle = '#2a2a6a';
  ctx.beginPath();
  ctx.arc(0, 0, 18 * pulse, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#ff4400';
  ctx.beginPath();
  ctx.arc(-9, -5, 6, 0, Math.PI * 2);
  ctx.arc(9, -5, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(-9, -5, 3, 0, Math.PI * 2);
  ctx.arc(9, -5, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawEnemyGhost(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  time: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);

  const alpha = 0.6 + Math.sin(time * 3) * 0.2;
  ctx.globalAlpha = alpha;

  // Ghost ship - ethereal
  ctx.fillStyle = '#88aaff';
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#aaccff';
  ctx.fillRect(-1.5, -16, 3, 32);

  // Torn sails
  ctx.fillStyle = 'rgba(180, 200, 255, 0.7)';
  ctx.beginPath();
  ctx.moveTo(-9, -12);
  ctx.lineTo(-12, 2);
  ctx.lineTo(-9, 8);
  ctx.lineTo(0, 8);
  ctx.lineTo(0, -12);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(9, -12);
  ctx.lineTo(12, 2);
  ctx.lineTo(9, 8);
  ctx.lineTo(0, 8);
  ctx.lineTo(0, -12);
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.restore();
}

export function drawBoss(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  time: number,
  name: string
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);

  // Giant ship hull
  ctx.fillStyle = '#2d0050';
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4a0080';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Gold trim
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 36, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Three masts
  ctx.fillStyle = '#1a0030';
  ctx.fillRect(-2, -32, 4, 64);
  ctx.fillRect(-1.5, -24, 3, 30); // second mast offset effect

  // Sails - dark purple
  ctx.fillStyle = '#4a0080';
  for (let side = -1; side <= 1; side += 2) {
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.quadraticCurveTo(side * 22, -10, side * 18, 12);
    ctx.lineTo(0, 12);
    ctx.closePath();
    ctx.fill();
  }

  // Cannon ports - many
  ctx.fillStyle = '#0a0020';
  for (let i = -2; i <= 2; i++) {
    ctx.fillRect(-27, i * 10 - 3, 5, 5);
    ctx.fillRect(22, i * 10 - 3, 5, 5);
  }

  // Glowing effect
  ctx.shadowColor = '#8800ff';
  ctx.shadowBlur = 15 + Math.sin(time * 3) * 5;
  ctx.strokeStyle = '#8800ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 38, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.restore();
}

export function drawProjectile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: 'cannon' | 'musket' | 'bomb' | 'enemy',
  angle: number,
  time: number
): void {
  ctx.save();
  ctx.translate(x, y);

  if (type === 'cannon') {
    ctx.rotate(angle);
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.arc(-1, -1, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'musket') {
    ctx.rotate(angle);
    ctx.fillStyle = '#ccc';
    ctx.beginPath();
    ctx.ellipse(0, 0, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Trail
    ctx.fillStyle = 'rgba(255,255,200,0.4)';
    ctx.fillRect(-1, 3, 2, 10);
  } else if (type === 'bomb') {
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Fuse spark
    const sparkPhase = time * 10;
    ctx.strokeStyle = `hsl(${sparkPhase * 30 % 60 + 20}, 100%, 60%)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.quadraticCurveTo(5, -14, 3, -18);
    ctx.stroke();
    // Spark
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(3 + Math.sin(sparkPhase) * 2, -18 + Math.cos(sparkPhase) * 2, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'enemy') {
    ctx.rotate(angle);
    ctx.fillStyle = '#882200';
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawExplosion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number, // 0..1
  radius: number
): void {
  ctx.save();
  ctx.translate(x, y);

  const r = radius * progress;
  const alpha = 1 - progress;

  // Outer ring
  ctx.globalAlpha = alpha * 0.6;
  ctx.fillStyle = '#ff6600';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Inner bright
  ctx.globalAlpha = alpha * 0.8;
  ctx.fillStyle = '#ffcc00';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
  ctx.fill();

  // White core
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.restore();
}

export function drawXPOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number,
  big: boolean = false
): void {
  ctx.save();
  ctx.translate(x, y);

  const pulse = Math.sin(time * 4) * 0.2 + 1;
  const r = (big ? 7 : 4) * pulse;

  ctx.shadowColor = '#00ffcc';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#00ffcc';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#aafff5';
  ctx.beginPath();
  ctx.arc(-r * 0.3, -r * 0.3, r * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

export function drawIsland(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  seed: number
): void {
  ctx.save();
  ctx.translate(x, y);

  // Beach
  ctx.fillStyle = '#d4a96a';
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r = radius + Math.sin(a * 3 + seed) * 10;
    if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();

  // Grass
  ctx.fillStyle = '#2d6a2d';
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r = radius * 0.7 + Math.sin(a * 4 + seed * 2) * 8;
    if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();

  // Palm tree (if big enough)
  if (radius > 40) {
    // Trunk
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(-3, -radius * 0.5 - 20, 6, 25);
    // Leaves
    ctx.fillStyle = '#1a5c1a';
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.5 - 20);
      ctx.quadraticCurveTo(
        Math.cos(a) * 20, -radius * 0.5 - 20 + Math.sin(a) * 10,
        Math.cos(a) * 30, -radius * 0.5 - 10
      );
      ctx.quadraticCurveTo(Math.cos(a) * 15, -radius * 0.5 - 5, 0, -radius * 0.5 - 20);
      ctx.fill();
    }
  }

  ctx.restore();
}

export function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  hp: number,
  maxHp: number,
  isPlayer: boolean = false
): void {
  const h = 6;
  ctx.fillStyle = '#440000';
  ctx.fillRect(x - width / 2, y, width, h);

  const pct = Math.max(0, hp / maxHp);
  const barColor = isPlayer ? '#22cc22' : (pct > 0.5 ? '#cc2222' : (pct > 0.25 ? '#ccaa00' : '#cc2222'));
  ctx.fillStyle = barColor;
  ctx.fillRect(x - width / 2, y, width * pct, h);

  ctx.strokeStyle = '#222';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - width / 2, y, width, h);
}

export function drawOceanBackground(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  time: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  // Base ocean
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, '#0a1628');
  gradient.addColorStop(1, '#0d2545');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Animated wave grid
  ctx.strokeStyle = 'rgba(36, 86, 164, 0.25)';
  ctx.lineWidth = 1;

  const tileSize = 80;
  const offX = (-cameraX % tileSize + tileSize) % tileSize;
  const offY = (-cameraY % tileSize + tileSize) % tileSize;

  for (let gy = -tileSize; gy < canvasHeight + tileSize; gy += tileSize) {
    for (let gx = -tileSize; gx < canvasWidth + tileSize; gx += tileSize) {
      const wx = gx + offX;
      const wy = gy + offY;
      const wave = Math.sin((wx + cameraX) * 0.02 + time * 0.8) *
                   Math.cos((wy + cameraY) * 0.02 + time * 0.6) * 4;
      ctx.beginPath();
      ctx.arc(wx + wave, wy + wave, 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Wave lines
  ctx.strokeStyle = 'rgba(36, 86, 164, 0.15)';
  ctx.lineWidth = 1.5;
  const waveStep = 120;
  const waveOffY = (-cameraY % waveStep + waveStep) % waveStep;

  for (let wy = -waveStep; wy < canvasHeight + waveStep; wy += waveStep) {
    const y = wy + waveOffY;
    ctx.beginPath();
    for (let wx = 0; wx < canvasWidth; wx += 4) {
      const wave = Math.sin((wx + cameraX + time * 30) * 0.015) * 5;
      if (wx === 0) ctx.moveTo(wx, y + wave);
      else ctx.lineTo(wx, y + wave);
    }
    ctx.stroke();
  }
}
