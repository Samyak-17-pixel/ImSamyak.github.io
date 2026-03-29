export type Role = {
  title: string;
  org: string;
  period: string;
  intro?: string;
  sections: { heading: string; bullets: string[] }[];
};

export const experience: Role[] = [
  {
    title: "Autonomous Underwater Vehicle (AUV) Sensing & Control Engineer",
    org: "Team Aritra — IIT Madras",
    period: "Dec 2025 – Present",
    intro:
      "Selected as part of one of the few Indian teams competing in the Singapore Autonomous Underwater Vehicle Challenge, focused on full autonomy in constrained underwater environments.",
    sections: [
      {
        heading: "Mission-critical autonomy",
        bullets: [
          "Leading the development of mission-critical autonomy systems for navigation through structured environments, acoustic target detection, communication-based localization, and multi-stage mission execution.",
        ],
      },
      {
        heading: "Sensor-driven state estimation",
        bullets: [
          "Designed and implemented sensor-driven state estimation pipelines integrating IMU, pressure sensor, Doppler Velocity Log (DVL), echosounder, imaging sonar, acoustic modem, and underwater GPS.",
        ],
      },
      {
        heading: "Multi-sensor fusion",
        bullets: [
          "Developed multi-sensor fusion frameworks for depth control, heading stabilization, and velocity regulation, ensuring stable operation without wall contact, floor collision, or mission structure interference.",
        ],
      },
      {
        heading: "Perception & decision-making",
        bullets: [
          "Engineered perception and decision-making logic for gate detection, obstacle avoidance, and target localization using acoustic and sonar-based cues.",
        ],
      },
      {
        heading: "Custom actuation",
        bullets: [
          "Designed and fabricated a custom actuation system: ball dropping and pickup mechanism, optimized for alignment tolerance, fast actuation, and high reliability in underwater conditions.",
        ],
      },
    ],
  },
  {
    title: "Robotics Systems Engineer (AUVs)",
    org: "MAVLAB — IIT Madras",
    period: "Aug 2025 – Present",
    intro:
      "Designed and developed a compact, modular Autonomous Underwater Vehicle (AUV) from scratch, owning electrical systems, mechanical architecture, and the autonomy stack.",
    sections: [
      {
        heading: "Electrical architecture",
        bullets: [
          "Architected the complete electrical system, including power distribution networks, sensor and thruster interfacing, grounding strategy for noise minimization, and internal wiring optimized for reliability in submerged conditions.",
        ],
      },
      {
        heading: "Bathymetric sensing suite",
        bullets: [
          "Integrated a heterogeneous bathymetric sensing suite: pressure sensor, DVL, echosounder, imaging sonar, side-scan sonar, forward-looking sonar, and IMU — with emphasis on sensor placement optimization, electrical interfacing, and time synchronization.",
        ],
      },
      {
        heading: "ROS data acquisition",
        bullets: [
          "Developed a ROS-based data acquisition pipeline with synchronized multi-sensor logging that enables repeatable and scalable experiments and supports downstream mapping and SLAM tasks.",
        ],
      },
      {
        heading: "EKF navigation",
        bullets: [
          "Implemented EKF-based navigation framework fusing IMU, DVL, and pressure sensor, providing stable state estimates for localization, depth estimation, and mapping.",
        ],
      },
      {
        heading: "Ongoing development",
        bullets: [
          "Currently developing a custom sonar visualization interface and interactive tools for acoustic data interpretation, bathymetric analysis, and multi-sensor validation.",
        ],
      },
    ],
  },
  {
    title: "Electrical & Mechanical Design Specialist",
    org: "Team Amogh — IIT Madras",
    period: "Mar 2025 – Nov 2025",
    intro:
      "Core contributor to AUV development for RoboSub 2026, focusing on system-level integration.",
    sections: [
      {
        heading: "Electrical architecture",
        bullets: [
          "Designed the complete electrical architecture, including PCB design, power regulation systems, sensor-thruster interfacing, and grounding strategies for underwater safety.",
        ],
      },
      {
        heading: "PCB design (KiCad)",
        bullets: [
          "Developed schematics and PCB layouts using KiCad: optimized component density, improved electrical reliability, and ensured efficient power routing.",
        ],
      },
      {
        heading: "Hardware integration",
        bullets: [
          "Executed full hardware integration, including waterproofing, internal wiring, soldering, and assembly within pressure housings.",
        ],
      },
      {
        heading: "Mechanical & hydrodynamics",
        bullets: [
          "Contributed to mechanical design and hydrodynamics: thruster placement optimization, drag reduction strategies, and stability improvements.",
        ],
      },
      {
        heading: "CAD",
        bullets: [
          "Designed 3D models using Autodesk Fusion 360 for internal layout, structural integration, and component mounting.",
        ],
      },
    ],
  },
];
