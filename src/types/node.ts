export interface NodeProps {
  node: {
    id: number;
    name: string;
    x: number;
    y: number;
    age?: number;
    birthYear?: string | number;
    location?: string;
    biography?: string;
  };
  onMouseDown: (id: number) => void;
}
