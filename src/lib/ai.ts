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

export async function generateMoodInsight(input: {
  mood: Mood;
  streak: number;
  currentDay: number;
  totalDays: number;
  currentLevel: number;
  completedDays: number[];
}): Promise<MoodInsight> {
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));

  const remainingDays = Math.max(input.totalDays - input.completedDays.length, 0);
  const streakLine =
    input.streak > 0
      ? `У тебя уже серия ${input.streak} ${input.streak === 1 ? "день" : input.streak < 5 ? "дня" : "дней"}, и это правда чувствуется.`
      : "Сегодня можно начать очень мягко, без давления.";

  if (input.mood === "great") {
    return {
      title: "Сегодня у тебя много ресурса 🌸",
      message: `Похоже, сегодня можно взять день ${input.currentDay} в полном формате: пройти слова, фразы и мини-тест, а потом закрепить всё в чате. ${streakLine} Если останутся силы, добавь себе маленький бонус: скажи 3 новые фразы вслух по-немецки.`,
    };
  }

  if (input.mood === "good") {
    return {
      title: "Хороший спокойный ритм 😊",
      message: `Сегодня лучше всего подойдёт ровное занятие без спешки: пройди основной урок дня ${input.currentDay}, а в конце повтори 5 слов, которые уже встречались раньше. ${remainingDays > 0 ? `До конца текущего плана осталось ${remainingDays}.` : "Ты уже у финиша этого уровня."}`,
    };
  }

  if (input.mood === "tired") {
    return {
      title: "Сегодня нужен бережный режим 😴",
      message: `Давай без перегруза: открой только слова дня ${input.currentDay}, прочитай их медленно и выбери 2, которые хочется запомнить сегодня. Этого уже достаточно. ${streakLine} Даже короткий контакт с языком сегодня важнее, чем идеальный результат.`,
    };
  }

  return {
    title: "Я рядом, даже если день тяжёлый 💗",
    message: `Сегодня не нужно требовать от себя слишком много. Сделай самый мягкий вариант: открой урок дня ${input.currentDay}, посмотри 3 слова и одну фразу, а потом остановись, если почувствуешь, что этого достаточно. Немецкий никуда не убегает, а твой темп тоже правильный.`,
  };
}

const semanticHintBuilders: Array<{
  pattern: RegExp;
  build: (userAnswer: string, correctAnswer: string) => string;
}> = [
  {
    pattern: /guten morgen/i,
    build: (userAnswer, correctAnswer) =>
      `«Guten Morgen» говорят утром. Поэтому здесь нужен ответ «${correctAnswer}». Вариант «${userAnswer}» относится к другой ситуации, а не к утреннему приветствию.`,
  },
  {
    pattern: /wie heißen sie/i,
    build: (userAnswer, correctAnswer) =>
      `Фраза «Wie heißen Sie?» спрашивает именно имя человека. Поэтому правильный смысл — «${correctAnswer}». Вариант «${userAnswer}» был бы ответом уже на другой вопрос.`,
  },
  {
    pattern: /wie viel kostet/i,
    build: (userAnswer, correctAnswer) =>
      `Здесь ключевая часть — «wie viel kostet», то есть «сколько стоит». Поэтому правильный ответ — «${correctAnswer}». Вариант «${userAnswer}» не связан с ценой.`,
  },
  {
    pattern: /wo ist/i,
    build: (userAnswer, correctAnswer) =>
      `Слово «wo» значит «где», поэтому здесь нужен ответ про место: «${correctAnswer}». Вариант «${userAnswer}» меняет смысл вопроса.`,
  },
  {
    pattern: /ich habe hunger/i,
    build: (userAnswer, correctAnswer) =>
      `«Ich habe Hunger» буквально значит «у меня есть голод», то есть по-русски «${correctAnswer}». Вариант «${userAnswer}» описывает уже другое состояние.`,
  },
  {
    pattern: /ich liebe dich/i,
    build: (userAnswer, correctAnswer) =>
      `Это очень конкретная фраза: «Ich liebe dich» значит «${correctAnswer}». Вариант «${userAnswer}» близок по эмоции, но это уже не тот же самый смысл.`,
  },
];

const grammarFamilies = [
  {
    forms: ["bin", "bist", "ist", "sind", "seid"],
    label: "глагола sein",
  },
  {
    forms: ["habe", "hast", "hat", "haben", "habt"],
    label: "глагола haben",
  },
  {
    forms: ["möchte", "möchtest", "möchten", "möchtet"],
    label: "конструкции möchten",
  },
  {
    forms: ["esse", "isst", "essen", "esst"],
    label: "глагола essen",
  },
  {
    forms: ["trinke", "trinkst", "trinkt", "trinken"],
    label: "глагола trinken",
  },
  {
    forms: ["arbeite", "arbeitest", "arbeitet", "arbeiten"],
    label: "глагола arbeiten",
  },
  {
    forms: ["lerne", "lernst", "lernt", "lernen"],
    label: "глагола lernen",
  },
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[«»"'!?.,:;()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasCyrillic(text: string): boolean {
  return /[а-яё]/i.test(text);
}

function hasLatin(text: string): boolean {
  return /[a-zäöüß]/i.test(text);
}

function extractSubject(question: string): string | null {
  const match = question.match(/\b(ich|du|er|sie|es|wir|ihr|Sie)\b/i);
  return match ? match[0] : null;
}

function findGrammarFamily(word: string) {
  const normalized = normalizeText(word);
  return grammarFamilies.find((family) =>
    family.forms.includes(normalized)
  );
}

function inferQuestionKind(
  question: string,
  userAnswer: string,
  correctAnswer: string
): "fill_phrase" | "translate_de_ru" | "translate_ru_de" | "general" {
  if (question.includes("___")) return "fill_phrase";
  if (!hasCyrillic(question) && hasCyrillic(correctAnswer)) {
    return "translate_de_ru";
  }
  if (hasCyrillic(question) && hasLatin(correctAnswer)) {
    return "translate_ru_de";
  }
  if (hasCyrillic(userAnswer) !== hasCyrillic(correctAnswer)) {
    return hasCyrillic(correctAnswer) ? "translate_de_ru" : "translate_ru_de";
  }
  return "general";
}

function buildGrammarExplanation(
  question: string,
  userAnswer: string,
  correctAnswer: string
): string {
  const fullCorrect = question.replace("___", correctAnswer);
  const family = findGrammarFamily(correctAnswer);
  const wrongFamily = findGrammarFamily(userAnswer);
  const subject = extractSubject(question);

  if (family && wrongFamily && family.label === wrongFamily.label && subject) {
    return `Здесь нужна форма «${correctAnswer}», потому что в предложении есть «${subject}», а с этим местоимением используется именно эта форма ${family.label}. Правильная фраза: «${fullCorrect}».`;
  }

  if (/^(der|die|das|ein|eine|einen|einem|einer)$/i.test(correctAnswer)) {
    return `Здесь важен правильный артикль. В этой фразе подходит именно «${correctAnswer}», потому что без него конструкция звучит неграмотно. Правильный вариант: «${fullCorrect}».`;
  }

  return `Здесь нужно слово «${correctAnswer}», потому что только с ним фраза собирается правильно: «${fullCorrect}». Вариант «${userAnswer}» меняет грамматику или делает предложение неестественным.`;
}

function buildVocabularyExplanation(
  question: string,
  userAnswer: string,
  correctAnswer: string
): string {
  const semanticHint = semanticHintBuilders.find(({ pattern }) =>
    pattern.test(question)
  );

  if (semanticHint) {
    return semanticHint.build(userAnswer, correctAnswer);
  }

  if (/^\d+$/.test(normalizeText(question)) || /^\d+$/.test(normalizeText(correctAnswer))) {
    return `Здесь нужно было сопоставить число точно: «${question}» — это «${correctAnswer}». Вариант «${userAnswer}» выглядит похоже, но это уже другое число.`;
  }

  if (/^(der|die|das)\s+/i.test(question)) {
    return `Здесь важно запомнить слово вместе с его формой: «${question}» переводится как «${correctAnswer}». Вариант «${userAnswer}» — это уже другое слово, поэтому он не подходит.`;
  }

  return `В этом вопросе нужно было соотнести именно «${question}» и «${correctAnswer}». Ответ «${userAnswer}» близок по теме, но передаёт другой смысл, поэтому здесь он неверный.`;
}

function buildRelevantExamples(
  question: string,
  userAnswer: string,
  correctAnswer: string,
  kind: "fill_phrase" | "translate_de_ru" | "translate_ru_de" | "general"
): string[] {
  if (kind === "fill_phrase") {
    return [
      `Правильно: ${question.replace("___", correctAnswer)}`,
      `Не подходит: ${question.replace("___", userAnswer)}`,
    ];
  }

  if (kind === "translate_de_ru") {
    return [
      `${question} = ${correctAnswer}`,
      `Здесь не подходит перевод: ${userAnswer}`,
    ];
  }

  if (kind === "translate_ru_de") {
    return [
      `${question} = ${correctAnswer}`,
      `Не путай с другим словом: ${userAnswer}`,
    ];
  }

  return [
    `Правильный вариант: ${correctAnswer}`,
    `Твой вариант: ${userAnswer}`,
  ];
}

export async function explainMistake(input: {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  context: "grammar" | "vocab";
}): Promise<MistakeExplanation> {
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
  const kind = inferQuestionKind(
    input.question,
    input.userAnswer,
    input.correctAnswer
  );
  const isGrammar =
    input.context === "grammar" || kind === "fill_phrase";
  const explanation = isGrammar
    ? buildGrammarExplanation(
        input.question,
        input.userAnswer,
        input.correctAnswer
      )
    : buildVocabularyExplanation(
        input.question,
        input.userAnswer,
        input.correctAnswer
      );
  const examples = buildRelevantExamples(
    input.question,
    input.userAnswer,
    input.correctAnswer,
    kind
  );
  const encouragement = isGrammar
    ? "Ты уже хорошо замечаешь структуру фразы. Ещё немного практики — и это станет автоматическим 💕"
    : "Ты не случайно ошиблась, а почти попала в смысл. Это хороший знак 🌸";

  return {
    explanation,
    examples,
    encouragement,
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
    difficulty: "beginner",
    isNew: false,
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
    difficulty: "beginner",
    isNew: false,
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
      {
        situation: "Ты заходишь в студию. Администратор: «Guten Tag! Wie kann ich Ihnen helfen?» Поздоровайся и скажи, что хочешь записаться на танцы.",
        hint: "Попробуй: «Guten Tag! Ich möchte gerne Tanzkurse buchen.»",
        expectedIntent: "book_dance",
      },
      {
        situation: "«Welchen Tanzstil interessiert Sie? Wir haben Salsa, Tango und Hip-Hop.» Выбери стиль танца.",
        hint: "Используй: «Ich interessiere mich für Salsa, bitte.»",
        expectedIntent: "choose_style",
      },
      {
        situation: "«Wann möchten Sie anfangen?» Спроси про ближайший урок.",
        hint: "Спроси: «Wann ist der nächste Kurs?»",
        expectedIntent: "ask_schedule",
      },
      {
        situation: "«Der nächste Kurs ist am Dienstag um 19 Uhr. Soll ich Sie anmelden?» Согласись на запись.",
        hint: "Скажи: «Ja, bitte! Das ist perfekt.»",
        expectedIntent: "confirm_booking",
      },
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
      {
        situation: "Хостес встречает тебя: «Guten Abend! Haben Sie reserviert?» Скажи, что хочешь столик на двоих.",
        hint: "Попробуй: «Nein, aber haben Sie einen Tisch für zwei Personen?»",
        expectedIntent: "ask_table",
      },
      {
        situation: "«Natürlich! Bitte folgen Sie mir. Möchten Sie die Speisekarte?» Попроси меню.",
        hint: "Скажи: «Ja, die Speisekarte, bitte.»",
        expectedIntent: "ask_menu",
      },
      {
        situation: "Официант спрашивает: «Was darf es sein?» Закажи суши.",
        hint: "Попробуй: «Ich nehme den Lachs-Nigiri und die California Roll, bitte.»",
        expectedIntent: "order_food",
      },
      {
        situation: "«Sehr gut! Noch etwas zu trinken?» Закажи напиток.",
        hint: "Скажи: «Ein Wasser, bitte.» или «Einen grünen Tee, bitte.»",
        expectedIntent: "order_drink",
      },
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
      {
        situation: "Инструктор: «Hallo! Willkommen bei Puppy Yoga Zürich!» Поздоровайся и спроси про свободные места.",
        hint: "Попробуй: «Hallo! Gibt es noch freie Plätze für heute?»",
        expectedIntent: "ask_spots",
      },
      {
        situation: "«Ja! Um 16 Uhr haben wir noch zwei Plätze frei.» Скажи, что хочешь записаться.",
        hint: "Скажи: «Super! Ich möchte mich anmelden, bitte.»",
        expectedIntent: "sign_up",
      },
      {
        situation: "«Perfekt! Haben Sie Erfahrung mit Yoga?» Расскажи о своём опыте.",
        hint: "Скажи: «Ein bisschen. Ich bin Anfängerin.»",
        expectedIntent: "share_experience",
      },
      {
        situation: "«Kein Problem! Die Hündchen helfen beim Entspannen. 🐾 Was ist Ihr Name?» Назови своё имя.",
        hint: "Скажи: «Mein Name ist Julia.»",
        expectedIntent: "give_name",
      },
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
      {
        situation: "На стойке регистрации: «Guten Morgen! Ihr Reiseziel und Ticket, bitte.» Скажи куда летишь.",
        hint: "Попробуй: «Ich fliege nach Barcelona. Hier ist mein Ticket.»",
        expectedIntent: "checkin",
      },
      {
        situation: "«Wie viel Gepäck möchten Sie aufgeben?» Скажи про багаж.",
        hint: "Скажи: «Einen Koffer, bitte.»",
        expectedIntent: "luggage",
      },
      {
        situation: "«Haben Sie gefährliche Gegenstände dabei?» Ответь.",
        hint: "Скажи: «Nein, natürlich nicht.»",
        expectedIntent: "security",
      },
      {
        situation: "«Ihr Gate ist B14. Guten Flug!» Поблагодари.",
        hint: "Скажи: «Vielen Dank! Auf Wiedersehen!»",
        expectedIntent: "thanks_bye",
      },
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
      {
        situation: "Менеджер: «Herzlich willkommen bei BMW München! Wie kann ich Ihnen helfen?» Скажи, что хочешь посмотреть модели.",
        hint: "Попробуй: «Ich möchte gerne die neuen Modelle ansehen.»",
        expectedIntent: "browse_cars",
      },
      {
        situation: "«Natürlich! Interessieren Sie sich für die 3er oder 5er Serie?» Выбери серию.",
        hint: "Скажи: «Die 3er Serie, bitte.»",
        expectedIntent: "choose_model",
      },
      {
        situation: "«Und was sagen Sie zu diesem Audi drüben? 😄» Ответь про BMW vs Audi!",
        hint: "😄 Скажи: «Nein danke! Ich fahre nur BMW. Mein Freund fährt Audi. 😂»",
        expectedIntent: "bmw_easter_egg",
      },
      {
        situation: "«😂 Sehr gut! Möchten Sie eine Probefahrt machen?» Согласись на тест-драйв.",
        hint: "Скажи: «Ja, eine Probefahrt wäre wunderbar!»",
        expectedIntent: "test_drive",
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
  "dance-studio": {
    book_dance: {
      isCorrect: true,
      correction: null,
      explanation: "Отличное начало! Ты вежливо выразила желание записаться на танцы.",
      npcReply:
        "Wunderbar! Wir haben verschiedene Kurse. Welchen Tanzstil interessiert Sie? Salsa, Tango oder Hip-Hop?",
      encouragement: "Ты уже танцуешь на немецком! 💃💕",
    },
    choose_style: {
      isCorrect: true,
      correction: null,
      explanation: "Ты выбрала стиль — «Ich interessiere mich für…» отличная конструкция!",
      npcReply:
        "Salsa ist sehr beliebt! Die Kurse machen wirklich Spaß. Wann möchten Sie anfangen?",
      encouragement: "Сальса — горячий выбор! 🔥",
    },
    ask_schedule: {
      isCorrect: true,
      correction: null,
      explanation: "Спрашивать расписание — очень практичный навык!",
      npcReply:
        "Der nächste Kurs ist am Dienstag um 19 Uhr. Soll ich Sie anmelden?",
      encouragement: "Ты уже почти на уроке! 🕺✨",
    },
    confirm_booking: {
      isCorrect: true,
      correction: null,
      explanation: "Ты подтвердила запись — весь разговор прошёл идеально!",
      npcReply:
        "Perfekt! Sie sind angemeldet. Bringen Sie bitte Sportschuhe mit. Bis Dienstag! 💃",
      encouragement: "Ура! Ты записалась на танцы по-немецки! 🎉💕",
    },
  },
  "sushi-restaurant": {
    ask_table: {
      isCorrect: true,
      correction: null,
      explanation: "Попросить столик в ресторане — ты справилась отлично!",
      npcReply:
        "Natürlich! Bitte folgen Sie mir. Ich habe einen schönen Tisch am Fenster für Sie. Möchten Sie die Speisekarte?",
      encouragement: "Ты как настоящая жительница Цюриха! 🍣💕",
    },
    ask_menu: {
      isCorrect: true,
      correction: null,
      explanation: "Попросить меню — просто и вежливо, молодец!",
      npcReply:
        "Hier, bitte! Unsere Spezialität heute ist der frische Lachs-Nigiri. Sehr zu empfehlen!",
      encouragement: "Скоро ты будешь заказывать как профи! 📋✨",
    },
    order_food: {
      isCorrect: true,
      correction: null,
      explanation: "Заказ еды прошёл безупречно! «Ich nehme…» — идеальная фраза.",
      npcReply:
        "Sehr gute Wahl! Der Lachs-Nigiri ist heute besonders frisch. Noch etwas zu trinken?",
      encouragement: "Отличный вкус! И в еде, и в немецком 🌟",
    },
    order_drink: {
      isCorrect: true,
      correction: null,
      explanation: "Ты заказала напиток — полный заказ готов!",
      npcReply:
        "Kommt sofort! Ihr Essen ist in etwa 15 Minuten fertig. Guten Appetit! 🍣",
      encouragement: "Весь ужин заказан по-немецки! Ты потрясающая! 🎉💖",
    },
  },
  "puppy-yoga": {
    ask_spots: {
      isCorrect: true,
      correction: null,
      explanation: "Спросить о свободных местах — отлично сформулировано!",
      npcReply:
        "Ja! Um 16 Uhr haben wir noch zwei Plätze frei. Die Hündchen freuen sich schon! 🐾",
      encouragement: "Щеночки уже ждут тебя! 🐶💕",
    },
    sign_up: {
      isCorrect: true,
      correction: null,
      explanation: "Записаться — «sich anmelden» — отличный глагол, запомни его!",
      npcReply:
        "Super! Ich trage Sie ein. Haben Sie Erfahrung mit Yoga?",
      encouragement: "Ты на пути к Puppy Yoga! 🧘‍♀️🐾",
    },
    share_experience: {
      isCorrect: true,
      correction: null,
      explanation: "«Ich bin Anfängerin» — честно и правильно! Отличная фраза.",
      npcReply:
        "Kein Problem! Die Hündchen helfen beim Entspannen. 🐾 Was ist Ihr Name?",
      encouragement: "Все когда-то начинали! Ты молодец! 💪✨",
    },
    give_name: {
      isCorrect: true,
      correction: null,
      explanation: "Назвать своё имя — базовый навык, и ты справилась!",
      npcReply:
        "Willkommen, Julia! Bis um 16 Uhr dann. Die Welpen heißen Bruno und Lotte — sie sind sehr süß! 🐶❤️",
      encouragement: "Ты записалась на Puppy Yoga по-немецки! Бруно и Лотте ждут! 🎉🐾",
    },
  },
  airport: {
    checkin: {
      isCorrect: true,
      correction: null,
      explanation: "Ты назвала направление и показала билет — всё правильно!",
      npcReply:
        "Barcelona, wunderbar! Darf ich Ihren Reisepass sehen? Wie viel Gepäck möchten Sie aufgeben?",
      encouragement: "Барселона ждёт! Ты отлично справляешься! ✈️💕",
    },
    luggage: {
      isCorrect: true,
      correction: null,
      explanation: "Сказать о багаже — важный шаг при регистрации!",
      npcReply:
        "Ein Koffer, verstanden. Er wiegt 18 Kilo — das ist in Ordnung. Haben Sie gefährliche Gegenstände dabei?",
      encouragement: "Багаж сдан! Всё идёт по плану 🧳✨",
    },
    security: {
      isCorrect: true,
      correction: null,
      explanation: "Стандартный вопрос безопасности — ты ответила правильно!",
      npcReply:
        "Perfekt! Hier ist Ihre Bordkarte. Ihr Gate ist B14. Boarding beginnt um 10:30 Uhr. Guten Flug!",
      encouragement: "Ты прошла регистрацию как профи! 🛫",
    },
    thanks_bye: {
      isCorrect: true,
      correction: null,
      explanation: "Вежливое прощание — всегда приятно!",
      npcReply:
        "Danke! Schöne Reise nach Barcelona! Viel Spaß! 🌞",
      encouragement: "Ты прошла весь аэропорт по-немецки! Отличного отпуска! 🎉🌴",
    },
  },
  "bmw-showroom": {
    browse_cars: {
      isCorrect: true,
      correction: null,
      explanation: "Ты выразила желание посмотреть модели — вежливо и чётко!",
      npcReply:
        "Natürlich! Kommen Sie mit. Wir haben die neuesten Modelle hier. Interessieren Sie sich für die 3er oder 5er Serie?",
      encouragement: "Добро пожаловать в мир BMW! 🏎️💕",
    },
    choose_model: {
      isCorrect: true,
      correction: null,
      explanation: "Выбрать серию — ты уверенно общаешься в автосалоне!",
      npcReply:
        "Die 3er Serie ist ausgezeichnet! Sportlich und elegant. Und was sagen Sie zu diesem Audi drüben? 😄",
      encouragement: "3-я серия — отличный вкус! 🌟",
    },
    bmw_easter_egg: {
      isCorrect: true,
      correction: null,
      explanation: "😂 Классический спор BMW vs Audi! Ты ответила идеально — верность BMW!",
      npcReply:
        "😂😂 Ha ha ha! Das ist die richtige Einstellung! BMW ist natürlich die beste Wahl. Ihr Freund weiß es nur noch nicht! 😉 Möchten Sie eine Probefahrt machen?",
      encouragement: "😂 BMW forever! Audi-фанаты нервно курят в сторонке! Ты легенда! 🏆🏎️",
    },
    test_drive: {
      isCorrect: true,
      correction: null,
      explanation: "Тест-драйв BMW — мечта! И ты договорилась по-немецки!",
      npcReply:
        "Wunderbar! Hier sind die Schlüssel. Viel Spaß bei der Probefahrt! Freude am Fahren! 🏎️💨",
      encouragement: "Ты только что получила ключи от BMW! Freude am Fahren! 🎉🏎️💕",
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
