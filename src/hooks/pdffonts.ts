import { loadTTF } from "./loadfont";
import pdfMake from "pdfmake/build/pdfmake";

export const vfs: Record<string, string> = {};

export const fonts = {
  Montserrat: {
    normal: "Montserrat-Regular.ttf",
    bold: "Montserrat-Bold.ttf",
  },
};

export async function initPDF() {
  const regularBase64 = await loadTTF("/fonts/Montserrat-Regular.ttf");
  const boldBase64 = await loadTTF("/fonts/Montserrat-Bold.ttf");

  vfs["Montserrat-Regular.ttf"] = regularBase64;
  vfs["Montserrat-Bold.ttf"] = boldBase64;

  pdfMake.vfs = vfs;
  pdfMake.fonts = fonts;
}
