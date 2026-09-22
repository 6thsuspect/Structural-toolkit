import { useMemo, useState } from "react";
import { buildAngleTable, buildIwfTable, sectionsToCsv, sortSections, type SortKey } from "@/lib/steel";
import { useProjectStore } from "@/stores/projectStore";
import { SteelDiagram } from "@/components/visualization/SteelDiagram";
import { SvgViewport } from "@/components/visualization/SvgViewport";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { exportTextFile } from "@/services/fileService";
import { formatNumber } from "@/lib/format";
import type { SteelKind, SteelSectionProperties } from "@/types";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "designation", label: "Designation" },
  { key: "area", label: "A cm²" },
  { key: "unitWeight", label: "kg/m" },
  { key: "Ixx", label: "Ixx cm⁴" },
  { key: "Iyy", label: "Iyy cm⁴" },
  { key: "Sx", label: "Sx cm³" },
  { key: "Sy", label: "Sy cm³" },
  { key: "ix", label: "ix cm" },
  { key: "iy", label: "iy cm" },
];

export function SteelPage() {
  const steelUnitWeight = useProjectStore((s) => s.project.settings.steelUnitWeight);
  const [kind, setKind] = useState<SteelKind>("iwf");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("designation");
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<string | null>(null);

  const rows = useMemo(() => {
    const source = kind === "iwf" ? buildIwfTable(steelUnitWeight) : buildAngleTable(steelUnitWeight);
    const filtered = source.filter((row) => row.designation.toLowerCase().includes(query.toLowerCase()));
    return sortSections(filtered, sortKey, dir);
  }, [dir, kind, query, sortKey, steelUnitWeight]);

  const current: SteelSectionProperties | undefined = rows.find((row) => row.designation === selected) ?? rows[0];

  const onSort = (key: SortKey) => {
    if (key === sortKey) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setDir("asc");
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
      <Panel
        title="Steel section catalog"
        actions={
          <div className="flex gap-2">
            <Button variant={kind === "iwf" ? "primary" : "secondary"} onClick={() => setKind("iwf")}>H-beam</Button>
            <Button variant={kind === "angle" ? "primary" : "secondary"} onClick={() => setKind("angle")}>Angle</Button>
            <Button variant="secondary" onClick={() => void exportTextFile(sectionsToCsv(rows), `${kind}-sections.csv`, ["csv"], "text/csv")}>
              Export CSV
            </Button>
          </div>
        }
      >
        <input className="field-input mb-3" placeholder="Filter designation…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="max-h-[620px] overflow-auto rounded-lg border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-panel">
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col.key} className="cursor-pointer px-3 py-2 text-xs uppercase tracking-wide text-muted" onClick={() => onSort(col.key)}>
                    {col.label}{sortKey === col.key ? (dir === "asc" ? " ↑" : " ↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.designation}
                  className={`cursor-pointer border-t border-border hover:bg-background ${current?.designation === row.designation ? "bg-primary/10" : ""}`}
                  onClick={() => setSelected(row.designation)}
                >
                  <td className="px-3 py-1.5 font-medium">{row.designation}</td>
                  <td className="px-3 py-1.5 font-mono">{formatNumber(row.area)}</td>
                  <td className="px-3 py-1.5 font-mono">{formatNumber(row.unitWeight)}</td>
                  <td className="px-3 py-1.5 font-mono">{formatNumber(row.Ixx)}</td>
                  <td className="px-3 py-1.5 font-mono">{formatNumber(row.Iyy)}</td>
                  <td className="px-3 py-1.5 font-mono">{formatNumber(row.Sx)}</td>
                  <td className="px-3 py-1.5 font-mono">{formatNumber(row.Sy)}</td>
                  <td className="px-3 py-1.5 font-mono">{formatNumber(row.ix)}</td>
                  <td className="px-3 py-1.5 font-mono">{formatNumber(row.iy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted">Unit mass uses the steel density from Settings ({steelUnitWeight} kg/m³). Click a header to sort.</p>
      </Panel>
      <Panel title="Section diagram">
        {current ? (
          <SvgViewport ariaLabel="Steel cross-section" className="h-[420px]">
            <SteelDiagram section={current} />
          </SvgViewport>
        ) : (
          <p className="text-sm text-muted">No section matches the filter.</p>
        )}
      </Panel>
    </div>
  );
}
