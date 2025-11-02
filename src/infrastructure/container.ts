import { MedicationScheduleRepositoryPort } from "../application/ports/MedicationScheduleRepositoryPort";
import { LocalStorageMedicationScheduleRepository } from "./repositories/LocalStorageMedicationScheduleRepository";

type Container = {
  MedicationScheduleRepository: () => MedicationScheduleRepositoryPort;
};

export const container: Container = {
  MedicationScheduleRepository: LocalStorageMedicationScheduleRepository,
} as const;
