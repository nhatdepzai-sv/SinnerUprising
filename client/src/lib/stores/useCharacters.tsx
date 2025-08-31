import { create } from 'zustand';
import { Character } from '../../types/game';
import { protagonistSkills } from '../combat/skills';
import { useWeaponShop } from './useWeaponShop';

interface CharacterState {
  availableCharacters: Character[];
  selectedTeam: Character[];
  maxTeamSize: number;
  
  // Actions
  selectCharacter: (characterId: string) => void;
  removeCharacter: (characterId: string) => void;
  clearTeam: () => void;
  updateCharacterHealth: (characterId: string, newHealth: number) => void;
  updateCharacterCorruption: (characterId: string, corruptionGain: number) => void;
  gainExperience: (characterId: string, expAmount: number) => void;
  learnSkill: (characterId: string, skillId: string) => void;
  equipWeapon: (characterId: string, weaponId: string) => void;
  unequipWeapon: (characterId: string) => void;
  upgradeCharacterStrength: (characterId: string, amount: number) => void;
  resetCharacters: () => void;
}

const createCharacter = (id: string, name: string, title: string): Character => ({
  id,
  name,
  title,
  maxHealth: 100,
  currentHealth: 100,
  maxMana: 50,
  currentMana: 50,
  level: 1,
  experience: 0,
  experienceToNext: 100,
  corruption: 0,
  skills: protagonistSkills.pure || [],
  availableSkills: [],
  equippedWeapon: null,
  resistances: {
    slash: 'normal',
    pierce: 'normal',
    blunt: 'normal'
  },
  elementAffinities: ['light', 'divine'],
  sprite: 'protagonist',
  position: [0, 0]
});

const initialCharacters: Character[] = [
  createCharacter('protagonist', 'Aiden', 'The Betrayed'),
];

export const useCharacters = create<CharacterState>((set, get) => ({
  availableCharacters: initialCharacters,
  selectedTeam: [],
  maxTeamSize: 3,
  
  selectCharacter: (characterId: string) => {
    const { availableCharacters, selectedTeam, maxTeamSize } = get();
    
    if (selectedTeam.length >= maxTeamSize) return;
    if (selectedTeam.find(c => c.id === characterId)) return;
    
    const character = availableCharacters.find(c => c.id === characterId);
    if (character) {
      set({
        selectedTeam: [...selectedTeam, { ...character }]
      });
    }
  },
  
  removeCharacter: (characterId: string) => {
    const { selectedTeam } = get();
    set({
      selectedTeam: selectedTeam.filter(c => c.id !== characterId)
    });
  },
  
  clearTeam: () => {
    set({ selectedTeam: [] });
  },
  
  updateCharacterHealth: (characterId: string, newHealth: number) => {
    const { selectedTeam } = get();
    set({
      selectedTeam: selectedTeam.map(character => 
        character.id === characterId 
          ? { ...character, currentHealth: Math.max(0, newHealth) }
          : character
      )
    });
  },
  
  updateCharacterCorruption: (characterId: string, corruptionGain: number) => {
    const { selectedTeam } = get();
    set({
      selectedTeam: selectedTeam.map(character => {
        if (character.id === characterId) {
          const newCorruption = Math.max(0, Math.min(100, character.corruption + corruptionGain));
          return {
            ...character,
            corruption: newCorruption
          };
        }
        return character;
      })
    });
  },
  
  equipWeapon: (characterId: string, weaponId: string) => {
    const { selectedTeam } = get();
    const weaponShop = useWeaponShop.getState();
    const weapon = weaponShop.inventory.find(w => w.id === weaponId);
    
    if (!weapon) return;
    
    set({
      selectedTeam: selectedTeam.map(character => 
        character.id === characterId 
          ? { 
              ...character, 
              equippedWeapon: weapon,
              skills: [...protagonistSkills.pure, ...weapon.skills] // Combine base skills with weapon skills
            }
          : character
      )
    });
  },
  
  unequipWeapon: (characterId: string) => {
    const { selectedTeam } = get();
    set({
      selectedTeam: selectedTeam.map(character => 
        character.id === characterId 
          ? { 
              ...character, 
              equippedWeapon: null,
              skills: protagonistSkills.pure // Reset to base skills
            }
          : character
      )
    });
  },
  
  gainExperience: (characterId: string, expAmount: number) => {
    const { selectedTeam } = get();
    set({
      selectedTeam: selectedTeam.map(character => {
        if (character.id !== characterId) return character;
        
        const newExperience = character.experience + expAmount;
        let newLevel = character.level;
        let experienceToNext = character.experienceToNext;
        let maxHealth = character.maxHealth;
        let maxMana = character.maxMana;
        let availableSkills = [...character.availableSkills];
        
        // Level up logic
        if (newExperience >= character.experienceToNext) {
          newLevel += 1;
          experienceToNext = newLevel * 120;
          maxHealth += 15;
          maxMana += 10;
          
          // Add learnable skills at specific levels
          if (newLevel === 2) {
            availableSkills.push({
              id: 'power_strike',
              name: 'Power Strike',
              elementType: 'fire',
              damageType: 'slash',
              basePower: 16,
              manaCost: 12,
              description: 'A powerful strike learned through combat experience.',
              effects: [{ type: 'damage', value: 4, target: 'enemy' }]
            });
          }
          
          if (newLevel === 3) {
            availableSkills.push({
              id: 'healing_light',
              name: 'Healing Light',
              elementType: 'light',
              damageType: 'blunt',
              basePower: 5,
              manaCost: 15,
              description: 'Restores health through divine light.',
              effects: [{ type: 'heal', value: 20, target: 'self' }]
            });
          }
        }
        
        return {
          ...character,
          level: newLevel,
          experience: newExperience,
          experienceToNext,
          maxHealth,
          maxMana,
          currentHealth: character.currentHealth + (maxHealth - character.maxHealth),
          currentMana: character.currentMana + (maxMana - character.maxMana),
          availableSkills
        };
      })
    });
  },
  
  learnSkill: (characterId: string, skillId: string) => {
    const { selectedTeam } = get();
    set({
      selectedTeam: selectedTeam.map(character => {
        if (character.id !== characterId) return character;
        
        const skillToLearn = character.availableSkills.find(s => s.id === skillId);
        if (!skillToLearn) return character;
        
        return {
          ...character,
          skills: [...character.skills, skillToLearn],
          availableSkills: character.availableSkills.filter(s => s.id !== skillId)
        };
      })
    });
  },
  
  upgradeCharacterStrength: (characterId: string, amount: number) => {
    const { selectedTeam } = get();
    set({
      selectedTeam: selectedTeam.map(character => {
        if (character.id !== characterId) return character;
        
        return {
          ...character,
          strengthBonus: (character.strengthBonus || 0) + amount
        };
      })
    });
  },

  resetCharacters: () => {
    set({
      selectedTeam: initialCharacters.slice(0, 1).map(char => ({
        ...char,
        currentHealth: char.maxHealth,
        currentMana: char.maxMana,
        corruption: 0,
        equippedWeapon: null,
        strengthBonus: 0
      }))
    });
  }
}));
