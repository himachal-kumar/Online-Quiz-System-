import React from 'react';
import { Box, Container, Skeleton, Card, CardContent } from '@mui/material';

const QuizAttemptSkeleton: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Skeleton variant="text" width={260} height={36} />
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
          <Skeleton variant="text" width={180} />
        </Box>
        <Skeleton variant="rectangular" height={8} sx={{ mb: 4, borderRadius: 4 }} />
        <Card>
          <CardContent>
            <Skeleton variant="text" width={200} />
            <Skeleton variant="text" width={"80%"} height={32} />
            {Array.from({ length: 4 }).map((_, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                <Skeleton variant="text" width={"60%"} />
              </Box>
            ))}
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    </Container>
  );
};

export default QuizAttemptSkeleton;


