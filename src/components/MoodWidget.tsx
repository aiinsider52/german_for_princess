"use client";

import { Mood } from "@/lib/types";

const moods: { value: Mood; emoji: string; label: string }[] = [
  { value: "great", emoji: "🌸", label: "Отлично" },
  { value: "good", emoji: "😊", label: "Хорошо" },
  { value: "tired", emoji: "😴", label: "Устала" },
  { value: "bad", emoji: "😤", label: "Не очень" },
];

interface MoodWidgetProps {
  currentMood: Mood | null;
  onSelect: (mood: Mood) => void;
}

export default function MoodWidget({ currentMood, onSelect }: MoodWidgetProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-4 border border-pink-100 shadow-[0_4px_20px_rgba(255,107,138,0.08)]">
      <p className="text-sm text-[#9b7080] mb-3">Как ты сегодня?</p>
      <div className="flex gap-2">
        {moods.map((m) => (
          <button
            key={m.value}
            onClick={() => onSelect(m.value)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-2xl transition-all duration-300 cursor-pointer
              ${
                currentMood === m.value
                  ? "bg-gradient-to-b from-pink-100 to-pink-50 border-2 border-pink-300 shadow-md scale-105"
                  : "bg-pink-50/50 border-2 border-transparent hover:border-pink-200 hover:bg-pink-50"
              }`}
          >
            <span className="text-xl">{m.emoji}</span>
            <span
              className={`text-[11px] font-medium ${
                currentMood === m.value ? "text-pink-600" : "text-[#9b7080]"
              }`}
            >
              {m.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
