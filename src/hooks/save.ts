import type { NodeProps } from "@type/node";
import type { Link } from "@type/canvas_area";

export function downloadGraphAsJson(nodes: NodeProps[], edges?: Link[]) {
  const normalizedNodes = nodes.map((n) => n.node);

  const json = JSON.stringify(
    {
      nodes: normalizedNodes,
      edges: edges,
    },
    null,
    2
  );

  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "family_tree.json";
  a.click();
  URL.revokeObjectURL(url);
}
