"use client";
/**
 * useSpeech
 * Text-to-speech using Web Speech Synthesis API.
 * Detects language and uses appropriate voice.
 */

import { useState, useCallback, useRef } from "react";

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const speak = useCallback((text, language = "hinglish") => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Remove markdown formatting for speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/[#_`~]/g, "")
      .replace(/\n/g, ". ");

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Choose language
    if (language === "hindi" || language === "hinglish") {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }

    // Try to find an appropriate voice
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    const indianEnglishVoice = voices.find((v) => v.lang === "en-IN");
    if (language === "hindi" && hindiVoice) {
      utterance.voice = hindiVoice;
    } else if (indianEnglishVoice) {
      utterance.voice = indianEnglishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}