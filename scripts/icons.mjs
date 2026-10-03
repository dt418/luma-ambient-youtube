import { deflateSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
function crc(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
  }
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(name, data) {
  const t = Buffer.from(name),
    body = Buffer.concat([t, data]),
    out = Buffer.alloc(body.length + 8);
  out.writeUInt32BE(data.length);
  body.copy(out, 4);
  out.writeUInt32BE(crc(body), out.length - 4);
  return out;
}
function icon(size) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size,
        ny = y / size;
      const i = y * (size * 4 + 1) + 1 + x * 4;
      const glow = Math.exp(-((nx - 0.7) ** 2 + (ny - 0.3) ** 2) * 8);
      let color = [12 + glow * 20, 20 + glow * 47, 31 + glow * 60];
      const letter =
        (nx > 0.29 && nx < 0.43 && ny > 0.26 && ny < 0.72) ||
        (nx > 0.29 && nx < 0.71 && ny > 0.61 && ny < 0.75);
      if (letter) color = [214, 244, 248];
      const distance = Math.hypot(nx - 0.73, ny - 0.28);
      if (distance < 0.045) color = [145, 218, 229];
      const cx = Math.max(0.19, Math.min(0.81, nx)),
        cy = Math.max(0.19, Math.min(0.81, ny));
      const inside = Math.hypot(nx - cx, ny - cy) < 0.185;
      raw[i] = color[0];
      raw[i + 1] = color[1];
      raw[i + 2] = color[2];
      raw[i + 3] = inside ? 255 : 0;
    }
  }
  const head = Buffer.alloc(13);
  head.writeUInt32BE(size);
  head.writeUInt32BE(size, 4);
  head[8] = 8;
  head[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", head),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
export async function generateIcons(dir) {
  await mkdir(dir, { recursive: true });
  for (const size of [16, 48, 128])
    await writeFile(`${dir}/${size}.png`, icon(size));
}
