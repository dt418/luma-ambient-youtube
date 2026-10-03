import {
  EDGES,
  type RGB,
  type AmbientFrame,
  type CropBounds,
  type Settings,
} from "../shared/types";
export function luminance(c: RGB) {
  return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
}
export function adjustColor(c: RGB, s: Settings): RGB {
  const mean = (c[0] + c[1] + c[2]) / 3;
  const sat =
    s.saturation + s.vibrance * (1 - (Math.max(...c) - Math.min(...c)) / 255);
  return c.map((v) =>
    Math.min(
      255 * s.highlightLimit,
      Math.max(0, (mean + (v - mean) * sat) * s.brightness),
    ),
  ) as unknown as RGB;
}
export function smoothColor(a: RGB, b: RGB, delta: number, fade: number): RGB {
  const mix = fade === 0 ? 1 : 1 - Math.exp(-Math.max(0, delta) / fade);
  return a.map((v, i) => v + (b[i] - v) * mix) as unknown as RGB;
}
export function extractFrame(
  p: Uint8ClampedArray,
  w: number,
  h: number,
  c: CropBounds,
  timestamp: number,
): AmbientFrame {
  const sample = (x0: number, y0: number, x1: number, y1: number): RGB => {
    const sums = [0, 0, 0];
    let n = 0;
    for (
      let y = Math.max(0, Math.floor(y0));
      y < Math.min(h, Math.max(Math.floor(y0) + 1, Math.ceil(y1)));
      y++
    )
      for (
        let x = Math.max(0, Math.floor(x0));
        x < Math.min(w, Math.max(Math.floor(x0) + 1, Math.ceil(x1)));
        x++
      ) {
        const i = (y * w + x) * 4;
        for (let k = 0; k < 3; k++) sums[k] += p[i + k];
        n++;
      }
    return sums.map((v) => Math.round(v / Math.max(1, n))) as unknown as RGB;
  };
  const edges = {} as AmbientFrame["edges"];
  for (const e of EDGES) {
    edges[e] = [];
    for (let i = 0; i < 6; i++) {
      const a = i / 6,
        b = (i + 1) / 6;
      let box: number[];
      if (e === "top")
        box = [
          c.x + c.width * a,
          c.y,
          c.x + c.width * b,
          c.y + Math.max(1, c.height * 0.08),
        ];
      else if (e === "bottom")
        box = [
          c.x + c.width * a,
          c.y + c.height - Math.max(1, c.height * 0.08),
          c.x + c.width * b,
          c.y + c.height,
        ];
      else if (e === "left")
        box = [
          c.x,
          c.y + c.height * a,
          c.x + Math.max(1, c.width * 0.08),
          c.y + c.height * b,
        ];
      else
        box = [
          c.x + c.width - Math.max(1, c.width * 0.08),
          c.y + c.height * a,
          c.x + c.width,
          c.y + c.height * b,
        ];
      edges[e].push(sample(box[0], box[1], box[2], box[3]));
    }
  }
  const list = EDGES.flatMap((e) => edges[e]);
  const accent = [0, 1, 2].map(
    (k) => list.reduce((s, c) => s + c[k], 0) / list.length,
  ) as unknown as RGB;
  return {
    timestamp,
    edges,
    luminance: luminance(accent),
    accent,
    changed: true,
  };
}
