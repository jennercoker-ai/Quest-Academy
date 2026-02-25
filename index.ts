// ─── Subjects & Difficulty ──────────────────────────────────────────────────
export type Subject = "english" | "maths" | "verbal_reasoning" | "nvr";
export type Difficulty = "easy" | "medium" | "hard";
export type AgeGroup = "6-7" | "8-9" | "10";

// ─── Question ───────────────────────────────────────────────────────────────
export interface Question {
  id: string;
  subject: Subject;
  difficulty: Difficulty;
  type: "multiple_choice" | "short_answer" | "pattern";
  question: string;
  options?: string[];         // multiple_choice only
  answer: string;
  hint: string;               // Scholar's Hint (attempt 1 wrong)
  reference: string;          // Reference Card  (attempt 2 wrong)
  subject_icon: string;
  // Optional metadata from CSV import
  source?: "bond" | "gl_assessment" | "custom";
  topic?: string;             // e.g. "Synonyms", "Speed Distance Time"
  curriculum_ref?: string;
}

// ─── Session State ───────────────────────────────────────────────────────────
export type HintStage = 0 | 1 | 2;           // 0=none, 1=hint, 2=reference
export type AttemptResult = "correct" | "failed" | "expired";

export interface QuestionAttempt {
  questionId: string;
  result: AttemptResult;
  xpEarned: number;
  attemptsUsed: number;
  hintStageReached: HintStage;
  timeTaken: number;          // seconds
}

export interface SessionSummary {
  totalXP: number;
  accuracy: number;           // 0–100
  streak: number;
  questionsAttempted: number;
  questionsCorrect: number;
  weakSpots: Subject[];       // subjects with hintStage ≥ 1
  history: QuestionAttempt[];
}

// ─── Player / Profile ────────────────────────────────────────────────────────
export interface PlayerProfile {
  id: string;
  heroName: string;           // e.g. "Brave-Owl-44"
  avatarId: number;           // index into static avatar list
  age: number;
  ageGroup: AgeGroup;
  totalXP: number;
  level: number;
  streak: number;
  createdAt: string;
}

// ─── XP Engine ───────────────────────────────────────────────────────────────
export interface XPCalculationInput {
  difficulty: Difficulty;
  age: number;
  attemptNumber: number;      // 1, 2, or 3
  isCorrect: boolean;
  timeBonus?: number;
}

// ─── CSV Import ──────────────────────────────────────────────────────────────
export type CSVSource = "bond" | "gl_assessment";

// Bond Assessment CSV columns
export interface BondCSVRow {
  Subject: string;
  Difficulty: string;
  Question: string;
  OptionA: string;
  OptionB: string;
  OptionC: string;
  OptionD: string;
  Answer: string;
  Hint: string;
  Reference: string;
  Topic?: string;
}

// GL Assessment CSV columns
export interface GLAssessmentCSVRow {
  subject: string;
  level: string;
  q_text: string;
  opt_1: string;
  opt_2: string;
  opt_3: string;
  opt_4: string;
  correct_answer: string;
  hint_text: string;
  explanation: string;
  topic_tag?: string;
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  heroName: string;
  avatarId: number;
  totalXP: number;
  ageGroup: AgeGroup;
  level: number;
}

// ─── Parent Dashboard ────────────────────────────────────────────────────────
export interface Reward {
  id: string;
  label: string;             // e.g. "30 mins Gaming"
  triggerCondition: "gold_trophy" | "xp_milestone" | "streak";
  triggerValue?: number;
  status: "locked" | "pending_approval" | "released";
  createdAt: string;
}

export interface WeakSpotData {
  subject: Subject;
  topic: string;
  hintTriggerCount: number;
  referenceTriggerCount: number;
  lastSeen: string;
}

// ─── Supabase DB Row types (mirror your schema) ──────────────────────────────
export interface DBProfile {
  id: string;
  hero_name: string;
  avatar_id: number;
  age: number;
  total_xp: number;
  level: number;
  streak: number;
  created_at: string;
  updated_at: string;
}

export interface DBSession {
  id: string;
  player_id: string;
  total_xp: number;
  accuracy: number;
  questions_attempted: number;
  questions_correct: number;
  created_at: string;
}

export interface DBAttempt {
  id: string;
  session_id: string;
  player_id: string;
  question_id: string;
  result: AttemptResult;
  xp_earned: number;
  attempts_used: number;
  hint_stage_reached: HintStage;
  time_taken: number;
  created_at: string;
}
