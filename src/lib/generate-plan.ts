import { UserPreferences, LearningPlan, DayPlan } from "./types";

const beginnerDays: DayPlan[] = [
  {
    day: 1,
    title: "Приветствия и знакомство",
    description: "Учимся здороваться и представляться по-немецки 🌸",
    words: [
      { german: "Hallo", russian: "Привет", example: "Hallo! Wie geht's?" },
      { german: "Guten Morgen", russian: "Доброе утро", example: "Guten Morgen, Frau Müller!" },
      { german: "Danke", russian: "Спасибо", example: "Danke schön!" },
      { german: "Bitte", russian: "Пожалуйста", example: "Bitte schön!" },
      { german: "Tschüss", russian: "Пока", example: "Tschüss! Bis morgen!" },
    ],
    phrases: [
      { german: "Wie heißen Sie?", russian: "Как вас зовут?", context: "Официальное знакомство" },
      { german: "Ich heiße Julia", russian: "Меня зовут Юлия", context: "Представление себя" },
      { german: "Freut mich!", russian: "Приятно познакомиться!", context: "При знакомстве" },
    ],
    exercise: {
      type: "choose",
      question: "Как сказать «Спасибо» по-немецки?",
      options: ["Bitte", "Danke", "Hallo", "Tschüss"],
      correctIndex: 1,
    },
    test: [
      {
        question: "«Guten Morgen» означает:",
        options: ["Добрый вечер", "Доброе утро", "Спокойной ночи"],
        correctIndex: 1,
      },
      {
        question: "Как попрощаться неформально?",
        options: ["Guten Tag", "Danke", "Tschüss"],
        correctIndex: 2,
      },
    ],
  },
  {
    day: 2,
    title: "В кафе и ресторане",
    description: "Заказываем кофе и еду как настоящая швейцарка ☕",
    words: [
      { german: "der Kaffee", russian: "кофе", example: "Einen Kaffee, bitte." },
      { german: "das Wasser", russian: "вода", example: "Ein Glas Wasser, bitte." },
      { german: "das Brot", russian: "хлеб", example: "Das Brot ist frisch." },
      { german: "die Rechnung", russian: "счёт", example: "Die Rechnung, bitte." },
      { german: "lecker", russian: "вкусный", example: "Das ist sehr lecker!" },
    ],
    phrases: [
      { german: "Ich hätte gerne einen Kaffee", russian: "Я бы хотела кофе", context: "Заказ в кафе" },
      { german: "Die Rechnung, bitte", russian: "Счёт, пожалуйста", context: "Оплата в ресторане" },
      { german: "Was können Sie empfehlen?", russian: "Что вы порекомендуете?", context: "Выбор блюда" },
    ],
    exercise: {
      type: "choose",
      question: "Как попросить счёт в ресторане?",
      options: ["Ein Kaffee, bitte", "Die Rechnung, bitte", "Das ist lecker", "Guten Tag"],
      correctIndex: 1,
    },
    test: [
      {
        question: "«der Kaffee» — это:",
        options: ["чай", "кофе", "сок"],
        correctIndex: 1,
      },
      {
        question: "«lecker» означает:",
        options: ["дорогой", "вкусный", "большой"],
        correctIndex: 1,
      },
    ],
  },
  {
    day: 3,
    title: "Числа и покупки",
    description: "Считаем и ходим по магазинам 🛍️",
    words: [
      { german: "eins", russian: "один", example: "Eins, zwei, drei!" },
      { german: "zehn", russian: "десять", example: "Zehn Franken, bitte." },
      { german: "der Preis", russian: "цена", example: "Was ist der Preis?" },
      { german: "günstig", russian: "недорого", example: "Das ist günstig!" },
      { german: "teuer", russian: "дорого", example: "Das ist zu teuer." },
    ],
    phrases: [
      { german: "Wie viel kostet das?", russian: "Сколько это стоит?", context: "В магазине" },
      { german: "Das ist zu teuer", russian: "Это слишком дорого", context: "Торг / реакция на цену" },
      { german: "Ich nehme das", russian: "Я возьму это", context: "Покупка" },
    ],
    exercise: {
      type: "choose",
      question: "Как спросить цену?",
      options: ["Ich nehme das", "Wie viel kostet das?", "Das ist lecker", "Danke schön"],
      correctIndex: 1,
    },
    test: [
      {
        question: "«teuer» означает:",
        options: ["дёшево", "вкусно", "дорого"],
        correctIndex: 2,
      },
      {
        question: "«Ich nehme das» переводится как:",
        options: ["Я возьму это", "Сколько стоит?", "Спасибо"],
        correctIndex: 0,
      },
    ],
  },
  {
    day: 4,
    title: "Транспорт и навигация",
    description: "Ориентируемся в городе и ездим на транспорте 🚃",
    words: [
      { german: "der Zug", russian: "поезд", example: "Der Zug kommt um 10 Uhr." },
      { german: "die Haltestelle", russian: "остановка", example: "Die Haltestelle ist dort." },
      { german: "links", russian: "налево", example: "Gehen Sie links." },
      { german: "rechts", russian: "направо", example: "Dann rechts." },
      { german: "geradeaus", russian: "прямо", example: "Immer geradeaus." },
    ],
    phrases: [
      { german: "Wo ist der Bahnhof?", russian: "Где вокзал?", context: "Ориентация в городе" },
      { german: "Wann fährt der nächste Zug?", russian: "Когда следующий поезд?", context: "На вокзале" },
      { german: "Entschuldigung, ich suche...", russian: "Извините, я ищу...", context: "Спрашивая дорогу" },
    ],
    exercise: {
      type: "choose",
      question: "Как спросить «Где вокзал?»",
      options: ["Wann fährt der Zug?", "Wo ist der Bahnhof?", "Wie viel kostet das?", "Ich heiße Julia"],
      correctIndex: 1,
    },
    test: [
      {
        question: "«links» означает:",
        options: ["направо", "прямо", "налево"],
        correctIndex: 2,
      },
      {
        question: "«der Zug» — это:",
        options: ["автобус", "поезд", "такси"],
        correctIndex: 1,
      },
    ],
  },
  {
    day: 5,
    title: "Дом и квартира",
    description: "Говорим о жилье — пригодится в Швейцарии 🏠",
    words: [
      { german: "die Wohnung", russian: "квартира", example: "Die Wohnung ist schön." },
      { german: "die Miete", russian: "аренда", example: "Wie hoch ist die Miete?" },
      { german: "das Zimmer", russian: "комната", example: "Das Zimmer ist groß." },
      { german: "die Küche", russian: "кухня", example: "Die Küche ist modern." },
      { german: "gemütlich", russian: "уютный", example: "Sehr gemütlich!" },
    ],
    phrases: [
      { german: "Ich suche eine Wohnung", russian: "Я ищу квартиру", context: "Поиск жилья" },
      { german: "Wie hoch ist die Miete?", russian: "Какая арендная плата?", context: "Обсуждение аренды" },
      { german: "Ist die Wohnung möbliert?", russian: "Квартира с мебелью?", context: "Осмотр квартиры" },
    ],
    exercise: {
      type: "choose",
      question: "Как сказать «Я ищу квартиру»?",
      options: ["Ich suche eine Wohnung", "Die Miete ist hoch", "Das Zimmer ist groß", "Wo ist der Bahnhof?"],
      correctIndex: 0,
    },
    test: [
      {
        question: "«die Miete» — это:",
        options: ["квартира", "аренда", "кухня"],
        correctIndex: 1,
      },
      {
        question: "«gemütlich» означает:",
        options: ["большой", "дорогой", "уютный"],
        correctIndex: 2,
      },
    ],
  },
  {
    day: 6,
    title: "У врача",
    description: "Важные фразы для визита к доктору 🏥",
    words: [
      { german: "der Arzt", russian: "врач", example: "Ich brauche einen Arzt." },
      { german: "die Apotheke", russian: "аптека", example: "Wo ist die Apotheke?" },
      { german: "die Schmerzen", russian: "боль", example: "Ich habe Schmerzen." },
      { german: "das Rezept", russian: "рецепт", example: "Hier ist das Rezept." },
      { german: "krank", russian: "больной", example: "Ich bin krank." },
    ],
    phrases: [
      { german: "Ich brauche einen Termin", russian: "Мне нужна запись", context: "Запись к врачу" },
      { german: "Ich habe Kopfschmerzen", russian: "У меня болит голова", context: "Описание симптомов" },
      { german: "Wo ist die nächste Apotheke?", russian: "Где ближайшая аптека?", context: "Поиск аптеки" },
    ],
    exercise: {
      type: "choose",
      question: "Как сказать «Я больна»?",
      options: ["Ich bin müde", "Ich bin krank", "Ich bin glücklich", "Ich bin jung"],
      correctIndex: 1,
    },
    test: [
      {
        question: "«die Apotheke» — это:",
        options: ["больница", "аптека", "школа"],
        correctIndex: 1,
      },
      {
        question: "«Kopfschmerzen» — это боль в:",
        options: ["животе", "голове", "спине"],
        correctIndex: 1,
      },
    ],
  },
  {
    day: 7,
    title: "Погода и природа",
    description: "Обсуждаем погоду — главная тема для разговоров! 🌤️",
    words: [
      { german: "die Sonne", russian: "солнце", example: "Die Sonne scheint." },
      { german: "der Regen", russian: "дождь", example: "Es gibt Regen." },
      { german: "kalt", russian: "холодно", example: "Es ist kalt draußen." },
      { german: "warm", russian: "тепло", example: "Heute ist es warm." },
      { german: "der Schnee", russian: "снег", example: "Im Winter gibt es Schnee." },
    ],
    phrases: [
      { german: "Wie ist das Wetter heute?", russian: "Какая сегодня погода?", context: "Разговор о погоде" },
      { german: "Es ist schönes Wetter", russian: "Хорошая погода", context: "Комментарий" },
      { german: "Morgen soll es regnen", russian: "Завтра должен быть дождь", context: "Прогноз" },
    ],
    exercise: {
      type: "choose",
      question: "Как сказать «Сегодня холодно»?",
      options: ["Es ist warm", "Es ist kalt", "Die Sonne scheint", "Es regnet"],
      correctIndex: 1,
    },
    test: [
      {
        question: "«der Schnee» — это:",
        options: ["дождь", "ветер", "снег"],
        correctIndex: 2,
      },
      {
        question: "«Die Sonne scheint» означает:",
        options: ["Идёт дождь", "Светит солнце", "Дует ветер"],
        correctIndex: 1,
      },
    ],
  },
  {
    day: 8,
    title: "Еда и продукты",
    description: "Знакомимся с продуктами в швейцарском магазине 🧀",
    words: [
      { german: "der Käse", russian: "сыр", example: "Schweizer Käse ist berühmt." },
      { german: "die Milch", russian: "молоко", example: "Ein Liter Milch, bitte." },
      { german: "das Obst", russian: "фрукты", example: "Das Obst ist frisch." },
      { german: "das Gemüse", russian: "овощи", example: "Ich kaufe Gemüse." },
      { german: "die Schokolade", russian: "шоколад", example: "Schweizer Schokolade!" },
    ],
    phrases: [
      { german: "Ich möchte ein Kilo Äpfel", russian: "Я хочу кило яблок", context: "На рынке" },
      { german: "Haben Sie frisches Brot?", russian: "У вас есть свежий хлеб?", context: "В пекарне" },
      { german: "Das schmeckt gut!", russian: "Это вкусно!", context: "Комплимент еде" },
    ],
    exercise: {
      type: "choose",
      question: "Чем знаменита Швейцария?",
      options: ["der Käse und die Schokolade", "das Gemüse", "der Regen", "die Haltestelle"],
      correctIndex: 0,
    },
    test: [
      {
        question: "«die Milch» — это:",
        options: ["масло", "молоко", "вода"],
        correctIndex: 1,
      },
      {
        question: "«Das schmeckt gut» означает:",
        options: ["Это дорого", "Это вкусно", "Это красиво"],
        correctIndex: 1,
      },
    ],
  },
  {
    day: 9,
    title: "Семья и отношения",
    description: "Рассказываем о близких людях 👨‍👩‍👧",
    words: [
      { german: "die Familie", russian: "семья", example: "Meine Familie ist groß." },
      { german: "die Mutter", russian: "мама", example: "Meine Mutter heißt Anna." },
      { german: "der Vater", russian: "папа", example: "Mein Vater arbeitet." },
      { german: "die Schwester", russian: "сестра", example: "Ich habe eine Schwester." },
      { german: "die Liebe", russian: "любовь", example: "Die Liebe ist wichtig." },
    ],
    phrases: [
      { german: "Ich habe eine große Familie", russian: "У меня большая семья", context: "Рассказ о семье" },
      { german: "Bist du verheiratet?", russian: "Ты замужем/женат?", context: "Вопрос о семейном положении" },
      { german: "Ich liebe meine Familie", russian: "Я люблю свою семью", context: "Выражение чувств" },
    ],
    exercise: {
      type: "choose",
      question: "Как сказать «мама» по-немецки?",
      options: ["die Schwester", "die Mutter", "die Familie", "die Liebe"],
      correctIndex: 1,
    },
    test: [
      {
        question: "«der Vater» — это:",
        options: ["брат", "папа", "дедушка"],
        correctIndex: 1,
      },
      {
        question: "«die Liebe» переводится как:",
        options: ["дружба", "семья", "любовь"],
        correctIndex: 2,
      },
    ],
  },
  {
    day: 10,
    title: "Работа и профессии",
    description: "Говорим о работе — полезно для карьеры 💼",
    words: [
      { german: "die Arbeit", russian: "работа", example: "Ich gehe zur Arbeit." },
      { german: "der Beruf", russian: "профессия", example: "Was ist Ihr Beruf?" },
      { german: "das Büro", russian: "офис", example: "Ich arbeite im Büro." },
      { german: "der Chef", russian: "начальник", example: "Mein Chef ist nett." },
      { german: "das Gehalt", russian: "зарплата", example: "Das Gehalt ist gut." },
    ],
    phrases: [
      { german: "Ich arbeite als Designerin", russian: "Я работаю дизайнером", context: "О профессии" },
      { german: "Wo arbeiten Sie?", russian: "Где вы работаете?", context: "Вопрос о работе" },
      { german: "Ich suche einen Job", russian: "Я ищу работу", context: "Поиск работы" },
    ],
    exercise: {
      type: "choose",
      question: "Как спросить «Где вы работаете?»",
      options: ["Was ist Ihr Beruf?", "Wo arbeiten Sie?", "Wie heißen Sie?", "Wo wohnen Sie?"],
      correctIndex: 1,
    },
    test: [
      {
        question: "«das Büro» — это:",
        options: ["школа", "офис", "магазин"],
        correctIndex: 1,
      },
      {
        question: "«das Gehalt» означает:",
        options: ["отпуск", "зарплата", "должность"],
        correctIndex: 1,
      },
    ],
  },
  {
    day: 11,
    title: "Хобби и свободное время",
    description: "Рассказываем о том, что любим делать 🎨",
    words: [
      { german: "das Hobby", russian: "хобби", example: "Mein Hobby ist Malen." },
      { german: "lesen", russian: "читать", example: "Ich lese gerne." },
      { german: "reisen", russian: "путешествовать", example: "Ich reise gerne." },
      { german: "kochen", russian: "готовить", example: "Ich koche gerne." },
      { german: "die Musik", russian: "музыка", example: "Ich höre Musik." },
    ],
    phrases: [
      { german: "Was machst du in deiner Freizeit?", russian: "Что ты делаешь в свободное время?", context: "Разговор о хобби" },
      { german: "Ich lese gerne Bücher", russian: "Я люблю читать книги", context: "О хобби" },
      { german: "Lass uns zusammen kochen!", russian: "Давай вместе готовить!", context: "Предложение" },
    ],
    exercise: {
      type: "choose",
      question: "Как сказать «Я люблю путешествовать»?",
      options: ["Ich koche gerne", "Ich reise gerne", "Ich lese gerne", "Ich höre Musik"],
      correctIndex: 1,
    },
    test: [
      {
        question: "«lesen» означает:",
        options: ["писать", "читать", "рисовать"],
        correctIndex: 1,
      },
      {
        question: "«kochen» — это:",
        options: ["готовить", "танцевать", "петь"],
        correctIndex: 0,
      },
    ],
  },
  {
    day: 12,
    title: "В городе: магазины и услуги",
    description: "Ориентируемся в швейцарском городе 🏙️",
    words: [
      { german: "die Bank", russian: "банк", example: "Ich gehe zur Bank." },
      { german: "die Post", russian: "почта", example: "Wo ist die Post?" },
      { german: "das Geschäft", russian: "магазин", example: "Das Geschäft ist offen." },
      { german: "der Supermarkt", russian: "супермаркет", example: "Ich kaufe im Supermarkt." },
      { german: "geöffnet", russian: "открыто", example: "Ist die Bank geöffnet?" },
    ],
    phrases: [
      { german: "Wo ist der nächste Supermarkt?", russian: "Где ближайший супермаркет?", context: "Вопрос о локации" },
      { german: "Wann hat die Post geöffnet?", russian: "Когда работает почта?", context: "Часы работы" },
      { german: "Ich möchte Geld abheben", russian: "Я хочу снять деньги", context: "В банке" },
    ],
    exercise: {
      type: "choose",
      question: "Как спросить «Где ближайший супермаркет?»",
      options: ["Wo ist die Bank?", "Wo ist der nächste Supermarkt?", "Wann hat die Post geöffnet?", "Wie viel kostet das?"],
      correctIndex: 1,
    },
    test: [
      {
        question: "«die Post» — это:",
        options: ["банк", "почта", "аптека"],
        correctIndex: 1,
      },
      {
        question: "«geöffnet» означает:",
        options: ["закрыто", "открыто", "далеко"],
        correctIndex: 1,
      },
    ],
  },
  {
    day: 13,
    title: "Чувства и эмоции",
    description: "Выражаем свои чувства красиво 💝",
    words: [
      { german: "glücklich", russian: "счастливый", example: "Ich bin glücklich." },
      { german: "traurig", russian: "грустный", example: "Warum bist du traurig?" },
      { german: "müde", russian: "усталый", example: "Ich bin müde." },
      { german: "aufgeregt", russian: "взволнованный", example: "Ich bin aufgeregt!" },
      { german: "stolz", russian: "гордый", example: "Ich bin stolz auf dich!" },
    ],
    phrases: [
      { german: "Ich bin so glücklich!", russian: "Я так счастлива!", context: "Выражение радости" },
      { german: "Das macht mich froh", russian: "Это меня радует", context: "Позитивные эмоции" },
      { german: "Ich bin stolz auf dich!", russian: "Я горжусь тобой!", context: "Комплимент" },
    ],
    exercise: {
      type: "choose",
      question: "Как сказать «Я счастлива»?",
      options: ["Ich bin müde", "Ich bin traurig", "Ich bin glücklich", "Ich bin krank"],
      correctIndex: 2,
    },
    test: [
      {
        question: "«traurig» означает:",
        options: ["весёлый", "грустный", "злой"],
        correctIndex: 1,
      },
      {
        question: "«stolz» переводится как:",
        options: ["стильный", "гордый", "смелый"],
        correctIndex: 1,
      },
    ],
  },
  {
    day: 14,
    title: "Финальный день: ты молодец!",
    description: "Повторяем всё и сдаём финальный тест 🎉",
    words: [
      { german: "das Ziel", russian: "цель", example: "Mein Ziel ist Deutsch lernen." },
      { german: "der Erfolg", russian: "успех", example: "Das ist ein großer Erfolg!" },
      { german: "weiter", russian: "дальше", example: "Wir machen weiter!" },
      { german: "zusammen", russian: "вместе", example: "Zusammen schaffen wir das!" },
      { german: "wunderbar", russian: "чудесный", example: "Das ist wunderbar!" },
    ],
    phrases: [
      { german: "Ich habe viel gelernt", russian: "Я многому научилась", context: "Подведение итогов" },
      { german: "Deutsch macht mir Spaß", russian: "Немецкий доставляет мне удовольствие", context: "О языке" },
      { german: "Ich bin bereit für mehr!", russian: "Я готова к большему!", context: "Мотивация" },
    ],
    exercise: {
      type: "choose",
      question: "Как сказать «чудесный»?",
      options: ["wunderbar", "zusammen", "weiter", "kalt"],
      correctIndex: 0,
    },
    test: [
      {
        question: "«der Erfolg» — это:",
        options: ["провал", "опыт", "успех"],
        correctIndex: 2,
      },
      {
        question: "«zusammen» означает:",
        options: ["один", "вместе", "далеко"],
        correctIndex: 1,
      },
    ],
  },
];

const intermediateDays: DayPlan[] = [
  {
    day: 1,
    title: "Деловое общение",
    description: "Продвинутые фразы для работы и бизнеса 💼",
    words: [
      { german: "die Besprechung", russian: "совещание", example: "Die Besprechung ist um 14 Uhr." },
      { german: "der Vorschlag", russian: "предложение", example: "Ich habe einen Vorschlag." },
      { german: "die Frist", russian: "срок/дедлайн", example: "Die Frist ist morgen." },
      { german: "vereinbaren", russian: "договориться", example: "Können wir einen Termin vereinbaren?" },
      { german: "die Verantwortung", russian: "ответственность", example: "Das ist meine Verantwortung." },
    ],
    phrases: [
      { german: "Können wir das besprechen?", russian: "Мы можем это обсудить?", context: "На работе" },
      { german: "Ich bin damit einverstanden", russian: "Я с этим согласна", context: "Согласие" },
      { german: "Lassen Sie mich nachdenken", russian: "Позвольте мне подумать", context: "Переговоры" },
    ],
    exercise: {
      type: "choose",
      question: "Как сказать «Давайте назначим встречу»?",
      options: ["Die Frist ist morgen", "Können wir einen Termin vereinbaren?", "Ich bin krank", "Wo ist der Bahnhof?"],
      correctIndex: 1,
    },
    test: [
      {
        question: "«die Besprechung» — это:",
        options: ["обед", "совещание", "перерыв"],
        correctIndex: 1,
      },
      {
        question: "«die Frist» означает:",
        options: ["зарплата", "срок", "отпуск"],
        correctIndex: 1,
      },
    ],
  },
  ...Array.from<unknown, DayPlan>({ length: 13 }, (_, i) => ({
    day: i + 2,
    title: `Продвинутая тема ${i + 2}`,
    description: `Углубляем знания немецкого 📚`,
    words: [
      { german: "beispielsweise", russian: "например", example: "Beispielsweise..." },
      { german: "allerdings", russian: "однако", example: "Allerdings gibt es ein Problem." },
      { german: "eigentlich", russian: "собственно", example: "Eigentlich wollte ich..." },
      { german: "wahrscheinlich", russian: "вероятно", example: "Das ist wahrscheinlich richtig." },
      { german: "gleichzeitig", russian: "одновременно", example: "Gleichzeitig muss man..." },
    ],
    phrases: [
      { german: "Meiner Meinung nach...", russian: "По моему мнению...", context: "Выражение мнения" },
      { german: "Es kommt darauf an", russian: "Это зависит от...", context: "Обсуждение" },
      { german: "Ich würde vorschlagen...", russian: "Я бы предложила...", context: "Предложение идеи" },
    ],
    exercise: {
      type: "choose" as const,
      question: "Как сказать «однако»?",
      options: ["eigentlich", "allerdings", "beispielsweise", "gleichzeitig"],
      correctIndex: 1,
    },
    test: [
      {
        question: "«wahrscheinlich» означает:",
        options: ["точно", "вероятно", "невозможно"],
        correctIndex: 1,
      },
      {
        question: "«eigentlich» переводится как:",
        options: ["собственно", "наконец", "сначала"],
        correctIndex: 0,
      },
    ],
  })),
];

export function generateLearningPlan(
  preferences: UserPreferences,
  level: number = 1
): LearningPlan {
  if (level >= 2 || preferences.level === "intermediate") {
    return { level, days: intermediateDays };
  }
  return { level, days: beginnerDays };
}
