"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Difficulty } from "@/types";
import { HARD_TIMER_SECONDS } from "@/lib/xp-engine";

interface UseTimerReturn {
  elapsed:    number;     // count-up seconds (easy/medium)
  remaining:  number;     // countdown seconds (hard)
  isRunning:  boolean;
  isExpired:  boolean;
  start:      () => void;
  stop:       () => void;
  reset:      () => void;
}

export function useTimer(
  difficulty: Difficulty,
  onExpire?: () => void
): UseTimerReturn {
  const [elapsed,   setElapsed]   = useState(0);
  const [remaining, setRemaining] = useState(HARD_TIMER_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stop = useCallback(() => {
    setIsRunning(false);
    clear();
  }, []);

  const reset = useCallback(() => {
    stop();
    setElapsed(0);
    setRemaining(HARD_TIMER_SECONDS);
    setIsExpired(false);
  }, [stop]);

  const start = useCallback(() => {
    reset();
    setIsRunning(true);
  }, [reset]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      if (difficulty === "hard") {
        setRemaining(prev => {
          if (prev <= 1) {
            stop();
            setIsExpired(true);
            onExpireRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      } else {
        setElapsed(prev => prev + 1);
      }
    }, 1000);

    return clear;
  }, [isRunning, difficulty, stop]);

  return { elapsed, remaining, isRunning, isExpired, start, stop, reset };
}
