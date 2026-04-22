import { PageShell } from "@/components/ui/PageShell";
import { AuvViewer } from "@/components/auv/AuvViewer";

export function Models() {
  return (
    <PageShell title="AUV models">
      <div className="panel panel--hud">
        <AuvViewer name="DHWANI" stlPath="models/DHWANI.stl" />
        <div className="prose" style={{ marginTop: 14 }}>
          <p>
            <strong>🌊 Dhwani</strong>
          </p>
          <p>
            Dhwani is an acoustics-focused Autonomous Underwater Vehicle designed to explore sonar-based perception in
            low-visibility underwater environments. It leverages forward-scan and side-scan sonar systems to interpret
            sparse acoustic data for mapping, reconstruction, and environmental understanding. Built as a platform for
            perception-driven research, Dhwani focuses on extracting meaningful spatial information from challenging
            acoustic signals, enabling applications in underwater inspection, navigation, and 3D reconstruction.
          </p>
        </div>
      </div>

      <div className="panel panel--hud" style={{ marginTop: 18 }}>
        <AuvViewer name="TIMI" stlPath="models/TIMI.stl" />
        <div className="prose" style={{ marginTop: 14 }}>
          <p>
            <strong>🔱 Timi</strong>
          </p>
          <p>
            Timi is a compact, sensor-rich Autonomous Underwater Vehicle developed for robust navigation and real-world
            deployment in GPS-denied environments. It integrates a high-density sensor suite including inertial,
            acoustic, and pressure-based systems within a modular architecture, enabling reliable state estimation,
            perception, and control. Designed with a strong emphasis on system-level integration, Timi combines
            multi-sensor fusion, onboard computation, and efficient actuation to perform autonomous tasks in constrained
            and uncertain underwater conditions.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

