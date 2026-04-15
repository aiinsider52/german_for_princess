"use client";

import { puzzleLevels } from "@/lib/puzzle-levels";
import { PuzzleState } from "@/lib/types";
import { useRouter } from "next/navigation";

interface LevelMapProps {
  puzzleState: PuzzleState;
}

export default function LevelMap({ puzzleState }: LevelMapProps) {
  const router = useRouter();
  const completedCount = Object.values(puzzleState.levelsProgress).filter((p) => p.completed).length;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-pink-50 to-white pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 text-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="absolute left-4 top-6 text-sm text-[#9b7080] font-medium active:scale-95 transition-transform"
        >
          ← Назад
        </button>
        <h1 className="font-display text-2xl font-bold text-[#2d1b26]">
          Puzzle Adventure 🔩
        </h1>
        <p className="text-sm text-[#9b7080] mt-1">
          Откручивай болтики — учи немецкий! 💕
        </p>
        <div className="inline-flex items-center gap-1.5 bg-white/80 rounded-full px-4 py-1.5 mt-3 border border-pink-100/60 shadow-sm">
          <span className="text-lg">⭐</span>
          <span className="font-bold text-[#2d1b26] text-sm">
            {puzzleState.totalStars}
          </span>
          <span className="text-xs text-[#9b7080]">/ {puzzleLevels.length * 3}</span>
        </div>
      </div>

      {/* Level cards with connecting lines */}
      <div className="relative px-6 pt-2">
        {/* Vertical connecting line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-pink-200/60 -translate-x-1/2" />

        <div className="space-y-5 relative">
          {puzzleLevels.map((level, index) => {
            const progress = puzzleState.levelsProgress[level.id];
            const isCompleted = progress?.completed;
            const isCurrent = completedCount >= level.unlockRequirement && !isCompleted;
            const isLocked = completedCount < level.unlockRequirement;

            const difficultyLabel =
              level.difficulty === "easy" ? "Легко" : level.difficulty === "medium" ? "Средне" : "Сложно";
            const difficultyColor =
              level.difficulty === "easy"
                ? "text-green-500 bg-green-50"
                : level.difficulty === "medium"
                  ? "text-yellow-600 bg-yellow-50"
                  : "text-red-500 bg-red-50";

            return (
              <div key={level.id} className="relative">
                {/* Connector dot */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 -top-2.5 w-4 h-4 rounded-full border-2 z-10 ${
                    isCompleted
                      ? "bg-pink-400 border-pink-500"
                      : isCurrent
                        ? "bg-white border-pink-400 animate-roadmap-pulse"
                        : "bg-gray-200 border-gray-300"
                  }`}
                />

                <button
                  onClick={() => {
                    if (!isLocked) router.push(`/puzzle/play?level=${level.id}`);
                  }}
                  disabled={isLocked}
                  className={`w-full text-left rounded-[20px] p-4 border-2 transition-all active:scale-[0.98] ${
                    isCompleted
                      ? "bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 shadow-[0_4px_20px_rgba(255,107,138,0.12)]"
                      : isCurrent
                        ? "bg-white border-pink-300 shadow-md animate-continue-pulse"
                        : "bg-gray-50/80 border-gray-200 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-3xl w-14 h-14 flex items-center justify-center rounded-xl ${
                        isLocked ? "grayscale" : ""
                      }`}
                      style={{
                        backgroundColor: isCompleted ? "#fff0f5" : isCurrent ? "#ffe4ec" : "#f5f5f5",
                      }}
                    >
                      {isLocked ? "🔒" : level.objectEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#9b7080] font-medium">
                          Уровень {level.id}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${difficultyColor}`}>
                          {difficultyLabel}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-[#2d1b26] text-base mt-0.5 truncate">
                        {level.name}
                      </h3>
                      {isCompleted && progress && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((s) => (
                              <span key={s} className="text-sm">
                                {s <= progress.stars ? "⭐" : "☆"}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] text-[#9b7080]">
                            {progress.wordsLearned.length} слов
                          </span>
                        </div>
                      )}
                      {isCurrent && (
                        <p className="text-sm font-semibold text-pink-500 mt-1">
                          Играть →
                        </p>
                      )}
                      {isLocked && (
                        <p className="text-xs text-[#9b7080] mt-1">
                          Пройди {level.unlockRequirement} {level.unlockRequirement === 1 ? "уровень" : "уровня"} чтобы открыть
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
