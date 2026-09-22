import {
  type ReactNode,
  type WheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface Props {
  children: ReactNode;
  className?: string;
  minScale?: number;
  maxScale?: number;
  ariaLabel: string;
}

export function SvgViewport({ children, className = "", minScale = 0.4, maxScale = 6, ariaLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [panning, setPanning] = useState(false);
  const origin = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const space = useRef(false);

  const reset = useCallback(() => {
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.code === "Space") space.current = true;
    };
    const up = (event: KeyboardEvent) => {
      if (event.code === "Space") space.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const cx = event.clientX - rect.left;
    const cy = event.clientY - rect.top;
    const factor = event.deltaY < 0 ? 1.08 : 0.92;
    const next = Math.min(maxScale, Math.max(minScale, scale * factor));
    const k = next / scale;
    setTx(cx - k * (cx - tx));
    setTy(cy - k * (cy - ty));
    setScale(next);
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-lg border border-border bg-background ${className}`}
      aria-label={ariaLabel}
      onWheel={onWheel}
      onPointerDown={(event) => {
        if (event.button === 1 || (event.button === 0 && space.current)) {
          event.preventDefault();
          setPanning(true);
          origin.current = { x: event.clientX, y: event.clientY, tx, ty };
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      }}
      onPointerMove={(event) => {
        if (!panning) return;
        setTx(origin.current.tx + (event.clientX - origin.current.x));
        setTy(origin.current.ty + (event.clientY - origin.current.y));
      }}
      onPointerUp={() => setPanning(false)}
    >
      <div className="h-full w-full origin-top-left" style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}>
        {children}
      </div>
      <div className="absolute bottom-2 right-2 flex gap-1">
        <button type="button" className="rounded bg-panel/90 px-2 py-1 text-xs" onClick={() => setScale((s) => Math.min(maxScale, s * 1.15))} aria-label="Zoom in">+</button>
        <button type="button" className="rounded bg-panel/90 px-2 py-1 text-xs" onClick={() => setScale((s) => Math.max(minScale, s / 1.15))} aria-label="Zoom out">−</button>
        <button type="button" className="rounded bg-panel/90 px-2 py-1 text-xs" onClick={reset} aria-label="Reset view">Fit</button>
      </div>
    </div>
  );
}
