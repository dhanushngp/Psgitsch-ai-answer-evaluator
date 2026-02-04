
export enum AppState {
  IDLE,
  PROCESSING,
  RESULTS,
  ERROR,
}

export interface User {
  email: string;
  password?: string;
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