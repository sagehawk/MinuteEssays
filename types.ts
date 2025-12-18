export enum AppPhase {
  IDLE = 'IDLE',
  WRITING = 'WRITING',
  COMPLETED = 'COMPLETED',
  REVIEWING = 'REVIEWING'
}

export interface SectionConfig {
  id: string;
  title: string;
  description: string;
  suggestedWordCount: number;
}

export interface EssayData {
  topic: string;
  sections: { [key: string]: string };
  totalTimeSeconds: number;
}

export interface EssayHistoryItem extends EssayData {
  id: string;
  date: string; // ISO string
  wpm: number;
}

export interface AIReviewResult {
  feedback: string;
}