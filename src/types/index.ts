export type ThemeMode = "light" | "dark";

export type ToolId =
  | "home"
  | "steel"
  | "flexural"
  | "slab"
  | "spectrum"
  | "point-load"
  | "strip-load"
  | "converter"
  | "settings"
  | "help";

export interface MaterialSettings {
  fc: number;
  fyr: number;
  Ec: number;
  concUnitWeight: number;
  concPoissonRatio: number;
  fys: number;
  fus: number;
  Es: number;
  steelUnitWeight: number;
  steelPoissonRatio: number;
}

export interface FlexuralInput {
  fc: number;
  fyr: number;
  height: number;
  width: number;
  barCount: number;
  diameter: number;
  cover: number;
}

export interface FlexuralResult {
  As: number;
  AsMin: number;
  AsMax: number;
  a: number;
  d: number;
  c: number;
  jd: number;
  rho: number;
  rhoMax: number;
  rhoBalance: number;
  epsS: number;
  phi: number;
  Mn: number;
  phiMn: number;
  beta1: number;
  classification: "tension-controlled" | "transition" | "compression-controlled";
  warnings: string[];
}

export type SlabCaseId = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export interface SlabInput {
  ly: number;
  lx: number;
  thickness: number;
  deadLoad: number;
  liveLoad: number;
  includeSelfWeight: boolean;
  kdl: number;
  kll: number;
  concUnitWeight: number;
  fc: number;
  fus: number;
  slabType: SlabCaseId;
  diameter: number;
  dy: number;
  dx: number;
}

export interface SlabResult {
  ratio: number;
  qu: number;
  selfWeight: number;
  mlxCoeff: number;
  mlyCoeff: number;
  mtxCoeff: number;
  mtyCoeff: number;
  Mlx: number;
  Mly: number;
  Mtx: number;
  Mty: number;
  slx: number;
  sly: number;
  stx: number;
  sty: number;
  error: string;
}

export type SiteClass = "SA" | "SB" | "SC" | "SD" | "SE";

export interface SpectrumInput {
  ss: number;
  s1: number;
  siteClass: SiteClass;
  designCoefficient: number;
}

export interface SpectrumResult {
  fa: number;
  fv: number;
  sms: number;
  sm1: number;
  sds: number;
  sd1: number;
  s0: number;
  t0: number;
  ts: number;
  periods: number[];
  accelerations: number[];
}

export type WallType = 1 | 2;

export interface PointLoadInput {
  q: number;
  xLoad: number;
  H: number;
  start: number;
  end: number;
  wallType: WallType;
}

export interface StripLoadInput {
  q: number;
  xLoad: number;
  width: number;
  H: number;
  start: number;
  end: number;
  wallType: WallType;
}

export interface HeatmapGrid {
  x: number[];
  y: number[];
  z: number[][];
  min: number;
  max: number;
}

export type SteelKind = "iwf" | "angle";

export interface IwfDimensions {
  designation: string;
  h: number;
  b: number;
  tw: number;
  tf: number;
  r: number;
}

export interface AngleDimensions {
  designation: string;
  h: number;
  b: number;
  t: number;
  r1: number;
  r2: number;
}

export interface SteelSectionProperties {
  designation: string;
  kind: SteelKind;
  dimensions: Record<string, number>;
  area: number;
  unitWeight: number;
  Ixx: number;
  Iyy: number;
  Sx: number;
  Sy: number;
  ix: number;
  iy: number;
}

export type ConverterCategory = "distance" | "force" | "pressure" | "area" | "moment";

export interface UnitDefinition {
  id: string;
  label: string;
  factor: number;
}

export interface ProjectDocument {
  version: 1;
  name: string;
  savedAt: string;
  settings: MaterialSettings;
  flexural: FlexuralInput;
  slab: SlabInput;
  spectrum: SpectrumInput;
  pointLoad: PointLoadInput;
  stripLoad: StripLoadInput;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface NavItem {
  id: ToolId;
  path: string;
  label: string;
  group: string;
  description: string;
}
