import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { v4 as uuidv4 } from '../utils/uuid';
import { Player, GameState, Message, Reaction, CatAvatar, MedievalAvatar } from '../types';
import { generateAvatarUrl, generateMedievalAvatarUrl } from '../utils/avatars';
import { db } from '../firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  getDoc,
  query,
  orderBy,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface GameContextType {
  gameState: GameState;
  players: Player[];
  messages: Message[];
  selectedCard: string | null;
  playerAvatar: CatAvatar;
  medievalAvatar: MedievalAvatar;
  currentPlayer: Player | null;
  isAdmin: boolean;
  isBooted: boolean;
  joinGame: (name: string) => void;
  leaveGame: (name: string) => void;
  selectCard: (value: string) => void;
  startVoting: () => void;
  revealCards: () => void;
  resetGame: () => void;
  bootPlayer: (playerId: string) => void;
  sendMessage: (sender: string, text: string) => void;
  sendReaction: (sender: string, emoji: string, messageId: string) => void;
  updateAvatar: (avatar: CatAvatar) => void;
  updateMedievalAvatar: (avatar: MedievalAvatar) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
  roomId?: string; // Optional, can be passed to use a specific room
}

export const GameProvider: React.FC<GameProviderProps> = ({ children, roomId }) => {
  const [gameState, setGameState] = useState<GameState>('voting');
  const [players, setPlayers] = useState<Player[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isBooted, setIsBooted] = useState<boolean>(false);
  const [playerAvatar, setPlayerAvatar] = useState<CatAvatar>({
    color: 'orange',
    accessory: 'none',
    mood: 'happy'
  });
  const [medievalAvatar, setMedievalAvatar] = useState<MedievalAvatar>({
    rank: 'squire',
    armor: 'cloth',
    weapon: 'dagger'
  });

  // Use refs to track state without causing re-renders
  const previousPlayerRef = useRef<Player | null>(null);
  const bootingPlayersRef = useRef<Set<string>>(new Set());

  const auth = getAuth();
  const user = auth.currentUser;

  // Calculate if current user is admin
  const isAdmin = currentPlayer?.isAdmin || false;

  // Listen for players
  useEffect(() => {
    const unsub = onSnapshot(collection(db, `rooms/${roomId}/players`), (snapshot) => {
      const playersData = snapshot.docs.map(doc => doc.data() as Player);
      
      // Filter out players that are currently being booted
      const filteredPlayers = playersData.filter(player => !bootingPlayersRef.current.has(player.id));
      setPlayers(filteredPlayers);
      
      // Update current player if user exists
      if (user) {
        const currentPlayerData = playersData.find(p => p.id === user.uid);
        
        // Check if the current user has been booted
        // We had a player before but not anymore = booted
        if (previousPlayerRef.current && !currentPlayerData) {
          setIsBooted(true);
        } else if (currentPlayerData) {
          // Reset booted status if player is found
          setIsBooted(false);
        }
        
        // Update refs and state
        previousPlayerRef.current = currentPlayerData || null;
        setCurrentPlayer(currentPlayerData || null);
      }
    });
    return unsub;
  }, [roomId, user]);

  useEffect(() => {
    if (!roomId) return;
    const chatRef = collection(db, `rooms/${roomId}/chat`);
    const chatQuery = query(chatRef, orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(chatQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data() as Message));
    });
    return unsub;
  }, [roomId]);

  useEffect(() => {
    if (!user) return;
    const voteDoc = doc(db, `rooms/${roomId}/vote/${user.uid}`);
    const unsub = onSnapshot(voteDoc, (docSnap) => {
      if (docSnap.exists()) {
        setSelectedCard(docSnap.data().value || null);
      } else {
        setSelectedCard(null);
      }
    });
    return unsub;
  }, [user, roomId]);

  useEffect(() => {
    if (!roomId) return;
    const roomDoc = doc(db, `rooms/${roomId}`);
    const unsub = onSnapshot(roomDoc, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.gameState) setGameState(data.gameState);
      }
    });
    return unsub;
  }, [roomId]);

  // Join game (add player to Firestore)
const joinGame = async (name: string) => {
  if (!user) return;
  const roomDocRef = doc(db, `rooms/${roomId}`);
  const roomSnap = await getDoc(roomDocRef);
  
  let isFirstPlayer = false;
  if (!roomSnap.exists()) {
    // Create the room document with initial state and mark this user as admin
    await setDoc(roomDocRef, { 
      gameState: 'voting', 
      createdAt: serverTimestamp(),
      adminId: user.uid
    });
    isFirstPlayer = true;
  } else {
    // Check if this is the first player by checking if there are no existing players
    const playersSnapshot = await getDocs(collection(db, `rooms/${roomId}/players`));
    isFirstPlayer = playersSnapshot.empty;
    
    // If this is the first player but room exists without adminId, set them as admin
    if (isFirstPlayer && !roomSnap.data()?.adminId) {
      await updateDoc(roomDocRef, { adminId: user.uid });
    }
  }
  
  const playerDoc = doc(db, `rooms/${roomId}/players/${user.uid}`);
  await setDoc(playerDoc, {
    id: user.uid,
    name,
    avatar: generateAvatarUrl(playerAvatar),
    vote: null,
    isAdmin: isFirstPlayer || roomSnap.data()?.adminId === user.uid,
  }, { merge: true });
};

  // Leave game (remove player from Firestore)
  const leaveGame = async (_name: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `rooms/${roomId}/players/${user.uid}`));
    await deleteDoc(doc(db, `rooms/${roomId}/vote/${user.uid}`));
  };

  // Boot player (admin only)
  const bootPlayer = async (playerId: string) => {
    if (!user || !isAdmin || isBooted) return;
    
    try {
      // Mark player as being booted to immediately hide them from UI
      bootingPlayersRef.current.add(playerId);
      
      // Force immediate UI update by filtering the current players list
      setPlayers(currentPlayers => currentPlayers.filter(p => p.id !== playerId));
      
      // Use batch for atomic operation
      const batch = writeBatch(db);
      
      // Remove player document
      const playerRef = doc(db, `rooms/${roomId}/players/${playerId}`);
      batch.delete(playerRef);
      
      // Remove vote document
      const voteRef = doc(db, `rooms/${roomId}/vote/${playerId}`);
      batch.delete(voteRef);
      
      // Commit the batch
      await batch.commit();
      
      // Keep the player hidden for a bit longer to ensure Firebase propagates
      setTimeout(() => {
        bootingPlayersRef.current.delete(playerId);
      }, 1500); // 1.5 second delay to ensure Firebase has propagated
      
    } catch (error) {
      console.error('Error booting player:', error);
      // Remove from booting list if there was an error
      bootingPlayersRef.current.delete(playerId);
      // Refresh players list from Firebase in case of error
      // The Firebase listener will handle this automatically
    }
  };

  // Select card (vote)
  const selectCard = async (value: string) => {
    if (!user || isBooted) return;
    setSelectedCard(value);
    await setDoc(doc(db, `rooms/${roomId}/vote/${user.uid}`), {
      uid: user.uid,
      value,
      votedAt: serverTimestamp(),
    });
    // Optionally update player's vote in players collection
    await updateDoc(doc(db, `rooms/${roomId}/players/${user.uid}`), {
      vote: value,
    });
  };

const clearVotes = async () => {
  if (!roomId) return;
  const votesCol = collection(db, `rooms/${roomId}/vote`);
  const votesSnap = await getDocs(votesCol);
  const batch = writeBatch(db);
  votesSnap.forEach(docSnap => {
    batch.delete(docSnap.ref);
  });

  // Clear vote field in each player document
  const playersCol = collection(db, `rooms/${roomId}/players`);
  const playersSnap = await getDocs(playersCol);
  playersSnap.forEach(playerDoc => {
    batch.update(playerDoc.ref, { vote: null });
  });

  await batch.commit();
};

  // Start voting (reset all votes)
const startVoting = async () => {
  if (isBooted) return;
  setGameState('voting');
  setSelectedCard(null);
  await updateDoc(doc(db, `rooms/${roomId}`), { gameState: 'voting' });
  await clearVotes();
};

  // Reveal cards
  const revealCards = async () => {
  if (!roomId || isBooted) return;
  setGameState('revealed');
  await updateDoc(doc(db, `rooms/${roomId}`), { gameState: 'revealed' });
};

  // Reset game (start voting again)
  const resetGame = () => {
    startVoting();
  };

  // Send chat message
  const sendMessage = async (sender: string, text: string) => {
    if (!user || isBooted) return;
    await addDoc(collection(db, `rooms/${roomId}/chat`), {
      id: uuidv4(),
      sender,
      text,
      timestamp: Date.now(),
      reactions: [],
    });
  };

  // Send reaction to a message
  const sendReaction = async (_sender: string, _emoji: string, _messageId: string) => {
    // Find the message and update its reactions array
    // Firestore doesn't support array of objects update easily, so you may want to use a transaction or re-fetch and update
    // For demo, this is omitted
  };

  // Update avatar
  const updateAvatar = async (avatar: CatAvatar) => {
    setPlayerAvatar(avatar);
    if (!user || isBooted) return;
    await updateDoc(doc(db, `rooms/${roomId}/players/${user.uid}`), {
      avatar: generateAvatarUrl(avatar),
    });
  };

  // Update Medieval avatar
  const updateMedievalAvatar = async (avatar: MedievalAvatar) => {
    setMedievalAvatar(avatar);
    if (!user || isBooted) return;
    await updateDoc(doc(db, `rooms/${roomId}/players/${user.uid}`), {
      avatar: generateMedievalAvatarUrl(avatar),
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        players,
        messages,
        selectedCard,
        playerAvatar,
        medievalAvatar,
        currentPlayer,
        isAdmin,
        isBooted,
        joinGame,
        leaveGame,
        selectCard,
        startVoting,
        revealCards,
        resetGame,
        bootPlayer,
        sendMessage,
        sendReaction,
        updateAvatar,
        updateMedievalAvatar
      }}
    >
      {children}
    </GameContext.Provider>
  );
};