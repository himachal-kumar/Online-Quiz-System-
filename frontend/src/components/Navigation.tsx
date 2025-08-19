import React, { useContext, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
// import HomeIcon from '@mui/icons-material/Home';
import QuizIcon from '@mui/icons-material/Quiz';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/store';
import { resetTokens } from '../store/reducers/authReducer';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import LanguageSwitcher from './LanguageSwitcher';
import { motion } from 'framer-motion';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { ThemeModeContext } from '../themes';

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { mode, toggleMode } = useContext(ThemeModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(resetTokens());
      toast.success(t('auth.logoutSuccess'));
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleProfileMenuClose();
    }
  };

  // Derive leaderboard path based on current route context (use current quiz id when available)
  // const deriveLeaderboardPath = () => {
  //   const matchQuiz = location.pathname.match(/^\/quiz\/(\w+)/);
  //   if (matchQuiz && matchQuiz[1]) return `/leaderboard/${matchQuiz[1]}`;
  //   const matchResults = location.pathname.match(/^\/results\/(\w+)/);
  //   if (matchResults && matchResults[1]) return `/leaderboard/${matchResults[1]}`;
  //   const matchLeaderboard = location.pathname.match(/^\/leaderboard\/(\w+)/);
  //   if (matchLeaderboard && matchLeaderboard[1]) return `/leaderboard/${matchLeaderboard[1]}`;
  //   return '/quizzes';
  // };

  // const leaderboardPath = deriveLeaderboardPath();

  const navItems = [
    { name: t('navigation.quizzes'), path: '/quizzes', icon: <QuizIcon />, auth: true },
    { name: t('navigation.leaderboard'), path: '/leaderboard', icon: <LeaderboardIcon />, auth: true },
    { name: t('navigation.results') || 'Results', path: '/results', icon: <AssessmentIcon />, auth: true },
    { name: t('navigation.admin'), path: '/admin', icon: <AdminPanelSettingsIcon />, admin: true },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.admin && !isAdmin) return false;
    if (item.auth && !isAuthenticated) return false;
    return true;
  });

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
      QuizArena
      </Typography>
      <Divider />
      <List>
        {filteredNavItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                textAlign: 'left',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: (location.pathname === item.path || (item.path.startsWith('/leaderboard') && location.pathname.startsWith('/leaderboard')) || (item.path.startsWith('/results') && location.pathname.startsWith('/results'))) ? 'primary.contrastText' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        {!isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/login"
              selected={location.pathname === '/login'}
              sx={{
                textAlign: 'left',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary={t('auth.login')} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Box sx={{ mt: 2 }}>
        <LanguageSwitcher />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="static"
        color="default"
        sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}
        component={motion.div}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile menu icon */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              QuizArena
            </Typography>

            {/* Desktop navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                {filteredNavItems.map((item) => (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      my: 2,
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      ...((location.pathname === item.path || (item.path.startsWith('/leaderboard') && location.pathname.startsWith('/leaderboard')) || (item.path.startsWith('/results') && location.pathname.startsWith('/results'))) && {
                        borderBottom: '3px solid',
                        borderColor: 'primary.main',
                      }),
                    }}
                    startIcon={item.icon}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right side - Theme, Language and Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                onClick={toggleMode}
                aria-label="toggle theme"
                sx={{
                  mr: 1,
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  '&:hover': {
                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)'
                  }
                }}
              >
                {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
              </IconButton>
              {!isMobile && <LanguageSwitcher />}

              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ ml: 2 }}
                    aria-controls="profile-menu"
                    aria-haspopup="true"
                  >
                    <Avatar alt={user?.username} src={user?.avatar || undefined}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
                      <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={t('navigation.profile') || 'Profile'}
                        secondary={
                          <>
                            <Typography variant="body2" component="span" display="block">
                              {user?.username || ''}
                            </Typography>
                            <Typography variant="body2" component="span" color="text.secondary" display="block">
                              {user?.email || ''}
                            </Typography>
                          </>
                        }
                      />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>{t('auth.logout')}</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                !isMobile && (
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                    sx={{ ml: 2 }}
                    startIcon={<AccountCircleIcon />}
                  >
                    {t('auth.login')}
                  </Button>
                )
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Navigation;