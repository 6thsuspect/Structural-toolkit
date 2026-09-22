import type { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { id: "home", path: "/", label: "Overview", group: "Workspace", description: "Start here and open any calculation tool." },
  { id: "steel", path: "/steel", label: "Steel sections", group: "Structure", description: "H-beam and angle catalogs with section properties." },
  { id: "flexural", path: "/flexural", label: "Flexural analysis", group: "Structure", description: "Rectangular reinforced-concrete beam capacity." },
  { id: "slab", path: "/slab", label: "Two-way slab", group: "Structure", description: "Marcus-method slab moments and bar spacing." },
  { id: "spectrum", path: "/spectrum", label: "Response spectrum", group: "Structure", description: "ASCE 7 design response spectrum." },
  { id: "point-load", path: "/surcharge/point", label: "Point surcharge", group: "Geotechnical", description: "Lateral pressure from a point surcharge." },
  { id: "strip-load", path: "/surcharge/strip", label: "Strip surcharge", group: "Geotechnical", description: "Lateral pressure from a strip surcharge." },
  { id: "converter", path: "/converter", label: "Unit converter", group: "Math", description: "Convert distance, force, pressure, area, and moment." },
  { id: "settings", path: "/settings", label: "Settings", group: "Workspace", description: "Default material properties and application theme." },
  { id: "help", path: "/help", label: "Help", group: "Workspace", description: "Shortcuts, file formats, and license notes." },
];

export const SHORTCUTS = [
  { keys: "Ctrl/⌘ K", action: "Open command palette" },
  { keys: "Ctrl/⌘ O", action: "Open project" },
  { keys: "Ctrl/⌘ S", action: "Save project" },
  { keys: "Ctrl/⌘ Shift S", action: "Save project as" },
  { keys: "Ctrl/⌘ E", action: "Export current tool data" },
  { keys: "Ctrl/⌘ Shift T", action: "Toggle light/dark theme" },
  { keys: "Ctrl/⌘ /", action: "Show keyboard shortcuts" },
  { keys: "1–8", action: "Jump to a workspace tool" },
  { keys: "Esc", action: "Close dialogs" },
];
