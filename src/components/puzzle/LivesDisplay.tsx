"use client";

import { useEffect, useState } from "react";

interface LivesDisplayProps {
  lives: number;
  maxLives: number;
}

export default function LivesDisplay({ lives, maxLives }: LivesDisplayProps) {
  const [breakingIndex, setBreakingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lives < maxLives) {
      setBreakingIndex(lives);
      const t = setTimeout(() => setBreakingIndex(null), 600);
      return () => clearTimeout(t);
    }
  }, [lives, maxLives]);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxLives }).map((_, i) => {
        const alive = i < lives;
        const breaking = i === breakingIndex;
        return (
          <span
            key={i}
            className={`text-xl transition-all ${
              breaking ? "animate-heart-break" : ""
            }`}
            style={{
              filter: alive ? "none" : "grayscale(1)",
              opacity: alive ? 1 : 0.4,
            }}
          >
            {alive ? "❤️" : "🖤"}
          </span>
        );
      })}
    </div>
  );
}
