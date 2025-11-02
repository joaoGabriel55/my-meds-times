import { MedicationScheduleRepositoryPort } from "@/src/application/ports/MedicationScheduleRepositoryPort";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "medicationSchedules";

export function LocalStorageMedicationScheduleRepository(): MedicationScheduleRepositoryPort {
  return {
    create: async (schedule: MedicationSchedule) => {
      const medicationSchedules = await AsyncStorage.getItem(KEY);

      const newMedicationSchedules = medicationSchedules
        ? [...JSON.parse(medicationSchedules), schedule]
        : [schedule];

      await AsyncStorage.setItem(KEY, JSON.stringify(newMedicationSchedules));

      const lastSchedule =
        newMedicationSchedules[newMedicationSchedules.length - 1];

      return lastSchedule;
    },
    update: async (id: string, schedule: MedicationSchedule) => {
      const input = {
        ...schedule,
        startDateTime: schedule.startDateTime.toLocaleString(),
      };

      const medicationSchedules = await AsyncStorage.getItem(KEY);

      const newMedicationSchedules = medicationSchedules
        ? JSON.parse(medicationSchedules).map((s: MedicationSchedule) =>
            s.id === id ? input : s,
          )
        : [input];

      await AsyncStorage.setItem(KEY, JSON.stringify(newMedicationSchedules));
    },
    delete: async (id: string) => {
      const medicationSchedules = await AsyncStorage.getItem(KEY);

      const newMedicationSchedules = medicationSchedules
        ? JSON.parse(medicationSchedules).filter(
            (s: MedicationSchedule) => s.id !== id,
          )
        : [];

      await AsyncStorage.setItem(KEY, JSON.stringify(newMedicationSchedules));
    },
    findById: async (id: string) => {
      const medicationSchedules = await AsyncStorage.getItem(KEY);

      const foundSchedule = medicationSchedules
        ? JSON.parse(medicationSchedules).find(
            (s: MedicationSchedule) => s.id === id,
          )
        : undefined;

      return foundSchedule;
    },
    findAll: async () => {
      const items = await AsyncStorage.getItem(KEY);
      const parsedItems = items ? JSON.parse(items) : [];

      return parsedItems;
    },
  };
}
