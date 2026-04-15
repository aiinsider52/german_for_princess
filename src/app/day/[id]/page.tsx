"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppState, DayPlan } from "@/lib/types";
import { loadState, completeDay } from "@/lib/store";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Quiz from "@/components/Quiz";

type Section = "words" | "phrases" | "exercise" | "test" | "complete";

const encouragements = [
  "Ты сегодня умничка 💕",
  "Я горжусь тобой ❤️",
  "Продолжай в том же духе! 💖",
  "Ты звезда! ⭐",
  "Каждый день ты становишься лучше 🌟",
];

export default function DayPage() {
  const params = useParams();
  const router = useRouter();
  const dayId = Number(params.id);

  const [state, setState] = useState<AppState | null>(null);
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [section, setSection] = useState<Section>("words");
  const [testAnswers, setTestAnswers] = useState<boolean[]>([]);
  const [exerciseAnswered, setExerciseAnswered] = useState(false);
  const [showWordIndex, setShowWordIndex] = useState(0);

  useEffect(() => {
    const loaded = loadState();
    if (!loaded.plan) {
      router.replace("/onboarding");
      return;
    }
    setState(loaded);
    const plan = loaded.plan.days.find((d) => d.day === dayId);
    if (plan) setDayPlan(plan);
  }, [dayId, router]);

  if (!state || !dayPlan) return null;

  const handleComplete = () => {
    const newState = completeDay(state, dayId);
    setState(newState);
    setSection("complete");
  };

  const handleTestAnswer = (correct: boolean) => {
    setTestAnswers([...testAnswers, correct]);
  };

  const allTestsAnswered = testAnswers.length === dayPlan.test.length;

  const sections: { key: Section; label: string; emoji: string }[] = [
    { key: "words", label: "Слова", emoji: "📝" },
    { key: "phrases", label: "Фразы", emoji: "💬" },
    { key: "exercise", label: "Упражнение", emoji: "🧩" },
    { key: "test", label: "Мини-тест", emoji: "✨" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-pink-400 hover:text-pink-600 transition-colors cursor-pointer"
            >
              ← Назад
            </button>
            <h1 className="font-bold text-gray-800">
              День {dayPlan.day}: {dayPlan.title}
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {section !== "complete" && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer
                  ${
                    section === s.key
                      ? "bg-pink-400 text-white shadow-md"
                      : "bg-white text-gray-500 border border-pink-100 hover:border-pink-300"
                  }`}
              >
                <span>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Words section */}
        {section === "words" && (
          <div className="animate-fade-in space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Слова на сегодня 📝
            </h2>
            <p className="text-sm text-pink-400">
              Нажми на карточку, чтобы перейти к следующему слову
            </p>
            <div className="space-y-3">
              {dayPlan.words.map((word, i) => (
                <div
                  key={i}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Card
                    hover
                    className={`transition-all duration-300 ${
                      i <= showWordIndex ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setShowWordIndex(Math.max(showWordIndex, i + 1))
                      }
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xl font-bold text-gray-800">
                            {word.german}
                          </p>
                          <p className="text-pink-500 mt-1">{word.russian}</p>
                        </div>
                        <span className="text-2xl">
                          {i <= showWordIndex ? "💗" : "🔒"}
                        </span>
                      </div>
                      {word.example && i <= showWordIndex && (
                        <p className="mt-3 text-sm text-gray-400 italic bg-pink-50 p-3 rounded-xl">
                          {word.example}
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            <div className="pt-4 text-center">
              <Button onClick={() => setSection("phrases")}>
                К фразам →
              </Button>
            </div>
          </div>
        )}

        {/* Phrases section */}
        {section === "phrases" && (
          <div className="animate-fade-in space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Полезные фразы 💬
            </h2>
            <p className="text-sm text-pink-400">
              Реальные фразы для жизни в Швейцарии
            </p>
            <div className="space-y-3">
              {dayPlan.phrases.map((phrase, i) => (
                <div
                  key={i}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Card>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="text-lg font-semibold text-gray-800">
                          {phrase.german}
                        </p>
                        <span className="text-sm bg-pink-100 text-pink-500 px-2 py-1 rounded-lg shrink-0 ml-2">
                          {phrase.context}
                        </span>
                      </div>
                      <p className="text-pink-500">{phrase.russian}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            <div className="pt-4 text-center">
              <Button onClick={() => setSection("exercise")}>
                К упражнению →
              </Button>
            </div>
          </div>
        )}

        {/* Exercise section */}
        {section === "exercise" && (
          <div className="animate-fade-in space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Упражнение 🧩
            </h2>
            <p className="text-sm text-pink-400">Проверь свои знания!</p>
            <Card>
              <Quiz
                question={dayPlan.exercise.question}
                options={dayPlan.exercise.options}
                correctIndex={dayPlan.exercise.correctIndex}
                onAnswer={() => setExerciseAnswered(true)}
              />
            </Card>
            {exerciseAnswered && (
              <div className="pt-4 text-center animate-slide-up">
                <Button onClick={() => setSection("test")}>
                  К мини-тесту →
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Test section */}
        {section === "test" && (
          <div className="animate-fade-in space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Мини-тест ✨
            </h2>
            <p className="text-sm text-pink-400">
              {dayPlan.test.length} вопросов — ты справишься!
            </p>
            {dayPlan.test.map((q, i) => (
              <div
                key={i}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <Card>
                  <Quiz
                    question={q.question}
                    options={q.options}
                    correctIndex={q.correctIndex}
                    onAnswer={handleTestAnswer}
                  />
                </Card>
              </div>
            ))}
            {allTestsAnswered && (
              <div className="pt-6 text-center animate-scale-in">
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {testAnswers.filter(Boolean).length} из{" "}
                  {testAnswers.length} правильно!
                </p>
                <p className="text-pink-400 mb-6">
                  {encouragements[Math.floor(Math.random() * encouragements.length)]}
                </p>
                <Button size="lg" onClick={handleComplete}>
                  Я молодец сегодня ❤️
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Complete */}
        {section === "complete" && (
          <div className="animate-scale-in text-center py-12">
            <div className="text-7xl mb-6 animate-float">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              День {dayPlan.day} пройден!
            </h2>
            <p className="text-lg text-pink-500 mb-2">
              Ты просто невероятная, Юлия! 💖
            </p>
            <p className="text-gray-400 mb-8">
              {testAnswers.filter(Boolean).length} из {testAnswers.length}{" "}
              правильных ответов
            </p>
            <div className="space-y-3">
              <Button size="lg" onClick={() => router.push("/dashboard")}>
                Вернуться к плану 💕
              </Button>
              {dayPlan.day < 14 && (
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => router.push(`/day/${dayPlan.day + 1}`)}
                  >
                    Следующий день →
                  </Button>
                </div>
              )}
              {dayPlan.day === 14 && (
                <div>
                  <Button
                    variant="secondary"
                    onClick={() => router.push("/final-test")}
                  >
                    Финальный тест 🎯
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
