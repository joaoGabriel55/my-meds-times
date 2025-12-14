import { NativeModules, PermissionsAndroid, Platform } from "react-native";

type AlarmParams = {
  id: string; // id único do alarme
  datetimeISO: string; // ISO timestamp (ex: "2025-11-10T08:30:00")
  title?: string;
  body?: string;
};

interface AlarmModulePort {
  scheduleAlarm(alarm: AlarmParams): Promise<void>;
  cancelAlarm(id: string): Promise<void>;
  listAlarms(): Promise<AlarmParams[]>;
  requestPermissions(): Promise<{ granted: boolean }>;
  snoozeAlarm(id: string, minutes: number): Promise<void>;
  stopCurrentAlarm(id: string): Promise<void>;
  snoozeCurrentAlarm(id: string, minutes: number): Promise<void>;
  getCurrentAlarmPlaying(): Promise<{ activeAlarmId: string } | null>;
}

const { AlarmModule } = NativeModules as {
  AlarmModule: AlarmModulePort;
};

async function ensureNotificationPermission(): Promise<boolean> {
  // Android 13+ requires POST_NOTIFICATIONS
  if (Platform.OS !== "android") return true;
  const status = await AlarmModule.requestPermissions();
  if (status.granted) return true;

  if (Platform.Version >= 33) {
    const req = await PermissionsAndroid.request(
      "android.permission.POST_NOTIFICATIONS",
    );
    return req === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

export default {
  ensureNotificationPermission,
  scheduleAlarm: (alarm: AlarmParams) => AlarmModule.scheduleAlarm(alarm),
  cancelAlarm: (id: string) => AlarmModule.cancelAlarm(id),
  listAlarms: () => AlarmModule.listAlarms(),
  requestPermissions: () => AlarmModule.requestPermissions(),
  snoozeAlarm: (id: string, minutes: number) =>
    AlarmModule.snoozeAlarm(id, minutes),
  stopCurrentAlarm: (id: string) => AlarmModule.stopCurrentAlarm(id),
  snoozeCurrentAlarm: (id: string, minutes: number) =>
    AlarmModule.snoozeCurrentAlarm(id, minutes),
  getCurrentAlarmPlaying: () => AlarmModule.getCurrentAlarmPlaying(),
};
