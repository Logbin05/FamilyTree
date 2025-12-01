export interface NodeProps {
  node: {
    id: number;
    name: string;
    x: number;
    y: number;
    avatar?: string;
    age?: number;
    birthYear?: string | number;
    location?: string;
    biography?: string;
  };
  onMouseDown: (id: number) => void;
}
