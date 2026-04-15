"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppState } from "@/lib/types";
import { loadState, savePuzzleLevelComplete } from "@/lib/store";
import { puzzleLevels } from "@/lib/puzzle-levels";
import PuzzleBoard from "@/components/puzzle/PuzzleBoard";

function PuzzlePlayInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const levelId = Number(searchParams.get("level")) || 1;
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  const level = puzzleLevels.find((l) => l.id === levelId);

  const handleComplete = useCallback(
    (stars: number, livesLeft: number, words: string[]) => {
      if (!state) return;
      const newState = savePuzzleLevelComplete(state, levelId, stars, livesLeft, words);
      setState(newState);
    },
    [state, levelId]
  );

  const handleMenu = useCallback(() => {
    router.push("/puzzle");
  }, [router]);

  const handleNext = useCallback(() => {
    const nextLevel = puzzleLevels.find((l) => l.id === levelId + 1);
    if (nextLevel) {
      router.push(`/puzzle/play?level=${nextLevel.id}`);
    } else {
      router.push("/puzzle");
    }
  }, [router, levelId]);

  if (!state || !level) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-soft text-4xl mb-3">🔩</div>
          <p className="text-sm text-[#9b7080]">Загружаем уровень...</p>
        </div>
      </div>
    );
  }

  return (
    <PuzzleBoard
      key={levelId}
      level={level}
      onComplete={handleComplete}
      onMenu={handleMenu}
      onNext={handleNext}
    />
  );
}

export default function PuzzlePlayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center">
          <div className="animate-pulse-soft text-4xl">🔩</div>
        </div>
      }
    >
      <PuzzlePlayInner />
    </Suspense>
  );
}
