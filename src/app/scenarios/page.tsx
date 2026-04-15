"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppState } from "@/lib/types";
import { loadState } from "@/lib/store";
import { scenarios } from "@/lib/ai";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function ScenariosPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    const loaded = loadState();
    if (!loaded.onboardingComplete) {
      router.replace("/onboarding");
      return;
    }
    setState(loaded);
  }, [router]);

  if (!state) return null;

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
            <h1 className="font-bold text-gray-800">Сценарии из жизни 🎯</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Intro */}
        <div className="text-center animate-fade-in">
          <div className="text-5xl mb-4 animate-float">🇨🇭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Реальные ситуации
          </h2>
          <p className="text-gray-500">
            Тренируйся в настоящих жизненных ситуациях в Швейцарии.
            <br />
            <span className="text-pink-400">Ты справишься, Юлия! 💖</span>
          </p>
        </div>

        {/* Scenario cards */}
        <div className="grid gap-4">
          {scenarios.map((scenario, i) => {
            const progress = state.scenarioProgress[scenario.id];
            const isCompleted = progress?.completed;
            const isStarted = progress && !progress.completed;
            const currentStep = progress?.currentStep ?? 0;

            return (
              <div
                key={scenario.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Card
                  hover
                  className={`relative overflow-hidden ${
                    isCompleted
                      ? "bg-gradient-to-br from-pink-50 to-white border-pink-300"
                      : ""
                  }`}
                >
                  {isCompleted && (
                    <div className="absolute top-3 right-3 text-2xl animate-float">
                      ✅
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{scenario.emoji}</span>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {scenario.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {scenario.description}
                        </p>
                      </div>
                    </div>

                    {isStarted && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-pink-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-pink-300 to-pink-500 rounded-full transition-all duration-500"
                            style={{
                              width: `${(currentStep / scenario.steps.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-pink-400">
                          {currentStep}/{scenario.steps.length}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(`/scenarios/play?id=${scenario.id}`)
                        }
                      >
                        {isCompleted
                          ? "Пройти снова 🔄"
                          : isStarted
                            ? "Продолжить 💗"
                            : "Начать 💕"}
                      </Button>
                      <span className="text-xs text-gray-400">
                        {scenario.steps.length} шагов
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Motivational footer */}
        <div className="text-center py-4">
          <p className="text-sm text-pink-400">
            Каждый сценарий — это реальная практика 🌟
          </p>
          <p className="text-xs text-pink-300 mt-1">
            Давай попробуем вместе 💕
          </p>
        </div>
      </main>
    </div>
  );
}
