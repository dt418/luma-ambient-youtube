import { it, expect } from "vitest";
import { BlackBarDetector } from "../src/ambient/black-bars";
function frame(kind: string) {
  const p = new Uint8ClampedArray(100 * 80 * 4);
  for (let y = 0; y < 80; y++)
    for (let x = 0; x < 100; x++) {
      const k = (y * 100 + x) * 4;
      const lit =
        kind === "bright" ||
        (kind === "letter" && y >= 10 && y < 70) ||
        (kind === "pillar" && x >= 10 && x < 90);
      p.set(lit ? [180, 150, 100, 255] : [0, 0, 0, 255], k);
    }
  return p;
}
it.each([
  ["letter", { x: 0, y: 10, width: 100, height: 60 }],
  ["pillar", { x: 10, y: 0, width: 80, height: 80 }],
  ["bright", { x: 0, y: 0, width: 100, height: 80 }],
  ["dark", { x: 0, y: 0, width: 100, height: 80 }],
])("detects %s without eating the image", (kind, want) => {
  const d = new BlackBarDetector(0.5);
  let c;
  for (let i = 0; i < 5; i++) c = d.detect(frame(kind as string), 100, 80);
  expect(c).toEqual(want);
});
it("requires stable evidence and holds crop during fade to black", () => {
  const d = new BlackBarDetector(0.5);
  expect(d.detect(frame("letter"), 100, 80).y).toBe(0);
  for (let i = 0; i < 4; i++) d.detect(frame("letter"), 100, 80);
  expect(d.detect(frame("dark"), 100, 80).y).toBe(10);
  d.reset();
  expect(d.detect(frame("dark"), 100, 80).y).toBe(0);
});
