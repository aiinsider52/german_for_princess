"use client";

import {
  AppState,
  ChatMessage,
  LearningPlan,
  Mood,
  ScenarioProgress,
  UserPreferences,
  VocabularyItem,
} from "./types";

const STORAGE_KEY = "julia-german-app";

const defaultState: AppState = {
  preferences: null,
  plan: null,
  currentDay: 1,
  completedDays: [],
  streak: 0,
  lastActiveDate: null,
  onboardingComplete: false,
  currentLevel: 1,
  chatHistory: [],
  scenarioProgress: {},
  moodToday: null,
  moodDate: null,
  vocabulary: [],
  totalMinutesSpent: 0,
  totalWordsLearned: 0,
  testAccuracy: 0,
  chatMessagesCount: 0,
  scenariosCompleted: [],
  unlockedAchievements: [],
  newAchievements: [],
  foundEasterEgg: false,
  studiedLate: false,
  studiedEarly: false,
};

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState;
    const parsed = JSON.parse(saved);
    const state: AppState = { ...defaultState, ...parsed };
    return updateStreak(state);
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updateStreak(state: AppState): AppState {
  if (!state.lastActiveDate) return state;
  const last = new Date(state.lastActiveDate);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays > 1) {
    return { ...state, streak: 0 };
  }
  return state;
}

export function completeDay(state: AppState, day: number): AppState {
  const today = new Date().toISOString().split("T")[0];
  const isNewDay = state.lastActiveDate !== today;
  const completed = state.completedDays.includes(day)
    ? state.completedDays
    : [...state.completedDays, day];

  const plan = state.plan;
  let newVocab = state.vocabulary;
  let newWordsCount = state.totalWordsLearned;
  if (plan && !state.completedDays.includes(day)) {
    const dayPlan = plan.days.find((d) => d.day === day);
    if (dayPlan) {
      const newWords: VocabularyItem[] = dayPlan.words
        .filter((w) => !state.vocabulary.some((v) => v.german === w.german))
        .map((w) => ({
          german: w.german,
          russian: w.russian,
          example: w.example || "",
          topic: dayPlan.title,
          dayId: day,
          learnedAt: today,
        }));
      newVocab = [...state.vocabulary, ...newWords];
      newWordsCount = newVocab.length;
    }
  }

  const hour = new Date().getHours();

  const newState: AppState = {
    ...state,
    completedDays: completed,
    currentDay: Math.min(day + 1, 14),
    streak: isNewDay ? state.streak + 1 : state.streak,
    lastActiveDate: today,
    vocabulary: newVocab,
    totalWordsLearned: newWordsCount,
    totalMinutesSpent: state.totalMinutesSpent + 10,
    studiedLate: state.studiedLate || hour >= 22,
    studiedEarly: state.studiedEarly || hour < 8,
  };

  saveState(newState);
  return newState;
}

export function setPreferences(
  state: AppState,
  preferences: UserPreferences
): AppState {
  const newState: AppState = { ...state, preferences };
  saveState(newState);
  return newState;
}

export function setPlan(state: AppState, plan: LearningPlan): AppState {
  const newState: AppState = {
    ...state,
    plan,
    onboardingComplete: true,
    currentDay: 1,
    completedDays: [],
  };
  saveState(newState);
  return newState;
}

export function startNextLevel(state: AppState): AppState {
  const newState: AppState = {
    ...state,
    currentLevel: state.currentLevel + 1,
    plan: null,
    currentDay: 1,
    completedDays: [],
    onboardingComplete: false,
  };
  saveState(newState);
  return newState;
}

export function addChatMessages(
  state: AppState,
  messages: ChatMessage[]
): AppState {
  const userMsgCount = messages.filter((m) => m.role === "user").length;
  const newState: AppState = {
    ...state,
    chatHistory: [...state.chatHistory, ...messages],
    chatMessagesCount: state.chatMessagesCount + userMsgCount,
  };
  saveState(newState);
  return newState;
}

export function clearChatHistory(state: AppState): AppState {
  const newState: AppState = { ...state, chatHistory: [] };
  saveState(newState);
  return newState;
}

export function updateScenarioProgress(
  state: AppState,
  progress: ScenarioProgress
): AppState {
  const completedList = progress.completed && !state.scenariosCompleted.includes(progress.scenarioId)
    ? [...state.scenariosCompleted, progress.scenarioId]
    : state.scenariosCompleted;

  const newState: AppState = {
    ...state,
    scenarioProgress: {
      ...state.scenarioProgress,
      [progress.scenarioId]: progress,
    },
    scenariosCompleted: completedList,
  };
  saveState(newState);
  return newState;
}

export function setMood(state: AppState, mood: Mood): AppState {
  const today = new Date().toISOString().split("T")[0];
  const newState: AppState = { ...state, moodToday: mood, moodDate: today };
  saveState(newState);
  return newState;
}

export function updateTestAccuracy(state: AppState, correct: number, total: number): AppState {
  const oldTotal = state.testAccuracy > 0 ? 100 : 0;
  const newAccuracy = oldTotal > 0
    ? Math.round((state.testAccuracy + (correct / total) * 100) / 2)
    : Math.round((correct / total) * 100);
  const newState: AppState = { ...state, testAccuracy: newAccuracy };
  saveState(newState);
  return newState;
}

export function setFoundEasterEgg(state: AppState): AppState {
  const newState: AppState = { ...state, foundEasterEgg: true };
  saveState(newState);
  return newState;
}

export function unlockAchievement(state: AppState, achievementId: string): AppState {
  if (state.unlockedAchievements.includes(achievementId)) return state;
  const newState: AppState = {
    ...state,
    unlockedAchievements: [...state.unlockedAchievements, achievementId],
    newAchievements: [...state.newAchievements, achievementId],
  };
  saveState(newState);
  return newState;
}

export function clearNewAchievements(state: AppState): AppState {
  const newState: AppState = { ...state, newAchievements: [] };
  saveState(newState);
  return newState;
}

export function resetApp(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
