import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Boss, CombatAction, BattleResult, CombatPhase, GamePhase, Character } from '../../types/game';
import { bosses, checkPhaseTransition, applyPhaseTransition } from '../combat/bosses';
import { resolveBattle } from '../combat/clashing';
import { useCharacters } from './useCharacters';

interface CombatState {
  gamePhase: GamePhase;
  combatPhase: CombatPhase;
  currentBoss: Boss | null;
  turnNumber: number;
  selectedActions: CombatAction[];
  lastBattleResult: BattleResult | null;
  combatLog: string[];
  isProcessing: boolean;
  
  // Actions
  startCombat: (bossId?: string) => void;
  selectAction: (action: CombatAction) => void;
  clearActions: () => void;
  processTurn: () => void;
  endCombat: (victory: boolean) => void;
  nextPhase: () => void;
  addLogEntry: (entry: string) => void;
  clearLog: () => void;
  resetCombat: () => void;
  setGamePhase: (phase: GamePhase) => void;
}

export const useCombat = create<CombatState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: 'intro',
    combatPhase: 'planning',
    currentBoss: null,
    turnNumber: 1,
    selectedActions: [],
    lastBattleResult: null,
    combatLog: [],
    isProcessing: false,
    
    startCombat: (bossId?: string) => {
      const boss = bossId ? bosses[bossId] : bosses['god_of_war'];
      if (boss) {
        set({
          gamePhase: 'combat',
          combatPhase: 'planning',
          currentBoss: { ...boss },
          turnNumber: 1,
          selectedActions: [],
          lastBattleResult: null,
          combatLog: [`Combat begins against ${boss.name}!`],
          isProcessing: false
        });
      }
    },
    
    selectAction: (action: CombatAction) => {
      const { selectedActions } = get();
      set({
        selectedActions: [...selectedActions, action]
      });
    },
    
    clearActions: () => {
      set({ selectedActions: [] });
    },
    
    processTurn: () => {
      const { currentBoss, selectedActions, turnNumber } = get();
      if (!currentBoss || selectedActions.length === 0) return;
      
      set({ isProcessing: true, combatPhase: 'battle' });
      
      // Simulate turn processing
      setTimeout(() => {
        const { currentBoss: boss } = get();
        if (!boss) return;
        
        // Simple AI: boss selects a random skill
        const bossSkill = boss.skills[Math.floor(Math.random() * boss.skills.length)];
        
        // Find the character's actual skill from their equipment and base skills
        const selectedAction = selectedActions[0];
        const charactersStore = useCharacters.getState();
        const character = charactersStore.selectedTeam.find((c: any) => c.id === selectedAction.characterId);
        const characterSkill = character?.skills.find((s: any) => s.id === selectedAction.skillId);
        
        if (!character || !characterSkill) {
          console.error('Character or skill not found:', selectedAction.characterId, selectedAction.skillId);
          set({ isProcessing: false, combatPhase: 'planning' });
          return;
        }
        
        
        const battleResult = resolveBattle(characterSkill, bossSkill);
        
        // Add combat log entries
        get().addLogEntry(`${character?.name} uses ${characterSkill.name}!`);
        get().addLogEntry(`${boss.name} counters with ${bossSkill.name}!`);
        
        // Apply damage and update character state
        let newBossHealth = boss.currentHealth;
        let characterHealthChange = 0;
        
        if (battleResult.winner === 'character') {
          newBossHealth = Math.max(0, boss.currentHealth - battleResult.damage);
          get().addLogEntry(`${characterSkill.name} deals ${battleResult.damage} damage!`);
        } else {
          // Character takes damage when losing clash
          characterHealthChange = -battleResult.damage;
          get().addLogEntry(`${character?.name} takes ${battleResult.damage} damage!`);
        }
        
        // Update character health if they took damage
        // Note: Character health update will be handled by the UI layer for now
        
        const updatedBoss = { ...boss, currentHealth: newBossHealth };
        
        // Check for phase transition
        const phaseTransition = checkPhaseTransition(updatedBoss);
        let finalBoss = updatedBoss;
        
        if (phaseTransition) {
          finalBoss = applyPhaseTransition(updatedBoss, phaseTransition);
          get().addLogEntry(`${boss.name} enters ${phaseTransition.name}!`);
          get().addLogEntry(phaseTransition.description);
        }
        
        // Check for victory/defeat
        if (finalBoss.currentHealth <= 0) {
          set({
            currentBoss: finalBoss,
            lastBattleResult: battleResult,
            gamePhase: 'victory',
            isProcessing: false
          });
          get().addLogEntry(`Victory! ${boss.name} has been defeated!`);
          return;
        }
        
        set({
          currentBoss: finalBoss,
          lastBattleResult: battleResult,
          selectedActions: [],
          turnNumber: turnNumber + 1,
          combatPhase: 'planning',
          isProcessing: false
        });
        
        get().addLogEntry(`Turn ${turnNumber + 1} begins.`);
      }, 2000);
    },
    
    endCombat: (victory: boolean) => {
      set({
        gamePhase: victory ? 'victory' : 'defeat',
        combatPhase: 'planning',
        isProcessing: false
      });
    },
    
    nextPhase: () => {
      const { combatPhase } = get();
      const phases: CombatPhase[] = ['planning', 'battle', 'resolution', 'enemy_turn'];
      const currentIndex = phases.indexOf(combatPhase);
      const nextIndex = (currentIndex + 1) % phases.length;
      
      set({ combatPhase: phases[nextIndex] });
    },
    
    addLogEntry: (entry: string) => {
      const { combatLog } = get();
      set({
        combatLog: [...combatLog, entry]
      });
    },
    
    clearLog: () => {
      set({ combatLog: [] });
    },
    
    resetCombat: () => {
      set({
        gamePhase: 'intro',
        combatPhase: 'planning',
        currentBoss: null,
        turnNumber: 1,
        selectedActions: [],
        lastBattleResult: null,
        combatLog: [],
        isProcessing: false
      });
    },
    
    setGamePhase: (phase: GamePhase) => {
      set({ gamePhase: phase });
    }
  }))
);
