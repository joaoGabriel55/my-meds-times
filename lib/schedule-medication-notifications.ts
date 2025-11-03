import { medicationScheduleBuild } from "@/src/domain/MedicationScheduleBuild";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
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

  const notificationPromises = scheduledTimes.map((scheduledTime) =>
    cancelPushNotification(
      `medication-${medicationSchedule.id}-${scheduledTime.getTime()}`,
    ),
  );

  await Promise.all(notificationPromises);
  console.log("Medication notifications removed successfully");
}
