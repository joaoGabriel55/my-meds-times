export interface MedicationSchedule {
  id: string;
  name: string;
  description?: string;
  intervalHours: number;
  startDateTime: Date;
  days: number;
}
