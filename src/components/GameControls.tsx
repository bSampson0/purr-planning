import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import { Play, RotateCcw, Users, UserX, Crown } from 'lucide-react';

const GameControls = () => {
  const { gameState, startVoting, revealCards, resetGame, players, isAdmin, bootPlayer } = useGame();
  const { playSound } = useSound();
  const [showPlayerList, setShowPlayerList] = useState<boolean>(false);

  const allVoted = players.length > 0 && players.every(p => p.vote !== null && p.vote !== undefined);


  const handleAction = () => {
    // Only allow admin to reveal cards and start new rounds
    if (!isAdmin) return;
    
    if (gameState === 'voting') {
      revealCards();
      playSound('meow');
    } else if (gameState === 'revealed') {
      startVoting();
      playSound('meow');
    }
  };

  const handleReset = () => {
    // Only allow admin to reset
    if (!isAdmin) return;
    resetGame();
    playSound('meow');
  };

  const handleBootPlayer = async (playerId: string) => {
    if (!isAdmin) return;
    await bootPlayer(playerId);
    playSound('hiss');
  };

    return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-1">
            Game Controls {isAdmin && <Crown className="inline ml-1" size={16} />}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {gameState === 'voting' 
              ? (isAdmin ? 'Wait for all cats to pick their cards, then reveal' : 'Wait for the admin to reveal cards')
              : (isAdmin ? 'Start a new round when you\'re ready' : 'Wait for the admin to start a new round')}
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
          
          {isAdmin && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200"
            >
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          )}
          
          {gameState === 'voting' && isAdmin && (
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
          {gameState === 'revealed' && isAdmin && (
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
                  <div className="flex-grow">
                    <div className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      {player.name}
                      {player.isAdmin && <Crown size={14} className="text-amber-500" />}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {player.vote ? 'Voted' : 'Not voted yet'}
                    </div>
                  </div>
                  {isAdmin && !player.isAdmin && (
                    <button
                      onClick={() => handleBootPlayer(player.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors duration-200"
                      title="Boot player"
                    >
                      <UserX size={16} />
                    </button>
                  )}
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