"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppState, WordleWord } from "@/lib/types";
import { loadState, saveWordleState, completeWordle } from "@/lib/store";
import {
  getCurrentWordleWord,
  getCurrentWordleIndex,
  isValidWord,
} from "@/lib/wordle-logic";
import WordleBoard from "@/components/WordleBoard";
import WordleKeyboard from "@/components/WordleKeyboard";
import WordleHints from "@/components/WordleHints";
import WordleTimer from "@/components/WordleTimer";
import WordleResult from "@/components/WordleResult";

export default function WordlePage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [word, setWord] = useState<WordleWord | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [bounceRow, setBounceRow] = useState<number | null>(null);
  const [showTelegramHint, setShowTelegramHint] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    if (!loaded.onboardingComplete) {
      router.replace("/onboarding");
      return;
    }
    setState(loaded);

    const currentWord = getCurrentWordleWord();
    const currentIndex = getCurrentWordleIndex();
    setWord(currentWord);

    if (loaded.wordle.currentWordIndex === currentIndex) {
      setGuesses(loaded.wordle.currentGuesses);
      setHintsUsed(loaded.wordle.hintsUsed);
      if (loaded.wordle.gameStatus !== "playing") {
        setGameOver(true);
        setWon(loaded.wordle.gameStatus === "won");
      }
    } else {
      const fresh = {
        ...loaded.wordle,
        currentWordIndex: currentIndex,
        currentGuesses: [],
        gameStatus: "playing" as const,
        hintsUsed: 0,
      };
      const newState = saveWordleState(loaded, fresh);
      setState(newState);
    }
  }, [router]);

  const persistGuesses = useCallback(
    (newGuesses: string[], newHints: number) => {
      if (!state) return;
      const updated = {
        ...state.wordle,
        currentGuesses: newGuesses,
        hintsUsed: newHints,
        currentWordIndex: getCurrentWordleIndex(),
      };
      const newState = saveWordleState(state, updated);
      setState(newState);
    },
    [state]
  );

  const handleKey = useCallback(
    (key: string) => {
      if (gameOver || !word || !state) return;

      if (key === "Backspace") {
        setCurrentInput((prev) => prev.slice(0, -1));
        return;
      }

      if (key === "Enter") {
        if (currentInput.length !== 5) {
          setShakeRow(guesses.length);
          setTimeout(() => setShakeRow(null), 500);
          return;
        }

        if (!isValidWord(currentInput)) {
          setShakeRow(guesses.length);
          setTimeout(() => setShakeRow(null), 500);
          return;
        }

        const guess = currentInput.toUpperCase();
        const newGuesses = [...guesses, guess];
        setGuesses(newGuesses);
        setCurrentInput("");

        const isWin = guess === word.word;
        const isLoss = !isWin && newGuesses.length >= 6;

        if (isWin) {
          setBounceRow(newGuesses.length - 1);
          setTimeout(() => {
            setWon(true);
            setGameOver(true);
            const newState = completeWordle(state, true, newGuesses.length, getCurrentWordleIndex());
            setState(newState);
          }, 600);
        } else if (isLoss) {
          setTimeout(() => {
            setWon(false);
            setGameOver(true);
            const newState = completeWordle(state, false, newGuesses.length, getCurrentWordleIndex());
            setState(newState);
          }, 600);
        } else {
          persistGuesses(newGuesses, hintsUsed);
          if (newGuesses.length >= 3 && !showTelegramHint) {
            setShowTelegramHint(true);
          }
        }
        return;
      }

      if (/^[A-Za-zÄÖÜäöüß]$/.test(key) && currentInput.length < 5) {
        setCurrentInput((prev) => prev + key.toUpperCase());
      }
    },
    [gameOver, word, state, currentInput, guesses, hintsUsed, persistGuesses, showTelegramHint]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKey(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const handleHint = () => {
    const newHints = hintsUsed + 1;
    setHintsUsed(newHints);
    persistGuesses(guesses, newHints);
  };

  if (!state || !word) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-pink-400 animate-pulse-soft text-2xl">🌸</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-pink-100/60">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-[#9b7080] cursor-pointer hover:text-pink-500 transition-colors"
          >
            ← Назад
          </button>
          <h1 className="font-display font-bold text-[#2d1b26]">
            🇩🇪 Немецкий Вордли
          </h1>
          <div className="flex items-center gap-3">
            {!gameOver && <WordleHints word={word} hintsUsed={hintsUsed} onUseHint={handleHint} />}
            <WordleTimer />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {!gameOver ? (
          <>
            <WordleBoard
              guesses={guesses}
              currentInput={currentInput}
              answer={word.word}
              shakeRow={shakeRow}
              bounceRow={bounceRow}
            />

            {showTelegramHint && guesses.length >= 3 && (
              <div className="text-center animate-fade-in">
                <button
                  onClick={() => {
                    const { generateTelegramMessage } = require("@/lib/wordle-logic");
                    const msg = encodeURIComponent(generateTelegramMessage(guesses, word.word));
                    window.open(`https://t.me/gvertolit?text=${msg}`, "_blank");
                  }}
                  className="bg-gradient-to-r from-blue-100 to-pink-100 text-[#2d1b26] text-xs py-2 px-4 rounded-[50px] border border-pink-200 cursor-pointer transition-all hover:shadow-md active:scale-95"
                >
                  💌 Написать любимому за подсказкой
                </button>
              </div>
            )}

            <WordleKeyboard
              onKey={handleKey}
              guesses={guesses}
              answer={word.word}
              disabled={gameOver}
            />
          </>
        ) : (
          <WordleResult
            won={won}
            word={word}
            guesses={guesses}
            hintsUsed={hintsUsed}
            stats={state.wordle.stats}
            onBack={() => router.push("/dashboard")}
          />
        )}
      </main>
    </div>
  );
}
