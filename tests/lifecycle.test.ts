// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
it("restores ambient after Chrome back-forward cache navigation", async () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect() {},
  } as any);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  const changed = new Set<any>(),
    messages = new Set<any>();
  vi.stubGlobal("chrome", {
    storage: {
      local: { get: async () => ({}), set: async () => {} },
      onChanged: {
        addListener: (fn: any) => changed.add(fn),
        removeListener: (fn: any) => changed.delete(fn),
      },
    },
    runtime: {
      id: "luma-test",
      onMessage: {
        addListener: (fn: any) => messages.add(fn),
        removeListener: (fn: any) => messages.delete(fn),
      },
    },
  });
  window.history.replaceState({}, "", "/watch?v=bfcache");
  document.body.innerHTML = '<div id="movie_player"><video></video></div>';
  await import("../src/content/index");
  await new Promise((r) => setTimeout(r, 0));
  expect(document.querySelectorAll(".luma-ambient-canvas")).toHaveLength(1);
  window.dispatchEvent(
    new PageTransitionEvent("pagehide", { persisted: true }),
  );
  expect(document.querySelectorAll(".luma-ambient-canvas")).toHaveLength(0);
  window.dispatchEvent(
    new PageTransitionEvent("pageshow", { persisted: true }),
  );
  await new Promise((r) => setTimeout(r, 0));
  expect(document.querySelectorAll(".luma-ambient-canvas")).toHaveLength(1);
  expect(messages.size).toBe(1);
  window.dispatchEvent(new PageTransitionEvent("pagehide"));
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
