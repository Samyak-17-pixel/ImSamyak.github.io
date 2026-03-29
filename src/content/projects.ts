export const projects = {
  compactAuv: {
    title: "Compact AUV — major engineering project",
    overview:
      "Currently leading the development of a compact, modular Autonomous Underwater Vehicle (AUV) at IIT Madras.",
    philosophy: ["Compact yet high capability", "Modular architecture", "High sensor density", "Research + competition ready"],
    mechanical: {
      title: "Mechanical design",
      bullets: [
        "Cylindrical hull: 50 × 15 cm",
        "Lightweight, pressure-resistant structure",
        "3D-printed buoyant outer shell",
      ],
    },
    internal: {
      title: "Internal architecture",
      bullets: [
        "Sliding modular frame",
        "Three independent modules: Control; Compute + Power; Communication + Battery",
      ],
    },
    sensors: [
      "IMU",
      "DVL A50",
      "Ping2 sonar",
      "Ping360 scanning sonar",
      "Side-scan sonar",
      "USBL (planned)",
      "Pressure sensor",
      "Camera (planned)",
    ],
    compute: ["NVIDIA Jetson Orin Nano", "Pixhawk flight controller", "Arduino microcontroller"],
    power: ["16,000 mAh Li-ion battery", "Dual 12V + 5V rails", "Power segmentation using relays"],
    actuation: ["6-thruster configuration", "Enables 3-DOF control"],
    safety: ["Leak detection", "Thermal monitoring", "Electrical isolation"],
    applications: ["SLAM in confined environments", "Acoustic mapping", "Inspection tasks"],
  },
  sauvc: {
    title: "Competition — SAUVC 2026",
    intro:
      "Leading Team Aritra in one of Asia’s most competitive AUV challenges.",
    missions: [
      "Autonomous navigation through gates",
      "Acoustic pinger localization",
      "Object manipulation & reacquisition",
      "Multi-task execution",
    ],
  },
};
