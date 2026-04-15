"use client";

import Button from "./Button";

interface QuizResultProps {
  score: number;
  total: number;
  onSurprise: () => void;
  onBack: () => void;
}

export default function QuizResult({
  score,
  total,
  onSurprise,
  onBack,
}: QuizResultProps) {
  const percentage = Math.round((score / total) * 100);

  let emoji: string;
  let title: string;
  let subtitle: string;
  let hasSurprise: boolean;

  if (score === total) {
    emoji = "💎";
    title = "Идеально!";
    subtitle = "Ты просто невероятная! Все ответы правильные!";
    hasSurprise = true;
  } else if (score === total - 1) {
    emoji = "🌸";
    title = "Почти идеально!";
    subtitle = "Одна маленькая ошибочка — ерунда!";
    hasSurprise = true;
  } else if (score >= 3) {
    emoji = "😊";
    title = "Хорошая работа!";
    subtitle = "Ты знаешь больше, чем думаешь!";
    hasSurprise = true;
  } else {
    emoji = "💕";
    title = "Попробуй ещё завтра!";
    subtitle = "Ошибки — это часть пути. Ты справишься!";
    hasSurprise = false;
  }

  return (
    <div className="space-y-6 text-center animate-scale-in">
      <div className="text-6xl mb-2">{emoji}</div>
      <h2 className="text-2xl font-display font-bold text-[#2d1b26]">
        {title}
      </h2>
      <p className="text-[#9b7080]">{subtitle}</p>

      {/* Score visual */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
              i < score
                ? "bg-gradient-to-br from-pink-300 to-pink-500 text-white shadow-md"
                : "bg-pink-100 text-pink-300"
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {i < score ? "✓" : "·"}
          </div>
        ))}
      </div>

      <p className="text-3xl font-bold font-display text-[#2d1b26]">
        {score}/{total}
      </p>
      <p className="text-sm text-[#9b7080]">{percentage}% правильных ответов</p>

      <div className="space-y-3 pt-4">
        {hasSurprise && (
          <button
            onClick={onSurprise}
            className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white py-4 px-6 rounded-[50px] font-semibold shadow-[0_6px_25px_rgba(255,107,138,0.35)] animate-continue-pulse cursor-pointer transition-all active:scale-95"
          >
            Открыть сюрприз! 🎁
          </button>
        )}
        <Button variant="ghost" onClick={onBack} className="w-full">
          В дашборд 🏠
        </Button>
      </div>
    </div>
  );
}
