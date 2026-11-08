export const skills = {
  /** Verified tool and method groups, matching the CV. */
  groups: [
    { label: "Software & tools", items: ["Python", "ROS 2", "Gazebo", "Linux", "Git", "Docker"] },
    {
      label: "Estimation & control",
      items: ["Kalman filter", "Extended Kalman filter", "Sensor fusion", "PID control", "Pole placement", "LOS guidance", "Thrust allocation"],
    },
    {
      label: "Perception & ML",
      items: ["Computer vision (OpenCV)", "Deep learning (PyTorch)", "LSTM", "Vision transformers (DINOv2, LoRA)", "XGBoost", "SHAP", "scikit-learn"],
    },
    {
      label: "Sonar & ocean data",
      items: ["Forward-scan, side-scan & imaging sonar", "Sonar simulation", "Sonar-based 3D reconstruction", "xarray", "NetCDF", "Cartopy"],
    },
    {
      label: "Hardware & sensors",
      items: ["Fusion 360", "KiCad", "PCB design", "Jetson", "Pixhawk", "Arduino", "DVL", "IMU", "USBL", "Echosounder", "GNSS"],
    },
  ],
  expertise: [
    {
      title: "AUV autonomy, guidance & control",
      bullets: [
        "6-DOF control and thrust allocation for a fully actuated AUV",
        "Docking guidance, station keeping and survey missions for an underactuated torpedo AUV",
        "LOS / ILOS path following and proportional-navigation interception",
        "Safety-first design: neutral on stale data, geofences and keep-out zones",
      ],
    },
    {
      title: "Navigation & estimation",
      bullets: [
        "Kalman and extended Kalman filters, including ocean-current estimation",
        "EKF dock-pose estimation from camera measurements",
        "Sensor fault and degradation detection with LSTMs",
      ],
    },
    {
      title: "Underwater perception & sonar",
      bullets: [
        "Imaging, forward-scan and side-scan sonar integration",
        "Physics-based side-scan sonar simulation",
        "Classical vision for gates and dock lights; DINOv2-based segmentation",
        "Forward-scan sonar 3D reconstruction with Gaussian splatting (co-author)",
      ],
    },
    {
      title: "Robotics software",
      bullets: [
        "ROS 2 drivers, synchronised multi-sensor acquisition and logging",
        "Simulators, desktop and web tools for testing and visualisation",
        "Automated tests and reproducible experiments",
      ],
    },
    {
      title: "Electrical systems",
      bullets: [
        "Power distribution with separately switched sections",
        "PCB design in KiCad",
        "Sensor and thruster interfacing on Jetson, Pixhawk and Arduino",
      ],
    },
    {
      title: "Mechanical systems",
      bullets: [
        "AUV hull, frame and internal layout in Fusion 360",
        "Fin sizing for torpedo AUVs",
        "Waterproofing and pressure-housing integration",
      ],
    },
  ],
};
