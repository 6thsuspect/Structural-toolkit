import { describe, expect, it } from "vitest";
import { pointLoadGrid, pointPressure, stripLoadGrid } from "@/lib/surcharge";
import { parseProject, serializeProject, createProject } from "@/lib/project";

describe("surcharge pressures", () => {
  it("returns finite positive pressure under a point load", () => {
    const value = pointPressure(200, 1.2, 12, 0, 4, 2);
    expect(Number.isFinite(value)).toBe(true);
    expect(value).toBeGreaterThan(0);
  });

  it("builds a heatmap grid", () => {
    const grid = pointLoadGrid({ q: 200, xLoad: 1.2, H: 12, start: -10, end: 10, wallType: 2 }, 12);
    expect(grid.x).toHaveLength(12);
    expect(grid.z).toHaveLength(12);
    expect(grid.max).toBeGreaterThanOrEqual(grid.min);
  });

  it("builds a strip-load grid", () => {
    const grid = stripLoadGrid({ q: 200, xLoad: 1.2, width: 1, H: 5, start: -8, end: 8, wallType: 2 }, 10);
    expect(grid.z[5]?.length).toBe(10);
  });
});

describe("project files", () => {
  it("round-trips a project document", () => {
    const original = createProject("Bridge abutment");
    original.flexural.height = 700;
    const restored = parseProject(serializeProject(original));
    expect(restored.name).toBe("Bridge abutment");
    expect(restored.flexural.height).toBe(700);
    expect(restored.version).toBe(1);
  });

  it("rejects corrupt JSON", () => {
    expect(() => parseProject("{not json")).toThrow(/valid JSON/);
  });
});
