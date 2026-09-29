import React, { useState } from 'react';
import { History, Trash2, Copy, Check, Volume2, Search, ArrowRight, Bookmark } from 'lucide-react';
import { HistoryItem } from '../types';
import { speakText, stopAllSpeech } from '../utils/speech';
import { getLanguageByCode } from '../data/languages';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: HistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem?: (item: HistoryItem) => void;
  onToggleFavorite?: (item: HistoryItem) => void;
  favoriteIds?: Set<string>;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  historyItems,
  onClearHistory,
  onSelectHistoryItem,
  onToggleFavorite,
  favoriteIds = new Set(),
}) => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = historyItems.filter(
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
            <History className="w-5 h-5 text-indigo-500" />
            Translation History ({historyItems.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Past translations saved in local browser session
          </p>
        </div>

        <div className="flex items-center gap-2">
          {historyItems.length > 0 && (
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              Clear History
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
      {historyItems.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search translation history..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      )}

      {/* History Items */}
      {historyItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
          <History className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <div className="font-semibold text-slate-700 dark:text-slate-300">
            No translation history yet
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Your translated phrases will automatically be logged here for easy reference.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          No history found matching "{search}"
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => {
            const isPlaying = playingId === item.id;
            const isFav = favoriteIds.has(item.id);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {item.sourceLangName}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {item.targetLangName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {item.sourceText}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mt-0.5">
                    {item.translatedText}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handlePlay(item.translatedText, item.targetLang, item.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isPlaying
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleCopy(item.translatedText, item.id)}
                    className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Copy translated text"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {onToggleFavorite && (
                    <button
                      onClick={() => onToggleFavorite(item)}
                      className={`p-2 rounded-lg transition-colors ${
                        isFav
                          ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Star phrase'}
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                    </button>
                  )}

                  {onSelectHistoryItem && (
                    <button
                      onClick={() => {
                        onSelectHistoryItem(item);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg font-medium transition-colors ml-1"
                    >
                      Open
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
