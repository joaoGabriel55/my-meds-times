import { ThemedText } from "@/components/themed-text";
import { Shadows } from "@/constants/theme";
import { formatDateHour, formatDateTime } from "@/helpers/formats";
import { useThemeColor } from "@/hooks/use-theme-color";
import { medicationScheduleBuild } from "@/src/domain/MedicationScheduleBuild";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { styles } from "./my-medications.styles";

interface MedicationCardProps {
  schedule: MedicationSchedule;
  onRemove: (id: string) => void;
}

export function MedicationCard({ schedule, onRemove }: MedicationCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const cardBg = useThemeColor({}, "card");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const buttonPrimaryText = useThemeColor({}, "buttonPrimaryText");
  const trashButtonBg = useThemeColor({}, "card");
  const errorColor = useThemeColor({}, "error");

  const { id, name, description, startDateTime, intervalHours, days } =
    schedule;

  const scheduleTimes = medicationScheduleBuild({
    intervalHours,
    startDateTime,
    days: 3,
  });

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBg }, Shadows.medium]}
      onPress={() => {
        router.push(`/${id}`);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <View style={{ gap: 4 }}>
          <ThemedText style={styles.cardTitle}>{name}</ThemedText>
          {description && (
            <ThemedText style={[styles.cardDesc, { color: textSecondary }]}>
              {description}
            </ThemedText>
          )}
        </View>
        <TouchableOpacity
          style={[styles.trashButton, { backgroundColor: trashButtonBg }]}
          onPress={() => onRemove(id)}
        >
          <Ionicons name="trash-bin-outline" size={20} color={errorColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardDetails}>
        <ThemedText
          style={[
            styles.cardDetail,
            { backgroundColor: tint, color: buttonPrimaryText, height: 28 },
          ]}
        >
          {t("medicationCard.intervalLabel", { hours: intervalHours })}
        </ThemedText>
        <ThemedText
          style={[
            styles.cardDetail,
            { backgroundColor: tint, color: buttonPrimaryText, height: 28 },
          ]}
        >
          {t("medicationCard.daysLabel", { count: days, days })}
        </ThemedText>
        <ThemedText
          style={[
            styles.cardDetail,
            { backgroundColor: tint, color: buttonPrimaryText, height: 28 },
          ]}
        >
          {formatDateTime(startDateTime)}
        </ThemedText>
      </View>
      <View style={{ gap: 8 }}>
        <ThemedText style={[styles.cardDesc, { color: textSecondary }]}>
          {t("medicationCard.scheduledHours")}
        </ThemedText>
        <View style={styles.cardDetails}>
          {scheduleTimes.map((time, index) => (
            <ThemedText
              key={index}
              style={[
                styles.cardDetail,
                {
                  backgroundColor: tint,
                  color: buttonPrimaryText,
                  height: 28,
                },
              ]}
            >
              {formatDateHour(time)}
            </ThemedText>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}
