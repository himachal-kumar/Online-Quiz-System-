import React from 'react';
import { Box, Container, Grid, Card, CardContent, Skeleton } from '@mui/material';

const QuizCardSkeleton: React.FC = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="rectangular" height={1} sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={120} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Skeleton variant="text" width={140} />
        <Skeleton variant="rectangular" width={100} height={36} />
      </Box>
    </CardContent>
  </Card>
);

const QuizListSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Skeleton variant="text" width={240} height={36} />
        <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
        <Grid container spacing={3}>
          {[1,2,3,4,5,6].map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <QuizCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default QuizListSkeleton;


