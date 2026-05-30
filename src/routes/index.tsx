import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Maximize2, Volume2, ArrowUpRight, Thermometer, Settings as SettingsIcon } from "lucide-react";
import livingImg from "@/assets/living-room.jpg";
import { useStore } from "@/lib/store";
import { DEVICES, HOME_TOP_KEYS, AMBIENT_KEYS } from "@/lib/devices-config";
import { DeviceCard } from "@/components/DeviceCard";
import { Toggle } from "@/components/Toggle";
import { NamePrompt } from "@/components/NamePrompt";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { createFileRoute } from "@tanstack/react-router";
import { useSensorPolling } from "@/lib/sensors";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Home" },
      { name: "description", content: "Monitor and control your home." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  useSensorPolling();
  const [roomIdx, setRoomIdx] = useState(0); // 0 = living, 1 = master bedroom
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-surface">
      <NamePrompt />
      <DarkHero index={roomIdx} onChange={setRoomIdx} />

      <div className="relative -mt-6 rounded-t-[36px] bg-surface px-5 pt-6 pb-8 shadow-[0_-20px_40px_-20px_oklch(0_0_0_/_0.15)]">
        <LivingRoomPanel />
      </div>
      <Footer />
    </div>
  );
}

function DarkHero({ index, onChange }: { index: number; onChange: (i: number) => void }) {
  const { name, temperature } = useStore();
  return (
    <div className="relative bg-background px-6 pt-12 pb-12 text-foreground">
      <div className="flex items-center justify-between">
        <Link to="/settings" className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-foreground/60">
          <SettingsIcon className="h-4 w-4" /> Settings
        </Link>
        <ThemeToggle tone="dark" />
      </div>

      <h1 className="mt-8 text-5xl font-semibold tracking-tight">
        Hi, {name ?? "there"}
      </h1>
      <p className="mt-2 text-base text-foreground/55">
        Monitor and control your home
      </p>

      {/* Swipeable room hero */}
      <div className="mt-7 overflow-hidden rounded-3xl">
        <motion.div
          className="flex"
          animate={{ x: `-${index * 100}%` }}
          transition={{ type: "spring", stiffness: 260, damping: 32 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 && index < 1) onChange(index + 1);
            else if (info.offset.x > 60 && index > 0) onChange(index - 1);
          }}
        >
          <div className="w-full shrink-0">
            <LivingRoomHero temperature={temperature} />
          </div>
          <div className="w-full shrink-0">
            <MasterBedroomHero />
          </div>
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-1.5 bg-white/25"}`}
            aria-label={`Room ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function LivingRoomHero({ temperature }: { temperature: number | null }) {
  return (
    <Link to="/living-room" className="block">
      <div className="relative overflow-hidden rounded-3xl">
        <img src={livingImg} alt="Living room" className="h-56 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />

        <div className="absolute left-3 top-3 glass-chip flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-white">
          <Thermometer className="h-3.5 w-3.5" />
          {temperature !== null ? `${Math.round(temperature)}°C` : "—°C"}
        </div>

        <div className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white backdrop-blur">
          <ArrowUpRight className="h-4 w-4" />
        </div>

        <div className="absolute bottom-3 left-4 text-2xl font-semibold text-white">
          Living Room
        </div>
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur">
            <Maximize2 className="h-4 w-4" />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur">
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}

function MasterBedroomHero() {
  return (
    <div className="relative h-56 overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.26_0.02_270)] via-[oklch(0.20_0.015_280)] to-[oklch(0.16_0.01_290)] px-5 py-5 text-white">
      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-white/50" /> Offline
      </div>
      <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">Room</div>
      <div className="text-2xl font-semibold">Master Bedroom</div>
      <div className="mt-6 text-sm text-white/65">Module offline</div>
      <div className="mt-1 text-sm text-white/80">Integration Coming Soon</div>
      <div className="absolute -bottom-8 -right-6 text-8xl opacity-15">🛏️</div>
    </div>
  );
}

function LivingRoomPanel() {
  const { states, allOn, allOff, ambient } = useStore();
  const topDevices = DEVICES.filter((d) => HOME_TOP_KEYS.includes(d.key));
  const anyOn = Object.values(states).some(Boolean);
  const ambientOn = AMBIENT_KEYS.every((k) => states[k]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="living"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-4 flex items-center justify-between px-1">
          <h2 className="text-xl font-semibold text-surface-foreground">Top Devices</h2>
          <Link to="/living-room" className="text-xs font-medium text-primary">
            View all →
          </Link>
        </div>

        <div className="mb-4 flex gap-2.5">
          <button
            onClick={() => allOff()}
            disabled={!anyOn}
            className="flex-1 rounded-2xl bg-card px-4 py-3.5 text-sm font-semibold text-card-foreground shadow-[var(--shadow-card)] transition active:scale-[0.98] disabled:opacity-50"
          >
            All Off
          </button>
          <div className="flex flex-1 items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-[var(--shadow-card)]">
            <span className="text-sm font-semibold text-card-foreground">Ambient</span>
            <Toggle on={ambientOn} onChange={(v) => ambient(v)} size="sm" />
          </div>
        </div>

        <button
          onClick={() => allOn()}
          className="mb-4 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-[0.98]"
        >
          All On
        </button>

        <div className="grid grid-cols-2 gap-3.5">
          {topDevices.map((d) => <DeviceCard key={d.key} device={d} />)}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
