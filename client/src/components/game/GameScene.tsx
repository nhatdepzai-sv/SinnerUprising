import { Character } from './Character';
import { Boss } from './Boss';
import { Orb } from './Orb';
import { useCombat } from '../../lib/stores/useCombat';
import { useCharacters } from '../../lib/stores/useCharacters';
import { useEffect, useState } from 'react';

export function GameScene() {
  const { currentBoss, gamePhase, combatPhase, orbs, spawnOrb, turnNumber, lastBattleResult } = useCombat();
  const { selectedTeam } = useCharacters();
  
  // State for special effects
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [mapSwitchIndex, setMapSwitchIndex] = useState(0);
  const [bossShatterEffect, setBossShatterEffect] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Animation frame counter
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  // Handle glitchy effects for final phase bosses
  useEffect(() => {
    if (currentBoss && (currentBoss.id === 'final_boss' || currentBoss.id === 'god_of_death') && currentBoss.phase === 3) {
      setGlitchEffect(true);
      
      // Switch map backgrounds rapidly
      const glitchInterval = setInterval(() => {
        setMapSwitchIndex(prev => (prev + 1) % 6);
      }, 200 + Math.random() * 300);
      
      return () => clearInterval(glitchInterval);
    } else {
      setGlitchEffect(false);
    }
  }, [currentBoss?.phase, currentBoss?.id]);
  
  // Handle boss defeat shatter effect
  useEffect(() => {
    if (lastBattleResult && lastBattleResult.winner === 'character' && gamePhase === 'victory') {
      setBossShatterEffect(true);
      setTimeout(() => setBossShatterEffect(false), 3000);
    }
  }, [lastBattleResult, gamePhase]);
  
  // Spawn orbs randomly during combat
  useEffect(() => {
    if (gamePhase === 'combat' && combatPhase === 'planning') {
      // 30% chance to spawn an orb each turn
      if (Math.random() < 0.3) {
        setTimeout(() => {
          spawnOrb();
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
      }
    }
  }, [gamePhase, combatPhase, turnNumber, spawnOrb]);
  
  if (gamePhase !== 'combat') {
    return null;
  }
  
  // Get battle background based on current boss with boss zones
  const getBattleBackground = () => {
    if (!currentBoss) return 'bg-gradient-to-b from-gray-900 to-gray-800';
    
    // Glitchy map switching for final phase bosses
    if (glitchEffect && (currentBoss.id === 'final_boss' || currentBoss.id === 'god_of_death')) {
      const glitchBgs = [
        'bg-gradient-to-br from-red-900 via-black to-purple-900',
        'bg-gradient-to-bl from-purple-900 via-red-800 to-black',
        'bg-gradient-to-tr from-black via-red-700 to-gray-900',
        'bg-gradient-to-tl from-gray-900 via-purple-800 to-red-900',
        'bg-gradient-to-b from-red-800 via-black to-purple-800',
        'bg-gradient-to-t from-purple-900 via-red-900 to-black'
      ];
      return glitchBgs[mapSwitchIndex];
    }
    
    // Enhanced boss zone backgrounds
    switch (currentBoss.id) {
      case 'god_of_war':
        return currentBoss.phase >= 3 
          ? 'bg-gradient-radial from-red-800 via-red-900 to-black'
          : 'bg-gradient-to-b from-red-900 via-red-800 to-black';
      case 'god_of_wisdom':
        return currentBoss.phase >= 3
          ? 'bg-gradient-radial from-blue-700 via-blue-900 to-black'
          : 'bg-gradient-to-b from-blue-900 via-blue-800 to-black';
      case 'god_of_nature':
        return currentBoss.phase >= 3
          ? 'bg-gradient-radial from-green-700 via-green-900 to-black'
          : 'bg-gradient-to-b from-green-900 via-green-800 to-black';
      case 'god_of_storms':
        return currentBoss.phase >= 3
          ? 'bg-gradient-radial from-purple-600 via-purple-900 to-black'
          : 'bg-gradient-to-b from-purple-900 via-purple-800 to-black';
      case 'god_of_death':
        return currentBoss.phase >= 3
          ? 'bg-gradient-radial from-gray-700 via-black to-red-900'
          : 'bg-gradient-to-b from-gray-900 via-gray-800 to-black';
      case 'final_boss':
        return currentBoss.phase >= 3
          ? 'bg-gradient-radial from-red-700 via-black to-purple-900'
          : 'bg-gradient-to-b from-red-900 via-black to-red-900';
      default:
        return 'bg-gradient-to-b from-gray-900 to-gray-800';
    }
  };
  
  // Get atmospheric effects with enhanced boss zones
  const getAtmosphericEffects = () => {
    if (!currentBoss) return null;
    
    const effects = [];
    
    // Glitch effects for final phase
    if (glitchEffect) {
      effects.push(
        <div key="glitch-overlay" className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 bg-red-500/20 animate-pulse"
            style={{ 
              animationDuration: '0.1s',
              filter: `hue-rotate(${animationFrame * 10}deg)` 
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${animationFrame * 2}deg, transparent 40%, rgba(255,0,0,0.1) 50%, transparent 60%)`,
              animation: 'glitchScan 0.3s infinite'
            }}
          />
          {/* Glitch bars */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`glitch-${i}`}
              className="absolute bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${10 + Math.random() * 20}%`,
                height: '2px',
                animation: `glitchFlicker ${0.1 + Math.random() * 0.2}s infinite`
              }}
            />
          ))}
        </div>
      );
    }
    
    // Boss defeat shatter effect
    if (bossShatterEffect) {
      effects.push(
        <div key="shatter" className="absolute inset-0 pointer-events-none">
          {/* Shatter overlay */}
          <div className="absolute inset-0 bg-white/50 animate-pulse" />
          {/* Shatter pieces */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * 360;
            const distance = 50 + Math.random() * 100;
            return (
              <div
                key={`shatter-${i}`}
                className="absolute w-4 h-4 bg-gradient-to-br from-white via-gray-300 to-gray-600 opacity-80"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%)`,
                  animation: `shatterExplode 3s ease-out forwards ${i * 0.05}s`,
                  '--angle': `${angle}deg`,
                  '--distance': `${distance}px`
                } as any}
              />
            );
          })}
        </div>
      );
    }
    
    // Enhanced floating particles based on boss type
    const particleCount = currentBoss.phase >= 3 ? 20 : 10;
    for (let i = 0; i < particleCount; i++) {
      let particleClass = 'bg-white';
      switch (currentBoss.id) {
        case 'god_of_war':
          particleClass = 'bg-red-400';
          break;
        case 'god_of_storms':
          particleClass = 'bg-blue-400';
          break;
        case 'god_of_nature':
          particleClass = 'bg-green-400';
          break;
        case 'god_of_death':
        case 'final_boss':
          particleClass = 'bg-purple-400';
          break;
      }
      
      effects.push(
        <div
          key={`particle-${i}`}
          className={`absolute w-1 h-1 ${particleClass} rounded-full opacity-40 animate-pulse`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`
          }}
        />
      );
    }
    
    // Boss-specific zone effects
    switch (currentBoss.id) {
      case 'god_of_war':
        // Battlefield with flame effects
        effects.push(
          <div key="war-zone" className="absolute inset-0">
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-600/30 to-transparent animate-pulse" />
            {/* Weapon silhouettes */}
            <div className="absolute bottom-16 left-12 w-2 h-16 bg-gray-700/60 transform rotate-12" />
            <div className="absolute bottom-20 right-20 w-8 h-8 bg-gray-700/60 rounded-full" />
            <div className="absolute bottom-18 left-1/3 w-1 h-12 bg-gray-700/60 transform -rotate-45" />
          </div>
        );
        break;
      case 'god_of_storms':
        // Storm realm with lightning
        effects.push(
          <div key="storm-zone" className="absolute inset-0">
            <div className="absolute inset-0 bg-blue-500/10 animate-pulse" style={{ animationDuration: '0.5s' }} />
            <div className="absolute top-4 left-8 w-16 h-8 bg-gray-700/60 rounded-full animate-pulse" />
            <div className="absolute top-8 right-16 w-20 h-6 bg-gray-700/60 rounded-full animate-pulse" />
            {/* Lightning flashes */}
            {Math.random() > 0.7 && (
              <div className="absolute inset-0 bg-white/30 animate-ping" style={{ animationDuration: '0.2s' }} />
            )}
          </div>
        );
        break;
      case 'god_of_nature':
        // Forest grove
        effects.push(
          <div key="nature-zone" className="absolute inset-0">
            <div className="absolute bottom-16 left-4 w-8 h-20 bg-green-900/70 rounded-t-full" />
            <div className="absolute bottom-16 right-12 w-6 h-16 bg-green-900/70 rounded-t-full" />
            <div className="absolute bottom-16 left-1/3 w-10 h-24 bg-green-900/70 rounded-t-full" />
            <div className="absolute bottom-16 right-1/3 w-7 h-18 bg-green-900/70 rounded-t-full" />
            {/* Floating leaves */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`leaf-${i}`}
                className="absolute w-2 h-2 bg-green-500/60 rounded-full"
                style={{
                  left: `${20 + Math.sin(animationFrame * 0.1 + i) * 60}%`,
                  top: `${30 + Math.cos(animationFrame * 0.1 + i) * 40}%`,
                  animation: 'float 3s ease-in-out infinite'
                }}
              />
            ))}
          </div>
        );
        break;
      case 'god_of_death':
      case 'final_boss':
        // Void realm with dark energy
        effects.push(
          <div key="death-zone" className="absolute inset-0">
            <div className="absolute inset-0 bg-black/40 animate-pulse" style={{ animationDuration: '2s' }} />
            {/* Dark energy tendrils */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`tendril-${i}`}
                className="absolute w-1 h-32 bg-gradient-to-t from-purple-600 via-black to-transparent opacity-60"
                style={{
                  left: `${10 + i * 15}%`,
                  top: '50%',
                  transformOrigin: 'bottom',
                  transform: `rotate(${Math.sin(animationFrame * 0.1 + i) * 30}deg)`,
                  animation: 'darkPulse 2s ease-in-out infinite'
                }}
              />
            ))}
          </div>
        );
        break;
    }
    
    return effects;
  };
  
  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${getBattleBackground()}`}
      style={{
        imageRendering: 'pixelated',
        filter: 'contrast(1.1) saturate(1.2)',
      }}
    >
      {/* Pixelated grid overlay for retro effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '8px 8px',
          imageRendering: 'pixelated'
        }}
      />
      
      {/* Atmospheric effects */}
      {getAtmosphericEffects()}
      
      {/* Battle arena ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-800/80 to-transparent" />
      
      {/* Characters positioned on the left side */}
      <div className="absolute left-8 bottom-20 flex flex-col space-y-4">
        {selectedTeam.map((character, index) => (
          <Character
            key={character.id}
            character={{
              ...character,
              position: [0, index * 60] // 2D positioning
            }}
          />
        ))}
      </div>
      
      {/* Boss positioned on the right side */}
      {currentBoss && (
        <Boss boss={currentBoss} />
      )}
      
      {/* Collectible orbs */}
      {orbs.map((orb) => (
        <Orb key={orb.id} orb={orb} />
      ))}
      
      {/* Battle phase indicator - pixelated */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div 
          className="bg-black/80 text-white px-6 py-2 border border-gray-600"
          style={{
            imageRendering: 'pixelated',
            borderRadius: '0px',
            fontFamily: 'monospace',
            textShadow: '2px 2px 0px #000000'
          }}
        >
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">
              {combatPhase === 'planning' && 'PLANNING PHASE'}
              {combatPhase === 'battle' && 'BATTLE PHASE'}
              {combatPhase === 'resolution' && 'RESOLUTION PHASE'}
              {combatPhase === 'enemy_turn' && 'ENEMY TURN'}
            </div>
            {currentBoss && (
              <div className="text-sm text-gray-300">
                VS {currentBoss.name.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Environmental details based on boss */}
      {currentBoss && (
        <div className="absolute inset-0 pointer-events-none">
          {currentBoss.id === 'god_of_nature' && (
            <>
              {/* Trees/forest silhouettes */}
              <div className="absolute bottom-16 left-4 w-8 h-20 bg-green-900/60 rounded-t-full" />
              <div className="absolute bottom-16 right-12 w-6 h-16 bg-green-900/60 rounded-t-full" />
              <div className="absolute bottom-16 left-1/3 w-10 h-24 bg-green-900/60 rounded-t-full" />
            </>
          )}
          
          {currentBoss.id === 'god_of_storms' && (
            <>
              {/* Storm clouds */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-800/60 to-transparent" />
              <div className="absolute top-4 left-8 w-16 h-8 bg-gray-700/40 rounded-full" />
              <div className="absolute top-6 right-16 w-20 h-6 bg-gray-700/40 rounded-full" />
            </>
          )}
        </div>
      )}
      
      {/* Custom CSS animations for special effects */}
      <style>{`
        @keyframes glitchScan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes glitchFlicker {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        @keyframes shatterExplode {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + cos(var(--angle)) * var(--distance)),
              calc(-50% + sin(var(--angle)) * var(--distance))
            ) rotate(360deg) scale(0);
            opacity: 0;
          }
        }
        
        @keyframes darkPulse {
          0%, 100% { 
            opacity: 0.3; 
            transform: rotate(0deg) scaleY(1);
          }
          50% { 
            opacity: 0.8; 
            transform: rotate(5deg) scaleY(1.2);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}