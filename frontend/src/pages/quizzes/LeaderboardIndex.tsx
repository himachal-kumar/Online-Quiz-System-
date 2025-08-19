import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { quizService } from '../../services/quizService';
import { Quiz } from '../../types/quiz';
import LeaderboardIndexSkeleton from '../../components/skeletons/LeaderboardIndexSkeleton';

const LeaderboardIndex: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const allQuizzes = await quizService.getQuizzes();
        setQuizzes(allQuizzes);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <LeaderboardIndexSkeleton />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <EmojiEventsIcon sx={{ fontSize: 36, verticalAlign: 'middle', mr: 1, color: 'warning.main' }} />
            Leaderboards
          </Typography>
          <Typography variant="body1" color="text.secondary">
            All quizzes. Choose one to view its leaderboard
          </Typography>
        </Box>
        {quizzes.length === 0 ? (
          <Typography align="center" color="text.secondary">No quizzes available</Typography>
        ) : (
          <Grid container spacing={3}>
            {quizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{quiz.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{quiz.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      size="small"
                      component={RouterLink}
                      to={`/leaderboard/${quiz.id}`}
                      variant="contained"
                    >
                      View Leaderboard
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default LeaderboardIndex;


