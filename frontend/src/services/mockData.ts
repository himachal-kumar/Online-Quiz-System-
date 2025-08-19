import { Quiz, QuizAttempt, LeaderboardEntry } from '../types/quiz';
import { User, UserRole } from '../types/user';

// Initial mock data
const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
  },
];

const initialQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'JavaScript Basics',
    description: 'Test your knowledge of JavaScript fundamentals',
    timeLimit: 10, // 10 minutes
    questions: [
      {
        id: '1',
        text: 'What is JavaScript?',
        options: [
          { id: '1', text: 'A programming language' },
          { id: '2', text: 'A markup language' },
          { id: '3', text: 'A styling language' },
          { id: '4', text: 'A database' },
        ],
        correctOptionId: '1',
        points: 10,
      },
      {
        id: '2',
        text: 'Which keyword is used to declare a variable in JavaScript?',
        options: [
          { id: '1', text: 'var' },
          { id: '2', text: 'int' },
          { id: '3', text: 'string' },
          { id: '4', text: 'declare' },
        ],
        correctOptionId: '1',
        points: 10,
      },
    ],
    createdBy: '1',
    createdAt: new Date().toISOString(),
    isPublished: true,
  },
  {
    id: '2',
    title: 'React Fundamentals',
    description: 'Test your knowledge of React library and its core concepts',
    timeLimit: 15,
    questions: [
      {
        id: '1',
        text: 'What is React?',
        options: [
          { id: '1', text: 'A JavaScript library for building user interfaces' },
          { id: '2', text: 'A programming language' },
          { id: '3', text: 'A database management system' },
          { id: '4', text: 'A backend framework' },
        ],
        correctOptionId: '1',
        points: 10,
      },
      {
        id: '2',
        text: 'What is JSX?',
        options: [
          { id: '1', text: 'A syntax extension for JavaScript' },
          { id: '2', text: 'A new programming language' },
          { id: '3', text: 'A database query language' },
          { id: '4', text: 'A styling framework' },
        ],
        correctOptionId: '1',
        points: 10,
      },
    ],
    createdBy: '1',
    createdAt: new Date().toISOString(),
    isPublished: true,
  },
  {
    id: '3',
    title: 'CSS and Styling',
    description: 'Test your knowledge of CSS and modern styling techniques',
    timeLimit: 12,
    questions: [
      {
        id: '1',
        text: 'What does CSS stand for?',
        options: [
          { id: '1', text: 'Cascading Style Sheets' },
          { id: '2', text: 'Computer Style Sheets' },
          { id: '3', text: 'Creative Style Sheets' },
          { id: '4', text: 'Colorful Style Sheets' },
        ],
        correctOptionId: '1',
        points: 10,
      },
      {
        id: '2',
        text: 'Which property is used to change the background color?',
        options: [
          { id: '1', text: 'background-color' },
          { id: '2', text: 'color' },
          { id: '3', text: 'bgcolor' },
          { id: '4', text: 'background' },
        ],
        correctOptionId: '1',
        points: 10,
      },
    ],
    createdBy: '1',
    createdAt: new Date().toISOString(),
    isPublished: true,
  },
];

const initialAttempts: QuizAttempt[] = [];

// Helper function to initialize localStorage with mock data
export const initializeMockData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(initialUsers));
  }
  
  if (!localStorage.getItem('quizzes')) {
    localStorage.setItem('quizzes', JSON.stringify(initialQuizzes));
  }
  
  if (!localStorage.getItem('attempts')) {
    localStorage.setItem('attempts', JSON.stringify(initialAttempts));
  }

  // Auto-login for testing without backend
  if (!localStorage.getItem('access_token')) {
    // Create mock tokens
    const mockAccessToken = 'mock-access-token-' + Date.now();
    const mockRefreshToken = 'mock-refresh-token-' + Date.now();
    
    // Set tokens in localStorage
    localStorage.setItem('access_token', mockAccessToken);
    localStorage.setItem('refresh_token', mockRefreshToken);
    
    // Set default user (use the regular user, not admin)
    localStorage.setItem('current_user', JSON.stringify(initialUsers[1]));
  }
};

// Mock data service functions
export const mockDataService = {
  // User related functions
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  },
  
  getUserById: (id: string): User | undefined => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find((user: User) => user.id === id);
  },
  
  createUser: (user: Omit<User, 'id' | 'createdAt'>): User => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  },
  
  updateUser: (user: User): User => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex((u: User) => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
    return user;
  },
  
  // Quiz related functions
  getQuizzes: (): Quiz[] => {
    return JSON.parse(localStorage.getItem('quizzes') || '[]');
  },
  
  getQuizById: (id: string): Quiz | undefined => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    return quizzes.find((quiz: Quiz) => quiz.id === id);
  },
  
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>): Quiz => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const newQuiz: Quiz = {
      ...quiz,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    quizzes.push(newQuiz);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    return newQuiz;
  },
  
  updateQuiz: (quiz: Quiz): Quiz => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const index = quizzes.findIndex((q: Quiz) => q.id === quiz.id);
    if (index !== -1) {
      quizzes[index] = quiz;
      localStorage.setItem('quizzes', JSON.stringify(quizzes));
    }
    return quiz;
  },
  
  deleteQuiz: (id: string): boolean => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const filteredQuizzes = quizzes.filter((quiz: Quiz) => quiz.id !== id);
    localStorage.setItem('quizzes', JSON.stringify(filteredQuizzes));
    return quizzes.length !== filteredQuizzes.length;
  },
  
  // Quiz attempt related functions
  getAttempts: (): QuizAttempt[] => {
    return JSON.parse(localStorage.getItem('attempts') || '[]');
  },
  
  getAttemptById: (id: string): QuizAttempt | undefined => {
    const attempts = JSON.parse(localStorage.getItem('attempts') || '[]');
    return attempts.find((attempt: QuizAttempt) => attempt.id === id);
  },
  
  getAttemptsByUserId: (userId: string): QuizAttempt[] => {
    const attempts = JSON.parse(localStorage.getItem('attempts') || '[]');
    return attempts.filter((attempt: QuizAttempt) => attempt.userId === userId);
  },
  
  getAttemptsByQuizId: (quizId: string): QuizAttempt[] => {
    const attempts = JSON.parse(localStorage.getItem('attempts') || '[]');
    return attempts.filter((attempt: QuizAttempt) => attempt.quizId === quizId);
  },
  
  createAttempt: (attempt: Omit<QuizAttempt, 'id'>): QuizAttempt => {
    const attempts = JSON.parse(localStorage.getItem('attempts') || '[]');
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: Date.now().toString(),
    };
    attempts.push(newAttempt);
    localStorage.setItem('attempts', JSON.stringify(attempts));
    return newAttempt;
  },
  
  updateAttempt: (attempt: QuizAttempt): QuizAttempt => {
    const attempts = JSON.parse(localStorage.getItem('attempts') || '[]');
    const index = attempts.findIndex((a: QuizAttempt) => a.id === attempt.id);
    if (index !== -1) {
      attempts[index] = attempt;
      localStorage.setItem('attempts', JSON.stringify(attempts));
    }
    return attempt;
  },
  
  // Leaderboard related functions
  getLeaderboard: (quizId: string): LeaderboardEntry[] => {
    const attempts = JSON.parse(localStorage.getItem('attempts') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Filter completed attempts for the specific quiz
    const quizAttempts = attempts.filter(
      (attempt: QuizAttempt) => attempt.quizId === quizId && attempt.completedAt
    );
    
    // Create leaderboard entries
    const leaderboardEntries: LeaderboardEntry[] = quizAttempts.map((attempt: QuizAttempt) => {
      const user = users.find((u: User) => u.id === attempt.userId);
      const started = attempt.startedAt ? new Date(attempt.startedAt).getTime() : 0;
      const completed = attempt.completedAt ? new Date(attempt.completedAt).getTime() : started;
      const timeSpentSeconds = started && completed ? Math.max(0, Math.floor((completed - started) / 1000)) : attempt.timeSpent || 0;
      return {
        userId: attempt.userId,
        username: user ? user.username : 'Unknown User',
        email: user ? user.email : '',
        avatar: user?.avatar,
        score: attempt.score,
        timeSpent: timeSpentSeconds,
        completedAt: attempt.completedAt || '',
      };
    });
    
    // Sort by score (descending) and then by time spent (ascending)
    return leaderboardEntries.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return a.timeSpent - b.timeSpent;
    });
  },
};