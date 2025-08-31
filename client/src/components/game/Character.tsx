import { useState, useEffect, useRef } from 'react';
import { Character as CharacterType } from '../../types/game';
import { useCombat } from '../../lib/stores/useCombat';

interface CharacterProps {
  character: CharacterType;
}

export function Character({ character }: CharacterProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [attackEffect, setAttackEffect] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<{value: number, id: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isProcessing, combatPhase, lastBattleResult } = useCombat();
  
  // Trigger animation when character takes action or during combat
  useEffect(() => {
    if (isProcessing || combatPhase === 'battle') {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, combatPhase]);
  
  // Listen for battle results and trigger appropriate animations
  useEffect(() => {
    if (lastBattleResult) {
      if (lastBattleResult.winner === 'character') {
        // Character wins - success animation
        setAttackEffect('✨⚡💫');
        setIsAnimating(true);
        setTimeout(() => {
          setAttackEffect(null);
          setIsAnimating(false);
        }, 2000);
      } else {
        // Character loses - damage animation
        setAttackEffect('💥🔥💢');
        setIsShaking(true);
        setDamageNumbers({value: lastBattleResult.damage, id: Date.now()});
        
        // Shake animation
        setTimeout(() => setIsShaking(false), 600);
        setTimeout(() => setAttackEffect(null), 1500);
        setTimeout(() => setDamageNumbers(null), 2000);
      }
    }
  }, [lastBattleResult]);
  
  // Get character color based on element affinity
  const getCharacterColor = () => {
    if (character.elementAffinities.includes('dark')) {
      return 'from-red-600 to-gray-900';
    } else if (character.elementAffinities.includes('light')) {
      return 'from-yellow-400 to-white';
    } else {
      return 'from-blue-500 to-blue-700';
    }
  };
  
  // Health percentage for visual effects
  const healthPercentage = character.currentHealth / character.maxHealth;
  
  return (
    <div 
      ref={containerRef}
      className={`relative transition-transform duration-200 ${
        isShaking ? 'animate-bounce' : ''
      }`}
      style={{
        transform: `translate(${character.position[0]}px, ${character.position[1]}px) ${
          isShaking ? 'scale(1.1)' : 'scale(1)'
        }`,
        animation: isShaking ? 'shake 0.6s ease-in-out' : 'none'
      }}
    >
      {/* Character sprite - 64-bit style */}
      <div 
        className={`w-12 h-16 border-2 border-gray-300 relative transition-all duration-300 ${
          isAnimating ? 'animate-pulse scale-110 animate-bounce' : ''
        }`}
        style={{
          imageRendering: 'pixelated',
          filter: 'contrast(1.2) saturate(1.3)',
          opacity: healthPercentage < 0.3 ? 0.7 : 1
        }}
      >
        {/* Pixelated character design */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-4 gap-0">
          {Array.from({ length: 12 }).map((_, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            let bgColor = 'transparent';
            
            // Character pixel pattern
            if (row === 0) {
              // Head
              bgColor = character.elementAffinities.includes('dark') ? 'bg-red-800' : 
                       character.elementAffinities.includes('light') ? 'bg-yellow-400' : 'bg-blue-500';
            } else if (row === 1 && col === 1) {
              // Face
              bgColor = 'bg-pink-200';
            } else if (row === 1 && (col === 0 || col === 2)) {
              // Eyes
              bgColor = 'bg-black';
            } else if (row >= 2) {
              // Body
              bgColor = character.elementAffinities.includes('dark') ? 'bg-gray-800' : 
                       character.elementAffinities.includes('light') ? 'bg-white' : 'bg-blue-600';
            }
            
            return (
              <div
                key={i}
                className={`w-full h-full ${bgColor}`}
                style={{ imageRendering: 'pixelated' }}
              />
            );
          })}
        </div>
        
        {/* Health indicator - pixelated */}
        <div 
          className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-800"
          style={{ imageRendering: 'pixelated' }}
        >
          <div 
            className={`h-full transition-all duration-300 ${
              healthPercentage > 0.5 ? 'bg-green-500' : 
              healthPercentage > 0.2 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ 
              width: `${healthPercentage * 100}%`,
              imageRendering: 'pixelated'
            }}
          />
        </div>
        
        {/* Corruption indicator for protagonist */}
        {character.id === 'protagonist' && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-red-500 rounded-full opacity-60" />
          </div>
        )}
      </div>
      
      {/* Character name - pixelated */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div 
          className="bg-black/60 text-white text-xs px-2 py-1 border border-gray-600"
          style={{
            imageRendering: 'pixelated',
            borderRadius: '0px',
            fontFamily: 'monospace',
            textShadow: '1px 1px 0px #000000'
          }}
        >
          {character.name.toUpperCase()}
        </div>
      </div>
      
      {/* Mana bar - pixelated */}
      <div 
        className="absolute -bottom-3 left-0 right-0 h-0.5 bg-blue-900"
        style={{ imageRendering: 'pixelated' }}
      >
        <div 
          className="h-full bg-blue-400 transition-all duration-300"
          style={{ 
            width: `${(character.currentMana / character.maxMana) * 100}%`,
            imageRendering: 'pixelated'
          }}
        />
      </div>
      
      {/* Attack effects */}
      {attackEffect && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="text-2xl animate-bounce">
            {attackEffect.split('').map((emoji, i) => (
              <span 
                key={i}
                className="inline-block animate-pulse"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '0.8s'
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Damage numbers */}
      {damageNumbers && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-30">
          <div 
            className="text-red-400 font-bold text-lg animate-bounce"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              animation: 'damageFloat 2s ease-out forwards'
            }}
          >
            -{damageNumbers.value}
          </div>
        </div>
      )}
      
      {/* Action indicator */}
      {isAnimating && !attackEffect && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="text-yellow-400 text-xs animate-ping">⚔️</div>
        </div>
      )}
      {/* Add custom CSS animations via style attribute */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px) rotate(-2deg); }
          75% { transform: translateX(4px) rotate(2deg); }
        }
        
        @keyframes damageFloat {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-40px) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}