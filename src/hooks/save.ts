import type { NodeProps } from "@type/node";

export function downloadNodesAsJson(nodes: NodeProps[]) {
  const json = JSON.stringify(nodes, null, 2);
  const blob = new Blob([json], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "family_tree.json";
  a.click();

  URL.revokeObjectURL(url);
}
