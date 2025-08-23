import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { useCharacters } from "./lib/stores/useCharacters";
import { GameScene } from "./components/game/GameScene";
import { GameUI } from "./components/ui/GameUI";
import "@fontsource/inter";

// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "interact", keys: ["Space"] },
  { name: "escape", keys: ["Escape"] },
];

// Main App component
function App() {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const { resetCharacters } = useCharacters();

  // Initialize audio and characters on startup
  useEffect(() => {
    // Setup audio
    const bgMusic = new Audio('/sounds/background.mp3');
    const hitSfx = new Audio('/sounds/hit.mp3');
    const successSfx = new Audio('/sounds/success.mp3');
    
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    setBackgroundMusic(bgMusic);
    setHitSound(hitSfx);
    setSuccessSound(successSfx);
    
    // Initialize characters
    resetCharacters();
    
    return () => {
      bgMusic.pause();
      hitSfx.pause();
      successSfx.pause();
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound, resetCharacters]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KeyboardControls map={controls}>
        {/* 3D Game Scene */}
        <GameScene />
        
        {/* UI Overlay */}
        <GameUI />
      </KeyboardControls>
    </div>
  );
}

export default App;
