import type { EdgeProps } from "@type/edge";

export function Edge({ from, to }: EdgeProps) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="#4ade80"
      strokeWidth={2}
    />
  );
}
