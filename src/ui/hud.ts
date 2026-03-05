import {
  CANVAS_WIDTH, CANVAS_HEIGHT,
  COLOR_UI_BG, COLOR_UI_BORDER, COLOR_UI_TEXT, COLOR_UI_TITLE,
  XP_PER_LEVEL, MAX_LEVEL,
} from '../game/constants';
import { Player } from '../entities/player';

export class HUD {
  draw(ctx: CanvasRenderingContext2D, player: Player, enemiesLeft: number, zone: string, time: number): void {
    // ─── Top bar ────────────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 44);

    // Zone name
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`⚓ ${zone}`, CANVAS_WIDTH / 2, 16);

    // Enemies
    ctx.fillStyle = '#ff4444';
    ctx.textAlign = 'left';
    ctx.font = '13px monospace';
    ctx.fillText(`Enemies: ${enemiesLeft}`, 12, 16);

    // Score
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`Score: ${player.score}`, CANVAS_WIDTH - 12, 16);

    // ─── HP Bar ─────────────────────────────────────────────────────────────
    const hpBarX = 12;
    const hpBarY = 22;
    const hpBarW = 180;
    const hpBarH = 14;
    const hpPct = Math.max(0, player.hp / player.maxHp);

    ctx.fillStyle = '#440000';
    ctx.fillRect(hpBarX, hpBarY, hpBarW, hpBarH);

    const hpColor = hpPct > 0.5 ? '#22cc22' : hpPct > 0.25 ? '#ccaa00' : '#cc2222';
    ctx.fillStyle = hpColor;
    ctx.fillRect(hpBarX, hpBarY, hpBarW * hpPct, hpBarH);

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.strokeRect(hpBarX, hpBarY, hpBarW, hpBarH);

    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.ceil(player.hp)} / ${player.maxHp}`, hpBarX + hpBarW / 2, hpBarY + 10);

    // HP label
    ctx.fillStyle = '#aaa';
    ctx.textAlign = 'left';
    ctx.fillText('HP', hpBarX, hpBarY - 2);

    // ─── XP Bar ─────────────────────────────────────────────────────────────
    const xpBarX = 12;
    const xpBarY = 38;
    const xpBarW = 180;
    const xpBarH = 5;
    const xpPct = player.getXPProgress();

    ctx.fillStyle = '#001133';
    ctx.fillRect(xpBarX, xpBarY, xpBarW, xpBarH);

    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(xpBarX, xpBarY, xpBarW * xpPct, xpBarH);

    ctx.strokeStyle = '#004466';
    ctx.strokeRect(xpBarX, xpBarY, xpBarW, xpBarH);

    // Level
    ctx.fillStyle = '#00ffcc';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`LV ${player.level}${player.level >= MAX_LEVEL ? ' MAX' : ''}`, xpBarX + xpBarW + 6, xpBarY + 5);

    // ─── Weapon HUD (bottom left) ─────────────────────────────────────────
    const wepX = 12;
    const wepY = CANVAS_HEIGHT - 70;

    const weapons: Array<{ id: string; key: string; label: string; cd: number; maxCd: number }> = [
      { id: 'cannon', key: '1', label: '⚙ Cannon', cd: player.cooldowns.cannon, maxCd: 1 },
      { id: 'musket', key: '2', label: '🎯 Musket', cd: player.cooldowns.musket, maxCd: 1.5 },
      { id: 'bomb',   key: '3', label: '💣 Bomb',   cd: player.cooldowns.bomb,   maxCd: 2.5 },
    ];

    for (let i = 0; i < weapons.length; i++) {
      const w = weapons[i];
      const wx = wepX + i * 100;
      const isActive = player.weapon === w.id;

      // Panel bg
      ctx.fillStyle = isActive ? 'rgba(139, 105, 20, 0.6)' : 'rgba(0,0,0,0.5)';
      ctx.fillRect(wx, wepY, 90, 50);
      ctx.strokeStyle = isActive ? '#ffd700' : '#555';
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.strokeRect(wx, wepY, 90, 50);

      ctx.fillStyle = isActive ? '#ffd700' : '#aaa';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`[${w.key}] ${w.label}`, wx + 6, wepY + 15);

      // Cooldown bar
      const cdPct = Math.max(0, 1 - w.cd);
      ctx.fillStyle = '#220000';
      ctx.fillRect(wx + 6, wepY + 24, 78, 8);
      ctx.fillStyle = w.cd > 0 ? '#aa4400' : '#22aa44';
      ctx.fillRect(wx + 6, wepY + 24, 78 * cdPct, 8);
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 1;
      ctx.strokeRect(wx + 6, wepY + 24, 78, 8);

      ctx.fillStyle = '#ccc';
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(w.cd > 0 ? `CD: ${w.cd.toFixed(1)}s` : 'READY', wx + 6, wepY + 44);
    }

    // ─── Controls reminder (tiny, bottom right) ──────────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(CANVAS_WIDTH - 200, CANVAS_HEIGHT - 48, 190, 45);

    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    const lines = ['WASD: Move', '1/2/3: Weapon', 'Click: Shoot'];
    lines.forEach((l, i) => {
      ctx.fillText(l, CANVAS_WIDTH - 196, CANVAS_HEIGHT - 35 + i * 12);
    });
  }
}

export class SkillChoiceUI {
  private visible: boolean = false;
  private choices: import('../systems/skills').Skill[] = [];
  private hoveredIndex: number = -1;
  private onChoose: ((id: import('../systems/skills').SkillId) => void) | null = null;

  show(
    choices: import('../systems/skills').Skill[],
    onChoose: (id: import('../systems/skills').SkillId) => void
  ): void {
    this.choices = choices;
    this.onChoose = onChoose;
    this.visible = true;
    this.hoveredIndex = -1;
  }

  hide(): void {
    this.visible = false;
  }

  isVisible(): boolean {
    return this.visible;
  }

  handleMouseMove(x: number, y: number): void {
    if (!this.visible) return;
    this.hoveredIndex = -1;
    this.choices.forEach((_, i) => {
      const { cx, cy } = this.getCardPos(i);
      if (x >= cx - 90 && x <= cx + 90 && y >= cy - 70 && y <= cy + 70) {
        this.hoveredIndex = i;
      }
    });
  }

  handleClick(x: number, y: number): void {
    if (!this.visible || !this.onChoose) return;
    this.choices.forEach((skill, i) => {
      const { cx, cy } = this.getCardPos(i);
      if (x >= cx - 90 && x <= cx + 90 && y >= cy - 70 && y <= cy + 70) {
        this.onChoose!(skill.id);
        this.hide();
      }
    });
  }

  private getCardPos(i: number): { cx: number; cy: number } {
    const count = this.choices.length;
    const totalW = count * 200 + (count - 1) * 20;
    const startX = (CANVAS_WIDTH - totalW) / 2 + 100;
    return { cx: startX + i * 220, cy: CANVAS_HEIGHT / 2 };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;

    // Overlay
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Title
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚓ LEVEL UP! ⚓', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 110);

    ctx.fillStyle = '#aaa';
    ctx.font = '14px monospace';
    ctx.fillText('Choose an upgrade for your ship:', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);

    this.choices.forEach((skill, i) => {
      const { cx, cy } = this.getCardPos(i);
      const isHovered = this.hoveredIndex === i;

      // Card
      ctx.fillStyle = isHovered ? 'rgba(139, 105, 20, 0.8)' : 'rgba(10, 22, 40, 0.9)';
      this.roundRect(ctx, cx - 90, cy - 70, 180, 140, 8);
      ctx.fill();

      ctx.strokeStyle = isHovered ? '#ffd700' : '#8b6914';
      ctx.lineWidth = isHovered ? 3 : 2;
      this.roundRect(ctx, cx - 90, cy - 70, 180, 140, 8);
      ctx.stroke();

      // Type badge
      const badgeColor = skill.type === 'weapon' ? '#aa2222' :
                          skill.type === 'defense' ? '#2244aa' : '#228844';
      ctx.fillStyle = badgeColor;
      ctx.fillRect(cx - 40, cy - 68, 80, 16);
      ctx.fillStyle = '#fff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(skill.type.toUpperCase(), cx, cy - 58);

      // Icon
      ctx.font = '32px serif';
      ctx.fillText(skill.icon, cx, cy - 20);

      // Name
      ctx.fillStyle = isHovered ? '#ffd700' : '#f5e6c8';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(skill.name, cx, cy + 10);

      // Level progress
      const stars = '★'.repeat(skill.currentLevel + 1) + '☆'.repeat(skill.maxLevel - skill.currentLevel - 1);
      ctx.fillStyle = '#ffd700';
      ctx.font = '12px monospace';
      ctx.fillText(stars, cx, cy + 26);

      // Description
      ctx.fillStyle = '#ccc';
      ctx.font = '11px monospace';
      const words = skill.description.split(' ');
      let line = '';
      let lineY = cy + 46;
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > 160) {
          ctx.fillText(line, cx, lineY);
          line = word;
          lineY += 14;
        } else {
          line = test;
        }
      }
      if (line) ctx.fillText(line, cx, lineY);
    });
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }
}

export class GameOverUI {
  draw(ctx: CanvasRenderingContext2D, score: number, level: number, zone: string, won: boolean): void {
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.textAlign = 'center';

    if (won) {
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 48px monospace';
      ctx.fillText('🏴‍☠️ VICTORY! 🏴‍☠️', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);
    } else {
      ctx.fillStyle = '#cc2222';
      ctx.font = 'bold 48px monospace';
      ctx.fillText('⚓ SHIPWRECKED ⚓', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);
    }

    ctx.fillStyle = '#f5e6c8';
    ctx.font = '22px monospace';
    ctx.fillText(`Zone: ${zone}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
    ctx.fillText(`Level Reached: ${level}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 5);

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 30px monospace';
    ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);

    ctx.fillStyle = '#00ffcc';
    ctx.font = '18px monospace';
    ctx.fillText('Press [R] to sail again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100);
  }
}

export class MainMenuUI {
  draw(ctx: CanvasRenderingContext2D, time: number): void {
    // Animated title
    const wave = Math.sin(time * 1.5) * 5;

    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 56px monospace';
    ctx.shadowColor = '#ff8800';
    ctx.shadowBlur = 20;
    ctx.fillText('⚓ PIRATE ROGUELIKE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100 + wave);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#cc8800';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('Sail. Plunder. Survive.', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50 + wave * 0.5);

    // Features
    const features = [
      '⚙  3 Weapons: Cannon, Musket, Bomb',
      '☠  4 Enemy Types + Epic Boss Battles',
      '🌿  12 Upgrades in the Skill Tree',
      '🌊  3 Worlds with Permadeath',
    ];

    ctx.fillStyle = '#aaa';
    ctx.font = '14px monospace';
    features.forEach((f, i) => {
      ctx.fillText(f, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + i * 24);
    });

    // Start prompt
    const alpha = 0.5 + Math.sin(time * 3) * 0.5;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#00ffcc';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('Press [ENTER] to set sail!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 140);
    ctx.globalAlpha = 1;

    // Controls
    ctx.fillStyle = '#666';
    ctx.font = '12px monospace';
    ctx.fillText('WASD to move  ·  1/2/3 to switch weapon  ·  Click to fire', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
  }
}
