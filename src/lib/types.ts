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
}
