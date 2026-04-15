"use client";

import { Surprise } from "@/lib/types";
import Button from "./Button";
import ConfettiAnimation from "./ConfettiAnimation";

interface SurpriseScreenProps {
  surprise: Surprise;
  onClose: () => void;
}

export default function SurpriseScreen({
  surprise,
  onClose,
}: SurpriseScreenProps) {
  const { content } = surprise;

  const telegramText = encodeURIComponent(
    `💕 Я прошла ежедневный квиз по немецкому!\n\n${content.title}\n\n${content.message.slice(0, 200)}`
  );
  const telegramUrl = `https://t.me/gvertolit?text=${telegramText}`;

  const isCertificate = surprise.type === "certificate";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <ConfettiAnimation type={content.animation} />

      <div className="relative z-50 max-w-md w-full animate-scale-in">
        <div
          className={`rounded-[24px] p-6 shadow-[0_8px_40px_rgba(255,107,138,0.25)] border space-y-4 overflow-hidden relative
            ${
              isCertificate
                ? "bg-gradient-to-b from-amber-50 to-white border-amber-200"
                : "bg-white border-pink-200"
            }`}
        >
          {isCertificate && (
            <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          )}

          <div className="text-center relative">
            <div className="text-5xl mb-3">{content.emoji}</div>
            <h2 className="text-xl font-display font-bold text-[#2d1b26]">
              {content.title}
            </h2>
          </div>

          <div
            className={`rounded-[16px] p-4 relative ${
              isCertificate
                ? "bg-gradient-to-b from-amber-50/80 to-white border border-amber-100 text-center"
                : surprise.type === "poem"
                  ? "bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 italic"
                  : "bg-pink-50/50"
            }`}
          >
            <p className="text-sm text-[#2d1b26] leading-relaxed whitespace-pre-line">
              {content.message}
            </p>
            {isCertificate && (
              <p className="text-xs text-amber-500 mt-3">
                📅 {new Date().toLocaleDateString("ru-RU")}
              </p>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => window.open(telegramUrl, "_blank")}
              className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-6 rounded-[50px] font-semibold text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>💌</span>
              <span>Поделиться с Владом</span>
            </button>
            <Button variant="ghost" onClick={onClose} className="w-full">
              Закрыть 💕
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
