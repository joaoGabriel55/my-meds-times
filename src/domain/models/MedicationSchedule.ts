import { z } from "zod";

export const MedicationScheduleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  intervalHours: z.number(),
  startDateTime: z
    .string()
    .datetime()
    .refine((value) => {
      const date = new Date(value);
      return date.getTime() > Date.now();
    }, "Start date must be in the future"),
  days: z.number(),
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
