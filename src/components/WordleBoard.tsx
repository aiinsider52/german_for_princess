"use client";

import { WordleGuessResult } from "@/lib/types";
import { evaluateGuess } from "@/lib/wordle-logic";

interface WordleBoardProps {
  guesses: string[];
  currentInput: string;
  answer: string;
  shakeRow: number | null;
  bounceRow: number | null;
}

const statusColors: Record<string, string> = {
  correct: "bg-[#6aaa64] border-[#6aaa64] text-white",
  present: "bg-[#c9b458] border-[#c9b458] text-white",
  absent: "bg-[#787c7e] border-[#787c7e] text-white",
};

export default function WordleBoard({
  guesses,
  currentInput,
  answer,
  shakeRow,
  bounceRow,
}: WordleBoardProps) {
  const rows: { letters: string[]; results: WordleGuessResult[] | null }[] = [];

  for (let r = 0; r < 6; r++) {
    if (r < guesses.length) {
      const g = guesses[r];
      rows.push({
        letters: g.split(""),
        results: evaluateGuess(g, answer),
      });
    } else if (r === guesses.length) {
      const letters = currentInput.padEnd(5, " ").split("").slice(0, 5);
      rows.push({ letters, results: null });
    } else {
      rows.push({ letters: Array(5).fill(" "), results: null });
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      {rows.map((row, rowIdx) => {
        const isShaking = shakeRow === rowIdx;
        const isBouncing = bounceRow === rowIdx;

        return (
          <div
            key={rowIdx}
            className={`flex gap-1.5 ${
              isShaking ? "animate-wordle-shake" : ""
            } ${isBouncing ? "animate-wordle-bounce" : ""}`}
          >
            {row.letters.map((letter, colIdx) => {
              const result = row.results?.[colIdx];
              const hasLetter = letter.trim() !== "";
              const isRevealed = result != null;
              const isCurrentRow = rowIdx === guesses.length;
              const justTyped = isCurrentRow && hasLetter;

              return (
                <div
                  key={colIdx}
                  className={`w-[56px] h-[56px] flex items-center justify-center text-xl font-bold rounded-xl border-2 transition-all duration-300 select-none
                    ${
                      isRevealed
                        ? statusColors[result.status]
                        : hasLetter
                          ? "border-pink-300 bg-white text-[#2d1b26]"
                          : "border-pink-100 bg-white/50 text-transparent"
                    }
                    ${justTyped ? "animate-wordle-pop" : ""}
                  `}
                  style={
                    isRevealed
                      ? {
                          animation: `wordleFlip 0.5s ease ${colIdx * 0.1}s`,
                        }
                      : undefined
                  }
                >
                  {letter.toUpperCase()}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
