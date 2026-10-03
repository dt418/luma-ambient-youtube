import { mountPanel } from "./panel";
import css from "./glass.css?raw";
import { SettingsStore } from "../shared/storage";
import { StatusSource } from "../shared/messages";
import { applyGlassAppearance } from "./appearance";
export function mountFloatingControl(
  host: HTMLElement,
  store: SettingsStore,
  status: StatusSource,
) {
  const container = document.createElement("div");
  container.dataset.lumaRoot = "";
  container.className = "luma-control-host";
  Object.assign(container.style, {
    position: "relative",
    display: "none",
    flex: "0 0 96px",
    width: "96px",
    height: "48px",
    zIndex: "2",
  });
  (document.fullscreenElement ?? document.body).append(container);
  const shadow = container.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = css;
  shadow.append(style);
  const floating = document.createElement("div");
  floating.className = "luma-player-controls";
  floating.innerHTML =
    '<button class="luma-ytp-button" type="button" title="Bật hoặc tắt Luma" aria-label="Bật hoặc tắt ambient" aria-pressed="true"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" stroke-dasharray="2 2.8"/></svg></button><button class="luma-ytp-button" type="button" title="Cài đặt Luma" aria-label="Mở thiết lập Luma" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 17h16M9 4v6m6 4v6"/></svg></button>';
  shadow.append(floating);
  const buttons = floating.querySelectorAll("button"),
    toggle = buttons[0],
    open = buttons[1];
  let panel: ReturnType<typeof mountPanel> | undefined,
    popover: HTMLDivElement | undefined;
  let enabled = true;
  const abort = new AbortController(),
    signal = abort.signal;
  const position = () => {
    if (popover) {
      const b = open.getBoundingClientRect();
      const width = Math.max(1, Math.min(360, innerWidth - 20));
      popover.style.width = `${width}px`;
      const chromeTop =
        host
          .querySelector<HTMLElement>(".ytp-chrome-bottom")
          ?.getBoundingClientRect().top ?? innerHeight;
      const bottom = Math.min(innerHeight - 12, chromeTop - 10);
      if (bottom <= 12) {
        popover.style.visibility = "hidden";
        return;
      }
      popover.style.visibility = "";
      const maxHeight = bottom - 12;
      popover.style.maxHeight = `${maxHeight}px`;
      const height = Math.min(popover.scrollHeight || 440, maxHeight);
      const top = Math.max(12, Math.min(b.top - height - 10, bottom - height));
      popover.style.left = `${Math.max(10, Math.min(innerWidth - width - 10, b.right - width))}px`;
      popover.style.top = `${top}px`;
    }
  };
  const placeInToolbar = () => {
    const toolbar =
      host.querySelector<HTMLElement>(".ytp-right-controls-left") ??
      host.querySelector<HTMLElement>(".ytp-right-controls");
    if (!toolbar || container.parentElement === toolbar) return;
    const settings = toolbar.querySelector<HTMLElement>(".ytp-settings-button");
    toolbar.insertBefore(container, settings ?? null);
    position();
  };
  const close = () => {
    panel?.destroy();
    panel = undefined;
    popover?.remove();
    popover = undefined;
    floating.style.position = "";
    floating.style.zIndex = "";
    open.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener(
    "click",
    () =>
      void store.patch({ enabled: !enabled }).catch(() =>
        status.publish({
          ...status.current,
          state: "error",
          error: "storage",
        }),
      ),
    { signal },
  );
  open.addEventListener(
    "click",
    () => {
      if (panel) {
        close();
        return;
      }
      popover = document.createElement("div");
      popover.className = "luma-popover";
      popover.setAttribute("role", "dialog");
      popover.setAttribute("aria-label", "Thiết lập Luma");
      shadow.append(popover);
      panel = mountPanel(popover, store, status);
      floating.style.position = "relative";
      floating.style.zIndex = "2147483002";
      open.setAttribute("aria-expanded", "true");
      position();
      popover.querySelector<HTMLElement>("input,button")?.focus();
    },
    { signal },
  );
  shadow.addEventListener("toggle", position, { signal, capture: true });
  shadow.addEventListener(
    "keydown",
    (ev) => {
      const e = ev as KeyboardEvent;
      if (!popover) return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close();
        open.focus();
      }
      if (e.key === "Tab") {
        const items = Array.from(
          popover.querySelectorAll<HTMLElement>("button,input,select,summary"),
        ).filter(
          (el) => el.getClientRects().length && !el.hasAttribute("hidden"),
        );
        const first = items[0],
          last = items.at(-1);
        if (e.shiftKey && shadow.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && shadow.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    },
    { signal },
  );
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (popover && !e.composedPath().includes(container)) close();
    },
    { signal },
  );
  for (const ev of ["scroll", "resize"])
    window.addEventListener(ev, position, { signal, passive: true });
  const resize = new ResizeObserver(position);
  resize.observe(host);
  const toolbarObserver = new MutationObserver(placeInToolbar);
  toolbarObserver.observe(host, { childList: true, subtree: true });
  const off = store.subscribe((s) => {
    enabled = s.enabled;
    floating.style.setProperty("--luma-glass-blur", `${s.blur * 0.3}px`);
    floating.dataset.reducedMotion = String(s.reducedMotion === "on");
    toggle.setAttribute("aria-pressed", String(enabled));
    container.hidden = !s.floatingControl;
    container.style.display = s.floatingControl ? "flex" : "none";
    if (!s.floatingControl) close();
  });
  placeInToolbar();
  const offStatus = status.subscribe((s) =>
    applyGlassAppearance(floating, s.accent),
  );
  position();
  return {
    destroy() {
      close();
      off();
      offStatus();
      resize.disconnect();
      toolbarObserver.disconnect();
      abort.abort();
      container.remove();
    },
  };
}
