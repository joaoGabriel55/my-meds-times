import {
  createMedicationScheduleUpdateSchema,
  MedicationScheduleInput,
  MedicationScheduleInputSchema,
} from "@/src/domain/models/MedicationSchedule";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  values?: MedicationScheduleInput & { id?: string };
} = {}) {
  const { t } = useTranslation();

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
    let result;

    if (values?.id) {
      const updateSchema = createMedicationScheduleUpdateSchema(
        values?.startDateTime,
      );

      result = updateSchema.safeParse(formState);
    } else {
      result = MedicationScheduleInputSchema.safeParse(formState);
    }

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
          // Map validation errors to translated messages
          let translatedMessage = error.message;

          if (path === "name" && error.code === "invalid_type") {
            translatedMessage = t("medicationForm.validation.nameRequired");
          } else if (path === "days") {
            if (error.code === "invalid_type") {
              translatedMessage = t("medicationForm.validation.daysRequired");
            } else if (error.code === "too_small") {
              translatedMessage = t("medicationForm.validation.daysMin");
            }
          } else if (path === "intervalHours") {
            if (error.code === "invalid_type") {
              translatedMessage = t(
                "medicationForm.validation.intervalRequired",
              );
            } else if (error.code === "too_small") {
              translatedMessage = t("medicationForm.validation.intervalMin");
            }
          } else if (path === "startDateTime") {
            if (
              (error.code === "invalid_type" ||
                error.code === "invalid_string") &&
              !values?.id
            ) {
              translatedMessage = t(
                "medicationForm.validation.startDateRequired",
              );
            } else if (error.code === "custom" && !values?.id) {
              translatedMessage = t(
                "medicationForm.validation.startDateFuture",
              );
            }
          }

          newErrors[path] = translatedMessage;
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
