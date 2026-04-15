"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ScenarioProgress } from "@/lib/types";
import { loadState, updateScenarioProgress } from "@/lib/store";
import { evaluateScenarioInput, scenarios, Scenario, ScenarioResponse } from "@/lib/ai";
import Card from "@/components/Card";
import Button from "@/components/Button";

interface StepEntry {
  type: "situation" | "user" | "npc";
  content: string;
  extra?: ScenarioResponse;
}

function ScenarioPlayInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("id") || "";

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [entries, setEntries] = useState<StepEntry[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const state = loadState();
    if (!state.onboardingComplete) {
      router.replace("/onboarding");
      return;
    }

    const found = scenarios.find((s) => s.id === scenarioId);
    if (!found) {
      router.replace("/scenarios");
      return;
    }

    setScenario(found);

    const progress = state.scenarioProgress[scenarioId];
    if (progress && !progress.completed && progress.currentStep > 0) {
      setCurrentStep(progress.currentStep);
    }

    setEntries([
      {
        type: "situation",
        content: `📍 ${found.setting}\n\n${found.steps[progress?.currentStep || 0]?.situation || found.steps[0].situation}`,
      },
    ]);
  }, [scenarioId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  if (!scenario) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading || completed) return;

    const step = scenario.steps[currentStep];
    if (!step) return;

    setEntries((prev) => [...prev, { type: "user", content: input.trim() }]);
    setInput("");
    setIsLoading(true);
    setShowHint(false);

    try {
      const response = await evaluateScenarioInput(
        scenario.id,
        step.expectedIntent,
        input.trim()
      );

      const npcContent = [
        response.correction ? `✏️ Исправление: ${response.correction}\n` : "",
        `💡 ${response.explanation}\n`,
        `🗣️ «${response.npcReply}»\n`,
        `\n${response.encouragement}`,
      ]
        .filter(Boolean)
        .join("\n");

      setEntries((prev) => [
        ...prev,
        { type: "npc", content: npcContent, extra: response },
      ]);

      const nextStep = currentStep + 1;

      if (nextStep >= scenario.steps.length) {
        setCompleted(true);
        const state = loadState();
        const progress: ScenarioProgress = {
          scenarioId: scenario.id,
          currentStep: scenario.steps.length,
          completed: true,
          startedAt: Date.now(),
        };
        updateScenarioProgress(state, progress);
      } else {
        setCurrentStep(nextStep);

        const state = loadState();
        const progress: ScenarioProgress = {
          scenarioId: scenario.id,
          currentStep: nextStep,
          completed: false,
          startedAt: state.scenarioProgress[scenario.id]?.startedAt || Date.now(),
        };
        updateScenarioProgress(state, progress);

        setTimeout(() => {
          setEntries((prev) => [
            ...prev,
            { type: "situation", content: scenario.steps[nextStep].situation },
          ]);
        }, 1000);
      }
    } catch {
      setEntries((prev) => [
        ...prev,
        {
          type: "npc",
          content: "Что-то пошло не так 😅 Попробуй ещё раз!",
        },
      ]);
    }

    setIsLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentStepData = scenario.steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/scenarios")}
              className="text-pink-400 hover:text-pink-600 transition-colors cursor-pointer"
            >
              ← Назад
            </button>
            <h1 className="font-bold text-gray-800">
              {scenario.emoji} {scenario.title}
            </h1>
            <span className="text-xs text-pink-400">
              {Math.min(currentStep + 1, scenario.steps.length)}/{scenario.steps.length}
            </span>
          </div>
          <div className="mt-2 h-2 bg-pink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-300 to-pink-500 rounded-full transition-all duration-500"
              style={{
                width: `${((completed ? scenario.steps.length : currentStep) / scenario.steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </header>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          {entries.map((entry, i) => {
            if (entry.type === "situation") {
              return (
                <div key={i} className="animate-scale-in">
                  <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                    <div className="flex items-start gap-2">
                      <span className="text-lg shrink-0">📖</span>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {entry.content}
                      </p>
                    </div>
                  </Card>
                </div>
              );
            }

            if (entry.type === "user") {
              return (
                <div key={i} className="flex justify-end animate-slide-up">
                  <div className="max-w-[85%] bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-2xl rounded-br-md px-4 py-3">
                    <p className="text-sm">{entry.content}</p>
                  </div>
                </div>
              );
            }

            return (
              <div key={i} className="flex justify-start animate-slide-up">
                <div className="max-w-[85%] bg-white border border-pink-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="text-xs text-pink-400 mb-1 font-medium">
                    Собеседник 🇨🇭
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {entry.content}
                  </p>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white border border-pink-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 py-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-pink-300 rounded-full animate-pulse-soft"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {completed && (
            <div className="animate-scale-in text-center py-8">
              <div className="text-6xl mb-4 animate-float">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Сценарий пройден!
              </h2>
              <p className="text-pink-500 mb-6">
                Юлия, ты просто невероятная! 💖
              </p>
              <div className="space-y-3">
                <Button onClick={() => router.push("/scenarios")}>
                  К другим сценариям 💕
                </Button>
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/dashboard")}
                  >
                    На главную
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Hint + Input */}
      {!completed && (
        <>
          {showHint && currentStepData && (
            <div className="border-t border-pink-50 bg-pink-50/80 backdrop-blur-sm">
              <div className="max-w-2xl mx-auto px-4 py-2">
                <p className="text-xs text-pink-500">
                  💡 <strong>Подсказка:</strong> {currentStepData.hint}
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-pink-100 bg-white/90 backdrop-blur-md">
            <div className="max-w-2xl mx-auto px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-pink-300 hover:text-pink-500 transition-colors cursor-pointer"
                >
                  {showHint ? "Скрыть подсказку" : "Показать подсказку 💡"}
                </button>
              </div>
              <Card className="!p-2 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Напиши свой ответ по-немецки..."
                  disabled={isLoading || completed}
                  className="flex-1 px-3 py-2 bg-transparent text-gray-700 placeholder-pink-300 outline-none text-sm disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || completed}
                  className="bg-gradient-to-r from-pink-400 to-pink-500 text-white p-2.5 rounded-xl hover:from-pink-500 hover:to-pink-600 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shrink-0"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </Card>
              <p className="text-center text-xs text-pink-300 mt-2">
                Ты справишься 💖
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ScenarioPlayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
          <div className="text-center">
            <div className="text-5xl animate-float mb-4">🎯</div>
            <p className="text-pink-400">Загружаем сценарий...</p>
          </div>
        </div>
      }
    >
      <ScenarioPlayInner />
    </Suspense>
  );
}
