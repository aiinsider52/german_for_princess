import { DiagnosticQuestion, AssessmentResult, AssessedLevel } from "./types";

export const diagnosticQuestions: DiagnosticQuestion[] = [
  // ─── Level 0: Zero knowledge (Q1-Q3) ─────────────────────
  {
    id: "q1",
    difficulty: "zero",
    question: "Как сказать «Привет» по-немецки?",
    options: ["Bonjour", "Hallo", "Hello", "Ciao"],
    correctIndex: 1,
  },
  {
    id: "q2",
    difficulty: "zero",
    question: "Что значит «Danke»?",
    options: ["Пожалуйста", "Извините", "Спасибо", "Привет"],
    correctIndex: 2,
  },
  {
    id: "q3",
    difficulty: "zero",
    question: "Как по-немецки «Да»?",
    options: ["Da", "Ja", "Si", "Oui"],
    correctIndex: 1,
  },

  // ─── Level 1: Basic words (Q4-Q6) ────────────────────────
  {
    id: "q4",
    difficulty: "basic",
    question: "Что значит «Ich heiße Julia»?",
    options: ["Я люблю Юлию", "Меня зовут Юлия", "Я ищу Юлию"],
    correctIndex: 1,
  },
  {
    id: "q5",
    difficulty: "basic",
    question: "«Guten Morgen» говорят...",
    options: ["Вечером", "Утром", "Ночью"],
    correctIndex: 1,
  },
  {
    id: "q6",
    difficulty: "basic",
    question: "Как попросить счёт в ресторане?",
    options: ["Die Rechnung, bitte", "Das Essen, bitte", "Der Tisch, bitte"],
    correctIndex: 0,
  },

  // ─── Level 2: Basic grammar (Q7-Q9) ──────────────────────
  {
    id: "q7",
    difficulty: "grammar",
    question: "Ich ___ Studentin.",
    options: ["bist", "bin", "ist", "sind"],
    correctIndex: 1,
  },
  {
    id: "q8",
    difficulty: "grammar",
    question: "Wir ___ nach Zürich.",
    options: ["fährt", "fahren", "fahrt", "fährst"],
    correctIndex: 1,
  },
  {
    id: "q9",
    difficulty: "grammar",
    question: "Das ist ___ Buch.",
    options: ["eine", "ein", "einen", "einem"],
    correctIndex: 1,
  },

  // ─── Level 3: Phrases/comprehension (Q10-Q12) ────────────
  {
    id: "q10",
    difficulty: "phrases",
    question: "«Wie spät ist es?» означает...",
    options: ["Как дела?", "Который час?", "Как тебя зовут?"],
    correctIndex: 1,
  },
  {
    id: "q11",
    difficulty: "phrases",
    question: "Ich möchte einen Kaffee ___.",
    options: ["bestellt", "bestellen", "bestellst"],
    correctIndex: 1,
  },
  {
    id: "q12",
    difficulty: "phrases",
    question: "Entschuldigung, wo ist ___ Bahnhof?",
    options: ["die", "das", "der", "den"],
    correctIndex: 2,
  },
];

export function assessLevel(answers: boolean[]): AssessmentResult {
  const score = answers.filter(Boolean).length;
  const total = diagnosticQuestions.length;

  const details = diagnosticQuestions.map((q, i) => ({
    questionId: q.id,
    correct: answers[i] ?? false,
  }));

  let level: AssessedLevel;
  if (score <= 3) {
    level = "A0";
  } else if (score <= 6) {
    level = "A0+";
  } else if (score <= 9) {
    level = "A1-";
  } else {
    level = "A1";
  }

  return { score, total, level, details };
}

export const levelLabels: Record<AssessedLevel, { title: string; description: string }> = {
  "A0": {
    title: "Абсолютный новичок",
    description: "Начнём с самых основ — алфавит, первые слова, приветствия. Каждый день будет маленький шаг вперёд!",
  },
  "A0+": {
    title: "Знаешь основы",
    description: "Ты уже знаешь базовые слова! Сфокусируемся на фразах, простой грамматике и практике.",
  },
  "A1-": {
    title: "Есть фундамент",
    description: "У тебя хорошая база! Углубим грамматику, расширим словарный запас и добавим диалоги.",
  },
  "A1": {
    title: "Уверенный старт",
    description: "Отличный уровень! Сосредоточимся на сложной грамматике, реальных ситуациях и свободном общении.",
  },
};
