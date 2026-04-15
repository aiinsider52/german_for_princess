"use client";

import { useState, useMemo } from "react";
import { VocabularyItem } from "@/lib/types";

interface VocabularyViewProps {
  vocabulary: VocabularyItem[];
}

export default function VocabularyView({ vocabulary }: VocabularyViewProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const topics = useMemo(() => {
    const set = new Set(vocabulary.map((v) => v.topic));
    return ["all", ...Array.from(set)];
  }, [vocabulary]);

  const filtered = useMemo(() => {
    return vocabulary.filter((v) => {
      const matchesSearch =
        !search ||
        v.german.toLowerCase().includes(search.toLowerCase()) ||
        v.russian.toLowerCase().includes(search.toLowerCase());
      const matchesTopic = activeFilter === "all" || v.topic === activeFilter;
      return matchesSearch && matchesTopic;
    });
  }, [vocabulary, search, activeFilter]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center mb-2">
        <h2 className="text-xl font-display font-bold text-[#2d1b26]">
          Мой словарь 📚
        </h2>
        <p className="text-sm text-[#9b7080]">
          Ты знаешь {vocabulary.length} слов! 🎉
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300">
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск слова..."
          className="w-full pl-11 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-pink-100 rounded-[50px] text-sm text-[#2d1b26] placeholder-pink-300 outline-none focus:border-pink-300 focus:shadow-[0_0_0_3px_rgba(255,143,171,0.15)] transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setActiveFilter(topic)}
            className={`shrink-0 px-4 py-1.5 rounded-[50px] text-xs font-medium transition-all cursor-pointer
              ${
                activeFilter === topic
                  ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md"
                  : "bg-white/70 text-[#9b7080] border border-pink-100 hover:border-pink-300"
              }`}
          >
            {topic === "all" ? "Все" : topic}
          </button>
        ))}
      </div>

      {/* Words */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-[#9b7080]">
            {vocabulary.length === 0
              ? "Заверши первый день, чтобы слова появились здесь 💕"
              : "Ничего не найдено"}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((word, i) => {
            const isFlipped = flippedIndex === i;
            return (
              <div
                key={`${word.german}-${i}`}
                className="flip-card h-[100px] cursor-pointer"
                onClick={() => setFlippedIndex(isFlipped ? null : i)}
              >
                <div
                  className={`flip-card-inner relative w-full h-full ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                  style={{
                    transition: "transform 0.6s ease",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Front */}
                  <div
                    className="flip-card-front absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[20px] border border-pink-100 p-4 flex items-center justify-between shadow-[0_2px_12px_rgba(255,107,138,0.06)]"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-[#2d1b26] text-base">
                        {word.german}
                      </p>
                      <p className="text-sm text-pink-500 mt-0.5">
                        {word.russian}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] bg-pink-50 text-pink-400 px-2 py-1 rounded-full">
                        {word.topic}
                      </span>
                      <p className="text-[10px] text-[#9b7080] mt-1">
                        День {word.dayId} ✓
                      </p>
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="flip-card-back absolute inset-0 bg-gradient-to-r from-pink-100 to-rose-50 rounded-[20px] border border-pink-200 p-4 flex flex-col justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <p className="text-xs text-pink-500 font-medium">
                      Пример:
                    </p>
                    <p className="text-sm text-[#2d1b26] italic mt-1">
                      {word.example || "—"}
                    </p>
                    <p className="text-[10px] text-[#9b7080] mt-2">
                      Нажми, чтобы перевернуть
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
