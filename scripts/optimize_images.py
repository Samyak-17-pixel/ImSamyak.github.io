"""Copy curated project images into public/projects/<slug>/ as optimised WebP.

Usage (from the Website folder):  python3 scripts/optimize_images.py
Edits: change IMAGES below (slug -> list of (source path, output name)).
Each image is resized to at most 1600 px wide (full) and 640 px wide (thumbnail).
"""
from pathlib import Path
from PIL import Image, ImageOps

HOME = Path.home()
OUT = Path(__file__).resolve().parent.parent / "public" / "projects"
PICS = HOME / "Pictures"
GNC = HOME / "gnc_ws/auv-gnc-platform/experiments/results/curated/figures"
SSS = HOME / "side_scan_sonar_sim/figures"
SEG = HOME / "unsupervised_clustering_for_underwater_images/dinov2_results/panels"
MRC = HOME / "mrc_ws"
UT27 = HOME / "Documents/Research Papers/Absracts"

SRC = Path(__file__).resolve().parent / "image_sources"
SHOTS = PICS / "Screenshots"
GNC_DASH = HOME / "gnc_ws/auv-gnc-platform/experiments/results/dashboard/demo/screens"
GNC_MISS = HOME / "gnc_ws/auv-gnc-platform/experiments/results/missions"
SEG_DOC = HOME / "unsupervised_clustering_for_underwater_images/docs/figures"
GATE_RAW = HOME / "Timi_Control/sauvc_competition_tasks/qualification_task/detection/assets/image_2170.png"

IMAGES = {
    "mako": [
        (PICS / "Torpedo AUV/IMG20260928210507.jpg", "hero"),
        (SRC / "mako_docking_top.png", "docking-top"),
        (SRC / "mako_docking_frames.png", "docking-frames"),
        (SRC / "mako_docking_timeline.png", "docking-timeline"),
        (SRC / "mako_mission_top.png", "mission-top"),
        (SRC / "mako_mission_timeline.png", "mission-timeline"),
        (PICS / "Torpedo AUV/IMG20260928210541.jpg", "side"),
        (PICS / "AUV Images/Mako_1.jpeg", "bench-build"),
        (PICS / "AUV Images/Mako_2.jpeg", "hull-frame"),
        (PICS / "AUV Images/WhatsApp Image 2026-08-14 at 00.56.49.jpeg", "top-view"),
        (HOME / "PythonVehicleSimulator-master/custom_auv/plots/autopilot.png", "autopilot-sim"),
    ],
    "timi": [
        (PICS / "AUV Images/Timi_AUV_2.png", "hero"),
        (PICS / "AUV Images/png.png", "cad-layout"),
        (PICS / "AUV Images/Timi_AUV_1.png", "vehicle"),
        (SRC / "gate_overlay.png", "gate-detection"),
    ],
    "dhwani": [
        (PICS / "AUV Images/Dhwani_AUV.JPG", "hero"),
        (SRC / "dhwani_field_run01.png", "field-run"),
        (PICS / "AUV Images/Dhwani_Internal Stack.jpg", "internal-stack"),
        (PICS / "AUV Images/Dhwani_Internal Stack_1.jpg", "internal-stack-side"),
        (PICS / "AUV Images/IMG-20251013-WA0009.jpg", "hull-render"),
        (PICS / "AUV Images/png(1).png", "electronics-cad"),
        (PICS / "AUV Images/Dhwani v1_1.jpg", "pool-test"),
        (PICS / "AUV Images/Dhwani v1_2.jpg", "pool-test-2"),
    ],
    "info-driven-docking": [
        (PICS / "Torpedo AUV/IMG20260928210521.jpg", "hero"),
        (SRC / "ut27_funnel_dock.png", "funnel-dock"),
        (SRC / "docking_straight_frames.png", "docking-frames"),
    ],
    "gnc-platform": [
        (GNC_DASH / "c39_live_running.png", "dashboard-live"),
        (GNC_DASH / "c39_viewer3d.png", "dashboard-3d"),
        (GNC_DASH / "c42_d_live.png", "dashboard-coverage"),
        (GNC_DASH / "c42_e_multi.png", "dashboard-multi"),
        (GNC_DASH / "c41_estimation.png", "dashboard-estimation"),
        (GNC / "f07_e01_missions.png", "missions"),
        (GNC_MISS / "multi_auv_coverage/figures/multi_coverage.png", "multi-coverage"),
        (GNC_MISS / "waypoint_tracking/figures/cross_track.png", "cross-track"),
        (GNC / "f08_e02_currents.png", "currents"),
        (GNC / "f11_e06_observers.png", "observers"),
        (GNC / "f10_e07_e08_interception.png", "interception"),
        (GNC / "f05_margins_delay.png", "margins"),
        (GNC / "f03_pole_map.png", "pole-map"),
        (GNC / "f01_open_loop.png", "open-loop"),
    ],
    "sidescan-simulator": [
        # Same console image as the portfolio (rough-floor run).
        (HOME / "Documents/CV and Resume/portfolio_build/sss_ui/sss_console_run.png", "console"),
        (SSS / "07_ui/geometry.png", "geometry"),
        (SSS / "01_overview/01_pipeline_poster.png", "pipeline"),
        (SSS / "01_overview/02_sonar_model_diagram.png", "model-diagram"),
        (SSS / "04_shadows/02_shadow_diagram.png", "shadow-geometry"),
        (SSS / "04_shadows/07_shadow_sweeps.png", "shadow-validation"),
        (SSS / "05_mosaic_and_dead_zone/02_heave_run_waterfall.png", "waterfall"),
        (SSS / "02_geometry_and_rays/07_swath_3d_topdown.png", "swath"),
        (SSS / "05_mosaic_and_dead_zone/04_mosaic_strip.png", "mosaic-strip"),
        (SSS / "07_ui/scene.png", "scene"),
    ],
    "underwater-segmentation": [
        # Older k-means study figures (sources since reorganised in the repo; webp kept in public/).
        (SEG_DOC / "stride3_usod_test54.png", "example"),
        (SEG_DOC / "analysis/gallery_best.png", "gallery-best"),
        (SEG / "usod_test104.png", "panel-1"),
        # Current README figures.
        (SEG_DOC / "01_overview.png", "overview"),
        (SEG_DOC / "02_pca_rgb_stride14_vs_3.png", "pca-rgb"),
        (SEG_DOC / "a2_oracle_vs_border_rule.png", "oracle-vs-border"),
        (SEG_DOC / "11_compare_unsupervised.png", "compare-unsupervised"),
        (SEG_DOC / "07_supervised_pipeline.png", "supervised-pipeline"),
        (SEG_DOC / "14_bars_supervised.png", "supervised-bars"),
        (SEG_DOC / "12_compare_supervised.png", "compare-supervised"),
        (SEG_DOC / "15_cross_dataset.png", "cross-dataset"),
        (SEG_DOC / "16_tank_results.png", "tank-results"),
        (SEG_DOC / "20_dhwani_supervised.png", "tank-supervised"),
    ],
    "fin-design": [
        (SHOTS / "Screenshot from 2026-08-25 02-06-43.png", "gui"),
        (SHOTS / "Screenshot from 2026-08-25 02-06-57.png", "gui-geometry"),
    ],
    "gate-detection": [
        (SRC / "gate_overlay.png", "overlay"),
        (GATE_RAW, "gate-underwater"),
    ],
    "marine-heatwaves": [
        (MRC / "archive/bay_of_bengal_base_map.png", "study-region"),
        (SHOTS / "Screenshot from 2026-08-23 19-49-19.png", "module-title"),
        (SHOTS / "Screenshot from 2026-08-23 19-50-07.png", "module-intro"),
        (MRC / "src/ml/outputs/shap/importance_north_onset_14d.png", "shap-importance"),
        (MRC / "src/ml/outputs/figures/roc_north_onset_7d_random_forest.png", "roc"),
        (MRC / "src/ml/outputs/figures/pr_north_onset_14d_xgboost.png", "pr"),
    ],
}


def save(src: Path, dest: Path, width: int, quality: int) -> int:
    im = ImageOps.exif_transpose(Image.open(src))
    im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=quality, method=6)
    return dest.stat().st_size


def main() -> None:
    import sys
    only = set(sys.argv[1:])  # optional: slugs to process
    total = 0
    for slug, items in IMAGES.items():
        if only and slug not in only:
            continue
        for src, name in items:
            if not src.exists():
                print(f"MISSING {src}")
                continue
            total += save(src, OUT / slug / f"{name}.webp", 1600, 80)
            total += save(src, OUT / slug / f"{name}-thumb.webp", 640, 72)
    print(f"total {total / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
