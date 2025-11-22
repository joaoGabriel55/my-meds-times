import Alarm from "@/lib/native/alarm-module";
import { medicationScheduleBuild } from "@/src/domain/MedicationScheduleBuild";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
import { format } from "date-fns/format";

export async function scheduleMedicationAlarms(
  medicationSchedule: MedicationSchedule,
): Promise<void> {
  const scheduledTimes = medicationScheduleBuild({
    intervalHours: medicationSchedule.intervalHours,
    startDateTime: medicationSchedule.startDateTime,
    days: medicationSchedule.days,
  });

  const alarmPromises = scheduledTimes.map((scheduledTime) =>
    Alarm.scheduleAlarm({
      id: `medication-${medicationSchedule.id}-${scheduledTime.getTime()}`,
      datetimeISO: format(scheduledTime, "yyyy-MM-dd'T'HH:mm:ss"),
      title: medicationSchedule.name,
      body: medicationSchedule.description ?? "Time to take your medication",
    }),
  );

  await Promise.all(alarmPromises);
  console.log("Medication notifications scheduled successfully");
}

export async function removeMedicationAlarms(
  medicationSchedule: MedicationSchedule,
): Promise<void> {
  const scheduledTimes = medicationScheduleBuild({
    intervalHours: medicationSchedule.intervalHours,
    startDateTime: medicationSchedule.startDateTime,
    days: medicationSchedule.days,
  });

  const alarmPromises = scheduledTimes.map((scheduledTime) =>
    Alarm.cancelAlarm(
      `medication-${medicationSchedule.id}-${scheduledTime.getTime()}`,
    ),
  );

  await Promise.all(alarmPromises);
  console.log("Medication notifications removed successfully");
}
