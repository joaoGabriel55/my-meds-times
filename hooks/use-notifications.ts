import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { Platform } from "react-native";
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

export function useNotifications() {
  useEffect(() => {
    registerForPushNotificationsAsync();

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync();
    }

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response.notification.request.identifier);
        console.log(response.notification.request.content);
      });

    return () => {
      responseListener.remove();
    };
  }, []);
}
