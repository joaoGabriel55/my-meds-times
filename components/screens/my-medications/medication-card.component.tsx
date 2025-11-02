import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { formatDateHour, formatDateTime } from "@/helpers/formats";
import { useThemeColor } from "@/hooks/use-theme-color";
import { medicationScheduleBuild } from "@/src/domain/MedicationScheduleBuild";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./my-medications.styles";

interface MedicationCardProps {
  schedule: MedicationSchedule;
  onRemove: (id: string) => void;
}

export function MedicationCard({ schedule, onRemove }: MedicationCardProps) {
  const router = useRouter();

  const bg = useThemeColor({}, "background");

  const { id, name, description, startDateTime, intervalHours, days } =
    schedule;

  const scheduleTimes = medicationScheduleBuild({
    intervalHours,
    startDateTime,
    days: 3,
  });

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bg }]}
      onPress={() => {
        router.push(`/${id}`);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ThemedText style={styles.cardTitle}>{name}</ThemedText>
        <TouchableOpacity
          style={styles.trashButton}
          onPress={() => onRemove(id)}
        >
          <IconSymbol name="trash" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
      {description && (
        <ThemedText style={styles.cardDesc}>{description}</ThemedText>
      )}
      <View style={styles.cardDetails}>
        <ThemedText style={styles.cardDetail}>
          {intervalHours}h interval
        </ThemedText>
        <ThemedText style={styles.cardDetail}>{days} days</ThemedText>
        <ThemedText style={styles.cardDetail}>
          {formatDateTime(startDateTime)}
        </ThemedText>
      </View>
      <ThemedText style={styles.cardDesc}>Scheduled Hours</ThemedText>
      <View style={styles.cardDetails}>
        {scheduleTimes.map((time, index) => (
          <ThemedText key={index} style={styles.cardDetail}>
            {formatDateHour(time)}
          </ThemedText>
        ))}
      </View>
    </TouchableOpacity>
  );
}
