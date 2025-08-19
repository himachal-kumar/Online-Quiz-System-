import React from 'react';
import { Box, Container, Paper, Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const LeaderboardSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Skeleton variant="text" width={220} height={36} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width={320} sx={{ mx: 'auto' }} />
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              {["Rank","User","Score","Percentage","Time","Date"].map((h) => (
                <TableCell key={h}><Skeleton variant="text" width={100} /></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 6 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell><Skeleton variant="circular" width={30} height={30} /></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                    <Box sx={{ width: '100%' }}>
                      <Skeleton variant="text" width={160} />
                      <Skeleton variant="text" width={220} />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell><Skeleton variant="text" width={80} /></TableCell>
                <TableCell><Skeleton variant="text" width={120} /></TableCell>
                <TableCell><Skeleton variant="text" width={80} /></TableCell>
                <TableCell><Skeleton variant="text" width={120} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default LeaderboardSkeleton;


