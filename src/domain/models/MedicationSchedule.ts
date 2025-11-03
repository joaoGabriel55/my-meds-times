import i18n from "@/lib/i18n";
import { z } from "zod";

export const MedicationScheduleSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  intervalHours: z.number().min(1),
  startDateTime: z
    .string()
    .datetime()
    .refine((value) => {
      const date = new Date(value);
      return date.getTime() > Date.now();
    }, i18n.t("medicationForm.validation.startDateFuture")),
  days: z.number().min(1),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type MedicationSchedule = z.infer<typeof MedicationScheduleSchema>;

export const MedicationScheduleInputSchema = MedicationScheduleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type MedicationScheduleInput = z.infer<
  typeof MedicationScheduleInputSchema
>;

// Schema for updating medication schedule with conditional validation
export const createMedicationScheduleUpdateSchema = (
  originalStartDateTime?: string
) => {
  return z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    intervalHours: z.number().min(1),
    startDateTime: z
      .string()
      .datetime()
      .refine((value) => {
        // If startDateTime hasn't changed, skip validation
        if (originalStartDateTime && value === originalStartDateTime) {
          return true;
        }
        // If changed, validate it's in the future
        const date = new Date(value);
        return date.getTime() > Date.now();
      }, i18n.t("medicationForm.validation.startDateFuture")),
    days: z.number().min(1),
  });
};
