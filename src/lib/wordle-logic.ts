import { WordleWord, WordleGuessResult } from "./types";
import { wordleWords } from "./wordle-words";

export function getCurrentWordleIndex(): number {
  const now = new Date();
  const periodIndex = Math.floor(now.getHours() / 6);
  const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  return (daysSinceEpoch * 4 + periodIndex) % wordleWords.length;
}

export function getCurrentWordleWord(): WordleWord {
  return wordleWords[getCurrentWordleIndex()];
}

export function getNextWordleTime(): Date {
  const now = new Date();
  const nextPeriod = (Math.floor(now.getHours() / 6) + 1) * 6;
  const next = new Date(now);
  if (nextPeriod >= 24) {
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
  } else {
    next.setHours(nextPeriod, 0, 0, 0);
  }
  return next;
}

export function evaluateGuess(guess: string, answer: string): WordleGuessResult[] {
  const guessArr = guess.toUpperCase().split("");
  const answerArr = answer.toUpperCase().split("");
  const result: WordleGuessResult[] = guessArr.map((letter) => ({
    letter,
    status: "absent" as const,
  }));

  const answerUsed = new Array(5).fill(false);
  const guessUsed = new Array(5).fill(false);

  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i].status = "correct";
      answerUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < 5; j++) {
      if (answerUsed[j]) continue;
      if (guessArr[i] === answerArr[j]) {
        result[i].status = "present";
        answerUsed[j] = true;
        break;
      }
    }
  }

  return result;
}

export function isValidWord(word: string): boolean {
  return word.length === 5 && /^[A-ZÄÖÜß]+$/i.test(word);
}

export function generateShareText(
  word: WordleWord,
  guesses: string[],
  answer: string,
  won: boolean
): string {
  const now = new Date();
  const time = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("ru-RU");
  const attempts = won ? `${guesses.length}/6` : "X/6";

  const grid = guesses
    .map((g) => {
      const result = evaluateGuess(g, answer);
      return result
        .map((r) =>
          r.status === "correct" ? "🟩" : r.status === "present" ? "🟨" : "⬜"
        )
        .join("");
    })
    .join("\n");

  return `🇩🇪 Немецкий Вордли — ${date} (${time})\n\n${word.word} ${attempts}\n\n${grid}\n\nЮлия учит немецкий 💕`;
}

export function generateTelegramMessage(
  guesses: string[],
  answer: string
): string {
  const results = guesses.map((g) => evaluateGuess(g, answer));
  const correctLetters: (string | null)[] = [null, null, null, null, null];
  const presentLetters = new Set<string>();
  const absentLetters = new Set<string>();

  for (const result of results) {
    result.forEach((r, i) => {
      if (r.status === "correct") correctLetters[i] = r.letter;
      else if (r.status === "present") presentLetters.add(r.letter);
      else absentLetters.add(r.letter);
    });
  }

  for (const c of correctLetters) {
    if (c) {
      presentLetters.delete(c);
      absentLetters.delete(c);
    }
  }
  for (const p of presentLetters) absentLetters.delete(p);

  const posInfo = correctLetters
    .map((l, i) => (l ? `Позиция ${i + 1}: ${l}` : null))
    .filter(Boolean)
    .join("\n");

  const attempts = guesses.length;

  return [
    "🇩🇪 Юлия играет в Немецкий Вордли и просит помощи! 💕",
    "",
    `📊 Прогресс: ${attempts} попыток из 6`,
    "",
    "✅ Буквы на правильном месте:",
    posInfo || "Пока не определены",
    "",
    "🟡 Буквы в слове (не на своём месте):",
    presentLetters.size > 0 ? [...presentLetters].join(", ") : "Нет",
    "",
    "❌ Букв НЕТ в слове:",
    absentLetters.size > 0 ? [...absentLetters].join(", ") : "Нет",
    "",
    "🎯 Попытки:",
    ...guesses.map((g, i) => `${i + 1}. ${g}`),
    "",
    "Помоги угадать! 🧩",
  ].join("\n");
}
