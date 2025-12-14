import { useThemeColor } from "@/hooks/use-theme-color";
import Alarm from "@/lib/native/alarm-module";
import { MedicationScheduleService } from "@/src/domain/MedicationScheduleService";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
import { container } from "@/src/infrastructure/container";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  NativeEventEmitter,
  NativeModules,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";

const { MedicationScheduleRepository } = container;
const medicationScheduleRepository = MedicationScheduleRepository();
const service = MedicationScheduleService(medicationScheduleRepository);

const eventEmitter = new NativeEventEmitter(NativeModules.DeviceEventEmitter);

export default function AlarmRingingModal() {
  const { t } = useTranslation();

  const textSecondary = useThemeColor({}, "textSecondary");
  const cardBg = useThemeColor({}, "card");

  const [openModal, setOpenModal] = useState(false);

  const [currentAlarmId, setCurrentAlarmId] = useState<string | null>(null);
  const [currentMedicationSchedule, setCurrentMedicationSchedule] =
    useState<MedicationSchedule | null>(null);

  useEffect(() => {
    async function fetch() {
      const current = await Alarm.getCurrentAlarmPlaying();

      if (!current?.activeAlarmId) return;

      const [, medicationId] = current.activeAlarmId.split("-");

      const schedule = (await service.findAll())?.find(
        (s) => s.id === medicationId,
      );

      if (!schedule) return;

      setCurrentMedicationSchedule(schedule);
      setCurrentAlarmId(current.activeAlarmId);
      setOpenModal(true);
    }

    if (!currentAlarmId) fetch();

    // TODO: Solve problem with this
    const subscription = eventEmitter.addListener(
      "activeAlarmId",
      (eventData) => {
        console.log("Event received from native:", eventData);
        // Maybe you update the UI here based on the incoming event
      },
    );

    return () => {
      // Clean up the event listener when the component unmounts
      subscription.remove();
    };
  }, [currentAlarmId]);

  const closeModal = () => {
    setOpenModal(false);
    setCurrentAlarmId(null);
    setCurrentMedicationSchedule(null);
  };

  const stopAlarm = async () => {
    console.log("currentAlarmId", currentAlarmId);

    if (currentAlarmId) await Alarm.stopCurrentAlarm(currentAlarmId as string);

    closeModal();
  };

  if (!openModal && !currentMedicationSchedule) return null;

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: cardBg }]}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>
              <Ionicons name="alarm" size={22} color={textSecondary} />{" "}
              {t("notifications.medicationReminder")}
            </ThemedText>
            <Pressable onPress={closeModal}>
              <Ionicons name="close" size={32} color={textSecondary} />
            </Pressable>
          </View>
          <View style={styles.medicationContainer}>
            <ThemedText style={styles.medicationName}>
              {t("notifications.timeToTake", {
                medication: currentMedicationSchedule?.name,
              })}
            </ThemedText>
            <Pressable style={[styles.button, styles.stop]} onPress={stopAlarm}>
              <Ionicons name="stop" size={18} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 20,
    width: "85%",
    alignItems: "flex-start",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  medicationContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  medicationName: {
    fontSize: 16,
    maxWidth: "80%",
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    gap: 15,
  },
  button: {
    padding: 8,
    borderRadius: 100,
  },
  stop: {
    backgroundColor: "#FF3B30",
  },
  snooze: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});
