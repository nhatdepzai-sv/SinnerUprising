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
          
          // Different effects based on boss and skill type - using visual effects only
          if (boss.id === 'god_of_storms' || skill.elementType === 'air') {
            // Trigger storm effects without emojis
            setIsGlowing(true);
          } else if (boss.id === 'god_of_death' || skill.elementType === 'dark') {
            setDarkAura(true);
            setTimeout(() => setDarkAura(false), 1500);
          } else {
            // Generic boss attack - just glow effect
            setIsGlowing(true);
          }
          
          setIsGlowing(true);
        }, 600);
        
        setTimeout(() => {
          setIsGlowing(false);
        }, 3000);
      } else {
        // Boss takes damage - enhanced damage animation without emojis
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
        // Second phase: More aggressive appearance with fire elements
        return healthPercentage > 0.3 ? 'from-red-600 via-orange-500 to-red-800' : 'from-red-500 via-yellow-400 to-red-700';
      case 3:
        // Final phase: Dark and menacing
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
        
        {/* Boss main body - Yu-Gi-Oh Card Design for Final Bosses */}
        {(boss.id === 'god_of_death' || boss.id === 'final_boss') ? (
          <div className="relative w-80 h-96 bg-gradient-to-b from-yellow-200 via-yellow-100 to-yellow-300 border-8 border-yellow-600 rounded-xl shadow-2xl">
            
            {/* Card Frame Header */}
            <div className="absolute top-2 left-2 right-2 h-12 bg-gradient-to-r from-purple-800 via-blue-900 to-purple-800 rounded-lg border-2 border-yellow-500 flex items-center justify-center">
              <h3 className="text-yellow-200 font-bold text-lg tracking-wider" style={{ fontFamily: 'serif' }}>
                {boss.id === 'god_of_death' ? '🪽 SERAPHIM OF DEATH 🪽' : '⚡ THE GOD KILLER ⚡'}
              </h3>
            </div>

            {/* Main Artwork Area */}
            <div className="absolute top-16 left-4 right-4 h-48 bg-gradient-to-b from-blue-900 via-purple-800 to-black rounded-lg border-4 border-yellow-500 overflow-hidden">
              
              {boss.id === 'god_of_death' ? (
                /* Seraphim of Death Design */
                <div className="relative w-full h-full">
                  {/* Heavenly Background */}
                  <div className="absolute inset-0 bg-gradient-radial from-white via-blue-200 to-purple-900">
                    <div className="absolute inset-0 opacity-30">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse"
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Angel Figure */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {/* Halo */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-4 border-4 border-yellow-400 rounded-full bg-yellow-200 opacity-80" />
                    
                    {/* Head */}
                    <div className="w-12 h-12 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full border-2 border-yellow-500 relative">
                      {/* Eyes */}
                      <div className="absolute top-3 left-2 w-2 h-2 bg-blue-800 rounded-full" />
                      <div className="absolute top-3 right-2 w-2 h-2 bg-blue-800 rounded-full" />
                      {/* Mouth */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-red-600 rounded-full opacity-80" />
                    </div>

                    {/* Body */}
                    <div className="w-16 h-20 bg-gradient-to-b from-white via-gray-100 to-purple-300 rounded-lg border-2 border-yellow-500 relative -mt-2">
                      {/* Divine Robes Details */}
                      <div className="absolute inset-2 space-y-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="h-1 bg-yellow-400 opacity-60 rounded" />
                        ))}
                      </div>
                    </div>

                    {/* Six Wings (Seraphim) */}
                    {Array.from({ length: 6 }).map((_, i) => {
                      const angles = [-60, -30, 0, 30, 60, 90];
                      const sizes = ['w-12 h-8', 'w-10 h-6', 'w-14 h-10', 'w-14 h-10', 'w-10 h-6', 'w-12 h-8'];
                      return (
                        <div
                          key={i}
                          className={`absolute ${sizes[i]} bg-gradient-to-r from-white via-yellow-200 to-gold-300 border-2 border-yellow-400 opacity-90`}
                          style={{
                            top: '20px',
                            left: '8px',
                            transformOrigin: '50% 100%',
                            transform: `rotate(${angles[i]}deg)`,
                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                            animation: `wingFlap ${2 + Math.random()}s ease-in-out infinite ${i * 0.1}s`
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Death Aura */}
                  <div className="absolute inset-0 bg-black opacity-20 rounded-lg animate-pulse" />
                </div>
              ) : (
                /* God Killer Design */
                <div className="relative w-full h-full">
                  {/* Dark Void Background */}
                  <div className="absolute inset-0 bg-gradient-radial from-red-900 via-black to-purple-900">
                    <div className="absolute inset-0 opacity-40">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-red-500 rounded-full animate-pulse"
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Corrupted Avatar */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {/* Dark Halo */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-4 border-4 border-red-500 rounded-full bg-black opacity-80" />
                    
                    {/* Corrupted Head */}
                    <div className="w-12 h-12 bg-gradient-to-b from-gray-700 to-black rounded-full border-2 border-red-500 relative">
                      {/* Glowing Red Eyes */}
                      <div className="absolute top-3 left-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <div className="absolute top-3 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      {/* Mouth */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-red-600 rounded-full" />
                    </div>

                    {/* Dark Armor Body */}
                    <div className="w-16 h-20 bg-gradient-to-b from-gray-800 via-black to-red-900 rounded-lg border-2 border-red-500 relative -mt-2">
                      {/* Corruption Details */}
                      <div className="absolute inset-2 space-y-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="h-1 bg-red-500 opacity-80 rounded animate-pulse" />
                        ))}
                      </div>
                    </div>

                    {/* Corrupted Wings */}
                    {Array.from({ length: 4 }).map((_, i) => {
                      const angles = [-45, -15, 15, 45];
                      return (
                        <div
                          key={i}
                          className="absolute w-14 h-10 bg-gradient-to-r from-black via-red-800 to-purple-900 border-2 border-red-500 opacity-80"
                          style={{
                            top: '20px',
                            left: '8px',
                            transformOrigin: '50% 100%',
                            transform: `rotate(${angles[i]}deg)`,
                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                            animation: `wingFlap ${1.5 + Math.random()}s ease-in-out infinite ${i * 0.05}s`
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Corruption Aura */}
                  <div className="absolute inset-0 bg-red-900 opacity-30 rounded-lg animate-pulse" />
                </div>
              )}
            </div>

            {/* Card Stats Section */}
            <div className="absolute bottom-16 left-4 right-4 h-16 bg-gradient-to-r from-purple-800 via-blue-900 to-purple-800 rounded-lg border-2 border-yellow-500 p-2">
              <div className="grid grid-cols-2 gap-2 h-full">
                <div className="bg-red-800 rounded border border-yellow-400 flex flex-col items-center justify-center">
                  <span className="text-yellow-200 text-xs font-bold">ATK</span>
                  <span className="text-white text-lg font-bold">{boss.phase >= 3 ? '3000' : boss.phase >= 2 ? '2500' : '2000'}</span>
                </div>
                <div className="bg-blue-800 rounded border border-yellow-400 flex flex-col items-center justify-center">
                  <span className="text-yellow-200 text-xs font-bold">DEF</span>
                  <span className="text-white text-lg font-bold">{boss.phase >= 3 ? '2500' : boss.phase >= 2 ? '2000' : '1500'}</span>
                </div>
              </div>
            </div>

            {/* Card Description */}
            <div className="absolute bottom-2 left-4 right-4 h-12 bg-black bg-opacity-80 rounded border border-yellow-500 p-1">
              <p className="text-yellow-200 text-xs text-center leading-tight">
                {boss.id === 'god_of_death' 
                  ? 'A divine seraphim corrupted by death itself. Its six wings spread judgment across mortals and gods alike.'
                  : 'The ultimate corruption - a fallen champion wielding the power to slay gods and reshape reality.'}
              </p>
            </div>

            {/* Holographic Foil Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-yellow-400 to-transparent opacity-20 rounded-xl animate-pulse" />
            
            {/* Card Border Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 rounded-xl opacity-60 blur-sm animate-pulse" style={{ zIndex: -1 }} />
          </div>
        ) : (
          /* Original Eye Design for Other Bosses */
          <div 
            className="relative w-64 h-48"
            style={{
              imageRendering: 'pixelated',
              filter: 'contrast(1.2) saturate(1.3)',
            }}
          >
            {/* Left Wing */}
            <div 
            className={`absolute -left-24 top-8 w-32 h-24 bg-gradient-to-r ${
              boss.phase >= 3 ? 'from-black via-red-900 to-purple-900' : 
              boss.phase >= 2 ? 'from-gray-700 via-red-700 to-red-800' : 
              'from-gray-600 via-purple-600 to-purple-700'
            } border-4 border-yellow-400 transform -rotate-12`}
            style={{
              clipPath: 'polygon(0% 50%, 30% 0%, 100% 20%, 100% 80%, 30% 100%)',
              animation: boss.phase >= 2 ? 'wingFlap 2s ease-in-out infinite' : 'wingFlap 3s ease-in-out infinite'
            }}
          >
            {/* Wing feather details */}
            <div className="absolute inset-2 space-y-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div 
                  key={i}
                  className="h-1 bg-yellow-400 opacity-60"
                  style={{ width: `${80 - i * 15}%` }}
                />
              ))}
            </div>
          </div>

          {/* Right Wing */}
          <div 
            className={`absolute -right-24 top-8 w-32 h-24 bg-gradient-to-l ${
              boss.phase >= 3 ? 'from-black via-red-900 to-purple-900' : 
              boss.phase >= 2 ? 'from-gray-700 via-red-700 to-red-800' : 
              'from-gray-600 via-purple-600 to-purple-700'
            } border-4 border-yellow-400 transform rotate-12`}
            style={{
              clipPath: 'polygon(0% 20%, 70% 0%, 100% 50%, 70% 100%, 0% 80%)',
              animation: boss.phase >= 2 ? 'wingFlap 2s ease-in-out infinite 0.1s' : 'wingFlap 3s ease-in-out infinite 0.1s'
            }}
          >
            {/* Wing feather details */}
            <div className="absolute inset-2 space-y-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div 
                  key={i}
                  className="h-1 bg-yellow-400 opacity-60 ml-auto"
                  style={{ width: `${80 - i * 15}%` }}
                />
              ))}
            </div>
          </div>

          {/* Main Eye Body */}
          <div 
            className={`w-48 h-36 bg-gradient-radial ${
              boss.phase >= 3 ? 'from-red-200 via-red-600 to-black' : 
              boss.phase >= 2 ? 'from-white via-red-400 to-red-800' : 
              'from-white via-purple-300 to-purple-800'
            } border-8 border-yellow-400 rounded-full relative mx-auto`}
          >
            {/* Outer eye ring */}
            <div className="absolute inset-4 bg-gradient-radial from-gray-800 to-black rounded-full border-4 border-gray-600">
              
              {/* Iris */}
              <div className={`absolute inset-4 bg-gradient-radial ${
                boss.phase >= 3 ? 'from-red-500 via-orange-500 to-red-900' : 
                boss.phase >= 2 ? 'from-red-400 via-yellow-400 to-red-700' : 
                'from-blue-400 via-purple-500 to-purple-800'
              } rounded-full border-2 border-yellow-500`}>
                
                {/* Pupil */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full border-2 border-red-400">
                  {/* Pupil reflection */}
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-80" />
                </div>
                
                {/* Iris patterns */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i / 8) * 360;
                  return (
                    <div
                      key={i}
                      className="absolute w-1 h-4 bg-yellow-400 opacity-60"
                      style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: '50% 50%',
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-8px)`,
                      }}
                    />
                  );
                })}
              </div>
              
              {/* Eye glow effect */}
              {boss.phase >= 2 && (
                <div className="absolute inset-0 bg-red-500 opacity-30 rounded-full animate-pulse" />
              )}
            </div>
            
            {/* Eye veins/details */}
            <div className="absolute inset-0">
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i / 6) * 360;
                return (
                  <div
                    key={i}
                    className="absolute w-0.5 h-8 bg-red-600 opacity-70"
                    style={{
                      top: '20%',
                      left: '50%',
                      transformOrigin: '50% 150%',
                      transform: `translate(-50%, 0) rotate(${angle}deg)`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Eye lids (when damaged) */}
          {boss.currentHealth < boss.maxHealth * 0.5 && (
            <>
              <div className="absolute top-0 left-8 right-8 h-4 bg-purple-800 opacity-80 rounded-t-full border-t-4 border-yellow-400" />
              <div className="absolute bottom-0 left-8 right-8 h-4 bg-purple-800 opacity-80 rounded-b-full border-b-4 border-yellow-400" />
            </>
          )}
          
          {/* Power aura around entire boss */}
          {boss.phase >= 2 && (
            <div className="absolute -inset-8 bg-red-500 opacity-10 rounded-full animate-pulse blur-md" />
          )}
          
          {/* Ultimate phase dark aura */}
          {boss.phase >= 3 && (
            <div className="absolute -inset-12 bg-black opacity-20 rounded-full animate-pulse blur-lg" />
          )}
          </div>
        )}
        
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
      
      {/* Boss attack effects - removed emoji display, using enhanced visual effects instead */}
      
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
      
      {/* Combat state indicators - removed emoji */}
      {gamePhase === 'combat' && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-yellow-400 text-sm animate-pulse">
            In Combat
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
        
        @keyframes wingFlap {
          0%, 100% { 
            transform: rotateZ(0deg) rotateY(0deg) scaleY(1); 
          }
          25% { 
            transform: rotateZ(-5deg) rotateY(-10deg) scaleY(0.9); 
          }
          50% { 
            transform: rotateZ(5deg) rotateY(10deg) scaleY(1.1); 
          }
          75% { 
            transform: rotateZ(-2deg) rotateY(-5deg) scaleY(0.95); 
          }
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