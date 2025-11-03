import { useTheme } from "@/contexts/theme-context";

export function useColorScheme() {
  const { colorScheme } = useTheme();
  return colorScheme;
}

export function useThemeActions() {
  const { toggleTheme, setTheme } = useTheme();
  return { toggleTheme, setTheme };
}

// Re-export the full theme hook for convenience
export { useTheme } from "@/contexts/theme-context";