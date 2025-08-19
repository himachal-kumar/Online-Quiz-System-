import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
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
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { quizService } from '../../services/quizService';
import { toast } from 'react-toastify';
import { Quiz, QuizAttempt, Question, Option } from '../../types/quiz';

const QuizResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const fetchResultData = async () => {
      if (!id) return;

      try {
        // Fetch attempt details
        const attemptData = await quizService.getAttemptById(id);
        setAttempt(attemptData);

        // Fetch quiz details
        if (attemptData) {
          const quizData = await quizService.getQuizById(attemptData.quizId);
          setQuiz(quizData);
        }
      } catch (error) {
        toast.error('Failed to load quiz results');
        console.error(error);
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, [id, navigate]);

  const calculateTimeSpent = () => {
    if (!attempt) return '0 minutes';

    const startTime = new Date(attempt.startedAt).getTime();
    const endTime = new Date(attempt.completedAt || new Date()).getTime();
    const timeSpentMs = endTime - startTime;
    const timeSpentMinutes = Math.floor(timeSpentMs / (1000 * 60));
    const timeSpentSeconds = Math.floor((timeSpentMs % (1000 * 60)) / 1000);

    return `${timeSpentMinutes} min ${timeSpentSeconds} sec`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getCorrectOption = (question: Question) => {
    return question.options.find((option) => option.id === question.correctOptionId);
  };

  const isAnswerCorrect = (question: Question, selectedOptionId: string | undefined) => {
    if (!selectedOptionId) return false;
    return question.correctOptionId === selectedOptionId;
  };

  const getSelectedOption = (question: Question, selectedOptionId: string | undefined) => {
    if (!selectedOptionId) return undefined;
    return question.options.find((option) => option.id === selectedOptionId);
  };

  const handleViewLeaderboard = () => {
    if (quiz) {
      navigate(`/leaderboard/${quiz.id}`);
    }
  };

  const handleRetakeQuiz = () => {
    if (quiz) {
      navigate(`/quiz/${quiz.id}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!attempt || !quiz) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" color="error" align="center">
          Results not found
        </Typography>
      </Container>
    );
  }

  // Calculate score percentage
  const scorePercentage = Math.round((attempt.score / quiz.questions.length) * 100);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Results Summary */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Quiz Results
            </Typography>
            <Typography variant="h6" gutterBottom>
              {quiz.title}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              mb: 3,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                mb: 2,
              }}
            >
              <CircularProgress
                variant="determinate"
                value={scorePercentage}
                size={120}
                thickness={5}
                sx={{
                  color:
                    scorePercentage >= 80
                      ? 'success.main'
                      : scorePercentage >= 60
                      ? 'warning.main'
                      : 'error.main',
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  color="text.secondary"
                >
                  {`${scorePercentage}%`}
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom>
              Score: {attempt.score} / {quiz.questions.length}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Time Spent"
                    secondary={calculateTimeSpent()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmojiEventsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Completed On"
                    secondary={formatDate(attempt.completedAt || '')}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleRetakeQuiz}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Retake Quiz
              </Button>
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
            </Grid>
          </Grid>
        </Paper>

        {/* Detailed Results */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Detailed Results
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, bgcolor: 'success.light', mr: 1, borderRadius: 1 }} />
              <Typography variant="body2">Your correct answer</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, bgcolor: 'error.light', mr: 1, borderRadius: 1 }} />
              <Typography variant="body2">Your incorrect answer</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, bgcolor: 'info.light', mr: 1, borderRadius: 1 }} />
              <Typography variant="body2">Correct answer (not selected)</Typography>
            </Box>
          </Box>
        </Paper>

        {quiz.questions.map((question, index) => {
          const selectedOptionId = attempt.answers.find(
            (answer) => answer.questionId === question.id
          )?.selectedOptionId;
          const selectedOption = getSelectedOption(question, selectedOptionId);
          const correctOption = getCorrectOption(question);
          const isCorrect = isAnswerCorrect(question, selectedOptionId);

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  mb: 3,
                  borderLeft: 6,
                  borderColor: isCorrect
                    ? 'success.main'
                    : selectedOptionId
                    ? 'error.main'
                    : 'warning.main',
                }}
                elevation={2}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Question {index + 1}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: isCorrect
                          ? 'success.main'
                          : selectedOptionId
                          ? 'error.main'
                          : 'warning.main',
                      }}
                    >
                      {isCorrect ? (
                        <CheckCircleIcon sx={{ mr: 0.5 }} />
                      ) : selectedOptionId ? (
                        <CancelIcon sx={{ mr: 0.5 }} />
                      ) : (
                        <CancelIcon sx={{ mr: 0.5 }} />
                      )}
                      <Typography variant="body2">
                        {isCorrect
                          ? 'Correct'
                          : selectedOptionId
                          ? 'Incorrect'
                          : 'Not Answered'}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body1" paragraph>
                    {question.text}
                  </Typography>

                  <List dense>
                    {question.options.map((option) => (
                      <ListItem
                        key={option.id}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          bgcolor:
                            option.id === selectedOptionId && option.id === question.correctOptionId
                              ? 'success.light'
                              : option.id === selectedOptionId && option.id !== question.correctOptionId
                              ? 'error.light'
                              : option.id === question.correctOptionId && selectedOptionId
                              ? 'info.light'
                              : 'transparent',
                        }}
                      >
                        <ListItemIcon>
                          {option.id === selectedOptionId && option.id === question.correctOptionId ? (
                            <CheckCircleIcon color="success" />
                          ) : option.id === selectedOptionId && option.id !== question.correctOptionId ? (
                            <CancelIcon color="error" />
                          ) : option.id === question.correctOptionId && selectedOptionId ? (
                            <CheckCircleIcon color="info" />
                          ) : null}
                        </ListItemIcon>
                        <ListItemText primary={option.text} />
                      </ListItem>
                    ))}
                  </List>

                  {!isCorrect && selectedOptionId && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Correct Answer:
                      </Typography>
                      <Typography variant="body2">
                        {correctOption?.text || 'No correct answer provided'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/quizzes')}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Quizzes
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default QuizResults;