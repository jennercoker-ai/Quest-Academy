-- ─────────────────────────────────────────────────────────────────────────────
-- 11+ Quest Academy — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_name   TEXT NOT NULL UNIQUE,
  avatar_id   INTEGER NOT NULL DEFAULT 0,
  age         INTEGER NOT NULL CHECK (age BETWEEN 6 AND 12),
  total_xp    INTEGER NOT NULL DEFAULT 0,
  level       INTEGER NOT NULL DEFAULT 1,
  streak      INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SESSIONS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_xp              INTEGER NOT NULL DEFAULT 0,
  accuracy              NUMERIC(5,2) NOT NULL DEFAULT 0,
  questions_attempted   INTEGER NOT NULL DEFAULT 0,
  questions_correct     INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ATTEMPTS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attempts (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id          UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  player_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id         TEXT NOT NULL,
  result              TEXT NOT NULL CHECK (result IN ('correct', 'failed', 'expired')),
  xp_earned           INTEGER NOT NULL DEFAULT 0,
  attempts_used       INTEGER NOT NULL DEFAULT 1,
  hint_stage_reached  INTEGER NOT NULL DEFAULT 0,
  time_taken          INTEGER NOT NULL DEFAULT 0,    -- seconds
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── QUESTIONS (optional — can also serve from CSV/file) ─────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject       TEXT NOT NULL CHECK (subject IN ('english','maths','verbal_reasoning','nvr')),
  difficulty    TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  type          TEXT NOT NULL DEFAULT 'multiple_choice',
  question      TEXT NOT NULL,
  options       JSONB,
  answer        TEXT NOT NULL,
  hint          TEXT NOT NULL DEFAULT '',
  reference     TEXT NOT NULL DEFAULT '',
  subject_icon  TEXT NOT NULL DEFAULT '📖',
  source        TEXT CHECK (source IN ('bond','gl_assessment','custom')),
  topic         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── REWARDS (Parent Dashboard) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rewards (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id           UUID,                                              -- future: link to parent auth user
  label               TEXT NOT NULL,
  trigger_condition   TEXT NOT NULL CHECK (trigger_condition IN ('gold_trophy','xp_milestone','streak')),
  trigger_value       INTEGER,
  status              TEXT NOT NULL DEFAULT 'locked'
                        CHECK (status IN ('locked','pending_approval','released')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sessions_player_id   ON sessions(player_id);
CREATE INDEX IF NOT EXISTS idx_attempts_session_id  ON attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_attempts_player_id   ON attempts(player_id);
CREATE INDEX IF NOT EXISTS idx_attempts_question_id ON attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_profiles_total_xp    ON profiles(total_xp DESC);  -- leaderboard

-- ─── FUNCTIONS ────────────────────────────────────────────────────────────────

-- Increment player XP and recalculate level
CREATE OR REPLACE FUNCTION increment_player_xp(p_player_id UUID, p_xp_delta INTEGER)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  new_xp     INTEGER;
  new_level  INTEGER := 1;
  threshold  INTEGER := 100;
  accumulated INTEGER := 0;
BEGIN
  UPDATE profiles SET total_xp = total_xp + p_xp_delta, updated_at = NOW()
  WHERE id = p_player_id
  RETURNING total_xp INTO new_xp;

  -- Recalculate level (mirrors getLevelFromXP in lib/xp-engine.ts)
  WHILE new_xp >= accumulated + threshold LOOP
    accumulated := accumulated + threshold;
    threshold   := ROUND(threshold * 1.1);
    new_level   := new_level + 1;
  END LOOP;

  UPDATE profiles SET level = new_level WHERE id = p_player_id;
END;
$$;

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ─── ROW LEVEL SECURITY (enable before going to production) ──────────────────
-- ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sessions  ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE attempts  ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE rewards   ENABLE ROW LEVEL SECURITY;
-- (add policies once Supabase Auth is wired in)
