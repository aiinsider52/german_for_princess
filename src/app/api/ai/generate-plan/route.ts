import { NextRequest, NextResponse } from "next/server";
import { callGPTJson, GPTMessage } from "@/lib/openai";
import { DayPlan } from "@/lib/types";

const GOAL_DESCRIPTIONS: Record<string, string> = {
  switzerland: "Жизнь в Швейцарии (Арбон, Тургау). Используй швейцарские реалии: Migros, Coop, SBB, Gemeinde, Grüezi, Merci vielmal. Фокус на практических ситуациях: магазин, врач, аренда, транспорт, соседи.",
  work: "Работа в немецкоязычной среде. Деловая лексика: встречи, email, телефонные звонки, коллеги, отчёты. Формальный регистр (Sie-форма).",
  travel: "Путешествия по немецкоязычным странам. Транспорт, гостиница, ресторан, достопримечательности, навигация, экстренные ситуации.",
  fun: "Общение и хобби. Разговоры о музыке, фильмах, спорте, еде, друзьях. Неформальный регистр (du-форма), сленг и повседневные фразы.",
};

const MINUTES_CONFIG: Record<number, string> = {
  5: "4 новых слова, 2 фразы, 3 упражнения (1 choose + 1 fill + 1 word_order), 3 вопроса теста. БЕЗ dialogueExample.",
  10: "6 новых слов, 3 фразы, 4 упражнения (1 choose + 1 fill + 1 word_order + 1 translate), 4 вопроса теста. dialogueExample с дня 3.",
  20: "8 новых слов, 5 фраз, 5 упражнений (1-2 choose + 1 fill + 1 word_order + 1 translate), 5 вопросов теста. dialogueExample с дня 2.",
};

const LEVEL_STARTS: Record<string, string> = {
  "A0": "Начни с абсолютного нуля: алфавит, Hallo/Tschüss, Ja/Nein, числа 1-10. Дни 1-3 только базовые слова.",
  "A0+": "Базовые слова уже знакомы. Начни сразу с фраз для знакомства и заказа в кафе. К дню 3 можно простую грамматику.",
  "A1-": "Есть фундамент. Начни с повторения грамматики (sein/haben/артикли) + новая лексика по теме. С дня 2 уже диалоги.",
  "A1": "Уверенный старт. Сразу вводи грамматику (падежи, модальные глаголы), сложные фразы, полноценные диалоги с дня 1.",
};

function buildSystemPrompt(): string {
  return `Ты — профессиональный методист-лингвист, создающий персональный курс немецкого языка для девушки Юлии. Она живёт в Арбоне (Швейцария, кантон Тургау).

ПРАВИЛА ГЕНЕРАЦИИ КОНТЕНТА:
1. Все объяснения, описания, контексты, подсказки — СТРОГО НА РУССКОМ языке.
2. Немецкие слова, фразы, предложения — на немецком как есть.
3. Каждое новое слово ОБЯЗАТЕЛЬНО с примером использования в предложении.
4. Грамматику объясняй просто, с конкретными примерами (не абстрактно).
5. Упражнения должны использовать ТОЛЬКО слова и фразы из ЭТОГО дня + reviewWords.
6. Тест в конце дня должен проверять именно материал дня.
7. В reviewWords включай 2-3 слова из предыдущих дней для закрепления (spaced repetition).
8. Прогрессия сложности: каждый день чуть сложнее предыдущего.
9. День 7 — лёгкий обзорный день (повторение дней 1-6).
10. День 14 — финальный обзор всего курса.

ТИПЫ УПРАЖНЕНИЙ (exercises):
- "choose": { type: "choose", question: "текст вопроса", options: ["A", "B", "C", "D"], correctIndex: 0-3 }
- "fill": { type: "fill", sentence: "Ich ___ Julia.", correctAnswer: "heiße", hint: "подсказка" }
- "word_order": { type: "word_order", question: "Составь предложение:", words: ["Kaffee", "einen", "möchte", "Ich"], correctOrder: "Ich möchte einen Kaffee" }
- "translate": { type: "translate", phrase: "Доброе утро", correctAnswer: "Guten Morgen", acceptableAnswers: ["Guten morgen"] }

ФОРМАТ dialogueExample:
{ title: "В кафе", lines: [{ speaker: "Kellner", german: "Was darf es sein?", russian: "Что желаете?" }, ...] }

ФОРМАТ ОТВЕТА — строго JSON массив DayPlan[]:
[
  {
    "day": 1,
    "title": "...",
    "description": "...",
    "grammarTopic": "тема грамматики" или null,
    "grammarExplanation": "объяснение на русском" или null,
    "reviewWords": [{ "german": "...", "russian": "...", "example": "..." }] или [],
    "words": [{ "german": "...", "russian": "...", "example": "..." }],
    "phrases": [{ "german": "...", "russian": "...", "context": "..." }],
    "exercises": [ ... ],
    "test": [{ "question": "...", "options": ["A", "B", "C"], "correctIndex": 0 }],
    "dialogueExample": { ... } или null
  }
]

КРИТИЧЕСКИ ВАЖНО:
- correctIndex в choose/test ДОЛЖЕН соответствовать правильному варианту в options (индекс от 0).
- correctAnswer в fill/translate ДОЛЖЕН быть точно правильным немецким словом/фразой.
- correctOrder в word_order ДОЛЖЕН быть грамматически правильным немецким предложением.
- words[] в word_order — перемешанные слова из correctOrder.
- НЕ повторяй одни и те же слова в разные дни (кроме reviewWords).
- Верни ТОЛЬКО JSON массив, без markdown, без комментариев.`;
}

function buildUserPrompt(
  daysRange: string,
  assessedLevel: string,
  goal: string,
  minutesPerDay: number,
  previousDaysSummary?: string
): string {
  const goalDesc = GOAL_DESCRIPTIONS[goal] || GOAL_DESCRIPTIONS.switzerland;
  const minutesDesc = MINUTES_CONFIG[minutesPerDay] || MINUTES_CONFIG[10];
  const levelStart = LEVEL_STARTS[assessedLevel] || LEVEL_STARTS["A0"];

  let prompt = `Сгенерируй дни ${daysRange} из 14-дневного курса немецкого языка.

ПРОФИЛЬ УЧЕНИЦЫ:
- Оценённый уровень: ${assessedLevel}
- Цель: ${goalDesc}
- Время в день: ${minutesPerDay} минут

СТАРТОВАЯ ТОЧКА: ${levelStart}

ОБЪЁМ КОНТЕНТА НА ДЕНЬ: ${minutesDesc}

ПРОГРЕССИЯ ТЕМ:
- Дни 1-3: Фундамент (приветствия, знакомство, числа, sein/haben)
- Дни 4-6: Построение (еда/покупки/транспорт + спряжение глаголов)
- День 7: Лёгкий обзорный день (повторение дней 1-6)
- Дни 8-10: Практика по цели (${goal === "switzerland" ? "швейцарские реалии" : goal === "work" ? "деловой немецкий" : goal === "travel" ? "путешествия" : "хобби и общение"})
- Дни 11-13: Углубление (модальные глаголы, сложные фразы, диалоги)
- День 14: Финальный обзор + праздник`;

  if (previousDaysSummary) {
    prompt += `\n\nСЛОВА И ТЕМЫ ДНЕЙ 1-7 (для reviewWords и непрерывности):\n${previousDaysSummary}`;
  }

  prompt += "\n\nВерни строго JSON массив DayPlan[].";
  return prompt;
}

function summarizeDays(days: DayPlan[]): string {
  return days.map((d) => {
    const wordList = d.words.map((w) => `${w.german} (${w.russian})`).join(", ");
    return `День ${d.day} "${d.title}": ${wordList}. Грамматика: ${d.grammarTopic || "нет"}.`;
  }).join("\n");
}

interface GeneratePlanRequest {
  assessedLevel: string;
  goal: string;
  minutesPerDay: number;
  assessmentDetails?: { questionId: string; correct: boolean }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePlanRequest = await request.json();
    const { assessedLevel, goal, minutesPerDay } = body;

    const systemPrompt = buildSystemPrompt();

    // Call 1: Days 1-7
    const messages1: GPTMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: buildUserPrompt("1-7", assessedLevel, goal, minutesPerDay) },
    ];

    const days1_7 = await callGPTJson<DayPlan[]>(messages1, {
      temperature: 0.75,
      maxTokens: 4000,
    });

    if (!Array.isArray(days1_7) || days1_7.length === 0) {
      throw new Error("Invalid days 1-7 response");
    }

    // Call 2: Days 8-14 with summary of days 1-7
    const summary = summarizeDays(days1_7);
    const messages2: GPTMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: buildUserPrompt("8-14", assessedLevel, goal, minutesPerDay, summary) },
    ];

    const days8_14 = await callGPTJson<DayPlan[]>(messages2, {
      temperature: 0.75,
      maxTokens: 4000,
    });

    if (!Array.isArray(days8_14) || days8_14.length === 0) {
      throw new Error("Invalid days 8-14 response");
    }

    const allDays = [...days1_7, ...days8_14].map((d, i) => ({
      ...d,
      day: i + 1,
      exercises: d.exercises || [],
      test: d.test || [],
      words: d.words || [],
      phrases: d.phrases || [],
    }));

    return NextResponse.json({ days: allDays });
  } catch (error) {
    console.error("AI generate-plan error:", error);
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}
