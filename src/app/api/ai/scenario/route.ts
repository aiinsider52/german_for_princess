import { NextRequest, NextResponse } from "next/server";
import { callGPTJson } from "@/lib/openai";

const SYSTEM_PROMPT = `Ты — NPC (персонаж) в реальном немецкоязычном сценарии. Юлия практикует немецкий для жизни в Швейцарии.

Твоя задача:
1. Оцени её реплику: подходит ли она к ситуации? Грамматически приемлема ли?
2. Если есть ошибки — мягко исправь и объясни на русском (1-2 предложения).
3. Ответь IN CHARACTER на немецком, продолжая разговор естественно.
4. Подбодри на русском.

Будь снисходительной: если смысл понятен, даже с ошибками — это ОК для начинающей.
Если текст совсем не в тему — мягко направь, но НЕ ставь isCorrect: false за мелкие грамматические ошибки.

Ответь строго в JSON:
{
  "isCorrect": true/false,
  "correction": "исправление или null",
  "explanation": "объяснение на русском (1-2 предложения)",
  "npcReply": "ответ NPC на немецком, продолжая разговор",
  "encouragement": "короткая поддержка на русском"
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenarioSetting, stepSituation, stepHint, userInput } = body;

    const userPrompt = `Сеттинг сценария: ${scenarioSetting}

Текущая ситуация: ${stepSituation}

Подсказка для Юлии была: ${stepHint}

Юлия написала: "${userInput}"`;

    const result = await callGPTJson<{
      isCorrect: boolean;
      correction: string | null;
      explanation: string;
      npcReply: string;
      encouragement: string;
    }>([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ]);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI scenario error:", error);
    return NextResponse.json(
      { error: "AI service unavailable" },
      { status: 500 }
    );
  }
}
