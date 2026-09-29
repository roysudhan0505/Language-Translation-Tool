// Speech utility supporting Web Speech API (TTS & STT) and server-side audio playback

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

let activeAudio: HTMLAudioElement | null = null;

// Stop any currently playing audio (synthesizer or audio element)
export function stopAllSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
}

// Speak text using browser Web Speech API
export function speakText(
  text: string,
  langCode: string,
  rate = 1,
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (!isSpeechSynthesisSupported() || !text) {
    onError?.(new Error('Speech synthesis not supported or empty text'));
    return false;
  }

  stopAllSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode || 'en-US';
  utterance.rate = rate;

  // Attempt to select the best matching voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis error:', e);
    onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

// Play custom base64 audio (e.g. from Gemini audio generation)
export function playBase64Audio(
  audioDataUri: string,
  onEnd?: () => void,
  onError?: (err: any) => void
): HTMLAudioElement {
  stopAllSpeech();

  const audio = new Audio(audioDataUri);
  activeAudio = audio;

  audio.onended = () => {
    activeAudio = null;
    onEnd?.();
  };

  audio.onerror = (e) => {
    activeAudio = null;
    console.error('Audio playback error:', e);
    onError?.(e);
  };

  audio.play().catch((err) => {
    console.warn('Audio play was prevented or failed:', err);
    onError?.(err);
  });

  return audio;
}

// Create a Speech Recognition instance for voice input
export function createSpeechRecognizer(
  langCode: string,
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (err: any) => void,
  onEnd: () => void
) {
  if (!isSpeechRecognitionSupported()) {
    throw new Error('Speech recognition is not supported in this browser.');
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = langCode || 'en-US';

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }

    if (final) {
      onResult(final, true);
    } else if (interim) {
      onResult(interim, false);
    }
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech recognition error:', event.error);
    onError(event);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
