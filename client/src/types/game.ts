export type SinType = 'wrath' | 'lust' | 'sloth' | 'gluttony' | 'gloom' | 'pride' | 'envy';
export type DamageType = 'slash' | 'pierce' | 'blunt';
export type ResistanceLevel = 'fatal' | 'ineffective' | 'normal' | 'endured' | 'resistant';

export interface Skill {
  id: string;
  name: string;
  sinType: SinType;
  damageType: DamageType;
  basePower: number;
  coinCount: number;
  description: string;
  effects?: SkillEffect[];
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'stagger';
  value: number;
  target: 'self' | 'enemy' | 'all_allies' | 'all_enemies';
}

export interface Character {
  id: string;
  name: string;
  maxHealth: number;
  currentHealth: number;
  staggerThreshold: number;
  currentStagger: number;
  isStaggered: boolean;
  skills: Skill[];
  resistances: Record<DamageType, ResistanceLevel>;
  sinAffinities: SinType[];
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface Boss {
  id: string;
  name: string;
  maxHealth: number;
  currentHealth: number;
  phase: number;
  maxPhase: number;
  skills: Skill[];
  resistances: Record<DamageType, ResistanceLevel>;
  phaseTransitions: BossPhase[];
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
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

export interface ClashResult {
  winner: 'character' | 'boss';
  characterSkill: Skill;
  bossSkill: Skill;
  characterPower: number;
  bossPower: number;
  damage: number;
  effects: string[];
}

export type GamePhase = 'menu' | 'character_selection' | 'combat' | 'victory' | 'defeat';
export type CombatPhase = 'planning' | 'clashing' | 'resolution' | 'enemy_turn';
