import { describe, expect, it } from "vitest";
import { formatMonth, formatRange } from "@/lib/dates";

describe("dates", () => {
  it("formats a month", () => {
    expect(formatMonth("2022-06")).toBe("Jun 2022");
  });

  it("formats ranges without dashes", () => {
    expect(formatRange("2022-06", null)).toBe("Jun 2022 to present");
    expect(formatRange("2026-06", "2026-09")).toBe("Jun 2026 to Sep 2026");
    expect(formatRange("2023-07", "2023-07")).toBe("Jul 2023");
  });

  it("rejects a malformed month", () => {
    expect(() => formatMonth("2022-13")).toThrow();
  });
});
