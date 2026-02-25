"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Volume2, VolumeX, ChevronRight, Trophy, Zap, Flame, RotateCcw } from "lucide-react";
import type { Question, HintStage, QuestionAttempt, Difficulty, Subject } from "@/types";
import { calculateXP, calculateTimeBonus } from "@/lib/xp-engine";
import { MOCK_QUESTIONS } from "@/lib/mock-questions";
import { useTimer } from "@/hooks/useTimer";
import { useReadAloud } from "@/hooks/useReadAloud";

// ─── Style Maps ──────────────────────────────────────────────────────────────
const SUBJECT_STYLES: Record<Subject, { headerGrad: string; badge: string; label: string }> = {
  english:          { headerGrad: "from-indigo-600 to-indigo-800",   badge: "bg-indigo-500",  label: "English" },
  maths:            { headerGrad: "from-emerald-600 to-emerald-800", badge: "bg-emerald-500", label: "Maths" },
  verbal_reasoning: { headerGrad: "from-amber-500 to-amber-700",     badge: "bg-amber-500",   label: "Verbal Reasoning" },
  nvr:              { headerGrad: "from-violet-600 to-violet-800",   badge: "bg-violet-500",  label: "Non-Verbal Reasoning" },
};

const DIFF_STYLES: Record<Difficulty, { label: string; color: string; bg: string }> = {
  easy:   { label: "Foundation",  color: "text-emerald-400", bg: "bg-emerald-400/20 border-emerald-400/40" },
  medium: { label: "Applied",     color: "text-amber-400",   bg: "bg-amber-400/20  border-amber-400/40"   },
  hard:   { label: "Exam Style ⏱", color: "text-rose-400",   bg: "bg-rose-400/20   border-rose-400/40"    },
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function TimerRing({ remaining, elapsed, isHard }: { remaining: number; elapsed: number; isHard: boolean }) {
  const TOTAL = 60;
  const pct   = isHard ? remaining / TOTAL : 1;
  const r     = 26;
  const circ  = 2 * Math.PI * r;
  const urgent = isHard && remaining <= 15;
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r={r} fill="none" stroke="#1e293b" strokeWidth="4" />
        <motion.circle
          cx="30" cy="30" r={r} fill="none"
          stroke={urgent ? "#f43f5e" : isHard ? "#f59e0b" : "#10b981"}
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={circ - circ * pct}
          strokeLinecap="round"
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${urgent ? "text-rose-400" : "text-slate-200"}`}>
        {isHard ? fmt(remaining) : fmt(elapsed)}
      </div>
    </div>
  );
}

function AttemptOrbs({ attempts }: { attempts: number }) {
  return (
    <div className="flex gap-2">
      {[0,1,2].map(i => (
        <motion.div
          key={i}
          className={`w-3 h-3 rounded-full border-2 ${i < attempts ? "bg-rose-500 border-rose-400" : "bg-transparent border-slate-500"}`}
          animate={i === attempts - 1 && attempts > 0 ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

function HintPanel({ stage, hint, reference }: { stage: HintStage; hint: string; reference: string }) {
  const isRef = stage >= 2;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`mt-4 rounded-2xl border p-4 ${isRef ? "bg-amber-950/60 border-amber-500/50" : "bg-indigo-950/60 border-indigo-400/50"}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{isRef ? "📚" : "💡"}</span>
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isRef ? "text-amber-400" : "text-indigo-300"}`}>
            {isRef ? "Scholar's Reference Card" : "Scholar's Hint"}
          </p>
          <p className="text-sm text-slate-200 leading-relaxed">{isRef ? reference : hint}</p>
        </div>
      </div>
    </motion.div>
  );
}

function AnswerReveal({ answer }: { answer: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="mt-4 rounded-2xl border border-emerald-500/50 bg-emerald-950/60 p-4"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">✅ Correct Answer</p>
      <p className="text-lg font-bold text-white">{answer}</p>
      <p className="text-xs text-slate-400 mt-1">0 XP awarded — review the Reference Card and try again next time!</p>
    </motion.div>
  );
}

// ─── SESSION COMPLETE SCREEN ─────────────────────────────────────────────────
function SessionComplete({
  sessionXP, streak, history, onReplay,
}: {
  sessionXP: number; streak: number; history: QuestionAttempt[]; onReplay: () => void;
}) {
  const correct  = history.filter(h => h.result === "correct").length;
  const accuracy = history.length > 0 ? Math.round((correct / history.length) * 100) : 0;
  const isGold   = accuracy === 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "radial-gradient(ellipse at top, #0f172a 0%, #020617 100%)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          className="text-8xl mb-6 inline-block"
          animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {isGold ? "🏆" : accuracy >= 70 ? "🥈" : "🎯"}
        </motion.div>

        <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
          {isGold ? "Perfect Quest!" : "Quest Complete!"}
        </h2>
        <p className="text-slate-400 mb-8">
          {isGold
            ? "A Gold Trophy! Your parent has been notified. 🌟"
            : "Great work — keep practising to reach Gold!"}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total XP", value: `+${sessionXP}`, icon: <Zap size={18} className="text-amber-400" /> },
            { label: "Accuracy", value: `${accuracy}%`,  icon: <Trophy size={18} className="text-indigo-400" /> },
            { label: "Streak",   value: streak,           icon: <Flame size={18} className="text-orange-400" /> },
          ].map(s => (
            <div key={s.label} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReplay}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 border border-slate-700
                       text-slate-300 font-bold rounded-2xl hover:border-indigo-500/50 hover:text-white transition-colors"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-amber-500
                       text-slate-900 font-black rounded-2xl text-center
                       hover:scale-105 transition-transform shadow-lg shadow-amber-500/25"
          >
            Home 🏠
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-600">
          Connect Supabase to sync progress across devices
        </p>
      </motion.div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function StudySession() {
  // TODO: Replace with auth context / props
  const PLAYER_AGE  = 9;
  const questions: Question[] = MOCK_QUESTIONS;
  const fallbackQuestion: Question = {
    id: "fallback-question",
    subject: "english",
    difficulty: "easy",
    type: "multiple_choice",
    question: "No questions available right now.",
    options: [],
    answer: "",
    hint: "",
    reference: "",
    subject_icon: "📖",
  };

  const [qIndex,          setQIndex]          = useState(0);
  const [selected,        setSelected]        = useState<string | null>(null);
  const [attempts,        setAttempts]        = useState(0);
  const [hintStage,       setHintStage]       = useState<HintStage>(0);
  const [answerRevealed,  setAnswerRevealed]  = useState(false);
  const [isCorrect,       setIsCorrect]       = useState(false);
  const [sessionXP,       setSessionXP]       = useState(0);
  const [xpBurst,         setXpBurst]         = useState(0);
  const [showBurst,       setShowBurst]       = useState(false);
  const [streak,          setStreak]          = useState(0);
  const [history,         setHistory]         = useState<QuestionAttempt[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const burstTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearSelectedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasQuestions = questions.length > 0;
  const q = questions[qIndex] ?? fallbackQuestion;
  const isHard = q.difficulty === "hard";
  const subStyle  = SUBJECT_STYLES[q.subject];
  const diffStyle = DIFF_STYLES[q.difficulty];

  // ── Callbacks must be defined before useTimer ────────────────────────────
  const handleExpire = useCallback(() => {
    if (isCorrect || answerRevealed) return;
    setAnswerRevealed(true);
    setAttempts(3);
    setStreak(0);
    setHistory(h => [...h, {
      questionId: q.id, result: "expired", xpEarned: 0,
      attemptsUsed: 3, hintStageReached: hintStage, timeTaken: 60,
    }]);
  }, [q.id, hintStage, isCorrect, answerRevealed]);

  const { elapsed, remaining, start, stop, reset } = useTimer(q.difficulty, handleExpire);
  const { speak, cancel, isActive: readAloudActive, isSupported: speechSupported } = useReadAloud();

  // Reset on question change
  useEffect(() => { reset(); start(); }, [qIndex]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => {
    if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
    if (clearSelectedTimeoutRef.current) clearTimeout(clearSelectedTimeoutRef.current);
  }, []);

  // ── Answer selection ──────────────────────────────────────────────────────
  const handleSelect = (option: string) => {
    if (answerRevealed || isCorrect) return;
    cancel();
    setSelected(option);

    const correct     = option === q.answer;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (correct) {
      stop();
      setIsCorrect(true);
      const timeBonus = calculateTimeBonus(remaining, q.difficulty);
      const earned    = calculateXP({ difficulty: q.difficulty, age: PLAYER_AGE, attemptNumber: newAttempts, isCorrect: true, timeBonus });
      setSessionXP(p => p + earned);
      setXpBurst(earned);
      setShowBurst(true);
      setStreak(s => s + 1);
      if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
      burstTimeoutRef.current = setTimeout(() => setShowBurst(false), 1800);
      setHistory(h => [...h, {
        questionId: q.id, result: "correct", xpEarned: earned,
        attemptsUsed: newAttempts, hintStageReached: hintStage, timeTaken: isHard ? 60 - remaining : elapsed,
      }]);
    } else {
      if (newAttempts === 1)      setHintStage(1);
      else if (newAttempts === 2) setHintStage(2);
      else {
        stop();
        setAnswerRevealed(true);
        setStreak(0);
        setHistory(h => [...h, {
          questionId: q.id, result: "failed", xpEarned: 0,
          attemptsUsed: newAttempts, hintStageReached: 2, timeTaken: isHard ? 60 - remaining : elapsed,
        }]);
      }
      if (clearSelectedTimeoutRef.current) clearTimeout(clearSelectedTimeoutRef.current);
      clearSelectedTimeoutRef.current = setTimeout(() => setSelected(null), 600);
    }
  };

  const handleNext = () => {
    if (qIndex + 1 >= questions.length) {
      setSessionComplete(true);
    } else {
      setQIndex(i => i + 1);
      setSelected(null);
      setAttempts(0);
      setHintStage(0);
      setAnswerRevealed(false);
      setIsCorrect(false);
    }
  };

  const handleReplay = () => {
    setQIndex(0); setSessionXP(0); setStreak(0); setHistory([]);
    setSessionComplete(false); setAttempts(0); setHintStage(0);
    setAnswerRevealed(false); setIsCorrect(false); setSelected(null);
  };

  const timeBonus = calculateTimeBonus(remaining, q.difficulty);
  const xpPreview = calculateXP({ difficulty: q.difficulty, age: PLAYER_AGE, attemptNumber: attempts + 1, isCorrect: true, timeBonus });
  const accuracy  = history.length > 0 ? Math.round(history.filter(h => h.result === "correct").length / history.length * 100) : 0;

  if (sessionComplete) {
    return <SessionComplete sessionXP={sessionXP} streak={streak} history={history} onReplay={handleReplay} />;
  }

  if (!hasQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center text-slate-300">
        No questions available right now.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "radial-gradient(ellipse at 20% 20%, #0c1a3a 0%, #020617 60%, #0a1628 100%)" }}
    >
      {/* ── HEADER ───────────────────────────────────────────────── */}
      <header className="px-4 pt-5 pb-3 max-w-2xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600
                          flex items-center justify-center text-lg shadow-lg shadow-amber-500/30">
            🦉
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Quest Academy</p>
            <p className="text-sm font-bold text-amber-400 group-hover:text-amber-300 transition-colors">Brave-Owl-44</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full"
            animate={showBurst ? { scale: [1, 1.2, 1] } : {}}
          >
            <Zap size={12} className="text-amber-400" />
            <span className="text-sm font-black text-amber-400">{sessionXP} XP</span>
          </motion.div>
          <AnimatePresence>
            {streak > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-500/15 border border-orange-500/30 rounded-full"
              >
                <Flame size={12} className="text-orange-400" />
                <span className="text-xs font-bold text-orange-400">{streak}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── PROGRESS BAR ─────────────────────────────────────────── */}
      <div className="px-4 max-w-2xl mx-auto">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-slate-500">Q {qIndex + 1} / {questions.length}</span>
          <span className="text-xs text-slate-500">{history.length > 0 ? `${accuracy}% accuracy` : "Ready!"}</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
            animate={{ width: `${(qIndex / questions.length) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* ── QUESTION CARD ─────────────────────────────────────────── */}
      <main className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/60"
        >
          {/* Card Header */}
          <div className={`bg-gradient-to-r ${subStyle.headerGrad} px-5 py-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{q.subject_icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">{subStyle.label}</p>
                  <div className={`difficulty-badge border mt-0.5 ${diffStyle.bg} ${diffStyle.color}`}>
                    {diffStyle.label}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TimerRing remaining={remaining} elapsed={elapsed} isHard={isHard} />
                {speechSupported && (
                  <button
                    onClick={() => readAloudActive ? cancel() : speak(q.question)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      readAloudActive ? "bg-white/30 scale-110" : "bg-white/10 hover:bg-white/20"
                    }`}
                    aria-label={readAloudActive ? "Stop reading" : "Read question aloud"}
                  >
                    {readAloudActive
                      ? <Volume2 size={16} className="text-white" />
                      : <VolumeX  size={16} className="text-white/70" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="bg-slate-900/95 px-5 pt-5 pb-6 relative">
            {/* XP Burst */}
            <AnimatePresence>
              {showBurst && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.p
                    className="text-5xl font-black text-amber-400 drop-shadow-2xl"
                    initial={{ scale: 0.5, y: 10 }}
                    animate={{ scale: [0.5, 1.2, 1.0], y: [10, -20, -40] }}
                    exit={{ opacity: 0, y: -70, scale: 0.8 }}
                    transition={{ duration: 1.6 }}
                  >
                    +{xpBurst} XP ✨
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Attempts */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Attempts</p>
              <AttemptOrbs attempts={attempts} />
            </div>

            {/* Question */}
            <p className="text-white text-base leading-relaxed font-medium mb-5" style={{ fontFamily: "'Lora', serif" }}>
              {q.question}
            </p>

            {/* Options */}
            <div className="grid gap-2.5">
              {q.options?.map((opt) => {
                const showCorrect   = (isCorrect || answerRevealed) && opt === q.answer;
                const showIncorrect = opt === selected && !isCorrect && hintStage > 0;

                return (
                  <motion.button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={isCorrect || answerRevealed}
                    className={`option-btn ${
                      showCorrect   ? "option-btn--correct" :
                      showIncorrect ? "option-btn--incorrect" :
                      "option-btn--default"
                    }`}
                    whileHover={!isCorrect && !answerRevealed ? { scale: 1.01 } : {}}
                    whileTap={!isCorrect && !answerRevealed ? { scale: 0.99 } : {}}
                    animate={showIncorrect ? { x: [-4, 4, -4, 4, 0] } : {}}
                    transition={showIncorrect ? { duration: 0.4 } : {}}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {/* Hint / Reference panels */}
            <AnimatePresence>
              {hintStage >= 1 && !isCorrect && (
                <HintPanel stage={hintStage} hint={q.hint} reference={q.reference} />
              )}
            </AnimatePresence>

            {/* Answer Reveal */}
            <AnimatePresence>
              {answerRevealed && <AnswerReveal answer={q.answer} />}
            </AnimatePresence>

            {/* Success Banner */}
            <AnimatePresence>
              {isCorrect && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="font-bold text-emerald-400">
                        {attempts === 1 ? "Perfect Answer!" : attempts === 2 ? "Well Done!" : "Got it!"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        +{xpBurst} XP earned
                        {isHard && timeBonus > 0 && ` · ${timeBonus} time bonus included`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Button */}
            <AnimatePresence>
              {(isCorrect || answerRevealed) && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  onClick={handleNext}
                  className="mt-5 w-full py-3.5 rounded-2xl font-black text-slate-900 text-sm
                             uppercase tracking-widest bg-gradient-to-r from-amber-400 to-amber-500
                             hover:from-amber-300 hover:to-amber-400 transition-all hover:scale-[1.02]
                             shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  {qIndex + 1 >= questions.length ? "Finish Quest 🏆" : <>Next Question <ChevronRight size={16} /></>}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* XP Formula Display */}
        <p className="mt-3 px-2 text-center text-xs text-slate-700">
          Next correct: ~+{xpPreview} XP · {q.difficulty} {DIFF_STYLES[q.difficulty].label} · Age {PLAYER_AGE}
        </p>
      </main>
    </div>
  );
}
