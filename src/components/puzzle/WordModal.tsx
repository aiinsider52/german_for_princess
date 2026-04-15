"use client";

import { useState, useCallback, useEffect } from "react";
import { Bolt, BOLT_COLORS } from "@/lib/puzzle-logic";
import { buildOptions } from "@/lib/puzzle-words";

interface WordModalProps {
  bolt: Bolt;
  onCorrect: () => void;
  onWrong: () => void;
}

export default function WordModal({ bolt, onCorrect, onWrong }: WordModalProps) {
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [optionsData] = useState(() => buildOptions(bolt.word));

  const handleSelect = useCallback(
    (index: number) => {
      if (result) return;
      setSelected(index);
      if (index === optionsData.correctIndex) {
        setResult("correct");
        if (navigator.vibrate) navigator.vibrate(50);
        setTimeout(onCorrect, 900);
      } else {
        setResult("wrong");
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        setTimeout(onWrong, 1400);
      }
    },
    [result, optionsData.correctIndex, onCorrect, onWrong]
  );

  useEffect(() => {
    return () => {
      setResult(null);
      setSelected(null);
    };
  }, []);

  const color = BOLT_COLORS[bolt.color];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[24px] p-6 w-full max-w-[340px] shadow-xl animate-slide-up">
        <div className="text-center mb-4">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 text-3xl"
            style={{ backgroundColor: color.bg + "30" }}
          >
            {bolt.word.emoji}
          </div>
          <h3 className="font-display text-2xl font-bold text-[#2d1b26]">
            {bolt.word.german}
          </h3>
          <p className="text-sm text-[#9b7080] mt-1">Что означает это слово?</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {optionsData.options.map((opt, i) => {
            let btnClass = "bg-pink-50/80 border-pink-100 text-[#2d1b26]";
            if (selected !== null) {
              if (i === optionsData.correctIndex)
                btnClass = "bg-green-100 border-green-400 text-green-800";
              else if (i === selected && result === "wrong")
                btnClass = "bg-red-100 border-red-400 text-red-800";
              else btnClass = "bg-gray-50 border-gray-200 text-[#9b7080] opacity-60";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={result !== null}
                className={`${btnClass} rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all active:scale-95`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {result && (
          <div
            className={`mt-4 text-center text-sm font-bold rounded-xl py-2 animate-scale-in ${
              result === "correct"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {result === "correct" ? "✓ Richtig! 🎉" : `−1 ❤️ · Правильно: ${bolt.word.russian}`}
          </div>
        )}
      </div>
    </div>
  );
}
