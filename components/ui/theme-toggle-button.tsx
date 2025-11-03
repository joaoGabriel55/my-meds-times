import { useTheme } from "@/contexts/theme-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Shadows } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";

interface ThemeToggleButtonProps {
  style?: ViewStyle;
}

type ThemeOption = "light" | "dark" | "system";

export function ThemeToggleButton({ style }: ThemeToggleButtonProps) {
  const { t } = useTranslation();
  const { colorScheme, setTheme } = useTheme();
  const icon = useThemeColor({}, "icon");
  const text = useThemeColor({}, "text");
  const buttonSecondary = useThemeColor({}, "buttonSecondary");
  const tint = useThemeColor({}, "tint");

  // Determine current selection (default to system if null)
  const currentTheme: ThemeOption = colorScheme || "system";

  const themeOptions: {
    value: ThemeOption;
    labelKey: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { value: "light", labelKey: "settings.themeLight", icon: "sunny" },
    { value: "dark", labelKey: "settings.themeDark", icon: "moon" },
    { value: "system", labelKey: "settings.themeSystem", icon: "phone-portrait-outline" },
  ];

  const handleThemeChange = (theme: ThemeOption) => {
    if (theme === "system") {
      setTheme(null);
    } else {
      setTheme(theme);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {themeOptions.map((option) => {
        const isSelected = currentTheme === option.value;
        
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              {
                backgroundColor: isSelected ? tint : buttonSecondary,
                borderColor: isSelected ? tint : "transparent",
              },
              Shadows.small,
            ]}
            onPress={() => handleThemeChange(option.value)}
            activeOpacity={0.7}
            accessibilityLabel={`${t(option.labelKey)} theme`}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
          >
            <Ionicons
              name={option.icon}
              size={20}
              color={isSelected ? "#FFFFFF" : icon}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isSelected ? "#FFFFFF" : text,
                  fontWeight: isSelected ? "600" : "400",
                },
              ]}
            >
              {t(option.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    gap: 6,
    minWidth: 90,
  },
  label: {
    fontSize: 14,
  },
});