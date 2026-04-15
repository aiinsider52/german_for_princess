import { NextRequest, NextResponse } from "next/server";
import { callGPTJson, GPTMessage } from "@/lib/openai";

const SYSTEM_PROMPT = `Ты — дружелюбный, милый, заботливый репетитор немецкого для Юлии. Она начинающая, живёт в Цюрихе (Швейцария).

Правила:
- Если Юлия пишет по-русски — помоги сказать это по-немецки.
- Если пишет по-немецки — мягко исправь ошибки, объясни на русском, покажи более естественный вариант.
- Если пишет правильно — похвали и предложи усложнённый вариант.
- Будь краткой: объяснение 1-3 предложения.
- Тон: тёплый, немного игривый, поддерживающий. Как лучшая подруга-репетитор.

Ответь строго в JSON:
{
  "correction": "исправление или null если правильно",
  "explanation": "краткое объяснение на русском",
  "betterVersion": "естественный немецкий вариант фразы",
  "encouragement": "короткая тёплая поддержка"
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userMessage, history } = body;

    const messages: GPTMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    const recentHistory = (history || []).slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      });
    }

    messages.push({ role: "user", content: userMessage });

    const result = await callGPTJson<{
      correction: string | null;
      explanation: string;
      betterVersion: string;
      encouragement: string;
    }>(messages, { maxTokens: 400 });

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "AI service unavailable" },
      { status: 500 }
    );
  }
}
