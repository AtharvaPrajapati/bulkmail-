import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "bes_theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

/**
 * useDarkMode - manages light/dark theme state and persists it to localStorage.
 * Applies the chosen theme via the [data-theme] attribute on <html>.
 */
const useDarkMode = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return { theme, toggle, isDark: theme === "dark" };
};

export default useDarkMode;
