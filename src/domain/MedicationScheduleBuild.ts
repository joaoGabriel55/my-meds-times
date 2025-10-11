import { MedicationSchedule } from "./models/MedicationSchedule";

export function medicationScheduleBuild({
  intervalHours,
  startDateTime,
  days,
}: Pick<
  MedicationSchedule,
  "intervalHours" | "startDateTime" | "days"
>): Date[] {
  const schedule: Date[] = [];
  const endTime = new Date(startDateTime.getTime());
  endTime.setDate(endTime.getDate() + days);

  let current = new Date(startDateTime);

  while (current <= endTime) {
    schedule.push(new Date(current));
    current = new Date(current.getTime() + intervalHours * 60 * 60 * 1000);
  }

  // ensure last dose is included (even if slightly beyond endTime)
  if (schedule[schedule.length - 1].getTime() < endTime.getTime()) {
    const lastDose = new Date(
      schedule[schedule.length - 1].getTime() + intervalHours * 60 * 60 * 1000,
    );
    schedule.push(lastDose);
  }

  return schedule;
}
