import { useState } from 'react';
import { useWeaponShop } from '../../lib/stores/useWeaponShop';
import { useCharacters } from '../../lib/stores/useCharacters';
import { useCombat } from '../../lib/stores/useCombat';
import { Button } from './button';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

interface WeaponShopProps {
  isVisible: boolean;
  onClose: () => void;
}

export function WeaponShop({ isVisible, onClose }: WeaponShopProps) {
  const { availableWeapons, inventory, playerGold, buyWeapon, sellWeapon } = useWeaponShop();
  const { selectedTeam, equipWeapon, unequipWeapon, upgradeCharacterStrength } = useCharacters();
  const { collectedOrbs, spendOrbs } = useCombat();
  const [selectedTab, setSelectedTab] = useState('shop');

  if (!isVisible) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500';
      case 'rare': return 'border-blue-500';
      case 'epic': return 'border-purple-500';
      case 'legendary': return 'border-orange-500';
      default: return 'border-gray-500';
    }
  };

  const handleBuyWeapon = (weaponId: string) => {
    const success = buyWeapon(weaponId);
    if (success) {
      console.log('Weapon purchased successfully!');
    } else {
      console.log('Not enough gold or weapon not available!');
    }
  };

  const handleSellWeapon = (weaponId: string) => {
    const success = sellWeapon(weaponId);
    if (success) {
      console.log('Weapon sold successfully!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">⚔️ Weapon Shop</CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-yellow-400 text-lg">💰 {playerGold} Gold</span>
              <span className="text-blue-400 text-lg">🔮 {collectedOrbs} Orbs</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-600 hover:bg-gray-800"
          >
            ✕ Close
          </Button>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="shop" className="text-white data-[state=active]:bg-gray-700">
                🛒 Shop
              </TabsTrigger>
              <TabsTrigger value="inventory" className="text-white data-[state=active]:bg-gray-700">
                🎒 Inventory ({inventory.length})
              </TabsTrigger>
              <TabsTrigger value="upgrades" className="text-white data-[state=active]:bg-gray-700">
                ⚡ Upgrades
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="shop" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableWeapons.map((weapon) => (
                  <Card key={weapon.id} className={`bg-gray-800 border-2 ${getRarityBorder(weapon.rarity)}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{weapon.name}</CardTitle>
                        <Badge className={`${getRarityColor(weapon.rarity)} text-white`}>
                          {weapon.rarity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{weapon.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="text-sm">
                          <p className="font-semibold mb-1">Skills:</p>
                          {weapon.skills.map((skill) => (
                            <div key={skill.id} className="ml-2 text-gray-300">
                              • {skill.name} ({skill.basePower} power, {skill.manaCost} mana)
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-sm">
                          <p className="font-semibold mb-1">Stat Boosts:</p>
                          <div className="ml-2 text-gray-300">
                            Attack: +{weapon.statBoosts.attack} | 
                            Defense: +{weapon.statBoosts.defense} | 
                            Speed: +{weapon.statBoosts.speed}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-400 font-bold">💰 {weapon.price} Gold</span>
                          <Button
                            onClick={() => handleBuyWeapon(weapon.id)}
                            disabled={playerGold < weapon.price}
                            className="bg-green-700 hover:bg-green-600 disabled:bg-gray-600"
                            size="sm"
                          >
                            {playerGold >= weapon.price ? 'Buy' : 'Too Expensive'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="mt-4">
              {inventory.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <p>Your inventory is empty!</p>
                  <p className="text-sm mt-2">Buy some weapons from the shop to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inventory.map((weapon) => (
                    <Card key={weapon.id} className={`bg-gray-800 border-2 ${getRarityBorder(weapon.rarity)}`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{weapon.name}</CardTitle>
                          <Badge className={`${getRarityColor(weapon.rarity)} text-white`}>
                            {weapon.rarity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{weapon.description}</p>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="text-sm">
                            <p className="font-semibold mb-1">Skills:</p>
                            {weapon.skills.map((skill) => (
                              <div key={skill.id} className="ml-2 text-gray-300">
                                • {skill.name} ({skill.basePower} power, {skill.manaCost} mana)
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-yellow-400">Sell: 💰 {Math.floor(weapon.price * 0.6)} Gold</span>
                            <div className="space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => equipWeapon(selectedTeam[0]?.id, weapon.id)}
                                size="sm"
                                className="border-blue-600 text-blue-400 hover:bg-blue-900"
                              >
                                Equip
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleSellWeapon(weapon.id)}
                                size="sm"
                                className="border-red-600 text-red-400 hover:bg-red-900"
                              >
                                Sell
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upgrades" className="mt-4">
              <div className="space-y-4">
                <div className="bg-gray-800 border border-blue-600 rounded-lg p-4">
                  <h3 className="text-xl font-bold text-blue-300 mb-2">⚡ Strength Upgrades</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Use collected orbs to permanently increase your characters' strength!
                  </p>
                  
                  {selectedTeam.length === 0 ? (
                    <div className="text-center text-gray-400 py-4">
                      No characters available for upgrade.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedTeam.map((character) => (
                        <div key={character.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h4 className="text-lg font-semibold text-white">{character.name}</h4>
                              <p className="text-sm text-gray-400">{character.title}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-red-400 font-bold">
                                Current Strength: +{character.strengthBonus || 0}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-gray-800 rounded p-3 border border-gray-600">
                              <h5 className="text-sm font-semibold text-green-400 mb-2">Small Upgrade (+1 Strength)</h5>
                              <p className="text-xs text-gray-400 mb-2">Cost: 2 Orbs</p>
                              <Button
                                onClick={() => {
                                  if (spendOrbs(2)) {
                                    upgradeCharacterStrength(character.id, 1);
                                  }
                                }}
                                disabled={collectedOrbs < 2}
                                size="sm"
                                className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-600"
                              >
                                {collectedOrbs >= 2 ? 'Upgrade' : 'Need 2 Orbs'}
                              </Button>
                            </div>
                            
                            <div className="bg-gray-800 rounded p-3 border border-gray-600">
                              <h5 className="text-sm font-semibold text-blue-400 mb-2">Medium Upgrade (+2 Strength)</h5>
                              <p className="text-xs text-gray-400 mb-2">Cost: 3 Orbs</p>
                              <Button
                                onClick={() => {
                                  if (spendOrbs(3)) {
                                    upgradeCharacterStrength(character.id, 2);
                                  }
                                }}
                                disabled={collectedOrbs < 3}
                                size="sm"
                                className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-gray-600"
                              >
                                {collectedOrbs >= 3 ? 'Upgrade' : 'Need 3 Orbs'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-2">💡 How to Get Orbs</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Orbs spawn randomly during combat battles</li>
                    <li>• Click on orbs quickly before they disappear</li>
                    <li>• Each orb collected gives you 1 orb to spend here</li>
                    <li>• Strength upgrades are permanent and carry between battles</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}