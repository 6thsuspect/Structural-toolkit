import type { AngleDimensions, IwfDimensions, SteelSectionProperties } from "@/types";

export const IWF_CATALOG: IwfDimensions[] = [
  { designation: "H-100x100x6x8x10", h: 100, b: 100, tw: 6, tf: 8, r: 10 },
  { designation: "H-125x125x6.5x9x10", h: 125, b: 125, tw: 6.5, tf: 9, r: 10 },
  { designation: "H-150x75x5x7x8", h: 150, b: 75, tw: 5, tf: 7, r: 8 },
  { designation: "H-150x150x7x10x11", h: 150, b: 150, tw: 7, tf: 10, r: 11 },
  { designation: "H-200x100x5.5x8x11", h: 200, b: 100, tw: 5.5, tf: 8, r: 11 },
  { designation: "H-200x200x8x12x13", h: 200, b: 200, tw: 8, tf: 12, r: 13 },
  { designation: "H-250x125x6x9x12", h: 250, b: 125, tw: 6, tf: 9, r: 12 },
  { designation: "H-250x250x9x14x16", h: 250, b: 250, tw: 9, tf: 14, r: 16 },
  { designation: "H-300x150x6.5x9x13", h: 300, b: 150, tw: 6.5, tf: 9, r: 13 },
  { designation: "H-300x300x10x15x18", h: 300, b: 300, tw: 10, tf: 15, r: 18 },
  { designation: "H-350x175x7x11x14", h: 350, b: 175, tw: 7, tf: 11, r: 14 },
  { designation: "H-350x350x12x19x20", h: 350, b: 350, tw: 12, tf: 19, r: 20 },
  { designation: "H-400x200x8x13x16", h: 400, b: 200, tw: 8, tf: 13, r: 16 },
  { designation: "H-400x400x13x21x22", h: 400, b: 400, tw: 13, tf: 21, r: 22 },
  { designation: "H-450x200x9x14x18", h: 450, b: 200, tw: 9, tf: 14, r: 18 },
  { designation: "H-500x200x10x16x20", h: 500, b: 200, tw: 10, tf: 16, r: 20 },
  { designation: "H-600x200x11x17x22", h: 600, b: 200, tw: 11, tf: 17, r: 22 },
  { designation: "H-700x300x13x24x28", h: 700, b: 300, tw: 13, tf: 24, r: 28 },
  { designation: "H-800x300x14x26x28", h: 800, b: 300, tw: 14, tf: 26, r: 28 },
  { designation: "H-900x300x16x28x28", h: 900, b: 300, tw: 16, tf: 28, r: 28 },
];

export const ANGLE_CATALOG: AngleDimensions[] = [
  { designation: "L-25x25x3x4x2", h: 25, b: 25, t: 3, r1: 4, r2: 2 },
  { designation: "L-30x30x3x4x2", h: 30, b: 30, t: 3, r1: 4, r2: 2 },
  { designation: "L-40x40x3x4.5x2", h: 40, b: 40, t: 3, r1: 4.5, r2: 2 },
  { designation: "L-40x40x4x4.5x2", h: 40, b: 40, t: 4, r1: 4.5, r2: 2 },
  { designation: "L-40x40x5x4.5x3", h: 40, b: 40, t: 5, r1: 4.5, r2: 3 },
  { designation: "L-45x45x4x6.5x3", h: 45, b: 45, t: 4, r1: 6.5, r2: 3 },
  { designation: "L-45x45x5x6.5x3", h: 45, b: 45, t: 5, r1: 6.5, r2: 3 },
  { designation: "L-50x50x4x6.5x3", h: 50, b: 50, t: 4, r1: 6.5, r2: 3 },
  { designation: "L-50x50x5x6.5x3", h: 50, b: 50, t: 5, r1: 6.5, r2: 3 },
  { designation: "L-50x50x6x6.5x4.5", h: 50, b: 50, t: 6, r1: 6.5, r2: 4.5 },
  { designation: "L-60x60x4x6.5x3", h: 60, b: 60, t: 4, r1: 6.5, r2: 3 },
  { designation: "L-60x60x5x6.5x3", h: 60, b: 60, t: 5, r1: 6.5, r2: 3 },
  { designation: "L-60x60x6x8x4", h: 60, b: 60, t: 6, r1: 8, r2: 4 },
  { designation: "L-65x65x5x8.5x3", h: 65, b: 65, t: 5, r1: 8.5, r2: 3 },
  { designation: "L-65x65x6x8.5x4", h: 65, b: 65, t: 6, r1: 8.5, r2: 4 },
  { designation: "L-65x65x8x8.5x6", h: 65, b: 65, t: 8, r1: 8.5, r2: 6 },
  { designation: "L-70x70x6x8.5x4", h: 70, b: 70, t: 6, r1: 8.5, r2: 4 },
  { designation: "L-75x75x6x8.5x4", h: 75, b: 75, t: 6, r1: 8.5, r2: 4 },
  { designation: "L-75x75x9x8.5x6", h: 75, b: 75, t: 9, r1: 8.5, r2: 6 },
  { designation: "L-75x75x12x8.5x6", h: 75, b: 75, t: 12, r1: 8.5, r2: 6 },
  { designation: "L-80x80x6x8.5x4", h: 80, b: 80, t: 6, r1: 8.5, r2: 4 },
  { designation: "L-90x90x6x10x5", h: 90, b: 90, t: 6, r1: 10, r2: 5 },
  { designation: "L-90x90x7x10x5", h: 90, b: 90, t: 7, r1: 10, r2: 5 },
  { designation: "L-90x90x10x10x7", h: 90, b: 90, t: 10, r1: 10, r2: 7 },
  { designation: "L-90x90x13x10x7", h: 90, b: 90, t: 13, r1: 10, r2: 7 },
  { designation: "L-100x100x7x10x5", h: 100, b: 100, t: 7, r1: 10, r2: 5 },
  { designation: "L-100x100x10x10x7", h: 100, b: 100, t: 10, r1: 10, r2: 7 },
  { designation: "L-100x100x13x10x7", h: 100, b: 100, t: 13, r1: 10, r2: 7 },
  { designation: "L-120x120x8x12x5", h: 120, b: 120, t: 8, r1: 12, r2: 5 },
  { designation: "L-120x120x11x13x6.5", h: 120, b: 120, t: 11, r1: 13, r2: 6.5 },
  { designation: "L-120x120x12x13x6.5", h: 120, b: 120, t: 12, r1: 13, r2: 6.5 },
  { designation: "L-130x130x9x12x6", h: 130, b: 130, t: 9, r1: 12, r2: 6 },
  { designation: "L-130x130x12x12x8.5", h: 130, b: 130, t: 12, r1: 12, r2: 8.5 },
  { designation: "L-130x130x15x12x8.5", h: 130, b: 130, t: 15, r1: 12, r2: 8.5 },
  { designation: "L-150x150x12x14x7", h: 150, b: 150, t: 12, r1: 14, r2: 7 },
  { designation: "L-150x150x15x14x10", h: 150, b: 150, t: 15, r1: 14, r2: 10 },
  { designation: "L-150x150x19x14x10", h: 150, b: 150, t: 19, r1: 14, r2: 10 },
  { designation: "L-175x175x12x15x11", h: 175, b: 175, t: 12, r1: 15, r2: 11 },
  { designation: "L-175x175x15x15x11", h: 175, b: 175, t: 15, r1: 15, r2: 11 },
  { designation: "L-200x200x15x17x12", h: 200, b: 200, t: 15, r1: 17, r2: 12 },
  { designation: "L-200x200x20x17x12", h: 200, b: 200, t: 20, r1: 17, r2: 12 },
  { designation: "L-200x200x25x17x12", h: 200, b: 200, t: 25, r1: 17, r2: 12 },
  { designation: "L-250x250x25x24x12", h: 250, b: 250, t: 25, r1: 24, r2: 12 },
  { designation: "L-250x250x35x24x18", h: 250, b: 250, t: 35, r1: 24, r2: 18 },
];

function finish(
  props: Omit<SteelSectionProperties, "unitWeight" | "ix" | "iy"> & { steelUnitWeight: number },
): SteelSectionProperties {
  const unitWeight = (props.area / 10000) * props.steelUnitWeight;
  return {
    designation: props.designation,
    kind: props.kind,
    dimensions: props.dimensions,
    area: props.area,
    Ixx: props.Ixx,
    Iyy: props.Iyy,
    Sx: props.Sx,
    Sy: props.Sy,
    unitWeight,
    ix: Math.sqrt(props.Ixx / props.area),
    iy: Math.sqrt(props.Iyy / props.area),
  };
}

export function iwfProperties(dim: IwfDimensions, steelUnitWeight: number): SteelSectionProperties {
  const { h, b, tw, tf, r } = dim;
  const h1 = h - 2 * tf;
  const area = (2 * b * tf + tw * h1 + (2 * r) ** 2 - Math.PI * r ** 2) / 100;
  const Ixx = (h1 ** 3 * tw / 12 + 2 * (tf ** 3 * b / 12 + tf * b * (h1 + tf) ** 2 / 4)) / 10000;
  const Iyy = (tw ** 3 * h1 / 12 + 2 * (b ** 3 * tf / 12)) / 10000;
  const Sx = Ixx / (h / 2 / 10);
  const Sy = Iyy / (b / 2 / 10);
  return finish({
    designation: dim.designation,
    kind: "iwf",
    dimensions: { h, b, tw, tf, r },
    area,
    Ixx,
    Iyy,
    Sx,
    Sy,
    steelUnitWeight,
  });
}

export function angleProperties(dim: AngleDimensions, steelUnitWeight: number): SteelSectionProperties {
  const { h, b, t, r1, r2 } = dim;
  const b1 = b - t;
  const A1 = h * t - r2 ** 2 * (1 - Math.PI / 4);
  const A2 = b1 * t - r2 ** 2 * (1 - Math.PI / 4);
  const A3 = r1 ** 2 * (1 - Math.PI / 4);
  const areaMm2 = A1 + A2 + A3;
  const area = areaMm2 / 100;
  const Ax = b1 * t * (t + b1 / 2) + (h * t ** 2) / 2;
  const Ay = b1 * t * (t / 2) + (t * h ** 2) / 2;
  const cx = Ax / areaMm2;
  const cy = Ay / areaMm2;
  const Ixx = (b1 * t * (cy - t / 2) ** 2 + t * h * (h / 2 - cy) ** 2) / 10000;
  const Iyy = (b * t * (b / 2 - cx) ** 2 + (h - t) * t * (cx - t / 2) ** 2) / 10000;
  const Sx = Ixx / (h / 2 / 10);
  const Sy = Iyy / (b / 2 / 10);
  return finish({
    designation: dim.designation,
    kind: "angle",
    dimensions: { h, b, t, r1, r2, cx, cy },
    area,
    Ixx,
    Iyy,
    Sx,
    Sy,
    steelUnitWeight,
  });
}

export function buildIwfTable(steelUnitWeight: number): SteelSectionProperties[] {
  return IWF_CATALOG.map((item) => iwfProperties(item, steelUnitWeight));
}

export function buildAngleTable(steelUnitWeight: number): SteelSectionProperties[] {
  return ANGLE_CATALOG.map((item) => angleProperties(item, steelUnitWeight));
}

export function sectionsToCsv(rows: SteelSectionProperties[]): string {
  const header = ["Designation", "Area_cm2", "UnitWeight_kg_m", "Ixx_cm4", "Iyy_cm4", "Sx_cm3", "Sy_cm3", "ix_cm", "iy_cm"];
  const lines = rows.map((row) =>
    [row.designation, row.area, row.unitWeight, row.Ixx, row.Iyy, row.Sx, row.Sy, row.ix, row.iy]
      .map((value) => (typeof value === "number" ? value.toFixed(2) : value))
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

export type SortKey = keyof Pick<
  SteelSectionProperties,
  "designation" | "area" | "unitWeight" | "Ixx" | "Iyy" | "Sx" | "Sy" | "ix" | "iy"
>;

export function sortSections(
  rows: SteelSectionProperties[],
  key: SortKey,
  direction: "asc" | "desc",
): SteelSectionProperties[] {
  const copy = [...rows];
  copy.sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
    return direction === "asc" ? cmp : -cmp;
  });
  return copy;
}
