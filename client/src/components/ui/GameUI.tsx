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
import { useWeaponShop } from '../../lib/stores/useWeaponShop';

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
          <p className="text-lg mb-4 text-yellow-400">💰 You gained 150 gold for your brave effort!</p>
          <p className="text-md mb-8 text-green-400">🎁 Experience earned: +50 XP</p>
          <div className="space-x-4">
            <button
              onClick={() => {
                // Award money and experience for losing
                const { addGold } = useWeaponShop.getState();
                addGold(150); // Give gold for losing
                increaseStrength(50); // Give some strength/experience
                setGamePhase('story'); // Go back to story selection
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
              Continue (+150 Gold)
            </button>
            
            <button
              onClick={() => setShowWeaponShop(true)}
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-xl font-semibold transition-colors border-4 border-yellow-800"
              style={{
                imageRendering: 'pixelated',
                filter: 'contrast(1.2)',
                borderRadius: '0px',
                fontFamily: 'monospace',
                textShadow: '2px 2px 0px #000000'
              }}
            >
              🏪 Visit Shop
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* EPIC SKIBIDI TOILET SUMMONING EFFECT */}
      {skibidiArmyActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden bg-purple-900/30">
          {/* Giant Skibidi Toilet in center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* Toilet body */}
            <div 
              className="w-48 h-64 bg-gradient-to-b from-white via-gray-100 to-gray-300 border-8 border-gray-400 rounded-3xl relative"
              style={{
                animation: 'toiletSummon 1s ease-out, toiletFloat 2s ease-in-out 1s infinite',
                filter: 'drop-shadow(0 0 30px rgba(139, 69, 19, 0.8))'
              }}
            >
              {/* Toilet seat */}
              <div className="absolute top-4 left-4 right-4 h-8 bg-brown-600 rounded-full border-4 border-brown-800" />
              
              {/* Skibidi face on toilet */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-32 bg-yellow-400 rounded-2xl border-4 border-yellow-600 relative">
                  {/* Eyes */}
                  <div className="absolute top-6 left-4 w-4 h-4 bg-black rounded-full animate-pulse" />
                  <div className="absolute top-6 right-4 w-4 h-4 bg-black rounded-full animate-pulse" />
                  {/* Mouth */}
                  <div className="absolute top-16 left-6 right-6 h-6 bg-red-600 rounded-full border-2 border-red-800" />
                  {/* Toilet paper hat */}
                  <div className="absolute -top-8 left-2 right-2 h-12 bg-white border-4 border-gray-300 rounded-t-full" />
                </div>
              </div>
              
              {/* Toilet tank */}
              <div className="absolute -top-12 left-8 right-8 h-16 bg-white border-4 border-gray-400 rounded-t-xl" />
            </div>
            
            {/* Energy ball charging */}
            <div 
              className="absolute -top-32 left-1/2 transform -translate-x-1/2"
              style={{ animation: 'energyCharge 2s ease-in-out 1.5s' }}
            >
              <div className="w-16 h-16 bg-gradient-radial from-yellow-300 via-orange-400 to-red-500 rounded-full animate-pulse">
                <div className="absolute inset-2 bg-yellow-100 rounded-full animate-ping" />
                <div className="absolute inset-4 bg-white rounded-full animate-bounce" />
              </div>
            </div>
          </div>
          
          {/* Energy ball explosion effect */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{ animation: 'explosionEffect 1s ease-out 3.5s' }}
          >
            <div className="w-96 h-96 bg-gradient-radial from-yellow-200 via-orange-300 to-red-400 rounded-full opacity-80" />
            <div className="absolute inset-8 bg-white rounded-full opacity-90 animate-ping" />
            <div className="absolute inset-16 bg-yellow-300 rounded-full opacity-70 animate-bounce" />
          </div>
          
          {/* Epic text effects */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-8xl font-bold text-purple-400 animate-pulse drop-shadow-lg mb-4">
              🚽 SKIBIDI TOILET! 🚽
            </div>
            <div className="text-4xl font-bold text-yellow-400 animate-bounce">
              ENERGY BALL EXPLOSION!
            </div>
            <div className="text-2xl font-bold text-red-400 animate-pulse mt-2">
              ULTIMATE DESTRUCTION!
            </div>
          </div>
          
          {/* Explosion particles */}
          {Array.from({ length: 30 }).map((_, i) => {
            const angle = (i / 30) * 360;
            const distance = 100 + (i % 5) * 50;
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            return (
              <div
                key={i}
                className="absolute w-4 h-4 bg-yellow-400 rounded-full"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  animation: `explosionParticle 1s ease-out ${3.5 + i * 0.05}s`,
                  boxShadow: '0 0 10px rgba(255, 255, 0, 0.8)'
                }}
              />
            );
          })}
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
          📚 Skill Training
        </button>
        
        <button
          onClick={() => setGamePhase('story')}
          className="block w-full px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          📖 Return to Acts
        </button>
        
        <button
          onClick={toggleMute}
          className="block w-full px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
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
      
      {/* Add custom CSS for skibidi toilet and other animations */}
      <style>{`
        @keyframes toiletSummon {
          0% { 
            transform: scale(0) rotateY(0deg); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.2) rotateY(180deg); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(1) rotateY(360deg); 
            opacity: 1; 
          }
        }
        
        @keyframes toiletFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(5deg); 
          }
        }
        
        @keyframes energyCharge {
          0% { 
            transform: scale(0) translateX(-50%); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.5) translateX(-50%); 
            opacity: 1; 
          }
          100% { 
            transform: scale(2) translateX(-50%); 
            opacity: 0.8; 
          }
        }
        
        @keyframes explosionEffect {
          0% { 
            transform: scale(0); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.5); 
            opacity: 1; 
          }
          100% { 
            transform: scale(3); 
            opacity: 0; 
          }
        }
        
        @keyframes explosionParticle {
          0% { 
            transform: scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: scale(0) translateX(200px); 
            opacity: 0; 
          }
        }
        
        @keyframes skibidiAttack {
          0% { 
            transform: scale(0) rotate(0deg); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.2) rotate(180deg); 
            opacity: 1; 
          }
          100% { 
            transform: scale(0.8) rotate(360deg) translateX(-50px); 
            opacity: 0; 
          }
        }
      `}</style>
    </>
  );
}
