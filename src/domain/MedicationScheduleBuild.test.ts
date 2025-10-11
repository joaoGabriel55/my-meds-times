import { medicationScheduleBuild } from "./MedicationScheduleBuild";

describe("medicationScheduleBuild", () => {
  it("generate the schedule", () => {
    const schedule = medicationScheduleBuild({
      intervalHours: 8,
      startDateTime: new Date("2023-01-01T08:00:00Z"),
      days: 3,
    });

    expect(schedule).toBeInstanceOf(Array);
    expect(schedule.length).toBe(10);
    expect(schedule[0]).toEqual(new Date("2023-01-01T08:00:00Z"));
    expect(schedule[1]).toEqual(new Date("2023-01-01T16:00:00Z"));
    expect(schedule[2]).toEqual(new Date("2023-01-02T00:00:00Z"));
    expect(schedule[3]).toEqual(new Date("2023-01-02T08:00:00Z"));
    expect(schedule[4]).toEqual(new Date("2023-01-02T16:00:00Z"));
    expect(schedule[5]).toEqual(new Date("2023-01-03T00:00:00Z"));
    expect(schedule[6]).toEqual(new Date("2023-01-03T08:00:00Z"));
    expect(schedule[7]).toEqual(new Date("2023-01-03T16:00:00Z"));
    expect(schedule[8]).toEqual(new Date("2023-01-04T00:00:00Z"));
    expect(schedule[9]).toEqual(new Date("2023-01-04T08:00:00Z"));
  });
});
