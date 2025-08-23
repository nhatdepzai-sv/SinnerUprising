import { Skill, ClashResult } from '../../types/game';
import { calculateSkillPower } from './skills';

export function resolveClash(
  characterSkill: Skill,
  bossSkill: Skill,
  characterResonance: number = 0,
  bossResonance: number = 0
): ClashResult {
  const characterPower = calculateSkillPower(characterSkill, characterResonance) + rollCoins(characterSkill.coinCount);
  const bossPower = calculateSkillPower(bossSkill, bossResonance) + rollCoins(bossSkill.coinCount);
  
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
  
  return {
    winner,
    characterSkill,
    bossSkill,
    characterPower,
    bossPower,
    damage,
    effects
  };
}

function rollCoins(coinCount: number): number {
  let total = 0;
  for (let i = 0; i < coinCount; i++) {
    // Simple coin flip: 50% chance to add 1 to power
    if (Math.random() > 0.5) {
      total += 1;
    }
  }
  return total;
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
