import { MedicationSchedule, MedicationScheduleInput } from "@/src/domain/models/MedicationSchedule";

export interface MedicationScheduleServicePort {
  create(schedule: MedicationScheduleInput): Promise<MedicationSchedule>;
  update(id: string, schedule: MedicationSchedule): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<MedicationSchedule | null>;
  findAll(): Promise<MedicationSchedule[]>;
}
