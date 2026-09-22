import { describe, expect, it } from "vitest";
import { convertById } from "@/lib/units";

describe("unit converter", () => {
  it("converts distance", () => {
    expect(convertById("distance", 2, "m", "m")).toBeCloseTo(2, 6);
    expect(convertById("distance", 2, "km", "m")).toBeCloseTo(2000, 6);
    expect(convertById("distance", 1, "in", "mm")).toBeCloseTo(25.4, 6);
  });

  it("converts force", () => {
    expect(convertById("force", 1, "kgf", "N")).toBeCloseTo(9.80665, 5);
    expect(convertById("force", 1, "kN", "N")).toBeCloseTo(1000, 6);
  });

  it("converts pressure", () => {
    expect(convertById("pressure", 1, "MPa", "Pa")).toBeCloseTo(1e6, 3);
    expect(convertById("pressure", 1, "ksi", "psi")).toBeCloseTo(1000, 3);
  });

  it("throws on unknown units", () => {
    expect(() => convertById("distance", 1, "m", "nope")).toThrow(/Unknown unit/);
  });
});
