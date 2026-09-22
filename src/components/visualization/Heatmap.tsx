import { useMemo, useState } from "react";
import type { HeatmapGrid } from "@/types";
import { formatNumber } from "@/lib/format";

interface Props {
  grid: HeatmapGrid;
  title: string;
  unit?: string;
}

function colorFor(t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const stops = [
    [15, 23, 42],
    [12, 74, 110],
    [13, 148, 136],
    [250, 204, 21],
    [239, 68, 68],
  ];
  const scaled = clamped * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(scaled));
  const f = scaled - i;
  const a = stops[i] ?? stops[0]!;
  const b = stops[i + 1] ?? stops[stops.length - 1]!;
  const rgb = a.map((v, idx) => Math.round(v + ((b[idx] ?? v) - v) * f));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function Heatmap({ grid, title, unit = "" }: Props) {
  const width = 640;
  const height = 420;
  const pad = { l: 52, r: 78, t: 28, b: 42 };
  const [hover, setHover] = useState<{ x: number; y: number; z: number; px: number; py: number } | null>(null);

  const cells = useMemo(() => {
    const innerW = width - pad.l - pad.r;
    const innerH = height - pad.t - pad.b;
    const nx = grid.x.length;
    const ny = grid.y.length;
    const cw = innerW / Math.max(nx, 1);
    const ch = innerH / Math.max(ny, 1);
    const range = grid.max - grid.min || 1;
    const rects = [];
    for (let r = 0; r < ny; r += 1) {
      for (let c = 0; c < nx; c += 1) {
        const z = grid.z[r]?.[c] ?? 0;
        rects.push({
          key: `${r}-${c}`,
          x: pad.l + c * cw,
          y: pad.t + r * ch,
          w: cw + 0.4,
          h: ch + 0.4,
          fill: colorFor((z - grid.min) / range),
          vx: grid.x[c] ?? 0,
          vy: grid.y[r] ?? 0,
          z,
        });
      }
    }
    return { rects };
  }, [grid.max, grid.min, grid.x, grid.y, grid.z, pad.b, pad.l, pad.r, pad.t]);

  const legend = Array.from({ length: 24 }, (_, i) => colorFor(i / 23));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label={title}>
      <rect width={width} height={height} fill="var(--panel)" rx="8" />
      <text x={pad.l} y={18} fontSize="13" fill="var(--foreground)" fontWeight="600">
        {title}
      </text>
      {cells.rects.map((cell) => (
        <rect
          key={cell.key}
          x={cell.x}
          y={cell.y}
          width={cell.w}
          height={cell.h}
          fill={cell.fill}
          onMouseEnter={() => setHover({ x: cell.vx, y: cell.vy, z: cell.z, px: cell.x, py: cell.y })}
          onMouseLeave={() => setHover(null)}
        />
      ))}
      <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="11" fill="var(--muted)">
        Distance along wall (m)
      </text>
      <text x={16} y={height / 2} textAnchor="middle" fontSize="11" fill="var(--muted)" transform={`rotate(-90 16 ${height / 2})`}>
        Depth (m)
      </text>
      {legend.map((color, i) => (
        <rect key={color + i} x={width - 58} y={pad.t + i * 12} width="12" height="12" fill={color} />
      ))}
      <text x={width - 42} y={pad.t + 8} fontSize="10" fill="var(--muted)">
        {formatNumber(grid.max, 2)} {unit}
      </text>
      <text x={width - 42} y={pad.t + 24 * 12} fontSize="10" fill="var(--muted)">
        {formatNumber(grid.min, 2)}
      </text>
      {hover ? (
        <g>
          <rect x={hover.px + 12} y={hover.py + 8} width="150" height="48" rx="6" fill="var(--background)" stroke="var(--border)" />
          <text x={hover.px + 20} y={hover.py + 26} fontSize="11" fill="var(--foreground)">
            x={formatNumber(hover.x, 2)} m, z={formatNumber(hover.y, 2)} m
          </text>
          <text x={hover.px + 20} y={hover.py + 42} fontSize="11" fill="var(--foreground)">
            σh = {formatNumber(hover.z, 3)} {unit}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
