import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeftRight,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  X,
  Bookmark,
  BookmarkCheck,
  Download,
  Share2,
  Upload,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { Language, TranslationResult, ToneOption } from '../types';
import { LANGUAGES, SAMPLE_PROMPTS, getLanguageByCode } from '../data/languages';
import { LanguageSelector } from './LanguageSelector';
import { DictionaryCard } from './DictionaryCard';
import {
  speakText,
  stopAllSpeech,
  isSpeechRecognitionSupported,
  createSpeechRecognizer,
} from '../utils/speech';

interface TranslatePanelProps {
  onSavePhrase?: (item: {
    sourceText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    sourceLangName: string;
    targetLangName: string;
  }) => void;
  isSaved?: boolean;
  onAddToHistory: (item: {
    sourceText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    sourceLangName: string;
    targetLangName: string;
  }) => void;
}

export const TranslatePanel: React.FC<TranslatePanelProps> = ({
  onSavePhrase,
  isSaved = false,
  onAddToHistory,
}) => {
  const [sourceLang, setSourceLang] = useState<string>('auto');
  const [targetLang, setTargetLang] = useState<string>('es');
  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tone, setTone] = useState<ToneOption>('standard');
  const [autoTranslate, setAutoTranslate] = useState<boolean>(true);

  // Audio / Speech state
  const [isPlayingTargetAudio, setIsPlayingTargetAudio] = useState<boolean>(false);
  const [isPlayingSourceAudio, setIsPlayingSourceAudio] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [showSpeechRateMenu, setShowSpeechRateMenu] = useState<boolean>(false);

  // Voice recording (Speech-to-Text)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Copy feedback
  const [copiedTarget, setCopiedTarget] = useState<boolean>(false);
  const [copiedSource, setCopiedSource] = useState<boolean>(false);

  // Sample prompt dropdown
  const [showSamples, setShowSamples] = useState<boolean>(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle language swapping
  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') {
      const detected = translationResult?.detectedLanguage || 'en';
      setSourceLang(targetLang);
      setTargetLang(detected);
    } else {
      const prevSource = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(prevSource);
    }
    // Swap texts
    if (translatedText) {
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  // Perform translation
  const executeTranslation = async (
    textToTranslate: string,
    sLang = sourceLang,
    tLang = targetLang,
    tTone = tone
  ) => {
    if (!textToTranslate.trim()) {
      setTranslatedText('');
      setTranslationResult(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTranslate,
          sourceLang: sLang,
          targetLang: tLang,
          tone: tTone,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation request failed (${response.status})`);
      }

      const data: TranslationResult = await response.json();
      setTranslatedText(data.translatedText);
      setTranslationResult(data);

      // Add to history
      const sourceLangObj = getLanguageByCode(sLang);
      const targetLangObj = getLanguageByCode(tLang);
      onAddToHistory({
        sourceText: textToTranslate,
        translatedText: data.translatedText,
        sourceLang: sLang,
        targetLang: tLang,
        sourceLangName: data.detectedLanguageName || sourceLangObj?.name || sLang,
        targetLangName: targetLangObj?.name || tLang,
      });
    } catch (err: any) {
      console.error('Translation error:', err);
      setError(err?.message || 'Failed to translate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-translate on typing with debounce
  useEffect(() => {
    if (!autoTranslate) return;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (sourceText.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        executeTranslation(sourceText, sourceLang, targetLang, tone);
      }, 600);
    } else {
      setTranslatedText('');
      setTranslationResult(null);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [sourceText, sourceLang, targetLang, tone, autoTranslate]);

  // Handle Speech Recognition (Microphone)
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsRecording(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    try {
      const langObj = getLanguageByCode(sourceLang);
      const speechCode = langObj?.speechCode || 'en-US';

      const recognizer = createSpeechRecognizer(
        speechCode,
        (transcript) => {
          setSourceText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        },
        (err) => {
          console.warn('Speech recognition error:', err);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );

      recognizer.start();
      recognitionRef.current = recognizer;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsRecording(false);
    }
  };

  // Handle Text to Speech playback
  const handlePlayAudio = (text: string, langCode: string, isTarget: boolean) => {
    if (isTarget && isPlayingTargetAudio) {
      stopAllSpeech();
      setIsPlayingTargetAudio(false);
      return;
    }
    if (!isTarget && isPlayingSourceAudio) {
      stopAllSpeech();
      setIsPlayingSourceAudio(false);
      return;
    }

    stopAllSpeech();

    const langObj = getLanguageByCode(langCode);
    const speechCode = langObj?.speechCode || langCode;

    if (isTarget) setIsPlayingTargetAudio(true);
    else setIsPlayingSourceAudio(true);

    speakText(
      text,
      speechCode,
      speechRate,
      () => {
        if (isTarget) setIsPlayingTargetAudio(false);
        else setIsPlayingSourceAudio(false);
      },
      () => {
        if (isTarget) setIsPlayingTargetAudio(false);
        else setIsPlayingSourceAudio(false);
      }
    );
  };

  // Copy to clipboard
  const handleCopy = (text: string, isTarget: boolean) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (isTarget) {
      setCopiedTarget(true);
      setTimeout(() => setCopiedTarget(false), 2000);
    } else {
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 2000);
    }
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setSourceText(content.slice(0, 5000));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export translated text
  const handleDownload = () => {
    if (!translatedText) return;
    const blob = new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translation_${targetLang}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Web Share
  const handleShare = async () => {
    if (!translatedText) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Translated with Polyglot',
          text: translatedText,
        });
      } catch (err) {
        // User dismissed share
      }
    } else {
      handleCopy(translatedText, true);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Top Controls Bar: Source Selector | Swap | Target Selector | Tone | Auto Switch */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Languages Selection & Swap */}
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
          <LanguageSelector
            label="From"
            selectedCode={sourceLang}
            onSelect={(lang) => setSourceLang(lang.code)}
            allowAuto={true}
            detectedLangName={translationResult?.detectedLanguageName}
          />

          <button
            onClick={handleSwapLanguages}
            disabled={sourceLang === 'auto'}
            className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title={sourceLang === 'auto' ? 'Cannot swap with auto-detect' : 'Swap languages'}
            aria-label="Swap source and target languages"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <LanguageSelector
            label="To"
            selectedCode={targetLang}
            onSelect={(lang) => setTargetLang(lang.code)}
            allowAuto={false}
          />
        </div>

        {/* Tone and Auto Translate options */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tone selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 hidden md:inline">
              Tone:
            </span>
            {(['standard', 'formal', 'casual', 'business', 'creative'] as ToneOption[]).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                  tone === t
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Auto translate switch */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300 ml-1">
            <input
              type="checkbox"
              checked={autoTranslate}
              onChange={(e) => setAutoTranslate(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
            <span className="hidden sm:inline">Instant</span>
          </label>
        </div>
      </div>

      {/* Main Dual Translation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source Input Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col min-h-[340px] focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all overflow-hidden">
          {/* Header of Input Card */}
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {sourceLang === 'auto'
                  ? `Detect Language${
                      translationResult?.detectedLanguageName
                        ? ` (${translationResult.detectedLanguageName})`
                        : ''
                    }`
                  : getLanguageByCode(sourceLang)?.name || sourceLang}
              </span>
              {isRecording && (
                <span className="flex items-center gap-1.5 text-rose-500 font-semibold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Listening...
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.csv"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Upload text file (.txt, .md)"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSamples(!showSamples)}
                  className="px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>Try Sample</span>
                </button>

                {showSamples && (
                  <div className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Sample Phrases
                    </div>
                    {SAMPLE_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSourceText(prompt.text);
                          setTargetLang(prompt.target);
                          setShowSamples(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 transition-colors"
                      >
                        <div className="font-semibold">{prompt.label}</div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {prompt.text}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {sourceText && (
                <button
                  onClick={() => {
                    setSourceText('');
                    setTranslatedText('');
                    setTranslationResult(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Clear text"
                  aria-label="Clear source text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Text Area */}
          <div className="p-4 flex-1 flex flex-col">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  executeTranslation(sourceText, sourceLang, targetLang, tone);
                }
              }}
              placeholder="Enter text, paste a paragraph, or press the mic button to speak..."
              rows={8}
              className="w-full flex-1 bg-transparent border-0 resize-none focus:outline-hidden text-base sm:text-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 leading-relaxed"
            />
          </div>

          {/* Footer Controls */}
          <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              {/* Mic button */}
              <button
                onClick={toggleRecording}
                className={`p-2 rounded-xl transition-all ${
                  isRecording
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse'
                    : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title={isRecording ? 'Stop listening' : 'Speak to input text'}
                aria-label="Voice input"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Speaker for source */}
              {sourceText && (
                <button
                  onClick={() =>
                    handlePlayAudio(
                      sourceText,
                      sourceLang === 'auto'
                        ? translationResult?.detectedLanguage || 'en'
                        : sourceLang,
                      false
                    )
                  }
                  className={`p-2 rounded-xl transition-all ${
                    isPlayingSourceAudio
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                  title="Listen to original text"
                  aria-label="Listen to original text"
                >
                  {isPlayingSourceAudio ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Copy source */}
              {sourceText && (
                <button
                  onClick={() => handleCopy(sourceText, false)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  title="Copy original text"
                  aria-label="Copy original text"
                >
                  {copiedSource ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span>{sourceText.length} / 5000</span>

              {/* Manual Translate Button */}
              <button
                onClick={() => executeTranslation(sourceText, sourceLang, targetLang, tone)}
                disabled={isLoading || !sourceText.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Translate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Target Output Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col min-h-[340px] transition-all overflow-hidden relative">
          {/* Header of Output Card */}
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {getLanguageByCode(targetLang)?.name || targetLang}
            </span>

            {/* Provider indicator */}
            {translationResult?.provider && (
              <span className="text-[11px] text-slate-400 font-mono">
                via {translationResult.provider === 'gemini' ? 'Gemini 3.8 Flash' : 'Google Translate'}
              </span>
            )}
          </div>

          {/* Translated Content Area */}
          <div className="p-4 flex-1 flex flex-col">
            {isLoading ? (
              <div className="space-y-3 animate-pulse pt-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-700 dark:text-rose-300 text-sm">
                <div className="font-bold mb-1">Translation Error</div>
                <div>{error}</div>
                <button
                  onClick={() => executeTranslation(sourceText, sourceLang, targetLang, tone)}
                  className="mt-2.5 px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-500"
                >
                  Retry
                </button>
              </div>
            ) : translatedText ? (
              <div className="text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-relaxed select-text whitespace-pre-wrap">
                {translatedText}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm py-12">
                <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2 stroke-[1.5]" />
                <p>Translation will appear here instantly</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Type or paste text in the box on the left
                </p>
              </div>
            )}
          </div>

          {/* Footer of Output Card: Audio | Copy | Star | Speed | Download | Share */}
          <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              {/* Speaker for target */}
              <button
                onClick={() => handlePlayAudio(translatedText, targetLang, true)}
                disabled={!translatedText}
                className={`p-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  isPlayingTargetAudio
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title={isPlayingTargetAudio ? 'Stop speaking' : 'Listen to translation (TTS)'}
                aria-label="Listen to translation"
              >
                {isPlayingTargetAudio ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Speed rate selector popover */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeechRateMenu(!showSpeechRateMenu)}
                  className="px-2 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors flex items-center gap-0.5"
                  title="Voice playback speed"
                >
                  <span>{speechRate}x</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {showSpeechRateMenu && (
                  <div className="absolute left-0 bottom-full mb-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-1 z-30 flex flex-col gap-0.5 min-w-[75px]">
                    {[0.75, 1, 1.25].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setSpeechRate(rate);
                          setShowSpeechRateMenu(false);
                        }}
                        className={`px-2.5 py-1 text-xs rounded-md font-mono text-left ${
                          speechRate === rate
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Copy button */}
              <button
                onClick={() => handleCopy(translatedText, true)}
                disabled={!translatedText}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                title="Copy translated text"
                aria-label="Copy translation"
              >
                {copiedTarget ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 font-semibold text-xs">Copied!</span>
                  </>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {/* Star / Bookmark */}
              {onSavePhrase && (
                <button
                  onClick={() => {
                    if (!translatedText) return;
                    const sourceLangObj = getLanguageByCode(sourceLang);
                    const targetLangObj = getLanguageByCode(targetLang);
                    onSavePhrase({
                      sourceText,
                      translatedText,
                      sourceLang,
                      targetLang,
                      sourceLangName:
                        translationResult?.detectedLanguageName ||
                        sourceLangObj?.name ||
                        sourceLang,
                      targetLangName: targetLangObj?.name || targetLang,
                    });
                  }}
                  disabled={!translatedText}
                  className={`p-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    isSaved
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-slate-600 dark:text-slate-400 hover:text-amber-500 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                  title={isSaved ? 'Saved in Phrasebook' : 'Save phrase'}
                  aria-label="Save to phrasebook"
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Right side actions: Download & Share */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleDownload}
                disabled={!translatedText}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
                title="Download translation as text"
                aria-label="Download translation"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                disabled={!translatedText}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
                title="Share translation"
                aria-label="Share translation"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dictionary, Pronunciation, Notes, and Alternative translations */}
      {translationResult && (
        <DictionaryCard
          pronunciation={translationResult.pronunciation}
          alternativeTranslations={translationResult.alternativeTranslations}
          dictionary={translationResult.dictionary}
          notes={translationResult.notes}
          onApplyAlternative={(alt) => setTranslatedText(alt)}
        />
      )}
    </div>
  );
};
