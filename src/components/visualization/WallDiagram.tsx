interface Props {
  H: number;
  xLoad: number;
  width?: number;
  kind: "point" | "strip";
}

export function WallDiagram({ H, xLoad, width = 1, kind }: Props) {
  const wallX = 80;
  const top = 36;
  const wallH = 240;
  const scale = 180 / Math.max(xLoad + (kind === "strip" ? width : 0), 3);
  return (
    <svg viewBox="0 0 420 320" className="h-full w-full" role="img" aria-label="Retaining wall and surcharge schematic">
      <rect width="420" height="320" fill="var(--panel)" rx="8" />
      <text x="16" y="22" fontSize="13" fontWeight="600" fill="var(--foreground)">
        Wall geometry
      </text>
      <rect x={wallX - 18} y={top} width="18" height={wallH} fill="#64748b" />
      <line x1={wallX} x2="380" y1={top} y2={top} stroke="var(--border)" />
      <rect x={wallX} y={top} width="300" height={wallH} fill="rgba(13,148,136,0.08)" />
      {kind === "point" ? (
        <g>
          <line x1={wallX + xLoad * scale} x2={wallX + xLoad * scale} y1={top - 28} y2={top} stroke="var(--accent)" strokeWidth="2" />
          <polygon points={`${wallX + xLoad * scale},${top} ${wallX + xLoad * scale - 6},${top - 10} ${wallX + xLoad * scale + 6},${top - 10}`} fill="var(--accent)" />
          <text x={wallX + xLoad * scale} y={top - 32} textAnchor="middle" fontSize="11" fill="var(--accent)">
            Q
          </text>
        </g>
      ) : (
        <g>
          <rect x={wallX + xLoad * scale} y={top - 14} width={width * scale} height="14" fill="var(--accent)" opacity="0.85" />
          <text x={wallX + xLoad * scale + (width * scale) / 2} y={top - 20} textAnchor="middle" fontSize="11" fill="var(--accent)">
            q
          </text>
        </g>
      )}
      <text x={wallX - 28} y={top + wallH / 2} fontSize="11" fill="var(--muted)">
        H={H} m
      </text>
      <text x={wallX + (xLoad * scale) / 2} y={top + 16} textAnchor="middle" fontSize="11" fill="var(--muted)">
        x={xLoad} m
      </text>
      <text x="200" y="300" fontSize="11" fill="var(--muted)">
        Soil mass in front of a vertical retaining wall
      </text>
    </svg>
  );
}
