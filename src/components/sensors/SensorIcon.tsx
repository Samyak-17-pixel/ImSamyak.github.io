import type { SensorId } from "@/content/sections";

/** The dive sensors plus vehicle-only payloads that have no section of their own. */
export type IconId = SensorId | "camera";

const paths: Record<IconId, JSX.Element> = {
  usbl: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <circle cx="12" cy="12" r="6.5" opacity=".55" />
    </>
  ),
  imu: (
    <>
      <path d="M12 4v8l6 4" />
      <path d="M12 12l-6 4" />
      <circle cx="12" cy="12" r="1.6" />
      <path d="M4 20h16" opacity=".5" />
    </>
  ),
  depth: (
    <>
      <path d="M12 3v15" />
      <path d="M8 14l4 4 4-4" />
      <path d="M5 21h14" opacity=".55" />
      <path d="M7 6h3M7 9h2" opacity=".55" />
    </>
  ),
  imaging: (
    <>
      <path d="M12 20L4.5 7.5A14 14 0 0 1 19.5 7.5Z" />
      <path d="M12 20L8 11M12 20l4-9" opacity=".5" />
    </>
  ),
  fls: (
    <>
      <path d="M4 18h3" />
      <path d="M9 12a8 8 0 0 1 0 12" transform="translate(0 -6)" />
      <path d="M13 9a11 11 0 0 1 0 12" transform="translate(0 -3)" opacity=".7" />
      <path d="M17 6a14 14 0 0 1 0 12" opacity=".45" />
    </>
  ),
  dvl: (
    <>
      <rect x="8" y="3" width="8" height="5" rx="1.5" />
      <path d="M10 8L5 20M14 8l5 12M11.3 8L10 20M12.7 8L14 20" opacity=".7" />
    </>
  ),
  sidescan: (
    <>
      <rect x="10" y="4" width="4" height="16" rx="2" />
      <path d="M8 8L3 6v12l5-2M16 8l5-2v12l-5-2" opacity=".6" />
    </>
  ),
  transponder: (
    <>
      <circle cx="6" cy="7" r="1.8" />
      <circle cx="18" cy="7" r="1.8" />
      <circle cx="12" cy="18" r="1.8" />
      <path d="M7.5 8.2l3.4 8.2M16.5 8.2l-3.4 8.2M7.8 7h8.4" opacity=".5" strokeDasharray="2 2" />
    </>
  ),
  modem: (
    <>
      <path d="M3 12c1.5-4 3-4 4.5 0s3 4 4.5 0 3-4 4.5 0 3 4 4.5 0" />
      <path d="M12 3v3M12 18v3" opacity=".5" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4Z" />
      <circle cx="12" cy="13.2" r="3.4" />
      <circle cx="12" cy="13.2" r="1" opacity=".55" />
    </>
  ),
};

export function SensorIcon({ id, size = 16 }: { id: IconId; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[id]}
    </svg>
  );
}
