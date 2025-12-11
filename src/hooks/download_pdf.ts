/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NodeProps } from "@type/node";
import type { Link } from "@type/canvas_area";
import pdfMake from "pdfmake/build/pdfmake";
import { downloadGraphAsJson } from "./save";
import pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export async function DownloadPDF(nodes: NodeProps[], edges: Link[] = [], _p0?: SVGSVGElement) {
  downloadGraphAsJson(nodes, edges);

  const content: any[] = [];

  if (nodes.length > 0) {
    const svgWidth = 900;
    const svgHeight = 700;

    const minX = Math.min(...nodes.map((n) => n.node.x));
    const maxX = Math.max(...nodes.map((n) => n.node.x));
    const minY = Math.min(...nodes.map((n) => n.node.y));
    const maxY = Math.max(...nodes.map((n) => n.node.y));

    const scaleX = (svgWidth - 60) / (maxX - minX || 1);
    const scaleY = (svgHeight - 60) / (maxY - minY || 1);
    const scale = Math.min(scaleX, scaleY, 1);

    const offsetX = (svgWidth - (maxX - minX) * scale) / 2 - minX * scale;
    const offsetY = (svgHeight - (maxY - minY) * scale) / 2 - minY * scale;

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("width", svgWidth.toString());
    svgEl.setAttribute("height", svgHeight.toString());

    const linkGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.node.id === edge.from);
      const toNode = nodes.find((n) => n.node.id === edge.to);
      if (!fromNode || !toNode) return;

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", (fromNode.node.x * scale + offsetX).toString());
      line.setAttribute("y1", (fromNode.node.y * scale + offsetY).toString());
      line.setAttribute("x2", (toNode.node.x * scale + offsetX).toString());
      line.setAttribute("y2", (toNode.node.y * scale + offsetY).toString());
      line.setAttribute("stroke", "#999");
      line.setAttribute("stroke-width", "2");
      linkGroup.appendChild(line);
    });
    svgEl.appendChild(linkGroup);

    const nodeGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    nodes.forEach((n) => {
      const cx = n.node.x * scale + offsetX;
      const cy = n.node.y * scale + offsetY;

      const radius = Math.max(8, 20 * scale);
      const fontSize = Math.max(8, 12 * scale);

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", cx.toString());
      circle.setAttribute("cy", cy.toString());
      circle.setAttribute("r", radius.toString());
      circle.setAttribute("fill", "#ff6b6b");
      nodeGroup.appendChild(circle);

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", cx.toString());
      text.setAttribute("y", (cy + fontSize / 3).toString());
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", fontSize.toString() + "px");
      text.setAttribute("fill", "#000");
      text.textContent = n.node.name;
      nodeGroup.appendChild(text);
    });
    svgEl.appendChild(nodeGroup);

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    canvas.width = svgWidth;
    canvas.height = svgHeight;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;

    await new Promise<void>((resolve) => {
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        const pngDataUrl = canvas.toDataURL("image/png");
        content.push({
          image: pngDataUrl,
          width: 555,
          margin: [20, 20, 20, 20],
          pageBreak: "after",
        });
        URL.revokeObjectURL(url);
        resolve();
      };
    });
  }

  content.push({
    text: ">----------<[ Family Tree ]>----------<",
    fontSize: 24,
    alignment: "center",
    margin: [0, 10, 0, 20],
  });
  content.push({ text: "Описание семьи", fontSize: 18, margin: [0, 0, 0, 10] });

  nodes.forEach((n) => {
    content.push({ text: `Имя: ${n.node.name}`, fontSize: 12 });
    if (n.node.birthDate)
      content.push({ text: `Год рождения: ${n.node.birthDate}`, fontSize: 12 });
    if (n.node.location)
      content.push({
        text: `Место рождения: ${n.node.location}`,
        fontSize: 12,
      });
    if (n.node.biography)
      content.push(
        { text: "Биография:", fontSize: 12, bold: true },
        { text: n.node.biography, fontSize: 12 }
      );
    content.push({
      text: "------------------------------------------------------",
      fontSize: 12,
      margin: [0, 5, 0, 10],
    });
  });

  pdfMake
    .createPdf({ pageSize: "A4", pageMargins: [20, 20, 20, 20], content })
    .download("family_tree.pdf");
}
