"use client";

import { useState } from "react";

const quotes = [
  { german: "Übung macht den Meister", russian: "Практика делает мастера" },
  { german: "Aller Anfang ist schwer", russian: "Всякое начало трудно" },
  { german: "Wer wagt, gewinnt", russian: "Кто не рискует, тот не пьёт шампанское" },
  { german: "Ohne Fleiß kein Preis", russian: "Без труда не выловишь и рыбку из пруда" },
  { german: "Es ist noch kein Meister vom Himmel gefallen", russian: "Ни один мастер не упал с неба" },
  { german: "Die Liebe überwindet alles", russian: "Любовь преодолевает всё" },
  { german: "Morgen ist auch noch ein Tag", russian: "Завтра тоже будет день" },
  { german: "Kleider machen Leute", russian: "Одежда делает людей" },
  { german: "Man lernt nie aus", russian: "Век живи — век учись" },
  { german: "Einmal ist keinmal", russian: "Один раз не считается" },
  { german: "Wissen ist Macht", russian: "Знание — сила" },
  { german: "Das Leben ist schön", russian: "Жизнь прекрасна" },
  { german: "Zusammen sind wir stark", russian: "Вместе мы сильны" },
  { german: "Träume werden wahr", russian: "Мечты сбываются" },
];

interface DailyQuoteProps {
  dayIndex: number;
}

export default function DailyQuote({ dayIndex }: DailyQuoteProps) {
  const [collapsed, setCollapsed] = useState(false);
  const quote = quotes[dayIndex % quotes.length];

  return (
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="w-full text-left cursor-pointer"
    >
      <div
        className={`bg-gradient-to-r from-pink-100/80 to-rose-50/80 backdrop-blur-sm rounded-[20px] border border-pink-200/60 overflow-hidden transition-all duration-400 ${
          collapsed ? "py-3 px-4" : "p-4"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-pink-500">
            ✨ Цитата дня
          </span>
          <span
            className={`text-pink-400 text-xs transition-transform duration-300 ${
              collapsed ? "" : "rotate-180"
            }`}
          >
            ▾
          </span>
        </div>
        {!collapsed && (
          <div className="mt-3 animate-fade-in">
            <p className="text-base font-display italic text-[#2d1b26]">
              «{quote.german}»
            </p>
            <p className="text-sm text-[#9b7080] mt-1">
              {quote.russian}
            </p>
          </div>
        )}
      </div>
    </button>
  );
}
