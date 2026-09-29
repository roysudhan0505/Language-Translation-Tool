import { Language } from '../types';

export const LANGUAGES: Language[] = [
  // Popular tier
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', speechCode: 'en-US', popular: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', speechCode: 'es-ES', popular: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', speechCode: 'fr-FR', popular: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', speechCode: 'de-DE', popular: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', speechCode: 'ja-JP', popular: true },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', speechCode: 'zh-CN', popular: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN', popular: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', speechCode: 'ar-SA', popular: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', speechCode: 'pt-PT', popular: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', speechCode: 'it-IT', popular: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', speechCode: 'ko-KR', popular: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', speechCode: 'ru-RU', popular: true },

  // European languages
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', speechCode: 'nl-NL' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', speechCode: 'pl-PL' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', speechCode: 'uk-UA' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', speechCode: 'sv-SE' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', speechCode: 'el-GR' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', speechCode: 'cs-CZ' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', speechCode: 'ro-RO' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', speechCode: 'hu-HU' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', speechCode: 'da-DK' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', speechCode: 'fi-FI' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', speechCode: 'nb-NO' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', speechCode: 'sk-SK' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', speechCode: 'bg-BG' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', speechCode: 'hr-HR' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', speechCode: 'sr-RS' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', speechCode: 'sl-SI' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', speechCode: 'lt-LT' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', speechCode: 'lv-LV' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', speechCode: 'et-EE' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪', speechCode: 'ga-IE' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸', speechCode: 'is-IS' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇦🇩', speechCode: 'ca-ES' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: '🇪🇸', speechCode: 'eu-ES' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: '🇪🇸', speechCode: 'gl-ES' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱', speechCode: 'sq-AL' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰', speechCode: 'mk-MK' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦', speechCode: 'bs-BA' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹', speechCode: 'mt-MT' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', speechCode: 'cy-GB' },

  // Asian & Pacific languages
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼', speechCode: 'zh-TW' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', speechCode: 'vi-VN' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', speechCode: 'th-TH' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', speechCode: 'id-ID' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', speechCode: 'ms-MY' },
  { code: 'tl', name: 'Filipino (Tagalog)', nativeName: 'Tagalog', flag: '🇵🇭', speechCode: 'fil-PH' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', speechCode: 'bn-BD' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', speechCode: 'ur-PK' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechCode: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speechCode: 'te-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', speechCode: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', speechCode: 'gu-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', speechCode: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', speechCode: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', speechCode: 'pa-IN' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', speechCode: 'ne-NP' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', speechCode: 'si-LK' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာဘာသာ', flag: '🇲🇲', speechCode: 'my-MM' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭', speechCode: 'km-KH' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦', speechCode: 'lo-LA' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', flag: '🇲🇳', speechCode: 'mn-MN' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪', speechCode: 'ka-GE' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲', speechCode: 'hy-AM' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', speechCode: 'az-AZ' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ тілі', flag: '🇰🇿', speechCode: 'kk-KZ' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha', flag: '🇺🇿', speechCode: 'uz-UZ' },

  // Middle Eastern & African languages
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', speechCode: 'tr-TR' },
  { code: 'fa', name: 'Persian (Farsi)', nativeName: 'فارسی', flag: '🇮🇷', speechCode: 'fa-IR' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', speechCode: 'he-IL' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', speechCode: 'sw-KE' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', speechCode: 'af-ZA' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', speechCode: 'am-ET' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬', speechCode: 'yo-NG' },
  { code: 'ig', name: 'Igbo', nativeName: 'Ásụ̀sụ́ Ìgbò', flag: '🇳🇬', speechCode: 'ig-NG' },
  { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', flag: '🇳🇬', speechCode: 'ha-NG' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', speechCode: 'zu-ZA' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaaliga', flag: '🇸🇴', speechCode: 'so-SO' },

  // Classical & regional
  { code: 'la', name: 'Latin', nativeName: 'Latīna', flag: '🏛️', speechCode: 'it-IT' },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', flag: '🌐', speechCode: 'eo' },
];

export const AUTO_DETECT_OPTION: Language = {
  code: 'auto',
  name: 'Detect Language',
  nativeName: 'Auto Detect',
  flag: '✨',
};

export function getLanguageByCode(code: string): Language | undefined {
  if (code === 'auto') return AUTO_DETECT_OPTION;
  return LANGUAGES.find((l) => l.code.toLowerCase() === code.toLowerCase());
}

export const SAMPLE_PROMPTS = [
  {
    label: 'Business Greeting',
    text: 'Thank you for your prompt reply. We look forward to collaborating with your team on this project.',
    target: 'es',
  },
  {
    label: 'Travel Essentials',
    text: 'Excuse me, could you please tell me how to get to the central train station?',
    target: 'fr',
  },
  {
    label: 'Restaurant Dining',
    text: 'A table for two, please. Could you recommend the chef’s special for tonight?',
    target: 'it',
  },
  {
    label: 'Friendly Greeting',
    text: 'Hope you are having a wonderful day! Are you free to grab coffee this weekend?',
    target: 'ja',
  },
  {
    label: 'Tech Inquiries',
    text: 'Our team is developing an intelligent cross-platform system with real-time synchronization.',
    target: 'de',
  },
];
