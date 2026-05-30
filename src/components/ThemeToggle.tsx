import { Sun, Moon } from "lucide-react";
import { useStore } from "@/lib/store";
import { haptic } from "@/lib/device-id";

export function ThemeToggle({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const theme = useStore((s) => s.theme);
  const toggle = useStore((s) => s.toggleTheme);
  const isDark = theme === "dark";
  const baseBg = tone === "dark" ? "bg-white/10 text-white" : "bg-black/5 text-surface-foreground";
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => { haptic(16); toggle(); }}
      className={`relative grid h-10 w-10 place-items-center rounded-full backdrop-blur transition active:scale-95 ${baseBg}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
