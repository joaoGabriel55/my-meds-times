import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";

export interface MedicationScheduleRepositoryPort {
  create(schedule: MedicationSchedule): Promise<MedicationSchedule>;
  update(id: string, schedule: MedicationSchedule): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<MedicationSchedule | null>;
  findAll(): Promise<MedicationSchedule[]>;
}
