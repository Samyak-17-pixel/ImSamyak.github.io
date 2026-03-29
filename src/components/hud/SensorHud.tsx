import { useMemo } from "react";
import { useScrollProgressRaf } from "@/hooks/useScrollProgressRaf";
import { AScanCanvas } from "./AScanCanvas";
import { EchosounderCanvas } from "./EchosounderCanvas";
import { ImagingGridCanvas } from "./ImagingGridCanvas";
import { PolarSonarCanvas } from "./PolarSonarCanvas";
import { DEPTH_MAX_M, readoutsFromProgress } from "./sensorMath";
import { SideScanCanvas } from "./SideScanCanvas";

function fx(n: number, d: number) {
  return n.toFixed(d);
}

/** Scroll-driven decorative telemetry — depth 0 → DEPTH_MAX_M with eased scroll. */
export function SensorHud() {
  const p = useScrollProgressRaf();
  const r = useMemo(() => readoutsFromProgress(p), [p]);

  const spectrum = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => {
        const h =
          18 +
          Math.sin(p * Math.PI * 24 + i * 0.48) * 16 +
          Math.sin(p * Math.PI * 9 + i * 0.9) * 8;
        return Math.max(10, Math.min(52, h));
      }),
    [p]
  );

  return (
    <div className="sensor-hud" aria-hidden>
      <div className="sensor-hud__mission" role="presentation">
        <span className="sensor-hud__mission-phase">{r.mission_phase.label}</span>
        <span className="sensor-hud__mission-depth">
          DEPTH {fx(r.depth_m, 2)} / {DEPTH_MAX_M.toFixed(0)} m
        </span>
      </div>

      <div className="sensor-hud__cluster sensor-hud__cluster--tl sensor-hud__cluster--wide sensor-hud__cluster--desktop-polar">
        <div className="sensor-hud__label">Scanning sonar · polar (θ, r, I)</div>
        <PolarSonarCanvas p={p} sweepRad={r.sweep_rad} />
        <div className="sensor-hud__caption">range rings · arbitrary units</div>
        <div className="sensor-hud__divider" />
        <div className="sensor-hud__label sensor-hud__label--small">IMU · vectors</div>
        <div className="sensor-hud__row">
          <span className="sensor-hud__k">a m/s²</span>
          <span className="sensor-hud__v mono">
            {fx(r.imu_m_s2.ax, 2)} {fx(r.imu_m_s2.ay, 2)} {fx(r.imu_m_s2.az, 2)}
          </span>
        </div>
        <div className="sensor-hud__row">
          <span className="sensor-hud__k">ω rad/s</span>
          <span className="sensor-hud__v mono">
            {fx(r.imu_rad_s.wx, 3)} {fx(r.imu_rad_s.wy, 3)} {fx(r.imu_rad_s.wz, 3)}
          </span>
        </div>
      </div>

      <div className="sensor-hud__cluster sensor-hud__cluster--tr sensor-hud__cluster--tr-wide sensor-hud__cluster--desktop-acoustic">
        <div className="sensor-hud__label">Acoustic stack · FLS / modem</div>
        <div className="sensor-hud__row-flex">
          <AScanCanvas p={p} />
          <div className="sensor-hud__stack">
            <div className="sensor-hud__label sensor-hud__label--tiny">Imaging · range × bearing</div>
            <ImagingGridCanvas p={p} contrast={r.imaging_contrast} />
            <div className="sensor-hud__row">
              <span className="sensor-hud__k">SNR</span>
              <span className="sensor-hud__v">{fx(r.snr_db, 1)} dB</span>
            </div>
          </div>
        </div>
        <div className="sensor-hud__spectrum" aria-hidden>
          {spectrum.map((h, i) => (
            <span key={i} className="sensor-hud__bar" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="sensor-hud__row">
          <span className="sensor-hud__k">Modem</span>
          <span className="sensor-hud__v mono">{fx(r.modem_dbm, 1)} dBm</span>
        </div>
        <div className="sensor-hud__row">
          <span className="sensor-hud__k">Frames</span>
          <span className="sensor-hud__v mono">{r.modem_pkts}</span>
        </div>
      </div>

      <div className="sensor-hud__cluster sensor-hud__cluster--bl sensor-hud__cluster--bl-wide">
        <div className="sensor-hud__label">Pressure · DVL · echosounder</div>
        <div className="sensor-hud__row">
          <span className="sensor-hud__k">P → depth</span>
          <span className="sensor-hud__v">
            {fx(r.pressure_bar, 3)} bar · {fx(r.depth_m, 2)} m
          </span>
        </div>
        <div className="sensor-hud__row">
          <span className="sensor-hud__k">v (DVL)</span>
          <span className="sensor-hud__v mono">
            {fx(r.dvl_m_s.vx, 2)} {fx(r.dvl_m_s.vy, 2)} {fx(r.dvl_m_s.vz, 2)} m/s
          </span>
        </div>
        <div className="sensor-hud__row">
          <span className="sensor-hud__k">Altitude</span>
          <span className="sensor-hud__v">{fx(r.dvl_alt_m, 2)} m</span>
        </div>
        <EchosounderCanvas p={p} depth_m={r.depth_m} echo_m={r.echo_range_m} />
        <div className="sensor-hud__caption">strip chart · raw + filtered + trend (scroll-scrub)</div>
      </div>

      <div className="sensor-hud__cluster sensor-hud__cluster--br sensor-hud__cluster--br-wide sensor-hud__cluster--desktop-sides">
        <div className="sensor-hud__label">Side-scan · USBL (planned)</div>
        <SideScanCanvas p={p} />
        <div className="sensor-hud__caption">lateral intensity · scroll offset</div>
        <div className="sensor-hud__divider" />
        <div className="sensor-hud__row">
          <span className="sensor-hud__k">USBL x y z</span>
          <span className="sensor-hud__v mono">
            {fx(r.usbl_m.x, 1)} {fx(r.usbl_m.y, 1)} {fx(r.usbl_m.z, 1)} m
          </span>
        </div>
        <div className="sensor-hud__row">
          <span className="sensor-hud__k">HDG / P / R</span>
          <span className="sensor-hud__v mono">
            {fx(r.heading_deg, 1)}° {fx(r.pitch_deg, 1)}° {fx(r.roll_deg, 1)}°
          </span>
        </div>
      </div>
    </div>
  );
}
