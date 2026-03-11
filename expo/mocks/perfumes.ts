export interface PerfumePod {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  top: string;
  middle: string;
  base: string;
  description: string;
  accent: string;
}

export const perfumes: PerfumePod[] = [
  {
    id: 1,
    name: 'Lumière Noire',
    price: 129,
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea081e66b5d?w=800&q=80',
    top: 'Bergamot',
    middle: 'Rose',
    base: 'Oud',
    description: 'A bold, mysterious fragrance that opens with the brightness of Bergamot, unfolds into the timeless elegance of Turkish Rose, and settles into the deep, smoky warmth of rare Oud wood.',
    accent: '#8B6914',
  },
  {
    id: 2,
    name: 'Éclat d\'Or',
    price: 149,
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    top: 'Mandarin',
    middle: 'Jasmine',
    base: 'Sandalwood',
    description: 'Radiant and golden, this scent captures the first light of dawn. Sparkling Mandarin gives way to intoxicating night-blooming Jasmine, resting on a bed of creamy Australian Sandalwood.',
    accent: '#D4AF37',
  },
  {
    id: 3,
    name: 'Nuit Éternelle',
    price: 119,
    imageUrl: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800&q=80',
    top: 'Lavender',
    middle: 'Vetiver',
    base: 'Amber',
    description: 'The essence of an endless midnight. French Lavender whispers through fields of smoky Haitian Vetiver, while warm Baltic Amber envelops you in a timeless, hypnotic embrace.',
    accent: '#4A3A6B',
  },
  {
    id: 4,
    name: 'Essence Royale',
    price: 179,
    imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
    top: 'Ylang-Ylang',
    middle: 'Patchouli',
    base: 'Vanilla',
    description: 'Fit for royalty. Exotic Ylang-Ylang from the Comoros Islands intertwines with earthy Indonesian Patchouli, culminating in the rich, gourmand depth of Madagascar Vanilla.',
    accent: '#6B2D5B',
  },
  {
    id: 5,
    name: 'Aurore Infinie',
    price: 139,
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
    top: 'Neroli',
    middle: 'Peony',
    base: 'Musk',
    description: 'An infinite sunrise captured in a bottle. Delicate Neroli blossoms dance with romantic Peony petals, dissolving into the soft, sensual whisper of White Musk.',
    accent: '#B5651D',
  },
];
