import { motion } from "framer-motion";
import { DeviceMeta } from "@/lib/devices-config";
import { useStore } from "@/lib/store";
import { Toggle } from "./Toggle";

export function DeviceCard({ device }: { device: DeviceMeta }) {
  const on = useStore((s) => s.states[device.key] ?? false);
  const toggle = useStore((s) => s.toggle);

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="relative overflow-hidden rounded-3xl bg-card p-4 shadow-[var(--shadow-card)] aspect-[1/1.05] flex flex-col"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-card-foreground/45">
            Device
          </div>
          <div className="mt-1 text-[15px] font-semibold leading-tight text-card-foreground">
            {device.name}
          </div>
        </div>
        <span
          className={`h-2.5 w-2.5 rounded-full transition-colors ${on ? "bg-primary" : "bg-black/15"}`}
        />
      </div>

      <div className="relative flex-1">
        <img
          src={device.image}
          alt={device.name}
          loading="lazy"
          className={`absolute inset-0 m-auto h-full w-full object-contain transition-all duration-500 ${
            on ? "scale-105 brightness-110 drop-shadow-[0_8px_24px_oklch(0.7_0.16_45_/_0.35)]" : "scale-100 opacity-90"
          }`}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs font-medium ${on ? "text-primary" : "text-card-foreground/40"}`}>
          {on ? "On" : "Off"}
        </span>
        <Toggle on={on} onChange={(v) => toggle(device.key, v)} size="sm" />
      </div>
    </motion.div>
  );
}
