import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Character as CharacterType } from '../../types/game';
import * as THREE from 'three';

interface CharacterProps {
  character: CharacterType;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Character({ character, isSelected = false, onClick }: CharacterProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animate selection state
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    } else if (meshRef.current) {
      meshRef.current.position.y = 0.5;
    }
  });
  
  // Color based on health
  const healthPercentage = character.currentHealth / character.maxHealth;
  let color = '#4ade80'; // Green
  if (healthPercentage < 0.5) color = '#fbbf24'; // Yellow
  if (healthPercentage < 0.25) color = '#ef4444'; // Red
  if (character.isStaggered) color = '#9333ea'; // Purple for staggered
  
  return (
    <group position={character.position}>
      <mesh
        ref={meshRef}
        castShadow
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial 
          color={color} 
          transparent 
          opacity={character.isStaggered ? 0.6 : 1.0}
        />
      </mesh>
      
      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 1.5, 0]}>
          <ringGeometry args={[0.6, 0.8, 8]} />
          <meshBasicMaterial color="#ffd700" side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* Health bar */}
      <group position={[0, 1.2, 0]}>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1, 0.1]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
        <mesh position={[-0.5 + (healthPercentage * 0.5), 0, 0.02]}>
          <planeGeometry args={[healthPercentage, 0.08]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
      
      {/* Name label */}
      <group position={[0, 2, 0]}>
        {/* Background for text visibility */}
        <mesh>
          <planeGeometry args={[2, 0.3]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  );
}
