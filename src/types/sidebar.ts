/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NodeProps } from "./node";
import type { Link } from "./canvas_area";

export interface SidebarProps {
  nodes: NodeProps[];
  edges?: Link[];
  onAddedNode: () => void;
  selectedNode?: NodeProps;
  isOpen: boolean;
  onToggle: () => void;
  onRemoveNode: (id: number) => void;
  onChangeName: (name: string) => void;
  onLoadNodes: (data: { nodes: any[]; edges: Link[] }) => void;
  onSaveNode: (id: number, data: Partial<NodeProps["node"]>) => void;
}
