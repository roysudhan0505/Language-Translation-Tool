import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TranslatePanel } from './components/TranslatePanel';
import { ConversationMode } from './components/ConversationMode';
import { PhrasebookDrawer } from './components/PhrasebookDrawer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { HistoryItem } from './types';
import { LANGUAGES } from './data/languages';
import { Sparkles, Globe, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'translate' | 'conversation' | 'phrasebook' | 'history'>('translate');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('polyglot_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('polyglot_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  const [savedPhrases, setSavedPhrases] = useState<HistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('polyglot_saved');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  // Theme synchronization
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('polyglot_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('polyglot_theme', 'light');
    }
  }, [isDark]);

  // Persist history
  useEffect(() => {
    localStorage.setItem('polyglot_history', JSON.stringify(historyItems));
  }, [historyItems]);

  // Persist saved phrases
  useEffect(() => {
    localStorage.setItem('polyglot_saved', JSON.stringify(savedPhrases));
  }, [savedPhrases]);

  const handleAddToHistory = (item: {
    sourceText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    sourceLangName: string;
    targetLangName: string;
  }) => {
    setHistoryItems((prev) => {
      // Avoid immediate duplicates
      if (prev.length > 0 && prev[0].sourceText === item.sourceText && prev[0].targetLang === item.targetLang) {
        return prev;
      }
      const newItem: HistoryItem = {
        id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ...item,
        timestamp: Date.now(),
      };
      return [newItem, ...prev].slice(0, 100);
    });
  };

  const handleToggleSave = (item: {
    sourceText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    sourceLangName: string;
    targetLangName: string;
  }) => {
    setSavedPhrases((prev) => {
      const existing = prev.find(
        (p) => p.sourceText === item.sourceText && p.targetLang === item.targetLang
      );
      if (existing) {
        return prev.filter((p) => p.id !== existing.id);
      } else {
        const newItem: HistoryItem = {
          id: `fav-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          ...item,
          timestamp: Date.now(),
          isFavorite: true,
        };
        return [newItem, ...prev];
      }
    });
  };

  const handleRemovePhrase = (id: string) => {
    setSavedPhrases((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
  };

  const handleClearSaved = () => {
    setSavedPhrases([]);
  };

  const favoriteIds = new Set(
    savedPhrases.map((s) => `${s.sourceText}:::${s.targetLang}`)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        savedCount={savedPhrases.length}
        historyCount={historyItems.length}
      />

      {/* Main Viewport */}
      <main className="flex-1 pb-16">
        {currentTab === 'translate' && (
          <TranslatePanel
            onAddToHistory={handleAddToHistory}
            onSavePhrase={handleToggleSave}
          />
        )}

        {currentTab === 'conversation' && <ConversationMode />}

        {currentTab === 'phrasebook' && (
          <PhrasebookDrawer
            isOpen={true}
            onClose={() => setCurrentTab('translate')}
            savedPhrases={savedPhrases}
            onRemovePhrase={handleRemovePhrase}
            onClearAll={handleClearSaved}
          />
        )}

        {currentTab === 'history' && (
          <HistoryDrawer
            isOpen={true}
            onClose={() => setCurrentTab('translate')}
            historyItems={historyItems}
            onClearHistory={handleClearHistory}
            onToggleFavorite={(item) => handleToggleSave(item)}
            favoriteIds={new Set(savedPhrases.map((s) => s.id))}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Polyglot Translation Suite
            </span>
            <span>·</span>
            <span>{LANGUAGES.length}+ languages supported</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Real-time voice & speech synthesis
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Client & server resilient
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
