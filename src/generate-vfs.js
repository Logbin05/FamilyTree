import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fontPath = join(__dirname, "./assets/fonts/MontserratAlternates.ttf");
const fontData = readFileSync(fontPath).toString("base64");

const vfs = {
  "MontserratAlternates.ttf": fontData,
};

writeFileSync(
  join(__dirname, "./assets/fonts/vfs_custom_font.js"),
  "export const vfs = " + JSON.stringify(vfs) + ";"
);

console.log("vfs_custom_font.js успешно создан!");
