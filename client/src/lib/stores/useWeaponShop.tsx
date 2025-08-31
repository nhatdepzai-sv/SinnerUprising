import { create } from 'zustand';
import { Skill } from '../../types/game';

interface Weapon {
  id: string;
  name: string;
  description: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  skills: Skill[];
  statBoosts: {
    attack: number;
    defense: number;
    speed: number;
  };
}

interface WeaponShopState {
  availableWeapons: Weapon[];
  playerGold: number;
  inventory: Weapon[];
  
  // Actions
  buyWeapon: (weaponId: string) => boolean;
  sellWeapon: (weaponId: string) => boolean;
  equipWeapon: (characterId: string, weaponId: string) => void;
  unequipWeapon: (characterId: string) => void;
  addGold: (amount: number) => void;
}

const defaultWeapons: Weapon[] = [
  {
    id: 'iron_sword',
    name: 'Iron Sword',
    description: 'A basic sword forged from iron. Reliable and sturdy.',
    price: 100,
    rarity: 'common',
    skills: [
      {
        id: 'slash_attack',
        name: 'Slash Attack',
        elementType: 'light',
        damageType: 'slash',
        basePower: 15,
        manaCost: 8,
        description: 'A swift slashing attack.'
      }
    ],
    statBoosts: { attack: 5, defense: 0, speed: 0 }
  },
  {
    id: 'blessed_mace',
    name: 'Blessed Mace',
    description: 'A holy weapon blessed by divine light.',
    price: 250,
    rarity: 'rare',
    skills: [
      {
        id: 'divine_smite',
        name: 'Divine Smite',
        elementType: 'light',
        damageType: 'blunt',
        basePower: 20,
        manaCost: 12,
        description: 'Calls down divine judgment.'
      }
    ],
    statBoosts: { attack: 8, defense: 3, speed: 0 }
  },
  {
    id: 'shadow_dagger',
    name: 'Shadow Dagger',
    description: 'A dark blade that whispers of vengeance.',
    price: 300,
    rarity: 'rare',
    skills: [
      {
        id: 'shadow_strike',
        name: 'Shadow Strike',
        elementType: 'dark',
        damageType: 'pierce',
        basePower: 18,
        manaCost: 10,
        description: 'Strikes from the shadows.'
      }
    ],
    statBoosts: { attack: 6, defense: 0, speed: 8 }
  },
  {
    id: 'godslayer_blade',
    name: 'Godslayer Blade',
    description: 'A legendary weapon capable of harming divine beings.',
    price: 1000,
    rarity: 'legendary',
    skills: [
      {
        id: 'divine_rend',
        name: 'Divine Rend',
        elementType: 'dark',
        damageType: 'slash',
        basePower: 35,
        manaCost: 25,
        description: 'Tears through divine protection.'
      }
    ],
    statBoosts: { attack: 15, defense: 5, speed: 5 }
  }
];

export const useWeaponShop = create<WeaponShopState>((set, get) => ({
  availableWeapons: defaultWeapons,
  playerGold: 500, // Starting gold
  inventory: [],
  
  buyWeapon: (weaponId: string) => {
    const { availableWeapons, playerGold, inventory } = get();
    const weapon = availableWeapons.find(w => w.id === weaponId);
    
    if (!weapon || playerGold < weapon.price) {
      return false;
    }
    
    set({
      playerGold: playerGold - weapon.price,
      inventory: [...inventory, weapon]
    });
    
    return true;
  },
  
  sellWeapon: (weaponId: string) => {
    const { inventory, playerGold } = get();
    const weapon = inventory.find(w => w.id === weaponId);
    
    if (!weapon) {
      return false;
    }
    
    const sellPrice = Math.floor(weapon.price * 0.6); // 60% of original price
    
    set({
      playerGold: playerGold + sellPrice,
      inventory: inventory.filter(w => w.id !== weaponId)
    });
    
    return true;
  },
  
  equipWeapon: (characterId: string, weaponId: string) => {
    // This will be implemented when we integrate with character system
    console.log(`Equipping weapon ${weaponId} to character ${characterId}`);
  },
  
  unequipWeapon: (characterId: string) => {
    console.log(`Unequipping weapon from character ${characterId}`);
  },
  
  addGold: (amount: number) => {
    const { playerGold } = get();
    set({ playerGold: playerGold + amount });
  }
}));