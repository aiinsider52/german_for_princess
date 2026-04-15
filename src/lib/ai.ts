"use client";

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

const mistakeExplanations: Record<string, MistakeExplanation> = {
  default: {
    explanation:
      "Это частая ошибка у начинающих! Правильный ответ отличается, потому что в немецком языке важно запоминать точные формы слов и фраз. Не переживай — с практикой это станет автоматическим!",
    examples: [
      "der Kaffee (кофе) — артикль der, потому что это мужской род",
      "Ich bin müde (Я устала) — глагол bin идёт с ich",
    ],
    encouragement: "Ты уже делаешь большие успехи! Продолжай 💖",
  },
  grammar: {
    explanation:
      "В немецкой грамматике важна форма глагола. Каждое местоимение требует свою форму: ich bin, du bist, er/sie ist. Это просто нужно запомнить — и ты уже на верном пути!",
    examples: [
      "ich bin (я есть), du bist (ты есть), er ist (он есть)",
      "ich habe (я имею), du hast (ты имеешь)",
    ],
    encouragement: "Грамматика — это как пазл. Каждый кусочек встанет на место! 🧩💕",
  },
  vocab: {
    explanation:
      "Немецкие слова иногда похожи друг на друга, и это нормально — путать их в начале. Главное — повторять и использовать в контексте. Скоро ты будешь вспоминать их мгновенно!",
    examples: [
      "die Milch (молоко) vs das Wasser (вода) — разные артикли!",
      "günstig (недорого) vs teuer (дорого) — антонимы",
    ],
    encouragement: "Каждое новое слово — это маленькая победа! 🌟",
  },
};

export async function explainMistake(input: {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  context: "grammar" | "vocab";
}): Promise<MistakeExplanation> {
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

  const base = mistakeExplanations[input.context] || mistakeExplanations.default;

  return {
    explanation: `В этом вопросе правильный ответ — «${input.correctAnswer}», а не «${input.userAnswer}». ${base.explanation}`,
    examples: base.examples,
    encouragement: base.encouragement,
  };
}

const chatResponses = [
  {
    patterns: ["hallo", "привет", "hi", "guten"],
    reply: {
      correction: null,
      explanation: "Отличное начало! Приветствие — основа любого разговора.",
      betterVersion: "Hallo! Wie geht es dir heute?",
      encouragement: "Ты уже говоришь по-немецки! 💕",
    },
  },
  {
    patterns: ["ich bin", "я есть", "меня зовут"],
    reply: {
      correction: null,
      explanation:
        "«Ich bin» — одна из самых важных конструкций. Используй её, чтобы рассказать о себе!",
      betterVersion: "Ich bin Julia. Ich komme aus Russland und lerne Deutsch.",
      encouragement: "Прекрасная фраза! Ты звучишь как настоящая немка 🌟",
    },
  },
  {
    patterns: ["wie viel", "сколько", "kostet", "стоит"],
    reply: {
      correction: null,
      explanation:
        "«Wie viel kostet das?» — суперполезная фраза для магазинов в Швейцарии!",
      betterVersion:
        "Entschuldigung, wie viel kostet das bitte? Haben Sie vielleicht einen Rabatt?",
      encouragement: "Скоро ты будешь торговаться как профи 💪",
    },
  },
  {
    patterns: ["ich möchte", "я хочу", "хотела бы"],
    reply: {
      correction: null,
      explanation:
        "«Ich möchte» — вежливая форма «я хотела бы». Используй её в кафе и магазинах!",
      betterVersion: "Ich möchte bitte einen Kaffee mit Milch. Danke!",
      encouragement: "Вежливость — ключ к сердцам швейцарцев! ☕💕",
    },
  },
];

export async function chatWithTutor(
  userMessage: string,
  _history: { role: "user" | "assistant"; content: string }[]
): Promise<ChatResponse> {
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

  const lower = userMessage.toLowerCase();
  for (const resp of chatResponses) {
    if (resp.patterns.some((p) => lower.includes(p))) {
      return resp.reply;
    }
  }

  const hasGerman = /[äöüß]/.test(lower) || /\b(ich|du|er|sie|es|wir|das|der|die|ist|bin|habe)\b/.test(lower);

  if (hasGerman) {
    return {
      correction: null,
      explanation:
        "Хорошая попытка! Ты используешь немецкие слова — это уже прогресс. Давай сделаем фразу ещё более естественной.",
      betterVersion: `${userMessage} — звучит хорошо! Попробуй добавить «bitte» для вежливости: "${userMessage}, bitte."`,
      encouragement: "Ты молодец, что практикуешься! 💖",
    };
  }

  return {
    correction: null,
    explanation:
      "Давай я помогу перевести это на немецкий! Попробуй подумать, какие слова ты уже знаешь.",
    betterVersion: `Попробуй сказать это по-немецки. Начни с «Ich möchte...» (Я хотела бы...) или «Können Sie...» (Можете ли вы...)`,
    encouragement: "Я рядом и помогу с любой фразой! 💕",
  };
}

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
}

export const scenarios: Scenario[] = [
  {
    id: "store",
    title: "В магазине",
    emoji: "🛒",
    description: "Покупаем продукты в швейцарском супермаркете",
    setting: "Ты в магазине Migros в Цюрихе. Тебе нужно купить продукты.",
    steps: [
      {
        situation:
          "Ты заходишь в магазин. Продавец говорит: «Grüezi! Kann ich Ihnen helfen?» (Здравствуйте! Могу я вам помочь?). Поздоровайся и скажи, что тебе нужно.",
        hint: "Попробуй: «Grüezi! Ich suche...» или «Hallo, ich möchte...»",
        expectedIntent: "greeting_and_request",
      },
      {
        situation:
          "Продавец показывает тебе полку с сырами. Спроси, сколько стоит швейцарский сыр.",
        hint: "Используй: «Wie viel kostet...?» или «Was kostet...?»",
        expectedIntent: "ask_price",
      },
      {
        situation:
          "Сыр стоит 8 франков. Скажи, что берёшь его, и спроси, где можно оплатить.",
        hint: "Попробуй: «Ich nehme...» и «Wo kann ich bezahlen?»",
        expectedIntent: "buy_and_pay",
      },
      {
        situation:
          "На кассе. Кассир говорит сумму: «Das macht 12,50 Franken.» Поблагодари и попрощайся.",
        hint: "Скажи: «Danke schön!» и «Auf Wiedersehen!» или «Tschüss!»",
        expectedIntent: "thank_and_bye",
      },
    ],
  },
  {
    id: "doctor",
    title: "У врача",
    emoji: "🏥",
    description: "Визит к врачу — записываемся и объясняем симптомы",
    setting:
      "Тебе нужно записаться к врачу и объяснить, что у тебя болит.",
    steps: [
      {
        situation:
          "Ты звонишь в клинику. Секретарь отвечает: «Praxis Dr. Müller, guten Tag!» Представься и скажи, что хочешь записаться на приём.",
        hint: "Попробуй: «Guten Tag, ich möchte einen Termin...» или «Ich brauche einen Termin...»",
        expectedIntent: "book_appointment",
      },
      {
        situation:
          "Секретарь спрашивает: «Was für Beschwerden haben Sie?» (Какие у вас жалобы?). Опиши свои симптомы.",
        hint: "Используй: «Ich habe Kopfschmerzen» или «Mir ist schlecht»",
        expectedIntent: "describe_symptoms",
      },
      {
        situation:
          "Врач говорит: «Nehmen Sie diese Tabletten zweimal am Tag.» (Принимайте эти таблетки два раза в день.) Уточни, нужен ли рецепт для аптеки.",
        hint: "Спроси: «Brauche ich ein Rezept?» или «Ist das rezeptpflichtig?»",
        expectedIntent: "ask_prescription",
      },
      {
        situation:
          "Визит закончен. Поблагодари врача и попрощайся.",
        hint: "Скажи: «Vielen Dank, Herr/Frau Doktor!» и «Auf Wiedersehen!»",
        expectedIntent: "thank_doctor",
      },
    ],
  },
  {
    id: "apartment",
    title: "Аренда квартиры",
    emoji: "🏠",
    description: "Ищем и арендуем квартиру в Швейцарии",
    setting:
      "Ты ищешь квартиру в Цюрихе и пришла на осмотр.",
    steps: [
      {
        situation:
          "Ты приходишь на осмотр квартиры. Хозяин открывает дверь: «Willkommen! Kommen Sie herein!» (Добро пожаловать! Заходите!) Поздоровайся и представься.",
        hint: "Попробуй: «Guten Tag! Ich bin Julia. Danke für die Einladung!»",
        expectedIntent: "greet_landlord",
      },
      {
        situation:
          "Хозяин показывает квартиру. Задай вопросы о квартире — сколько стоит аренда, включены ли расходы.",
        hint: "Спроси: «Wie hoch ist die Miete?» или «Sind die Nebenkosten inklusive?»",
        expectedIntent: "ask_rent",
      },
      {
        situation:
          "Квартира стоит 1800 франков в месяц. Спроси, когда можно заехать и что нужно для подписания контракта.",
        hint: "Используй: «Wann kann ich einziehen?» или «Welche Unterlagen brauchen Sie?»",
        expectedIntent: "ask_movein",
      },
      {
        situation:
          "Хозяин говорит, что квартира свободна с первого числа. Скажи, что тебе нравится квартира и ты хочешь её снять.",
        hint: "Попробуй: «Die Wohnung gefällt mir sehr!» и «Ich möchte die Wohnung mieten.»",
        expectedIntent: "confirm_rent",
      },
    ],
  },
];

const scenarioReplies: Record<string, Record<string, ScenarioResponse>> = {
  store: {
    greeting_and_request: {
      isCorrect: true,
      correction: null,
      explanation: "Отлично! Ты поздоровалась и сказала, что нужно — идеальное начало!",
      npcReply:
        "Natürlich! Kommen Sie mit, ich zeige Ihnen unsere Auswahl. Wir haben heute frischen Schweizer Käse! 🧀",
      encouragement: "Ты звучишь очень естественно! 💖",
    },
    ask_price: {
      isCorrect: true,
      correction: null,
      explanation: "Спрашивать цену — базовый навык. Ты справилась!",
      npcReply:
        "Der Schweizer Käse kostet 8 Franken pro Stück. Er ist sehr gut, direkt aus Appenzell! Möchten Sie probieren?",
      encouragement: "Отличный вопрос! Так держать 🌟",
    },
    buy_and_pay: {
      isCorrect: true,
      correction: null,
      explanation: "Ты уверенно делаешь покупку и знаешь, как спросить о кассе!",
      npcReply:
        "Die Kasse ist dort drüben, gleich links. Brauchen Sie eine Tüte?",
      encouragement: "Покупка в Швейцарии — ты справляешься! 🛍️💕",
    },
    thank_and_bye: {
      isCorrect: true,
      correction: null,
      explanation: "Идеальное завершение! Вежливое прощание очень ценится в Швейцарии.",
      npcReply:
        "Danke Ihnen! Kommen Sie bald wieder! Schönen Tag noch! 😊",
      encouragement: "Ты прошла весь сценарий! Ты потрясающая! 🎉💖",
    },
  },
  doctor: {
    book_appointment: {
      isCorrect: true,
      correction: null,
      explanation: "Записаться к врачу — важный навык для жизни в Швейцарии!",
      npcReply:
        "Gerne! Wir haben am Donnerstag um 14 Uhr einen freien Termin. Passt Ihnen das?",
      encouragement: "Ты справляешься с медицинской темой! 🏥💕",
    },
    describe_symptoms: {
      isCorrect: true,
      correction: null,
      explanation: "Описание симптомов — непростая тема, но ты молодец!",
      npcReply:
        "Verstehe. Kommen Sie bitte zur Untersuchung. Es ist wahrscheinlich nichts Schlimmes, aber wir schauen uns das an.",
      encouragement: "Ты можешь объяснить свои проблемы по-немецки! 🌟",
    },
    ask_prescription: {
      isCorrect: true,
      correction: null,
      explanation: "Отличный вопрос! В Швейцарии многие лекарства требуют рецепт.",
      npcReply:
        "Ja, ich schreibe Ihnen ein Rezept. Gehen Sie damit zur Apotheke um die Ecke.",
      encouragement: "Ты знаешь, как общаться с врачом! 💊💖",
    },
    thank_doctor: {
      isCorrect: true,
      correction: null,
      explanation: "Вежливое прощание с врачом — это важно!",
      npcReply:
        "Gerne geschehen! Gute Besserung! Kommen Sie wieder, wenn es nicht besser wird. 😊",
      encouragement: "Визит к врачу пройден! Ты молодец! 🎉",
    },
  },
  apartment: {
    greet_landlord: {
      isCorrect: true,
      correction: null,
      explanation: "Первое впечатление при осмотре квартиры очень важно!",
      npcReply:
        "Freut mich! Kommen Sie, ich zeige Ihnen die Wohnung. Sie hat zwei Zimmer und einen schönen Balkon.",
      encouragement: "Отличное начало! Хозяин уже доволен 💕",
    },
    ask_rent: {
      isCorrect: true,
      correction: null,
      explanation: "Вопросы об аренде — самое важное при поиске квартиры!",
      npcReply:
        "Die Miete beträgt 1800 Franken pro Monat. Nebenkosten sind etwa 200 Franken extra — Heizung und Wasser.",
      encouragement: "Ты задаёшь правильные вопросы! 🏠💖",
    },
    ask_movein: {
      isCorrect: true,
      correction: null,
      explanation: "Важно знать условия заселения!",
      npcReply:
        "Sie können ab dem ersten nächsten Monat einziehen. Ich brauche einen Ausweis, Betreibungsauszug und Arbeitsvertrag.",
      encouragement: "Ты почти нашла квартиру! 🔑✨",
    },
    confirm_rent: {
      isCorrect: true,
      correction: null,
      explanation: "Ты выразила своё желание снять квартиру — финальный шаг!",
      npcReply:
        "Wunderbar! Ich freue mich! Ich schicke Ihnen den Mietvertrag per E-Mail. Willkommen in Ihrem neuen Zuhause! 🏠",
      encouragement: "Поздравляю! Ты арендовала квартиру в Швейцарии! 🎉💕",
    },
  },
};

export async function evaluateScenarioInput(
  scenarioId: string,
  stepIntent: string,
  _userInput: string
): Promise<ScenarioResponse> {
  await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));

  const scenarioMap = scenarioReplies[scenarioId];
  if (scenarioMap && scenarioMap[stepIntent]) {
    return scenarioMap[stepIntent];
  }

  return {
    isCorrect: true,
    correction: null,
    explanation: "Хорошая попытка! Ты на верном пути.",
    npcReply: "Ja, natürlich! Kann ich Ihnen sonst noch helfen?",
    encouragement: "Продолжай, ты справляешься! 💕",
  };
}
