import { useEffect } from 'react';
import { useCombat } from '../../lib/stores/useCombat';
import { useCharacters } from '../../lib/stores/useCharacters';
import { useAudio } from '../../lib/stores/useAudio';
import { BossHealthBar } from './BossHealthBar';
import { SkillSelector } from './SkillSelector';
import { CharacterPanel } from './CharacterPanel';
import { CombatLog } from './CombatLog';
import { StoryDialog } from './StoryDialog';
import { ActSelection } from './ActSelection';
import { useStory } from '../../lib/stores/useStory';

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
  const { isInCutscene, showingDialogue, getCurrentAct, completeAct, resetStory } = useStory();
  
  useEffect(() => {
    // Auto-start story mode
    if (gamePhase === 'intro' && selectedTeam.length > 0) {
      // Game starts in story mode, not directly into combat
    }
  }, [gamePhase, selectedTeam.length]);
  
  const handleStartGame = () => {
    resetCharacters();
    resetStory();
  };
  
  const handleRestartGame = () => {
    resetCombat();
    resetCharacters();
    resetStory();
  };
  
  const canProcessTurn = selectedActions.length > 0 && !isProcessing && combatPhase === 'planning';

  // Show story dialog if in cutscene
  if (isInCutscene && showingDialogue) {
    return <StoryDialog />;
  }
  
  if (gamePhase === 'intro') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 
            className="text-5xl font-bold mb-4 text-red-500"
            style={{
              fontFamily: 'monospace',
              textShadow: '4px 4px 0px #000000',
              imageRendering: 'pixelated'
            }}
          >
            PATH OF VENGEANCE
          </h1>
          <p 
            className="text-2xl mb-4 text-gray-300"
            style={{
              fontFamily: 'monospace',
              textShadow: '2px 2px 0px #000000'
            }}
          >
            AN EPIC TALE OF BETRAYAL AND REVENGE
          </p>
          <p 
            className="text-lg mb-8 text-gray-400"
            style={{
              fontFamily: 'monospace',
              textShadow: '1px 1px 0px #000000'
            }}
          >
            THE GODS ABANDONED YOU. NOW YOU WILL MAKE THEM PAY.
          </p>
          <button
            onClick={handleStartGame}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-xl font-semibold transition-colors border-4 border-red-800"
            style={{
              imageRendering: 'pixelated',
              filter: 'contrast(1.2)',
              borderRadius: '0px',
              fontFamily: 'monospace',
              textShadow: '2px 2px 0px #000000'
            }}
          >
            BEGIN YOUR QUEST
          </button>
        </div>
      </div>
    );
  }
  
  // Show act selection when not in combat
  if (gamePhase === 'story') {
    return <ActSelection />;
  }
  
  if (gamePhase === 'victory') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Divine Blood Spilled</h1>
          <p className="text-xl mb-4">Another god falls to your vengeance!</p>
          <p className="text-lg mb-8 text-gray-300">Your corruption grows, but so does your power...</p>
          <div className="space-x-4">
            <button
              onClick={() => {
                const currentAct = getCurrentAct();
                if (currentAct) {
                  completeAct(currentAct.id);
                }
                resetCombat();
              }}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-xl font-semibold transition-colors border-4 border-red-800"
              style={{
                imageRendering: 'pixelated',
                filter: 'contrast(1.2)',
                borderRadius: '0px',
                fontFamily: 'monospace',
                textShadow: '2px 2px 0px #000000'
              }}
            >
              CONTINUE THE HUNT
            </button>
            <button
              onClick={handleRestartGame}
              className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-xl font-semibold transition-colors border-4 border-gray-800"
              style={{
                imageRendering: 'pixelated',
                filter: 'contrast(1.2)',
                borderRadius: '0px',
                fontFamily: 'monospace',
                textShadow: '2px 2px 0px #000000'
              }}
            >
              Start Over
            </button>
          </div>
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
