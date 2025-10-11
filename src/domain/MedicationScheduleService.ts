import { MedicationScheduleRepositoryPort } from "@/src/application/ports/MedicationScheduleRepositoryPort";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
import { MedicationScheduleServicePort } from "@/src/application/ports/MedicationScheduleServicePort";

export function MedicationScheduleService(
  repository: MedicationScheduleRepositoryPort,
): MedicationScheduleServicePort {
  return {
    create: (schedule: MedicationSchedule) => {
      try {
        return repository.create(schedule);
      } catch (error) {
        throw new Error("Failed to create medication schedule");
      }
    },
    update: (id: string, schedule: MedicationSchedule) => {
      try {
        return repository.update(id, schedule);
      } catch (error) {
        throw new Error("Failed to update medication schedule");
      }
    },
    delete: (id: string) => {
      try {
        return repository.delete(id);
      } catch (error) {
        throw new Error("Failed to delete medication schedule");
      }
    },
    findById: (id: string) => {
      try {
        return repository.findById(id);
      } catch (error) {
        throw new Error("Failed to find medication schedule");
      }
    },
    findAll: () => {
      try {
        return repository.findAll();
      } catch (error) {
        throw new Error("Failed to fetch medication schedules");
      }
    },
  };
}
