import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, type DragEvent } from "react";
import { NAV_ITEMS, SHORTCUTS } from "@/lib/navigation";
import { useUiStore } from "@/stores/uiStore";
import { useProjectStore } from "@/stores/projectStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { openProjectFile, saveProjectFile, exportTextFile } from "@/services/fileService";
import { Button } from "@/components/ui/Button";

function IconMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-primary" />
      <path d="M7 23V9h5l5 8 5-8h5v14h-4V14l-6 9-6-9v9z" fill="white" />
    </svg>
  );
}

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);
  const commandOpen = useUiStore((s) => s.commandOpen);
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);
  const shortcutsOpen = useUiStore((s) => s.shortcutsOpen);
  const setShortcutsOpen = useUiStore((s) => s.setShortcutsOpen);
  const status = useUiStore((s) => s.statusMessage);
  const setStatus = useUiStore((s) => s.setStatus);
  const project = useProjectStore((s) => s.project);
  const dirty = useProjectStore((s) => s.dirty);
  const filePath = useProjectStore((s) => s.filePath);
  const serialize = useProjectStore((s) => s.serialize);
  const loadFromText = useProjectStore((s) => s.loadFromText);
  const markSaved = useProjectStore((s) => s.markSaved);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const current = NAV_ITEMS.find((item) => item.path === location.pathname) ?? NAV_ITEMS[0]!;

  const open = async () => {
    try {
      const result = await openProjectFile();
      if (!result) return;
      loadFromText(result.content, result.path);
      setStatus(`Opened ${result.path ?? "project"}`);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the project file.");
    }
  };

  const save = async (saveAs = false) => {
    try {
      const path = await saveProjectFile(serialize(), saveAs ? `${project.name}.swproj` : filePath ?? `${project.name}.swproj`);
      if (path) {
        markSaved(path);
        setStatus(`Saved ${path}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the project file.");
    }
  };

  const exportCurrent = async () => {
    try {
      const path = await exportTextFile(serialize(), `${project.name}.json`, ["json"], "application/json");
      if (path) setStatus(`Exported ${path}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not export the file.");
    }
  };

  useKeyboardShortcuts({
    onOpen: () => void open(),
    onSave: () => void save(false),
    onSaveAs: () => void save(true),
    onExport: () => void exportCurrent(),
  });

  const filtered = useMemo(
    () => NAV_ITEMS.filter((item) => `${item.label} ${item.group} ${item.description}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const onDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;
    if (!/\.(swproj|json)$/i.test(file.name)) {
      setError("Drop a .swproj or .json project file.");
      return;
    }
    try {
      loadFromText(await file.text(), file.name);
      setStatus(`Opened ${file.name}`);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the dropped file.");
    }
  };

  return (
    <div
      className="flex min-h-screen bg-background text-foreground"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => void onDrop(event)}
    >
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} hidden shrink-0 border-r border-border bg-panel md:flex md:flex-col`}>
        <div className="flex items-center gap-3 px-3 py-4">
          <IconMark />
          {sidebarOpen ? (
            <div>
              <div className="text-sm font-semibold">Structural Workspace</div>
              <div className="text-[11px] text-muted">Engineering calculations</div>
            </div>
          ) : null}
        </div>
        <nav className="flex-1 space-y-4 overflow-auto px-2 pb-4">
          {["Workspace", "Structure", "Geotechnical", "Math"].map((group) => (
            <div key={group}>
              {sidebarOpen ? <div className="px-2 pb-1 text-[10px] uppercase tracking-wider text-muted">{group}</div> : null}
              {NAV_ITEMS.filter((item) => item.group === group).map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === "/"}
                  title={item.label}
                  className={({ isActive }) =>
                    `mb-1 flex items-center rounded-md px-2 py-2 text-sm ${isActive ? "bg-primary/15 text-primary" : "text-foreground hover:bg-background"}`
                  }
                >
                  <span className="truncate">{sidebarOpen ? item.label : item.label.slice(0, 1)}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-panel px-4 py-2">
          <button type="button" className="rounded-md px-2 py-1 text-sm hover:bg-background" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
            ☰
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{current.label}</div>
            <div className="truncate text-xs text-muted">{project.name}{dirty ? " · unsaved" : ""}</div>
          </div>
          <Button variant="secondary" onClick={() => setCommandOpen(true)}>
            Search <span className="kbd">Ctrl K</span>
          </Button>
          <Button variant="secondary" onClick={() => void open()}>Open</Button>
          <Button onClick={() => void save(false)}>Save</Button>
          <button type="button" className="rounded-md px-2 py-1 text-sm hover:bg-background" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </header>
        {error ? <div className="border-b border-danger/40 bg-danger/10 px-4 py-2 text-sm text-danger">{error}</div> : null}
        <main className="min-h-0 flex-1 overflow-auto p-4">
          <Outlet />
        </main>
        <footer className="flex items-center justify-between border-t border-border bg-panel px-4 py-1.5 text-xs text-muted">
          <span>{status}</span>
          <button type="button" onClick={() => setShortcutsOpen(true)}>Shortcuts</button>
        </footer>
      </div>

      {commandOpen ? (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 p-8" onClick={() => setCommandOpen(false)}>
          <div className="w-full max-w-xl rounded-xl border border-border bg-panel p-3 shadow-panel" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              className="field-input"
              placeholder="Jump to a tool…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Command search"
            />
            <div className="mt-2 max-h-80 overflow-auto">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-background"
                  onClick={() => {
                    navigate(item.path);
                    setCommandOpen(false);
                    setQuery("");
                  }}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted">{item.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {shortcutsOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-8" onClick={() => setShortcutsOpen(false)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-panel p-5 shadow-panel" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">Keyboard shortcuts</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {SHORTCUTS.map((item) => (
                <li key={item.keys} className="flex justify-between gap-4">
                  <span>{item.action}</span>
                  <span className="kbd">{item.keys}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
