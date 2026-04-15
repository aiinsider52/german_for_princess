import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

export interface GPTMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callGPT(
  messages: GPTMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: options?.temperature ?? 0.8,
    max_tokens: options?.maxTokens ?? 500,
  });
  return response.choices[0]?.message?.content ?? "";
}

export async function callGPTJson<T>(
  messages: GPTMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<T> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 600,
    response_format: { type: "json_object" },
  });
  const text = response.choices[0]?.message?.content ?? "{}";
  return JSON.parse(text) as T;
}
