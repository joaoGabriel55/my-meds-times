import { EditMedTimesForm } from "@/components/screens/edit-med-times-form";
import { useLocalSearchParams } from "expo-router";

export default function EditMedicationTimesScreen() {
  const params = useLocalSearchParams();

  const id = params.id as string;

  return <EditMedTimesForm id={id} />;
}
