import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";

export interface MedicationScheduleServicePort {
  create(schedule: MedicationSchedule): MedicationSchedule;
  update(id: string, schedule: MedicationSchedule): void;
  delete(id: string): void;
  findById(id: string): MedicationSchedule | null;
  findAll(): Array<MedicationSchedule>;
}
