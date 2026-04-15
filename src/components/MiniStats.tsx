"use client";

interface MiniStatsProps {
  wordsLearned: number;
  minutesSpent: number;
  accuracy: number;
}

export default function MiniStats({
  wordsLearned,
  minutesSpent,
  accuracy,
}: MiniStatsProps) {
  const hours = Math.floor(minutesSpent / 60);
  const mins = minutesSpent % 60;
  const timeStr = hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;

  const stats = [
    { icon: "📚", value: String(wordsLearned), label: "слов изучено" },
    { icon: "⏱", value: timeStr, label: "потрачено" },
    { icon: "🎯", value: `${accuracy}%`, label: "точность" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white/70 backdrop-blur-sm rounded-[20px] p-3 border border-pink-100 text-center shadow-[0_2px_12px_rgba(255,107,138,0.06)] animate-slide-up"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="text-xl mb-1">{s.icon}</div>
          <div className="text-lg font-bold text-[#2d1b26]">{s.value}</div>
          <div className="text-[10px] text-[#9b7080] leading-tight mt-0.5">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
