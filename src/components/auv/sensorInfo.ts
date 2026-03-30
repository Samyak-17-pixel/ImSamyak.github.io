export type AuvPartId =
  | "imu"
  | "dvl"
  | "thruster_axial"
  | "sonar_sidescan_l"
  | "sonar_sidescan_r"
  | "ping2"
  | "camera"
  | "pressure";

export type AuvPartInfo = {
  id: AuvPartId;
  label: string;
  data: string[];
  role: string;
};

export const AUV_PARTS: Record<AuvPartId, AuvPartInfo> = {
  imu: {
    id: "imu",
    label: "IMU",
    data: ["3-axis acceleration (m/s²)", "3-axis angular rate (rad/s)", "Orientation estimate (fused)"],
    role:
      "Short-term motion tracking for attitude + dead-reckoning; stabilizes control loops and anchors inertial propagation inside the EKF.",
  },
  dvl: {
    id: "dvl",
    label: "DVL",
    data: ["Velocity over ground / bottom-track (m/s)", "Altitude to seafloor (m)", "Quality / lock status"],
    role:
      "Primary velocity source underwater; reduces drift in dead-reckoning and constrains the EKF when GPS is unavailable.",
  },
  thruster_axial: {
    id: "thruster_axial",
    label: "Axial thruster (rear)",
    data: ["Commanded thrust (%)", "RPM / current draw (A)", "Controller output"],
    role:
      "Main propulsion for surge; integrates with velocity/heading control and provides predictable forward motion for navigation and mapping passes.",
  },
  sonar_sidescan_l: {
    id: "sonar_sidescan_l",
    label: "Side-scan sonar (port)",
    data: ["Along-track strip (range–intensity)", "Ping rate / swath", "Detections (processed)"],
    role:
      "Seafloor/infrastructure imaging; supports inspection and mapping, providing lateral context in low visibility for autonomy decisions.",
  },
  sonar_sidescan_r: {
    id: "sonar_sidescan_r",
    label: "Side-scan sonar (starboard)",
    data: ["Along-track strip (range–intensity)", "Ping rate / swath", "Detections (processed)"],
    role:
      "Complements port side-scan to image both sides of the vehicle track; improves coverage for mapping and inspection pipelines.",
  },
  ping2: {
    id: "ping2",
    label: "Ping2 echosounder",
    data: ["Bottom range (m)", "Confidence / quality", "Ping intensity"],
    role:
      "Bottom ranging for altitude awareness and safety; constrains vertical state and improves mission stability near the seafloor.",
  },
  camera: {
    id: "camera",
    label: "Front camera",
    data: ["Frames / exposure", "Detections (optional)", "Timestamp sync"],
    role:
      "Close-range perception when visibility allows; supports target recognition and alignment in tasks like gate traversal and object reacquisition.",
  },
  pressure: {
    id: "pressure",
    label: "Pressure sensor",
    data: ["Pressure (bar)", "Depth estimate (m)", "Temperature (optional)"],
    role:
      "Absolute depth reference; stabilizes vertical state in the EKF and enables robust depth-hold even with other sensor noise.",
  },
};

