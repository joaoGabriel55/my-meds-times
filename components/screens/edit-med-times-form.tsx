import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMedTimesQuery } from "@/hooks/med-times/use-med-times-query";
import { useMedTimesUpdate } from "@/hooks/med-times/use-med-times-update";
import { MedicationScheduleInput } from "@/src/domain/models/MedicationSchedule";
import { useRouter } from "expo-router";
import { MedicationFormComponent } from "../medication-form/medication-form.component";
import { MedicationFormContainer } from "../medication-form/medication-form.container";

interface Props {
  id: string;
}

export function EditMedTimesForm({ id }: Props) {
  const router = useRouter();

  const { medicationSchedule, isLoading } = useMedTimesQuery(id);
  const { updateMedTimes } = useMedTimesUpdate(id);

  const handleUpdate = async (formState: MedicationScheduleInput) => {
    if (!medicationSchedule) return;

    try {
      await updateMedTimes({
        id,
        createdAt: medicationSchedule.createdAt,
        ...formState,
      });

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MedicationFormContainer>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Edit Med Times</ThemedText>
        <ThemedText>Register a schedule for your medication.</ThemedText>
      </ThemedView>
      {medicationSchedule && !isLoading && (
        <MedicationFormComponent
          values={medicationSchedule}
          onSubmit={handleUpdate}
        />
      )}
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
