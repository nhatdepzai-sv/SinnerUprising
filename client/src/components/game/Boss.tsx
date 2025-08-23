import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Boss as BossType } from '../../types/game';
import { useCombat } from '../../lib/stores/useCombat';
import * as THREE from 'three';

interface BossProps {
  boss: BossType;
}

export function Boss({ boss }: BossProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gamePhase } = useCombat();
  
  // Animate boss based on phase
  useFrame((state) => {
    if (meshRef.current) {
      const intensity = boss.phase * 0.5;
      meshRef.current.position.y = boss.position[1] + Math.sin(state.clock.elapsedTime * 2) * (0.1 + intensity);
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  
  // Color changes based on phase and health
  const getColor = () => {
    const healthPercentage = boss.currentHealth / boss.maxHealth;
    
    switch (boss.phase) {
      case 1:
        return healthPercentage > 0.5 ? '#8b5cf6' : '#a855f7'; // Purple variants
      case 2:
        return healthPercentage > 0.3 ? '#dc2626' : '#ef4444'; // Red variants
      case 3:
        return '#7c2d12'; // Dark red for final phase
      default:
        return '#6b7280';
    }
  };
  
  // Scale based on phase
  const currentScale = boss.scale + (boss.phase - 1) * 0.3;
  
  return (
    <group position={boss.position} scale={[currentScale, currentScale, currentScale]}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 3, 1]} />
        <meshLambertMaterial color={getColor()} />
      </mesh>
      
      {/* Phase indicator - glowing rings */}
      {Array.from({ length: boss.phase }).map((_, i) => (
        <mesh 
          key={i} 
          position={[0, 2 + i * 0.5, 0]} 
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[1 + i * 0.2, 1.2 + i * 0.2, 16]} />
          <meshBasicMaterial 
            color={getColor()} 
            transparent 
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Boss aura effect */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial 
          color={getColor()} 
          transparent 
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Damage effect */}
      {boss.currentHealth < boss.maxHealth * 0.5 && (
        <group>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh 
              key={i}
              position={[
                (Math.random() - 0.5) * 3,
                Math.random() * 3,
                (Math.random() - 0.5) * 2
              ]}
            >
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#ff6b6b" transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
