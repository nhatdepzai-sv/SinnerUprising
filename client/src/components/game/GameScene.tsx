import { Character } from './Character';
import { Boss } from './Boss';
import { useCombat } from '../../lib/stores/useCombat';
import { useCharacters } from '../../lib/stores/useCharacters';

export function GameScene() {
  const { currentBoss, gamePhase, combatPhase } = useCombat();
  const { selectedTeam } = useCharacters();
  
  if (gamePhase !== 'combat') {
    return null;
  }
  
  // Get battle background based on current boss
  const getBattleBackground = () => {
    if (!currentBoss) return 'bg-gradient-to-b from-gray-900 to-gray-800';
    
    switch (currentBoss.id) {
      case 'god_of_war':
        return 'bg-gradient-to-b from-red-900 via-red-800 to-black';
      case 'god_of_wisdom':
        return 'bg-gradient-to-b from-blue-900 via-blue-800 to-black';
      case 'god_of_nature':
        return 'bg-gradient-to-b from-green-900 via-green-800 to-black';
      case 'god_of_storms':
        return 'bg-gradient-to-b from-purple-900 via-purple-800 to-black';
      case 'god_of_death':
        return 'bg-gradient-to-b from-gray-900 via-gray-800 to-black';
      case 'final_boss':
        return 'bg-gradient-to-b from-red-900 via-black to-red-900';
      default:
        return 'bg-gradient-to-b from-gray-900 to-gray-800';
    }
  };
  
  // Get atmospheric effects
  const getAtmosphericEffects = () => {
    if (!currentBoss) return null;
    
    const effects = [];
    
    // Add floating particles based on boss type
    for (let i = 0; i < 10; i++) {
      effects.push(
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      );
    }
    
    // Boss-specific effects
    switch (currentBoss.id) {
      case 'god_of_war':
        // Add flame effects
        effects.push(
          <div key="flames" className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-600/20 to-transparent animate-pulse" />
        );
        break;
      case 'god_of_storms':
        // Add lightning effects
        effects.push(
          <div key="lightning" className="absolute inset-0 bg-blue-500/10 animate-pulse" style={{ animationDuration: '0.5s' }} />
        );
        break;
      case 'final_boss':
        // Add dark energy effects
        effects.push(
          <div key="darkness" className="absolute inset-0 bg-black/30 animate-pulse" style={{ animationDuration: '1s' }} />
        );
        break;
    }
    
    return effects;
  };
  
  return (
    <div className={`relative w-full h-full overflow-hidden ${getBattleBackground()}`}>
      {/* Atmospheric effects */}
      {getAtmosphericEffects()}
      
      {/* Battle arena ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-800/80 to-transparent" />
      
      {/* Characters positioned on the left side */}
      <div className="absolute left-8 bottom-20 flex flex-col space-y-4">
        {selectedTeam.map((character, index) => (
          <Character
            key={character.id}
            character={{
              ...character,
              position: [0, index * 60] // 2D positioning
            }}
          />
        ))}
      </div>
      
      {/* Boss positioned on the right side */}
      {currentBoss && (
        <Boss boss={currentBoss} />
      )}
      
      {/* Battle phase indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/80 text-white px-6 py-2 rounded-lg border border-gray-600">
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">
              {combatPhase === 'planning' && 'Planning Phase'}
              {combatPhase === 'battle' && 'Battle Phase'}
              {combatPhase === 'resolution' && 'Resolution Phase'}
              {combatPhase === 'enemy_turn' && 'Enemy Turn'}
            </div>
            {currentBoss && (
              <div className="text-sm text-gray-300">
                vs {currentBoss.name}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Environmental details based on boss */}
      {currentBoss && (
        <div className="absolute inset-0 pointer-events-none">
          {currentBoss.id === 'god_of_nature' && (
            <>
              {/* Trees/forest silhouettes */}
              <div className="absolute bottom-16 left-4 w-8 h-20 bg-green-900/60 rounded-t-full" />
              <div className="absolute bottom-16 right-12 w-6 h-16 bg-green-900/60 rounded-t-full" />
              <div className="absolute bottom-16 left-1/3 w-10 h-24 bg-green-900/60 rounded-t-full" />
            </>
          )}
          
          {currentBoss.id === 'god_of_storms' && (
            <>
              {/* Storm clouds */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-800/60 to-transparent" />
              <div className="absolute top-4 left-8 w-16 h-8 bg-gray-700/40 rounded-full" />
              <div className="absolute top-6 right-16 w-20 h-6 bg-gray-700/40 rounded-full" />
            </>
          )}
        </div>
      )}
    </div>
  );
}