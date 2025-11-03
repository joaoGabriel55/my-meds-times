import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMedTimesCreate } from "@/hooks/med-times/use-med-times-create";
import { MedicationScheduleInput } from "@/src/domain/models/MedicationSchedule";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { MedicationFormComponent } from "../medication-form/medication-form.component";
import { MedicationFormContainer } from "../medication-form/medication-form.container";

export function NewMedTimesForm() {
  const { t } = useTranslation();
  const router = useRouter();

  const { createMedTimes } = useMedTimesCreate();

  const handleSave = async (formState: MedicationScheduleInput) => {
    try {
      await createMedTimes(formState);

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MedicationFormContainer>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t("medicationForm.newTitle")}</ThemedText>
        <ThemedText>{t("medicationForm.newSubtitle")}</ThemedText>
      </ThemedView>
      <MedicationFormComponent onSubmit={handleSave} />
    </MedicationFormContainer>
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
