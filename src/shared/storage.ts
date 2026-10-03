import { normalizeSettings, DEFAULTS } from "./settings";
import { EDGES, type Settings } from "./types";
export type SettingsPatch = Omit<Partial<Settings>, "edges"> & {
  edges?: Partial<Settings["edges"]>;
};
function merge(
  a: object & { edges?: unknown },
  b: object & { edges?: unknown },
) {
  return {
    ...a,
    ...b,
    edges: { ...((a.edges as object) ?? {}), ...((b.edges as object) ?? {}) },
  };
}
export interface StorageBackend {
  read(): Promise<Record<string, unknown>>;
  write(values: Record<string, unknown>): Promise<void>;
  listen(fn: (changes: Record<string, unknown>) => void): () => void;
}
const PREFIX = "ambient.v1.";
export function chromeBackend(): StorageBackend {
  return {
    read: () => chrome.storage.local.get(null),
    write: (values) => chrome.storage.local.set(values),
    listen(fn) {
      const cb = (
        changes: Record<string, chrome.storage.StorageChange>,
        area: string,
      ) => {
        if (area === "local")
          fn(
            Object.fromEntries(
              Object.entries(changes).map(([k, c]) => [k, c.newValue]),
            ),
          );
      };
      chrome.storage.onChanged.addListener(cb);
      return () => {
        try {
          chrome.storage.onChanged.removeListener(cb);
        } catch {
          /* context was invalidated */
        }
      };
    },
  };
}
export class SettingsStore {
  private state = normalizeSettings(null);
  private ready: Promise<void> | undefined;
  private loaded = false;
  private pending: Record<string, unknown> = {};
  private subscribers = new Set<(s: Settings) => void>();
  private writeQueue: Promise<void> = Promise.resolve();
  private off: () => void;
  constructor(private backend: StorageBackend = chromeBackend()) {
    this.off = backend.listen((changes) => {
      const patch = this.decode(changes);
      if (Object.keys(patch).length) {
        if (!this.loaded) this.pending = merge(this.pending, patch);
        const next = normalizeSettings(merge(this.state, patch));
        if (JSON.stringify(next) !== JSON.stringify(this.state)) {
          this.state = next;
          this.emit();
        }
      }
    });
  }
  private decode(values: Record<string, unknown>) {
    const decoded = Object.fromEntries(
      Object.entries(values)
        .filter(([k]) => k.startsWith(PREFIX))
        .map(([k, v]) => [k.slice(PREFIX.length), v]),
    );
    const edges = { ...((decoded.edges as object) ?? {}) } as Record<
      string,
      unknown
    >;
    for (const edge of EDGES) {
      if (`edges.${edge}` in decoded) edges[edge] = decoded[`edges.${edge}`];
      delete decoded[`edges.${edge}`];
    }
    if (Object.keys(edges).length) decoded.edges = edges;
    return decoded;
  }
  private emit() {
    for (const cb of this.subscribers) cb(normalizeSettings(this.state));
  }
  async get(): Promise<Settings> {
    if (!this.ready)
      this.ready = this.backend
        .read()
        .then((v) => {
          this.state = normalizeSettings(merge(this.decode(v), this.pending));
          this.loaded = true;
          this.pending = {};
        })
        .catch((e) => {
          this.ready = undefined;
          throw e;
        });
    await this.ready;
    return normalizeSettings(this.state);
  }
  async patch(patch: SettingsPatch): Promise<void> {
    await this.get();
    const previous = normalizeSettings(this.state);
    const next = normalizeSettings(merge(this.state, patch));
    if (JSON.stringify(next) !== JSON.stringify(this.state)) {
      this.state = next;
      this.emit();
    }
    const values = Object.fromEntries(
      Object.keys(patch)
        .filter((k) => k in DEFAULTS && k !== "edges")
        .map((k) => [PREFIX + k, next[k as keyof Settings]]),
    );
    for (const edge of EDGES)
      if (patch.edges && edge in patch.edges)
        values[PREFIX + "edges." + edge] = next.edges[edge];
    const write = this.writeQueue
      .catch(() => {})
      .then(() => this.backend.write(values));
    this.writeQueue = write;
    try {
      await write;
    } catch (error) {
      // Keep the preview responsive, but don't leave a failed save looking persisted.
      if (JSON.stringify(this.state) === JSON.stringify(next)) {
        this.state = previous;
        this.emit();
      }
      throw error;
    }
  }
  preview(patch: SettingsPatch) {
    if (!this.loaded) this.pending = merge(this.pending, patch);
    const next = normalizeSettings(merge(this.state, patch));
    if (JSON.stringify(next) === JSON.stringify(this.state)) return;
    this.state = next;
    this.emit();
  }
  async reset() {
    await this.patch(normalizeSettings(null));
  }
  subscribe(fn: (s: Settings) => void) {
    this.subscribers.add(fn);
    void this.get()
      .then(fn)
      .catch(() => {});
    return () => {
      this.subscribers.delete(fn);
    };
  }
  destroy() {
    this.off();
    this.subscribers.clear();
  }
}
