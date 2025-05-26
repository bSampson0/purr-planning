import { createContext, useContext, ReactNode, useState } from 'react';

// Sound types
type SoundType = 'meow' | 'purr' | 'hiss';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (sound: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

interface SoundProviderProps {
  children: ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Sound URLs
  const sounds: Record<SoundType, string> = {
    meow: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3',
    purr: 'https://assets.mixkit.co/active_storage/sfx/2532/2532-preview.mp3',
    hiss: 'https://assets.mixkit.co/active_storage/sfx/2531/2531-preview.mp3'
  };
  
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };
  
  const playSound = (sound: SoundType) => {
    if (!soundEnabled) return;
    
    const audio = new Audio(sounds[sound]);
    audio.volume = 0.5; // Set volume to 50%
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playSound
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};