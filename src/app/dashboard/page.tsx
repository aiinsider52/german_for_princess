"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppState } from "@/lib/types";
import { loadState } from "@/lib/store";
import DayCard from "@/components/DayCard";
import ProgressBar from "@/components/ProgressBar";
import Card from "@/components/Card";

const motivationalMessages = [
  "Ты сегодня умничка 💕",
  "Ещё чуть-чуть и ты будешь говорить как профи 💖",
  "Я горжусь тобой ❤️",
  "Каждый день — маленькая победа 🌟",
  "Ты делаешь это потрясающе! 💗",
  "Немецкий уже любит тебя 💕",
];

const navItems = [
  { href: "/dashboard", label: "Учёба", emoji: "💕", active: true },
  { href: "/chat", label: "Чат", emoji: "💬", active: false },
  { href: "/scenarios", label: "Сценарии", emoji: "🎯", active: false },
];

export default function DashboardPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loaded = loadState();
    if (!loaded.onboardingComplete || !loaded.plan) {
      router.replace("/onboarding");
      return;
    }
    setState(loaded);
    setMessage(
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ]
    );
  }, [router]);

  if (!state?.plan) return null;

  const completedCount = state.completedDays.length;
  const totalDays = state.plan.days.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Твой путь, Юлия 💖
              </h1>
              <p className="text-sm text-pink-400">{message}</p>
            </div>
            <div className="flex items-center gap-3">
              {state.streak > 0 && (
                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full">
                  <span className="text-lg">🔥</span>
                  <span className="font-bold text-orange-500">
                    {state.streak}
                  </span>
                </div>
              )}
              <div className="bg-pink-50 px-3 py-1.5 rounded-full text-sm">
                <span className="text-pink-400">Уровень</span>{" "}
                <span className="font-bold text-pink-600">
                  {state.currentLevel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* AI Features promo */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in">
          <Card
            hover
            className="!p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 cursor-pointer"
          >
            <div onClick={() => router.push("/chat")}>
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold text-gray-800 text-sm">
                Чат с тьютором
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Практикуй немецкий в диалоге
              </p>
            </div>
          </Card>
          <Card
            hover
            className="!p-4 bg-gradient-to-br from-amber-50 to-pink-50 border-amber-100 cursor-pointer"
          >
            <div onClick={() => router.push("/scenarios")}>
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-800 text-sm">
                Реальные сценарии
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Магазин, врач, квартира
              </p>
            </div>
          </Card>
        </div>

        {/* Progress overview */}
        <Card>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">Прогресс</h2>
              <span className="text-sm text-pink-400">
                День {state.currentDay} из {totalDays}
              </span>
            </div>
            <ProgressBar value={completedCount} max={totalDays} />
            {completedCount > 0 && completedCount < totalDays && (
              <p className="text-sm text-gray-500">
                Осталось {totalDays - completedCount}{" "}
                {totalDays - completedCount === 1
                  ? "день"
                  : totalDays - completedCount < 5
                    ? "дня"
                    : "дней"}{" "}
                — ты справишься! 💪
              </p>
            )}
            {completedCount === totalDays && (
              <p className="text-sm text-pink-500 font-medium">
                Все дни пройдены! Пора сдать финальный тест! 🎉
              </p>
            )}
          </div>
        </Card>

        {/* Final test banner */}
        {completedCount === totalDays && (
          <Card className="bg-gradient-to-r from-pink-100 to-pink-50 border-pink-300">
            <div className="text-center py-2">
              <p className="text-lg font-bold text-gray-800 mb-2">
                🎉 Финальный тест готов!
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Покажи всё, чему научилась за 14 дней
              </p>
              <button
                onClick={() => router.push("/final-test")}
                className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-8 py-3 rounded-2xl font-medium shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 transition-all duration-300 cursor-pointer active:scale-95"
              >
                Пройти финальный тест 💖
              </button>
            </div>
          </Card>
        )}

        {/* Day cards */}
        <div className="grid gap-4">
          {state.plan.days.map((day) => {
            const isCompleted = state.completedDays.includes(day.day);
            const isCurrent = day.day === state.currentDay;
            const isAvailable =
              day.day <= state.currentDay || isCompleted;

            return (
              <div
                key={day.day}
                className="animate-slide-up"
                style={{ animationDelay: `${day.day * 50}ms` }}
              >
                <DayCard
                  day={day.day}
                  title={day.title}
                  description={day.description}
                  isCompleted={isCompleted}
                  isAvailable={isAvailable}
                  isCurrent={isCurrent}
                />
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md border-t border-pink-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  item.active
                    ? "text-pink-500"
                    : "text-gray-400 hover:text-pink-400"
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
