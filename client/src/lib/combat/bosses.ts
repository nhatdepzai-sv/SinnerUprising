import { Boss, BossPhase } from '../../types/game';
import { bossSkills } from './skills';

export const bosses: Record<string, Boss> = {
  crimson_apostle: {
    id: 'crimson_apostle',
    name: 'Crimson Apostle',
    maxHealth: 500,
    currentHealth: 500,
    phase: 1,
    maxPhase: 3,
    skills: bossSkills.crimson_apostle.slice(0, 2), // Start with first 2 skills
    resistances: {
      slash: 'normal',
      pierce: 'endured',
      blunt: 'resistant'
    },
    phaseTransitions: [
      {
        phase: 1,
        healthThreshold: 1.0,
        name: 'Awakening Phase',
        description: 'The Crimson Apostle begins its assault.',
        specialMechanics: ['Basic attacks only']
      },
      {
        phase: 2,
        healthThreshold: 0.6,
        name: 'Rage Phase',
        description: 'Blood boils as the apostle enters a frenzied state!',
        resistanceChanges: {
          slash: 'endured',
          pierce: 'normal',
          blunt: 'ineffective'
        },
        specialMechanics: ['Increased attack frequency', 'New skill: Crimson Spear']
      },
      {
        phase: 3,
        healthThreshold: 0.2,
        name: 'Apostolic Fury',
        description: 'Divine wrath manifests! All attacks become devastating!',
        newSkills: [bossSkills.crimson_apostle[2]], // Add ultimate skill
        resistanceChanges: {
          slash: 'resistant',
          pierce: 'resistant',
          blunt: 'normal'
        },
        specialMechanics: ['All attacks deal area damage', 'Immunity to stagger']
      }
    ],
    position: [0, 0, -3],
    rotation: [0, 0, 0],
    scale: 2.0
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
