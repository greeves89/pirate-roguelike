import { CANVAS_WIDTH, CANVAS_HEIGHT, WORLD_SIZE_ZONES } from './constants';
import { InputManager } from './input';
import { Camera } from './camera';
import { Player } from '../entities/player';
import { Enemy } from '../entities/enemy';
import { Projectile } from '../entities/projectile';
import { ExplosionManager } from '../entities/projectile';
import { XPOrb } from '../entities/xporb';
import { World } from '../systems/world';
import { HUD, SkillChoiceUI, GameOverUI, MainMenuUI } from '../ui/hud';
import { distance } from '../utils/math';

type GameState = 'menu' | 'playing' | 'levelup' | 'gameover' | 'victory';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private input: InputManager;
  private camera: Camera;
  private hud: HUD;
  private skillUI: SkillChoiceUI;
  private gameOverUI: GameOverUI;
  private mainMenuUI: MainMenuUI;

  private player: Player | null = null;
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private xpOrbs: XPOrb[] = [];
  private explosions: ExplosionManager = new ExplosionManager();
  private world: World = new World();

  private state: GameState = 'menu';
  private time: number = 0;
  private waveNumber: number = 0;
  private waveTimer: number = 0;
  private bossDefeated: boolean[] = [false, false, false];
  private lastFrameTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.input = new InputManager(canvas);
    this.camera = new Camera();
    this.hud = new HUD();
    this.skillUI = new SkillChoiceUI();
    this.gameOverUI = new GameOverUI();
    this.mainMenuUI = new MainMenuUI();

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      this.skillUI.handleMouseMove(
        (e.clientX - rect.left) * scaleX,
        (e.clientY - rect.top) * scaleY
      );
    });

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const sx = (e.clientX - rect.left) * scaleX;
      const sy = (e.clientY - rect.top) * scaleY;
      if (this.state === 'levelup') {
        this.skillUI.handleClick(sx, sy);
      }
    });
  }

  start(): void {
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  private loop(now: number): void {
    const dt = Math.min((now - this.lastFrameTime) / 1000, 0.05);
    this.lastFrameTime = now;
    this.time += dt;

    this.update(dt);
    this.draw();
    this.input.clearFrame();

    requestAnimationFrame(this.loop.bind(this));
  }

  private startNewGame(): void {
    this.player = new Player(0, 0);
    this.enemies = [];
    this.projectiles = [];
    this.xpOrbs = [];
    this.explosions = new ExplosionManager();
    this.world = new World();
    this.waveNumber = 0;
    this.waveTimer = 3; // initial delay
    this.bossDefeated = [false, false, false];
    this.world.zoneIndex = 0;
    this.camera.x = -CANVAS_WIDTH / 2;
    this.camera.y = -CANVAS_HEIGHT / 2;
    this.state = 'playing';
    this.spawnWave();
  }

  private spawnWave(): void {
    if (!this.player) return;
    const zone = this.world.currentZone;
    const isBossWave = this.waveNumber > 0 && this.waveNumber % 3 === 0;
    const count = isBossWave ? 4 : zone.enemyCount + this.waveNumber * 2;
    const newEnemies = this.world.spawnEnemies(
      Math.min(count, 25),
      this.player.x,
      this.player.y,
      zone.difficulty,
      isBossWave
    );
    this.enemies.push(...newEnemies);
    this.waveNumber++;
    this.waveTimer = 60; // next wave after 60s or all enemies killed
  }

  private update(dt: number): void {
    switch (this.state) {
      case 'menu':
        if (this.input.isKeyDown('Enter')) this.startNewGame();
        break;
      case 'playing':
        this.updatePlaying(dt);
        break;
      case 'levelup':
        // Paused; skill UI handles clicks
        break;
      case 'gameover':
      case 'victory':
        if (this.input.isKeyDown('KeyR')) {
          this.state = 'menu';
        }
        break;
    }
  }

  private updatePlaying(dt: number): void {
    const player = this.player!;
    if (!player.alive) {
      this.state = 'gameover';
      return;
    }

    // Weapon switching
    if (this.input.isKeyDown('Digit1') || this.input.isKeyDown('Numpad1')) player.switchWeapon('cannon');
    if (this.input.isKeyDown('Digit2') || this.input.isKeyDown('Numpad2')) player.switchWeapon('musket');
    if (this.input.isKeyDown('Digit3') || this.input.isKeyDown('Numpad3')) player.switchWeapon('bomb');

    // Movement
    const move = this.input.getMovementVector();
    player.update(dt, move.x, move.y);

    // Camera
    this.camera.follow(player.x, player.y);
    this.camera.update(dt);

    // Shooting
    if (this.input.isMouseDown(0)) {
      const target = this.input.getMouseWorld(this.camera.x, this.camera.y);
      const shots = player.fire(target.x, target.y);
      this.projectiles.push(...shots);
    }

    // Update enemies
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;
      const shots = enemy.update(dt, player.x, player.y, this.time);
      this.projectiles.push(...shots);

      // Collision with player
      const ramDmg = enemy.checkPlayerCollision(player.x, player.y) * dt * 60;
      if (ramDmg > 0) player.takeDamage(ramDmg);
    }

    // Update projectiles
    for (const proj of this.projectiles) {
      proj.update(dt);

      if (!proj.alive) continue;

      // Player projectiles hit enemies
      if (proj.fromPlayer) {
        let hit = false;
        for (const enemy of this.enemies) {
          if (!enemy.alive) continue;
          const hitRadius = enemy.type === 'kraken' ? 40 : (enemy.type === 'boss' ? 50 : 25);
          if (distance(proj.x, proj.y, enemy.x, enemy.y) < hitRadius) {
            if (proj.type === 'bomb') {
              const exp = proj.createExplosion();
              if (exp) this.explosions.add(exp);
              proj.alive = false;
            } else {
              enemy.takeDamage(proj.damage);
              proj.alive = false;
              // Musket pierce
              if (proj.type === 'musket' && player.stats.musketPierce) {
                proj.alive = true; // keep going
              }
            }
            if (!enemy.alive) {
              const xpMult = 1 + (this.world.zoneIndex * 0.5);
              const orbs = enemy.dropXP(xpMult);
              this.xpOrbs.push(...orbs);
            }
            if (!proj.alive || proj.type === 'musket') { if (!player.stats.musketPierce) hit = true; break; }
          }
        }
      } else {
        // Enemy projectile hits player
        if (distance(proj.x, proj.y, player.x, player.y) < 20) {
          player.takeDamage(proj.damage);
          proj.alive = false;
        }
      }
    }

    // Bomb explosions hit enemies/player
    for (const exp of this.explosions.explosions) {
      if (exp.progress > 0.1 && exp.progress < 0.3) {
        if (exp.fromPlayer) {
          for (const enemy of this.enemies) {
            if (!enemy.alive) continue;
            if (distance(exp.x, exp.y, enemy.x, enemy.y) < exp.radius) {
              enemy.takeDamage(exp.damage);
              if (!enemy.alive) {
                this.xpOrbs.push(...enemy.dropXP(1));
              }
            }
          }
        } else {
          if (distance(exp.x, exp.y, player.x, player.y) < exp.radius) {
            player.takeDamage(exp.damage);
          }
        }
      }
    }

    this.explosions.update(dt);

    // XP orbs
    for (const orb of this.xpOrbs) {
      const collected = orb.update(dt, player.x, player.y);
      if (collected) {
        player.addXP(orb.value);
        const leveled = player.checkLevelUp();
        if (leveled) {
          this.showLevelUp();
        }
      }
    }

    // Clean up
    this.projectiles = this.projectiles.filter(p => p.alive);
    this.xpOrbs = this.xpOrbs.filter(o => o.alive);
    this.enemies = this.enemies.filter(e => e.alive);

    // Wave progression
    this.waveTimer -= dt;
    const allDead = this.enemies.length === 0;
    if (allDead && this.waveTimer <= 0) {
      // Check if we advance zone
      if (this.waveNumber >= 4) {
        this.world.zoneIndex++;
        this.waveNumber = 0;
        if (this.world.zoneIndex >= WORLD_SIZE_ZONES.length) {
          this.state = 'victory';
          return;
        }
      }
      this.spawnWave();
    }
  }

  private showLevelUp(): void {
    if (!this.player) return;
    const choices = this.player.skillTree.getRandomChoices(3);
    if (choices.length === 0) return;
    this.state = 'levelup';
    this.skillUI.show(choices, (id) => {
      this.player!.skillTree.applyUpgrade(id);
      this.state = 'playing';
    });
  }

  private draw(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    switch (this.state) {
      case 'menu':
        this.world.drawBackground(ctx, 0, 0, this.time, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.mainMenuUI.draw(ctx, this.time);
        break;

      case 'playing':
      case 'levelup':
        this.drawWorld(ctx);
        if (this.state === 'levelup') {
          this.skillUI.draw(ctx);
        }
        break;

      case 'gameover':
        this.drawWorld(ctx);
        this.gameOverUI.draw(
          ctx,
          this.player?.score ?? 0,
          this.player?.level ?? 1,
          this.world.currentZone.name,
          false
        );
        break;

      case 'victory':
        this.drawWorld(ctx);
        this.gameOverUI.draw(
          ctx,
          this.player?.score ?? 0,
          this.player?.level ?? 1,
          'All Seas Conquered!',
          true
        );
        break;
    }
  }

  private drawWorld(ctx: CanvasRenderingContext2D): void {
    if (!this.player) return;

    // Background (screen space)
    this.world.drawBackground(ctx, this.camera.x, this.camera.y, this.time, CANVAS_WIDTH, CANVAS_HEIGHT);

    // World space
    ctx.save();
    this.camera.applyTransform(ctx);

    this.world.drawIslands(ctx);

    for (const orb of this.xpOrbs) {
      if (this.camera.isVisible(orb.x, orb.y)) {
        orb.draw(ctx, this.time);
      }
    }

    for (const enemy of this.enemies) {
      if (this.camera.isVisible(enemy.x, enemy.y, 150)) {
        enemy.draw(ctx, this.time);
      }
    }

    this.player.draw(ctx, this.time);

    for (const proj of this.projectiles) {
      if (this.camera.isVisible(proj.x, proj.y, 50)) {
        proj.draw(ctx, this.time);
      }
    }

    this.explosions.draw(ctx);

    ctx.restore();

    // HUD (screen space)
    this.hud.draw(
      ctx,
      this.player,
      this.enemies.length,
      this.world.currentZone.name,
      this.time
    );
  }
}
