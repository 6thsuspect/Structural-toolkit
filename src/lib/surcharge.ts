import type { HeatmapGrid, PointLoadInput, StripLoadInput } from "@/types";
import { requirePositive } from "@/lib/validation";

function linspace(start: number, end: number, count: number): number[] {
  if (count <= 1) return [start];
  const step = (end - start) / (count - 1);
  return Array.from({ length: count }, (_, i) => start + i * step);
}

function packGrid(x: number[], y: number[], values: number[][]): HeatmapGrid {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const row of values) {
    for (const v of row) {
      if (!Number.isFinite(v)) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  if (!Number.isFinite(min)) {
    min = 0;
    max = 0;
  }
  return { x, y, z: values, min, max };
}

export function pointPressure(
  q: number,
  xLoad: number,
  H: number,
  x: number,
  depth: number,
  wallType: number,
): number {
  if (H <= 0) return 0;
  const m = xLoad / H;
  const A = m > 0.4 ? 1.77 : 0.28;
  const B = m > 0.4 ? m ** 2 : 0.16;
  const C = m > 0.4 ? B : 1;
  const n = depth / H;
  const denom = (B + n) ** 3;
  if (denom === 0) return 0;
  const raw = ((A * q) / H ** 2) * C * (n / denom);
  const spread = Math.atan2(x, xLoad);
  return raw * Math.cos(1.1 * spread) ** 2 * wallType;
}

export function stripPressure(
  q: number,
  xLoad: number,
  width: number,
  depth: number,
  wallType: number,
): number {
  const alpha = Math.atan2(xLoad + width / 2, depth);
  const gamma = Math.atan2(xLoad + width, depth);
  const beta = (gamma - alpha) * 2;
  return (
    ((2 * q) / Math.PI) *
    ((beta + Math.sin(beta)) * Math.sin(alpha) ** 2 + (beta - Math.sin(alpha)) * Math.cos(alpha) ** 2) *
    wallType
  );
}

export function pointLoadGrid(input: PointLoadInput, divisions = 48): HeatmapGrid {
  const x = linspace(input.start, input.end, divisions);
  const y = linspace(0, input.H, divisions);
  const z = y.map((depth) =>
    x.map((xi) => pointPressure(input.q, input.xLoad, input.H, xi, depth, input.wallType)),
  );
  return packGrid(x, y, z);
}

export function stripLoadGrid(input: StripLoadInput, divisions = 48): HeatmapGrid {
  const x = linspace(input.start, input.end, divisions);
  const y = linspace(0, input.H, divisions);
  const z = y.map((depth) => x.map(() => stripPressure(input.q, input.xLoad, input.width, depth, input.wallType)));
  return packGrid(x, y, z);
}

export function wallProfile(grid: HeatmapGrid, xIndex: number): { depth: number; pressure: number }[] {
  return grid.y.map((depth, row) => ({
    depth,
    pressure: grid.z[row]?.[xIndex] ?? 0,
  }));
}

export function nearestXIndex(grid: HeatmapGrid, x: number): number {
  let best = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  grid.x.forEach((value, index) => {
    const dist = Math.abs(value - x);
    if (dist < bestDist) {
      best = index;
      bestDist = dist;
    }
  });
  return best;
}

export function validatePointLoad(input: PointLoadInput): string[] {
  const issues = [
    requirePositive(input.q, "Point load Q"),
    requirePositive(input.xLoad, "Distance from edge"),
    requirePositive(input.H, "Wall depth H"),
  ].filter((item): item is string => Boolean(item));
  if (input.end <= input.start) issues.push("Right boundary must be greater than left boundary.");
  if (input.wallType !== 1 && input.wallType !== 2) issues.push("Wall type must be 1 (flexible) or 2 (rigid).");
  return issues;
}

export function validateStripLoad(input: StripLoadInput): string[] {
  const issues = [
    requirePositive(input.q, "Strip load q"),
    requirePositive(input.xLoad, "Distance from edge"),
    requirePositive(input.width, "Load width B"),
    requirePositive(input.H, "Wall depth H"),
  ].filter((item): item is string => Boolean(item));
  if (input.end <= input.start) issues.push("Right boundary must be greater than left boundary.");
  if (input.wallType !== 1 && input.wallType !== 2) issues.push("Wall type must be 1 (flexible) or 2 (rigid).");
  return issues;
}
