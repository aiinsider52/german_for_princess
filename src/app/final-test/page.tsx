"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppState, TestQuestion } from "@/lib/types";
import { loadState, startNextLevel } from "@/lib/store";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Quiz from "@/components/Quiz";

function buildFinalTest(state: AppState): TestQuestion[] {
  if (!state.plan) return [];

  const allQuestions: TestQuestion[] = [];
  for (const day of state.plan.days) {
    allQuestions.push(...day.test);
    // Pull choose-type exercises into the question pool
    const exList = day.exercises && day.exercises.length > 0
      ? day.exercises
      : day.exercise ? [day.exercise] : [];
    for (const ex of exList) {
      if (ex.type === "choose") {
        allQuestions.push({
          question: ex.question,
          options: ex.options,
          correctIndex: ex.correctIndex,
        });
      }
    }
  }

  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

export default function FinalTestPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    if (!loaded.plan) {
      router.replace("/onboarding");
      return;
    }
    setState(loaded);
    setQuestions(buildFinalTest(loaded));
  }, [router]);

  if (!state) return null;

  const handleAnswer = (correct: boolean) => {
    const newAnswers = [...answers, correct];
    setAnswers(newAnswers);
    if (newAnswers.length === questions.length) {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const score = answers.filter(Boolean).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const isGood = percentage >= 70;

  const handleNextLevel = () => {
    if (!state) return;
    const newState = startNextLevel(state);
    setState(newState);
    router.push("/onboarding");
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
        <div className="animate-fade-in text-center max-w-md">
          <div className="text-7xl mb-6 animate-float">🎯</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Финальный тест
          </h1>
          <p className="text-gray-500 mb-2">
            10 вопросов из всех 14 дней обучения
          </p>
          <p className="text-pink-400 mb-8">
            Ты столько выучила, Юлия! Пора показать результат 💪
          </p>
          <Button size="lg" onClick={() => setStarted(true)}>
            Начать тест 💖
          </Button>
          <div className="mt-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              ← Назад к плану
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
        <div className="animate-scale-in text-center max-w-md">
          <div className="text-7xl mb-6 animate-float">
            {isGood ? "🏆" : "💪"}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {isGood
              ? "Юлия, ты просто вау 💖"
              : "Хороший результат, Юлия!"}
          </h1>
          <div className="mb-6">
            <div className="text-6xl font-bold text-pink-500 mb-2">
              {percentage}%
            </div>
            <p className="text-gray-500">
              {score} из {total} правильных ответов
            </p>
          </div>

          {isGood ? (
            <Card className="mb-6 bg-gradient-to-r from-pink-50 to-white">
              <div className="space-y-2 text-center">
                <p className="text-gray-700">
                  Ты потрясающе справилась! 🌟
                </p>
                <p className="text-sm text-pink-400">
                  Готова к новому уровню?
                </p>
              </div>
            </Card>
          ) : (
            <Card className="mb-6">
              <div className="space-y-2 text-center">
                <p className="text-gray-700">
                  Не переживай! Ты уже столько выучила 💕
                </p>
                <p className="text-sm text-pink-400">
                  Можешь повторить уроки или двигаться дальше
                </p>
              </div>
            </Card>
          )}

          <div className="space-y-3">
            <Button size="lg" onClick={handleNextLevel}>
              Перейти на новый уровень 💕
            </Button>
            <div>
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
              >
                Вернуться к урокам
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-gray-800">Финальный тест 🎯</h1>
            <span className="text-sm text-pink-400">
              {answers.length} / {questions.length}
            </span>
          </div>
          <div className="mt-2 h-2 bg-pink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-300 to-pink-500 rounded-full transition-all duration-500"
              style={{
                width: `${(answers.length / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {questions.map((q, i) => (
          <div
            key={i}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <Card>
              <div className="mb-2 text-sm text-pink-400">
                Вопрос {i + 1} из {questions.length}
              </div>
              <Quiz
                question={q.question}
                options={q.options}
                correctIndex={q.correctIndex}
                onAnswer={handleAnswer}
              />
            </Card>
          </div>
        ))}
      </main>
    </div>
  );
}
