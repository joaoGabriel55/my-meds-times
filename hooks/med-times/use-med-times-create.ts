import { scheduleMedicationNotifications } from "@/lib/schedule-medication-notifications";
import { MedicationScheduleService } from "@/src/domain/MedicationScheduleService";
import { MedicationScheduleInput } from "@/src/domain/models/MedicationSchedule";
import { container } from "@/src/infrastructure/container";
import { useState } from "react";

const { MedicationScheduleRepository } = container;

const medicationScheduleRepository = MedicationScheduleRepository();
const service = MedicationScheduleService(medicationScheduleRepository);

export function useMedTimesCreate() {
  const [isLoading, setIsLoading] = useState(false);

  const createMedTimes = async (formState: MedicationScheduleInput) => {
    try {
      setIsLoading(true);

      const createdMedicationSchedule = await service.create(formState);

      await scheduleMedicationNotifications(createdMedicationSchedule);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, createMedTimes };
}
