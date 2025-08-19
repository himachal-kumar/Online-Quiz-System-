import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/store";
import Navigation from "../components/Navigation";
import { Box, Container } from "@mui/material";

function Basic() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default Basic;
