import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { CatAvatar, MedievalAvatar } from '../types';
import { catColors, catAccessories, catMoods, medievalRanks, medievalArmor, medievalWeapons } from '../data/avatars';
import { Palette, ShirtIcon, SmileIcon, Crown, Shield, Sword } from 'lucide-react';

interface AvatarCustomizerProps {
  currentAvatar: CatAvatar | MedievalAvatar;
  onClose: () => void;
}

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  currentAvatar,
  onClose
}) => {
  const { updateAvatar, updateMedievalAvatar } = useGame();
  const { visualTheme } = useTheme();
  const [catAvatar, setCatAvatar] = useState<CatAvatar>(
    'color' in currentAvatar ? currentAvatar : { color: 'orange', accessory: 'none', mood: 'happy' }
  );
  const [medievalAvatar, setMedievalAvatar] = useState<MedievalAvatar>(
    'rank' in currentAvatar ? currentAvatar : { rank: 'squire', armor: 'cloth', weapon: 'dagger' }
  );
  const [activeTab, setActiveTab] = useState<string>(visualTheme === 'cat' ? 'color' : 'rank');

  const handleCatChange = (option: keyof CatAvatar, value: string) => {
    setCatAvatar(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleMedievalChange = (option: keyof MedievalAvatar, value: string) => {
    setMedievalAvatar(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleSave = () => {
    if (visualTheme === 'cat') {
      updateAvatar(catAvatar);
    } else {
      updateMedievalAvatar(medievalAvatar);
    }
    onClose();
  };

  const renderTabContent = () => {
    if (visualTheme === 'cat') {
      switch (activeTab) {
        case 'color':
          return (
            <div className="grid grid-cols-3 gap-3">
              {catColors.map(color => (
                <button
                  key={color.value}
                  onClick={() => handleCatChange('color', color.value)}
                  className={`p-2 rounded-lg transition-all ${
                    catAvatar.color === color.value
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
                  onClick={() => handleCatChange('accessory', accessory.value)}
                  className={`p-2 rounded-lg transition-all ${
                    catAvatar.accessory === accessory.value
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
                  onClick={() => handleCatChange('mood', mood.value)}
                  className={`p-2 rounded-lg transition-all ${
                    catAvatar.mood === mood.value
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
    } else {
      // Medieval theme
      switch (activeTab) {
        case 'rank':
          return (
            <div className="grid grid-cols-3 gap-3">
              {medievalRanks.map(rank => (
                <button
                  key={rank.value}
                  onClick={() => handleMedievalChange('rank', rank.value)}
                  className={`p-2 rounded-lg transition-all ${
                    medievalAvatar.rank === rank.value
                      ? 'ring-2 ring-red-500 bg-red-100 dark:bg-red-900/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div
                    className="w-full h-12 rounded-md mb-1"
                    style={{ backgroundColor: rank.color }}
                  />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {rank.name}
                  </span>
                </button>
              ))}
            </div>
          );

        case 'armor':
          return (
            <div className="grid grid-cols-2 gap-3">
              {medievalArmor.map(armor => (
                <button
                  key={armor.value}
                  onClick={() => handleMedievalChange('armor', armor.value)}
                  className={`p-2 rounded-lg transition-all ${
                    medievalAvatar.armor === armor.value
                      ? 'ring-2 ring-red-500 bg-red-100 dark:bg-red-900/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-center mb-1">
                    <img
                      src={armor.image}
                      alt={armor.name}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 block text-center">
                    {armor.name}
                  </span>
                </button>
              ))}
            </div>
          );

        case 'weapon':
          return (
            <div className="grid grid-cols-2 gap-3">
              {medievalWeapons.map(weapon => (
                <button
                  key={weapon.value}
                  onClick={() => handleMedievalChange('weapon', weapon.value)}
                  className={`p-2 rounded-lg transition-all ${
                    medievalAvatar.weapon === weapon.value
                      ? 'ring-2 ring-red-500 bg-red-100 dark:bg-red-900/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-center mb-1">
                    <img
                      src={weapon.image}
                      alt={weapon.name}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 block text-center">
                    {weapon.name}
                  </span>
                </button>
              ))}
            </div>
          );
      }
    }
  };

  const getAvatarPreview = () => {
    if (visualTheme === 'cat') {
      return `https://images.pexels.com/photos/320014/pexels-photo-320014.jpeg?auto=compress&cs=tinysrgb&w=300`;
    } else {
      return `/images/medieval-cats/${medievalAvatar.rank === 'king' ? 'twentyone' : 'five'}.png`;
    }
  };

  const primaryColor = visualTheme === 'cat' ? 'amber' : 'red';

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className={`${visualTheme === 'cat' ? 'bg-amber-100 dark:bg-gray-700' : 'bg-red-100 dark:bg-gray-700'} p-4 rounded-xl`}>
          <img
            src={getAvatarPreview()}
            alt={visualTheme === 'cat' ? 'Your cat avatar' : 'Your knight avatar'}
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {visualTheme === 'cat' ? (
          <>
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
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('rank')}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm ${
                activeTab === 'rank'
                  ? 'border-b-2 border-red-500 text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              <Crown size={16} />
              <span>Rank</span>
            </button>
            <button
              onClick={() => setActiveTab('armor')}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm ${
                activeTab === 'armor'
                  ? 'border-b-2 border-red-500 text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              <Shield size={16} />
              <span>Armor</span>
            </button>
            <button
              onClick={() => setActiveTab('weapon')}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm ${
                activeTab === 'weapon'
                  ? 'border-b-2 border-red-500 text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              <Sword size={16} />
              <span>Weapon</span>
            </button>
          </>
        )}
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
          className={`px-4 py-2 ${
            visualTheme === 'cat'
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-red-600 hover:bg-red-700'
          } text-white rounded-lg transition-colors duration-200`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AvatarCustomizer;