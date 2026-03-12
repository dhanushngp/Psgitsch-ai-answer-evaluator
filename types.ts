
export enum AppState {
  IDLE,
  PROCESSING,
  RESULTS,
  ERROR,
}

export interface EvaluationHistoryItem {
  timestamp: string;
  score: number;
  feedbackSummary: string;
}

export interface User {
  email: string;
  password?: string;
  history?: EvaluationHistoryItem[];
}

export interface QAPair {
  question: string;
  answer: string;
  feedback: string;
  score: number;
}

export interface EvaluationResult {
  overallScore: number;
  generalFeedback: string;
  evaluations: QAPair[];
}