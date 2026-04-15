"use client";

import { SlotState, BOLT_COLORS } from "@/lib/puzzle-logic";

interface SlotHolderProps {
  slots: SlotState[];
  landingSlot?: string | null;
}

export default function SlotHolder({ slots, landingSlot }: SlotHolderProps) {
  return (
    <div className="flex gap-2 justify-center overflow-x-auto scrollbar-hide px-2 py-2">
      {slots.map((slot, si) => {
        const color = BOLT_COLORS[slot.color];
        const filled = slot.bolts.length;
        return (
          <div
            key={`${slot.color}-${si}`}
            className="flex flex-col items-center gap-1 bg-white/60 rounded-xl px-2.5 py-2 border min-w-[60px]"
            style={{ borderColor: color.border + "60" }}
          >
            <div
              className="text-[9px] font-bold rounded-full px-2 py-0.5"
              style={{ backgroundColor: color.bg + "30", color: color.border }}
            >
              {color.label}
            </div>
            <div className="flex gap-1">
              {Array.from({ length: slot.capacity }).map((_, i) => {
                const isFilled = i < filled;
                const isLanding =
                  landingSlot === slot.color && i === filled;
                return (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${
                      isLanding ? "animate-bolt-land" : ""
                    }`}
                    style={{
                      backgroundColor: isFilled ? color.bg : "transparent",
                      borderColor: isFilled ? color.border : "#ddd",
                      borderStyle: isFilled ? "solid" : "dashed",
                    }}
                  />
                );
              })}
            </div>
            <div className="text-[10px] text-[#9b7080]">
              {filled}/{slot.capacity}
            </div>
          </div>
        );
      })}
    </div>
  );
}
