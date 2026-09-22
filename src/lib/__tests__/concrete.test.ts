import { describe, expect, it } from "vitest";
import {
  analyzeFlexural,
  barArea,
  balancedRatio,
  beta1,
  momentArm,
  nominalMoment,
  shearModulus,
  whitneyDepth,
} from "@/lib/concrete";

describe("concrete flexural helpers", () => {
  it("computes shear modulus from fc", () => {
    expect(shearModulus(20)).toBeCloseTo(8757.93, 2);
    expect(shearModulus(20, 20000)).toBeCloseTo(8333.33, 2);
    expect(shearModulus(20, undefined, 0.3)).toBeCloseTo(8084.25, 2);
  });

  it("computes reinforcement area", () => {
    expect(barArea(4, 13)).toBeCloseTo(530.93, 2);
  });

  it("computes Whitney block depth and moment arm", () => {
    expect(whitneyDepth(530.93, 420, 20, 250)).toBeCloseTo(52.47, 2);
    expect(momentArm(500, 52.47)).toBeCloseTo(473.77, 2);
  });

  it("computes under-reinforced nominal moment", () => {
    const Mn = nominalMoment(420, 20, 565, 250, 4, 13, 65);
    expect(Mn).toBeCloseTo(105645164.45, 2);
  });

  it("computes beta1 breakpoints", () => {
    expect(beta1(28)).toBeCloseTo(0.85, 2);
    expect(beta1(35)).toBeCloseTo(0.8, 2);
    expect(beta1(59)).toBeCloseTo(0.65, 2);
  });

  it("computes balanced reinforcement ratio", () => {
    expect(balancedRatio(20, 420)).toBeCloseTo(0.020238, 6);
    expect(balancedRatio(35, 420)).toBeCloseTo(0.033333, 6);
    expect(balancedRatio(59, 420)).toBeCloseTo(0.045655, 6);
  });

  it("rejects invalid cover", () => {
    const result = analyzeFlexural({
      fc: 30,
      fyr: 400,
      height: 400,
      width: 250,
      barCount: 3,
      diameter: 16,
      cover: 400,
    });
    expect(result.warnings.some((item) => item.includes("Cover"))).toBe(true);
  });
});
