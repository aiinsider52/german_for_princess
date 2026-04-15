"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppState, Mood } from "@/lib/types";
import {
  loadState,
  saveState,
  setMood,
  unlockAchievement,
  clearNewAchievements,
} from "@/lib/store";

import CircularProgress from "@/components/CircularProgress";
import MoodWidget from "@/components/MoodWidget";
import DailyQuote from "@/components/DailyQuote";
import MiniStats from "@/components/MiniStats";
import RoadmapView from "@/components/RoadmapView";
import ScenariosView from "@/components/ScenariosView";
import VocabularyView from "@/components/VocabularyView";
import AchievementsView, {
  checkAchievements,
  getAchievementById,
} from "@/components/AchievementsView";
import AchievementToast from "@/components/AchievementToast";

type Tab = "home" | "roadmap" | "scenarios" | "games" | "vocabulary" | "achievements";

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: "home", icon: "🏠", label: "Главная" },
  { id: "roadmap", icon: "🗺️", label: "Роадмап" },
  { id: "games", icon: "🎮", label: "Игры" },
  { id: "scenarios", icon: "🎭", label: "Сценарии" },
  { id: "vocabulary", icon: "📚", label: "Словарь" },
  { id: "achievements", icon: "🏆", label: "Успехи" },
];

const motivationalMessages = [
  "Ты сегодня умничка 💕",
  "Каждый день — это шаг вперёд 🌸",
  "Ich glaube an dich! ❤️",
  "Ты становишься лучше каждый день ✨",
  "Ещё чуть-чуть и ты будешь говорить как профи 💖",
  "Я горжусь тобой ❤️",
  "Немецкий уже любит тебя 💕",
];

export default function DashboardPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [message, setMessage] = useState("");
  const [toastQueue, setToastQueue] = useState<string[]>([]);

  const refreshState = useCallback(() => {
    const loaded = loadState();
    setState(loaded);
    return loaded;
  }, []);

  useEffect(() => {
    const loaded = loadState();
    if (!loaded.onboardingComplete || !loaded.plan) {
      router.replace("/onboarding");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    let current = loaded;
    if (current.moodDate !== today) {
      current = { ...current, moodToday: null, moodDate: null };
      saveState(current);
    }

    setState(current);
    setMessage(
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ]
    );

    const newIds = checkAchievements(current);
    if (newIds.length > 0) {
      let s = current;
      for (const id of newIds) {
        s = unlockAchievement(s, id);
      }
      setState(s);
      setToastQueue(newIds);
    }
  }, [router]);

  useEffect(() => {
    if (!state) return;
    const newIds = checkAchievements(state);
    if (newIds.length > 0) {
      let s = state;
      for (const id of newIds) {
        s = unlockAchievement(s, id);
      }
      setState(s);
      setToastQueue((prev) => [
        ...prev,
        ...newIds.filter((n) => !prev.includes(n)),
      ]);
    }
  }, [state?.completedDays.length, state?.streak, state?.totalWordsLearned]);

  const handleMood = (mood: Mood) => {
    if (!state) return;
    const next = setMood(state, mood);
    setState(next);
  };

  const dismissToast = () => {
    setToastQueue((prev) => prev.slice(1));
    if (state && state.newAchievements.length > 0) {
      const next = clearNewAchievements(state);
      setState(next);
    }
  };

  if (!state?.plan) return null;

  const completedCount = state.completedDays.length;
  const totalDays = state.plan.days.length;
  const currentDayPlan = state.plan.days.find(
    (d) => d.day === state.currentDay
  );

  const currentToastId = toastQueue[0];
  const currentToastAchievement = currentToastId
    ? getAchievementById(currentToastId)
    : null;

  return (
    <div className="min-h-screen pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-pink-100/60">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3 space-y-3">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-display font-bold text-[#2d1b26] leading-tight">
                Привет, Юлия 💕
              </h1>
              <p className="text-sm text-[#9b7080] mt-0.5">{message}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {state.streak > 0 && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-1.5 rounded-[50px] border border-orange-100">
                  <span className="text-base">🔥</span>
                  <span className="font-bold text-orange-500 text-sm">
                    {state.streak}
                  </span>
                </div>
              )}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-3 py-1.5 rounded-[50px] border border-pink-100 text-xs">
                <span className="text-[#9b7080]">Уровень</span>{" "}
                <span className="font-bold text-pink-600">
                  {state.currentLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Mood widget */}
          <MoodWidget currentMood={state.moodToday} onSelect={handleMood} />

          {/* Daily quote */}
          <DailyQuote dayIndex={state.currentDay - 1} />
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        {activeTab === "home" && (
          <HomeTab
            state={state}
            completedCount={completedCount}
            totalDays={totalDays}
            currentDayPlan={currentDayPlan}
            router={router}
          />
        )}
        {activeTab === "roadmap" && state.plan && (
          <RoadmapView
            days={state.plan.days}
            completedDays={state.completedDays}
            currentDay={state.currentDay}
          />
        )}
        {activeTab === "games" && <GamesTab state={state} router={router} />}
        {activeTab === "scenarios" && <ScenariosView state={state} />}
        {activeTab === "vocabulary" && (
          <VocabularyView vocabulary={state.vocabulary} />
        )}
        {activeTab === "achievements" && <AchievementsView state={state} />}
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-xl border-t border-pink-100/60">
        <div className="max-w-2xl mx-auto px-2">
          <div className="flex justify-around py-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300 cursor-pointer relative
                    ${
                      isActive
                        ? "text-pink-500"
                        : "text-[#9b7080] hover:text-pink-400"
                    }`}
                >
                  <span
                    className={`text-xl transition-transform duration-300 ${
                      isActive ? "scale-110" : ""
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span className="text-[10px] font-semibold">
                    {tab.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-pink-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Achievement toast */}
      {currentToastAchievement && (
        <AchievementToast
          icon={currentToastAchievement.icon}
          title={currentToastAchievement.title}
          onDismiss={dismissToast}
        />
      )}
    </div>
  );
}

/* ─── HOME TAB ──────────────────────────────────────────── */

import { DayPlan } from "@/lib/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { canPlayQuizToday } from "@/lib/quiz-logic";
import WordleTimer from "@/components/WordleTimer";

function HomeTab({
  state,
  completedCount,
  totalDays,
  currentDayPlan,
  router,
}: {
  state: AppState;
  completedCount: number;
  totalDays: number;
  currentDayPlan: DayPlan | undefined;
  router: AppRouterInstance;
}) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Progress card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-5 border border-pink-100 shadow-[0_4px_20px_rgba(255,107,138,0.08)] text-center">
        <p className="text-sm text-[#9b7080] mb-3">
          День {state.currentDay} из {totalDays}
        </p>
        <div className="flex justify-center">
          <CircularProgress
            value={completedCount}
            max={totalDays}
            label={`${state.totalWordsLearned} слов`}
            sublabel="выучено"
          />
        </div>
        {completedCount > 0 && completedCount < totalDays && (
          <p className="text-xs text-[#9b7080] mt-3">
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
          <p className="text-sm text-pink-500 font-semibold mt-3">
            Все дни пройдены! Время для финального теста! 🎉
          </p>
        )}
      </div>

      {/* Mini stats */}
      <MiniStats
        wordsLearned={state.totalWordsLearned}
        minutesSpent={state.totalMinutesSpent}
        accuracy={state.testAccuracy}
      />

      {/* Continue lesson button */}
      {completedCount < totalDays && currentDayPlan && (
        <button
          onClick={() => router.push(`/day/${state.currentDay}`)}
          className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white py-4 px-6 rounded-[50px] font-semibold text-base shadow-[0_6px_25px_rgba(255,107,138,0.35)] animate-continue-pulse cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>
            День {state.currentDay}: {currentDayPlan.title}
          </span>
          <span className="text-lg">→</span>
        </button>
      )}

      {/* Final test */}
      {completedCount === totalDays && (
        <button
          onClick={() => router.push("/final-test")}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-6 rounded-[50px] font-semibold text-base shadow-[0_6px_25px_rgba(255,107,138,0.35)] animate-continue-pulse cursor-pointer transition-all active:scale-95"
        >
          Пройти финальный тест 🎉
        </button>
      )}

      {/* Quick access */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => router.push("/chat")}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[20px] p-4 border border-purple-100/60 text-left cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="text-2xl mb-2">💬</div>
          <p className="font-semibold text-[#2d1b26] text-sm">
            Чат с тьютором
          </p>
          <p className="text-[11px] text-[#9b7080] mt-0.5">
            Практикуй немецкий
          </p>
        </button>
        <button
          onClick={() => router.push("/scenarios")}
          className="bg-gradient-to-br from-amber-50 to-pink-50 rounded-[20px] p-4 border border-amber-100/60 text-left cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="text-2xl mb-2">🎭</div>
          <p className="font-semibold text-[#2d1b26] text-sm">
            Реальные сценарии
          </p>
          <p className="text-[11px] text-[#9b7080] mt-0.5">
            8 ситуаций из жизни
          </p>
        </button>
      </div>
    </div>
  );
}

/* ─── GAMES TAB ──────────────────────────────────────────── */

function GamesTab({
  state,
  router,
}: {
  state: AppState;
  router: AppRouterInstance;
}) {
  const quizAvailable = canPlayQuizToday(state.quiz.lastPlayedDate);
  const quizStats = state.quiz;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center mb-2">
        <h2 className="text-xl font-display font-bold text-[#2d1b26]">
          Игры и практика 🎮
        </h2>
        <p className="text-sm text-[#9b7080]">
          Учи немецкий играя!
        </p>
      </div>

      {/* Quiz card */}
      <button
        onClick={() => router.push("/quiz")}
        className="w-full text-left bg-gradient-to-br from-violet-50 to-pink-50 rounded-[20px] p-5 border border-violet-100/60 shadow-[0_4px_20px_rgba(255,107,138,0.08)] cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">📝</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-[#2d1b26] text-lg">
                Квиз дня
              </h3>
              {quizAvailable ? (
                <span className="bg-green-100 text-green-600 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  ДОСТУПЕН
                </span>
              ) : (
                <span className="bg-pink-100 text-pink-500 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  ПРОЙДЕН ✓
                </span>
              )}
            </div>
            <p className="text-xs text-[#9b7080] mt-1">
              5 вопросов на немецком — каждый день новые!
            </p>
            {quizStats.totalQuizzesTaken > 0 && (
              <div className="flex gap-3 mt-2 text-[10px] text-[#9b7080]">
                <span>🎯 Квизов: {quizStats.totalQuizzesTaken}</span>
                <span>
                  ✅ Точность:{" "}
                  {quizStats.totalQuizzesTaken > 0
                    ? Math.round(
                        (quizStats.totalCorrectAnswers /
                          (quizStats.totalQuizzesTaken * 5)) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            )}
            <p className="text-sm font-semibold text-pink-500 mt-3">
              {quizAvailable ? "Играть →" : "Пройден сегодня 💕"}
            </p>
          </div>
        </div>
        {quizAvailable && (
          <div className="mt-3 text-xs text-[#9b7080] text-center">
            🎁 Ответь на все 5 — получи сюрприз!
          </div>
        )}
      </button>

      {/* Wordle card */}
      <button
        onClick={() => router.push("/wordle")}
        className="w-full text-left bg-gradient-to-br from-emerald-50 to-pink-50 rounded-[20px] p-5 border border-emerald-100/60 shadow-[0_4px_20px_rgba(255,107,138,0.08)] cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">🇩🇪</div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-[#2d1b26] text-lg">
              Немецкий Вордли
            </h3>
            <p className="text-xs text-[#9b7080] mt-1">
              Угадай немецкое слово за 6 попыток!
            </p>
            <div className="mt-2">
              <WordleTimer />
            </div>
            {state.wordle.stats.played > 0 && (
              <div className="flex gap-3 mt-2 text-[10px] text-[#9b7080]">
                <span>🎮 Игр: {state.wordle.stats.played}</span>
                <span>
                  🏆 Побед:{" "}
                  {Math.round(
                    (state.wordle.stats.won / state.wordle.stats.played) * 100
                  )}
                  %
                </span>
                <span>🔥 Серия: {state.wordle.stats.currentStreak}</span>
              </div>
            )}
            <p className="text-sm font-semibold text-pink-500 mt-3">
              Играть →
            </p>
          </div>
        </div>
      </button>

      {/* Mini wordle grid preview */}
      <div className="bg-white/60 rounded-[16px] p-4 border border-pink-50 text-center">
        <div className="flex justify-center gap-1 mb-2">
          {["🟩", "🟨", "⬜", "🟩", "🟩"].map((s, i) => (
            <span key={i} className="text-lg">{s}</span>
          ))}
        </div>
        <p className="text-xs text-[#9b7080]">
          Новое слово каждые 6 часов · Подсказки · Telegram интеграция
        </p>
      </div>
    </div>
  );
}
