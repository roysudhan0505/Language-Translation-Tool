import React from 'react';
import { BookOpen, Sparkles, Copy, Check, Info } from 'lucide-react';
import { DictionaryEntry } from '../types';

interface DictionaryCardProps {
  pronunciation?: string;
  alternativeTranslations?: string[];
  dictionary?: DictionaryEntry[];
  notes?: string;
  onApplyAlternative?: (text: string) => void;
}

export const DictionaryCard: React.FC<DictionaryCardProps> = ({
  pronunciation,
  alternativeTranslations = [],
  dictionary = [],
  notes,
  onApplyAlternative,
}) => {
  const [copiedAltIndex, setCopiedAltIndex] = React.useState<number | null>(null);

  const handleCopyAlt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedAltIndex(index);
    setTimeout(() => setCopiedAltIndex(null), 1800);
  };

  const hasContent =
    pronunciation ||
    (alternativeTranslations && alternativeTranslations.length > 0) ||
    (dictionary && dictionary.length > 0) ||
    notes;

  if (!hasContent) return null;

  return (
    <div className="mt-4 space-y-4 animate-in fade-in duration-300">
      {/* Pronunciation banner if available */}
      {pronunciation && (
        <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
              Phonetic & Romanization Guide
            </div>
            <div className="text-sm font-mono text-indigo-700 dark:text-indigo-200 mt-0.5 select-all">
              {pronunciation}
            </div>
          </div>
        </div>
      )}

      {/* Alternative translations */}
      {alternativeTranslations && alternativeTranslations.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Alternative Expressions
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {alternativeTranslations.map((alt, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3 group transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                    {alt}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {onApplyAlternative && (
                    <button
                      onClick={() => onApplyAlternative(alt)}
                      className="px-2 py-1 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-md font-medium transition-colors"
                      title="Use this translation"
                    >
                      Use
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyAlt(alt, idx)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors"
                    title="Copy alternative"
                  >
                    {copiedAltIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dictionary entries / Lexical Breakdown */}
      {dictionary && dictionary.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            Lexical Insights & Dictionary
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {dictionary.map((entry, idx) => (
              <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {entry.word}
                  </span>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">
                    {entry.partOfSpeech}
                  </span>
                </div>
                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  {entry.translation}
                </div>
                {entry.example && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                    "{entry.example}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cultural or grammatical notes */}
      {notes && (
        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Grammar & Nuance Note</span>
            {notes}
          </div>
        </div>
      )}
    </div>
  );
};
