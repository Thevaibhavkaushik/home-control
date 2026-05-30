import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Check, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { haptic } from "@/lib/device-id";
import { Toggle } from "@/components/Toggle";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Smart Home" }] }),
  component: Settings,
});

function Settings() {
  const { name, setName, theme, setTheme } = useStore();
  const [value, setValue] = useState(name ?? "");
  const [saved, setSaved] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => { setValue(name ?? ""); }, [name]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-surface">
      <div className="bg-background px-6 pt-12 pb-10 text-foreground">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/55">
            Account
          </div>
          <div className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1.5 text-sm text-foreground/55">Personalize your experience</p>
      </div>

      <div className="-mt-5 rounded-t-[32px] bg-surface px-5 pt-6">
        <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
          <label className="text-xs font-medium uppercase tracking-[0.14em] text-card-foreground/50">
            Your name
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setSaved(false); }}
            placeholder="Enter your first name"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-base text-card-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
          <button
            onClick={async () => {
              const v = value.trim();
              if (!v) return;
              haptic(22);
              await setName(v);
              setSaved(true);
              setTimeout(() => setSaved(false), 1800);
            }}
            disabled={!value.trim() || value.trim() === name}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-[0.98] disabled:opacity-40"
          >
            {saved ? <><Check className="h-4 w-4" /> Saved</> : "Save"}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </div>
            <div>
              <div className="text-sm font-semibold text-card-foreground">Dark Mode</div>
              <div className="text-xs text-card-foreground/55">{isDark ? "On" : "Off"}</div>
            </div>
          </div>
          <Toggle on={isDark} onChange={(v) => { haptic(18); setTheme(v ? "dark" : "light"); }} size="sm" />
        </div>

        <div className="mt-4 rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="text-sm font-semibold text-card-foreground">About</div>
          <p className="mt-1 text-sm text-card-foreground/60">
            Your name is saved on this device. It stays the same until you change it here or switch to a different device.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
