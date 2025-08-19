import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, GlobalStyles } from "@mui/material";

export type ThemeMode = "light" | "dark";

export const ThemeModeContext = createContext<{ mode: ThemeMode; toggleMode: () => void }>(
  { mode: "light", toggleMode: () => {} }
);

const buildTheme = (mode: ThemeMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#1976d2" : "#90caf9",
      },
      secondary: {
        main: mode === "light" ? "#9c27b0" : "#ce93d8",
      },
      background: {
        default: mode === "light" ? "#f7f9fc" : "#0b0f17",
        paper: mode === "light" ? "#ffffff" : "#121826",
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        defaultProps: { elevation: 1 },
        styleOverrides: {
          root: {
            transition: "background-color 0.2s ease, color 0.2s ease",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });

export const ThemeModeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const saved = (localStorage.getItem("theme_mode") as ThemeMode) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setMode(saved);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme_mode", next);
      return next;
    });
  }, []);

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{
          body: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            transition: 'background-color 0.2s ease, color 0.2s ease',
          },
          '#root': {
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
          }
        }} />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default buildTheme("light");


