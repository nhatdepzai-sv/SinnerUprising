import { useRef, useState, useEffect } from 'react';
import { useCombat } from '../../lib/stores/useCombat';
import { Orb as OrbType } from '../../types/game';

interface OrbProps {
  orb: OrbType;
}

export function Orb({ orb }: OrbProps) {
  const orbRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const { clickOrb } = useCombat();

  // Float animation using React state
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 50); // 20 FPS for smooth animation
    
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    clickOrb(orb.id);
  };

  // Calculate animated position and effects
  const time = animationFrame * 0.05 + orb.spawnTime * 0.001;
  const floatOffset = Math.sin(time * 2) * 8; // Vertical floating motion
  const pulseScale = 0.8 + (orb.hitpoints / orb.maxHitpoints) * 0.4;
  const pulse = 1 + Math.sin(time * 4) * 0.1;
  const finalScale = pulseScale * pulse * (hovered ? 1.2 : 1);

  return (
    <div 
      ref={orbRef}
      className={`absolute cursor-pointer transition-transform duration-200 ${
        hovered ? 'scale-110' : ''
      }`}
      style={{
        left: `${orb.position[0] * 20 + 50}%`, // Convert to screen coordinates
        top: `${orb.position[1] * 8 + 30 + floatOffset}%`,
        transform: `scale(${finalScale})`,
        zIndex: 50
      }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Main orb */}
      <div 
        className="relative w-12 h-12 rounded-full animate-pulse"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${orb.glowColor}aa, ${orb.glowColor}44, ${orb.glowColor}22)`,
          boxShadow: `
            0 0 20px ${orb.glowColor}66,
            0 0 40px ${orb.glowColor}33,
            inset 0 0 10px ${orb.glowColor}22
          `,
          filter: 'blur(0.5px)',
        }}
      >
        {/* Inner glow */}
        <div 
          className="absolute inset-2 rounded-full animate-ping"
          style={{
            background: `radial-gradient(circle, ${orb.glowColor}88, transparent)`,
          }}
        />
        
        {/* Core sparkle */}
        <div 
          className="absolute inset-4 rounded-full"
          style={{
            background: `${orb.glowColor}ff`,
            boxShadow: `0 0 8px ${orb.glowColor}ff`,
            animation: 'pulse 1s ease-in-out infinite'
          }}
        />
      </div>

      {/* Particle effects */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + time;
        const radius = 30 + Math.sin(time * 2 + i) * 5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              background: orb.glowColor,
              boxShadow: `0 0 4px ${orb.glowColor}`,
              opacity: 0.7,
              animation: `pulse ${0.5 + i * 0.2}s ease-in-out infinite`
            }}
          />
        );
      })}

      {/* Hitpoints indicator */}
      <div 
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white bg-black/60 px-2 py-1 rounded"
        style={{
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          minWidth: '24px',
          textAlign: 'center'
        }}
      >
        {orb.hitpoints}
      </div>

      {/* Strength bonus indicator */}
      <div 
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-yellow-300 bg-black/60 px-2 py-1 rounded"
        style={{
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        }}
      >
        +{orb.strengthBonus} STR
      </div>
    </div>
  );
}