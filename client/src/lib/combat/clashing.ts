import { Skill, BattleResult } from '../../types/game';
import { calculateSkillPower } from './skills';

export function resolveBattle(
  characterSkill: Skill,
  bossSkill: Skill,
  characterElementBonus: number = 0,
  bossElementBonus: number = 0
): BattleResult {
  const characterPower = calculateSkillPower(characterSkill, characterElementBonus) + rollDice();
  const bossPower = calculateSkillPower(bossSkill, bossElementBonus) + rollDice();
  
  const winner = characterPower >= bossPower ? 'character' : 'boss';
  const damage = Math.abs(characterPower - bossPower);
  
  const effects: string[] = [];
  
  if (winner === 'character') {
    effects.push(`${characterSkill.name} wins the clash!`);
    if (characterPower - bossPower >= 5) {
      effects.push('Overwhelming victory! Bonus damage applied.');
    }
  } else {
    effects.push(`${bossSkill.name} overwhelms ${characterSkill.name}!`);
    if (bossPower - characterPower >= 5) {
      effects.push('Devastating clash loss! Character takes extra damage.');
    }
  }
  
  const corruptionGained = calculateCorruption(characterSkill);
  
  return {
    winner,
    characterSkill,
    bossSkill,
    characterPower,
    bossPower,
    damage,
    effects,
    corruptionGained
  };
}

function rollDice(): number {
  // Roll a d6 for random power bonus
  return Math.floor(Math.random() * 6) + 1;
}

function calculateCorruption(skill: Skill): number {
  if (skill.elementType === 'dark') return 5;
  if (skill.elementType === 'light') return -2;
  return 0;
}

export function calculateDamage(
  baseDamage: number,
  damageType: 'slash' | 'pierce' | 'blunt',
  resistance: 'fatal' | 'ineffective' | 'normal' | 'endured' | 'resistant'
): number {
  const multipliers = {
    fatal: 2.0,
    ineffective: 0.5,
    normal: 1.0,
    endured: 0.75,
    resistant: 0.5
  };
  
  return Math.floor(baseDamage * multipliers[resistance]);
}

export function applyStagger(currentStagger: number, staggerDamage: number, threshold: number): boolean {
  return (currentStagger + staggerDamage) >= threshold;
}
