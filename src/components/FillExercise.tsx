"use client";

import { useState, useRef, useEffect } from "react";
import { FillExercise as FillExerciseType } from "@/lib/types";

interface Props {
  exercise: FillExerciseType;
  onAnswer: (correct: boolean) => void;
}

export default function FillExercise({ exercise, onAnswer }: Props) {
  const [input, setInput] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const normalize = (s: string) =>
    s.trim().toLowerCase()
      .replace(/ß/g, "ss")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue");

  const handleSubmit = () => {
    if (answered || !input.trim()) return;
    const correct = normalize(input) === normalize(exercise.correctAnswer);
    setIsCorrect(correct);
    setAnswered(true);
    onAnswer(correct);
  };

  const parts = exercise.sentence.split("___");

  return (
    <div className="space-y-4">
      <p className="text-sm text-pink-400 font-medium">Впиши пропущенное слово:</p>

      <div className="bg-white rounded-xl p-4 border-2 border-pink-100">
        <p className="text-lg text-gray-800 leading-relaxed">
          {parts[0]}
          <span className="inline-block min-w-[80px] mx-1 border-b-2 border-pink-300 relative">
            {answered ? (
              <span className={`font-bold ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                {input}
              </span>
            ) : (
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-transparent outline-none text-center font-bold text-pink-600 text-lg"
                placeholder="..."
                autoComplete="off"
              />
            )}
          </span>
          {parts[1] || ""}
        </p>
      </div>

      {exercise.hint && !answered && (
        <p className="text-xs text-gray-400">
          💡 {exercise.hint}
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
          Правильно! Ты умничка 💕
        </p>
      )}

      {answered && !isCorrect && (
        <div className="animate-slide-up space-y-2">
          <p className="text-red-500 font-medium">
            Не совсем. Правильный ответ: <span className="font-bold">{exercise.correctAnswer}</span>
          </p>
          <p className="text-sm text-gray-400">
            {exercise.sentence.replace("___", exercise.correctAnswer)}
          </p>
        </div>
      )}
    </div>
  );
}
