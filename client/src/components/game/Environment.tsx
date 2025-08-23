import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Environment() {
  const grassTexture = useTexture('/textures/grass.png');
  
  // Configure texture for tiling
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(10, 10);
  
  return (
    <>
      {/* Ground plane */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshLambertMaterial map={grassTexture} />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Sky color */}
      <color attach="background" args={['#87CEEB']} />
    </>
  );
}
