import { Boss } from '../../types/game';

interface BossHealthBarProps {
  boss: Boss;
}

export function BossHealthBar({ boss }: BossHealthBarProps) {
  const healthPercentage = (boss.currentHealth / boss.maxHealth) * 100;
  
  const getPhaseColor = (phase: number) => {
    switch (phase) {
      case 1: return 'bg-purple-500';
      case 2: return 'bg-red-500';
      case 3: return 'bg-red-800';
      default: return 'bg-gray-500';
    }
  };
  
  const getHealthColor = () => {
    if (healthPercentage > 60) return 'bg-green-500';
    if (healthPercentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-black/80 p-4 rounded-lg">
      {/* Boss name and phase */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-white">{boss.name}</h2>
        <div className="flex items-center space-x-2">
          <span className="text-white font-semibold">Phase</span>
          <div className="flex space-x-1">
            {Array.from({ length: boss.maxPhase }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border-2 border-white ${
                  i + 1 <= boss.phase ? getPhaseColor(boss.phase) : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Health bar */}
      <div className="relative w-full h-8 bg-gray-700 rounded-lg overflow-hidden">
        <div
          className={`h-full ${getHealthColor()} transition-all duration-1000 ease-out`}
          style={{ width: `${healthPercentage}%` }}
        />
        
        {/* Health text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg drop-shadow-lg">
            {boss.currentHealth} / {boss.maxHealth}
          </span>
        </div>
        
        {/* Phase transition markers */}
        {boss.phaseTransitions.map((transition, index) => (
          <div
            key={index}
            className="absolute top-0 bottom-0 w-0.5 bg-white opacity-70"
            style={{ left: `${transition.healthThreshold * 100}%` }}
          />
        ))}
      </div>
      
      {/* Current phase description */}
      <div className="mt-2 text-sm text-gray-300">
        {boss.phaseTransitions[boss.phase - 1]?.description}
      </div>
    </div>
  );
}
