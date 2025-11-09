import { Note } from '../App';
import { Card } from './ui/card';
import { Trophy, BookOpen, CreditCard, TrendingUp, Target, Brain } from 'lucide-react';
import { Badge } from './ui/badge';

type StudyDashboardProps = {
  notes: Note[];
  points: number;
};

export function StudyDashboard({ notes, points }: StudyDashboardProps) {
  const totalFlashcards = notes.reduce((acc, note) => acc + note.flashcards.length, 0);
  const masteredCards = notes.reduce(
    (acc, note) => acc + note.flashcards.filter(card => card.mastered).length, 
    0
  );

  const stats = [
    {
      icon: Trophy,
      label: 'Total Points',
      value: points,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      icon: BookOpen,
      label: 'Notes Created',
      value: notes.length,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: CreditCard,
      label: 'Flashcards',
      value: totalFlashcards,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Target,
      label: 'Mastered',
      value: masteredCards,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ];

  const achievements = [
    { title: '🌟 First Steps', description: 'Created your first note', unlocked: notes.length >= 1 },
    { title: '📚 Knowledge Seeker', description: 'Created 5 notes', unlocked: notes.length >= 5 },
    { title: '🏆 Quiz Master', description: 'Earned 50 points', unlocked: points >= 50 },
    { title: '⚡ Quick Learner', description: 'Earned 100 points', unlocked: points >= 100 },
    { title: '🎯 Dedicated Student', description: 'Created 10 notes', unlocked: notes.length >= 10 },
    { title: '💪 Unstoppable', description: 'Earned 200 points', unlocked: points >= 200 },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h2>Study Dashboard</h2>
        <p className="text-sm text-gray-500">Track your learning progress</p>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className={`p-5 ${stat.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <Badge variant="secondary">{stat.value}</Badge>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Progress Section */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3>Learning Progress</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Flashcard Mastery</span>
                <span className="text-gray-500">
                  {totalFlashcards > 0 
                    ? Math.round((masteredCards / totalFlashcards) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${totalFlashcards > 0 ? (masteredCards / totalFlashcards) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Points to Next Level</span>
                <span className="text-gray-500">{100 - (points % 100)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${(points % 100)}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3>Achievements</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievements.map((achievement, idx) => (
              <Card 
                key={idx} 
                className={`p-4 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-gray-50 opacity-50'
                }`}
              >
                <p className="mb-1">{achievement.title}</p>
                <p className="text-xs text-gray-600">{achievement.description}</p>
                {achievement.unlocked && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Unlocked!
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        {notes.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-4">Recent Notes</h3>
            <div className="space-y-3">
              {notes.slice(-5).reverse().map((note) => (
                <div key={note.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm">{note.title}</p>
                    <p className="text-xs text-gray-500">
                      {note.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">{note.flashcards.length} cards</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
