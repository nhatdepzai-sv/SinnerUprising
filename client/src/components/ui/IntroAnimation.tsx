import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Clear all timers function
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };

  // Show skip button after 1 second (faster)
  useEffect(() => {
    if (!isSkipped) {
      const timer = setTimeout(() => setShowSkip(true), 1000);
      timersRef.current.push(timer);
      return () => clearTimeout(timer);
    }
  }, [isSkipped]);

  // Auto-advance phases
  useEffect(() => {
    if (isSkipped) return; // Don't run if skipped
    
    if (currentPhase < 4) {
      const timer = setTimeout(() => {
        setCurrentPhase(prev => prev + 1);
      }, currentPhase === 0 ? 2000 : 4000);
      timersRef.current.push(timer);
      return () => clearTimeout(timer);
    } else {
      // Animation complete
      const timer = setTimeout(onComplete, 2000);
      timersRef.current.push(timer);
      return () => clearTimeout(timer);
    }
  }, [currentPhase, onComplete, isSkipped]);

  const handleSkip = () => {
    setIsSkipped(true);
    clearAllTimers();
    onComplete();
  };

  const phases = [
    {
      title: "You were their chosen champion...",
      subtitle: "Their most devoted follower",
      bgEffect: "bg-gradient-to-b from-yellow-900/20 to-black"
    },
    {
      title: "But when you needed them most...",
      subtitle: "They turned their backs on you",
      bgEffect: "bg-gradient-to-b from-gray-900/40 to-black"
    },
    {
      title: "Your prayers went unanswered...",
      subtitle: "Your sacrifices forgotten",
      bgEffect: "bg-gradient-to-b from-red-900/30 to-black"
    },
    {
      title: "But you survived...",
      subtitle: "And someone else took notice",
      bgEffect: "bg-gradient-to-b from-purple-900/40 to-black"
    },
    {
      title: "THE PATH OF VENGEANCE",
      subtitle: "Your journey begins...",
      bgEffect: "bg-gradient-to-b from-red-800/50 to-black"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Background effect */}
      <motion.div 
        className={`absolute inset-0 ${phases[currentPhase]?.bgEffect || 'bg-black'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Particle effects */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          className="text-center z-10 max-w-4xl px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 1 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{
              fontFamily: 'monospace',
              textShadow: '4px 4px 0px #000000',
              imageRendering: 'pixelated'
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {phases[currentPhase]?.title}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300"
            style={{
              fontFamily: 'monospace',
              textShadow: '2px 2px 0px #000000'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {phases[currentPhase]?.subtitle}
          </motion.p>

          {/* Special effect for final phase */}
          {currentPhase === 4 && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <motion.div
                className="w-32 h-1 bg-red-600 mx-auto"
                initial={{ width: 0 }}
                animate={{ width: 128 }}
                transition={{ duration: 2 }}
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Skip button */}
      <AnimatePresence>
        {showSkip && (
          <motion.button
            onClick={handleSkip}
            className="fixed bottom-8 right-8 px-6 py-3 bg-red-800 border-2 border-red-600 text-white font-bold hover:bg-red-700 transition-colors z-20"
            style={{
              fontFamily: 'monospace',
              imageRendering: 'pixelated'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            SKIP INTRO
          </motion.button>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="fixed bottom-8 left-8 flex space-x-2 z-20">
        {phases.map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 border border-white ${
              index <= currentPhase ? 'bg-white' : 'bg-transparent'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}