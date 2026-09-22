import { describe, expect, it } from "vitest";
import { computeResponseSpectrum, siteCoefficients, spectralAcceleration } from "@/lib/spectrum";

describe("response spectrum", () => {
  it("uses unit site coefficients for rock", () => {
    expect(siteCoefficients(1, 0.4, "SB")).toEqual({ fa: 1, fv: 1 });
    expect(siteCoefficients(1, 0.4, "SA")).toEqual({ fa: 0.8, fv: 0.8 });
  });

  it("interpolates SD coefficients", () => {
    const { fa, fv } = siteCoefficients(0.5, 0.2, "SD");
    expect(fa).toBeCloseTo(-0.88 * 0.5 + 1.8, 6);
    expect(fv).toBeCloseTo(-4 * 0.2 + 2.8, 6);
  });

  it("builds a design spectrum with plateau and descending branch", () => {
    const result = computeResponseSpectrum({
      ss: 1.3,
      s1: 0.6,
      siteClass: "SD",
      designCoefficient: 2 / 3,
    });
    expect(result.periods[0]).toBe(0);
    expect(result.accelerations[0]).toBeCloseTo(result.s0, 8);
    expect(result.ts).toBeGreaterThan(result.t0);
    const saMid = spectralAcceleration((result.t0 + result.ts) / 2, result.sds, result.sd1, result.t0, result.ts);
    expect(saMid).toBeCloseTo(result.sds, 8);
    const saLong = spectralAcceleration(result.ts * 2, result.sds, result.sd1, result.t0, result.ts);
    expect(saLong).toBeCloseTo(result.sd1 / (result.ts * 2), 8);
  });
});
