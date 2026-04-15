"use client";

import { useState } from "react";
import { WordleWord } from "@/lib/types";

interface WordleHintsProps {
  word: WordleWord;
  hintsUsed: number;
  onUseHint: () => void;
}

const hintLevels = [
  { icon: "🌸", label: "Тематический хинт", cost: 1 },
  { icon: "💡", label: "Первая буква", cost: 2 },
  { icon: "🎯", label: "Перевод", cost: 3 },
];

export default function WordleHints({
  word,
  hintsUsed,
  onUseHint,
}: WordleHintsProps) {
  const [open, setOpen] = useState(false);
  const [revealedLevel, setRevealedLevel] = useState(-1);

  const revealHint = (level: number) => {
    if (level > hintsUsed) return;
    setRevealedLevel(level);
    if (level === hintsUsed) {
      onUseHint();
    }
  };

  const getHintText = (level: number): string => {
    switch (level) {
      case 0:
        return `Это слово связано с: ${word.hint}`;
      case 1:
        return `Слово начинается на: ${word.word[0]}`;
      case 2:
        return `Перевод: ${word.translation}`;
      default:
        return "";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-lg cursor-pointer active:scale-90 transition-transform"
      >
        💡
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-[20px] border border-pink-100 shadow-[0_8px_30px_rgba(255,107,138,0.15)] p-4 z-50 animate-scale-in">
          <p className="text-xs text-[#9b7080] mb-3">
            Подсказки (использовано: {hintsUsed}/3)
          </p>
          <div className="space-y-2">
            {hintLevels.map((h, i) => {
              const isAvailable = i <= hintsUsed;
              const isRevealed = i <= revealedLevel;

              return (
                <div key={i}>
                  <button
                    onClick={() => isAvailable && revealHint(i)}
                    disabled={!isAvailable}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isRevealed
                        ? "bg-pink-50 border-pink-200"
                        : isAvailable
                          ? "bg-white border-pink-100 hover:border-pink-300"
                          : "bg-gray-50 border-gray-100 opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{h.icon}</span>
                        <span className="text-xs font-medium text-[#2d1b26]">
                          {h.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#9b7080]">
                        −{h.cost} ⭐
                      </span>
                    </div>
                    {isRevealed && (
                      <p className="text-sm text-pink-600 mt-2 animate-fade-in">
                        {getHintText(i)}
                      </p>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
