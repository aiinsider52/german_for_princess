"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppState, DayPlan, Exercise } from "@/lib/types";
import { loadState, completeDay } from "@/lib/store";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Quiz from "@/components/Quiz";
import ExerciseRenderer from "@/components/ExerciseRenderer";

type Section = "grammar" | "review" | "words" | "phrases" | "dialogue" | "exercise" | "test" | "complete";

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
  const [exerciseAnswers, setExerciseAnswers] = useState<boolean[]>([]);
  const [showWordIndex, setShowWordIndex] = useState(0);

  useEffect(() => {
    const loaded = loadState();
    if (!loaded.plan) {
      router.replace("/onboarding");
      return;
    }
    setState(loaded);
    const plan = loaded.plan.days.find((d) => d.day === dayId);
    if (plan) {
      setDayPlan(plan);
      const hasGrammar = plan.grammarTopic && plan.grammarExplanation;
      const hasReview = plan.reviewWords && plan.reviewWords.length > 0;
      if (hasGrammar) setSection("grammar");
      else if (hasReview) setSection("review");
      else setSection("words");
    }
  }, [dayId, router]);

  if (!state || !dayPlan) return null;

  const exercises: Exercise[] = dayPlan.exercises && dayPlan.exercises.length > 0
    ? dayPlan.exercises
    : dayPlan.exercise
      ? [dayPlan.exercise]
      : [];

  const handleComplete = () => {
    const newState = completeDay(state, dayId);
    setState(newState);
    setSection("complete");
  };

  const handleTestAnswer = (correct: boolean) => {
    setTestAnswers([...testAnswers, correct]);
  };

  const handleExerciseAnswer = (correct: boolean) => {
    setExerciseAnswers([...exerciseAnswers, correct]);
  };

  const allTestsAnswered = testAnswers.length === dayPlan.test.length;
  const allExercisesAnswered = exerciseAnswers.length === exercises.length;

  const hasGrammar = dayPlan.grammarTopic && dayPlan.grammarExplanation;
  const hasReview = dayPlan.reviewWords && dayPlan.reviewWords.length > 0;
  const hasDialogue = dayPlan.dialogueExample && dayPlan.dialogueExample.lines.length > 0;

  const sections: { key: Section; label: string; emoji: string; show: boolean }[] = [
    { key: "grammar", label: "Грамматика", emoji: "📖", show: !!hasGrammar },
    { key: "review", label: "Повторение", emoji: "🔄", show: !!hasReview },
    { key: "words", label: "Слова", emoji: "📝", show: true },
    { key: "phrases", label: "Фразы", emoji: "💬", show: true },
    { key: "dialogue", label: "Диалог", emoji: "🗣️", show: !!hasDialogue },
    { key: "exercise", label: "Упражнения", emoji: "🧩", show: exercises.length > 0 },
    { key: "test", label: "Мини-тест", emoji: "✨", show: dayPlan.test.length > 0 },
  ];

  const visibleSections = sections.filter((s) => s.show);

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
            <h1 className="font-bold text-gray-800 text-sm truncate max-w-[200px]">
              День {dayPlan.day}: {dayPlan.title}
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {section !== "complete" && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {visibleSections.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer
                  ${section === s.key
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

        {/* Grammar section */}
        {section === "grammar" && hasGrammar && (
          <div className="animate-fade-in space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Грамматика: {dayPlan.grammarTopic} 📖
            </h2>
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {dayPlan.grammarExplanation}
              </p>
            </Card>
            <div className="pt-4 text-center">
              <Button onClick={() => setSection(hasReview ? "review" : "words")}>
                {hasReview ? "К повторению →" : "К словам →"}
              </Button>
            </div>
          </div>
        )}

        {/* Review section */}
        {section === "review" && hasReview && (
          <div className="animate-fade-in space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Повторение 🔄
            </h2>
            <p className="text-sm text-pink-400">
              Вспомни эти слова из прошлых дней
            </p>
            <div className="space-y-3">
              {dayPlan.reviewWords!.map((word, i) => (
                <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <Card hover>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg font-bold text-gray-800">{word.german}</p>
                        <p className="text-pink-500 mt-1">{word.russian}</p>
                      </div>
                      <span className="text-2xl">🔄</span>
                    </div>
                    {word.example && (
                      <p className="mt-2 text-sm text-gray-400 italic bg-pink-50 p-2 rounded-lg">
                        {word.example}
                      </p>
                    )}
                  </Card>
                </div>
              ))}
            </div>
            <div className="pt-4 text-center">
              <Button onClick={() => setSection("words")}>
                К новым словам →
              </Button>
            </div>
          </div>
        )}

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
                      onClick={() => setShowWordIndex(Math.max(showWordIndex, i + 1))}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xl font-bold text-gray-800">{word.german}</p>
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
                        <p className="text-lg font-semibold text-gray-800">{phrase.german}</p>
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
              <Button onClick={() => setSection(hasDialogue ? "dialogue" : "exercise")}>
                {hasDialogue ? "К диалогу →" : "К упражнениям →"}
              </Button>
            </div>
          </div>
        )}

        {/* Dialogue section */}
        {section === "dialogue" && hasDialogue && (
          <div className="animate-fade-in space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Мини-диалог: {dayPlan.dialogueExample!.title} 🗣️
            </h2>
            <p className="text-sm text-pink-400">
              Прочитай диалог вслух для практики произношения
            </p>
            <Card className="overflow-hidden">
              <div className="space-y-0">
                {dayPlan.dialogueExample!.lines.map((line, i) => (
                  <div
                    key={i}
                    className={`p-3 ${i % 2 === 0 ? "bg-white" : "bg-pink-50/50"} ${
                      i > 0 ? "border-t border-pink-100" : ""
                    }`}
                  >
                    <p className="text-xs text-pink-400 font-medium mb-1">{line.speaker}</p>
                    <p className="text-gray-800 font-medium">{line.german}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{line.russian}</p>
                  </div>
                ))}
              </div>
            </Card>
            <div className="pt-4 text-center">
              <Button onClick={() => setSection("exercise")}>
                К упражнениям →
              </Button>
            </div>
          </div>
        )}

        {/* Exercise section */}
        {section === "exercise" && exercises.length > 0 && (
          <div className="animate-fade-in space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Упражнения 🧩
            </h2>
            <p className="text-sm text-pink-400">
              {exercises.length} {exercises.length === 1 ? "задание" : exercises.length < 5 ? "задания" : "заданий"} — проверь свои знания!
            </p>
            {exercises.map((ex, i) => (
              <div
                key={i}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <Card>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-pink-100 text-pink-500 px-2 py-0.5 rounded-full">
                      {i + 1}/{exercises.length}
                    </span>
                    <span className="text-xs text-gray-400">
                      {ex.type === "choose" && "Выбери ответ"}
                      {ex.type === "fill" && "Впиши слово"}
                      {ex.type === "word_order" && "Составь предложение"}
                      {ex.type === "translate" && "Переведи"}
                    </span>
                  </div>
                  <ExerciseRenderer exercise={ex} onAnswer={handleExerciseAnswer} />
                </Card>
              </div>
            ))}
            {allExercisesAnswered && (
              <div className="pt-4 text-center animate-slide-up">
                <p className="text-pink-500 font-medium mb-3">
                  {exerciseAnswers.filter(Boolean).length} из {exerciseAnswers.length} правильно!
                </p>
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
              {dayPlan.test.length} {dayPlan.test.length === 1 ? "вопрос" : dayPlan.test.length < 5 ? "вопроса" : "вопросов"} — ты справишься!
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
                  {testAnswers.filter(Boolean).length} из {testAnswers.length} правильно!
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
              Тест: {testAnswers.filter(Boolean).length} из {testAnswers.length} правильных
              {exercises.length > 0 && (
                <> · Упражнения: {exerciseAnswers.filter(Boolean).length} из {exerciseAnswers.length}</>
              )}
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
