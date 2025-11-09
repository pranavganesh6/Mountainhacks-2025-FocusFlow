# StudyAI - Educational Chatbot Platform

An interactive study companion that helps students learn through gamified quizzes and AI-generated study materials.

## 🎯 Features

- **Interactive Chatbot** - Share educational URLs and get instant study notes
- **Smart Flashcards** - Auto-generated from your study materials
- **Gamified Quizzes** - Earn points by answering questions correctly
- **Notes Library** - Save and organize all your study materials
- **Progress Dashboard** - Track your learning with stats and achievements

## 🚀 How to Use

1. **Start Chatting** - The app opens in Chat mode by default
2. **Share a URL** - Paste a YouTube, Khan Academy, or APClassroom link
3. **Get Notes** - The AI generates study notes and flashcards
4. **Take Quizzes** - Answer questions to earn points
5. **Review** - Access your notes and flashcards anytime

## 🎭 Mock Mode (Current)

The app is currently running in **Mock Mode** which:
- ✅ Works perfectly without any setup
- ✅ Generates realistic study materials
- ✅ Creates interactive quizzes
- ✅ Demonstrates all features
- ⚠️ Uses pre-defined content (not real AI analysis)

## 🤖 Real AI Mode (Requires Backend)

To use real AI with Google Gemini:

### Option 1: Use Supabase Edge Functions (Recommended)

1. Click "Connect to Supabase" if you haven't already
2. Create a Supabase Edge Function:

```typescript
// supabase/functions/ai-chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { prompt, systemPrompt } = await req.json()
  
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${Deno.env.get('GOOGLE_API_KEY')}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      }),
    }
  )
  
  const data = await response.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
})
```

3. Add your Google API key to Supabase secrets
4. Update `/lib/ai-service.ts` to call your Supabase function

### Option 2: Deploy to Vercel/Netlify

Deploy this app to a platform that supports serverless functions, then use API routes to call the Gemini API.

## 🔑 Getting a Google API Key

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Enable the "Generative Language API"
4. Add the key to your Supabase secrets or environment variables

## 📚 Supported Platforms

Currently supports:
- YouTube videos
- Khan Academy lessons  
- APClassroom content

## 🎨 Features Breakdown

### Chat Interface
- Real-time conversation with AI study buddy
- URL processing for note generation
- Interactive quiz questions with clickable options

### Notes Library
- View all created notes
- Download as PDF (mock functionality)
- See flashcard count per note
- Access original source URLs

### Flashcards
- Flip-card interaction
- Navigate through all cards
- Progress indicator
- Organized by topic

### Dashboard
- Total points earned
- Notes created count
- Flashcard mastery progress
- Achievement system with 6 unlockable badges
- Recent activity feed

## ⚠️ Important Notes

- **CORS Limitation**: Direct browser API calls don't work in Figma Make
- **Mock Mode**: Fully functional for testing and demos
- **Real AI**: Requires backend (Supabase/Vercel/Netlify)
- **API Key Security**: Never commit API keys to version control

## 🛠️ Tech Stack

- React + TypeScript
- Tailwind CSS
- Shadcn/UI components
- Google Gemini AI (for real mode)
- Lucide React icons

## 💡 Tips

- Stay in Mock Mode for demos and testing
- Use Real AI mode only after setting up a backend
- Earn 10 points per correct quiz answer
- Create 10 notes to unlock the "Dedicated Student" achievement

---

**Current Status**: ✅ Fully functional in Mock Mode  
**Real AI Status**: ⚠️ Requires backend setup (CORS limitation)
