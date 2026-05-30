import fanImg from "@/assets/fan.png";
import wallImg from "@/assets/wall-light.png";
import chandelierImg from "@/assets/chandelier.png";
import spotImg from "@/assets/spot-light.png";
import battenImg from "@/assets/batten-light.png";
import outdoorImg from "@/assets/outdoor-light.png";

export type DeviceKey =
  | "fan_1" | "fan_2"
  | "wall_light_1" | "wall_light_2" | "wall_light_3" | "wall_light_4"
  | "chandelier"
  | "spot_3in1"
  | "led_batten_1" | "led_batten_2"
  | "outdoor_light_1" | "outdoor_light_2";

export type DeviceMeta = {
  key: DeviceKey;
  name: string;
  image: string;
  onUrl: string;
  offUrl: string;
};

const T1 = "6VYwGPax1bLWu_egEwrSib_aiJhj09h3";
const T2 = "SXubUYNczibNfQBmjZa8KpUVnZT2MR3P";
const BASE = "https://blr1.blynk.cloud/external/api";

const u = (token: string, pin: string, val: 0 | 1) =>
  `${BASE}/update?token=${token}&${pin}=${val}`;

export const DEVICES: DeviceMeta[] = [
  { key: "fan_1",           name: "Fan 1",           image: fanImg,        onUrl: u(T1, "v1", 1), offUrl: u(T1, "v1", 0) },
  { key: "fan_2",           name: "Fan 2",           image: fanImg,        onUrl: u(T2, "v0", 1), offUrl: u(T2, "v0", 0) },
  { key: "wall_light_1",    name: "Wall Light 1",    image: wallImg,       onUrl: u(T1, "v2", 1), offUrl: u(T1, "v2", 0) },
  { key: "wall_light_2",    name: "Wall Light 2",    image: wallImg,       onUrl: u(T1, "v3", 1), offUrl: u(T1, "v3", 0) },
  { key: "wall_light_3",    name: "Wall Light 3",    image: wallImg,       onUrl: u(T2, "v1", 1), offUrl: u(T2, "v1", 0) },
  { key: "wall_light_4",    name: "Wall Light 4",    image: wallImg,       onUrl: u(T2, "v2", 1), offUrl: u(T2, "v2", 0) },
  { key: "chandelier",      name: "Chandelier",      image: chandelierImg, onUrl: u(T2, "v4", 1), offUrl: u(T2, "v4", 0) },
  { key: "spot_3in1",       name: "3-in-1 Light",    image: spotImg,       onUrl: u(T1, "v4", 1), offUrl: u(T1, "v4", 0) },
  { key: "led_batten_1",    name: "LED Batten 1",    image: battenImg,     onUrl: u(T1, "v0", 1), offUrl: u(T1, "v0", 0) },
  { key: "led_batten_2",    name: "LED Batten 2",    image: battenImg,     onUrl: u(T2, "v3", 1), offUrl: u(T2, "v3", 0) },
  { key: "outdoor_light_1", name: "Outdoor Light 1", image: outdoorImg,    onUrl: u(T2, "v5", 1), offUrl: u(T2, "v5", 0) },
  { key: "outdoor_light_2", name: "Outdoor Light 2", image: outdoorImg,    onUrl: u(T2, "v6", 1), offUrl: u(T2, "v6", 0) },
];

export const HOME_TOP_KEYS: DeviceKey[] = ["fan_1", "fan_2", "wall_light_1", "chandelier"];

export const AMBIENT_KEYS: DeviceKey[] = [
  "wall_light_1", "wall_light_2", "wall_light_3", "wall_light_4", "chandelier",
];

// Sensor endpoints (separate temperature/humidity)
export const TEMP_URL = `${BASE}/get?token=${T1}&v10`;
export const HUMIDITY_URL = `${BASE}/get?token=${T1}&v11`;

// Batch scene URLs
export const ALL_ON_URLS = [
  `${BASE}/batch/update?token=${T1}&v0=1&v2=1&v3=1&v4=1&v1=1`,
  `${BASE}/batch/update?token=${T2}&v0=1&v1=1&v2=1&v3=1&v4=1&v5=1&v6=1`,
];
export const ALL_OFF_URLS = [
  `${BASE}/batch/update?token=${T1}&v0=0&v1=0&v2=0&v3=0&v4=0`,
  `${BASE}/batch/update?token=${T2}&v0=0&v1=0&v2=0&v3=0&v4=0&v5=0&v6=0`,
];
export const AMBIENT_ON_URLS = [
  `${BASE}/batch/update?token=${T1}&v1=1&v2=1&v3=1&v0=0&v4=0`,
  `${BASE}/batch/update?token=${T2}&v0=1&v1=1&v2=1&v4=1&v3=0&v5=0&v6=0`,
];

// All-on state mapping
export const ALL_ON_STATE: Array<[DeviceKey, boolean]> = DEVICES.map((d) => [d.key, true]);
export const ALL_OFF_STATE: Array<[DeviceKey, boolean]> = DEVICES.map((d) => [d.key, false]);
export const AMBIENT_ON_STATE: Array<[DeviceKey, boolean]> = [
  ["fan_1", true], ["wall_light_1", true], ["wall_light_2", true],
  ["led_batten_1", false], ["spot_3in1", false],
  ["fan_2", true], ["wall_light_3", true], ["wall_light_4", true],
  ["chandelier", true],
  ["led_batten_2", false], ["outdoor_light_1", false], ["outdoor_light_2", false],
];

export function fireControl(url: string) {
  if (!url) return Promise.resolve();
  return fetch(url, { mode: "no-cors", cache: "no-store" }).catch(() => {});
}

export function fireBatch(urls: string[]) {
  return Promise.all(urls.map(fireControl));
}
