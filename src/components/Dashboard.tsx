import { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
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
    isBooted
  } = useGame();
  const navigate = useNavigate();

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
            <h2 className="text-xl font-bold mb-2 sm:mb-0 text-red-800 dark:text-red-300">
              {gameState === 'voting' ? 'Choose Your Estimation' : 'Results'}
            </h2>
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
    </div>
  );
};

export default Dashboard;