import { haptic } from "@/lib/device-id";

export function Toggle({ on, onChange, size = "md" }: { on: boolean; onChange: (v: boolean) => void; size?: "sm" | "md" }) {
  const w = size === "sm" ? "w-11 h-6" : "w-14 h-8";
  const dot = size === "sm" ? "w-5 h-5" : "w-7 h-7";
  const tx = size === "sm" ? (on ? "translate-x-5" : "translate-x-0.5") : (on ? "translate-x-6" : "translate-x-0.5");
  return (
    <button
      type="button"
      onClick={() => { haptic(on ? 12 : 24); onChange(!on); }}
      className={`relative ${w} rounded-full transition-colors duration-300 ${on ? "bg-primary shadow-[var(--shadow-glow)]" : "bg-black/15"}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 ${dot} rounded-full bg-white shadow-md transition-transform duration-300 ${tx}`}
      />
    </button>
  );
}
