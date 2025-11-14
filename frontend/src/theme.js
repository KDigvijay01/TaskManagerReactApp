import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { deepPurple, teal, grey } from '@mui/material/colors';

export default function getTheme(mode = 'light') {
  const isDark = mode === 'dark';

  const palette = {
    mode,
    primary: {
      main: deepPurple[500],
      contrastText: '#fff',
    },
    secondary: {
      main: teal[400],
      contrastText: '#fff',
    },
    background: {
      default: isDark ? '#071026' : '#f7f8fa', // page background
      paper: isDark ? '#0f1724' : '#ffffff',   // card/paper surfaces
    },
    text: {
      primary: isDark ? '#E6EEF6' : grey[900],
      secondary: isDark ? '#AFC6DB' : grey[700],
    },
    divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)',
  };

  let theme = createTheme({
    palette,
    typography: {
      fontFamily: ['Poppins', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      h1: { fontWeight: 600 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 500 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
      body1: { fontSize: '1rem', lineHeight: 1.6 },
      button: { textTransform: 'none', fontWeight: 600 },
    },

    components: {
      MuiCssBaseline: {
        // styleOverrides can be an object that uses palette values from this theme
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            overflowX: 'hidden',
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            // give AppBar slightly translucent look in dark mode
            backgroundImage: isDark
              ? `linear-gradient(90deg, rgba(20,30,48,0.9), rgba(12,22,36,0.9))`
              : undefined,
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: palette.background.paper,
            color: palette.text.primary,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: palette.background.paper,
            color: palette.text.primary,
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 600,
          },
        },
      },

      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent',
            color: palette.text.primary,
            borderRadius: 8,
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${palette.divider}`,
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: palette.divider,
          },
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);
  return theme;
}
