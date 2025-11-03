import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { InputNumber } from "@/components/ui/input/input-number";
import { InputText } from "@/components/ui/input/input-text";

import { parseDateToISO } from "@/helpers/formats";
import { useMedTimesForm } from "@/hooks/med-times/use-med-times-form";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Shadows } from "@/constants/theme";
import { MedicationScheduleInput } from "@/src/domain/models/MedicationSchedule";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

interface Props {
  values?: MedicationScheduleInput;
  onSubmit: (formState: MedicationScheduleInput) => void;
}

export function MedicationFormComponent({ values, onSubmit }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const { formState, handleFormChange, errors, validateForm } = useMedTimesForm(
    { values },
  );

  const errorColor = useThemeColor({}, "error");
  const buttonPrimaryBg = useThemeColor({}, "buttonPrimary");
  const buttonPrimaryText = useThemeColor({}, "buttonPrimaryText");
  const tintColor = useThemeColor({}, "tint");

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formState);
    }
  };

  return (
    <ThemedView style={styles.formContainer}>
      <InputText
        label={t("medicationForm.fields.medicationName")}
        value={formState.name}
        lint={errors.name}
        onChange={(text) => handleFormChange("name", text)}
      />
      <InputText
        label={t("medicationForm.fields.description")}
        value={formState.description || ""}
        onChange={(text) => handleFormChange("description", text)}
      />

      <InputNumber
        label={t("medicationForm.fields.days")}
        value={formState.days}
        lint={errors.days}
        onChange={(value) => handleFormChange("days", value)}
      />

      <InputNumber
        label={t("medicationForm.fields.interval")}
        value={formState.intervalHours}
        lint={errors.intervalHours}
        onChange={(value) => handleFormChange("intervalHours", value)}
      />

      <View>
        <ThemedText
          style={{
            fontSize: 16,
            color: useThemeColor({}, "text"),
            paddingBottom: 8,
          }}
        >
          {t("medicationForm.fields.startDateTime")}:
        </ThemedText>
        <DateTimePicker
          value={formState.startDateTime}
          mode="datetime"
          {...(formState.startDateTime ? { minimumDate: new Date() } : {})}
          onConfirm={(date) => {
            handleFormChange("startDateTime", parseDateToISO(date));
          }}
        />
        <ThemedText style={{ fontSize: 14, color: errorColor }}>
          {errors.startDateTime}
        </ThemedText>
      </View>
      <View style={{ gap: 16 }}>
        <TouchableOpacity
          style={[
            {
              backgroundColor: buttonPrimaryBg,
              padding: 12,
              borderRadius: 8,
            },
            Shadows.small,
          ]}
          onPress={handleSubmit}
        >
          <ThemedText
            style={{
              fontSize: 18,
              textAlign: "center",
              fontWeight: "bold",
              color: buttonPrimaryText,
            }}
          >
            {t("common.save")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              borderColor: tintColor,
              borderWidth: 1,
              padding: 12,
              borderRadius: 8,
            },
          ]}
          onPress={() => {
            router.back();
          }}
        >
          <ThemedText
            style={{
              fontSize: 18,
              textAlign: "center",
              fontWeight: "bold",
              color: tintColor,
            }}
          >
            {t("common.cancel")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 28,
  },
  formContainer: {
    flexDirection: "column",
    gap: 24,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
});
