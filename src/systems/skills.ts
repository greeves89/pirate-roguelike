export type SkillId =
  | 'cannon_damage'
  | 'cannon_speed'
  | 'cannon_multishot'
  | 'musket_damage'
  | 'musket_pierce'
  | 'bomb_radius'
  | 'bomb_chain'
  | 'hull_armor'
  | 'hull_regen'
  | 'crew_speed'
  | 'plunder_xp'
  | 'ghost_form';

export interface Skill {
  id: SkillId;
  name: string;
  description: string;
  maxLevel: number;
  currentLevel: number;
  icon: string; // emoji for display
  type: 'weapon' | 'defense' | 'utility';
  apply: (stats: PlayerStats, level: number) => void;
}

export interface PlayerStats {
  cannonDamageMultiplier: number;
  cannonSpeedMultiplier: number;
  cannonCooldownMultiplier: number;
  cannonMultishot: number; // extra projectiles
  musketDamageMultiplier: number;
  musketPierce: boolean;
  bombRadiusMultiplier: number;
  bombChain: boolean;
  armorMultiplier: number; // damage reduction %
  regenRate: number; // HP/second
  speedMultiplier: number;
  xpMultiplier: number;
  ghostMode: boolean; // brief invincibility after taking damage
}

export function createDefaultStats(): PlayerStats {
  return {
    cannonDamageMultiplier: 1,
    cannonSpeedMultiplier: 1,
    cannonCooldownMultiplier: 1,
    cannonMultishot: 0,
    musketDamageMultiplier: 1,
    musketPierce: false,
    bombRadiusMultiplier: 1,
    bombChain: false,
    armorMultiplier: 0, // 0 = no reduction
    regenRate: 0,
    speedMultiplier: 1,
    xpMultiplier: 1,
    ghostMode: false,
  };
}

export const ALL_SKILLS: Skill[] = [
  {
    id: 'cannon_damage',
    name: 'Heavy Shot',
    description: 'Cannon damage +25% per level',
    maxLevel: 3,
    currentLevel: 0,
    icon: '💣',
    type: 'weapon',
    apply: (stats, level) => { stats.cannonDamageMultiplier = 1 + level * 0.25; },
  },
  {
    id: 'cannon_speed',
    name: 'Rapid Fire',
    description: 'Cannon fire rate +20% per level',
    maxLevel: 3,
    currentLevel: 0,
    icon: '⚡',
    type: 'weapon',
    apply: (stats, level) => { stats.cannonCooldownMultiplier = 1 / (1 + level * 0.2); },
  },
  {
    id: 'cannon_multishot',
    name: 'Broadside',
    description: 'Fire +1 extra cannon per level',
    maxLevel: 2,
    currentLevel: 0,
    icon: '🔥',
    type: 'weapon',
    apply: (stats, level) => { stats.cannonMultishot = level; },
  },
  {
    id: 'musket_damage',
    name: 'Sharpshooter',
    description: 'Musket damage +40% per level',
    maxLevel: 3,
    currentLevel: 0,
    icon: '🎯',
    type: 'weapon',
    apply: (stats, level) => { stats.musketDamageMultiplier = 1 + level * 0.4; },
  },
  {
    id: 'musket_pierce',
    name: 'Iron Ball',
    description: 'Musket shots pierce through enemies',
    maxLevel: 1,
    currentLevel: 0,
    icon: '🪃',
    type: 'weapon',
    apply: (stats, level) => { stats.musketPierce = level > 0; },
  },
  {
    id: 'bomb_radius',
    name: 'Powder Keg',
    description: 'Bomb blast radius +30% per level',
    maxLevel: 3,
    currentLevel: 0,
    icon: '💥',
    type: 'weapon',
    apply: (stats, level) => { stats.bombRadiusMultiplier = 1 + level * 0.3; },
  },
  {
    id: 'bomb_chain',
    name: 'Chain Reaction',
    description: 'Bombs that kill enemies cause mini-explosions',
    maxLevel: 1,
    currentLevel: 0,
    icon: '🔗',
    type: 'weapon',
    apply: (stats, level) => { stats.bombChain = level > 0; },
  },
  {
    id: 'hull_armor',
    name: 'Iron Hull',
    description: 'Reduce incoming damage by 15% per level',
    maxLevel: 3,
    currentLevel: 0,
    icon: '🛡️',
    type: 'defense',
    apply: (stats, level) => { stats.armorMultiplier = level * 0.15; },
  },
  {
    id: 'hull_regen',
    name: 'Ship Repair',
    description: 'Regenerate 2 HP/second per level',
    maxLevel: 3,
    currentLevel: 0,
    icon: '🔧',
    type: 'defense',
    apply: (stats, level) => { stats.regenRate = level * 2; },
  },
  {
    id: 'crew_speed',
    name: 'Full Sail',
    description: 'Ship speed +20% per level',
    maxLevel: 3,
    currentLevel: 0,
    icon: '💨',
    type: 'utility',
    apply: (stats, level) => { stats.speedMultiplier = 1 + level * 0.2; },
  },
  {
    id: 'plunder_xp',
    name: 'Treasure Hunter',
    description: 'Gain +25% XP from all sources per level',
    maxLevel: 3,
    currentLevel: 0,
    icon: '🏴‍☠️',
    type: 'utility',
    apply: (stats, level) => { stats.xpMultiplier = 1 + level * 0.25; },
  },
  {
    id: 'ghost_form',
    name: 'Ghost Form',
    description: 'Brief invincibility after taking damage',
    maxLevel: 1,
    currentLevel: 0,
    icon: '👻',
    type: 'defense',
    apply: (stats, level) => { stats.ghostMode = level > 0; },
  },
];

export class SkillTree {
  skills: Map<SkillId, Skill> = new Map();
  stats: PlayerStats = createDefaultStats();

  constructor() {
    for (const skill of ALL_SKILLS) {
      this.skills.set(skill.id, { ...skill });
    }
  }

  getUpgradeableSkills(): Skill[] {
    return Array.from(this.skills.values()).filter(s => s.currentLevel < s.maxLevel);
  }

  /** Returns 3 random upgrade options */
  getRandomChoices(count: number = 3): Skill[] {
    const available = this.getUpgradeableSkills();
    if (available.length === 0) return [];
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  applyUpgrade(id: SkillId): void {
    const skill = this.skills.get(id);
    if (!skill || skill.currentLevel >= skill.maxLevel) return;
    skill.currentLevel++;
    this.recalculate();
  }

  private recalculate(): void {
    this.stats = createDefaultStats();
    for (const skill of this.skills.values()) {
      if (skill.currentLevel > 0) {
        skill.apply(this.stats, skill.currentLevel);
      }
    }
  }
}
