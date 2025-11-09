import { useState, useRef, useEffect } from 'react';
// Local type definitions to avoid depending on ../App resolution in this folder
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

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};
import { Button } from './ui/button';
import { Input } from './ui/input';
// moved types above to avoid cross-file type resolution issues
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { generateNotesFromURL, generateQuizQuestion, chatWithAI } from '../ai-service';

type ChatInterfaceProps = {
  messages: Message[];
  addMessage: (message: Message) => void;
  addNote: (note: Note) => void;
  points: number;
  updatePoints: (points: number) => void;
};

export function ChatInterface({ messages, addMessage, addNote, points, updatePoints }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<{
    question: string;
    correctAnswer: string;
    options: string[];
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isValidUrl = (url: string) => {
    return url.includes('youtube.com') || 
           url.includes('youtu.be') || 
           url.includes('khanacademy.org') ||
           url.includes('apclassroom');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    const userInput = input;
    setInput('');
    setIsProcessing(true);

    try {
      if (isValidUrl(userInput)) {
        // Process URL with real AI
        const aiResponse = await generateNotesFromURL(userInput);
        
        const flashcards: Flashcard[] = aiResponse.flashcards.map((fc: any, idx: number) => ({
          id: idx.toString(),
          term: fc.term,
          definition: fc.definition,
          mastered: false,
        }));

        const note: Note = {
          id: Date.now().toString(),
          title: aiResponse.title,
          url: userInput,
          content: aiResponse.content,
          createdAt: new Date(),
          flashcards,
        };
        
        addNote(note);

        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `🎉 Great! I've processed that content and created notes on "${note.title}"!\n\nI found ${note.flashcards.length} key terms. Would you like to start a quick quiz? Answer correctly to earn points! 🏆`,
          timestamp: new Date(),
        };
        addMessage(responseMessage);

        // Start quiz after a delay
        setTimeout(async () => {
          const quiz = await generateQuizQuestion(note.title);
          
          setCurrentQuiz(quiz);
          const quizMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `❓ Quiz Time!\n\n${quiz.question}`,
            timestamp: new Date(),
          };
          addMessage(quizMessage);
        }, 1500);
      } else if (currentQuiz) {
        // Check answer
        const isCorrect = userInput.toLowerCase().includes(currentQuiz.correctAnswer.toLowerCase());
        
        if (isCorrect) {
          updatePoints(points + 10);
          const responseMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `✅ Correct! +10 points! 🎉\n\nYou now have ${points + 10} points. Want another question? Just type "yes" or share another URL to study!`,
            timestamp: new Date(),
          };
          addMessage(responseMessage);
        } else {
          const responseMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `❌ Not quite! The correct answer is: ${currentQuiz.correctAnswer}\n\nNo worries - learning is a process! Want to try another question? Type "yes" or share a new URL!`,
            timestamp: new Date(),
          };
          addMessage(responseMessage);
        }
        setCurrentQuiz(null);
      } else if (userInput.toLowerCase().includes('yes') || userInput.toLowerCase().includes('quiz')) {
        const quiz = await generateQuizQuestion('general knowledge');
        
        setCurrentQuiz(quiz);
        const quizMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `❓ Here's your next question!\n\n${quiz.question}`,
          timestamp: new Date(),
        };
        addMessage(quizMessage);
      } else {
        // General chat with real AI
        const conversationHistory: { role: 'assistant' | 'user'; content: string }[] = messages
          .slice(-6)
          .map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          }));
        conversationHistory.push({ role: 'user', content: userInput });
        
        const responseContent = await chatWithAI(conversationHistory);
        
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
        };
        addMessage(responseMessage);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Sorry, I encountered an error: ${errorMsg}\n\nPlease make sure your API key is valid and try again.`,
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2>AI Study Chat</h2>
            <p className="text-sm text-gray-500">Share a URL to generate notes and start learning!</p>
          </div>
          <Badge variant="default">
            🤖 Powered by Gemini AI
          </Badge>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] p-4 ${
              message.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.role === 'assistant' && currentQuiz && message.content.includes('Quiz Time') && (
                <div className="mt-3 space-y-2">
                  {currentQuiz.options.map((option, idx) => (
                    <Badge 
                      key={idx}
                      variant="outline" 
                      className="mr-2 cursor-pointer hover:bg-indigo-100"
                      onClick={() => setInput(option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-4 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Paste a URL or type your answer..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isProcessing}>
            {/* simple send icon fallback to avoid missing lucide-react types */}
            <span className="w-4 h-4 inline-block">➤</span>
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Supported: YouTube, Khan Academy, APClassroom
        </p>
      </div>
    </div>
  );
}
