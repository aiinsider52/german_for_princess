"use client";

import { useState } from "react";
import { explainMistake, MistakeExplanation } from "@/lib/ai";

interface QuizProps {
  question: string;
  options: string[];
  correctIndex: number;
  onAnswer: (correct: boolean) => void;
}

export default function Quiz({
  question,
  options,
  correctIndex,
  onAnswer,
}: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [explanation, setExplanation] = useState<MistakeExplanation | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const getExplanationContext = (
    currentQuestion: string,
    correctAnswer: string
  ): "grammar" | "vocab" => {
    if (currentQuestion.includes("___")) return "grammar";
    if (/\b(ich|du|er|sie|es|wir|ihr|Sie)\b/i.test(currentQuestion)) {
      const normalizedAnswer = correctAnswer.toLowerCase();
      if (
        [
          "bin",
          "bist",
          "ist",
          "sind",
          "seid",
          "habe",
          "hast",
          "hat",
          "haben",
          "habt",
          "esse",
          "isst",
          "trinke",
          "möchte",
          "arbeite",
          "lerne",
        ].includes(normalizedAnswer)
      ) {
        return "grammar";
      }
    }
    return "vocab";
  };

  const handleSelect = async (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    const isCorrect = index === correctIndex;
    onAnswer(isCorrect);

    if (!isCorrect) {
      setLoadingExplanation(true);
      try {
        const result = await explainMistake({
          question,
          userAnswer: options[index],
          correctAnswer: options[correctIndex],
          context: getExplanationContext(question, options[correctIndex]),
        });
        setExplanation(result);
      } catch {
        setExplanation({
          explanation: `Правильный ответ — «${options[correctIndex]}». Запомни его — в следующий раз точно получится!`,
          examples: [],
          encouragement: "Ошибки — это часть роста ❤️",
        });
      }
      setLoadingExplanation(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="font-medium text-gray-800 text-lg">{question}</p>
      <div className="grid gap-3">
        {options.map((option, index) => {
          let style =
            "border-2 border-pink-100 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50";

          if (answered) {
            if (index === correctIndex) {
              style =
                "border-2 border-green-400 bg-green-50 text-green-800";
            } else if (index === selected && index !== correctIndex) {
              style =
                "border-2 border-red-300 bg-red-50 text-red-700";
            } else {
              style =
                "border-2 border-gray-100 bg-gray-50 text-gray-400";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={answered}
              className={`p-4 rounded-xl text-left transition-all duration-200 cursor-pointer
                ${style}
                ${!answered ? "active:scale-[0.98]" : ""}
              `}
            >
              <span className="font-medium">{option}</span>
              {answered && index === correctIndex && (
                <span className="ml-2">✓</span>
              )}
              {answered && index === selected && index !== correctIndex && (
                <span className="ml-2">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {answered && selected === correctIndex && (
        <p className="text-green-600 font-medium animate-slide-up">
          Правильно! Ты умничка 💕
        </p>
      )}

      {answered && selected !== null && selected !== correctIndex && !loadingExplanation && !explanation && (
        <p className="text-pink-500 font-medium animate-slide-up">
          Не совсем, но ты справишься! 💪
        </p>
      )}

      {loadingExplanation && (
        <div className="animate-fade-in bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-5 border border-pink-200">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-pink-400 rounded-full animate-pulse-soft"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
            <span className="text-pink-400 text-sm">Анализирую ошибку...</span>
          </div>
        </div>
      )}

      {explanation && (
        <div className="animate-scale-in bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-5 border border-pink-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">💕</span>
            <h4 className="font-semibold text-gray-800">Давай разберём</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {explanation.explanation}
          </p>
          {explanation.examples.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-pink-400 font-medium">Примеры:</p>
              {explanation.examples.map((ex, i) => (
                <p key={i} className="text-sm text-gray-500 pl-3 border-l-2 border-pink-200">
                  {ex}
                </p>
              ))}
            </div>
          )}
          <p className="text-sm text-pink-500 font-medium pt-1">
            {explanation.encouragement}
          </p>
          <p className="text-xs text-pink-300">
            Ошибки — это часть роста ❤️
          </p>
        </div>
      )}
    </div>
  );
}
