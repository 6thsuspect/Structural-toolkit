import type { SlabCaseId, SlabInput, SlabResult } from "@/types";
import { requirePositive } from "@/lib/validation";

type MomentKey = "Mlx" | "Mly" | "Mtx" | "Mty";

const MARCUS_TABLE: Record<SlabCaseId, Partial<Record<MomentKey, Record<string, number>>>> = {
  "1": {
    Mlx: { "1.0": 44, "1.1": 52, "1.2": 59, "1.3": 66, "1.4": 73, "1.5": 78, "1.6": 84, "1.7": 88, "1.8": 93, "1.9": 97, "2.0": 100, "2.1": 103, "2.2": 106, "2.3": 108, "2.4": 110, "2.5": 112, ">2.5": 125 },
    Mly: { "1.0": 44, "1.1": 45, "1.2": 45, "1.3": 44, "1.4": 44, "1.5": 43, "1.6": 41, "1.7": 40, "1.8": 39, "1.9": 38, "2.0": 37, "2.1": 36, "2.2": 35, "2.3": 34, "2.4": 33, "2.5": 32, ">2.5": 25 },
  },
  "2": {
    Mlx: { "1.0": 21, "1.1": 25, "1.2": 28, "1.3": 31, "1.4": 34, "1.5": 36, "1.6": 37, "1.7": 38, "1.8": 40, "1.9": 40, "2.0": 41, "2.1": 41, "2.2": 41, "2.3": 42, "2.4": 42, "2.5": 42, ">2.5": 42 },
    Mly: { "1.0": 21, "1.1": 21, "1.2": 20, "1.3": 19, "1.4": 18, "1.5": 17, "1.6": 16, "1.7": 14, "1.8": 13, "1.9": 12, "2.0": 12, "2.1": 11, "2.2": 11, "2.3": 11, "2.4": 10, "2.5": 10, ">2.5": 8 },
    Mtx: { "1.0": 52, "1.1": 59, "1.2": 64, "1.3": 69, "1.4": 73, "1.5": 76, "1.6": 79, "1.7": 81, "1.8": 82, "1.9": 83, "2.0": 83, "2.1": 83, "2.2": 83, "2.3": 83, "2.4": 83, "2.5": 83, ">2.5": 83 },
    Mty: { "1.0": 52, "1.1": 54, "1.2": 56, "1.3": 57, "1.4": 57, "1.5": 57, "1.6": 57, "1.7": 57, "1.8": 57, "1.9": 57, "2.0": 57, "2.1": 57, "2.2": 57, "2.3": 57, "2.4": 57, "2.5": 57, ">2.5": 57 },
  },
  "3": {
    Mlx: { "1.0": 28, "1.1": 33, "1.2": 38, "1.3": 42, "1.4": 45, "1.5": 48, "1.6": 51, "1.7": 53, "1.8": 55, "1.9": 57, "2.0": 58, "2.1": 59, "2.2": 59, "2.3": 60, "2.4": 61, "2.5": 61, ">2.5": 63 },
    Mly: { "1.0": 28, "1.1": 28, "1.2": 28, "1.3": 27, "1.4": 26, "1.5": 25, "1.6": 23, "1.7": 23, "1.8": 22, "1.9": 21, "2.0": 19, "2.1": 18, "2.2": 17, "2.3": 17, "2.4": 16, "2.5": 16, ">2.5": 13 },
    Mtx: { "1.0": 68, "1.1": 77, "1.2": 85, "1.3": 92, "1.4": 98, "1.5": 103, "1.6": 107, "1.7": 111, "1.8": 113, "1.9": 116, "2.0": 118, "2.1": 119, "2.2": 120, "2.3": 121, "2.4": 122, "2.5": 122, ">2.5": 125 },
    Mty: { "1.0": 68, "1.1": 72, "1.2": 74, "1.3": 76, "1.4": 77, "1.5": 77, "1.6": 78, "1.7": 78, "1.8": 78, "1.9": 78, "2.0": 79, "2.1": 79, "2.2": 79, "2.3": 79, "2.4": 79, "2.5": 79, ">2.5": 79 },
  },
  "4": {
    Mlx: { "1.0": 22, "1.1": 28, "1.2": 34, "1.3": 42, "1.4": 49, "1.5": 55, "1.6": 62, "1.7": 68, "1.8": 74, "1.9": 80, "2.0": 85, "2.1": 89, "2.2": 93, "2.3": 97, "2.4": 100, "2.5": 103, ">2.5": 125 },
    Mly: { "1.0": 32, "1.1": 35, "1.2": 37, "1.3": 39, "1.4": 40, "1.5": 41, "1.6": 41, "1.7": 41, "1.8": 41, "1.9": 40, "2.0": 39, "2.1": 38, "2.2": 37, "2.3": 36, "2.4": 35, "2.5": 35, ">2.5": 25 },
    Mty: { "1.0": 70, "1.1": 79, "1.2": 87, "1.3": 94, "1.4": 100, "1.5": 105, "1.6": 109, "1.7": 112, "1.8": 115, "1.9": 117, "2.0": 119, "2.1": 120, "2.2": 121, "2.3": 122, "2.4": 123, "2.5": 123, ">2.5": 125 },
  },
  "5": {
    Mlx: { "1.0": 32, "1.1": 34, "1.2": 36, "1.3": 38, "1.4": 39, "1.5": 40, "1.6": 41, "1.7": 41, "1.8": 42, "1.9": 42, "2.0": 42, "2.1": 42, "2.2": 42, "2.3": 42, "2.4": 42, "2.5": 42, ">2.5": 42 },
    Mly: { "1.0": 22, "1.1": 20, "1.2": 18, "1.3": 17, "1.4": 15, "1.5": 14, "1.6": 13, "1.7": 12, "1.8": 11, "1.9": 10, "2.0": 10, "2.1": 10, "2.2": 9, "2.3": 9, "2.4": 9, "2.5": 9, ">2.5": 8 },
    Mtx: { "1.0": 70, "1.1": 74, "1.2": 77, "1.3": 79, "1.4": 81, "1.5": 82, "1.6": 83, "1.7": 84, "1.8": 84, "1.9": 84, "2.0": 84, "2.1": 84, "2.2": 83, "2.3": 83, "2.4": 83, "2.5": 83, ">2.5": 83 },
  },
  "6": {
    Mlx: { "1.0": 31, "1.1": 38, "1.2": 45, "1.3": 53, "1.4": 60, "1.5": 66, "1.6": 72, "1.7": 78, "1.8": 83, "1.9": 88, "2.0": 92, "2.1": 96, "2.2": 99, "2.3": 102, "2.4": 105, "2.5": 108, ">2.5": 125 },
    Mly: { "1.0": 37, "1.1": 39, "1.2": 41, "1.3": 41, "1.4": 42, "1.5": 42, "1.6": 41, "1.7": 41, "1.8": 40, "1.9": 39, "2.0": 38, "2.1": 37, "2.2": 36, "2.3": 35, "2.4": 34, "2.5": 33, ">2.5": 25 },
    Mty: { "1.0": 84, "1.1": 92, "1.2": 99, "1.3": 104, "1.4": 109, "1.5": 112, "1.6": 115, "1.7": 117, "1.8": 119, "1.9": 121, "2.0": 122, "2.1": 122, "2.2": 123, "2.3": 123, "2.4": 124, "2.5": 124, ">2.5": 125 },
  },
  "7": {
    Mlx: { "1.0": 37, "1.1": 41, "1.2": 45, "1.3": 48, "1.4": 51, "1.5": 53, "1.6": 55, "1.7": 56, "1.8": 58, "1.9": 59, "2.0": 60, "2.1": 60, "2.2": 60, "2.3": 61, "2.4": 61, "2.5": 62, ">2.5": 63 },
    Mly: { "1.0": 31, "1.1": 30, "1.2": 28, "1.3": 27, "1.4": 25, "1.5": 24, "1.6": 22, "1.7": 21, "1.8": 20, "1.9": 19, "2.0": 18, "2.1": 17, "2.2": 17, "2.3": 16, "2.4": 16, "2.5": 15, ">2.5": 13 },
    Mtx: { "1.0": 84, "1.1": 92, "1.2": 98, "1.3": 103, "1.4": 108, "1.5": 111, "1.6": 114, "1.7": 117, "1.8": 119, "1.9": 120, "2.0": 121, "2.1": 122, "2.2": 122, "2.3": 123, "2.4": 123, "2.5": 124, ">2.5": 125 },
  },
  "8": {
    Mlx: { "1.0": 21, "1.1": 26, "1.2": 31, "1.3": 36, "1.4": 40, "1.5": 43, "1.6": 46, "1.7": 49, "1.8": 51, "1.9": 53, "2.0": 55, "2.1": 56, "2.2": 57, "2.3": 58, "2.4": 59, "2.5": 60, ">2.5": 63 },
    Mly: { "1.0": 26, "1.1": 27, "1.2": 28, "1.3": 28, "1.4": 27, "1.5": 26, "1.6": 25, "1.7": 23, "1.8": 22, "1.9": 21, "2.0": 21, "2.1": 20, "2.2": 20, "2.3": 19, "2.4": 19, "2.5": 18, ">2.5": 13 },
    Mtx: { "1.0": 55, "1.1": 65, "1.2": 74, "1.3": 82, "1.4": 89, "1.5": 94, "1.6": 99, "1.7": 103, "1.8": 106, "1.9": 110, "2.0": 114, "2.1": 116, "2.2": 117, "2.3": 118, "2.4": 119, "2.5": 120, ">2.5": 125 },
    Mty: { "1.0": 60, "1.1": 65, "1.2": 69, "1.3": 72, "1.4": 74, "1.5": 76, "1.6": 77, "1.7": 78, "1.8": 78, "1.9": 78, "2.0": 78, "2.1": 78, "2.2": 78, "2.3": 78, "2.4": 78, "2.5": 79, ">2.5": 79 },
  },
  "9": {
    Mlx: { "1.0": 26, "1.1": 29, "1.2": 32, "1.3": 35, "1.4": 36, "1.5": 38, "1.6": 39, "1.7": 40, "1.8": 40, "1.9": 41, "2.0": 41, "2.1": 42, "2.2": 42, "2.3": 42, "2.4": 42, "2.5": 42, ">2.5": 42 },
    Mly: { "1.0": 21, "1.1": 20, "1.2": 19, "1.3": 18, "1.4": 17, "1.5": 15, "1.6": 14, "1.7": 13, "1.8": 12, "1.9": 12, "2.0": 11, "2.1": 11, "2.2": 10, "2.3": 10, "2.4": 10, "2.5": 10, ">2.5": 8 },
    Mtx: { "1.0": 60, "1.1": 66, "1.2": 71, "1.3": 74, "1.4": 77, "1.5": 79, "1.6": 80, "1.7": 82, "1.8": 83, "1.9": 83, "2.0": 83, "2.1": 83, "2.2": 83, "2.3": 83, "2.4": 83, "2.5": 83, ">2.5": 83 },
    Mty: { "1.0": 55, "1.1": 57, "1.2": 57, "1.3": 57, "1.4": 58, "1.5": 57, "1.6": 57, "1.7": 57, "1.8": 57, "1.9": 57, "2.0": 57, "2.1": 57, "2.2": 57, "2.3": 57, "2.4": 57, "2.5": 57, ">2.5": 57 },
  },
};

export const SLAB_CASES: { id: SlabCaseId; label: string; edges: EdgeCondition }[] = [
  { id: "1", label: "None of the edges is fixed", edges: { top: "simple", right: "simple", bottom: "simple", left: "simple" } },
  { id: "2", label: "All four edges are fixed", edges: { top: "fixed", right: "fixed", bottom: "fixed", left: "fixed" } },
  { id: "3", label: "Two adjacent edges are free", edges: { top: "free", right: "free", bottom: "fixed", left: "fixed" } },
  { id: "4", label: "The two long edges are free", edges: { top: "free", right: "simple", bottom: "free", left: "simple" } },
  { id: "5", label: "The two short edges are free", edges: { top: "simple", right: "free", bottom: "simple", left: "free" } },
  { id: "6", label: "Only one short edge is fixed", edges: { top: "simple", right: "fixed", bottom: "simple", left: "simple" } },
  { id: "7", label: "Only one long edge is fixed", edges: { top: "fixed", right: "simple", bottom: "simple", left: "simple" } },
  { id: "8", label: "Only one long edge is free", edges: { top: "free", right: "fixed", bottom: "fixed", left: "fixed" } },
  { id: "9", label: "Only one short edge is free", edges: { top: "fixed", right: "free", bottom: "fixed", left: "fixed" } },
];

export type EdgeKind = "fixed" | "simple" | "free";
export interface EdgeCondition {
  top: EdgeKind;
  right: EdgeKind;
  bottom: EdgeKind;
  left: EdgeKind;
}

function ratioKey(ratio: number): string {
  return (Math.round(ratio * 10) / 10).toFixed(1);
}

function lookupCoeff(slabType: SlabCaseId, key: MomentKey, ratio: number): number {
  const table = MARCUS_TABLE[slabType][key];
  if (!table) return 0;
  return table[ratioKey(ratio)] ?? 0;
}

function spacingFromMoment(
  momentNmm: number,
  phi: number,
  thicknessMm: number,
  dMm: number,
  fus: number,
  fc: number,
  diameter: number,
): { spacing: number; error: string } {
  const Mn = momentNmm / phi;
  const denom = 1000 * (thicknessMm - dMm) ** 2;
  if (denom <= 0) return { spacing: 0, error: "Effective depth is invalid. Increase slab thickness or reduce cover." };
  const Rn = Mn / denom;
  const m = fus / (0.85 * fc);
  const inside = 1 - (2 * Rn * m) / fus;
  if (inside < 0) return { spacing: 0, error: "Required reinforcement exceeds section capacity. Increase slab thickness." };
  const rhoMin = 0.0018 / 2;
  const rho = Math.max((1 / m) * (1 - Math.sqrt(inside)), rhoMin);
  const As = rho * 1000 * (thicknessMm - dMm);
  if (As <= 0) return { spacing: 0, error: "Required steel area is invalid." };
  const spacing = (1000 * Math.PI * diameter ** 2) / 4 / As;
  return { spacing, error: "" };
}

export function validateSlab(input: SlabInput): string[] {
  const issues = [
    requirePositive(input.ly, "Long span ly"),
    requirePositive(input.lx, "Short span lx"),
    requirePositive(input.thickness, "Slab thickness"),
    requirePositive(input.kdl, "Dead-load factor"),
    requirePositive(input.kll, "Live-load factor"),
    requirePositive(input.concUnitWeight, "Concrete unit weight"),
    requirePositive(input.fc, "Concrete strength"),
    requirePositive(input.fus, "Steel strength"),
    requirePositive(input.diameter, "Bar diameter"),
    requirePositive(input.dx, "dx"),
    requirePositive(input.dy, "dy"),
  ].filter((item): item is string => Boolean(item));

  if (input.lx > input.ly) {
    issues.push("Short span lx must be less than or equal to long span ly.");
  }
  if (input.deadLoad < 0) issues.push("Dead load cannot be negative.");
  if (input.liveLoad < 0) issues.push("Live load cannot be negative.");
  return issues;
}

export function designTwoWaySlab(input: SlabInput): SlabResult {
  const empty: SlabResult = {
    ratio: 0, qu: 0, selfWeight: 0, mlxCoeff: 0, mlyCoeff: 0, mtxCoeff: 0, mtyCoeff: 0,
    Mlx: 0, Mly: 0, Mtx: 0, Mty: 0, slx: 0, sly: 0, stx: 0, sty: 0, error: "",
  };

  const issues = validateSlab(input);
  if (issues.length > 0) return { ...empty, error: issues[0] ?? "Invalid slab input." };

  const ratio = input.ly / input.lx;
  if (ratio > 2.5) {
    return { ...empty, ratio, error: "Span ratio exceeds 2.5. Design as a one-way slab." };
  }

  const selfWeight = input.includeSelfWeight ? input.thickness * input.concUnitWeight : 0;
  const qu = input.kdl * (input.deadLoad + selfWeight) + input.kll * input.liveLoad;

  const mlxCoeff = lookupCoeff(input.slabType, "Mlx", ratio);
  const mlyCoeff = lookupCoeff(input.slabType, "Mly", ratio);
  const mtxCoeff = lookupCoeff(input.slabType, "Mtx", ratio);
  const mtyCoeff = lookupCoeff(input.slabType, "Mty", ratio);

  const factor = 0.001 * qu * input.lx * ratio ** 2 * 10000;
  const Mlx = factor * mlxCoeff;
  const Mly = factor * mlyCoeff;
  const Mtx = factor * mtxCoeff;
  const Mty = factor * mtyCoeff;

  const phi = 0.8;
  const tMm = input.thickness * 1000;
  const mid = { spacing: 0, error: "" };
  const slx = mlxCoeff ? spacingFromMoment(Mlx, phi, tMm, input.dx, input.fus, input.fc, input.diameter) : mid;
  const sly = mlyCoeff ? spacingFromMoment(Mly, phi, tMm, input.dx, input.fus, input.fc, input.diameter) : mid;
  const stx = mtxCoeff ? spacingFromMoment(Mtx, phi, tMm, input.dx, input.fus, input.fc, input.diameter) : mid;
  const sty = mtyCoeff ? spacingFromMoment(Mty, phi, tMm, input.dx, input.fus, input.fc, input.diameter) : mid;

  const error = slx.error || sly.error || stx.error || sty.error;

  return {
    ratio,
    qu,
    selfWeight,
    mlxCoeff,
    mlyCoeff,
    mtxCoeff,
    mtyCoeff,
    Mlx,
    Mly,
    Mtx,
    Mty,
    slx: slx.spacing,
    sly: sly.spacing,
    stx: stx.spacing,
    sty: sty.spacing,
    error,
  };
}
