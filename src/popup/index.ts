import { SettingsStore } from "../shared/storage";
import { StatusSource } from "../shared/messages";
import { mountPanel } from "../ui/panel";
import type { SettingsPatch } from "../shared/storage";
const store = new SettingsStore();
const status = new StatusSource(() => void refresh(true));
let activeTabId: Promise<number | undefined> | undefined;
const previewSettings = (patch: SettingsPatch) => {
  activeTabId ??= chrome.tabs
    .query({ active: true, currentWindow: true })
    .then(([tab]) => tab?.id);
  void activeTabId
    .then((id) =>
      id === undefined
        ? undefined
        : chrome.tabs.sendMessage(id, { type: "ambient:preview", patch }),
    )
    .catch(() => {});
};
const ui = mountPanel(
  document.getElementById("app")!,
  store,
  status,
  previewSettings,
);
async function refresh(retry = false) {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab?.id === undefined) return;
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: retry ? "ambient:retry" : "ambient:status",
    });
    if (response?.state) status.publish(response);
  } catch {
    status.publish({ ...status.current, state: "idle" });
  }
}
void refresh();
const interval = setInterval(() => void refresh(), 900);
window.addEventListener(
  "pagehide",
  () => {
    clearInterval(interval);
    ui.destroy();
    store.destroy();
  },
  { once: true },
);
