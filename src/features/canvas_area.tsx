import { useRef, useState } from "react";
import { Edge } from "@features/components/edge";
import type { CanvasAreaProps } from "@type/canvas_area";
import { DynamicWatch } from "@components/nodes/dynamic_watch";
import type { NodeProps } from "@type/node";

export function CanvasArea({
  zoom,
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
  const [editingNodeID, setEditingNodeID] = useState<number | null>(null);

  const CANVAS_SIZE = 5000;

  function onMouseDownNode(id: number) {
    setDraggingNode(id);
    onSelectNode(id);
  }

  function onDoubleClickNode(id: number) {
    setEditingNodeID(id);
  }

  function handleChangeNode(
    nodeId: number,
    data: Partial<Omit<NodeProps["node"], "id" | "x" | "y">>
  ) {
    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.node.id === nodeId ? { ...n, node: { ...n.node, ...data } } : n
      )
    );
  }


  function onMouseDownCanvas(e: React.MouseEvent) {
    if (e.target === svgRef.current) {
      setPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
      setEditingNodeID(null);
    }
  }

  function onMouseMove(e: React.MouseEvent) {
    if (draggingNode !== null && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;

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
  }

  function onMouseUp() {
    setDraggingNode(null);
    setPanning(false);
    setLastMousePos(null);
  }

  return (
    <main
      id="board"
      ref={containerRef}
      className="flex-1 m-4 rounded-2xl shadow-lg bg-white overflow-hidden relative"
    >
      <svg
        ref={svgRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
        onMouseDown={onMouseDownCanvas}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        className="cursor-grab active:outline-secondary outline-1"
      >
        {edges.map((edge, idx) => {
          const fromNode = nodes.find((n) => n.node.id === edge.from);
          const toNode = nodes.find((n) => n.node.id === edge.to);
          if (!fromNode || !toNode) return null;

          return <Edge key={idx} from={fromNode.node} to={toNode.node} />;
        })}

        {nodes.map((n) => {
          const isSelected = n.node.id === selectedNodeID;
          return (
            <g
              key={n.node.id}
              onMouseDown={() => onMouseDownNode(n.node.id)}
              onDoubleClick={() => onDoubleClickNode(n.node.id)}
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

              {editingNodeID === n.node.id && (
                <foreignObject
                  x={n.node.x + 40}
                  y={n.node.y - 50}
                  width={250}
                  height={300}
                >
                  <DynamicWatch
                    node={n.node}
                    onChange={(data) => handleChangeNode(n.node.id, data)}
                  />
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </main>
  );
}
