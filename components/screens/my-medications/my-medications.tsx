import { ThemedText } from "@/components/themed-text";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { Shadows } from "@/constants/theme";
import { useNotifications } from "@/hooks/use-notifications";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MedicationScheduleService } from "@/src/domain/MedicationScheduleService";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
import { container } from "@/src/infrastructure/container";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MedicationCard } from "./medication-card.component";
import { styles } from "./my-medications.styles";

const { MedicationScheduleRepository } = container;
const medicationScheduleRepository = MedicationScheduleRepository();
const service = MedicationScheduleService(medicationScheduleRepository);

export function MyMedications() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const bg = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");
  const buttonPrimaryText = useThemeColor({}, "buttonPrimaryText");

  useNotifications();

  useEffect(() => {
    const loadMedicationSchedules = async () => {
      try {
        const schedules = await service.findAll();

        setSchedules(schedules);
      } catch (error) {
        console.error("Error loading medication schedule:", error);
      }
    };
    loadMedicationSchedules();
  }, []);

  const handleRemoveSchedule = async (id: string) => {
    try {
      await service.delete(id);
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
    } catch (error) {
      console.error("Error removing medication schedule:", error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Ionicons name="medkit" size={28} color={textSecondary} />
            <ThemedText type="title" style={styles.titleText}>
              My Medications
            </ThemedText>
          </View>
          <ThemeToggleButton />
        </View>
        <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
          <ThemedText style={styles.bold}>{schedules.length}</ThemedText>{" "}
          medication scheduled.
        </ThemedText>
        <View style={styles.cardList}>
          {schedules.map((schedule) => (
            <MedicationCard
              key={schedule.id}
              schedule={schedule}
              onRemove={handleRemoveSchedule}
            />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: tint }, Shadows.large]}
        onPress={() => router.push("/new-med-times")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={buttonPrimaryText} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
