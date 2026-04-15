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

// ─── Exercise types ─────────────────────────────────────────

export interface ChooseExercise {
  type: "choose";
  question: string;
  options: string[];
  correctIndex: number;
}

export interface FillExercise {
  type: "fill";
  sentence: string;
  correctAnswer: string;
  hint?: string;
}

export interface WordOrderExercise {
  type: "word_order";
  question: string;
  words: string[];
  correctOrder: string;
}

export interface TranslateExercise {
  type: "translate";
  phrase: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
}

export type Exercise = ChooseExercise | FillExercise | WordOrderExercise | TranslateExercise;

export interface TestQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

// ─── Dialogue ───────────────────────────────────────────────

export interface DialogueLine {
  speaker: string;
  german: string;
  russian: string;
}

export interface DialogueExample {
  title: string;
  lines: DialogueLine[];
}

// ─── Day plan ───────────────────────────────────────────────

export interface DayPlan {
  day: number;
  title: string;
  description: string;
  grammarTopic?: string;
  grammarExplanation?: string;
  reviewWords?: Word[];
  words: Word[];
  phrases: Phrase[];
  exercises?: Exercise[];
  test: TestQuestion[];
  dialogueExample?: DialogueExample;
  /** @deprecated kept for backward compat with old localStorage data */
  exercise?: ChooseExercise;
}

export interface LearningPlan {
  level: number;
  days: DayPlan[];
  assessedLevel?: string;
  goal?: string;
}

// ─── Diagnostic / Assessment ────────────────────────────────

export type AssessedLevel = "A0" | "A0+" | "A1-" | "A1";

export interface DiagnosticQuestion {
  id: string;
  difficulty: "zero" | "basic" | "grammar" | "phrases";
  question: string;
  options: string[];
  correctIndex: number;
}

export interface AssessmentResult {
  score: number;
  total: number;
  level: AssessedLevel;
  details: { questionId: string; correct: boolean }[];
}

// ─── Existing types ─────────────────────────────────────────

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
  moodMessage: string | null;
  moodMessageTitle: string | null;
  moodMessageDate: string | null;
  moodSectionDismissedDate: string | null;
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
  assessmentResult: AssessmentResult | null;
}
