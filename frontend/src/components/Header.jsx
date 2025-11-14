import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  InputBase,
  useTheme,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSearch } from '../contexts/SearchContext';

export default function Header({ mode, setMode }) {

  const { user, signout } = useAuth();
  const nav = useNavigate();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const { searchQuery, setSearchQuery } = useSearch();
  // menu for mobile / avatar
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');

  

const onQueryChange = (value) => {
  setSearchQuery(value);
};


  return (
    <AppBar
      position="sticky"
      sx={{
        // gradient background
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.9)} 40%, ${alpha(theme.palette.secondary.main, 0.95)} 100%)`,
        color: theme.palette.primary.contrastText,
        py: { xs: 0.5, sm: 1 },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
          // glass panel for centered content
          mx: { xs: 1, sm: 2 },
          px: { xs: 0, sm: 1 },
        }}
      >
        {/* Left: logo / title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component={RouterLink}
            to="/dashboard"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                mr: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.common.white, 0.12),
                boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', fontSize: 20 }}>
                TM
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
              Task Manager
            </Typography>
          </Box>
        </Box>

        {/* Center: search (hidden on very small screens) */}
        {!isSm && (
          <Box
            sx={{
              flex: 1,
              mx: 2,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 640,
                bgcolor: alpha(theme.palette.common.white, 0.12),
                borderRadius: 6,
                py: 0.5,
                px: 1,
                boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.02)}`,
              }}
            >
              <SearchIcon sx={{ color: alpha(theme.palette.common.white, 0.8), mr: 1 }} />
              <InputBase
                placeholder="Search tasks, titles or descriptions..."
                sx={{
                  color: 'inherit',
                  width: '100%',
                  fontSize: 14,
                }}
                inputProps={{ 'aria-label': 'search tasks' }}
                value={searchQuery}
                onChange={(e) => onQueryChange(e.target.value)}
              />
            </Box>
          </Box>
        )}

        {/* Right: theme toggle, create, avatar/menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={toggleMode} sx={{ color: 'inherit' }} aria-label="toggle-theme">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Add Task CTA (hidden on xs to save space) */}
          {/* {!isSm && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => nav('/tasks/new')}
              sx={{ ml: 1, textTransform: 'none' }}
            >
              + Add Task
            </Button>
          )} */}

          {/* Avatar / Menu */}
          {user ? (
            <>
              <Tooltip title={user.name || 'Account'}>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    ml: 1,
                    width: 40,
                    height: 40,
                    bgcolor: alpha(theme.palette.common.white, 0.12),
                    borderRadius: 2,
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    nav('/dashboard');
                  }}
                >
                  Dashboard
                </MenuItem>

                {/* <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    nav('/tasks/new');
                  }}
                >
                  Add Task
                </MenuItem> */}

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    signout();
                    nav('/signin');
                  }}
                >
                  Sign out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/signin"
                variant="outlined"
                sx={{
                  color: theme.palette.common.white,
                  borderColor: alpha(theme.palette.common.white, 0.22),
                  textTransform: 'none',
                }}
              >
                Sign in
              </Button>

              {/* mobile menu fallback */}
              <IconButton
                sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                onClick={() => {
                  // fallback nav on tiny screens
                  nav('/signin');
                }}
              >
                <MenuIcon sx={{ color: 'inherit' }} />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
