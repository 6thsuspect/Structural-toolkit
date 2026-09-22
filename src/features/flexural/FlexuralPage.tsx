import { useMemo } from "react";
import { analyzeFlexural } from "@/lib/concrete";
import { useProjectStore } from "@/stores/projectStore";
import { NumberField } from "@/components/ui/Field";
import { Panel, Stat, Alert } from "@/components/ui/Panel";
import { FlexuralDiagram } from "@/components/visualization/FlexuralDiagram";
import { SvgViewport } from "@/components/visualization/SvgViewport";
import { formatNumber } from "@/lib/format";

export function FlexuralPage() {
  const input = useProjectStore((s) => s.project.flexural);
  const update = useProjectStore((s) => s.updateFlexural);
  const result = useMemo(() => analyzeFlexural(input), [input]);

  const set = (key: keyof typeof input) => (raw: string) => {
    const value = Number(raw);
    update({ [key]: Number.isFinite(value) ? value : input[key] });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
      <Panel title="Section input">
        <div className="space-y-3">
          <NumberField label="Concrete strength fc'" value={input.fc} unit="MPa" onChange={set("fc")} />
          <NumberField label="Steel yield fyr" value={input.fyr} unit="MPa" onChange={set("fyr")} />
          <NumberField label="Height h" value={input.height} unit="mm" onChange={set("height")} />
          <NumberField label="Width b" value={input.width} unit="mm" onChange={set("width")} />
          <NumberField label="Bar count n" value={input.barCount} onChange={set("barCount")} />
          <NumberField label="Bar diameter" value={input.diameter} unit="mm" onChange={set("diameter")} />
          <NumberField label="Cover to bar center" value={input.cover} unit="mm" onChange={set("cover")} />
        </div>
      </Panel>
      <div className="space-y-4">
        <Panel title="Capacity">
          {result.warnings.length > 0 ? (
            <div className="mb-3 space-y-2">
              {result.warnings.map((w) => (
                <Alert key={w} tone="danger">{w}</Alert>
              ))}
            </div>
          ) : (
            <Alert tone="ok">Section is internally consistent. Classification: {result.classification.replace("-", " ")}.</Alert>
          )}
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="As" value={`${formatNumber(result.As)} mm²`} />
            <Stat label="As,min" value={`${formatNumber(result.AsMin)} mm²`} />
            <Stat label="As,max" value={`${formatNumber(result.AsMax)} mm²`} />
            <Stat label="ρ / ρmax" value={`${formatNumber(result.rho, 5)} / ${formatNumber(result.rhoMax, 5)}`} />
            <Stat label="εs" value={formatNumber(result.epsS, 4)} />
            <Stat label="φ" value={formatNumber(result.phi, 3)} />
            <Stat label="Mn" value={`${formatNumber(result.Mn / 1e6)} kN·m`} />
            <Stat label="φMn" value={`${formatNumber(result.phiMn / 1e6)} kN·m`} />
          </div>
        </Panel>
        <Panel title="Section diagram">
          <SvgViewport ariaLabel="Concrete beam section" className="h-[380px]">
            <FlexuralDiagram input={input} result={result} />
          </SvgViewport>
        </Panel>
      </div>
    </div>
  );
}
