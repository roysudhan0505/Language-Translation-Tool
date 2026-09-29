import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback to Google Translate public endpoint if Gemini is unavailable
async function fallbackGoogleTranslate(text: string, sourceLang: string, targetLang: string) {
  const sl = sourceLang === 'auto' ? 'auto' : sourceLang;
  const tl = targetLang;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
    sl
  )}&tl=${encodeURIComponent(tl)}&dt=t&dt=bd&dt=rm&q=${encodeURIComponent(text)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Public translation API failed with status ${res.status}`);
  }

  const data = await res.json();
  let translatedText = '';
  if (Array.isArray(data[0])) {
    translatedText = data[0].map((item: any) => item[0]).filter(Boolean).join('');
  }

  const detectedLanguage = data[2] || (sourceLang !== 'auto' ? sourceLang : 'en');

  // Pronunciation or romanization if present
  let pronunciation = '';
  if (Array.isArray(data[0])) {
    const romanizationItem = data[0].find((item: any) => item[2] || item[3]);
    if (romanizationItem) {
      pronunciation = romanizationItem[3] || romanizationItem[2] || '';
    }
  }

  // Dictionary breakdown if single word/phrase
  const dictionary: Array<{ partOfSpeech: string; terms: string[] }> = [];
  if (Array.isArray(data[1])) {
    for (const dictGroup of data[1]) {
      if (Array.isArray(dictGroup) && dictGroup[0] && Array.isArray(dictGroup[1])) {
        dictionary.push({
          partOfSpeech: String(dictGroup[0]),
          terms: dictGroup[1].slice(0, 5),
        });
      }
    }
  }

  return {
    translatedText: translatedText || text,
    detectedLanguage,
    pronunciation,
    alternativeTranslations: [],
    dictionary,
    notes: '',
  };
}

// Translate endpoint
app.post('/api/translate', async (req, res) => {
  const { text, sourceLang = 'auto', targetLang = 'es', tone = 'standard' } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Text to translate is required' });
  }

  // If Gemini client is available, leverage gemini-3.8-flash for high quality translation + nuance
  if (ai) {
    try {
      const prompt = `You are a professional polyglot translator.
Translate the following text into target language '${targetLang}'.
The source language is '${sourceLang}' (if 'auto', detect the source language accurately).
Desired Tone/Style: ${tone} (e.g. standard, formal, casual, business, poetic/creative).

Original text:
"""${text}"""

Provide the output strictly in JSON according to this structure:
- translatedText: string (the direct, high quality natural translation)
- detectedLanguage: string (the ISO 639-1 code or standard language name of the source text)
- detectedLanguageName: string (full English name of detected source language, e.g. "French", "Japanese")
- pronunciation: string (phonetic pronunciation, Pinyin, Romaji, or IPA transcription of the translated text if relevant for non-Latin or complex scripts, otherwise empty string)
- alternativeTranslations: array of strings (2-3 natural alternative ways to say this, varying in style or nuance)
- dictionary: array of objects { word: string, translation: string, partOfSpeech: string, example?: string } (if the input is a single word or short phrase, provide key lexical meanings and synonyms; otherwise empty array)
- notes: string (optional short grammar, cultural or contextual note if helpful, otherwise empty string)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translatedText: { type: Type.STRING },
              detectedLanguage: { type: Type.STRING },
              detectedLanguageName: { type: Type.STRING },
              pronunciation: { type: Type.STRING },
              alternativeTranslations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              dictionary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING },
                    translation: { type: Type.STRING },
                    partOfSpeech: { type: Type.STRING },
                    example: { type: Type.STRING },
                  },
                  required: ['word', 'translation', 'partOfSpeech'],
                },
              },
              notes: { type: Type.STRING },
            },
            required: ['translatedText', 'detectedLanguage', 'detectedLanguageName'],
          },
        },
      });

      const raw = response.text?.trim();
      if (raw) {
        const parsed = JSON.parse(raw);
        return res.json({
          provider: 'gemini',
          ...parsed,
        });
      }
    } catch (err: any) {
      console.warn('Gemini translation encountered an error, falling back to public engine:', err?.message || err);
      // Fall through to public engine fallback
    }
  }

  // Fallback to public translation engine
  try {
    const fallbackResult = await fallbackGoogleTranslate(text, sourceLang, targetLang);
    return res.json({
      provider: 'google-translate',
      ...fallbackResult,
      detectedLanguageName: fallbackResult.detectedLanguage,
    });
  } catch (err: any) {
    console.error('Translation failed:', err);
    return res.status(500).json({
      error: 'Translation failed',
      details: err?.message || 'Could not process translation',
    });
  }
});

// High Definition Text to Speech using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req, res) => {
  const { text, voice = 'Kore' } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required for TTS' });
  }

  if (!ai) {
    return res.status(503).json({ error: 'Gemini TTS unavailable (API key not configured)' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text: text.slice(0, 1000) }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        audioData: `data:audio/wav;base64,${base64Audio}`,
      });
    }
    return res.status(500).json({ error: 'No audio data returned' });
  } catch (err: any) {
    console.error('TTS generation failed:', err);
    return res.status(500).json({ error: err?.message || 'TTS generation failed' });
  }
});

// Setup Vite in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
