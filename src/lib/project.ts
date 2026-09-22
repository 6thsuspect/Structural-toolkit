import type {
  FlexuralInput,
  MaterialSettings,
  PointLoadInput,
  ProjectDocument,
  SlabInput,
  SpectrumInput,
  StripLoadInput,
} from "@/types";
import { elasticModulus } from "@/lib/concrete";

export const DEFAULT_SETTINGS: MaterialSettings = {
  fc: 30,
  fyr: 400,
  Ec: Number(elasticModulus(30).toFixed(2)),
  concUnitWeight: 2400,
  concPoissonRatio: 0.2,
  fys: 240,
  fus: 390,
  Es: 200000,
  steelUnitWeight: 7850,
  steelPoissonRatio: 0.3,
};

export const DEFAULT_FLEXURAL: FlexuralInput = {
  fc: DEFAULT_SETTINGS.fc,
  fyr: DEFAULT_SETTINGS.fyr,
  height: 565,
  width: 250,
  barCount: 4,
  diameter: 13,
  cover: 65,
};

export const DEFAULT_SLAB: SlabInput = {
  ly: 4,
  lx: 3,
  thickness: 0.12,
  deadLoad: 100,
  liveLoad: 250,
  includeSelfWeight: true,
  kdl: 1.2,
  kll: 1.6,
  concUnitWeight: DEFAULT_SETTINGS.concUnitWeight,
  fc: DEFAULT_SETTINGS.fc,
  fus: DEFAULT_SETTINGS.fus,
  slabType: "1",
  diameter: 10,
  dy: 40,
  dx: 50,
};

export const DEFAULT_SPECTRUM: SpectrumInput = {
  ss: 1.3,
  s1: 0.6,
  siteClass: "SD",
  designCoefficient: 0.667,
};

export const DEFAULT_POINT_LOAD: PointLoadInput = {
  q: 200,
  xLoad: 1.2,
  H: 12,
  start: -10,
  end: 10,
  wallType: 2,
};

export const DEFAULT_STRIP_LOAD: StripLoadInput = {
  q: 200,
  xLoad: 1.2,
  width: 1,
  H: 5,
  start: -10,
  end: 10,
  wallType: 2,
};

export function createProject(name = "Untitled project"): ProjectDocument {
  return {
    version: 1,
    name,
    savedAt: new Date().toISOString(),
    settings: { ...DEFAULT_SETTINGS },
    flexural: { ...DEFAULT_FLEXURAL },
    slab: { ...DEFAULT_SLAB },
    spectrum: { ...DEFAULT_SPECTRUM },
    pointLoad: { ...DEFAULT_POINT_LOAD },
    stripLoad: { ...DEFAULT_STRIP_LOAD },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readNumber(source: Record<string, unknown>, key: string, fallback: number): number {
  const value = source[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readString<T extends string>(source: Record<string, unknown>, key: string, fallback: T): T {
  const value = source[key];
  return typeof value === "string" ? (value as T) : fallback;
}

export function parseProject(raw: string): ProjectDocument {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }
  if (!isRecord(parsed)) throw new Error("The project file does not contain an object.");
  if (parsed.version !== 1) throw new Error("Unsupported project version. Expected version 1.");

  const defaults = createProject();
  const settings = isRecord(parsed.settings) ? parsed.settings : {};
  const flexural = isRecord(parsed.flexural) ? parsed.flexural : {};
  const slab = isRecord(parsed.slab) ? parsed.slab : {};
  const spectrum = isRecord(parsed.spectrum) ? parsed.spectrum : {};
  const pointLoad = isRecord(parsed.pointLoad) ? parsed.pointLoad : {};
  const stripLoad = isRecord(parsed.stripLoad) ? parsed.stripLoad : {};

  return {
    version: 1,
    name: typeof parsed.name === "string" ? parsed.name : defaults.name,
    savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : new Date().toISOString(),
    settings: {
      fc: readNumber(settings, "fc", defaults.settings.fc),
      fyr: readNumber(settings, "fyr", defaults.settings.fyr),
      Ec: readNumber(settings, "Ec", defaults.settings.Ec),
      concUnitWeight: readNumber(settings, "concUnitWeight", defaults.settings.concUnitWeight),
      concPoissonRatio: readNumber(settings, "concPoissonRatio", defaults.settings.concPoissonRatio),
      fys: readNumber(settings, "fys", defaults.settings.fys),
      fus: readNumber(settings, "fus", defaults.settings.fus),
      Es: readNumber(settings, "Es", defaults.settings.Es),
      steelUnitWeight: readNumber(settings, "steelUnitWeight", defaults.settings.steelUnitWeight),
      steelPoissonRatio: readNumber(settings, "steelPoissonRatio", defaults.settings.steelPoissonRatio),
    },
    flexural: {
      fc: readNumber(flexural, "fc", defaults.flexural.fc),
      fyr: readNumber(flexural, "fyr", defaults.flexural.fyr),
      height: readNumber(flexural, "height", defaults.flexural.height),
      width: readNumber(flexural, "width", defaults.flexural.width),
      barCount: readNumber(flexural, "barCount", defaults.flexural.barCount),
      diameter: readNumber(flexural, "diameter", defaults.flexural.diameter),
      cover: readNumber(flexural, "cover", defaults.flexural.cover),
    },
    slab: {
      ly: readNumber(slab, "ly", defaults.slab.ly),
      lx: readNumber(slab, "lx", defaults.slab.lx),
      thickness: readNumber(slab, "thickness", defaults.slab.thickness),
      deadLoad: readNumber(slab, "deadLoad", defaults.slab.deadLoad),
      liveLoad: readNumber(slab, "liveLoad", defaults.slab.liveLoad),
      includeSelfWeight: typeof slab.includeSelfWeight === "boolean" ? slab.includeSelfWeight : true,
      kdl: readNumber(slab, "kdl", defaults.slab.kdl),
      kll: readNumber(slab, "kll", defaults.slab.kll),
      concUnitWeight: readNumber(slab, "concUnitWeight", defaults.slab.concUnitWeight),
      fc: readNumber(slab, "fc", defaults.slab.fc),
      fus: readNumber(slab, "fus", defaults.slab.fus),
      slabType: readString(slab, "slabType", defaults.slab.slabType),
      diameter: readNumber(slab, "diameter", defaults.slab.diameter),
      dy: readNumber(slab, "dy", defaults.slab.dy),
      dx: readNumber(slab, "dx", defaults.slab.dx),
    },
    spectrum: {
      ss: readNumber(spectrum, "ss", defaults.spectrum.ss),
      s1: readNumber(spectrum, "s1", defaults.spectrum.s1),
      siteClass: readString(spectrum, "siteClass", defaults.spectrum.siteClass),
      designCoefficient: readNumber(spectrum, "designCoefficient", defaults.spectrum.designCoefficient),
    },
    pointLoad: {
      q: readNumber(pointLoad, "q", defaults.pointLoad.q),
      xLoad: readNumber(pointLoad, "xLoad", defaults.pointLoad.xLoad),
      H: readNumber(pointLoad, "H", defaults.pointLoad.H),
      start: readNumber(pointLoad, "start", defaults.pointLoad.start),
      end: readNumber(pointLoad, "end", defaults.pointLoad.end),
      wallType: readNumber(pointLoad, "wallType", defaults.pointLoad.wallType) === 1 ? 1 : 2,
    },
    stripLoad: {
      q: readNumber(stripLoad, "q", defaults.stripLoad.q),
      xLoad: readNumber(stripLoad, "xLoad", defaults.stripLoad.xLoad),
      width: readNumber(stripLoad, "width", defaults.stripLoad.width),
      H: readNumber(stripLoad, "H", defaults.stripLoad.H),
      start: readNumber(stripLoad, "start", defaults.stripLoad.start),
      end: readNumber(stripLoad, "end", defaults.stripLoad.end),
      wallType: readNumber(stripLoad, "wallType", defaults.stripLoad.wallType) === 1 ? 1 : 2,
    },
  };
}

export function serializeProject(project: ProjectDocument): string {
  return JSON.stringify({ ...project, savedAt: new Date().toISOString() }, null, 2);
}
