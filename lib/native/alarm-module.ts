import RNAlarmModule, { AlarmParams } from "react-native-alarmageddon";

async function ensureNotificationPermission(): Promise<boolean> {
  const granted = await RNAlarmModule.ensurePermissions();

  if (!granted) {
    console.warn("Alarm permissions not granted");
    return false;
  }

  return granted;
}

export default {
  ensureNotificationPermission,
  scheduleAlarm: (alarm: AlarmParams) => RNAlarmModule.scheduleAlarm(alarm),
  cancelAlarm: (id: string) => RNAlarmModule.cancelAlarm(id),
  listAlarms: () => RNAlarmModule.listAlarms(),
  snoozeAlarm: (id: string, minutes: number) =>
    RNAlarmModule.snoozeAlarm(id, minutes),
  stopCurrentAlarm: (id: string) => RNAlarmModule.stopCurrentAlarm(id),
  snoozeCurrentAlarm: (id: string, minutes: number) =>
    RNAlarmModule.snoozeCurrentAlarm(id, minutes),
  getCurrentAlarmPlaying: () => RNAlarmModule.getCurrentAlarmPlaying(),
};
