import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Boss, CombatAction, BattleResult, CombatPhase, GamePhase, Character, Orb } from '../../types/game';
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
  orbs: Orb[];
  playerStrength: number;
  strengthUpgradeLevel: number;
  collectedOrbs: number;
  skibidiArmyActive: boolean;
  
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
  spawnOrb: () => void;
  clickOrb: (orbId: string) => void;
  removeOrb: (orbId: string) => void;
  increaseStrength: (amount: number) => void;
  upgradeStrength: () => void;
  spendOrbs: (amount: number) => boolean;
  executeSkibidiAttack: () => void;
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
    orbs: [],
    playerStrength: 0,
    strengthUpgradeLevel: 1,
    collectedOrbs: 0,
    skibidiArmyActive: false,
    
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
        if (characterHealthChange < 0) {
          const newCharacterHealth = character.currentHealth + characterHealthChange;
          useCharacters.getState().updateCharacterHealth(character.id, newCharacterHealth);
          
          // Check if character is defeated
          if (newCharacterHealth <= 0) {
            get().addLogEntry(`${character.name} has been defeated!`);
            set({
              gamePhase: 'defeat',
              isProcessing: false
            });
            return;
          }
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
          // Grant experience for victory
          const expGained = 50 + (boss.phase * 25);
          useCharacters.getState().gainExperience(character.id, expGained);
          get().addLogEntry(`Victory! ${boss.name} has been defeated!`);
          get().addLogEntry(`${character.name} gained ${expGained} experience!`);
          
          set({
            currentBoss: finalBoss,
            lastBattleResult: battleResult,
            gamePhase: 'victory',
            isProcessing: false
          });
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
    },

    spawnOrb: () => {
      const orbId = `orb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 10, // x: -5 to 5
        2 + Math.random() * 3,      // y: 2 to 5
        (Math.random() - 0.5) * 10  // z: -5 to 5
      ];
      
      const hitpoints = 3 + Math.floor(Math.random() * 3); // 3-5 clicks
      const strengthBonus = 1 + Math.floor(Math.random() * 2); // 1-2 strength
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
      const glowColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newOrb: Orb = {
        id: orbId,
        position,
        hitpoints,
        maxHitpoints: hitpoints,
        strengthBonus,
        glowColor,
        spawnTime: Date.now()
      };
      
      const { orbs } = get();
      set({ orbs: [...orbs, newOrb] });
      get().addLogEntry(`✨ A glowing orb appears! Click it ${hitpoints} times for +${strengthBonus} strength!`);
    },

    clickOrb: (orbId: string) => {
      const { orbs } = get();
      const orb = orbs.find(o => o.id === orbId);
      
      if (!orb) return;
      
      const newHitpoints = orb.hitpoints - 1;
      
      if (newHitpoints <= 0) {
        // Orb destroyed, give orbs to spend
        const { collectedOrbs } = get();
        set({ collectedOrbs: collectedOrbs + 1 });
        get().removeOrb(orbId);
        get().addLogEntry(`🔮 Orb collected! You now have ${collectedOrbs + 1} orbs to spend!`);
      } else {
        // Update orb hitpoints
        const updatedOrbs = orbs.map(o => 
          o.id === orbId ? { ...o, hitpoints: newHitpoints } : o
        );
        set({ orbs: updatedOrbs });
      }
    },

    removeOrb: (orbId: string) => {
      const { orbs } = get();
      set({ orbs: orbs.filter(o => o.id !== orbId) });
    },
    
    // Cheat code: One-shot boss attack with skibidi army!
    executeSkibidiAttack: () => {
      const { currentBoss } = get();
      if (currentBoss && currentBoss.currentHealth > 1) {
        const damage = currentBoss.currentHealth - 1;
        const newBossHealth = 1; // Leave boss with 1 HP
        
        set({
          currentBoss: {
            ...currentBoss,
            currentHealth: newBossHealth
          }
        });
        
        get().addLogEntry('🎮 SKIBIDI ARMY SUMMONED!');
        get().addLogEntry('💥 A thousand skibidis attack the boss!');
        get().addLogEntry(`💥 Deals ${damage} EPIC damage to ${currentBoss.name}!`);
        get().addLogEntry('🔥 Boss is almost defeated!');
        get().addLogEntry('🎉 SKIBIDI POWER ACTIVATED!');
        
        console.log('🎮 CHEAT: Skibidi attack deals', damage, 'damage!');
        
        // Trigger skibidi army visual effect
        set({ skibidiArmyActive: true });
        setTimeout(() => {
          set({ skibidiArmyActive: false });
        }, 3000);
      }
    },

    increaseStrength: (amount: number) => {
      const { playerStrength } = get();
      set({ playerStrength: playerStrength + amount });
    },

    upgradeStrength: () => {
      const { strengthUpgradeLevel } = get();
      set({ 
        strengthUpgradeLevel: strengthUpgradeLevel + 1,
        playerStrength: Math.floor(strengthUpgradeLevel * 1.5) // Base strength increase per level
      });
    },

    spendOrbs: (amount: number) => {
      const { collectedOrbs } = get();
      if (collectedOrbs >= amount) {
        set({ collectedOrbs: collectedOrbs - amount });
        return true;
      }
      return false;
    }
  }))
);
