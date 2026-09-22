import type { FlexuralInput, FlexuralResult } from "@/types";
import { requirePositive } from "@/lib/validation";

const EPS_CU = 0.003;

export function elasticModulus(fc: number): number {
  return 4700 * Math.sqrt(fc);
}

export function shearModulus(fc: number, Ec?: number, poisson = 0.2): number {
  const modulus = Ec ?? elasticModulus(fc);
  return modulus / (2 * (1 + poisson));
}

export function barArea(count: number, diameter: number): number {
  return (Math.PI * diameter ** 2) / 4 * count;
}

export function beta1(fc: number): number {
  if (fc <= 28) return 0.85;
  if (fc <= 56) return 0.85 - (0.05 * (fc - 28)) / 7;
  return 0.65;
}

export function whitneyDepth(As: number, fyr: number, fc: number, width: number): number {
  const force = As * fyr;
  const intensity = 0.85 * fc * width;
  if (intensity === 0) return Number.NaN;
  return force / intensity;
}

export function momentArm(d: number, a: number): number {
  return d - a / 2;
}

export function nominalMoment(
  fyr: number,
  fc: number,
  height: number,
  width: number,
  barCount: number,
  diameter: number,
  cover: number,
): number {
  const As = barArea(barCount, diameter);
  const a = whitneyDepth(As, fyr, fc, width);
  const d = height - cover;
  return As * fyr * momentArm(d, a);
}

export function reinforcementRatio(
  barCount: number,
  diameter: number,
  width: number,
  height: number,
): number {
  const As = barArea(barCount, diameter);
  const Ac = width * height;
  return Ac === 0 ? Number.NaN : As / Ac;
}

export function balancedRatio(fc: number, fyr: number): number {
  const b1 = beta1(fc);
  return ((0.85 * b1 * fc) / fyr) * (600 / (600 + fyr));
}

export function maxRatio(fc: number, fyr: number): number {
  return 0.75 * balancedRatio(fc, fyr);
}

export function maxSteelArea(fc: number, fyr: number, height: number, width: number): number {
  return maxRatio(fc, fyr) * height * width;
}

export function minSteelArea(
  fc: number,
  fyr: number,
  height: number,
  width: number,
  cover: number,
): number {
  const d = height - cover;
  const as1 = ((0.25 * Math.sqrt(fc)) / fyr) * d * width;
  const as2 = (1.4 / fyr) * d * width;
  return Math.max(as1, as2);
}

export function neutralAxisFromWhitney(As: number, fyr: number, fc: number, width: number): number {
  return whitneyDepth(As, fyr, fc, width) / beta1(fc);
}

export function steelStrain(
  d: number,
  As: number,
  fc: number,
  fyr: number,
  width: number,
  epsCu = EPS_CU,
): number {
  const c = neutralAxisFromWhitney(As, fyr, fc, width);
  if (c === 0) return Number.NaN;
  return ((d - c) / c) * epsCu;
}

export function strengthReduction(epsS: number): number {
  if (epsS >= 0.005) return 0.9;
  if (epsS <= 0.002) return 0.7;
  return 0.65 + ((epsS - 0.002) * 250) / 3;
}

export function classifySection(epsS: number): FlexuralResult["classification"] {
  if (epsS >= 0.005) return "tension-controlled";
  if (epsS <= 0.002) return "compression-controlled";
  return "transition";
}

export function validateFlexural(input: FlexuralInput): string[] {
  const issues = [
    requirePositive(input.fc, "Concrete strength fc'"),
    requirePositive(input.fyr, "Reinforcement yield strength"),
    requirePositive(input.height, "Section height"),
    requirePositive(input.width, "Section width"),
    requirePositive(input.barCount, "Bar count"),
    requirePositive(input.diameter, "Bar diameter"),
    requirePositive(input.cover, "Cover"),
  ].filter((item): item is string => Boolean(item));

  if (input.cover >= input.height) {
    issues.push("Cover must be smaller than the section height.");
  }
  if (input.diameter >= input.width) {
    issues.push("Bar diameter must be smaller than the section width.");
  }
  if (!Number.isInteger(input.barCount) || input.barCount < 1) {
    issues.push("Bar count must be a positive integer.");
  }
  return issues;
}

export function analyzeFlexural(input: FlexuralInput): FlexuralResult {
  const warnings = validateFlexural(input);
  const As = barArea(input.barCount, input.diameter);
  const a = whitneyDepth(As, input.fyr, input.fc, input.width);
  const d = input.height - input.cover;
  const c = neutralAxisFromWhitney(As, input.fyr, input.fc, input.width);
  const jd = momentArm(d, a);
  const rho = reinforcementRatio(input.barCount, input.diameter, input.width, input.height);
  const rhoBal = balancedRatio(input.fc, input.fyr);
  const rhoMax = maxRatio(input.fc, input.fyr);
  const AsMax = maxSteelArea(input.fc, input.fyr, input.height, input.width);
  const AsMin = minSteelArea(input.fc, input.fyr, input.height, input.width, input.cover);
  const epsS = steelStrain(d, As, input.fc, input.fyr, input.width);
  const phi = strengthReduction(epsS);
  const Mn = As * input.fyr * jd;
  const b1 = beta1(input.fc);

  if (As < AsMin) warnings.push("Provided steel area is below the minimum flexural reinforcement.");
  if (As > AsMax) warnings.push("Provided steel area exceeds the maximum allowed ratio (0.75 ρb).");
  if (a > d) warnings.push("Whitney stress block depth exceeds effective depth. Increase section size or reduce steel.");
  if (c <= 0 || !Number.isFinite(c)) warnings.push("Neutral axis could not be determined from the current inputs.");

  return {
    As,
    AsMin,
    AsMax,
    a,
    d,
    c,
    jd,
    rho,
    rhoMax,
    rhoBalance: rhoBal,
    epsS,
    phi,
    Mn,
    phiMn: phi * Mn,
    beta1: b1,
    classification: classifySection(epsS),
    warnings,
  };
}
