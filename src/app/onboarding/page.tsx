"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { UserPreferences, AssessmentResult } from "@/lib/types";
import { loadState, setPreferences, setPlan, setAssessmentResult } from "@/lib/store";
import { generateLearningPlan } from "@/lib/generate-plan";
import { diagnosticQuestions, assessLevel, levelLabels } from "@/lib/diagnostic-test";

type Level = UserPreferences["level"];
type Goal = UserPreferences["goal"];
type Minutes = UserPreferences["minutesPerDay"];

const goals: { value: Goal; label: string; emoji: string }[] = [
  { value: "switzerland", label: "Жизнь в Швейцарии", emoji: "🇨🇭" },
  { value: "work", label: "Для работы", emoji: "💼" },
  { value: "travel", label: "Для путешествий", emoji: "✈️" },
  { value: "fun", label: "Для удовольствия", emoji: "🎉" },
];

const minuteOptions: { value: Minutes; label: string; desc: string }[] = [
  { value: 5, label: "5 мин", desc: "Быстрый урок" },
  { value: 10, label: "10 мин", desc: "Оптимально" },
  { value: 20, label: "20 мин", desc: "Полный урок" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [minutes, setMinutes] = useState<Minutes | null>(null);

  // Diagnostic test state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Assessment result
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStep, setGenStep] = useState("");

  const handleTestAnswer = useCallback((optionIndex: number) => {
    if (showFeedback) return;
    setSelectedOption(optionIndex);
    setShowFeedback(true);

    const isCorrect = optionIndex === diagnosticQuestions[currentQuestion].correctIndex;
    const newAnswers = [...answers, isCorrect];

    setTimeout(() => {
      setAnswers(newAnswers);
      setShowFeedback(false);
      setSelectedOption(null);

      if (currentQuestion + 1 < diagnosticQuestions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const result = assessLevel(newAnswers);
        setAssessment(result);
        setStep(3);
      }
    }, 1200);
  }, [showFeedback, currentQuestion, answers]);

  const handleGenerate = async () => {
    if (!goal || !minutes || !assessment) return;
    setGenerating(true);
    setStep(4);
    setGenProgress(5);
    setGenStep("Анализирую твой уровень...");

    const level: Level = assessment.level === "A0" ? "beginner" : assessment.level === "A0+" ? "basic" : "intermediate";
    const preferences: UserPreferences = { level, goal, minutesPerDay: minutes };

    let state = loadState();
    state = setPreferences(state, preferences);
    state = setAssessmentResult(state, assessment);

    try {
      setGenProgress(15);
      setGenStep("Создаю программу обучения...");

      const res = await fetch("/api/ai/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessedLevel: assessment.level,
          goal,
          minutesPerDay: minutes,
          assessmentDetails: assessment.details,
        }),
      });

      if (!res.ok) throw new Error("API error");

      setGenProgress(70);
      setGenStep("Подбираю слова и упражнения...");

      const data = await res.json();

      if (data.days && Array.isArray(data.days)) {
        setGenProgress(90);
        setGenStep("Финальные штрихи...");
        await new Promise((r) => setTimeout(r, 800));

        const plan = { level: state.currentLevel, days: data.days, assessedLevel: assessment.level, goal };
        setPlan(state, plan);
        setGenProgress(100);
        setGenStep("Готово!");
        await new Promise((r) => setTimeout(r, 500));
        router.push("/dashboard");
        return;
      }
      throw new Error("Invalid plan data");
    } catch {
      setGenProgress(50);
      setGenStep("Использую готовый план...");
      await new Promise((r) => setTimeout(r, 1000));

      const fallbackPlan = generateLearningPlan(preferences, state.currentLevel);
      setPlan(state, fallbackPlan);
      setGenProgress(100);
      setGenStep("Готово!");
      await new Promise((r) => setTimeout(r, 500));
      router.push("/dashboard");
    }
  };

  const q = diagnosticQuestions[currentQuestion];
  const difficultyLabel = {
    zero: "Базовые слова",
    basic: "Простые фразы",
    grammar: "Грамматика",
    phrases: "Понимание",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-pink-50 to-white">
      <div className="w-full max-w-lg">
        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-500 ${
                s === step ? "w-8 bg-pink-400"
                  : s < step ? "w-8 bg-pink-300"
                  : "w-8 bg-pink-100"
              }`}
            />
          ))}
        </div>

        {/* Step 0: Greeting */}
        {step === 0 && (
          <div className="animate-fade-in text-center">
            <div className="text-6xl mb-6 animate-float">💕</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Привет, Юлия Принцессовна
            </h1>
            <p className="text-lg text-gray-500 mb-4 leading-relaxed">
              Давай сделаем немецкий твоим любимым языком 💕
            </p>
            <p className="text-pink-400 mb-4">
              Сначала я узнаю твои цели, потом проверю уровень
              с помощью маленького теста, и создам персональный план на 14 дней
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Тест займёт пару минут. Не переживай — тут нет правильных
              и неправильных результатов, только твой уровень
            </p>
            <Button size="lg" onClick={() => setStep(1)}>
              Начнём! 💗
            </Button>
          </div>
        )}

        {/* Step 1: Goal + Time */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Расскажи о себе 🌸
            </h2>

            <Card>
              <p className="font-semibold text-gray-700 mb-3">Твоя цель:</p>
              <div className="grid gap-2">
                {goals.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={`p-3 rounded-xl text-left transition-all duration-200 cursor-pointer border-2
                      ${goal === g.value
                        ? "border-pink-400 bg-pink-50 text-pink-700"
                        : "border-pink-100 hover:border-pink-200 text-gray-600"
                      }`}
                  >
                    <span className="mr-2">{g.emoji}</span>
                    {g.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <p className="font-semibold text-gray-700 mb-3">
                Сколько минут в день?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {minuteOptions.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMinutes(m.value)}
                    className={`p-3 rounded-xl text-center transition-all duration-200 cursor-pointer border-2
                      ${minutes === m.value
                        ? "border-pink-400 bg-pink-50 text-pink-700"
                        : "border-pink-100 hover:border-pink-200 text-gray-600"
                      }`}
                  >
                    <div className="font-bold text-lg">{m.label}</div>
                    <div className="text-xs text-gray-400">{m.desc}</div>
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(0)}>
                ← Назад
              </Button>
              <Button
                onClick={() => { setStep(2); setCurrentQuestion(0); setAnswers([]); }}
                disabled={!goal || !minutes}
              >
                К тесту →
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Diagnostic Test */}
        {step === 2 && q && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Мини-тест 📝
              </h2>
              <p className="text-sm text-gray-400">
                Вопрос {currentQuestion + 1} из {diagnosticQuestions.length}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-pink-100 rounded-full h-2 mb-6">
              <div
                className="bg-pink-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion + (showFeedback ? 1 : 0)) / diagnosticQuestions.length) * 100}%` }}
              />
            </div>

            {/* Difficulty badge */}
            <div className="flex justify-center mb-4">
              <span className="text-xs bg-pink-100 text-pink-500 px-3 py-1 rounded-full">
                {difficultyLabel[q.difficulty]}
              </span>
            </div>

            <Card className="mb-6">
              <p className="font-medium text-gray-800 text-lg mb-4">
                {q.question}
              </p>
              <div className="grid gap-3">
                {q.options.map((option, index) => {
                  let style = "border-2 border-pink-100 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50";

                  if (showFeedback) {
                    if (index === q.correctIndex) {
                      style = "border-2 border-green-400 bg-green-50 text-green-800";
                    } else if (index === selectedOption && index !== q.correctIndex) {
                      style = "border-2 border-red-300 bg-red-50 text-red-700";
                    } else {
                      style = "border-2 border-gray-100 bg-gray-50 text-gray-400";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleTestAnswer(index)}
                      disabled={showFeedback}
                      className={`p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${style}
                        ${!showFeedback ? "active:scale-[0.98]" : ""}`}
                    >
                      <span className="font-medium">{option}</span>
                      {showFeedback && index === q.correctIndex && (
                        <span className="ml-2">✓</span>
                      )}
                      {showFeedback && index === selectedOption && index !== q.correctIndex && (
                        <span className="ml-2">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="flex justify-center gap-1.5">
              {diagnosticQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i < answers.length
                      ? answers[i] ? "bg-green-400" : "bg-red-300"
                      : i === currentQuestion ? "bg-pink-400 scale-125" : "bg-pink-100"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && assessment && (
          <div className="animate-fade-in text-center">
            <div className="text-6xl mb-6 animate-float">
              {assessment.score >= 10 ? "🌟" : assessment.score >= 7 ? "✨" : assessment.score >= 4 ? "🌸" : "💕"}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Результат теста
            </h2>
            <p className="text-4xl font-bold text-pink-500 mb-2">
              {assessment.score} из {assessment.total}
            </p>

            <Card className="mb-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-xl font-bold text-pink-600">
                  {assessment.level}
                </div>
                <div>
                  <p className="font-bold text-gray-800">
                    {levelLabels[assessment.level].title}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {levelLabels[assessment.level].description}
              </p>
            </Card>

            {/* Score breakdown */}
            <Card className="mb-6 text-left">
              <p className="font-semibold text-gray-700 mb-3 text-sm">Детали по темам:</p>
              <div className="space-y-2">
                {(["zero", "basic", "grammar", "phrases"] as const).map((diff) => {
                  const questions = assessment.details.filter((_, i) =>
                    diagnosticQuestions[i].difficulty === diff
                  );
                  const correct = questions.filter((d) => d.correct).length;
                  const label = { zero: "Базовые слова", basic: "Простые фразы", grammar: "Грамматика", phrases: "Понимание" }[diff];
                  return (
                    <div key={diff} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{label}</span>
                      <div className="flex gap-1">
                        {questions.map((q, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${q.correct ? "bg-green-400" : "bg-red-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="mb-6 text-left bg-pink-50 border-pink-200">
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="text-pink-400 font-medium">Цель:</span> {goals.find((g) => g.value === goal)?.label}</p>
                <p><span className="text-pink-400 font-medium">Время:</span> {minuteOptions.find((m) => m.value === minutes)?.label} в день</p>
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={handleGenerate}>
                Создать мой план на 14 дней ✨
              </Button>
              <Button variant="ghost" onClick={() => setStep(1)}>
                ← Изменить ответы
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Generating */}
        {step === 4 && generating && (
          <div className="animate-fade-in text-center">
            <div className="text-6xl mb-6 animate-pulse-soft">💖</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Создаю твой персональный план
            </h2>
            <p className="text-pink-400 mb-6">{genStep}</p>

            {/* Progress bar */}
            <div className="w-full bg-pink-100 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-400 to-rose-400 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${genProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mb-8">{genProgress}%</p>

            <div className="space-y-3 text-sm text-gray-400">
              <p className={`transition-opacity duration-500 ${genProgress >= 5 ? "opacity-100" : "opacity-0"}`}>
                ✓ Анализ уровня: {assessment?.level}
              </p>
              <p className={`transition-opacity duration-500 ${genProgress >= 15 ? "opacity-100" : "opacity-0"}`}>
                ✓ Подбор тем и прогрессии
              </p>
              <p className={`transition-opacity duration-500 ${genProgress >= 50 ? "opacity-100" : "opacity-0"}`}>
                ✓ Генерация слов и упражнений
              </p>
              <p className={`transition-opacity duration-500 ${genProgress >= 90 ? "opacity-100" : "opacity-0"}`}>
                ✓ Финальная проверка плана
              </p>
            </div>

            <div className="mt-8 flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-pink-400 rounded-full animate-pulse-soft"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
