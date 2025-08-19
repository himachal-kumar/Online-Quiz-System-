import { Box, Typography, Button, Grid, Paper, Container, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import { useAppSelector } from "../store/store";

// Add missing module imports with proper installation instructions
import { useTranslation } from "react-i18next";
// If framer-motion is not installed, you can install it with: npm install framer-motion
import { motion } from "framer-motion";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const features = [
    {
      icon: <QuizIcon fontSize="large" color="primary" />,
      title: t('home.features.quizzes.title'),
      description: t('home.features.quizzes.description'),
    },
    {
      icon: <EmojiEventsIcon fontSize="large" color="primary" />,
      title: t('home.features.leaderboard.title'),
      description: t('home.features.leaderboard.description'),
    },
    {
      icon: <SchoolIcon fontSize="large" color="primary" />,
      title: t('home.features.learning.title'),
      description: t('home.features.learning.description'),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box component={motion.div} 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ my: 4 }}>
        
        {/* Hero Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 6, 
            borderRadius: 2,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
                component={motion.h2}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                gutterBottom
              >
                {t('home.hero.title')}
              </Typography>
              <Typography 
                variant="h5" 
                component={motion.h5}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                gutterBottom
              >
                {t('home.hero.subtitle')}
              </Typography>
              <Box mt={4}>
                {/* <Button 
                  variant="contained" 
                  size="large"
                  color="secondary"
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(isAuthenticated ? '/quizzes' : '/login')}
                  sx={{ mr: 2, mb: 2 }}
                >
                  {isAuthenticated ? t('home.hero.startQuiz') : t('home.hero.getStarted')}
                </Button> */}
                {/* <Button 
                  variant="outlined" 
                  size="large"
                  color="secondary"
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/profile')}
                  sx={{ mr: 2, mb: 2 }}
                >
                  {t('home.hero.profile') || 'Profile'}
                </Button> */}
                
                <Button 
                  variant="outlined" 
                  size="large"
                  color="secondary"
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/quizzes')}
                  sx={{ mr: 2, mb: 2 }}
                >
                  {t('Start quiz Test') || 'Quizzes'}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                component={motion.div}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <QuizIcon sx={{ fontSize: 180, opacity: 0.8 }} />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Features Section */}
        <Typography 
          variant="h4" 
          component={motion.h4}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          align="center" 
          gutterBottom 
          sx={{ mb: 4 }}
        >
          {t('home.features.title')}
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
                elevation={2}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
