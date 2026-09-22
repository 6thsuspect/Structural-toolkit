import { useMemo } from "react";
import { designTwoWaySlab, SLAB_CASES } from "@/lib/slab";
import { useProjectStore } from "@/stores/projectStore";
import { NumberField, SelectField } from "@/components/ui/Field";
import { Panel, Stat, Alert } from "@/components/ui/Panel";
import { SlabDiagram } from "@/components/visualization/SlabDiagram";
import { SvgViewport } from "@/components/visualization/SvgViewport";
import { formatNumber } from "@/lib/format";
import type { SlabCaseId } from "@/types";

export function SlabPage() {
  const input = useProjectStore((s) => s.project.slab);
  const update = useProjectStore((s) => s.updateSlab);
  const result = useMemo(() => designTwoWaySlab(input), [input]);
  const setNum = (key: keyof typeof input) => (raw: string) => {
    const value = Number(raw);
    if (Number.isFinite(value)) update({ [key]: value });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
      <Panel title="Two-way slab (Marcus)">
        <div className="space-y-3">
          <NumberField label="Long span ly" value={input.ly} unit="m" onChange={setNum("ly")} />
          <NumberField label="Short span lx" value={input.lx} unit="m" onChange={setNum("lx")} />
          <NumberField label="Thickness t" value={input.thickness} unit="m" onChange={setNum("thickness")} />
          <NumberField label="Dead load DL" value={input.deadLoad} unit="kg/m²" onChange={setNum("deadLoad")} />
          <NumberField label="Live load LL" value={input.liveLoad} unit="kg/m²" onChange={setNum("liveLoad")} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={input.includeSelfWeight} onChange={(e) => update({ includeSelfWeight: e.target.checked })} />
            Include self-weight
          </label>
          <NumberField label="k DL" value={input.kdl} onChange={setNum("kdl")} />
          <NumberField label="k LL" value={input.kll} onChange={setNum("kll")} />
          <NumberField label="Concrete unit weight" value={input.concUnitWeight} unit="kg/m³" onChange={setNum("concUnitWeight")} />
          <NumberField label="fc'" value={input.fc} unit="MPa" onChange={setNum("fc")} />
          <NumberField label="Steel fus" value={input.fus} unit="MPa" onChange={setNum("fus")} />
          <SelectField label="Support case" value={input.slabType} onChange={(e) => update({ slabType: e.target.value as SlabCaseId })}>
            {SLAB_CASES.map((item) => (
              <option key={item.id} value={item.id}>{item.id}. {item.label}</option>
            ))}
          </SelectField>
          <NumberField label="Bar diameter" value={input.diameter} unit="mm" onChange={setNum("diameter")} />
          <NumberField label="dy" value={input.dy} unit="mm" onChange={setNum("dy")} />
          <NumberField label="dx" value={input.dx} unit="mm" onChange={setNum("dx")} />
        </div>
      </Panel>
      <div className="space-y-4">
        {result.error ? <Alert tone="danger">{result.error}</Alert> : <Alert tone="ok">Factored load qu = {formatNumber(result.qu)} kg/m²</Alert>}
        <div className="grid gap-2 sm:grid-cols-2">
          <Stat label="Mlx" value={`${formatNumber(result.Mlx / 1e6, 3)} kN·m`} hint={`${input.diameter} @ ${Math.round(result.slx) || "—"} mm`} />
          <Stat label="Mly" value={`${formatNumber(result.Mly / 1e6, 3)} kN·m`} hint={`${input.diameter} @ ${Math.round(result.sly) || "—"} mm`} />
          <Stat label="Mtx" value={`${formatNumber(result.Mtx / 1e6, 3)} kN·m`} hint={`${input.diameter} @ ${Math.round(result.stx) || "—"} mm`} />
          <Stat label="Mty" value={`${formatNumber(result.Mty / 1e6, 3)} kN·m`} hint={`${input.diameter} @ ${Math.round(result.sty) || "—"} mm`} />
        </div>
        <Panel title="Plan diagram">
          <SvgViewport ariaLabel="Two-way slab plan" className="h-[380px]">
            <SlabDiagram input={input} result={result} />
          </SvgViewport>
        </Panel>
      </div>
    </div>
  );
}
