export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 640;

export const TILE_SIZE = 64;

// Player
export const PLAYER_SPEED = 160;
export const PLAYER_BASE_HP = 100;
export const PLAYER_INVINCIBILITY_FRAMES = 60; // frames after being hit

// Weapons
export const CANNON_DAMAGE = 25;
export const CANNON_SPEED = 320;
export const CANNON_COOLDOWN = 60;
export const CANNON_RANGE = 400;

export const MUSKET_DAMAGE = 60;
export const MUSKET_SPEED = 500;
export const MUSKET_COOLDOWN = 90;
export const MUSKET_RANGE = 600;

export const BOMB_DAMAGE = 80;
export const BOMB_RADIUS = 80;
export const BOMB_SPEED = 250;
export const BOMB_COOLDOWN = 150;
export const BOMB_RANGE = 350;

// Enemy base stats
export const ENEMY_SLOOP_HP = 40;
export const ENEMY_SLOOP_SPEED = 80;
export const ENEMY_SLOOP_DAMAGE = 10;

export const ENEMY_FRIGATE_HP = 120;
export const ENEMY_FRIGATE_SPEED = 55;
export const ENEMY_FRIGATE_DAMAGE = 20;

export const ENEMY_KRAKEN_HP = 300;
export const ENEMY_KRAKEN_SPEED = 45;
export const ENEMY_KRAKEN_DAMAGE = 30;

export const ENEMY_BOSS_HP_MULTIPLIER = 5;

// Camera
export const CAMERA_LERP = 0.08;

// World
export const WORLD_CHUNK_SIZE = 20; // tiles per chunk side
export const SEA_SCROLL_SPEED = 20;

// Colors
export const COLOR_OCEAN_DEEP = '#0a1628';
export const COLOR_OCEAN = '#0d2545';
export const COLOR_OCEAN_LIGHT = '#1a3a6b';
export const COLOR_OCEAN_WAVE = '#2456a4';
export const COLOR_SAND = '#d4a96a';
export const COLOR_SAND_LIGHT = '#e8c98a';
export const COLOR_ISLAND = '#2d6a2d';
export const COLOR_ISLAND_DARK = '#1e4d1e';
export const COLOR_WOOD = '#8B4513';
export const COLOR_WOOD_DARK = '#5c2d0a';
export const COLOR_SAIL = '#f5f0e0';
export const COLOR_PLAYER_SAIL = '#e8d5a3';
export const COLOR_ENEMY_HULL = '#8b1a1a';
export const COLOR_BOSS_HULL = '#4a0080';
export const COLOR_CANNONBALL = '#333';
export const COLOR_MUSKET_BALL = '#aaa';
export const COLOR_BOMB = '#222';
export const COLOR_BOMB_FUSE = '#f90';
export const COLOR_EXPLOSION = '#ff6600';
export const COLOR_EXPLOSION2 = '#ffcc00';
export const COLOR_XP_ORB = '#00ffcc';
export const COLOR_XP_ORB2 = '#00cc88';
export const COLOR_HEALTH_BAR_BG = '#440000';
export const COLOR_HEALTH_BAR = '#cc2222';
export const COLOR_HEALTH_BAR_PLAYER = '#22cc22';
export const COLOR_UI_BG = 'rgba(0,0,0,0.75)';
export const COLOR_UI_BORDER = '#8b6914';
export const COLOR_UI_TEXT = '#f5e6c8';
export const COLOR_UI_TITLE = '#ffd700';
export const COLOR_SKILL_BORDER = '#6b4c11';
export const COLOR_SKILL_HOVER = '#8b6914';

// XP & Progression
export const XP_PER_LEVEL = [0, 20, 50, 100, 180, 300, 500, 800, 1200, 1800, 2600];
export const MAX_LEVEL = 10;

export const WORLD_SIZE_ZONES = [
  { name: 'Caribbean Shallows', enemyCount: 8, difficulty: 1, bossName: 'El Tiburón' },
  { name: 'Sargasso Sea',       enemyCount: 14, difficulty: 2, bossName: 'The Kraken Lair' },
  { name: 'Devil\'s Triangle',  enemyCount: 20, difficulty: 3, bossName: 'Davy Jones' },
];
