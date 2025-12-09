export interface NodeProps {
  node: {
    id: number;
    name: string;
    x: number;
    y: number;
    birthYear?: string;
    location?: string;
    biography?: string;
  };
  onMouseDown: (id: number) => void;
}
