import { Skill, ElementType, DamageType } from '../../types/game';

export const protagonistSkills: Record<string, Skill[]> = {
  pure: [
    {
      id: 'holy_strike',
      name: 'Holy Strike',
      elementType: 'light',
      damageType: 'slash',
      basePower: 12,
      manaCost: 10,
      description: 'A righteous attack blessed by divine light.',
      effects: [{ type: 'damage', value: 2, target: 'enemy' }]
    },
    {
      id: 'divine_protection',
      name: 'Divine Protection',
      elementType: 'light',
      damageType: 'blunt',
      basePower: 0,
      manaCost: 15,
      description: 'Calls upon divine blessing for protection.',
      effects: [{ type: 'heal', value: 20, target: 'self' }]
    },
    {
      id: 'prayer_of_justice',
      name: 'Prayer of Justice',
      elementType: 'divine',
      damageType: 'pierce',
      basePower: 18,
      manaCost: 20,
      description: 'A powerful prayer that pierces through evil.',
      effects: [{ type: 'damage', value: 4, target: 'enemy' }]
    }
  ],
  corrupted: [
    {
      id: 'vengeful_slash',
      name: 'Vengeful Slash',
      elementType: 'dark',
      damageType: 'slash',
      basePower: 16,
      manaCost: 12,
      description: 'A strike fueled by burning hatred and betrayal.',
      effects: [{ type: 'damage', value: 3, target: 'enemy' }]
    },
    {
      id: 'dark_covenant',
      name: 'Dark Covenant',
      elementType: 'dark',
      damageType: 'blunt',
      basePower: 0,
      manaCost: 18,
      description: 'Draws power from the god killer\'s influence.',
      effects: [{ type: 'buff', value: 2, target: 'self' }]
    },
    {
      id: 'god_slayer_technique',
      name: 'God Slayer Technique',
      elementType: 'dark',
      damageType: 'pierce',
      basePower: 25,
      manaCost: 25,
      description: 'The ultimate technique taught by the god killer.',
      effects: [
        { type: 'damage', value: 6, target: 'enemy' },
        { type: 'debuff', value: 2, target: 'enemy' }
      ]
    }
  ],
  final_boss: [
    {
      id: 'despair_wave',
      name: 'Despair Wave',
      elementType: 'dark',
      damageType: 'slash',
      basePower: 30,
      manaCost: 20,
      description: 'Overwhelming despair manifested as pure destruction.',
      effects: [{ type: 'damage', value: 8, target: 'enemy' }]
    },
    {
      id: 'reality_break',
      name: 'Reality Break',
      elementType: 'dark',
      damageType: 'blunt',
      basePower: 35,
      manaCost: 30,
      description: 'Shatters the very fabric of existence.',
      effects: [
        { type: 'damage', value: 10, target: 'enemy' },
        { type: 'debuff', value: 5, target: 'enemy' }
      ]
    },
    {
      id: 'god_killer_unleashed',
      name: 'God Killer Unleashed',
      elementType: 'dark',
      damageType: 'pierce',
      basePower: 50,
      manaCost: 40,
      description: 'The full power of the god killer, unrestrained.',
      effects: [
        { type: 'damage', value: 15, target: 'enemy' },
        { type: 'stagger', value: 10, target: 'enemy' }
      ]
    }
  ]
};

export const godSkills: Record<string, Skill[]> = {
  god_of_war: [
    {
      id: 'divine_wrath',
      name: 'Divine Wrath',
      elementType: 'fire',
      damageType: 'slash',
      basePower: 22,
      manaCost: 15,
      description: 'The burning rage of the war god.',
      effects: [{ type: 'damage', value: 5, target: 'enemy' }]
    },
    {
      id: 'battlefield_dominion',
      name: 'Battlefield Dominion',
      elementType: 'fire',
      damageType: 'blunt',
      basePower: 28,
      manaCost: 20,
      description: 'Controls the entire battlefield with divine might.',
      effects: [
        { type: 'damage', value: 6, target: 'enemy' },
        { type: 'debuff', value: 2, target: 'enemy' }
      ]
    }
  ],
  god_of_wisdom: [
    {
      id: 'omniscient_gaze',
      name: 'Omniscient Gaze',
      elementType: 'light',
      damageType: 'pierce',
      basePower: 20,
      manaCost: 18,
      description: 'Sees through all deceptions and strikes true.',
      effects: [{ type: 'damage', value: 4, target: 'enemy' }]
    },
    {
      id: 'reality_weave',
      name: 'Reality Weave',
      elementType: 'light',
      damageType: 'blunt',
      basePower: 25,
      manaCost: 25,
      description: 'Manipulates reality itself to crush enemies.',
      effects: [
        { type: 'damage', value: 7, target: 'enemy' },
        { type: 'stagger', value: 3, target: 'enemy' }
      ]
    }
  ],
  god_of_nature: [
    {
      id: 'natures_fury',
      name: 'Nature\'s Fury',
      elementType: 'earth',
      damageType: 'blunt',
      basePower: 24,
      manaCost: 20,
      description: 'The wrath of nature itself.',
      effects: [{ type: 'damage', value: 6, target: 'enemy' }]
    },
    {
      id: 'life_drain',
      name: 'Life Drain',
      elementType: 'earth',
      damageType: 'pierce',
      basePower: 18,
      manaCost: 22,
      description: 'Drains the life force from enemies.',
      effects: [
        { type: 'damage', value: 4, target: 'enemy' },
        { type: 'heal', value: 15, target: 'self' }
      ]
    }
  ],
  god_of_storms: [
    {
      id: 'lightning_strike',
      name: 'Lightning Strike',
      elementType: 'air',
      damageType: 'pierce',
      basePower: 26,
      manaCost: 18,
      description: 'Devastating lightning that pierces all defenses.',
      effects: [{ type: 'damage', value: 7, target: 'enemy' }]
    },
    {
      id: 'tempest_rage',
      name: 'Tempest Rage',
      elementType: 'air',
      damageType: 'slash',
      basePower: 30,
      manaCost: 25,
      description: 'A hurricane of divine fury.',
      effects: [
        { type: 'damage', value: 8, target: 'enemy' },
        { type: 'debuff', value: 3, target: 'enemy' }
      ]
    }
  ],
  god_of_death: [
    {
      id: 'soul_reaper',
      name: 'Soul Reaper',
      elementType: 'dark',
      damageType: 'slash',
      basePower: 32,
      manaCost: 22,
      description: 'Harvests souls with divine authority.',
      effects: [{ type: 'damage', value: 9, target: 'enemy' }]
    },
    {
      id: 'void_embrace',
      name: 'Void Embrace',
      elementType: 'dark',
      damageType: 'blunt',
      basePower: 35,
      manaCost: 30,
      description: 'Embraces enemies in the void of death.',
      effects: [
        { type: 'damage', value: 10, target: 'enemy' },
        { type: 'stagger', value: 5, target: 'enemy' }
      ]
    }
  ]
};

export function calculateSkillPower(skill: Skill, elementBonus: number = 0): number {
  return skill.basePower + elementBonus;
}

export function getElementBonus(skills: Skill[], elementType: ElementType): number {
  const matchingSkills = skills.filter(skill => skill.elementType === elementType);
  if (matchingSkills.length >= 3) return 8; // Element Mastery
  if (matchingSkills.length >= 2) return 4; // Element Harmony
  return 0;
}

export function calculateCorruption(skill: Skill): number {
  if (skill.elementType === 'dark') return 5;
  if (skill.elementType === 'light') return -2;
  return 0;
}
