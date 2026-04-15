export interface UserPreferences {
  level: "beginner" | "basic" | "intermediate";
  goal: "switzerland" | "work" | "travel" | "fun";
  minutesPerDay: 5 | 10 | 20;
}

export interface Word {
  german: string;
  russian: string;
  example?: string;
}

export interface Phrase {
  german: string;
  russian: string;
  context: string;
}

export interface Exercise {
  type: "choose" | "fill";
  question: string;
  options: string[];
  correctIndex: number;
}

export interface TestQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface DayPlan {
  day: number;
  title: string;
  description: string;
  words: Word[];
  phrases: Phrase[];
  exercise: Exercise;
  test: TestQuestion[];
}

export interface LearningPlan {
  level: number;
  days: DayPlan[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ScenarioProgress {
  scenarioId: string;
  currentStep: number;
  completed: boolean;
  startedAt: number;
}

export type Mood = "great" | "good" | "tired" | "bad";

export interface VocabularyItem {
  german: string;
  russian: string;
  example: string;
  topic: string;
  dayId: number;
  learnedAt: string;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  type: "translate_de_ru" | "translate_ru_de" | "fill_phrase" | "match_emoji";
  question: string;
  correct: string;
  options: string[];
  dayId: number;
  explanation?: string;
}

export interface Surprise {
  id: string;
  category: "S" | "A" | "B";
  type: "message" | "animation" | "certificate" | "poem" | "challenge";
  content: {
    title: string;
    animation: "confetti" | "float-hearts" | "sparkles" | "shimmer" | "soft-pulse";
    message: string;
    emoji: string;
  };
}

export interface WordleWord {
  word: string;
  translation: string;
  hint: string;
  emoji: string;
}

export interface WordleGuessResult {
  letter: string;
  status: "correct" | "present" | "absent";
}

export interface QuizState {
  lastPlayedDate: string | null;
  lastScore: number | null;
  totalQuizzesTaken: number;
  totalCorrectAnswers: number;
  lastSurpriseId: string | null;
}

export interface WordleState {
  currentWordIndex: number;
  currentGuesses: string[];
  gameStatus: "playing" | "won" | "lost";
  hintsUsed: number;
  lastCompletedWordIndex: number | null;
  stats: {
    played: number;
    won: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
  };
}

export interface AppState {
  preferences: UserPreferences | null;
  plan: LearningPlan | null;
  currentDay: number;
  completedDays: number[];
  streak: number;
  lastActiveDate: string | null;
  onboardingComplete: boolean;
  currentLevel: number;
  chatHistory: ChatMessage[];
  scenarioProgress: Record<string, ScenarioProgress>;
  moodToday: Mood | null;
  moodDate: string | null;
  vocabulary: VocabularyItem[];
  totalMinutesSpent: number;
  totalWordsLearned: number;
  testAccuracy: number;
  chatMessagesCount: number;
  scenariosCompleted: string[];
  unlockedAchievements: string[];
  newAchievements: string[];
  foundEasterEgg: boolean;
  studiedLate: boolean;
  studiedEarly: boolean;
  quiz: QuizState;
  wordle: WordleState;
}
