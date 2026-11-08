export type Role = {
  title: string;
  org: string;
  period: string;
  intro?: string;
  sections: { heading: string; bullets: string[] }[];
};

export const experience: Role[] = [
  {
    title: "Undergraduate Researcher",
    org: "MAVLAB, IIT Madras · Advisor: Prof. Abhilash Somayajula",
    period: "2024 – Present",
    intro:
      "Research on underwater perception, navigation, docking and mapping, and the AUVs to test it on: MAKO and DHWANI.",
    sections: [
      {
        heading: "Active search & docking (ongoing)",
        bullets: [
          "Building search-and-docking for an underactuated torpedo AUV with no prior dock location: a belief over dock locations is updated from side-scan sonar, and viewpoints are chosen by information gain against travel cost.",
          "Identifying the dock from an asymmetric light pattern, then homing with optimal control and camera-based visual servoing; benchmarking against coverage-based search in simulation before trials in a 30 × 30 × 3 m wave basin.",
        ],
      },
      {
        heading: "MAKO torpedo AUV",
        bullets: [
          "Designed the CAD and PCB architecture of a 1.4 m X-fin torpedo AUV with IMU, DVL, depth sensor, dual side-scan sonars and a docking camera.",
          "Developed dock-light detection, an EKF dock-pose estimator and a search–approach–enter state machine, plus lawnmower, orbit, spiral and depth-varying survey missions inside a virtual geofence.",
          "Built an offline replica of the lab simulator's dynamics that found and fixed errors in its thrust, fin and added-mass models.",
        ],
      },
      {
        heading: "DHWANI acoustic AUV",
        bullets: [
          "Designed a compact, acoustics-focused AUV for bathymetry and SLAM research, with a slide-out electronics frame and separately switched power sections around a Jetson Orin Nano and a Pixhawk.",
          "Integrated an echosounder, forward-scan, side-scan and imaging sonars, USBL, DVL, IMU and pressure sensor; implemented depth, roll and yaw control and ran pool tests logging vehicle motion with sonar data.",
        ],
      },
      {
        heading: "Lab software & simulation",
        bullets: [
          "Designed ROS 2 software for synchronised multi-sensor acquisition, real-time visualisation and logging across the lab's AUVs.",
          "Wrote a physics-based dual side-scan sonar simulator, embedded in the lab's docking simulator, and a fin design and optimisation platform for torpedo AUVs.",
        ],
      },
    ],
  },
  {
    title: "Summer Research Intern — Marine Heatwaves of the Bay of Bengal",
    org: "Maritime Research Centre (MRC), Pune",
    period: "Jun 2026 – Aug 2026",
    intro: "Drivers, characteristics and predictability of marine heatwaves in three sub-regions of the Bay of Bengal.",
    sections: [
      {
        heading: "Event catalogue",
        bullets: [
          "Built a pipeline on 20 years (2006–2025) of daily Copernicus satellite SST for three Bay of Bengal sub-regions, detecting 117 marine heatwaves with the Hobday et al. (2016) method.",
        ],
      },
      {
        heading: "Drivers",
        bullets: [
          "Linked every event to ENSO, IOD and MEI at 0–6-month lags and to local wind and heat-flux anomalies with chi-square, Kruskal–Wallis and lag-correlation tests: 81% occurred under weak winds, and the IOD was the strongest large-scale driver.",
        ],
      },
      {
        heading: "Forecasting",
        bullets: [
          "Built heatwave-onset forecasters (logistic regression, Random Forest, XGBoost) with SHAP attribution, reaching 0.40 F1 at a 14-day lead on 2022–2025 test data and flagging 13 of 13 onsets in the 2025 hindcast.",
        ],
      },
    ],
  },
  {
    title: "Team Captain and Autonomous Systems Lead",
    org: "Team Aritra, IIT Madras",
    period: "2025 – 2026",
    intro: "Led the team building TIMI, a research-grade, fully actuated eight-thruster AUV.",
    sections: [
      {
        heading: "Leadership & integration",
        bullets: [
          "Led the development and pool validation of TIMI, integrating DVL, IMU, imaging sonar, pressure sensor, stereo camera, acoustic communication and localisation systems.",
        ],
      },
      {
        heading: "6-DOF control",
        bullets: [
          "Developed the 6-DOF control stack in ROS 2 for 8 thrusters (cascaded position–velocity PID, attitude PD, pseudo-inverse thrust allocation) with station keeping, waypoint and spline path following.",
        ],
      },
      {
        heading: "Perception & missions",
        bullets: [
          "Built a sonar-based gate finder that clusters Ping360 returns and refines them with the camera, and a classical OpenCV gate detector with PnP pose estimation running as a ROS 2 node on the onboard Jetson.",
          "Wrote the mission logic for the pool tasks: gate passing, drum detection and ball drop.",
        ],
      },
      {
        heading: "Custom actuation",
        bullets: [
          "Designed autonomous mechanisms for target acquisition and reacquisition, including a ball pickup-and-drop mechanism built for alignment tolerance and fast, reliable actuation underwater.",
        ],
      },
    ],
  },
  {
    title: "Mechatronics Design Engineer",
    org: "Team Amogh, IIT Madras",
    period: "2024 – 2025",
    intro: "Electrical and mechanical design of the team's AUV.",
    sections: [
      {
        heading: "Electrical architecture",
        bullets: [
          "Designed electrical architectures including power distribution, PCB systems, sensing interfaces and safety-critical subsystems.",
        ],
      },
      {
        heading: "PCB design (KiCad)",
        bullets: ["Developed PCB schematics and layouts in KiCad for reliable underwater robotic operation."],
      },
      {
        heading: "Mechanical layout (Fusion 360)",
        bullets: [
          "Designed mechanical subsystems and internal vehicle layouts in Fusion 360, focusing on compact integration and maintainability.",
        ],
      },
      {
        heading: "Integration",
        bullets: [
          "Performed hardware integration, fabrication, waterproofing and full-system assembly.",
        ],
      },
    ],
  },
];
