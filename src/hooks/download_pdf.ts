/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NodeProps } from "@type/node";
import pdfMake from "pdfmake/build/pdfmake";
import { downloadGraphAsJson } from "./save";
import type { Link } from "@type/canvas_area";
import pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export async function DownloadPDF(nodes: NodeProps[], edges: Link[] = [], svg?: SVGSVGElement) {
  downloadGraphAsJson(nodes, edges!);
  const content: any[] = [];

  if (svg) {
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = svg.clientWidth;
    canvas.height = svg.clientHeight;
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
  content.push({
    text: "Описание семьи",
    fontSize: 18,
    margin: [0, 0, 0, 10],
  });

  nodes.forEach((n) => {
    content.push({ text: `⏣ Имя: ${n.node.name}`, fontSize: 12 });
    if (n.node.birthYear)
      content.push({
        text: `Год рождения: ${n.node.birthYear}`,
        fontSize: 12,
      });
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
