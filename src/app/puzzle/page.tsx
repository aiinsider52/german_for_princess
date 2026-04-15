"use client";

import { useEffect, useState } from "react";
import { AppState } from "@/lib/types";
import { loadState } from "@/lib/store";
import LevelMap from "@/components/puzzle/LevelMap";

export default function PuzzlePage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  if (!state) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-pulse-soft text-2xl">🔩</div>
      </div>
    );
  }

  return <LevelMap puzzleState={state.puzzle} />;
}
