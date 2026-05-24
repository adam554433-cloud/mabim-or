type Props = {
  size?: number;
  className?: string;
  noAnimate?: boolean;
  glow?: boolean;
};

const PATH = "M0,-40 Q4,-6 40,0 Q4,6 0,40 Q-4,6 -40,0 Q-4,-6 0,-40 Z";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return idCounter;
}

export default function SparkleIcon({
  size = 20,
  className = "",
  noAnimate = false,
  glow = true,
}: Props) {
  const id = `sparkle-grad-${nextId()}`;
  return (
    <svg
      viewBox="-50 -50 100 100"
      width={size}
      height={size}
      className={`${noAnimate ? "" : "sparkle-icon"} ${className}`}
      style={
        glow
          ? {
              filter:
                "drop-shadow(0 0 6px rgba(251,191,36,0.75)) drop-shadow(0 0 12px rgba(251,191,36,0.4))",
            }
          : undefined
      }
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="0" y1="-1" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="55%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path d={PATH} fill={`url(#${id})`} />
    </svg>
  );
}
