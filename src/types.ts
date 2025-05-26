export type GameState = 'voting' | 'revealed';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  vote: string | null;
}

export interface Reaction {
  sender: string;
  emoji: string;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  reactions: Reaction[];
}

export interface CardType {
  value: string;
  description: string;
  image: string;
}

export interface CatAvatar {
  color: string;
  accessory: string;
  mood: string;
}

export interface CatColor {
  name: string;
  value: string;
  hex: string;
}

export interface CatAccessory {
  name: string;
  value: string;
  image: string;
}

export interface CatMood {
  name: string;
  value: string;
  image: string;
}