import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { AvatarOptions, CatAvatar } from '../types';
import { catColors, catAccessories, catMoods } from '../data/avatars';
import { Palette, ShirtIcon, SmileIcon } from 'lucide-react';

interface AvatarCustomizerProps {
  currentAvatar: CatAvatar;
  onClose: () => void;
}

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ 
  currentAvatar, 
  onClose 
}) => {
  const { updateAvatar } = useGame();
  const [avatar, setAvatar] = useState<CatAvatar>(currentAvatar);
  const [activeTab, setActiveTab] = useState<'color' | 'accessory' | 'mood'>('color');

  const handleChange = (option: keyof CatAvatar, value: string) => {
    setAvatar(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleSave = () => {
    updateAvatar(avatar);
    onClose();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'color':
        return (
          <div className="grid grid-cols-3 gap-3">
            {catColors.map(color => (
              <button
                key={color.value}
                onClick={() => handleChange('color', color.value)}
                className={`p-2 rounded-lg transition-all ${
                  avatar.color === color.value
                    ? 'ring-2 ring-amber-500 bg-amber-100 dark:bg-amber-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div 
                  className="w-full h-12 rounded-md mb-1"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        );
      
      case 'accessory':
        return (
          <div className="grid grid-cols-2 gap-3">
            {catAccessories.map(accessory => (
              <button
                key={accessory.value}
                onClick={() => handleChange('accessory', accessory.value)}
                className={`p-2 rounded-lg transition-all ${
                  avatar.accessory === accessory.value
                    ? 'ring-2 ring-amber-500 bg-amber-100 dark:bg-amber-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex justify-center mb-1">
                  <img 
                    src={accessory.image} 
                    alt={accessory.name}
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 block text-center">
                  {accessory.name}
                </span>
              </button>
            ))}
          </div>
        );
      
      case 'mood':
        return (
          <div className="grid grid-cols-2 gap-3">
            {catMoods.map(mood => (
              <button
                key={mood.value}
                onClick={() => handleChange('mood', mood.value)}
                className={`p-2 rounded-lg transition-all ${
                  avatar.mood === mood.value
                    ? 'ring-2 ring-amber-500 bg-amber-100 dark:bg-amber-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex justify-center mb-1">
                  <img 
                    src={mood.image} 
                    alt={mood.name}
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 block text-center">
                  {mood.name}
                </span>
              </button>
            ))}
          </div>
        );
    }
  };

  const getAvatarPreview = () => {
    // In a real implementation, this would generate the avatar based on options
    // For this example, we'll use a placeholder
    return `https://images.pexels.com/photos/320014/pexels-photo-320014.jpeg?auto=compress&cs=tinysrgb&w=300`;
  };

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="bg-amber-100 dark:bg-gray-700 p-4 rounded-xl">
          <img 
            src={getAvatarPreview()} 
            alt="Your cat avatar"
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
      </div>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          onClick={() => setActiveTab('color')}
          className={`flex items-center gap-2 px-4 py-2 font-medium text-sm ${
            activeTab === 'color'
              ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
          }`}
        >
          <Palette size={16} />
          <span>Color</span>
        </button>
        <button
          onClick={() => setActiveTab('accessory')}
          className={`flex items-center gap-2 px-4 py-2 font-medium text-sm ${
            activeTab === 'accessory'
              ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
          }`}
        >
          <ShirtIcon size={16} />
          <span>Accessory</span>
        </button>
        <button
          onClick={() => setActiveTab('mood')}
          className={`flex items-center gap-2 px-4 py-2 font-medium text-sm ${
            activeTab === 'mood'
              ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
          }`}
        >
          <SmileIcon size={16} />
          <span>Mood</span>
        </button>
      </div>
      
      <div className="mb-6">
        {renderTabContent()}
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AvatarCustomizer;