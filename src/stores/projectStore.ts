import { create } from "zustand";
import type {
  FlexuralInput,
  MaterialSettings,
  PointLoadInput,
  ProjectDocument,
  SlabInput,
  SpectrumInput,
  StripLoadInput,
} from "@/types";
import {
  createProject,
  DEFAULT_SETTINGS,
  parseProject,
  serializeProject,
} from "@/lib/project";
import { elasticModulus } from "@/lib/concrete";

interface ProjectState {
  project: ProjectDocument;
  filePath: string | null;
  dirty: boolean;
  recent: { name: string; savedAt: string }[];
  applyProject: (project: ProjectDocument, filePath?: string | null) => void;
  updateSettings: (patch: Partial<MaterialSettings>) => void;
  resetSettings: () => void;
  updateFlexural: (patch: Partial<FlexuralInput>) => void;
  updateSlab: (patch: Partial<SlabInput>) => void;
  updateSpectrum: (patch: Partial<SpectrumInput>) => void;
  updatePointLoad: (patch: Partial<PointLoadInput>) => void;
  updateStripLoad: (patch: Partial<StripLoadInput>) => void;
  setName: (name: string) => void;
  markSaved: (filePath?: string | null) => void;
  serialize: () => string;
  loadFromText: (raw: string, filePath?: string | null) => void;
}

const STORAGE_KEY = "sw.project";
const RECENT_KEY = "sw.recent";

function loadRecent(): { name: string; savedAt: string }[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as { name: string; savedAt: string }[]) : [];
  } catch {
    return [];
  }
}

function persist(project: ProjectDocument): void {
  window.localStorage.setItem(STORAGE_KEY, serializeProject(project));
}

function initialProject(): ProjectDocument {
  if (typeof window === "undefined") return createProject();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return createProject();
  try {
    return parseProject(raw);
  } catch {
    return createProject();
  }
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: initialProject(),
  filePath: null,
  dirty: false,
  recent: loadRecent(),
  applyProject: (project, filePath = null) => {
    persist(project);
    set({ project, filePath, dirty: false });
  },
  updateSettings: (patch) => {
    const project = get().project;
    const nextSettings = { ...project.settings, ...patch };
    if (patch.fc !== undefined && patch.Ec === undefined) {
      nextSettings.Ec = Number(elasticModulus(patch.fc).toFixed(2));
    }
    const next = {
      ...project,
      settings: nextSettings,
      flexural: {
        ...project.flexural,
        fc: nextSettings.fc,
        fyr: nextSettings.fyr,
      },
      slab: {
        ...project.slab,
        fc: nextSettings.fc,
        fus: nextSettings.fus,
        concUnitWeight: nextSettings.concUnitWeight,
      },
    };
    persist(next);
    set({ project: next, dirty: true });
  },
  resetSettings: () => {
    get().updateSettings({ ...DEFAULT_SETTINGS });
  },
  updateFlexural: (patch) => {
    const project = { ...get().project, flexural: { ...get().project.flexural, ...patch } };
    persist(project);
    set({ project, dirty: true });
  },
  updateSlab: (patch) => {
    const project = { ...get().project, slab: { ...get().project.slab, ...patch } };
    persist(project);
    set({ project, dirty: true });
  },
  updateSpectrum: (patch) => {
    const project = { ...get().project, spectrum: { ...get().project.spectrum, ...patch } };
    persist(project);
    set({ project, dirty: true });
  },
  updatePointLoad: (patch) => {
    const project = { ...get().project, pointLoad: { ...get().project.pointLoad, ...patch } };
    persist(project);
    set({ project, dirty: true });
  },
  updateStripLoad: (patch) => {
    const project = { ...get().project, stripLoad: { ...get().project.stripLoad, ...patch } };
    persist(project);
    set({ project, dirty: true });
  },
  setName: (name) => {
    const project = { ...get().project, name };
    persist(project);
    set({ project, dirty: true });
  },
  markSaved: (filePath) => {
    const project = { ...get().project, savedAt: new Date().toISOString() };
    persist(project);
    const recent = [{ name: project.name, savedAt: project.savedAt }, ...get().recent].slice(0, 8);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    set({ project, dirty: false, filePath: filePath ?? get().filePath, recent });
  },
  serialize: () => serializeProject(get().project),
  loadFromText: (raw, filePath = null) => {
    const project = parseProject(raw);
    persist(project);
    set({ project, filePath, dirty: false });
  },
}));
