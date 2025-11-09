import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { NotesLibrary } from './components/NotesLibrary';
import { FlashcardViewer } from './components/FlashcardViewer';
import { StudyDashboard } from './components/StudyDashboard';

export type Note = {
  id: string;
  title: string;
  url: string;
  content: string;
  createdAt: Date;
  flashcards: Flashcard[];
};

export type Flashcard = {
  id: string;
  term: string;
  definition: string;
  mastered: boolean;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

function App() {
  const [currentView, setCurrentView] = useState<'chat' | 'notes' | 'flashcards' | 'dashboard'>('chat');
  const [notes, setNotes] = useState<Note[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI study buddy! Share a YouTube, Khan Academy, or APClassroom URL and I'll turn it into notes and help you study! 🎓",
      timestamp: new Date(),
    },
  ]);
  const [points, setPoints] = useState(0);

  const addNote = (note: Note) => {
    setNotes([...notes, note]);
  };

  const addMessage = (message: Message) => {
    setMessages([...messages, message]);
  };

  const updatePoints = (newPoints: number) => {
    setPoints(newPoints);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        points={points}
        noteCount={notes.length}
      />
      
      <main className="flex-1 overflow-hidden">
        {currentView === 'chat' && (
          <ChatInterface 
            messages={messages}
            addMessage={addMessage}
            addNote={addNote}
            points={points}
            updatePoints={updatePoints}
          />
        )}
        {currentView === 'notes' && (
          <NotesLibrary notes={notes} />
        )}
        {currentView === 'flashcards' && (
          <FlashcardViewer notes={notes} />
        )}
        {currentView === 'dashboard' && (
          <StudyDashboard notes={notes} points={points} />
        )}
      </main>
    </div>
  );
}

export default App;
