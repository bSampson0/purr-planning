import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Cat } from 'lucide-react';
import { useSound } from '../context/SoundContext';

// ...existing imports...

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const { soundEnabled, toggleSound } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-10 transition-all duration-300 ${
        scrolled 
          ? 'bg-white dark:bg-gray-800 shadow-md' 
          : 'bg-amber-50 dark:bg-gray-900'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Cat className="h-8 w-8 text-amber-600 dark:text-amber-400 mr-2" />
          <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-300">
            Purr Planning Poker
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6 text-amber-300" />
            ) : (
              <Moon className="h-6 w-6 text-amber-700" />
            )}
          </button>
          <label className="flex items-center cursor-pointer ml-4">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={toggleSound}
              className="form-checkbox h-5 w-5 text-amber-600"
            />
            <span className="ml-2 text-amber-800 dark:text-amber-300 select-none">
              {soundEnabled ? 'Sound On' : 'Sound Off'}
            </span>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Header;