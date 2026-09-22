import type { ConverterCategory, UnitDefinition } from "@/types";

function unit(id: string, label: string, factor: number): UnitDefinition {
  return { id, label, factor };
}

export const UNIT_CATEGORIES: Record<ConverterCategory, UnitDefinition[]> = {
  distance: [
    unit("m", "meter (m)", 1),
    unit("km", "kilometer (km)", 1000),
    unit("hm", "hectometer (hm)", 100),
    unit("dam", "dekameter (dam)", 10),
    unit("dm", "decimeter (dm)", 0.1),
    unit("cm", "centimeter (cm)", 0.01),
    unit("mm", "millimeter (mm)", 0.001),
    unit("um", "micrometer (µm)", 1e-6),
    unit("nm", "nanometer (nm)", 1e-9),
    unit("in", "inch (in)", 0.0254),
    unit("ft", "foot (ft)", 0.3048),
    unit("yd", "yard (yd)", 0.9144),
    unit("mi", "mile (mi)", 1609.344),
    unit("nmi", "nautical mile", 1852),
  ],
  force: [
    unit("N", "newton (N)", 1),
    unit("kN", "kilonewton (kN)", 1000),
    unit("MN", "meganewton (MN)", 1e6),
    unit("GN", "giganewton (GN)", 1e9),
    unit("dyn", "dyne (dyn)", 1e-5),
    unit("kgf", "kilogram-force (kgf)", 9.80665),
    unit("gf", "gram-force (gf)", 0.00980665),
    unit("tf", "tonne-force (tf)", 9806.65),
    unit("lbf", "pound-force (lbf)", 4.4482216152605),
    unit("kip", "kip-force (kip)", 4448.2216152605),
    unit("ozf", "ounce-force (ozf)", 0.278013850953781),
    unit("pdl", "poundal (pdl)", 0.138254954376),
  ],
  pressure: [
    unit("Pa", "pascal (Pa)", 1),
    unit("kPa", "kilopascal (kPa)", 1000),
    unit("MPa", "megapascal (MPa)", 1e6),
    unit("GPa", "gigapascal (GPa)", 1e9),
    unit("N_m2", "newton/m²", 1),
    unit("N_mm2", "newton/mm²", 1e6),
    unit("kN_m2", "kilonewton/m²", 1000),
    unit("bar", "bar", 1e5),
    unit("mbar", "millibar", 100),
    unit("atm", "standard atmosphere", 101325),
    unit("kgf_cm2", "kgf/cm²", 98066.5),
    unit("kgf_m2", "kgf/m²", 9.80665),
    unit("psi", "psi", 6894.757293168),
    unit("ksi", "ksi", 6894757.293168),
  ],
  area: [
    unit("m2", "square meter (m²)", 1),
    unit("cm2", "square centimeter (cm²)", 1e-4),
    unit("mm2", "square millimeter (mm²)", 1e-6),
    unit("km2", "square kilometer (km²)", 1e6),
    unit("ha", "hectare (ha)", 1e4),
    unit("in2", "square inch (in²)", 0.00064516),
    unit("ft2", "square foot (ft²)", 0.09290304),
  ],
  moment: [
    unit("Nm", "newton-meter (N·m)", 1),
    unit("kNm", "kilonewton-meter (kN·m)", 1000),
    unit("Nmm", "newton-millimeter (N·mm)", 0.001),
    unit("kgfm", "kilogram-force meter", 9.80665),
    unit("lbfft", "pound-force foot", 1.3558179483314),
    unit("lbfin", "pound-force inch", 0.112984829027617),
  ],
};

export function convertValue(value: number, from: UnitDefinition, to: UnitDefinition): number {
  return (value * from.factor) / to.factor;
}

export function findUnit(category: ConverterCategory, id: string): UnitDefinition | undefined {
  return UNIT_CATEGORIES[category].find((item) => item.id === id);
}

export function convertById(
  category: ConverterCategory,
  value: number,
  fromId: string,
  toId: string,
): number {
  const from = findUnit(category, fromId);
  const to = findUnit(category, toId);
  if (!from || !to) {
    throw new Error("Unknown unit. Choose a unit from the available list.");
  }
  if (!Number.isFinite(value)) {
    throw new Error("Enter a valid numeric value to convert.");
  }
  return convertValue(value, from, to);
}
