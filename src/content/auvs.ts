import type { SensorId } from "./sections";
import type { AuvPartId } from "@/components/auv/sensorInfo";

export type Auv = {
  slug: string;
  name: string;
  tagline: string;
  model: string;
  description: string;
  focus: string[];
  sensors: SensorId[];
  /** Vehicle-only payloads that aren't one of the dive sensors. */
  extras?: string[];
  /** Sensor reference tabs on the detail page. */
  suite?: AuvPartId[];
  /** Photo shown while the 3D viewer is switched off (public/ path). */
  /** Slug of the matching page in projectCatalog (#/projects/<slug>). */
  project: string;
};

export const auvs: Auv[] = [
  {
    slug: "dhwani",
    name: "DHWANI",
    tagline: "Acoustics-focused AUV",
    model: "models/dhwani.glb",
    description:
      "Dhwani is an acoustics-focused Autonomous Underwater Vehicle designed to explore sonar-based perception in low-visibility underwater environments. It leverages forward-scan and side-scan sonar systems to interpret sparse acoustic data for mapping, reconstruction, and environmental understanding. Built as a platform for perception-driven research, Dhwani focuses on extracting meaningful spatial information from challenging acoustic signals, enabling applications in underwater inspection, navigation, and 3D reconstruction.",
    focus: ["Sonar-based perception", "Mapping & reconstruction", "Underwater inspection"],
    sensors: ["fls", "sidescan"],
    project: "dhwani",
  },
  {
    slug: "timi",
    name: "TIMI",
    tagline: "Compact, sensor-rich AUV",
    model: "models/timi.glb",
    description:
      "Timi is a compact, sensor-rich Autonomous Underwater Vehicle developed for robust navigation and real-world deployment in GPS-denied environments. It integrates a high-density sensor suite including inertial, acoustic, and pressure-based systems within a modular architecture, enabling reliable state estimation, perception, and control. Designed with a strong emphasis on system-level integration, Timi combines multi-sensor fusion, onboard computation, and efficient actuation to perform autonomous tasks in constrained and uncertain underwater conditions.",
    focus: ["GPS-denied navigation", "Multi-sensor fusion", "Modular architecture"],
    sensors: ["imu", "dvl", "depth", "imaging", "sidescan"],
    suite: ["imu", "dvl", "pressure", "ping2", "sonar_sidescan_l", "camera"],
    project: "timi",
  },
  {
    slug: "mako",
    name: "MAKO",
    tagline: "Torpedo AUV for docking & bathymetry",
    model: "models/mako.glb",
    description:
      "Mako is a torpedo-shaped Autonomous Underwater Vehicle built for autonomous underwater docking and bathymetry mapping. Its streamlined hull is suited to long, efficient survey transects, during which port and starboard side-scan sonars image the seabed for mapping. Navigation relies on an IMU, a DVL and a depth sensor fused for robust state estimation in GPS-denied water, while a monocular camera provides visual guidance for homing and precise alignment on the final docking approach. Mako brings perception, navigation and control together around one goal: survey the seabed, then find its way home.",
    focus: ["Autonomous docking", "Bathymetry mapping", "Visual–inertial navigation"],
    sensors: ["sidescan", "imu", "dvl", "depth"],
    extras: ["Monocular camera"],
    suite: ["imu", "dvl", "pressure", "sonar_sidescan_l", "sonar_sidescan_r", "camera"],
    project: "mako",
  },
];

export function auvBySlug(slug: string | undefined) {
  return auvs.find((a) => a.slug === slug);
}
