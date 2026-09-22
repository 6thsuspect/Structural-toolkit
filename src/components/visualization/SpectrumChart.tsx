import { useMemo, useState } from "react";
import type { SpectrumResult } from "@/types";
import { formatNumber } from "@/lib/format";

interface Props {
  result: SpectrumResult;
}

export function SpectrumChart({ result }: Props) {
  const width = 720;
  const height = 420;
  const pad = { l: 58, r: 24, t: 28, b: 48 };
  const [hover, setHover] = useState<{ t: number; sa: number; x: number; y: number } | null>(null);

  const { points, maxSa } = useMemo(() => {
    const maxSaValue = Math.max(...result.accelerations, 0.1);
    const innerW = width - pad.l - pad.r;
    const innerH = height - pad.t - pad.b;
    const pts = result.periods.map((t, i) => {
      const sa = result.accelerations[i] ?? 0;
      return {
        t,
        sa,
        x: pad.l + (t / 8) * innerW,
        y: pad.t + (1 - sa / maxSaValue) * innerH,
      };
    });
    return { points: pts, maxSa: maxSaValue };
  }, [pad.b, pad.l, pad.r, pad.t, result.accelerations, result.periods]);

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  const xTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const yTicks = 5;

  const onMove = (clientX: number, svg: SVGSVGElement) => {
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * width;
    const t = Math.min(8, Math.max(0, ((x - pad.l) / (width - pad.l - pad.r)) * 8));
    let best = points[0];
    let bestDist = Number.POSITIVE_INFINITY;
    for (const p of points) {
      const d = Math.abs(p.t - t);
      if (d < bestDist) {
        best = p;
        bestDist = d;
      }
    }
    if (best) setHover(best);
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      role="img"
      aria-label="Design response spectrum chart"
      onMouseMove={(event) => onMove(event.clientX, event.currentTarget)}
      onMouseLeave={() => setHover(null)}
    >
      <rect width={width} height={height} fill="var(--panel)" rx="8" />
      {Array.from({ length: yTicks + 1 }, (_, i) => {
        const y = pad.t + ((height - pad.t - pad.b) * i) / yTicks;
        const value = maxSa * (1 - i / yTicks);
        return (
          <g key={i}>
            <line x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 4" />
            <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--muted)">
              {formatNumber(value, 2)}
            </text>
          </g>
        );
      })}
      {xTicks.map((t) => {
        const x = pad.l + (t / 8) * (width - pad.l - pad.r);
        return (
          <g key={t}>
            <line x1={x} x2={x} y1={pad.t} y2={height - pad.b} stroke="var(--border)" strokeDasharray="3 4" />
            <text x={x} y={height - pad.b + 18} textAnchor="middle" fontSize="11" fill="var(--muted)">
              {t}
            </text>
          </g>
        );
      })}
      <path d={path} fill="none" stroke="var(--primary)" strokeWidth="2.5" />
      {points.filter((p) => p.t === result.t0 || p.t === result.ts).map((p) => (
        <g key={`${p.t}-${p.sa}`}>
          <circle cx={p.x} cy={p.y} r="4" fill="var(--accent)" />
        </g>
      ))}
      <text x={width / 2} y={height - 8} textAnchor="middle" fontSize="12" fill="var(--muted)">
        Natural period T (s)
      </text>
      <text x={16} y={height / 2} textAnchor="middle" fontSize="12" fill="var(--muted)" transform={`rotate(-90 16 ${height / 2})`}>
        Spectral acceleration Sa (g)
      </text>
      {hover ? (
        <g>
          <line x1={hover.x} x2={hover.x} y1={pad.t} y2={height - pad.b} stroke="var(--accent)" strokeDasharray="4 4" />
          <circle cx={hover.x} cy={hover.y} r="5" fill="var(--accent)" />
          <rect x={hover.x + 8} y={hover.y - 28} width="118" height="36" rx="6" fill="var(--background)" stroke="var(--border)" />
          <text x={hover.x + 16} y={hover.y - 12} fontSize="11" fill="var(--foreground)">
            T={formatNumber(hover.t, 2)} s
          </text>
          <text x={hover.x + 16} y={hover.y + 2} fontSize="11" fill="var(--foreground)">
            Sa={formatNumber(hover.sa, 3)} g
          </text>
        </g>
      ) : null}
    </svg>
  );
}
