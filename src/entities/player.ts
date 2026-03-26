import {
  PLAYER_SPEED,
  PLAYER_BASE_HP,
  PLAYER_INVINCIBILITY_FRAMES,
  CANNON_DAMAGE, CANNON_SPEED, CANNON_COOLDOWN, CANNON_RANGE,
  MUSKET_DAMAGE, MUSKET_SPEED, MUSKET_COOLDOWN, MUSKET_RANGE,
  BOMB_DAMAGE, BOMB_SPEED, BOMB_COOLDOWN, BOMB_RANGE,
  XP_PER_LEVEL, MAX_LEVEL,
} from '../game/constants';
import { drawPlayerShip, drawHealthBar } from '../assets/sprites';
import { Projectile } from './projectile';
import { SkillTree } from '../systems/skills';
import { clamp, distance } from '../utils/math';

export type WeaponType = 'cannon' | 'musket' | 'bomb';

export class Player {
  x: number;
  y: number;
  angle: number = 0;
  vx: number = 0;
  vy: number = 0;

  hp: number = PLAYER_BASE_HP;
  maxHp: number = PLAYER_BASE_HP;
  invincibilityFrames: number = 0;

  xp: number = 0;
  level: number = 1;

  weapon: WeaponType = 'cannon';
  cooldowns: Record<WeaponType, number> = { cannon: 0, musket: 0, bomb: 0 };

  skillTree: SkillTree = new SkillTree();

  alive: boolean = true;
  score: number = 0;

  private wakeSpriteTimer: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get stats() {
    return this.skillTree.stats;
  }

  takeDamage(amount: number): void {
    if (this.invincibilityFrames > 0) return;
    const reduction = this.stats.armorMultiplier;
    const actual = Math.max(1, Math.floor(amount * (1 - reduction)));
    this.hp = Math.max(0, this.hp - actual);
    // Ghost Form doubles invincibility frames after taking damage
    const iframes = this.stats.ghostMode ? PLAYER_INVINCIBILITY_FRAMES * 2 : PLAYER_INVINCIBILITY_FRAMES;
    this.invincibilityFrames = iframes;
    if (this.hp <= 0) this.alive = false;
  }

  heal(amount: number): void {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  addXP(amount: number): void {
    const boosted = Math.floor(amount * this.stats.xpMultiplier);
    this.xp += boosted;
    this.score += boosted;
  }

  checkLevelUp(): boolean {
    if (this.level >= MAX_LEVEL) return false;
    const needed = XP_PER_LEVEL[this.level] ?? 9999;
    if (this.xp >= needed) {
      this.level++;
      return true;
    }
    return false;
  }

  getXPProgress(): number {
    if (this.level >= MAX_LEVEL) return 1;
    const needed = XP_PER_LEVEL[this.level] ?? 1;
    const prev = this.level > 1 ? (XP_PER_LEVEL[this.level - 1] ?? 0) : 0;
    return clamp((this.xp - prev) / (needed - prev), 0, 1);
  }

  switchWeapon(weapon: WeaponType): void {
    this.weapon = weapon;
  }

  update(dt: number, moveX: number, moveY: number): void {
    if (!this.alive) return;

    // Movement
    const speed = PLAYER_SPEED * this.stats.speedMultiplier;
    this.vx = moveX * speed;
    this.vy = moveY * speed;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Rotation towards movement
    if (moveX !== 0 || moveY !== 0) {
      const targetAngle = Math.atan2(moveY, moveX) - Math.PI / 2;
      const diff = targetAngle - this.angle;
      const normalDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.angle += normalDiff * Math.min(1, dt * 8);
    }

    // Cooldown timers
    for (const w of (['cannon', 'musket', 'bomb'] as WeaponType[])) {
      if (this.cooldowns[w] > 0) this.cooldowns[w] -= dt;
    }

    // Invincibility
    if (this.invincibilityFrames > 0) this.invincibilityFrames -= 60 * dt;

    // HP regen
    if (this.stats.regenRate > 0) {
      this.heal(this.stats.regenRate * dt);
    }

    // Wake timer
    this.wakeSpriteTimer += dt;
  }

  fire(targetX: number, targetY: number): Projectile[] {
    const w = this.weapon;
    const stats = this.stats;

    let baseCooldown = 0;
    let baseDamage = 0;
    let baseSpeed = 0;
    let range = 0;

    if (w === 'cannon') {
      baseCooldown = CANNON_COOLDOWN / 60;
      baseDamage = CANNON_DAMAGE * stats.cannonDamageMultiplier;
      baseSpeed = CANNON_SPEED * stats.cannonSpeedMultiplier;
      range = CANNON_RANGE;
    } else if (w === 'musket') {
      baseCooldown = MUSKET_COOLDOWN / 60;
      baseDamage = MUSKET_DAMAGE * stats.musketDamageMultiplier;
      baseSpeed = MUSKET_SPEED;
      range = MUSKET_RANGE;
    } else if (w === 'bomb') {
      baseCooldown = BOMB_COOLDOWN / 60;
      baseDamage = BOMB_DAMAGE;
      baseSpeed = BOMB_SPEED;
      range = BOMB_RANGE;
    }

    const cd = baseCooldown * (w === 'cannon' ? stats.cannonCooldownMultiplier : 1);

    if (this.cooldowns[w] > 0) return [];
    this.cooldowns[w] = cd;

    const angle = Math.atan2(targetY - this.y, targetX - this.x);
    const projectiles: Projectile[] = [];

    projectiles.push(new Projectile(this.x, this.y, angle, baseSpeed, baseDamage, w, true, range));

    // Multishot for cannon
    if (w === 'cannon' && stats.cannonMultishot > 0) {
      const spread = 0.25;
      for (let i = 0; i < stats.cannonMultishot; i++) {
        const offset = (i % 2 === 0 ? 1 : -1) * spread * (Math.floor(i / 2) + 1);
        projectiles.push(
          new Projectile(this.x, this.y, angle + offset, baseSpeed, baseDamage, w, true, range)
        );
      }
    }

    return projectiles;
  }

  draw(ctx: CanvasRenderingContext2D, time: number): void {
    if (!this.alive) return;

    // Flash when invincible
    if (this.invincibilityFrames > 0 && Math.floor(this.invincibilityFrames / 5) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    drawPlayerShip(ctx, this.x, this.y, this.angle);
    ctx.globalAlpha = 1;

    // HP bar
    drawHealthBar(ctx, this.x, this.y - 40, 50, this.hp, this.maxHp, true);
  }
}
