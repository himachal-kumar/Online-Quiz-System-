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
  FormControl,
  FormControlLabel,
  Grid,
  LinearProgress,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { quizService } from '../../services/quizService';
import { toast } from 'react-toastify';
import QuizAttemptSkeleton from '../../components/skeletons/QuizAttemptSkeleton';
import { Quiz, QuizAttempt as QuizAttemptType, Answer } from '../../types/quiz';

const QuizAttempt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime] = useState(new Date());
  
  const user = useAppSelector((state) => state.auth.user);
  const currentQuiz = useAppSelector((state) => state.quiz.currentQuiz);
  const currentAttempt = useAppSelector((state) => state.quiz.currentAttempt);

  // Timer effect
  useEffect(() => {
    if (!currentQuiz || !currentAttempt) return;

    const timeLimit = currentQuiz.timeLimit * 60; // convert to seconds
    setTimeRemaining(timeLimit);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuiz, currentAttempt]);

  // Load quiz and attempt data
  useEffect(() => {
    const loadQuizData = async () => {
      if (!id || !user) {
        navigate('/quizzes');
        return;
      }

      try {
        // If we don't have the current quiz or attempt in the store, fetch them
        if (!currentQuiz || !currentAttempt || currentQuiz.id !== id) {
          const quizData = await quizService.getQuizById(id);
          
          // Check if there's an existing attempt
          const attempts = await quizService.getAttemptsByUserId(user.id);
          const existingAttempt = attempts.find(
            (a) => a.quizId === id && !a.completedAt
          );

          if (existingAttempt) {
            // Continue existing attempt
            dispatch({ type: 'quiz/setCurrentQuiz', payload: quizData });
            dispatch({ type: 'quiz/setCurrentAttempt', payload: existingAttempt });
          } else {
            // Start new attempt
            const newAttempt = await quizService.startQuizAttempt(id, user.id);
            dispatch({ type: 'quiz/setCurrentQuiz', payload: quizData });
            dispatch({ type: 'quiz/setCurrentAttempt', payload: newAttempt });
          }
        }
      } catch (error) {
        toast.error('Failed to load quiz');
        console.error(error);
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [id, user, currentQuiz, currentAttempt, dispatch, navigate]);

  // Save answer to the current question
  const saveAnswer = (questionId: string, selectedOptionId: string) => {
    if (!currentAttempt) return;

    const question = currentQuiz?.questions.find(q => q.id === questionId);
    const isCorrect = question?.correctOptionId === selectedOptionId;

    // Check if we already have an answer for this question
    const existingAnswerIndex = currentAttempt.answers.findIndex(
      (a) => a.questionId === questionId
    );

    const updatedAnswers = [...currentAttempt.answers];

    const answer: Answer = {
      questionId,
      selectedOptionId,
      isCorrect
    };

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      updatedAnswers[existingAnswerIndex] = answer;
    } else {
      // Add new answer
      updatedAnswers.push(answer);
    }

    const updatedAttempt = {
      ...currentAttempt,
      answers: updatedAnswers,
    };

    dispatch({ type: 'quiz/setCurrentAttempt', payload: updatedAttempt });
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (!currentQuiz) return;
    
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit the quiz
  const handleSubmitQuiz = async () => {
    if (!currentQuiz || !currentAttempt || !user) return;

    setSubmitting(true);

    try {
      // Calculate time spent
      const endTime = new Date();
      const timeSpentInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

      // Prepare the completed attempt
      const updatedAttempt: QuizAttemptType = {
        ...currentAttempt,
        completedAt: new Date().toISOString(),
        timeSpent: timeSpentInSeconds,
      };

      // Submit the attempt
      const result = await quizService.submitQuizAttempt(updatedAttempt);
      
      // Navigate to results page
      navigate(`/results/${result.id}`);
    } catch (error) {
      toast.error('Failed to submit quiz');
      console.error(error);
      setSubmitting(false);
    }
  };

  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!currentQuiz || !currentAttempt) return 0;
    return (currentAttempt.answers.length / currentQuiz.questions.length) * 100;
  };

  if (loading) {
    return <QuizAttemptSkeleton />;
  }

  if (!currentQuiz || !currentAttempt) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" sx={{ my: 4 }}>
          Quiz not found or not started properly.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/quizzes')}>
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const currentAnswer = currentAttempt.answers.find(
    (a) => a.questionId === currentQuestion?.id
  );

  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {currentQuiz.title}
          </Typography>
          
          {/* Timer and Progress */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTimeIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body1" color="text.secondary">
              Time Remaining: {formatTimeRemaining(timeRemaining)}
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={calculateProgress()} 
            sx={{ mb: 4, height: 8, borderRadius: 4 }} 
          />
          
          {/* Question Card */}
          <Card 
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            sx={{ mb: 4 }}
          >
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                {currentQuestion.text}
              </Typography>
              
              <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
                <RadioGroup
                  value={currentAnswer?.selectedOptionId || ''}
                  onChange={(e) => saveAnswer(currentQuestion.id, e.target.value)}
                >
                  {currentQuestion.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={option.text}
                      sx={{ 
                        mb: 1, 
                        p: 1, 
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' } 
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
          
          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeIcon />}
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0 || submitting}
            >
              Previous
            </Button>
            
            <Box>
              {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Submit Quiz'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<NavigateNextIcon />}
                  onClick={handleNextQuestion}
                  disabled={submitting}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
};

export default QuizAttempt;