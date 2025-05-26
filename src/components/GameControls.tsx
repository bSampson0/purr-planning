import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import { Play, RotateCcw, Users } from 'lucide-react';

const GameControls = () => {
  const { gameState, startVoting, revealCards, resetGame, players } = useGame();
  const { playSound } = useSound();
  const [showPlayerList, setShowPlayerList] = useState<boolean>(false);

  const allVoted = players.length > 0 && players.every(p => p.vote !== null && p.vote !== undefined);


  const handleAction = () => {
    if (gameState === 'voting') {
      revealCards();
      playSound('meow');
    } else if (gameState === 'revealed') {
      startVoting();
      playSound('meow');
    }
  };

  const handleReset = () => {
    resetGame();
    playSound('meow');
  };

    return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-1">
            Game Controls
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {gameState === 'voting' 
              ? 'Wait for all cats to pick their cards, then reveal' 
              : 'Start a new round when you\'re ready'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowPlayerList(true)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200"
          >
            <Users size={18} />
            <span>Players ({players.length})</span>
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200"
          >
            <RotateCcw size={18} />
            <span>Reset</span>
          </button>
          
          {gameState === 'voting' && (
            <button
              onClick={handleAction}
              disabled={!allVoted}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 ${
                allVoted
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-amber-400 cursor-not-allowed opacity-50'
              }`}
            >
              <Play size={18} />
              <span>Reveal Cards</span>
            </button>
          )}
          {gameState === 'revealed' && (
            <button
              onClick={handleAction}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 bg-green-600 hover:bg-green-700"
            >
              <Play size={18} />
              <span>New Round</span>
            </button>
          )}
        </div>
      </div>
      
      {showPlayerList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-amber-800 dark:text-amber-300">
              Players in Game
            </h3>
            <div className="max-h-80 overflow-y-auto">
              {players.map(player => (
                <div 
                  key={player.id}
                  className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700 last:border-none"
                >
                  <img 
                    src={player.avatar} 
                    alt={`${player.name}'s avatar`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {player.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {player.vote ? 'Voted' : 'Not voted yet'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPlayerList(false)}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;