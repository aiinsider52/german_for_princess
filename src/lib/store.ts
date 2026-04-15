"use client";

import {
  AppState,
  ChatMessage,
  LearningPlan,
  ScenarioProgress,
  UserPreferences,
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

  const newState: AppState = {
    ...state,
    completedDays: completed,
    currentDay: Math.min(day + 1, 14),
    streak: isNewDay ? state.streak + 1 : state.streak,
    lastActiveDate: today,
  };

  saveState(newState);
  return newState;
}

export function setPreferences(
  state: AppState,
  preferences: UserPreferences
): AppState {
  const newState: AppState = {
    ...state,
    preferences,
  };
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
  const newState: AppState = {
    ...state,
    chatHistory: [...state.chatHistory, ...messages],
  };
  saveState(newState);
  return newState;
}

export function clearChatHistory(state: AppState): AppState {
  const newState: AppState = {
    ...state,
    chatHistory: [],
  };
  saveState(newState);
  return newState;
}

export function updateScenarioProgress(
  state: AppState,
  progress: ScenarioProgress
): AppState {
  const newState: AppState = {
    ...state,
    scenarioProgress: {
      ...state.scenarioProgress,
      [progress.scenarioId]: progress,
    },
  };
  saveState(newState);
  return newState;
}

export function resetApp(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
