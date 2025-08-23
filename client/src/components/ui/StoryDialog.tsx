import { useEffect } from 'react';
import { useStory } from '../../lib/stores/useStory';
import { useCombat } from '../../lib/stores/useCombat';

export function StoryDialog() {
  const { 
    isInCutscene, 
    showingDialogue, 
    currentDialogueIndex, 
    getCurrentAct,
    nextDialogue,
    skipCutscene 
  } = useStory();
  const { startCombat } = useCombat();
  
  const currentAct = getCurrentAct();
  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isInCutscene && showingDialogue) {
        if (event.key === 'Enter' || event.key === ' ') {
          handleContinue();
        } else if (event.key === 'Escape') {
          skipCutscene();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });
  
  if (!isInCutscene || !showingDialogue || !currentAct) {
    return null;
  }
  
  const currentDialogue = currentAct.dialogue[currentDialogueIndex];
  const isLastDialogue = currentDialogueIndex === currentAct.dialogue.length - 1;
  
  const handleContinue = () => {
    if (isLastDialogue) {
      // End cutscene and start combat with the act's boss
      skipCutscene();
      if (currentAct) {
        startCombat(currentAct.bossId);
      }
    } else {
      nextDialogue();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{currentAct.title}</h1>
          <p className="text-xl text-gray-300">{currentAct.description}</p>
        </div>
        
        <div className="bg-black/80 border-2 border-red-600 rounded-lg p-6 min-h-[200px] flex flex-col justify-between">
          <div className="text-white text-lg leading-relaxed mb-4">
            {currentDialogue}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              {currentDialogueIndex + 1} / {currentAct.dialogue.length}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={skipCutscene}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Skip (ESC)
              </button>
              
              <button
                onClick={handleContinue}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                {isLastDialogue ? 'Begin Battle' : 'Continue'} (ENTER)
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4 text-gray-500 text-sm">
          Press ENTER to continue, ESC to skip
        </div>
      </div>
    </div>
  );
}