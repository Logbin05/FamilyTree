/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NodeProps } from "./node";
import type { Link } from "./canvas_area";

export interface SidebarProps {
  nodes: NodeProps[];
  edges?: Link[];
  isOpen: boolean;
  onToggle: () => void;
  selectedNode?: NodeProps;
  onRemoveNode: (id: number) => void;
  onChangeName: (name: string) => void;
  onAddedNode: (type: "parent" | "child") => void;
  onLoadNodes: (data: { nodes: any[]; edges: Link[] }) => void;
}
