# 🦉 11+ Quest Academy

> Gamified 11+ exam preparation for children ages 6–10.  
> Built with **Next.js 14 App Router · TypeScript · Tailwind CSS · Framer Motion · Supabase**

---

## 📁 Project Structure

```
eleven-plus-quest/
├── app/
│   ├── layout.tsx              # Root layout + font preloads
│   ├── page.tsx                # Home / lobby screen
│   ├── study/
│   │   └── page.tsx            # Study session route
│   └── api/
│       └── progress/
│           └── route.ts        # POST: save session result to Supabase
│
├── components/
│   └── game/
│       └── StudySession.tsx    # ← Main game component (start here)
│
├── hooks/
│   ├── useTimer.ts             # Countdown (hard) + count-up (easy/medium)
│   └── useReadAloud.ts         # Web Speech API wrapper
│
├── lib/
│   ├── xp-engine.ts            # Points formula, level calc, breakdowns
│   ├── supabase.ts             # Supabase client + helper functions
│   ├── csv-import.ts           # Bond + GL Assessment CSV parser
│   └── mock-questions.ts       # Sample questions for dev/testing
│
├── types/
│   └── index.ts                # All shared TypeScript types
│
├── styles/
│   └── globals.css             # Tailwind base + custom component classes
│
├── supabase/
│   └── schema.sql              # Full DB schema — run in Supabase SQL Editor
│
├── .env.example                # Copy to .env.local and fill in
├── railway.toml                # Railway deployment config
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

---

## 🚀 Quick Start (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase URL + anon key

# 3. Run development server
npm run dev

# Open http://localhost:3000
```

---

## 🗄️ Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste + run `supabase/schema.sql`
3. Copy **Project URL** and **anon key** from Project Settings → API
4. Add both to `.env.local`

The app runs without Supabase (mock/local mode) — you'll see a console warning.

---

## 🚂 Deploy to Railway

### First deploy
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project + deploy
railway init
railway up
```

### Add environment variables in Railway
1. Open your Railway project dashboard
2. Go to **Variables**
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Railway auto-injects `PORT` — Next.js respects it automatically

### Subsequent deploys
```bash
railway up
# or connect GitHub repo for automatic deploys on push
```

---

## 🎮 Game Logic

### Feedback Loop (per question)
| Attempt | Result | Action |
|---------|--------|--------|
| 1st wrong | ❌ | Show **Scholar's Hint** (nudge) |
| 2nd wrong | ❌ | Show **Reference Card** (education) |
| 3rd wrong | ❌ | Reveal answer, **0 XP** |
| Any correct | ✅ | Award XP, advance |

### XP Formula
```
Total XP = (Base Points × Difficulty_Multiplier)
         + (Accuracy_Bonus × Age_Equalizer)
         + Time_Bonus (hard mode only)
```

| Variable | Values |
|----------|--------|
| Base Points | Easy: 10 · Medium: 20 · Hard: 40 |
| Difficulty Multiplier | Easy: 1.0x · Medium: 1.5x · Hard: 2.0x |
| Age Equalizer | 6–7: 2.0x · 8–9: 1.5x · 10: 1.0x |
| Accuracy Bonus | 1st attempt: +50% base · 2nd: +20% base |
| Time Bonus | Hard only: remaining seconds × 0.5 |

---

## 📥 CSV Import (Bond & GL Assessment)

```typescript
import { importCSVFile } from "@/lib/csv-import";

// In a file input handler:
const result = await importCSVFile(file, "bond"); // or "gl_assessment"
console.log(result.imported, "questions imported");
console.log(result.errors);  // any row-level parse errors
```

**Bond CSV format:** `Subject, Difficulty, Question, OptionA, OptionB, OptionC, OptionD, Answer, Hint, Reference, Topic`

**GL Assessment CSV format:** `subject, level, q_text, opt_1, opt_2, opt_3, opt_4, correct_answer, hint_text, explanation, topic_tag`

Template strings are exported from `lib/csv-import.ts` as `BOND_CSV_TEMPLATE` and `GL_CSV_TEMPLATE`.

---

## 🛣️ Roadmap (next sprints)

- [ ] **Auth** — Supabase Auth (magic link, no password for kids)
- [ ] **Parent Dashboard** — Weak-spot heatmap, reward vault, trophy approval
- [ ] **Leaderboard** — Global + age-group filtered with Hero Names
- [ ] **CSV Admin UI** — Drag-and-drop import page for question banks
- [ ] **NVR image questions** — SVG-based pattern rendering
- [ ] **Offline support** — PWA + service worker for tablet use

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Navy | `#0c1a3a` |
| Gold | `#f59e0b` |
| Emerald | `#10b981` |
| Display font | Cinzel (headings) |
| Body font | Lora (question text) |
| UI font | DM Sans (everything else) |

---

## 📝 Notes for Code Review (Cursor)

- `components/game/StudySession.tsx` — main game loop, all state lives here for now. Extract to Zustand store when adding multiplayer/parent sync.
- `lib/xp-engine.ts` — pure functions, fully unit-testable. All constants at the top for easy tuning.
- `lib/supabase.ts` — returns `null` gracefully if env vars missing (dev mode). Add proper error boundaries before production.
- `supabase/schema.sql` — RLS policies are scaffolded but commented out. Enable before go-live.
- Hard timer is set to 60s in `lib/xp-engine.ts` (`HARD_TIMER_SECONDS`). Adjust per question type when building question editor.
