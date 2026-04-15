"use client";

import { useState } from "react";
import { QuizQuestion as QuizQuestionType } from "@/lib/types";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionIndex: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}

const typeLabels: Record<string, string> = {
  translate_de_ru: "Переведи 🇩🇪→🇷🇺",
  translate_ru_de: "Переведи 🇷🇺→🇩🇪",
  fill_phrase: "Заполни пропуск ✍️",
  match_emoji: "Что означает? 🎯",
};

export default function QuizQuestionCard({
  question,
  questionIndex,
  total,
  onAnswer,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const isCorrect = option === question.correct;
    setTimeout(() => onAnswer(isCorrect), 1400);
  };

  const progressPercent = ((questionIndex + 1) / total) * 100;

  return (
    <div className="space-y-5 animate-scale-in">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[#9b7080]">
          <span>
            Вопрос {questionIndex + 1} из {total}
          </span>
          <span>{typeLabels[question.type] || ""}</span>
        </div>
        <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-300 to-pink-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-[20px] p-6 border border-pink-100 shadow-[0_4px_20px_rgba(255,107,138,0.08)] text-center">
        {question.type === "match_emoji" && (
          <div className="text-5xl mb-3">{question.question}</div>
        )}
        <p className="text-lg font-display font-semibold text-[#2d1b26]">
          {question.type === "match_emoji"
            ? "Что это означает?"
            : question.type === "fill_phrase"
              ? question.question
              : `«${question.question}»`}
        </p>
        {question.type === "fill_phrase" && (
          <p className="text-xs text-[#9b7080] mt-1">Выбери правильное слово</p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, i) => {
          let bgClass =
            "bg-white/70 border-pink-100 hover:border-pink-300 hover:shadow-md active:scale-[0.97]";
          if (answered) {
            if (option === question.correct) {
              bgClass =
                "bg-green-50 border-green-300 shadow-[0_2px_12px_rgba(34,197,94,0.15)]";
            } else if (option === selected) {
              bgClass =
                "bg-red-50 border-red-300 shadow-[0_2px_12px_rgba(239,68,68,0.15)]";
            } else {
              bgClass = "bg-white/40 border-pink-50 opacity-50";
            }
          }

          return (
            <button
              key={`${option}-${i}`}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`${bgClass} backdrop-blur-sm rounded-[16px] p-4 border text-center transition-all duration-300 cursor-pointer`}
            >
              <span className="text-sm font-medium text-[#2d1b26]">
                {option}
              </span>
              {answered && option === question.correct && (
                <span className="block text-xs text-green-500 mt-1">
                  ✓ Richtig!
                </span>
              )}
              {answered && option === selected && option !== question.correct && (
                <span className="block text-xs text-red-400 mt-1">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div
          className={`rounded-[16px] p-4 text-center animate-slide-up ${
            selected === question.correct
              ? "bg-green-50 border border-green-200"
              : "bg-pink-50 border border-pink-200"
          }`}
        >
          {selected === question.correct ? (
            <p className="text-sm font-medium text-green-700">
              Правильно! Ты умничка! 💕
            </p>
          ) : (
            <div>
              <p className="text-sm font-medium text-[#2d1b26]">
                Правильный ответ: <strong>{question.correct}</strong>
              </p>
              {question.explanation && (
                <p className="text-xs text-[#9b7080] mt-1">
                  {question.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
