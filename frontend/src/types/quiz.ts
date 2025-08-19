export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questions: Question[];
  createdBy: string;
  createdAt: string;
  isPublished: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
  points: number;
}

export interface Option {
  id: string;
  text: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // in seconds
  score: number;
  maxScore: number;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  email: string;
  avatar?: string;
  score: number;
  timeSpent: number; // in seconds
  completedAt: string;
}