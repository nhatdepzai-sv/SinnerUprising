import { create } from 'zustand';
import { Character } from '../../types/game';
import { characterSkills } from '../combat/skills';

interface CharacterState {
  availableCharacters: Character[];
  selectedTeam: Character[];
  maxTeamSize: number;
  
  // Actions
  selectCharacter: (characterId: string) => void;
  removeCharacter: (characterId: string) => void;
  clearTeam: () => void;
  updateCharacterHealth: (characterId: string, newHealth: number) => void;
  updateCharacterStagger: (characterId: string, staggerDamage: number) => void;
  resetCharacters: () => void;
}

const createCharacter = (id: string, name: string): Character => ({
  id,
  name,
  maxHealth: 100,
  currentHealth: 100,
  staggerThreshold: 30,
  currentStagger: 0,
  isStaggered: false,
  skills: characterSkills[id] || [],
  resistances: {
    slash: 'normal',
    pierce: 'normal',
    blunt: 'normal'
  },
  sinAffinities: ['pride', 'gloom'],
  position: [0, 0, 0],
  rotation: [0, 0, 0]
});

const initialCharacters: Character[] = [
  createCharacter('yi_sang', 'Yi Sang'),
  createCharacter('faust', 'Faust'),
  createCharacter('don_quixote', 'Don Quixote'),
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
  
  updateCharacterStagger: (characterId: string, staggerDamage: number) => {
    const { selectedTeam } = get();
    set({
      selectedTeam: selectedTeam.map(character => {
        if (character.id === characterId) {
          const newStagger = character.currentStagger + staggerDamage;
          return {
            ...character,
            currentStagger: newStagger,
            isStaggered: newStagger >= character.staggerThreshold
          };
        }
        return character;
      })
    });
  },
  
  resetCharacters: () => {
    set({
      selectedTeam: initialCharacters.slice(0, 3).map(char => ({
        ...char,
        currentHealth: char.maxHealth,
        currentStagger: 0,
        isStaggered: false
      }))
    });
  }
}));
