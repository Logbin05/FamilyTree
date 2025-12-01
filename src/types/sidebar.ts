import type { NodeProps } from "./node";

export interface SidebarProps {
  nodes: NodeProps[];
  onAddedNode: () => void;
  selectedNode?: NodeProps;
  isOpen: boolean;
  onToggle: () => void;
  onRemoveNode: (id: number) => void;
  onChangeName: (name: string) => void;
  onSaveNode: (id: number, data: Partial<NodeProps["node"]>) => void;
}
