export type ElementType = 'fire' | 'water' | 'earth' | 'air' | 'light' | 'dark' | 'divine';
export type DamageType = 'slash' | 'pierce' | 'blunt';
export type ResistanceLevel = 'fatal' | 'ineffective' | 'normal' | 'endured' | 'resistant';

export interface Skill {
  id: string;
  name: string;
  elementType: ElementType;
  damageType: DamageType;
  basePower: number;
  manaCost: number;
  description: string;
  effects?: SkillEffect[];
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'stagger';
  value: number;
  target: 'self' | 'enemy' | 'all_allies' | 'all_enemies';
}

export interface Weapon {
  id: string;
  name: string;
  description: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  skills: Skill[];
  statBoosts: {
    attack: number;
    defense: number;
    speed: number;
  };
}

export interface Character {
  id: string;
  name: string;
  title: string;
  maxHealth: number;
  currentHealth: number;
  maxMana: number;
  currentMana: number;
  level: number;
  corruption: number;
  skills: Skill[];
  resistances: Record<DamageType, ResistanceLevel>;
  elementAffinities: ElementType[];
  sprite: string;
  position: [number, number];
  equippedWeapon?: Weapon | null;
}

export interface Boss {
  id: string;
  name: string;
  title: string;
  lore: string;
  maxHealth: number;
  currentHealth: number;
  phase: number;
  maxPhase: number;
  skills: Skill[];
  resistances: Record<DamageType, ResistanceLevel>;
  phaseTransitions: BossPhase[];
  sprite: string;
  position: [number, number];
  scale: number;
  isDefeated: boolean;
}

export interface BossPhase {
  phase: number;
  healthThreshold: number;
  name: string;
  description: string;
  newSkills?: Skill[];
  resistanceChanges?: Partial<Record<DamageType, ResistanceLevel>>;
  specialMechanics?: string[];
}

export interface CombatAction {
  characterId: string;
  skillId: string;
  targetId: string;
}

export interface BattleResult {
  winner: 'character' | 'boss';
  characterSkill: Skill;
  bossSkill: Skill;
  characterPower: number;
  bossPower: number;
  damage: number;
  effects: string[];
  corruptionGained: number;
}

export type GamePhase = 'intro' | 'story' | 'map' | 'combat' | 'victory' | 'defeat' | 'corruption' | 'final_boss';
export type CombatPhase = 'planning' | 'battle' | 'resolution' | 'enemy_turn';

export interface StoryAct {
  id: string;
  title: string;
  description: string;
  dialogue: string[];
  bossId: string;
  unlocked: boolean;
  completed: boolean;
}

export interface GameState {
  currentAct: number;
  acts: StoryAct[];
  protagonist: Character;
  defeatedGods: string[];
  corruptionLevel: number;
  hasReachedFinalBoss: boolean;
}
