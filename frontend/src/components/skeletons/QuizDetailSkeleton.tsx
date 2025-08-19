import React from 'react';
import { Box, Container, Paper, Skeleton, Grid, Button } from '@mui/material';

const QuizDetailSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Skeleton variant="text" width={280} height={40} />
        <Skeleton variant="text" width={"80%"} />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box>
              {[1,2,3].map((i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
                  <Box sx={{ width: '100%' }}>
                    <Skeleton variant="text" width={160} />
                    <Skeleton variant="text" width={200} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skeleton variant="rectangular" width={180} height={44} sx={{ borderRadius: 1 }} />
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Skeleton variant="rectangular" width={220} height={40} sx={{ borderRadius: 1 }} />
      </Box>
    </Container>
  );
};

export default QuizDetailSkeleton;


