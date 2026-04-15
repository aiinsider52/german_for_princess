import { QuizQuestion } from "./types";
import { quizQuestions } from "./quiz-bank";

function seededShuffle<T>(arr: T[], seed: string): T[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    hash = ((hash << 5) - hash) + i;
    hash |= 0;
    const j = Math.abs(hash) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getDailyQuizQuestions(completedDays: number[]): QuizQuestion[] {
  const available = quizQuestions.filter((q) =>
    completedDays.includes(q.dayId)
  );

  const pool = available.length >= 5 ? available : quizQuestions.slice(0, 16);
  const seed = new Date().toDateString();
  return seededShuffle(pool, seed).slice(0, 5);
}

export function canPlayQuizToday(lastPlayedDate: string | null): boolean {
  if (!lastPlayedDate) return true;
  const today = new Date().toISOString().split("T")[0];
  return lastPlayedDate !== today;
}

export function getNextQuizTime(): Date {
  const now = new Date();
  const next = new Date(now);
  next.setDate(next.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  return next;
}
