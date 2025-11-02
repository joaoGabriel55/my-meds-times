import { MedicationScheduleService } from "@/src/domain/MedicationScheduleService";
import { MedicationScheduleInput } from "@/src/domain/models/MedicationSchedule";
import { container } from "@/src/infrastructure/container";
import { useState } from "react";

const { MedicationScheduleRepository } = container;

const medicationScheduleRepository = MedicationScheduleRepository();
const service = MedicationScheduleService(medicationScheduleRepository);

export function useMedTimesUpdate(id: string) {
  const [isLoading, setIsLoading] = useState(false);

  const updateMedTimes = async (formState: MedicationScheduleInput) => {
    try {
      setIsLoading(true);

      await service.update(id, { ...formState, id });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, updateMedTimes };
}
