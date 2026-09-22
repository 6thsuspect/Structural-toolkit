import type { SlabInput, SlabResult } from "@/types";
import { SLAB_CASES } from "@/lib/slab";
import { formatNumber } from "@/lib/format";

interface Props {
  input: SlabInput;
  result: SlabResult;
}

const EDGE_COLOR = {
  fixed: "#0f766e",
  simple: "#d97706",
  free: "#94a3b8",
};

export function SlabDiagram({ input, result }: Props) {
  const edges = SLAB_CASES.find((item) => item.id === input.slabType)?.edges ?? SLAB_CASES[0]!.edges;
  const max = Math.max(input.lx, input.ly, 1);
  const s = 220 / max;
  const w = input.lx * s;
  const h = input.ly * s;
  const ox = 70;
  const oy = 50;

  return (
    <svg viewBox="0 0 520 360" className="h-full w-full" role="img" aria-label="Two-way slab plan with edge conditions">
      <rect width="520" height="360" fill="var(--panel)" rx="8" />
      <text x="16" y="24" fontSize="13" fontWeight="600" fill="var(--foreground)">
        Slab plan · ly/lx = {formatNumber(result.ratio || input.ly / input.lx, 2)}
      </text>
      <rect x={ox} y={oy} width={w} height={h} fill="rgba(15,118,110,0.08)" stroke="var(--foreground)" />
      <line x1={ox} x2={ox + w} y1={oy} y2={oy} stroke={EDGE_COLOR[edges.top]} strokeWidth={edges.top === "fixed" ? 8 : 3} strokeDasharray={edges.top === "free" ? "8 6" : undefined} />
      <line x1={ox + w} x2={ox + w} y1={oy} y2={oy + h} stroke={EDGE_COLOR[edges.right]} strokeWidth={edges.right === "fixed" ? 8 : 3} strokeDasharray={edges.right === "free" ? "8 6" : undefined} />
      <line x1={ox} x2={ox + w} y1={oy + h} y2={oy + h} stroke={EDGE_COLOR[edges.bottom]} strokeWidth={edges.bottom === "fixed" ? 8 : 3} strokeDasharray={edges.bottom === "free" ? "8 6" : undefined} />
      <line x1={ox} x2={ox} y1={oy} y2={oy + h} stroke={EDGE_COLOR[edges.left]} strokeWidth={edges.left === "fixed" ? 8 : 3} strokeDasharray={edges.left === "free" ? "8 6" : undefined} />
      <text x={ox + w / 2} y={oy + h + 22} textAnchor="middle" fontSize="11" fill="var(--muted)">
        lx = {input.lx} m
      </text>
      <text x={ox - 16} y={oy + h / 2} textAnchor="end" fontSize="11" fill="var(--muted)">
        ly
      </text>
      <g fontSize="11" fill="var(--foreground)">
        <text x={ox + 12} y={oy + h / 2}>Mlx {formatNumber(result.Mlx / 1e6, 2)} kNm</text>
        <text x={ox + w / 2 - 40} y={oy + 28}>Mly {formatNumber(result.Mly / 1e6, 2)} kNm</text>
        {result.Mtx > 0 ? <text x={ox + 12} y={oy + 28}>Mtx {formatNumber(result.Mtx / 1e6, 2)}</text> : null}
        {result.Mty > 0 ? <text x={ox + 12} y={oy + h - 16}>Mty {formatNumber(result.Mty / 1e6, 2)}</text> : null}
      </g>
      <g transform="translate(340, 70)" fontSize="11" fill="var(--muted)">
        <line x1="0" x2="28" y1="0" y2="0" stroke={EDGE_COLOR.fixed} strokeWidth="8" />
        <text x="36" y="4">Fixed</text>
        <line x1="0" x2="28" y1="22" y2="22" stroke={EDGE_COLOR.simple} strokeWidth="3" />
        <text x="36" y="26">Simple</text>
        <line x1="0" x2="28" y1="44" y2="44" stroke={EDGE_COLOR.free} strokeWidth="3" strokeDasharray="8 6" />
        <text x="36" y="48">Free</text>
      </g>
    </svg>
  );
}
