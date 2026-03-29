export const skills = {
  programming: ["Python", "C/C++", "MATLAB"],
  robotics: [
    "ROS / ROS2",
    "Sensor Fusion (EKF, Adaptive Filtering)",
    "Control Systems",
  ],
  ai: [
    "Deep Learning (LSTM)",
    "Time-series modeling",
    "Fault detection systems",
  ],
  simulation: ["Gazebo", "Custom 6-DOF simulators"],
  hardware: ["Embedded systems", "Power electronics", "Sensor integration"],
  expertise: [
    {
      title: "AUV autonomy, estimation & control",
      bullets: [
        "Autonomous mission execution in constrained underwater environments",
        "EKF-based navigation using multi-sensor fusion",
        "Depth, heading, and velocity control systems",
        "Stability-focused control under strict safety constraints",
      ],
    },
    {
      title: "Underwater perception & acoustic systems",
      bullets: [
        "Sonar-based perception using imaging sonar, forward-looking sonar, and side-scan sonar",
        "Acoustic data processing: signal interpretation, feature extraction, sparse sensing reconstruction",
        "Development of custom visualization tools for sonar data",
      ],
    },
    {
      title: "AI & learning systems",
      bullets: [
        "LSTM-based temporal modeling",
        "Sensor fault detection and classification",
        "Time-series learning for robotics systems",
        "Integration of learning-based methods with classical estimation",
      ],
    },
    {
      title: "Robotics software & middleware",
      bullets: [
        "ROS / ROS2 architecture design",
        "Multi-sensor data pipelines",
        "Real-time data synchronization",
        "Logging and replay systems",
      ],
    },
    {
      title: "Electrical systems",
      bullets: [
        "Power distribution design",
        "PCB design (KiCad)",
        "Grounding and noise management",
        "Embedded electronics integration",
      ],
    },
    {
      title: "Mechanical systems",
      bullets: [
        "AUV structural design",
        "Hydrodynamics considerations",
        "CAD modeling (Fusion 360)",
        "Waterproofing and pressure housing integration",
      ],
    },
  ],
};
