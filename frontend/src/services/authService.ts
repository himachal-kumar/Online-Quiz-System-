import { User, UserRole } from '../types/user';
import { mockDataService } from './mockData';

// Simulated JWT token generation
const generateToken = (user: User, expiry: number): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + expiry,
  };
  
  return btoa(JSON.stringify(payload));
};

// Simulated JWT token verification
const verifyToken = (token: string): { valid: boolean; payload?: any } => {
  try {
    const payload = JSON.parse(atob(token));
    const isExpired = payload.exp < Date.now();
    
    if (isExpired) {
      return { valid: false };
    }
    
    return { valid: true, payload };
  } catch (error) {
    return { valid: false };
  }
};

export const authService = {
  // Login with email and password
  login: (email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const users = mockDataService.getUsers();
        const user = users.find((u) => u.email === email);
        
        // In a real app, we would check password hash
        // For this mock, we'll accept any password
        if (user) {
          const accessToken = generateToken(user, 15 * 60 * 1000); // 15 minutes
          const refreshToken = generateToken(user, 7 * 24 * 60 * 60 * 1000); // 7 days
          
          resolve({ accessToken, refreshToken, user });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },
  
  // Logout user
  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // In a real app, we would invalidate the token on the server
        // For this mock, we'll just resolve the promise
        resolve();
      }, 300);
    });
  },
  
  // Register new user
  register: (username: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const users = mockDataService.getUsers();
        const existingUser = users.find((u) => u.email === email);
        
        if (existingUser) {
          reject(new Error('Email already in use'));
          return;
        }
        
        const newUser = mockDataService.createUser({
          username,
          email,
          role: UserRole.USER, // Default role for new users
        });
        
        resolve(newUser);
      }, 500);
    });
  },
  
  // Refresh access token using refresh token
  refreshToken: (refreshToken: string): Promise<{ accessToken: string }> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const verification = verifyToken(refreshToken);
        
        if (verification.valid && verification.payload) {
          const userId = verification.payload.id;
          const user = mockDataService.getUserById(userId);
          
          if (user) {
            const accessToken = generateToken(user, 15 * 60 * 1000); // 15 minutes
            resolve({ accessToken });
          } else {
            reject(new Error('User not found'));
          }
        } else {
          reject(new Error('Invalid refresh token'));
        }
      }, 500);
    });
  },
  
  // Get current user from token
  getCurrentUser: (accessToken: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const verification = verifyToken(accessToken);
      
      if (verification.valid && verification.payload) {
        const userId = verification.payload.id;
        const user = mockDataService.getUserById(userId);
        
        if (user) {
          resolve(user);
        } else {
          reject(new Error('User not found'));
        }
      } else {
        reject(new Error('Invalid access token'));
      }
    });
  },
  
  // Mock OAuth login (simulates receiving a token from OAuth provider)
  oauthLogin: (provider: string, token: string): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // In a real app, we would validate the token with the provider
        // For this mock, we'll create a user if they don't exist
        
        // Generate mock user data based on provider and token
        const mockEmail = `user_${Date.now()}@${provider}.com`;
        const mockUsername = `${provider}User${Date.now().toString().slice(-4)}`;
        
        const users = mockDataService.getUsers();
        let user = users.find((u) => u.email === mockEmail);
        
        if (!user) {
          user = mockDataService.createUser({
            username: mockUsername,
            email: mockEmail,
            role: UserRole.USER,
          });
        }
        
        const accessToken = generateToken(user, 15 * 60 * 1000); // 15 minutes
        const refreshToken = generateToken(user, 7 * 24 * 60 * 60 * 1000); // 7 days
        
        resolve({ accessToken, refreshToken, user });
      }, 800);
    });
  },
};