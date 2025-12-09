import type { NodeProps } from "./node";

export interface Link {
  from: number;
  to: number;
}

export interface CanvasAreaProps {
  zoom: number;
  edges: Link[];
  nodes: NodeProps[];
  setNodes: React.Dispatch<React.SetStateAction<NodeProps[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Link[]>>;
  onSelectNode: (id: number) => void;
  selectedNodeID: number | null;
}
