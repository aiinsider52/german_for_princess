"use client";

import { useRouter } from "next/navigation";
import Card from "./Card";
import Button from "./Button";

interface DayCardProps {
  day: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isAvailable: boolean;
  isCurrent: boolean;
}

export default function DayCard({
  day,
  title,
  description,
  isCompleted,
  isAvailable,
  isCurrent,
}: DayCardProps) {
  const router = useRouter();

  return (
    <Card
      hover={isAvailable}
      className={`relative overflow-hidden
        ${isCompleted ? "bg-gradient-to-br from-pink-50 to-white border-pink-300" : ""}
        ${isCurrent ? "ring-2 ring-pink-400 ring-offset-2" : ""}
        ${!isAvailable && !isCompleted ? "opacity-60" : ""}
      `}
    >
      {isCompleted && (
        <div className="absolute top-3 right-3 text-2xl animate-float">
          ✅
        </div>
      )}
      {isCurrent && !isCompleted && (
        <div className="absolute top-3 right-3 text-2xl animate-pulse-soft">
          💗
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-pink-100 text-pink-600 text-sm font-bold px-3 py-1 rounded-full">
            День {day}
          </span>
        </div>
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>

        {isAvailable && !isCompleted && (
          <Button
            size="sm"
            onClick={() => router.push(`/day/${day}`)}
            className="mt-2 self-start"
          >
            {isCurrent ? "Начать 💗" : "Открыть"}
          </Button>
        )}

        {isCompleted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/day/${day}`)}
            className="mt-2 self-start"
          >
            Повторить 🔄
          </Button>
        )}

        {!isAvailable && !isCompleted && (
          <p className="text-xs text-pink-300 mt-2">
            Сначала пройди предыдущие дни 🔒
          </p>
        )}
      </div>
    </Card>
  );
}
