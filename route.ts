import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient, saveSessionResult, updatePlayerXP } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      playerId?: string;
      sessionXP?: number;
      accuracy?: number;
      questionsAttempted?: number;
      questionsCorrect?: number;
    };
    const playerId = body.playerId;
    const sessionXP = Number(body.sessionXP ?? 0);
    const accuracy = Number(body.accuracy ?? 0);
    const questionsAttempted = Number(body.questionsAttempted ?? 0);
    const questionsCorrect = Number(body.questionsCorrect ?? 0);

    if (!playerId) {
      return NextResponse.json({ error: "playerId required" }, { status: 400 });
    }
    if (
      !Number.isFinite(sessionXP) ||
      !Number.isFinite(accuracy) ||
      !Number.isFinite(questionsAttempted) ||
      !Number.isFinite(questionsCorrect)
    ) {
      return NextResponse.json({ error: "Invalid numeric payload" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      if (process.env.NODE_ENV !== "production") {
        // Keep local DX flexible, but never mask config issues in production.
        return NextResponse.json({ success: true, dev: true, xpSaved: sessionXP });
      }
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
    }

    // 1. Insert session record
    const session = await saveSessionResult(playerId, {
      totalXP: sessionXP,
      accuracy,
      questionsAttempted,
      questionsCorrect,
    });
    if (!session) {
      throw new Error("Failed to save session");
    }

    // 2. Increment player total XP (handled by a DB function)
    const xpResult = await updatePlayerXP(playerId, sessionXP);
    if (xpResult === null) {
      console.warn("[API] increment_player_xp RPC error");
    }

    return NextResponse.json({ success: true, sessionId: session.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[API /progress]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
