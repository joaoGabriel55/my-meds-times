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
    Alarm.requestPermissions()
      .then(() => {
        console.log("Permissions granted");
      })
      .catch((error) => {
        console.error("Error requesting permissions:", error);
      });
  }, []);
}
