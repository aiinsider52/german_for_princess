"use client";

import { useEffect, useState } from "react";
import { getNextWordleTime } from "@/lib/wordle-logic";

export default function WordleTimer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const next = getNextWordleTime();
      const diff = next.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Новое слово!");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-xs text-[#9b7080]">
      <span>⏱</span>
      <span>{timeLeft}</span>
    </div>
  );
}
