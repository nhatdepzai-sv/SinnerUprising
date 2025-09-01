import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCombat } from '../../lib/stores/useCombat';
import { useStory } from '../../lib/stores/useStory';
import { WeaponShop } from './WeaponShop';
import { useWeaponShop } from '../../lib/stores/useWeaponShop';

interface MapNode {
  id: string;
  title: string;
  description: string;
  type: 'story' | 'boss' | 'shop' | 'gacha' | 'event';
  x: number;
  y: number;
  unlocked: boolean;
  completed: boolean;
  connections: string[];
  rewards?: string[];
  difficulty?: number;
}

const mapNodes: MapNode[] = [
  // Starting region - Celestial Gardens
  { id: 'garden_gate', title: 'Garden Gate', description: 'The entrance to the divine realm', type: 'story', x: 50, y: 90, unlocked: true, completed: false, connections: ['garden_fountain'] },
  { id: 'garden_fountain', title: 'Sacred Fountain', description: 'Where prayers once echoed', type: 'story', x: 50, y: 80, unlocked: true, completed: false, connections: ['garden_boss', 'shop_1'] },
  { id: 'shop_1', title: 'Divine Armory', description: 'Abandoned weapons of the faithful', type: 'shop', x: 30, y: 70, unlocked: true, completed: false, connections: ['garden_boss'] },
  { id: 'garden_boss', title: 'Guardian Cherub', description: 'First of the divine guardians', type: 'boss', x: 50, y: 70, unlocked: true, completed: false, connections: ['temple_entrance'], difficulty: 1 },
  
  // Second region - Sacred Temple
  { id: 'temple_entrance', title: 'Temple Entrance', description: 'Marble halls stained with betrayal', type: 'story', x: 50, y: 60, unlocked: false, completed: false, connections: ['temple_hall', 'gacha_1'] },
  { id: 'gacha_1', title: 'Prayer Altar', description: 'Summon forgotten allies', type: 'gacha', x: 70, y: 60, unlocked: false, completed: false, connections: ['temple_hall'] },
  { id: 'temple_hall', title: 'Hall of Judgment', description: 'Where divine justice was perverted', type: 'story', x: 50, y: 50, unlocked: false, completed: false, connections: ['temple_boss'] },
  { id: 'temple_boss', title: 'High Priest', description: 'Corrupted servant of the gods', type: 'boss', x: 50, y: 40, unlocked: false, completed: false, connections: ['void_entrance'], difficulty: 2 },
  
  // Third region - The Void
  { id: 'void_entrance', title: 'Void Gate', description: 'Where light dies', type: 'story', x: 50, y: 30, unlocked: false, completed: false, connections: ['void_maze'] },
  { id: 'void_maze', title: 'Labyrinth of Despair', description: 'Lost souls wander here', type: 'event', x: 30, y: 20, unlocked: false, completed: false, connections: ['void_boss'] },
  { id: 'void_boss', title: 'Void Leviathan', description: 'Ancient horror from beyond', type: 'boss', x: 50, y: 20, unlocked: false, completed: false, connections: ['heaven_gates'], difficulty: 3 },
  
  // Final region - Heaven's Gates
  { id: 'heaven_gates', title: 'Heaven\'s Gates', description: 'The final barrier', type: 'story', x: 50, y: 10, unlocked: false, completed: false, connections: ['final_boss'] },
  { id: 'final_boss', title: 'The God Killer', description: 'Your true enemy revealed', type: 'boss', x: 50, y: 5, unlocked: false, completed: false, connections: [], difficulty: 5 }
];

export function MapSystem() {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showWeaponShop, setShowWeaponShop] = useState(false);
  const { startCombat } = useCombat();
  const { acts, currentAct, addCorruption } = useStory();
  const { addGold } = useWeaponShop();

  const getNodeColor = (node: MapNode) => {
    if (node.completed) return '#22c55e'; // Green
    if (!node.unlocked) return '#6b7280'; // Gray
    if (node.type === 'boss') return '#ef4444'; // Red
    if (node.type === 'gacha') return '#8b5cf6'; // Purple
    if (node.type === 'shop') return '#f59e0b'; // Amber
    if (node.type === 'event') return '#06b6d4'; // Cyan
    return '#3b82f6'; // Blue for story
  };

  const getNodeIcon = (node: MapNode) => {
    switch (node.type) {
      case 'boss': return '⚔️';
      case 'gacha': return '🎲';
      case 'shop': return '🏪';
      case 'event': return '⭐';
      default: return '📖';
    }
  };

  const handleNodeClick = (node: MapNode) => {
    if (!node.unlocked) return;
    setSelectedNode(node);
  };

  const handleNodeAction = () => {
    if (!selectedNode) return;
    
    switch (selectedNode.type) {
      case 'boss':
        // Start combat with specific boss
        startCombat(selectedNode.id);
        break;
      case 'gacha':
        // Open gacha system (placeholder)
        alert('Gacha system coming soon! Collect powerful characters and equipment.');
        break;
      case 'shop':
        // Open the weapon shop
        setShowWeaponShop(true);
        break;
      case 'story':
        // Handle specific story locations
        if (selectedNode.id === 'garden_gate') {
          alert('🌿 You discover ancient runes carved into the gate. They whisper of forgotten secrets...\n\n💰 +50 gold found in the ruins!');
          addGold(50);
        } else if (selectedNode.id === 'garden_fountain') {
          alert('⛲ The sacred waters still hold divine power. You feel your corruption lessening...\n\n🖤 Corruption reduced by 5 points!');
          addCorruption(-5);
        } else {
          // Generic story interaction
          alert('Story cutscene: ' + selectedNode.description);
        }
        break;
      case 'event':
        // Trigger special event (placeholder)
        alert('Special Event: ' + selectedNode.description);
        break;
    }
    setSelectedNode(null);
  };

  const getConnectionPath = (from: MapNode, to: MapNode) => {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-900/20 to-black flex items-center justify-center">
      <div className="w-full h-full max-w-6xl relative">
        {/* Map Title */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <h1 
            className="text-4xl font-bold text-white mb-2"
            style={{
              fontFamily: 'monospace',
              textShadow: '4px 4px 0px #000000',
              imageRendering: 'pixelated'
            }}
          >
            THE PATH OF VENGEANCE
          </h1>
          <p className="text-center text-gray-300">Choose your destination</p>
        </div>

        {/* SVG Map Container */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full absolute inset-0"
          style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }}
        >
          {/* Connection Lines */}
          {mapNodes.map(node => 
            node.connections.map(connectionId => {
              const targetNode = mapNodes.find(n => n.id === connectionId);
              if (!targetNode) return null;
              
              return (
                <motion.path
                  key={`${node.id}-${connectionId}`}
                  d={getConnectionPath(node, targetNode)}
                  stroke={node.unlocked && targetNode.unlocked ? '#4b5563' : '#374151'}
                  strokeWidth="0.2"
                  strokeDasharray={node.unlocked && targetNode.unlocked ? "0" : "0.5,0.5"}
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              );
            })
          )}

          {/* Map Nodes */}
          {mapNodes.map((node, index) => (
            <g key={node.id}>
              {/* Node glow effect */}
              {(node.unlocked || hoveredNode === node.id) && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="3"
                  fill={getNodeColor(node)}
                  opacity="0.3"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              
              {/* Main node */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="2"
                fill={getNodeColor(node)}
                stroke="#ffffff"
                strokeWidth="0.2"
                className="cursor-pointer"
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.2 }}
              />
              
              {/* Node difficulty indicator */}
              {node.difficulty && (
                <text
                  x={node.x}
                  y={node.y + 0.5}
                  textAnchor="middle"
                  fontSize="1"
                  fill="#ffffff"
                  style={{ fontWeight: 'bold' }}
                >
                  {node.difficulty}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Node Info Panel */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              className="absolute bottom-8 left-8 bg-black/90 border-2 border-gray-600 p-4 rounded-lg max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {(() => {
                const node = mapNodes.find(n => n.id === hoveredNode);
                if (!node) return null;
                
                return (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getNodeIcon(node)}</span>
                      <h3 className="text-white font-bold">{node.title}</h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{node.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        node.completed ? 'bg-green-600' : 
                        node.unlocked ? 'bg-blue-600' : 'bg-gray-600'
                      }`}>
                        {node.completed ? 'COMPLETED' : 
                         node.unlocked ? 'AVAILABLE' : 'LOCKED'}
                      </span>
                      {node.difficulty && (
                        <span className="px-2 py-1 bg-red-600 rounded text-xs">
                          Difficulty: {node.difficulty}
                        </span>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Node Selection Modal */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-900 border-2 border-gray-600 p-8 rounded-lg max-w-md mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{getNodeIcon(selectedNode)}</div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedNode.title}</h2>
                  <p className="text-gray-300 mb-6">{selectedNode.description}</p>
                  
                  {selectedNode.difficulty && (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-red-600 rounded text-sm">
                        Difficulty: {selectedNode.difficulty}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleNodeAction}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
                    >
                      {selectedNode.type === 'boss' ? 'CHALLENGE' :
                       selectedNode.type === 'gacha' ? 'SUMMON' :
                       selectedNode.type === 'shop' ? 'ENTER SHOP' :
                       selectedNode.type === 'story' ? 'READ STORY' : 'EXPLORE'}
                    </button>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Story Button */}
        <button
          onClick={() => {
            const { setGamePhase } = useCombat.getState();
            setGamePhase('story');
          }}
          className="absolute top-8 left-8 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
        >
          ← Back to Acts
        </button>
      </div>
      
      {/* Weapon Shop Modal */}
      <WeaponShop 
        isVisible={showWeaponShop} 
        onClose={() => setShowWeaponShop(false)} 
      />
    </div>
  );
}