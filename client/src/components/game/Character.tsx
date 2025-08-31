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
  const [isCharging, setIsCharging] = useState(false);
  const [slashEffect, setSlashEffect] = useState(false);
  const [magicBurst, setMagicBurst] = useState(false);
  const [shieldEffect, setShieldEffect] = useState(false);
  const [healEffect, setHealEffect] = useState(false);
  const [weaponSlash, setWeaponSlash] = useState(false);
  const [bluntAttack, setBluntAttack] = useState(false);
  const [bloodEffect, setBloodEffect] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isProcessing, combatPhase, lastBattleResult } = useCombat();
  
  // Animation loop for continuous effects
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Trigger attack sequence when character takes action or during combat
  useEffect(() => {
    if (isProcessing || combatPhase === 'battle') {
      // Start charging animation
      setIsCharging(true);
      setIsAnimating(true);
      
      // After charging, trigger attack effects
      setTimeout(() => {
        setIsCharging(false);
        if (lastBattleResult?.characterSkill) {
          const skill = lastBattleResult.characterSkill;
          const damage = lastBattleResult.damage;
          const normalDamage = skill.basePower * 1.5; // Estimate normal damage
          const isHighDamage = damage > normalDamage / 3;
          
          // Check for skill effects first
          const hasHealEffect = skill.effects?.some(effect => effect.type === 'heal');
          const hasShieldEffect = skill.name.toLowerCase().includes('protection') || 
                               skill.name.toLowerCase().includes('shield') || 
                               skill.name.toLowerCase().includes('aegis');
          
          // Determine weapon type from equipped weapon or skill type
          const equippedWeapon = character.equippedWeapon;
          let weaponType = skill.damageType;
          
          // Override with weapon's primary damage type if equipped
          if (equippedWeapon && equippedWeapon.skills.length > 0) {
            weaponType = equippedWeapon.skills[0].damageType;
          }
          
          if (hasHealEffect) {
            setHealEffect(true);
            setTimeout(() => setHealEffect(false), 1500);
          } else if (hasShieldEffect) {
            setShieldEffect(true);
            setTimeout(() => setShieldEffect(false), 1200);
          } else if (weaponType === 'slash') {
            setWeaponSlash(true);
            setTimeout(() => setWeaponSlash(false), 800);
            if (isHighDamage) {
              setTimeout(() => {
                setBloodEffect(true);
                setTimeout(() => setBloodEffect(false), 1200);
              }, 400);
            }
          } else if (weaponType === 'pierce') {
            setSlashEffect(true);
            setTimeout(() => setSlashEffect(false), 800);
            if (isHighDamage) {
              setTimeout(() => {
                setBloodEffect(true);
                setTimeout(() => setBloodEffect(false), 1200);
              }, 400);
            }
          } else if (weaponType === 'blunt') {
            setBluntAttack(true);
            setTimeout(() => setBluntAttack(false), 800);
            if (isHighDamage) {
              setTimeout(() => {
                setBloodEffect(true);
                setTimeout(() => setBloodEffect(false), 1200);
              }, 600);
            }
          } else if (skill.elementType === 'light' || skill.elementType === 'dark') {
            setMagicBurst(true);
            setTimeout(() => setMagicBurst(false), 1000);
          }
        }
      }, 800);
      
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, combatPhase, lastBattleResult]);
  
  // Listen for battle results and trigger appropriate animations
  useEffect(() => {
    if (lastBattleResult) {
      if (lastBattleResult.winner === 'character') {
        // Character wins - enhanced success animation based on skill type
        const skill = lastBattleResult.characterSkill;
        let effects = '✨⚡💫';
        
        const hasHealEffect = skill.effects?.some(effect => effect.type === 'heal');
        const hasShieldEffect = skill.name.toLowerCase().includes('protection') || 
                               skill.name.toLowerCase().includes('shield') || 
                               skill.name.toLowerCase().includes('aegis');
        
        // Use equipped weapon type if available
        const equippedWeapon = character.equippedWeapon;
        let weaponType = skill.damageType;
        if (equippedWeapon && equippedWeapon.skills.length > 0) {
          weaponType = equippedWeapon.skills[0].damageType;
        }
        
        if (hasHealEffect) {
          effects = '💚🌟💊✨🙏';
        } else if (hasShieldEffect) {
          effects = '🛡️✨💎🌟';
        } else if (weaponType === 'slash') {
          effects = '⚔️✨💥🌟';
        } else if (weaponType === 'pierce') {
          effects = '🏹💫✨';
        } else if (weaponType === 'blunt') {
          effects = '💥🔨⭐💢';
        }
        
        if (skill.elementType === 'fire') {
          effects += '🔥🌋💥';
        } else if (skill.elementType === 'light') {
          effects += '☀️💫✨';
        } else if (skill.elementType === 'dark') {
          effects += '🌑💀⚡';
        }
        
        setAttackEffect(effects);
        setIsAnimating(true);
        setTimeout(() => {
          setAttackEffect(null);
          setIsAnimating(false);
        }, 2500);
      } else {
        // Character loses - enhanced damage animation
        setAttackEffect('💥🔥💢⚡💀');
        setIsShaking(true);
        setDamageNumbers({value: lastBattleResult.damage, id: Date.now()});
        
        // Extended shake animation for impact
        setTimeout(() => setIsShaking(false), 800);
        setTimeout(() => setAttackEffect(null), 2000);
        setTimeout(() => setDamageNumbers(null), 2500);
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
  
  // Dynamic charging effect animation
  const chargePulse = isCharging ? Math.sin(animationFrame * 0.3) * 0.5 + 0.5 : 0;
  
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
      {/* Charging aura effect */}
      {isCharging && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,${chargePulse * 0.8}) 0%, transparent 70%)`,
            animation: 'pulse 0.5s ease-in-out infinite',
            zIndex: 5
          }}
        />
      )}
      
      {/* Weapon slash effect */}
      {weaponSlash && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
          {/* Main weapon arc */}
          <div 
            className="absolute w-16 h-16 border-4 border-yellow-400 rounded-full animate-ping"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              clipPath: 'polygon(50% 50%, 100% 0%, 100% 50%)',
              boxShadow: '0 0 15px rgba(255,215,0,0.8)',
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.6) 50%, transparent 70%)'
            }}
          />
          {/* Slash trails */}
          <div 
            className="absolute w-20 h-2 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-ping"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) rotate(30deg)',
              boxShadow: '0 0 10px rgba(255,255,0,0.9)'
            }}
          />
          <div 
            className="absolute w-18 h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-ping"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) rotate(15deg)',
              animationDelay: '0.1s',
              boxShadow: '0 0 8px rgba(255,255,255,0.8)'
            }}
          />
        </div>
      )}
      
      {/* Pierce effect */}
      {slashEffect && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
          <div 
            className="absolute w-1 h-20 bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-ping"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 12px rgba(0,255,255,0.8)'
            }}
          />
          <div 
            className="absolute w-8 h-8 border-2 border-cyan-400 rounded-full animate-ping"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animationDelay: '0.1s',
              boxShadow: '0 0 10px rgba(0,255,255,0.6)'
            }}
          />
        </div>
      )}
      
      {/* Shield effect */}
      {shieldEffect && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          <div 
            className="absolute w-20 h-24 border-4 border-blue-400 rounded-lg animate-pulse"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(147,197,253,0.5), rgba(59,130,246,0.3))',
              boxShadow: '0 0 20px rgba(59,130,246,0.8), inset 0 0 20px rgba(147,197,253,0.3)',
              clipPath: 'polygon(50% 0%, 90% 35%, 90% 100%, 10% 100%, 10% 35%)'
            }}
          >
            {/* Shield runes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-blue-200 text-lg font-bold animate-pulse">⚡</div>
            </div>
          </div>
          {/* Shield sparkles */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * 360;
            const radius = 35;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            return (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-300 rounded-full animate-ping"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  animationDelay: `${i * 0.1}s`,
                  boxShadow: '0 0 6px rgba(147,197,253,0.8)'
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Heal effect */}
      {healEffect && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          {/* Healing cross */}
          <div 
            className="absolute w-12 h-3 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 15px rgba(34,197,94,0.8)'
            }}
          />
          <div 
            className="absolute w-3 h-12 bg-gradient-to-b from-transparent via-green-400 to-transparent animate-pulse"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 15px rgba(34,197,94,0.8)'
            }}
          />
          {/* Healing particles floating up */}
          {Array.from({ length: 8 }).map((_, i) => {
            const delay = i * 0.2;
            return (
              <div
                key={i}
                className="absolute w-2 h-2 bg-green-400 rounded-full animate-bounce"
                style={{
                  left: `${45 + (i % 3) * 3}%`,
                  bottom: '50%',
                  animationDelay: `${delay}s`,
                  animationDuration: '1.5s',
                  boxShadow: '0 0 8px rgba(34,197,94,0.6)',
                  animation: `healFloat 1.5s ease-out ${delay}s infinite`
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Blunt attack effect */}
      {bluntAttack && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
          {/* Impact shockwave */}
          <div 
            className="absolute w-16 h-16 border-4 border-orange-400 rounded-full animate-ping"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 20px rgba(251,146,60,0.8)',
              background: 'radial-gradient(circle, rgba(251,146,60,0.4) 0%, transparent 70%)'
            }}
          />
          {/* Impact cracks */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * 360;
            return (
              <div
                key={i}
                className="absolute w-12 h-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent animate-ping"
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: '0% 50%',
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  animationDelay: `${i * 0.05}s`,
                  boxShadow: '0 0 8px rgba(251,146,60,0.6)'
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Blood effect for high damage */}
      {bloodEffect && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 12 }}>
          {/* Blood splatter */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 37.5) + (i * 15); // Deterministic angles
            const distance = 20 + (i % 4) * 4;
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            const size = 2 + (i % 3);
            
            return (
              <div
                key={i}
                className="absolute bg-red-600 rounded-full animate-pulse"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: '1s',
                  opacity: 0.8,
                  boxShadow: '0 0 4px rgba(220,38,38,0.8)'
                }}
              />
            );
          })}
          
          {/* Main blood burst */}
          <div 
            className="absolute w-8 h-8 bg-red-600 rounded-full animate-ping opacity-70"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 15px rgba(220,38,38,0.8)',
              background: 'radial-gradient(circle, rgba(220,38,38,0.9) 0%, rgba(127,29,29,0.6) 50%, transparent 100%)'
            }}
          />
        </div>
      )}
      
      {/* Magic burst effect */}
      {magicBurst && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * 360;
            return (
              <div
                key={i}
                className="absolute w-2 h-8 bg-gradient-to-t from-purple-500 via-pink-400 to-transparent animate-ping"
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: '50% 100%',
                  transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                  animationDelay: `${i * 0.1}s`,
                  boxShadow: '0 0 6px rgba(147,51,234,0.8)'
                }}
              />
            );
          })}
        </div>
      )}

      {/* Character sprite - 64-bit style */}
      <div 
        className={`w-12 h-16 border-2 border-gray-300 relative transition-all duration-300 ${
          isAnimating ? 'animate-pulse scale-110 animate-bounce' : ''
        } ${isCharging ? 'animate-bounce' : ''}`}
        style={{
          imageRendering: 'pixelated',
          filter: `contrast(1.2) saturate(1.3) ${isCharging ? `brightness(${1 + chargePulse * 0.5})` : ''}`,
          opacity: healthPercentage < 0.3 ? 0.7 : 1,
          boxShadow: isCharging ? `0 0 20px rgba(255,255,255,${chargePulse})` : 'none'
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
        
        @keyframes healFloat {
          0% { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: translateY(-40px) scale(0.8); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
}