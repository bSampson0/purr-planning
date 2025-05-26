import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import { MessageCircle, Send, SmilePlus } from 'lucide-react';

interface ChatSidebarProps {
  username: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ username }) => {
  const { players, messages, sendMessage, sendReaction } = useGame();
  const { playSound } = useSound();
  const [newMessage, setNewMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [showEmojis, setShowEmojis] = useState<string | false>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && !isOpen) setIsOpen(true);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessage(username, newMessage);
    setNewMessage('');
    playSound('meow');
  };

  const handleReaction = (emoji: string, messageId: string) => {
    sendReaction(username, emoji, messageId);
    setShowEmojis(false);
    playSound('meow');
  };

  const catEmojis = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🐱', '🐈'];

  const getPlayer = (name: string) => players.find(p => p.name === name);

  return (
    <>
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-10 p-4 bg-amber-600 text-white rounded-full shadow-lg"
        >
          <MessageCircle />
        </button>
      )}
      
      <div 
        className={`${
          isOpen 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0 pointer-events-none'
        } lg:opacity-100 lg:translate-x-0 lg:pointer-events-auto transition-all duration-300 transform fixed lg:relative top-0 right-0 h-full lg:h-auto z-20 lg:z-0 w-full sm:w-96 lg:w-80 xl:w-96 bg-white dark:bg-gray-800 shadow-lg lg:shadow-none lg:ml-6`}
      >
        <div className="flex flex-col h-full lg:h-[calc(100vh-7rem)] lg:sticky lg:top-20">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300">
              Chat
            </h3>
            {isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                &times;
              </button>
            )}
          </div>
          
          <div className="flex-grow overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 my-8">
                No messages yet. Be the first to chat!
              </div>
            ) : (
              messages.map(message => {
                const player = getPlayer(message.sender);
                return (
                  <div key={message.id} className="mb-4">
                    <div className="flex items-start gap-2">
                      {player && (
                        <img 
                          src={player.avatar} 
                          alt={`${message.sender}'s avatar`} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-grow">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-medium text-amber-800 dark:text-amber-300">
                            {message.sender}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="bg-amber-50 dark:bg-gray-700 p-2 rounded-lg text-gray-800 dark:text-gray-200">
                          {message.text}
                        </div>
                        
                        {message.reactions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {message.reactions.map((reaction, index) => (
                              <div 
                                key={index}
                                className="bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
                              >
                                <span>{reaction.emoji}</span>
                                <span className="text-gray-600 dark:text-gray-300">
                                  {reaction.sender}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <button
                          onClick={() => {
                            setShowEmojis(prev => prev === message.id ? false : message.id);
                          }}
                          className="text-xs text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 mt-1"
                        >
                          <SmilePlus size={14} className="inline mr-1" />
                          React
                        </button>
                        
                        {showEmojis === message.id && (
                          <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-md mt-2 inline-block">
                            <div className="flex flex-wrap gap-1">
                              {catEmojis.map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReaction(emoji, message.id)}
                                  className="hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded text-lg"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;