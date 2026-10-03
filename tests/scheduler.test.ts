// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { Scheduler } from "../src/ambient/scheduler";
it.each([12, 24, 30])("throttles to %i fps and cancels pending work", (fps) => {
  vi.useFakeTimers();
  const v = { currentTime: 0 } as HTMLVideoElement;
  let calls = 0;
  const s = new Scheduler();
  s.setFps(fps);
  s.start(v, () => calls++);
  for (let t = 0; t < 1000; t += 10) {
    v.currentTime = t / 1000;
    vi.advanceTimersByTime(10);
  }
  expect(calls).toBeLessThanOrEqual(fps);
  expect(calls).toBeGreaterThan(0);
  s.pause();
  expect(vi.getTimerCount()).toBe(0);
  s.destroy();
  vi.useRealTimers();
});
