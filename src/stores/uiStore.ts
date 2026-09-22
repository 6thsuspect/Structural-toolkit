import { create } from "zustand";
import type { ThemeMode } from "@/types";

interface UiState {
  theme: ThemeMode;
  sidebarOpen: boolean;
  commandOpen: boolean;
  shortcutsOpen: boolean;
  statusMessage: string;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  setShortcutsOpen: (open: boolean) => void;
  setStatus: (message: string) => void;
}

const storedTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";
  const value = window.localStorage.getItem("sw.theme");
  return value === "light" || value === "dark" ? value : "dark";
};

export const useUiStore = create<UiState>((set, get) => ({
  theme: storedTheme(),
  sidebarOpen: true,
  commandOpen: false,
  shortcutsOpen: false,
  statusMessage: "Ready",
  setTheme: (theme) => {
    window.localStorage.setItem("sw.theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setShortcutsOpen: (shortcutsOpen) => set({ shortcutsOpen }),
  setStatus: (statusMessage) => set({ statusMessage }),
}));
