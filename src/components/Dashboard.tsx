import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import { useNavigate } from 'react-router-dom';
import AvatarCustomizer from './AvatarCustomizer';
import EstimationCards from './EstimationCards';
import CardReveal from './CardReveal';
import ChatSidebar from './ChatSidebar';
import GameControls from './GameControls';

interface DashboardProps {
  username: string;
}

const Dashboard: React.FC<DashboardProps> = ({ username }) => {
  const { 
    gameState, 
    players, 
    joinGame, 
    playerAvatar, 
    selectedCard,
    isBooted
  } = useGame();
  const { playSound } = useSound();
  const navigate = useNavigate();
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);

  // Handle being booted from the room
  useEffect(() => {
    if (isBooted) {
      // Show a message and redirect after a delay
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    }
  }, [isBooted, navigate]);

  useEffect(() => {
    if (username && !players.find(p => p.name === username)) {
      joinGame(username);
    }
  }, [username, joinGame, players]);

  useEffect(() => {
    if (gameState === 'voting') {
      playSound('meow');
    } else if (gameState === 'revealed') {
      const hasConsensus = checkConsensus();
      if (hasConsensus) {
        playSound('purr');
      } else {
        playSound('hiss');
      }
    }
  }, [gameState, playSound]);

  const checkConsensus = () => {
    if (players.length <= 1) return true;
    
    const votes = players.filter(p => p.vote !== null).map(p => p.vote);
    if (votes.length <= 1) return true;
    
    return votes.every(v => v === votes[0]);
  };

  // Show booted message if player has been kicked out
  if (isBooted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
            You've been removed from the room
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The room admin has removed you from this planning session.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Redirecting you to the home page in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 bg-white dark:bg-gray-800">
      <div className="flex-grow">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-2 sm:mb-0">
              {gameState === 'voting' ? 'Choose Your Estimation' : 'Results'}
            </h2>
            <div className="flex items-center">
              <button 
                onClick={() => setShowCustomizer(true)}
                className="flex items-center bg-amber-100 dark:bg-gray-700 hover:bg-amber-200 dark:hover:bg-gray-600 px-3 py-1.5 rounded-lg text-amber-800 dark:text-amber-300 text-sm font-medium transition-colors duration-200"
              >
                <span>Customize Cat</span>
              </button>
            </div>
          </div>
          
          {gameState === 'revealed' ? (
            <CardReveal />
          ) : (
            <EstimationCards />
          )}
        </div>
        
        <GameControls />
      </div>
      
      <ChatSidebar username={username} />
      
      {showCustomizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 text-amber-800 dark:text-amber-300">
              Customize Your Cat
            </h3>
            <AvatarCustomizer
              currentAvatar={playerAvatar}
              onClose={() => setShowCustomizer(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;