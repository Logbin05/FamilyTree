import { useRef, useState, useEffect } from "react";
import { Edge } from "@features/components/edge";
import type { CanvasAreaProps } from "@type/canvas_area";

export function CanvasArea({
  nodes,
  edges,
  setNodes,
  onSelectNode,
  selectedNodeID,
}: CanvasAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingNode, setDraggingNode] = useState<number | null>(null);
  const [panning, setPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const CANVAS_SIZE = 5000;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft =
        CANVAS_SIZE / 2 - containerRef.current.clientWidth / 2;
      containerRef.current.scrollTop =
        CANVAS_SIZE / 2 - containerRef.current.clientHeight / 2;
    }
  }, []);

  function onMouseDownNode(id: number) {
    setDraggingNode(id);
    onSelectNode(id);
  }

  function onMouseDownCanvas(e: React.MouseEvent) {
    if (e.target === svgRef.current) {
      setPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (draggingNode !== null && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setNodes((prev) =>
        prev.map((n) =>
          n.node.id === draggingNode ? { ...n, node: { ...n.node, x, y } } : n
        )
      );
    } else if (panning && containerRef.current && lastMousePos) {
      const dx = lastMousePos.x - e.clientX;
      const dy = lastMousePos.y - e.clientY;

      containerRef.current.scrollLeft += dx;
      containerRef.current.scrollTop += dy;

      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const onMouseUp = () => {
    setDraggingNode(null);
    setPanning(false);
    setLastMousePos(null);
  };

  return (
    <main
      className="flex-1 m-4 rounded-2xl shadow-lg bg-white overflow-hidden"
      ref={containerRef}
    >
      <svg
        ref={svgRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onMouseDown={onMouseDownCanvas}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        className="cursor-grab active:outline-secondary outline-1"
      >
        {edges.map((edge, idx) => {
          const fromNode = nodes.find((n) => n.node.id === edge.from);
          const toNode = nodes.find((n) => n.node.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <Edge
              key={idx}
              from={{ x: fromNode.node.x, y: fromNode.node.y }}
              to={{ x: toNode.node.x, y: toNode.node.y }}
            />
          );
        })}

        {nodes.map((n) => {
          const isSelected = n.node.id === selectedNodeID;
          return (
            <g
              key={n.node.id}
              onMouseDown={() => onMouseDownNode(n.node.id)}
              className="cursor-grab"
            >
              <circle
                cx={n.node.x}
                cy={n.node.y}
                r={30}
                fill={isSelected ? "#17613d" : "#22c55e"}
                stroke={isSelected ? "#22c55e" : "none"}
                strokeWidth={isSelected ? 3 : 0}
              />
              <text
                x={n.node.x}
                y={n.node.y + 40}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="black"
                fontWeight="bold"
              >
                {n.node.name}
              </text>
            </g>
          );
        })}
      </svg>
    </main>
  );
}
