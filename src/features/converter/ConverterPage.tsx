import { useMemo, useState } from "react";
import { UNIT_CATEGORIES, convertById } from "@/lib/units";
import type { ConverterCategory } from "@/types";
import { Panel } from "@/components/ui/Panel";
import { formatScientific } from "@/lib/format";

const TABS: { id: ConverterCategory; label: string }[] = [
  { id: "pressure", label: "Pressure" },
  { id: "force", label: "Force" },
  { id: "distance", label: "Distance" },
  { id: "area", label: "Area" },
  { id: "moment", label: "Moment" },
];

export function ConverterPage() {
  const [tab, setTab] = useState<ConverterCategory>("pressure");
  const units = UNIT_CATEGORIES[tab];
  const [fromId, setFromId] = useState(units[0]?.id ?? "Pa");
  const [toId, setToId] = useState(units[1]?.id ?? units[0]?.id ?? "Pa");
  const [raw, setRaw] = useState("1");

  const onTab = (id: ConverterCategory) => {
    setTab(id);
    const next = UNIT_CATEGORIES[id];
    setFromId(next[0]?.id ?? "");
    setToId(next[1]?.id ?? next[0]?.id ?? "");
  };

  const result = useMemo(() => {
    const value = Number(raw);
    if (!Number.isFinite(value)) return { error: "Enter a valid numeric value.", value: null as number | null };
    try {
      return { error: null as string | null, value: convertById(tab, value, fromId, toId) };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Conversion failed.", value: null };
    }
  }, [fromId, raw, tab, toId]);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`rounded-full px-4 py-1.5 text-sm ${tab === item.id ? "bg-primary text-white" : "border border-border bg-panel"}`}
            onClick={() => onTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <Panel title={`${TABS.find((t) => t.id === tab)?.label} converter`}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted">From</span>
            <input className="field-input" value={raw} onChange={(e) => setRaw(e.target.value)} />
            <select className="field-input h-64" size={12} value={fromId} onChange={(e) => setFromId(e.target.value)}>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.label}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-muted">To</span>
            <div className="field-input font-mono text-lg">{result.value === null ? "—" : formatScientific(result.value, 8)}</div>
            <select className="field-input h-64" size={12} value={toId} onChange={(e) => setToId(e.target.value)}>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.label}</option>
              ))}
            </select>
          </label>
        </div>
        {result.error ? <p className="mt-3 text-sm text-danger">{result.error}</p> : null}
      </Panel>
    </div>
  );
}
