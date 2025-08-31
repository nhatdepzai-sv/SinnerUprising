import { useState } from 'react';
import { useCharacters } from '../../lib/stores/useCharacters';
import { Button } from './button';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

interface SkillLearningProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SkillLearning({ isOpen, onClose }: SkillLearningProps) {
  const { selectedTeam, learnSkill } = useCharacters();
  const [selectedCharacter, setSelectedCharacter] = useState(selectedTeam[0]?.id || '');
  
  if (!isOpen) return null;
  
  const character = selectedTeam.find(c => c.id === selectedCharacter);
  
  if (!character) return null;

  const getElementColor = (element: string) => {
    switch (element) {
      case 'fire': return 'bg-red-500';
      case 'water': return 'bg-blue-500';
      case 'earth': return 'bg-green-500';
      case 'air': return 'bg-cyan-500';
      case 'light': return 'bg-yellow-400';
      case 'dark': return 'bg-purple-600';
      case 'divine': return 'bg-gold-400';
      default: return 'bg-gray-500';
    }
  };

  const handleLearnSkill = (skillId: string) => {
    learnSkill(selectedCharacter, skillId);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-blue-600 rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-blue-600">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-blue-300">⭐ Skill Learning</h2>
            <Badge variant="secondary" className="text-green-400">
              Level {character.level}
            </Badge>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-blue-400 hover:bg-blue-900">
            ✕
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Character Status */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-white">{character.name}</h3>
                <p className="text-gray-400">{character.title}</p>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-mono">
                  EXP: {character.experience}/{character.experienceToNext}
                </div>
                <div className="w-32 h-2 bg-gray-700 rounded-full mt-1">
                  <div 
                    className="h-full bg-green-400 rounded-full transition-all duration-300"
                    style={{ width: `${(character.experience / character.experienceToNext) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Current Skills */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-300">📖 Current Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {character.skills.map((skill, index) => (
                <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{skill.name}</h4>
                    <div className="flex space-x-1">
                      <Badge className={`${getElementColor(skill.elementType)} text-white text-xs`}>
                        {skill.elementType}
                      </Badge>
                      <Badge variant="outline" className="text-gray-300 text-xs">
                        {skill.damageType}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{skill.description}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-orange-400">Power: {skill.basePower}</span>
                    <span className="text-blue-400">Mana: {skill.manaCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Skills to Learn */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-green-300">🎯 Available to Learn</h3>
            {character.availableSkills.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-400">No new skills available.</p>
                <p className="text-gray-500 text-sm mt-1">Level up by winning battles to unlock new skills!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {character.availableSkills.map((skill, index) => (
                  <div key={index} className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-600/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-green-300">{skill.name}</h4>
                      <div className="flex space-x-1">
                        <Badge className={`${getElementColor(skill.elementType)} text-white text-xs`}>
                          {skill.elementType}
                        </Badge>
                        <Badge variant="outline" className="text-gray-300 text-xs">
                          {skill.damageType}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{skill.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4 text-xs">
                        <span className="text-orange-400">Power: {skill.basePower}</span>
                        <span className="text-blue-400">Mana: {skill.manaCost}</span>
                      </div>
                      <Button
                        onClick={() => handleLearnSkill(skill.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Learn
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}