// AI Service for processing URLs and generating study content

// Your Google API key
const GOOGLE_API_KEY = 'AIzaSyCGjsN8nQkV2zNh8xPjjwtanEwT0EhVRSM';

// Using Gemini Pro model (stable)
const GEMINI_MODEL = 'gemini-2.5-flash'; // instead of gemini-pro

// Using v1beta API endpoint
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

type Parts = { text: string }[];
type Content = { role?: 'user' | 'model' | 'system'; parts: Parts };

async function callGeminiAI(
  prompt: string,
  systemPrompt?: string,
  generationConfig: Record<string, any> = {}
) {
  const contents: Content[] = [{ parts: [{ text: prompt }] }];

  const body: any = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2000,
      ...generationConfig,
    },
  };

  // Use official field for system instructions (text only).
  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  const res = await fetch(
    `${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent?key=${GOOGLE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Gemini API error: ${res.status} - ${errorText}`);
  }

  const data = await res.json();

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data ??
    null;

  if (!text) {
    throw new Error('Invalid response from Gemini API');
  }

  return text as string;
}

// --- Generate notes with fallback for invalid JSON ---
export async function generateNotesFromURL(url: string) {
  if (!url.includes('youtube.com') && !url.includes('youtu.be') && !url.includes('khanacademy.org') && !url.includes('apclassroom')) {
    return {
      title: 'Invalid URL',
      content: '⚠️ I can only process YouTube, Khan Academy, or AP Classroom links.',
      flashcards: [],
    };
  }

  const schema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      flashcards: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            term: { type: 'string' },
            definition: { type: 'string' },
          },
          required: ['term', 'definition'],
          additionalProperties: false,
        },
      },
    },
    required: ['title', 'content', 'flashcards'],
    additionalProperties: false,
  };

  const prompt = `You are a study assistant. A student has shared this URL: ${url}

Analyze the educational content and return ONLY JSON with:
- "title": clear, concise topic title
- "content": comprehensive Markdown study notes
- "flashcards": 5–7 key terms with definitions`;

  const systemPrompt = 'Create clear notes and flashcards from URLs. Output must be valid JSON only.';

  try {
    const response = await callGeminiAI(prompt, systemPrompt, {
      response_mime_type: 'application/json',
      response_schema: schema,
    });
    return JSON.parse(response);
  } catch (err) {
    console.warn('JSON parse failed or Gemini error, falling back to raw text.', err);
    return {
      title: 'Untitled Topic',
      content: typeof err === 'string' ? err : 'Could not parse AI response. Please try another URL.',
      flashcards: [],
    };
  }
}

export async function generateQuizQuestion(topic: string) {
  const schema = {
    type: 'object',
    properties: {
      question: { type: 'string' },
      correctAnswer: { type: 'string' },
      options: {
        type: 'array',
        items: { type: 'string' },
        minItems: 4,
        maxItems: 6,
      },
    },
    required: ['question', 'correctAnswer', 'options'],
    additionalProperties: false,
  };

  const prompt = `Generate ONE multiple-choice quiz question about: ${topic}

Return ONLY JSON with:
- "question"
- "correctAnswer"
- "options" (must include the correct answer)`;

  const systemPrompt =
    'You are a quiz generator. Output must be valid JSON only.';

  const response = await callGeminiAI(prompt, systemPrompt, {
    response_mime_type: 'application/json',
    response_schema: schema,
  });

  return JSON.parse(response);
}

export async function chatWithAI(
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
) {
  // Build a simple single-turn content; for true multi-turn, pass an array of contents.
  const convo = conversationHistory
    .map((m) => `${m.role === 'user' ? 'Student' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const systemPrompt =
    'You are an encouraging, gamified study assistant. Be supportive, ask follow-ups, and keep it concise and friendly.';

  return callGeminiAI(convo, systemPrompt, {
    // If you ever need structured replies here, you can enable JSON mode too.
  });
}
