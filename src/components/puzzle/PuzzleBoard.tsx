"use client";

import { useState, useCallback, useMemo } from "react";
import { Bolt, createSlots, addBoltToSlot, isLevelComplete, calculateStars, SlotState } from "@/lib/puzzle-logic";
import { PuzzleLevel } from "@/lib/puzzle-levels";
import PuzzleObject from "./PuzzleObject";
import SlotHolder from "./SlotHolder";
import LivesDisplay from "./LivesDisplay";
import WordModal from "./WordModal";
import PuzzleQuiz from "./PuzzleQuiz";
import LevelComplete from "./LevelComplete";

type Phase = "playing" | "word-question" | "rescue-quiz" | "level-complete";

const MAX_LIVES = 3;

interface PuzzleBoardProps {
  level: PuzzleLevel;
  onComplete: (stars: number, livesLeft: number, words: string[]) => void;
  onMenu: () => void;
  onNext: () => void;
}

export default function PuzzleBoard({ level, onComplete, onMenu, onNext }: PuzzleBoardProps) {
  const [remainingBolts, setRemainingBolts] = useState<Bolt[]>(() => [...level.bolts]);
  const [slots, setSlots] = useState<SlotState[]>(() =>
    createSlots(level.colors, level.slotsPerColor)
  );
  const [lives, setLives] = useState(MAX_LIVES);
  const [selectedBolt, setSelectedBolt] = useState<Bolt | null>(null);
  const [phase, setPhase] = useState<Phase>("playing");
  const [removingBoltId, setRemovingBoltId] = useState<string | null>(null);
  const [returningBoltId, setReturningBoltId] = useState<string | null>(null);
  const [landingSlot, setLandingSlot] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const handleBoltTap = useCallback(
    (bolt: Bolt) => {
      if (phase !== "playing") return;
      setSelectedBolt(bolt);
      setPhase("word-question");
    },
    [phase]
  );

  const handleCorrectAnswer = useCallback(() => {
    if (!selectedBolt) return;
    const bolt = selectedBolt;

    setRemovingBoltId(bolt.id);
    setPhase("playing");
    setSelectedBolt(null);
    setScore((s) => s + 10);

    setTimeout(() => {
      setRemovingBoltId(null);
      const newBolts = remainingBolts.filter((b) => b.id !== bolt.id);
      setRemainingBolts(newBolts);

      setLandingSlot(bolt.color);
      const newSlots = addBoltToSlot(slots, bolt.id, bolt.color);
      setSlots(newSlots);

      setTimeout(() => {
        setLandingSlot(null);
        if (isLevelComplete(newSlots)) {
          const stars = calculateStars(lives, MAX_LIVES);
          const words = level.bolts.map((b) => b.word.german);
          onComplete(stars, lives, words);
          setPhase("level-complete");
        }
      }, 500);
    }, 600);
  }, [selectedBolt, remainingBolts, slots, lives, level, onComplete]);

  const handleWrongAnswer = useCallback(() => {
    if (!selectedBolt) return;
    const newLives = lives - 1;
    setLives(newLives);
    setReturningBoltId(selectedBolt.id);
    setSelectedBolt(null);

    setTimeout(() => {
      setReturningBoltId(null);
      if (newLives <= 0) {
        setPhase("rescue-quiz");
      } else {
        setPhase("playing");
      }
    }, 400);
  }, [selectedBolt, lives]);

  const handleRescuePass = useCallback(() => {
    setLives(MAX_LIVES);
    setPhase("playing");
  }, []);

  const handleRescueFail = useCallback(() => {
    onMenu();
  }, [onMenu]);

  const stars = useMemo(() => calculateStars(lives, MAX_LIVES), [lives]);
  const progress = useMemo(
    () => Math.round(((level.bolts.length - remainingBolts.length) / level.bolts.length) * 100),
    [level.bolts.length, remainingBolts.length]
  );

  if (phase === "level-complete") {
    return (
      <LevelComplete
        level={level}
        stars={stars}
        wordsLearned={level.bolts}
        onNext={onNext}
        onMenu={onMenu}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-pink-50 to-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={onMenu}
          className="text-sm text-[#9b7080] font-medium active:scale-95 transition-transform"
        >
          ← Назад
        </button>
        <div className="text-center">
          <h2 className="font-display font-bold text-sm text-[#2d1b26]">
            {level.objectEmoji} {level.name}
          </h2>
          <div className="flex items-center gap-2 justify-center mt-0.5">
            <span className="text-[10px] text-[#9b7080]">Очки: {score}</span>
            <span className="text-[10px] text-[#9b7080]">·</span>
            <span className="text-[10px] text-[#9b7080]">{progress}%</span>
          </div>
        </div>
        <LivesDisplay lives={lives} maxLives={MAX_LIVES} />
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-3">
        <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Slots */}
      <SlotHolder slots={slots} landingSlot={landingSlot} />

      {/* Object area */}
      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <PuzzleObject
          levelId={level.id}
          bolts={level.bolts}
          remainingBolts={remainingBolts}
          onBoltTap={handleBoltTap}
          removingBoltId={removingBoltId}
          returningBoltId={returningBoltId}
        />
      </div>

      {/* Bottom hint */}
      <div className="text-center pb-6 px-4">
        <p className="text-xs text-[#9b7080]">
          Нажми на доступный болтик 🔩 чтобы открутить
        </p>
      </div>

      {/* Word question modal */}
      {phase === "word-question" && selectedBolt && (
        <WordModal
          bolt={selectedBolt}
          onCorrect={handleCorrectAnswer}
          onWrong={handleWrongAnswer}
        />
      )}

      {/* Rescue quiz */}
      {phase === "rescue-quiz" && (
        <PuzzleQuiz
          title="😔 Ой! Закончились жизни"
          subtitle="Пройди мини-квиз чтобы получить жизни обратно! 💕"
          questionCount={3}
          requiredCorrect={2}
          onPass={handleRescuePass}
          onFail={handleRescueFail}
        />
      )}
    </div>
  );
}
