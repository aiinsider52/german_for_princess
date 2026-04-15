"use client";

import { useState } from "react";
import { WordOrderExercise as WordOrderExerciseType } from "@/lib/types";

interface Props {
  exercise: WordOrderExerciseType;
  onAnswer: (correct: boolean) => void;
}

export default function WordOrderExercise({ exercise, onAnswer }: Props) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(exercise.words);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectWord = (word: string, index: number) => {
    if (answered) return;
    setSelectedWords([...selectedWords, word]);
    const newAvailable = [...availableWords];
    newAvailable.splice(index, 1);
    setAvailableWords(newAvailable);
  };

  const handleRemoveWord = (index: number) => {
    if (answered) return;
    const word = selectedWords[index];
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
  };

  const handleCheck = () => {
    if (answered || selectedWords.length === 0) return;
    const userSentence = selectedWords.join(" ");
    const correct = userSentence.toLowerCase().trim() === exercise.correctOrder.toLowerCase().trim();
    setIsCorrect(correct);
    setAnswered(true);
    onAnswer(correct);
  };

  const handleReset = () => {
    if (answered) return;
    setSelectedWords([]);
    setAvailableWords(exercise.words);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-pink-400 font-medium">{exercise.question}</p>

      {/* Built sentence area */}
      <div className="min-h-[56px] bg-white rounded-xl p-3 border-2 border-pink-100 flex flex-wrap gap-2 items-center">
        {selectedWords.length === 0 && (
          <span className="text-gray-300 text-sm">Нажми на слова ниже...</span>
        )}
        {selectedWords.map((word, i) => (
          <button
            key={`${word}-${i}`}
            onClick={() => handleRemoveWord(i)}
            disabled={answered}
            className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200
              ${answered
                ? isCorrect
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-50 text-red-600 border border-red-300"
                : "bg-pink-100 text-pink-700 border border-pink-200 cursor-pointer hover:bg-pink-200 active:scale-95"
              }`}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Available words */}
      {!answered && (
        <div className="flex flex-wrap gap-2 justify-center">
          {availableWords.map((word, i) => (
            <button
              key={`${word}-${i}`}
              onClick={() => handleSelectWord(word, i)}
              className="px-3 py-1.5 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 border border-gray-200
                cursor-pointer hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 active:scale-95 transition-all duration-200"
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      {!answered && (
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            disabled={selectedWords.length === 0}
            className="flex-1 p-2.5 rounded-xl text-sm font-medium text-gray-500 border-2 border-gray-200
              cursor-pointer hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Сбросить
          </button>
          <button
            onClick={handleCheck}
            disabled={availableWords.length > 0}
            className="flex-1 p-2.5 rounded-xl text-sm font-medium bg-pink-400 text-white
              cursor-pointer hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Проверить
          </button>
        </div>
      )}

      {answered && isCorrect && (
        <p className="text-green-600 font-medium animate-slide-up">
          Правильно! Отличный порядок слов 💕
        </p>
      )}

      {answered && !isCorrect && (
        <div className="animate-slide-up space-y-2">
          <p className="text-red-500 font-medium">
            Почти! Правильный порядок:
          </p>
          <p className="text-gray-700 font-semibold bg-pink-50 p-3 rounded-xl">
            {exercise.correctOrder}
          </p>
        </div>
      )}
    </div>
  );
}
