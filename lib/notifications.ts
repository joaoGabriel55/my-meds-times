import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

interface NoticationContentParams {
  identifier: string;
  content: {
    title: string;
    body?: string;
    data?: { [key: string]: unknown };
  };
  trigger: Notifications.NotificationTriggerInput;
}

async function schedulePushNotification(params: NoticationContentParams) {
  await Notifications.scheduleNotificationAsync({
    identifier: params.identifier,
    content: {
      title: params.content.title,
      body: params.content.body ?? "",
      data: params.content.data,
    },
    trigger: params.trigger,
  });
}

async function cancelPushNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("myNotificationChannel", {
      name: "A channel is needed for the permissions prompt to appear",
      importance: Notifications.AndroidImportance.MAX,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      audioAttributes: {
        contentType: Notifications.AndroidAudioContentType.SONIFICATION,
        usage: Notifications.AndroidAudioUsage.ALARM,
      },
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }
}

export {
  registerForPushNotificationsAsync,
  schedulePushNotification,
  cancelPushNotification,
};
