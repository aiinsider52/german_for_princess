"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppState, QuizQuestion, Surprise } from "@/lib/types";
import { loadState, saveQuizResult } from "@/lib/store";
import { getDailyQuizQuestions, canPlayQuizToday, getNextQuizTime } from "@/lib/quiz-logic";
import { getSurpriseForScore } from "@/lib/surprises";
import QuizQuestionCard from "@/components/QuizQuestion";
import QuizResult from "@/components/QuizResult";
import SurpriseScreen from "@/components/SurpriseScreen";

type Phase = "loading" | "intro" | "playing" | "result" | "surprise" | "already-played";

export default function QuizPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [surprise, setSurprise] = useState<Surprise | null>(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const loaded = loadState();
    if (!loaded.onboardingComplete) {
      router.replace("/onboarding");
      return;
    }
    setState(loaded);

    if (!canPlayQuizToday(loaded.quiz.lastPlayedDate)) {
      setPhase("already-played");
    } else {
      const qs = getDailyQuizQuestions(loaded.completedDays);
      setQuestions(qs);
      setPhase("intro");
    }
  }, [router]);

  useEffect(() => {
    if (phase !== "already-played") return;
    function tick() {
      const next = getNextQuizTime();
      const diff = next.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown("Доступен!");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    const next = currentQ + 1;
    if (next >= questions.length) {
      const finalScore = correct ? score + 1 : score;
      const s = getSurpriseForScore(finalScore);
      setSurprise(s);
      if (state) {
        const newState = saveQuizResult(state, finalScore, s?.id ?? null);
        setState(newState);
      }
      setPhase("result");
    } else {
      setTimeout(() => setCurrentQ(next), 100);
    }
  };

  if (phase === "loading" || !state) {
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
            Квиз дня 🌸
          </h1>
          <div className="flex items-center gap-1 text-sm">
            <span>🔥</span>
            <span className="font-bold text-orange-500">{state.streak}</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {phase === "intro" && (
          <div className="text-center space-y-6 animate-scale-in">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-display font-bold text-[#2d1b26]">
              Ежедневный квиз
            </h2>
            <p className="text-[#9b7080]">
              5 вопросов на немецком. Ответь правильно — получи сюрприз! 🎁
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/70 rounded-[16px] p-3 border border-pink-100">
                <p className="text-2xl">5</p>
                <p className="text-[10px] text-[#9b7080]">вопросов</p>
              </div>
              <div className="bg-white/70 rounded-[16px] p-3 border border-pink-100">
                <p className="text-2xl">1×</p>
                <p className="text-[10px] text-[#9b7080]">в день</p>
              </div>
              <div className="bg-white/70 rounded-[16px] p-3 border border-pink-100">
                <p className="text-2xl">🎁</p>
                <p className="text-[10px] text-[#9b7080]">сюрприз</p>
              </div>
            </div>
            <button
              onClick={() => setPhase("playing")}
              className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white py-4 px-6 rounded-[50px] font-semibold text-base shadow-[0_6px_25px_rgba(255,107,138,0.35)] cursor-pointer transition-all active:scale-95 animate-continue-pulse"
            >
              Начать квиз! 💕
            </button>
          </div>
        )}

        {phase === "playing" && questions[currentQ] && (
          <QuizQuestionCard
            key={currentQ}
            question={questions[currentQ]}
            questionIndex={currentQ}
            total={questions.length}
            onAnswer={handleAnswer}
          />
        )}

        {phase === "result" && (
          <QuizResult
            score={score}
            total={questions.length}
            onSurprise={() => setPhase("surprise")}
            onBack={() => router.push("/dashboard")}
          />
        )}

        {phase === "surprise" && surprise && (
          <SurpriseScreen
            surprise={surprise}
            onClose={() => router.push("/dashboard")}
          />
        )}

        {phase === "already-played" && (
          <div className="text-center space-y-6 animate-scale-in pt-8">
            <div className="text-6xl">✅</div>
            <h2 className="text-2xl font-display font-bold text-[#2d1b26]">
              Ты уже молодец сегодня!
            </h2>
            <p className="text-[#9b7080]">
              Квиз пройден. Возвращайся завтра за новыми вопросами! 💕
            </p>

            {state.quiz.lastScore !== null && (
              <div className="bg-white/70 rounded-[20px] p-5 border border-pink-100 inline-block">
                <p className="text-sm text-[#9b7080]">Сегодняшний результат:</p>
                <p className="text-3xl font-bold font-display text-[#2d1b26] mt-1">
                  {state.quiz.lastScore}/5
                </p>
              </div>
            )}

            <div className="bg-pink-50/80 rounded-[16px] p-4 border border-pink-100">
              <p className="text-xs text-[#9b7080] mb-1">
                Следующий квиз через:
              </p>
              <p className="text-lg font-bold text-pink-500">{countdown}</p>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-[#9b7080] cursor-pointer hover:text-pink-500 transition-colors"
            >
              ← В дашборд
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
