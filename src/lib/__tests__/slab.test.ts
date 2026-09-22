import { describe, expect, it } from "vitest";
import { designTwoWaySlab } from "@/lib/slab";
import { DEFAULT_SLAB } from "@/lib/project";

describe("two-way slab", () => {
  it("flags one-way slabs", () => {
    const result = designTwoWaySlab({ ...DEFAULT_SLAB, ly: 9, lx: 3 });
    expect(result.error).toMatch(/one-way/i);
  });

  it("computes moments and spacing for a square-ish slab", () => {
    const result = designTwoWaySlab(DEFAULT_SLAB);
    expect(result.error).toBe("");
    expect(result.ratio).toBeCloseTo(4 / 3, 6);
    expect(result.Mlx).toBeGreaterThan(0);
    expect(result.slx).toBeGreaterThan(0);
  });

  it("omits self-weight when requested", () => {
    const withSw = designTwoWaySlab({ ...DEFAULT_SLAB, includeSelfWeight: true });
    const without = designTwoWaySlab({ ...DEFAULT_SLAB, includeSelfWeight: false });
    expect(withSw.qu).toBeGreaterThan(without.qu);
  });
});
