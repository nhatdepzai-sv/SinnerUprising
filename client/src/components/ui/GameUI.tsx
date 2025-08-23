import { useEffect } from 'react';
import { useCombat } from '../../lib/stores/useCombat';
import { useCharacters } from '../../lib/stores/useCharacters';
import { useAudio } from '../../lib/stores/useAudio';
import { BossHealthBar } from './BossHealthBar';
import { SkillSelector } from './SkillSelector';
import { CharacterPanel } from './CharacterPanel';
import { CombatLog } from './CombatLog';

export function GameUI() {
  const { 
    gamePhase, 
    combatPhase, 
    currentBoss, 
    selectedActions, 
    processTurn, 
    startCombat, 
    resetCombat,
    isProcessing 
  } = useCombat();
  const { selectedTeam, resetCharacters } = useCharacters();
  const { toggleMute, isMuted } = useAudio();
  
  useEffect(() => {
    // Auto-start combat for demo
    if (gamePhase === 'menu' && selectedTeam.length > 0) {
      startCombat('crimson_apostle');
    }
  }, [gamePhase, selectedTeam.length, startCombat]);
  
  const handleStartGame = () => {
    resetCharacters();
    startCombat('crimson_apostle');
  };
  
  const handleRestartGame = () => {
    resetCombat();
    resetCharacters();
  };
  
  const canProcessTurn = selectedActions.length > 0 && !isProcessing && combatPhase === 'planning';
  
  if (gamePhase === 'menu') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Limbus Company</h1>
          <p className="text-xl mb-8">Turn-Based Tactical RPG</p>
          <button
            onClick={handleStartGame}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-xl font-semibold transition-colors"
          >
            Start Battle
          </button>
        </div>
      </div>
    );
  }
  
  if (gamePhase === 'victory') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold text-green-400 mb-4">Victory!</h1>
          <p className="text-xl mb-8">The boss has been defeated!</p>
          <button
            onClick={handleRestartGame}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg text-xl font-semibold transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }
  
  if (gamePhase === 'defeat') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Defeat</h1>
          <p className="text-xl mb-8">Your team has been defeated...</p>
          <button
            onClick={handleRestartGame}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Boss health bar */}
      {currentBoss && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
          <BossHealthBar boss={currentBoss} />
        </div>
      )}
      
      {/* Character panel */}
      <CharacterPanel characters={selectedTeam} />
      
      {/* Combat log */}
      <CombatLog />
      
      {/* Skill selector */}
      <SkillSelector isVisible={combatPhase === 'planning'} />
      
      {/* Combat controls */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {canProcessTurn && (
          <button
            onClick={processTurn}
            className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Execute Turn
          </button>
        )}
        
        <button
          onClick={toggleMute}
          className="block w-full px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
        
        <button
          onClick={handleRestartGame}
          className="block w-full px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Restart
        </button>
      </div>
      
      {/* Combat phase indicator */}
      <div className="fixed top-1/2 left-4 transform -translate-y-1/2 bg-black/80 p-3 rounded-lg text-white">
        <div className="text-sm text-gray-400">Phase</div>
        <div className="font-semibold capitalize">{combatPhase.replace('_', ' ')}</div>
        {isProcessing && (
          <div className="text-xs text-yellow-400 mt-1">Processing...</div>
        )}
      </div>
    </>
  );
}
