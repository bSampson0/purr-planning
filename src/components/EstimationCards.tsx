import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CardType } from '../types';
import { medievalCards } from '../data/cards';

const EstimationCards = () => {
  const { selectCard, selectedCard, gameState, isBooted } = useGame();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cards = medievalCards;

  const handleCardSelect = (card: CardType) => {
    if (gameState !== 'voting' || isBooted) return;

    selectCard(card.value);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {cards.map((card) => (
        <div
          key={card.value}
          className={`relative transition-all duration-300 transform ${
            isBooted
              ? 'opacity-50 cursor-not-allowed'
              : `cursor-pointer ${hoveredCard === card.value ? 'scale-105' : 'scale-100'}`
          } ${
            selectedCard === card.value
              ? 'ring-4 ring-red-400 dark:ring-red-500'
              : !isBooted ? 'hover:shadow-lg' : ''
          }`}
          onClick={() => handleCardSelect(card)}
          onMouseEnter={() => !isBooted && setHoveredCard(card.value)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md">
            <div className="p-4 bg-red-100 dark:bg-gray-600">
              <img
                src={card.image}
                alt={card.description}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {card.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {card.description}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EstimationCards;