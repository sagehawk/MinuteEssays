import { EssayHistoryItem } from '../types';

const STORAGE_KEY = 'minute_essays_history';

export const saveEssayToHistory = (essay: EssayHistoryItem) => {
  try {
    const existing = getEssayHistory();
    const updated = [essay, ...existing]; // Add new one to top
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save to local storage", e);
  }
};

export const getEssayHistory = (): EssayHistoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};