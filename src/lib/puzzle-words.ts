export interface PuzzleWord {
  german: string;
  russian: string;
  emoji: string;
}

export const puzzleWordsByTheme: Record<string, PuzzleWord[]> = {
  greetings: [
    { german: "Hallo", russian: "Привет", emoji: "👋" },
    { german: "Danke", russian: "Спасибо", emoji: "🙏" },
    { german: "Bitte", russian: "Пожалуйста", emoji: "😊" },
    { german: "Tschüss", russian: "Пока", emoji: "👋" },
    { german: "Ja", russian: "Да", emoji: "✅" },
    { german: "Nein", russian: "Нет", emoji: "❌" },
  ],
  food: [
    { german: "Pizza", russian: "Пицца", emoji: "🍕" },
    { german: "Kaffee", russian: "Кофе", emoji: "☕" },
    { german: "Wasser", russian: "Вода", emoji: "💧" },
    { german: "Kuchen", russian: "Торт", emoji: "🎂" },
    { german: "Brot", russian: "Хлеб", emoji: "🍞" },
    { german: "Sushi", russian: "Суши", emoji: "🍣" },
    { german: "Steak", russian: "Стейк", emoji: "🥩" },
  ],
  animals: [
    { german: "Hund", russian: "Собака", emoji: "🐶" },
    { german: "Katze", russian: "Кошка", emoji: "🐱" },
    { german: "Vogel", russian: "Птица", emoji: "🐦" },
    { german: "Fisch", russian: "Рыба", emoji: "🐟" },
  ],
  transport: [
    { german: "Auto", russian: "Машина", emoji: "🚗" },
    { german: "Zug", russian: "Поезд", emoji: "🚆" },
    { german: "Bus", russian: "Автобус", emoji: "🚌" },
    { german: "Flugzeug", russian: "Самолёт", emoji: "✈️" },
  ],
  hobbies: [
    { german: "Tanzen", russian: "Танцевать", emoji: "💃" },
    { german: "Reisen", russian: "Путешествовать", emoji: "✈️" },
    { german: "Kochen", russian: "Готовить", emoji: "👨‍🍳" },
    { german: "Lesen", russian: "Читать", emoji: "📚" },
  ],
};

const allWords: PuzzleWord[] = Object.values(puzzleWordsByTheme).flat();

export function getDistractors(correctWord: PuzzleWord, count: number = 3): string[] {
  const others = allWords.filter((w) => w.german !== correctWord.german);
  const shuffled = others.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((w) => w.russian);
}

export function buildOptions(correctWord: PuzzleWord): { options: string[]; correctIndex: number } {
  const distractors = getDistractors(correctWord, 3);
  const options = [...distractors];
  const correctIndex = Math.floor(Math.random() * 4);
  options.splice(correctIndex, 0, correctWord.russian);
  return { options, correctIndex };
}
