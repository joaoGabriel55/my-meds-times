import Alarm from "@/lib/native/alarm-module";
import { medicationScheduleBuild } from "@/src/domain/MedicationScheduleBuild";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
import { format } from "date-fns/format";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import {
  cancelPushNotification,
  schedulePushNotification,
} from "./notifications";

export async function scheduleMedicationNotifications(
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
      repeat: "none",
    }),
  );

  const notificationPromises = scheduledTimes.map((scheduledTime) =>
    schedulePushNotification({
      identifier: `medication-${medicationSchedule.id}-${scheduledTime.getTime()}`,
      content: {
        title: medicationSchedule.name,
        body: medicationSchedule.description ?? "Time to take your medication",
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: scheduledTime,
      },
    }),
  );

  await Promise.all(notificationPromises);
  await Promise.all(alarmPromises);
  console.log("Medication notifications scheduled successfully");
}

export async function removeMedicationNotifications(
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

  const notificationPromises = scheduledTimes.map((scheduledTime) =>
    cancelPushNotification(
      `medication-${medicationSchedule.id}-${scheduledTime.getTime()}`,
    ),
  );

  await Promise.all(notificationPromises);
  await Promise.all(alarmPromises);
  console.log("Medication notifications removed successfully");
}
