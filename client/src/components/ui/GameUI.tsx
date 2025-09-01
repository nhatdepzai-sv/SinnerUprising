import { useEffect, useState } from 'react';
import { useCombat } from '../../lib/stores/useCombat';
import { useCharacters } from '../../lib/stores/useCharacters';
import { useAudio } from '../../lib/stores/useAudio';
import { BossHealthBar } from './BossHealthBar';
import { SkillSelector } from './SkillSelector';
import { CharacterPanel } from './CharacterPanel';
import { CombatLog } from './CombatLog';
import { StoryDialog } from './StoryDialog';
import { ActSelection } from './ActSelection';
import { IntroAnimation } from './IntroAnimation';
import { MapSystem } from './MapSystem';
import { WeaponShop } from './WeaponShop';
import { SkillLearning } from './SkillLearning';
import { useStory } from '../../lib/stores/useStory';

export function GameUI() {
  const [showWeaponShop, setShowWeaponShop] = useState(false);
  const [showSkillLearning, setShowSkillLearning] = useState(false);
  const [cheatInput, setCheatInput] = useState('');
  const { 
    gamePhase, 
    combatPhase, 
    currentBoss, 
    selectedActions, 
    processTurn, 
    startCombat, 
    resetCombat,
    isProcessing,
    setGamePhase,
    executeSkibidiAttack,
    increaseStrength,
    skibidiArmyActive
  } = useCombat();
  const { selectedTeam, resetCharacters } = useCharacters();
  const { toggleMute, isMuted } = useAudio();
  const { isInCutscene, showingDialogue, hasSeenIntro, getCurrentAct, completeAct, resetStory, markIntroSeen } = useStory();
  
  // Cheat code system
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only listen when not in cutscene
      if (!isInCutscene && !showingDialogue) {
        const key = event.key.toLowerCase();
        const newInput = cheatInput + key;
        
        // Check for "skibidi" cheat code
        if (newInput.includes('skibidi')) {
          // Execute the cheat attack!
          executeSkibidiAttack();
          setCheatInput(''); // Reset input
        } else if (newInput.length > 10) {
          // Reset if input gets too long
          setCheatInput('');
        } else {
          setCheatInput(newInput);
        }
        
        // Clear input after a delay
        setTimeout(() => {
          setCheatInput(prev => prev.slice(1)); // Remove first character
        }, 2000);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [cheatInput, isInCutscene, showingDialogue, currentBoss]);
  
  useEffect(() => {
    // Auto-start story mode
    if (gamePhase === 'intro' && selectedTeam.length > 0) {
      // Game starts in story mode, not directly into combat
    }
  }, [gamePhase, selectedTeam.length]);
  
  const handleStartGame = () => {
    resetCharacters();
    resetStory();
    setGamePhase('story'); // Actually transition to story phase
  };
  
  const handleRestartGame = () => {
    resetCombat();
    resetCharacters();
    resetStory();
    setGamePhase('intro'); // Go back to intro
  };
  
  const canProcessTurn = selectedActions.length > 0 && !isProcessing && combatPhase === 'planning';

  // Show story dialog if in cutscene
  if (isInCutscene && showingDialogue) {
    return <StoryDialog />;
  }
  
  // Show intro animation if not seen yet
  if (gamePhase === 'intro' && !hasSeenIntro) {
    return (
      <IntroAnimation 
        onComplete={() => {
          markIntroSeen();
          handleStartGame();
        }} 
      />
    );
  }
  
  if (gamePhase === 'intro' && hasSeenIntro) {
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
  
  // Show map system
  if (gamePhase === 'map') {
    return <MapSystem />;
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
                // Go to story selection to choose next chapter
                setGamePhase('story');
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
          <p className="text-xl mb-4">Your team has been defeated...</p>
          <p className="text-lg mb-8 text-yellow-400">💰 You gained 100 gold for your effort!</p>
          <button
            onClick={() => {
              // Award money for losing
              increaseStrength(100); // Using strength as money
              handleRestartGame();
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
            Try Again (+100 Gold)
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* EPIC SKIBIDI ARMY EFFECT */}
      {skibidiArmyActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Army of skibidis attacking from all directions */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * 360;
            const distance = 200 + (i % 3) * 100;
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            const delay = i * 0.1;
            return (
              <div
                key={i}
                className="absolute w-8 h-8 bg-blue-600 rounded-lg animate-bounce text-center leading-8 font-bold text-white text-xs"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  animation: `skibidiAttack 3s ease-in-out ${delay}s`,
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)',
                  transform: `rotate(${angle}deg)`
                }}
              >
                S
              </div>
            );
          })}
          {/* Central explosion effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 bg-yellow-400 opacity-60 rounded-full animate-ping" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-red-600 animate-bounce">
              💥
            </div>
          </div>
          {/* Epic text */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-6xl font-bold text-blue-400 animate-pulse drop-shadow-lg">
              🔥 SKIBIDI ARMY! 🔥
            </div>
            <div className="text-2xl font-bold text-yellow-400 animate-bounce mt-2">
              ULTIMATE ATTACK!
            </div>
          </div>
        </div>
      )}
      
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
          onClick={() => setShowWeaponShop(true)}
          className="block w-full px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
        >
          ⚔️ Weapon Shop
        </button>
        <button
          onClick={() => setShowSkillLearning(true)}
          className="block w-full px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          ✨ Learn Skills
        </button>
        
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
      
      {/* Weapon Shop */}
      <WeaponShop 
        isVisible={showWeaponShop} 
        onClose={() => setShowWeaponShop(false)} 
      />
      <SkillLearning
        isOpen={showSkillLearning}
        onClose={() => setShowSkillLearning(false)}
      />
    </>
  );
}
