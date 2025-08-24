import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { StoryAct, GameState } from '../../types/game';
import { initialStoryActs, initialGameState, updateProtagonistForCorruption } from '../story';

interface StoryState extends GameState {
  isInCutscene: boolean;
  currentDialogueIndex: number;
  showingDialogue: boolean;
  hasSeenIntro: boolean;
  
  // Actions
  nextDialogue: () => void;
  skipCutscene: () => void;
  completeAct: (actId: string) => void;
  unlockNextAct: () => void;
  addCorruption: (amount: number) => void;
  updateProtagonist: () => void;
  resetStory: () => void;
  startCutscene: (actId: string) => void;
  getCurrentAct: () => StoryAct | null;
  markIntroSeen: () => void;
}

export const useStory = create<StoryState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state from story system
    ...initialGameState,
    isInCutscene: false,
    currentDialogueIndex: 0,
    showingDialogue: false,
    hasSeenIntro: false,
    
    nextDialogue: () => {
      const { currentAct, acts, currentDialogueIndex } = get();
      const act = acts[currentAct];
      
      if (act && currentDialogueIndex < act.dialogue.length - 1) {
        set({ currentDialogueIndex: currentDialogueIndex + 1 });
      } else {
        // End of dialogue, exit cutscene
        set({ 
          isInCutscene: false, 
          showingDialogue: false,
          currentDialogueIndex: 0
        });
      }
    },
    
    skipCutscene: () => {
      set({ 
        isInCutscene: false, 
        showingDialogue: false,
        currentDialogueIndex: 0
      });
    },
    
    completeAct: (actId: string) => {
      const { acts, defeatedGods } = get();
      const updatedActs = acts.map(act => 
        act.id === actId ? { ...act, completed: true } : act
      );
      
      // Add the boss ID to defeated gods if it's not the final boss
      const act = acts.find(a => a.id === actId);
      let updatedDefeatedGods = defeatedGods;
      if (act && act.bossId !== 'final_boss') {
        updatedDefeatedGods = [...defeatedGods, act.bossId];
      }
      
      set({ 
        acts: updatedActs,
        defeatedGods: updatedDefeatedGods
      });
      
      get().unlockNextAct();
    },
    
    unlockNextAct: () => {
      const { currentAct, acts } = get();
      const nextActIndex = currentAct + 1;
      
      if (nextActIndex < acts.length) {
        const updatedActs = acts.map((act, index) => 
          index === nextActIndex ? { ...act, unlocked: true } : act
        );
        
        set({ 
          acts: updatedActs,
          currentAct: nextActIndex
        });
      } else {
        // Reached final boss\n        set({ hasReachedFinalBoss: true });
      }
    },
    
    addCorruption: (amount: number) => {
      const { corruptionLevel } = get();
      const newCorruption = Math.max(0, Math.min(100, corruptionLevel + amount));
      
      set({ corruptionLevel: newCorruption });
      get().updateProtagonist();
    },
    
    updateProtagonist: () => {
      const { protagonist, corruptionLevel } = get();
      const updatedProtagonist = updateProtagonistForCorruption(protagonist, corruptionLevel);
      
      set({ protagonist: updatedProtagonist });
    },
    
    resetStory: () => {
      set(initialGameState);
      set({ 
        isInCutscene: false,
        currentDialogueIndex: 0,
        showingDialogue: false,
        hasSeenIntro: false
      });
    },
    
    startCutscene: (actId: string) => {
      const { acts } = get();
      const actIndex = acts.findIndex(act => act.id === actId);
      
      if (actIndex !== -1) {
        set({
          currentAct: actIndex,
          isInCutscene: true,
          showingDialogue: true,
          currentDialogueIndex: 0
        });
      }
    },
    
    getCurrentAct: () => {
      const { currentAct, acts } = get();
      return acts[currentAct] || null;
    },
    
    markIntroSeen: () => {
      set({ hasSeenIntro: true });
    }
  }))
);