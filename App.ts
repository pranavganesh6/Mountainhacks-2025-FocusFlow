// Minimal shared types used across components
export type Flashcard = {
  id: string;
  term: string;
  definition: string;
  mastered: boolean;
};

export type Note = {
  id: string;
  title: string;
  url?: string;
  content?: string;
  createdAt: Date;
  flashcards: Flashcard[];
};

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};
