import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from '../utils/uuid';
import { Player, GameState, Message, Reaction, CatAvatar } from '../types';
import { generateAvatarUrl } from '../utils/avatars';
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
  joinGame: (name: string) => void;
  leaveGame: (name: string) => void;
  selectCard: (value: string) => void;
  startVoting: () => void;
  revealCards: () => void;
  resetGame: () => void;
  sendMessage: (sender: string, text: string) => void;
  sendReaction: (sender: string, emoji: string, messageId: string) => void;
  updateAvatar: (avatar: CatAvatar) => void;
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
  const [playerAvatar, setPlayerAvatar] = useState<CatAvatar>({
    color: 'orange',
    accessory: 'none',
    mood: 'happy'
  });

  const auth = getAuth();
  const user = auth.currentUser;

  // Listen for players
  useEffect(() => {
    const unsub = onSnapshot(collection(db, `rooms/${roomId}/players`), (snapshot) => {
      setPlayers(snapshot.docs.map(doc => doc.data() as Player));
    });
    return unsub;
  }, [roomId]);

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
        console.log('Game state updated:', data.gameState);
      }
    });
    return unsub;
  }, [roomId]);

  // Join game (add player to Firestore)
const joinGame = async (name: string) => {
  if (!user) return;
  const roomDocRef = doc(db, `rooms/${roomId}`);
  const roomSnap = await getDoc(roomDocRef);
  if (!roomSnap.exists()) {
    // Create the room document with initial state
    await setDoc(roomDocRef, { gameState: 'voting', createdAt: serverTimestamp() });
  }
  const playerDoc = doc(db, `rooms/${roomId}/players/${user.uid}`);
  await setDoc(playerDoc, {
    id: user.uid,
    name,
    avatar: generateAvatarUrl(playerAvatar),
    vote: null,
  }, { merge: true });
};

  // Leave game (remove player from Firestore)
  const leaveGame = async (name: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `rooms/${roomId}/players/${user.uid}`));
    await deleteDoc(doc(db, `rooms/${roomId}/vote/${user.uid}`));
  };

  // Select card (vote)
  const selectCard = async (value: string) => {
    if (!user) return;
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
    await batch.commit();
  };

  // Start voting (reset all votes)
const startVoting = async () => {
  setGameState('voting');
  setSelectedCard(null);
  await updateDoc(doc(db, `rooms/${roomId}`), { gameState: 'voting' });
  await clearVotes();
};

  // Reveal cards
  const revealCards = async () => {
  if (!roomId) return;
  setGameState('revealed');
  await updateDoc(doc(db, `rooms/${roomId}`), { gameState: 'revealed' });
};

  // Reset game (start voting again)
  const resetGame = () => {
    startVoting();
  };

  // Send chat message
  const sendMessage = async (sender: string, text: string) => {
    if (!user) return;
    await addDoc(collection(db, `rooms/${roomId}/chat`), {
      id: uuidv4(),
      sender,
      text,
      timestamp: Date.now(),
      reactions: [],
    });
  };

  // Send reaction to a message
  const sendReaction = async (sender: string, emoji: string, messageId: string) => {
    // Find the message and update its reactions array
    // Firestore doesn't support array of objects update easily, so you may want to use a transaction or re-fetch and update
    // For demo, this is omitted
  };

  // Update avatar
  const updateAvatar = async (avatar: CatAvatar) => {
    setPlayerAvatar(avatar);
    if (!user) return;
    await updateDoc(doc(db, `rooms/${roomId}/players/${user.uid}`), {
      avatar: generateAvatarUrl(avatar),
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
        joinGame,
        leaveGame,
        selectCard,
        startVoting,
        revealCards,
        resetGame,
        sendMessage,
        sendReaction,
        updateAvatar
      }}
    >
      {children}
    </GameContext.Provider>
  );
};