import { MedicationScheduleService } from "@/src/domain/MedicationScheduleService";
import { MedicationSchedule } from "@/src/domain/models/MedicationSchedule";
import { container } from "@/src/infrastructure/container";
import { useEffect, useState } from "react";

const { MedicationScheduleRepository } = container;

const medicationScheduleRepository = MedicationScheduleRepository();
const service = MedicationScheduleService(medicationScheduleRepository);

export function useMedTimesQuery(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [medicationSchedule, setMedicationSchedule] =
    useState<MedicationSchedule | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const medicationSchedule = await service.findById(id);

        setMedicationSchedule(medicationSchedule);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { isLoading, medicationSchedule };
}
