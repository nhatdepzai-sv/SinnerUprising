import { StoryAct, GameState } from '../types/game';

export const initialStoryActs: StoryAct[] = [
  {
    id: 'betrayal',
    title: 'The Betrayal',
    description: 'The day the gods abandoned their most faithful servant...',
    dialogue: [
      'You were their chosen champion, their most devoted follower.',
      'For years, you served with unwavering faith and righteousness.',
      'But when you needed them most, they turned their backs on you.',
      'Your prayers went unanswered, your sacrifices forgotten.',
      'They left you to die in the darkness of their own making.',
      'But you survived... and someone else took notice.'
    ],
    bossId: 'god_of_war',
    unlocked: true,
    completed: false
  },
  {
    id: 'the_pact',
    title: 'The Dark Pact',
    description: 'A voice from the shadows offers power beyond imagination...',
    dialogue: [
      'In your darkest hour, when all hope was lost, you heard a voice.',
      'It whispered promises of power, of revenge, of justice.',
      '"The gods who betrayed you," it said, "they fear me."',
      '"I am the God Killer, and I choose you as my instrument."',
      '"Accept my gifts, and together we shall bring divine judgment."',
      'You had nothing left to lose. You accepted.'
    ],
    bossId: 'god_of_wisdom',
    unlocked: false,
    completed: false
  },
  {
    id: 'divine_hunt',
    title: 'The Divine Hunt',
    description: 'Armed with dark power, you begin your quest for vengeance...',
    dialogue: [
      'The God Killer\'s power flows through you like molten darkness.',
      'Your once-holy abilities are now tainted with shadow.',
      'You can feel them - the gods who betrayed you.',
      'They sense your presence, your newfound strength.',
      'Fear creeps into their immortal hearts.',
      'The hunt begins now.'
    ],
    bossId: 'god_of_nature',
    unlocked: false,
    completed: false
  },
  {
    id: 'storm_of_wrath',
    title: 'Storm of Wrath',
    description: 'The heavens themselves shake as divine blood is spilled...',
    dialogue: [
      'Three gods have fallen by your hand.',
      'The heavens rage with storms and lightning.',
      'The remaining deities cower in their celestial realm.',
      'But something feels wrong... the God Killer\'s voice grows stronger.',
      'Its whispers are becoming commands.',
      'You begin to wonder... who is truly in control?'
    ],
    bossId: 'god_of_storms',
    unlocked: false,
    completed: false
  },
  {
    id: 'deaths_embrace',
    title: 'Death\'s Embrace',
    description: 'The final god stands before you, but the truth emerges...',
    dialogue: [
      'Before you stands the God of Death, ancient and terrible.',
      '"You fool," it speaks, "do you not see what you have become?"',
      '"The God Killer has made you its puppet."',
      '"With each divine life you\'ve taken, you\'ve fed its power."',
      '"You are no longer the champion of justice..."',
      '"You are the harbinger of the end of all things."'
    ],
    bossId: 'god_of_death',
    unlocked: false,
    completed: false
  },
  {
    id: 'the_truth',
    title: 'The Terrible Truth',
    description: 'As the last god falls, the God Killer reveals its true nature...',
    dialogue: [
      'With the God of Death\'s final breath, the world grows cold.',
      'The God Killer\'s laughter echoes through reality itself.',
      '"Perfect," it purrs. "All divine power now flows through you."',
      '"You were never my chosen champion..."',
      '"You were my vessel, my way into this realm."',
      '"The gods did not abandon you... I made sure they would."',
      'Horror fills your heart as the truth becomes clear.',
      'You have doomed everything you once sought to protect.'
    ],
    bossId: 'final_boss',
    unlocked: false,
    completed: false
  },
  {
    id: 'the_awakening',
    title: 'The Awakening',
    description: 'You realize the God Killer\'s control and fight back...',
    dialogue: [
      'In the depths of despair, something stirs within you.',
      'A memory of who you once were, before the corruption.',
      'The faces of those you swore to protect flash before your eyes.',
      'You realize the God Killer has been feeding on your despair.',
      'With tremendous effort, you begin to resist its influence.',
      'For the first time in ages, you feel hope.'
    ],
    bossId: 'corrupted_self',
    unlocked: false,
    completed: false
  },
  {
    id: 'divine_rebellion',
    title: 'Divine Rebellion',
    description: 'The surviving angels rally to help you break free...',
    dialogue: [
      'From the heavens, a chorus of voices calls out to you.',
      'The surviving angels, witnessing your struggle, descend.',
      '"We will not let evil triumph," they declare in unison.',
      'Together, you and the celestial beings fight the God Killer.',
      'Their pure light begins to cleanse the corruption within you.',
      'But the God Killer will not surrender its vessel easily.'
    ],
    bossId: 'god_killer_avatar',
    unlocked: false,
    completed: false
  },
  {
    id: 'final_redemption',
    title: 'The Final Redemption',
    description: 'Your ultimate choice determines the fate of all realms...',
    dialogue: [
      'You stand at the precipice between light and darkness.',
      'The God Killer rages, its true form finally revealed.',
      'All the pain, betrayal, and corruption weighs upon you.',
      'But so does every life you ever saved, every prayer answered.',
      'This is your moment of choice: revenge or redemption.',
      'The fate of every realm hangs in the balance.'
    ],
    bossId: 'true_god_killer',
    unlocked: false,
    completed: false
  }
];

export const initialGameState: GameState = {
  currentAct: 0,
  acts: initialStoryActs,
  protagonist: {
    id: 'protagonist',
    name: 'Aiden',
    title: 'The Betrayed',
    maxHealth: 100,
    currentHealth: 100,
    maxMana: 50,
    currentMana: 50,
    level: 1,
    corruption: 0,
    skills: [],
    resistances: {
      slash: 'normal',
      pierce: 'normal',
      blunt: 'normal'
    },
    elementAffinities: ['light', 'divine'],
    sprite: 'protagonist_pure',
    position: [0, 0]
  },
  defeatedGods: [],
  corruptionLevel: 0,
  hasReachedFinalBoss: false
};

export function getCorruptionTitle(corruption: number): string {
  if (corruption >= 90) return 'The God Killer\'s Avatar';
  if (corruption >= 70) return 'The Corrupted Champion';
  if (corruption >= 50) return 'The Fallen Paladin';
  if (corruption >= 30) return 'The Doubting Faithful';
  if (corruption >= 10) return 'The Questioning Believer';
  return 'The Pure of Heart';
}

export function updateProtagonistForCorruption(protagonist: any, corruption: number) {
  const updatedProtagonist = { ...protagonist };
  
  // Update title based on corruption
  updatedProtagonist.title = getCorruptionTitle(corruption);
  
  // Update sprite based on corruption
  if (corruption >= 70) {
    updatedProtagonist.sprite = 'protagonist_corrupted';
    updatedProtagonist.elementAffinities = ['dark', 'divine'];
  } else if (corruption >= 30) {
    updatedProtagonist.sprite = 'protagonist_conflicted';
    updatedProtagonist.elementAffinities = ['light', 'dark'];
  } else {
    updatedProtagonist.sprite = 'protagonist_pure';
    updatedProtagonist.elementAffinities = ['light', 'divine'];
  }
  
  // Update skills based on corruption level
  if (corruption >= 70) {
    // Highly corrupted - access to dark powers
    updatedProtagonist.skills = [
      {
        id: 'vengeful_slash',
        name: 'Vengeful Slash',
        elementType: 'dark',
        damageType: 'slash',
        basePower: 16,
        manaCost: 12,
        description: 'A strike fueled by burning hatred and betrayal.'
      },
      {
        id: 'dark_covenant',
        name: 'Dark Covenant', 
        elementType: 'dark',
        damageType: 'blunt',
        basePower: 0,
        manaCost: 18,
        description: 'Draws power from the god killer\'s influence.'
      },
      {
        id: 'god_slayer_technique',
        name: 'God Slayer Technique',
        elementType: 'dark',
        damageType: 'pierce', 
        basePower: 25,
        manaCost: 25,
        description: 'The ultimate technique taught by the god killer.'
      }
    ];
  } else if (corruption >= 30) {
    // Conflicted - mix of light and dark
    updatedProtagonist.skills = [
      {
        id: 'conflicted_strike',
        name: 'Conflicted Strike',
        elementType: 'light',
        damageType: 'slash',
        basePower: 14,
        manaCost: 10,
        description: 'A strike torn between righteousness and vengeance.'
      },
      {
        id: 'shadow_prayer',
        name: 'Shadow Prayer',
        elementType: 'dark', 
        damageType: 'pierce',
        basePower: 12,
        manaCost: 15,
        description: 'A prayer to powers that should not be named.'
      }
    ];
  } else {
    // Pure - holy powers
    updatedProtagonist.skills = [
      {
        id: 'holy_strike',
        name: 'Holy Strike',
        elementType: 'light',
        damageType: 'slash',
        basePower: 12,
        manaCost: 10,
        description: 'A righteous attack blessed by divine light.'
      },
      {
        id: 'divine_protection',
        name: 'Divine Protection',
        elementType: 'light',
        damageType: 'blunt',
        basePower: 0,
        manaCost: 15,
        description: 'Calls upon divine blessing for protection.'
      }
    ];
  }
  
  return updatedProtagonist;
}