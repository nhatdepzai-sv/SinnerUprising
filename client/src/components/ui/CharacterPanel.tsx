import { Character } from '../../types/game';

interface CharacterPanelProps {
  characters: Character[];
}

export function CharacterPanel({ characters }: CharacterPanelProps) {
  if (characters.length === 0) return null;
  
  return (
    <div className="fixed top-4 left-4 bg-black/80 p-4 rounded-lg text-white min-w-[300px]">
      <h3 className="text-lg font-bold mb-3">Team Status</h3>
      
      <div className="space-y-3">
        {characters.map((character) => (
          <div key={character.id} className="bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{character.name}</span>
              {character.isStaggered && (
                <span className="px-2 py-1 bg-purple-600 text-xs rounded">
                  STAGGERED
                </span>
              )}
            </div>
            
            {/* Health bar */}
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Health</span>
                <span>{character.currentHealth}/{character.maxHealth}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    character.currentHealth / character.maxHealth > 0.5
                      ? 'bg-green-500'
                      : character.currentHealth / character.maxHealth > 0.25
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: `${(character.currentHealth / character.maxHealth) * 100}%`
                  }}
                />
              </div>
            </div>
            
            {/* Stagger bar */}
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Stagger</span>
                <span>{character.currentStagger}/{character.staggerThreshold}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 bg-purple-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${(character.currentStagger / character.staggerThreshold) * 100}%`
                  }}
                />
              </div>
            </div>
            
            {/* Sin affinities */}
            <div className="mt-2">
              <div className="text-xs text-gray-400 mb-1">Sin Affinities</div>
              <div className="flex space-x-1">
                {character.sinAffinities.map((sin, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300"
                  >
                    {sin}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
