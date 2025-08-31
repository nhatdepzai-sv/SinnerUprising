import { useState } from 'react';
import { Character, Skill } from '../../types/game';
import { useCombat } from '../../lib/stores/useCombat';
import { useCharacters } from '../../lib/stores/useCharacters';

interface SkillSelectorProps {
  isVisible: boolean;
}

export function SkillSelector({ isVisible }: SkillSelectorProps) {
  const { selectedTeam } = useCharacters();
  const { selectAction, selectedActions, currentBoss } = useCombat();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  
  if (!isVisible || !currentBoss) return null;
  
  const handleSkillSelect = (skill: Skill) => {
    if (selectedCharacter) {
      selectAction({
        characterId: selectedCharacter.id,
        skillId: skill.id,
        targetId: currentBoss.id
      });
      setSelectedCharacter(null);
    }
  };
  
  const getElementColor = (elementType: string) => {
    const colors = {
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      earth: 'bg-green-500',
      air: 'bg-cyan-500',
      light: 'bg-yellow-500',
      dark: 'bg-purple-500',
      divine: 'bg-white text-black'
    };
    return colors[elementType as keyof typeof colors] || 'bg-gray-500';
  };
  
  const getDamageTypeIcon = (damageType: string) => {
    switch (damageType) {
      case 'slash': return '⚔️';
      case 'pierce': return '🏹';
      case 'blunt': return '🔨';
      default: return '⭐';
    }
  };
  
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-black/90 p-4 rounded-lg text-white">
      <h3 className="text-xl font-bold mb-4">Select Skills</h3>
      
      {!selectedCharacter ? (
        <div>
          <p className="mb-3 text-gray-300">Choose a character:</p>
          <div className="grid grid-cols-3 gap-3">
            {selectedTeam.map((character) => {
              const hasAction = selectedActions.some(a => a.characterId === character.id);
              return (
                <button
                  key={character.id}
                  onClick={() => setSelectedCharacter(character)}
                  disabled={hasAction}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    hasAction
                      ? 'bg-green-700 border-green-500 text-green-200'
                      : 'bg-gray-800 border-gray-600 hover:border-blue-400 hover:bg-gray-700'
                  }`}
                >
                  <div className="font-semibold">{character.name}</div>
                  <div className="text-sm text-gray-400">
                    HP: {character.currentHealth}/{character.maxHealth}
                  </div>
                  {character.corruption > 50 && (
                    <div className="text-xs text-red-400">CORRUPTED</div>
                  )}
                  {hasAction && (
                    <div className="text-xs text-green-400">ACTION SELECTED</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-300">Select skill for {selectedCharacter.name}:</p>
            <button
              onClick={() => setSelectedCharacter(null)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              Back
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedCharacter.skills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillSelect(skill)}
                className="p-3 text-left bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-blue-400 rounded-lg transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{skill.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs text-white ${getElementColor(skill.elementType)}`}>
                      {skill.elementType.toUpperCase()}
                    </span>
                    <span className="text-lg">{getDamageTypeIcon(skill.damageType)}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 mb-2">
                  {skill.description}
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Power: {skill.basePower}</span>
                  <span>Mana: {skill.manaCost}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {selectedActions.length > 0 && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">Selected Actions:</p>
          {selectedActions.map((action, index) => {
            const character = selectedTeam.find(c => c.id === action.characterId);
            const skill = character?.skills.find(s => s.id === action.skillId);
            return (
              <div key={index} className="text-sm text-green-400">
                {character?.name}: {skill?.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
