"use client";

import { useState } from "react";
import { DayPlan } from "@/lib/types";
import Button from "./Button";
import { useRouter } from "next/navigation";

interface RoadmapViewProps {
  days: DayPlan[];
  completedDays: number[];
  currentDay: number;
}

export default function RoadmapView({
  days,
  completedDays,
  currentDay,
}: RoadmapViewProps) {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);

  const nodeRadius = 26;
  const svgWidth = 340;
  const verticalGap = 100;
  const svgHeight = days.length * verticalGap + 60;
  const leftX = 80;
  const rightX = svgWidth - 80;

  const getX = (i: number) => (i % 2 === 0 ? leftX : rightX);
  const getY = (i: number) => 50 + i * verticalGap;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center mb-2">
        <h2 className="text-xl font-display font-bold text-[#2d1b26]">
          Твой путь 🗺️
        </h2>
        <p className="text-sm text-[#9b7080]">14 дней к свободному немецкому</p>
      </div>

      <div className="flex justify-center overflow-y-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="block"
        >
          {days.map((_, i) => {
            if (i === days.length - 1) return null;
            const x1 = getX(i);
            const y1 = getY(i);
            const x2 = getX(i + 1);
            const y2 = getY(i + 1);
            const midY = (y1 + y2) / 2;
            const path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
            const isDone = completedDays.includes(i + 1) && completedDays.includes(i + 2);
            const isPast = completedDays.includes(i + 1);
            return (
              <path
                key={`line-${i}`}
                d={path}
                fill="none"
                stroke={isPast ? "#ff8fab" : "#ffd1dc"}
                strokeWidth={3}
                strokeDasharray={isDone ? "none" : "8 6"}
                className={!isPast ? "roadmap-line" : ""}
                style={!isPast ? { animationDelay: `${i * 0.15}s` } : undefined}
              />
            );
          })}

          {days.map((day, i) => {
            const x = getX(i);
            const y = getY(i);
            const isCompleted = completedDays.includes(day.day);
            const isCurrent = day.day === currentDay;
            const isLocked = !isCompleted && !isCurrent;

            return (
              <g
                key={day.day}
                onClick={() => !isLocked && setSelectedDay(day)}
                className="cursor-pointer"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {isCurrent && (
                  <circle
                    cx={x}
                    cy={y}
                    r={nodeRadius + 8}
                    fill="none"
                    stroke="#ff8fab"
                    strokeWidth={2}
                    opacity={0.3}
                    className="animate-pulse-soft"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={nodeRadius}
                  fill={
                    isCompleted
                      ? "url(#pinkNodeGrad)"
                      : isCurrent
                        ? "url(#pinkNodeGrad)"
                        : "#f8f0f3"
                  }
                  stroke={isCompleted || isCurrent ? "#ff6b8a" : "#ffd1dc"}
                  strokeWidth={2.5}
                  className={isCurrent ? "animate-roadmap-pulse" : ""}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                />
                {isCompleted ? (
                  <text
                    x={x}
                    y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="16"
                    fill="white"
                  >
                    ✓
                  </text>
                ) : isLocked ? (
                  <text
                    x={x}
                    y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="12"
                    fill="#d4a0b0"
                  >
                    🔒
                  </text>
                ) : (
                  <text
                    x={x}
                    y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="13"
                    fontWeight="700"
                    fill="white"
                  >
                    {day.day}
                  </text>
                )}

                <text
                  x={i % 2 === 0 ? x + nodeRadius + 12 : x - nodeRadius - 12}
                  y={y - 8}
                  textAnchor={i % 2 === 0 ? "start" : "end"}
                  fontSize="12"
                  fontWeight="600"
                  fill={isLocked ? "#d4a0b0" : "#2d1b26"}
                >
                  День {day.day}
                </text>
                <text
                  x={i % 2 === 0 ? x + nodeRadius + 12 : x - nodeRadius - 12}
                  y={y + 8}
                  textAnchor={i % 2 === 0 ? "start" : "end"}
                  fontSize="10"
                  fill="#9b7080"
                >
                  {day.title.length > 16
                    ? day.title.slice(0, 16) + "…"
                    : day.title}
                </text>

                {isCurrent && (
                  <g>
                    <rect
                      x={x - 26}
                      y={y - nodeRadius - 22}
                      width={52}
                      height={18}
                      rx={9}
                      fill="#ff6b8a"
                    />
                    <text
                      x={x}
                      y={y - nodeRadius - 10}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      fill="white"
                    >
                      Сейчас!
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          <defs>
            <linearGradient id="pinkNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff8fab" />
              <stop offset="100%" stopColor="#ff6b8a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {selectedDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-[0_8px_40px_rgba(255,107,138,0.2)] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">
                {completedDays.includes(selectedDay.day) ? "✅" : "📖"}
              </div>
              <h3 className="font-display text-xl font-bold text-[#2d1b26]">
                День {selectedDay.day}
              </h3>
              <p className="text-[#2d1b26] font-medium mt-1">
                {selectedDay.title}
              </p>
              <p className="text-sm text-[#9b7080] mt-2">
                {selectedDay.description}
              </p>
              <div className="flex justify-center gap-4 mt-3 text-xs text-[#9b7080]">
                <span>{selectedDay.words.length} слов</span>
                <span>·</span>
                <span>{selectedDay.phrases.length} фраз</span>
                <span>·</span>
                <span>1 упражнение</span>
              </div>
              <div className="flex gap-2 mt-5 justify-center">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedDay(null)}
                >
                  Закрыть
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedDay(null);
                    router.push(`/day/${selectedDay.day}`);
                  }}
                >
                  {completedDays.includes(selectedDay.day)
                    ? "Повторить 🔄"
                    : "Начать урок →"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
