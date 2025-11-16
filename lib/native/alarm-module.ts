import { NativeModules } from "react-native";

type AlarmParams = {
  id: string; // id único do alarme
  datetimeISO: string; // ISO timestamp (ex: "2025-11-10T08:30:00")
  title?: string;
  body?: string;
  repeat?: "none" | "daily" | "weekly"; // simplificado
};

interface AlarmModulePort {
  scheduleAlarm(alarm: AlarmParams): Promise<void>;
  cancelAlarm(id: string): Promise<void>;
  listAlarms(): Promise<AlarmParams[]>;
  requestPermissions(): Promise<{ granted: boolean }>;
  snoozeAlarm(id: string, minutes: number): Promise<void>;
}

const { AlarmModule } = NativeModules as {
  AlarmModule: AlarmModulePort;
};

export default {
  scheduleAlarm: (alarm: AlarmParams) => AlarmModule.scheduleAlarm(alarm),
  cancelAlarm: (id: string) => AlarmModule.cancelAlarm(id),
  listAlarms: () => AlarmModule.listAlarms(),
  requestPermissions: () => AlarmModule.requestPermissions(),
  snoozeAlarm: (id: string, minutes: number) =>
    AlarmModule.snoozeAlarm(id, minutes),
};
