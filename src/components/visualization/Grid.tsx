interface Props {
  width: number;
  height: number;
  step?: number;
  majorEvery?: number;
}

export function Grid({ width, height, step = 20, majorEvery = 5 }: Props) {
  const lines = [];
  for (let x = 0; x <= width; x += step) {
    const major = (x / step) % majorEvery === 0;
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="var(--border)"
        strokeWidth={major ? 1 : 0.4}
      />,
    );
  }
  for (let y = 0; y <= height; y += step) {
    const major = (y / step) % majorEvery === 0;
    lines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="var(--border)"
        strokeWidth={major ? 1 : 0.4}
      />,
    );
  }
  return <g aria-hidden="true">{lines}</g>;
}
