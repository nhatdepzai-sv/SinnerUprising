import { Skill, SinType, DamageType } from '../../types/game';

export const characterSkills: Record<string, Skill[]> = {
  yi_sang: [
    {
      id: 'wing_beat',
      name: 'Wing Beat',
      sinType: 'pride',
      damageType: 'slash',
      basePower: 8,
      coinCount: 2,
      description: 'A swift slashing attack with moderate power.',
      effects: [{ type: 'damage', value: 1, target: 'enemy' }]
    },
    {
      id: 'solemn_lament',
      name: 'Solemn Lament',
      sinType: 'gloom',
      damageType: 'pierce',
      basePower: 12,
      coinCount: 3,
      description: 'A piercing attack that grows stronger with resonance.',
      effects: [{ type: 'damage', value: 2, target: 'enemy' }]
    },
    {
      id: 'crow_eye_view',
      name: 'Crow\'s Eye View',
      sinType: 'pride',
      damageType: 'blunt',
      basePower: 15,
      coinCount: 4,
      description: 'Ultimate skill that can stagger enemies.',
      effects: [
        { type: 'damage', value: 3, target: 'enemy' },
        { type: 'stagger', value: 2, target: 'enemy' }
      ]
    }
  ],
  faust: [
    {
      id: 'representation_emitter',
      name: 'Representation Emitter',
      sinType: 'pride',
      damageType: 'pierce',
      basePower: 10,
      coinCount: 2,
      description: 'Analytical pierce attack with high accuracy.',
      effects: [{ type: 'damage', value: 1, target: 'enemy' }]
    },
    {
      id: 'knowledge_incarnate',
      name: 'Knowledge Incarnate',
      sinType: 'gluttony',
      damageType: 'blunt',
      basePower: 14,
      coinCount: 3,
      description: 'Overwhelming knowledge manifested as force.',
      effects: [
        { type: 'damage', value: 2, target: 'enemy' },
        { type: 'buff', value: 1, target: 'self' }
      ]
    }
  ],
  don_quixote: [
    {
      id: 'hardblood_lance',
      name: 'Hardblood Lance',
      sinType: 'wrath',
      damageType: 'pierce',
      basePower: 11,
      coinCount: 3,
      description: 'Passionate lance thrust fueled by justice.',
      effects: [{ type: 'damage', value: 2, target: 'enemy' }]
    },
    {
      id: 'shield_bash',
      name: 'Shield Bash',
      sinType: 'pride',
      damageType: 'blunt',
      basePower: 9,
      coinCount: 2,
      description: 'Defensive strike that can protect allies.',
      effects: [
        { type: 'damage', value: 1, target: 'enemy' },
        { type: 'buff', value: 1, target: 'all_allies' }
      ]
    }
  ]
};

export const bossSkills: Record<string, Skill[]> = {
  crimson_apostle: [
    {
      id: 'blood_rain',
      name: 'Blood Rain',
      sinType: 'wrath',
      damageType: 'slash',
      basePower: 16,
      coinCount: 4,
      description: 'Devastating area attack that hits all enemies.',
      effects: [{ type: 'damage', value: 3, target: 'all_enemies' }]
    },
    {
      id: 'crimson_spear',
      name: 'Crimson Spear',
      sinType: 'pride',
      damageType: 'pierce',
      basePower: 20,
      coinCount: 5,
      description: 'Massive piercing attack with high stagger potential.',
      effects: [
        { type: 'damage', value: 4, target: 'enemy' },
        { type: 'stagger', value: 3, target: 'enemy' }
      ]
    },
    {
      id: 'apostolic_fury',
      name: 'Apostolic Fury',
      sinType: 'wrath',
      damageType: 'blunt',
      basePower: 25,
      coinCount: 6,
      description: 'Ultimate attack available only in final phase.',
      effects: [
        { type: 'damage', value: 5, target: 'all_enemies' },
        { type: 'debuff', value: 2, target: 'all_enemies' }
      ]
    }
  ]
};

export function calculateSkillPower(skill: Skill, resonanceBonus: number = 0): number {
  return skill.basePower + resonanceBonus;
}

export function getResonanceBonus(skills: Skill[], sinType: SinType): number {
  const matchingSkills = skills.filter(skill => skill.sinType === sinType);
  if (matchingSkills.length >= 3) return 6; // Absolute Resonance
  if (matchingSkills.length >= 2) return 3; // Resonance
  return 0;
}
