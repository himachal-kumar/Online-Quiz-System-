import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quiz, QuizAttempt } from '../../types/quiz';

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  currentAttempt: QuizAttempt | null;
  userAttempts: QuizAttempt[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  currentAttempt: null,
  userAttempts: [],
  loading: false,
  error: null,
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload;
    },
    setCurrentQuiz: (state, action: PayloadAction<Quiz | null>) => {
      state.currentQuiz = action.payload;
    },
    setCurrentAttempt: (state, action: PayloadAction<QuizAttempt | null>) => {
      state.currentAttempt = action.payload;
    },
    setUserAttempts: (state, action: PayloadAction<QuizAttempt[]>) => {
      state.userAttempts = action.payload;
    },
    addQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes.push(action.payload);
    },
    updateQuiz: (state, action: PayloadAction<Quiz>) => {
      const index = state.quizzes.findIndex(quiz => quiz.id === action.payload.id);
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
    },
    deleteQuiz: (state, action: PayloadAction<string>) => {
      state.quizzes = state.quizzes.filter(quiz => quiz.id !== action.payload);
    },
    addAttempt: (state, action: PayloadAction<QuizAttempt>) => {
      state.userAttempts.push(action.payload);
    },
    updateAttempt: (state, action: PayloadAction<QuizAttempt>) => {
      const index = state.userAttempts.findIndex(attempt => attempt.id === action.payload.id);
      if (index !== -1) {
        state.userAttempts[index] = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setQuizzes,
  setCurrentQuiz,
  setCurrentAttempt,
  setUserAttempts,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  addAttempt,
  updateAttempt,
} = quizSlice.actions;

export default quizSlice.reducer;