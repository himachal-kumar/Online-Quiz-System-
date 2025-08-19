import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Divider,
  Grid,
  Paper,
  Chip,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { setTokens } from '../store/reducers/authReducer';
import { User, UserRole } from '../types/user';
import { quizService } from '../services/quizService';
import { QuizAttempt } from '../types/quiz';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScoreIcon from '@mui/icons-material/Score';

const BypassLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showProfileForm, setShowProfileForm] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  const [users, setUsers] = useState<User[]>([
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
    {
      id: '3',
      username: 'john_doe',
      email: 'john@example.com',
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      username: 'jane_smith',
      email: 'jane@example.com',
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
    }
  ]);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userAttempts, setUserAttempts] = useState<QuizAttempt[]>([]);
  const [quizTitles, setQuizTitles] = useState<{[key: string]: string}>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch user's quiz attempts when a user is selected
  useEffect(() => {
    const fetchUserAttempts = async () => {
      if (selectedUser) {
        try {
          const attempts = await quizService.getAttemptsByUserId(selectedUser.id);
          setUserAttempts(attempts);
          
          // Fetch quiz titles for each attempt
          const titles: {[key: string]: string} = {};
          for (const attempt of attempts) {
            try {
              const quiz = await quizService.getQuizById(attempt.quizId);
              titles[attempt.quizId] = quiz.title;
            } catch (error) {
              titles[attempt.quizId] = 'Unknown Quiz';
            }
          }
          setQuizTitles(titles);
        } catch (error) {
          console.error('Failed to fetch user attempts:', error);
        }
      }
    };

    fetchUserAttempts();
  }, [selectedUser]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowProfileForm(true);
  };

  const handleCreateProfile = () => {
    if (!username || !email || !selectedRole) {
      return; // Validation failed
    }

    // Create a new user with the provided details
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role: selectedRole,
      createdAt: new Date().toISOString()
    };

    // Add the new user to the users array
    setUsers([...users, newUser]);

    // Login as the new user
    const mockTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      user: newUser
    };

    dispatch(setTokens(mockTokens));
    
    // Navigate based on role
    if (newUser.role === UserRole.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const loginAsUser = (user: User) => {
    const mockTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      user: user
    };

    dispatch(setTokens(mockTokens));
    setDialogOpen(false);
    
    if (user.role === UserRole.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatScore = (score: number, maxScore: number) => {
    return `${score}/${maxScore} (${Math.round((score / maxScore) * 100)}%)`;
  };
  
  const viewQuizResults = (attemptId: string) => {
    // First login as the selected user
    if (selectedUser) {
      const mockTokens = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: selectedUser
      };

      dispatch(setTokens(mockTokens));
      setDialogOpen(false);
      
      // Then navigate to the results page
      navigate(`/results/${attemptId}`);
    }
  };

  return (
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {!showProfileForm ? (
        // Show role selection buttons
        <Card variant="outlined" sx={{ maxWidth: 600, width: '100%', mb: 2 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Choose Your Role
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Select a role to create your profile:
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<PersonIcon />}
                onClick={() => handleRoleSelect(UserRole.USER)}
                sx={{ py: 2, px: 4 }}
              >
                User
              </Button>
              
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => handleRoleSelect(UserRole.ADMIN)}
                sx={{ py: 2, px: 4 }}
              >
                Admin
              </Button>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 4 }}>
              Or select an existing user:
            </Typography>
            
            <List sx={{ width: '100%', bgcolor: 'background.paper', mt: 2 }}>
              {users.map((user) => (
                <ListItem 
                  key={user.id} 
                  button 
                  onClick={() => handleUserClick(user)}
                  sx={{ 
                    borderRadius: 1, 
                    mb: 1, 
                    '&:hover': { bgcolor: 'action.hover' } 
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {user.role === UserRole.ADMIN ? 
                        <AdminPanelSettingsIcon /> : 
                        <PersonIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={user.username} 
                    secondary={user.email} 
                  />
                  <Chip 
                    label={user.role} 
                    color={user.role === UserRole.ADMIN ? "secondary" : "primary"} 
                    size="small" 
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ) : (
        // Show profile creation form
        <Card variant="outlined" sx={{ maxWidth: 600, width: '100%', mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Create Your {selectedRole === UserRole.ADMIN ? 'Admin' : 'User'} Profile
            </Typography>
            
            <Box component="form" sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowProfileForm(false)}
                >
                  Back
                </Button>
                
                <Button
                  variant="contained"
                  color={selectedRole === UserRole.ADMIN ? "secondary" : "primary"}
                  onClick={handleCreateProfile}
                  disabled={!username || !email}
                >
                  Create Profile & Continue
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
      
      {/* User Profile Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedUser && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2, bgcolor: selectedUser.role === UserRole.ADMIN ? 'secondary.main' : 'primary.main' }}>
                  {selectedUser.role === UserRole.ADMIN ? 
                    <AdminPanelSettingsIcon /> : 
                    <PersonIcon />}
                </Avatar>
                <Typography variant="h6">{selectedUser.username}'s Profile</Typography>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>User Details</Typography>
                    <Typography><strong>Username:</strong> {selectedUser.username}</Typography>
                    <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
                    <Typography><strong>Role:</strong> {selectedUser.role}</Typography>
                    <Typography><strong>Member Since:</strong> {formatDate(selectedUser.createdAt)}</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Quiz Attempts</Typography>
                    
                    {userAttempts.length > 0 ? (
                      <List>
                        {userAttempts.map((attempt) => (
                          <ListItem 
                            key={attempt.id}
                            sx={{ 
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              mb: 1
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <AssignmentIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={quizTitles[attempt.quizId] || `Quiz ID: ${attempt.quizId}`}
                              secondary={
                                <>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <ScoreIcon fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2" component="span">
                                      Score: {formatScore(attempt.score, attempt.maxScore)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2" component="span">
                                      Time Spent: {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
                                    </Typography>
                                  </Box>
                                </>
                              }
                            />
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => viewQuizResults(attempt.id)}
                            >
                              View Results
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography color="text.secondary">
                        No quiz attempts found for this user.
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                variant="contained" 
                color={selectedUser.role === UserRole.ADMIN ? "secondary" : "primary"}
                onClick={() => loginAsUser(selectedUser)}
              >
                Login as {selectedUser.username}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default BypassLogin;