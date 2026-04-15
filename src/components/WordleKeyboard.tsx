"use client";

import { WordleGuessResult } from "@/lib/types";
import { evaluateGuess } from "@/lib/wordle-logic";

const rows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

interface WordleKeyboardProps {
  onKey: (key: string) => void;
  guesses: string[];
  answer: string;
  disabled: boolean;
}

export default function WordleKeyboard({
  onKey,
  guesses,
  answer,
  disabled,
}: WordleKeyboardProps) {
  const letterStatuses = new Map<string, "correct" | "present" | "absent">();

  for (const guess of guesses) {
    const results: WordleGuessResult[] = evaluateGuess(guess, answer);
    results.forEach((r) => {
      const existing = letterStatuses.get(r.letter);
      if (r.status === "correct") {
        letterStatuses.set(r.letter, "correct");
      } else if (r.status === "present" && existing !== "correct") {
        letterStatuses.set(r.letter, "present");
      } else if (!existing) {
        letterStatuses.set(r.letter, "absent");
      }
    });
  }

  const colorMap: Record<string, string> = {
    correct: "bg-[#6aaa64] text-white border-[#6aaa64]",
    present: "bg-[#c9b458] text-white border-[#c9b458]",
    absent: "bg-[#787c7e] text-white border-[#787c7e]",
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1">
          {row.map((key) => {
            const isSpecial = key === "ENTER" || key === "⌫";
            const status = letterStatuses.get(key);
            const colorClass = status
              ? colorMap[status]
              : "bg-pink-100 text-[#2d1b26] border-pink-200";

            return (
              <button
                key={key}
                onClick={() => {
                  if (disabled) return;
                  if (key === "⌫") onKey("Backspace");
                  else if (key === "ENTER") onKey("Enter");
                  else onKey(key);
                }}
                disabled={disabled}
                className={`${colorClass} border rounded-lg font-semibold transition-all duration-200 cursor-pointer active:scale-90 select-none
                  ${
                    isSpecial
                      ? "px-3 py-3.5 text-xs min-w-[52px]"
                      : "w-[32px] h-[44px] text-sm"
                  }
                `}
              >
                {key === "ENTER" ? "↵" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
