import { useMemo } from "react";
import { computeResponseSpectrum, SITE_CLASSES, validateSpectrum } from "@/lib/spectrum";
import { useProjectStore } from "@/stores/projectStore";
import { NumberField, SelectField } from "@/components/ui/Field";
import { Panel, Stat, Alert } from "@/components/ui/Panel";
import { SpectrumChart } from "@/components/visualization/SpectrumChart";
import { SvgViewport } from "@/components/visualization/SvgViewport";
import { formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { exportTextFile } from "@/services/fileService";
import type { SiteClass } from "@/types";

export function SpectrumPage() {
  const input = useProjectStore((s) => s.project.spectrum);
  const update = useProjectStore((s) => s.updateSpectrum);
  const issues = validateSpectrum(input);
  const result = useMemo(() => computeResponseSpectrum(input), [input]);
  const setNum = (key: keyof typeof input) => (raw: string) => {
    const value = Number(raw);
    if (Number.isFinite(value)) update({ [key]: value });
  };

  const csv = result.periods.map((t, i) => `${t.toFixed(3)},${(result.accelerations[i] ?? 0).toFixed(5)}`).join("\n");

  return (
    <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
      <Panel title="ASCE 7 spectrum">
        <div className="space-y-3">
          <NumberField label="Ss" value={input.ss} hint="Mapped short-period spectral acceleration" onChange={setNum("ss")} />
          <NumberField label="S1" value={input.s1} hint="Mapped 1-second spectral acceleration" onChange={setNum("s1")} />
          <SelectField label="Site class" value={input.siteClass} onChange={(e) => update({ siteClass: e.target.value as SiteClass })}>
            {SITE_CLASSES.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </SelectField>
          <NumberField label="Design coefficient" value={input.designCoefficient} hint="Usually 2/3 for SDS = (2/3) SMS" onChange={setNum("designCoefficient")} />
          <Button variant="secondary" onClick={() => void exportTextFile(`T_s,Sa_g\n${csv}`, "response-spectrum.csv", ["csv"], "text/csv")}>
            Export CSV
          </Button>
        </div>
      </Panel>
      <div className="space-y-4">
        {issues.length > 0 ? issues.map((issue) => <Alert key={issue} tone="danger">{issue}</Alert>) : null}
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <Stat label="Fa" value={formatNumber(result.fa, 3)} />
          <Stat label="Fv" value={formatNumber(result.fv, 3)} />
          <Stat label="SDS" value={formatNumber(result.sds, 3)} />
          <Stat label="SD1" value={formatNumber(result.sd1, 3)} />
          <Stat label="T0 / Ts" value={`${formatNumber(result.t0, 3)} / ${formatNumber(result.ts, 3)} s`} />
        </div>
        <Panel title="Design spectrum">
          <SvgViewport ariaLabel="Response spectrum chart" className="h-[440px]">
            <SpectrumChart result={result} />
          </SvgViewport>
        </Panel>
      </div>
    </div>
  );
}
