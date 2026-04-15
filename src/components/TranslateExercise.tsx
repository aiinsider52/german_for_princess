"use client";

import { useState, useRef, useEffect } from "react";
import { TranslateExercise as TranslateExerciseType } from "@/lib/types";

interface Props {
  exercise: TranslateExerciseType;
  onAnswer: (correct: boolean) => void;
}

export default function TranslateExercise({ exercise, onAnswer }: Props) {
  const [input, setInput] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const normalize = (s: string) =>
    s.trim().toLowerCase()
      .replace(/[.,!?;:'"]/g, "")
      .replace(/ß/g, "ss")
      .replace(/\s+/g, " ");

  const handleSubmit = () => {
    if (answered || !input.trim()) return;
    const normalizedInput = normalize(input);
    const allAnswers = [exercise.correctAnswer, ...(exercise.acceptableAnswers || [])];
    const correct = allAnswers.some((a) => normalize(a) === normalizedInput);
    setIsCorrect(correct);
    setAnswered(true);
    onAnswer(correct);
  };

  const hintText = exercise.correctAnswer.split("").map((ch, i) =>
    i === 0 || ch === " " ? ch : "_"
  ).join("");

  return (
    <div className="space-y-4">
      <p className="text-sm text-pink-400 font-medium">Переведи на немецкий:</p>

      <div className="bg-pink-50 rounded-xl p-4 border border-pink-200 text-center">
        <p className="text-xl font-semibold text-gray-800">
          {exercise.phrase}
        </p>
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={answered}
          placeholder="Напиши по-немецки..."
          className={`w-full p-4 rounded-xl border-2 outline-none text-lg font-medium transition-all duration-200
            ${answered
              ? isCorrect
                ? "border-green-400 bg-green-50 text-green-800"
                : "border-red-300 bg-red-50 text-red-700"
              : "border-pink-200 focus:border-pink-400 text-gray-800"
            }`}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      {!answered && !showHint && (
        <button
          onClick={() => setShowHint(true)}
          className="text-xs text-gray-400 hover:text-pink-400 cursor-pointer transition-colors"
        >
          💡 Показать подсказку
        </button>
      )}

      {!answered && showHint && (
        <p className="text-sm text-gray-400">
          💡 Подсказка: <span className="font-mono">{hintText}</span>
        </p>
      )}

      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full p-3 rounded-xl font-medium transition-all duration-200 cursor-pointer
            bg-pink-400 text-white hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Проверить
        </button>
      )}

      {answered && isCorrect && (
        <p className="text-green-600 font-medium animate-slide-up">
          Правильно! Отличный перевод 💕
        </p>
      )}

      {answered && !isCorrect && (
        <div className="animate-slide-up space-y-2">
          <p className="text-red-500 font-medium">
            Не совсем. Правильный перевод:
          </p>
          <p className="text-gray-700 font-semibold bg-pink-50 p-3 rounded-xl">
            {exercise.correctAnswer}
          </p>
        </div>
      )}
    </div>
  );
}
