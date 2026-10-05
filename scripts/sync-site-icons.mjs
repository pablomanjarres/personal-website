import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(resolve(root, "app/icon.svg"));
const sizes = [16, 32, 48, 64];
const rasterize = size => sharp(source, { density: size * 72 / 64 }).resize(size, size).png().toBuffer();
const images = await Promise.all(sizes.map(rasterize));
const header = Buffer.alloc(6 + images.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
for (const [index, image] of images.entries()) {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
}
await writeFile(resolve(root, "app/favicon.ico"), Buffer.concat([header, ...images]));
await writeFile(resolve(root, "app/apple-icon.png"), await rasterize(180));
console.log("Updated browser and Apple icons from app/icon.svg.");
