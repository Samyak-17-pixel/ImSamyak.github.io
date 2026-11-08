/** Single source of truth for the dive: section order, depth zones and the sensor that presents each one. */
export type SensorId =
  | "usbl"
  | "imu"
  | "depth"
  | "imaging"
  | "fls"
  | "dvl"
  | "sidescan"
  | "transponder"
  | "modem";

export type Sensor = {
  id: SensorId;
  name: string;
  short: string;
  role: string;
};

export const SENSORS: Record<SensorId, Sensor> = {
  usbl: { id: "usbl", name: "Underwater GPS (USBL)", short: "USBL", role: "Acoustic position fix" },
  imu: { id: "imu", name: "Inertial measurement unit", short: "IMU", role: "Attitude & angular rate" },
  depth: { id: "depth", name: "Depth sensor", short: "DEPTH", role: "Pressure → depth" },
  imaging: { id: "imaging", name: "Imaging sonar", short: "IMG", role: "Range × bearing imagery" },
  fls: { id: "fls", name: "Forward-scan sonar", short: "FLS", role: "Forward range–intensity arcs" },
  dvl: { id: "dvl", name: "Doppler velocity log", short: "DVL", role: "Bottom-lock velocity" },
  sidescan: { id: "sidescan", name: "Side-scan sonar", short: "SSS", role: "Lateral seabed imaging" },
  transponder: { id: "transponder", name: "Acoustic transponders", short: "XPDR", role: "Baseline ranging network" },
  modem: { id: "modem", name: "Acoustic modem", short: "MODEM", role: "Through-water comms" },
};

export const SENSOR_ORDER: SensorId[] = [
  "usbl",
  "imu",
  "depth",
  "imaging",
  "fls",
  "dvl",
  "sidescan",
  "transponder",
  "modem",
];

export type Section = {
  id: string;
  label: string;
  depthM: number;
  sensors: SensorId[];
  /** Shown in the top nav. */
  inNav: boolean;
  zone: string;
};

export const SECTIONS: Section[] = [
  { id: "home", label: "Surface", depthM: 0, sensors: ["usbl"], inNav: false, zone: "Surface" },
  { id: "about", label: "About", depthM: 20, sensors: ["imu"], inNav: true, zone: "Sunlight zone" },
  { id: "telemetry", label: "Telemetry", depthM: 45, sensors: ["depth"], inNav: false, zone: "Sunlight zone" },
  { id: "models", label: "Models", depthM: 80, sensors: ["imaging"], inNav: true, zone: "Sunlight zone" },
  { id: "research", label: "Research", depthM: 150, sensors: ["fls"], inNav: true, zone: "Twilight zone" },
  { id: "projects", label: "Projects", depthM: 250, sensors: ["dvl"], inNav: true, zone: "Twilight zone" },
  { id: "experience", label: "Experience", depthM: 400, sensors: ["sidescan"], inNav: true, zone: "Twilight zone" },
  { id: "skills", label: "Skills", depthM: 600, sensors: ["transponder"], inNav: true, zone: "Twilight zone" },
  { id: "education", label: "Education", depthM: 800, sensors: ["imu", "dvl"], inNav: true, zone: "Midnight zone" },
  { id: "contact", label: "Contact", depthM: 1000, sensors: ["modem"], inNav: true, zone: "Abyss" },
];

export const MAX_DEPTH_M = 1000;

export function sectionById(id: string | undefined) {
  return SECTIONS.find((s) => s.id === id);
}

export function sectionIndex(id: string) {
  return SECTIONS.findIndex((s) => s.id === id);
}
