import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { GameProvider } from './context/GameContext';
import { SoundProvider } from './context/SoundContext';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { signInAnonymously } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { v4 as uuidv4 } from './utils/uuid';

function JoinRoom({ setUsername }: { setUsername: (name: string) => void }) {
  const [username, setLocalUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    await signInAnonymously(auth);
    setUsername(username);
    const id = roomId.trim() || uuidv4();
    navigate(`/rooms/${id}`);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-amber-800 dark:text-amber-300">
          Join the Cat Herd
        </h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What should we call you?
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setLocalUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Room ID (leave blank to create new)
          </label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter room ID or leave blank"
          />
        </div>
        <button
          onClick={handleJoin}
          disabled={!username.trim()}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Join Session
        </button>
      </div>
    </div>
  );
}

// Username prompt for direct room visits
function UsernamePrompt({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (name.trim()) onSubmit(name.trim());
      }}
    >
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4"
        placeholder="Enter your name"
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Join Room
      </button>
    </form>
  );
}

function RoomWrapper() {
  const { roomId } = useParams();
  const [username, setUsername] = useState<string>('');
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  const handleJoin = async (name: string) => {
    await signInAnonymously(auth);
    setUsername(name);
    setIsAuthed(true);
  };

  if (!isAuthed) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-amber-800 dark:text-amber-300">
            Enter your name to join the room
          </h2>
          <UsernamePrompt onSubmit={handleJoin} />
        </div>
      </div>
    );
  }

  return (
    <GameProvider roomId={roomId!}>
      <Dashboard username={username} />
    </GameProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<JoinRoom setUsername={() => {}} />} />
            <Route path="/rooms/:roomId" element={<RoomWrapper />} />
          </Routes>
        </Router>
      </SoundProvider>
    </ThemeProvider>
  );
}

export default App;