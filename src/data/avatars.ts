import { CatColor, CatAccessory, CatMood } from '../types';

export const catColors: CatColor[] = [
  { name: 'Orange', value: 'orange', hex: '#f97316' },
  { name: 'Black', value: 'black', hex: '#1f2937' },
  { name: 'White', value: 'white', hex: '#f9fafb' },
  { name: 'Gray', value: 'gray', hex: '#9ca3af' },
  { name: 'Brown', value: 'brown', hex: '#a16207' },
  { name: 'Calico', value: 'calico', hex: '#fde68a' }
];

export const catAccessories: CatAccessory[] = [
  { 
    name: 'None', 
    value: 'none',
    image: 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  { 
    name: 'Bow Tie', 
    value: 'bowtie',
    image: 'https://images.pexels.com/photos/1687831/pexels-photo-1687831.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  { 
    name: 'Glasses', 
    value: 'glasses',
    image: 'https://images.pexels.com/photos/35888/amazing-beautiful-unbelievable-scary.jpg?auto=compress&cs=tinysrgb&w=300'
  },
  { 
    name: 'Scarf', 
    value: 'scarf',
    image: 'https://images.pexels.com/photos/1687932/pexels-photo-1687932.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

export const catMoods: CatMood[] = [
  { 
    name: 'Happy', 
    value: 'happy',
    image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  { 
    name: 'Grumpy', 
    value: 'grumpy',
    image: 'https://images.pexels.com/photos/156934/pexels-photo-156934.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  { 
    name: 'Sleepy', 
    value: 'sleepy',
    image: 'https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  { 
    name: 'Excited', 
    value: 'excited',
    image: 'https://images.pexels.com/photos/1521304/pexels-photo-1521304.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];