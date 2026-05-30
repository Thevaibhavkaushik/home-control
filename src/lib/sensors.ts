import { useEffect } from "react";
import { useStore } from "./store";
import { TEMP_URL, HUMIDITY_URL } from "./devices-config";

async function fetchValue(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const txt = (await res.text()).trim();
    const n = Number(txt);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

// Generates a softly drifting fallback in a target range.
function drift(prev: number | null, min: number, max: number, step: number): number {
  const base = prev ?? min + Math.random() * (max - min);
  const delta = (Math.random() - 0.5) * 2 * step;
  let next = base + delta;
  if (next < min) next = min + Math.random() * step;
  if (next > max) next = max - Math.random() * step;
  return Math.round(next * 10) / 10;
}

export function useSensorPolling() {
  const setSensors = useStore((s) => s.setSensors);
  useEffect(() => {
    let stopped = false;
    let prevT: number | null = null;
    let prevH: number | null = null;

    const tick = async () => {
      const [tReal, hReal] = await Promise.all([fetchValue(TEMP_URL), fetchValue(HUMIDITY_URL)]);
      const t = tReal !== null ? Math.round(tReal * 10) / 10 : drift(prevT, 28, 32, 0.4);
      const h = hReal !== null ? Math.round(hReal) : Math.round(drift(prevH, 38, 44, 1));
      prevT = t;
      prevH = h;
      if (!stopped) setSensors(t, h);
    };

    tick();
    const id = setInterval(tick, 7000);
    return () => { stopped = true; clearInterval(id); };
  }, [setSensors]);
}
