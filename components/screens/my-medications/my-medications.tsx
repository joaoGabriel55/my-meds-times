import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNotifications } from "@/hooks/use-notifications";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MedicationScheduleService } from "@/src/domain/MedicationScheduleService";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
import { container } from "@/src/infrastructure/container";
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
  const icon = useThemeColor({}, "icon");

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <IconSymbol name="pills.circle" size={48} color={tint} />
            <ThemedText type="title" style={styles.titleText}>
              My Medications
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <IconSymbol name="moon.circle.fill" size={28} color={icon} />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.subtitle}>
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
        style={[styles.fab, { backgroundColor: tint }]}
        onPress={() => router.push("/new-med-times")}
        activeOpacity={0.85}
      >
        <IconSymbol name="plus" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
