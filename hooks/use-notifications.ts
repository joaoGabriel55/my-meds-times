import Alarm from "@/lib/native/alarm-module";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

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

export function useNotifications() {
  useEffect(() => {
    registerForPushNotificationsAsync();

    Alarm.requestPermissions()
      .then(() => {
        console.log("Permissions granted");
      })
      .catch((error) => {
        console.error("Error requesting permissions:", error);
      });

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync();
    }

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          console.log(response.notification.request.identifier);
          console.log(response.notification.request.content);
        },
      );

    return () => {
      responseListener.remove();
    };
  }, []);
}
