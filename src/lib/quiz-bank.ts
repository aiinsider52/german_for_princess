import { QuizQuestion } from "./types";

export const quizQuestions: QuizQuestion[] = [
  // День 1 — Приветствия
  { id: "q1", type: "translate_de_ru", question: "Guten Morgen", correct: "Доброе утро", options: ["Добрый вечер", "Доброе утро", "Спокойной ночи", "До свидания"], dayId: 1 },
  { id: "q2", type: "translate_de_ru", question: "Wie heißen Sie?", correct: "Как вас зовут?", options: ["Как дела?", "Где вы живёте?", "Как вас зовут?", "Сколько вам лет?"], dayId: 1 },
  { id: "q3", type: "match_emoji", question: "👋", correct: "Hallo", options: ["Danke", "Bitte", "Hallo", "Tschüss"], dayId: 1, explanation: "👋 — жест приветствия, а «Hallo» — привет!" },
  { id: "q4", type: "translate_ru_de", question: "До свидания", correct: "Auf Wiedersehen", options: ["Guten Tag", "Auf Wiedersehen", "Gute Nacht", "Hallo"], dayId: 1 },

  // День 2 — В кафе
  { id: "q5", type: "translate_de_ru", question: "der Kaffee", correct: "кофе", options: ["чай", "кофе", "сок", "вода"], dayId: 2 },
  { id: "q6", type: "fill_phrase", question: "Ich ___ gerne einen Kaffee.", correct: "hätte", options: ["bin", "habe", "hätte", "esse"], dayId: 2, explanation: "«Ich hätte gerne» — вежливая форма «я хотела бы»" },
  { id: "q7", type: "match_emoji", question: "🍰", correct: "der Kuchen", options: ["die Torte", "der Kuchen", "das Brot", "die Pizza"], dayId: 2 },
  { id: "q8", type: "translate_ru_de", question: "Пожалуйста", correct: "Bitte", options: ["Danke", "Bitte", "Entschuldigung", "Gern"], dayId: 2 },

  // День 3 — Числа
  { id: "q9", type: "translate_de_ru", question: "zwanzig", correct: "20", options: ["12", "20", "22", "2"], dayId: 3 },
  { id: "q10", type: "translate_ru_de", question: "15", correct: "fünfzehn", options: ["fünf", "zwölf", "fünfzehn", "fünfzig"], dayId: 3 },
  { id: "q11", type: "translate_de_ru", question: "dreizehn", correct: "13", options: ["3", "13", "30", "31"], dayId: 3 },
  { id: "q12", type: "fill_phrase", question: "Ich bin ___ Jahre alt.", correct: "fünfundzwanzig", options: ["fünfzehn", "fünfundzwanzig", "fünfzig", "fünf"], dayId: 3 },

  // День 4 — Транспорт
  { id: "q13", type: "match_emoji", question: "🚊", correct: "die Straßenbahn", options: ["der Bus", "die U-Bahn", "die Straßenbahn", "der Zug"], dayId: 4 },
  { id: "q14", type: "translate_de_ru", question: "Wo ist die Haltestelle?", correct: "Где остановка?", options: ["Где вокзал?", "Где остановка?", "Где метро?", "Когда автобус?"], dayId: 4 },
  { id: "q15", type: "translate_ru_de", question: "билет", correct: "das Ticket", options: ["der Pass", "das Ticket", "die Karte", "das Geld"], dayId: 4 },
  { id: "q16", type: "match_emoji", question: "🚌", correct: "der Bus", options: ["der Bus", "der Zug", "das Taxi", "das Auto"], dayId: 4 },

  // День 5 — Покупки
  { id: "q17", type: "translate_de_ru", question: "Wie viel kostet das?", correct: "Сколько это стоит?", options: ["Что это?", "Где это?", "Сколько это стоит?", "Почему так дорого?"], dayId: 5 },
  { id: "q18", type: "fill_phrase", question: "Das ___ 5 Franken.", correct: "kostet", options: ["macht", "kostet", "ist", "hat"], dayId: 5 },
  { id: "q19", type: "match_emoji", question: "🧀", correct: "der Käse", options: ["die Butter", "der Käse", "die Milch", "das Brot"], dayId: 5 },
  { id: "q20", type: "translate_ru_de", question: "дорого", correct: "teuer", options: ["billig", "teuer", "günstig", "kostenlos"], dayId: 5 },

  // День 6 — Еда
  { id: "q21", type: "match_emoji", question: "🍕", correct: "die Pizza", options: ["die Pasta", "die Pizza", "der Salat", "die Suppe"], dayId: 6 },
  { id: "q22", type: "translate_de_ru", question: "Ich habe Hunger", correct: "Я голодна", options: ["Мне скучно", "Я голодна", "Я устала", "Мне жарко"], dayId: 6 },
  { id: "q23", type: "fill_phrase", question: "Ich ___ gerne Pizza.", correct: "esse", options: ["trinke", "esse", "habe", "möchte"], dayId: 6, explanation: "«Essen» — есть (еду), «trinken» — пить" },
  { id: "q24", type: "translate_ru_de", question: "вода", correct: "das Wasser", options: ["der Saft", "die Milch", "das Wasser", "der Tee"], dayId: 6 },

  // День 7 — Семья
  { id: "q25", type: "translate_de_ru", question: "die Mutter", correct: "мама", options: ["сестра", "мама", "бабушка", "тётя"], dayId: 7 },
  { id: "q26", type: "match_emoji", question: "👨‍👩‍👧", correct: "die Familie", options: ["die Freunde", "die Familie", "die Kollegen", "die Nachbarn"], dayId: 7 },
  { id: "q27", type: "translate_ru_de", question: "брат", correct: "der Bruder", options: ["der Vater", "der Bruder", "der Onkel", "der Sohn"], dayId: 7 },
  { id: "q28", type: "fill_phrase", question: "Mein ___ heißt Vlad.", correct: "Freund", options: ["Bruder", "Vater", "Freund", "Lehrer"], dayId: 7 },

  // День 8 — Погода
  { id: "q29", type: "match_emoji", question: "☀️", correct: "die Sonne", options: ["der Regen", "die Sonne", "der Wind", "der Schnee"], dayId: 8 },
  { id: "q30", type: "translate_de_ru", question: "Es regnet", correct: "Идёт дождь", options: ["Идёт снег", "Идёт дождь", "Светит солнце", "Дует ветер"], dayId: 8 },
  { id: "q31", type: "fill_phrase", question: "Heute ist es ___ und warm.", correct: "sonnig", options: ["kalt", "sonnig", "regnerisch", "windig"], dayId: 8 },

  // День 9 — Одежда
  { id: "q32", type: "match_emoji", question: "👗", correct: "das Kleid", options: ["die Hose", "das Kleid", "der Rock", "die Jacke"], dayId: 9 },
  { id: "q33", type: "translate_de_ru", question: "die Schuhe", correct: "обувь", options: ["шапка", "обувь", "перчатки", "шарф"], dayId: 9 },
  { id: "q34", type: "translate_ru_de", question: "куртка", correct: "die Jacke", options: ["die Jacke", "der Mantel", "das Hemd", "die Bluse"], dayId: 9 },

  // День 10 — Хобби
  { id: "q35", type: "match_emoji", question: "💃", correct: "tanzen", options: ["singen", "tanzen", "lesen", "kochen"], dayId: 10 },
  { id: "q36", type: "translate_de_ru", question: "Ich tanze gerne Salsa", correct: "Я люблю танцевать сальсу", options: ["Я пою сальсу", "Я люблю танцевать сальсу", "Я учусь танцевать", "Я иду танцевать"], dayId: 10 },
  { id: "q37", type: "fill_phrase", question: "In meiner Freizeit ___ ich gerne.", correct: "lese", options: ["lese", "esse", "schlafe", "arbeite"], dayId: 10 },
  { id: "q38", type: "translate_ru_de", question: "музыка", correct: "die Musik", options: ["das Lied", "die Musik", "der Tanz", "das Konzert"], dayId: 10 },

  // День 11 — Здоровье
  { id: "q39", type: "translate_de_ru", question: "Ich habe Kopfschmerzen", correct: "У меня болит голова", options: ["У меня болит живот", "У меня болит голова", "Мне плохо", "Я устала"], dayId: 11 },
  { id: "q40", type: "match_emoji", question: "💊", correct: "die Tablette", options: ["der Arzt", "die Tablette", "das Krankenhaus", "die Apotheke"], dayId: 11 },
  { id: "q41", type: "fill_phrase", question: "Ich brauche einen ___ beim Arzt.", correct: "Termin", options: ["Platz", "Termin", "Stuhl", "Tisch"], dayId: 11 },

  // День 12 — Путешествия
  { id: "q42", type: "match_emoji", question: "✈️", correct: "das Flugzeug", options: ["der Zug", "das Flugzeug", "das Schiff", "der Bus"], dayId: 12 },
  { id: "q43", type: "translate_de_ru", question: "der Reisepass", correct: "паспорт", options: ["билет", "паспорт", "виза", "багаж"], dayId: 12 },
  { id: "q44", type: "translate_ru_de", question: "чемодан", correct: "der Koffer", options: ["die Tasche", "der Koffer", "der Rucksack", "die Kiste"], dayId: 12 },

  // День 13 — Работа
  { id: "q45", type: "translate_de_ru", question: "Was sind Sie von Beruf?", correct: "Кем вы работаете?", options: ["Где вы живёте?", "Кем вы работаете?", "Как вы?", "Что вы делаете?"], dayId: 13 },
  { id: "q46", type: "match_emoji", question: "💻", correct: "der Computer", options: ["das Telefon", "der Computer", "das Buch", "der Stift"], dayId: 13 },
  { id: "q47", type: "fill_phrase", question: "Ich ___ als Designerin.", correct: "arbeite", options: ["lerne", "arbeite", "studiere", "spiele"], dayId: 13 },

  // День 14 — Чувства / итог
  { id: "q48", type: "translate_de_ru", question: "Ich liebe dich", correct: "Я люблю тебя", options: ["Я скучаю", "Я жду тебя", "Я люблю тебя", "Я думаю о тебе"], dayId: 14 },
  { id: "q49", type: "match_emoji", question: "❤️", correct: "die Liebe", options: ["das Glück", "die Liebe", "die Freude", "die Hoffnung"], dayId: 14 },
  { id: "q50", type: "translate_ru_de", question: "счастливая", correct: "glücklich", options: ["traurig", "müde", "glücklich", "hungrig"], dayId: 14 },
  { id: "q51", type: "fill_phrase", question: "Ich bin sehr ___ hier in Zürich.", correct: "glücklich", options: ["müde", "glücklich", "hungrig", "kalt"], dayId: 14 },
  { id: "q52", type: "translate_de_ru", question: "Du bist wunderbar", correct: "Ты замечательная", options: ["Ты красивая", "Ты замечательная", "Ты умная", "Ты смелая"], dayId: 14 },
];
