import { create } from 'zustand';
import { Character } from '../../types/game';
import { protagonistSkills } from '../combat/skills';

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
  corruption: 0,
  skills: protagonistSkills.pure || [],
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
  
  resetCharacters: () => {
    set({
      selectedTeam: initialCharacters.slice(0, 1).map(char => ({
        ...char,
        currentHealth: char.maxHealth,
        currentMana: char.maxMana,
        corruption: 0
      }))
    });
  }
}));
