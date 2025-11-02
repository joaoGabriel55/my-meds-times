import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMedTimesQuery } from "@/hooks/med-times/use-med-times-query";
import { useMedTimesUpdate } from "@/hooks/med-times/use-med-times-update";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MedicationScheduleInput } from "@/src/domain/models/MedicationSchedule";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MedicationFormComponent } from "../medication-form/medication-form.component";

interface Props {
  id: string;
}

export function EditMedTimesForm({ id }: Props) {
  const router = useRouter();

  const { medicationSchedule, isLoading } = useMedTimesQuery(id);
  const { updateMedTimes } = useMedTimesUpdate(id);

  const handleUpdate = async (formState: MedicationScheduleInput) => {
    try {
      await updateMedTimes(formState);

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: useThemeColor({}, "background"),
      }}
    >
      <ScrollView
        style={{
          padding: 28,
          backgroundColor: useThemeColor({}, "background"),
        }}
      >
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
      </ScrollView>
    </SafeAreaView>
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
