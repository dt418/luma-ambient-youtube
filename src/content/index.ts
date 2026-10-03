import pageCss from "./page-surfaces.css?raw";
import { ContentController } from "./controller";
import { SettingsStore } from "../shared/storage";
import { mountFloatingControl } from "../ui/floating-control";
import type { SettingsPatch } from "../shared/storage";
function boot() {
  const style = document.createElement("style");
  style.className = "luma-page-style";
  style.textContent = pageCss;
  document.head.append(style);
  const store = new SettingsStore();
  let floating: ReturnType<typeof mountFloatingControl> | undefined;
  const controller = new ContentController(store, (host) => {
    floating?.destroy();
    floating = undefined;
    if (host) floating = mountFloatingControl(host, store, controller.status);
  });
  const message = (
    msg: unknown,
    sender: chrome.runtime.MessageSender,
    respond: (data: unknown) => void,
  ) => {
    if (sender.id !== chrome.runtime.id) return;
    const type = (msg as { type?: string })?.type;
    if (type === "ambient:retry") controller.retry();
    if (type === "ambient:preview") {
      const patch = (msg as { patch?: SettingsPatch }).patch;
      if (patch) store.preview(patch);
      respond(Boolean(patch));
      return;
    }
    if (type === "ambient:status" || type === "ambient:retry")
      respond(controller.status.current);
  };
  chrome.runtime.onMessage.addListener(message);
  void controller.start().catch(() =>
    controller.status.publish({
      ...controller.status.current,
      state: "error",
      error: "storage",
    }),
  );
  const cleanup = () => {
    clearInterval(contextWatch);
    controller.destroy();
    floating?.destroy();
    store.destroy();
    style.remove();
    try {
      chrome.runtime.onMessage.removeListener(message);
    } catch {
      /* context invalidated */
    }
  };
  // A cheap health check also clears paused pages after extension reload.
  const contextWatch = setInterval(() => {
    try {
      if (!chrome.runtime.id) cleanup();
    } catch {
      cleanup();
    }
  }, 2000);
  return cleanup;
}
let dispose = boot();
window.addEventListener("pagehide", () => dispose());
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    dispose();
    dispose = boot();
  }
});
