import { Surprise } from "./types";

export const surprises: Surprise[] = [
  // ═══ CATEGORY S (5/5) ═══
  {
    id: "s1",
    category: "S",
    type: "message",
    content: {
      title: "💌 Письмо от Влада",
      animation: "confetti",
      message: `Юлия, ты просто невероятная! 🥹\nЯ не могу поверить как ты стараешься.\nСегодня ты идеально прошла квиз — это заслуживает особого вечера.\nЯ очень тобой горжусь.\n\nС любовью, Влад 💕`,
      emoji: "💌",
    },
  },
  {
    id: "s2",
    category: "S",
    type: "poem",
    content: {
      title: "🌸 Стихотворение для тебя",
      animation: "float-hearts",
      message: `Du lernst so fleißig jeden Tag,\nDein Deutsch wird besser, was ich sag!\nIch bin so stolz auf dich, mein Herz,\nDu machst das Leben voller Scherz.\n\n(Ты учишься усердно каждый день,\nТвой немецкий всё лучше, поверь мне!\nЯ так тобой горжусь, моё сердце,\nТы делаешь жизнь веселее.)`,
      emoji: "🌹",
    },
  },
  {
    id: "s3",
    category: "S",
    type: "certificate",
    content: {
      title: "🏅 Сертификат дня",
      animation: "shimmer",
      message: `Настоящим подтверждается, что\n\nЮЛИЯ ПРИНЦЕССОВНА\n\nблестяще прошла Ежедневный Квиз\nи показала результат 5 из 5!\n\nПодпись: Влад 💕 & AI Тьютор 🤖`,
      emoji: "🏅",
    },
  },
  {
    id: "s4",
    category: "S",
    type: "challenge",
    content: {
      title: "🎯 Секретный вызов",
      animation: "confetti",
      message: `Ты заслужила особое задание!\n\nСкажи Владу сегодня:\n«Ich liebe dich mehr als Sushi! 🍣»\n(Я люблю тебя больше чем суши!)\n\nПосмотрим на его реакцию 😄`,
      emoji: "🎯",
    },
  },
  {
    id: "s5",
    category: "S",
    type: "poem",
    content: {
      title: "🌷 Мини-поэма",
      animation: "float-hearts",
      message: `Roses are rot,\nVeilchen are blau,\nDu bist die Beste,\nDas weiß ich genau! 💕\n\n(Розы красные,\nФиалки синие,\nТы самая лучшая,\nЯ знаю это точно!)`,
      emoji: "🌷",
    },
  },

  // ═══ CATEGORY A (4/5) ═══
  {
    id: "a1",
    category: "A",
    type: "message",
    content: {
      title: "⭐ Почти идеально!",
      animation: "sparkles",
      message: `4 из 5 — это отлично! 🌟\nТы уже так много знаешь.\nЗавтра будет 5 из 5, я уверен! 💪\n\nВлад`,
      emoji: "⭐",
    },
  },
  {
    id: "a2",
    category: "A",
    type: "challenge",
    content: {
      title: "💃 Танцевальный вызов",
      animation: "sparkles",
      message: `Сегодняшний сюрприз — маленький вызов!\n\nСтанцуй один шаг сальсы и скажи при этом:\n«Ich bin die beste Tänzerin!»\n(Я лучшая танцовщица!)\n\nСделала? Ты молодец! 💃`,
      emoji: "💃",
    },
  },
  {
    id: "a3",
    category: "A",
    type: "message",
    content: {
      title: "🧁 Сладкий комплимент",
      animation: "sparkles",
      message: `Ты как швейцарский шоколад —\nвсегда делаешь всё вокруг слаще! 🍫\n\n4 из 5 — прекрасный результат.\nЗаслуживаешь десерт сегодня! 🧁`,
      emoji: "🧁",
    },
  },

  // ═══ CATEGORY B (3/5) ═══
  {
    id: "b1",
    category: "B",
    type: "message",
    content: {
      title: "🌱 Ты растёшь!",
      animation: "soft-pulse",
      message: `3 из 5 — отличный старт! 🌱\nКаждая ошибка делает тебя сильнее.\nЗавтра попробуй ещё раз — у тебя всё получится!\n\nIch glaube an dich! 💕`,
      emoji: "🌱",
    },
  },
  {
    id: "b2",
    category: "B",
    type: "message",
    content: {
      title: "🌻 Маленькие шаги",
      animation: "soft-pulse",
      message: `Знаешь что говорят немцы?\n«Übung macht den Meister!»\nПрактика делает мастера! 🌻\n\nТы уже на пути. Продолжай! 💕`,
      emoji: "🌻",
    },
  },
];

function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getSurpriseForScore(score: number): Surprise | null {
  if (score < 3) return null;

  const category = score === 5 ? "S" : score === 4 ? "A" : "B";
  const pool = surprises.filter((s) => s.category === category);
  if (pool.length === 0) return null;

  const seed = new Date().toDateString() + category;
  const index = seededRandom(seed) % pool.length;
  return pool[index];
}
