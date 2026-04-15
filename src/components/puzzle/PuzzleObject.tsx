"use client";

import { Bolt } from "@/lib/puzzle-logic";
import ScrewBolt from "./ScrewBolt";

interface PuzzleObjectProps {
  levelId: number;
  bolts: Bolt[];
  remainingBolts: Bolt[];
  onBoltTap: (bolt: Bolt) => void;
  removingBoltId?: string | null;
  returningBoltId?: string | null;
  completed?: boolean;
}

function HouseSVG() {
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full">
      <polygon points="100,20 180,80 20,80" fill="#ff8fab" stroke="#ff6b8a" strokeWidth="2" />
      <rect x="40" y="80" width="120" height="90" rx="4" fill="#ffe4ec" stroke="#ffd1dc" strokeWidth="2" />
      <rect x="85" y="120" width="30" height="50" rx="4" fill="#ff6b8a" />
      <rect x="50" y="95" width="35" height="30" rx="4" fill="#74b9ff" stroke="#0984e3" strokeWidth="1" />
      <rect x="115" y="95" width="35" height="30" rx="4" fill="#74b9ff" stroke="#0984e3" strokeWidth="1" />
      <rect x="130" y="30" width="15" height="30" rx="2" fill="#ffd1dc" />
      <circle cx="94" cy="145" r="3" fill="#fdcb6e" />
    </svg>
  );
}

function CakeSVG() {
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full">
      <ellipse cx="100" cy="140" rx="80" ry="20" fill="#ffd1dc" />
      <rect x="20" y="100" width="160" height="40" rx="8" fill="#ffe4ec" stroke="#ffd1dc" strokeWidth="2" />
      <ellipse cx="100" cy="100" rx="80" ry="15" fill="#ffb6c1" />
      <rect x="40" y="65" width="120" height="35" rx="8" fill="#fff0f5" stroke="#ffb6c1" strokeWidth="2" />
      <ellipse cx="100" cy="65" rx="60" ry="12" fill="#ffd1dc" />
      <rect x="70" y="45" width="8" height="25" rx="2" fill="#ff8fab" />
      <rect x="95" y="40" width="8" height="30" rx="2" fill="#74b9ff" />
      <rect x="120" y="45" width="8" height="25" rx="2" fill="#55efc4" />
      <ellipse cx="74" cy="42" rx="5" ry="7" fill="#ffeaa7" opacity="0.9" />
      <ellipse cx="99" cy="37" rx="5" ry="7" fill="#ffeaa7" opacity="0.9" />
      <ellipse cx="124" cy="42" rx="5" ry="7" fill="#ffeaa7" opacity="0.9" />
    </svg>
  );
}

function CarSVG() {
  return (
    <svg viewBox="0 0 220 140" className="w-full h-full">
      <rect x="30" y="55" width="160" height="50" rx="12" fill="#74b9ff" stroke="#0984e3" strokeWidth="2" />
      <path d="M60,55 Q65,25 110,25 Q155,25 160,55" fill="#0984e3" />
      <rect x="70" y="30" width="35" height="25" rx="3" fill="#b6e5ff" opacity="0.8" />
      <rect x="115" y="30" width="35" height="25" rx="3" fill="#b6e5ff" opacity="0.8" />
      <circle cx="65" cy="105" r="15" fill="#2d1b26" />
      <circle cx="65" cy="105" r="8" fill="#666" />
      <circle cx="155" cy="105" r="15" fill="#2d1b26" />
      <circle cx="155" cy="105" r="8" fill="#666" />
      <rect x="170" y="62" width="20" height="10" rx="3" fill="#ff7675" />
      <rect x="30" y="65" width="15" height="8" rx="3" fill="#ffeaa7" />
      <text x="95" y="78" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">BMW</text>
    </svg>
  );
}

function PuppySVG() {
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full">
      <ellipse cx="100" cy="100" rx="55" ry="60" fill="#ffd1dc" stroke="#ffb6c1" strokeWidth="2" />
      <circle cx="100" cy="80" r="40" fill="#ffe4ec" stroke="#ffd1dc" strokeWidth="2" />
      <ellipse cx="70" cy="55" rx="15" ry="22" fill="#ffb6c1" transform="rotate(-15,70,55)" />
      <ellipse cx="130" cy="55" rx="15" ry="22" fill="#ffb6c1" transform="rotate(15,130,55)" />
      <circle cx="85" cy="78" r="5" fill="#2d1b26" />
      <circle cx="115" cy="78" r="5" fill="#2d1b26" />
      <circle cx="86" cy="76" r="1.5" fill="white" />
      <circle cx="116" cy="76" r="1.5" fill="white" />
      <ellipse cx="100" cy="90" rx="6" ry="4" fill="#2d1b26" />
      <path d="M94,95 Q100,102 106,95" fill="none" stroke="#ff6b8a" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="60" cy="140" rx="12" ry="18" fill="#ffd1dc" />
      <ellipse cx="140" cy="140" rx="12" ry="18" fill="#ffd1dc" />
    </svg>
  );
}

function AirplaneSVG() {
  return (
    <svg viewBox="0 0 220 160" className="w-full h-full">
      <ellipse cx="110" cy="80" rx="80" ry="22" fill="#a29bfe" stroke="#6c5ce7" strokeWidth="2" />
      <ellipse cx="50" cy="80" rx="15" ry="12" fill="#6c5ce7" />
      <polygon points="110,30 80,80 140,80" fill="#dfe6e9" stroke="#b2bec3" strokeWidth="1" />
      <polygon points="40,65 20,45 40,80" fill="#a29bfe" />
      <polygon points="40,95 20,115 40,80" fill="#a29bfe" />
      <polygon points="155,70 175,55 155,80" fill="#a29bfe" />
      <polygon points="155,90 175,105 155,80" fill="#a29bfe" />
      <rect x="60" y="68" width="8" height="10" rx="2" fill="#74b9ff" opacity="0.7" />
      <rect x="75" y="68" width="8" height="10" rx="2" fill="#74b9ff" opacity="0.7" />
      <rect x="90" y="68" width="8" height="10" rx="2" fill="#74b9ff" opacity="0.7" />
      <rect x="105" y="68" width="8" height="10" rx="2" fill="#74b9ff" opacity="0.7" />
      <rect x="120" y="68" width="8" height="10" rx="2" fill="#74b9ff" opacity="0.7" />
    </svg>
  );
}

const SVG_MAP: Record<number, () => React.ReactNode> = {
  1: HouseSVG,
  2: CakeSVG,
  3: CarSVG,
  4: PuppySVG,
  5: AirplaneSVG,
};

export default function PuzzleObject({
  levelId,
  bolts,
  remainingBolts,
  onBoltTap,
  removingBoltId,
  returningBoltId,
  completed,
}: PuzzleObjectProps) {
  const SVGComponent = SVG_MAP[levelId] ?? HouseSVG;

  return (
    <div
      className={`relative w-full max-w-[320px] mx-auto aspect-[4/3] ${
        completed ? "animate-object-complete" : ""
      }`}
      style={{
        transform: completed ? undefined : "perspective(600px) rotateX(12deg) rotateY(-8deg)",
        transformStyle: "preserve-3d",
      }}
    >
      <div className="absolute inset-0 bg-white/40 rounded-[20px] shadow-lg backdrop-blur-sm border border-pink-100/40">
        <SVGComponent />
      </div>

      {bolts
        .filter((b) => remainingBolts.some((r) => r.id === b.id))
        .map((bolt) => (
          <ScrewBolt
            key={bolt.id}
            bolt={bolt}
            remainingBolts={remainingBolts}
            onTap={onBoltTap}
            removing={removingBoltId === bolt.id}
            returning={returningBoltId === bolt.id}
          />
        ))}
    </div>
  );
}
