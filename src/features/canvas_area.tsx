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
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [editingNodeID, setEditingNodeID] = useState<number | null>(null);

  const CANVAS_SIZE = 5000;
  const NODE_RADIUS = 30;

  function onMouseDownNode(id: number) {
    setDraggingNode(id);
    onSelectNode(id);
  }

  function onDoubleClickNode(id: number) {
    setEditingNodeID(id);
  }

  function handleTapNode(nodeID: number) {
    setEditingNodeID(nodeID);
    onSelectNode(nodeID);
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

  function startPanOrDrag(x: number, y: number, targetNodeID?: number) {
    if (targetNodeID !== undefined) {
      setDraggingNode(targetNodeID);
      onSelectNode(targetNodeID);
    } else {
      setPanning(true);
    }
    setLastPos({ x, y });
    setEditingNodeID(null);
  }

  function movePanOrDrag(x: number, y: number) {
    if (draggingNode !== null && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      let nodeX = (x - rect.left) / zoom;
      let nodeY = (y - rect.top) / zoom;

      nodeX = Math.max(NODE_RADIUS, Math.min(CANVAS_SIZE - NODE_RADIUS, nodeX));
      nodeY = Math.max(NODE_RADIUS, Math.min(CANVAS_SIZE - NODE_RADIUS, nodeY));

      setNodes((prev) =>
        prev.map((n) =>
          n.node.id === draggingNode
            ? { ...n, node: { ...n.node, x: nodeX, y: nodeY } }
            : n
        )
      );
    } else if (panning && containerRef.current && lastPos) {
      const dx = lastPos.x - x;
      const dy = lastPos.y - y;
      containerRef.current.scrollLeft += dx;
      containerRef.current.scrollTop += dy;
    }
    setLastPos({ x, y });
  }

  function endPanOrDrag() {
    setDraggingNode(null);
    setPanning(false);
    setLastPos(null);
  }

  function onMouseDown(e: React.MouseEvent) {
    if (e.target === svgRef.current) startPanOrDrag(e.clientX, e.clientY);
  }
  function onMouseMove(e: React.MouseEvent) {
    movePanOrDrag(e.clientX, e.clientY);
  }
  function onMouseUp() {
    endPanOrDrag();
  }

  function onTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    if (!touch) return;
    if ((e.target as HTMLElement).tagName === "circle") {
      const nodeId = Number(
        (e.target as SVGCircleElement).parentElement?.getAttribute("data-id")
      );
      startPanOrDrag(touch.clientX, touch.clientY, nodeId);
    } else {
      startPanOrDrag(touch.clientX, touch.clientY);
    }
  }

  function onTouchMove(e: React.TouchEvent) {
    const touch = e.touches[0];
    if (!touch) return;
    movePanOrDrag(touch.clientX, touch.clientY);
  }

  function onTouchEnd() {
    endPanOrDrag();
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
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="cursor-pointer active:outline-secondary outline-1"
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
              data-id={n.node.id}
              onMouseDown={() => onMouseDownNode(n.node.id)}
              onDoubleClick={() => onDoubleClickNode(n.node.id)}
              onTouchStart={() => handleTapNode(n.node.id)}
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
