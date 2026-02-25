"use client";

import { useState, useCallback, useEffect } from "react";

export function useReadAloud() {
  const [isActive,   setIsActive]   = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utt    = new SpeechSynthesisUtterance(text);
    utt.rate     = 0.85;
    utt.pitch    = 1.1;
    utt.volume   = 1;

    // Prefer a clear, child-friendly voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Samantha"))
    );
    if (preferred) utt.voice = preferred;

    utt.onstart = () => setIsActive(true);
    utt.onend   = () => setIsActive(false);
    utt.onerror = () => setIsActive(false);

    window.speechSynthesis.speak(utt);
  }, []);

  const cancel = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsActive(false);
  }, []);

  return { speak, cancel, isActive, isSupported };
}
