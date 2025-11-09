import { useState } from 'react';

// Local types to avoid cross-file resolution
type Flashcard = {
  id: string;
  term: string;
  definition: string;
  mastered: boolean;
};

type Note = {
  id: string;
  title: string;
  url?: string;
  content?: string;
  createdAt: Date;
  flashcards: Flashcard[];
};
import { Card } from './ui/card';
import { Button } from './ui/button';
// icon fallbacks to avoid lucide-react dependency during type-checking
const ChevronLeft = (props: any) => <span {...props}>‹</span>;
const ChevronRight = (props: any) => <span {...props}>›</span>;
const RotateCw = (props: any) => <span {...props}>⟲</span>;
const CreditCard = (props: any) => <span {...props}>💳</span>;
const Check = (props: any) => <span {...props}>✓</span>;
import { Badge } from './ui/badge';

type FlashcardViewerProps = {
  notes: Note[];
};

export function FlashcardViewer({ notes }: FlashcardViewerProps) {
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const allFlashcards = notes.flatMap(note => 
    note.flashcards.map(card => ({ ...card, noteTitle: note.title }))
  );

  if (allFlashcards.length === 0) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h2>Flashcards</h2>
          <p className="text-sm text-gray-500">Review your study materials</p>
        </header>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CreditCard className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-gray-500 mb-2">No flashcards yet</h3>
          <p className="text-sm text-gray-400">
            Create notes from URLs to generate flashcards automatically!
          </p>
        </div>
      </div>
    );
  }

  const currentCard = allFlashcards[currentCardIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % allFlashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + allFlashcards.length) % allFlashcards.length);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-purple-50 to-indigo-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h2>Flashcards</h2>
        <p className="text-sm text-gray-500">
          Card {currentCardIndex + 1} of {allFlashcards.length}
        </p>
      </header>

      <div className="flex flex-col items-center justify-center p-8 min-h-[calc(100vh-100px)]">
        <Badge variant="outline" className="mb-4">
          {currentCard.noteTitle}
        </Badge>

        <div 
          className="relative w-full max-w-2xl h-80 cursor-pointer perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <Card className={`absolute inset-0 p-8 flex items-center justify-center text-center transition-all duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}>
            <div className={`${isFlipped ? 'hidden' : 'block'}`}>
              <p className="text-sm text-gray-500 mb-4">TERM</p>
              <h3 className="text-gray-900">{currentCard.term}</h3>
              <p className="text-sm text-gray-400 mt-8">Click to flip</p>
            </div>
            <div className={`${isFlipped ? 'block' : 'hidden'} rotate-y-180`}>
              <p className="text-sm text-gray-500 mb-4">DEFINITION</p>
              <p className="text-gray-700">{currentCard.definition}</p>
              <p className="text-sm text-gray-400 mt-8">Click to flip back</p>
            </div>
          </Card>
        </div>

        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={handlePrev}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button variant="outline" onClick={() => setIsFlipped(!isFlipped)}>
            <RotateCw className="w-4 h-4 mr-1" />
            Flip
          </Button>
          <Button variant="outline" onClick={handleNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="flex gap-2 mt-6">
          {allFlashcards.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === currentCardIndex ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
