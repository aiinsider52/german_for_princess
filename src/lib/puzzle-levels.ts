import { Bolt, BoltColor } from "./puzzle-logic";

export interface PuzzleLevel {
  id: number;
  name: string;
  objectEmoji: string;
  objectName: string;
  theme: string;
  colors: BoltColor[];
  bolts: Bolt[];
  slotsPerColor: number;
  difficulty: "easy" | "medium" | "hard";
  unlockRequirement: number;
}

export const puzzleLevels: PuzzleLevel[] = [
  {
    id: 1,
    name: "Уютный домик",
    objectEmoji: "🏠",
    objectName: "Домик",
    theme: "greetings",
    colors: ["pink", "blue"],
    slotsPerColor: 3,
    difficulty: "easy",
    unlockRequirement: 0,
    bolts: [
      { id: "b1", color: "pink", word: { german: "Hallo", russian: "Привет", emoji: "👋" }, position: { x: 30, y: 40, z: 0 }, blockedBy: [] },
      { id: "b2", color: "blue", word: { german: "Danke", russian: "Спасибо", emoji: "🙏" }, position: { x: 50, y: 30, z: 0 }, blockedBy: [] },
      { id: "b3", color: "pink", word: { german: "Bitte", russian: "Пожалуйста", emoji: "😊" }, position: { x: 70, y: 45, z: 1 }, blockedBy: ["b1"] },
      { id: "b4", color: "blue", word: { german: "Ja", russian: "Да", emoji: "✅" }, position: { x: 40, y: 60, z: 1 }, blockedBy: ["b2"] },
      { id: "b5", color: "pink", word: { german: "Nein", russian: "Нет", emoji: "❌" }, position: { x: 60, y: 65, z: 2 }, blockedBy: ["b3", "b4"] },
      { id: "b6", color: "blue", word: { german: "Tschüss", russian: "Пока", emoji: "👋" }, position: { x: 25, y: 70, z: 2 }, blockedBy: ["b1", "b4"] },
    ],
  },
  {
    id: 2,
    name: "Вкусный торт",
    objectEmoji: "🎂",
    objectName: "Торт",
    theme: "food",
    colors: ["pink", "yellow", "green"],
    slotsPerColor: 3,
    difficulty: "easy",
    unlockRequirement: 1,
    bolts: [
      { id: "b1", color: "pink", word: { german: "Pizza", russian: "Пицца", emoji: "🍕" }, position: { x: 25, y: 35, z: 0 }, blockedBy: [] },
      { id: "b2", color: "yellow", word: { german: "Kaffee", russian: "Кофе", emoji: "☕" }, position: { x: 55, y: 30, z: 0 }, blockedBy: [] },
      { id: "b3", color: "green", word: { german: "Wasser", russian: "Вода", emoji: "💧" }, position: { x: 75, y: 40, z: 0 }, blockedBy: [] },
      { id: "b4", color: "pink", word: { german: "Kuchen", russian: "Торт", emoji: "🎂" }, position: { x: 35, y: 55, z: 1 }, blockedBy: ["b1"] },
      { id: "b5", color: "yellow", word: { german: "Brot", russian: "Хлеб", emoji: "🍞" }, position: { x: 60, y: 50, z: 1 }, blockedBy: ["b2", "b3"] },
      { id: "b6", color: "green", word: { german: "Sushi", russian: "Суши", emoji: "🍣" }, position: { x: 20, y: 65, z: 1 }, blockedBy: ["b1"] },
      { id: "b7", color: "pink", word: { german: "Steak", russian: "Стейк", emoji: "🥩" }, position: { x: 45, y: 70, z: 2 }, blockedBy: ["b4", "b5"] },
      { id: "b8", color: "yellow", word: { german: "Hallo", russian: "Привет", emoji: "👋" }, position: { x: 70, y: 65, z: 2 }, blockedBy: ["b5", "b6"] },
      { id: "b9", color: "green", word: { german: "Danke", russian: "Спасибо", emoji: "🙏" }, position: { x: 30, y: 75, z: 2 }, blockedBy: ["b6", "b7"] },
    ],
  },
  {
    id: 3,
    name: "BMW (не Audi! 😄)",
    objectEmoji: "🏎️",
    objectName: "Машина мечты",
    theme: "transport",
    colors: ["blue", "red", "yellow"],
    slotsPerColor: 3,
    difficulty: "medium",
    unlockRequirement: 2,
    bolts: [
      { id: "b1", color: "blue", word: { german: "Auto", russian: "Машина", emoji: "🚗" }, position: { x: 20, y: 30, z: 0 }, blockedBy: [] },
      { id: "b2", color: "red", word: { german: "Zug", russian: "Поезд", emoji: "🚆" }, position: { x: 50, y: 25, z: 0 }, blockedBy: [] },
      { id: "b3", color: "yellow", word: { german: "Bus", russian: "Автобус", emoji: "🚌" }, position: { x: 75, y: 35, z: 0 }, blockedBy: [] },
      { id: "b4", color: "blue", word: { german: "Flugzeug", russian: "Самолёт", emoji: "✈️" }, position: { x: 30, y: 50, z: 1 }, blockedBy: ["b1", "b2"] },
      { id: "b5", color: "red", word: { german: "Hund", russian: "Собака", emoji: "🐶" }, position: { x: 55, y: 45, z: 1 }, blockedBy: ["b2", "b3"] },
      { id: "b6", color: "yellow", word: { german: "Katze", russian: "Кошка", emoji: "🐱" }, position: { x: 15, y: 62, z: 1 }, blockedBy: ["b1"] },
      { id: "b7", color: "blue", word: { german: "Tanzen", russian: "Танцевать", emoji: "💃" }, position: { x: 42, y: 68, z: 2 }, blockedBy: ["b4", "b5"] },
      { id: "b8", color: "red", word: { german: "Reisen", russian: "Путешествовать", emoji: "✈️" }, position: { x: 65, y: 62, z: 2 }, blockedBy: ["b5", "b6"] },
      { id: "b9", color: "yellow", word: { german: "Lesen", russian: "Читать", emoji: "📚" }, position: { x: 28, y: 78, z: 2 }, blockedBy: ["b6", "b7"] },
    ],
  },
  {
    id: 4,
    name: "Пушистый щенок",
    objectEmoji: "🐶",
    objectName: "Щенок",
    theme: "animals",
    colors: ["pink", "purple", "green", "blue"],
    slotsPerColor: 3,
    difficulty: "medium",
    unlockRequirement: 3,
    bolts: [
      { id: "b1", color: "pink", word: { german: "Hund", russian: "Собака", emoji: "🐶" }, position: { x: 20, y: 25, z: 0 }, blockedBy: [] },
      { id: "b2", color: "purple", word: { german: "Katze", russian: "Кошка", emoji: "🐱" }, position: { x: 45, y: 20, z: 0 }, blockedBy: [] },
      { id: "b3", color: "green", word: { german: "Vogel", russian: "Птица", emoji: "🐦" }, position: { x: 68, y: 28, z: 0 }, blockedBy: [] },
      { id: "b4", color: "blue", word: { german: "Fisch", russian: "Рыба", emoji: "🐟" }, position: { x: 82, y: 20, z: 0 }, blockedBy: [] },
      { id: "b5", color: "pink", word: { german: "Pizza", russian: "Пицца", emoji: "🍕" }, position: { x: 30, y: 42, z: 1 }, blockedBy: ["b1", "b2"] },
      { id: "b6", color: "purple", word: { german: "Sushi", russian: "Суши", emoji: "🍣" }, position: { x: 55, y: 38, z: 1 }, blockedBy: ["b2", "b3"] },
      { id: "b7", color: "green", word: { german: "Wasser", russian: "Вода", emoji: "💧" }, position: { x: 75, y: 43, z: 1 }, blockedBy: ["b3", "b4"] },
      { id: "b8", color: "blue", word: { german: "Kaffee", russian: "Кофе", emoji: "☕" }, position: { x: 18, y: 57, z: 1 }, blockedBy: ["b1"] },
      { id: "b9", color: "pink", word: { german: "Danke", russian: "Спасибо", emoji: "🙏" }, position: { x: 40, y: 60, z: 2 }, blockedBy: ["b5", "b6"] },
      { id: "b10", color: "purple", word: { german: "Hallo", russian: "Привет", emoji: "👋" }, position: { x: 62, y: 57, z: 2 }, blockedBy: ["b6", "b7"] },
      { id: "b11", color: "green", word: { german: "Tanzen", russian: "Танцевать", emoji: "💃" }, position: { x: 25, y: 72, z: 2 }, blockedBy: ["b8", "b9"] },
      { id: "b12", color: "blue", word: { german: "Reisen", russian: "Путешествовать", emoji: "✈️" }, position: { x: 50, y: 75, z: 2 }, blockedBy: ["b9", "b10"] },
    ],
  },
  {
    id: 5,
    name: "Путешествие мечты",
    objectEmoji: "✈️",
    objectName: "Самолёт",
    theme: "hobbies",
    colors: ["pink", "blue", "yellow", "green", "purple"],
    slotsPerColor: 3,
    difficulty: "hard",
    unlockRequirement: 4,
    bolts: [
      { id: "b1", color: "pink", word: { german: "Tanzen", russian: "Танцевать", emoji: "💃" }, position: { x: 15, y: 20, z: 0 }, blockedBy: [] },
      { id: "b2", color: "blue", word: { german: "Reisen", russian: "Путешествовать", emoji: "✈️" }, position: { x: 35, y: 15, z: 0 }, blockedBy: [] },
      { id: "b3", color: "yellow", word: { german: "Kochen", russian: "Готовить", emoji: "👨‍🍳" }, position: { x: 55, y: 20, z: 0 }, blockedBy: [] },
      { id: "b4", color: "green", word: { german: "Lesen", russian: "Читать", emoji: "📚" }, position: { x: 75, y: 15, z: 0 }, blockedBy: [] },
      { id: "b5", color: "purple", word: { german: "Hund", russian: "Собака", emoji: "🐶" }, position: { x: 88, y: 28, z: 0 }, blockedBy: [] },
      { id: "b6", color: "pink", word: { german: "Sushi", russian: "Суши", emoji: "🍣" }, position: { x: 22, y: 38, z: 1 }, blockedBy: ["b1", "b2"] },
      { id: "b7", color: "blue", word: { german: "Steak", russian: "Стейк", emoji: "🥩" }, position: { x: 44, y: 33, z: 1 }, blockedBy: ["b2", "b3"] },
      { id: "b8", color: "yellow", word: { german: "Kaffee", russian: "Кофе", emoji: "☕" }, position: { x: 64, y: 38, z: 1 }, blockedBy: ["b3", "b4"] },
      { id: "b9", color: "green", word: { german: "Pizza", russian: "Пицца", emoji: "🍕" }, position: { x: 80, y: 43, z: 1 }, blockedBy: ["b4", "b5"] },
      { id: "b10", color: "purple", word: { german: "Wasser", russian: "Вода", emoji: "💧" }, position: { x: 10, y: 52, z: 1 }, blockedBy: ["b1"] },
      { id: "b11", color: "pink", word: { german: "Auto", russian: "Машина", emoji: "🚗" }, position: { x: 32, y: 55, z: 2 }, blockedBy: ["b6", "b7"] },
      { id: "b12", color: "blue", word: { german: "Zug", russian: "Поезд", emoji: "🚆" }, position: { x: 54, y: 52, z: 2 }, blockedBy: ["b7", "b8"] },
      { id: "b13", color: "yellow", word: { german: "Danke", russian: "Спасибо", emoji: "🙏" }, position: { x: 72, y: 57, z: 2 }, blockedBy: ["b8", "b9"] },
      { id: "b14", color: "green", word: { german: "Hallo", russian: "Привет", emoji: "👋" }, position: { x: 20, y: 68, z: 2 }, blockedBy: ["b10", "b11"] },
      { id: "b15", color: "purple", word: { german: "Bitte", russian: "Пожалуйста", emoji: "😊" }, position: { x: 44, y: 72, z: 2 }, blockedBy: ["b11", "b12"] },
    ],
  },
];
