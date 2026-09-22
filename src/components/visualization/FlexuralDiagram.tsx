import type { FlexuralInput, FlexuralResult } from "@/types";
import { formatNumber } from "@/lib/format";

interface Props {
  input: FlexuralInput;
  result: FlexuralResult;
}

export function FlexuralDiagram({ input, result }: Props) {
  const maxDim = Math.max(input.width, input.height, 1);
  const scale = 260 / maxDim;
  const w = input.width * scale;
  const h = input.height * scale;
  const ox = 80;
  const oy = 40;
  const cover = input.cover * scale;
  const a = Math.max(2, result.a * scale);
  const c = Math.max(2, result.c * scale);
  const barR = Math.max(3, (input.diameter * scale) / 2);
  const bars = Array.from({ length: Math.max(1, Math.round(input.barCount)) }, (_, i) => {
    const usable = Math.max(w - 2 * cover, barR * 2);
    const x = ox + cover + (input.barCount === 1 ? usable / 2 : (usable * i) / (input.barCount - 1));
    return { x, y: oy + h - cover };
  });

  return (
    <svg viewBox="0 0 520 360" className="h-full w-full" role="img" aria-label="Reinforced concrete section diagram">
      <rect width="520" height="360" fill="var(--panel)" rx="8" />
      <text x="16" y="22" fontSize="13" fontWeight="600" fill="var(--foreground)">
        Rectangular section
      </text>
      <rect x={ox} y={oy} width={w} height={h} fill="#d6d3d1" stroke="var(--foreground)" strokeWidth="1.5" />
      <rect x={ox} y={oy} width={w} height={a} fill="rgba(185,28,28,0.28)" />
      <line x1={ox} x2={ox + w} y1={oy + c} y2={oy + c} stroke="var(--secondary)" strokeDasharray="6 4" />
      {bars.map((bar, i) => (
        <circle key={i} cx={bar.x} cy={bar.y} r={barR} fill="#1e293b" stroke="#f8fafc" />
      ))}
      <line x1={ox} x2={ox} y1={oy} y2={oy + h} stroke="var(--primary)" markerEnd="url(#arrow)" />
      <text x={ox - 12} y={oy + h / 2} textAnchor="end" fontSize="11" fill="var(--muted)">
        h={formatNumber(input.height, 0)}
      </text>
      <text x={ox + w / 2} y={oy + h + 18} textAnchor="middle" fontSize="11" fill="var(--muted)">
        b={formatNumber(input.width, 0)} mm
      </text>
      <g transform="translate(360, 50)">
        <text fontSize="12" fill="var(--foreground)" fontWeight="600">
          Strain
        </text>
        <line x1="20" x2="20" y1="20" y2={20 + h} stroke="var(--border)" />
        <polygon points={`20,20 70,20 20,${20 + c}`} fill="rgba(239,68,68,0.25)" stroke="var(--danger)" />
        <polygon points={`20,${20 + c} 20,${20 + h} 78,${20 + h}`} fill="rgba(37,99,235,0.18)" stroke="var(--secondary)" />
        <text x="76" y="18" fontSize="10" fill="var(--muted)">
          εcu=0.003
        </text>
        <text x="82" y={28 + h} fontSize="10" fill="var(--muted)">
          εs={formatNumber(result.epsS, 4)}
        </text>
      </g>
      <text x={ox + w + 8} y={oy + a + 4} fontSize="10" fill="var(--danger)">
        a={formatNumber(result.a, 1)} mm
      </text>
      <text x={ox + w + 8} y={oy + c + 4} fontSize="10" fill="var(--secondary)">
        c={formatNumber(result.c, 1)} mm
      </text>
    </svg>
  );
}
