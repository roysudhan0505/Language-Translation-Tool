export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechCode?: string;
  popular?: boolean;
}

export interface DictionaryEntry {
  word: string;
  translation: string;
  partOfSpeech: string;
  example?: string;
}

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  detectedLanguageName?: string;
  pronunciation?: string;
  alternativeTranslations?: string[];
  dictionary?: DictionaryEntry[];
  notes?: string;
  provider?: string;
}

export interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  sourceLangName: string;
  targetLangName: string;
  timestamp: number;
  isFavorite?: boolean;
}

export type ToneOption = 'standard' | 'formal' | 'casual' | 'business' | 'creative';
