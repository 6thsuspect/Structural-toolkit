import { Link } from "react-router-dom";
import { NAV_ITEMS } from "@/lib/navigation";
import { useProjectStore } from "@/stores/projectStore";
import { Panel } from "@/components/ui/Panel";

export function HomePage() {
  const project = useProjectStore((s) => s.project);
  const recent = useProjectStore((s) => s.recent);
  const tools = NAV_ITEMS.filter((item) => item.id !== "home" && item.id !== "help" && item.id !== "settings");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-2xl border border-border bg-panel p-6 shadow-panel">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Structural Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold">Calculate, inspect, and export everyday structural checks.</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          A desktop-ready workspace for steel catalogs, reinforced-concrete capacity, two-way slabs, seismic spectra,
          surcharge pressures, and unit conversion. Diagrams are live SVG, not static images.
        </p>
        <div className="mt-4 text-sm text-muted">Current project: <span className="font-medium text-foreground">{project.name}</span></div>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((item) => (
          <Link key={item.id} to={item.path} className="rounded-xl border border-border bg-panel p-4 shadow-panel transition hover:-translate-y-0.5 hover:border-primary">
            <div className="text-[11px] uppercase tracking-wide text-muted">{item.group}</div>
            <div className="mt-1 text-lg font-semibold">{item.label}</div>
            <p className="mt-2 text-sm text-muted">{item.description}</p>
          </Link>
        ))}
      </div>
      <Panel title="Recent files">
        {recent.length === 0 ? (
          <p className="text-sm text-muted">No saved projects yet. Use Save to keep a .swproj file.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {recent.map((item) => (
              <li key={`${item.name}-${item.savedAt}`} className="flex justify-between">
                <span>{item.name}</span>
                <span className="text-muted">{new Date(item.savedAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
