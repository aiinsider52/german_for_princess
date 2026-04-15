"use client";

import { WordleWord } from "@/lib/types";
import { generateShareText, generateTelegramMessage } from "@/lib/wordle-logic";
import Button from "./Button";
import ConfettiAnimation from "./ConfettiAnimation";
import WordleTimer from "./WordleTimer";

interface WordleResultProps {
  won: boolean;
  word: WordleWord;
  guesses: string[];
  hintsUsed: number;
  stats: {
    played: number;
    won: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
  };
  onBack: () => void;
}

export default function WordleResult({
  won,
  word,
  guesses,
  hintsUsed,
  stats,
  onBack,
}: WordleResultProps) {
  const starsEarned = won
    ? Math.max(1, 5 - (guesses.length - 1) - hintsUsed)
    : 0;

  const handleShare = () => {
    const text = generateShareText(word, guesses, word.word, won);
    if (navigator.share) {
      navigator.share({ text }).catch(() => {
        navigator.clipboard.writeText(text);
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const handleTelegram = () => {
    const msg = won
      ? encodeURIComponent(
          `🇩🇪 Я угадала слово в Немецком Вордли!\n\n${word.word} — «${word.translation}» ${word.emoji}\n\nПопытки: ${guesses.length}/6\n⭐ ${starsEarned} звёзд\n\nЮлия учит немецкий 💕`
        )
      : encodeURIComponent(generateTelegramMessage(guesses, word.word));
    window.open(`https://t.me/gvertolit?text=${msg}`, "_blank");
  };

  const winRate = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxDist = Math.max(...stats.guessDistribution, 1);

  return (
    <div className="space-y-5 text-center animate-scale-in">
      {won && <ConfettiAnimation type="confetti" />}

      <div className="text-5xl mb-2">{won ? "🎉" : "😔"}</div>
      <h2 className="text-2xl font-display font-bold text-[#2d1b26]">
        {won ? "Молодец! Ты угадала!" : "Почти получилось!"}
      </h2>

      {/* Word reveal */}
      <div className="bg-white/80 rounded-[20px] p-4 border border-pink-100 inline-block">
        <span className="text-3xl mr-2">{word.emoji}</span>
        <span className="text-xl font-bold font-display text-[#2d1b26]">
          {word.word}
        </span>
        <span className="text-[#9b7080] ml-2">— «{word.translation}»</span>
      </div>

      {won && (
        <div className="space-y-1">
          <p className="text-sm text-[#9b7080]">
            Попытки: {guesses.length}/6 · Подсказки: {hintsUsed}
          </p>
          <div className="flex justify-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`text-lg ${i < starsEarned ? "" : "opacity-20"}`}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { val: stats.played, label: "Игр" },
          { val: winRate, label: "% побед" },
          { val: stats.currentStreak, label: "Серия" },
          { val: stats.maxStreak, label: "Макс" },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white/60 rounded-xl p-2 border border-pink-50"
          >
            <p className="text-lg font-bold text-[#2d1b26]">{s.val}</p>
            <p className="text-[9px] text-[#9b7080]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Distribution */}
      {stats.played > 0 && (
        <div className="bg-white/60 rounded-[16px] p-3 border border-pink-50 text-left">
          <p className="text-xs text-[#9b7080] mb-2">Распределение попыток</p>
          {stats.guessDistribution.map((count, i) => (
            <div key={i} className="flex items-center gap-2 mb-1">
              <span className="text-xs text-[#9b7080] w-3">{i + 1}</span>
              <div
                className={`h-5 rounded-r flex items-center justify-end px-1.5 text-[10px] font-bold text-white transition-all duration-500 ${
                  won && guesses.length === i + 1
                    ? "bg-[#6aaa64]"
                    : "bg-[#787c7e]"
                }`}
                style={{
                  width: `${Math.max(8, (count / maxDist) * 100)}%`,
                }}
              >
                {count}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timer */}
      <div className="bg-pink-50/80 rounded-[16px] p-3 border border-pink-100">
        <p className="text-xs text-[#9b7080] mb-1">Следующее слово через:</p>
        <WordleTimer />
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white py-3 px-6 rounded-[50px] font-semibold text-sm shadow-md cursor-pointer transition-all active:scale-95"
        >
          Поделиться результатом 📋
        </button>
        <button
          onClick={handleTelegram}
          className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-6 rounded-[50px] font-semibold text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>💌</span>
          <span>{won ? "Написать Владу" : "Попросить помощи у Влада"}</span>
        </button>
        <Button variant="ghost" onClick={onBack} className="w-full">
          ← В дашборд
        </Button>
      </div>
    </div>
  );
}
