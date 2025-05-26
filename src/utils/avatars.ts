import { CatAvatar } from '../types';

export const generateAvatarUrl = (avatar: CatAvatar): string => {
  // In a real implementation, this would generate a unique avatar
  // For this example, we'll use a placeholder image based on the avatar options
  
  // Let's just return a stock photo based on mood for the demo
  const moodImages: Record<string, string> = {
    'happy': 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=300',
    'grumpy': 'https://images.pexels.com/photos/156934/pexels-photo-156934.jpeg?auto=compress&cs=tinysrgb&w=300',
    'sleepy': 'https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&cs=tinysrgb&w=300',
    'excited': 'https://images.pexels.com/photos/1521304/pexels-photo-1521304.jpeg?auto=compress&cs=tinysrgb&w=300'
  };
  
  return moodImages[avatar.mood] || 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=300';
};