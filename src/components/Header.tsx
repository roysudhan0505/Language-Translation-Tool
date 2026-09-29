import React from 'react';
import {
  Languages,
  MessageSquare,
  Bookmark,
  History,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'translate' | 'conversation' | 'phrasebook' | 'history';
  onSelectTab: (tab: 'translate' | 'conversation' | 'phrasebook' | 'history') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  savedCount: number;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isDark,
  onToggleTheme,
  savedCount,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                Polyglot
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                AI Translate
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
              100+ Languages · Speech & Pronunciation
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl">
          <button
            onClick={() => onSelectTab('translate')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'translate'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Translator</span>
          </button>

          <button
            onClick={() => onSelectTab('conversation')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'conversation'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Real-time bilateral dialogue"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Conversation</span>
            <span className="sm:hidden">Dialogue</span>
          </button>

          <button
            onClick={() => onSelectTab('phrasebook')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
              currentTab === 'phrasebook'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden md:inline">Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
              currentTab === 'history'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden md:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
