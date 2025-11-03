import {
    removeMedicationNotifications,
    scheduleMedicationNotifications,
} from "@/lib/schedule-medication-notifications";
import { MedicationScheduleService } from "@/src/domain/MedicationScheduleService";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
import { container } from "@/src/infrastructure/container";
import { useState } from "react";
import { useMedTimesQuery } from "./use-med-times-query";

const { MedicationScheduleRepository } = container;

const medicationScheduleRepository = MedicationScheduleRepository();
const service = MedicationScheduleService(medicationScheduleRepository);

export function useMedTimesUpdate(id: string) {
  const [isLoading, setIsLoading] = useState(false);

  const { medicationSchedule } = useMedTimesQuery(id);

  const updateMedTimes = async (formState: MedicationSchedule) => {
    try {
      setIsLoading(true);

      await service.update(id, formState);

      if (
        medicationSchedule &&
        medicationSchedule.startDateTime !== formState.startDateTime
      ) {
        await removeMedicationNotifications(medicationSchedule);
        await scheduleMedicationNotifications(formState);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, updateMedTimes };
}
