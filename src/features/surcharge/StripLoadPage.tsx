import { useMemo } from "react";
import { stripLoadGrid, validateStripLoad } from "@/lib/surcharge";
import { useProjectStore } from "@/stores/projectStore";
import { NumberField, SelectField } from "@/components/ui/Field";
import { Panel, Alert } from "@/components/ui/Panel";
import { Heatmap } from "@/components/visualization/Heatmap";
import { WallDiagram } from "@/components/visualization/WallDiagram";
import { SvgViewport } from "@/components/visualization/SvgViewport";
import type { WallType } from "@/types";

export function StripLoadPage() {
  const input = useProjectStore((s) => s.project.stripLoad);
  const update = useProjectStore((s) => s.updateStripLoad);
  const issues = validateStripLoad(input);
  const grid = useMemo(() => stripLoadGrid(input), [input]);
  const setNum = (key: keyof typeof input) => (raw: string) => {
    const value = Number(raw);
    if (Number.isFinite(value)) update({ [key]: value });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
      <Panel title="Strip surcharge">
        <div className="space-y-3">
          <NumberField label="Strip load q" value={input.q} unit="kN/m²" onChange={setNum("q")} />
          <NumberField label="Distance from wall x" value={input.xLoad} unit="m" onChange={setNum("xLoad")} />
          <NumberField label="Load width B" value={input.width} unit="m" onChange={setNum("width")} />
          <NumberField label="Wall height H" value={input.H} unit="m" onChange={setNum("H")} />
          <NumberField label="Left boundary" value={input.start} unit="m" onChange={setNum("start")} />
          <NumberField label="Right boundary" value={input.end} unit="m" onChange={setNum("end")} />
          <SelectField label="Wall stiffness" value={String(input.wallType)} onChange={(e) => update({ wallType: Number(e.target.value) as WallType })}>
            <option value="1">1 — Flexible</option>
            <option value="2">2 — Rigid</option>
          </SelectField>
        </div>
      </Panel>
      <div className="space-y-4">
        {issues.map((issue) => <Alert key={issue} tone="danger">{issue}</Alert>)}
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Schematic">
            <SvgViewport ariaLabel="Strip load wall schematic" className="h-[300px]">
              <WallDiagram H={input.H} xLoad={input.xLoad} width={input.width} kind="strip" />
            </SvgViewport>
          </Panel>
          <Panel title="Horizontal pressure field">
            <SvgViewport ariaLabel="Strip surcharge pressure heatmap" className="h-[300px]">
              <Heatmap grid={grid} title="σh along the wall" unit="kN/m²" />
            </SvgViewport>
          </Panel>
        </div>
      </div>
    </div>
  );
}
