/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import type { NodeProps } from "@type/node";

const EDITABLE_KEYS: (keyof Omit<NodeProps["node"], "id" | "x" | "y">)[] = [
  "name",
  "birthDate",
  "location",
  "biography",
];

const LABELS = {
  name: "Имя",
  birthDate: "Дата рождения",
  location: "Место жительства",
  biography: "Биография",
} as const;

interface DynamicWatchProps {
  node: NodeProps["node"];
  onChange: (data: Partial<Omit<NodeProps["node"], "id" | "x" | "y">>) => void;
}

export function DynamicWatch({ node, onChange }: DynamicWatchProps) {
  const [formData, setFormData] = useState<
    Partial<Record<keyof typeof LABELS, string>>
  >({});

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialData: any = {};
    EDITABLE_KEYS.forEach((key) => {
      initialData[key] = node[key] ?? "";
    });
    setFormData(initialData);
  }, [node]);

  function handleChange(key: keyof typeof LABELS, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    onChange({ [key]: value });
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    if (!containerRef.current) return;

    const rect = e.target.getBoundingClientRect();

    containerRef.current.scrollTo({
      top: rect.y - 250,
      behavior: "smooth",
    });
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className="p-2 bg-wrapper rounded-lg shadow-sm flex  flex-col gap-2 w-full max-w-xs sm:max-w-sm"
    >
      {EDITABLE_KEYS.map((key) => (
        <div key={key} className="grid grid-cols-2 gap-2">
          <label className="text-sm font-medium text-white">
            {LABELS[key]}
          </label>

          <input
            type="text"
            value={formData[key] ?? ""}
            onChange={(e) => handleChange(key, e.target.value)}
            onFocus={handleFocus}
            className="border rounded px-2 py-1 text-white w-full"
          />
        </div>
      ))}
    </div>
  );
}
