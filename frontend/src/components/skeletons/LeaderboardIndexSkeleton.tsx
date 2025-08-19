import React from 'react';
import { Box, Container, Paper, Skeleton, Grid, Card, CardContent } from '@mui/material';

const LeaderboardIndexSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Skeleton variant="text" width={220} height={36} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width={360} sx={{ mx: 'auto' }} />
        </Box>
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width={180} height={28} />
                  <Skeleton variant="text" width={"90%"} />
                  <Skeleton variant="text" width={"80%"} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default LeaderboardIndexSkeleton;


