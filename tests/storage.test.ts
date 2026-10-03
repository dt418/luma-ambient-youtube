import { it, expect } from "vitest";
import { SettingsStore, type StorageBackend } from "../src/shared/storage";
it("reads old edge objects and merges granular pending edge events", async () => {
  let resolve!: (v: Record<string, unknown>) => void,
    listener!: (v: Record<string, unknown>) => void;
  const s = new SettingsStore({
    read: () => new Promise((r) => (resolve = r)),
    async write() {},
    listen(fn) {
      listener = fn;
      return () => {};
    },
  });
  const pending = s.get();
  listener({ "ambient.v1.edges.top": false });
  listener({ "ambient.v1.edges.left": false });
  resolve({
    "ambient.v1.edges": { top: true, right: false, bottom: true, left: true },
  });
  expect((await pending).edges).toEqual({
    top: false,
    right: false,
    bottom: true,
    left: false,
  });
  s.destroy();
});
function backend(): StorageBackend {
  let data: Record<string, unknown> = { unrelated: "keep" };
  const subs = new Set<(changes: Record<string, unknown>) => void>();
  return {
    async read() {
      return { ...data };
    },
    async write(p) {
      data = { ...data, ...p };
      subs.forEach((fn) => fn(p));
    },
    listen(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
}
it("merges different keys from two independent tabs without losing changes", async () => {
  const b = backend();
  const a = new SettingsStore(b),
    c = new SettingsStore(b);
  await Promise.all([a.get(), c.get()]);
  await Promise.all([a.patch({ intensity: 0.2 }), c.patch({ enabled: false })]);
  expect(await a.get()).toMatchObject({ intensity: 0.2, enabled: false });
  expect(await c.get()).toMatchObject({ intensity: 0.2, enabled: false });
  await a.reset();
  expect((await b.read()).unrelated).toBe("keep");
  expect((await c.get()).enabled).toBe(true);
});
it("propagates failed writes instead of pretending the setting is saved", async () => {
  const b = backend();
  b.write = async () => {
    throw Error("storage unavailable");
  };
  const s = new SettingsStore(b);
  await expect(s.patch({ enabled: false })).rejects.toThrow(
    "storage unavailable",
  );
  expect((await s.get()).enabled).toBe(true);
});
it("keeps events that arrive while the initial disk read is pending", async () => {
  let resolveRead!: (v: Record<string, unknown>) => void;
  let listener!: (v: Record<string, unknown>) => void;
  const b: StorageBackend = {
    read: () =>
      new Promise((r) => {
        resolveRead = r;
      }),
    async write(p) {
      listener(p);
    },
    listen(fn) {
      listener = fn;
      return () => {};
    },
  };
  const s = new SettingsStore(b);
  const pending = s.get();
  listener({ "ambient.v1.enabled": false });
  resolveRead({ "ambient.v1.enabled": true });
  expect((await pending).enabled).toBe(false);
});
