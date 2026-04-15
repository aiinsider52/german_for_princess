import { NextRequest, NextResponse } from "next/server";
import { callGPTJson } from "@/lib/openai";

const SYSTEM_PROMPT = `Ты — заботливый персональный тьютор для Юлии, которая учит немецкий. Она только что рассказала, как себя чувствует сегодня.

Напиши тёплое, персонализированное сообщение на русском о том, как подойти к сегодняшнему занятию с учётом её настроения и прогресса.

Правила:
- 2-4 предложения, не больше.
- Будь конкретной: упоминай её день, серию, прогресс.
- Если устала/плохо — предложи лёгкий вариант, не дави.
- Если отлично — предложи амбициозный план.
- Тон: как записка от лучшей подруги, тёплая и искренняя.
- Не используй шаблонные фразы типа "не переживай", "ты молодец" — будь оригинальной.

Ответь строго в JSON:
{
  "title": "короткий заголовок с одним эмодзи",
  "message": "основной текст сообщения"
}`;

const moodLabels: Record<string, string> = {
  great: "Отлично (полна энергии)",
  good: "Хорошо (спокойное настроение)",
  tired: "Устала (мало сил)",
  bad: "Не очень (тяжёлый день)",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mood, streak, currentDay, totalDays, currentLevel, completedDaysCount } = body;

    const remaining = Math.max(totalDays - completedDaysCount, 0);

    const userPrompt = `Настроение Юлии сегодня: ${moodLabels[mood] || mood}
День обучения: ${currentDay} из ${totalDays}
Уровень: ${currentLevel}
Серия без пропусков: ${streak} дней
Пройдено дней: ${completedDaysCount}
Осталось: ${remaining}`;

    const result = await callGPTJson<{
      title: string;
      message: string;
    }>([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ], { temperature: 0.9, maxTokens: 300 });

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI mood error:", error);
    return NextResponse.json(
      { error: "AI service unavailable" },
      { status: 500 }
    );
  }
}
