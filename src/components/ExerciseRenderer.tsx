"use client";

import { Exercise } from "@/lib/types";
import Quiz from "./Quiz";
import FillExercise from "./FillExercise";
import WordOrderExercise from "./WordOrderExercise";
import TranslateExercise from "./TranslateExercise";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function ExerciseRenderer({ exercise, onAnswer }: Props) {
  switch (exercise.type) {
    case "choose":
      return (
        <Quiz
          question={exercise.question}
          options={exercise.options}
          correctIndex={exercise.correctIndex}
          onAnswer={onAnswer}
        />
      );
    case "fill":
      return <FillExercise exercise={exercise} onAnswer={onAnswer} />;
    case "word_order":
      return <WordOrderExercise exercise={exercise} onAnswer={onAnswer} />;
    case "translate":
      return <TranslateExercise exercise={exercise} onAnswer={onAnswer} />;
    default:
      return null;
  }
}
