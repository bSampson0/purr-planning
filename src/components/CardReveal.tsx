import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { medievalCards } from '../data/cards';
import { motion } from '../utils/motion';

const CardReveal = () => {
  const { players } = useGame();
  const [revealed, setRevealed] = useState<boolean>(false);

  const cards = medievalCards;

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getCardDetails = (value: string | null) => {
    if (value === null) return null;
    return cards.find(card => card.value === value) || null;
  };

  const getConsensusMessage = () => {
    const votes = players.filter(p => p.vote !== null).map(p => p.vote);
    if (votes.length <= 1) return null;

    const hasConsensus = votes.every(v => v === votes[0]);

    if (hasConsensus) {
      return "Purrfect consensus! The cats agree.";
    } else {
      return "Hmm, these cats aren't on the same page.";
    }
  };

  const consensusMessage = getConsensusMessage();

  return (
    <div className="mt-4">
      {consensusMessage && (
        <div
          className={`mb-6 p-3 rounded-lg text-center text-lg font-medium ${
            consensusMessage.includes('Purrfect')
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
          }`}
        >
          {consensusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: revealed ? 1 : 0, 
              y: revealed ? 0 : 50 
            }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.2
            }}
          >
            <div className="p-4 flex items-center justify-center relative bg-red-50 dark:bg-gray-600">
              <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-sm font-medium bg-red-100 dark:bg-gray-500 text-red-800 dark:text-red-200">
                {player.name}
              </div>
              <div className="h-28 w-28 rounded-full flex items-center justify-center text-5xl font-bold bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200">
                {player.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {player.vote ? (
              <div className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {player.vote}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {getCardDetails(player.vote)?.description || 'No description'}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="text-gray-500 dark:text-gray-400 italic">
                  No vote
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CardReveal;