"use client";

import { useState, useCallback } from "react";
import { quizQuestions } from "@/lib/quiz-bank";

interface PuzzleQuizProps {
  title: string;
  subtitle: string;
  questionCount: number;
  requiredCorrect: number;
  onPass: () => void;
  onFail: () => void;
}

export default function PuzzleQuiz({
  title,
  subtitle,
  questionCount,
  requiredCorrect,
  onPass,
  onFail,
}: PuzzleQuizProps) {
  const [questions] = useState(() => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<"playing" | "result">("playing");

  const q = questions[currentIndex];

  const handleSelect = useCallback(
    (option: string) => {
      if (selected) return;
      setSelected(option);
      const isCorrect = option === q.correct;
      const newCorrect = isCorrect ? correctCount + 1 : correctCount;
      if (isCorrect) setCorrectCount(newCorrect);

      setTimeout(() => {
        if (currentIndex + 1 < questionCount) {
          setCurrentIndex((i) => i + 1);
          setSelected(null);
        } else {
          setPhase("result");
          if (newCorrect >= requiredCorrect) {
            setTimeout(onPass, 1800);
          }
        }
      }, 800);
    },
    [selected, q, correctCount, currentIndex, questionCount, requiredCorrect, onPass]
  );

  const passed = correctCount >= requiredCorrect;

  if (phase === "result") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-[24px] p-6 w-full max-w-[340px] shadow-xl animate-slide-up text-center">
          <div className="text-5xl mb-3">{passed ? "🎉" : "😔"}</div>
          <h3 className="font-display text-xl font-bold text-[#2d1b26]">
            {passed ? "Молодец!" : "Не получилось..."}
          </h3>
          <p className="text-sm text-[#9b7080] mt-2">
            {passed
              ? `${correctCount}/${questionCount} правильно! Продолжаем! 💪`
              : `${correctCount}/${questionCount} правильно. Нужно ${requiredCorrect}.`}
          </p>
          {!passed && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setCorrectCount(0);
                  setSelected(null);
                  setPhase("playing");
                }}
                className="flex-1 bg-pink-500 text-white font-semibold rounded-xl py-2.5 text-sm active:scale-95 transition-transform"
              >
                Ещё раз 💪
              </button>
              <button
                onClick={onFail}
                className="flex-1 bg-pink-50 text-pink-500 font-semibold rounded-xl py-2.5 text-sm border border-pink-200 active:scale-95 transition-transform"
              >
                В меню
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] p-6 w-full max-w-[340px] shadow-xl animate-slide-up">
        <div className="text-center mb-4">
          <h3 className="font-display text-lg font-bold text-[#2d1b26]">{title}</h3>
          <p className="text-xs text-[#9b7080] mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-[#9b7080]">
            {currentIndex + 1} из {questionCount}
          </span>
          <div className="flex-1 h-2 bg-pink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questionCount) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-pink-50/60 rounded-xl p-4 mb-4">
          <p className="font-display font-bold text-[#2d1b26] text-lg text-center">
            {q.question}
          </p>
        </div>

        <div className="space-y-2">
          {q.options.map((opt) => {
            let cls = "bg-white border-pink-100 text-[#2d1b26]";
            if (selected) {
              if (opt === q.correct) cls = "bg-green-100 border-green-400 text-green-800";
              else if (opt === selected) cls = "bg-red-100 border-red-400 text-red-800";
              else cls = "bg-gray-50 border-gray-200 text-[#9b7080] opacity-60";
            }
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={selected !== null}
                className={`${cls} w-full text-left rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all active:scale-[0.98]`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
