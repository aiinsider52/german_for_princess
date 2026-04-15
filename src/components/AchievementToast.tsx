"use client";

import { useEffect, useState } from "react";

interface AchievementToastProps {
  icon: string;
  title: string;
  onDismiss: () => void;
}

export default function AchievementToast({
  icon,
  title,
  onDismiss,
}: AchievementToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-400 ${
        visible
          ? "animate-toast opacity-100"
          : "opacity-0 translate-y-4"
      }`}
    >
      <div className="bg-white rounded-[50px] shadow-[0_8px_30px_rgba(255,107,138,0.25)] border border-pink-200 px-5 py-3 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-[10px] text-pink-400 font-semibold uppercase tracking-wide">
            Новое достижение!
          </p>
          <p className="text-sm font-semibold text-[#2d1b26]">{title}</p>
        </div>
        <span className="text-lg animate-shimmer">✨</span>
      </div>
    </div>
  );
}
