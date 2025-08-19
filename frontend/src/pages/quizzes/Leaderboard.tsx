import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Avatar,
  Chip,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../store/store';
import { quizService } from '../../services/quizService';
import { toast } from 'react-toastify';
import { Quiz, LeaderboardEntry } from '../../types/quiz';
import LeaderboardSkeleton from '../../components/skeletons/LeaderboardSkeleton';

const Leaderboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!id) return;

      try {
        // Fetch quiz details
        const quizData = await quizService.getQuizById(id);
        setQuiz(quizData);

        // Fetch leaderboard data
        const leaderboardData = await quizService.getLeaderboard(id);
        setLeaderboard(leaderboardData);
      } catch (error) {
        toast.error('Failed to load leaderboard');
        console.error(error);
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [id, navigate]);

  // no-op

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return 'transparent';
    }
  };

  const handleBackToQuiz = () => {
    if (quiz) {
      navigate(`/quiz/${quiz.id}`);
    } else {
      navigate('/quizzes');
    }
  };

  if (loading) {
    return <LeaderboardSkeleton />;
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
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              <EmojiEventsIcon
                sx={{ fontSize: 36, verticalAlign: 'middle', mr: 1, color: 'warning.main' }}
              />
              Leaderboard
            </Typography>
            <Typography variant="h6" gutterBottom>
              {quiz.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Top performers for this quiz
            </Typography>
          </Box>

          {leaderboard.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No attempts yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Be the first to complete this quiz and top the leaderboard!
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" width="10%">
                      Rank
                    </TableCell>
                    <TableCell>User</TableCell>
                    <TableCell align="center">Score</TableCell>
                    <TableCell align="center">Percentage</TableCell>
                    <TableCell align="center">Time Taken</TableCell>
                    <TableCell align="center">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.map((entry, index) => {
                    const isCurrentUser = entry.userId === currentUser?.id;
                    return (
                      <TableRow
                        key={`${entry.userId}-${entry.completedAt}`}
                        sx={{
                          bgcolor: isCurrentUser
                            ? 'action.selected'
                            : 'background.paper',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                        component={motion.tr}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {index < 3 ? (
                              <Avatar
                                sx={{
                                  width: 30,
                                  height: 30,
                                  bgcolor: getMedalColor(index + 1),
                                  color: index === 0 ? 'black' : 'white',
                                  fontWeight: 'bold',
                                }}
                              >
                                {index + 1}
                              </Avatar>
                            ) : (
                              <Typography variant="body1">{index + 1}</Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              alt={entry.username}
                              src={entry.avatar || undefined}
                              sx={{ mr: 2 }}
                            >
                              {entry.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" sx={{ lineHeight: 1.2 }}>
                                {entry.username}
                                {isCurrentUser && (
                                  <Chip
                                    label="You"
                                    size="small"
                                    color="primary"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Typography>
                              {entry.email && (
                                <Typography variant="caption" color="text.secondary">
                                  {entry.email}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body1">
                            {entry.score} / {quiz.questions.reduce((total, q) => total + q.points, 0)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Box
                              sx={{
                                position: 'relative',
                                display: 'inline-flex',
                                mr: 1,
                              }}
                            >
                              <CircularProgress
                                variant="determinate"
                                value={Math.round(
                                  (entry.score / quiz.questions.reduce((total, q) => total + q.points, 0)) * 100
                                )}
                                size={36}
                                thickness={4}
                                sx={{
                                  color:
                                    (entry.score / quiz.questions.reduce((total, q) => total + q.points, 0)) * 100 >= 80
                                      ? 'success.main'
                                      : (entry.score / quiz.questions.reduce((total, q) => total + q.points, 0)) * 100 >= 60
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
                                  variant="caption"
                                  component="div"
                                  color="text.secondary"
                                  sx={{ fontWeight: 'bold' }}
                                >
                                  {Math.round(
                                    (entry.score / quiz.questions.reduce((total, q) => total + q.points, 0)) * 100
                                  )}
                                  %
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <AccessTimeIcon
                              fontSize="small"
                              sx={{ mr: 0.5, color: 'text.secondary' }}
                            />
                            <Typography variant="body2">
                              {(() => {
                                const minutes = Math.floor(entry.timeSpent / 60);
                                const seconds = entry.timeSpent % 60;
                                return `${minutes}m ${seconds}s`;
                              })()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {formatDate(entry.completedAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackToQuiz}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Quiz
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Leaderboard;