import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { haptic } from "@/lib/device-id";

export function NamePrompt() {
  const { name, loaded, setName } = useStore();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loaded && !name) setOpen(true);
  }, [loaded, name]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="w-full max-w-sm rounded-3xl bg-surface p-7 shadow-2xl"
        >
          <div className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80" style={{color: "oklch(0.45 0.01 80)"}}>
            Welcome
          </div>
          <h2 className="mb-1 text-3xl font-semibold tracking-tight text-surface-foreground">
            What's your name?
          </h2>
          <p className="mb-6 text-sm text-surface-foreground/60">
            We'll use it to personalize your home.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const v = value.trim();
              if (!v) return;
              haptic(22);
              await setName(v);
              setOpen(false);
            }}
          >
            <input
              autoFocus
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your first name"
              className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 text-base text-surface-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!value.trim()}
              className="mt-4 w-full rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-[0.98] disabled:opacity-40"
            >
              Continue
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
