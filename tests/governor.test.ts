import { it, expect } from "vitest";
import { PerformanceGovernor } from "../src/ambient/governor";
it("degrades sustained expensive rendering and does not oscillate", () => {
  const g = new PerformanceGovernor("auto", "ultra");
  for (let t = 0; t < 5000; t += 50) g.record(8, t);
  expect(g.quality).toBe("eco");
  for (let t = 5000; t < 9000; t += 50) g.record(1, t);
  expect(g.quality).toBe("eco");
  for (let t = 9000; t < 30000; t += 50) g.record(1, t);
  expect(g.quality).toBe("balanced");
});
it("respects manual quality and an eco ceiling", () => {
  const manual = new PerformanceGovernor("ultra", "ultra");
  for (let t = 0; t < 20000; t += 50) manual.record(50, t);
  expect(manual.quality).toBe("ultra");
  const capped = new PerformanceGovernor("auto", "eco");
  for (let t = 0; t < 30000; t += 50) capped.record(1, t);
  expect(capped.quality).toBe("eco");
});
