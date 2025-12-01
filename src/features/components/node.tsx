import type { NodeProps } from "@type/node";

export function Node({ node, onMouseDown }: NodeProps) {
  return (
    <g onMouseDown={() => onMouseDown(node.id)} className="cursor-grab">
      <circle cx={node.x} cy={node.y} r={30} fill="#22c55e" />
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="white"
        fontWeight="bold"
      >
        {node.name}
      </text>
    </g>
  );
}
