import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Cat } from 'lucide-react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

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
          : 'bg-red-50 dark:bg-gray-900'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Cat className="h-8 w-8 mr-2 text-red-600 dark:text-red-400" />
          <h1 className="text-2xl font-bold text-red-800 dark:text-red-300">
            Purr Planning
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6 text-red-300" />
            ) : (
              <Moon className="h-6 w-6 text-red-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;