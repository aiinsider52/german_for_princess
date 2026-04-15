"use client";

import { Mood } from "./types";

export interface MistakeExplanation {
  explanation: string;
  examples: string[];
  encouragement: string;
}

export interface ChatResponse {
  correction: string | null;
  explanation: string;
  betterVersion: string;
  encouragement: string;
}

export interface ScenarioResponse {
  isCorrect: boolean;
  correction: string | null;
  explanation: string;
  npcReply: string;
  encouragement: string;
}

export interface MoodInsight {
  title: string;
  message: string;
}

// ─── EXPLAIN MISTAKE ────────────────────────────────────────

export async function explainMistake(input: {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  context: "grammar" | "vocab";
}): Promise<MistakeExplanation> {
  try {
    const res = await fetch("/api/ai/explain-mistake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.explanation && Array.isArray(data.examples)) return data;
    throw new Error("Invalid response shape");
  } catch {
    return explainMistakeFallback(input);
  }
}

function explainMistakeFallback(input: {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  context: "grammar" | "vocab";
}): MistakeExplanation {
  const isFill = input.question.includes("___");
  if (isFill) {
    const full = input.question.replace("___", input.correctAnswer);
    return {
      explanation: `Здесь нужно слово «${input.correctAnswer}», потому что с ним фраза собирается правильно: «${full}». Вариант «${input.userAnswer}» не подходит по грамматике.`,
      examples: [
        `Правильно: ${full}`,
        `Не подходит: ${input.question.replace("___", input.userAnswer)}`,
      ],
      encouragement: "Ты уже хорошо замечаешь структуру фразы 💕",
    };
  }
  return {
    explanation: `Правильный ответ — «${input.correctAnswer}», а не «${input.userAnswer}». Они похожи по теме, но передают разный смысл.`,
    examples: [
      `${input.question} = ${input.correctAnswer}`,
      `«${input.userAnswer}» — это уже другое значение`,
    ],
    encouragement: "Ты почти попала в смысл — это хороший знак 🌸",
  };
}

// ─── CHAT WITH TUTOR ────────────────────────────────────────

export async function chatWithTutor(
  userMessage: string,
  history: { role: "user" | "assistant"; content: string }[]
): Promise<ChatResponse> {
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage, history }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.explanation && data.betterVersion) return data;
    throw new Error("Invalid response shape");
  } catch {
    return chatFallback(userMessage);
  }
}

function chatFallback(userMessage: string): ChatResponse {
  const hasGerman =
    /[äöüß]/.test(userMessage.toLowerCase()) ||
    /\b(ich|du|er|sie|es|wir|das|der|die|ist|bin|habe)\b/.test(
      userMessage.toLowerCase()
    );

  if (hasGerman) {
    return {
      correction: null,
      explanation:
        "Хорошая попытка! Ты используешь немецкие слова — это уже прогресс.",
      betterVersion: `${userMessage}, bitte.`,
      encouragement: "Ты молодец, что практикуешься! 💖",
    };
  }
  return {
    correction: null,
    explanation:
      "Давай я помогу перевести это на немецкий! Попробуй подумать, какие слова ты уже знаешь.",
    betterVersion:
      'Попробуй сказать это по-немецки. Начни с «Ich möchte...» (Я хотела бы...) или «Können Sie...» (Можете ли вы...)',
    encouragement: "Я рядом и помогу с любой фразой! 💕",
  };
}

// ─── SCENARIO ───────────────────────────────────────────────

export interface ScenarioStep {
  situation: string;
  hint: string;
  expectedIntent: string;
}

export interface Scenario {
  id: string;
  title: string;
  emoji: string;
  description: string;
  setting: string;
  steps: ScenarioStep[];
  tag?: string;
  difficulty?: "beginner" | "intermediate";
  isNew?: boolean;
  easterEgg?: boolean;
}

export const scenarios: Scenario[] = [
  {
    id: "store",
    title: "В магазине",
    emoji: "🛒",
    description: "Покупаем продукты в швейцарском супермаркете",
    setting: "Ты в магазине Migros в Цюрихе. Тебе нужно купить продукты.",
    difficulty: "beginner",
    isNew: false,
    steps: [
      { situation: "Ты заходишь в магазин. Продавец говорит: «Grüezi! Kann ich Ihnen helfen?» (Здравствуйте! Могу я вам помочь?). Поздоровайся и скажи, что тебе нужно.", hint: "Попробуй: «Grüezi! Ich suche...» или «Hallo, ich möchte...»", expectedIntent: "greeting_and_request" },
      { situation: "Продавец показывает тебе полку с сырами. Спроси, сколько стоит швейцарский сыр.", hint: "Используй: «Wie viel kostet...?» или «Was kostet...?»", expectedIntent: "ask_price" },
      { situation: "Сыр стоит 8 франков. Скажи, что берёшь его, и спроси, где можно оплатить.", hint: "Попробуй: «Ich nehme...» и «Wo kann ich bezahlen?»", expectedIntent: "buy_and_pay" },
      { situation: "На кассе. Кассир говорит сумму: «Das macht 12,50 Franken.» Поблагодари и попрощайся.", hint: "Скажи: «Danke schön!» и «Auf Wiedersehen!» или «Tschüss!»", expectedIntent: "thank_and_bye" },
    ],
  },
  {
    id: "doctor",
    title: "У врача",
    emoji: "🏥",
    description: "Визит к врачу — записываемся и объясняем симптомы",
    setting: "Тебе нужно записаться к врачу и объяснить, что у тебя болит.",
    difficulty: "beginner",
    isNew: false,
    steps: [
      { situation: "Ты звонишь в клинику. Секретарь отвечает: «Praxis Dr. Müller, guten Tag!» Представься и скажи, что хочешь записаться на приём.", hint: "Попробуй: «Guten Tag, ich möchte einen Termin...» или «Ich brauche einen Termin...»", expectedIntent: "book_appointment" },
      { situation: "Секретарь спрашивает: «Was für Beschwerden haben Sie?» (Какие у вас жалобы?). Опиши свои симптомы.", hint: "Используй: «Ich habe Kopfschmerzen» или «Mir ist schlecht»", expectedIntent: "describe_symptoms" },
      { situation: "Врач говорит: «Nehmen Sie diese Tabletten zweimal am Tag.» (Принимайте эти таблетки два раза в день.) Уточни, нужен ли рецепт для аптеки.", hint: "Спроси: «Brauche ich ein Rezept?» или «Ist das rezeptpflichtig?»", expectedIntent: "ask_prescription" },
      { situation: "Визит закончен. Поблагодари врача и попрощайся.", hint: "Скажи: «Vielen Dank, Herr/Frau Doktor!» и «Auf Wiedersehen!»", expectedIntent: "thank_doctor" },
    ],
  },
  {
    id: "apartment",
    title: "Аренда квартиры",
    emoji: "🏠",
    description: "Ищем и арендуем квартиру в Швейцарии",
    setting: "Ты ищешь квартиру в Цюрихе и пришла на осмотр.",
    difficulty: "beginner",
    isNew: false,
    steps: [
      { situation: "Ты приходишь на осмотр квартиры. Хозяин открывает дверь: «Willkommen! Kommen Sie herein!» Поздоровайся и представься.", hint: "Попробуй: «Guten Tag! Ich bin Julia. Danke für die Einladung!»", expectedIntent: "greet_landlord" },
      { situation: "Хозяин показывает квартиру. Задай вопросы о квартире — сколько стоит аренда, включены ли расходы.", hint: "Спроси: «Wie hoch ist die Miete?» или «Sind die Nebenkosten inklusive?»", expectedIntent: "ask_rent" },
      { situation: "Квартира стоит 1800 франков в месяц. Спроси, когда можно заехать и что нужно для подписания контракта.", hint: "Используй: «Wann kann ich einziehen?» или «Welche Unterlagen brauchen Sie?»", expectedIntent: "ask_movein" },
      { situation: "Хозяин говорит, что квартира свободна с первого числа. Скажи, что тебе нравится квартира и ты хочешь её снять.", hint: "Попробуй: «Die Wohnung gefällt mir sehr!» и «Ich möchte die Wohnung mieten.»", expectedIntent: "confirm_rent" },
    ],
  },
  {
    id: "dance-studio",
    title: "В танцевальной студии",
    emoji: "💃",
    description: "Бронируем занятия и спрашиваем расписание",
    setting: "Ты в танцевальной студии в центре Цюриха. Хочешь записаться на курсы.",
    tag: "Для тебя 💕",
    difficulty: "beginner",
    isNew: true,
    steps: [
      { situation: "Ты заходишь в студию. Администратор: «Guten Tag! Wie kann ich Ihnen helfen?» Поздоровайся и скажи, что хочешь записаться на танцы.", hint: "Попробуй: «Guten Tag! Ich möchte gerne Tanzkurse buchen.»", expectedIntent: "book_dance" },
      { situation: "«Welchen Tanzstil interessiert Sie? Wir haben Salsa, Tango und Hip-Hop.» Выбери стиль танца.", hint: "Используй: «Ich interessiere mich für Salsa, bitte.»", expectedIntent: "choose_style" },
      { situation: "«Wann möchten Sie anfangen?» Спроси про ближайший урок.", hint: "Спроси: «Wann ist der nächste Kurs?»", expectedIntent: "ask_schedule" },
      { situation: "«Der nächste Kurs ist am Dienstag um 19 Uhr. Soll ich Sie anmelden?» Согласись на запись.", hint: "Скажи: «Ja, bitte! Das ist perfekt.»", expectedIntent: "confirm_booking" },
    ],
  },
  {
    id: "sushi-restaurant",
    title: "В суши-ресторане",
    emoji: "🍣",
    description: "Заказываем столик, читаем меню, делаем заказ",
    setting: "Вечер. Ты пришла в суши-ресторан в Цюрихе.",
    tag: "Для тебя 💕",
    difficulty: "beginner",
    isNew: true,
    steps: [
      { situation: "Хостес встречает тебя: «Guten Abend! Haben Sie reserviert?» Скажи, что хочешь столик на двоих.", hint: "Попробуй: «Nein, aber haben Sie einen Tisch für zwei Personen?»", expectedIntent: "ask_table" },
      { situation: "«Natürlich! Bitte folgen Sie mir. Möchten Sie die Speisekarte?» Попроси меню.", hint: "Скажи: «Ja, die Speisekarte, bitte.»", expectedIntent: "ask_menu" },
      { situation: "Официант спрашивает: «Was darf es sein?» Закажи суши.", hint: "Попробуй: «Ich nehme den Lachs-Nigiri und die California Roll, bitte.»", expectedIntent: "order_food" },
      { situation: "«Sehr gut! Noch etwas zu trinken?» Закажи напиток.", hint: "Скажи: «Ein Wasser, bitte.» или «Einen grünen Tee, bitte.»", expectedIntent: "order_drink" },
    ],
  },
  {
    id: "puppy-yoga",
    title: "На Puppy Yoga",
    emoji: "🐶",
    description: "Записываемся на занятие с щеночками",
    setting: "Ты нашла студию Puppy Yoga в Цюрихе и пришла записаться.",
    tag: "Для тебя 💕",
    difficulty: "beginner",
    isNew: true,
    steps: [
      { situation: "Инструктор: «Hallo! Willkommen bei Puppy Yoga Zürich!» Поздоровайся и спроси про свободные места.", hint: "Попробуй: «Hallo! Gibt es noch freie Plätze für heute?»", expectedIntent: "ask_spots" },
      { situation: "«Ja! Um 16 Uhr haben wir noch zwei Plätze frei.» Скажи, что хочешь записаться.", hint: "Скажи: «Super! Ich möchte mich anmelden, bitte.»", expectedIntent: "sign_up" },
      { situation: "«Perfekt! Haben Sie Erfahrung mit Yoga?» Расскажи о своём опыте.", hint: "Скажи: «Ein bisschen. Ich bin Anfängerin.»", expectedIntent: "share_experience" },
      { situation: "«Kein Problem! Die Hündchen helfen beim Entspannen. 🐾 Was ist Ihr Name?» Назови своё имя.", hint: "Скажи: «Mein Name ist Julia.»", expectedIntent: "give_name" },
    ],
  },
  {
    id: "airport",
    title: "В аэропорту",
    emoji: "✈️",
    description: "Чек-ин, багаж и посадка на рейс",
    setting: "Ты в аэропорту Цюриха, летишь в Барселону на выходные.",
    tag: "Путешествия",
    difficulty: "intermediate",
    isNew: true,
    steps: [
      { situation: "На стойке регистрации: «Guten Morgen! Ihr Reiseziel und Ticket, bitte.» Скажи куда летишь.", hint: "Попробуй: «Ich fliege nach Barcelona. Hier ist mein Ticket.»", expectedIntent: "checkin" },
      { situation: "«Wie viel Gepäck möchten Sie aufgeben?» Скажи про багаж.", hint: "Скажи: «Einen Koffer, bitte.»", expectedIntent: "luggage" },
      { situation: "«Haben Sie gefährliche Gegenstände dabei?» Ответь.", hint: "Скажи: «Nein, natürlich nicht.»", expectedIntent: "security" },
      { situation: "«Ihr Gate ist B14. Guten Flug!» Поблагодари.", hint: "Скажи: «Vielen Dank! Auf Wiedersehen!»", expectedIntent: "thanks_bye" },
    ],
  },
  {
    id: "bmw-showroom",
    title: "В автосалоне",
    emoji: "🏎️",
    description: "Тест-драйв и вопросы о машине",
    setting: "Ты в автосалоне BMW в Мюнхене. Хочешь посмотреть новые модели.",
    tag: "Easter Egg 🥚",
    difficulty: "intermediate",
    isNew: true,
    easterEgg: true,
    steps: [
      { situation: "Менеджер: «Herzlich willkommen bei BMW München! Wie kann ich Ihnen helfen?» Скажи, что хочешь посмотреть модели.", hint: "Попробуй: «Ich möchte gerne die neuen Modelle ansehen.»", expectedIntent: "browse_cars" },
      { situation: "«Natürlich! Interessieren Sie sich für die 3er oder 5er Serie?» Выбери серию.", hint: "Скажи: «Die 3er Serie, bitte.»", expectedIntent: "choose_model" },
      { situation: "«Und was sagen Sie zu diesem Audi drüben? 😄» Ответь про BMW vs Audi!", hint: "😄 Скажи: «Nein danke! Ich fahre nur BMW. Mein Freund fährt Audi. 😂»", expectedIntent: "bmw_easter_egg" },
      { situation: "«😂 Sehr gut! Möchten Sie eine Probefahrt machen?» Согласись на тест-драйв.", hint: "Скажи: «Ja, eine Probefahrt wäre wunderbar!»", expectedIntent: "test_drive" },
    ],
  },
];

export async function evaluateScenarioInput(
  scenarioId: string,
  _stepIntent: string,
  userInput: string
): Promise<ScenarioResponse> {
  const scenario = scenarios.find((s) => s.id === scenarioId);
  const step = scenario?.steps.find((s) => s.expectedIntent === _stepIntent);

  try {
    const res = await fetch("/api/ai/scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenarioSetting: scenario?.setting ?? "",
        stepSituation: step?.situation ?? "",
        stepHint: step?.hint ?? "",
        userInput,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.npcReply && data.explanation) return data;
    throw new Error("Invalid response shape");
  } catch {
    return {
      isCorrect: true,
      correction: null,
      explanation: "Хорошая попытка! Ты на верном пути.",
      npcReply: "Ja, natürlich! Kann ich Ihnen sonst noch helfen?",
      encouragement: "Продолжай, ты справляешься! 💕",
    };
  }
}

// ─── MOOD ───────────────────────────────────────────────────

export async function generateMoodInsight(input: {
  mood: Mood;
  streak: number;
  currentDay: number;
  totalDays: number;
  currentLevel: number;
  completedDays: number[];
}): Promise<MoodInsight> {
  try {
    const res = await fetch("/api/ai/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood: input.mood,
        streak: input.streak,
        currentDay: input.currentDay,
        totalDays: input.totalDays,
        currentLevel: input.currentLevel,
        completedDaysCount: input.completedDays.length,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.title && data.message) return data;
    throw new Error("Invalid response shape");
  } catch {
    return moodFallback(input);
  }
}

function moodFallback(input: {
  mood: Mood;
  streak: number;
  currentDay: number;
  completedDays: number[];
}): MoodInsight {
  const streakPart =
    input.streak > 0
      ? `Серия ${input.streak} ${input.streak === 1 ? "день" : input.streak < 5 ? "дня" : "дней"}.`
      : "";

  if (input.mood === "great") {
    return {
      title: "Сегодня у тебя много ресурса 🌸",
      message: `Отличное настроение — самое время для полного урока дня ${input.currentDay}! ${streakPart}`,
    };
  }
  if (input.mood === "good") {
    return {
      title: "Хороший спокойный ритм 😊",
      message: `Сегодня пройди урок в своём темпе. ${streakPart}`,
    };
  }
  if (input.mood === "tired") {
    return {
      title: "Сегодня нужен бережный режим 😴",
      message: `Открой только слова дня ${input.currentDay} и выбери 2-3 для запоминания. Этого достаточно.`,
    };
  }
  return {
    title: "Я рядом, даже если день тяжёлый 💗",
    message: `Сделай самый мягкий вариант: посмотри 3 слова. Немецкий никуда не убегает.`,
  };
}
