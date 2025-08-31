export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  color: string;
}

export const categories: Category[] = [
  {
    id: 'booster-box',
    name: 'Booster Box',
    description:
      'Factory-sealed box containing multiple booster packs.',
    icon: 'Package',
    color: 'from-pokemon-red to-red-600',
  },
  {
    id: 'elite-trainer',
    name: 'Elite Trainer Boxes',
    description:
      'Premium box with booster packs plus accessories for gameplay.',
    icon: 'Star',
    color: 'from-pokemon-yellow to-yellow-500',
  },
  {
    id: 'japanese-sets',
    name: 'Collection Box / Premium Collection',
    description: 'High-end set with exclusive promos and merchandise.',
    icon: 'Globe',
    color: 'from-pokemon-blue to-blue-600',
  },
  {
    id: 'single-packs',
    name: 'Build & Battle Box',
    description: "Pre-release kit used for tournaments before a set's release.",
    icon: 'Clock',
    color: 'from-purple-500 to-purple-700',
  },
];
