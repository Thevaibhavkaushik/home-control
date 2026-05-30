import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Thermometer, Droplets, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { DEVICES, AMBIENT_KEYS } from "@/lib/devices-config";
import { DeviceCard } from "@/components/DeviceCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { useSensorPolling } from "@/lib/sensors";

export const Route = createFileRoute("/living-room")({
  head: () => ({ meta: [{ title: "Living Room — Smart Home" }] }),
  component: LivingRoom,
});

function LivingRoom() {
  useSensorPolling();
  const { states, temperature, humidity, allOn, allOff, ambient } = useStore();
  const ambientOn = AMBIENT_KEYS.every((k) => states[k]);
  const anyOn = Object.values(states).some(Boolean);
  const allDevicesOn = DEVICES.every((d) => states[d.key]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-surface">
      <div className="bg-background px-6 pt-12 pb-10 text-foreground">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/55">
            Room
          </div>
          <ThemeToggle tone="dark" />
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight">Living Room</h1>
        <p className="mt-1.5 text-sm text-foreground/55">{DEVICES.length} devices · Online</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <StatTile icon={<Thermometer className="h-4 w-4" />} label="Temperature"
            value={temperature !== null ? `${temperature.toFixed(1)}°C` : "—"} />
          <StatTile icon={<Droplets className="h-4 w-4" />} label="Humidity"
            value={humidity !== null ? `${Math.round(humidity)}%` : "—"} />
        </div>
      </div>

      <div className="-mt-5 rounded-t-[32px] bg-surface px-5 pt-6 pb-8">
        <div className="mb-5 grid grid-cols-3 gap-2.5">
          <button
            onClick={() => allOn()}
            disabled={allDevicesOn}
            className="rounded-2xl bg-primary px-3 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-[0.98] disabled:opacity-50"
          >
            All On
          </button>
          <button
            onClick={() => allOff()}
            disabled={!anyOn}
            className="rounded-2xl bg-card px-3 py-3.5 text-sm font-semibold text-card-foreground shadow-[var(--shadow-card)] transition active:scale-[0.98] disabled:opacity-50"
          >
            All Off
          </button>
          <button
            onClick={() => ambient(!ambientOn)}
            className={`flex items-center justify-center gap-1.5 rounded-2xl px-2 py-3.5 text-sm font-semibold shadow-[var(--shadow-card)] transition active:scale-[0.98] ${
              ambientOn ? "bg-primary/15 text-primary" : "bg-card text-card-foreground"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Ambient
          </button>
        </div>

        <h2 className="mb-3 text-lg font-semibold text-surface-foreground">All Devices</h2>
        <div className="grid grid-cols-2 gap-3.5">
          {DEVICES.map((d) => <DeviceCard key={d.key} device={d} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/8 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-foreground/55">
        {icon} {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
