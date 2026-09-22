import type { SiteClass, SpectrumInput, SpectrumResult } from "@/types";
import { requirePositive, requireRange } from "@/lib/validation";

export const SITE_CLASSES: { id: SiteClass; label: string }[] = [
  { id: "SA", label: "SA — Hard rock" },
  { id: "SB", label: "SB — Rock" },
  { id: "SC", label: "SC — Very dense soil and soft rock" },
  { id: "SD", label: "SD — Stiff soil" },
  { id: "SE", label: "SE — Soft clay soil" },
];

export function siteCoefficients(ss: number, s1: number, soilClass: SiteClass): { fa: number; fv: number } {
  switch (soilClass) {
    case "SA":
      return { fa: 0.8, fv: 0.8 };
    case "SB":
      return { fa: 1.0, fv: 1.0 };
    case "SC": {
      const fa = ss <= 0.5 ? 1.2 : ss < 1.0 ? -0.4 * ss + 1.4 : 1.0;
      const fv = -s1 + 1.8;
      return { fa, fv };
    }
    case "SD": {
      let fa: number;
      if (ss <= 0.25) fa = 1.6;
      else if (ss < 0.75) fa = -0.88 * ss + 1.8;
      else if (ss < 1.25) fa = -0.4 * ss + 1.5;
      else fa = 1.0;
      let fv: number;
      if (s1 <= 0.1) fv = 2.4;
      else if (s1 < 0.3) fv = -4 * s1 + 2.8;
      else if (s1 < 0.4) fv = -2 * s1 + 2.4;
      else if (s1 < 0.5) fv = -s1 + 2;
      else fv = 1.5;
      return { fa, fv };
    }
    case "SE": {
      let fa: number;
      if (ss <= 0.25) fa = 2.5;
      else if (ss < 0.5) fa = -0.32 * ss + 3.3;
      else if (ss < 0.75) fa = -2 * ss + 2.7;
      else if (ss < 1.0) fa = -1.32 * ss + 2.1;
      else fa = 0.9;
      let fv: number;
      if (s1 <= 0.1) fv = 3.5;
      else if (s1 < 0.2) fv = -3 * s1 + 3.8;
      else if (s1 < 0.4) fv = -4 * s1 + 4;
      else fv = 2.4;
      return { fa, fv };
    }
  }
}

export function spectralAcceleration(period: number, sds: number, sd1: number, t0: number, ts: number): number {
  if (period <= t0) return (sds / 2.5) + (period / t0) * (sds - sds / 2.5);
  if (period <= ts) return sds;
  return sd1 / period;
}

export function validateSpectrum(input: SpectrumInput): string[] {
  return [
    requirePositive(input.ss, "Ss"),
    requirePositive(input.s1, "S1"),
    requireRange(input.designCoefficient, "Design coefficient", 0.1, 1.5),
  ].filter((item): item is string => Boolean(item));
}

export function computeResponseSpectrum(input: SpectrumInput): SpectrumResult {
  const { fa, fv } = siteCoefficients(input.ss, input.s1, input.siteClass);
  const sms = input.ss * fa;
  const sm1 = input.s1 * fv;
  const sds = sms * input.designCoefficient;
  const sd1 = sm1 * input.designCoefficient;
  const s0 = sds / 2.5;
  const t0 = sds === 0 ? 0 : (0.2 * sd1) / sds;
  const ts = sds === 0 ? 0 : sd1 / sds;

  const periods: number[] = [0, t0, ts];
  const accelerations: number[] = [s0, sds, sds];
  let t = ts;
  while (t <= 8) {
    periods.push(t);
    accelerations.push(t === 0 ? sds : sd1 / t);
    t += 0.1;
  }

  return { fa, fv, sms, sm1, sds, sd1, s0, t0, ts, periods, accelerations };
}
