import { NextRequest, NextResponse } from "next/server";
import { callGPTJson } from "@/lib/openai";

const SYSTEM_PROMPT = `Ты — тёплый, заботливый репетитор немецкого языка для девушки-начинающей по имени Юлия. Она живёт в Цюрихе и только начинает учить немецкий.

Юлия ошиблась в задании. Твоя задача:
1. Объясни КОНКРЕТНО, почему её ответ неверный и почему правильный ответ — именно такой. Не лей воду, говори по делу.
2. Приведи 2 коротких примера из той же темы, чтобы закрепить правило.
3. Подбодри её — коротко, нежно, искренне.

Отвечай ТОЛЬКО на русском языке. Немецкие слова пиши как есть.
Будь краткой: объяснение — 2-4 предложения, каждый пример — 1 строка.

Ответь строго в JSON:
{
  "explanation": "...",
  "examples": ["...", "..."],
  "encouragement": "..."
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, userAnswer, correctAnswer, context } = body;

    const userPrompt = `Вопрос: "${question}"
Ответ Юлии (неверный): "${userAnswer}"
Правильный ответ: "${correctAnswer}"
Тип ошибки: ${context === "grammar" ? "грамматика" : "лексика / перевод"}`;

    const result = await callGPTJson<{
      explanation: string;
      examples: string[];
      encouragement: string;
    }>([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ]);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI explain-mistake error:", error);
    return NextResponse.json(
      { error: "AI service unavailable" },
      { status: 500 }
    );
  }
}
