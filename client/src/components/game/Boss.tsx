import { useEffect, useState, useRef } from 'react';
import { Boss as BossType } from '../../types/game';
import { useCombat } from '../../lib/stores/useCombat';

interface BossProps {
  boss: BossType;
}

export function Boss({ boss }: BossProps) {
  const { gamePhase, lastBattleResult, isProcessing } = useCombat();
  const [animationFrame, setAnimationFrame] = useState(0);
  const [attackEffect, setAttackEffect] = useState<string | null>(null);
  const [isGlowing, setIsGlowing] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<{value: number, id: number} | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [darkAura, setDarkAura] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Simple animation using React state
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // Listen for battle results and trigger appropriate animations
  useEffect(() => {
    if (lastBattleResult) {
      if (lastBattleResult.winner === 'boss') {
        // Boss wins - enhanced attack animation based on boss type
        const skill = lastBattleResult.bossSkill;
        setIsCharging(true);
        
        setTimeout(() => {
          setIsCharging(false);
          
          // Different effects based on boss and skill type
          if (boss.id === 'god_of_storms' || skill.elementType === 'air') {
            setAttackEffect('🌪️💨⚡🌟');
          } else if (boss.id === 'god_of_death' || skill.elementType === 'dark') {
            setDarkAura(true);
            setAttackEffect('🌑⚰️💀🔥💥');
            setTimeout(() => setDarkAura(false), 1500);
          } else {
            setAttackEffect('🔥💥⚔️🌟');
          }
          
          setIsGlowing(true);
        }, 600);
        
        setTimeout(() => {
          setAttackEffect(null);
          setIsGlowing(false);
        }, 3000);
      } else {
        // Boss takes damage - enhanced damage animation
        setAttackEffect('💢💥🔥💫');
        setDamageNumbers({value: lastBattleResult.damage, id: Date.now()});
        setTimeout(() => setAttackEffect(null), 1500);
        setTimeout(() => setDamageNumbers(null), 2500);
      }
    }
  }, [lastBattleResult, boss.id]);
  
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
  
  // Floating animation with charging effect
  const floatOffset = Math.sin(animationFrame * 0.1) * 4 + (isCharging ? Math.sin(animationFrame * 0.4) * 2 : 0);
  const chargePulse = isCharging ? Math.sin(animationFrame * 0.5) * 0.5 + 0.5 : 0;
  
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
      ref={containerRef}
      className={`absolute flex flex-col items-center transition-all duration-300 ${
        isGlowing ? 'drop-shadow-2xl' : ''
      }`}
      style={{
        left: '50%',
        top: '30%',
        transform: `translate(-50%, -50%) scale(${scaleFactor})`,
        transition: 'transform 0.3s ease-in-out',
        filter: isGlowing ? 'brightness(1.3) saturate(1.5) drop-shadow(0 0 20px rgba(255, 0, 0, 0.8))' : 'none'
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
        
        {/* Charging aura effect */}
        {isCharging && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle, rgba(255,0,0,${chargePulse * 0.6}) 0%, transparent 70%)`,
              animation: 'pulse 0.3s ease-in-out infinite',
              zIndex: 5,
              transform: 'scale(1.5)'
            }}
          />
        )}
        
        
        
        {/* Dark aura effect */}
        {darkAura && (
          <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 12 }}>
            <div 
              className="absolute inset-0 bg-gradient-radial from-purple-900/60 via-black/40 to-transparent animate-pulse"
              style={{
                transform: 'scale(2)',
                borderRadius: '50%',
                animation: 'darkPulse 1.5s ease-in-out'
              }}
            />
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * 360;
              return (
                <div
                  key={i}
                  className="absolute w-2 h-16 bg-gradient-to-t from-purple-600 via-black to-transparent animate-pulse"
                  style={{
                    left: '50%',
                    top: '50%',
                    transformOrigin: '50% 100%',
                    transform: `translate(-50%, -100%) rotate(${angle}deg) scale(2)`,
                    animationDelay: `${i * 0.1}s`,
                    boxShadow: '0 0 10px rgba(147,51,234,0.8)'
                  }}
                />
              );
            })}
          </div>
        )}
        
        {/* Boss main body - 64-bit style */}
        <div 
          className={`w-32 h-40 bg-gradient-to-b ${getBossColor()} border-4 border-yellow-400 relative`}
          style={{
            imageRendering: 'pixelated',
            filter: 'contrast(1.2) saturate(1.3)',
          }}
        >
          {/* Pixelated boss design */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-10 gap-0">
            {/* Create pixelated pattern */}
            {Array.from({ length: 80 }).map((_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              let bgColor = 'transparent';
              
              // Boss outline pattern
              if (row === 0 || row === 9 || col === 0 || col === 7) {
                bgColor = 'bg-yellow-600';
              } else if ((row === 2 || row === 3) && (col === 2 || col === 5)) {
                // Eyes
                bgColor = 'bg-red-500';
              } else if (row === 4 && col >= 2 && col <= 5) {
                // Mouth
                bgColor = 'bg-black';
              } else if (row >= 1 && row <= 8) {
                // Body fill based on boss type
                bgColor = boss.phase >= 3 ? 'bg-red-900' : boss.phase >= 2 ? 'bg-red-700' : 'bg-purple-600';
              }
              
              return (
                <div
                  key={i}
                  className={`w-full h-full ${bgColor} ${boss.phase >= 2 ? 'animate-pulse' : ''}`}
                  style={{ imageRendering: 'pixelated' }}
                />
              );
            })}
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
        
        {/* Boss name plate - pixelated */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div 
            className="bg-black/80 text-white px-4 py-1 border border-red-500"
            style={{
              imageRendering: 'pixelated',
              borderRadius: '0px',
              fontFamily: 'monospace',
              textShadow: '1px 1px 0px #000000'
            }}
          >
            <div className="text-sm font-bold text-red-400">{boss.name.toUpperCase()}</div>
            <div className="text-xs text-gray-300">{boss.title.toUpperCase()}</div>
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
      
      {/* Boss attack effects */}
      {attackEffect && (
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="text-4xl animate-pulse">
            {attackEffect.split('').map((emoji, i) => (
              <span 
                key={i}
                className="inline-block animate-bounce"
                style={{
                  animationDelay: `${i * 150}ms`,
                  animationDuration: '1.2s',
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 0, 0.8))'
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Boss damage numbers */}
      {damageNumbers && (
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-30">
          <div 
            className="text-orange-400 font-bold text-2xl animate-bounce"
            style={{
              textShadow: '3px 3px 6px rgba(0,0,0,0.9)',
              animation: 'bossDamageFloat 2s ease-out forwards'
            }}
          >
            -{damageNumbers.value}
          </div>
        </div>
      )}
      
      {/* Combat state indicators */}
      {gamePhase === 'combat' && !attackEffect && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-yellow-400 text-sm animate-pulse">
            ⚔️ In Combat
          </div>
        </div>
      )}
      
      {/* Add custom CSS for boss animations */}
      <style>{`
        @keyframes bossDamageFloat {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-30px) scale(1.3); opacity: 1; }
          100% { transform: translateY(-60px) scale(0.9); opacity: 0; }
        }
        
        @keyframes lightningStrike {
          0% { 
            height: 0px; 
            opacity: 1;
            box-shadow: 0 0 15px rgba(255,255,0,0.9);
          }
          50% { 
            height: 200px; 
            opacity: 1;
            box-shadow: 0 0 25px rgba(255,255,0,1);
          }
          100% { 
            height: 200px; 
            opacity: 0;
            box-shadow: 0 0 5px rgba(255,255,0,0.3);
          }
        }
        
        @keyframes darkPulse {
          0% { 
            transform: scale(1); 
            opacity: 0;
          }
          50% { 
            transform: scale(2.5); 
            opacity: 0.8;
          }
          100% { 
            transform: scale(3); 
            opacity: 0;
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
}