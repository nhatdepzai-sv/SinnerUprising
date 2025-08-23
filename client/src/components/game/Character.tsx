import { useState, useEffect } from 'react';
import { Character as CharacterType } from '../../types/game';

interface CharacterProps {
  character: CharacterType;
}

export function Character({ character }: CharacterProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Trigger animation when character takes action
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
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
      className="relative"
      style={{
        transform: `translate(${character.position[0]}px, ${character.position[1]}px)`
      }}
    >
      {/* Character sprite - 64-bit style */}
      <div 
        className={`w-12 h-16 border-2 border-gray-300 relative ${
          isAnimating ? 'animate-bounce' : ''
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
      
      {/* Action indicator */}
      {isAnimating && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="text-yellow-400 text-xs animate-ping">⚔️</div>
        </div>
      )}
    </div>
  );
}