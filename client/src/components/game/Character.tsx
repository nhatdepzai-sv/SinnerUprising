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
      {/* Character sprite */}
      <div 
        className={`w-12 h-16 bg-gradient-to-b ${getCharacterColor()} border-2 border-gray-300 shadow-lg relative ${
          isAnimating ? 'animate-bounce' : ''
        }`}
        style={{
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)',
          opacity: healthPercentage < 0.3 ? 0.7 : 1
        }}
      >
        {/* Character face */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className="w-1 h-1 bg-black rounded-full" />
          <div className="w-1 h-1 bg-black rounded-full" />
        </div>
        
        {/* Health indicator */}
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-800">
          <div 
            className={`h-full transition-all duration-300 ${
              healthPercentage > 0.5 ? 'bg-green-500' : 
              healthPercentage > 0.2 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${healthPercentage * 100}%` }}
          />
        </div>
        
        {/* Corruption indicator for protagonist */}
        {character.id === 'protagonist' && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-red-500 rounded-full opacity-60" />
          </div>
        )}
      </div>
      
      {/* Character name */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">
          {character.name}
        </div>
      </div>
      
      {/* Mana bar */}
      <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-blue-900">
        <div 
          className="h-full bg-blue-400 transition-all duration-300"
          style={{ width: `${(character.currentMana / character.maxMana) * 100}%` }}
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