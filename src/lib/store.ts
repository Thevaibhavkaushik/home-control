import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "./device-id";
import {
  DEVICES, DeviceKey, fireControl, fireBatch,
  ALL_ON_URLS, ALL_OFF_URLS, AMBIENT_ON_URLS,
  ALL_ON_STATE, ALL_OFF_STATE, AMBIENT_ON_STATE,
} from "./devices-config";

type StatesMap = Partial<Record<DeviceKey, boolean>>;
type Theme = "light" | "dark";

interface SmartHomeState {
  name: string | null;
  loaded: boolean;
  states: StatesMap;
  temperature: number | null;
  humidity: number | null;
  theme: Theme;

  init: () => Promise<void>;
  setName: (name: string) => Promise<void>;
  toggle: (key: DeviceKey, next?: boolean) => Promise<void>;
  allOn: () => Promise<void>;
  allOff: () => Promise<void>;
  ambient: (on: boolean) => Promise<void>;
  setSensors: (t: number | null, h: number | null) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const THEME_KEY = "smart_home_theme";

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
}

function persistStates(did: string, entries: Array<[DeviceKey, boolean]>) {
  return supabase.from("device_states").upsert(
    entries.map(([device_key, is_on]) => ({
      device_id: did, device_key, is_on, updated_at: new Date().toISOString(),
    }))
  );
}

export const useStore = create<SmartHomeState>((set, get) => ({
  name: null,
  loaded: false,
  states: {},
  temperature: null,
  humidity: null,
  theme: "light",

  init: async () => {
    const did = getDeviceId();
    const stored = (typeof localStorage !== "undefined" && (localStorage.getItem(THEME_KEY) as Theme)) || "light";
    applyTheme(stored);
    const [profile, states] = await Promise.all([
      supabase.from("device_profiles").select("name").eq("device_id", did).maybeSingle(),
      supabase.from("device_states").select("device_key, is_on").eq("device_id", did),
    ]);
    const map: StatesMap = {};
    (states.data ?? []).forEach((r: any) => { map[r.device_key as DeviceKey] = r.is_on; });
    set({ name: profile.data?.name ?? null, states: map, loaded: true, theme: stored });
  },

  setName: async (name: string) => {
    const did = getDeviceId();
    set({ name });
    await supabase.from("device_profiles").upsert({ device_id: did, name, updated_at: new Date().toISOString() });
  },

  toggle: async (key, next) => {
    const did = getDeviceId();
    const current = get().states[key] ?? false;
    const value = next ?? !current;
    set({ states: { ...get().states, [key]: value } });
    const meta = DEVICES.find((d) => d.key === key);
    if (meta) fireControl(value ? meta.onUrl : meta.offUrl);
    await supabase.from("device_states").upsert({
      device_id: did, device_key: key, is_on: value, updated_at: new Date().toISOString(),
    });
  },

  allOn: async () => {
    const did = getDeviceId();
    const map: StatesMap = {};
    ALL_ON_STATE.forEach(([k, v]) => (map[k] = v));
    set({ states: map });
    fireBatch(ALL_ON_URLS);
    await persistStates(did, ALL_ON_STATE);
  },

  allOff: async () => {
    const did = getDeviceId();
    set({ states: {} });
    fireBatch(ALL_OFF_URLS);
    await persistStates(did, ALL_OFF_STATE);
  },

  ambient: async (on: boolean) => {
    const did = getDeviceId();
    if (on) {
      const map: StatesMap = {};
      AMBIENT_ON_STATE.forEach(([k, v]) => (map[k] = v));
      set({ states: map });
      fireBatch(AMBIENT_ON_URLS);
      await persistStates(did, AMBIENT_ON_STATE);
    } else {
      set({ states: {} });
      fireBatch(ALL_OFF_URLS);
      await persistStates(did, ALL_OFF_STATE);
    }
  },

  setSensors: (t, h) => set({ temperature: t, humidity: h }),

  setTheme: (t) => {
    if (typeof localStorage !== "undefined") localStorage.setItem(THEME_KEY, t);
    applyTheme(t);
    set({ theme: t });
  },
  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
}));
