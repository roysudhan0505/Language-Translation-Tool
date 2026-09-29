import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { Language } from '../types';
import { AUTO_DETECT_OPTION, LANGUAGES } from '../data/languages';
import { LanguageModal } from './LanguageModal';

interface LanguageSelectorProps {
  selectedCode: string;
  onSelect: (lang: Language) => void;
  allowAuto?: boolean;
  detectedLangName?: string;
  label?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedCode,
  onSelect,
  allowAuto = false,
  detectedLangName,
  label,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Default quick tabs
  const quickCodes = allowAuto
    ? ['auto', 'en', 'es', 'fr', 'de', 'ja']
    : ['es', 'en', 'fr', 'de', 'ja', 'zh'];

  const currentLanguage =
    selectedCode === 'auto'
      ? AUTO_DETECT_OPTION
      : LANGUAGES.find((l) => l.code.toLowerCase() === selectedCode.toLowerCase()) || {
          code: selectedCode,
          name: selectedCode.toUpperCase(),
          nativeName: selectedCode,
          flag: '🌐',
        };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline-block">
          {label}:
        </span>
      )}

      {/* Quick tab buttons for common languages */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
        {quickCodes.map((code) => {
          const isSelected = selectedCode.toLowerCase() === code.toLowerCase();
          const lang =
            code === 'auto'
              ? AUTO_DETECT_OPTION
              : LANGUAGES.find((l) => l.code.toLowerCase() === code.toLowerCase());
          if (!lang) return null;

          return (
            <button
              key={code}
              onClick={() => onSelect(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
            >
              <span className="text-sm">{lang.flag}</span>
              <span>
                {code === 'auto' && detectedLangName
                  ? `Detect (${detectedLangName})`
                  : lang.name}
              </span>
            </button>
          );
        })}

        {/* More languages button / active overflow display */}
        <button
          onClick={() => setModalOpen(true)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border border-transparent ${
            !quickCodes.includes(selectedCode.toLowerCase())
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold border-indigo-200 dark:border-indigo-900'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
          }`}
          title="Browse all 100+ languages"
        >
          {!quickCodes.includes(selectedCode.toLowerCase()) ? (
            <>
              <span className="text-sm">{currentLanguage.flag}</span>
              <span className="max-w-[110px] truncate">{currentLanguage.name}</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>More</span>
            </>
          )}
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>

      <LanguageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedCode={selectedCode}
        onSelect={onSelect}
        allowAuto={allowAuto}
        title={label ? `Select ${label} Language` : 'Select Language'}
      />
    </div>
  );
};
