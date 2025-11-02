import {
  MedicationScheduleInput,
  MedicationScheduleInputSchema,
} from "@/src/domain/models/MedicationSchedule";
import { useState } from "react";

type FormErrors = Record<
  keyof Omit<
    MedicationScheduleInput,
    "description" | "createdAt" | "updatedAt"
  >,
  string | null
>;

const defaultValues = {
  name: "",
  description: "",
  startDateTime: "",
  intervalHours: 8,
  days: 5,
  createdAt: new Date().toISOString(),
};

export function useMedTimesForm({
  values,
}: {
  values?: MedicationScheduleInput;
} = {}) {
  const [formState, setFormState] = useState<MedicationScheduleInput>(
    values || defaultValues,
  );

  const [errors, setErrors] = useState<FormErrors>({
    name: null,
    startDateTime: null,
    intervalHours: null,
    days: null,
  });

  function handleFormChange<T extends keyof MedicationScheduleInput>(
    key: T,
    value: MedicationScheduleInput[T],
  ) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

  function validateForm() {
    const result = MedicationScheduleInputSchema.safeParse(formState);

    if (!result.success) {
      const newErrors: FormErrors = {
        name: null,
        startDateTime: null,
        intervalHours: null,
        days: null,
      };

      result.error.errors.forEach((error) => {
        const path = error.path[0] as keyof FormErrors;
        if (path in newErrors) {
          newErrors[path] = error.message;
        }
      });

      setErrors(newErrors);

      return false;
    }

    setErrors({
      name: null,
      startDateTime: null,
      intervalHours: null,
      days: null,
    });

    return true;
  }

  return {
    formState,
    errors,
    handleFormChange,
    validateForm,
  };
}
