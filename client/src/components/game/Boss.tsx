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
  const [weaponAttack, setWeaponAttack] = useState<'sword' | 'spear' | 'magic' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Debug logging for boss rendering
  console.log('Boss rendering:', boss.id, boss.name);
  
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
        // Boss wins - enhanced attack animation with weapon variations
        const skill = lastBattleResult.bossSkill;
        setIsCharging(true);
        
        // Determine weapon attack type based on boss and skill
        let attackType: 'sword' | 'spear' | 'magic' = 'sword';
        if (boss.id === 'god_of_war' || skill.damageType === 'slash') {
          attackType = Math.random() > 0.5 ? 'sword' : 'spear';
        } else if (skill.elementType === 'dark' || skill.elementType === 'light') {
          attackType = 'magic';
        } else {
          attackType = 'sword';
        }
        
        setTimeout(() => {
          setIsCharging(false);
          setWeaponAttack(attackType);
          
          // Different effects based on boss and skill type
          if (boss.id === 'god_of_storms' || skill.elementType === 'air') {
            setIsGlowing(true);
          } else if (boss.id === 'god_of_death' || skill.elementType === 'dark') {
            setDarkAura(true);
            setTimeout(() => setDarkAura(false), 1500);
          } else {
            setIsGlowing(true);
          }
        }, 600);
        
        // Clear weapon attack animation
        setTimeout(() => {
          setWeaponAttack(null);
          setIsGlowing(false);
        }, 2000);
      } else {
        // Boss takes damage
        setDamageNumbers({value: lastBattleResult.damage, id: Date.now()});
        setTimeout(() => setDamageNumbers(null), 2500);
      }
    }
  }, [lastBattleResult, boss.id]);
  
  // Enhanced boss appearance based on phase and health
  const getBossColor = () => {
    const healthPercentage = boss.currentHealth / boss.maxHealth;
    
    switch (boss.phase) {
      case 1:
        return healthPercentage > 0.5 ? 'from-purple-600 to-purple-800' : 'from-purple-500 to-purple-700';
      case 2:
        return healthPercentage > 0.3 ? 'from-red-600 via-orange-500 to-red-800' : 'from-red-500 via-yellow-400 to-red-700';
      case 3:
        return 'from-red-900 via-black to-purple-900';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };
  
  // Get boss size modifications based on phase
  const getBossPhaseModifications = () => {
    switch (boss.phase) {
      case 1:
        return { spikes: false, aura: false, extraSize: 0 };
      case 2:
        return { spikes: true, aura: true, extraSize: 0.2 };
      case 3:
        return { spikes: true, aura: true, extraSize: 0.5 };
      default:
        return { spikes: false, aura: false, extraSize: 0 };
    }
  };
  
  const phaseModifications = getBossPhaseModifications();
  
  // Scale based on phase
  const currentScale = boss.scale + (boss.phase - 1) * 0.3;
  const scaleFactor = Math.min(currentScale, 3.0);
  
  // Floating animation with charging effect
  const floatOffset = Math.sin(animationFrame * 0.1) * 4 + (isCharging ? Math.sin(animationFrame * 0.4) * 2 : 0);
  const chargePulse = isCharging ? Math.sin(animationFrame * 0.5) * 0.5 + 0.5 : 0;
  
  // Weapon attack animations
  const getWeaponTransform = () => {
    if (!weaponAttack) return '';
    
    const attackProgress = Math.sin(animationFrame * 0.3) * 0.5 + 0.5;
    
    switch (weaponAttack) {
      case 'sword':
        return `translateX(${attackProgress * 20}px) rotate(${attackProgress * 45}deg)`;
      case 'spear':
        return `translateX(${attackProgress * 30}px) translateY(${-attackProgress * 10}px)`;
      case 'magic':
        return `scale(${1 + attackProgress * 0.3}) rotate(${attackProgress * 10}deg)`;
      default:
        return '';
    }
  };
  
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
        
        {/* 64-bit Pixelated Warrior Boss Design */}
        {(boss.id === 'god_of_death' || boss.id === 'final_boss') ? (
          /* Death God/Final Boss - Dark Armored Knight */
          <div className="relative w-48 h-64" style={{ imageRendering: 'pixelated' }}>
            
            {/* Knight Body */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-48 bg-gradient-to-b from-gray-800 to-black border-4 border-red-500">
              
              {/* Helmet */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-gradient-to-b from-gray-700 to-gray-900 border-2 border-red-400">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-t from-red-600 to-red-800" />
                <div className="absolute top-6 left-3 w-2 h-1 bg-red-400 animate-pulse" />
                <div className="absolute top-6 right-3 w-2 h-1 bg-red-400 animate-pulse" />
                <div className="absolute bottom-2 left-2 right-2 h-4 bg-gray-600 border border-red-400" />
              </div>
              
              {/* Chest Armor */}
              <div className="absolute top-4 left-2 right-2 h-16 bg-gradient-to-b from-gray-600 to-gray-800 border border-red-400">
                <div className="absolute inset-2 border border-red-300 opacity-60" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 border border-red-300" />
              </div>
              
              {/* Arms */}
              <div className="absolute top-8 -left-6 w-8 h-20 bg-gradient-to-b from-gray-700 to-gray-900 border border-red-400" />
              <div className="absolute top-8 -right-6 w-8 h-20 bg-gradient-to-b from-gray-700 to-gray-900 border border-red-400" />
              
              {/* Dark Blade - Animated */}
              <div 
                className="absolute top-2 -left-12 w-3 h-32 bg-gradient-to-b from-red-600 to-black border border-red-500 transform rotate-12"
                style={{ 
                  transform: `rotate(12deg) ${getWeaponTransform()}`,
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <div className="absolute -top-2 left-0 right-0 h-4 bg-red-400" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                <div className="absolute top-4 -left-2 -right-2 h-2 bg-gray-700 border border-red-400" />
              </div>
              
              {/* Shield */}
              <div className="absolute top-6 -right-10 w-8 h-12 bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-red-400">
                <div className="absolute inset-1 border border-red-300 opacity-80" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500" />
              </div>
              
              {/* Legs */}
              <div className="absolute bottom-0 left-1 right-1 h-16 bg-gradient-to-b from-gray-800 to-black border-t border-red-400">
                <div className="absolute bottom-0 left-2 w-6 h-14 bg-gray-700 border border-red-400" />
                <div className="absolute bottom-0 right-2 w-6 h-14 bg-gray-700 border border-red-400" />
              </div>
              
              {/* Cape */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 translate-x-4 w-12 h-24 bg-gradient-to-b from-red-800 to-red-900 border border-red-600 opacity-80 transform rotate-3" />
            </div>

            {/* Dark Aura */}
            <div className="absolute -inset-4 bg-gradient-radial from-red-500 via-transparent to-transparent opacity-20 animate-pulse" />
          </div>
        ) : (boss.id === 'god_of_war' || boss.name === 'Ares') ? (
          /* God of War - Golden Armored Warrior */
          <div className="relative w-48 h-64" style={{ imageRendering: 'pixelated' }}>
            
            {/* Warrior Body */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-48 bg-gradient-to-b from-red-800 to-red-900 border-4 border-yellow-500">
              
              {/* Spartan Helmet */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-gradient-to-b from-red-600 to-red-800 border-2 border-yellow-400">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gradient-to-r from-yellow-400 to-red-500 rounded-t-full border-2 border-yellow-300" />
                <div className="absolute top-6 left-3 w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-500" />
                <div className="absolute top-6 right-3 w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-500" />
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-yellow-400 rounded" />
              </div>

              {/* Chest Armor */}
              <div className="absolute top-4 left-2 right-2 h-16 bg-gradient-to-b from-red-700 to-red-900 border border-yellow-400">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-yellow-400 rotate-45" />
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rotate-45" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="absolute h-1 bg-yellow-400 opacity-70" style={{ top: `${50 + i * 6}px`, left: '8px', right: '8px' }} />
                ))}
              </div>

              {/* Arms/Shoulders */}
              <div className="absolute top-8 -left-6 w-8 h-20 bg-gradient-to-b from-red-700 to-red-900 border border-yellow-400" />
              <div className="absolute top-8 -right-6 w-8 h-20 bg-gradient-to-b from-red-700 to-red-900 border border-yellow-400" />

              {/* War Spear - Animated */}
              <div 
                className="absolute top-2 -left-10 w-2 h-28 bg-gradient-to-b from-yellow-400 to-red-600 rounded transform -rotate-12"
                style={{ 
                  transform: `rotate(-12deg) ${getWeaponTransform()}`,
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-yellow-300 border border-yellow-500" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
              </div>
              
              {/* Shield */}
              <div className="absolute top-6 -right-10 w-10 h-14 bg-gradient-to-b from-red-600 to-red-800 rounded border-2 border-yellow-400">
                <div className="absolute inset-1 border border-yellow-300 rounded opacity-80" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full" />
              </div>

              {/* Legs */}
              <div className="absolute bottom-0 left-1 right-1 h-16 bg-gradient-to-b from-red-800 to-black border-t border-yellow-400">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="absolute w-4 h-12 bg-red-700 border border-yellow-400 rounded-b" style={{ bottom: '0px', left: `${8 + i * 8}px` }} />
                ))}
              </div>

              {/* War Cape */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 translate-x-4 w-12 h-24 bg-gradient-to-b from-yellow-600 to-red-800 border border-yellow-500 opacity-90 transform rotate-3" />
            </div>

            {/* War Aura */}
            <div className="absolute -inset-4 bg-gradient-radial from-red-600 via-transparent to-transparent opacity-30 rounded-full animate-pulse" />
          </div>
        ) : (
          /* Generic Boss - Mysterious Cloaked Figure */
          <div className="relative w-48 h-64" style={{ imageRendering: 'pixelated' }}>
            
            {/* Cloaked Figure */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-48 bg-gradient-to-b from-purple-800 to-black border-4 border-purple-500">
              
              {/* Hood */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-gradient-to-b from-purple-700 to-purple-900 border-2 border-purple-400" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
                <div className="absolute top-8 left-6 w-1 h-1 bg-purple-300 rounded-full animate-pulse" />
                <div className="absolute top-8 right-6 w-1 h-1 bg-purple-300 rounded-full animate-pulse" />
              </div>
              
              {/* Robes */}
              <div className="absolute top-6 left-1 right-1 h-20 bg-gradient-to-b from-purple-700 to-purple-900 border border-purple-400">
                <div className="absolute inset-2 border border-purple-300 opacity-40" />
              </div>
              
              {/* Arms */}
              <div className="absolute top-12 -left-4 w-6 h-16 bg-gradient-to-b from-purple-700 to-purple-900 border border-purple-400" />
              <div className="absolute top-12 -right-4 w-6 h-16 bg-gradient-to-b from-purple-700 to-purple-900 border border-purple-400" />
              
              {/* Magic Staff - Animated */}
              <div 
                className="absolute top-6 -left-8 w-2 h-24 bg-gradient-to-b from-purple-400 to-purple-800 border border-purple-300"
                style={{ 
                  transform: `${getWeaponTransform()}`,
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-300 rounded-full animate-pulse">
                  <div className="absolute inset-1 bg-white rounded-full animate-ping opacity-60" />
                </div>
              </div>
              
              {/* Lower Robes */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-purple-800 to-black border-t border-purple-400" />
            </div>

            {/* Mystical Aura */}
            <div className="absolute -inset-4 bg-gradient-radial from-purple-500 via-transparent to-transparent opacity-20 animate-pulse" />
          </div>
        )}
        
        {/* Weapon Attack Effect Overlays */}
        {weaponAttack === 'magic' && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                style={{
                  left: `${20 + Math.sin(i * Math.PI / 4 + animationFrame * 0.1) * 30}%`,
                  top: `${40 + Math.cos(i * Math.PI / 4 + animationFrame * 0.1) * 20}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
        
        {weaponAttack === 'sword' && (
          <div className="absolute -top-4 -right-4 w-8 h-2 bg-yellow-400 opacity-80 animate-pulse transform rotate-45" />
        )}
        
        {weaponAttack === 'spear' && (
          <div className="absolute -top-2 -left-8 w-12 h-1 bg-red-400 opacity-80 animate-pulse" />
        )}
      </div>
      
      {/* Damage Numbers */}
      {damageNumbers && (
        <div 
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-red-400 animate-bounce pointer-events-none"
          key={damageNumbers.id}
          style={{
            animation: 'damageFloat 2.5s ease-out forwards',
            fontFamily: 'monospace',
            textShadow: '2px 2px 0px #000000'
          }}
        >
          -{damageNumbers.value}
        </div>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes damageFloat {
          0% { 
            transform: translateX(-50%) translateY(0px); 
            opacity: 1; 
          }
          100% { 
            transform: translateX(-50%) translateY(-60px); 
            opacity: 0; 
          }
        }
        
        @keyframes darkPulse {
          0%, 100% { 
            transform: scale(2) rotate(0deg); 
            opacity: 0.6; 
          }
          50% { 
            transform: scale(2.5) rotate(180deg); 
            opacity: 0.3; 
          }
        }
      `}</style>
    </div>
  );
}