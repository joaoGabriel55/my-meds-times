import Alarm from "@/lib/native/alarm-module";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
    shouldShowAlert: true,
  }),
});

export function useDeviceAlarm() {
  useEffect(() => {
    Alarm.ensureNotificationPermission().then(async (permission) => {
      if (!permission) {
        console.warn("Notification permission not granted. Aborting schedule.");
        return;
      }
    });
  }, []);
}
