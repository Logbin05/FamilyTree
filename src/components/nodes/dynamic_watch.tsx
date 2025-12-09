/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import type { NodeProps } from "@type/node";

interface DynamicWatchProps {
  node: NodeProps["node"];
  onChange: (data: Partial<Omit<NodeProps["node"], "id" | "x" | "y">>) => void;
}

export function DynamicWatch({ node, onChange }: DynamicWatchProps) {
  const editableKeys: (keyof Omit<NodeProps["node"], "id" | "x" | "y">)[] = [
    "name",
    "birthYear",
    "location",
    "biography",
  ];

  const labels: Record<(typeof editableKeys)[number], string> = {
    name: "Имя",
    birthYear: "Год рождения",
    location: "Место жительства",
    biography: "Биография",
  };

  const [formData, setFormData] = useState<
    Partial<
      Record<keyof Omit<NodeProps["node"], "id" | "x" | "y">, string | number>
    >
  >({});

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialData: Partial<
      Record<keyof Omit<NodeProps["node"], "id" | "x" | "y">, string | number>
    > = {};
    editableKeys.forEach((key) => {
      const value = node[key];
      initialData[key] = value !== undefined ? value : "";
    });
    setFormData(initialData);
  }, [node, editableKeys]);

  function handleChange(
    key: keyof Omit<NodeProps["node"], "id" | "x" | "y">,
    value: string
  ) {
    let parsedValue: string | number = value;
    if (key === "birthYear") {
      const n = Number(value);
      parsedValue = isNaN(n) ? "" : n;
    }

    setFormData((prev) => ({ ...prev, [key]: parsedValue }));
    onChange({ [key]: parsedValue });
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    if (containerRef.current) {
      const rect = e.target.getBoundingClientRect();
      containerRef.current.scrollTo({
        top: rect.y -2523,
        behavior: "smooth",
      });
    }
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={(e) => e.stopPropagation()}
      className="p-2 bg-wrapper rounded-lg shadow-sm flex flex-col gap-2 w-full max-w-xs sm:max-w-sm"
    >
      {editableKeys.map((key) => (
        <div key={key} className="grid grid-cols-2 gap-2">
          <label className="text-sm font-medium text-white">
            {labels[key]}
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
