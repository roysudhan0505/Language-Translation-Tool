import React, { useState, useMemo } from 'react';
import { Search, X, Check, Globe } from 'lucide-react';
import { Language } from '../types';
import { LANGUAGES, AUTO_DETECT_OPTION } from '../data/languages';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCode: string;
  onSelect: (lang: Language) => void;
  allowAuto?: boolean;
  title?: string;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  selectedCode,
  onSelect,
  allowAuto = false,
  title = 'Select Language',
}) => {
  const [search, setSearch] = useState('');

  const filteredLanguages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [search]);

  const popularLanguages = useMemo(() => {
    return LANGUAGES.filter((l) => l.popular);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by language, native script, or code..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Body list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {allowAuto && !search && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Automatic
              </div>
              <button
                onClick={() => {
                  onSelect(AUTO_DETECT_OPTION);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  selectedCode === 'auto'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">✨</span>
                  <div>
                    <div className="text-sm font-medium">Detect Language</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Automatic source detection
                    </div>
                  </div>
                </div>
                {selectedCode === 'auto' && <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              </button>
            </div>
          )}

          {!search && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Popular Languages
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {popularLanguages.map((lang) => {
                  const isSelected = selectedCode.toLowerCase() === lang.code.toLowerCase();
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelect(lang);
                        onClose();
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl leading-none">{lang.flag}</span>
                        <div>
                          <div className="text-sm font-medium leading-snug">{lang.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                            {lang.nativeName}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {search ? `Matching Languages (${filteredLanguages.length})` : 'All Languages'}
            </div>
            {filteredLanguages.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No language found matching "{search}"
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredLanguages.map((lang) => {
                  const isSelected = selectedCode.toLowerCase() === lang.code.toLowerCase();
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelect(lang);
                        onClose();
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0 leading-none">{lang.flag}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{lang.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {lang.nativeName}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
