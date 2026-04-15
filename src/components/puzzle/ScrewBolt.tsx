"use client";

import { Bolt, BOLT_COLORS, isBoltBlocked } from "@/lib/puzzle-logic";

interface ScrewBoltProps {
  bolt: Bolt;
  remainingBolts: Bolt[];
  onTap: (bolt: Bolt) => void;
  removing?: boolean;
  returning?: boolean;
}

export default function ScrewBolt({
  bolt,
  remainingBolts,
  onTap,
  removing,
  returning,
}: ScrewBoltProps) {
  const blocked = isBoltBlocked(bolt, remainingBolts);
  const color = BOLT_COLORS[bolt.color];

  const handleClick = () => {
    if (blocked) {
      const el = document.getElementById(`bolt-${bolt.id}`);
      el?.classList.remove("animate-bolt-shake");
      void el?.offsetWidth;
      el?.classList.add("animate-bolt-shake");
      if (navigator.vibrate) navigator.vibrate(30);
      return;
    }
    onTap(bolt);
  };

  let animClass = "";
  if (removing) animClass = "animate-screw-out";
  else if (returning) animClass = "animate-bolt-return";

  return (
    <button
      id={`bolt-${bolt.id}`}
      onClick={handleClick}
      className={`absolute flex items-center justify-center rounded-full transition-all duration-200 ${animClass} ${
        blocked
          ? "opacity-40 cursor-not-allowed"
          : "cursor-pointer hover:scale-110 animate-bolt-glow"
      }`}
      style={{
        left: `${bolt.position.x}%`,
        top: `${bolt.position.y}%`,
        width: 44,
        height: 44,
        transform: "translate(-50%, -50%)",
        backgroundColor: color.bg,
        border: `2.5px solid ${color.border}`,
        zIndex: 10 + bolt.position.z,
        "--bolt-color": color.bg,
      } as React.CSSProperties}
      disabled={removing}
    >
      <span className="text-[18px] leading-none select-none">
        {bolt.word.emoji}
      </span>
      <span
        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold"
        style={{ backgroundColor: color.border, color: "#fff" }}
      >
        ⊕
      </span>
    </button>
  );
}
