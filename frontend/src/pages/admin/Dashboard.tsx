import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setQuizzes, deleteQuiz } from '../../store/reducers/quizReducer';
import { quizService } from '../../services/quizService';
import { Quiz } from '../../types/quiz';
import { toast } from 'react-toastify';
import QuizForm from '../../components/quiz/QuizForm';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const quizzes = useAppSelector((state) => state.quiz.quizzes);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizService.getQuizzes();
        dispatch(setQuizzes(data));
      } catch (error) {
        toast.error('Failed to fetch quizzes');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [dispatch]);

  const handleCreateQuiz = () => {
    setSelectedQuiz(null);
    setOpenDialog(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (quizToDelete) {
      try {
        await quizService.deleteQuiz(quizToDelete);
        dispatch(deleteQuiz(quizToDelete));
        toast.success('Quiz deleted successfully');
      } catch (error) {
        toast.error('Failed to delete quiz');
        console.error(error);
      } finally {
        setOpenDeleteDialog(false);
        setQuizToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setQuizToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quiz Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateQuiz}
        >
          Create Quiz
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Questions</TableCell>
                <TableCell>Time Limit</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : quizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No quizzes found. Create your first quiz!
                  </TableCell>
                </TableRow>
              ) : (
                quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>{quiz.title}</TableCell>
                    <TableCell>{quiz.questions.length}</TableCell>
                    <TableCell>{quiz.timeLimit} min</TableCell>
                    <TableCell>{formatDate(quiz.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={quiz.isPublished ? 'Published' : 'Draft'}
                        color={quiz.isPublished ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/quiz/${quiz.id}`)}
                        title="View Quiz"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditQuiz(quiz)}
                        title="Edit Quiz"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(quiz.id)}
                        title="Delete Quiz"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Quiz Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedQuiz ? 'Edit Quiz' : 'Create New Quiz'}
        </DialogTitle>
        <DialogContent>
          <QuizForm
            quiz={selectedQuiz}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this quiz? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;