import type { SVGProps } from "react";

// ── Line-icon set ────────────────────────────────────────────────────────
// Consistent 24×24 stroke icons that inherit color via `currentColor`, so
// they pick up the surrounding gold theme. Replaces emojis for a cleaner,
// more professional look. Pass `size` (default 24) and any svg props.

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 24, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </Base>
  );
}

export function PuzzleIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M19.44 7.85c-.05.32.06.65.29.88l1.56 1.57c.47.47.71 1.08.71 1.7s-.24 1.23-.71 1.7l-1.61 1.61a.98.98 0 0 1-.84.28c-.47-.07-.8-.48-.96-.93a2.5 2.5 0 1 0-3.22 3.22c.45.17.86.5.93.97a.98.98 0 0 1-.28.84l-1.61 1.61c-.47.47-1.08.7-1.7.7s-1.23-.23-1.7-.7l-1.57-1.57a1.03 1.03 0 0 0-.88-.29c-.49.08-.84.5-1.02.97a2.5 2.5 0 1 1-3.24-3.24c.47-.18.9-.53.97-1.02a1.03 1.03 0 0 0-.29-.88L2.7 13.7A2.4 2.4 0 0 1 2 12c0-.62.24-1.23.71-1.7L4.23 8.77c.24-.24.58-.35.92-.3.51.08.87.53 1.07 1.01a2.5 2.5 0 1 0 3.26-3.26c-.48-.2-.93-.56-1.01-1.07a1.03 1.03 0 0 1 .3-.92l1.53-1.52A2.4 2.4 0 0 1 12 2c.62 0 1.23.24 1.7.71l1.53 1.52c.23.23.56.34.88.29.49-.07.84-.5 1.02-.97a2.5 2.5 0 1 1 3.24 3.24c-.47.18-.9.53-.97 1.02z" />
    </Base>
  );
}

export function FilmIcon(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M3 15h18M9 4v16M15 4v16" />
    </Base>
  );
}

export function SparkIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 2.5 13.7 9 20 12l-6.3 3L12 21.5 10.3 15 4 12l6.3-3z" />
    </Base>
  );
}

export function SunriseIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 3v5M3.5 14h1.2M19.3 14h1.2M6.3 9.3l.85.85M17.7 9.3l-.85.85M8 7l4-4 4 4" />
      <path d="M2 18h20" />
      <path d="M7 18a5 5 0 0 1 10 0" />
    </Base>
  );
}

export function HeartIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
    </Base>
  );
}

export function ScrollIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M15 12H9M15 8H9" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M8 21h11a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
    </Base>
  );
}

export function UsersIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Base>
  );
}

export function LightbulbIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M9 18h6M10 22h4" />
      <path d="M15.1 14c.18-.98.65-1.74 1.4-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.4 2.5" />
    </Base>
  );
}

export function SpiralIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 12a1 1 0 1 0 1 1m1.5-2.8a4 4 0 1 0 1.2 2.8m1.4-5a8 8 0 1 0 2.4 5.7" />
    </Base>
  );
}

export function VolumeOnIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
    </Base>
  );
}

export function VolumeOffIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M22 9l-6 6M16 9l6 6" />
    </Base>
  );
}
