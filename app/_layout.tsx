import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useNotifications } from "@/hooks/use-notifications";
import { useThemeColor } from "@/hooks/use-theme-color";
import "@/lib/i18n";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </LanguageProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  useNotifications();

  return (
    <NavigationThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: useThemeColor({}, "background"),
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="new-med-times" options={{ headerShown: false }} />
        <Stack.Screen name="[id]" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={useThemeColor({}, "background")}
      />
    </NavigationThemeProvider>
  );
}
