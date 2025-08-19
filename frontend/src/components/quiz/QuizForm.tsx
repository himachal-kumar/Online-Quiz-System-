import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Quiz, Question, Option } from '../../types/quiz';
import { quizService } from '../../services/quizService';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addQuiz, updateQuiz } from '../../store/reducers/quizReducer';
import { toast } from 'react-toastify';

interface QuizFormProps {
  quiz: Quiz | null;
  onClose: () => void;
}

// Form validation schema
const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  timeLimit: yup
    .number()
    .required('Time limit is required')
    .positive('Time limit must be positive')
    .integer('Time limit must be an integer'),
  isPublished: yup.boolean(),
  questions: yup
    .array()
    .of(
      yup.object().shape({
        text: yup.string().required('Question text is required'),
        points: yup
          .number()
          .required('Points are required')
          .positive('Points must be positive')
          .integer('Points must be an integer'),
        correctOptionId: yup.string().required('Please select a correct answer'),
        options: yup
          .array()
          .of(
            yup.object().shape({
              text: yup.string().required('Option text is required'),
            })
          )
          .min(2, 'At least 2 options are required'),
      })
    )
    .min(1, 'At least one question is required'),
});

const QuizForm: React.FC<QuizFormProps> = ({ quiz, onClose }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  // Default values for the form
  const defaultValues: Partial<Quiz> = {
    title: '',
    description: '',
    timeLimit: 10,
    isPublished: false,
    questions: [
      {
        id: `q_${Date.now()}`,
        text: '',
        points: 10,
        correctOptionId: '',
        options: [
          { id: `o_${Date.now()}_1`, text: '' },
          { id: `o_${Date.now()}_2`, text: '' },
        ],
      },
    ],
  };

  // Initialize form with existing quiz data or default values
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Quiz>({
    resolver: yupResolver(schema),
    defaultValues: quiz || defaultValues,
  });

  // Field array for questions
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  // Watch all form values
  const formValues = watch();

  // Handle form submission
  const onSubmit = async (data: Quiz) => {
    setLoading(true);
    try {
      if (quiz) {
        // Update existing quiz
        const updatedQuiz = await quizService.updateQuiz({
          ...data,
          id: quiz.id,
          createdAt: quiz.createdAt,
          createdBy: quiz.createdBy,
        });
        dispatch(updateQuiz(updatedQuiz));
        toast.success('Quiz updated successfully');
      } else {
        // Create new quiz
        const newQuiz = await quizService.createQuiz({
          ...data,
          createdBy: user?.id || '',
        });
        dispatch(addQuiz(newQuiz));
        toast.success('Quiz created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(quiz ? 'Failed to update quiz' : 'Failed to create quiz');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new question
  const handleAddQuestion = () => {
    appendQuestion({
      id: `q_${Date.now()}`,
      text: '',
      points: 10,
      correctOptionId: '',
      options: [
        { id: `o_${Date.now()}_1`, text: '' },
        { id: `o_${Date.now()}_2`, text: '' },
      ],
    });
  };

  // Add a new option to a question
  const handleAddOption = (questionIndex: number) => {
    const question = formValues.questions[questionIndex];
    if (question && question.options) {
      const newOptions = [
        ...question.options,
        { id: `o_${Date.now()}_${question.options.length + 1}`, text: '' },
      ];
      question.options = newOptions;
    }
  };

  // Remove an option from a question
  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const question = formValues.questions[questionIndex];
    if (question && question.options && question.options.length > 2) {
      const newOptions = [...question.options];
      newOptions.splice(optionIndex, 1);
      question.options = newOptions;
    } else {
      toast.warning('A question must have at least 2 options');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Quiz Title"
                variant="outlined"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="timeLimit"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Time Limit (minutes)"
                type="number"
                variant="outlined"
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
                error={!!errors.timeLimit}
                helperText={errors.timeLimit?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="isPublished"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Publish Quiz"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Questions</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
            >
              Add Question
            </Button>
          </Box>

          {errors.questions && typeof errors.questions === 'string' && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {errors.questions}
            </Typography>
          )}

          {questionFields.map((questionField, questionIndex) => {
            const questionErrors = errors.questions?.[questionIndex];

            return (
              <Card key={questionField.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1">
                      Question {questionIndex + 1}
                    </Typography>
                    {questionFields.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => removeQuestion(questionIndex)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name={`questions.${questionIndex}.text`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Question Text"
                            variant="outlined"
                            fullWidth
                            error={!!questionErrors?.text}
                            helperText={questionErrors?.text?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name={`questions.${questionIndex}.points`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Points"
                            type="number"
                            variant="outlined"
                            fullWidth
                            InputProps={{ inputProps: { min: 1 } }}
                            error={!!questionErrors?.points}
                            helperText={questionErrors?.points?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle2">Options</Typography>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddOption(questionIndex)}
                        >
                          Add Option
                        </Button>
                      </Box>

                      {formValues.questions[questionIndex]?.options?.map(
                        (option, optionIndex) => (
                          <Box
                            key={option.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              gap: 1,
                            }}
                          >
                            <Controller
                              name={`questions.${questionIndex}.options.${optionIndex}.text`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={`Option ${optionIndex + 1}`}
                                  variant="outlined"
                                  fullWidth
                                  error={
                                    !!questionErrors?.options?.[optionIndex]?.text
                                  }
                                  helperText={
                                    questionErrors?.options?.[optionIndex]?.text
                                      ?.message
                                  }
                                />
                              )}
                            />

                            <Controller
                              name={`questions.${questionIndex}.correctOptionId`}
                              control={control}
                              render={({ field }) => (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={field.value === option.id}
                                      onChange={() => field.onChange(option.id)}
                                    />
                                  }
                                  label="Correct"
                                />
                              )}
                            />

                            {formValues.questions[questionIndex]?.options
                              ?.length > 2 && (
                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleRemoveOption(questionIndex, optionIndex)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        )
                      )}

                      {questionErrors?.correctOptionId && (
                        <Typography color="error" variant="body2">
                          {questionErrors.correctOptionId.message}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading
            ? 'Saving...'
            : quiz
            ? 'Update Quiz'
            : 'Create Quiz'}
        </Button>
      </Box>
    </Box>
  );
};

export default QuizForm;