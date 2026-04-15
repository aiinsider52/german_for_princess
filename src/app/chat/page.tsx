"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatMessage } from "@/lib/types";
import { loadState, addChatMessages, clearChatHistory } from "@/lib/store";
import { chatWithTutor } from "@/lib/ai";
import Card from "@/components/Card";

const quickButtons = [
  { label: "Проверить фразу 📝", message: "Ich möchte eine Tasse Kaffee bitte" },
  { label: "Хочу сказать по-немецки 💬", message: "Как сказать «Где находится вокзал?» по-немецки?" },
  { label: "Поздороваться 👋", message: "Hallo! Wie geht es dir?" },
  { label: "В магазине 🛒", message: "Wie viel kostet das?" },
];

const welcomeMessage: ChatMessage = {
  role: "assistant",
  content:
    "Привет, Юлия! 💕 Я твой персональный тьютор по немецкому. Напиши мне что-нибудь по-немецки или по-русски — я помогу с переводом, исправлю ошибки и подскажу, как сказать более естественно. Давай попробуем вместе! ✨",
  timestamp: 0,
};

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const state = loadState();
    if (!state.onboardingComplete) {
      router.replace("/onboarding");
      return;
    }
    if (state.chatHistory.length > 0) {
      setMessages([welcomeMessage, ...state.chatHistory]);
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.timestamp > 0)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await chatWithTutor(text.trim(), history);

      let assistantText = "";
      if (response.correction) {
        assistantText += `✏️ **Исправление:** ${response.correction}\n\n`;
      }
      assistantText += `💡 ${response.explanation}\n\n`;
      assistantText += `🇩🇪 ${response.betterVersion}\n\n`;
      assistantText += response.encouragement;

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: assistantText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      const state = loadState();
      addChatMessages(state, [userMsg, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: "Ой, что-то пошло не так 😅 Попробуй ещё раз! Я рядом ❤️",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setIsLoading(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    const state = loadState();
    clearChatHistory(state);
    setMessages([welcomeMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-pink-400 hover:text-pink-600 transition-colors cursor-pointer"
            >
              ← Назад
            </button>
            <h1 className="font-bold text-gray-800">Чат с тьютором 💬</h1>
            <button
              onClick={handleClear}
              className="text-xs text-pink-300 hover:text-pink-500 transition-colors cursor-pointer"
            >
              Очистить
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
              style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-br-md"
                    : "bg-white border border-pink-100 text-gray-700 rounded-bl-md shadow-sm"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="text-xs text-pink-400 mb-1 font-medium">
                    Тьютор 💕
                  </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-line">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white border border-pink-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="text-xs text-pink-400 mb-1 font-medium">
                  Тьютор 💕
                </div>
                <div className="flex gap-1.5 py-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-pink-300 rounded-full animate-pulse-soft"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick buttons */}
      <div className="border-t border-pink-50 bg-white/60 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 pt-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickButtons.map((btn, i) => (
              <button
                key={i}
                onClick={() => sendMessage(btn.message)}
                disabled={isLoading}
                className="shrink-0 px-3 py-1.5 bg-pink-50 text-pink-500 text-xs rounded-full border border-pink-100 hover:bg-pink-100 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-pink-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <Card className="!p-2 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напиши по-немецки или по-русски..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-transparent text-gray-700 placeholder-pink-300 outline-none text-sm disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-pink-400 to-pink-500 text-white p-2.5 rounded-xl hover:from-pink-500 hover:to-pink-600 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shrink-0"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </Card>
          <p className="text-center text-xs text-pink-300 mt-2">
            Я рядом и помогу с любой фразой ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
