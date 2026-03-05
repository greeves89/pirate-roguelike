import {
  ENEMY_SLOOP_HP, ENEMY_SLOOP_SPEED, ENEMY_SLOOP_DAMAGE,
  ENEMY_FRIGATE_HP, ENEMY_FRIGATE_SPEED, ENEMY_FRIGATE_DAMAGE,
  ENEMY_KRAKEN_HP, ENEMY_KRAKEN_SPEED, ENEMY_KRAKEN_DAMAGE,
  ENEMY_BOSS_HP_MULTIPLIER,
  CANNON_SPEED, CANNON_RANGE,
} from '../game/constants';
import {
  drawEnemySloop, drawEnemyFrigate, drawEnemyKraken,
  drawEnemyGhost, drawBoss, drawHealthBar
} from '../assets/sprites';
import { Projectile } from './projectile';
import { XPOrb } from './xporb';
import { distance, angleTo, randomFloat } from '../utils/math';

export type EnemyType = 'sloop' | 'frigate' | 'kraken' | 'ghost' | 'boss';

interface AIState {
  mode: 'patrol' | 'chase' | 'attack' | 'retreat' | 'circle';
  timer: number;
  patrolAngle: number;
  fireCooldown: number;
  bossPhase: number;
}

export class Enemy {
  x: number;
  y: number;
  angle: number;
  type: EnemyType;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  alive: boolean = true;
  isBoss: boolean;
  bossName: string = '';

  private ai: AIState = {
    mode: 'patrol',
    timer: 0,
    patrolAngle: Math.random() * Math.PI * 2,
    fireCooldown: 1 + Math.random() * 2,
    bossPhase: 0,
  };

  private detectRadius: number;
  private attackRadius: number;
  private fireRadius: number;
  private xpValue: number;

  constructor(x: number, y: number, type: EnemyType, isBoss: boolean = false) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.isBoss = isBoss;
    this.angle = Math.random() * Math.PI * 2;

    switch (type) {
      case 'sloop':
        this.hp = this.maxHp = ENEMY_SLOOP_HP * (isBoss ? ENEMY_BOSS_HP_MULTIPLIER : 1);
        this.speed = ENEMY_SLOOP_SPEED;
        this.damage = ENEMY_SLOOP_DAMAGE * (isBoss ? 2 : 1);
        this.detectRadius = 280;
        this.attackRadius = 200;
        this.fireRadius = 300;
        this.xpValue = isBoss ? 80 : 8;
        break;
      case 'frigate':
        this.hp = this.maxHp = ENEMY_FRIGATE_HP * (isBoss ? ENEMY_BOSS_HP_MULTIPLIER : 1);
        this.speed = ENEMY_FRIGATE_SPEED;
        this.damage = ENEMY_FRIGATE_DAMAGE * (isBoss ? 2 : 1);
        this.detectRadius = 320;
        this.attackRadius = 250;
        this.fireRadius = 350;
        this.xpValue = isBoss ? 150 : 20;
        break;
      case 'kraken':
        this.hp = this.maxHp = ENEMY_KRAKEN_HP * (isBoss ? ENEMY_BOSS_HP_MULTIPLIER : 1);
        this.speed = ENEMY_KRAKEN_SPEED;
        this.damage = ENEMY_KRAKEN_DAMAGE * (isBoss ? 2 : 1);
        this.detectRadius = 400;
        this.attackRadius = 100;
        this.fireRadius = 0; // melee
        this.xpValue = isBoss ? 250 : 40;
        break;
      case 'ghost':
        this.hp = this.maxHp = 60 * (isBoss ? ENEMY_BOSS_HP_MULTIPLIER : 1);
        this.speed = 90;
        this.damage = 15;
        this.detectRadius = 500;
        this.attackRadius = 300;
        this.fireRadius = 350;
        this.xpValue = isBoss ? 120 : 15;
        break;
      case 'boss':
        this.hp = this.maxHp = 800;
        this.speed = 40;
        this.damage = 35;
        this.detectRadius = 800;
        this.attackRadius = 500;
        this.fireRadius = 450;
        this.xpValue = 500;
        break;
    }
  }

  takeDamage(amount: number): boolean {
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) {
      this.alive = false;
      return true;
    }
    return false;
  }

  update(dt: number, playerX: number, playerY: number, time: number): Projectile[] {
    if (!this.alive) return [];

    const dist = distance(this.x, this.y, playerX, playerY);
    const angle = angleTo(this.x, this.y, playerX, playerY);

    this.ai.timer -= dt;
    this.ai.fireCooldown -= dt;

    // State machine
    if (dist < this.detectRadius) {
      if (dist < this.attackRadius) {
        this.ai.mode = 'circle';
      } else {
        this.ai.mode = 'chase';
      }
    } else {
      this.ai.mode = 'patrol';
    }

    // Boss: when low HP, go aggressive
    if (this.type === 'boss' && this.hp < this.maxHp * 0.3) {
      this.ai.mode = 'chase';
    }

    let moveX = 0;
    let moveY = 0;

    switch (this.ai.mode) {
      case 'patrol':
        if (this.ai.timer <= 0) {
          this.ai.patrolAngle += randomFloat(-0.5, 0.5);
          this.ai.timer = randomFloat(1.5, 3.5);
        }
        moveX = Math.cos(this.ai.patrolAngle);
        moveY = Math.sin(this.ai.patrolAngle);
        break;

      case 'chase':
        moveX = Math.cos(angle);
        moveY = Math.sin(angle);
        break;

      case 'circle': {
        // Circle around player
        const circleAngle = angle + Math.PI / 2;
        const desired = 180;
        if (dist > desired + 20) {
          moveX = Math.cos(angle) + Math.cos(circleAngle) * 0.5;
          moveY = Math.sin(angle) + Math.sin(circleAngle) * 0.5;
        } else if (dist < desired - 20) {
          moveX = -Math.cos(angle) + Math.cos(circleAngle) * 0.5;
          moveY = -Math.sin(angle) + Math.sin(circleAngle) * 0.5;
        } else {
          moveX = Math.cos(circleAngle);
          moveY = Math.sin(circleAngle);
        }
        break;
      }
    }

    const len = Math.sqrt(moveX * moveX + moveY * moveY);
    if (len > 0) {
      moveX /= len;
      moveY /= len;
    }

    this.x += moveX * this.speed * dt;
    this.y += moveY * this.speed * dt;

    // Face direction of movement
    if (len > 0) {
      const targetAngle = Math.atan2(moveY, moveX) - Math.PI / 2;
      const diff = targetAngle - this.angle;
      const norm = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.angle += norm * Math.min(1, dt * 5);
    }

    // Fire
    const projectiles: Projectile[] = [];
    if (this.fireRadius > 0 && this.ai.fireCooldown <= 0 && dist < this.fireRadius) {
      const fireCd = this.type === 'boss' ? 0.6 : (this.type === 'frigate' ? 1.5 : 2.0);
      this.ai.fireCooldown = fireCd;

      // Predict player position slightly
      const projCount = this.type === 'boss' ? 3 : (this.type === 'frigate' ? 2 : 1);
      const spread = this.type === 'boss' ? 0.3 : 0.1;

      for (let i = 0; i < projCount; i++) {
        const off = i === 0 ? 0 : ((i % 2 === 0 ? 1 : -1) * spread * Math.ceil(i / 2));
        projectiles.push(new Projectile(
          this.x, this.y,
          angle + off,
          CANNON_SPEED * 0.7,
          this.damage,
          'enemy',
          false,
          CANNON_RANGE * 1.2
        ));
      }
    }

    return projectiles;
  }

  checkPlayerCollision(playerX: number, playerY: number): number {
    const dist = distance(this.x, this.y, playerX, playerY);
    const collisionDist = this.type === 'kraken' ? 40 : 30;
    if (dist < collisionDist) {
      return this.damage * 0.1; // ramming damage per frame * dt
    }
    return 0;
  }

  dropXP(multiplier: number = 1): XPOrb[] {
    const orbs: XPOrb[] = [];
    const total = Math.floor(this.xpValue * multiplier);

    if (this.isBoss) {
      orbs.push(new XPOrb(this.x, this.y, total, true));
      return orbs;
    }

    // Drop multiple small orbs
    const count = Math.min(5, Math.ceil(total / 5));
    const perOrb = Math.floor(total / count);
    for (let i = 0; i < count; i++) {
      orbs.push(new XPOrb(
        this.x + randomFloat(-20, 20),
        this.y + randomFloat(-20, 20),
        perOrb
      ));
    }
    return orbs;
  }

  draw(ctx: CanvasRenderingContext2D, time: number): void {
    if (!this.alive) return;

    switch (this.type) {
      case 'sloop':
        drawEnemySloop(ctx, this.x, this.y, this.angle, this.hp, this.maxHp);
        break;
      case 'frigate':
        drawEnemyFrigate(ctx, this.x, this.y, this.angle);
        break;
      case 'kraken':
        drawEnemyKraken(ctx, this.x, this.y, time);
        break;
      case 'ghost':
        drawEnemyGhost(ctx, this.x, this.y, this.angle, time);
        break;
      case 'boss':
        drawBoss(ctx, this.x, this.y, this.angle, time, this.bossName);
        break;
    }

    // Health bar (only if damaged)
    if (this.hp < this.maxHp) {
      const barW = this.type === 'boss' ? 80 : (this.type === 'frigate' ? 50 : 40);
      const barOffset = this.type === 'kraken' ? -50 : (this.type === 'boss' ? -60 : -35);
      drawHealthBar(ctx, this.x, this.y + barOffset, barW, this.hp, this.maxHp, false);
    }
  }
}
