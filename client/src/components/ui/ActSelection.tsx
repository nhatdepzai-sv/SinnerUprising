import { useCombat } from '../../lib/stores/useCombat';
import { useStory } from '../../lib/stores/useStory';
import { StoryAct } from '../../types/game';

export function ActSelection() {
  const { startCombat, setGamePhase } = useCombat();
  const { acts, currentAct, startCutscene, hasReachedFinalBoss } = useStory();
  
  const handleActSelect = (act: StoryAct) => {
    if (act.unlocked) {
      startCutscene(act.id);
    }
  };
  
  const getActStatusColor = (act: StoryAct, index: number) => {
    if (act.completed) return 'bg-green-800 border-green-600';
    if (act.unlocked) return 'bg-red-800 border-red-600';
    if (index === currentAct) return 'bg-blue-800 border-blue-600';
    return 'bg-gray-800 border-gray-600';
  };
  
  const getActStatusText = (act: StoryAct, index: number) => {
    if (act.completed) return 'COMPLETED';
    if (act.unlocked) return 'AVAILABLE';
    if (index === currentAct) return 'CURRENT';
    return 'LOCKED';
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold text-white mb-4"
            style={{
              fontFamily: 'monospace',
              textShadow: '4px 4px 0px #000000',
              imageRendering: 'pixelated'
            }}
          >
            THE PATH OF VENGEANCE
          </h1>
          <p 
            className="text-xl text-gray-300 mb-2"
            style={{
              fontFamily: 'monospace',
              textShadow: '2px 2px 0px #000000'
            }}
          >
            CHOOSE YOUR NEXT TARGET IN THE DIVINE HIERARCHY
          </p>
          {hasReachedFinalBoss && (
            <p className="text-lg text-red-400">
              The final confrontation awaits...
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {acts.map((act, index) => (
            <button
              key={act.id}
              onClick={() => handleActSelect(act)}
              disabled={!act.unlocked}
              className={`p-6 border-2 transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                getActStatusColor(act, index)
              }`}
              style={{
                imageRendering: 'pixelated',
                filter: 'contrast(1.2)',
                borderRadius: '0px', // Remove rounded corners for pixelated look
              }}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">{act.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{act.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${
                    act.completed 
                      ? 'bg-green-600 text-white'
                      : act.unlocked
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {getActStatusText(act, index)}
                  </span>
                  
                  {act.unlocked && !act.completed && (
                    <span className="text-yellow-400 text-sm animate-pulse">
                      Click to begin
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="text-center mt-8 text-gray-500">
          <p>Your corruption grows with each divine life you take...</p>
          <p>But vengeance demands its price.</p>
          
          <button
            onClick={() => setGamePhase('map')}
            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded transition-colors"
            style={{
              fontFamily: 'monospace',
              textShadow: '2px 2px 0px #000000'
            }}
          >
            🗺️ EXPLORE MAP
          </button>
        </div>
      </div>
    </div>
  );
}