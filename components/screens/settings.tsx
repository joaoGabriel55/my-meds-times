import { useThemeColor } from "@/hooks/use-theme-color";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../themed-text";
import { LanguageSelector } from "../ui/language-selector";
import { ThemeToggleButton } from "../ui/theme-toggle-button";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/language-context";

export function Settings() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const bg = useThemeColor({}, "background");
  const color = useThemeColor({}, "text");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <View style={[styles.headerRow, isRTL && styles.headerRowRTL]}>
          <View
            style={[styles.titleContainer, isRTL && styles.titleContainerRTL]}
          >
            {/* Back button */}
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name={isRTL ? "arrow-forward" : "arrow-back"}
                size={28}
                color={color}
              />
            </TouchableOpacity>
            <ThemedText type="title" style={styles.titleText}>
              {t("settings.title")}
            </ThemedText>
          </View>
        </View>
        <View style={styles.container}>
          <View>
            <ThemedText type="subtitle" style={styles.subtitle}>
              {t("settings.language")}
            </ThemedText>
            <LanguageSelector />
          </View>
          <View>
            <ThemedText type="subtitle" style={styles.subtitle}>
              {t("settings.selectTheme")}
            </ThemedText>
            <ThemeToggleButton />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
    flexGrow: 1,
  },
  container: {
    flex: 1,
    gap: 24,
  },
  headerRow: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
    marginBottom: 18,
  },
  headerRowRTL: {
    flexDirection: "row-reverse",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleContainerRTL: {
    flexDirection: "row-reverse",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "semibold",
    marginBottom: 18,
  },
});
