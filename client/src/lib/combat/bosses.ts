import { Boss, BossPhase } from '../../types/game';
import { godSkills } from './skills';

export const bosses: Record<string, Boss> = {
  god_of_war: {
    id: 'god_of_war',
    name: 'Ares',
    title: 'God of War',
    lore: 'The first god you served, now your greatest enemy. His divine armor is stained with the blood of countless battles.',
    maxHealth: 300,
    currentHealth: 300,
    phase: 1,
    maxPhase: 2,
    skills: godSkills.god_of_war.slice(0, 1),
    resistances: {
      slash: 'endured',
      pierce: 'normal',
      blunt: 'resistant'
    },
    phaseTransitions: [
      {
        phase: 1,
        healthThreshold: 1.0,
        name: 'Divine Warrior',
        description: 'Ares looks down upon you with divine contempt.',
        specialMechanics: ['Basic divine attacks']
      },
      {
        phase: 2,
        healthThreshold: 0.5,
        name: 'Wrathful God',
        description: 'Ares erupts in divine fury as his immortal blood is spilled!',
        newSkills: [godSkills.god_of_war[1]],
        resistanceChanges: {
          slash: 'normal',
          pierce: 'endured',
          blunt: 'normal'
        },
        specialMechanics: ['Increased damage', 'Area attacks']
      }
    ],
    position: [0, -3],
    scale: 2.0,
    sprite: 'god_of_war',
    isDefeated: false
  },
  god_of_wisdom: {
    id: 'god_of_wisdom',
    name: 'Athena', 
    title: 'Goddess of Wisdom',
    lore: 'She who once guided your tactical mind now sees you as a threat to divine order.',
    maxHealth: 250,
    currentHealth: 250,
    phase: 1,
    maxPhase: 2,
    skills: godSkills.god_of_wisdom.slice(0, 1),
    resistances: {
      slash: 'normal',
      pierce: 'resistant',
      blunt: 'endured'
    },
    phaseTransitions: [
      {
        phase: 1,
        healthThreshold: 1.0,
        name: 'Strategic Mind',
        description: 'Athena analyzes your every move with divine intellect.',
        specialMechanics: ['Predictive attacks', 'Counter abilities']
      },
      {
        phase: 2,
        healthThreshold: 0.4,
        name: 'Desperate Wisdom',
        description: 'Athena realizes the true threat you represent!',
        newSkills: [godSkills.god_of_wisdom[1]],
        resistanceChanges: {
          slash: 'endured',
          pierce: 'normal',
          blunt: 'normal'
        },
        specialMechanics: ['Reality manipulation', 'Devastating combos']
      }
    ],
    position: [0, -3],
    scale: 1.8,
    sprite: 'god_of_wisdom',
    isDefeated: false
  },
  god_of_nature: {
    id: 'god_of_nature',
    name: 'Gaia',
    title: 'Mother Earth',
    lore: 'The earth itself turns against you as nature\'s mother seeks to preserve divine balance.',
    maxHealth: 350,
    currentHealth: 350,
    phase: 1,
    maxPhase: 2,
    skills: godSkills.god_of_nature.slice(0, 1),
    resistances: {
      slash: 'resistant',
      pierce: 'endured',
      blunt: 'normal'
    },
    phaseTransitions: [
      {
        phase: 1,
        healthThreshold: 1.0,
        name: 'Natural Order',
        description: 'Gaia calls upon the forces of nature to stop your rampage.',
        specialMechanics: ['Nature attacks', 'Regeneration']
      },
      {
        phase: 2,
        healthThreshold: 0.3,
        name: 'Primal Fury',
        description: 'The earth shakes as Gaia unleashes primal forces!',
        newSkills: [godSkills.god_of_nature[1]],
        resistanceChanges: {
          slash: 'normal',
          pierce: 'normal',
          blunt: 'endured'
        },
        specialMechanics: ['Life drain', 'Environmental hazards']
      }
    ],
    position: [0, -3],
    scale: 2.2,
    sprite: 'god_of_nature',
    isDefeated: false
  },
  god_of_storms: {
    id: 'god_of_storms',
    name: 'Zeus',
    title: 'King of Gods',
    lore: 'The king of gods himself descends to face you, lightning crackling around his divine form.',
    maxHealth: 400,
    currentHealth: 400,
    phase: 1,
    maxPhase: 3,
    skills: godSkills.god_of_storms.slice(0, 1),
    resistances: {
      slash: 'normal',
      pierce: 'normal',
      blunt: 'resistant'
    },
    phaseTransitions: [
      {
        phase: 1,
        healthThreshold: 1.0,
        name: 'Divine Authority',
        description: 'Zeus commands the heavens with absolute authority.',
        specialMechanics: ['Lightning attacks', 'Divine presence']
      },
      {
        phase: 2,
        healthThreshold: 0.6,
        name: 'Thunderous Rage',
        description: 'The sky darkens as Zeus calls upon the storm!',
        newSkills: [godSkills.god_of_storms[1]],
        resistanceChanges: {
          slash: 'endured',
          pierce: 'endured',
          blunt: 'normal'
        },
        specialMechanics: ['Chain lightning', 'Storm effects']
      },
      {
        phase: 3,
        healthThreshold: 0.2,
        name: 'Divine Desperation',
        description: 'Zeus unleashes the full power of the heavens!',
        resistanceChanges: {
          slash: 'resistant',
          pierce: 'resistant',
          blunt: 'resistant'
        },
        specialMechanics: ['Overwhelming power', 'Reality storms']
      }
    ],
    position: [0, -3],
    scale: 2.5,
    sprite: 'god_of_storms',
    isDefeated: false
  },
  god_of_death: {
    id: 'god_of_death',
    name: 'Hades',
    title: 'Lord of the Underworld',
    lore: 'The final god stands before you, keeper of death itself. He alone knows the true price of your journey.',
    maxHealth: 450,
    currentHealth: 450,
    phase: 1,
    maxPhase: 2,
    skills: godSkills.god_of_death.slice(0, 1),
    resistances: {
      slash: 'resistant',
      pierce: 'resistant',
      blunt: 'endured'
    },
    phaseTransitions: [
      {
        phase: 1,
        healthThreshold: 1.0,
        name: 'Lord of Souls',
        description: 'Hades judges your soul and finds it wanting.',
        specialMechanics: ['Soul attacks', 'Death magic']
      },
      {
        phase: 2,
        healthThreshold: 0.3,
        name: 'Death\'s Embrace',
        description: 'Hades reveals the terrible truth of your corruption!',
        newSkills: [godSkills.god_of_death[1]],
        resistanceChanges: {
          slash: 'normal',
          pierce: 'normal',
          blunt: 'normal'
        },
        specialMechanics: ['Void attacks', 'Truth revelation']
      }
    ],
    position: [0, -3],
    scale: 2.3,
    sprite: 'god_of_death',
    isDefeated: false
  },
  final_boss: {
    id: 'final_boss',
    name: 'Aiden',
    title: 'The God Killer\'s Avatar',
    lore: 'You face yourself - or what you have become. The God Killer\'s corruption has made you its perfect vessel.',
    maxHealth: 666,
    currentHealth: 666,
    phase: 1,
    maxPhase: 3,
    skills: [
      {
        id: 'despair_wave',
        name: 'Despair Wave',
        elementType: 'dark',
        damageType: 'slash',
        basePower: 30,
        manaCost: 20,
        description: 'Overwhelming despair manifested as pure destruction.'
      }
    ],
    resistances: {
      slash: 'resistant',
      pierce: 'resistant',
      blunt: 'resistant'
    },
    phaseTransitions: [
      {
        phase: 1,
        healthThreshold: 1.0,
        name: 'The Corrupted Champion',
        description: 'You face the monster you have become.',
        specialMechanics: ['Dark powers', 'Corrupted abilities']
      },
      {
        phase: 2,
        healthThreshold: 0.6,
        name: 'God Killer\'s Vessel',
        description: 'The God Killer\'s true power begins to emerge!',
        newSkills: [
          {
            id: 'reality_break',
            name: 'Reality Break',
            elementType: 'dark',
            damageType: 'blunt',
            basePower: 35,
            manaCost: 30,
            description: 'Shatters the very fabric of existence.'
          }
        ],
        resistanceChanges: {
          slash: 'endured',
          pierce: 'endured',
          blunt: 'endured'
        },
        specialMechanics: ['Reality manipulation', 'Divine corruption']
      },
      {
        phase: 3,
        healthThreshold: 0.2,
        name: 'The End of All Things',
        description: 'The God Killer unleashes its full power through you!',
        newSkills: [
          {
            id: 'god_killer_unleashed',
            name: 'God Killer Unleashed',
            elementType: 'dark',
            damageType: 'pierce',
            basePower: 50,
            manaCost: 40,
            description: 'The full power of the god killer, unrestrained.'
          }
        ],
        resistanceChanges: {
          slash: 'fatal',
          pierce: 'fatal',
          blunt: 'fatal'
        },
        specialMechanics: ['Apocalyptic power', 'Reality destruction']
      }
    ],
    position: [0, -3],
    scale: 2.8,
    sprite: 'final_boss',
    isDefeated: false
  }
};

export function checkPhaseTransition(boss: Boss): BossPhase | null {
  const healthPercentage = boss.currentHealth / boss.maxHealth;
  const nextPhase = boss.phase + 1;
  
  if (nextPhase <= boss.maxPhase) {
    const transition = boss.phaseTransitions.find(p => p.phase === nextPhase);
    if (transition && healthPercentage <= transition.healthThreshold) {
      return transition;
    }
  }
  
  return null;
}

export function applyPhaseTransition(boss: Boss, transition: BossPhase): Boss {
  const updatedBoss = { ...boss };
  updatedBoss.phase = transition.phase;
  
  if (transition.resistanceChanges) {
    updatedBoss.resistances = { ...boss.resistances, ...transition.resistanceChanges };
  }
  
  if (transition.newSkills) {
    updatedBoss.skills = [...boss.skills, ...transition.newSkills];
  }
  
  return updatedBoss;
}
