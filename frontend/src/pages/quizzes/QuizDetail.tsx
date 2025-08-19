import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setCurrentQuiz, setCurrentAttempt } from '../../store/reducers/quizReducer';
import { quizService } from '../../services/quizService';
import { toast } from 'react-toastify';
import QuizDetailSkeleton from '../../components/skeletons/QuizDetailSkeleton';
import { Quiz, QuizAttempt } from '../../types/quiz';

const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [previousAttempts, setPreviousAttempts] = useState<QuizAttempt[]>([]);
  const user = useAppSelector((state) => state.auth.user);
  const quiz = useAppSelector((state) => state.quiz.currentQuiz);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!id || !user) return;

      try {
        // Fetch quiz details
        const quizData = await quizService.getQuizById(id);
        dispatch(setCurrentQuiz(quizData));

        // Fetch user's previous attempts for this quiz
        const attempts = await quizService.getAttemptsByUserId(user.id);
        const quizAttempts = attempts.filter((attempt) => attempt.quizId === id);
        setPreviousAttempts(quizAttempts);
      } catch (error) {
        toast.error('Failed to load quiz details');
        console.error(error);
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id, user, dispatch, navigate]);

  const handleStartQuiz = async () => {
    if (!quiz || !user) return;

    try {
      // Create a new quiz attempt
      const newAttempt = await quizService.startQuizAttempt(quiz.id, user.id);
      dispatch(setCurrentAttempt(newAttempt));
      navigate(`/quiz/${quiz.id}/attempt`);
    } catch (error) {
      toast.error('Failed to start quiz');
      console.error(error);
    }
  };

  const handleViewResults = (attemptId: string) => {
    navigate(`/results/${attemptId}`);
  };

  const handleViewLeaderboard = () => {
    if (quiz) {
      navigate(`/leaderboard/${quiz.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatScore = (score: number, total: number) => {
    return `${score}/${total} (${Math.round((score / total) * 100)}%)`;
  };

  if (loading) {
    return <QuizDetailSkeleton />;
  }

  if (!quiz) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" color="error" align="center">
          Quiz not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {quiz.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {quiz.description}
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Time Limit"
                    secondary={`${quiz.timeLimit} minutes`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <QuizIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Questions"
                    secondary={`${quiz.questions.length} questions`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmojiEventsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Created On"
                    secondary={formatDate(quiz.createdAt)}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleStartQuiz}
                sx={{ px: 4, py: 1.5 }}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Quiz
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {previousAttempts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Your Previous Attempts
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {previousAttempts.map((attempt) => (
                  <Grid item xs={12} sm={6} md={4} key={attempt.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Attempt on {formatDate(attempt.startedAt)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CheckCircleOutlineIcon
                            fontSize="small"
                            color={attempt.completed ? 'success' : 'disabled'}
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2">
                            Status: {attempt.completed ? 'Completed' : 'Incomplete'}
                          </Typography>
                        </Box>
                        {attempt.completed && (
                          <Typography variant="body2" gutterBottom>
                            Score: {formatScore(attempt.score || 0, quiz.questions.length)}
                          </Typography>
                        )}
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewResults(attempt.id)}
                            disabled={!attempt.completed}
                            fullWidth
                          >
                            View Results
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleViewLeaderboard}
            startIcon={<EmojiEventsIcon />}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Leaderboard
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default QuizDetail;