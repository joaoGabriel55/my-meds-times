import { formatDateTime, parseDateToISO } from "@/helpers/formats";
import { MedicationScheduleRepositoryPort } from "@/src/application/ports/MedicationScheduleRepositoryPort";
import { MedicationScheduleServicePort } from "@/src/application/ports/MedicationScheduleServicePort";
import {
  MedicationSchedule,
  MedicationScheduleInput,
} from "@/src/domain/models/MedicationSchedule";
import { compareAsc, formatDate } from "date-fns";

function generateId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function MedicationScheduleService(
  repository: MedicationScheduleRepositoryPort,
): MedicationScheduleServicePort {
  return {
    create: (schedule: MedicationScheduleInput) => {
      try {
        return repository.create({
          ...schedule,
          createdAt: parseDateToISO(new Date()),
          id: generateId(),
        });
      } catch {
        throw new Error("Failed to create medication schedule");
      }
    },
    update: (id: string, schedule: MedicationSchedule) => {
      try {
        return repository.update(id, {
          ...schedule,
          updatedAt: parseDateToISO(new Date()),
        });
      } catch {
        throw new Error("Failed to update medication schedule");
      }
    },
    delete: (id: string) => {
      try {
        return repository.delete(id);
      } catch {
        throw new Error("Failed to delete medication schedule");
      }
    },
    findById: (id: string) => {
      try {
        return repository.findById(id);
      } catch {
        throw new Error("Failed to find medication schedule");
      }
    },
    findAll: async () => {
      try {
        const schedules = await repository.findAll();

        return schedules.sort((a, b) => compareAsc(a.createdAt, b.createdAt));
      } catch {
        throw new Error("Failed to fetch medication schedules");
      }
    },
  };
}
