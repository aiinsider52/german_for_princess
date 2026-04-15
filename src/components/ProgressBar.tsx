"use client";

interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max,
  showLabel = true,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-pink-400 mb-2">
          <span>
            {value} из {max}
          </span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="h-3 bg-pink-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-300 to-pink-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
