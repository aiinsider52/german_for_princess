"use client";

import { AppState, Achievement } from "@/lib/types";

const allAchievements: (Achievement & {
  check: (s: AppState) => boolean;
})[] = [
  { id: "first_day", icon: "🌸", title: "Первый шаг", description: "Завершила первый день", check: (s) => s.completedDays.length >= 1 },
  { id: "streak_3", icon: "🔥", title: "3 дня подряд", description: "Не пропустила 3 дня", check: (s) => s.streak >= 3 },
  { id: "halfway", icon: "⭐", title: "Полпути", description: "День 7 из 14 пройден", check: (s) => s.completedDays.length >= 7 },
  { id: "week_one", icon: "🏆", title: "Первая неделя", description: "7 дней подряд", check: (s) => s.streak >= 7 },
  { id: "champion", icon: "👑", title: "Чемпионка", description: "Все 14 дней!", check: (s) => s.completedDays.length >= 14 },
  { id: "words_10", icon: "📝", title: "10 слов", description: "Выучила 10 слов", check: (s) => s.totalWordsLearned >= 10 },
  { id: "words_50", icon: "📚", title: "50 слов", description: "Выучила 50 слов", check: (s) => s.totalWordsLearned >= 50 },
  { id: "words_all", icon: "🎓", title: "Словарный запас", description: "Все 70 слов!", check: (s) => s.totalWordsLearned >= 70 },
  { id: "chat_first", icon: "💬", title: "Первый диалог", description: "Написала в чат", check: (s) => s.chatMessagesCount >= 1 },
  { id: "scenario_first", icon: "🎭", title: "Актриса", description: "Прошла первый сценарий", check: (s) => s.scenariosCompleted.length >= 1 },
  { id: "scenario_all", icon: "🌟", title: "Мастер сценариев", description: "Все сценарии!", check: (s) => s.scenariosCompleted.length >= 8 },
  { id: "bmw_lover", icon: "🏎️", title: "BMW vs Audi", description: "Нашла пасхалку в сценарии 😄", check: (s) => s.foundEasterEgg },
  { id: "night_owl", icon: "🦉", title: "Совушка", description: "Занималась после 22:00", check: (s) => s.studiedLate },
  { id: "early_bird", icon: "🌅", title: "Ранняя пташка", description: "Занималась до 8:00", check: (s) => s.studiedEarly },
];

export function checkAchievements(state: AppState): string[] {
  const newlyUnlocked: string[] = [];
  for (const a of allAchievements) {
    if (!state.unlockedAchievements.includes(a.id) && a.check(state)) {
      newlyUnlocked.push(a.id);
    }
  }
  return newlyUnlocked;
}

export function getAchievementById(id: string) {
  return allAchievements.find((a) => a.id === id);
}

interface AchievementsViewProps {
  state: AppState;
}

export default function AchievementsView({ state }: AchievementsViewProps) {
  const unlockedCount = state.unlockedAchievements.length;
  const total = allAchievements.length;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center mb-2">
        <h2 className="text-xl font-display font-bold text-[#2d1b26]">
          Достижения 🏆
        </h2>
        <p className="text-sm text-[#9b7080]">
          {unlockedCount} из {total} получено
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-4 border border-pink-100">
        <div className="h-3 bg-pink-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-300 to-pink-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(unlockedCount / total) * 100}%` }}
          />
        </div>
        <p className="text-xs text-[#9b7080] mt-2 text-center">
          {unlockedCount === total
            ? "Все достижения разблокированы! Ты звезда! ⭐"
            : `Ещё ${total - unlockedCount} до полной коллекции 💕`}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {allAchievements.map((a, i) => {
          const isUnlocked = state.unlockedAchievements.includes(a.id);
          return (
            <div
              key={a.id}
              className={`rounded-[20px] p-4 border text-center transition-all duration-300 animate-slide-up relative overflow-hidden
                ${
                  isUnlocked
                    ? "bg-white/80 border-pink-200 shadow-[0_4px_20px_rgba(255,107,138,0.12)]"
                    : "bg-gray-soft/50 border-gray-200/50 opacity-60"
                }`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {isUnlocked && (
                <div className="absolute inset-0 animate-shimmer pointer-events-none" />
              )}
              <div className="text-3xl mb-2 relative">
                {isUnlocked ? a.icon : "❓"}
              </div>
              <p
                className={`text-sm font-semibold ${
                  isUnlocked ? "text-[#2d1b26]" : "text-[#9b7080]"
                }`}
              >
                {isUnlocked ? a.title : "???"}
              </p>
              <p className="text-[10px] text-[#9b7080] mt-1">
                {a.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
