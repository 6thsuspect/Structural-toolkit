import { describe, expect, it } from "vitest";
import { angleProperties, iwfProperties } from "@/lib/steel";

describe("steel sections", () => {
  it("computes H-beam properties with fillet area", () => {
    const section = iwfProperties(
      { designation: "H-100x100x6x8x10", h: 100, b: 100, tw: 6, tf: 8, r: 10 },
      7850,
    );
    expect(section.area).toBeGreaterThan(20);
    expect(section.Ixx).toBeGreaterThan(section.Iyy);
    expect(section.unitWeight).toBeCloseTo((section.area / 10000) * 7850, 6);
  });

  it("computes angle centroid-based inertias", () => {
    const section = angleProperties(
      { designation: "L-50x50x5x6.5x3", h: 50, b: 50, t: 5, r1: 6.5, r2: 3 },
      7850,
    );
    expect(section.area).toBeGreaterThan(4);
    expect(section.Ixx).toBeGreaterThan(0);
    expect(section.ix).toBeGreaterThan(0);
  });
});
