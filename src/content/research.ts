export const research = {
  overview:
    "My research is about making underwater robots reliable and perceptive where the ocean is hardest to observe, in water where:",
  environmentBullets: [
    "GPS is unavailable",
    "Sensors degrade or fail mid-mission",
    "Visibility is limited or non-existent",
  ],
  themes: [
    "Polar & under-ice robotics",
    "Sensor fault detection & reliable navigation",
    "Sonar-based perception",
    "Mapping & 3D reconstruction",
    "Information-driven search & docking",
    "Simulation for underwater robotics",
  ],
};

export type PaperSection = { id: string; title: string; paragraphs: string[] };
export type PaperLink = { label: string; href: string };

export type Paper = {
  slug: string;
  index: string;
  title: string;
  authors: string;
  venue: string;
  /** e.g. "First author · presented" */
  role?: string;
  links: PaperLink[];
  summary: string;
  keywords: string[];
  sections: PaperSection[];
  pipelineTitle: string;
  pipeline: { title: string; bullets: string[] }[];
  contributions: string[];
  outcomesTitle: string;
  outcomes: string[];
};

export const papers: Paper[] = [
  {
    slug: "sensor-integrity-lstm",
    index: "01",
    title: "Deep Learning Based Sensor Integrity Monitoring for Robust AUV Navigation",
    authors: "Bokinala Samyak Kumar, Vallabh Deogaonkar, Mohammed Ibrahim M., Abhilash Somayajula",
    venue: "OCEANS 2026 Sanya, China",
    role: "First author · presented",
    links: [
      { label: "IEEE Xplore", href: "https://ieeexplore.ieee.org/document/11616826" },
      { label: "Code", href: "https://github.com/Samyak-17-pixel/AUV_Navigation_OCEANS_2026" },
    ],
    summary:
      "A multi-head LSTM that labels the IMU, DVL and pressure sensor of an AUV as clean, degraded or faulty at every timestep, trained on a labelled dataset from a 6-DOF simulator with physically grounded disturbances.",
    keywords: ["LSTM", "Fault detection", "6-DOF simulation", "IMU · DVL · pressure"],
    sections: [
      {
        id: "problem",
        title: "Problem",
        paragraphs: [
          "AUVs working in shallow, cluttered water navigate on a DVL, a pressure sensor and an IMU, and all three are disturbed by the environment. The DVL loses bottom lock over uneven terrain, the pressure sensor fluctuates with waves and bubbles, and the IMU drifts or picks up magnetic interference.",
          "Some of these anomalies are short-term degradation and some are persistent faults. Telling the two apart in real time matters: treating a transient disturbance as a fault, or the reverse, leads to the wrong response and a worse mission.",
        ],
      },
      {
        id: "limitations",
        title: "Why classical methods struggle",
        paragraphs: [
          "Model-based fault detection (analytical redundancy, residuals, observers with thresholds) needs an accurate model and hand-set thresholds. It catches abrupt faults well, but it looks at instantaneous deviations, so it struggles with gradual or short-lived degradation in water where disturbances are hard to model.",
        ],
      },
      {
        id: "approach",
        title: "Approach",
        paragraphs: [
          "Detection is posed as a multi-sensor, per-timestep sequence classification problem. The model sees only the measured signals, never the true state, and predicts a class for each sensor at every step.",
          "Training data comes from a nonlinear 6-DOF AUV simulator (Fossen form, RK4 at 10 Hz, sensors logged at 1 Hz) flying lawnmower survey missions with randomised ocean currents. Disturbances are injected per sensor: degradation as higher, signal-relative noise over a finite window (a magnetometer-style attitude bias for the IMU), and faults as frozen or NaN outputs that last until the end of the mission. At most one sensor faults per episode.",
        ],
      },
    ],
    pipelineTitle: "Framework",
    pipeline: [
      {
        title: "Simulation and dataset",
        bullets: [
          "6-DOF dynamics, currents, mission controller and sensor models",
          "20 scenario types: 8 degradation-only combinations and 12 with one faulty sensor",
          "Episodes run through the fault, with per-timestep labels; 70 / 15 / 15 split stratified by scenario",
        ],
      },
      {
        title: "Multi-head LSTM",
        bullets: [
          "Shared LSTM backbone on a 20-D feature per timestep (IMU, DVL, pressure, beam flags, NaN flags)",
          "Three heads (IMU, DVL, pressure), each predicting clean / degraded / fault",
          "Weighted cross-entropy per head to counter class imbalance",
        ],
      },
      {
        title: "Scenario-level evaluation",
        bullets: [
          "Per-timestep predictions aggregated into one scenario per mission",
          "Scenario confusion matrix over all 20 types",
          "Compared with a residual-threshold model-based baseline",
        ],
      },
    ],
    contributions: [
      "A physics-informed simulation framework that generates labelled multi-sensor datasets with realistic degradation and fault mechanisms",
      "A multi-head LSTM that classifies each sensor as clean, degraded or faulty from sequential measurements",
      "A scenario-level evaluation method that scores mission-relevant detection across combinations of anomalies",
    ],
    outcomesTitle: "Results",
    outcomes: [
      "81.8% overall accuracy across all sensors",
      "Faults (frozen or invalid output) are detected reliably; degradation is the hardest class",
      "The scenario confusion matrix is strongly diagonal; errors concentrate among similar degradation-only scenarios",
      "Limitations: simulation-only data, detection not yet fed into navigation, a short delay at degradation onset",
    ],
  },
  {
    slug: "sonar-gaussian-splatting",
    index: "02",
    title: "3D Reconstruction of Underwater Structures using Forward-Scan Sonar and Gaussian Splatting",
    authors: "Vallabh Deogaonkar, Mohammed Ibrahim M., Bokinala Samyak Kumar, Aatmaj Bhayani, Abhilash Somayajula",
    venue: "OCEANS 2026 Sanya, China",
    links: [{ label: "IEEE Xplore", href: "https://ieeexplore.ieee.org/document/11616818" }],
    summary:
      "A Gaussian splatting framework for low-cost forward-scan sonar: each ping is an elevation-ambiguous arc, and many views are combined to recover 3D structure.",
    keywords: ["Forward-scan sonar", "Gaussian splatting", "Elevation ambiguity", "3D reconstruction"],
    sections: [
      {
        id: "problem",
        title: "Problem",
        paragraphs: [
          "Inspecting pipelines, bridge piers and offshore platforms needs 3D models, but turbid, dark water defeats cameras. Multi-beam imaging sonars work, but they are expensive and produce dense data.",
          "Forward-scan sonars are compact and cheap, but they acquire one beam at a time as sparse range–intensity data and do not resolve elevation. Every return could have come from anywhere along an arc, so 3D reconstruction is ill-posed. Existing sonar Gaussian splatting methods assume dense imaging sonar or extra sensors.",
        ],
      },
      {
        id: "solution",
        title: "Approach",
        paragraphs: [
          "The scene is a set of 3D Gaussians, each with a mean, an anisotropic covariance, an opacity and a reflectivity. A sonar renderer moves them into the sensor frame, linearises the Cartesian-to-spherical map, splats them into range–azimuth pixels and accumulates them with transmittance. The Gaussians are then optimised so that rendered images match the measured ones across all viewpoints.",
          "Data comes from a ray-based forward-scan sonar simulator, with poses sampled around each structure and pointed at its centroid. The method is validated on simulated fence and truss structures (249 and 886 viewpoints).",
        ],
      },
    ],
    pipelineTitle: "Method",
    pipeline: [
      {
        title: "Elevation-aware initialisation",
        bullets: [
          "Each active sonar pixel becomes candidate points sampled along its elevation arc",
          "Intensity thresholding, then multi-view consistency: keep points seen from at least M views",
        ],
      },
      {
        title: "Sonar splatting",
        bullets: [
          "World → sensor → (range, azimuth) with a first-order Jacobian for the covariance",
          "Approximate per-Gaussian transmittance and view-dependent Gaussian subsets",
        ],
      },
      {
        title: "Regularised optimisation",
        bullets: [
          "ℓ1 image loss plus opacity and scale regularisation",
          "Elevation-ray regularisation (entropy and depth variance along each ray) against vertical smearing",
          "Opacity updates aligned with the reconstruction gradient",
        ],
      },
      {
        title: "Pruning",
        bullets: [
          "Density-based pruning of isolated Gaussians",
          "A reconstruction-aware guard that protects Gaussians the loss depends on",
        ],
      },
    ],
    contributions: [
      "Models each forward-scan return as an elevation-ambiguous arc instead of a point",
      "Resolves elevation through multi-view consistency in initialisation and optimisation",
      "Adds elevation-ray regularisation, opacity-gradient alignment and reconstruction-aware pruning for stable optimisation",
    ],
    outcomesTitle: "Results",
    outcomes: [
      "Fence structure: the three vertical rods and the cross-bar are recovered by epoch 100, with most spurious Gaussians pruned",
      "Truss structure: 811,690 candidate points filtered to 174,637 Gaussians, which converge onto the truss members as spurious ones are pruned",
      "Shows that low-cost forward-scan sonar can support 3D inspection",
    ],
  },
];

export function paperBySlug(slug: string | undefined) {
  return papers.find((p) => p.slug === slug);
}
