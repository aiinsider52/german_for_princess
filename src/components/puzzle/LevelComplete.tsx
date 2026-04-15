"use client";

import { useState, useEffect } from "react";
import { Bolt } from "@/lib/puzzle-logic";
import { PuzzleLevel } from "@/lib/puzzle-levels";
import { surprises } from "@/lib/surprises";
import SurpriseScreen from "@/components/SurpriseScreen";
import PuzzleQuiz from "./PuzzleQuiz";
import ConfettiAnimation from "@/components/ConfettiAnimation";

interface LevelCompleteProps {
  level: PuzzleLevel;
  stars: number;
  wordsLearned: Bolt[];
  onNext: () => void;
  onMenu: () => void;
}

export default function LevelComplete({
  level,
  stars,
  wordsLearned,
  onNext,
  onMenu,
}: LevelCompleteProps) {
  const [phase, setPhase] = useState<"summary" | "quiz" | "surprise">("summary");
  const [starsShown, setStarsShown] = useState(0);
  const [surprise] = useState(
    () => surprises[Math.floor(Math.random() * surprises.length)]
  );

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (starsShown < stars) {
      t = setTimeout(() => setStarsShown((s) => s + 1), 400);
    }
    return () => clearTimeout(t);
  }, [starsShown, stars]);

  if (phase === "quiz") {
    return (
      <PuzzleQuiz
        title={`Квиз уровня ${level.id} 📝`}
        subtitle="Проверь что запомнила!"
        questionCount={3}
        requiredCorrect={2}
        onPass={() => setPhase("surprise")}
        onFail={onMenu}
      />
    );
  }

  if (phase === "surprise") {
    return <SurpriseScreen surprise={surprise} onClose={onNext} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-pink-50 to-white">
      <ConfettiAnimation type="confetti" />

      <div className="w-full max-w-[360px] text-center animate-puzzle-slide-up">
        <div className="text-6xl mb-4 animate-float">{level.objectEmoji}</div>

        <h2 className="font-display text-2xl font-bold text-[#2d1b26] mb-2">
          Уровень пройден! 🎉
        </h2>
        <p className="text-sm text-[#9b7080] mb-5">
          «{level.name}» — {level.objectName}
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`text-4xl ${s <= starsShown ? "animate-puzzle-star" : "opacity-20"}`}
              style={{ animationDelay: `${(s - 1) * 0.3}s`, animationFillMode: "both" }}
            >
              ⭐
            </span>
          ))}
        </div>

        <div className="bg-white/80 rounded-[20px] p-4 mb-5 border border-pink-100/60 shadow-sm">
          <h3 className="text-sm font-bold text-[#2d1b26] mb-2">
            Слова этого уровня:
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {wordsLearned.map((b) => (
              <span
                key={b.id}
                className="inline-flex items-center gap-1 bg-pink-50 rounded-full px-3 py-1 text-xs font-medium text-[#2d1b26]"
              >
                {b.word.emoji} {b.word.german}
                <span className="text-[#9b7080]">· {b.word.russian}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="bg-pink-50/60 rounded-[16px] p-4 mb-5 border border-pink-100/40">
          <p className="text-sm text-[#9b7080] mb-2">Пройди квиз уровня и получи сюрприз! 💕</p>
          <button
            onClick={() => setPhase("quiz")}
            className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-xl py-3 text-sm active:scale-95 transition-transform shadow-md"
          >
            Пройти квиз →
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onMenu}
            className="flex-1 bg-white text-pink-500 font-semibold rounded-xl py-2.5 text-sm border border-pink-200 active:scale-95 transition-transform"
          >
            К уровням
          </button>
          <button
            onClick={onNext}
            className="flex-1 bg-pink-500 text-white font-semibold rounded-xl py-2.5 text-sm active:scale-95 transition-transform shadow-md"
          >
            Далее →
          </button>
        </div>
      </div>
    </div>
  );
}
