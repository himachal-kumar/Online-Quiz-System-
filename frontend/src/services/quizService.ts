import { Quiz, QuizAttempt, LeaderboardEntry } from '../types/quiz';
import { mockDataService } from './mockData';

export const quizService = {
  // Get all quizzes
  getQuizzes: (): Promise<Quiz[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const quizzes = mockDataService.getQuizzes();
        resolve(quizzes);
      }, 500);
    });
  },
  
  // Get published quizzes (for regular users)
  getPublishedQuizzes: (): Promise<Quiz[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const quizzes = mockDataService.getQuizzes();
        const publishedQuizzes = quizzes.filter(quiz => quiz.isPublished);
        resolve(publishedQuizzes);
      }, 500);
    });
  },
  
  // Get quiz by ID
  getQuizById: (id: string): Promise<Quiz> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const quiz = mockDataService.getQuizById(id);
        if (quiz) {
          resolve(quiz);
        } else {
          reject(new Error('Quiz not found'));
        }
      }, 300);
    });
  },
  
  // Create a new quiz
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>): Promise<Quiz> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const newQuiz = mockDataService.createQuiz(quiz);
        resolve(newQuiz);
      }, 700);
    });
  },
  
  // Update an existing quiz
  updateQuiz: (quiz: Quiz): Promise<Quiz> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const existingQuiz = mockDataService.getQuizById(quiz.id);
        if (!existingQuiz) {
          reject(new Error('Quiz not found'));
          return;
        }
        
        const updatedQuiz = mockDataService.updateQuiz(quiz);
        resolve(updatedQuiz);
      }, 600);
    });
  },
  
  // Delete a quiz
  deleteQuiz: (id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const existingQuiz = mockDataService.getQuizById(id);
        if (!existingQuiz) {
          reject(new Error('Quiz not found'));
          return;
        }
        
        const result = mockDataService.deleteQuiz(id);
        resolve(result);
      }, 500);
    });
  },
  
  // Start a quiz attempt
  startQuizAttempt: (quizId: string, userId: string): Promise<QuizAttempt> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const quiz = mockDataService.getQuizById(quizId);
        if (!quiz) {
          reject(new Error('Quiz not found'));
          return;
        }
        
        // Create a new attempt
        const newAttempt: Omit<QuizAttempt, 'id'> = {
          quizId,
          userId,
          startedAt: new Date().toISOString(),
          timeSpent: 0,
          score: 0,
          maxScore: quiz.questions.reduce((total, q) => total + q.points, 0),
          answers: [],
        };
        
        const attempt = mockDataService.createAttempt(newAttempt);
        resolve(attempt);
      }, 400);
    });
  },
  
  // Submit a quiz attempt
  submitQuizAttempt: (attempt: QuizAttempt): Promise<QuizAttempt> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const quiz = mockDataService.getQuizById(attempt.quizId);
        if (!quiz) {
          reject(new Error('Quiz not found'));
          return;
        }
        
        // Calculate score based on answers
        let score = 0;
        const updatedAnswers = attempt.answers.map(answer => {
          const question = quiz.questions.find(q => q.id === answer.questionId);
          const isCorrect = question?.correctOptionId === answer.selectedOptionId;
          
          if (isCorrect && question) {
            score += question.points;
          }
          
          return {
            ...answer,
            isCorrect: isCorrect || false,
          };
        });
        
        // Update the attempt with final data
        const updatedAttempt: QuizAttempt = {
          ...attempt,
          completedAt: new Date().toISOString(),
          score,
          answers: updatedAnswers,
        };
        
        const savedAttempt = mockDataService.updateAttempt(updatedAttempt);
        resolve(savedAttempt);
      }, 800);
    });
  },
  
  // Get attempts by user ID
  getAttemptsByUserId: (userId: string): Promise<QuizAttempt[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const attempts = mockDataService.getAttemptsByUserId(userId);
        resolve(attempts);
      }, 500);
    });
  },
  
  // Get attempt by ID
  getAttemptById: (id: string): Promise<QuizAttempt> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const attempt = mockDataService.getAttemptById(id);
        if (attempt) {
          resolve(attempt);
        } else {
          reject(new Error('Attempt not found'));
        }
      }, 300);
    });
  },
  
  // Get leaderboard for a quiz
  getLeaderboard: (quizId: string): Promise<LeaderboardEntry[]> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const quiz = mockDataService.getQuizById(quizId);
        if (!quiz) {
          reject(new Error('Quiz not found'));
          return;
        }
        
        const leaderboard = mockDataService.getLeaderboard(quizId);
        resolve(leaderboard);
      }, 600);
    });
  },
};