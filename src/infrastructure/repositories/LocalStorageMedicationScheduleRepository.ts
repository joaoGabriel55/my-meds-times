import { MedicationScheduleRepositoryPort } from "@/src/application/ports/MedicationScheduleRepositoryPort";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
import Storage from "expo-sqlite/kv-store";

const KEY = "medicationSchedules";

export function LocalStorageMedicationScheduleRepository(): MedicationScheduleRepositoryPort {
  return {
    create: (schedule: MedicationSchedule) => {
      const medicationSchedules = Storage.getItemSync(KEY);

      const newMedicationSchedules = medicationSchedules
        ? [...JSON.parse(medicationSchedules), schedule]
        : [schedule];

      Storage.setItemSync(KEY, JSON.stringify(newMedicationSchedules));

      const lastSchedule =
        newMedicationSchedules[newMedicationSchedules.length - 1];

      return lastSchedule as MedicationSchedule;
    },
    update: (id: string, schedule: MedicationSchedule) => {
      const medicationSchedules = Storage.getItemSync(KEY);

      const newMedicationSchedules = medicationSchedules
        ? JSON.parse(medicationSchedules).map((s: MedicationSchedule) =>
            s.id === id ? schedule : s,
          )
        : [schedule];

      Storage.setItemSync(KEY, JSON.stringify(newMedicationSchedules));

      const updatedSchedule =
        newMedicationSchedules[newMedicationSchedules.length - 1];

      return updatedSchedule as MedicationSchedule;
    },
    delete: (id: string) => {
      const medicationSchedules = Storage.getItemSync(KEY);

      const newMedicationSchedules = medicationSchedules
        ? JSON.parse(medicationSchedules).filter(
            (s: MedicationSchedule) => s.id !== id,
          )
        : [];

      Storage.setItemSync(KEY, JSON.stringify(newMedicationSchedules));
    },
    findById: (id: string) => {
      const medicationSchedules = Storage.getItemSync(KEY);

      const foundSchedule = medicationSchedules
        ? JSON.parse(medicationSchedules).find(
            (s: MedicationSchedule) => s.id === id,
          )
        : undefined;

      return foundSchedule;
    },
    findAll: () => {
      const medicationSchedules = Storage.getItemSync(KEY);

      return medicationSchedules ? JSON.parse(medicationSchedules) : [];
    },
  };
}
