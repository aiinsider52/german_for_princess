"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { UserPreferences } from "@/lib/types";
import { loadState, setPreferences, setPlan } from "@/lib/store";
import { generateLearningPlan } from "@/lib/generate-plan";

type Level = UserPreferences["level"];
type Goal = UserPreferences["goal"];
type Minutes = UserPreferences["minutesPerDay"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<Level | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [minutes, setMinutes] = useState<Minutes | null>(null);
  const [generating, setGenerating] = useState(false);

  const levels: { value: Level; label: string; emoji: string }[] = [
    { value: "beginner", label: "Начинающий", emoji: "🌱" },
    { value: "basic", label: "Базовый", emoji: "📗" },
    { value: "intermediate", label: "Средний", emoji: "📘" },
  ];

  const goals: { value: Goal; label: string; emoji: string }[] = [
    { value: "switzerland", label: "Жизнь в Швейцарии", emoji: "🇨🇭" },
    { value: "work", label: "Для работы", emoji: "💼" },
    { value: "travel", label: "Для путешествий", emoji: "✈️" },
    { value: "fun", label: "Для удовольствия", emoji: "🎉" },
  ];

  const minuteOptions: { value: Minutes; label: string }[] = [
    { value: 5, label: "5 минут" },
    { value: 10, label: "10 минут" },
    { value: 20, label: "20 минут" },
  ];

  const handleGenerate = async () => {
    if (!level || !goal || !minutes) return;
    setGenerating(true);

    await new Promise((r) => setTimeout(r, 2000));

    const preferences: UserPreferences = { level, goal, minutesPerDay: minutes };
    let state = loadState();
    state = setPreferences(state, preferences);

    const plan = generateLearningPlan(preferences, state.currentLevel);
    setPlan(state, plan);

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-pink-50 to-white">
      <div className="w-full max-w-lg">
        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-500 ${
                s === step
                  ? "w-8 bg-pink-400"
                  : s < step
                    ? "w-8 bg-pink-300"
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
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Давай сделаем немецкий твоим любимым языком 💕
            </p>
            <p className="text-pink-400 mb-8">
              Я подготовлю для тебя персональный план обучения на 14 дней
            </p>
            <Button size="lg" onClick={() => setStep(1)}>
              Начнём! 💗
            </Button>
          </div>
        )}

        {/* Step 1: Questions */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Расскажи о себе 🌸
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Чтобы я создала идеальный план для тебя
            </p>

            {/* Level */}
            <Card>
              <p className="font-semibold text-gray-700 mb-3">
                Твой уровень немецкого:
              </p>
              <div className="grid gap-2">
                {levels.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`p-3 rounded-xl text-left transition-all duration-200 cursor-pointer border-2
                      ${
                        level === l.value
                          ? "border-pink-400 bg-pink-50 text-pink-700"
                          : "border-pink-100 hover:border-pink-200 text-gray-600"
                      }`}
                  >
                    <span className="mr-2">{l.emoji}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Goal */}
            <Card>
              <p className="font-semibold text-gray-700 mb-3">Твоя цель:</p>
              <div className="grid gap-2">
                {goals.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={`p-3 rounded-xl text-left transition-all duration-200 cursor-pointer border-2
                      ${
                        goal === g.value
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

            {/* Minutes */}
            <Card>
              <p className="font-semibold text-gray-700 mb-3">
                Сколько минут в день?
              </p>
              <div className="flex gap-3">
                {minuteOptions.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMinutes(m.value)}
                    className={`flex-1 p-3 rounded-xl text-center transition-all duration-200 cursor-pointer border-2 font-medium
                      ${
                        minutes === m.value
                          ? "border-pink-400 bg-pink-50 text-pink-700"
                          : "border-pink-100 hover:border-pink-200 text-gray-600"
                      }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(0)}>
                ← Назад
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!level || !goal || !minutes}
              >
                Дальше →
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Generate */}
        {step === 2 && !generating && (
          <div className="animate-fade-in text-center">
            <div className="text-6xl mb-6 animate-float">✨</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Всё готово, Юлия!
            </h2>
            <p className="text-gray-500 mb-4">
              Я создам персональный план обучения специально для тебя
            </p>
            <Card className="mb-6 text-left">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-pink-400">Уровень:</span>{" "}
                  {levels.find((l) => l.value === level)?.label}
                </p>
                <p>
                  <span className="text-pink-400">Цель:</span>{" "}
                  {goals.find((g) => g.value === goal)?.label}
                </p>
                <p>
                  <span className="text-pink-400">Время:</span>{" "}
                  {minuteOptions.find((m) => m.value === minutes)?.label} в день
                </p>
              </div>
            </Card>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                ← Изменить
              </Button>
              <Button size="lg" onClick={handleGenerate}>
                Создать мой личный план ❤️
              </Button>
            </div>
          </div>
        )}

        {/* Generating animation */}
        {generating && (
          <div className="animate-fade-in text-center">
            <div className="text-6xl mb-6 animate-pulse-soft">💖</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Создаю твой план...
            </h2>
            <p className="text-pink-400">
              Подбираю самые нужные слова и фразы для тебя ✨
            </p>
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
