import { Suspense } from "react";
import StudySession from "@/components/game/StudySession";

// Force dynamic rendering — session state is client-side
export const dynamic = "force-dynamic";

export default function StudyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="text-amber-400 text-2xl animate-bounce-slow">🦉</div>
        </div>
      }
    >
      <StudySession />
    </Suspense>
  );
}