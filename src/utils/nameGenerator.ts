const ADJECTIVES = [
  'Agile', 'Brave', 'Creative', 'Dynamic', 'Elegant', 'Fearless',
  'Gallant', 'Heroic', 'Innovative', 'Jubilant', 'Keen', 'Legendary',
  'Magnificent', 'Noble', 'Optimistic', 'Powerful', 'Quick', 'Radiant',
  'Stellar', 'Tenacious', 'Unwavering', 'Valiant', 'Wise', 'Exemplary',
  'Youthful', 'Zealous', 'Animated', 'Impressive'
];

const NOUNS = [
  'Aardvark', 'Bison', 'Cheetah', 'Dolphin', 'Eagle', 'Falcon', 'Gerbil',
  'Hawk', 'Iguana', 'Jaguar', 'Koala', 'Lemur', 'Macaw', 'Narwhal',
  'Ocelot', 'Panther', 'Quokka', 'Rhino', 'Salamander', 'Tiger',
  'Urial', 'Vulture', 'Walrus', 'Xerus', 'Yak', 'Zebra', 'Porcupine'
];

export const generateCreativeName = (): string => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
};
