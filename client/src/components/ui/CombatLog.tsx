import { useEffect, useRef } from 'react';
import { useCombat } from '../../lib/stores/useCombat';

export function CombatLog() {
  const { combatLog, lastBattleResult } = useCombat();
  const logRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [combatLog]);
  
  return (
    <div className="fixed top-4 right-4 w-80 bg-black/80 p-4 rounded-lg text-white">
      <h3 className="text-lg font-bold mb-3">Combat Log</h3>
      
      <div
        ref={logRef}
        className="h-64 overflow-y-auto bg-gray-900 p-3 rounded text-sm space-y-1"
      >
        {combatLog.map((entry, index) => (
          <div key={index} className="text-gray-300">
            {entry}
          </div>
        ))}
        
        {lastBattleResult && (
          <div className="mt-2 p-2 bg-gray-800 rounded">
            <div className="font-semibold text-yellow-400">Latest Battle:</div>
            <div className="text-sm space-y-1">
              <div>{lastBattleResult.characterSkill.name} vs {lastBattleResult.bossSkill.name}</div>
              <div>Power: {lastBattleResult.characterPower} vs {lastBattleResult.bossPower}</div>
              <div className={`font-semibold ${
                lastBattleResult.winner === 'character' ? 'text-green-400' : 'text-red-400'
              }`}>
                Winner: {lastBattleResult.winner === 'character' ? 'Character' : 'Boss'}
              </div>
              <div>Damage: {lastBattleResult.damage}</div>
              {lastBattleResult.corruptionGained > 0 && <div className="text-red-400">Corruption: +{lastBattleResult.corruptionGained}</div>}
              {lastBattleResult.effects.map((effect: string, i: number) => (
                <div key={i} className="text-gray-400 text-xs">{effect}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
