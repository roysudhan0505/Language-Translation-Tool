import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Trash2,
  Languages,
  Check,
  Copy,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { LANGUAGES, getLanguageByCode } from '../data/languages';
import { LanguageSelector } from './LanguageSelector';
import {
  speakText,
  stopAllSpeech,
  isSpeechRecognitionSupported,
  createSpeechRecognizer,
} from '../utils/speech';

interface Message {
  id: string;
  sender: 'person1' | 'person2';
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

export const ConversationMode: React.FC = () => {
  const [lang1, setLang1] = useState<string>('en');
  const [lang2, setLang2] = useState<string>('es');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'demo-1',
      sender: 'person1',
      originalText: 'Hello! How are you doing today?',
      translatedText: '¡Hola! ¿Cómo estás hoy?',
      sourceLang: 'en',
      targetLang: 'es',
      timestamp: Date.now() - 60000,
    },
    {
      id: 'demo-2',
      sender: 'person2',
      originalText: '¡Estoy muy bien, gracias! Encantado de conocerte.',
      translatedText: "I'm doing very well, thank you! Nice to meet you.",
      sourceLang: 'es',
      targetLang: 'en',
      timestamp: Date.now() - 30000,
    },
  ]);

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const [activeRecording, setActiveRecording] = useState<'person1' | 'person2' | null>(null);
  const recognitionRef = useRef<any>(null);

  const [isTranslating, setIsTranslating] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (sender: 'person1' | 'person2', text: string) => {
    if (!text.trim() || isTranslating) return;

    const sourceLang = sender === 'person1' ? lang1 : lang2;
    const targetLang = sender === 'person1' ? lang2 : lang1;

    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang,
          targetLang,
          tone: 'casual',
        }),
      });

      const data = await res.json();
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender,
        originalText: text,
        translatedText: data.translatedText || text,
        sourceLang,
        targetLang,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newMessage]);

      if (sender === 'person1') setInput1('');
      else setInput2('');

      // Auto speak translated message if enabled
      if (autoSpeak) {
        setPlayingMsgId(newMessage.id);
        const targetLangObj = getLanguageByCode(targetLang);
        speakText(
          newMessage.translatedText,
          targetLangObj?.speechCode || targetLang,
          1,
          () => setPlayingMsgId(null),
          () => setPlayingMsgId(null)
        );
      }
    } catch (err) {
      console.error('Conversation translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleVoice = (sender: 'person1' | 'person2') => {
    if (activeRecording === sender) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setActiveRecording(null);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const currentLang = sender === 'person1' ? lang1 : lang2;
    const langObj = getLanguageByCode(currentLang);
    const speechCode = langObj?.speechCode || 'en-US';

    try {
      const recognizer = createSpeechRecognizer(
        speechCode,
        (transcript, isFinal) => {
          if (sender === 'person1') {
            setInput1(transcript);
            if (isFinal) {
              sendMessage('person1', transcript);
            }
          } else {
            setInput2(transcript);
            if (isFinal) {
              sendMessage('person2', transcript);
            }
          }
        },
        (err) => {
          console.warn('Speech error:', err);
          setActiveRecording(null);
        },
        () => {
          setActiveRecording(null);
        }
      );

      recognizer.start();
      recognitionRef.current = recognizer;
      setActiveRecording(sender);
    } catch (err) {
      console.error('Failed to start recording:', err);
      setActiveRecording(null);
    }
  };

  const playMessageAudio = (msg: Message) => {
    if (playingMsgId === msg.id) {
      stopAllSpeech();
      setPlayingMsgId(null);
      return;
    }

    setPlayingMsgId(msg.id);
    const targetLangObj = getLanguageByCode(msg.targetLang);
    speakText(
      msg.translatedText,
      targetLangObj?.speechCode || msg.targetLang,
      1,
      () => setPlayingMsgId(null),
      () => setPlayingMsgId(null)
    );
  };

  const l1 = getLanguageByCode(lang1);
  const l2 = getLanguageByCode(lang2);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Top Header Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Languages className="w-5 h-5 text-indigo-500" />
            Live Conversation Mode
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Bilateral translation for two people in face-to-face dialogue
          </p>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
            <span>Auto-speak translations</span>
          </label>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Transcript Area */}
      <div className="bg-slate-100/70 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 min-h-[360px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
            <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
            <p>Start a conversation using the buttons below</p>
            <p className="text-xs text-slate-400 mt-1">Speak or type in either language</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isPerson1 = msg.sender === 'person1';
            const isPlaying = playingMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isPerson1 ? 'items-start' : 'items-end'}`}
              >
                <div className="text-[11px] font-semibold text-slate-400 mb-1 px-1">
                  {isPerson1
                    ? `Speaker A (${getLanguageByCode(msg.sourceLang)?.name})`
                    : `Speaker B (${getLanguageByCode(msg.sourceLang)?.name})`}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 shadow-xs ${
                    isPerson1
                      ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                      : 'bg-indigo-600 text-white rounded-tr-xs shadow-indigo-500/10'
                  }`}
                >
                  {/* Original text */}
                  <div
                    className={`text-xs ${
                      isPerson1 ? 'text-slate-500 dark:text-slate-400' : 'text-indigo-200'
                    }`}
                  >
                    "{msg.originalText}"
                  </div>

                  {/* Translated text */}
                  <div className="text-base font-medium mt-1 leading-relaxed">
                    {msg.translatedText}
                  </div>

                  {/* Controls */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs">
                    <button
                      onClick={() => playMessageAudio(msg)}
                      className={`flex items-center gap-1.5 font-medium transition-colors ${
                        isPerson1
                          ? isPlaying
                            ? 'text-indigo-600 font-bold'
                            : 'text-slate-500 hover:text-indigo-600'
                          : isPlaying
                          ? 'text-amber-300 font-bold'
                          : 'text-indigo-200 hover:text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                      <span>{isPlaying ? 'Playing...' : 'Pronounce'}</span>
                    </button>

                    <button
                      onClick={() => navigator.clipboard.writeText(msg.translatedText)}
                      className={`p-1 rounded-md transition-colors ${
                        isPerson1
                          ? 'text-slate-400 hover:text-slate-700'
                          : 'text-indigo-200 hover:text-white'
                      }`}
                      title="Copy translation"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Dual Speaker Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Speaker 1 Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Speaker A
            </span>
            <LanguageSelector
              selectedCode={lang1}
              onSelect={(lang) => setLang1(lang.code)}
              allowAuto={false}
            />
          </div>

          <div className="relative">
            <input
              type="text"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage('person1', input1)}
              placeholder={`Type in ${l1?.name || 'language'}...`}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => toggleVoice('person1')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeRecording === 'person1'
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {activeRecording === 'person1' ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Stop Listening</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Speak ({l1?.name})</span>
                </>
              )}
            </button>

            <button
              onClick={() => sendMessage('person1', input1)}
              disabled={!input1.trim() || isTranslating}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>

        {/* Speaker 2 Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Speaker B
            </span>
            <LanguageSelector
              selectedCode={lang2}
              onSelect={(lang) => setLang2(lang.code)}
              allowAuto={false}
            />
          </div>

          <div className="relative">
            <input
              type="text"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage('person2', input2)}
              placeholder={`Type in ${l2?.name || 'language'}...`}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => toggleVoice('person2')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeRecording === 'person2'
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {activeRecording === 'person2' ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Stop Listening</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Speak ({l2?.name})</span>
                </>
              )}
            </button>

            <button
              onClick={() => sendMessage('person2', input2)}
              disabled={!input2.trim() || isTranslating}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
