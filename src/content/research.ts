export const research = {
  overview:
    "My research focuses on improving reliability, perception, and autonomy in underwater robotic systems, particularly in environments where:",
  environmentBullets: [
    "GPS is unavailable",
    "Sensors degrade over time",
    "Visibility is limited or non-existent",
  ],
  themes: [
    "Sensor Integrity & Reliability Estimation",
    "Learning-Enhanced State Estimation",
    "Underwater SLAM & Localization",
    "Acoustic Perception & Sonar-Based Mapping",
    "3D Reconstruction in Sparse Sensing Environments",
    "Simulation-to-Real Transfer",
  ],
  paper1: {
    title: "Deep Learning Based Sensor Integrity Monitoring for Robust AUV Navigation",
    problemContext: {
      title: "Problem context",
      paragraphs: [
        "Autonomous Underwater Vehicles (AUVs) rely on onboard sensors such as IMU (Inertial Measurement Unit), Doppler Velocity Log (DVL), and pressure sensors for navigation in GPS-denied underwater environments.",
        "However, in real-world deployments: sensors degrade over time, noise characteristics change, and sudden faults occur. This leads to significant degradation in state estimation accuracy.",
      ],
    },
    limitations: {
      title: "Limitations of conventional methods",
      paragraphs: [
        "Traditional approaches using the Extended Kalman Filter assume fixed process noise (Q) and fixed measurement noise (R).",
        "These assumptions fail under time-varying sensor conditions, cannot detect subtle degradation patterns, and struggle with transient faults.",
      ],
    },
    approach: {
      title: "Proposed approach",
      intro:
        "This work introduces a learning-based sensor integrity monitoring framework integrated with classical estimation pipelines.",
      components: [
        {
          name: "Simulation pipeline",
          bullets: [
            "Based on 6-DOF vehicle dynamics",
            "Generates mission-level trajectories",
            "Injects gradual degradation, sudden faults, and noise variations",
          ],
        },
        {
          name: "Temporal learning model",
          bullets: [
            "LSTM-based architecture",
            "Input: time-series sensor data",
            "Output: sensor state classification — Clean, Degraded, Faulty",
          ],
        },
        {
          name: "Scenario-based evaluation framework",
          bullets: [
            "Moves beyond point-wise accuracy",
            "Groups predictions into mission-level patterns",
            "Evaluates detection stability, temporal consistency, false positives/negatives",
          ],
        },
      ],
    },
    contributions: [
      "Introduces learning-based sensor health estimation for AUVs",
      "Demonstrates improved detection of short-term degradation events",
      "Provides stable and interpretable sensor behavior tracking",
      "Bridges model-based estimation (EKF) with data-driven intelligence",
    ],
    results: [
      "Improved robustness in navigation pipelines",
      "Early detection of sensor degradation",
      "Enables adaptive filtering strategies (future integration with EKF)",
      "Reduces reliance on fixed-noise assumptions",
    ],
  },
  paper2: {
    title:
      "3D Reconstruction of Underwater Structures using Forward-Scan Sonar and Gaussian Splatting",
    problemContext: {
      title: "Problem context",
      paragraphs: [
        "Underwater inspection and reconstruction are critical for infrastructure monitoring (pipelines, hulls), deep-sea exploration, and archaeological surveys.",
        "However: optical sensors fail in turbid and low-visibility environments; multi-beam sonars are expensive, hardware-intensive, and data-heavy.",
      ],
    },
    challenge: {
      title: "Challenge with forward-scan sonar",
      paragraphs: [
        "Forward-scan sonars are low-cost, sequential acquisition, and provide sparse range–intensity data.",
        "But they suffer from severe elevation ambiguity, provide 2D arc-like measurements, and make 3D reconstruction ill-posed.",
      ],
    },
    solution:
      "A novel Gaussian Splatting-based reconstruction framework tailored for forward-scan sonar.",
    methodology: [
      {
        title: "Acoustic modeling",
        bullets: [
          "Each sonar ping modeled as elevation-ambiguous arc",
          "Encodes uncertainty directly into reconstruction",
        ],
      },
      {
        title: "Multi-view fusion",
        bullets: [
          "Multiple sonar passes combined",
          "Resolves ambiguity through geometric consistency and cross-view alignment",
        ],
      },
      {
        title: "Gaussian representation",
        bullets: [
          "Scene represented as a set of 3D Gaussian primitives",
          "Each primitive encodes position, covariance, and intensity",
        ],
      },
      {
        title: "Elevation-aware densification",
        bullets: [
          "Iterative refinement strategy",
          "Adds Gaussians where ambiguity reduces",
          "Uses multi-view constraints to improve accuracy",
        ],
      },
    ],
    validation: "Tested on simulated datasets and real-world sonar data.",
    contributions: [
      "First framework adapting Gaussian splatting to forward-scan sonar",
      "Handles extreme sparsity and ambiguity",
      "Enables low-cost 3D reconstruction pipelines",
      "Produces physically consistent reconstructions",
    ],
    impact: [
      "Democratizes underwater 3D reconstruction",
      "Enables scalable inspection systems",
      "Reduces dependency on expensive sonar systems",
    ],
  },
};
