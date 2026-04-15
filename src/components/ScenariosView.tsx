"use client";

import { useRouter } from "next/navigation";
import { AppState } from "@/lib/types";
import { scenarios } from "@/lib/ai";
import Button from "./Button";

interface ScenariosViewProps {
  state: AppState;
}

export default function ScenariosView({ state }: ScenariosViewProps) {
  const router = useRouter();

  const bgColors: Record<string, string> = {
    store: "from-green-50 to-emerald-50",
    doctor: "from-blue-50 to-cyan-50",
    apartment: "from-amber-50 to-yellow-50",
    "dance-studio": "from-purple-50 to-fuchsia-50",
    "sushi-restaurant": "from-orange-50 to-red-50",
    "puppy-yoga": "from-lime-50 to-green-50",
    airport: "from-sky-50 to-indigo-50",
    "bmw-showroom": "from-slate-50 to-zinc-50",
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center mb-2">
        <h2 className="text-xl font-display font-bold text-[#2d1b26]">
          Реальные ситуации 🎭
        </h2>
        <p className="text-sm text-[#9b7080]">
          {scenarios.length} сценариев для практики
        </p>
      </div>

      <div className="grid gap-3">
        {scenarios.map((scenario, i) => {
          const progress = state.scenarioProgress[scenario.id];
          const isCompleted = progress?.completed;
          const isStarted = progress && !progress.completed;
          const bg = bgColors[scenario.id] || "from-pink-50 to-rose-50";

          return (
            <div
              key={scenario.id}
              className={`bg-gradient-to-br ${bg} rounded-[20px] p-4 border border-pink-100/60 shadow-[0_2px_12px_rgba(255,107,138,0.06)] animate-slide-up relative overflow-hidden`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {isCompleted && (
                <div className="absolute top-3 right-3 text-lg">✅</div>
              )}
              {scenario.isNew && !isCompleted && (
                <span className="absolute top-3 right-3 bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  НОВОЕ
                </span>
              )}

              <div className="flex items-start gap-3">
                <div className="text-3xl shrink-0">{scenario.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-[#2d1b26] text-[15px]">
                      {scenario.title}
                    </h3>
                    {scenario.tag && (
                      <span className="text-[9px] bg-white/70 text-pink-500 px-2 py-0.5 rounded-full font-medium">
                        {scenario.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9b7080] mt-0.5">
                    {scenario.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {scenario.difficulty && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                          scenario.difficulty === "beginner"
                            ? "bg-green-100 text-green-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {scenario.difficulty === "beginner"
                          ? "Начальный"
                          : "Средний"}
                      </span>
                    )}
                    <span className="text-[10px] text-[#9b7080]">
                      {scenario.steps.length} шагов
                    </span>
                  </div>

                  {isStarted && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-white/70 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-300 to-pink-500 rounded-full"
                          style={{
                            width: `${((progress?.currentStep || 0) / scenario.steps.length) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-pink-400">
                        {progress?.currentStep}/{scenario.steps.length}
                      </span>
                    </div>
                  )}

                  <Button
                    size="sm"
                    className="mt-3"
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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
