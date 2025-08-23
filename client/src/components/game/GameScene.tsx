import { Canvas } from '@react-three/fiber';
import { KeyboardControls, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { Environment } from './Environment';
import { Character } from './Character';
import { Boss } from './Boss';
import { useCombat } from '../../lib/stores/useCombat';
import { useCharacters } from '../../lib/stores/useCharacters';

const controls = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'interact', keys: ['Space', 'Enter'] },
];

export function GameScene() {
  const { currentBoss } = useCombat();
  const { selectedTeam } = useCharacters();
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <KeyboardControls map={controls}>
        <Canvas
          shadows
          camera={{
            position: [8, 6, 8],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "high-performance"
          }}
        >
          <Suspense fallback={null}>
            <Environment />
            
            {/* Characters positioned in formation */}
            {selectedTeam.map((character, index) => (
              <Character
                key={character.id}
                character={{
                  ...character,
                  position: [
                    -3 + index * 1.5,
                    0,
                    2
                  ]
                }}
              />
            ))}
            
            {/* Boss */}
            {currentBoss && (
              <Boss boss={currentBoss} />
            )}
            
            <OrbitControls 
              enablePan={false}
              enableZoom={true}
              maxPolarAngle={Math.PI / 2}
              minDistance={5}
              maxDistance={20}
            />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}
