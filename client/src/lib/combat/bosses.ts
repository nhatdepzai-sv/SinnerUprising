import { Boss, BossPhase } from '../../types/game';
import { godSkills } from './skills';

export const bosses: Record<string, Boss> = {
  god_of_war: {
    id: 'god_of_war',
    name: 'Ares',
    title: 'God of War',
    lore: 'The first god you served, now your greatest enemy. His divine armor is stained with the blood of countless battles.',
    maxHealth: 150, // Nerfed from 300
    currentHealth: 150,
    phase: 1,
    maxPhase: 2,
    skills: godSkills.god_of_war.slice(0, 3), // Start with more skills
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
        newSkills: godSkills.god_of_war.slice(3, 6), // Add remaining skills in phase 2
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
    maxHealth: 120, // Nerfed from 250
    currentHealth: 120,
    phase: 1,
    maxPhase: 2,
    skills: godSkills.god_of_wisdom.slice(0, 3), // Start with more skills
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
        newSkills: godSkills.god_of_wisdom.slice(3, 5), // Add remaining skills
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
    maxHealth: 180, // Nerfed from 350
    currentHealth: 180,
    phase: 1,
    maxPhase: 2,
    skills: godSkills.god_of_nature.slice(0, 3), // Start with more skills
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
        newSkills: godSkills.god_of_nature.slice(3, 5), // Add remaining skills
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
    maxHealth: 200, // Nerfed from 400
    currentHealth: 200,
    phase: 1,
    maxPhase: 3,
    skills: godSkills.god_of_storms.slice(0, 3), // Start with more skills
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
        newSkills: godSkills.god_of_storms.slice(3, 5), // Add remaining skills
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
    maxHealth: 220, // Nerfed from 450
    currentHealth: 220,
    phase: 1,
    maxPhase: 2,
    skills: godSkills.god_of_death.slice(0, 3), // Start with more skills
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
        newSkills: godSkills.god_of_death.slice(3, 5), // Add remaining skills
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
    maxHealth: 300, // Nerfed from 666
    currentHealth: 300,
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
  },
  corrupted_self: {
    id: 'corrupted_self',
    name: 'Your Corrupted Soul',
    title: 'The Shadow Within',
    lore: 'You face the part of yourself that was consumed by the God Killer\'s influence. Can you overcome your own darkness?',
    maxHealth: 180,
    currentHealth: 180,
    phase: 1,
    maxPhase: 2,
    skills: [
      {
        id: 'self_doubt',
        name: 'Self Doubt',
        elementType: 'dark',
        damageType: 'blunt',
        basePower: 20,
        manaCost: 15,
        description: 'Attacks with your own insecurities and fears.'
      },
      {
        id: 'corrupted_memory',
        name: 'Corrupted Memory',
        elementType: 'dark',
        damageType: 'pierce',
        basePower: 25,
        manaCost: 20,
        description: 'Weaponizes painful memories against you.'
      }
    ],
    resistances: {
      slash: 'normal',
      pierce: 'normal',
      blunt: 'resistant'
    },
    phaseTransitions: [
      {
        phase: 1,
        healthThreshold: 1.0,
        name: 'Inner Conflict',
        description: 'Your corrupted self emerges from the shadows.',
        specialMechanics: ['Psychological attacks', 'Memory manipulation']
      },
      {
        phase: 2,
        healthThreshold: 0.4,
        name: 'Desperate Corruption',
        description: 'The corruption fights desperately to maintain control!',
        newSkills: [
          {
            id: 'despair_overwhelming',
            name: 'Overwhelming Despair',
            elementType: 'dark',
            damageType: 'slash',
            basePower: 35,
            manaCost: 30,
            description: 'Drowns you in the despair you have felt.'
          }
        ],
        resistanceChanges: {
          slash: 'endured',
          pierce: 'endured',
          blunt: 'normal'
        },
        specialMechanics: ['Reality distortion', 'Emotional manipulation']
      }
    ],
    position: [0, -3],
    scale: 2.0,
    sprite: 'corrupted_self',
    isDefeated: false
  },
  god_killer_avatar: {
    id: 'god_killer_avatar',
    name: 'God Killer Avatar',
    title: 'The True Enemy',
    lore: 'The God Killer\'s true form manifests, no longer hiding behind your corruption. Its malevolent presence shakes reality itself.',
    maxHealth: 250,
    currentHealth: 250,
    phase: 1,
    maxPhase: 3,
    skills: [
      {
        id: 'reality_tear',
        name: 'Reality Tear',
        elementType: 'void',
        damageType: 'slash',
        basePower: 30,
        manaCost: 25,
        description: 'Tears holes in the fabric of existence.'
      },
      {
        id: 'divine_corruption',
        name: 'Divine Corruption',
        elementType: 'dark',
        damageType: 'pierce',
        basePower: 35,
        manaCost: 30,
        description: 'Corrupts divine energy for destructive purposes.'
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
        name: 'Manifested Evil',
        description: 'The God Killer reveals its true, horrifying form.',
        specialMechanics: ['Reality manipulation', 'Corruption auras']
      },
      {
        phase: 2,
        healthThreshold: 0.6,
        name: 'Cosmic Rage',
        description: 'The God Killer unleashes cosmic-level destruction!',
        newSkills: [
          {
            id: 'void_storm',
            name: 'Void Storm',
            elementType: 'void',
            damageType: 'blunt',
            basePower: 40,
            manaCost: 35,
            description: 'Summons a storm of nothingness.'
          }
        ],
        resistanceChanges: {
          slash: 'endured',
          pierce: 'endured',
          blunt: 'endured'
        },
        specialMechanics: ['Void attacks', 'Dimensional distortion']
      },
      {
        phase: 3,
        healthThreshold: 0.2,
        name: 'Final Desperation',
        description: 'The God Killer makes one last attempt to destroy everything!',
        newSkills: [
          {
            id: 'apocalypse_incarnate',
            name: 'Apocalypse Incarnate',
            elementType: 'void',
            damageType: 'pierce',
            basePower: 60,
            manaCost: 50,
            description: 'The end of all things made manifest.'
          }
        ],
        resistanceChanges: {
          slash: 'fatal',
          pierce: 'fatal',
          blunt: 'fatal'
        },
        specialMechanics: ['Reality annihilation', 'Existence erasure']
      }
    ],
    position: [0, -3],
    scale: 3.0,
    sprite: 'god_killer_avatar',
    isDefeated: false
  },
  true_god_killer: {
    id: 'true_god_killer',
    name: 'The Primordial Void',
    title: 'Ender of All Things',
    lore: 'The original force of entropy and destruction. It existed before creation and seeks to return everything to the void.',
    maxHealth: 350,
    currentHealth: 350,
    phase: 1,
    maxPhase: 4,
    skills: [
      {
        id: 'primordial_darkness',
        name: 'Primordial Darkness',
        elementType: 'void',
        damageType: 'slash',
        basePower: 45,
        manaCost: 40,
        description: 'The original darkness from before creation.'
      }
    ],
    resistances: {
      slash: 'fatal',
      pierce: 'fatal',
      blunt: 'fatal'
    },
    phaseTransitions: [
      {
        phase: 1,
        healthThreshold: 1.0,
        name: 'The Original Void',
        description: 'You face the primordial force that existed before all creation.',
        specialMechanics: ['Existence denial', 'Concept destruction']
      },
      {
        phase: 2,
        healthThreshold: 0.75,
        name: 'Entropy Unleashed',
        description: 'The God Killer begins unmaking reality itself!',
        newSkills: [
          {
            id: 'concept_annihilation',
            name: 'Concept Annihilation',
            elementType: 'void',
            damageType: 'blunt',
            basePower: 55,
            manaCost: 45,
            description: 'Destroys the very concept of existence.'
          }
        ],
        specialMechanics: ['Reality unmaking', 'Time dissolution']
      },
      {
        phase: 3,
        healthThreshold: 0.5,
        name: 'Universal Dissolution',
        description: 'The fabric of the universe begins to unravel!',
        newSkills: [
          {
            id: 'reality_collapse',
            name: 'Reality Collapse',
            elementType: 'void',
            damageType: 'pierce',
            basePower: 70,
            manaCost: 60,
            description: 'Collapses entire dimensions into nothingness.'
          }
        ],
        specialMechanics: ['Dimensional collapse', 'Universal entropy']
      },
      {
        phase: 4,
        healthThreshold: 0.1,
        name: 'The Final End',
        description: 'The God Killer makes its ultimate move to end all existence!',
        newSkills: [
          {
            id: 'omega_terminus',
            name: 'Omega Terminus',
            elementType: 'void',
            damageType: 'slash',
            basePower: 100,
            manaCost: 80,
            description: 'The final attack to end everything that ever was or will be.'
          }
        ],
        specialMechanics: ['Total annihilation', 'Existence termination']
      }
    ],
    position: [0, -3],
    scale: 4.0,
    sprite: 'true_god_killer',
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
