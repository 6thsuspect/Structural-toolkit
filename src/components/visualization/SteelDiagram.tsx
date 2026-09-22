import type { SteelKind, SteelSectionProperties } from "@/types";
import { Grid } from "@/components/visualization/Grid";

interface Props {
  section: SteelSectionProperties;
}

function IwfShape({ section }: Props) {
  const h = section.dimensions.h ?? 100;
  const b = section.dimensions.b ?? 100;
  const tw = section.dimensions.tw ?? 8;
  const tf = section.dimensions.tf ?? 10;
  const max = Math.max(h, b);
  const s = 220 / max;
  const ox = 90;
  const oy = 40;
  const H = h * s;
  const B = b * s;
  const TW = tw * s;
  const TF = tf * s;
  const webX = ox + (B - TW) / 2;
  const d = `M ${ox} ${oy + H} H ${ox + B} V ${oy + H - TF} H ${webX + TW} V ${oy + TF} H ${ox + B} V ${oy} H ${ox} V ${oy + TF} H ${webX} V ${oy + H - TF} H ${ox} Z`;
  return <path d={d} fill="#94a3b8" stroke="var(--foreground)" strokeWidth="1.2" />;
}

function AngleShape({ section }: Props) {
  const h = section.dimensions.h ?? 50;
  const b = section.dimensions.b ?? 50;
  const t = section.dimensions.t ?? 6;
  const max = Math.max(h, b);
  const s = 220 / max;
  const ox = 90;
  const oy = 40;
  const H = h * s;
  const B = b * s;
  const T = t * s;
  const d = `M ${ox} ${oy} H ${ox + T} V ${oy + H - T} H ${ox + B} V ${oy + H} H ${ox} Z`;
  return <path d={d} fill="#94a3b8" stroke="var(--foreground)" strokeWidth="1.2" />;
}

export function SteelDiagram({ section }: Props) {
  const kind: SteelKind = section.kind;
  return (
    <svg viewBox="0 0 360 320" className="h-full w-full" role="img" aria-label={`${section.designation} cross section`}>
      <rect width="360" height="320" fill="var(--panel)" rx="8" />
      <Grid width={360} height={320} step={20} />
      <text x="16" y="24" fontSize="13" fontWeight="600" fill="var(--foreground)">
        {section.designation}
      </text>
      {kind === "iwf" ? <IwfShape section={section} /> : <AngleShape section={section} />}
      <g fontSize="11" fill="var(--muted)">
        <text x="16" y="270">A = {section.area.toFixed(2)} cm²</text>
        <text x="16" y="288">Ixx = {section.Ixx.toFixed(1)} cm⁴</text>
        <text x="180" y="270">Iyy = {section.Iyy.toFixed(1)} cm⁴</text>
        <text x="180" y="288">{section.unitWeight.toFixed(2)} kg/m</text>
      </g>
    </svg>
  );
}
