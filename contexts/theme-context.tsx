import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ColorSchemeName } from "react-native";

const THEME_STORAGE_KEY = "@theme_preference";

type ThemeContextType = {
  colorScheme: ColorSchemeName;
  toggleTheme: () => void;
  setTheme: (theme: ColorSchemeName) => void;
  isLoading: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>("light");
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "dark" || savedTheme === "light") {
        setColorScheme(savedTheme);
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (theme: ColorSchemeName) => {
    try {
      if (theme) {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const setTheme = (theme: ColorSchemeName) => {
    setColorScheme(theme);
    saveThemePreference(theme);
  };

  const toggleTheme = () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ colorScheme, toggleTheme, setTheme, isLoading }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}