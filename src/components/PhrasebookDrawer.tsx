import React, { useState } from 'react';
import { Bookmark, Trash2, Copy, Check, Volume2, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { HistoryItem } from '../types';
import { speakText, stopAllSpeech } from '../utils/speech';
import { getLanguageByCode } from '../data/languages';

interface PhrasebookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPhrases: HistoryItem[];
  onRemovePhrase: (id: string) => void;
  onSelectPhrase?: (phrase: HistoryItem) => void;
  onClearAll: () => void;
}

export const PhrasebookDrawer: React.FC<PhrasebookDrawerProps> = ({
  isOpen,
  onClose,
  savedPhrases,
  onRemovePhrase,
  onSelectPhrase,
  onClearAll,
}) => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = savedPhrases.filter(
    (item) =>
      item.sourceText.toLowerCase().includes(search.toLowerCase()) ||
      item.translatedText.toLowerCase().includes(search.toLowerCase()) ||
      item.targetLangName.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handlePlay = (text: string, langCode: string, id: string) => {
    if (playingId === id) {
      stopAllSpeech();
      setPlayingId(null);
      return;
    }
    setPlayingId(id);
    const langObj = getLanguageByCode(langCode);
    speakText(
      text,
      langObj?.speechCode || langCode,
      1,
      () => setPlayingId(null),
      () => setPlayingId(null)
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
            Saved Phrasebook ({savedPhrases.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your starred translations for quick review, offline access, and audio practice
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedPhrases.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Back to Translator
          </button>
        </div>
      </div>

      {/* Search Filter */}
      {savedPhrases.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved phrases..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      )}

      {/* Phrase Cards */}
      {savedPhrases.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
          <Bookmark className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <div className="font-semibold text-slate-700 dark:text-slate-300">
            No saved phrases yet
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click the bookmark icon in the translation results to save phrases for easy reference!
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          No phrases found matching "{search}"
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((phrase) => {
            const isPlaying = playingId === phrase.id;
            return (
              <div
                key={phrase.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-3 group hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      {phrase.sourceLangName} <ArrowRight className="w-3 h-3" />{' '}
                      {phrase.targetLangName}
                    </span>
                    <button
                      onClick={() => onRemovePhrase(phrase.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove from phrasebook"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {phrase.sourceText}
                  </div>
                  <div className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-1">
                    {phrase.translatedText}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() =>
                      handlePlay(phrase.translatedText, phrase.targetLang, phrase.id)
                    }
                    className={`flex items-center gap-1.5 font-medium transition-colors ${
                      isPlaying
                        ? 'text-indigo-600 font-bold'
                        : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlaying ? 'Playing...' : 'Pronounce'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(phrase.translatedText, phrase.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors"
                      title="Copy translated text"
                    >
                      {copiedId === phrase.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {onSelectPhrase && (
                      <button
                        onClick={() => {
                          onSelectPhrase(phrase);
                          onClose();
                        }}
                        className="px-2 py-1 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-md font-medium transition-colors"
                        title="Load into translator"
                      >
                        Open
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
