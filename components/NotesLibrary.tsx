import { Note } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { Badge } from './ui/badge';

type NotesLibraryProps = {
  notes: Note[];
};

export function NotesLibrary({ notes }: NotesLibraryProps) {
  const handleDownloadPDF = (note: Note) => {
    // Mock PDF download
    alert(`Downloading "${note.title}" as PDF...`);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <h2>My Notes</h2>
        <p className="text-sm text-gray-500">All your study materials in one place</p>
      </header>

      <div className="p-6">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-gray-500 mb-2">No notes yet</h3>
            <p className="text-sm text-gray-400">
              Share a URL in the chat to generate your first set of notes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-gray-900">{note.title}</h3>
                  <Badge variant="secondary">{note.flashcards.length} cards</Badge>
                </div>
                
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {note.content.substring(0, 100)}...
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate">{note.url}</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open(note.url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Source
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownloadPDF(note)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Created {note.createdAt.toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
