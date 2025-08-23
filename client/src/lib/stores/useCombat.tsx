import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Boss, CombatAction, ClashResult, CombatPhase, GamePhase } from '../../types/game';
import { bosses, checkPhaseTransition, applyPhaseTransition } from '../combat/bosses';
import { resolveClash } from '../combat/clashing';

interface CombatState {
  gamePhase: GamePhase;
  combatPhase: CombatPhase;
  currentBoss: Boss | null;
  turnNumber: number;
  selectedActions: CombatAction[];
  lastClashResult: ClashResult | null;
  combatLog: string[];
  isProcessing: boolean;
  
  // Actions
  startCombat: (bossId: string) => void;
  selectAction: (action: CombatAction) => void;
  clearActions: () => void;
  processTurn: () => void;
  endCombat: (victory: boolean) => void;
  nextPhase: () => void;
  addLogEntry: (entry: string) => void;
  clearLog: () => void;
  resetCombat: () => void;
}

export const useCombat = create<CombatState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: 'menu',
    combatPhase: 'planning',
    currentBoss: null,
    turnNumber: 1,
    selectedActions: [],
    lastClashResult: null,
    combatLog: [],
    isProcessing: false,
    
    startCombat: (bossId: string) => {
      const boss = bosses[bossId];
      if (boss) {
        set({
          gamePhase: 'combat',
          combatPhase: 'planning',
          currentBoss: { ...boss },
          turnNumber: 1,
          selectedActions: [],
          lastClashResult: null,
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
      
      set({ isProcessing: true, combatPhase: 'clashing' });
      
      // Simulate turn processing
      setTimeout(() => {
        const { currentBoss: boss } = get();
        if (!boss) return;
        
        // Simple AI: boss selects a random skill
        const bossSkill = boss.skills[Math.floor(Math.random() * boss.skills.length)];
        const characterAction = selectedActions[0];
        
        // Find the character's skill
        // For now, we'll use a placeholder skill resolution
        const characterSkill = {
          id: 'basic_attack',
          name: 'Basic Attack',
          sinType: 'pride' as const,
          damageType: 'slash' as const,
          basePower: 10,
          coinCount: 2,
          description: 'A basic attack'
        };
        
        const clashResult = resolveClash(characterSkill, bossSkill);
        
        // Apply damage
        let newBossHealth = boss.currentHealth;
        if (clashResult.winner === 'character') {
          newBossHealth = Math.max(0, boss.currentHealth - clashResult.damage);
        }
        
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
            lastClashResult: clashResult,
            gamePhase: 'victory',
            isProcessing: false
          });
          get().addLogEntry(`Victory! ${boss.name} has been defeated!`);
          return;
        }
        
        set({
          currentBoss: finalBoss,
          lastClashResult: clashResult,
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
      const phases: CombatPhase[] = ['planning', 'clashing', 'resolution', 'enemy_turn'];
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
        gamePhase: 'menu',
        combatPhase: 'planning',
        currentBoss: null,
        turnNumber: 1,
        selectedActions: [],
        lastClashResult: null,
        combatLog: [],
        isProcessing: false
      });
    }
  }))
);
