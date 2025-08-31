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
      description: 'The burning rage of the war god manifests as blazing slashes.',
      effects: [{ type: 'damage', value: 5, target: 'enemy' }]
    },
    {
      id: 'divine_aegis_shield',
      name: 'Divine Aegis Shield',
      elementType: 'light',
      damageType: 'blunt',
      basePower: 8,
      manaCost: 18,
      description: 'Summons a golden divine shield that absorbs attacks and reflects damage.',
      effects: [{ type: 'heal', value: 25, target: 'self' }]
    },
    {
      id: 'celestial_sword_strike',
      name: 'Celestial Sword Strike',
      elementType: 'light',
      damageType: 'slash',
      basePower: 30,
      manaCost: 25,
      description: 'A massive golden sword descends from the heavens to strike with divine judgment.',
      effects: [{ type: 'damage', value: 8, target: 'enemy' }]
    },
    {
      id: 'sacred_prayer_bow',
      name: 'Sacred Prayer Bow',
      elementType: 'divine',
      damageType: 'pierce',
      basePower: 26,
      manaCost: 22,
      description: 'Divine prayer manifests as a spectral bow that shoots light arrows through the target.',
      effects: [{ type: 'damage', value: 7, target: 'enemy' }]
    },
    {
      id: 'battlefield_dominion',
      name: 'Battlefield Dominion',
      elementType: 'fire',
      damageType: 'blunt',
      basePower: 28,
      manaCost: 20,
      description: 'Controls the entire battlefield with divine might, creating fiery craters.',
      effects: [
        { type: 'damage', value: 6, target: 'enemy' },
        { type: 'debuff', value: 2, target: 'enemy' }
      ]
    },
    {
      id: 'wrath_of_olympus',
      name: 'Wrath of Olympus',
      elementType: 'fire',
      damageType: 'slash',
      basePower: 35,
      manaCost: 30,
      description: 'Channels the combined fury of all Olympian gods into devastating strikes.',
      effects: [
        { type: 'damage', value: 10, target: 'enemy' },
        { type: 'stagger', value: 4, target: 'enemy' }
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
      description: 'All-seeing eyes pierce through illusions and strike with perfect accuracy.',
      effects: [{ type: 'damage', value: 4, target: 'enemy' }]
    },
    {
      id: 'wisdom_barrier',
      name: 'Wisdom Barrier',
      elementType: 'light',
      damageType: 'blunt',
      basePower: 10,
      manaCost: 20,
      description: 'Creates a shimmering barrier of pure knowledge that deflects attacks.',
      effects: [{ type: 'heal', value: 30, target: 'self' }]
    },
    {
      id: 'divine_spear_rain',
      name: 'Divine Spear Rain',
      elementType: 'light',
      damageType: 'pierce',
      basePower: 28,
      manaCost: 24,
      description: 'Summons countless spears of light from the sky in a devastating rain.',
      effects: [{ type: 'damage', value: 8, target: 'enemy' }]
    },
    {
      id: 'sacred_prayer_arrow',
      name: 'Sacred Prayer Arrow',
      elementType: 'divine',
      damageType: 'pierce',
      basePower: 24,
      manaCost: 22,
      description: 'A prayer takes form as a glowing arrow that phases through defenses.',
      effects: [{ type: 'damage', value: 6, target: 'enemy' }]
    },
    {
      id: 'reality_weave',
      name: 'Reality Weave',
      elementType: 'light',
      damageType: 'blunt',
      basePower: 25,
      manaCost: 25,
      description: 'Manipulates reality itself to create crushing force.',
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
      description: 'The earth itself rises up in massive stone fists to crush enemies.',
      effects: [{ type: 'damage', value: 6, target: 'enemy' }]
    },
    {
      id: 'bark_skin_shield',
      name: 'Bark Skin Shield',
      elementType: 'earth',
      damageType: 'blunt',
      basePower: 5,
      manaCost: 18,
      description: 'Grows a protective bark armor that absorbs damage.',
      effects: [{ type: 'heal', value: 35, target: 'self' }]
    },
    {
      id: 'thorn_blade_storm',
      name: 'Thorn Blade Storm',
      elementType: 'earth',
      damageType: 'slash',
      basePower: 26,
      manaCost: 24,
      description: 'Summons a whirlwind of razor-sharp thorn blades from above.',
      effects: [{ type: 'damage', value: 7, target: 'enemy' }]
    },
    {
      id: 'prayer_of_growth',
      name: 'Prayer of Growth',
      elementType: 'earth',
      damageType: 'pierce',
      basePower: 22,
      manaCost: 20,
      description: 'Sacred prayer causes massive thorny vines to burst from the ground.',
      effects: [{ type: 'damage', value: 6, target: 'enemy' }]
    },
    {
      id: 'life_drain',
      name: 'Life Drain',
      elementType: 'earth',
      damageType: 'pierce',
      basePower: 18,
      manaCost: 22,
      description: 'Drains the life force through root-like tendrils.',
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
      description: 'A devastating bolt of lightning pierces from the storm clouds.',
      effects: [{ type: 'damage', value: 7, target: 'enemy' }]
    },
    {
      id: 'storm_aegis',
      name: 'Storm Aegis',
      elementType: 'air',
      damageType: 'blunt',
      basePower: 8,
      manaCost: 20,
      description: 'A swirling shield of wind and lightning deflects attacks.',
      effects: [{ type: 'heal', value: 28, target: 'self' }]
    },
    {
      id: 'thunderbolt_lance',
      name: 'Thunderbolt Lance',
      elementType: 'air',
      damageType: 'pierce',
      basePower: 32,
      manaCost: 28,
      description: 'Zeus\'s mighty thunderbolt manifests as a piercing lance of pure energy.',
      effects: [{ type: 'damage', value: 9, target: 'enemy' }]
    },
    {
      id: 'divine_storm_prayer',
      name: 'Divine Storm Prayer',
      elementType: 'divine',
      damageType: 'slash',
      basePower: 28,
      manaCost: 25,
      description: 'A prayer calls down a localized storm that slashes with wind blades.',
      effects: [{ type: 'damage', value: 8, target: 'enemy' }]
    },
    {
      id: 'tempest_rage',
      name: 'Tempest Rage',
      elementType: 'air',
      damageType: 'slash',
      basePower: 30,
      manaCost: 25,
      description: 'A hurricane of divine fury tears through everything.',
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
      description: 'A spectral scythe harvests souls with divine authority.',
      effects: [{ type: 'damage', value: 9, target: 'enemy' }]
    },
    {
      id: 'underworld_barrier',
      name: 'Underworld Barrier',
      elementType: 'dark',
      damageType: 'blunt',
      basePower: 6,
      manaCost: 22,
      description: 'Creates a barrier of pure darkness and death essence.',
      effects: [{ type: 'heal', value: 40, target: 'self' }]
    },
    {
      id: 'death_blade_descent',
      name: 'Death Blade Descent',
      elementType: 'dark',
      damageType: 'slash',
      basePower: 34,
      manaCost: 30,
      description: 'A massive blade of death energy descends from the underworld.',
      effects: [{ type: 'damage', value: 10, target: 'enemy' }]
    },
    {
      id: 'prayer_of_endings',
      name: 'Prayer of Endings',
      elementType: 'dark',
      damageType: 'pierce',
      basePower: 30,
      manaCost: 26,
      description: 'A prayer to death itself manifests as piercing void energy.',
      effects: [{ type: 'damage', value: 8, target: 'enemy' }]
    },
    {
      id: 'void_embrace',
      name: 'Void Embrace',
      elementType: 'dark',
      damageType: 'blunt',
      basePower: 35,
      manaCost: 30,
      description: 'Embraces enemies in the crushing void of absolute death.',
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
