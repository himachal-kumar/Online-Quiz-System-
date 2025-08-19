import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, Container, Grid, Paper, Typography, Skeleton } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useAppSelector } from '../../store/store';
import { quizService } from '../../services/quizService';
import { QuizAttempt, Quiz } from '../../types/quiz';

const ResultsIndex: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [quizzesById, setQuizzesById] = useState<Record<string, Quiz>>({});

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) return;
        const [userAttempts, allQuizzes] = await Promise.all([
          quizService.getAttemptsByUserId(user.id),
          quizService.getQuizzes(),
        ]);
        setAttempts(userAttempts.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()));
        const byId: Record<string, Quiz> = {};
        allQuizzes.forEach(q => { byId[q.id] = q; });
        setQuizzesById(byId);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const formatDate = (iso: string) => new Date(iso).toLocaleString();
  const formatScore = (score: number, max: number) => `${score}/${max} (${Math.round((score / Math.max(1, max)) * 100)}%)`;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <AssessmentIcon sx={{ fontSize: 32, verticalAlign: 'middle', mr: 1 }} />
            Results
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your quiz attempts and results
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width={220} height={28} />
                    <Skeleton variant="text" width={160} />
                    <Skeleton variant="text" width={120} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : attempts.length === 0 ? (
          <Typography align="center" color="text.secondary">No attempts yet</Typography>
        ) : (
          <Grid container spacing={3}>
            {attempts.map((attempt) => {
              const quiz = quizzesById[attempt.quizId];
              const isCompleted = Boolean(attempt.completedAt);
              return (
                <Grid item xs={12} sm={6} md={4} key={attempt.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom noWrap>
                        {quiz?.title || 'Quiz'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Attempt: {formatDate(attempt.startedAt)}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }} color={isCompleted ? 'success.main' : 'warning.main'}>
                        {isCompleted ? `Score: ${formatScore(attempt.score, attempt.maxScore)}` : 'In progress'}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        size="small"
                        component={RouterLink}
                        to={`/results/${attempt.id}`}
                        variant="contained"
                        disabled={!isCompleted}
                      >
                        View Results
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default ResultsIndex;


