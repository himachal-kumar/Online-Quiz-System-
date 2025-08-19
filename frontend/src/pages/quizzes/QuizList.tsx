import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuizIcon from '@mui/icons-material/Quiz';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setQuizzes } from '../../store/reducers/quizReducer';
import { quizService } from '../../services/quizService';
import { toast } from 'react-toastify';
import QuizListSkeleton from '../../components/skeletons/QuizListSkeleton';

const QuizList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const quizzes = useAppSelector((state) => state.quiz.quizzes);
  const [filteredQuizzes, setFilteredQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // If user is admin, get all quizzes, otherwise get only published quizzes
        const data = user?.role === 'admin'
          ? await quizService.getQuizzes()
          : await quizService.getPublishedQuizzes();
        dispatch(setQuizzes(data));
      } catch (error) {
        toast.error('Failed to fetch quizzes');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [dispatch, user]);

  useEffect(() => {
    // Filter quizzes based on search term
    if (searchTerm.trim() === '') {
      setFilteredQuizzes(quizzes);
    } else {
      const filtered = quizzes.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuizzes(filtered);
    }
  }, [quizzes, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleQuizClick = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4" component="h1">
          Available Quizzes
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {loading ? (
          <QuizListSkeleton />
        ) : filteredQuizzes.length === 0 ? (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No quizzes found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchTerm
                ? 'Try a different search term'
                : 'Check back later for new quizzes'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredQuizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {quiz.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {quiz.description}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon
                          fontSize="small"
                          sx={{ mr: 0.5, color: 'text.secondary' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {quiz.timeLimit} min
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <QuizIcon
                          fontSize="small"
                          sx={{ mr: 0.5, color: 'text.secondary' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {quiz.questions.length} questions
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <Box
                    sx={{
                      p: 2,
                      pt: 0,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Created: {formatDate(quiz.createdAt)}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleQuizClick(quiz.id)}
                    >
                      View Quiz
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default QuizList;