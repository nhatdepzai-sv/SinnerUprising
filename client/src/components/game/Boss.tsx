import { useEffect, useState } from 'react';
import { Boss as BossType } from '../../types/game';
import { useCombat } from '../../lib/stores/useCombat';

interface BossProps {
  boss: BossType;
}

export function Boss({ boss }: BossProps) {
  const { gamePhase } = useCombat();
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Simple animation using React state
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get boss appearance based on phase and health
  const getBossColor = () => {
    const healthPercentage = boss.currentHealth / boss.maxHealth;
    
    switch (boss.phase) {
      case 1:
        return healthPercentage > 0.5 ? 'from-purple-600 to-purple-800' : 'from-purple-500 to-purple-700';
      case 2:
        return healthPercentage > 0.3 ? 'from-red-600 to-red-800' : 'from-red-500 to-red-700';
      case 3:
        return 'from-red-900 to-black';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };
  
  // Scale based on phase
  const currentScale = boss.scale + (boss.phase - 1) * 0.3;
  const scaleFactor = Math.min(currentScale, 3.0); // Cap the scale
  
  // Floating animation
  const floatOffset = Math.sin(animationFrame * 0.1) * 4;
  
  // Phase transition effects
  const getPhaseEffects = () => {
    const effects = [];
    for (let i = 0; i < boss.phase; i++) {
      effects.push(
        <div
          key={i}
          className={`absolute rounded-full border-2 border-red-500 animate-pulse`}
          style={{
            width: `${100 + i * 20}%`,
            height: `${100 + i * 20}%`,
            top: `${-10 - i * 10}%`,
            left: `${-10 - i * 10}%`,
            opacity: 0.3 - i * 0.1,
          }}
        />
      );
    }
    return effects;
  };
  
  return (
    <div 
      className="absolute flex flex-col items-center"
      style={{
        left: '50%',
        top: '30%',
        transform: `translate(-50%, -50%) scale(${scaleFactor})`,
        transition: 'transform 0.3s ease-in-out'
      }}
    >
      {/* Boss sprite container */}
      <div 
        className="relative"
        style={{
          transform: `translateY(${floatOffset}px)`,
          transition: 'transform 0.1s ease-in-out'
        }}
      >
        {/* Phase effect rings */}
        {getPhaseEffects()}
        
        {/* Boss main body */}
        <div 
          className={`w-32 h-40 bg-gradient-to-b ${getBossColor()} border-4 border-yellow-400 shadow-2xl relative`}
          style={{
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 30%, 100% 70%, 80% 100%, 20% 100%, 0% 70%, 0% 30%)'
          }}
        >
          {/* Boss face/eyes */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
          
          {/* Power aura */}
          {boss.phase >= 2 && (
            <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse" 
                 style={{ clipPath: 'inherit' }} />
          )}
          
          {/* Ultimate phase effect */}
          {boss.phase >= 3 && (
            <div className="absolute inset-0 bg-black opacity-40 animate-pulse" 
                 style={{ clipPath: 'inherit' }} />
          )}
        </div>
        
        {/* Boss name plate */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-black/80 text-white px-4 py-1 rounded border border-red-500">
            <div className="text-sm font-bold text-red-400">{boss.name}</div>
            <div className="text-xs text-gray-300">{boss.title}</div>
          </div>
        </div>
        
        {/* Phase indicator */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-1">
            {Array.from({ length: boss.maxPhase }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full border ${
                  i < boss.phase 
                    ? 'bg-red-500 border-red-300' 
                    : 'bg-gray-600 border-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Combat state indicators */}
      {gamePhase === 'combat' && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-yellow-400 text-sm animate-pulse">
            ⚔️ In Combat
          </div>
        </div>
      )}
    </div>
  );
}