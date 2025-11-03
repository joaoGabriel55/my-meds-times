import { useTheme } from "@/contexts/theme-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Shadows } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";

interface ThemeToggleButtonProps {
  style?: ViewStyle;
  size?: number;
}

export function ThemeToggleButton({ 
  style, 
  size = 24 
}: ThemeToggleButtonProps) {
  const { colorScheme, toggleTheme } = useTheme();
  const icon = useThemeColor({}, "icon");
  const iconButtonBg = useThemeColor({}, "buttonSecondary");

  return (
    <TouchableOpacity
      style={[
        styles.iconButton,
        { backgroundColor: iconButtonBg },
        Shadows.small,
        style,
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}
      accessibilityLabel={`Switch to ${colorScheme === "dark" ? "light" : "dark"} mode`}
      accessibilityRole="button"
    >
      <Ionicons 
        name={colorScheme === "dark" ? "sunny" : "moon"} 
        size={size} 
        color={icon} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});