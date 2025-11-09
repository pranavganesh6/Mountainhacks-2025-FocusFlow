import { MessageSquare, BookOpen, CreditCard, BarChart3, Trophy } from 'lucide-react';
import { Button } from './ui/button';

type SidebarProps = {
  currentView: 'chat' | 'notes' | 'flashcards' | 'dashboard';
  setCurrentView: (view: 'chat' | 'notes' | 'flashcards' | 'dashboard') => void;
  points: number;
  noteCount: number;
};

export function Sidebar({ currentView, setCurrentView, points, noteCount }: SidebarProps) {
  const menuItems = [
    { id: 'chat' as const, icon: MessageSquare, label: 'AI Chat' },
    { id: 'notes' as const, icon: BookOpen, label: 'My Notes' },
    { id: 'flashcards' as const, icon: CreditCard, label: 'Flashcards' },
    { id: 'dashboard' as const, icon: BarChart3, label: 'Dashboard' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-indigo-600 mb-2">StudyAI</h1>
        <p className="text-gray-500 text-sm">Your AI Study Companion</p>
      </div>

      <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 m-4 rounded-lg text-white">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-5 h-5" />
          <span className="text-sm">Study Points</span>
        </div>
        <p className="text-2xl">{points}</p>
        <p className="text-xs opacity-90 mt-1">{noteCount} notes created</p>
      </div>

      <nav className="flex-1 px-2 py-4">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => setCurrentView(item.id)}
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <p>💡 Tip: Get points by answering quiz questions!</p>
      </div>
    </aside>
  );
}
